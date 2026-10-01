import { HttpError } from './http.js';
import { createWtsClient } from './wts.js';

let modelCompanyId = null; // reaproveitado enquanto a função estiver "quente"

export function normalizeName(value) {
  return String(value ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function modelClient() {
  const token = process.env.WTS_MODEL_TOKEN;
  if (!token) throw new HttpError(500, 'WTS_MODEL_TOKEN não configurado no servidor');
  return createWtsClient(token, 'modelo');
}

export function customerClient(token) {
  const value = typeof token === 'string' ? token.trim() : '';
  if (!/^\S{10,500}$/.test(value)) throw new HttpError(400, 'Informe o token da API da conta do cliente');
  return createWtsClient(value, 'cliente');
}

async function companyIdOf(client) {
  const agents = await client.get('/core/v1/agent');
  return Array.isArray(agents) ? agents.find((a) => a.companyId)?.companyId ?? null : null;
}

/**
 * Abre as duas contas e garante que o token do cliente não é o da própria
 * conta modelo (o companyId vem em GET /core/v1/agent).
 */
export async function openAccounts(clientToken) {
  const model = modelClient();
  const client = customerClient(clientToken);

  const [modelId, clientId] = await Promise.all([
    modelCompanyId ?? companyIdOf(model),
    companyIdOf(client),
  ]);
  modelCompanyId = modelId;

  if (!clientId) throw new HttpError(400, 'Não foi possível identificar a conta do cliente por esse token');
  if (modelId && modelId === clientId) {
    throw new HttpError(400, 'Esse token é da própria conta modelo. Use o token da conta do cliente.');
  }
  return { model, client };
}
