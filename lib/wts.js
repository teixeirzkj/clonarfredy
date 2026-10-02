// Cliente da API pública do WTS Chat. Bases e regras: skill wts-api.
const BASE_URL = 'https://api.wts.chat';
const PAGE_SIZE = 100; // máximo aceito pela API
const MAX_PAGES = 200;
const REQUEST_TIMEOUT_MS = 20_000;

// Limite por conta: 1.000 req/5 min (~3,3 req/s) e burst de 200 req/5 s.
// Uma chamada por vez com intervalo mínimo mantém a média abaixo de 3 req/s.
const MIN_INTERVAL_MS = 350;
const BACKOFF_MS = [2_000, 4_000, 8_000, 16_000];
const MAX_RETRY_AFTER_MS = 30_000;

export class WtsError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'WtsError';
    this.status = status;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildUrl(path, query) {
  const url = new URL(BASE_URL + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) continue;
    for (const item of [].concat(value)) url.searchParams.append(key, String(item));
  }
  return url;
}

// Extrai a mensagem dos formatos de erro da doc: InternalException
// ({ error, text, ... }) e ProblemDetails ({ title, detail, errors }).
function errorMessage(status, data, label) {
  if (status === 401) return `Token da conta ${label} inválido ou sem permissão (401)`;
  if (status === 429) return `Limite de requisições da conta ${label} atingido (429). Aguarde alguns minutos.`;

  let message = '';
  if (data && typeof data === 'object') {
    message = data.text || data.detail || data.title || data.error || '';
    if (data.errors && typeof data.errors === 'object') {
      const details = Object.values(data.errors).flat().filter((v) => typeof v === 'string');
      if (details.length) message = [message, details.join('; ')].filter(Boolean).join(': ');
    }
  } else if (typeof data === 'string') {
    message = data.slice(0, 300);
  }
  return `${message || 'Erro na API WTS'} (HTTP ${status})`;
}

/**
 * Cria um cliente para uma conta. `label` aparece nas mensagens de erro
 * ("modelo" / "cliente"); o token nunca é incluído em mensagem ou log.
 */
export function createWtsClient(token, label) {
  let lastRequestAt = 0;

  async function request(method, path, { query, body } = {}) {
    const url = buildUrl(path, query);

    for (let attempt = 0; ; attempt++) {
      const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
      if (wait > 0) await sleep(wait);
      lastRequestAt = Date.now();

      let res;
      try {
        res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(body !== undefined && { 'Content-Type': 'application/json' }),
          },
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
      } catch (err) {
        const reason = err?.name === 'TimeoutError' ? 'tempo esgotado' : 'falha de rede';
        throw new WtsError(`Não foi possível chamar a API WTS da conta ${label} (${reason})`, 0);
      }

      if (res.status === 429 && attempt < BACKOFF_MS.length) {
        const retryAfter = Number(res.headers.get('retry-after'));
        await sleep(retryAfter > 0 ? Math.min(retryAfter * 1000, MAX_RETRY_AFTER_MS) : BACKOFF_MS[attempt]);
        continue;
      }

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) throw new WtsError(errorMessage(res.status, data, label), res.status);
      return data;
    }
  }

  // Paginação da doc: PageNumber/PageSize na query, até hasMorePages=false.
  async function getAll(path, query = {}) {
    const items = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const data = await request('GET', path, { query: { ...query, PageNumber: page, PageSize: PAGE_SIZE } });
      items.push(...(data?.items ?? []));
      if (!data?.hasMorePages) break;
    }
    return items;
  }

  return {
    label,
    request,
    getAll,
    get: (path, query) => request('GET', path, { query }),
    post: (path, body) => request('POST', path, { body: body ?? {} }),
    put: (path, body) => request('PUT', path, { body: body ?? {} }),
  };
}
