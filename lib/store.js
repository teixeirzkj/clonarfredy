import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HttpError } from './errors.js';

// Banco simples chave → valor (JSON) para os clientes do portal e os cadastros.
// Na Vercel: Upstash Redis (Storage → Upstash → conectar ao projeto), que cria
// KV_REST_API_URL e KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL/TOKEN).
// No computador (sem essas variáveis): arquivo .data/store.json.

const URL_ENV = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const storeConfigured = () => Boolean((URL_ENV() && TOKEN_ENV()) || !process.env.VERCEL);

async function redis(...command) {
  let res;
  try {
    res = await fetch(URL_ENV(), {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN_ENV()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new HttpError(502, 'Não consegui falar com o banco de dados. Tente de novo.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new HttpError(502, 'Erro no banco de dados');
  return data.result;
}

// ---------- Arquivo local (só desenvolvimento) ----------
const DIR = () => join(process.env.STORE_DIR || process.cwd(), '.data');
const FILE = () => join(DIR(), 'store.json');
const readLocal = () => (existsSync(FILE()) ? JSON.parse(readFileSync(FILE(), 'utf8')) : {});
const writeLocal = (data) => { mkdirSync(DIR(), { recursive: true }); writeFileSync(FILE(), JSON.stringify(data, null, 2)); };

function backend() {
  if (URL_ENV() && TOKEN_ENV()) return 'redis';
  if (!process.env.VERCEL) return 'local';
  throw new HttpError(503, 'Banco de dados não configurado na Vercel (Storage → Upstash Redis).');
}

export async function getJson(key) {
  if (backend() === 'local') return readLocal()[key]?.value ?? null;
  const raw = await redis('GET', key);
  return raw ? JSON.parse(raw) : null;
}

export async function setJson(key, value) {
  if (backend() === 'local') { const d = readLocal(); d[key] = { value }; writeLocal(d); return; }
  await redis('SET', key, JSON.stringify(value));
}

export async function del(key) {
  if (backend() === 'local') { const d = readLocal(); delete d[key]; writeLocal(d); return; }
  await redis('DEL', key);
}

/** Contador com validade (tentativas de login, envios do cadastro). */
export async function hit(key, ttlSeconds) {
  if (backend() === 'local') {
    const d = readLocal();
    const now = Date.now();
    const cur = d[key] && d[key].exp > now ? d[key] : { value: 0, exp: now + ttlSeconds * 1000 };
    cur.value += 1;
    d[key] = cur;
    writeLocal(d);
    return cur.value;
  }
  const count = await redis('INCR', key);
  if (count === 1) await redis('EXPIRE', key, ttlSeconds);
  return count;
}

export async function resetHits(key) {
  await del(key);
}

// Listas pequenas guardadas como um array de IDs.
export async function listAdd(key, id) {
  const list = (await getJson(key)) ?? [];
  if (!list.includes(id)) { list.unshift(id); await setJson(key, list); }
}
export async function listRemove(key, id) {
  const list = (await getJson(key)) ?? [];
  await setJson(key, list.filter((x) => x !== id));
}
export async function listGet(key) {
  return (await getJson(key)) ?? [];
}
