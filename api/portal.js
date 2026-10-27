import crypto from 'node:crypto';
import { customerClient } from '../lib/accounts.js';
import { issueSession } from '../lib/auth.js';
import { listChatbots } from '../lib/chatbots.js';
import { authenticate, changePassword, createClient, deleteClient, listClients, setGuideDone, updateClient } from '../lib/clients.js';
import { readGuide } from '../lib/guide.js';
import { authorize, clientIp, HttpError, route } from '../lib/http.js';
import { n8nConfigured } from '../lib/n8n.js';
import { planNames } from '../lib/plans.js';
import { createCompanyToken, listCompanies, partnerConfigured } from '../lib/partner.js';
import { createPreSignup, createSignup, deleteSignup, getPreSignup, listSignups, lookupCep, lookupCnpj, retryProvision, setSignupPlan, setSignupStatus, signupPasswordHash } from '../lib/signups.js';
import { autoCreateEnabled } from '../lib/provision.js';
import { hit } from '../lib/store.js';

const APP_URL = () => process.env.FREDY_APP_URL || 'https://fredy.wts.chat/';
// Endereço público desta página (links mandados para fora).
const baseUrl = (req) => (process.env.PUBLIC_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers['x-forwarded-host'] || req.headers.host}`).replace(/\/+$/, '');
const sameSecret = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
import { resolveModelSlug } from '../lib/slug.js';
import { storeConfigured } from '../lib/store.js';

// Uma função só para o portal, o cadastro, a tela Clientes, os chatbots padrão e a
// configuração da tela (o plano Hobby da Vercel aceita no máximo 12 funções).
// Cada ação diz quem pode usar:
//   aberta: login do portal, CEP, CNPJ (Receita), planos (nomes) e envio do cadastro
//   equipe ou cliente: config, chatbots, me, guide, guideDone, changePassword
//   só equipe: clients (op: list, provision, create, update, delete, signupStatus, signupPlan, signupDelete)
const BOTH = ['admin', 'client'];

async function clientsOp(body) {
  switch (body.op) {
    case 'list':
      if (!storeConfigured()) return { configured: false, clients: [], signups: [] };
      return { configured: true, autoCreate: autoCreateEnabled(), partner: partnerConfigured(), plans: await planNames(), clients: await listClients(), signups: await listSignups() };
    case 'provision':
      return { signup: await retryProvision(body.id, { force: body.force !== false }) };
    case 'create': {
      // Do cadastro: o cliente entra com a senha que ele escolheu.
      const passwordHash = body.signupId ? await signupPasswordHash(body.signupId) : null;
      const result = await createClient({ company: body.company, email: body.email, wtsToken: body.wtsToken, passwordHash, signupId: body.signupId });
      if (body.signupId) await setSignupStatus(body.signupId, 'concluído').catch(() => {});
      return result;
    }
    case 'update':
      return updateClient(body.id, body.changes ?? {});
    case 'delete':
      await deleteClient(body.id);
      return { ok: true };
    case 'signupStatus':
      return { signup: await setSignupStatus(body.id, body.status) };
    case 'helenaCompanies': {
      // Contas do parceiro na Helena e quais já têm acesso ao portal.
      const [companies, clients] = await Promise.all([listCompanies(), listClients()]);
      const byCompany = new Map(clients.filter((c) => c.companyId).map((c) => [c.companyId, c]));
      return { companies: companies.map((c) => ({
        id: c.id, name: c.name || c.legalName || c.id, legalName: c.legalName ?? '', documentId: c.documentId ?? '', status: c.status ?? '', createdAt: c.createdAt ?? null,
        access: byCompany.has(c.id) ? { id: byCompany.get(c.id).id, email: byCompany.get(c.id).email } : null,
      })) };
    }
    case 'helenaAccess': {
      // Acesso ao portal para uma conta existente: token gerado pela API de parceiro, login = e-mail do dono.
      const companyId = String(body.companyId ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(companyId)) throw new HttpError(400, 'Conta inválida');
      const existing = (await listClients()).find((c) => c.companyId === companyId);
      if (existing) throw new HttpError(409, `Esta conta já tem acesso (${existing.email})`);
      const token = await createCompanyToken(companyId, 'Portal Frédy');
      const agents = (await customerClient(token).get('/core/v1/agent').catch(() => null)) ?? [];
      const owner = agents.find((a) => a.isOwner) ?? agents.find((a) => a.profile === 'Admin') ?? agents[0] ?? null;
      const email = String(body.email ?? '').trim() || owner?.email;
      if (!email) throw new HttpError(400, 'Não achei o e-mail do dono da conta. Informe o e-mail de login.');
      const result = await createClient({ company: body.company, email, wtsToken: token, companyId });
      return { ...result, owner: owner ? { name: owner.name ?? '', email: owner.email ?? '', phone: owner.phoneNumber ?? '' } : null };
    }
    case 'signupPlan':
      return { signup: await setSignupPlan(body.id, body.plan) };
    case 'signupDelete':
      await deleteSignup(body.id);
      return { ok: true };
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
}

export default route(async ({ req, body }) => {
  // Ações abertas (sem login).
  switch (body.action) {
    case 'login': {
      const client = await authenticate(body.email, body.password, clientIp(req));
      return { ...issueSession({ role: 'client', clientId: client.id }), company: client.company };
    }
    case 'cep':
      return lookupCep(body.cep);
    case 'cnpj':
      return lookupCnpj(body.cnpj, clientIp(req));
    case 'plans':
      return planNames();
    case 'signup': {
      const r = await createSignup(body.data, clientIp(req));
      // Conta criada com acesso ao portal: a página entra direto no portal.
      return r.clientId ? { ...r, session: { ...issueSession({ role: 'client', clientId: r.clientId }), company: r.company } } : r;
    }
    case 'preSignup': {
      // Página de pagamento: manda os dados do pedido e recebe o link do cadastro já preenchido.
      const secret = process.env.PRE_SIGNUP_SECRET || '';
      const given = String(body.secret ?? req.headers['x-integracao'] ?? '');
      if (!secret || !sameSecret(given, secret)) throw new HttpError(401, 'Chave de integração inválida');
      const pre = await createPreSignup(body.data ?? body);
      return { ok: true, id: pre.id, url: `${baseUrl(req)}/cadastro?pre=${pre.id}`, expiresAt: pre.expiresAt, plan: pre.plan, maxUsers: pre.maxUsers };
    }
    case 'preSignupGet':
      if ((await hit(`pre-ip:${clientIp(req)}`, 60 * 60)) > 60) throw new HttpError(429, 'Muitas consultas. Tente de novo mais tarde.');
      return getPreSignup(body.id);
    default:
      break;
  }

  if (body.action === 'clients') {
    await authorize(req, body, ['admin']);
    return clientsOp(body);
  }

  const session = await authorize(req, body, BOTH);
  switch (body.action) {
    case 'config':
      return { modelSlug: resolveModelSlug(''), n8nConfigured: n8nConfigured(), appUrl: APP_URL() };
    case 'chatbots':
      return { chatbots: await listChatbots() };
    case 'me':
      return { role: session.role, company: session.client?.company ?? 'Equipe Frédy', email: session.client?.email ?? null };
    case 'guide':
      return { steps: await readGuide(), done: session.client?.guideDone ?? [] };
    case 'guideDone':
      if (session.role !== 'client') return { done: [] };
      return { done: await setGuideDone(session.clientId, body.done) };
    case 'changePassword':
      if (session.role !== 'client') throw new HttpError(400, 'Só para o login do cliente');
      await changePassword(session.clientId, body.current, body.next);
      return { ok: true };
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
}, { auth: false });
