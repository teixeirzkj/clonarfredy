import { customerClient } from '../lib/accounts.js';
import { route } from '../lib/http.js';
import { listPanels, runLookup } from '../lib/lookups.js';

// Consultas somente leitura na conta do token informado.
export default route(async ({ body }) => {
  const wts = customerClient(body.clientToken);
  if (body.lookup === 'panelList') return { panels: await listPanels(wts) };
  return runLookup(body.lookup, wts, body.params);
});
