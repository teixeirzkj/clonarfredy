import { openAccounts } from '../lib/accounts.js';
import { getBlock } from '../lib/blocks.js';
import { HttpError, route } from '../lib/http.js';

// Dry-run: calcula o que seria criado, sem escrever nada na conta do cliente.
// Portal do cliente: só etiquetas, equipes e usuários (webhooks são da equipe).
const CLIENT_BLOCKS = ['tags', 'departments', 'agents'];

export default route(async ({ body, session }) => {
  if (session.role === 'client' && !CLIENT_BLOCKS.includes(body.block)) throw new HttpError(403, 'Sem permissão para esta função');
  const block = getBlock(body.block);
  const accounts = await openAccounts(body.clientToken);
  const plan = await block.plan({ ...accounts, input: body.input });

  return {
    items: plan.map(({ key, label, detail, exists }) => ({ key, label, detail, exists })),
    meta: plan.meta,
  };
}, { roles: ['admin', 'client'] });
