import { openAccounts } from '../lib/accounts.js';
import { getBlock } from '../lib/blocks.js';
import { HttpError, route } from '../lib/http.js';

// O front envia lotes pequenos para o log aparecer ao vivo e nenhuma chamada
// passar do timeout da função.
const MAX_KEYS_PER_CALL = 10;

export default route(async ({ body }) => {
  const block = getBlock(body.block);
  const keys = Array.isArray(body.keys) ? body.keys.filter((k) => typeof k === 'string') : [];
  if (!keys.length) throw new HttpError(400, 'Nenhum item selecionado');
  if (keys.length > MAX_KEYS_PER_CALL) throw new HttpError(400, `Envie no máximo ${MAX_KEYS_PER_CALL} itens por vez`);

  const accounts = await openAccounts(body.clientToken);
  // Recalcula o plano: o que já existe na conta do cliente nunca é recriado.
  const plan = new Map((await block.plan({ ...accounts, input: body.input })).map((item) => [item.key, item]));

  const results = [];
  for (const key of keys) {
    const item = plan.get(key);
    if (!item) {
      results.push({ key, status: 'error', message: 'Item não está mais no modelo' });
    } else if (item.exists) {
      results.push({ key, label: item.label, status: 'exists' });
    } else {
      try {
        await block.create(accounts.client, item);
        results.push({ key, label: item.label, status: 'created' });
      } catch (err) {
        if (err?.status === 401) throw err; // token inválido: não adianta seguir
        results.push({ key, label: item.label, status: 'error', message: err.message });
      }
    }
  }
  return { results };
});
