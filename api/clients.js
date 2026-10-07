import { createClient, deleteClient, listClients, updateClient } from '../lib/clients.js';
import { HttpError, route } from '../lib/http.js';
import { deleteSignup, listSignups, setSignupStatus } from '../lib/signups.js';
import { storeConfigured } from '../lib/store.js';

// Tela "Clientes" da equipe: cadastros recebidos e acessos ao portal.
export default route(async ({ body }) => {
  switch (body.action) {
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
});
