import crypto from 'node:crypto';
import { companyIdOf, normalizeName } from './accounts.js';
import { HttpError } from './http.js';
import { WEBHOOK_BASE } from './n8n.js';

// Rotativo sem planilha e sem equipe: a lista (quem está ligado, ordem e o nome
// que vai no "nome atendente") fica na memória do próprio fluxo do n8n. A página
// lê e grava essa lista por um segundo webhook do fluxo, protegido por uma chave
// que só o servidor sabe calcular. O chatbot continua levando para a equipe de
// cada atendente.
export const ROTATIVO_MARK = '__ROTATIVO_CHAVE__';
const PATH_PLACEHOLDER = '__ROTATIVO_CONFIG__';
const ORDER_PLACEHOLDER = '["__ORDEM_ROTATIVO__"]';
const CONFIG_PREFIX = 'rotativo-config/';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CONFIG_TIMEOUT_MS = 15_000;

export const isRotativoConfigPath = (path) => path.startsWith(CONFIG_PREFIX) || path === PATH_PLACEHOLDER;

// Chave e endereço de configuração derivados da conta: nada é guardado.
function rotativoKey(companyId) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new HttpError(500, 'SESSION_SECRET não configurado no servidor');
  return crypto.createHmac('sha256', secret).update(`rotativo:${companyId}`).digest('hex').slice(0, 40);
}
const configPath = (companyId) => `${CONFIG_PREFIX}${companyId}`;

async function companyOf(client) {
  const id = await companyIdOf(client);
  if (!id) throw new HttpError(400, 'Não foi possível identificar a conta do cliente por esse token');
  return id;
}

// Lista do rodízio: [{ id, nome, ligado }] na ordem.
export function readList(value) {
  if (!Array.isArray(value)) throw new HttpError(400, 'Lista do rotativo inválida');
  const seen = new Set();
  const list = value.map((p) => {
    const id = String(p?.userId ?? p?.id ?? '').trim();
    const nome = String(p?.name ?? p?.nome ?? '').trim().replace(/\s+/g, ' ');
    const ligado = Boolean(p?.on ?? p?.ligado);
    if (!UUID_RE.test(id) || seen.has(id)) throw new HttpError(400, 'Lista do rotativo inválida');
    if (ligado && (!nome || nome.length > 100)) throw new HttpError(400, 'Informe o nome no rodízio de cada pessoa ligada (até 100 letras)');
    seen.add(id);
    return { id, nome: nome.slice(0, 100), ligado };
  });
  if (!list.some((p) => p.ligado)) throw new HttpError(400, 'Ligue pelo menos uma pessoa no rotativo');
  return list;
}

// Chama o webhook de configuração do fluxo do cliente no n8n.
async function callConfig(companyId, payload) {
  let res;
  try {
    res = await fetch(`${WEBHOOK_BASE()}${configPath(companyId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chave: rotativoKey(companyId), ...payload }),
      signal: AbortSignal.timeout(CONFIG_TIMEOUT_MS),
    });
  } catch {
    throw new HttpError(502, 'Não consegui falar com o n8n. Tente de novo.');
  }
  if (res.status === 404) return null; // fluxo não importado ou desativado
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new HttpError(502, `O fluxo Rotativo no n8n respondeu com erro${data?.erro ? `: ${data.erro}` : ` (HTTP ${res.status})`}`);
  return data;
}

// Nome sugerido para o "nome atendente": a equipe com o nome da pessoa
// (ex.: "Rafael Souza" → equipe "Rafael"), senão o nome do usuário.
function suggestName(userName, teamNames) {
  const words = normalizeName(userName).split(' ');
  return teamNames.find((t) => normalizeName(t) === normalizeName(userName))
    ?? teamNames.find((t) => normalizeName(t) === words[0])
    ?? teamNames.find((t) => words.includes(normalizeName(t)))
    ?? userName;
}

/**
 * Usuários da conta e a lista atual do rodízio (se o fluxo já estiver ativo no
 * n8n). Quem está na lista vem primeiro, na ordem; os demais, desligados.
 */
export async function readRotativo(client, { withConfig = true } = {}) {
  const [agents, teams, companyId] = await Promise.all([
    client.get('/core/v1/agent'),
    client.get('/core/v2/department'),
    companyOf(client),
  ]);
  const teamNames = (teams ?? []).map((t) => t.name?.trim()).filter(Boolean);
  const config = withConfig ? await callConfig(companyId, { acao: 'ler' }) : null;
  const saved = Array.isArray(config?.lista) ? config.lista : [];
  const byId = new Map((agents ?? []).filter((a) => a.userId && a.name).map((a) => [a.userId, a]));

  const users = [
    ...saved.filter((p) => byId.has(p.id)).map((p) => ({ userId: p.id, name: byId.get(p.id).name, label: p.nome || byId.get(p.id).name, on: Boolean(p.ligado) })),
    ...[...byId.values()]
      .filter((a) => !saved.some((p) => p.id === a.userId))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((a) => ({ userId: a.userId, name: a.name, label: suggestName(a.name, teamNames), on: false })),
  ];
  return { connected: Boolean(config), teamNames, users };
}

/** Grava a lista no fluxo (tela Rotativo). */
export async function saveRotativo(client, list) {
  const lista = readList(list);
  const companyId = await companyOf(client);
  const data = await callConfig(companyId, { acao: 'salvar', lista });
  if (!data) throw new HttpError(404, 'Fluxo Rotativo não encontrado no n8n: importe o fluxo gerado e deixe ativo.');
  return { ok: true };
}

/** Dados para gerar o fluxo: chave, endereço de configuração e lista inicial. */
export async function rotativoBuildOptions(client, list) {
  const lista = readList(list);
  const companyId = await companyOf(client);
  return { companyId, key: rotativoKey(companyId), lista };
}

/** Coloca a chave, o endereço de configuração e a lista inicial no fluxo. */
export function fillRotativo(text, options) {
  if (!text.includes(ROTATIVO_MARK)) return text;
  if (!options?.key) throw new HttpError(400, 'Escolha quem participa do rotativo');
  // Dentro do JSON do fluxo o código do nó é uma string: o array vai escapado.
  const listJson = JSON.stringify(JSON.stringify(options.lista)).slice(1, -1);
  return text
    .split(JSON.stringify(ORDER_PLACEHOLDER).slice(1, -1)).join(listJson)
    .split(ROTATIVO_MARK).join(options.key)
    .split(PATH_PLACEHOLDER).join(configPath(options.companyId));
}
