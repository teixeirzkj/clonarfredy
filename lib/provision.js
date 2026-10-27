import { customerClient, modelClient } from './accounts.js';
import { BLOCKS } from './blocks.js';
import { cnpjInfo } from './cnpj.js';
import { createClient, setGuideDone } from './clients.js';
import { readGuide } from './guide.js';
import { HttpError } from './errors.js';
import { createCompany, createCompanyToken, findCompanyByDocument, partnerConfigured } from './partner.js';
import { getPlan, readPlans } from './plans.js';
import { decrypt, encrypt } from './secure.js';

// Criação automática da conta a partir do cadastro (/cadastro):
//   travas → conta (Helena) → token → usuários → padrão (etiquetas/equipes) → acesso ao portal.
// Cada passo grava o andamento no próprio cadastro, para a equipe ver e tentar de novo.

export const autoCreateEnabled = () => partnerConfigured() && process.env.PORTAL_AUTO_CREATE !== 'off';

// Telefone no formato internacional do Brasil (55 + DDD + número).
const intlPhone = (v) => { const d = String(v ?? '').replace(/\D/g, ''); return !d ? null : d.length <= 11 ? `55${d}` : d; };

const withoutNulls = (obj) => Object.fromEntries(Object.entries(obj ?? {}).filter(([, v]) => v !== null && v !== undefined));

function companyBody(signup, plan, type) {
  const a = signup.address;
  // Usuários: o do plano, ou mais se o cliente cadastrou mais gente.
  const config = withoutNulls({ ...plan.config, ...(plan.config?.agents != null && { agents: Math.max(plan.config.agents, signup.users.length) }) });
  return withoutNulls({
    documentType: 'CNPJ',
    documentId: signup.company.cnpj,
    legalName: signup.company.legalName,
    name: signup.company.tradeName || signup.company.legalName,
    owner: withoutNulls({ name: signup.owner.name, email: signup.owner.email, phoneNumber: intlPhone(signup.owner.phone) }),
    category: plan.category ?? null,
    customCategory: signup.company.segment || null,
    type: type || 'UNDEFINED',
    status: plan.status || 'ONBOARDING',
    apps: Array.isArray(plan.apps) ? plan.apps : null,
    resourcers: Array.isArray(plan.resourcers) ? plan.resourcers : null,
    config: Object.keys(config).length ? config : null,
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
      if (existing && !force) {
        p.existingCompanyId = existing.id;
        throw new HttpError(409, `Já existe conta com este CNPJ (${existing.name || existing.legalName || existing.id})`);
      }
      if (existing) {
        // A equipe mandou seguir: usa a conta que já existe (ex.: criada à mão).
        p.companyId = existing.id;
        step('conta', 'parcial', `Usada a conta que já existia com este CNPJ (${existing.name || existing.legalName || existing.id}): o plano dela não foi alterado`);
      }
    }

    if (!p.companyId) {
      // 2. Conta da empresa, com o plano do cadastro (a Helena exige apps e limites).
      const plan = await getPlan(signup.plan);
      if (!plan) throw new HttpError(503, 'Nenhum plano em templates/planos.json');
      if (!plan.apps?.length || !Object.keys(withoutNulls(plan.config)).length) throw new HttpError(503, `Plano "${plan.nome}" sem apps ou limites: a Helena exige os dois`);
      p.plan = { id: plan.id, nome: plan.nome, status: plan.status || 'ONBOARDING' };
      const { company, halfCreated } = await createCompany([{ label: plan.nome, body: companyBody(signup, plan, p.type) }]);
      p.companyId = company.id;
      const name = company.name || company.legalName || company.id;
      step('conta', halfCreated ? 'parcial' : 'ok', halfCreated
        ? `Conta encontrada (${name}) depois de erro da API: confira no painel de parceiro se ficou completa`
        : `Conta criada (${name}), plano ${plan.nome}`);
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
    const { copiarPadrao } = await readPlans();
    for (const blockId of copiarPadrao.filter((b) => ['tags', 'departments'].includes(b))) {
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
        const result = await createClient({ company, email: signup.owner.email, wtsToken: token, passwordHash: signup.passwordHash, signupId: signup.id, companyId: p.companyId });
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
    p.debug = err.call ? { call: err.call, status: err.partnerStatus, response: err.response, sent: err.sent, attempts: err.attempts ?? null, at: new Date().toISOString() } : null;
    signup.status = 'em criação';
  }
  return signup;
}

