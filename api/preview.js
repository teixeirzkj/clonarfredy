import { openAccounts } from '../lib/accounts.js';
import { getBlock } from '../lib/blocks.js';
import { route } from '../lib/http.js';

// Dry-run: calcula o que seria criado, sem escrever nada na conta do cliente.
export default route(async ({ body }) => {
  const block = getBlock(body.block);
  const accounts = await openAccounts(body.clientToken);
  const plan = await block.plan({ ...accounts, input: body.input });

  return {
    items: plan.map(({ key, label, detail, exists }) => ({ key, label, detail, exists })),
    meta: plan.meta,
  };
});
