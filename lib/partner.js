import { HttpError } from './errors.js';

// API de parceiro da Helena (plataforma por trás do WTS): criar a conta da
// empresa e gerar o token de API dela. Autentica com o Token de Parceiro
// (Admin → Personalizar → Integração), guardado só no servidor.
// Doc: helena.readme.io → Contas (POST /v1/company, POST /v1/company/{id}/tokens).

const BASE = () => (process.env.HELENA_API_BASE || 'https://api.helena.run').replace(/\/+$/, '');
const TOKEN = () => process.env.HELENA_PARTNER_TOKEN;

export const partnerConfigured = () => Boolean(TOKEN());

async function partner(method, path, { query, body } = {}) {
  const url = new URL(`${BASE()}/core${path}`);
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${TOKEN()}`, Accept: 'application/json', ...(body !== undefined && { 'Content-Type': 'application/json' }) },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });
    } catch {
      throw new HttpError(502, 'Não consegui falar com a API de parceiro');
    }
    if (res.status === 429 && attempt < 3) { await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt)); continue; }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const detail = data && typeof data === 'object' ? data.text || data.detail || data.title || data.error || '' : '';
      if (res.status === 401 || res.status === 403) throw new HttpError(502, 'Token de Parceiro inválido ou sem permissão');
      throw new HttpError(502, `API de parceiro respondeu ${res.status}${detail ? `: ${String(detail).slice(0, 200)}` : ''}`);
    }
    return data;
  }
}

const digits = (v) => String(v ?? '').replace(/\D/g, '');
const formatCnpj = (c) => c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

/** Conta já existente com o mesmo CNPJ (busca pelo número puro e formatado). */
export async function findCompanyByDocument(cnpj) {
  const doc = digits(cnpj);
  for (const text of [doc, formatCnpj(doc)]) {
    const data = await partner('GET', '/v1/company', { query: { SearchableText: text, PageSize: 50 } });
    const items = Array.isArray(data) ? data : data?.items ?? [];
    const found = items.find((c) => digits(c.documentId) === doc);
    if (found) return found;
  }
  return null;
}

export async function createCompany(body) {
  const company = await partner('POST', '/v1/company', { body });
  if (!company?.id) throw new HttpError(502, 'A API de parceiro não devolveu o ID da conta criada');
  return company;
}

/** Gera um token de API para a conta (o token só vem nesta resposta). */
export async function createCompanyToken(companyId, name) {
  const result = await partner('POST', `/v1/company/${encodeURIComponent(companyId)}/tokens`, { body: { name } });
  if (!result?.token) throw new HttpError(502, 'A API de parceiro não devolveu o token da conta');
  return result.token;
}
