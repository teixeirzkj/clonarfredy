import { customerClient } from '../lib/accounts.js';
import { HttpError, route } from '../lib/http.js';
import { listPanels, runLookup } from '../lib/lookups.js';

// Consultas somente leitura na conta do token informado.
export default route(async ({ body, session }) => {
  // Webhooks apontam para o n8n da equipe: fora do portal do cliente.
  if (session.role === 'client' && body.lookup === 'webhooks') throw new HttpError(403, 'Sem permissão para esta função');
  const wts = customerClient(body.clientToken);
  if (body.lookup === 'panelList') return { panels: await listPanels(wts) };
  return runLookup(body.lookup, wts, body.params);
}, { roles: ['admin', 'client'] });
