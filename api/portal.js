import { issueSession } from '../lib/auth.js';
import { listChatbots } from '../lib/chatbots.js';
import { authenticate, changePassword, createClient, deleteClient, listClients, setGuideDone, updateClient } from '../lib/clients.js';
import { readGuide } from '../lib/guide.js';
import { authorize, clientIp, HttpError, route } from '../lib/http.js';
import { n8nConfigured } from '../lib/n8n.js';
import { createSignup, deleteSignup, listSignups, lookupCep, setSignupStatus } from '../lib/signups.js';
import { resolveModelSlug } from '../lib/slug.js';
import { storeConfigured } from '../lib/store.js';

// Uma função só para o portal, o cadastro, a tela Clientes, os chatbots padrão e a
// configuração da tela (o plano Hobby da Vercel aceita no máximo 12 funções).
// Cada ação diz quem pode usar:
//   aberta: login do portal, CEP e envio do cadastro
//   equipe ou cliente: config, chatbots, me, guide, guideDone, changePassword
//   só equipe: clients (op: list, create, update, delete, signupStatus, signupDelete)
const BOTH = ['admin', 'client'];

async function clientsOp(body) {
  switch (body.op) {
    case 'list':
      if (!storeConfigured()) return { configured: false, clients: [], signups: [] };
      return { configured: true, clients: await listClients(), signups: await listSignups() };
    case 'create': {
      const result = await createClient(body);
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
    case 'signup':
      return createSignup(body.data, clientIp(req));
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
      return { modelSlug: resolveModelSlug(''), n8nConfigured: n8nConfigured() };
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
