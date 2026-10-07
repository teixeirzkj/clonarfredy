import { HttpError } from './errors.js';
import { newId } from './secure.js';
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

function readSignup(b) {
  if (!validCnpj(b?.cnpj)) throw new HttpError(400, 'CNPJ inválido');
  const users = Array.isArray(b?.users) ? b.users : [];
  if (!users.length) throw new HttpError(400, 'Adicione pelo menos um usuário');
  if (users.length > 100) throw new HttpError(400, 'Máximo de 100 usuários no cadastro');
  if (b?.consent !== true) throw new HttpError(400, 'É preciso aceitar o uso dos dados para criar a conta');
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
  };
}

/** Recebe o cadastro (sem login). Limite por IP contra robôs. */
export async function createSignup(body, ip) {
  if (body?.website) return { ok: true }; // campo escondido: só robô preenche
  if ((await hit(`signup-ip:${ip}`, 60 * 60)) > 5) throw new HttpError(429, 'Muitos envios. Tente de novo mais tarde.');
  const data = readSignup(body);
  const signup = { id: newId(), status: 'novo', createdAt: new Date().toISOString(), ...data };
  await setJson(key(signup.id), signup);
  await listAdd(INDEX, signup.id);
  await notify(signup);
  return { ok: true, id: signup.id };
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
  return (await Promise.all(ids.map((id) => getJson(key(id))))).filter(Boolean);
}

export async function setSignupStatus(id, status) {
  const signup = await getJson(key(String(id)));
  if (!signup) throw new HttpError(404, 'Cadastro não encontrado');
  if (!['novo', 'em criação', 'concluído', 'arquivado'].includes(status)) throw new HttpError(400, 'Situação inválida');
  signup.status = status;
  await setJson(key(signup.id), signup);
  return signup;
}

export async function deleteSignup(id) {
  await del(key(String(id)));
  await listRemove(INDEX, String(id));
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
