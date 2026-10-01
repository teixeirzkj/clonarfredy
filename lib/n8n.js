import crypto from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { normalizeName } from './accounts.js';
import { HttpError } from './http.js';
import { readSlug, resolveModelSlug, slugPattern } from './slug.js';

// Gera fluxos do n8n para a conta do cliente a partir dos fluxos padrão.
//
// Os fluxos padrão são exportados do n8n como estão, apontando para a conta
// modelo. Aqui descobrimos quais IDs da conta modelo aparecem no fluxo
// (painel, etapas, campos, chatbots...) e sugerimos o equivalente na conta do
// cliente pelo nome. Assim ninguém precisa editar placeholder à mão.

const TEMPLATES_DIR = join(process.cwd(), 'templates', 'n8n');
const PROMPT_PLACEHOLDER = '{{PROMPT_CLIENTE}}';
const AGENT_NODE_TYPES = ['@n8n/n8n-nodes-langchain.agent'];
const MIN_KEY_LENGTH = 4; // keys muito curtas gerariam trocas indevidas

export const KIND_LABEL = {
  panel: 'Painel',
  step: 'Etapa',
  field: 'Campo do painel',
  bot: 'Chatbot (bot key)',
  tag: 'Etiqueta',
  department: 'Equipe',
  sequence: 'Sequência',
  agent: 'Usuário',
  channel: 'Canal',
  template: 'Modelo de mensagem',
};

// ---------- Fluxos padrão ----------

export async function listTemplates() {
  let files = [];
  try {
    files = (await readdir(TEMPLATES_DIR)).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  const templates = [];
  for (const file of files.sort()) {
    try {
      const workflow = JSON.parse(await readFile(join(TEMPLATES_DIR, file), 'utf8'));
      templates.push({ id: file, name: workflow.name || file, nodes: workflow.nodes?.length ?? 0 });
    } catch {
      templates.push({ id: file, name: file, nodes: 0, invalid: true });
    }
  }
  return templates;
}

export async function loadTemplate({ templateId, template }) {
  if (template && typeof template === 'object') return validateWorkflow(template);
  if (typeof templateId !== 'string' || !/^[\w .()-]+\.json$/.test(templateId)) throw new HttpError(400, 'Escolha um fluxo padrão');
  try {
    return validateWorkflow(JSON.parse(await readFile(join(TEMPLATES_DIR, templateId), 'utf8')));
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(404, 'Fluxo padrão não encontrado');
  }
}

function validateWorkflow(workflow) {
  if (!Array.isArray(workflow?.nodes) || typeof workflow.connections !== 'object') {
    throw new HttpError(400, 'Arquivo não parece um fluxo exportado do n8n (faltam nodes/connections)');
  }
  return workflow;
}

// ---------- Inventário das contas ----------

// Lê o que pode aparecer num fluxo: valores (IDs/keys) com nome legível.
async function inventory(wts, { panelIds } = {}) {
  const items = [];
  const add = (kind, value, label, extra = {}) => value && items.push({ kind, value: String(value), label: label || String(value), ...extra });

  const panels = await wts.getAll('/crm/v2/panel', { IncludeDetails: 'Steps' });
  for (const p of panels.filter((x) => !x.archived)) {
    add('panel', p.id, p.title);
    for (const s of (p.steps ?? []).filter((x) => !x.archived)) add('step', s.id, s.title, { panelId: p.id, group: p.title });
  }

  // Campos só dos painéis que interessam (um GET por painel).
  for (const panelId of panelIds ?? panels.filter((x) => !x.archived).map((x) => x.id)) {
    const panel = panels.find((p) => p.id === panelId);
    const fields = (await wts.get(`/crm/v1/panel/${panelId}/custom-fields`)) ?? [];
    for (const f of fields) {
      add('field', f.key, f.name, { panelId, group: panel?.title, fieldId: f.id });
      add('field', f.id, f.name, { panelId, group: panel?.title, isId: true });
    }
  }

  for (const b of (await wts.getAll('/chat/v1/chatbot')).filter((x) => !x.archived)) {
    add('bot', b.key, b.name);
    add('bot', b.id, b.name, { isId: true });
  }
  for (const t of (await wts.get('/core/v1/tag')) ?? []) add('tag', t.id, t.name);
  for (const d of (await wts.get('/core/v2/department')) ?? []) add('department', d.id, d.name);
  for (const s of await wts.getAll('/chat/v1/sequence')) add('sequence', s.id, s.name);
  for (const a of (await wts.get('/core/v1/agent')) ?? []) {
    add('agent', a.id, a.name);
    add('agent', a.userId, a.name, { isUserId: true });
  }
  for (const c of (await wts.get('/chat/v1/channel')) ?? []) add('channel', c.id, c.identity?.displayName || c.numberFormatted || c.number);
  return items;
}

function countOccurrences(text, item) {
  if (UUID_LIKE.test(item.value)) return text.split(item.value).length - 1;
  if (item.value.length < MIN_KEY_LENGTH) return 0;
  return (text.match(keyPattern(item.value)) ?? []).length;
}

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const keyPattern = (key) => new RegExp(`(?<![\\w-])${escapeRe(key)}(?![\\w-])`, 'g');

// ---------- Varredura (o que trocar) ----------

// Paths dos nós Webhook e quantas vezes o identificador da conta modelo aparece.
function scanSlug(workflow, text, modelSlug) {
  const count = (text.match(slugPattern(modelSlug)) ?? []).length;
  const webhookPaths = workflow.nodes
    .filter((n) => n.type === 'n8n-nodes-base.webhook' && typeof n.parameters?.path === 'string')
    .map((n) => ({ node: n.name, path: n.parameters.path }));
  return { modelSlug, count, webhookPaths };
}

export async function scanTemplate(workflow, { model, client, modelToken, modelSlug }) {
  const text = JSON.stringify(workflow);

  // Contas diferentes têm limites de requisição separados: dá para ler em paralelo.
  const [modelItems, clientItems] = await Promise.all([inventory(model), inventory(client)]);
  const found = modelItems
    .map((item) => ({ ...item, count: countOccurrences(text, item) }))
    .filter((item) => item.count > 0);

  const options = {};
  for (const item of clientItems) {
    if (item.isId || item.isUserId) continue;
    (options[item.kind] ??= []).push({ value: item.value, label: item.label, group: item.group, panelId: item.panelId });
  }
  const clientByKind = (kind, pred = () => true) => clientItems.filter((i) => i.kind === kind && pred(i));

  // Painel do cliente sugerido para cada painel do modelo (pelo título).
  const panelMatch = {};
  for (const ref of found.filter((f) => f.kind === 'panel')) {
    panelMatch[ref.value] = clientByKind('panel', (c) => normalizeName(c.label) === normalizeName(ref.label))[0]?.value ?? null;
  }
  // Etapas/campos referenciados cujo painel não apareceu direto no fluxo.
  for (const ref of found.filter((f) => f.panelId && !(f.panelId in panelMatch))) {
    const modelPanel = modelItems.find((i) => i.kind === 'panel' && i.value === ref.panelId);
    panelMatch[ref.panelId] = clientByKind('panel', (c) => normalizeName(c.label) === normalizeName(modelPanel?.label))[0]?.value ?? null;
  }

  // Um mesmo valor pode vir de dois itens (ex.: chatbot com ID igual à key): mostra uma vez.
  const seenValues = new Set();
  const unique = found.filter((ref) => !seenValues.has(ref.value) && seenValues.add(ref.value));

  const references = unique.map((ref) => {
    let candidates = clientByKind(ref.kind, (c) => Boolean(ref.isId) === Boolean(c.isId) && Boolean(ref.isUserId) === Boolean(c.isUserId));
    if (ref.panelId && panelMatch[ref.panelId]) candidates = candidates.filter((c) => c.panelId === panelMatch[ref.panelId]);
    const match = candidates.find((c) => normalizeName(c.label) === normalizeName(ref.label));
    return {
      kind: ref.kind,
      kindLabel: KIND_LABEL[ref.kind],
      from: ref.value,
      label: ref.label,
      group: ref.group,
      count: ref.count,
      isId: Boolean(ref.isId || ref.isUserId),
      modelPanelId: ref.panelId ?? null, // painel do modelo a que a etapa/campo pertence
      suggestion: match?.value ?? null,
    };
  });

  // Opções por referência: IDs usam a lista de IDs, keys a lista de keys.
  const idOptions = {};
  for (const item of clientItems.filter((i) => i.isId || i.isUserId)) {
    const suffix = item.isUserId ? ' · userId' : ' · ID';
    (idOptions[item.kind] ??= []).push({ value: item.value, label: `${item.label}${suffix}`, name: item.label, group: item.group, panelId: item.panelId });
  }

  return {
    references,
    options,
    idOptions,
    hasModelToken: Boolean(modelToken && text.includes(modelToken)),
    credentials: listCredentials(workflow),
    agentNodes: workflow.nodes.filter((n) => AGENT_NODE_TYPES.includes(n.type)).map((n) => n.name),
    hasPromptPlaceholder: text.includes(PROMPT_PLACEHOLDER),
    slug: scanSlug(workflow, text, resolveModelSlug(modelSlug)),
  };
}

// Credencial do WTS = a usada por nós que chamam api.wts.chat. Outras (OpenAI,
// Google...) não são tocadas.
const callsWts = (node) => JSON.stringify(node.parameters ?? {}).includes('api.wts.chat');
const credKey = (type, cred) => `${type}:${cred?.id || cred?.name}`;

function listCredentials(workflow) {
  const seen = new Map();
  for (const node of workflow.nodes) {
    for (const [type, cred] of Object.entries(node.credentials ?? {})) {
      const key = credKey(type, cred);
      if (!seen.has(key)) seen.set(key, { type, name: cred?.name ?? '', nodes: [], wts: false });
      const entry = seen.get(key);
      entry.nodes.push(node.name);
      if (callsWts(node)) entry.wts = true;
    }
  }
  return [...seen.values()];
}

// Troca a credencial do WTS (da conta modelo) em todos os nós que a usam.
// Sem `credential` (download), fica só o nome: se o n8n já tiver uma credencial
// com esse nome, liga sozinho; senão o nó pede para escolher. Nunca mantém o ID
// da conta modelo, que na mesma instância faria o fluxo agir na conta errada.
function swapWtsCredentials(workflow, credential, fallbackName) {
  const modelCreds = new Set();
  for (const node of workflow.nodes) {
    if (!callsWts(node)) continue;
    for (const [type, cred] of Object.entries(node.credentials ?? {})) modelCreds.add(credKey(type, cred));
  }
  const swapped = [];
  for (const node of workflow.nodes) {
    for (const [type, cred] of Object.entries(node.credentials ?? {})) {
      if (!modelCreds.has(credKey(type, cred))) continue;
      node.credentials[type] = credential ? { id: credential.id, name: credential.name } : { name: fallbackName };
      swapped.push(node.name);
    }
  }
  return { swapped };
}

// Alternativa sem credencial: header "Authorization: Bearer <token>" direto nos
// nós HTTP que usavam a credencial do WTS. Funciona no download/copiar, mas o
// token fica dentro do fluxo (e do arquivo baixado).
function putTokenInHeaders(workflow, token) {
  const modelCreds = new Set();
  for (const node of workflow.nodes) {
    if (!callsWts(node)) continue;
    for (const [type, cred] of Object.entries(node.credentials ?? {})) modelCreds.add(credKey(type, cred));
  }
  const changed = [];
  const skipped = [];
  for (const node of workflow.nodes) {
    const types = Object.entries(node.credentials ?? {}).filter(([type, cred]) => modelCreds.has(credKey(type, cred))).map(([type]) => type);
    if (!types.length) continue;
    const params = (node.parameters ??= {});
    // Cabeçalhos em modo JSON livre: não dá para editar com segurança.
    if (params.specifyHeaders === 'json') {
      skipped.push(node.name);
      continue;
    }
    for (const type of types) delete node.credentials[type];
    if (!Object.keys(node.credentials).length) delete node.credentials;
    params.authentication = 'none';
    delete params.genericAuthType;
    params.sendHeaders = true;
    params.headerParameters ??= {};
    const headers = (params.headerParameters.parameters ?? []).filter((p) => String(p?.name).toLowerCase() !== 'authorization');
    params.headerParameters.parameters = [{ name: 'Authorization', value: `Bearer ${token}` }, ...headers];
    changed.push(node.name);
  }
  return { changed, skipped };
}

// ---------- Geração ----------

const UUID_RE = UUID_LIKE;

export function buildWorkflow(workflow, { mapping, clientName, prompt, modelToken, clientToken, replaceToken, clientSlug, modelSlug, credential, auth = 'credential' }) {
  let text = JSON.stringify(workflow);
  const applied = [];

  // Identificador da empresa (paths de webhook, URLs): o mesmo usado nas
  // assinaturas de webhook do WTS, para o fluxo receber os eventos do cliente.
  const fromSlug = resolveModelSlug(modelSlug);
  const toSlug = readSlug(clientSlug, 'Identificador do cliente');
  const slugCount = (text.match(slugPattern(fromSlug)) ?? []).length;
  if (slugCount && !toSlug) throw new HttpError(400, `O fluxo usa "${fromSlug}" (ex.: path do webhook). Informe o identificador do cliente.`);
  if (slugCount && toSlug !== fromSlug) text = text.replace(slugPattern(fromSlug), toSlug);

  for (const m of Array.isArray(mapping) ? mapping : []) {
    if (typeof m?.from !== 'string' || typeof m?.to !== 'string' || !m.to || m.from === m.to) continue;
    if (!/^[\w-]{1,200}$/.test(m.to)) throw new HttpError(400, `Valor inválido para ${m.from}`);
    const before = text;
    text = UUID_RE.test(m.from) ? text.split(m.from).join(m.to) : text.replace(keyPattern(m.from), m.to);
    if (before !== text) applied.push(m.from);
  }

  const warnings = [];
  if (replaceToken && modelToken && clientToken && text.includes(modelToken)) {
    text = text.split(modelToken).join(clientToken);
  } else if (modelToken && text.includes(modelToken)) {
    warnings.push('O fluxo tem o token da conta modelo escrito nos nós. Troque pela credencial do cliente no n8n.');
  }

  const result = JSON.parse(text);
  const name = String(clientName ?? '').trim().slice(0, 80);
  if (name) result.name = workflowName(workflow.name, name);
  else warnings.push('Sem nome do cliente: o fluxo ficou com o nome do fluxo padrão.');

  // Cópia nova: sem ID do fluxo original e com webhooks próprios, senão a
  // ativação conflita com o fluxo modelo na mesma instância.
  delete result.id;
  delete result.versionId;
  delete result.active;
  if (result.meta) delete result.meta.instanceId;
  for (const node of result.nodes) {
    if (!node.webhookId) continue;
    const fresh = crypto.randomUUID();
    if (node.parameters?.path === node.webhookId) node.parameters.path = fresh;
    node.webhookId = fresh;
  }

  let credentialNodes = 0;
  let headerNodes = 0;
  if (auth === 'header') {
    if (!clientToken) throw new HttpError(400, 'Informe o token da conta do cliente para colocar nos nós');
    const { changed, skipped } = putTokenInHeaders(result, clientToken);
    headerNodes = changed.length;
    if (skipped.length) {
      // Nesses nós a credencial do modelo não pode ficar: troca pelo nome do cliente.
      const fallback = swapWtsCredentials({ nodes: result.nodes.filter((n) => skipped.includes(n.name)) }, null, name || 'WTS cliente');
      warnings.push(`Estes nós usam cabeçalhos em JSON e não receberam o token: ${skipped.join(', ')}. Ajuste a autenticação deles no n8n.`);
      credentialNodes = fallback.swapped.length;
    }
  } else {
    const credentialName = name || 'WTS cliente';
    const { swapped } = swapWtsCredentials(result, credential, credentialName);
    credentialNodes = swapped.length;
    if (swapped.length && !credential) {
      warnings.push(`Credencial: ${swapped.length} nó(s) do WTS ficaram apontando para a credencial "${credentialName}". Se ela já existir no n8n, liga sozinha; senão crie (Header Auth, Name: Authorization, Value: Bearer + token do cliente) e selecione nesses nós.`);
    }
  }

  if (typeof prompt === 'string' && prompt.trim()) {
    const inserted = insertPrompt(result, prompt.trim());
    if (!inserted) warnings.push('Não achei onde colocar o prompt (nem {{PROMPT_CLIENTE}} nem nó de AI Agent). Cole manualmente.');
  }

  const webhookPaths = result.nodes
    .filter((n) => n.type === 'n8n-nodes-base.webhook' && typeof n.parameters?.path === 'string')
    .map((n) => ({ node: n.name, path: n.parameters.path }));

  return { workflow: result, applied, warnings, slugReplaced: slugCount, webhookPaths, credentialNodes, headerNodes };
}

// Padrão do time no n8n: "[Tipo do fluxo] Nome da conta".
// "[Alteração em painéis] Embarque 22 palmitos" → "[Alteração em painéis] Conta exemplo"
function workflowName(templateName, clientName) {
  const prefix = String(templateName ?? '').match(/^\s*(\[[^\]]+\])/)?.[1];
  if (prefix) return `${prefix} ${clientName}`;
  return `${templateName || 'Fluxo'} – ${clientName}`;
}

function insertPrompt(workflow, prompt) {
  let inserted = false;
  const visit = (value) => {
    if (typeof value === 'string') {
      if (!value.includes(PROMPT_PLACEHOLDER)) return value;
      inserted = true;
      return value.split(PROMPT_PLACEHOLDER).join(prompt);
    }
    if (Array.isArray(value)) return value.map(visit);
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) value[key] = visit(value[key]);
    }
    return value;
  };
  workflow.nodes = visit(workflow.nodes);
  if (inserted) return true;

  for (const node of workflow.nodes.filter((n) => AGENT_NODE_TYPES.includes(n.type))) {
    node.parameters ??= {};
    node.parameters.options ??= {};
    node.parameters.options.systemMessage = prompt;
    inserted = true;
  }
  return inserted;
}

// ---------- Criação direto no n8n (opcional) ----------

export function n8nConfigured() {
  return Boolean(process.env.N8N_BASE_URL && process.env.N8N_API_KEY);
}

const n8nBase = () => process.env.N8N_BASE_URL.replace(/\/+$/, '');

async function n8nPost(path, body, what) {
  if (!n8nConfigured()) throw new HttpError(400, 'n8n não configurado (N8N_BASE_URL / N8N_API_KEY)');
  let res;
  try {
    res = await fetch(`${n8nBase()}/api/v1${path}`, {
      method: 'POST',
      headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new HttpError(502, 'Não foi possível conectar ao n8n');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new HttpError(502, `n8n recusou ${what}: ${data.message || `HTTP ${res.status}`}`);
  return data;
}

// Configurações do fluxo que a API pública do n8n aceita na criação.
const SETTINGS_KEYS = ['executionOrder', 'timezone', 'errorWorkflow', 'callerPolicy', 'saveExecutionProgress',
  'saveManualExecutions', 'saveDataErrorExecution', 'saveDataSuccessExecution', 'executionTimeout'];

export async function createInN8n(workflow) {
  const settings = Object.fromEntries(SETTINGS_KEYS.filter((k) => workflow.settings?.[k] !== undefined).map((k) => [k, workflow.settings[k]]));
  const data = await n8nPost('/workflows', {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: { executionOrder: 'v1', ...settings },
  }, 'o fluxo');
  return { id: data.id, url: `${n8nBase()}/workflow/${data.id}` };
}

// Credencial Header Auth do cliente: Authorization: Bearer <token>.
export async function createWtsCredential(name, token) {
  const data = await n8nPost('/credentials', {
    name,
    type: 'httpHeaderAuth',
    data: { name: 'Authorization', value: `Bearer ${token}` },
  }, 'a credencial');
  return { id: data.id, name: data.name ?? name };
}
