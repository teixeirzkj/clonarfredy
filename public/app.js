'use strict';

// Ícones estáticos (sem dados do usuário), traço de 24px.
const ICONS = {
  tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  team: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  userPlus: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  webhook: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 17h5"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/>',
  kanban: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
  flow: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 10v4a3 3 0 0 0 3 3H14"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h6M7 14h3"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
  minus: '<path d="M6 12h12"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/>',
  play: '<path d="M7 5l12 7-12 7z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15l-3-3c1.5-5 5.5-9 13-9 0 7.5-4 11.5-9 13z"/><circle cx="15" cy="9" r="1.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1 0 8z"/>',
};

const SETUP_ALL_BLOCKS = ['tags', 'departments', 'webhooks'];

const SECTIONS = [
  {
    title: 'Configurar automaticamente',
    blocks: [
      { id: 'tags', kind: 'sync', icon: 'tag', title: 'Etiquetas padrão', desc: 'Copia as etiquetas da conta modelo, pulando as que já existem.' },
      { id: 'departments', kind: 'sync', icon: 'team', title: 'Equipes padrão', desc: 'Cria as equipes do modelo com as mesmas regras de distribuição.' },
      { id: 'agents', kind: 'agents', icon: 'userPlus', title: 'Usuários', desc: 'Cadastra usuários na conta a partir de um formulário.' },
      { id: 'webhooks', kind: 'sync', icon: 'webhook', title: 'Webhooks padrão', desc: 'Assina os mesmos eventos e URLs dos webhooks do modelo.' },
    ],
  },
  {
    title: 'n8n e IA',
    blocks: [
      { id: 'n8n', kind: 'n8n', icon: 'flow', title: 'Fluxos do n8n', desc: 'Gera os fluxos padrão já com painel, etapas, bot key e campos do cliente.' },
      { id: 'prompt', kind: 'prompt', icon: 'sparkle', title: 'Montar prompt da IA', desc: 'Adapta o prompt padrão com as respostas do cliente.' },
    ],
  },
  {
    title: 'Conferir (somente leitura)',
    blocks: [
      { id: 'templates', kind: 'check', icon: 'message', title: 'Modelos de mensagem', desc: 'Compara os modelos (templates) do modelo com os do cliente.' },
      { id: 'panels', kind: 'check', icon: 'kanban', title: 'Painéis e etapas', desc: 'Confere painéis do CRM e se todas as etapas existem.' },
      { id: 'chatbots', kind: 'check', icon: 'bot', title: 'Chatbots', desc: 'Lista os chatbots do modelo que faltam no cliente.' },
      { id: 'sequences', kind: 'check', icon: 'repeat', title: 'Sequências', desc: 'Lista as sequências do modelo que faltam no cliente.' },
      { id: 'fields', kind: 'check', icon: 'form', title: 'Campos personalizados', desc: 'Confere campos de contato e de painel.' },
    ],
  },
];

// Consultas rápidas (botões): listam dados da conta do token informado.
const LOOKUPS = [
  { id: 'panels', icon: 'kanban', title: 'Painéis e etapas', desc: 'IDs de painéis e StepIds' },
  { id: 'panelFields', icon: 'form', title: 'Campos do painel', desc: 'Keys dos campos personalizados', needsPanel: true },
  { id: 'cards', icon: 'card', title: 'Cards', desc: 'Últimos cards de um painel', needsPanel: true },
  { id: 'lostReasons', icon: 'ban', title: 'Motivos de perda', desc: 'IDs dos motivos', needsPanel: true },
  { id: 'agents', icon: 'user', title: 'Usuários', desc: 'IDs e userIds' },
  { id: 'departments', icon: 'team', title: 'Equipes', desc: 'IDs das equipes' },
  { id: 'tags', icon: 'tag', title: 'Etiquetas', desc: 'IDs das etiquetas' },
  { id: 'chatbots', icon: 'bot', title: 'Chatbots', desc: 'Bot keys' },
  { id: 'sequences', icon: 'repeat', title: 'Sequências', desc: 'IDs das sequências' },
  { id: 'templates', icon: 'message', title: 'Modelos', desc: 'IDs dos templates' },
  { id: 'channels', icon: 'phone', title: 'Canais', desc: 'IDs e números' },
  { id: 'contactFields', icon: 'form', title: 'Campos do contato', desc: 'Keys dos campos' },
  { id: 'portfolios', icon: 'wallet', title: 'Carteiras', desc: 'IDs das carteiras' },
  { id: 'webhooks', icon: 'webhook', title: 'Webhooks', desc: 'Assinaturas ativas' },
];

const BLOCK_BY_ID = Object.fromEntries(SECTIONS.flatMap((s) => s.blocks).map((b) => [b.id, b]));
const SETUP_ALL = { id: 'setupAll', kind: 'setupAll', title: 'Configurar tudo', desc: 'Etiquetas, equipes e webhooks padrão de uma vez.' };

const APPLY_BATCH = 8;
const SESSION_KEY = 'setup-session';
const PROMPT_KEY = 'setup-prompt-padrao';
const PROFILES = [['Agent', 'Atendente'], ['Admin', 'Administrador'], ['RestrictedAgent', 'Atendente restrito']];
const TOKEN_STATUS = { empty: 'Não informado', pending: 'Não verificado', ok: 'Conta verificada', error: 'Token com problema' };

const state = {
  session: null,
  status: {}, // blockId -> { tone, text }
  view: 'grid',
  busy: false,
  clientName: '',
  builtPrompt: '',
  uploadedTemplate: null, // { name, workflow }
  lastPanelId: '',
};

const $ = (id) => document.getElementById(id);

// ---------- Movimento ----------
// Princípios do Motion/Framer (initial → animate, stagger, spring) via Web
// Animations API. Só transform/opacity; desligado com "reduzir movimento".

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

function enter(el, { y = 10, scale = 1, delay = 0, duration = 340, easing = EASE_OUT } = {}) {
  if (!el?.animate || reducedMotion.matches) return;
  el.animate(
    [{ opacity: 0, transform: `translateY(${y}px) scale(${scale})` }, { opacity: 1, transform: 'none' }],
    { duration, delay, easing, fill: 'backwards' },
  );
}

function stagger(elements, { step = 35, max = 14, ...options } = {}) {
  [...elements].forEach((el, i) => enter(el, { ...options, delay: Math.min(i, max) * step }));
}

function pop(el) {
  if (!el?.animate || reducedMotion.matches) return;
  el.animate([{ transform: 'scale(0.7)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300, easing: SPRING });
}

// Onda a partir do ponto do clique em botões, cards e chips.
function ripple(event) {
  const target = event.target.closest('.btn, .card, .chip, .hero');
  if (!target || target.disabled || reducedMotion.matches) return;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const wave = document.createElement('span');
  wave.className = 'ripple';
  wave.style.width = wave.style.height = `${size}px`;
  wave.style.left = `${event.clientX - rect.left - size / 2}px`;
  wave.style.top = `${event.clientY - rect.top - size / 2}px`;
  target.append(wave);
  wave.animate([{ transform: 'scale(0)', opacity: 0.25 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600, easing: EASE_OUT })
    .finished.then(() => wave.remove(), () => wave.remove());
}

// ---------- DOM ----------

// Cria elementos sem innerHTML para qualquer dado vindo da API.
function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
    else if (key in el && key !== 'list') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

function svg(name) {
  const span = document.createElement('span');
  span.innerHTML = `<svg class="i-${name}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
  return span.firstChild;
}

const badge = (tone, text, extra = '') => h('span', { class: `badge ${tone ?? ''} ${extra}` }, text);
const button = (label, onclick, { variant = '', icon, ...props } = {}) =>
  h('button', { type: 'button', class: `btn ${variant}`, onclick, ...props }, icon && svg(icon), h('span', {}, label));
const setLabel = (btn, text) => { btn.lastChild.textContent = text; };

function notice(text, tone = '') {
  const icons = { info: 'info', ok: 'check', warn: 'alert' };
  return h('div', { class: `notice ${tone}`, role: tone ? 'status' : 'alert' }, svg(icons[tone] ?? 'alert'), h('span', {}, text));
}

function loading(text) {
  return h('div', {},
    h('div', { class: 'loading', role: 'status' }, h('span', { class: 'spinner' }), text),
    h('div', { class: 'skeleton', 'aria-hidden': 'true' }, h('span'), h('span'), h('span')));
}

function stats(items) {
  const values = {};
  const el = h('div', { class: 'stats' }, items.map(({ id, label, tone = '' }) => {
    values[id] = h('span', { class: 'stat-value' }, '0');
    return h('div', { class: `stat ${tone}` }, values[id], h('span', { class: 'stat-label' }, label));
  }));
  el.set = (id, value) => {
    if (values[id].textContent === String(value)) return;
    values[id].textContent = value;
    pop(values[id]);
  };
  return el;
}

function swap(container, ...children) {
  // Ignora condicionais falsas (null, false, 0) usadas na montagem.
  container.replaceChildren(...children.flat().filter((c) => c instanceof Node || (typeof c === 'string' && c)));
  enter(container, { y: 6, duration: 260 });
}

function section(number, title, ...children) {
  return h('div', { class: 'panel-section' }, h('h3', {}, number && h('span', { class: 'step-num' }, number), title), ...children);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para iframes sem permissão de clipboard.
    const area = h('textarea', { value: text, readOnly: true });
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

function copyButton(value) {
  const btn = h('button', { type: 'button', class: 'copy', title: 'Copiar' }, h('span', {}, value), svg('copy'));
  btn.onclick = async () => {
    if (!(await copyText(value))) return;
    btn.classList.add('copied');
    btn.replaceChildren(h('span', {}, 'Copiado!'), svg('check'));
    pop(btn);
    setTimeout(() => { btn.classList.remove('copied'); btn.replaceChildren(h('span', {}, value), svg('copy')); }, 1400);
  };
  return btn;
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = h('a', { href: url, download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const slug = (text) => String(text || 'cliente').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

// ---------- Sessão e API ----------

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
    if (saved?.token && saved.expiresAt > Date.now()) return saved;
  } catch { /* storage indisponível: pede a senha de novo */ }
  return null;
}

function saveSession(session) {
  state.session = session;
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch { /* segue só em memória */ }
}

class ApiError extends Error {}

const authHeaders = () => ({ 'Content-Type': 'application/json', ...(state.session && { 'X-Session-Token': state.session.token }) });

function expireSession() {
  saveSession(null);
  state.busy = false;
  showLogin('Sessão expirada. Entre novamente.');
  return new ApiError('Sessão expirada');
}

async function api(path, body) {
  let res;
  try {
    res = await fetch(`/api/${path}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body ?? {}) });
  } catch {
    throw new ApiError('Sem conexão com o servidor. Verifique a internet e tente de novo.');
  }
  let data = {};
  try {
    data = await res.json();
  } catch { /* resposta sem JSON */ }

  if (res.status === 401 && path !== 'login') throw expireSession();
  if (!res.ok) {
    const error = new ApiError(data.error || `Erro ${res.status}`);
    if (/conta (do )?cliente|própria conta modelo/i.test(error.message)) setTokenStatus('error');
    throw error;
  }
  return data;
}

function clientToken() {
  return $('client-token').value.trim();
}

function setTokenStatus(status) {
  const el = $('token-status');
  if (el.dataset.state === status) return;
  el.dataset.state = status;
  el.textContent = TOKEN_STATUS[status];
  pop(el);
}

function requireToken(container) {
  if (clientToken()) return true;
  swap(container, notice('Informe o token da conta do cliente no campo acima para continuar.', 'info'));
  $('client-token').focus();
  return false;
}

function retry(container, err, again) {
  if (!(err instanceof ApiError) || state.view !== 'block') return;
  swap(container, notice(err.message), h('div', { class: 'toolbar' }, button('Tentar de novo', again, { icon: 'refresh' })));
}

// ---------- Navegação ----------

function setHeader(title, subtitle, withBack) {
  $('modal-title').textContent = title;
  $('modal-subtitle').textContent = subtitle;
  $('back').hidden = !withBack;
}

function showView(name) {
  state.view = name;
  for (const view of ['login', 'grid', 'block']) $(`view-${view}`).hidden = view !== name;
  $('token-bar').hidden = name === 'login';
  $('modal').classList.toggle('is-login', name === 'login');
  $('modal-scroll').scrollTop = 0;
  enter($(`view-${name}`), { y: 8, duration: 300 });
}

function showLogin(message = '') {
  setHeader('Entrar', 'Acesso restrito à equipe Frédy', false);
  showView('login');
  $('login-error').textContent = message;
  $('password').value = '';
  $('password').focus();
}

function showGrid() {
  if (state.busy) return;
  setHeader('Setup da Conta', 'Escolha o que configurar na conta do cliente', false);
  showView('grid');
  renderGrid({ animate: true });
}

function openBlock(block) {
  setHeader(block.title, block.desc, true);
  showView('block');
  const view = $('view-block');
  view.replaceChildren();
  const renderers = {
    sync: renderSyncBlock,
    agents: renderAgentsBlock,
    check: renderCheckBlock,
    setupAll: renderSetupAll,
    lookup: renderLookup,
    n8n: renderN8n,
    prompt: renderPrompt,
  };
  renderers[block.kind]?.(view, block);
}

// ---------- Grade ----------

function statusBadge(block) {
  const status = state.status[block.id];
  return status ? badge(status.tone, status.text) : badge('', 'Pendente');
}

function renderGrid({ animate = false } = {}) {
  const query = $('search').value.trim().toLowerCase();
  const matches = (item) => !query || `${item.title} ${item.desc}`.toLowerCase().includes(query);
  const container = $('sections');
  container.replaceChildren();
  let visible = 0;

  if (matches(SETUP_ALL)) {
    visible += 1;
    container.append(h('button', { type: 'button', class: 'hero', onclick: () => openBlock(SETUP_ALL) },
      h('span', { class: 'hero-icon', 'aria-hidden': 'true' }, svg('rocket')),
      h('span', { class: 'hero-body' },
        h('span', { class: 'hero-title' }, 'Configurar tudo de uma vez'),
        h('span', { class: 'hero-desc' }, 'Cria etiquetas, equipes e webhooks padrão que faltam, com uma prévia antes.')),
      state.status.setupAll ? badge(state.status.setupAll.tone, state.status.setupAll.text) : null,
      h('span', { class: 'hero-arrow', 'aria-hidden': 'true' }, svg('arrow'))));
  }

  for (const sec of SECTIONS) {
    const blocks = sec.blocks.filter(matches);
    if (!blocks.length) continue;
    visible += blocks.length;
    container.append(
      h('h2', { class: 'section-label' }, sec.title, h('span', { class: 'section-count' }, blocks.length)),
      h('div', { class: 'cards' }, blocks.map((block) =>
        h('button', { type: 'button', class: 'card', onclick: () => openBlock(block) },
          h('span', { class: 'card-icon', 'aria-hidden': 'true' }, svg(block.icon)),
          h('span', { class: 'card-body' },
            h('span', { class: 'card-top' }, h('span', { class: 'card-title' }, block.title),
              ['sync', 'agents', 'check'].includes(block.kind) ? statusBadge(block) : null),
            h('span', { class: 'card-desc' }, block.desc))))),
    );
  }

  const lookups = LOOKUPS.filter(matches);
  if (lookups.length) {
    visible += lookups.length;
    container.append(
      h('h2', { class: 'section-label' }, 'Consultar dados da conta', h('span', { class: 'section-count' }, lookups.length)),
      h('div', { class: 'chips' }, lookups.map((lookup) =>
        h('button', { type: 'button', class: 'chip', title: lookup.desc, onclick: () => openBlock({ ...lookup, kind: 'lookup' }) },
          svg(lookup.icon), lookup.title))),
    );
  }

  $('no-results').hidden = visible > 0;
  if (animate) stagger(container.querySelectorAll('.hero, .card, .chip'), { y: 12, scale: 0.98, step: 28, max: 24 });
}

// ---------- Blocos de criação (prévia → confirmação → log) ----------
// "groups" permite a mesma tela para um bloco ou para "Configurar tudo".

const RESULT_BADGE = { created: ['ok', 'Criado'], exists: ['', 'Já existia'], error: ['err', 'Erro'] };

function renderSyncBlock(view, block, input) {
  const body = h('div');
  view.append(body);
  loadPreview(body, [{ block, input }]);
}

async function loadPreview(container, groups) {
  if (!requireToken(container)) return;
  swap(container, loading('Comparando a conta modelo com a conta do cliente...'));
  try {
    const results = await Promise.all(groups.map((g) => api('preview', { block: g.block.id, clientToken: clientToken(), input: g.input })));
    results.forEach((r, i) => { groups[i].items = r.items; });
  } catch (err) {
    retry(container, err, () => loadPreview(container, groups));
    return;
  }
  setTokenStatus('ok');
  renderPreview(container, groups);
}

function renderPreview(container, groups) {
  const multi = groups.length > 1;
  const all = groups.flatMap((g) => g.items.map((item) => ({ ...item, group: g })));
  const toCreate = all.filter((i) => !i.exists);
  const keyOf = (i) => `${i.group.block.id}:${i.key}`;
  const selected = new Set(toCreate.map(keyOf));
  const checkboxes = [];

  const tiles = stats([
    { id: 'create', label: 'Para criar', tone: 'info' },
    { id: 'exists', label: 'Já existem' },
    { id: 'selected', label: 'Selecionados', tone: 'ok' },
  ]);
  const runBtn = button('', null, { variant: 'btn-primary', icon: 'play' });
  const toggleAll = button('Desmarcar todos', null, { variant: 'btn-ghost btn-small', disabled: !toCreate.length });
  const toolbar = h('div', { class: 'toolbar' },
    toggleAll,
    h('span', { class: 'spacer' }),
    button('Atualizar prévia', () => loadPreview(container, groups), { icon: 'refresh' }),
    runBtn);

  function refresh() {
    tiles.set('create', toCreate.length);
    tiles.set('exists', all.length - toCreate.length);
    tiles.set('selected', selected.size);
    setLabel(runBtn, multi ? `Criar tudo (${selected.size})` : `Executar (${selected.size})`);
    runBtn.disabled = selected.size === 0;
    setLabel(toggleAll, selected.size === toCreate.length ? 'Desmarcar todos' : 'Marcar todos');
  }

  toggleAll.onclick = () => {
    const checkAll = selected.size !== toCreate.length;
    for (const { key, checkbox } of checkboxes) {
      checkbox.checked = checkAll;
      checkAll ? selected.add(key) : selected.delete(key);
    }
    refresh();
  };

  runBtn.onclick = () => {
    // Confirmação em dois passos, sem diálogo nativo (bloqueado em alguns iframes).
    const original = [...toolbar.childNodes];
    const cancel = button('Cancelar', () => toolbar.replaceChildren(...original));
    const confirm = button(`Confirmar: criar ${selected.size} item(ns)`, () => {
      const plan = groups.map((g) => ({ ...g, items: g.items.filter((i) => selected.has(`${g.block.id}:${i.key}`)) })).filter((g) => g.items.length);
      runApply(container, plan, groups);
    }, { variant: 'btn-danger', icon: 'check' });
    toolbar.replaceChildren(h('span', { class: 'summary' }, 'Os itens serão criados na conta do cliente.'), h('span', { class: 'spacer' }), cancel, confirm);
    enter(toolbar, { y: 4, duration: 220 });
    confirm.focus();
  };

  const lists = groups.map((g) => {
    const rows = g.items.map((item) => {
      const text = h('div', {}, h('div', { class: 'row-title' }, item.label), item.detail && h('div', { class: 'row-detail' }, item.detail));
      if (item.exists) return h('div', { class: 'row muted' }, h('span', { class: 'row-dot' }, svg('check')), text, badge('', 'Já existe'));
      const key = `${g.block.id}:${item.key}`;
      const checkbox = h('input', {
        type: 'checkbox',
        checked: true,
        onchange: (e) => { e.target.checked ? selected.add(key) : selected.delete(key); refresh(); },
      });
      checkboxes.push({ key, checkbox });
      return h('label', { class: 'row' }, checkbox, text, badge('info', 'Vai criar'));
    });
    return h('div', { class: 'list' },
      multi && h('div', { class: 'list-title' }, svg(g.block.icon), g.block.title, badge('', `${g.items.length}`)),
      rows.length ? rows : h('p', { class: 'empty' }, 'A conta modelo não tem itens deste tipo.'));
  });

  swap(container,
    notice('Prévia: nada foi criado ainda. Desmarque o que não quiser criar.', 'info'),
    tiles,
    toolbar,
    ...lists);
  refresh();
  stagger(container.querySelectorAll('.row'), { step: 18, y: 6, max: 20 });
}

const ROW_ICON = { ok: 'check', err: 'x', warn: 'minus', '': 'check' };

function setRowBadge(row, tone, text, extra) {
  const next = badge(tone, text, extra);
  row.status.replaceWith(next);
  row.status = next;
  row.dot.className = `row-dot ${tone}`;
  row.dot.replaceChildren(svg(ROW_ICON[tone]));
  pop(next);
}

async function runApply(container, plan, originalGroups) {
  state.busy = true;
  $('back').disabled = true;
  $('close').disabled = true;

  const total = plan.reduce((n, g) => n + g.items.length, 0);
  const tiles = stats([
    { id: 'created', label: 'Criados', tone: 'ok' },
    { id: 'exists', label: 'Já existiam' },
    { id: 'error', label: 'Com erro', tone: 'err' },
  ]);
  const bar = h('span');
  const progressText = h('span', { class: 'summary', role: 'status' });
  const rows = new Map();
  const lists = plan.map((g) => h('div', { class: 'list' },
    plan.length > 1 && h('div', { class: 'list-title' }, svg(g.block.icon), g.block.title),
    g.items.map((item) => {
      const status = badge('', 'Aguardando');
      const msg = h('div', { class: 'row-msg' });
      const dot = h('span', { class: 'row-dot' }, svg('minus'));
      rows.set(`${g.block.id}:${item.key}`, { status, msg, dot });
      return h('div', { class: 'row' }, dot, h('div', {}, h('div', { class: 'row-title' }, item.label), msg), status);
    })));
  const toolbar = h('div', { class: 'toolbar' }, progressText);
  swap(container, tiles, h('div', { class: 'progress', 'aria-hidden': 'true' }, bar), toolbar, ...lists);

  const counts = { created: 0, exists: 0, error: 0 };
  const blockErrors = {};
  let done = 0;
  let fatal = null;

  const update = () => {
    bar.style.transform = `scaleX(${total ? done / total : 1})`;
    progressText.textContent = `Executando... ${done} de ${total}`;
    for (const key of Object.keys(counts)) tiles.set(key, counts[key]);
  };
  update();

  for (const g of plan) {
    blockErrors[g.block.id] = 0;
    for (let i = 0; i < g.items.length && !fatal; i += APPLY_BATCH) {
      const batch = g.items.slice(i, i + APPLY_BATCH);
      batch.forEach((item) => setRowBadge(rows.get(`${g.block.id}:${item.key}`), 'warn', 'Enviando', 'live'));
      try {
        const { results } = await api('apply', { block: g.block.id, clientToken: clientToken(), input: g.input, keys: batch.map((b) => b.key) });
        for (const result of results) {
          const row = rows.get(`${g.block.id}:${result.key}`);
          if (!row) continue;
          setRowBadge(row, ...(RESULT_BADGE[result.status] ?? ['err', 'Erro']));
          row.msg.textContent = result.message ?? '';
          counts[result.status] = (counts[result.status] ?? 0) + 1;
          if (result.status === 'error') blockErrors[g.block.id] += 1;
          done += 1;
        }
      } catch (err) {
        fatal = err;
      }
      update();
    }
    if (fatal) break;
  }

  if (fatal) {
    for (const g of plan) {
      for (const item of g.items) {
        const row = rows.get(`${g.block.id}:${item.key}`);
        if (row.status.textContent === 'Aguardando' || row.status.textContent === 'Enviando') {
          setRowBadge(row, 'err', 'Não executado');
          counts.error += 1;
          blockErrors[g.block.id] = (blockErrors[g.block.id] ?? 0) + 1;
        }
      }
    }
    done = total;
    update();
  }

  state.busy = false;
  $('back').disabled = false;
  $('close').disabled = false;
  for (const g of plan) state.status[g.block.id] = blockErrors[g.block.id] ? { tone: 'err', text: 'Com erros' } : { tone: 'ok', text: 'Concluído' };
  if (plan.length > 1) state.status.setupAll = counts.error ? { tone: 'err', text: 'Com erros' } : { tone: 'ok', text: 'Concluído' };
  if (!counts.error) setTokenStatus('ok');

  progressText.textContent = counts.error ? 'Concluído com erros. Veja as mensagens abaixo.' : 'Tudo certo!';
  if (fatal instanceof ApiError && state.view === 'block') container.prepend(notice(`Execução interrompida: ${fatal.message}`));
  const actions = [
    h('span', { class: 'spacer' }),
    button('Nova prévia', () => loadPreview(container, originalGroups.map((g) => ({ block: g.block, input: g.input }))), { icon: 'refresh' }),
    button('Voltar aos blocos', showGrid, { variant: 'btn-primary', icon: 'arrow' }),
  ];
  toolbar.append(...actions);
  stagger(actions.slice(1), { y: 4, step: 60 });
}

// ---------- Configurar tudo ----------

function renderSetupAll(view) {
  const body = h('div');
  view.append(
    h('p', { class: 'panel-desc' }, 'Junta Etiquetas, Equipes e Webhooks padrão numa prévia só. Usuários continuam no bloco próprio, porque precisam de formulário.'),
    body);
  loadPreview(body, SETUP_ALL_BLOCKS.map((id) => ({ block: BLOCK_BY_ID[id] })));
}

// ---------- Usuários (formulário → mesmo fluxo de prévia) ----------

function renderAgentsBlock(view, block) {
  const rowsBox = h('div', { class: 'grid-form' });
  const result = h('div');

  function addRow() {
    const profile = h('select', { 'aria-label': 'Perfil' }, PROFILES.map(([value, label]) => h('option', { value }, label)));
    profile.dataset.f = 'profile';
    const row = h('div', { class: 'grid-form-row' },
      h('input', { type: 'text', placeholder: 'Nome', maxLength: 100, 'aria-label': 'Nome', 'data-f': 'name' }),
      h('input', { type: 'email', placeholder: 'email@empresa.com', 'aria-label': 'E-mail', 'data-f': 'email' }),
      h('input', { type: 'tel', placeholder: 'Telefone (opcional)', 'aria-label': 'Telefone', 'data-f': 'phoneNumber' }),
      profile,
      h('button', {
        type: 'button',
        class: 'icon-btn',
        'aria-label': 'Remover linha',
        onclick: () => rowsBox.querySelectorAll('.grid-form-row:not(.grid-form-head)').length > 1 && row.remove(),
      }, svg('x')),
    );
    rowsBox.append(row);
    enter(row, { y: 6, duration: 240 });
    row.querySelector('input').focus();
  }

  function collect() {
    return [...rowsBox.querySelectorAll('.grid-form-row:not(.grid-form-head)')]
      .map((row) => Object.fromEntries([...row.querySelectorAll('[data-f]')].map((el) => [el.dataset.f, el.value.trim()])))
      .filter((u) => u.name || u.email);
  }

  rowsBox.append(h('div', { class: 'grid-form-row grid-form-head', 'aria-hidden': 'true' },
    h('span', {}, 'Nome'), h('span', {}, 'E-mail'), h('span', {}, 'Telefone'), h('span', {}, 'Perfil'), h('span')));
  addRow();

  view.append(
    h('p', { class: 'panel-desc' }, 'Preencha os usuários e gere a prévia. Quem já existe na conta (mesmo e-mail) é pulado.'),
    rowsBox,
    h('div', { class: 'toolbar' },
      button('Adicionar linha', addRow, { variant: 'btn-ghost btn-small', icon: 'plus' }),
      h('span', { class: 'spacer' }),
      button('Gerar prévia', () => {
        const users = collect();
        if (!users.length) return swap(result, notice('Preencha pelo menos um usuário.', 'info'));
        loadPreview(result, [{ block, input: { users } }]);
      }, { variant: 'btn-primary', icon: 'play' }),
    ),
    result,
  );
}

// ---------- Conferências (modelo × cliente) ----------

const MARK_LABEL = { ok: 'Existe no cliente', partial: 'Existe com diferenças', missing: 'Falta no cliente' };
const MARK_ICON = { ok: 'check', partial: 'minus', missing: 'x' };

function mark(status, label) {
  return h('span', { class: `mark ${status}`, role: 'img', 'aria-label': label }, svg(MARK_ICON[status]));
}

function renderCheckBlock(view, block) {
  const body = h('div');
  view.append(body);
  loadCheck(body, block);
}

async function loadCheck(container, block) {
  if (!requireToken(container)) return;
  swap(container, loading('Lendo as duas contas...'));

  let data;
  try {
    data = await api('check', { check: block.id, clientToken: clientToken() });
  } catch (err) {
    retry(container, err, () => loadCheck(container, block));
    return;
  }
  setTokenStatus('ok');

  const { items, summary } = data;
  state.status[block.id] = summary.missing ? { tone: 'warn', text: `Faltam ${summary.missing}` } : { tone: 'ok', text: 'Completo' };

  let onlyMissing = summary.missing > 0;
  const table = h('div', { class: 'list' });

  function renderRows() {
    const rows = items.filter((i) => !onlyMissing || i.status !== 'ok');
    table.replaceChildren(
      h('div', { class: 'compare-head' }, h('span', {}, 'Item'), h('span', {}, 'Modelo'), h('span', {}, 'Cliente')),
      ...(rows.length
        ? rows.map((item) => h('div', { class: 'compare-row' },
          h('div', {},
            h('div', { class: 'row-title' }, item.label),
            item.info && h('div', { class: 'row-detail' }, item.info),
            item.note && h('div', { class: 'row-msg' }, item.note)),
          mark('ok', 'Existe no modelo'),
          mark(item.status, MARK_LABEL[item.status])))
        : [h('p', { class: 'empty' }, items.length ? 'Nada faltando.' : 'A conta modelo não tem itens deste tipo.')]),
    );
    stagger(table.querySelectorAll('.compare-row'), { step: 18, y: 6 });
  }

  const tiles = stats([
    { id: 'ok', label: 'Presentes no cliente', tone: 'ok' },
    { id: 'missing', label: 'Faltam criar', tone: summary.missing ? 'err' : '' },
    { id: 'only', label: 'Só no cliente' },
  ]);

  swap(container,
    summary.missing
      ? notice(`${summary.missing} item(ns) precisam ser criados manualmente no WTS: a API pública não permite criar este tipo.`, 'info')
      : notice('A conta do cliente tem tudo o que existe no modelo.', 'ok'),
    tiles,
    h('div', { class: 'toolbar' },
      h('label', { class: 'check-toggle' },
        h('input', { type: 'checkbox', checked: onlyMissing, onchange: (e) => { onlyMissing = e.target.checked; renderRows(); } }),
        'Mostrar só o que falta'),
      h('span', { class: 'spacer' }),
      button('Atualizar', () => loadCheck(container, block), { icon: 'refresh' })),
    table);
  tiles.set('ok', summary.ok);
  tiles.set('missing', summary.missing);
  tiles.set('only', summary.onlyInClient);
  renderRows();
}

// ---------- Consultas (tabelas com IDs para copiar) ----------

async function panelSelect(container, onChange) {
  const select = h('select', { 'aria-label': 'Painel' }, h('option', { value: '' }, 'Carregando painéis...'));
  select.disabled = true;
  container.append(h('label', { class: 'field' }, 'Painel', select));
  try {
    const { panels } = await api('lookup', { lookup: 'panelList', clientToken: clientToken() });
    setTokenStatus('ok');
    select.replaceChildren(h('option', { value: '' }, panels.length ? 'Escolha um painel' : 'Nenhum painel nesta conta'),
      ...panels.map((p) => h('option', { value: p.id }, p.title)));
    select.disabled = !panels.length;
    select.onchange = () => { state.lastPanelId = select.value; if (select.value) onChange(select.value); };
    if (panels.some((p) => p.id === state.lastPanelId)) {
      select.value = state.lastPanelId;
      onChange(select.value);
    }
  } catch (err) {
    select.replaceChildren(h('option', { value: '' }, 'Erro ao carregar'));
    if (err instanceof ApiError) container.append(notice(err.message));
  }
}

function renderLookup(view, lookup) {
  const top = h('div', { class: 'panel-section' });
  const body = h('div');
  view.append(top, body);
  if (!requireToken(body)) return;
  if (lookup.needsPanel) {
    panelSelect(top, (panelId) => loadLookup(body, lookup, { panelId }));
    swap(body, notice('Escolha o painel para listar.', 'info'));
  } else {
    top.remove();
    loadLookup(body, lookup, {});
  }
}

async function loadLookup(container, lookup, params) {
  swap(container, loading('Consultando a conta...'));
  let data;
  try {
    data = await api('lookup', { lookup: lookup.id, clientToken: clientToken(), params });
  } catch (err) {
    retry(container, err, () => loadLookup(container, lookup, params));
    return;
  }
  setTokenStatus('ok');

  const { columns, rows } = data;
  const filter = h('input', { type: 'search', class: 'filter', placeholder: 'Filtrar...', 'aria-label': 'Filtrar resultados' });
  const count = h('span', { class: 'summary' });
  const tbody = h('tbody');
  const table = h('div', { class: 'table-wrap' },
    h('table', { class: 'data' },
      h('thead', {}, h('tr', {}, columns.map((c) => h('th', {}, c.label)))),
      tbody));

  function render() {
    const q = filter.value.trim().toLowerCase();
    const visible = rows.filter((r) => !q || columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q)));
    count.textContent = `${visible.length} de ${rows.length}`;
    tbody.replaceChildren(...visible.map((r) => h('tr', {}, columns.map((c) => {
      const value = r[c.key] ?? '';
      if (c.copy && value) return h('td', {}, copyButton(String(value)));
      return h('td', { class: c.mono ? 'mono' : '' }, String(value));
    }))));
  }
  filter.oninput = render;

  const toCsv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    return `﻿${[columns.map((c) => esc(c.label)).join(';'), ...rows.map((r) => columns.map((c) => esc(r[c.key])).join(';'))].join('\r\n')}`;
  };

  swap(container,
    h('div', { class: 'toolbar' },
      filter,
      count,
      h('span', { class: 'spacer' }),
      button('Baixar CSV', () => download(`${lookup.id}.csv`, toCsv(), 'text/csv;charset=utf-8'), { icon: 'download', disabled: !rows.length }),
      button('Atualizar', () => loadLookup(container, lookup, params), { icon: 'refresh' })),
    rows.length ? table : h('p', { class: 'empty' }, 'Nada encontrado nesta conta.'));
  render();
  stagger(tbody.children, { step: 12, y: 4, max: 30 });
}

// ---------- Fluxos do n8n ----------

function renderN8n(view) {
  const step1 = h('div');
  const step2 = h('div');
  view.append(
    h('p', { class: 'panel-desc' }, 'Crie no WTS o painel, as etapas e o campo personalizado do cliente. Depois escolha o fluxo padrão: o sistema acha os IDs da conta modelo dentro dele e troca pelos da conta do cliente.'),
    step1, step2);
  loadN8nTemplates(step1, step2);
}

async function loadN8nTemplates(step1, step2) {
  swap(step1, loading('Carregando fluxos padrão...'));
  let data;
  try {
    data = await api('n8n', { action: 'templates' });
  } catch (err) {
    retry(step1, err, () => loadN8nTemplates(step1, step2));
    return;
  }
  state.n8nConfigured = data.n8nConfigured;

  const select = h('select', { 'aria-label': 'Fluxo padrão' });
  const fillSelect = () => {
    select.replaceChildren(
      ...data.templates.map((t) => h('option', { value: t.id }, `${t.name} (${t.nodes} nós)`)),
      state.uploadedTemplate && h('option', { value: '__upload' }, `Arquivo enviado: ${state.uploadedTemplate.name}`),
    );
    if (state.uploadedTemplate) select.value = '__upload';
    select.disabled = !select.options.length;
  };
  fillSelect();

  const fileInput = h('input', { type: 'file', accept: '.json,application/json' });
  const drop = h('label', { class: 'drop' }, svg('upload'), h('span', {}, 'Enviar .json exportado do n8n'), fileInput);
  const fileError = h('div');
  const readFile = async (file) => {
    fileError.replaceChildren();
    try {
      const workflow = JSON.parse(await file.text());
      if (!Array.isArray(workflow.nodes)) throw new Error();
      state.uploadedTemplate = { name: file.name, workflow };
      fillSelect();
      pop(select);
    } catch {
      fileError.replaceChildren(notice('Arquivo inválido: exporte o fluxo no n8n (Download) e envie o .json.'));
    }
  };
  fileInput.onchange = () => fileInput.files[0] && readFile(fileInput.files[0]);
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('dragging'); };
  drop.ondragleave = () => drop.classList.remove('dragging');
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('dragging'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };

  const nameInput = h('input', { type: 'text', placeholder: 'Ex.: Clínica Sorriso', value: state.clientName, oninput: (e) => { state.clientName = e.target.value; } });

  const source = () => (select.value === '__upload' ? { template: state.uploadedTemplate.workflow } : { templateId: select.value });

  swap(step1, section('1', 'Fluxo padrão e cliente',
    !data.templates.length && !state.uploadedTemplate
      ? notice('Ainda não há fluxos padrão no servidor (pasta templates/n8n). Envie o .json abaixo ou peça para incluírem no repositório.', 'info')
      : null,
    h('div', { class: 'form-grid' },
      h('label', { class: 'field' }, 'Fluxo padrão', select),
      h('label', { class: 'field' }, 'Nome do cliente', nameInput)),
    h('div', { class: 'drop-wrap' }, drop),
    fileError,
    h('div', { class: 'toolbar' },
      h('span', { class: 'spacer' }),
      button('Puxar painéis e analisar fluxo', () => {
        if (!select.value) return swap(step2, notice('Escolha ou envie um fluxo padrão.', 'info'));
        scanN8n(step2, source());
      }, { variant: 'btn-primary', icon: 'refresh' }))));
}

async function scanN8n(container, source) {
  if (!requireToken(container)) return;
  swap(container, loading('Lendo painéis, etapas, campos e chatbots das duas contas...'));
  let scan;
  try {
    scan = await api('n8n', { action: 'scan', clientToken: clientToken(), ...source });
  } catch (err) {
    retry(container, err, () => scanN8n(container, source));
    return;
  }
  setTokenStatus('ok');
  renderN8nMapping(container, source, scan);
}

function renderN8nMapping(container, source, scan) {
  const selects = [];
  const byKind = {};
  for (const ref of scan.references) (byKind[ref.kindLabel] ??= []).push(ref);

  const lists = Object.entries(byKind).map(([kindLabel, refs]) => h('div', { class: 'list' },
    h('div', { class: 'list-title' }, kindLabel, badge('', String(refs.length))),
    refs.map((ref) => {
      const options = (ref.isId ? scan.idOptions : scan.options)[ref.kind] ?? [];
      const select = h('select', { 'aria-label': `Trocar ${ref.label}` },
        h('option', { value: '' }, '— não trocar —'),
        options.map((o) => h('option', { value: o.value }, o.group ? `${o.group} › ${o.label}` : o.label)));
      select.value = ref.suggestion ?? '';
      const row = h('div', { class: `map-row ${ref.suggestion ? '' : 'unmatched'}` },
        h('div', { class: 'map-from' },
          h('div', { class: 'row-title' }, ref.group ? `${ref.group} › ${ref.label}` : ref.label),
          h('div', { class: 'row-detail mono' }, `${ref.from} · ${ref.count}× no fluxo`),
          !ref.suggestion && badge('warn', 'Sem correspondência: escolha')),
        h('span', { class: 'arrow', 'aria-hidden': 'true' }, svg('arrow')),
        select);
      select.onchange = () => row.classList.toggle('unmatched', !select.value);
      selects.push({ ref, select });
      return row;
    })));

  const tokenBox = scan.hasModelToken
    ? h('label', { class: 'check-toggle' }, h('input', { type: 'checkbox', checked: true }), 'Trocar o token da conta modelo pelo token do cliente (o token vai dentro do arquivo)')
    : null;

  const wantsPrompt = scan.agentNodes.length || scan.hasPromptPlaceholder;
  const promptArea = wantsPrompt ? h('textarea', { placeholder: 'Cole aqui o prompt do cliente ou use o montador.', value: state.builtPrompt }) : null;

  const result = h('div');
  const build = async (mode) => {
    const mapping = selects.filter((s) => s.select.value).map((s) => ({ from: s.ref.from, to: s.select.value }));
    const body = {
      action: 'build',
      ...source,
      mapping,
      clientName: state.clientName,
      prompt: promptArea?.value ?? '',
      replaceToken: Boolean(tokenBox?.querySelector('input').checked),
      clientToken: clientToken(),
      create: mode === 'create',
    };
    swap(result, loading(mode === 'create' ? 'Criando o fluxo no n8n...' : 'Gerando o fluxo...'));
    let data;
    try {
      data = await api('n8n', body);
    } catch (err) {
      swap(result, notice(err.message));
      return;
    }
    const json = JSON.stringify(data.workflow, null, 2);
    if (mode === 'download') download(`${slug(data.workflow.name)}.json`, json, 'application/json');
    if (mode === 'copy') await copyText(json);
    swap(result,
      notice(mode === 'create'
        ? 'Fluxo criado no n8n (inativo). Confira as credenciais e ative.'
        : mode === 'copy'
          ? 'JSON copiado. No n8n, abra um fluxo vazio e cole com Ctrl+V.'
          : 'Download feito. No n8n: Importar do arquivo, ou abra o .json e cole no canvas.', 'ok'),
      ...data.warnings.map((w) => notice(w, 'warn')),
      data.created && h('div', { class: 'toolbar' }, h('a', { class: 'btn btn-primary', href: data.created.url, target: '_blank', rel: 'noopener' }, svg('arrow'), h('span', {}, 'Abrir no n8n'))),
      h('p', { class: 'summary' }, `${data.applied.length} valor(es) trocados.`));
  };

  const refsCount = scan.references.length;
  swap(container,
    section('2', 'O que será trocado',
      refsCount
        ? notice(`Achei ${refsCount} referência(s) da conta modelo no fluxo. Confira as correspondências; as em amarelo precisam de escolha.`, 'info')
        : notice('Não achei IDs da conta modelo neste fluxo. Confira se ele foi exportado do fluxo da conta modelo.', 'warn'),
      ...lists),
    (tokenBox || scan.credentials.length) && section('3', 'Credenciais',
      tokenBox,
      scan.credentials.length
        ? notice(`Depois de importar, selecione a credencial do cliente em: ${scan.credentials.map((c) => `${c.name || c.type} (${c.nodes.join(', ')})`).join('; ')}.`, 'info')
        : null),
    wantsPrompt && section('4', 'Prompt do agente de IA',
      h('label', { class: 'field' }, h('span', {}, 'Prompt', h('span', { class: 'field-hint' }, scan.hasPromptPlaceholder ? ' · entra no lugar de {{PROMPT_CLIENTE}}' : ` · vai no nó: ${scan.agentNodes.join(', ')}`)), promptArea),
      h('div', { class: 'toolbar' }, button('Montar prompt', () => openBlock(BLOCK_BY_ID.prompt), { variant: 'btn-ghost btn-small', icon: 'sparkle' }))),
    h('div', { class: 'toolbar' },
      h('span', { class: 'spacer' }),
      button('Copiar JSON', () => build('copy'), { icon: 'copy' }),
      state.n8nConfigured && button('Criar no n8n', () => build('create'), { icon: 'cloud' }),
      button('Baixar fluxo', () => build('download'), { variant: 'btn-primary', icon: 'download' })),
    result);
  stagger(container.querySelectorAll('.map-row'), { step: 16, y: 6 });
}

// ---------- Montar prompt da IA ----------

function loadSavedPrompt() {
  try { return localStorage.getItem(PROMPT_KEY) ?? ''; } catch { return ''; }
}

function savePrompt(text) {
  try { text ? localStorage.setItem(PROMPT_KEY, text) : localStorage.removeItem(PROMPT_KEY); } catch { /* opcional */ }
}

async function renderPrompt(view) {
  const nameInput = h('input', { type: 'text', placeholder: 'Ex.: Clínica Sorriso', value: state.clientName, oninput: (e) => { state.clientName = e.target.value; } });
  const template = h('textarea', { rows: 12, placeholder: 'Carregando prompt padrão...' });
  const info = h('textarea', { rows: 10, placeholder: 'Cole aqui as mensagens e respostas do cliente: o que vende, preços, horários, regras, tom de voz, perguntas frequentes...' });
  const output = h('div', { class: 'output', 'aria-live': 'polite' });
  const outputBox = h('div', { hidden: true });
  const status = h('div');

  let defaultText = '';
  template.oninput = () => savePrompt(template.value === defaultText ? '' : template.value);
  const restore = button('Restaurar padrão', () => { template.value = defaultText; savePrompt(''); pop(template); }, { variant: 'btn-ghost btn-small', icon: 'refresh' });

  const runBtn = button('Montar prompt', null, { variant: 'btn-primary', icon: 'sparkle' });
  const stopBtn = button('Parar', null, { icon: 'stop', hidden: true });
  const afterActions = h('div', { class: 'toolbar', hidden: true },
    h('span', { class: 'spacer' }),
    button('Copiar', async (e) => {
      if (await copyText(output.textContent)) { const b = e.currentTarget; b.classList.add('is-done'); setTimeout(() => b.classList.remove('is-done'), 1200); }
    }, { icon: 'copy' }),
    button('Baixar .txt', () => download(`prompt-${slug(state.clientName)}.txt`, output.textContent, 'text/plain;charset=utf-8'), { icon: 'download' }),
    button('Usar no fluxo do n8n', () => { state.builtPrompt = output.textContent; openBlock(BLOCK_BY_ID.n8n); }, { variant: 'btn-primary', icon: 'arrow' }));

  view.append(
    section('1', 'Cliente', h('label', { class: 'field' }, 'Nome do cliente', nameInput)),
    section('2', 'Prompt padrão',
      h('p', { class: 'panel-desc' }, 'Pode editar: suas alterações ficam salvas neste navegador.'),
      template, h('div', { class: 'toolbar' }, restore)),
    section('3', 'Mensagens e respostas do cliente', info),
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), stopBtn, runBtn),
    status,
    h('div', {}, outputBox));
  outputBox.append(section('4', 'Prompt montado', output, afterActions));

  try {
    ({ prompt: defaultText } = await api('prompt', { action: 'default' }));
  } catch (err) {
    if (err instanceof ApiError) status.replaceChildren(notice(err.message));
  }
  template.placeholder = 'Escreva o prompt padrão da Frédy.';
  template.value = loadSavedPrompt() || defaultText;

  let controller = null;
  stopBtn.onclick = () => controller?.abort();
  runBtn.onclick = async () => {
    status.replaceChildren();
    if (!template.value.trim() || !info.value.trim()) {
      status.replaceChildren(notice('Preencha o prompt padrão e as mensagens do cliente.', 'info'));
      return;
    }
    controller = new AbortController();
    runBtn.disabled = true;
    stopBtn.hidden = false;
    afterActions.hidden = true;
    outputBox.hidden = false;
    output.textContent = '';
    output.classList.add('streaming');
    enter(outputBox, { y: 10 });
    outputBox.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });

    try {
      await streamPrompt({ template: template.value, clientInfo: info.value, clientName: state.clientName }, controller.signal, (event) => {
        if (event.type === 'text') {
          output.textContent += event.text;
          output.scrollTop = output.scrollHeight;
        } else if (event.type === 'error') {
          status.replaceChildren(notice(event.message));
        } else if (event.type === 'warning') {
          status.replaceChildren(notice(event.message, 'warn'));
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError' && !(err instanceof ApiError && err.message === 'Sessão expirada')) status.replaceChildren(notice(err.message));
    } finally {
      output.classList.remove('streaming');
      runBtn.disabled = false;
      stopBtn.hidden = true;
      if (output.textContent.trim()) {
        afterActions.hidden = false;
        state.builtPrompt = output.textContent;
        stagger(afterActions.querySelectorAll('.btn'), { y: 6, step: 50 });
      }
    }
  };
}

// Lê a resposta NDJSON da rota de prompt (um evento por linha).
async function streamPrompt(payload, signal, onEvent) {
  let res;
  try {
    res = await fetch('/api/prompt', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ action: 'build', ...payload }), signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Sem conexão com o servidor.');
  }
  if (res.status === 401) throw expireSession();
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(data.error || `Erro ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) if (line.trim()) onEvent(JSON.parse(line));
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer));
}

// ---------- Inicialização ----------

function init() {
  $('view-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submit = e.target.querySelector('button[type="submit"]');
    submit.disabled = true;
    $('login-error').textContent = '';
    try {
      saveSession(await api('login', { password: $('password').value }));
      showGrid();
    } catch (err) {
      $('login-error').textContent = err.message;
      if (!reducedMotion.matches) {
        $('password').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 260 });
      }
    } finally {
      submit.disabled = false;
    }
  });

  document.addEventListener('pointerdown', ripple);
  $('search').addEventListener('input', () => renderGrid());
  $('back').addEventListener('click', showGrid);

  $('close').addEventListener('click', () => {
    if (state.busy) return;
    $('overlay').hidden = true;
    $('reopen').hidden = false;
    enter($('reopen'), { y: 0, scale: 0.9, easing: SPRING });
  });
  $('reopen').addEventListener('click', () => {
    $('overlay').hidden = false;
    $('reopen').hidden = true;
    enter($('modal'), { y: 16, scale: 0.97, duration: 420, easing: SPRING });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.view === 'block' && !['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement?.tagName)) showGrid();
  });

  $('toggle-token').addEventListener('click', (e) => {
    const input = $('client-token');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.setAttribute('aria-pressed', String(show));
    e.currentTarget.setAttribute('aria-label', show ? 'Ocultar token' : 'Mostrar token');
    e.currentTarget.replaceChildren(svg(show ? 'eyeOff' : 'eye'));
  });

  // Trocar o token zera os status, pois eles valem para outra conta.
  $('client-token').addEventListener('input', () => {
    state.status = {};
    state.lastPanelId = '';
    setTokenStatus(clientToken() ? 'pending' : 'empty');
    if (state.view === 'grid') renderGrid();
  });

  enter($('modal'), { y: 20, scale: 0.97, duration: 480, easing: SPRING });
  state.session = loadSession();
  if (state.session) showGrid();
  else showLogin();
}

init();
