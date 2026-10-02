import { normalizeName } from './accounts.js';
import { HttpError } from './http.js';

// Rotativo sem planilha: quem está ligado = usuários da equipe "Rotativo" da
// conta do cliente (GET/PUT /core/v1/department/{id}/agents). Essa equipe só
// guarda a lista: o chatbot continua levando para a equipe de cada atendente.
// A ordem e o nome de cada um (o que vai no "nome atendente") ficam no fluxo
// do n8n, e a vez de cada um na memória do próprio fluxo.
export const TEAM_NAME = 'Rotativo';
export const TEAM_PLACEHOLDER = '__EQUIPE_ROTATIVO__';
export const ORDER_PLACEHOLDER = '["__ORDEM_ROTATIVO__"]';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isRotativo = (t) => normalizeName(t.name) === normalizeName(TEAM_NAME);
const byAge = (a, b) => String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? ''));

// Todas as equipes "Rotativo" (a mais antiga primeiro: é a que vale).
async function rotativoTeams(client) {
  const teams = (await client.get('/core/v2/department')) ?? [];
  return { all: teams, rotativos: teams.filter(isRotativo).sort(byAge) };
}

async function findTeam(client) {
  return (await rotativoTeams(client)).rotativos[0] ?? null;
}

// Distribuição do WTS desligada: quem decide a vez é o fluxo do n8n.
async function createTeam(client, userIds) {
  const team = await client.post('/core/v1/department', {
    name: TEAM_NAME,
    isDefault: false,
    distributionIsEnabled: false,
    agents: userIds.map((userId) => ({ userId, isAgent: true, isSupervisor: false })),
  });
  if (team?.id) return team.id;
  // Sem ID na resposta: procura a equipe recém-criada em vez de criar outra.
  const created = await findTeam(client);
  if (!created) throw new HttpError(502, 'O WTS não devolveu a equipe Rotativo criada');
  return created.id;
}

function readUserIds(value) {
  if (!Array.isArray(value)) throw new HttpError(400, 'Lista do rotativo inválida');
  const ids = value.map((v) => String(v ?? '').trim());
  if (ids.some((id) => !UUID_RE.test(id))) throw new HttpError(400, 'Lista do rotativo inválida');
  return [...new Set(ids)];
}

// Equipe com o nome da pessoa (ex.: "Rafael Souza" → equipe "Rafael").
function teamFor(userName, teamNames) {
  const words = normalizeName(userName).split(' ');
  return teamNames.find((t) => normalizeName(t) === normalizeName(userName))
    ?? teamNames.find((t) => normalizeName(t) === words[0])
    ?? teamNames.find((t) => words.includes(normalizeName(t)))
    ?? null;
}

async function membersOf(client, teamId) {
  const detail = await client.get(`/core/v1/department/${teamId}`, { includeDetails: 'Agents' });
  return (detail?.agents ?? []).map((a) => a.userId);
}

/** Usuários da conta, quem está ligado e o nome sugerido para o rodízio. */
export async function readRotativo(client) {
  const [agents, { all, rotativos }] = await Promise.all([client.get('/core/v1/agent'), rotativoTeams(client)]);
  const team = rotativos[0] ?? null;
  const members = new Set(team ? await membersOf(client, team.id) : []);
  const teamNames = all.filter((t) => !isRotativo(t) && t.name?.trim()).map((t) => t.name.trim());
  const users = (agents ?? [])
    .filter((a) => a.userId && a.name)
    .map((a) => ({ userId: a.userId, name: a.name, on: members.has(a.userId), suggestedName: teamFor(a.name, teamNames) ?? a.name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return { teamId: team?.id ?? null, duplicates: Math.max(rotativos.length - 1, 0), teamNames, users };
}

/** Deixa na equipe exatamente quem está ligado (cria a equipe se não existir). */
export async function saveRotativoTeam(client, onUserIds) {
  const ids = readUserIds(onUserIds);
  if (!ids.length) throw new HttpError(400, 'Ligue pelo menos uma pessoa no rotativo');
  const team = await findTeam(client);
  if (!team) return { teamId: await createTeam(client, ids), created: true };
  await client.put(`/core/v1/department/${team.id}/agents`, {
    action: 'ReplaceAll',
    items: ids.map((userId) => ({ userId, isAgent: true, isSupervisor: false })),
  });
  return { teamId: team.id, created: false };
}

/** Liga ou desliga uma pessoa (botão da tela Rotativo). */
export async function toggleRotativo(client, userId, on) {
  const [id] = readUserIds([userId]);
  const team = await findTeam(client);
  if (!team) {
    if (!on) return { teamId: null };
    return { teamId: await createTeam(client, [id]) };
  }
  await client.put(`/core/v1/department/${team.id}/agents`, {
    action: on ? 'Upsert' : 'Remove',
    items: [{ userId: id, isAgent: true, isSupervisor: false }],
  });
  return { teamId: team.id };
}

/** Junta equipes "Rotativo" repetidas na mais antiga e apaga as outras. */
export async function mergeRotativoTeams(client) {
  const { rotativos } = await rotativoTeams(client);
  if (rotativos.length < 2) return { teamId: rotativos[0]?.id ?? null, removed: 0 };
  const [keep, ...extras] = rotativos;
  const ids = new Set(await membersOf(client, keep.id));
  for (const extra of extras) for (const id of await membersOf(client, extra.id)) ids.add(id);
  if (ids.size) {
    await client.put(`/core/v1/department/${keep.id}/agents`, {
      action: 'ReplaceAll',
      items: [...ids].map((userId) => ({ userId, isAgent: true, isSupervisor: false })),
    });
  }
  for (const extra of extras) await client.request('DELETE', `/core/v1/department/${extra.id}`);
  return { teamId: keep.id, removed: extras.length };
}

// Ordem do rodízio: [{ userId, name }], name = o que vai no "nome atendente".
export function readOrder(value) {
  if (!Array.isArray(value)) throw new HttpError(400, 'Lista do rotativo inválida');
  const ids = readUserIds(value.map((o) => o?.userId));
  return ids.map((id) => {
    const name = String(value.find((o) => o.userId === id)?.name ?? '').trim().replace(/\s+/g, ' ');
    if (!name || name.length > 100) throw new HttpError(400, 'Informe o nome no rodízio de cada pessoa (até 100 letras)');
    return { id, nome: name };
  });
}

/** Coloca o ID da equipe e a ordem escolhida no fluxo gerado. */
export function fillRotativo(text, { teamId, order }) {
  if (!text.includes(TEAM_PLACEHOLDER)) return text;
  if (!teamId) throw new HttpError(400, 'Escolha quem participa do rotativo');
  // Dentro do JSON do fluxo o código do nó é uma string: o array vai escapado.
  const orderJson = JSON.stringify(JSON.stringify(readOrder(order ?? []))).slice(1, -1);
  const placeholder = JSON.stringify(ORDER_PLACEHOLDER).slice(1, -1);
  return text.split(TEAM_PLACEHOLDER).join(teamId).split(placeholder).join(orderJson);
}
