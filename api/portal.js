import { changePassword, setGuideDone } from '../lib/clients.js';
import { readGuide } from '../lib/guide.js';
import { HttpError, route } from '../lib/http.js';

// Portal do cliente: dados da conta, passo a passo e troca de senha.
export default route(async ({ body, session }) => {
  switch (body.action) {
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
}, { roles: ['admin', 'client'] });
