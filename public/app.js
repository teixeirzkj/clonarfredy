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
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
};

const SETUP_ALL_BLOCKS = ['tags', 'departments', 'webhooks'];

const SECTIONS = [
  {
    title: 'Configurar automaticamente',
    blocks: [
      { id: 'tags', kind: 'sync', icon: 'tag', title: 'Etiquetas padrão', desc: 'Copia as etiquetas da conta modelo, pulando as que já existem.' },
      { id: 'departments', kind: 'sync', icon: 'team', title: 'Equipes padrão', desc: 'Cria as equipes do modelo com as mesmas regras de distribuição.' },
      { id: 'agents', kind: 'agents', icon: 'userPlus', title: 'Usuários', desc: 'Cadastra usuários na conta a partir de um formulário.' },
      { id: 'webhooks', kind: 'webhooks', icon: 'webhook', title: 'Webhooks padrão', desc: 'Copia os webhooks do modelo trocando o nome da empresa na URL.' },
      { id: 'rotativo', kind: 'rotativo', icon: 'repeat', title: 'Rotativo', desc: 'Liga e desliga quem recebe atendimentos no rodízio.' },
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
const SETUP_ALL = { id: 'setupAll', kind: 'setupAll', title: 'Configurar tudo', desc: 'Implantação completa: etiquetas, equipes, webhooks, prompt da IA e fluxos do n8n.' };

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
  clientSlug: '', // identificador do cliente nas URLs dos webhooks
  modelSlug: '', // trecho da conta modelo nas URLs (vazio = servidor decide)
  builtPrompt: '',
  uploadedTemplate: null, // { name, workflow }
  n8nCache: null, // tela de Fluxos do n8n já montada (escolhas preservadas ao voltar)
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

// Campo padrão: título curto, o controle e um exemplo logo abaixo.
function field(label, control, example, { className = '' } = {}) {
  return h('label', { class: `field field-ex ${className}` },
    label && h('span', { class: 'field-label' }, label),
    control,
    example && h('span', { class: 'field-example' }, example));
}

// Explicação longa escondida: só abre se a pessoa precisar.
function howTo(summary, ...steps) {
  return h('details', { class: 'howto' },
    h('summary', {}, svg('info'), summary),
    h('ol', { class: 'steps' }, ...steps.map((s) => h('li', {}, s))));
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

// Copia e deixa o botão verde por um instante. O botão é passado já resolvido:
// depois de um await, event.currentTarget vira null.
async function flashOnCopy(btn, text) {
  if (!(await copyText(text))) return;
  btn.classList.add('is-done');
  pop(btn);
  setTimeout(() => btn.classList.remove('is-done'), 1200);
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

// "Conta Exemplo" → "contaexemplo" (formato do final das URLs dos webhooks)
const compactSlug = (text) => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

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

// Configuração da tela (identificador da conta modelo etc.), carregada uma vez.
async function loadConfig() {
  if (state.config) return;
  try {
    state.config = await api('config');
  } catch { /* a tela funciona sem; o servidor aplica o padrão */ }
}

function showGrid() {
  if (state.busy) return;
  loadConfig();
  setHeader('Setup da Conta', 'Escolha o que configurar na conta do cliente', false);
  showView('grid');
  renderGrid({ animate: true });
}

function openBlock(block) {
  setHeader(block.title, block.desc, true);
  showView('block');
  const view = $('view-block');
  // Fluxos do n8n: volta para a mesma tela (com o que já foi escolhido) enquanto o token for o mesmo.
  if (block.kind === 'n8n' && state.n8nCache && state.n8nCache.token === clientToken()) {
    view.replaceChildren(...state.n8nCache.nodes);
    state.n8nCache.onReturn();
    return;
  }
  view.replaceChildren();
  const renderers = {
    sync: renderSyncBlock,
    webhooks: renderWebhooksBlock,
    agents: renderAgentsBlock,
    check: renderCheckBlock,
    setupAll: renderSetupAll,
    lookup: renderLookup,
    n8n: renderN8n,
    prompt: renderPrompt,
    rotativo: renderRotativoBlock,
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
        h('span', { class: 'hero-desc' }, 'Etiquetas, equipes e webhooks, prompt da IA e fluxos do n8n (agente, mover card, rotativo) numa tela só.')),
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
              ['sync', 'webhooks', 'agents', 'check'].includes(block.kind) ? statusBadge(block) : null),
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
    results.forEach((r, i) => {
      groups[i].items = r.items;
      groups[i].meta = r.meta;
      groups[i].onMeta?.(r.meta);
    });
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
    ...groups.map((g) => g.meta?.warning && notice(g.meta.warning, 'warn')),
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

// ---------- Webhooks (trocam o nome da empresa na URL) ----------

// Só o que é aceito no identificador: minúsculas, números, - e _.
const cleanSlug = (text) => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9_-]/g, '');

function webhookSlugForm({ withName = false } = {}) {
  const modelSlug = () => modelInput.value.trim() || state.config?.modelSlug || 'embarque22palmitos';
  const preview = h('p', { class: 'hint slug-preview' });
  const updatePreview = () => {
    const client = clientInput.value.trim();
    preview.replaceChildren(client
      ? h('span', {}, 'Nas URLs e no path do webhook, ', h('code', {}, modelSlug()), ' vira ', h('code', {}, client), '.')
      : h('span', {}, 'Digite o nome do cliente acima ou o identificador aqui.'));
  };

  const clientInput = h('input', {
    type: 'text',
    placeholder: 'clinicasorriso',
    value: state.clientSlug || compactSlug(state.clientName),
    spellcheck: false,
    oninput: (e) => {
      const clean = cleanSlug(e.target.value);
      if (clean !== e.target.value) e.target.value = clean;
      state.clientSlug = clean;
      updatePreview();
    },
  });
  const modelInput = h('input', {
    type: 'text',
    value: state.modelSlug || state.config?.modelSlug || '',
    placeholder: 'embarque22palmitos',
    spellcheck: false,
    oninput: (e) => { e.target.value = cleanSlug(e.target.value); state.modelSlug = e.target.value; updatePreview(); },
  });

  // Nos blocos de webhook não há outro campo de nome: ele entra aqui.
  const nameInput = withName && h('input', {
    type: 'text',
    placeholder: 'Clínica Sorriso',
    value: state.clientName,
    oninput: (e) => { state.clientName = e.target.value; form.syncFromName(e.target.value); },
  });

  const el = h('div', { class: 'form-stack' },
    nameInput && field('Nome do cliente', nameInput, 'Ex.: Clínica Sorriso'),
    field('Identificador do cliente', clientInput, 'Preenche sozinho pelo nome, sem espaço nem acento. Ex.: clinicasorriso'),
    h('details', { class: 'advanced' },
      h('summary', {}, 'Opções avançadas'),
      field('Identificador da conta modelo', modelInput, 'Normalmente não precisa mexer. Ex.: embarque22palmitos')));
  updatePreview();

  let autoValue = clientInput.value;
  const form = {
    el,
    // Acompanha o nome do cliente enquanto o identificador não foi editado à mão.
    syncFromName: (name) => {
      if (clientInput.value !== autoValue) return;
      clientInput.value = autoValue = compactSlug(name);
      state.clientSlug = clientInput.value;
      updatePreview();
    },
    input: () => {
      state.clientSlug = clientInput.value.trim().toLowerCase();
      return { clientSlug: state.clientSlug, modelSlug: modelInput.value.trim().toLowerCase() };
    },
    // Nome e identificador preenchidos (para liberar o próximo passo).
    ready: () => Boolean(clientInput.value.trim() && (!nameInput || nameInput.value.trim())),
    // Mostra o trecho que o servidor usou (env ou detectado), para conferência.
    onMeta: (meta) => {
      if (meta?.modelSlug && !modelInput.value) { modelInput.value = meta.modelSlug; updatePreview(); }
    },
  };
  return form;
}

function renderWebhooksBlock(view, block) {
  const form = webhookSlugForm({ withName: true });
  const body = h('div');
  view.append(form.el,
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }),
      button('Gerar prévia', () => loadPreview(body, [{ block, input: form.input(), onMeta: form.onMeta }]), { variant: 'btn-primary', icon: 'play' })),
    body);
  if (state.clientSlug || state.clientName) loadPreview(body, [{ block, input: form.input(), onMeta: form.onMeta }]);
}

// ---------- Configurar tudo ----------

// Nome curto do fluxo: "[Rotativo] Embarque 22 Palmitos" → "Rotativo";
// "[Nome empresa exemplo] I.A Atendimento" → "I.A Atendimento".
function flowLabel(name) {
  const m = String(name ?? '').match(/^\[([^\]]*)\]\s*(.*)$/);
  if (!m) return String(name ?? '');
  return /empresa|nome/i.test(m[1]) ? m[2] || m[1] : m[1];
}

// Implantação completa em passos, um de cada vez. "Próximo" só libera quando
// o passo está completo; os passos opcionais têm "Pular".
function renderSetupAll(view) {
  const form = webhookSlugForm({ withName: true });
  const flows = { tabs: [], analyzed: false, select: () => {} };

  const setupBody = h('div');
  let setupSlug = null;
  const startSetup = () => {
    setupSlug = form.input().clientSlug;
    loadPreview(setupBody, SETUP_ALL_BLOCKS.map((id) => (id === 'webhooks'
      ? { block: BLOCK_BY_ID[id], input: form.input(), onMeta: form.onMeta }
      : { block: BLOCK_BY_ID[id] })));
  };

  const promptBox = h('div');
  const flowsBox = h('div');
  const finalBox = h('div');

  const steps = [
    {
      title: 'Cliente',
      desc: 'Nome do cliente. O token da conta vai no topo da tela.',
      body: [form.el],
      ready: () => form.ready() && Boolean(clientToken()),
      why: () => (clientToken() ? 'Preencha o nome do cliente.' : 'Cole o token da conta do cliente no topo da tela.'),
    },
    {
      title: 'Etiquetas, equipes e webhooks',
      desc: 'Copia da conta modelo o que falta no cliente.',
      body: [setupBody],
      ready: () => true,
      // Gera a prévia ao entrar (e de novo se o identificador mudou).
      onEnter: () => { if (setupSlug !== form.input().clientSlug) startSetup(); },
    },
    {
      title: 'Prompt da IA',
      desc: 'Cole as informações do cliente e monte o prompt do agente.',
      body: [promptBox],
      optional: true,
      ready: () => Boolean(state.builtPrompt.trim()),
      why: () => 'Monte o prompt ou clique em Pular.',
    },
    {
      title: 'Fluxos do n8n',
      desc: 'Marque os fluxos e confira cada um.',
      body: [flowsBox],
      ready: () => flows.analyzed && flows.tabs.length > 0,
      why: () => 'Clique em "Analisar fluxos".',
    },
    {
      title: 'Concluir',
      desc: 'Baixe ou crie todos os fluxos de uma vez.',
      body: [finalBox],
      ready: () => true,
      onEnter: () => renderWizardFinal(finalBox, flows.tabs, (i) => { go(3); flows.select(i); }),
    },
  ];

  let current = 0;
  const canReach = (i) => steps.slice(0, i).every((s) => s.optional || s.ready());
  const progress = h('ol', { class: 'stepper' }, steps.map((s, i) => {
    s.dot = h('li', { class: 'stepper-item' },
      h('button', { type: 'button', class: 'stepper-dot', onclick: () => canReach(i) && go(i) },
        h('span', { class: 'stepper-num' }, String(i + 1)),
        h('span', { class: 'stepper-label' }, s.title)));
    return s.dot;
  }));
  for (const [i, s] of steps.entries()) {
    s.el = h('section', { class: 'wizard-step', hidden: i !== 0 },
      h('header', { class: 'wizard-head' },
        h('span', { class: 'step-num' }, String(i + 1)),
        h('div', {}, h('h3', {}, s.title), h('p', { class: 'panel-desc' }, s.desc))),
      ...s.body);
  }

  const backBtn = button('Voltar', () => go(current - 1), { variant: 'btn-ghost', icon: 'back' });
  const skipBtn = button('Pular', () => go(current + 1), { variant: 'btn-ghost' });
  const nextBtn = button('Próximo', () => steps[current].ready() && go(current + 1), { variant: 'btn-primary', icon: 'arrow' });
  const why = h('span', { class: 'stepper-why', 'aria-live': 'polite' });

  function refresh() {
    const s = steps[current];
    const ok = s.ready();
    const last = current === steps.length - 1;
    nextBtn.disabled = !ok;
    nextBtn.hidden = last;
    skipBtn.hidden = !s.optional || ok || last;
    backBtn.hidden = current === 0;
    why.textContent = ok || last ? '' : s.why?.() ?? '';
    steps.forEach((x, i) => {
      x.dot.classList.toggle('is-current', i === current);
      x.dot.classList.toggle('is-done', i !== current && x.ready() && canReach(i));
      x.dot.classList.toggle('is-locked', !canReach(i));
    });
  }

  function go(i) {
    if (i < 0 || i >= steps.length || !canReach(i)) return;
    steps[current].el.hidden = true;
    current = i;
    steps[i].el.hidden = false;
    steps[i].onEnter?.();
    enter(steps[i].el, { y: 8 });
    refresh();
    const scroller = $('modal-scroll');
    if (scroller) scroller.scrollTop = 0;
  }

  view.append(progress, ...steps.map((s) => s.el), h('div', { class: 'stepper-nav' }, backBtn, why, h('span', { class: 'spacer' }), skipBtn, nextBtn));

  // Reavalia o passo a cada digitação/escolha (inclusive o token do topo).
  view.addEventListener('input', refresh);
  view.addEventListener('change', refresh);
  const tokenInput = $('client-token');
  const onToken = () => (view.isConnected ? refresh() : tokenInput.removeEventListener('input', onToken));
  tokenInput?.addEventListener('input', onToken);

  // O prompt pronto vai direto para os fluxos que têm agente de IA.
  renderPrompt(promptBox, null, {
    embedded: true,
    onReady: (text) => {
      flows.tabs.forEach((c) => c.container.n8nFlow?.setPrompt(text));
      refresh();
    },
  });
  loadWizardFlows(flowsBox, flows, form, refresh);
  refresh();
}

async function loadWizardFlows(box, flows, form, onChange) {
  swap(box, loading('Carregando fluxos padrão...'));
  let data;
  try {
    data = await api('n8n', { action: 'templates' });
  } catch (err) {
    retry(box, err, () => loadWizardFlows(box, flows, form, onChange));
    return;
  }
  state.n8nConfigured = data.n8nConfigured;
  const mains = data.templates.filter((t) => !t.isSubflow && !t.invalid);
  const checks = mains.map((t) => ({ t, input: h('input', { type: 'checkbox', checked: true }) }));
  const tabsBar = h('div', { class: 'tabs', role: 'tablist' });
  const panels = h('div');
  const status = h('div');

  // Aba ativa e contagem do que falta escolher em cada fluxo.
  const pendingOf = (c) => c.container.querySelectorAll('.map-row.unmatched').length;
  const updateTab = (c) => {
    if (!c.container.n8nFlow) return;
    const n = pendingOf(c);
    c.tab.classList.toggle('is-pending', n > 0);
    c.tab.classList.toggle('is-ok', n === 0);
    c.count.textContent = n ? String(n) : '';
    c.count.hidden = !n;
  };
  flows.select = (i) => {
    flows.tabs.forEach((c, j) => {
      c.tab.setAttribute('aria-selected', String(i === j));
      c.tab.classList.toggle('is-active', i === j);
      c.container.hidden = i !== j;
    });
    enter(flows.tabs[i]?.container, { y: 6, duration: 260 });
  };

  const analyze = async (btn) => {
    const chosen = checks.filter((c) => c.input.checked).map((c) => c.t);
    if (!chosen.length) return swap(status, notice('Marque pelo menos um fluxo.', 'info'));
    if (!clientToken()) return swap(status, notice('Cole o token da conta do cliente no topo da tela.', 'info'));
    status.replaceChildren();
    btn.disabled = true;
    flows.analyzed = false;
    flows.tabs.length = 0;
    tabsBar.replaceChildren();
    panels.replaceChildren();
    onChange();
    // Um fluxo por vez: cada análise lê as duas contas e respeita o limite da API.
    for (const t of chosen) {
      const i = flows.tabs.length;
      const container = h('div', { class: 'tab-panel', role: 'tabpanel', hidden: true });
      const count = h('span', { class: 'tab-count', hidden: true });
      const tab = h('button', { type: 'button', class: 'tab', role: 'tab', onclick: () => flows.select(i) },
        h('span', { class: 'tab-dot', 'aria-hidden': 'true' }), h('span', {}, flowLabel(t.name)), count);
      const c = { t, container, tab, count };
      flows.tabs.push(c);
      tabsBar.append(tab);
      panels.append(container);
      enter(tab, { y: 4, scale: 0.96 });
      if (i === 0) flows.select(0);
      container.addEventListener('input', () => updateTab(c));
      container.addEventListener('change', () => updateTab(c));
      await scanN8n(container, { templateId: t.id }, form, { inWizard: true });
      if (state.builtPrompt.trim()) container.n8nFlow?.setPrompt(state.builtPrompt);
      updateTab(c);
    }
    btn.disabled = false;
    flows.analyzed = true;
    // Abre no primeiro fluxo que ainda tem o que escolher.
    const firstPending = flows.tabs.findIndex((c) => pendingOf(c) > 0);
    flows.select(Math.max(firstPending, 0));
    onChange();
  };

  const analyzeBtn = button('Analisar fluxos', () => analyze(analyzeBtn), { variant: 'btn-primary', icon: 'refresh' });
  swap(box,
    h('div', { class: 'choices' },
      ...checks.map(({ t, input }) => h('label', { class: 'choice' }, input,
        h('span', {},
          h('span', { class: 'choice-title' }, flowLabel(t.name)),
          h('span', { class: 'choice-desc' }, t.subflows?.length ? `Com ${t.subflows.length} tool${t.subflows.length > 1 ? 's' : ''} junto` : 'Fluxo único'))))),
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), analyzeBtn),
    status,
    tabsBar,
    panels);
}

function renderWizardFinal(box, tabs, openFlow) {
  if (!tabs.length) return swap(box, notice('Nenhum fluxo analisado.', 'info'));
  const label = { ok: ['ok', 'Pronto'], done: ['ok', 'Gerado'], created: ['ok', 'Criado'], pending: ['warn', 'Falta escolher'], error: ['err', 'Erro'] };
  const list = h('div', { class: 'list' });
  const draw = (results) => list.replaceChildren(
    h('div', { class: 'list-title' }, 'Fluxos', badge('', String(tabs.length))),
    ...tabs.map((c, i) => {
      const pending = c.container.querySelectorAll('.map-row.unmatched').length;
      const r = results?.[i] ?? { status: pending ? 'pending' : 'ok', missing: pending };
      const [tone, text] = label[r.status] ?? label.error;
      return h('div', { class: 'row' },
        h('span', { class: `row-dot ${tone}` }, svg(tone === 'ok' ? 'check' : tone === 'warn' ? 'minus' : 'x')),
        h('div', {}, h('div', { class: 'row-title' }, flowLabel(c.t.name)),
          r.status === 'pending' ? h('div', { class: 'row-detail' }, `${r.missing} item(ns) para escolher`) : null,
          r.status === 'error' ? h('div', { class: 'row-msg' }, r.message) : null),
        h('div', { class: 'row-actions' },
          badge(tone, text),
          button(r.status === 'pending' ? 'Escolher' : 'Ver', () => openFlow(i), { variant: 'btn-small' })));
    }));
  const runAll = async (mode) => {
    const results = [];
    // Um por vez: cada fluxo mostra o próprio resultado na aba dele.
    for (const c of tabs) {
      const r = (await c.container.n8nFlow?.build(mode)) ?? { status: 'error', message: 'Fluxo não analisado' };
      results.push(r.status === 'ok' ? { status: mode === 'create' ? 'created' : 'done' } : r);
    }
    draw(results);
  };
  draw();
  swap(box,
    list,
    h('div', { class: 'toolbar' },
      h('span', { class: 'spacer' }),
      state.n8nConfigured && button('Criar todos no n8n', () => runAll('create'), { icon: 'cloud' }),
      button('Baixar todos os fluxos', () => runAll('download'), { variant: 'btn-primary', icon: 'download' })));
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
  const desc = h('p', { class: 'panel-desc' }, 'Escolha o fluxo padrão: ele sai pronto com os itens da conta do cliente.');
  view.append(desc, step1, step2);

  // Guarda a tela para voltar sem refazer a análise (ex.: ida e volta ao montador de prompt).
  const cache = {
    token: clientToken(),
    nodes: [desc, step1, step2],
    promptArea: null, // preenchido depois da análise de um fluxo com agente de IA
    showPrompt: null,
    analyze: null,
    selectAgent: null,
    onReturn() {
      const fromPrompt = Boolean(state.preferAgent);
      state.preferAgent = false;
      if (!fromPrompt) return;
      if (cache.promptArea) {
        // Já analisado: só troca o prompt e leva até ele e ao download.
        cache.promptArea.value = state.builtPrompt;
        cache.showPrompt?.();
      } else if (cache.selectAgent?.() && clientToken()) {
        cache.analyze?.({ fromPrompt: true });
      }
    },
  };
  state.n8nCache = cache;
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

  // Subfluxos (tools) não aparecem sozinhos: vêm junto com o fluxo que os usa.
  const mains = data.templates.filter((t) => !t.isSubflow && !t.invalid);
  const toolsLabel = (t) => (t.subflows?.length ? ` · + ${t.subflows.length} tool${t.subflows.length > 1 ? 's' : ''}` : '');
  const select = h('select', { 'aria-label': 'Fluxo padrão' });
  const templateInfo = h('div');
  const fillSelect = () => {
    select.replaceChildren(
      ...mains.map((t) => h('option', { value: t.id }, `${t.name}${toolsLabel(t)}`)),
      state.uploadedTemplate && h('option', { value: '__upload' }, `Arquivo enviado: ${state.uploadedTemplate.name}`),
    );
    if (state.uploadedTemplate) select.value = '__upload';
    else if (state.preferAgent) {
      // Vindo do montador de prompt: já abre no fluxo do agente.
      const agent = mains.find((t) => /\bI\.?A\b|agente/i.test(t.name));
      if (agent) select.value = agent.id;
    }
    state.preferAgent = false;
    select.disabled = !select.options.length;
    showInfo();
  };
  const showInfo = () => {
    const t = mains.find((x) => x.id === select.value);
    templateInfo.replaceChildren(...[
      t?.subflows?.length ? h('p', { class: 'hint' }, `Gera junto: ${t.subflows.map(flowLabel).join(', ')}.`) : null,
      t?.missingTools?.length ? notice(`Tool que não está nos fluxos padrão: ${t.missingTools.join(', ')}.`, 'warn') : null,
    ].filter(Boolean));
  };
  select.onchange = showInfo;
  const fromPrompt = Boolean(state.preferAgent); // veio do botão "Usar no fluxo do n8n"
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

  const slugForm = webhookSlugForm();
  const nameInput = h('input', {
    type: 'text',
    placeholder: 'Clínica Sorriso',
    value: state.clientName,
    oninput: (e) => { state.clientName = e.target.value; slugForm.syncFromName(e.target.value); },
  });

  const source = () => (select.value === '__upload' ? { template: state.uploadedTemplate.workflow } : { templateId: select.value });

  const analyzeBtn = button('Analisar fluxo', () => {
    if (!select.value) return swap(step2, notice('Escolha ou envie um fluxo padrão.', 'info'));
    scanN8n(step2, source(), slugForm);
  }, { variant: 'btn-primary', icon: 'refresh' });

  // Deixa claro que o prompt montado veio junto e onde ele aparece.
  const promptReady = state.builtPrompt.trim()
    ? notice(fromPrompt
      ? 'Prompt da IA pronto. Confira o cliente e clique em "Analisar fluxo": o prompt já vem preenchido.'
      : 'Há um prompt da IA montado: ele entra no fluxo do agente.', 'ok')
    : null;

  swap(step1, section('1', 'Fluxo padrão e cliente',
    promptReady,
    !mains.length && !state.uploadedTemplate
      ? notice('Ainda não há fluxos padrão no servidor. Envie o .json abaixo.', 'info')
      : null,
    h('div', { class: 'form-grid' },
      field('Fluxo padrão', select, 'Ex.: Rotativo'),
      field('Nome do cliente', nameInput, 'Ex.: Clínica Sorriso')),
    templateInfo,
    slugForm.el,
    h('details', { class: 'advanced' }, h('summary', {}, 'Usar outro fluxo (.json)'),
      h('div', { class: 'drop-wrap' }, drop),
      fileError),
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), analyzeBtn)));

  if (state.n8nCache) {
    state.n8nCache.analyze = (options) => {
      if (!select.value) return;
      scanN8n(step2, source(), slugForm, options);
    };
    state.n8nCache.selectAgent = () => {
      const agent = mains.find((t) => /\bI\.?A\b|agente/i.test(t.name));
      if (!agent) return false;
      if (select.value !== agent.id) { select.value = agent.id; showInfo(); }
      return true;
    };
  }

  // Vindo do montador: com o token preenchido, já analisa; senão chama a atenção para o botão.
  if (fromPrompt && clientToken() && select.value) {
    scanN8n(step2, source(), slugForm, { fromPrompt: true });
  } else if (fromPrompt) {
    setTimeout(() => {
      analyzeBtn.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
      if (!reducedMotion.matches) analyzeBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 700, iterations: 2, easing: SPRING });
      analyzeBtn.focus({ preventScroll: true });
    }, 350);
  }
}

// Leva até o elemento e dá um destaque rápido.
function spotlight(el) {
  if (!el) return;
  setTimeout(() => {
    el.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    if (!reducedMotion.matches) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 650, iterations: 2, easing: SPRING });
  }, 300);
}

async function scanN8n(container, source, slugForm, options = {}) {
  if (!requireToken(container)) return;
  swap(container, loading('Lendo painéis, etapas, campos, chatbots e canais das duas contas...'));
  let scan;
  try {
    scan = await api('n8n', { action: 'scan', clientToken: clientToken(), ...source, modelSlug: slugForm.input().modelSlug });
  } catch (err) {
    retry(container, err, () => scanN8n(container, source, slugForm, options));
    return;
  }
  setTokenStatus('ok');
  slugForm.onMeta({ modelSlug: scan.slug?.modelSlug });
  renderN8nMapping(container, source, scan, slugForm, options);
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Controle do lado direito de uma troca, com o exemplo logo abaixo.
const withExample = (control, example) => h('div', { class: 'map-to' }, control, h('span', { class: 'field-example' }, example));
// "49991031394" → "(49) 99103-1394", só para leitura.
const formatPhone = (digits) => {
  const d = String(digits).replace(/^55(?=\d{10,11}$)/, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return String(digits);
};

// Path de cada nó Webhook: já sugerido pelo identificador do cliente, editável.
function webhookPathSection(scan, slugForm) {
  const { modelSlug, webhookPaths = [] } = scan.slug ?? {};
  if (!webhookPaths.length) return { el: null, values: () => ({}), missing: () => [] };
  const rows = webhookPaths.map((w) => {
    const input = h('input', { type: 'text', spellcheck: false, placeholder: 'rotativoclinicasorriso', title: `Path atual: ${w.path}`, 'aria-label': `Novo path de ${w.node}` });
    // Path sugerido: troca o identificador do modelo; sem ele, tipo do fluxo + cliente.
    const modelRe = () => (modelSlug ? new RegExp(escapeRegExp(modelSlug), 'gi') : null);
    const base = (modelRe() ? cleanSlug(flowLabel(w.workflow)).replace(modelRe(), '') : cleanSlug(flowLabel(w.workflow))) || 'fluxo';
    const suggestion = (clientSlug) => {
      if (!clientSlug) return '';
      return modelRe()?.test(w.path) ? w.path.replace(modelRe(), clientSlug) : `${base}${clientSlug}`;
    };
    const row = h('div', { class: 'map-row' },
      h('div', { class: 'map-from' }, h('div', { class: 'row-title' }, w.node), h('div', { class: 'row-detail' }, flowLabel(w.workflow))),
      h('span', { class: 'arrow', 'aria-hidden': 'true' }, svg('arrow')),
      withExample(input, `Preenche sozinho. Ex.: ${base}clinicasorriso`));
    let edited = false;
    const mark = () => row.classList.toggle('unmatched', !input.value.trim() || input.value.trim() === w.path);
    input.oninput = () => { edited = true; input.value = input.value.replace(/[^\w/-]/g, ''); mark(); };
    const suggest = () => {
      if (edited) return;
      input.value = suggestion(slugForm.input().clientSlug);
      mark();
    };
    suggest();
    slugForm.el.addEventListener('input', suggest);
    return { w, input, row };
  });
  const el = section('', 'Endereço do webhook',
    h('p', { class: 'hint' }, 'Endereço que o WTS chama. Já vem com o identificador do cliente.'),
    h('div', { class: 'list' }, ...rows.map((r) => r.row)));
  return {
    el,
    values: () => Object.fromEntries(rows.map((r) => [r.w.node, r.input.value.trim()])),
    missing: () => rows.filter((r) => !r.input.value.trim() || r.input.value.trim() === r.w.path)
      .map((r) => ({ label: `Path do webhook: ${r.w.node}`, row: r.row, focus: r.input })),
  };
}

// Número do WhatsApp que envia as mensagens ("from"): vira o do canal do cliente.
function phoneSection(scan) {
  if (!scan.phones?.length) return { el: null, values: () => [], missing: () => [] };
  const channels = scan.channels ?? [];
  const toTemplateFormat = (digits, from) => (digits.length > from.length && digits.startsWith('55') ? digits.slice(2) : digits);
  const rows = scan.phones.map((p) => {
    const input = h('input', { type: 'text', inputMode: 'numeric', placeholder: '47999998888', 'aria-label': `Número que substitui ${p.from}` });
    const select = h('select', { 'aria-label': 'Canal do cliente' },
      h('option', { value: '' }, channels.length ? 'Escolha o canal' : 'Nenhum canal na conta'),
      ...channels.map((c) => h('option', { value: c.id }, `${c.name || c.type || 'Canal'} · ${c.numberFormatted || c.number}`)));
    const row = h('div', { class: 'map-row' },
      h('div', { class: 'map-from' }, h('div', { class: 'row-title' }, formatPhone(p.from)), h('div', { class: 'row-detail' }, 'Número do fluxo padrão')),
      h('span', { class: 'arrow', 'aria-hidden': 'true' }, svg('arrow')),
      withExample(h('div', { class: 'phone-pick' }, select, input), 'Escolha o canal e o número entra sozinho. Ex.: 47999998888'));
    const mark = () => row.classList.toggle('unmatched', !input.value || input.value === p.from);
    select.onchange = () => {
      const channel = channels.find((c) => c.id === select.value);
      if (channel?.number) input.value = toTemplateFormat(channel.number, p.from);
      mark();
    };
    input.oninput = () => { input.value = input.value.replace(/\D/g, ''); mark(); };
    if (channels.length === 1) { select.value = channels[0].id; select.onchange(); }
    mark();
    return { p, input, row };
  });
  const el = section('', 'Número do WhatsApp',
    h('p', { class: 'hint' }, 'Número que envia as mensagens do fluxo.'),
    h('div', { class: 'list' }, ...rows.map((r) => r.row)));
  return {
    el,
    values: () => rows.filter((r) => r.input.value && r.input.value !== r.p.from).map((r) => ({ from: r.p.from, to: r.input.value })),
    missing: () => rows.filter((r) => !r.input.value || r.input.value === r.p.from).map((r) => ({ label: `Número do WhatsApp ${r.p.from}`, row: r.row, focus: r.input })),
  };
}

// Planilhas do Google usadas pelo fluxo: link da planilha do cliente (obrigatório).
function sheetSection(scan) {
  if (!scan.sheets?.length) return { el: null, values: () => [], missing: () => [] };

  const rows = scan.sheets.map((s) => {
    const input = h('input', { type: 'url', placeholder: 'https://docs.google.com/spreadsheets/d/...', 'aria-label': 'Link da planilha do cliente' });
    const row = h('div', { class: 'map-row' },
      h('div', { class: 'map-from', title: s.documentId },
        h('div', { class: 'row-title' }, 'Planilha do fluxo padrão'),
        h('div', { class: 'row-detail' }, `Abas: ${s.sheetNames.join(', ') || '—'}`)),
      h('span', { class: 'arrow', 'aria-hidden': 'true' }, svg('arrow')),
      withExample(input, 'Link da planilha do cliente. Ex.: https://docs.google.com/spreadsheets/d/1AbC.../edit'));
    const mark = () => row.classList.toggle('unmatched', !/^https:\/\/docs\.google\.com\/spreadsheets\/d\//.test(input.value.trim()));
    input.oninput = mark;
    mark();
    return { s, input, row };
  });

  const el = section('', 'Planilha do Google',
    h('div', { class: 'list' }, ...rows.map((r) => r.row)));
  return {
    el,
    values: () => rows.filter((r) => r.input.value.trim()).map((r) => ({ from: r.s.documentId, to: r.input.value.trim() })),
    missing: () => rows.filter((r) => r.row.classList.contains('unmatched')).map((r) => ({ label: 'Link da planilha do Google', row: r.row, focus: r.input })),
  };
}

// Rotativo: usuários do cliente, quem entra no rodízio, em que ordem e com que
// nome (o que vai no "nome atendente"). Quem está ligado vira a equipe "Rotativo"
// no WTS ao gerar o fluxo; ela só guarda a lista.
function rotativoSection(scan) {
  if (!scan.rotativo) return { el: null, values: () => null, missing: () => [] };
  const people = (scan.rotativoUsers ?? []).map((u) => ({ ...u, label: u.suggestedName || u.name }));
  // Primeira vez (ninguém na equipe ainda): todos começam ligados.
  if (!people.some((p) => p.on)) people.forEach((p) => { p.on = true; });

  const listId = `equipes-${Date.now()}`;
  const datalist = h('datalist', { id: listId }, ...(scan.rotativoTeams ?? []).map((t) => h('option', { value: t })));
  const list = h('div', { class: 'list' });
  const empty = h('div', { class: 'map-row', hidden: true },
    h('div', { class: 'map-from' }, h('div', { class: 'row-title' }, 'Ligue pelo menos uma pessoa no rodízio.')));
  const render = () => {
    const on = people.filter((p) => p.on);
    empty.hidden = on.length > 0;
    empty.classList.toggle('unmatched', !on.length);
    list.replaceChildren(
      h('div', { class: 'list-title' }, 'Ordem do rodízio', badge('', `${on.length} ligada(s)`)),
      ...people.map((p, i) => {
        const nameInput = h('input', {
          type: 'text', value: p.label, disabled: !p.on, placeholder: 'Rafael',
          'aria-label': `Nome no rodízio de ${p.name}`,
          oninput: (e) => { p.label = e.target.value; row.classList.toggle('unmatched', !p.label.trim()); },
        });
        nameInput.setAttribute('list', listId);
        const row = h('div', { class: `map-row rot-row rot-edit${p.on ? '' : ' is-off'}${p.on && !p.label.trim() ? ' unmatched' : ''}` },
          h('input', { type: 'checkbox', checked: p.on, 'aria-label': `Incluir ${p.name}`, onchange: (e) => { p.on = e.target.checked; render(); } }),
          h('div', { class: 'rot-name' },
            h('div', { class: 'row-title' }, p.on ? `${on.indexOf(p) + 1}. ${p.name}` : p.name),
            nameInput),
          h('div', { class: 'row-actions' },
            button('↑', () => { [people[i - 1], people[i]] = [people[i], people[i - 1]]; render(); }, { variant: 'btn-small', disabled: i === 0, 'aria-label': `Subir ${p.name}` }),
            button('↓', () => { [people[i + 1], people[i]] = [people[i], people[i + 1]]; render(); }, { variant: 'btn-small', disabled: i === people.length - 1, 'aria-label': `Descer ${p.name}` })));
        return row;
      }));
  };
  render();

  const el = section('', 'Quem entra no rodízio',
    h('p', { class: 'hint' }, 'Marque quem recebe atendimentos, a ordem e o nome que vai no "nome atendente" (o mesmo que o chatbot usa para levar à equipe da pessoa). Ex.: Rafael'),
    scan.rotativoDuplicates ? notice(`Há ${scan.rotativoDuplicates + 1} equipes "Rotativo" repetidas. Abra a tela Rotativo e clique em "Juntar equipes repetidas".`, 'warn') : null,
    people.length ? list : notice('Nenhum usuário na conta do cliente.', 'warn'),
    datalist,
    empty);
  return {
    el,
    values: () => ({
      order: people.filter((p) => p.on).map((p) => ({ userId: p.userId, name: p.label.trim() })),
      on: people.filter((p) => p.on).map((p) => p.userId),
    }),
    missing: () => [
      ...(people.some((p) => p.on) ? [] : [{ label: 'Pessoas do rodízio', row: empty, focus: list.querySelector('input') ?? empty }]),
      ...people.filter((p) => p.on && !p.label.trim()).map((p) => ({ label: `Nome no rodízio de ${p.name}`, row: list, focus: list.querySelector('.rot-row.unmatched input[type=text]') ?? list })),
    ],
  };
}

// Tela Rotativo: liga e desliga quem recebe atendimentos (equipe "Rotativo" no WTS).
async function renderRotativoBlock(view) {
  const body = h('div');
  view.append(h('p', { class: 'panel-desc' }, 'Ligue ou desligue quem recebe atendimentos no rodízio. Vale na hora, sem mexer no n8n.'), body);
  // Carrega quando o token for colado ou trocado (enquanto a tela estiver aberta).
  const tokenInput = $('client-token');
  let timer = null;
  const onToken = () => {
    if (!body.isConnected) return tokenInput.removeEventListener('input', onToken);
    clearTimeout(timer);
    timer = setTimeout(() => loadRotativo(body), 500);
  };
  tokenInput.addEventListener('input', onToken);
  loadRotativo(body);
}

async function loadRotativo(body) {
  if (!requireToken(body)) return;
  const token = clientToken();
  swap(body, loading('Lendo os usuários da conta...'));
  let data;
  try {
    data = await api('rotativo', { action: 'get', clientToken: token });
  } catch (err) {
    retry(body, err, () => loadRotativo(body));
    return;
  }
  if (token !== clientToken()) return; // token trocado no meio: outra leitura já vem
  setTokenStatus('ok');
  const status = h('div');
  const count = badge('', '');
  const updateCount = () => { count.textContent = `${data.users.filter((u) => u.on).length} ligada(s)`; };
  // Um clique por vez no WTS: evita criar duas equipes "Rotativo" ao ligar várias pessoas rápido.
  let queue = Promise.resolve();
  const row = (u) => {
    const sw = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(u.on), 'aria-label': `Rotativo: ${u.name}` }, h('span', { class: 'switch-knob' }));
    const label = h('span', { class: 'switch-label' });
    const el = h('div', { class: 'row rot-row' },
      h('span', { class: 'row-dot ok' }, svg('user')),
      h('div', {}, h('div', { class: 'row-title' }, u.name)),
      h('div', { class: 'row-actions' }, label, sw));
    const paint = () => {
      sw.setAttribute('aria-checked', String(u.on));
      label.textContent = u.on ? 'Ligado' : 'Desligado';
      el.classList.toggle('is-off', !u.on);
      updateCount();
    };
    sw.onclick = async () => {
      if (u.on && data.users.filter((x) => x.on).length === 1) {
        status.replaceChildren(notice('Deixe pelo menos uma pessoa ligada no rotativo.', 'warn'));
        return;
      }
      u.on = !u.on;
      paint();
      pop(sw.firstChild);
      sw.disabled = true;
      status.replaceChildren();
      const on = u.on;
      queue = queue.then(async () => {
        try {
          await api('rotativo', { action: 'toggle', clientToken: clientToken(), userId: u.userId, on });
          data.teamId ??= true;
        } catch (err) {
          u.on = !on; // volta como estava
          paint();
          status.replaceChildren(notice(err.message));
        } finally {
          sw.disabled = false;
        }
      });
    };
    paint();
    return el;
  };
  // Equipes "Rotativo" repetidas (versão anterior criava uma por clique): junta na mais antiga.
  const merge = data.duplicates ? h('div', { class: 'notice warn', role: 'status' }, svg('alert'),
    h('span', {}, `Há ${data.duplicates + 1} equipes "Rotativo" repetidas no WTS. Junte numa só (fica a mais antiga, com todo mundo que estava ligado). Depois gere o fluxo Rotativo de novo.`),
    button('Juntar equipes repetidas', async (e) => {
      const btn = e.currentTarget;
      if (!window.confirm(`Apagar ${data.duplicates} equipe(s) "Rotativo" repetida(s) no WTS? As pessoas delas passam para a equipe "Rotativo" que fica.`)) return;
      btn.disabled = true;
      try {
        const r = await api('rotativo', { action: 'merge', clientToken: clientToken() });
        status.replaceChildren(notice(`${r.removed} equipe(s) repetida(s) apagada(s). Gere o fluxo Rotativo de novo para ele usar a equipe que ficou.`, 'ok'));
        setTimeout(() => loadRotativo(body), 1500);
      } catch (err) {
        btn.disabled = false;
        status.replaceChildren(notice(err.message));
      }
    }, { variant: 'btn-small' })) : null;
  swap(body,
    merge,
    data.teamId ? null : notice('Ainda não há rotativo nesta conta. Ao ligar alguém, a equipe "Rotativo" é criada no WTS. Depois gere o fluxo Rotativo em Fluxos do n8n.', 'info'),
    data.users.length
      ? h('div', { class: 'list' }, h('div', { class: 'list-title' }, 'Usuários', count), ...data.users.map(row))
      : notice('Nenhum usuário na conta.', 'info'),
    h('p', { class: 'hint' }, 'Quem for ligado aqui e não estava no fluxo entra com o nome de usuário no "nome atendente". Para escolher o nome, gere o fluxo Rotativo de novo.'),
    status);
  stagger(body.querySelectorAll('.rot-row'), { step: 25, y: 6 });
}

const normalizeName = (s) => String(s ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();

function renderN8nMapping(container, source, scan, slugForm, options = {}) {
  const entries = [];
  const byKind = {};
  for (const ref of scan.references) (byKind[ref.kindLabel] ??= []).push(ref);

  const optionsFor = (ref) => (ref.isId ? scan.idOptions : scan.options)[ref.kind] ?? [];
  // Painel do cliente escolhido para um painel do modelo (quando ele aparece no fluxo).
  const panelChoice = (modelPanelId) =>
    entries.find((e) => e.ref.kind === 'panel' && e.ref.from === modelPanelId)?.select.value || null;

  // Monta as opções da linha. Etapas e campos mostram só o painel escolhido
  // e são sugeridos de novo pelo nome quando o painel muda.
  function fill(entry) {
    const { ref, select } = entry;
    const clientPanel = ref.modelPanelId ? panelChoice(ref.modelPanelId) : null;
    const options = optionsFor(ref).filter((o) => !clientPanel || o.panelId === clientPanel);
    const previous = select.value;
    select.replaceChildren(
      h('option', { value: '' }, '— escolha —'),
      ...options.map((o) => h('option', { value: o.value }, o.group && !clientPanel ? `${o.group} › ${o.label}` : o.label)));
    const byName = ref.external ? null : options.find((o) => normalizeName(o.name ?? o.label) === normalizeName(ref.label));
    select.value = options.some((o) => o.value === previous) ? previous : byName?.value ?? '';
    markRow(entry);
  }

  function markRow(entry) {
    const missing = !entry.select.value;
    entry.row.classList.toggle('unmatched', missing);
    entry.flag.hidden = !missing;
  }

  const lists = Object.entries(byKind).map(([kindLabel, refs]) => h('div', { class: 'list' },
    h('div', { class: 'list-title' }, kindLabel, badge('', String(refs.length))),
    refs.map((ref) => {
      const select = h('select', { 'aria-label': `Trocar ${ref.label}` }, h('option', { value: ref.suggestion ?? '' }));
      select.value = ref.suggestion ?? '';
      const flag = badge('warn', 'Escolha');
      const row = h('div', { class: 'map-row' },
        h('div', { class: 'map-from', title: ref.from },
          h('div', { class: 'row-title' }, ref.group ? `${ref.group} › ${ref.label}` : ref.label),
          flag),
        h('span', { class: 'arrow', 'aria-hidden': 'true' }, svg('arrow')),
        select);
      const entry = { ref, select, row, flag };
      select.onchange = () => {
        markRow(entry);
        if (ref.kind !== 'panel') return;
        // Painel trocado: refaz as sugestões das etapas e campos desse painel.
        for (const dep of entries.filter((e) => e.ref.modelPanelId === ref.from)) {
          fill(dep);
          enter(dep.row, { y: 0, scale: 0.99, duration: 280 });
        }
      };
      entries.push(entry);
      return row;
    })));

  // Painéis primeiro: as etapas e campos dependem da escolha deles.
  entries.filter((e) => e.ref.kind === 'panel').forEach(fill);
  entries.filter((e) => e.ref.kind !== 'panel').forEach(fill);

  const webhooks = webhookPathSection(scan, slugForm);
  const phones = phoneSection(scan);
  const sheets = sheetSection(scan);
  const rotativo = rotativoSection(scan);

  // Token do WTS escrito direto em nós: é trocado pelo do cliente automaticamente.
  const tokenBox = scan.hardcodedTokens
    ? h('p', { class: 'hint' }, `Token do WTS escrito em ${scan.hardcodedTokens} lugar(es) do fluxo: vira o do cliente.`)
    : null;

  // Credencial do WTS: token direto no header (padrão) ou credencial do n8n.
  const wtsCreds = scan.credentials.filter((c) => c.wts);
  const otherCreds = scan.credentials.filter((c) => !c.wts);
  const wtsNodes = wtsCreds.reduce((n, c) => n + c.nodes.length, 0);
  const authGroup = `auth-${Date.now()}`;
  const authOption = (value, title, desc, checked) => h('label', { class: 'choice' },
    h('input', { type: 'radio', name: authGroup, value, checked }),
    h('span', {}, h('span', { class: 'choice-title' }, title), h('span', { class: 'choice-desc' }, desc)));
  const authChoice = wtsCreds.length ? h('div', { class: 'choices' },
    authOption('header', 'Token direto nos nós (padrão)',
      `Vai nos ${wtsNodes} nó(s) do WTS. Não compartilhe o .json.`, true),
    authOption('credential', 'Credencial do n8n com o nome do cliente',
      state.n8nConfigured ? 'Criada sozinha no "Criar no n8n".' : 'Crie no n8n ao importar e selecione nos nós.', false)) : null;
  const selectedAuth = () => authChoice?.querySelector('input:checked')?.value ?? 'credential';

  const credentialNotes = [
    authChoice,
    wtsCreds.length ? h('p', { class: 'hint' }, `Sai dos nós a credencial do modelo: ${wtsCreds.map((c) => c.name).join(', ')}.`) : null,
    otherCreds.length ? h('p', { class: 'hint' }, `Ficam como estão: ${otherCreds.map((c) => c.name || c.type).join(', ')}.`) : null,
  ];
  // Reaproveita a credencial criada nesta sessão para o mesmo cliente e token.
  const reusableCredential = () => {
    const saved = state.n8nCredential;
    return saved && saved.token === clientToken() && saved.clientName === state.clientName ? { id: saved.id, name: saved.name } : null;
  };

  const wantsPrompt = scan.agentNodes.length || scan.hasPromptPlaceholder;
  const promptArea = wantsPrompt ? h('textarea', { placeholder: 'Cole aqui o prompt do cliente ou use o montador. Vazio = mantém o prompt do fluxo padrão.', value: state.builtPrompt }) : null;

  const toolsNotes = [
    scan.subflows?.length ? h('p', { class: 'hint' }, `Gera junto: ${scan.subflows.map((s) => flowLabel(s.name)).join(', ')}.`) : null,
    scan.missingTools?.length ? notice(`Tool fora do pacote: ${scan.missingTools.map((m) => m.name).join(', ')}. Escolha o subfluxo no n8n.`, 'warn') : null,
  ];

  const result = h('div');
  const build = async (mode, force = false) => {
    // Pendências: ID da conta de origem, número ou path iguais ao de origem.
    const missing = [
      ...entries.filter((s) => !s.select.value).map((s) => ({ label: `${s.ref.kindLabel}: ${s.ref.group ? `${s.ref.group} › ` : ''}${s.ref.label}`, row: s.row, focus: s.select })),
      ...phones.missing(),
      ...sheets.missing(),
      ...rotativo.missing(),
      ...webhooks.missing(),
    ];
    if (missing.length && !force) {
      swap(result,
        notice(`${missing.length} item(ns) ainda apontam para a conta de origem: ${missing.map((m) => m.label).join('; ')}.`, 'warn'),
        h('div', { class: 'toolbar' },
          button('Escolher agora', () => {
            missing[0].row.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
            missing[0].focus.focus();
            missing.forEach((m) => enter(m.row, { y: 0, scale: 0.98, duration: 320, easing: SPRING }));
          }, { variant: 'btn-primary', icon: 'arrow' }),
          button('Gerar mesmo assim', () => build(mode, true), { variant: 'btn-ghost' })));
      return { status: 'pending', missing: missing.length };
    }
    const body = {
      action: 'build',
      ...source,
      mapping: entries.filter((s) => s.select.value).map((s) => ({ from: s.ref.from, to: s.select.value })),
      phoneMapping: phones.values(),
      sheetMapping: sheets.values(),
      rotativo: rotativo.values(),
      webhookPaths: webhooks.values(),
      clientName: state.clientName,
      prompt: promptArea?.value ?? '',
      clientToken: clientToken(),
      create: mode === 'create',
      auth: selectedAuth(),
      createCredential: selectedAuth() === 'credential' && Boolean(state.n8nConfigured),
      credential: reusableCredential(),
      ...slugForm.input(),
    };
    swap(result, loading(mode === 'create' ? 'Criando no n8n...' : 'Gerando os fluxos...'));
    let data;
    try {
      data = await api('n8n', body);
    } catch (err) {
      swap(result, notice(err.message));
      return { status: 'error', message: err.message };
    }
    if (data.credential) state.n8nCredential = { ...data.credential, token: clientToken(), clientName: state.clientName };
    if (data.createError) {
      swap(result, notice(`${data.createError}. A credencial "${data.credential.name}" já foi criada e será reaproveitada ao tentar de novo.`));
      return { status: 'error', message: data.createError };
    }
    renderN8nResult(result, data, mode);
    return { status: 'ok', data };
  };
  // Para o "Configurar tudo": gerar este fluxo e atualizar o prompt de fora.
  container.n8nFlow = { build, setPrompt: (text) => { if (promptArea) promptArea.value = text; }, hasPrompt: Boolean(promptArea) };

  const downloadBar = h('div', { class: 'toolbar' },
    h('span', { class: 'spacer' }),
    button('Copiar JSON', () => build('copy'), { icon: 'copy' }),
    state.n8nConfigured && button('Criar no n8n', () => build('create'), { icon: 'cloud' }),
    button(scan.subflows?.length ? 'Baixar fluxos' : 'Baixar fluxo', () => build('download'), { variant: 'btn-primary', icon: 'download' }));

  const refsCount = scan.references.length;
  const hasWtsAuth = wtsCreds.length || scan.hardcodedTokens;
  swap(container,
    refsCount || toolsNotes.some(Boolean) ? section('', 'Itens da conta do cliente',
      refsCount ? h('p', { class: 'hint' }, 'Já escolhi pelo nome. Confira e escolha os que estão em amarelo.') : null,
      ...toolsNotes,
      ...lists) : null,
    phones.el,
    rotativo.el,
    sheets.el,
    webhooks.el,
    wantsPrompt && section('', 'Prompt do agente de IA',
      field('Prompt', promptArea, options.inWizard
        ? 'Vem do passo "Prompt da IA". Vazio = mantém o prompt do fluxo padrão.'
        : 'Cole o prompt montado. Vazio = mantém o prompt do fluxo padrão.'),
      !options.inWizard && h('div', { class: 'toolbar' }, button('Montar prompt', () => openBlock(BLOCK_BY_ID.prompt), { variant: 'btn-ghost btn-small', icon: 'sparkle' }))),
    (tokenBox || scan.credentials.length) && h('div', { class: 'panel-section' },
      hasWtsAuth ? h('p', { class: 'hint' }, svg('check'), ' O token do cliente entra sozinho nos nós do WTS.') : null,
      h('details', { class: 'advanced' },
        h('summary', {}, 'Credenciais (avançado)'),
        tokenBox,
        ...credentialNotes)),
    downloadBar,
    result);
  stagger(container.querySelectorAll('.map-row'), { step: 16, y: 6 });

  // Volta do montador de prompt: prompt atualizado e foco no que falta ou no download.
  const cache = state.n8nCache;
  const showPrompt = () => {
    const pending = container.querySelector('.map-row.unmatched');
    if (promptArea) enter(promptArea, { y: 0, scale: 0.99, duration: 320, easing: SPRING });
    spotlight(pending ?? downloadBar);
  };
  if (cache && cache.nodes.includes(container)) {
    cache.promptArea = promptArea;
    cache.showPrompt = showPrompt;
  }
  if (options.fromPrompt) showPrompt();
}

// Resultado: um item por fluxo gerado (tools primeiro, depois o principal).
function renderN8nResult(container, data, mode) {
  const workflows = [...data.workflows].sort((a, b) => (a.role === b.role ? 0 : a.role === 'sub' ? -1 : 1));
  const asJson = (w) => JSON.stringify(w.workflow, null, 2);
  const many = workflows.length > 1;

  if (mode === 'download') {
    workflows.forEach((w, i) => setTimeout(() => download(`${slug(w.name)}.json`, asJson(w), 'application/json'), i * 400));
  }
  if (mode === 'copy') copyText(asJson(workflows.find((w) => w.role === 'main')));

  const created = mode === 'create';
  const headline = created
    ? (many ? 'Criados no n8n (inativos): as tools e o fluxo principal, já ligados. Confira e ative.' : 'Fluxo criado no n8n (inativo). Confira e ative.')
    : mode === 'copy'
      ? `JSON do fluxo principal copiado. No n8n, abra um fluxo vazio e cole com Ctrl+V.${many ? ' Copie as tools pelos botões abaixo.' : ''}`
      : many
        ? 'Download feito. No n8n, importe primeiro as tools e depois o fluxo principal.'
        : 'Download feito. No n8n: Importar do arquivo, ou abra o .json e cole no canvas.';

  const list = h('div', { class: 'list' },
    h('div', { class: 'list-title' }, 'Fluxos gerados', badge('', String(workflows.length))),
    ...workflows.map((w) => {
      const link = w.role === 'main' ? data.created : w.created;
      return h('div', { class: 'row' },
        h('span', { class: 'row-dot ok' }, svg('check')),
        h('div', {}, h('div', { class: 'row-title' }, w.name), h('div', { class: 'row-detail' }, w.role === 'main' ? 'Fluxo principal' : 'Tool (subfluxo)')),
        h('div', { class: 'row-actions' },
          link?.url ? h('a', { class: 'btn btn-small', href: link.url, target: '_blank', rel: 'noopener' }, svg('arrow'), h('span', {}, 'Abrir')) : null,
          button('Copiar', (e) => flashOnCopy(e.currentTarget, asJson(w)), { variant: 'btn-small', icon: 'copy' }),
          button('Baixar', () => download(`${slug(w.name)}.json`, asJson(w), 'application/json'), { variant: 'btn-small', icon: 'download' })));
    }));

  swap(container,
    notice(headline, 'ok'),
    ...data.warnings.map((w) => notice(w, 'warn')),
    data.credential ? notice(`Credencial "${data.credential.name}" ligada em ${data.credentialNodes} nó(s) do WTS.`, 'ok') : null,
    data.rotativo ? notice(`Equipe "Rotativo" ${data.rotativo.created ? 'criada' : 'atualizada'} no WTS com ${data.rotativo.people} pessoa(s).`, 'ok') : null,
    data.headerNodes ? notice(`Token do cliente colocado no header Authorization de ${data.headerNodes} nó(s) do WTS.`, 'ok') : null,
    data.webhookPaths?.length ? h('div', { class: 'list' },
      h('div', { class: 'list-title' }, 'URL do webhook (configure no WTS: chatbot ou assinatura)'),
      ...data.webhookPaths.map((w) => h('div', { class: 'row' },
        h('span', { class: 'row-dot ok' }, svg('webhook')),
        h('div', {}, h('div', { class: 'row-title' }, `${w.workflow} › ${w.node}`)),
        copyButton(w.url || w.path)))) : null,
    list,
    h('p', { class: 'summary' }, `${data.applied.length} valor(es) trocados${data.slugReplaced ? ` · identificador da empresa trocado ${data.slugReplaced}×` : ''}.`));
}

// ---------- Montar prompt da IA ----------

function loadSavedPrompt() {
  try { return localStorage.getItem(PROMPT_KEY) ?? ''; } catch { return ''; }
}

function savePrompt(text) {
  try { text ? localStorage.setItem(PROMPT_KEY, text) : localStorage.removeItem(PROMPT_KEY); } catch { /* opcional */ }
}

const INFO_EXAMPLE = 'Ex.: "Vendemos pacotes de viagem. Atendemos de seg. a sex., das 8h às 18h. Parcelamos em até 10x." Pode colar a conversa inteira.';

// options.embedded: dentro do "Configurar tudo" (o nome vem da etapa 1 e o
// prompt pronto vai direto para o fluxo do agente via options.onReady).
async function renderPrompt(view, _block, options = {}) {
  const embedded = Boolean(options.embedded);
  const ready = (text) => {
    state.builtPrompt = text;
    options.onReady?.(text);
  };
  const nameInput = h('input', { type: 'text', placeholder: 'Clínica Sorriso', value: state.clientName, oninput: (e) => { state.clientName = e.target.value; } });
  const template = h('textarea', { rows: 12, placeholder: 'Carregando prompt padrão...' });
  const info = h('textarea', { rows: 10, placeholder: 'O que vende, preços, horários, regras, tom de voz, perguntas frequentes...' });
  const output = h('div', { class: 'output', 'aria-live': 'polite' });
  const outputBox = h('div', { hidden: true });
  const status = h('div');

  let defaultText = '';
  template.oninput = () => savePrompt(template.value === defaultText ? '' : template.value);
  const restore = button('Restaurar padrão', () => { template.value = defaultText; savePrompt(''); pop(template); }, { variant: 'btn-ghost btn-small', icon: 'refresh' });

  const runBtn = button('Montar prompt', null, { variant: 'btn-primary', icon: 'sparkle' });
  const stopBtn = button('Parar', null, { icon: 'stop', hidden: true });
  // Alternativa sem custo de API: usa a assinatura do Claude.ai (copiar → colar → colar a resposta).
  const claudeBtn = button('Copiar para o Claude.ai', null, { icon: 'copy' });
  const claudeBox = h('div', { hidden: true });
  let instructions = '';
  let claudeSuffix = '';
  const afterActions = h('div', { class: 'toolbar', hidden: true },
    h('span', { class: 'spacer' }),
    button('Copiar', (e) => flashOnCopy(e.currentTarget, output.textContent), { icon: 'copy' }),
    button('Baixar .txt', () => download(`prompt-${slug(state.clientName)}.txt`, output.textContent, 'text/plain;charset=utf-8'), { icon: 'download' }),
    !embedded && button('Gerar fluxo do n8n com este prompt', () => {
      state.builtPrompt = output.textContent;
      state.preferAgent = true; // abre no fluxo do agente, analisa e leva ao download
      openBlock(BLOCK_BY_ID.n8n);
    }, { variant: 'btn-primary', icon: 'download' }));

  if (embedded) {
    view.append(
      h('details', { class: 'advanced' },
        h('summary', {}, 'Prompt padrão (editar)'),
        h('p', { class: 'hint' }, 'Suas alterações ficam salvas neste navegador.'),
        template, h('div', { class: 'toolbar' }, restore)),
      field('Informações do cliente', info, INFO_EXAMPLE, { className: 'prompt-info' }),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), stopBtn, claudeBtn, runBtn),
      status,
      claudeBox,
      outputBox);
    outputBox.append(h('div', { class: 'panel-section' }, h('h3', {}, 'Prompt montado (vai para o fluxo do agente)'), output, afterActions));
  } else {
    view.append(
      section('1', 'Cliente', field('Nome do cliente', nameInput, 'Ex.: Clínica Sorriso')),
      section('2', 'Informações do cliente', field('', info, INFO_EXAMPLE, { className: 'prompt-info' })),
      h('details', { class: 'advanced' },
        h('summary', {}, 'Prompt padrão (editar)'),
        h('p', { class: 'hint' }, 'Suas alterações ficam salvas neste navegador.'),
        template, h('div', { class: 'toolbar' }, restore)),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), stopBtn, claudeBtn, runBtn),
      status,
      claudeBox,
      h('div', {}, outputBox));
    outputBox.append(section('3', 'Prompt montado', output, afterActions));
  }

  try {
    ({ prompt: defaultText, instructions = '', claudeSuffix = '' } = await api('prompt', { action: 'default' }));
  } catch (err) {
    if (err instanceof ApiError) status.replaceChildren(notice(err.message));
  }

  // Mostra o prompt pronto (do montador ou colado do Claude.ai) com as ações.
  const showResult = (text) => {
    output.textContent = text;
    outputBox.hidden = false;
    afterActions.hidden = false;
    ready(text);
    enter(outputBox, { y: 10 });
    stagger(afterActions.querySelectorAll('.btn'), { y: 6, step: 50 });
    outputBox.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  claudeBtn.onclick = async () => {
    status.replaceChildren();
    if (!template.value.trim() || !info.value.trim()) {
      status.replaceChildren(notice('Preencha o prompt padrão e as mensagens do cliente.', 'info'));
      return;
    }
    // Mesmo conteúdo que o montador envia para a API.
    const text = [
      instructions,
      `<prompt_padrao>\n${template.value.trim()}\n</prompt_padrao>`,
      `<informacoes_cliente>\n${state.clientName.trim() ? `Cliente: ${state.clientName.trim()}\n\n` : ''}${info.value.trim()}\n</informacoes_cliente>`,
      'Monte o prompt final deste cliente.',
      claudeSuffix,
    ].filter(Boolean).join('\n\n');
    if (!(await copyText(text))) {
      status.replaceChildren(notice('Não consegui copiar. Tente de novo.'));
      return;
    }
    claudeBtn.classList.add('is-done');
    pop(claudeBtn);
    setTimeout(() => claudeBtn.classList.remove('is-done'), 1200);

    const answer = h('textarea', { rows: 10, placeholder: 'Cole aqui a resposta do Claude...' });
    const useAnswer = button('Usar esta resposta', () => {
      // Tira a cerca de código (```) se o Claude responder dentro de uma.
      // Pega o conteúdo do bloco de código, mesmo com texto antes ou depois dele.
      const raw = answer.value.trim();
      const cleaned = (raw.match(/```[\w-]*\n([\s\S]*?)\n```/)?.[1] ?? raw).trim();
      if (!cleaned) return answer.focus();
      showResult(cleaned);
    }, { variant: 'btn-primary', icon: 'check' });
    // Colou a resposta: já mostra o prompt pronto, sem precisar clicar.
    answer.addEventListener('paste', () => setTimeout(() => answer.value.trim() && useAnswer.click(), 0));
    swap(claudeBox, section('', 'Montar pelo Claude.ai',
      notice('Copiado! Cole no Claude.ai (Ctrl+V) e envie. Depois cole a resposta abaixo.', 'ok'),
      h('div', { class: 'toolbar' },
        h('a', { class: 'btn', href: 'https://claude.ai/new', target: '_blank', rel: 'noopener' }, svg('arrow'), h('span', {}, 'Abrir Claude.ai')),
        button('Copiar de novo', (e) => flashOnCopy(e.currentTarget, text), { variant: 'btn-ghost btn-small', icon: 'copy' })),
      field('Resposta do Claude', answer, 'Copie a resposta inteira no Claude.ai e cole aqui.'),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), useAnswer)));
    claudeBox.hidden = false;
    claudeBox.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };
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
        ready(output.textContent);
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
    state.n8nCache = null; // as escolhas do n8n eram da outra conta
    setTokenStatus(clientToken() ? 'pending' : 'empty');
    if (state.view === 'grid') renderGrid();
  });

  enter($('modal'), { y: 20, scale: 0.97, duration: 480, easing: SPRING });
  state.session = loadSession();
  if (state.session) showGrid();
  else showLogin();
}

init();
