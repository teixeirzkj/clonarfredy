import crypto from 'node:crypto';

// Sessão sem cookie: o token vai no header X-Session-Token. Funciona dentro do
// iframe do menu personalizado (onde cookies de terceiros podem ser bloqueados)
// e não é enviado automaticamente pelo navegador, então não há CSRF.
const HEADER = 'x-session-token';
const TTL_SECONDS = 8 * 60 * 60;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('SESSION_SECRET ausente ou com menos de 32 caracteres');
  }
  return value;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function sameBytes(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(input) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) throw new Error('APP_PASSWORD não configurada');
  return typeof input === 'string' && sameBytes(input, expected);
}

export function issueSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = String(expiresAt);
  return { token: `${payload}.${sign(payload)}`, expiresAt: expiresAt * 1000 };
}

export function isAuthenticated(req) {
  const token = req.headers[HEADER];
  if (typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !sameBytes(signature, sign(payload))) return false;
  return Number(payload) > Date.now() / 1000;
}
