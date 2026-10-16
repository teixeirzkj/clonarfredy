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
// Versão do fluxo (o config devolve "versao"): 0 = sem transbordo, 1 = horas, 2 = minutos+peso, 3 = critério.
export const ROTATIVO_VERSION = 3;
const PATH_PLACEHOLDER = '__ROTATIVO_CONFIG__';
const ORDER_PLACEHOLDER = '["__ORDEM_ROTATIVO__"]';
const CONFIG_PREFIX = 'rotativo-config/';
const COMPANY_PLACEHOLDER = '__ROTATIVO_EMPRESA__';

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
    // Peso: atendimentos por rodada (2 = o dobro de quem tem 1).
    const peso = p?.weight ?? p?.peso ?? 1;
    if (!UUID_RE.test(id) || seen.has(id)) throw new HttpError(400, 'Lista do rotativo inválida');
    if (ligado && (!nome || nome.length > 100)) throw new HttpError(400, 'Informe o nome no rodízio de cada pessoa ligada (até 100 letras)');
    if (!Number.isInteger(Number(peso)) || peso < 1 || peso > 10) throw new HttpError(400, 'Atendimentos por rodada: de 1 a 10');
    seen.add(id);
    return { id, nome: nome.slice(0, 100), ligado, peso: Number(peso) };
  });
  if (!list.some((p) => p.ligado)) throw new HttpError(400, 'Ligue pelo menos uma pessoa no rotativo');
  return list;
}

// Transbordo: sem ninguém assumir a conversa em X minutos, passa para a próxima pessoa.
// { on/ligado, minutes/minutos (ou hours/horas) } → { ligado, minutos }; undefined = não mexer.
export function readTransbordo(value) {
  if (value === undefined || value === null) return undefined;
  const hours = value?.horas ?? value?.hours;
  const minutos = Number(value?.minutos ?? value?.minutes ?? (hours != null ? Number(hours) * 60 : NaN));
  if (!Number.isFinite(minutos) || minutos < 1 || minutos > 10080) throw new HttpError(400, 'Transbordo: informe de 1 minuto a 168 horas');
  // Critério de "atendida": o atendente respondeu (padrão) ou alguém assumiu a conversa.
  const criterio = value?.criterio ?? value?.criteria ?? 'resposta';
  if (!['resposta', 'assumiu'].includes(criterio)) throw new HttpError(400, 'Transbordo: critério inválido');
  // Só trocar dentro do horário de atendimento (padrão: sim).
  const soHorario = (value?.soHorario ?? value?.onlyOfficeHours) !== false;
  return { ligado: Boolean(value?.ligado ?? value?.on), minutos: Math.round(minutos), criterio, soHorario };
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
    ...saved.filter((p) => byId.has(p.id)).map((p) => ({ userId: p.id, name: byId.get(p.id).name, label: p.nome || byId.get(p.id).name, on: Boolean(p.ligado), weight: Number(p.peso) >= 1 ? Math.min(10, Math.round(Number(p.peso))) : 1 })),
    ...[...byId.values()]
      .filter((a) => !saved.some((p) => p.id === a.userId))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((a) => ({ userId: a.userId, name: a.name, label: suggestName(a.name, teamNames), on: false, weight: 1 })),
  ];
  // Versão do fluxo do cliente: fluxos antigos não devolvem "versao" (1 = só transbordo em horas, 0 = nada).
  const transbordoSupported = Boolean(config && typeof config.transbordo === 'object');
  const version = Number(config?.versao) || (transbordoSupported ? 1 : 0);
  const transbordo = transbordoSupported
    ? {
      on: Boolean(config.transbordo.ligado),
      minutes: Number(config.transbordo.minutos) || (Number(config.transbordo.horas) || 3) * 60,
      criterio: config.transbordo.criterio === 'assumiu' ? 'assumiu' : 'resposta',
      onlyOfficeHours: config.transbordo.soHorario !== false,
    }
    : null;
  return { connected: Boolean(config), teamNames, users, transbordoSupported, transbordo, version, outdated: Boolean(config) && version < ROTATIVO_VERSION };
}

/** Grava a lista (e o transbordo, se vier) no fluxo (tela Rotativo). */
export async function saveRotativo(client, list, transbordo) {
  const lista = readList(list);
  const tb = readTransbordo(transbordo);
  const companyId = await companyOf(client);
  // "horas" vai junto para fluxos da versão 1 (que só entendem horas).
  const data = await callConfig(companyId, { acao: 'salvar', lista, ...(tb && { transbordo: { ...tb, horas: tb.minutos / 60 } }) });
  if (!data) throw new HttpError(404, 'Fluxo Rotativo não encontrado no n8n: importe o fluxo gerado e deixe ativo.');
  if (tb && typeof data.transbordo !== 'object') throw new HttpError(409, 'Este fluxo Rotativo não tem transbordo: gere o fluxo de novo em Fluxos do n8n e importe no lugar do atual.');
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
    .split(PATH_PLACEHOLDER).join(configPath(options.companyId))
    .split(COMPANY_PLACEHOLDER).join(options.companyId);
}
