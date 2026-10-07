import { HttpError } from './errors.js';

// API de parceiro da Helena (plataforma por trás do WTS): criar a conta da
// empresa e gerar o token de API dela. Autentica com o Token de Parceiro
// (Admin → Personalizar → Integração), guardado só no servidor.
// Doc: helena.readme.io → Contas (POST /v1/company, POST /v1/company/{id}/tokens).

const BASE = () => (process.env.HELENA_API_BASE || 'https://api.helena.run').replace(/\/+$/, '');
const TOKEN = () => process.env.HELENA_PARTNER_TOKEN;

export const partnerConfigured = () => Boolean(TOKEN());

// Erro da API de parceiro com o que foi pedido e respondido (para a equipe ver na tela Clientes).
export class PartnerError extends HttpError {
  constructor(message, { call, status, response, sent }) {
    super(502, message);
    this.call = call;
    this.partnerStatus = status;
    this.response = response;
    this.sent = sent;
  }
}

async function partner(method, path, { query, body, label = `${method} ${path}` } = {}) {
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
      throw new PartnerError(`${label}: não consegui falar com a API de parceiro`, { call: `${method} ${path}`, status: 0, response: null, sent: body ?? null });
    }
    if (res.status === 429 && attempt < 3) { await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt)); continue; }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const detail = data && typeof data === 'object' ? data.text || data.detail || data.title || data.error || '' : '';
      const info = { call: `${method} ${url.pathname}${url.search}`, status: res.status, response: typeof data === 'string' ? data.slice(0, 2000) : data, sent: body ?? null };
      if (res.status === 401 || res.status === 403) throw new PartnerError(`${label}: Token de Parceiro inválido ou sem permissão`, info);
      throw new PartnerError(`${label}: API de parceiro respondeu ${res.status}${detail ? ` (${String(detail).slice(0, 200)})` : ''}`, info);
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
    const data = await partner('GET', '/v1/company', { query: { SearchableText: text, PageSize: 50 }, label: 'Buscar conta pelo CNPJ' });
    const items = Array.isArray(data) ? data : data?.items ?? [];
    const found = items.find((c) => digits(c.documentId) === doc);
    if (found) return found;
  }
  return null;
}

/**
 * Cria a conta tentando as variações em ordem (completa → só o essencial →
 * sem telefone → sem responsável). O erro 500 da API é genérico: cada tentativa
 * fica anotada para a equipe ver qual campo ela recusa. Depois de cada 500,
 * confere se a conta não ficou criada pela metade (para não duplicar).
 * Devolve { company, variant, attempts }.
 */
export async function createCompany(variants) {
  const attempts = [];
  for (const variant of variants) {
    try {
      const company = await partner('POST', '/v1/company', { body: variant.body, label: `Criar conta (${variant.label})` });
      if (!company?.id) throw new HttpError(502, 'Criar conta: a API de parceiro não devolveu o ID da conta criada');
      return { company, variant, attempts, halfCreated: false };
    } catch (err) {
      if (!(err instanceof PartnerError) || err.partnerStatus !== 500) { err.attempts = attempts; throw err; }
      attempts.push({ variant: variant.label, sent: err.sent, status: err.partnerStatus, response: err.response });
      const existing = await findCompanyByDocument(variant.body.documentId).catch(() => null);
      if (existing) return { company: existing, variant, attempts, halfCreated: true };
      if (variant === variants.at(-1)) { err.attempts = attempts; throw err; }
    }
  }
  throw new HttpError(502, 'Criar conta: nenhuma variação para tentar');
}

/** Gera um token de API para a conta (o token só vem nesta resposta). */
export async function createCompanyToken(companyId, name) {
  const result = await partner('POST', `/v1/company/${encodeURIComponent(companyId)}/tokens`, { body: { name }, label: 'Gerar token da conta' });
  if (!result?.token) throw new HttpError(502, 'A API de parceiro não devolveu o token da conta');
  return result.token;
}
