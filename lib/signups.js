import { HttpError } from './errors.js';
import { hashPassword, newId } from './secure.js';
import { del, getJson, hit, listAdd, listGet, listRemove, setJson } from './store.js';

// Cadastro de cliente novo (página /cadastro, aberta). A conta no WTS não é
// criada pela API pública: o cadastro vai para a equipe criar a conta e o acesso.

const INDEX = 'signups';
const key = (id) => `signup:${id}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const PROFILES = ['Admin', 'Agent'];

const text = (v, max = 150) => String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
const digits = (v) => String(v ?? '').replace(/\D/g, '');

export function validCnpj(value) {
  const c = digits(value);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = (len) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((s, w, i) => s + Number(c[i]) * w, 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === Number(c[12]) && calc(13) === Number(c[13]);
}

function need(value, label) {
  if (!value) throw new HttpError(400, `Preencha: ${label}`);
  return value;
}
function phone(value, label, required = true) {
  const p = digits(value);
  if (!p && !required) return '';
  if (p.length < 10 || p.length > 13) throw new HttpError(400, `${label}: telefone com DDD inválido`);
  return p;
}
function email(value, label) {
  const e = text(value, 200).toLowerCase();
  if (!EMAIL_RE.test(e)) throw new HttpError(400, `${label}: e-mail inválido`);
  return e;
}

function readSignup(b, maxUsers = null) {
  if (!validCnpj(b?.cnpj)) throw new HttpError(400, 'CNPJ inválido');
  const users = Array.isArray(b?.users) ? b.users : [];
  if (!users.length) throw new HttpError(400, 'Adicione pelo menos um usuário');
  if (users.length > 100) throw new HttpError(400, 'Máximo de 100 usuários no cadastro');
  if (maxUsers && users.length > maxUsers) throw new HttpError(400, `Seu plano inclui ${maxUsers} usuário(s). Para mais usuários, fale com a equipe Frédy.`);
  if (b?.consent !== true) throw new HttpError(400, 'É preciso aceitar o uso dos dados para criar a conta');
  const password = String(b?.password ?? '');
  if (password.length < 8 || password.length > 200) throw new HttpError(400, 'Crie uma senha do portal com pelo menos 8 caracteres');
  const uf = text(b?.address?.uf, 2).toUpperCase();
  if (!UFS.includes(uf)) throw new HttpError(400, 'Estado (UF) inválido');
  const cep = digits(b?.address?.cep);
  if (cep.length !== 8) throw new HttpError(400, 'CEP inválido');
  return {
    company: {
      cnpj: digits(b.cnpj),
      legalName: need(text(b.legalName), 'Razão social'),
      tradeName: text(b.tradeName),
      segment: text(b.segment, 100),
      cnae: text(b.cnae, 200),
      phone: phone(b.companyPhone, 'Telefone da empresa', false),
      site: text(b.site, 200),
    },
    address: {
      cep,
      street: need(text(b.address.street), 'Rua'),
      number: need(text(b.address.number, 20), 'Número'),
      complement: text(b.address.complement, 100),
      district: need(text(b.address.district, 100), 'Bairro'),
      city: need(text(b.address.city, 100), 'Cidade'),
      uf,
    },
    owner: {
      name: need(text(b.owner?.name, 100), 'Nome do responsável'),
      email: email(b.owner?.email, 'Responsável'),
      phone: phone(b.owner?.phone, 'Responsável'),
    },
    users: users.map((u, i) => ({
      name: need(text(u?.name, 100), `Nome do usuário ${i + 1}`),
      nickname: text(u?.nickname, 60),
      email: email(u?.email, `Usuário ${i + 1}`),
      phone: phone(u?.phone, `Usuário ${i + 1}`, false),
      profile: PROFILES.includes(u?.profile) ? u.profile : 'Agent',
    })),
    notes: text(b.notes, 2000),
    passwordHash: hashPassword(password),
  };
}

// O que sai do servidor (tela Clientes e aviso): sem senha nem token.
export function publicSignup(s) {
  const { passwordHash, provision, ...rest } = s;
  if (!provision) return rest;
  const { tokenBox, ...prov } = provision;
  return { ...rest, provision: prov };
}

/** Recebe o cadastro (sem login). Limite por IP contra robôs. */
// Pré-cadastro: a página de pagamento (Eric) manda os dados do pedido e recebe um link
// (/cadastro?pre=ID). O cliente abre o link com tudo preenchido; o plano e o limite de
// usuários vêm do pedido. Vale por 7 dias e só uma vez.
const PRE_TTL_MS = 7 * 24 * 3600 * 1000;
const preKey = (id) => `pre:${id}`;
const preOrderKey = (orderId) => `pre-order:${orderId}`;
const PRE_ID_RE = /^[\w-]{6,40}$/;

export async function createPreSignup(input) {
  const { getPlan } = await import('./plans.js');
  const wanted = String(input?.plan ?? input?.plano ?? '');
  const plan = await getPlan(wanted);
  if (!plan || (wanted && plan.id !== wanted)) throw new HttpError(400, 'Plano inválido');
  // Um pagamento vira um pré-cadastro só: se a página de pagamento chamar de novo
  // (cliente recarregou a página), devolve o mesmo link enquanto ele valer.
  const orderId = text(input?.order?.id ?? input?.orderId ?? input?.pedido, 100);
  if (orderId) {
    const prevId = await getJson(preOrderKey(orderId));
    const prev = prevId ? await getJson(preKey(prevId)) : null;
    if (prev?.usedAt) throw new HttpError(409, 'Esse pagamento já virou cadastro. Entre no portal com o e-mail e a senha que você criou.');
    if (prev && Date.parse(prev.expiresAt) > Date.now()) return prev;
  }
  const users = (Array.isArray(input?.users) ? input.users : []).slice(0, 100).map((u) => ({
    name: text(u?.name ?? u?.nome, 100), nickname: text(u?.nickname ?? u?.apelido, 60), email: text(u?.email, 200).toLowerCase(),
    phone: digits(u?.phone ?? u?.telefone), profile: PROFILES.includes(u?.profile) ? u.profile : 'Agent',
  }));
  const a = input?.address ?? input?.endereco ?? {};
  const c = input?.company ?? input?.empresa ?? {};
  const o = input?.owner ?? input?.responsavel ?? {};
  const pre = {
    id: newId(), createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + PRE_TTL_MS).toISOString(),
    plan: plan.id, planName: plan.nome, maxUsers: null,
    company: { cnpj: digits(c.cnpj ?? input?.cnpj), legalName: text(c.legalName ?? c.razaoSocial), tradeName: text(c.tradeName ?? c.nomeFantasia), segment: text(c.segment ?? c.segmento, 100), phone: digits(c.phone ?? c.telefone), site: text(c.site, 200) },
    address: { cep: digits(a.cep), street: text(a.street ?? a.rua), number: text(a.number ?? a.numero, 20), complement: text(a.complement ?? a.complemento, 100), district: text(a.district ?? a.bairro, 100), city: text(a.city ?? a.cidade, 100), uf: text(a.uf, 2).toUpperCase() },
    owner: { name: text(o.name ?? o.nome, 100), email: text(o.email, 200).toLowerCase(), phone: digits(o.phone ?? o.telefone) },
    users, usersCount: Number(input?.usersCount ?? input?.usuarios) || users.length || null,
    order: { id: text(input?.order?.id ?? input?.orderId ?? input?.pedido, 100), product: text(input?.order?.product ?? input?.produto, 150), amount: Number(input?.order?.amount ?? input?.valor) || null },
  };
  // Limite de usuários: o do plano, ou mais se o pedido pagou por mais usuários.
  const planUsers = Number(plan.config?.agents) || null;
  pre.maxUsers = planUsers ? Math.max(planUsers, pre.usersCount || 0) : null;
  await setJson(preKey(pre.id), pre);
  if (orderId) await setJson(preOrderKey(orderId), pre.id);
  return pre;
}

/** Dados do pré-cadastro para a página (tudo aqui é do próprio cliente; nada secreto). */
export async function getPreSignup(id) {
  if (!PRE_ID_RE.test(String(id ?? ''))) throw new HttpError(404, 'Link de cadastro inválido');
  const pre = await getJson(preKey(String(id)));
  if (!pre || pre.usedAt || Date.parse(pre.expiresAt) < Date.now()) throw new HttpError(404, 'Este link de cadastro não vale mais. Fale com a equipe Frédy.');
  return pre;
}

/** Recebe o cadastro (sem login). Limite por IP contra robôs. */
export async function createSignup(body, ip) {
  if (body?.website) return { ok: true }; // campo escondido: só robô preenche
  if ((await hit(`signup-ip:${ip}`, 60 * 60)) > 5) throw new HttpError(429, 'Muitos envios. Tente de novo mais tarde.');
  const { getPlan } = await import('./plans.js');
  // Com pré-cadastro, o plano é o do pedido pago; senão, o do link (/cadastro?plano=...).
  const pre = body?.pre ? await getPreSignup(body.pre) : null;
  const plan = await getPlan(String(pre?.plan ?? body?.plan ?? ''));
  if (!pre && plan?.soPreCadastro) throw new HttpError(400, 'Esse plano é contratado pela página de pagamento. Fale com a equipe Frédy.');
  const data = readSignup(body, pre ? pre.maxUsers : Number(plan?.config?.agents) || null);
  let signup = { id: newId(), status: 'novo', createdAt: new Date().toISOString(), plan: plan?.id ?? null, preId: pre?.id ?? null, order: pre?.order ?? null, ...data };
  await setJson(key(signup.id), signup);
  await listAdd(INDEX, signup.id);
  if (pre) { pre.usedAt = signup.createdAt; pre.signupId = signup.id; await setJson(preKey(pre.id), pre); }
  // Criação automática da conta (Token de Parceiro + travas); senão fica para a equipe.
  const { autoCreateEnabled, provision } = await import('./provision.js');
  if (autoCreateEnabled()) {
    signup = await provision(signup);
    await setJson(key(signup.id), signup);
  }
  await notify(publicSignup(signup));
  const created = signup.provision?.status === 'criada';
  // Motivo para o cliente só quando é algo dele (CNPJ); erros internos ficam para a equipe.
  const error = signup.provision?.error ?? '';
  const reason = /Receita|situação/.test(error) && !/consultar/.test(error) ? error
    : /Já existe conta/.test(error) ? 'Já existe uma conta com este CNPJ. Fale com a equipe Frédy.' : null;
  // clientId: acesso ao portal criado agora (a página entra direto no portal).
  const clientId = created && /^[\w-]{6,40}$/.test(String(signup.provision?.clientId ?? '')) ? signup.provision.clientId : null;
  return { ok: true, id: signup.id, created, reason, email: signup.owner.email, company: signup.company.tradeName || signup.company.legalName, clientId, appUrl: process.env.FREDY_APP_URL || 'https://fredy.wts.chat/' };
}

// Aviso para a equipe (opcional): POST no SIGNUP_WEBHOOK_URL (ex.: fluxo do n8n que manda WhatsApp).
async function notify(signup) {
  const url = process.env.SIGNUP_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento: 'novo_cadastro', ...signup }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* o cadastro já está salvo; o aviso é só conveniência */ }
}

export async function listSignups() {
  const ids = await listGet(INDEX);
  return (await Promise.all(ids.map((id) => getJson(key(id))))).filter(Boolean).map(publicSignup);
}

/** Senha (protegida) que o cliente escolheu no cadastro, para o acesso criado pela equipe. */
export async function signupPasswordHash(id) {
  return (await getJson(key(String(id))))?.passwordHash ?? null;
}

/** Tela Clientes: tenta criar de novo (a equipe libera mesmo se a Receita estiver fora do ar). */
export async function retryProvision(id, { force = true } = {}) {
  const signup = await getJson(key(String(id)));
  if (!signup) throw new HttpError(404, 'Cadastro não encontrado');
  const { provision } = await import('./provision.js');
  const updated = await provision(signup, { force });
  await setJson(key(updated.id), updated);
  return publicSignup(updated);
}

/** Tela Clientes: troca o plano antes de criar a conta. */
export async function setSignupPlan(id, planId) {
  const signup = await getJson(key(String(id)));
  if (!signup) throw new HttpError(404, 'Cadastro não encontrado');
  if (signup.provision?.companyId) throw new HttpError(409, 'A conta já foi criada: troque o plano pelo painel de parceiro');
  const { getPlan } = await import('./plans.js');
  const plan = await getPlan(String(planId ?? ''));
  if (!plan || plan.id !== planId) throw new HttpError(400, 'Plano inválido');
  signup.plan = plan.id;
  await setJson(key(signup.id), signup);
  return publicSignup(signup);
}

export async function setSignupStatus(id, status) {
  const signup = await getJson(key(String(id)));
  if (!signup) throw new HttpError(404, 'Cadastro não encontrado');
  if (!['novo', 'em criação', 'concluído', 'arquivado'].includes(status)) throw new HttpError(400, 'Situação inválida');
  signup.status = status;
  await setJson(key(signup.id), signup);
  return publicSignup(signup);
}

export async function deleteSignup(id) {
  await del(key(String(id)));
  await listRemove(INDEX, String(id));
}

/** Dados do CNPJ na Receita, para preencher o cadastro sozinho. Limite por IP. */
export async function lookupCnpj(value, ip) {
  if (!validCnpj(value)) throw new HttpError(400, 'CNPJ inválido');
  if ((await hit(`cnpj-ip:${ip}`, 60 * 60)) > 30) throw new HttpError(429, 'Muitas consultas. Preencha à mão.');
  const { cnpjInfo } = await import('./cnpj.js');
  const info = await cnpjInfo(value);
  if (!info) throw new HttpError(503, 'Não consegui consultar a Receita agora: preencha à mão');
  if (!info.found) throw new HttpError(404, 'CNPJ não encontrado na Receita: confira o número');
  const { type, ...rest } = info;
  return rest;
}

/** Endereço pelo CEP (ViaCEP), para preencher o cadastro. */
export async function lookupCep(value) {
  const cep = digits(value);
  if (cep.length !== 8) throw new HttpError(400, 'CEP inválido');
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    if (data.erro) throw new Error();
    return { street: data.logradouro ?? '', district: data.bairro ?? '', city: data.localidade ?? '', uf: data.uf ?? '' };
  } catch {
    throw new HttpError(404, 'CEP não encontrado: preencha o endereço à mão');
  }
}
