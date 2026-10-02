import { normalizeName } from './accounts.js';
import { HttpError } from './http.js';

// Rotativo sem planilha: quem está ligado = usuários da equipe "Rotativo" da
// conta do cliente (GET/PUT /core/v1/department/{id}/agents). A ordem fica
// dentro do fluxo do n8n, e a vez de cada um na memória do próprio fluxo.
export const TEAM_NAME = 'Rotativo';
export const TEAM_PLACEHOLDER = '__EQUIPE_ROTATIVO__';
export const ORDER_PLACEHOLDER = '["__ORDEM_ROTATIVO__"]';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findTeam(client) {
  const teams = (await client.get('/core/v2/department')) ?? [];
  return teams.find((t) => normalizeName(t.name) === normalizeName(TEAM_NAME)) ?? null;
}

// Distribuição do WTS desligada: quem decide a vez é o fluxo do n8n.
async function createTeam(client, userIds) {
  const team = await client.post('/core/v1/department', {
    name: TEAM_NAME,
    isDefault: false,
    distributionIsEnabled: false,
    agents: userIds.map((userId) => ({ userId, isAgent: true, isSupervisor: false })),
  });
  if (!team?.id) throw new HttpError(502, 'O WTS não devolveu o ID da equipe Rotativo criada');
  return team.id;
}

function readUserIds(value) {
  if (!Array.isArray(value)) throw new HttpError(400, 'Lista do rotativo inválida');
  const ids = value.map((v) => String(v ?? '').trim());
  if (ids.some((id) => !UUID_RE.test(id))) throw new HttpError(400, 'Lista do rotativo inválida');
  return [...new Set(ids)];
}

/** Usuários da conta e quem está ligado no rotativo (membros da equipe). */
export async function readRotativo(client) {
  const [agents, team] = await Promise.all([client.get('/core/v1/agent'), findTeam(client)]);
  let members = new Set();
  if (team) {
    const detail = await client.get(`/core/v1/department/${team.id}`, { includeDetails: 'Agents' });
    members = new Set((detail?.agents ?? []).map((a) => a.userId));
  }
  const users = (agents ?? [])
    .filter((a) => a.userId && a.name)
    .map((a) => ({ userId: a.userId, name: a.name, on: members.has(a.userId) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return { teamId: team?.id ?? null, users };
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

/** Coloca o ID da equipe e a ordem escolhida no fluxo gerado. */
export function fillRotativo(text, { teamId, order }) {
  if (!text.includes(TEAM_PLACEHOLDER)) return text;
  if (!teamId) throw new HttpError(400, 'Escolha quem participa do rotativo');
  // Dentro do JSON do fluxo o código do nó é uma string: o array vai escapado.
  const orderJson = JSON.stringify(JSON.stringify(readUserIds(order ?? []))).slice(1, -1);
  const placeholder = JSON.stringify(ORDER_PLACEHOLDER).slice(1, -1);
  return text.split(TEAM_PLACEHOLDER).join(teamId).split(placeholder).join(orderJson);
}
