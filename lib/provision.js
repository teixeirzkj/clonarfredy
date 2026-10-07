import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { customerClient, modelClient } from './accounts.js';
import { BLOCKS } from './blocks.js';
import { createClient, setGuideDone } from './clients.js';
import { readGuide } from './guide.js';
import { HttpError } from './errors.js';
import { createCompany, createCompanyToken, findCompanyByDocument, partnerConfigured } from './partner.js';
import { decrypt, encrypt } from './secure.js';

// Criação automática da conta a partir do cadastro (/cadastro):
//   travas → conta (Helena) → token → usuários → padrão (etiquetas/equipes) → acesso ao portal.
// Cada passo grava o andamento no próprio cadastro, para a equipe ver e tentar de novo.

export const autoCreateEnabled = () => partnerConfigured() && process.env.PORTAL_AUTO_CREATE !== 'off';

async function readPlan() {
  try {
    return JSON.parse(await readFile(join(process.cwd(), 'templates', 'plano-padrao.json'), 'utf8'));
  } catch {
    return { status: 'ONBOARDING', copiarPadrao: ['tags', 'departments'] };
  }
}

const withoutNulls = (obj) => Object.fromEntries(Object.entries(obj ?? {}).filter(([, v]) => v !== null && v !== undefined));

// Receita Federal: situação do CNPJ e tipo da empresa. Duas fontes públicas:
// BrasilAPI (bloqueia quem não se apresenta como navegador e demora a ter CNPJs
// novos) e, se ela não achar ou falhar, CNPJ.ws.
const BROWSER = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', Accept: 'application/json' };

function companyType(code, mei) {
  return mei ? 'MEI'
    : [2062, 2305, 2313, 2321, 2330].includes(code) ? 'LIMITED'
      : [2135, 2143].includes(code) ? 'INDIVIDUAL'
        : code >= 3000 && code < 4000 ? 'ASSOCIATION' : 'UNDEFINED';
}

// null = fonte indisponível; { found: false } = a fonte não conhece o CNPJ.
async function lookup(url, read) {
  try {
    const res = await fetch(url, { headers: BROWSER, signal: AbortSignal.timeout(12000) });
    if (res.status === 404) return { found: false };
    if (!res.ok) return null;
    const d = await res.json().catch(() => null);
    return d ? read(d) : null;
  } catch {
    return null;
  }
}

async function cnpjInfo(cnpj) {
  const brasil = await lookup(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, (d) => ({
    found: true,
    active: String(d.descricao_situacao_cadastral ?? '').toUpperCase() === 'ATIVA',
    situation: d.descricao_situacao_cadastral,
    type: companyType(Number(d.codigo_natureza_juridica), d.opcao_pelo_mei === true),
  }));
  if (brasil?.found) return brasil;
  const ws = await lookup(`https://publica.cnpj.ws/cnpj/${cnpj}`, (d) => ({
    found: true,
    active: String(d.estabelecimento?.situacao_cadastral ?? '').toUpperCase() === 'ATIVA',
    situation: d.estabelecimento?.situacao_cadastral,
    type: companyType(Number(d.natureza_juridica?.id), String(d.simples?.mei ?? '').toLowerCase() === 'sim'),
  }));
  if (ws?.found) return ws;
  // As duas responderam e nenhuma conhece: não encontrado. Alguma fora do ar: equipe confere.
  return brasil && ws ? { found: false } : null;
}

function companyBody(signup, plan, type) {
  const a = signup.address;
  return withoutNulls({
    documentType: 'CNPJ',
    documentId: signup.company.cnpj,
    legalName: signup.company.legalName,
    name: signup.company.tradeName || signup.company.legalName,
    owner: { name: signup.owner.name, email: signup.owner.email, phoneNumber: signup.owner.phone },
    category: plan.category ?? null,
    customCategory: signup.company.segment || null,
    type: type || 'UNDEFINED',
    status: plan.status || 'ONBOARDING',
    apps: Array.isArray(plan.apps) ? plan.apps : null,
    resourcers: Array.isArray(plan.resourcers) ? plan.resourcers : null,
    config: Object.keys(withoutNulls(plan.config)).length ? withoutNulls(plan.config) : null,
    address: {
      country: 'Brasil', state: a.uf, city: a.city, neighborhood: a.district, zipcode: a.cep,
      number: a.number, address1: a.street, address2: a.complement || null,
    },
  });
}

/**
 * Executa (ou continua) a criação. Idempotente: passos já feitos são pulados.
 * Devolve o cadastro atualizado (com signup.provision).
 */
export async function provision(signup, { force = false } = {}) {
  const p = signup.provision ?? { steps: {} };
  signup.provision = p;
  p.updatedAt = new Date().toISOString();
  const step = (name, status, detail = '') => { p.steps[name] = { status, detail, at: new Date().toISOString() }; };
  p.error = null;
  p.debug = null;

  try {
    if (!partnerConfigured()) throw new HttpError(503, 'Token de Parceiro não configurado (HELENA_PARTNER_TOKEN)');

    // 1. Travas: CNPJ ativo na Receita e sem conta repetida.
    if (!p.companyId) {
      const info = await cnpjInfo(signup.company.cnpj);
      if (!info) {
        if (!force) throw new HttpError(503, 'Não consegui consultar o CNPJ na Receita agora: a equipe vai conferir');
        step('cnpj', 'pulado', 'Consulta à Receita indisponível; criação liberada pela equipe');
      } else if (!info.found) {
        if (!force) throw new HttpError(400, 'CNPJ não encontrado na Receita');
        step('cnpj', 'pulado', 'CNPJ não encontrado na Receita; criação liberada pela equipe');
      } else if (!info.active && !force) {
        throw new HttpError(400, `CNPJ com situação "${info.situation}" na Receita`);
      } else {
        step('cnpj', 'ok', `Situação: ${info.situation}`);
        p.type = info.type;
      }
      const existing = await findCompanyByDocument(signup.company.cnpj);
      if (existing) {
        p.existingCompanyId = existing.id;
        throw new HttpError(409, `Já existe conta com este CNPJ (${existing.name || existing.legalName || existing.id})`);
      }

      // 2. Conta da empresa.
      const plan = await readPlan();
      p.plan = { status: plan.status || 'ONBOARDING' };
      const full = companyBody(signup, plan, p.type);
      const minimal = {
        documentType: full.documentType, documentId: full.documentId, legalName: full.legalName, name: full.name, owner: full.owner,
      };
      const { company, minimal: usedMinimal } = await createCompany(full, minimal);
      p.companyId = company.id;
      step('conta', usedMinimal ? 'parcial' : 'ok', usedMinimal
        ? `Conta criada (${company.name || company.legalName}) só com os dados essenciais: a API recusou o corpo completo (endereço, tipo, status, plano). Complete pelo painel de parceiro.`
        : `Conta criada (${company.name || company.legalName})`);
    }

    // 3. Token de API da conta nova (guardado criptografado).
    if (!p.tokenBox) {
      const token = await createCompanyToken(p.companyId, 'Portal Frédy');
      p.tokenBox = encrypt(token);
      step('token', 'ok', 'Token de API gerado');
    }
    const token = decrypt(p.tokenBox);
    const client = customerClient(token);

    // 4. Usuários informados no cadastro (quem já existe é pulado).
    if (p.steps.usuarios?.status !== 'ok') {
      const existing = (await client.get('/core/v1/agent').catch(() => [])) ?? [];
      const emails = new Set(existing.map((a) => String(a.email ?? '').toLowerCase()));
      const failed = [];
      let created = 0;
      for (const u of signup.users) {
        if (emails.has(u.email)) continue;
        try {
          await client.post('/core/v1/agent', { name: u.name, email: u.email, profile: u.profile, ...(u.phone && { phoneNumber: u.phone }) });
          created += 1;
        } catch (err) {
          failed.push(`${u.email}: ${err.message}`);
        }
      }
      step('usuarios', failed.length ? 'parcial' : 'ok', failed.length ? `${created} criado(s); falharam: ${failed.join('; ')}` : `${created} usuário(s) criado(s)`);
    }

    // 5. Padrão da conta modelo (etiquetas e equipes). Não trava o resto se falhar.
    const plan = await readPlan();
    for (const blockId of (Array.isArray(plan.copiarPadrao) ? plan.copiarPadrao : []).filter((b) => ['tags', 'departments'].includes(b))) {
      if (p.steps[`padrao-${blockId}`]?.status === 'ok') continue;
      try {
        const block = BLOCKS[blockId];
        const items = await block.plan({ model: modelClient(), client });
        let created = 0;
        for (const item of items.filter((i) => !i.exists)) {
          await block.create(client, item);
          created += 1;
        }
        step(`padrao-${blockId}`, 'ok', `${created} copiado(s) da conta modelo`);
      } catch (err) {
        step(`padrao-${blockId}`, 'erro', err.message);
      }
    }

    // 6. Acesso ao portal (login = e-mail do responsável, senha escolhida no cadastro).
    if (!p.clientId) {
      const company = signup.company.tradeName || signup.company.legalName;
      try {
        const result = await createClient({ company, email: signup.owner.email, wtsToken: token, passwordHash: signup.passwordHash, signupId: signup.id });
        p.clientId = result.client.id;
        step('portal', 'ok', `Acesso ao portal: ${signup.owner.email}`);
        // O que já foi feito aqui aparece concluído no passo a passo do cliente.
        const auto = (await readGuide()).filter((s) => s.autoDone).map((s) => s.id);
        if (auto.length) await setGuideDone(p.clientId, auto).catch(() => {});
      } catch (err) {
        if (err.status !== 409) throw err;
        p.clientId = 'existente';
        step('portal', 'parcial', 'Já existia acesso ao portal com este e-mail: confira em Clientes com acesso');
      }
    }

    p.status = 'criada';
    signup.status = 'concluído';
  } catch (err) {
    p.status = 'aguardando equipe';
    p.error = err.message;
    p.debug = err.call ? { call: err.call, status: err.partnerStatus, response: err.response, sent: err.sent, firstAttempt: err.firstAttempt ?? null, at: new Date().toISOString() } : null;
    signup.status = 'em criação';
  }
  return signup;
}

