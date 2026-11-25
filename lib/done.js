import { getJson, setJson } from './store.js';

// O que o portal acabou de criar em cada conta, por bloco (etiquetas, equipes, usuários, webhooks).
// A API do WTS demora um pouco para mostrar o que foi criado nas listas: sem isto, ao atualizar a
// tela o item aparecia como "falta criar" de novo e um segundo clique criava duplicado.
const KEEP_MS = 7 * 24 * 3600 * 1000;
const key = (companyId, block) => `feito:${companyId}:${block}`;

export async function doneKeys(companyId, block) {
  if (!companyId) return new Set();
  const saved = (await getJson(key(companyId, block)).catch(() => null)) ?? {};
  const now = Date.now();
  return new Set(Object.entries(saved).filter(([, at]) => now - at < KEEP_MS).map(([k]) => k));
}

export async function markDone(companyId, block, keys) {
  if (!companyId || !keys.length) return;
  const saved = (await getJson(key(companyId, block)).catch(() => null)) ?? {};
  const now = Date.now();
  for (const [k, at] of Object.entries(saved)) if (now - at >= KEEP_MS) delete saved[k];
  for (const k of keys) saved[k] = now;
  await setJson(key(companyId, block), saved);
}

/** Marca como "já existe" o que o portal criou há pouco (mesmo que a lista do WTS ainda não mostre). */
export function withDone(plan, done) {
  for (const item of plan) if (done.has(item.key)) { item.exists = true; item.done = true; }
  return plan;
}
