import { HttpError } from './errors.js';
import { decrypt, encrypt, generatePassword, hashPassword, newId, verifyPassword } from './secure.js';
import { del, getJson, hit, listAdd, listGet, listRemove, resetHits, setJson } from './store.js';

// Clientes do portal: login (e-mail + senha) ligado ao token da conta WTS dele.
// O token fica criptografado e nunca volta para a tela.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDEX = 'clients';
const key = (id) => `client:${id}`;
const emailKey = (email) => `client-email:${email}`;
const normEmail = (v) => String(v ?? '').trim().toLowerCase();

function readEmail(v) {
  const email = normEmail(v);
  if (!EMAIL_RE.test(email) || email.length > 200) throw new HttpError(400, 'E-mail inválido');
  return email;
}
function readToken(v) {
  const token = String(v ?? '').trim();
  if (!/^\S{10,500}$/.test(token)) throw new HttpError(400, 'Token da conta WTS inválido');
  return token;
}
function readPassword(v) {
  const password = String(v ?? '');
  if (password.length < 8 || password.length > 200) throw new HttpError(400, 'A senha precisa de pelo menos 8 caracteres');
  return password;
}

// O que a tela da equipe vê (nunca o token nem a senha).
const publicView = (c) => ({
  id: c.id, company: c.company, email: c.email, active: c.active, createdAt: c.createdAt,
  lastLoginAt: c.lastLoginAt ?? null, signupId: c.signupId ?? null, guideDone: c.guideDone ?? [],
});

export async function listClients() {
  const ids = await listGet(INDEX);
  const clients = (await Promise.all(ids.map((id) => getJson(key(id))))).filter(Boolean);
  return clients.map(publicView);
}

export async function getClient(id) {
  if (!/^[\w-]{6,40}$/.test(String(id ?? ''))) return null;
  return getJson(key(id));
}

/** Cria o acesso do cliente. Devolve a senha inicial (mostrada uma vez). */
export async function createClient({ company, email, wtsToken, password, passwordHash, signupId }) {
  const name = String(company ?? '').trim().slice(0, 150);
  if (!name) throw new HttpError(400, 'Informe o nome da empresa');
  const login = readEmail(email);
  const token = readToken(wtsToken);
  if (await getJson(emailKey(login))) throw new HttpError(409, 'Já existe um acesso com esse e-mail');
  // passwordHash: senha que o próprio cliente escolheu no cadastro (já protegida).
  const initial = passwordHash ? null : password ? readPassword(password) : generatePassword();
  const client = {
    id: newId(), company: name, email: login, active: true, createdAt: new Date().toISOString(),
    passwordHash: passwordHash ?? hashPassword(initial), tokenBox: encrypt(token), signupId: signupId ?? null, guideDone: [],
  };
  await setJson(key(client.id), client);
  await setJson(emailKey(login), client.id);
  await listAdd(INDEX, client.id);
  return { client: publicView(client), password: initial };
}

export async function updateClient(id, changes) {
  const client = await getClient(id);
  if (!client) throw new HttpError(404, 'Cliente não encontrado');
  let password = null;
  if (changes.company !== undefined) client.company = String(changes.company).trim().slice(0, 150) || client.company;
  if (changes.active !== undefined) client.active = Boolean(changes.active);
  if (changes.wtsToken) client.tokenBox = encrypt(readToken(changes.wtsToken));
  if (changes.resetPassword) {
    password = generatePassword();
    client.passwordHash = hashPassword(password);
  }
  if (changes.email && readEmail(changes.email) !== client.email) {
    const email = readEmail(changes.email);
    if (await getJson(emailKey(email))) throw new HttpError(409, 'Já existe um acesso com esse e-mail');
    await del(emailKey(client.email));
    client.email = email;
    await setJson(emailKey(email), client.id);
  }
  await setJson(key(id), client);
  return { client: publicView(client), password };
}

export async function deleteClient(id) {
  const client = await getClient(id);
  if (!client) return;
  await del(key(id));
  await del(emailKey(client.email));
  await listRemove(INDEX, id);
}

/** Login do portal. Trava por 15 min depois de 8 erros (por e-mail e por IP). */
export async function authenticate(email, password, ip) {
  const login = normEmail(email);
  const limits = [`login-fail:${login}`, `login-fail-ip:${ip}`];
  for (const k of limits) {
    const current = await getJson(k).catch(() => null);
    if (typeof current === 'number' && current >= 8) throw new HttpError(429, 'Muitas tentativas. Espere 15 minutos e tente de novo.');
  }
  const id = EMAIL_RE.test(login) ? await getJson(emailKey(login)) : null;
  const client = id ? await getClient(id) : null;
  const ok = client && client.active && verifyPassword(password, client.passwordHash);
  if (!ok) {
    for (const k of limits) await hit(k, 15 * 60);
    await new Promise((r) => setTimeout(r, 700));
    throw new HttpError(401, client && !client.active ? 'Acesso desativado. Fale com a equipe Frédy.' : 'E-mail ou senha incorretos');
  }
  await resetHits(limits[0]);
  client.lastLoginAt = new Date().toISOString();
  await setJson(key(client.id), client);
  return publicView(client);
}

export async function changePassword(id, current, next) {
  const client = await getClient(id);
  if (!client || !verifyPassword(current, client.passwordHash)) throw new HttpError(400, 'Senha atual incorreta');
  client.passwordHash = hashPassword(readPassword(next));
  await setJson(key(id), client);
}

/** Token da conta WTS do cliente logado (só no servidor). */
export async function tokenOf(id) {
  const client = await getClient(id);
  if (!client || !client.active) throw new HttpError(401, 'Acesso desativado. Entre novamente.');
  return { token: decrypt(client.tokenBox), client: publicView(client) };
}

export async function setGuideDone(id, stepIds) {
  const client = await getClient(id);
  if (!client) throw new HttpError(404, 'Cliente não encontrado');
  client.guideDone = [...new Set((Array.isArray(stepIds) ? stepIds : []).map(String).filter((s) => /^[\w-]{1,40}$/.test(s)))].slice(0, 100);
  await setJson(key(id), client);
  return client.guideDone;
}
