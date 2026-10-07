import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HttpError } from './errors.js';

// Banco simples chave → valor (JSON) para os clientes do portal e os cadastros.
// Ordem de escolha:
//   1. Supabase: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (tabela portal_kv,
//      criada com docs/supabase.sql). A chave service_role fica só no servidor.
//   2. Upstash Redis: KV_REST_API_URL + KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_*).
//   3. No computador (sem nenhuma das duas): arquivo .data/store.json.

const SB_URL = () => process.env.SUPABASE_URL?.replace(/\/+$/, '');
const SB_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const URL_ENV = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const storeConfigured = () => Boolean((SB_URL() && SB_KEY()) || (URL_ENV() && TOKEN_ENV()) || !process.env.VERCEL);

function backend() {
  if (SB_URL() && SB_KEY()) return 'supabase';
  if (URL_ENV() && TOKEN_ENV()) return 'redis';
  if (!process.env.VERCEL) return 'local';
  throw new HttpError(503, 'Banco de dados não configurado na Vercel (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY).');
}

const unreachable = () => new HttpError(502, 'Não consegui falar com o banco de dados. Tente de novo.');

// ---------- Supabase (PostgREST) ----------
async function supabase(path, { method = 'GET', body, prefer } = {}) {
  let res;
  try {
    res = await fetch(`${SB_URL()}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: SB_KEY(),
        Authorization: `Bearer ${SB_KEY()}`,
        'Content-Type': 'application/json',
        ...(prefer && { Prefer: prefer }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw unreachable();
  }
  const text = await res.text();
  if (!res.ok) {
    console.error('Supabase', res.status, text.slice(0, 200));
    throw new HttpError(502, res.status === 404 ? 'Tabela do portal não encontrada no Supabase: rode o docs/supabase.sql' : 'Erro no banco de dados');
  }
  return text ? JSON.parse(text) : null;
}
const kvFilter = (key) => `portal_kv?key=eq.${encodeURIComponent(key)}`;

// ---------- Upstash Redis ----------
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
    throw unreachable();
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

export async function getJson(key) {
  const kind = backend();
  if (kind === 'local') return readLocal()[key]?.value ?? null;
  if (kind === 'supabase') {
    const rows = await supabase(`${kvFilter(key)}&select=value,expires_at`);
    const row = rows?.[0];
    if (!row || (row.expires_at && new Date(row.expires_at) < new Date())) return null;
    return row.value;
  }
  const raw = await redis('GET', key);
  return raw ? JSON.parse(raw) : null;
}

export async function setJson(key, value) {
  const kind = backend();
  if (kind === 'local') { const d = readLocal(); d[key] = { value }; writeLocal(d); return; }
  if (kind === 'supabase') {
    await supabase('portal_kv?on_conflict=key', {
      method: 'POST',
      body: { key, value, expires_at: null, updated_at: new Date().toISOString() },
      prefer: 'resolution=merge-duplicates,return=minimal',
    });
    return;
  }
  await redis('SET', key, JSON.stringify(value));
}

export async function del(key) {
  const kind = backend();
  if (kind === 'local') { const d = readLocal(); delete d[key]; writeLocal(d); return; }
  if (kind === 'supabase') { await supabase(kvFilter(key), { method: 'DELETE', prefer: 'return=minimal' }); return; }
  await redis('DEL', key);
}

/** Contador com validade (tentativas de login, envios do cadastro). */
export async function hit(key, ttlSeconds) {
  const kind = backend();
  if (kind === 'local') {
    const d = readLocal();
    const now = Date.now();
    const cur = d[key] && d[key].exp > now ? d[key] : { value: 0, exp: now + ttlSeconds * 1000 };
    cur.value += 1;
    d[key] = cur;
    writeLocal(d);
    return cur.value;
  }
  if (kind === 'supabase') return Number(await supabase('rpc/portal_hit', { method: 'POST', body: { k: key, ttl: ttlSeconds } }));
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
