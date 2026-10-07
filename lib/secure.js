import crypto from 'node:crypto';

// Senhas (scrypt) e token do WTS guardado criptografado (AES-256-GCM).
// Chave: DATA_SECRET; sem ela, derivada do SESSION_SECRET.

function dataKey() {
  const base = process.env.DATA_SECRET || process.env.SESSION_SECRET;
  if (!base || base.length < 32) throw new Error('DATA_SECRET/SESSION_SECRET ausente ou curto');
  return crypto.createHash('sha256').update(`dados-portal:${base}`).digest();
}

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', dataKey(), iv);
  const data = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64url')).join('.');
}

export function decrypt(box) {
  const [iv, tag, data] = String(box).split('.').map((p) => Buffer.from(p, 'base64url'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', dataKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export function verifyPassword(password, stored) {
  const [kind, salt, hash] = String(stored ?? '').split('$');
  if (kind !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = crypto.scryptSync(String(password ?? ''), Buffer.from(salt, 'base64url'), expected.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(actual, expected);
}

// Senha inicial fácil de ditar: 3 blocos (ex.: "kp7m-x3qa-9tdw").
export function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const pick = () => Array.from(crypto.randomBytes(4), (b) => chars[b % chars.length]).join('');
  return `${pick()}-${pick()}-${pick()}`;
}

export const newId = () => crypto.randomBytes(9).toString('base64url');
