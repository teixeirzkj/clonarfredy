import crypto from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { normalizeName } from './accounts.js';
import { HttpError } from './http.js';
import { fillRotativo, isRotativoConfigPath, ROTATIVO_MARK } from './rotativo.js';
import { readSlug, resolveModelSlug, slugPattern } from './slug.js';

// Gera fluxos do n8n para a conta do cliente a partir dos fluxos padrão.
//
// Os fluxos padrão são exportados do n8n como estão. Aqui descobrimos o que é
// da conta de origem (painel, etapas, campos, chatbots, equipes, número do
// WhatsApp, credencial, path do webhook) e trocamos pelo equivalente do
// cliente. Um fluxo pode depender de subfluxos (tools do agente de IA): eles
// são gerados juntos e o principal já sai ligado a eles.

const TEMPLATES_DIR = join(process.cwd(), 'templates', 'n8n');
const PROMPT_PLACEHOLDER = '{{PROMPT_CLIENTE}}';
const AGENT_NODE_TYPES = ['@n8n/n8n-nodes-langchain.agent'];
const TOOL_WORKFLOW_TYPE = '@n8n/n8n-nodes-langchain.toolWorkflow';
const WEBHOOK_TYPE = 'n8n-nodes-base.webhook';
const MIN_KEY_LENGTH = 4; // keys muito curtas gerariam trocas indevidas
const NAME_PLACEHOLDER = /\[\s*nome\s+(?:da\s+)?empresa[^\]]*\]/gi; // "[nome empresa Exemplo]"

export const KIND_LABEL = {
  panel: 'Painel',
  step: 'Etapa',
  field: 'Campo do painel',
  contactField: 'Campo do contato',
  bot: 'Chatbot (bot key)',
  tag: 'Etiqueta',
  department: 'Equipe',
  sequence: 'Sequência',
  agent: 'Usuário',
  channel: 'Canal',
  template: 'Modelo de mensagem',
};

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_RE = UUID_LIKE;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const keyPattern = (key) => new RegExp(`(?<![\\w-])${escapeRe(key)}(?![\\w-])`, 'g');
const digitsPattern = (digits) => new RegExp(`(?<!\\d)${digits}(?!\\d)`, 'g');

// ---------- Fluxos padrão ----------

const toolRefs = (workflow) => workflow.nodes
  .filter((n) => n.type === TOOL_WORKFLOW_TYPE && n.parameters?.workflowId)
  .map((n) => {
    const ref = n.parameters.workflowId;
    return { node: n.name, id: typeof ref === 'object' ? ref.value : ref, name: ref?.cachedResultName ?? '' };
  })
  .filter((r) => r.id);

async function readAllTemplates() {
  let files = [];
  try {
    files = (await readdir(TEMPLATES_DIR)).filter((f) => f.endsWith('.json')).sort();
  } catch {
    return [];
  }
  const all = [];
  for (const file of files) {
    try {
      all.push({ file, workflow: validateWorkflow(JSON.parse(await readFile(join(TEMPLATES_DIR, file), 'utf8'))) });
    } catch {
      all.push({ file, invalid: true });
    }
  }
  return all;
}

// Subfluxos usados pelo fluxo, achados pelo ID original entre os fluxos padrão.
function resolveTools(main, all) {
  const subflows = [];
  const missing = [];
  const seen = new Set();
  for (const ref of toolRefs(main)) {
    if (seen.has(ref.id)) continue;
    seen.add(ref.id);
    const match = all.find((t) => !t.invalid && t.workflow.id === ref.id);
    if (match) subflows.push({ file: match.file, workflow: match.workflow, originalId: ref.id });
    else missing.push(ref);
  }
  return { subflows, missing };
}

export async function listTemplates() {
  const all = await readAllTemplates();
  const usedAsTool = new Set(all.filter((t) => !t.invalid).flatMap((t) => toolRefs(t.workflow).map((r) => r.id)));
  return all.map((t) => {
    if (t.invalid) return { id: t.file, name: t.file, nodes: 0, invalid: true };
    const { subflows, missing } = resolveTools(t.workflow, all);
    return {
      id: t.file,
      name: t.workflow.name || t.file,
      nodes: t.workflow.nodes.length,
      isSubflow: usedAsTool.has(t.workflow.id),
      subflows: subflows.map((s) => s.workflow.name),
      missingTools: missing.map((m) => m.name || m.node),
    };
  });
}

export async function loadPackage({ templateId, template }) {
  if (template && typeof template === 'object') {
    const main = validateWorkflow(template);
    return { main, subflows: [], missing: toolRefs(main) };
  }
  if (typeof templateId !== 'string' || !/^[\w .()-]+\.json$/.test(templateId)) throw new HttpError(400, 'Escolha um fluxo padrão');
  const all = await readAllTemplates();
  const entry = all.find((t) => t.file === templateId);
  if (!entry) throw new HttpError(404, 'Fluxo padrão não encontrado');
  if (entry.invalid) throw new HttpError(400, 'O arquivo do fluxo padrão está inválido');
  return { main: entry.workflow, ...resolveTools(entry.workflow, all) };
}

function validateWorkflow(workflow) {
  if (!Array.isArray(workflow?.nodes) || typeof workflow.connections !== 'object') {
    throw new HttpError(400, 'Arquivo não parece um fluxo exportado do n8n (faltam nodes/connections)');
  }
  return workflow;
}

const packageWorkflows = (pkg) => [pkg.main, ...pkg.subflows.map((s) => s.workflow)];

// ---------- Inventário das contas ----------

// Lê o que pode aparecer num fluxo: valores (IDs/keys) com nome legível.
async function inventory(wts) {
  const items = [];
  const add = (kind, value, label, extra = {}) => value && items.push({ kind, value: String(value), label: label || String(value), ...extra });

  const panels = (await wts.getAll('/crm/v2/panel', { IncludeDetails: 'Steps' })).filter((x) => !x.archived);
  for (const p of panels) {
    add('panel', p.id, p.title);
    for (const s of (p.steps ?? []).filter((x) => !x.archived)) add('step', s.id, s.title, { panelId: p.id, group: p.title });
  }
  for (const p of panels) {
    const fields = (await wts.get(`/crm/v1/panel/${p.id}/custom-fields`)) ?? [];
    for (const f of fields) {
      add('field', f.key, f.name, { panelId: p.id, group: p.title, fieldId: f.id });
      add('field', f.id, f.name, { panelId: p.id, group: p.title, isId: true });
    }
  }

  for (const f of (await wts.get('/core/v1/contact/custom-field')) ?? []) {
    add('contactField', f.key, f.name);
    add('contactField', f.id, f.name, { isId: true });
  }

  for (const b of (await wts.getAll('/chat/v1/chatbot')).filter((x) => !x.archived)) {
    add('bot', b.key, b.name);
    add('bot', b.id, b.name, { isId: true });
  }
  for (const t of (await wts.get('/core/v1/tag')) ?? []) add('tag', t.id, t.name);
  for (const d of (await wts.get('/core/v2/department')) ?? []) add('department', d.id, d.name);
  for (const s of await wts.getAll('/chat/v1/sequence')) add('sequence', s.id, s.name);
  const agents = (await wts.get('/core/v1/agent')) ?? [];
  for (const a of agents) {
    add('agent', a.id, a.name);
    add('agent', a.userId, a.name, { isUserId: true });
  }
  const channels = (await wts.get('/chat/v1/channel')) ?? [];
  for (const c of channels) add('channel', c.id, c.identity?.displayName || c.numberFormatted || c.number);
  return {
    items,
    agents: agents.map((a) => ({ name: a.name, userId: a.userId, email: a.email })),
    channels: channels.map((c) => ({
      id: c.id,
      name: c.identity?.displayName || c.identity?.humanId || '',
      number: String(c.number ?? '').replace(/\D/g, ''),
      numberFormatted: c.numberFormatted || c.number || '',
      type: c.type,
      active: c.active,
    })),
  };
}

function countOccurrences(text, item) {
  if (UUID_LIKE.test(item.value)) return text.split(item.value).length - 1;
  if (item.value.length < MIN_KEY_LENGTH) return 0;
  return (text.match(keyPattern(item.value)) ?? []).length;
}

// ---------- Leitura do fluxo ----------

function walkStrings(value, visit) {
  if (typeof value === 'string') visit(value);
  else if (Array.isArray(value)) value.forEach((v) => walkStrings(v, visit));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => walkStrings(v, visit));
}

// IDs de outra conta reconhecidos pelo campo em que aparecem (ex.: um fluxo
// exportado de um cliente, não da conta modelo). O campo diz o tipo.
const CONTEXT_KINDS = {
  botkey: { kind: 'bot' },
  botid: { kind: 'bot', isId: true },
  newdepartmentid: { kind: 'department' },
  departmentid: { kind: 'department' },
  stepid: { kind: 'step' },
  panelid: { kind: 'panel' },
  newuserid: { kind: 'agent', isUserId: true },
  userid: { kind: 'agent', isUserId: true },
  responsibleuserid: { kind: 'agent', isUserId: true },
  sequenceid: { kind: 'sequence' },
  tagid: { kind: 'tag' },
  channelid: { kind: 'channel' },
};
const CONTEXT_RE = new RegExp(`["']?(${Object.keys(CONTEXT_KINDS).join('|')})["']?\\s*[:=]\\s*["']?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`, 'gi');

function contextualIds(workflows) {
  const found = new Map();
  const hit = (key, value) => {
    const info = CONTEXT_KINDS[key.toLowerCase()];
    if (!info) return;
    const entry = found.get(value) ?? { value, key, ...info, count: 0 };
    entry.count += 1;
    found.set(value, entry);
  };
  for (const wf of workflows) {
    const visit = (node) => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== 'object') return;
      // Parâmetros "Name/Value" do nó HTTP (query, headers, body).
      if (typeof node.name === 'string' && typeof node.value === 'string' && UUID_LIKE.test(node.value.trim())) hit(node.name, node.value.trim());
      Object.values(node).forEach(visit);
    };
    visit(wf.nodes);
    walkStrings(wf.nodes, (s) => {
      for (const m of s.matchAll(CONTEXT_RE)) hit(m[1], m[2]);
    });
  }
  return [...found.values()];
}

// Números de WhatsApp de origem ("from") usados nos envios.
function senderNumbers(workflows) {
  const found = new Map();
  for (const wf of workflows) {
    for (const node of wf.nodes) {
      walkStrings(node.parameters, (s) => {
        for (const m of s.matchAll(/["']from["']\s*:\s*["']\+?(\d{10,13})["']/g)) {
          const entry = found.get(m[1]) ?? { from: m[1], count: 0, nodes: [] };
          entry.count += 1;
          if (!entry.nodes.includes(node.name)) entry.nodes.push(node.name);
          found.set(m[1], entry);
        }
      });
    }
  }
  return [...found.values()];
}

// Keys de campos personalizados escritas no body ("customFields": { "key": ... }).
// Pelo endpoint do nó: /contact → campo de contato; senão campo de painel.
function contextualFieldKeys(workflows) {
  const found = new Map();
  for (const wf of workflows) {
    for (const node of wf.nodes) {
      const kind = /\/contact/.test(String(node.parameters?.url ?? '')) ? 'contactField' : 'field';
      walkStrings(node.parameters, (s) => {
        for (const m of s.matchAll(/["']customFields["']\s*:\s*\{\s*["']([\w-]{2,80})["']/g)) {
          const entry = found.get(m[1]) ?? { value: m[1], key: 'customFields', kind, count: 0 };
          entry.count += 1;
          found.set(m[1], entry);
        }
      });
    }
  }
  return [...found.values()];
}

// Planilhas do Google usadas pelos nós (a planilha do cliente é outra).
const SHEETS_TYPE = 'n8n-nodes-base.googleSheets';
const sheetDoc = (node) => {
  const ref = node.parameters?.documentId;
  return typeof ref === 'object' ? ref?.value : ref;
};
function googleSheets(workflows) {
  const docs = new Map();
  for (const wf of workflows) {
    for (const node of wf.nodes.filter((n) => n.type === SHEETS_TYPE && sheetDoc(n))) {
      const doc = String(sheetDoc(node));
      const entry = docs.get(doc) ?? { documentId: doc, nodes: [], sheetNames: [] };
      entry.nodes.push(node.name);
      const sheet = node.parameters.sheetName;
      const sheetName = typeof sheet === 'object' ? sheet?.cachedResultName || (sheet?.mode === 'name' ? sheet.value : '') : '';
      if (sheetName && !entry.sheetNames.includes(sheetName)) entry.sheetNames.push(sheetName);
      docs.set(doc, entry);
    }
  }
  return [...docs.values()];
}

// Token do WTS escrito direto num nó (sem credencial): é trocado pelo do cliente.
const TOKEN_RE = /pn_[A-Za-z0-9]{20,}|__TOKEN_WTS_CLIENTE__/g;
// Inclui o token da conta modelo, qualquer que seja o formato dele.
const tokenPattern = (modelToken) => (modelToken
  ? new RegExp(`${escapeRe(modelToken)}|${TOKEN_RE.source}`, 'g')
  : new RegExp(TOKEN_RE.source, 'g'));

// Base das URLs de webhook do n8n (para mostrar a URL completa a configurar no WTS).
export const WEBHOOK_BASE = () => (process.env.N8N_WEBHOOK_BASE || 'https://webhooks.tedyleads.com.br/webhook/').replace(/\/?$/, '/');

const webhookPathsOf = (workflows) => workflows.flatMap((wf) => wf.nodes
  // O webhook de configuração do rotativo é só da página: não aparece para trocar nem configurar.
  .filter((n) => n.type === WEBHOOK_TYPE && typeof n.parameters?.path === 'string' && !isRotativoConfigPath(n.parameters.path))
  .map((n) => ({ workflow: wf.name, node: n.name, path: n.parameters.path, url: `${WEBHOOK_BASE()}${n.parameters.path}` })));

// ---------- Varredura (o que trocar) ----------

export async function scanTemplate(pkg, { model, client, modelToken, modelSlug }) {
  const workflows = packageWorkflows(pkg);
  const text = JSON.stringify(workflows);

  // Contas diferentes têm limites de requisição separados: dá para ler em paralelo.
  const [modelInv, clientInv] = await Promise.all([inventory(model), inventory(client)]);
  const modelItems = modelInv.items;
  const clientItems = clientInv.items;

  const found = modelItems
    .map((item) => ({ ...item, count: countOccurrences(text, item) }))
    .filter((item) => item.count > 0);

  const options = {};
  const idOptions = {};
  for (const item of clientItems) {
    if (item.isId || item.isUserId) {
      const suffix = item.isUserId ? ' · userId' : ' · ID';
      (idOptions[item.kind] ??= []).push({ value: item.value, label: `${item.label}${suffix}`, name: item.label, group: item.group, panelId: item.panelId });
    } else {
      (options[item.kind] ??= []).push({ value: item.value, label: item.label, group: item.group, panelId: item.panelId });
    }
  }
  const clientByKind = (kind, pred = () => true) => clientItems.filter((i) => i.kind === kind && pred(i));

  // Painel do cliente sugerido para cada painel do modelo (pelo título).
  const panelMatch = {};
  const modelPanelTitle = (id) => modelItems.find((i) => i.kind === 'panel' && i.value === id)?.label;
  for (const ref of found) {
    const panelId = ref.kind === 'panel' ? ref.value : ref.panelId;
    if (!panelId || panelId in panelMatch) continue;
    panelMatch[panelId] = clientByKind('panel', (c) => normalizeName(c.label) === normalizeName(modelPanelTitle(panelId)))[0]?.value ?? null;
  }

  // Um mesmo valor pode vir de dois itens (ex.: chatbot com ID igual à key): mostra uma vez.
  const seenValues = new Set();
  const references = found
    .filter((ref) => !seenValues.has(ref.value) && seenValues.add(ref.value))
    .map((ref) => {
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
        modelPanelId: ref.panelId ?? null,
        suggestion: match?.value ?? null,
      };
    });

  // IDs que não são da conta modelo (fluxo exportado de outra conta).
  for (const ctx of contextualIds(workflows)) {
    if (seenValues.has(ctx.value)) continue;
    seenValues.add(ctx.value);
    references.push({
      kind: ctx.kind,
      kindLabel: KIND_LABEL[ctx.kind],
      from: ctx.value,
      label: `ID de outra conta (campo ${ctx.key})`,
      count: ctx.count,
      isId: Boolean(ctx.isId || ctx.isUserId),
      modelPanelId: null,
      suggestion: null,
      external: true,
    });
  }

  // Keys de campos personalizados no body que não vieram da conta modelo.
  for (const ctx of contextualFieldKeys(workflows)) {
    if (seenValues.has(ctx.value)) continue;
    seenValues.add(ctx.value);
    references.push({
      kind: ctx.kind,
      kindLabel: KIND_LABEL[ctx.kind],
      from: ctx.value,
      label: `Key "${ctx.value}" (campo personalizado)`,
      count: (text.match(keyPattern(ctx.value)) ?? []).length,
      isId: false,
      modelPanelId: null,
      suggestion: (options[ctx.kind] ?? []).find((o) => o.value === ctx.value)?.value ?? null,
      external: true,
    });
  }

  const sheets = googleSheets(workflows);
  return {
    references,
    options,
    idOptions,
    hasModelToken: Boolean(modelToken && text.includes(modelToken)),
    hardcodedTokens: (text.match(tokenPattern(modelToken)) ?? []).length,
    sheets,
    // Rotativo: a página mostra os usuários do cliente para ligar e ordenar.
    rotativo: JSON.stringify(pkg.main).includes(ROTATIVO_MARK),
    credentials: listCredentials(workflows),
    agentNodes: pkg.main.nodes.filter((n) => AGENT_NODE_TYPES.includes(n.type)).map((n) => n.name),
    hasPromptPlaceholder: JSON.stringify(pkg.main).includes(PROMPT_PLACEHOLDER),
    slug: { ...scanSlug(text, resolveModelSlug(modelSlug)), webhookPaths: webhookPathsOf(workflows) },
    phones: senderNumbers(workflows),
    channels: clientInv.channels,
    subflows: pkg.subflows.map((s) => ({ name: s.workflow.name, nodes: s.workflow.nodes.length })),
    missingTools: pkg.missing.map((m) => ({ name: m.name || m.node, node: m.node, id: m.id })),
  };
}

function scanSlug(text, modelSlug) {
  return { modelSlug, count: (text.match(slugPattern(modelSlug)) ?? []).length };
}

// ---------- Credenciais ----------

// Credencial do WTS = a usada por nós que chamam api.wts.chat. Outras (OpenAI,
// Redis...) não são tocadas.
const callsWts = (node) => JSON.stringify(node.parameters ?? {}).includes('api.wts.chat');
const credKey = (type, cred) => `${type}:${cred?.id || cred?.name}`;

function listCredentials(workflows) {
  const seen = new Map();
  for (const wf of workflows) {
    for (const node of wf.nodes) {
      for (const [type, cred] of Object.entries(node.credentials ?? {})) {
        const key = credKey(type, cred);
        if (!seen.has(key)) seen.set(key, { type, name: cred?.name ?? '', nodes: [], wts: false });
        const entry = seen.get(key);
        entry.nodes.push(node.name);
        if (callsWts(node)) entry.wts = true;
      }
    }
  }
  return [...seen.values()];
}

function wtsCredentialKeys(workflow) {
  const keys = new Set();
  for (const node of workflow.nodes) {
    if (!callsWts(node)) continue;
    for (const [type, cred] of Object.entries(node.credentials ?? {})) keys.add(credKey(type, cred));
  }
  return keys;
}

// Troca a credencial do WTS em todos os nós que a usam. Sem `credential`
// (download), fica só o nome: se o n8n já tiver uma credencial com esse nome,
// liga sozinho; senão o nó pede para escolher. Nunca mantém o ID da conta de
// origem, que na mesma instância faria o fluxo agir na conta errada.
function swapWtsCredentials(workflow, credential, fallbackName, onlyNodes) {
  const keys = wtsCredentialKeys(workflow);
  const swapped = [];
  for (const node of workflow.nodes) {
    if (onlyNodes && !onlyNodes.includes(node.name)) continue;
    for (const [type, cred] of Object.entries(node.credentials ?? {})) {
      if (!keys.has(credKey(type, cred))) continue;
      node.credentials[type] = credential ? { id: credential.id, name: credential.name } : { name: fallbackName };
      swapped.push(node.name);
    }
  }
  return swapped;
}

// Alternativa sem credencial: header "Authorization: Bearer <token>" direto nos
// nós HTTP que usavam a credencial do WTS. Funciona no download/copiar, mas o
// token fica dentro do fluxo (e do arquivo baixado).
function putTokenInHeaders(workflow, token) {
  const keys = wtsCredentialKeys(workflow);
  const changed = [];
  const skipped = [];
  for (const node of workflow.nodes) {
    const types = Object.entries(node.credentials ?? {}).filter(([type, cred]) => keys.has(credKey(type, cred))).map(([type]) => type);
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

// Padrões do time no n8n:
//   "[Tipo do fluxo] Nome da conta"  → troca o nome da conta
//   "[nome empresa Exemplo] I.A"     → troca o colchete pelo nome da conta
function workflowName(templateName, clientName) {
  const original = String(templateName ?? '');
  if (NAME_PLACEHOLDER.test(original)) {
    NAME_PLACEHOLDER.lastIndex = 0;
    return original.replace(NAME_PLACEHOLDER, `[${clientName}]`).replace(/\s+/g, ' ').trim();
  }
  NAME_PLACEHOLDER.lastIndex = 0;
  const prefix = original.match(/^\s*(\[[^\]]+\])/)?.[1];
  if (prefix) return `${prefix} ${clientName}`;
  return `${original || 'Fluxo'} – ${clientName}`;
}

const SLUG_PATH_RE = /^[\w/-]{1,200}$/;
const DIGITS_RE = /^\d{8,15}$/;

export function buildWorkflow(workflow, options = {}) {
  const {
    mapping, clientName, prompt, modelToken, clientToken, replaceToken, clientSlug, modelSlug,
    credential, auth = 'credential', phoneMapping, webhookPaths, sheetMapping, isMain = true, rotativo,
  } = options;
  let text = JSON.stringify(workflow);
  const applied = [];
  const warnings = [];
  const name = String(clientName ?? '').trim().slice(0, 80);

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

  // Rotativo: equipe do cliente e ordem escolhida na página.
  text = fillRotativo(text, rotativo ?? {});

  // Número do WhatsApp de origem dos envios.
  for (const p of Array.isArray(phoneMapping) ? phoneMapping : []) {
    if (!DIGITS_RE.test(String(p?.from)) || !p?.to) continue;
    const to = String(p.to).replace(/\D/g, '');
    if (!DIGITS_RE.test(to)) throw new HttpError(400, `Número inválido para substituir ${p.from}`);
    text = text.replace(digitsPattern(p.from), to);
  }

  // "[nome empresa Exemplo]" em nomes de fluxos e de tools vira o nome do cliente.
  if (name) text = text.replace(NAME_PLACEHOLDER, JSON.stringify(`[${name}]`).slice(1, -1));

  // Planilhas do Google: link da planilha do cliente no lugar da de origem.
  const sheetLinks = new Map();
  for (const s of Array.isArray(sheetMapping) ? sheetMapping : []) {
    if (typeof s?.from !== 'string' || typeof s?.to !== 'string' || !s.to.trim()) continue;
    const to = s.to.trim();
    if (!/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]+/.test(to)) throw new HttpError(400, 'Link de planilha inválido: use o link do Google Planilhas (docs.google.com/spreadsheets/...)');
    sheetLinks.set(s.from, to);
  }

  // Token do WTS escrito direto nos nós (de qualquer conta): vira o do cliente.
  const hardcoded = text.match(tokenPattern(modelToken)) ?? [];
  if (hardcoded.length) {
    if (!clientToken) throw new HttpError(400, 'O fluxo tem token do WTS escrito nos nós: informe o token da conta do cliente');
    text = text.replace(tokenPattern(modelToken), clientToken);
  }

  const result = JSON.parse(text);
  for (const node of result.nodes.filter((n) => n.type === SHEETS_TYPE)) {
    const doc = sheetDoc(node);
    if (!doc || !sheetLinks.has(String(doc))) continue;
    node.parameters.documentId = { __rl: true, value: sheetLinks.get(String(doc)), mode: 'url' };
    // Abas pelo nome: o número interno (gid) muda em outra planilha.
    const sheet = node.parameters.sheetName;
    if (sheet && typeof sheet === 'object' && sheet.mode !== 'name' && sheet.cachedResultName) {
      node.parameters.sheetName = { __rl: true, value: sheet.cachedResultName, mode: 'name' };
    }
  }
  if (hardcoded.length) warnings.push(`Token do cliente colocado em ${hardcoded.length} lugar(es) onde o token estava escrito direto no nó.`);
  if (name) result.name = workflowName(workflow.name, name);
  else if (isMain) warnings.push('Sem nome do cliente: o fluxo ficou com o nome do fluxo padrão.');

  // Cópia nova: sem ID do fluxo original, sem dados de teste (pinData pode ter
  // nome/telefone de contatos reais) e com webhooks próprios, senão a ativação
  // conflita com o fluxo de origem na mesma instância.
  delete result.id;
  delete result.versionId;
  delete result.active;
  result.pinData = {};
  if (result.meta) delete result.meta.instanceId;
  for (const node of result.nodes) {
    if (!node.webhookId) continue;
    const fresh = crypto.randomUUID();
    if (node.parameters?.path === node.webhookId) node.parameters.path = fresh;
    node.webhookId = fresh;
  }
  for (const node of result.nodes.filter((n) => n.type === WEBHOOK_TYPE)) {
    const path = webhookPaths?.[node.name];
    if (path === undefined || path === '') continue;
    if (!SLUG_PATH_RE.test(path)) throw new HttpError(400, `Path inválido para o webhook "${node.name}"`);
    node.parameters.path = path;
  }

  let credentialNodes = 0;
  let headerNodes = 0;
  if (auth === 'header') {
    if (!clientToken) throw new HttpError(400, 'Informe o token da conta do cliente para colocar nos nós');
    const { changed, skipped } = putTokenInHeaders(result, clientToken);
    headerNodes = changed.length;
    if (skipped.length) {
      // Nesses nós a credencial de origem não pode ficar: troca pelo nome do cliente.
      credentialNodes = swapWtsCredentials(result, null, name || 'WTS cliente', skipped).length;
      warnings.push(`Estes nós usam cabeçalhos em JSON e não receberam o token: ${skipped.join(', ')}. Ajuste a autenticação deles no n8n.`);
    }
  } else {
    const credentialName = name || 'WTS cliente';
    const swapped = swapWtsCredentials(result, credential, credentialName);
    credentialNodes = swapped.length;
    if (swapped.length && !credential) {
      warnings.push(`Credencial: ${swapped.length} nó(s) do WTS em "${result.name}" ficaram apontando para a credencial "${credentialName}". Se ela já existir no n8n, liga sozinha; senão crie (Header Auth, Name: Authorization, Value: Bearer + token do cliente) e selecione nesses nós.`);
    }
  }

  if (isMain && typeof prompt === 'string' && prompt.trim()) {
    const outcome = insertPrompt(result, prompt.trim());
    if (!outcome.inserted) warnings.push('Não achei onde colocar o prompt (nem {{PROMPT_CLIENTE}} nem nó de AI Agent). Cole manualmente.');
    if (outcome.sanitized) warnings.push('O prompt tinha chaves duplas {{ }}, que o n8n entenderia como código: foram separadas em "{ {".');
  }

  return {
    workflow: result,
    applied,
    warnings,
    slugReplaced: slugCount,
    webhookPaths: webhookPathsOf([result]),
    credentialNodes,
    headerNodes,
  };
}

// No System Message do agente, o bloco do topo (informações do contato com
// expressões do n8n, até a primeira linha "---") é mantido; o resto vira o
// prompt do cliente.
// Bloco "Informações do contato" no topo do prompt: tudo até a primeira linha
// "---", quando tem expressões do n8n ({{ }}).
function splitHeader(text) {
  const cut = typeof text === 'string' ? text.indexOf('\n---\n') : -1;
  if (cut <= 0 || !text.slice(0, cut).includes('{{')) return { header: '', body: text ?? '' };
  return { header: text.slice(0, cut + 5), body: text.slice(cut + 5) };
}

function insertPrompt(workflow, rawPrompt) {
  // O prompt montado já vem com o bloco de variáveis: ele é descartado aqui e
  // o do próprio fluxo é mantido (é o que o n8n entende). Só o corpo é trocado.
  const { header: promptHeader, body: rawBody } = splitHeader(rawPrompt);
  const sanitized = /\{\{|\}\}/.test(rawBody);
  const prompt = rawBody.replace(/\{\{/g, '{ {').replace(/\}\}/g, '} }');
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
  if (inserted) return { inserted, sanitized };

  for (const node of workflow.nodes.filter((n) => AGENT_NODE_TYPES.includes(n.type))) {
    node.parameters ??= {};
    node.parameters.options ??= {};
    const { header: flowHeader } = splitHeader(node.parameters.options.systemMessage);
    // Sem bloco no fluxo, usa o do prompt (com "=" para o n8n avaliar as expressões).
    const header = flowHeader || (promptHeader ? `=${promptHeader}` : '');
    node.parameters.options.systemMessage = header ? `${header}${prompt}` : prompt;
    inserted = true;
  }
  return { inserted, sanitized };
}

// Liga os nós de tool do fluxo principal aos subfluxos gerados.
function linkTools(main, links) {
  const unlinked = [];
  for (const node of main.nodes.filter((n) => n.type === TOOL_WORKFLOW_TYPE)) {
    const ref = node.parameters?.workflowId;
    const oldId = typeof ref === 'object' ? ref?.value : ref;
    if (!oldId || !(oldId in links)) continue;
    const link = links[oldId];
    node.parameters.workflowId = {
      __rl: true,
      value: link.id ?? '',
      mode: 'list',
      cachedResultName: link.name,
    };
    if (!link.id) unlinked.push({ node: node.name, name: link.name });
  }
  return unlinked;
}

/**
 * Gera o pacote: subfluxos primeiro, depois o principal ligado a eles.
 * `createSub` (opcional) cria cada subfluxo no n8n e devolve { id };
 * sem ele (download), os nós de tool ficam para escolher no n8n.
 */
export async function buildPackage(pkg, options, { createSub } = {}) {
  const subs = [];
  const links = {};
  for (const sub of pkg.subflows) {
    const built = buildWorkflow(sub.workflow, { ...options, prompt: '', isMain: false });
    let created = null;
    if (createSub) created = await createSub(built.workflow);
    links[sub.originalId] = { id: created?.id ?? null, name: built.workflow.name };
    subs.push({ role: 'sub', file: sub.file, ...built, created });
  }
  // Tools que não estão nos fluxos padrão: limpa a referência à conta de origem.
  for (const missing of pkg.missing) links[missing.id] ??= { id: null, name: missing.name };

  const main = buildWorkflow(pkg.main, { ...options, isMain: true });
  const unlinked = linkTools(main.workflow, links);
  const warnings = [...main.warnings, ...subs.flatMap((s) => s.warnings)];
  if (unlinked.length) {
    warnings.push(`No n8n, abra o fluxo principal e escolha o subfluxo em: ${unlinked.map((u) => `${u.node} → "${u.name}"`).join('; ')}.`);
  }
  if (pkg.missing.length) {
    warnings.push(`Subfluxo(s) não incluído(s) nos fluxos padrão: ${pkg.missing.map((m) => m.name || m.node).join(', ')}. Crie no n8n e selecione no nó da tool.`);
  }

  return {
    ...main,
    role: 'main',
    warnings: [...new Set(warnings)],
    workflows: [{ role: 'main', name: main.workflow.name, workflow: main.workflow }, ...subs.map((s) => ({ role: 'sub', name: s.workflow.name, workflow: s.workflow, created: s.created }))],
    credentialNodes: main.credentialNodes + subs.reduce((n, s) => n + s.credentialNodes, 0),
    headerNodes: main.headerNodes + subs.reduce((n, s) => n + s.headerNodes, 0),
    applied: [...new Set([...main.applied, ...subs.flatMap((s) => s.applied)])],
    webhookPaths: [...main.webhookPaths, ...subs.flatMap((s) => s.webhookPaths)],
  };
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
  }, `o fluxo "${workflow.name}"`);
  return { id: data.id, name: workflow.name, url: `${n8nBase()}/workflow/${data.id}` };
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
