import { getSession } from './auth.js';
import { HttpError } from './errors.js';

const MAX_BODY_BYTES = 4 * 1024 * 1024; // fluxos do n8n enviados pela tela podem ser grandes

export { HttpError };

export function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// A Vercel já entrega req.body parseado; no servidor local lemos o stream.
export async function readJson(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return parseJson(req.body);

  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'Requisição muito grande');
    chunks.push(chunk);
  }
  return parseJson(Buffer.concat(chunks).toString('utf8'));
}

function parseJson(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, 'JSON inválido');
  }
}

export const clientIp = (req) => String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim() || 'sem-ip';

/**
 * Envolve uma rota: checa método e sessão, e nunca devolve stack nem dados
 * sensíveis em caso de erro inesperado.
 * roles: quem pode usar a rota. Padrão: só a equipe ('admin'). Com 'client'
 * (portal do cliente), o token da conta WTS vem do cadastro do cliente logado,
 * nunca do que a tela mandar.
 */
/**
 * Confere a sessão e o papel. Para o cliente do portal, troca o token que veio
 * da tela pelo da conta dele (guardado no cadastro).
 */
export async function authorize(req, body, roles = ['admin']) {
  const session = getSession(req);
  if (!session) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
  if (!roles.includes(session.role)) throw new HttpError(403, 'Sem permissão para esta função');
  if (session.role === 'client') {
    const { tokenOf } = await import('./clients.js');
    const { token, client } = await tokenOf(session.clientId);
    body.clientToken = token;
    session.client = client;
  }
  return session;
}

export function route(fn, { method = 'POST', auth = true, roles = ['admin'] } = {}) {
  return async (req, res) => {
    try {
      if (req.method !== method) throw new HttpError(405, 'Método não permitido');
      const body = method === 'GET' ? {} : await readJson(req);
      const session = auth ? await authorize(req, body, roles) : null;
      const data = await fn({ req, body, session });
      send(res, 200, data);
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message });
      if (err?.name === 'WtsError') return send(res, 502, { error: err.message });
      console.error('Erro inesperado:', err?.name, err?.message);
      send(res, 500, { error: 'Erro interno. Tente novamente.' });
    }
  };
}
