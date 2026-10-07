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
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>',
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
      { id: 'chatbotsPadrao', kind: 'chatbots', icon: 'bot', title: 'Chatbots padrão', desc: 'JSON dos chatbots padrão para copiar e colar no WTS.' },
    ],
  },
  {
    title: 'Manutenção do CRM',
    blocks: [
      { id: 'archiveCards', kind: 'archive', icon: 'archive', title: 'Arquivar cards', desc: 'Arquiva os cards de uma coluna, filtrando por data.' },
      { id: 'importContacts', kind: 'contacts', icon: 'upload', title: 'Importar contatos', desc: 'Sobe uma planilha (CSV) de contatos, com etiquetas e campos.' },
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
      { id: 'officeHours', kind: 'check', icon: 'calendar', title: 'Horário de atendimento', desc: 'Compara os horários e a mensagem fora do horário.' },
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

// A mesma página tem três modos, pelo endereço: / (equipe), /cliente (portal do
// cliente, login por e-mail) e /cadastro (cliente novo pede a conta, sem login).
const PORTAL = /^\/cliente\/?$/.test(location.pathname) ? 'cliente' : /^\/cadastro\/?$/.test(location.pathname) ? 'cadastro' : null;

// O que o cliente vê no portal (Montar prompt, Fluxos do n8n, webhooks e
// "Configurar tudo" ficam só com a equipe; o servidor também bloqueia).
const CLIENT_BLOCK_IDS = ['tags', 'departments', 'agents', 'rotativo', 'archiveCards', 'importContacts', 'chatbotsPadrao', 'templates', 'panels', 'chatbots', 'sequences', 'fields', 'officeHours'];
const GUIDE = { id: 'guide', kind: 'guide', title: 'Passo a passo da implantação', desc: 'Siga os passos com vídeos e deixe sua conta pronta.' };
const ACCOUNT = { id: 'account', kind: 'account', icon: 'user', title: 'Minha conta', desc: 'Trocar a senha e sair.' };
if (!PORTAL) {
  SECTIONS.unshift({
    title: 'Portal do cliente',
    blocks: [{ id: 'clientsAdmin', kind: 'clients', icon: 'team', title: 'Clientes', desc: 'Cadastros recebidos e acessos dos clientes ao portal.' }],
  });
}

const BLOCK_BY_ID = Object.fromEntries(SECTIONS.flatMap((s) => s.blocks).map((b) => [b.id, b]));
const SETUP_ALL = { id: 'setupAll', kind: 'setupAll', title: 'Configurar tudo', desc: 'Implantação completa: etiquetas, equipes, webhooks, prompt da IA e fluxos do n8n.' };

const APPLY_BATCH = 8;
const SESSION_KEY_BASE = 'setup-session';
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

const sessionKey = () => `${SESSION_KEY_BASE}-${PORTAL || 'equipe'}`;

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(sessionKey()) ?? 'null');
    if (saved?.token && saved.expiresAt > Date.now()) return saved;
  } catch { /* storage indisponível: pede a senha de novo */ }
  return null;
}

function saveSession(session) {
  state.session = session;
  try {
    if (session) sessionStorage.setItem(sessionKey(), JSON.stringify(session));
    else sessionStorage.removeItem(sessionKey());
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

  if (res.status === 401 && path !== 'login' && !(path === 'portal' && body?.action === 'login')) throw expireSession();
  if (!res.ok) {
    const error = new ApiError(data.error || `Erro ${res.status}`);
    if (/conta (do )?cliente|própria conta modelo/i.test(error.message)) setTokenStatus('error');
    throw error;
  }
  return data;
}

function clientToken() {
  // No portal o servidor usa o token da conta do cliente logado.
  if (PORTAL === 'cliente') return 'portal';
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
  $('token-bar').hidden = name === 'login' || Boolean(PORTAL);
  $('modal').classList.toggle('is-login', name === 'login');
  $('modal-scroll').scrollTop = 0;
  enter($(`view-${name}`), { y: 8, duration: 300 });
}

function showLogin(message = '') {
  const client = PORTAL === 'cliente';
  setHeader(client ? 'Portal do cliente' : 'Entrar', client ? 'Entre com o e-mail e a senha que a equipe Frédy enviou' : 'Acesso restrito à equipe Frédy', false);
  showView('login');
  $('email-field').hidden = !client;
  $('login-email').required = client;
  $('password-label').textContent = client ? 'Senha' : 'Senha de acesso';
  $('login-error').textContent = message;
  $('password').value = '';
  (client && !$('login-email').value ? $('login-email') : $('password')).focus();
}

// Configuração da tela (identificador da conta modelo etc.), carregada uma vez.
async function loadConfig() {
  if (state.config) return;
  try {
    state.config = await api('portal', { action: 'config' });
  } catch { /* a tela funciona sem; o servidor aplica o padrão */ }
}

function showGrid() {
  if (state.busy) return;
  loadConfig();
  if (PORTAL === 'cliente') setHeader(state.session?.company ? `Olá, ${state.session.company}` : 'Portal do cliente', 'Configure sua conta passo a passo', false);
  else setHeader('Setup da Conta', 'Escolha o que configurar na conta do cliente', false);
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
    archive: renderArchiveBlock,
    contacts: renderContactsBlock,
    chatbots: renderChatbotsBlock,
    guide: renderGuideBlock,
    account: renderAccountBlock,
    clients: renderClientsBlock,
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

  const hero = PORTAL === 'cliente' ? { ...GUIDE, heroTitle: 'Passo a passo da implantação', heroDesc: 'Vídeos e instruções para deixar sua conta pronta, na ordem certa.' }
    : { ...SETUP_ALL, heroTitle: 'Configurar tudo de uma vez', heroDesc: 'Etiquetas, equipes e webhooks, prompt da IA e fluxos do n8n (agente, mover card, rotativo) numa tela só.' };
  if (matches(hero)) {
    visible += 1;
    container.append(h('button', { type: 'button', class: 'hero', onclick: () => openBlock(hero) },
      h('span', { class: 'hero-icon', 'aria-hidden': 'true' }, svg('rocket')),
      h('span', { class: 'hero-body' },
        h('span', { class: 'hero-title' }, hero.heroTitle),
        h('span', { class: 'hero-desc' }, hero.heroDesc)),
      !PORTAL && state.status.setupAll ? badge(state.status.setupAll.tone, state.status.setupAll.text) : null,
      h('span', { class: 'hero-arrow', 'aria-hidden': 'true' }, svg('arrow'))));
  }

  const sections = PORTAL === 'cliente'
    ? [...SECTIONS.map((sec) => ({ ...sec, title: sec.title === 'n8n e IA' ? 'Chatbots' : sec.title, blocks: sec.blocks.filter((b) => CLIENT_BLOCK_IDS.includes(b.id)) })), { title: 'Sua conta', blocks: [ACCOUNT] }]
    : SECTIONS;
  for (const sec of sections) {
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

  // Webhooks apontam para o n8n da equipe: fora do portal do cliente.
  const lookups = LOOKUPS.filter((l) => PORTAL !== 'cliente' || l.id !== 'webhooks').filter(matches);
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

// ---------- Arquivar cards de uma coluna ----------

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const CARD_STATUS = { OPEN: 'Aberto', WON: 'Ganho', LOST: 'Perdido' };
// Arquiva de pouco em pouco: lotes pequenos e pausa entre eles, deixando folga no
// limite da API do WTS (1.000 chamadas / 5 min por conta) para o resto da conta.
const ARCHIVE_BATCH = 25;
const ARCHIVE_PAUSE_MS = 3000;

const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const formatDay = (d) => (d ? `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}` : '');
const shortDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('pt-BR') : '—';
};

// Botões lado a lado (escolha única), no lugar do <select> padrão.
function segmented(options, value, onChange, label) {
  const el = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': label });
  const paint = () => el.querySelectorAll('.seg-btn').forEach((b) => {
    const on = b.dataset.value === value;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-checked', String(on));
  });
  for (const [v, text] of options) {
    el.append(h('button', {
      type: 'button', class: 'seg-btn', role: 'radio', 'data-value': v,
      onclick: () => { if (value === v) return; value = v; paint(); onChange(v); },
    }, text));
  }
  paint();
  return el;
}

// Calendário próprio da página (no lugar da caixa de data do navegador).
function datePicker(initial, onChange, label) {
  let value = initial;
  let view = new Date((value ?? new Date()).getFullYear(), (value ?? new Date()).getMonth(), 1);
  const text = h('span', {}, value ? formatDay(value) : 'Escolher data');
  const trigger = h('button', { type: 'button', class: 'date-trigger', 'aria-haspopup': 'dialog', 'aria-label': label }, svg('calendar'), text);
  const popover = h('div', { class: 'date-pop', role: 'dialog', 'aria-label': label, hidden: true });
  const wrap = h('div', { class: 'date-field' }, trigger, popover);

  const close = () => { popover.hidden = true; trigger.setAttribute('aria-expanded', 'false'); document.removeEventListener('pointerdown', outside, true); };
  const outside = (e) => { if (!wrap.contains(e.target)) close(); };
  const render = () => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    const today = new Date();
    const days = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    popover.replaceChildren(
      h('div', { class: 'date-head' },
        h('button', { type: 'button', class: 'date-nav', 'aria-label': 'Mês anterior', onclick: () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); } }, '‹'),
        h('strong', {}, `${MONTHS[view.getMonth()][0].toUpperCase()}${MONTHS[view.getMonth()].slice(1)} de ${view.getFullYear()}`),
        h('button', { type: 'button', class: 'date-nav', 'aria-label': 'Próximo mês', onclick: () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); } }, '›')),
      h('div', { class: 'date-grid' },
        ...WEEKDAYS.map((w) => h('span', { class: 'date-wd' }, w)),
        ...days.map((d) => h('button', {
          type: 'button',
          class: `date-day${d.getMonth() !== view.getMonth() ? ' is-out' : ''}${sameDay(d, today) ? ' is-today' : ''}${sameDay(d, value) ? ' is-on' : ''}`,
          'aria-label': formatDay(d),
          onclick: () => { value = d; text.textContent = formatDay(d); close(); pop(trigger); onChange(d); },
        }, String(d.getDate())))),
      h('div', { class: 'date-foot' },
        h('button', { type: 'button', class: 'btn btn-ghost btn-small', onclick: () => { view = new Date(today.getFullYear(), today.getMonth(), 1); render(); } }, 'Hoje')));
  };
  trigger.onclick = () => {
    if (!popover.hidden) return close();
    view = new Date((value ?? new Date()).getFullYear(), (value ?? new Date()).getMonth(), 1);
    render();
    popover.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    enter(popover, { y: -4, scale: 0.98, duration: 200 });
    popover.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
    document.addEventListener('pointerdown', outside, true);
  };
  popover.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); trigger.focus(); } });
  return { el: wrap, get: () => value };
}

function renderArchiveBlock(view) {
  const body = h('div');
  view.append(h('p', { class: 'panel-desc' }, 'Escolha o painel, a coluna e o período. Você vê os cards antes de arquivar.'), body);
  const tokenInput = $('client-token');
  let timer = null;
  const onToken = () => {
    if (!body.isConnected) return tokenInput.removeEventListener('input', onToken);
    clearTimeout(timer);
    timer = setTimeout(() => loadArchive(body), 500);
  };
  tokenInput.addEventListener('input', onToken);
  loadArchive(body);
}

async function loadArchive(body) {
  if (!requireToken(body)) return;
  swap(body, loading('Lendo os painéis da conta...'));
  let panels;
  try {
    ({ panels } = await api('cards', { action: 'panels', clientToken: clientToken() }));
  } catch (err) {
    retry(body, err, () => loadArchive(body));
    return;
  }
  setTokenStatus('ok');
  if (!panels.length) return swap(body, notice('Esta conta não tem painéis.', 'info'));

  const f = { panel: null, step: null, mode: 'all', from: null, to: null, dateField: 'created', statuses: ['OPEN', 'WON', 'LOST'] };
  const result = h('div');
  const stepBox = h('div');
  const periodBox = h('div');
  const reset = () => result.replaceChildren();

  // 1. Painel
  const panelGrid = h('div', { class: 'pick-grid' }, ...panels.map((p) => h('button', {
    type: 'button', class: 'pick', 'data-id': p.id,
    onclick: (e) => {
      f.panel = p;
      f.step = null;
      panelGrid.querySelectorAll('.pick').forEach((b) => b.classList.toggle('is-on', b === e.currentTarget));
      renderSteps();
      reset();
    },
  }, h('span', { class: 'pick-title' }, p.title), h('span', { class: 'pick-sub' }, `${p.steps.length} coluna(s)`))));

  // 2. Coluna
  const renderSteps = () => {
    if (!f.panel) return stepBox.replaceChildren(h('p', { class: 'hint' }, 'Escolha um painel acima.'));
    swap(stepBox, f.panel.steps.length
      ? h('div', { class: 'chip-row' }, ...f.panel.steps.map((s) => h('button', {
        type: 'button', class: 'pick-chip',
        onclick: (e) => {
          f.step = s;
          stepBox.querySelectorAll('.pick-chip').forEach((b) => b.classList.toggle('is-on', b === e.currentTarget));
          reset();
        },
      }, h('span', {}, s.title), s.count !== null ? h('span', { class: 'chip-count' }, String(s.count)) : null)))
      : notice('Este painel não tem colunas.', 'info'));
  };

  // 3. Período
  const fromPicker = datePicker(null, (d) => { f.from = d; reset(); }, 'Data inicial');
  const toPicker = datePicker(null, (d) => { f.to = d; reset(); }, 'Data final');
  const renderPeriod = () => {
    const show = { all: [], before: [['Até o dia', toPicker]], after: [['A partir do dia', fromPicker]], between: [['De', fromPicker], ['Até', toPicker]] }[f.mode];
    periodBox.replaceChildren(...show.map(([label, picker]) => h('div', { class: 'date-row' }, h('span', { class: 'field-label' }, label), picker.el)));
  };
  renderPeriod();

  const statusChips = h('div', { class: 'chip-row' }, ...Object.entries(CARD_STATUS).map(([value, text]) => {
    const btn = h('button', { type: 'button', class: 'pick-chip is-on', 'aria-pressed': 'true' }, h('span', {}, text));
    btn.onclick = () => {
      const on = !btn.classList.contains('is-on');
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      f.statuses = on ? [...f.statuses, value] : f.statuses.filter((s) => s !== value);
      reset();
    };
    return btn;
  }));

  // Limites do dia no fuso do navegador, enviados em UTC.
  const range = () => {
    const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    if (f.mode === 'before') return { before: f.to && endOf(f.to) };
    if (f.mode === 'after') return { after: f.from && startOf(f.from) };
    if (f.mode === 'between') return { after: f.from && startOf(f.from), before: f.to && endOf(f.to) };
    return {};
  };
  const describe = () => {
    const base = f.dateField === 'updated' ? 'atualizados' : 'criados';
    if (f.mode === 'before') return `${base} até ${formatDay(f.to)}`;
    if (f.mode === 'after') return `${base} a partir de ${formatDay(f.from)}`;
    if (f.mode === 'between') return `${base} de ${formatDay(f.from)} até ${formatDay(f.to)}`;
    return 'de qualquer data';
  };

  const previewBtn = button('Ver cards', () => preview(), { variant: 'btn-primary', icon: 'eye' });
  const preview = async () => {
    const problems = [
      !f.panel && 'escolha o painel',
      f.panel && !f.step && 'escolha a coluna',
      (f.mode === 'before' || f.mode === 'between') && !f.to && 'escolha a data final',
      (f.mode === 'after' || f.mode === 'between') && !f.from && 'escolha a data inicial',
      !f.statuses.length && 'marque pelo menos uma situação',
    ].filter(Boolean);
    if (problems.length) return swap(result, notice(`Falta: ${problems.join(', ')}.`, 'warn'));
    swap(result, loading('Buscando os cards...'));
    const { after, before } = range();
    let data;
    try {
      data = await api('cards', {
        action: 'preview',
        clientToken: clientToken(),
        filter: { panelId: f.panel.id, stepId: f.step.id, statuses: f.statuses, dateField: f.dateField, after: after?.toISOString(), before: before?.toISOString() },
      });
    } catch (err) {
      swap(result, notice(err.message));
      return;
    }
    renderPreview(data);
  };

  const renderPreview = ({ cards, truncated }) => {
    const where = `"${f.step.title}" do painel "${f.panel.title}", ${describe()}`;
    if (!cards.length) return swap(result, notice(`Nenhum card em ${where}.`, 'info'));
    const dateKey = f.dateField === 'updated' ? 'updatedAt' : 'createdAt';
    let showAll = cards.length <= 30;
    const list = h('div', { class: 'list' });
    const renderList = () => list.replaceChildren(
      h('div', { class: 'list-title' }, 'Cards que serão arquivados', badge('', String(cards.length))),
      ...(showAll ? cards : cards.slice(0, 30)).map((c) => h('div', { class: 'row' },
        h('span', { class: 'row-dot' }, svg('card')),
        h('div', {}, h('div', { class: 'row-title' }, c.title), h('div', { class: 'row-detail' }, [c.contact, CARD_STATUS[c.status] ?? c.status].filter(Boolean).join(' · '))),
        h('span', { class: 'row-detail' }, shortDate(c[dateKey])))),
      !showAll ? h('div', { class: 'list-more' }, button(`Mostrar todos (${cards.length})`, () => { showAll = true; renderList(); }, { variant: 'btn-ghost btn-small' })) : null);
    renderList();
    const go = button(`Arquivar ${cards.length} card(s)`, () => confirmArchive(cards, where), { variant: 'btn-danger', icon: 'archive' });
    swap(result,
      notice(`${cards.length} card(s) em ${where}.`, 'info'),
      truncated ? notice('Mostrando só os primeiros 5.000. Depois de arquivar, rode de novo para o restante.', 'warn') : null,
      list,
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), go));
    spotlight(go);
  };

  const confirmArchive = (cards, where) => {
    swap(result,
      h('div', { class: 'confirm-box' },
        svg('alert'),
        h('div', {},
          h('strong', {}, `Arquivar ${cards.length} card(s)?`),
          h('p', {}, `Em ${where}. Eles saem da coluna e ficam como arquivados no WTS.`)),
        h('div', { class: 'toolbar' },
          button('Cancelar', () => renderPreview({ cards }), { variant: 'btn-ghost' }),
          button('Sim, arquivar', () => runArchive(cards), { variant: 'btn-danger', icon: 'archive' }))));
  };

  const runArchive = async (cards) => {
    let stop = false;
    const tiles = stats([{ id: 'ok', label: 'Arquivados', tone: 'ok' }, { id: 'err', label: 'Com erro', tone: 'err' }, { id: 'left', label: 'Faltam' }]);
    const bar = h('div', { class: 'progress' }, h('span'));
    const errors = h('div');
    const stopBtn = button('Parar', () => { stop = true; stopBtn.disabled = true; setLabel(stopBtn, 'Parando...'); }, { icon: 'stop' });
    const pace = h('p', { class: 'hint' });
    const status = h('div', {}, loading('Arquivando de pouco em pouco... Deixe esta tela aberta.'), pace);
    const started = Date.now();
    swap(result, tiles, bar, h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), stopBtn), status, errors);
    let ok = 0;
    const failed = [];
    tiles.set('left', cards.length);
    for (let i = 0; i < cards.length && !stop; i += ARCHIVE_BATCH) {
      const batch = cards.slice(i, i + ARCHIVE_BATCH);
      try {
        const { results } = await api('cards', { action: 'archive', clientToken: clientToken(), ids: batch.map((c) => c.id) });
        for (const r of results) r.status === 'ok' ? ok++ : failed.push({ card: cards.find((c) => c.id === r.id), message: r.message });
      } catch (err) {
        failed.push(...batch.map((card) => ({ card, message: err.message })));
        if (err.message === 'Sessão expirada') break;
      }
      const done = Math.min(i + ARCHIVE_BATCH, cards.length);
      tiles.set('ok', ok);
      tiles.set('err', failed.length);
      tiles.set('left', cards.length - done);
      bar.firstChild.style.transform = `scaleX(${done / cards.length})`;
      const left = cards.length - done;
      if (left && !stop) {
        const perCard = (Date.now() - started) / done;
        const minutes = Math.ceil((perCard * left) / 60000);
        pace.textContent = `Faltam cerca de ${minutes} minuto(s). Pode parar a qualquer hora: o que já foi arquivado fica arquivado.`;
        // Pausa entre lotes (interrompida se clicar em Parar).
        for (let waited = 0; waited < ARCHIVE_PAUSE_MS && !stop; waited += 250) await new Promise((r) => setTimeout(r, 250));
      }
    }
    stopBtn.remove();
    const left = cards.length - ok - failed.length;
    swap(status,
      notice(stop && left ? `Parado: ${ok} arquivado(s), ${left} não processado(s).` : `Pronto: ${ok} card(s) arquivado(s)${failed.length ? `, ${failed.length} com erro` : ''}.`, failed.length || (stop && left) ? 'warn' : 'ok'),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), button('Ver de novo a coluna', () => preview(), { icon: 'refresh' })));
    if (failed.length) {
      errors.replaceChildren(h('div', { class: 'list' },
        h('div', { class: 'list-title' }, 'Não arquivados', badge('err', String(failed.length))),
        ...failed.slice(0, 50).map(({ card, message }) => h('div', { class: 'row' },
          h('span', { class: 'row-dot err' }, svg('x')),
          h('div', {}, h('div', { class: 'row-title' }, card?.title ?? 'Card'), h('div', { class: 'row-msg' }, message))))));
    }
  };

  swap(body,
    section('1', 'Painel', panelGrid),
    section('2', 'Coluna', stepBox),
    section('3', 'Período',
      field('Quais cards', segmented([['all', 'Todos'], ['before', 'Até uma data'], ['after', 'A partir de uma data'], ['between', 'Entre datas']], f.mode, (v) => { f.mode = v; renderPeriod(); reset(); }, 'Período'),
        'Ex.: "Até uma data" + 31 de agosto = arquiva tudo do dia 31/08 para trás.'),
      periodBox,
      field('Data usada no filtro', segmented([['created', 'Criação do card'], ['updated', 'Última atualização']], f.dateField, (v) => { f.dateField = v; reset(); }, 'Data usada'),
        'Criação = quando o card entrou no painel. Atualização = última mudança no card.'),
      field('Situação', statusChips, 'Cards já arquivados nunca entram.')),
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), previewBtn),
    result);
  renderSteps();
  stagger(panelGrid.querySelectorAll('.pick'), { step: 25, y: 6 });
}

// ---------- Importar contatos de uma planilha ----------

const CONTACT_BATCH = 100;

// Lê CSV (vírgula ou ponto e vírgula, aspas, BOM do Excel).
function parseCsv(textIn) {
  const textCsv = textIn.replace(/^﻿/, '');
  const firstLine = textCsv.split(/\r?\n/, 1)[0] ?? '';
  const sep = (firstLine.match(/;/g) ?? []).length > (firstLine.match(/,/g) ?? []).length ? ';' : (firstLine.includes('\t') && !firstLine.includes(',') ? '\t' : ',');
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < textCsv.length; i++) {
    const c = textCsv[i];
    if (quoted) {
      if (c === '"' && textCsv[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') quoted = false; else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(cell); cell = ''; } else if (c === '\n' || c === '\r') {
      if (c === '\r' && textCsv[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

// Lista suspensa própria (no lugar do <select> padrão).
function menuSelect(options, value, onChange, label) {
  const current = () => options.find((o) => o.value === value) ?? options[0];
  const text = h('span', {}, current().label);
  const trigger = h('button', { type: 'button', class: 'menu-trigger', 'aria-haspopup': 'listbox', 'aria-label': label }, text, h('span', { class: 'menu-caret', 'aria-hidden': 'true' }, '▾'));
  const list = h('div', { class: 'menu-pop', role: 'listbox', hidden: true });
  const wrap = h('div', { class: 'menu-field' }, trigger, list);
  const close = () => { list.hidden = true; trigger.setAttribute('aria-expanded', 'false'); document.removeEventListener('pointerdown', outside, true); };
  const outside = (e) => { if (!wrap.contains(e.target)) close(); };
  const render = () => list.replaceChildren(...options.map((o) => {
    if (o.group) return h('div', { class: 'menu-group' }, o.group);
    return h('button', {
      type: 'button', role: 'option', class: `menu-opt${o.value === value ? ' is-on' : ''}`, 'aria-selected': String(o.value === value),
      onclick: () => { value = o.value; text.textContent = o.label; trigger.classList.toggle('is-set', Boolean(value)); close(); onChange(value); },
    }, o.label);
  }));
  trigger.classList.toggle('is-set', Boolean(value));
  trigger.onclick = () => {
    if (!list.hidden) return close();
    render();
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    enter(list, { y: -4, duration: 180 });
    list.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
    document.addEventListener('pointerdown', outside, true);
  };
  list.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); trigger.focus(); } });
  return { el: wrap, set: (v) => { value = v; text.textContent = current().label; trigger.classList.toggle('is-set', Boolean(v)); } };
}

// Coluna da planilha → campo do WTS, pelo nome do cabeçalho.
function guessColumn(header, fields) {
  const n = normalizeName(header).normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/^(nome|name|cliente|contato|nome completo)$/.test(n)) return 'name';
  if (/(telefone|celular|whats|fone|phone|numero)/.test(n)) return 'phoneNumber';
  if (/(e-?mail)/.test(n)) return 'email';
  if (/insta/.test(n)) return 'instagram';
  if (/(etiqueta|tag)/.test(n)) return 'tags';
  if (/(^obs|observa|anota|nota)/.test(n)) return 'annotation';
  const field = fields.find((f) => normalizeName(f.name) === normalizeName(header) || f.key.toLowerCase() === n);
  return field ? `cf:${field.key}` : '';
}

function renderContactsBlock(view) {
  const body = h('div');
  view.append(h('p', { class: 'panel-desc' }, 'Suba a planilha de contatos (CSV), diga o que é cada coluna e importe. Quem já existe (mesmo telefone ou e-mail) é atualizado.'), body);
  const tokenInput = $('client-token');
  let timer = null;
  const onToken = () => {
    if (!body.isConnected) return tokenInput.removeEventListener('input', onToken);
    clearTimeout(timer);
    timer = setTimeout(() => loadContactsImport(body), 500);
  };
  tokenInput.addEventListener('input', onToken);
  loadContactsImport(body);
}

async function loadContactsImport(body) {
  if (!requireToken(body)) return;
  swap(body, loading('Lendo etiquetas, sequências e campos da conta...'));
  let opts;
  try {
    opts = await api('contacts', { action: 'options', clientToken: clientToken() });
  } catch (err) {
    retry(body, err, () => loadContactsImport(body));
    return;
  }
  setTokenStatus('ok');

  const FIELD_OPTIONS = [
    { value: '', label: 'Não importar' },
    { value: 'name', label: 'Nome' },
    { value: 'phoneNumber', label: 'Telefone (WhatsApp)' },
    { value: 'email', label: 'E-mail' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tags', label: 'Etiquetas (separadas por vírgula)' },
    { value: 'annotation', label: 'Anotação' },
    ...(opts.fields.length ? [{ group: 'Campos personalizados' }, ...opts.fields.map((f) => ({ value: `cf:${f.key}`, label: f.name }))] : []),
  ];
  const sheet = { headers: [], rows: [], map: [] };
  const extra = { tags: new Set(), sequences: new Set() };
  const mapBox = h('div');
  const result = h('div');

  const fileInput = h('input', { type: 'file', accept: '.csv,text/csv,.txt' });
  const drop = h('label', { class: 'drop' }, svg('upload'), h('span', {}, 'Escolher ou arrastar a planilha (.csv)'), fileInput);
  const fileError = h('div');
  const readFile = async (file) => {
    fileError.replaceChildren();
    result.replaceChildren();
    const rows = parseCsv(await file.text());
    if (rows.length < 2) return fileError.replaceChildren(notice('A planilha precisa de uma linha de títulos e pelo menos um contato.'));
    sheet.headers = rows[0].map((c, i) => c.trim() || `Coluna ${i + 1}`);
    sheet.rows = rows.slice(1);
    sheet.map = sheet.headers.map((hd) => guessColumn(hd, opts.fields));
    drop.querySelector('span').textContent = `${file.name} · ${sheet.rows.length} linha(s)`;
    renderMap();
  };
  fileInput.onchange = () => fileInput.files[0] && readFile(fileInput.files[0]);
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('dragging'); };
  drop.ondragleave = () => drop.classList.remove('dragging');
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('dragging'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };

  const renderMap = () => {
    swap(mapBox, section('2', 'O que é cada coluna',
      h('p', { class: 'hint' }, 'Já reconheci pelos títulos. Confira; precisa de pelo menos Telefone, E-mail ou Instagram.'),
      h('div', { class: 'list' }, ...sheet.headers.map((hd, i) => {
        const sample = sheet.rows.map((r) => r[i]).find((v) => v?.trim()) ?? '';
        return h('div', { class: 'map-row' },
          h('div', { class: 'map-from' }, h('div', { class: 'row-title' }, hd), h('div', { class: 'row-detail' }, sample ? `Ex.: ${sample.slice(0, 60)}` : 'Vazia')),
          h('span', { class: 'arrow', 'aria-hidden': 'true' }, svg('arrow')),
          menuSelect(FIELD_OPTIONS, sheet.map[i], (v) => { sheet.map[i] = v; result.replaceChildren(); }, `Campo da coluna ${hd}`).el);
      }))),
    section('3', 'Para todos os contatos (opcional)',
      field('Etiquetas', h('div', { class: 'tag-pick' }, tagChips, tagCreator), 'Ex.: "Ex-cliente". Contato que já existe só ganha a etiqueta: nome, e-mail e campos dele não mudam.'),
      opts.sequences.length ? field('Colocar na sequência', chipToggles(opts.sequences, extra.sequences), 'Os contatos entram na sequência e começam a receber as mensagens dela.') : null,
),
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), button('Ver contatos', previewImport, { variant: 'btn-primary', icon: 'eye' })));
  };

  const toggleChip = (it, set) => {
    const chip = h('button', { type: 'button', class: `pick-chip pick-chip-sm${set.has(it.id) ? ' is-on' : ''}`, 'aria-pressed': String(set.has(it.id)) }, it.name);
    chip.onclick = () => {
      set.has(it.id) ? set.delete(it.id) : set.add(it.id);
      chip.classList.toggle('is-on', set.has(it.id));
      chip.setAttribute('aria-pressed', String(set.has(it.id)));
      result.replaceChildren();
    };
    return chip;
  };
  const chipToggles = (items, set) => h('div', { class: 'chip-row' }, ...items.map((it) => toggleChip(it, set)));

  // Etiquetas: as da conta + criar uma nova na hora (ex.: "Ex-cliente").
  const tagChips = chipToggles(opts.tags, extra.tags);
  const newTag = h('input', { type: 'text', placeholder: 'Nova etiqueta, ex.: Ex-cliente', maxLength: 255, 'aria-label': 'Nome da nova etiqueta' });
  const tagStatus = h('span', { class: 'hint' });
  const createBtn = button('Criar etiqueta', async () => {
    const name = newTag.value.trim();
    if (!name) return newTag.focus();
    createBtn.disabled = true;
    tagStatus.textContent = '';
    try {
      const { tag, existed } = await api('contacts', { action: 'createTag', clientToken: clientToken(), name });
      if (!opts.tags.some((t) => t.id === tag.id)) {
        opts.tags.push(tag);
        extra.tags.add(tag.id);
        const chip = toggleChip(tag, extra.tags);
        tagChips.append(chip);
        pop(chip);
      } else {
        extra.tags.add(tag.id);
        tagChips.replaceChildren(...opts.tags.map((t) => toggleChip(t, extra.tags)));
      }
      tagStatus.textContent = existed ? `"${tag.name}" já existia: marcada.` : `Etiqueta "${tag.name}" criada e marcada.`;
      newTag.value = '';
      result.replaceChildren();
    } catch (err) {
      tagStatus.textContent = err.message;
    } finally {
      createBtn.disabled = false;
    }
  }, { variant: 'btn-small', icon: 'plus' });
  newTag.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); createBtn.click(); } });
  const tagCreator = h('div', { class: 'tag-create' }, newTag, createBtn, tagStatus);

  // Monta os contatos e separa as linhas que não dá para importar.
  const buildContacts = () => {
    const ok = [];
    const skipped = [];
    sheet.rows.forEach((r, idx) => {
      const c = { tags: [], customFields: {} };
      sheet.map.forEach((target, i) => {
        const v = (r[i] ?? '').trim();
        if (!target || !v) return;
        if (target === 'tags') c.tags.push(...v.split(/[,;|]/).map((t) => t.trim()).filter(Boolean));
        else if (target.startsWith('cf:')) c.customFields[target.slice(3)] = v;
        else c[target] = v;
      });
      const phone = String(c.phoneNumber ?? '').replace(/\D/g, '');
      if (c.phoneNumber !== undefined) c.phoneNumber = phone;
      const reason = !phone && !c.email && !c.instagram ? 'sem telefone, e-mail ou Instagram'
        : phone && phone.length < 10 ? `telefone curto (${phone})`
          : c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) ? 'e-mail inválido' : '';
      (reason ? skipped : ok).push(reason ? { line: idx + 2, reason, row: c } : c);
    });
    return { ok, skipped };
  };

  const previewImport = () => {
    if (!sheet.map.some((m) => ['phoneNumber', 'email', 'instagram'].includes(m))) {
      return swap(result, notice('Marque qual coluna é o Telefone, o E-mail ou o Instagram.', 'warn'));
    }
    const { ok, skipped } = buildContacts();
    const label = (c) => c.name || c.phoneNumber || c.email || c.instagram;
    swap(result,
      notice(`${ok.length} contato(s) prontos para importar${skipped.length ? `, ${skipped.length} linha(s) serão puladas` : ''}.`, ok.length ? 'info' : 'warn'),
      ok.length ? h('div', { class: 'list' },
        h('div', { class: 'list-title' }, 'Primeiros contatos', badge('', String(ok.length))),
        ...ok.slice(0, 15).map((c) => h('div', { class: 'row' },
          h('span', { class: 'row-dot' }, svg('user')),
          h('div', {}, h('div', { class: 'row-title' }, label(c)), h('div', { class: 'row-detail' }, [c.phoneNumber, c.email, c.tags.length ? `Etiquetas: ${c.tags.join(', ')}` : ''].filter(Boolean).join(' · '))),
          h('span')))) : null,
      skipped.length ? h('details', { class: 'advanced' }, h('summary', {}, `Linhas puladas (${skipped.length})`),
        h('div', { class: 'list' }, ...skipped.slice(0, 100).map((s) => h('div', { class: 'row' },
          h('span', { class: 'row-dot err' }, svg('x')),
          h('div', {}, h('div', { class: 'row-title' }, `Linha ${s.line}`), h('div', { class: 'row-msg' }, s.reason)), h('span'))))) : null,
      ok.length ? h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), button(`Importar ${ok.length} contato(s)`, () => runImport(ok), { variant: 'btn-primary', icon: 'upload' })) : null);
  };

  const runImport = async (contacts) => {
    const tagNames = opts.tags.filter((t) => extra.tags.has(t.id)).map((t) => t.name);
    const sequenceIds = [...extra.sequences];
    const tiles = stats([{ id: 'ok', label: 'Importados', tone: 'ok' }, { id: 'err', label: 'Com erro', tone: 'err' }, { id: 'left', label: 'Faltam' }]);
    const bar = h('div', { class: 'progress' }, h('span'));
    const errors = h('div');
    const status = h('div', {}, loading('Importando... Deixe esta tela aberta.'));
    swap(result, tiles, bar, status, errors);
    let done = 0;
    let saved = 0;
    const failed = [];
    tiles.set('left', contacts.length);
    for (let i = 0; i < contacts.length; i += CONTACT_BATCH) {
      const batch = contacts.slice(i, i + CONTACT_BATCH);
      try {
        const r = await api('contacts', { action: 'import', clientToken: clientToken(), contacts: batch, tagNames, sequenceIds });
        saved += r.saved;
      } catch (err) {
        failed.push({ from: i + 1, to: i + batch.length, count: batch.length, message: err.message });
        if (err.message === 'Sessão expirada') break;
      }
      done = Math.min(i + CONTACT_BATCH, contacts.length);
      tiles.set('ok', saved);
      tiles.set('err', failed.reduce((n, f) => n + f.count, 0));
      tiles.set('left', contacts.length - done);
      bar.firstChild.style.transform = `scaleX(${done / contacts.length})`;
    }
    swap(status, notice(failed.length ? `Importados ${saved}; ${failed.length} lote(s) com erro.` : `Pronto: ${saved} contato(s) importados.`, failed.length ? 'warn' : 'ok'));
    if (failed.length) {
      errors.replaceChildren(h('div', { class: 'list' },
        h('div', { class: 'list-title' }, 'Lotes com erro'),
        ...failed.map((f) => h('div', { class: 'row' }, h('span', { class: 'row-dot err' }, svg('x')),
          h('div', {}, h('div', { class: 'row-title' }, `Contatos ${f.from} a ${f.to}`), h('div', { class: 'row-msg' }, f.message)), h('span')))));
    }
  };

  swap(body,
    section('1', 'Planilha', h('div', { class: 'drop-wrap' }, drop), fileError,
      howTo('Como gerar o CSV',
        'No Excel: Arquivo → Salvar como → CSV UTF-8 (separado por vírgulas).',
        'No Google Planilhas: Arquivo → Fazer download → Valores separados por vírgula (.csv).',
        'A primeira linha precisa ter os títulos das colunas. Ex.: Nome, Telefone, E-mail, Etiquetas.')),
    mapBox,
    result);
}

// ---------- Chatbots padrão (JSON para colar no WTS) ----------

async function renderChatbotsBlock(view) {
  const body = h('div');
  view.append(h('p', { class: 'panel-desc' }, 'A API do WTS não cria chatbots. Copie o JSON do chatbot padrão e cole no chatbot da conta do cliente.'), body);
  swap(body, loading('Carregando chatbots padrão...'));
  let chatbots;
  try {
    ({ chatbots } = await api('portal', { action: 'chatbots' }));
  } catch (err) {
    retry(body, err, () => { view.replaceChildren(); renderChatbotsBlock(view); });
    return;
  }
  if (!chatbots.length) {
    swap(body, notice('Ainda não há chatbots padrão cadastrados. Mande o JSON de cada chatbot da conta modelo para incluir aqui.', 'info'));
    return;
  }
  const list = h('div', { class: 'list' },
    h('div', { class: 'list-title' }, 'Chatbots padrão', badge('', String(chatbots.length))),
    ...chatbots.map((bot) => h('details', { class: 'compare-item' },
      h('summary', { class: 'compare-row bot-row' },
        h('div', { class: 'compare-name' },
          h('span', { class: 'chevron', 'aria-hidden': 'true' }, svg('arrow')),
          h('div', {},
            h('div', { class: 'row-title' }, bot.name),
            h('div', { class: 'row-detail' }, bot.valid ? `${Math.max(1, Math.round(bot.size / 1024))} KB` : 'JSON com erro: confira o arquivo'))),
        h('span'),
        h('span')),
      h('div', { class: 'compare-detail' },
        h('div', { class: 'toolbar' },
          bot.video ? h('a', { class: 'btn btn-small', href: bot.video, target: '_blank', rel: 'noopener' }, svg('play'), h('span', {}, 'Ver vídeo')) : null,
          h('span', { class: 'spacer' }),
          button('Baixar', () => download(bot.id, bot.content, 'application/json'), { variant: 'btn-small', icon: 'download' }),
          button('Copiar JSON', (e) => flashOnCopy(e.currentTarget, bot.content), { variant: 'btn-primary btn-small', icon: 'copy' })),
        h('pre', { class: 'detail-text' }, bot.content),
        howTo('Como colar no WTS',
          'Clique em "Copiar JSON".',
          'No WTS do cliente, abra Chatbots e crie (ou abra) o chatbot.',
          'Use a opção de importar/colar JSON do editor e cole (Ctrl+V).',
          'Confira equipes, etiquetas e campos usados no chatbot: os nomes vêm da conta modelo.')))));
  list.addEventListener('toggle', (e) => {
    if (!e.target.matches?.('.compare-item') || !e.target.open) return;
    for (const other of list.querySelectorAll('.compare-item[open]')) if (other !== e.target) other.open = false;
  }, true);
  swap(body, list);
  stagger(list.querySelectorAll('.compare-item'), { step: 25, y: 6 });
}

// ---------- Portal do cliente: passo a passo, minha conta ----------

// Link de vídeo → endereço para mostrar dentro da página (YouTube, Loom, Drive, Vimeo).
function embedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === 'loom.com') return `https://www.loom.com/embed/${u.pathname.split('/').pop()}`;
    if (host === 'drive.google.com') return url.replace(/\/view.*$/, '/preview');
    if (host === 'vimeo.com') return `https://player.vimeo.com/video/${u.pathname.split('/').filter(Boolean)[0]}`;
  } catch { /* link inválido */ }
  return null;
}

async function renderGuideBlock(view) {
  const body = h('div');
  view.append(body);
  swap(body, loading('Carregando o passo a passo...'));
  let data;
  try {
    data = await api('portal', { action: 'guide' });
  } catch (err) {
    retry(body, err, () => { view.replaceChildren(); renderGuideBlock(view); });
    return;
  }
  const done = new Set(data.done);
  const total = data.steps.length;
  const bar = h('div', { class: 'progress' }, h('span'));
  const counter = h('strong');
  const paintProgress = () => {
    counter.textContent = `${done.size} de ${total} passos concluídos`;
    bar.firstChild.style.transform = `scaleX(${total ? done.size / total : 0})`;
  };
  const save = () => (PORTAL === 'cliente' ? api('portal', { action: 'guideDone', done: [...done] }).catch(() => {}) : null);

  const list = h('div', { class: 'guide' }, ...data.steps.map((step, i) => {
    const check = h('button', { type: 'button', class: 'guide-check', 'aria-pressed': String(done.has(step.id)), 'aria-label': `Marcar "${step.title}" como concluído` }, svg('check'));
    const item = h('details', { class: `guide-step${done.has(step.id) ? ' is-done' : ''}`, open: !done.has(step.id) && i === data.steps.findIndex((s) => !done.has(s.id)) },
      h('summary', {},
        h('span', { class: 'guide-num' }, String(i + 1)),
        h('span', { class: 'guide-title' }, step.title, h('span', { class: 'guide-desc' }, step.desc)),
        h('span', { class: 'chevron', 'aria-hidden': 'true' }, svg('arrow'))),
      h('div', { class: 'guide-body' },
        step.video && embedUrl(step.video)
          ? h('div', { class: 'guide-video' }, h('iframe', { src: embedUrl(step.video), title: `Vídeo: ${step.title}`, loading: 'lazy', allow: 'fullscreen; picture-in-picture', allowFullscreen: true }))
          : step.video ? h('a', { class: 'btn btn-small', href: step.video, target: '_blank', rel: 'noopener' }, svg('play'), h('span', {}, 'Assistir vídeo'))
            : h('p', { class: 'hint guide-novideo' }, svg('play'), ' Vídeo em breve.'),
        step.tips.length ? h('ul', { class: 'guide-tips' }, ...step.tips.map((t) => h('li', {}, t))) : null,
        h('div', { class: 'toolbar' },
          ...step.blocks.map((id) => BLOCK_BY_ID[id]).filter(Boolean)
            .filter((b) => PORTAL !== 'cliente' || CLIENT_BLOCK_IDS.includes(b.id))
            .map((b) => button(`Abrir ${b.title}`, () => openBlock(b), { icon: b.icon })),
          h('span', { class: 'spacer' }),
          h('label', { class: 'guide-done' }, check, 'Concluído'))));
    const paint = () => {
      const on = done.has(step.id);
      check.setAttribute('aria-pressed', String(on));
      item.classList.toggle('is-done', on);
    };
    check.onclick = () => {
      done.has(step.id) ? done.delete(step.id) : done.add(step.id);
      paint();
      pop(check);
      paintProgress();
      save();
      // Concluiu: abre o próximo que falta.
      if (done.has(step.id)) {
        item.open = false;
        const next = [...list.querySelectorAll('.guide-step')].find((el) => !el.classList.contains('is-done'));
        if (next) { next.open = true; spotlight(next); }
      }
    };
    return item;
  }));
  list.addEventListener('toggle', (e) => {
    if (!e.target.matches?.('.guide-step') || !e.target.open) return;
    for (const other of list.querySelectorAll('.guide-step[open]')) if (other !== e.target) other.open = false;
  }, true);
  paintProgress();
  swap(body,
    h('div', { class: 'guide-head' }, counter, bar),
    data.steps.length ? list : notice('O passo a passo ainda não foi configurado.', 'info'),
    h('p', { class: 'hint' }, 'Dúvidas? Fale com a equipe Frédy pelo WhatsApp.'));
  stagger(list.querySelectorAll('.guide-step'), { step: 30, y: 8 });
}

function renderAccountBlock(view) {
  const current = h('input', { type: 'password', autocomplete: 'current-password' });
  const next = h('input', { type: 'password', autocomplete: 'new-password', minLength: 8 });
  const repeat = h('input', { type: 'password', autocomplete: 'new-password', minLength: 8 });
  const status = h('div');
  const saveBtn = button('Trocar senha', async () => {
    status.replaceChildren();
    if (next.value.length < 8) return status.replaceChildren(notice('A senha nova precisa de pelo menos 8 caracteres.', 'warn'));
    if (next.value !== repeat.value) return status.replaceChildren(notice('As duas senhas novas não são iguais.', 'warn'));
    saveBtn.disabled = true;
    try {
      await api('portal', { action: 'changePassword', current: current.value, next: next.value });
      current.value = next.value = repeat.value = '';
      status.replaceChildren(notice('Senha trocada.', 'ok'));
    } catch (err) {
      status.replaceChildren(notice(err.message));
    } finally {
      saveBtn.disabled = false;
    }
  }, { variant: 'btn-primary', icon: 'check' });
  view.append(
    section('', 'Sua empresa', h('p', { class: 'panel-desc' }, state.session?.company ?? '')),
    section('', 'Trocar senha',
      h('div', { class: 'form-stack' },
        field('Senha atual', current, ''),
        field('Senha nova', next, 'Pelo menos 8 caracteres.'),
        field('Repita a senha nova', repeat, '')),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), saveBtn),
      status),
    section('', 'Sair',
      h('div', { class: 'toolbar' }, button('Sair do portal', () => { saveSession(null); showLogin('Você saiu.'); }, { icon: 'back' }))));
}

// ---------- Cadastro de cliente novo (/cadastro, sem login) ----------

function renderSignupPage() {
  document.title = 'Cadastro · Frédy';
  setHeader('Crie sua conta Frédy', 'Preencha os dados da empresa e da equipe. A gente cria a conta e te avisa.', false);
  showView('block');
  $('reopen').lastChild.textContent = ' Abrir cadastro';
  const view = $('view-block');
  view.replaceChildren();

  const input = (attrs = {}) => h('input', { type: 'text', ...attrs });
  const f = {
    cnpj: input({ inputMode: 'numeric', placeholder: '00.000.000/0000-00', maxLength: 18 }),
    legalName: input({ placeholder: 'Empresa Exemplo LTDA' }),
    tradeName: input({ placeholder: 'Empresa Exemplo' }),
    segment: input({ placeholder: 'Clínica, loja, agência de viagens...' }),
    companyPhone: input({ type: 'tel', placeholder: '(47) 3333-0000' }),
    site: input({ placeholder: 'www.empresa.com.br' }),
    cep: input({ inputMode: 'numeric', placeholder: '00000-000', maxLength: 9 }),
    street: input({ placeholder: 'Rua das Flores' }),
    number: input({ placeholder: '123' }),
    complement: input({ placeholder: 'Sala 2' }),
    district: input({ placeholder: 'Centro' }),
    city: input({ placeholder: 'Joinville' }),
    uf: input({ placeholder: 'SC', maxLength: 2 }),
    ownerName: input({ placeholder: 'Maria Souza', autocomplete: 'name' }),
    ownerEmail: input({ type: 'email', placeholder: 'maria@empresa.com.br', autocomplete: 'email' }),
    ownerPhone: input({ type: 'tel', placeholder: '(47) 99999-0000', autocomplete: 'tel' }),
    password: input({ type: 'password', autocomplete: 'new-password', minLength: 8 }),
    password2: input({ type: 'password', autocomplete: 'new-password', minLength: 8 }),
    notes: h('textarea', { rows: 3, placeholder: 'Algo que a equipe precise saber (opcional)' }),
    website: input({ tabIndex: -1, autocomplete: 'off', 'aria-hidden': 'true' }), // armadilha para robôs
  };
  // Máscaras simples.
  f.cnpj.oninput = () => {
    const d = f.cnpj.value.replace(/\D/g, '').slice(0, 14);
    f.cnpj.value = d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
  };
  const cepStatus = h('span', { class: 'field-example' }, 'Preenche o endereço sozinho.');
  f.cep.oninput = async () => {
    const d = f.cep.value.replace(/\D/g, '').slice(0, 8);
    f.cep.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    if (d.length !== 8) return;
    cepStatus.textContent = 'Buscando endereço...';
    try {
      const a = await api('portal', { action: 'cep', cep: d });
      f.street.value = a.street || f.street.value;
      f.district.value = a.district || f.district.value;
      f.city.value = a.city || f.city.value;
      f.uf.value = a.uf || f.uf.value;
      cepStatus.textContent = 'Endereço encontrado. Confira e preencha o número.';
      f.number.focus();
    } catch (err) {
      cepStatus.textContent = err.message;
    }
  };
  f.uf.oninput = () => { f.uf.value = f.uf.value.toUpperCase().replace(/[^A-Z]/g, ''); };

  // Usuários: quantos + os dados de cada um.
  const usersBox = h('div', { class: 'signup-users' });
  const count = input({ type: 'number', min: 1, max: 100, value: 2, inputMode: 'numeric' });
  const userRow = (i) => {
    const profile = h('input', { type: 'hidden', value: i === 0 ? 'Admin' : 'Agent' });
    return h('div', { class: 'signup-user' },
      h('div', { class: 'signup-user-head' }, h('span', { class: 'step-num' }, String(i + 1)), h('strong', {}, `Usuário ${i + 1}`)),
      h('div', { class: 'form-grid' },
        field('Nome completo', input({ 'data-u': 'name', placeholder: 'Ana Lima' }), ''),
        field('Apelido (como aparece no atendimento)', input({ 'data-u': 'nickname', placeholder: 'Ana' }), ''),
        field('E-mail', input({ type: 'email', 'data-u': 'email', placeholder: 'ana@empresa.com.br' }), 'Recebe o convite para criar a senha.'),
        field('Telefone (opcional)', input({ type: 'tel', 'data-u': 'phone', placeholder: '(47) 98888-7777' }), ''),
        field('Perfil', h('div', {}, profile, segmented([['Agent', 'Atendente'], ['Admin', 'Administrador']], profile.value, (v) => { profile.value = v; }, 'Perfil')), '')),
      profile);
  };
  const syncUsers = () => {
    const n = Math.max(1, Math.min(100, Number(count.value) || 1));
    const rows = [...usersBox.children];
    for (let i = rows.length; i < n; i++) { const row = userRow(i); usersBox.append(row); enter(row, { y: 6 }); }
    rows.slice(n).forEach((r) => r.remove());
  };
  count.oninput = syncUsers;
  syncUsers();

  const consent = h('input', { type: 'checkbox' });
  const status = h('div');
  const sendBtn = button('Enviar cadastro', async () => {
    status.replaceChildren();
    const users = [...usersBox.querySelectorAll('.signup-user')].map((row) => ({
      ...Object.fromEntries([...row.querySelectorAll('[data-u]')].map((el) => [el.dataset.u, el.value.trim()])),
      profile: row.querySelector('input[type=hidden]').value,
    }));
    const data = {
      cnpj: f.cnpj.value, legalName: f.legalName.value, tradeName: f.tradeName.value, segment: f.segment.value,
      companyPhone: f.companyPhone.value, site: f.site.value,
      address: { cep: f.cep.value, street: f.street.value, number: f.number.value, complement: f.complement.value, district: f.district.value, city: f.city.value, uf: f.uf.value },
      owner: { name: f.ownerName.value, email: f.ownerEmail.value, phone: f.ownerPhone.value },
      users, notes: f.notes.value, consent: consent.checked, website: f.website.value,
    };
    if (f.password.value !== f.password2.value) {
      status.replaceChildren(notice('As duas senhas não são iguais.'));
      return;
    }
    data.password = f.password.value;
    sendBtn.disabled = true;
    status.replaceChildren(loading('Enviando e criando sua conta... pode levar até 1 minuto.'));
    try {
      const result = await api('portal', { action: 'signup', data });
      if (result.created) {
        setHeader('Conta criada!', 'Tudo pronto para começar a configuração.', false);
        swap(view, h('div', { class: 'signup-done' },
          h('span', { class: 'signup-done-icon', 'aria-hidden': 'true' }, svg('check')),
          h('h2', {}, 'Sua conta Frédy foi criada'),
          h('p', {}, `Entre no portal com o e-mail ${result.email} e a senha que você acabou de criar. Lá tem o passo a passo para deixar a conta pronta.`),
          h('a', { class: 'btn btn-primary', href: '/cliente' }, svg('arrow'), h('span', {}, 'Entrar no portal')),
          h('p', { class: 'hint' }, 'Os usuários que você cadastrou recebem o convite no e-mail de cada um.')));
      } else {
        setHeader('Cadastro recebido!', 'Sua conta está sendo criada.', false);
        swap(view, h('div', { class: 'signup-done' },
          h('span', { class: 'signup-done-icon', 'aria-hidden': 'true' }, svg('check')),
          h('h2', {}, 'Recebemos seu cadastro'),
          h('p', {}, `A equipe Frédy vai finalizar sua conta e avisar em ${data.owner.email}. Depois é só entrar no portal com esse e-mail e a senha que você criou.`),
          h('p', { class: 'hint' }, 'Pode fechar esta página.')));
      }
      pop(view.querySelector('.signup-done-icon'));
    } catch (err) {
      status.replaceChildren(notice(err.message));
      status.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    } finally {
      sendBtn.disabled = false;
    }
  }, { variant: 'btn-primary', icon: 'arrow' });

  view.append(
    section('1', 'Empresa',
      h('div', { class: 'form-grid' },
        field('CNPJ', f.cnpj, 'Ex.: 12.345.678/0001-90'),
        field('Razão social', f.legalName, 'Como está no cartão do CNPJ.'),
        field('Nome fantasia', f.tradeName, 'Nome que os clientes conhecem.'),
        field('Segmento', f.segment, 'Ex.: Clínica odontológica'),
        field('Telefone da empresa', f.companyPhone, 'Opcional.'),
        field('Site ou Instagram', f.site, 'Opcional.'))),
    section('2', 'Endereço',
      h('div', { class: 'form-grid' },
        h('label', { class: 'field field-ex' }, h('span', { class: 'field-label' }, 'CEP'), f.cep, cepStatus),
        field('Rua', f.street, ''),
        field('Número', f.number, ''),
        field('Complemento', f.complement, 'Opcional.'),
        field('Bairro', f.district, ''),
        field('Cidade', f.city, ''),
        field('Estado (UF)', f.uf, 'Ex.: SC'))),
    section('3', 'Responsável pela conta',
      h('div', { class: 'form-grid' },
        field('Nome', f.ownerName, ''),
        field('E-mail', f.ownerEmail, 'Este será o seu login no portal.'),
        field('WhatsApp', f.ownerPhone, 'Ex.: (47) 99999-0000'),
        field('Crie a senha do portal', f.password, 'Pelo menos 8 caracteres. Você entra com seu e-mail e esta senha.'),
        field('Repita a senha', f.password2, ''))),
    section('4', 'Usuários da conta',
      h('div', { class: 'form-stack' }, field('Quantos usuários vão usar o sistema?', count, 'Inclua você, se for atender.')),
      usersBox),
    section('5', 'Observações', f.notes),
    h('label', { class: 'signup-trap', 'aria-hidden': 'true' }, 'Não preencha', f.website),
    h('label', { class: 'check-toggle signup-consent' }, consent, 'Autorizo a Frédy a usar estes dados para criar e configurar minha conta.'),
    status,
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), sendBtn));
}

// ---------- Tela "Clientes" (equipe): cadastros e acessos ----------

const SIGNUP_STATUS = [['novo', 'Novo'], ['em criação', 'Em criação'], ['concluído', 'Concluído'], ['arquivado', 'Arquivado']];

async function renderClientsBlock(view) {
  const body = h('div');
  view.append(body);
  await loadClients(body);
}

async function loadClients(body, tab = 'signups') {
  swap(body, loading('Carregando clientes...'));
  let data;
  try {
    data = await api('portal', { action: 'clients', op: 'list' });
  } catch (err) {
    retry(body, err, () => loadClients(body, tab));
    return;
  }
  if (!data.configured) {
    swap(body, notice('O banco de dados ainda não foi ligado na Vercel. Sem ele, o portal e o cadastro não guardam nada.', 'warn'),
      howTo('Como ligar o Supabase (uma vez só)',
        'No Supabase: SQL Editor → New query → cole o arquivo docs/supabase.sql do projeto → Run.',
        'No Supabase: Project Settings → API → copie a Project URL e a chave service_role (secreta).',
        'Na Vercel: Settings → Environment Variables → crie SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY com esses valores.',
        'Na Vercel: Deployments → ⋯ no último deploy → Redeploy.'));
    return;
  }
  const origin = location.origin;
  const links = h('div', { class: 'portal-links' },
    h('div', {}, h('span', { class: 'field-label' }, 'Link do cadastro (cliente novo)'), h('code', {}, `${origin}/cadastro`), copyButton(`${origin}/cadastro`)),
    h('div', {}, h('span', { class: 'field-label' }, 'Link do portal (quem já é cliente)'), h('code', {}, `${origin}/cliente`), copyButton(`${origin}/cliente`)));
  const content = h('div');
  const newCount = data.signups.filter((s) => s.status === 'novo').length;
  const tabs = h('div', { class: 'tabs', role: 'tablist' },
    ...[['signups', `Cadastros recebidos${newCount ? ` (${newCount} novo${newCount > 1 ? 's' : ''})` : ''}`], ['clients', `Clientes com acesso (${data.clients.length})`]].map(([id, text]) =>
      h('button', { type: 'button', class: `tab${tab === id ? ' is-active' : ''}`, role: 'tab', 'aria-selected': String(tab === id), onclick: () => { tab = id; draw(); } }, text)));
  const draw = () => {
    tabs.querySelectorAll('.tab').forEach((t, i) => { const on = (i === 0 ? 'signups' : 'clients') === tab; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    swap(content, tab === 'signups' ? signupsView(data, body) : clientsView(data, body));
  };
  const auto = data.autoCreate
    ? notice('Criação automática ligada: cadastros com CNPJ ativo viram conta sozinhos (status ONBOARDING).', 'ok')
    : notice('Criação automática desligada: falta o HELENA_PARTNER_TOKEN na Vercel (ou PORTAL_AUTO_CREATE=off). Os cadastros chegam aqui para a equipe criar.', 'info');
  swap(body, auto, links, tabs, content);
  draw();
}

function signupText(s) {
  const a = s.address;
  return [
    `Empresa: ${s.company.legalName}${s.company.tradeName ? ` (${s.company.tradeName})` : ''}`,
    `CNPJ: ${s.company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}`,
    s.company.segment ? `Segmento: ${s.company.segment}` : null,
    s.company.phone ? `Telefone: ${s.company.phone}` : null,
    s.company.site ? `Site: ${s.company.site}` : null,
    `Endereço: ${a.street}, ${a.number}${a.complement ? ` - ${a.complement}` : ''} - ${a.district}, ${a.city}/${a.uf} - CEP ${a.cep}`,
    `Responsável: ${s.owner.name} · ${s.owner.email} · ${s.owner.phone}`,
    '',
    `Usuários (${s.users.length}):`,
    ...s.users.map((u, i) => `${i + 1}. ${u.name}${u.nickname ? ` (${u.nickname})` : ''} · ${u.email}${u.phone ? ` · ${u.phone}` : ''} · ${u.profile === 'Admin' ? 'Administrador' : 'Atendente'}`),
    s.notes ? `\nObservações: ${s.notes}` : null,
  ].filter((l) => l !== null).join('\n');
}

const PROVISION_STEPS = [['cnpj', 'CNPJ na Receita'], ['conta', 'Conta criada'], ['token', 'Token de API'], ['usuarios', 'Usuários'], ['padrao-tags', 'Etiquetas padrão'], ['padrao-departments', 'Equipes padrão'], ['portal', 'Acesso ao portal']];

// Andamento da criação automática da conta (passo a passo e erro, se houver).
function provisionBox(s, body) {
  const p = s.provision;
  if (!p) return null;
  const ok = p.status === 'criada';
  return h('div', { class: 'list' },
    h('div', { class: 'list-title' }, 'Criação automática', badge(ok ? 'ok' : 'warn', ok ? 'Conta criada' : 'Aguardando equipe')),
    ...PROVISION_STEPS.filter(([id]) => p.steps?.[id]).map(([id, label]) => {
      const st = p.steps[id];
      const tone = st.status === 'ok' ? 'ok' : st.status === 'erro' ? 'err' : 'warn';
      return h('div', { class: 'row' },
        h('span', { class: `row-dot ${tone}` }, svg(tone === 'ok' ? 'check' : tone === 'err' ? 'x' : 'minus')),
        h('div', {}, h('div', { class: 'row-title' }, label), h('div', { class: 'row-detail' }, st.detail)), h('span'));
    }),
    p.error ? h('div', { class: 'row' }, h('span', { class: 'row-dot err' }, svg('alert')), h('div', {}, h('div', { class: 'row-title' }, 'Parou aqui'), h('div', { class: 'row-msg' }, p.error)),
      button('Tentar de novo', async (e) => {
        const btn = e.currentTarget;
        if (/Receita|situação/.test(p.error) && !confirm('Criar mesmo assim? Confira o CNPJ antes.')) return;
        btn.disabled = true;
        try { await api('portal', { action: 'clients', op: 'provision', id: s.id }); } catch (err) { alert(err.message); }
        loadClients(body, 'signups');
      }, { variant: 'btn-small btn-primary', icon: 'refresh' })) : null);
}

function signupsView(data, body) {
  if (!data.signups.length) return notice('Nenhum cadastro ainda. Mande o link do cadastro para o cliente novo.', 'info');
  const list = h('div', { class: 'list' }, ...data.signups.map((s) => {
    const statusBadgeEl = badge(s.status === 'novo' ? 'warn' : s.status === 'concluído' ? 'ok' : '', SIGNUP_STATUS.find(([v]) => v === s.status)?.[1] ?? s.status);
    const text = signupText(s);
    return h('details', { class: 'compare-item' },
      h('summary', { class: 'compare-row bot-row' },
        h('div', { class: 'compare-name' },
          h('span', { class: 'chevron', 'aria-hidden': 'true' }, svg('arrow')),
          h('div', {},
            h('div', { class: 'row-title' }, s.company.tradeName || s.company.legalName, ' ', statusBadgeEl),
            h('div', { class: 'row-detail' }, `${s.owner.name} · ${s.users.length} usuário(s) · ${new Date(s.createdAt).toLocaleString('pt-BR')}`))),
        h('span'), h('span')),
      h('div', { class: 'compare-detail' },
        provisionBox(s, body),
        h('pre', { class: 'detail-text' }, text),
        h('div', { class: 'toolbar' },
          button('Copiar dados', (e) => flashOnCopy(e.currentTarget, text), { variant: 'btn-small', icon: 'copy' }),
          segmented(SIGNUP_STATUS, s.status, async (v) => {
            try { await api('portal', { action: 'clients', op: 'signupStatus', id: s.id, status: v }); s.status = v; statusBadgeEl.textContent = SIGNUP_STATUS.find(([x]) => x === v)[1]; } catch (err) { alert(err.message); }
          }, 'Situação'),
          h('span', { class: 'spacer' }),
          button('Excluir', async () => { if (!confirm('Excluir este cadastro?')) return; await api('portal', { action: 'clients', op: 'signupDelete', id: s.id }); loadClients(body, 'signups'); }, { variant: 'btn-ghost btn-small', icon: 'x' }),
          button('Criar acesso ao portal', () => createAccessForm(body, { company: s.company.tradeName || s.company.legalName, email: s.owner.email, signupId: s.id }), { variant: 'btn-primary btn-small', icon: 'plus' })),
        howTo('Como criar a conta deste cliente',
          'Crie a conta da empresa no WTS com os dados acima (a API pública não cria contas).',
          'Use "Configurar tudo" na página da equipe para copiar o padrão para a conta nova.',
          'No WTS da conta nova, gere o token em Ajustes → Integrações → API.',
          'Clique em "Criar acesso ao portal", cole o token e envie o login para o cliente.')));
  }));
  list.addEventListener('toggle', (e) => {
    if (!e.target.matches?.('.compare-item') || !e.target.open) return;
    for (const other of list.querySelectorAll('.compare-item[open]')) if (other !== e.target) other.open = false;
  }, true);
  return list;
}

function accessMessage(email, password) {
  return `Seu acesso ao portal Frédy está pronto!\n\nEndereço: ${location.origin}/cliente\nE-mail: ${email}\nSenha: ${password}\n\nNo primeiro acesso, troque a senha em "Minha conta".`;
}

function credentialsBox(email, password) {
  const msg = password ? accessMessage(email, password) : `Seu acesso ao portal Frédy está pronto!

Endereço: ${location.origin}/cliente
E-mail: ${email}
Senha: a que você criou no cadastro.`;
  return h('div', { class: 'credentials' },
    notice(password ? 'Acesso pronto. Copie a mensagem e mande para o cliente (a senha só aparece agora).' : 'Acesso pronto. O cliente entra com a senha que ele criou no cadastro.', 'ok'),
    h('pre', { class: 'detail-text' }, msg),
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), button('Copiar mensagem', (e) => flashOnCopy(e.currentTarget, msg), { variant: 'btn-primary', icon: 'copy' })));
}

function createAccessForm(body, prefill = {}) {
  const company = h('input', { type: 'text', value: prefill.company ?? '', placeholder: 'Clínica Exemplo' });
  const email = h('input', { type: 'email', value: prefill.email ?? '', placeholder: 'maria@empresa.com.br' });
  const token = h('input', { type: 'password', placeholder: 'pn_...', autocomplete: 'off', spellcheck: false });
  const status = h('div');
  const saveBtn = button('Criar acesso', async () => {
    status.replaceChildren();
    saveBtn.disabled = true;
    try {
      const r = await api('portal', { action: 'clients', op: 'create', company: company.value, email: email.value, wtsToken: token.value, signupId: prefill.signupId });
      swap(box, credentialsBox(r.client.email, r.password),
        h('div', { class: 'toolbar' }, button('Voltar para a lista', () => loadClients(body, 'clients'), { icon: 'back' })));
    } catch (err) {
      status.replaceChildren(notice(err.message));
    } finally {
      saveBtn.disabled = false;
    }
  }, { variant: 'btn-primary', icon: 'check' });
  const box = section('', 'Criar acesso ao portal',
    h('div', { class: 'form-stack' },
      field('Empresa', company, 'Nome que aparece no portal.'),
      field('E-mail de login', email, 'O cliente entra com este e-mail.'),
      field('Token da conta WTS do cliente', token, 'No WTS do cliente: Ajustes → Integrações → API. Fica guardado criptografado; o cliente não vê.')),
    status,
    h('div', { class: 'toolbar' }, button('Cancelar', () => loadClients(body, prefill.signupId ? 'signups' : 'clients'), { variant: 'btn-ghost' }), h('span', { class: 'spacer' }), saveBtn));
  swap(body, box);
  company.focus();
}

function clientsView(data, body) {
  const addBtn = h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), button('Novo acesso', () => createAccessForm(body), { variant: 'btn-primary', icon: 'plus' }));
  if (!data.clients.length) return h('div', {}, notice('Nenhum cliente com acesso ainda.', 'info'), addBtn);
  const out = h('div');
  const list = h('div', { class: 'list' }, ...data.clients.map((c) => {
    const sw = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(c.active), 'aria-label': `Acesso de ${c.company}` }, h('span', { class: 'switch-knob' }));
    sw.onclick = async () => {
      sw.disabled = true;
      try {
        const r = await api('portal', { action: 'clients', op: 'update', id: c.id, changes: { active: !c.active } });
        c.active = r.client.active;
        sw.setAttribute('aria-checked', String(c.active));
        row.classList.toggle('is-off', !c.active);
      } catch (err) { alert(err.message); } finally { sw.disabled = false; }
    };
    const row = h('div', { class: `row rot-row${c.active ? '' : ' is-off'}` },
      h('span', { class: 'row-dot ok' }, svg('user')),
      h('div', {},
        h('div', { class: 'row-title' }, c.company),
        h('div', { class: 'row-detail' }, `${c.email} · ${c.lastLoginAt ? `último acesso ${new Date(c.lastLoginAt).toLocaleDateString('pt-BR')}` : 'ainda não entrou'} · ${c.guideDone.length} passo(s) concluído(s)`)),
      h('div', { class: 'row-actions' },
        button('Nova senha', async () => {
          if (!confirm(`Gerar uma senha nova para ${c.email}? A atual deixa de funcionar.`)) return;
          const r = await api('portal', { action: 'clients', op: 'update', id: c.id, changes: { resetPassword: true } });
          swap(out, credentialsBox(c.email, r.password));
          out.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, { variant: 'btn-small', icon: 'refresh' }),
        button('Trocar token', async () => {
          const t = prompt(`Novo token da conta WTS de ${c.company}:`);
          if (!t) return;
          try { await api('portal', { action: 'clients', op: 'update', id: c.id, changes: { wtsToken: t } }); swap(out, notice('Token trocado.', 'ok')); } catch (err) { swap(out, notice(err.message)); }
        }, { variant: 'btn-small' }),
        button('Excluir', async () => {
          if (!confirm(`Excluir o acesso de ${c.company}? O cliente não consegue mais entrar.`)) return;
          await api('portal', { action: 'clients', op: 'delete', id: c.id });
          loadClients(body, 'clients');
        }, { variant: 'btn-ghost btn-small', icon: 'x' }),
        sw));
    return row;
  }));
  return h('div', {}, addBtn, out, list);
}

// ---------- Usuários (formulário → mesmo fluxo de prévia) ----------

function renderAgentsBlock(view, block) {
  const rowsBox = h('div', { class: 'grid-form' });
  const result = h('div');
  // Equipes da conta do cliente (para marcar em cada usuário).
  let teams = null;
  const teamRows = new Set();
  const paintTeams = (box) => {
    if (!teams) return box.replaceChildren(h('span', { class: 'hint' }, clientToken() ? 'Carregando equipes...' : 'Cole o token no topo para escolher as equipes.'));
    if (!teams.length) return box.replaceChildren(h('span', { class: 'hint' }, 'A conta não tem equipes.'));
    const chosen = new Set(box.dataset.teams ? box.dataset.teams.split(',') : []);
    box.replaceChildren(h('span', { class: 'row-teams-label' }, 'Equipes:'), ...teams.map((t) => {
      const chip = h('button', { type: 'button', class: `pick-chip pick-chip-sm${chosen.has(t.id) ? ' is-on' : ''}`, 'aria-pressed': String(chosen.has(t.id)) }, t.name);
      chip.onclick = () => {
        chosen.has(t.id) ? chosen.delete(t.id) : chosen.add(t.id);
        box.dataset.teams = [...chosen].join(',');
        chip.classList.toggle('is-on', chosen.has(t.id));
        chip.setAttribute('aria-pressed', String(chosen.has(t.id)));
      };
      return chip;
    }));
  };
  const loadTeams = async () => {
    if (!clientToken()) return;
    try {
      const { rows } = await api('lookup', { lookup: 'departments', clientToken: clientToken() });
      teams = rows.map((r) => ({ id: r.id, name: r.name })).filter((t) => t.id && t.name);
    } catch {
      teams = [];
    }
    teamRows.forEach(paintTeams);
  };

  function addRow() {
    // Perfil: lista própria; o valor fica num campo escondido lido pelo collect().
    const profileValue = h('input', { type: 'hidden', value: PROFILES[0][0], 'data-f': 'profile' });
    const profile = h('div', { class: 'profile-pick' }, profileValue,
      menuSelect(PROFILES.map(([value, label]) => ({ value, label })), PROFILES[0][0], (v) => { profileValue.value = v; }, 'Perfil').el);
    const row = h('div', { class: 'grid-form-row' },
      h('input', { type: 'text', placeholder: 'Nome', maxLength: 100, 'aria-label': 'Nome', 'data-f': 'name' }),
      h('input', { type: 'email', placeholder: 'email@empresa.com', 'aria-label': 'E-mail', 'data-f': 'email' }),
      h('input', { type: 'tel', placeholder: 'Telefone (opcional)', 'aria-label': 'Telefone', 'data-f': 'phoneNumber' }),
      profile,
      h('button', {
        type: 'button',
        class: 'icon-btn',
        'aria-label': 'Remover linha',
        onclick: () => { if (rowsBox.querySelectorAll('.grid-form-row:not(.grid-form-head)').length > 1) { teamRows.delete(row.querySelector('.row-teams')); row.remove(); } },
      }, svg('x')),
      (() => { const box = h('div', { class: 'row-teams' }); teamRows.add(box); paintTeams(box); return box; })(),
    );
    rowsBox.append(row);
    enter(row, { y: 6, duration: 240 });
    row.querySelector('input').focus();
  }

  function collect() {
    return [...rowsBox.querySelectorAll('.grid-form-row:not(.grid-form-head)')]
      .map((row) => ({
        ...Object.fromEntries([...row.querySelectorAll('[data-f]')].map((el) => [el.dataset.f, el.value.trim()])),
        teams: (row.querySelector('.row-teams')?.dataset.teams || '').split(',').filter(Boolean),
      }))
      .filter((u) => u.name || u.email);
  }

  rowsBox.append(h('div', { class: 'grid-form-row grid-form-head', 'aria-hidden': 'true' },
    h('span', {}, 'Nome'), h('span', {}, 'E-mail'), h('span', {}, 'Telefone'), h('span', {}, 'Perfil'), h('span')));
  addRow();
  loadTeams();
  const tokenInput = $('client-token');
  const onToken = () => (rowsBox.isConnected ? (teams = null, teamRows.forEach(paintTeams), loadTeams()) : tokenInput.removeEventListener('change', onToken));
  tokenInput.addEventListener('change', onToken);

  view.append(
    h('p', { class: 'panel-desc' }, 'Preencha os usuários, marque as equipes de cada um e gere a prévia. Quem já existe na conta (mesmo e-mail) é pulado.'),
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

// Conteúdo completo do item na conta modelo, com botões de copiar.
function checkDetail(item) {
  const { rows = [], texts = [], lists = [], note, raw } = item.detail;
  const all = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...texts.filter((t) => t.value).map((t) => `\n${t.label}:\n${t.value}`),
    ...lists.filter((l) => l.items.length).map((l) => `\n${l.label}:\n${l.items.map((i) => `- ${i}`).join('\n')}`),
  ].join('\n');
  const copy = (text, label) => button(label, (e) => flashOnCopy(e.currentTarget, text), { variant: 'btn-small', icon: 'copy' });
  // Botãozinho de copiar ao lado de um valor (título, key, atalho...).
  const copyIcon = (text, label) => h('button', { type: 'button', class: 'copy-mini', title: `Copiar ${label}`, 'aria-label': `Copiar ${label}`, onclick: (e) => flashOnCopy(e.currentTarget, text) }, svg('copy'));
  // Botões vêm como "Texto [TIPO] → link": copia só o texto do botão.
  const chipText = (i) => String(i).split(' [')[0].split(' → ')[0];
  return h('div', { class: 'compare-detail' },
    rows.length ? h('dl', { class: 'detail-grid' },
      ...rows.flatMap(([label, value]) => [h('dt', {}, label), h('dd', {}, h('span', {}, value), copyIcon(value, label.toLowerCase()))])) : null,
    ...texts.map((t) => h('div', { class: 'detail-block' },
      h('div', { class: 'detail-head' }, h('span', {}, t.label), t.value ? copy(t.value, `Copiar ${t.label.toLowerCase()}`) : null),
      t.value ? h('pre', { class: 'detail-text' }, t.value) : h('p', { class: 'hint' }, 'Vazio'))),
    ...lists.map((l) => h('div', { class: 'detail-block' },
      h('div', { class: 'detail-head' }, h('span', {}, l.label), l.items.length ? copy(l.items.join('\n'), 'Copiar') : null),
      l.items.length
        ? h('ul', { class: 'detail-chips' }, ...l.items.map((i) => h('li', {},
          h('button', { type: 'button', class: 'chip-copy', title: 'Clique para copiar', onclick: (e) => flashOnCopy(e.currentTarget, chipText(i)) }, h('span', {}, i), svg('copy')))))
        : h('p', { class: 'hint' }, l.empty || 'Nenhum'))),
    note ? notice(note, 'info') : null,
    // Resposta da API como veio (para achar onde estão botões e outros dados).
    raw ? h('details', { class: 'advanced' },
      h('summary', {}, 'Dados da API (avançado)'),
      h('pre', { class: 'detail-text' }, raw),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), copy(raw, 'Copiar dados'))) : null,
    h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }), copy(all, 'Copiar tudo')));
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
  // Um item aberto por vez: abrir um fecha o outro.
  table.addEventListener('toggle', (e) => {
    const opened = e.target;
    if (!opened.matches?.('.compare-item') || !opened.open) return;
    for (const other of table.querySelectorAll('.compare-item[open]')) if (other !== opened) other.open = false;
    opened.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
  }, true);

  function renderRows() {
    const rows = items.filter((i) => !onlyMissing || i.status !== 'ok');
    table.replaceChildren(
      h('div', { class: 'compare-head' }, h('span', {}, 'Item'), h('span', {}, 'Modelo'), h('span', {}, 'Cliente')),
      ...(rows.length
        ? rows.map((item) => h('details', { class: 'compare-item' },
          h('summary', { class: 'compare-row' },
            h('div', { class: 'compare-name' },
              h('span', { class: 'chevron', 'aria-hidden': 'true' }, svg('arrow')),
              h('div', {},
                h('div', { class: 'row-title' }, item.label),
                item.info && h('div', { class: 'row-detail' }, item.info),
                item.note && h('div', { class: 'row-msg' }, item.note))),
            mark('ok', 'Existe no modelo'),
            mark(item.status, MARK_LABEL[item.status])),
          item.detail ? checkDetail(item) : null))
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

// Lista do rodízio: liga/desliga, ordem (setas) e o nome que vai no "nome
// atendente" de cada pessoa. Usada ao gerar o fluxo e na tela Rotativo.
function rotativoEditor(people, { teamNames = [], onChange = () => {} } = {}) {
  const listId = `equipes-${Math.random().toString(36).slice(2)}`;
  const datalist = h('datalist', { id: listId }, ...teamNames.map((t) => h('option', { value: t })));
  const list = h('div', { class: 'list' });
  const count = badge('', '');
  const render = () => {
    const on = people.filter((p) => p.on);
    count.textContent = `${on.length} ligada(s)`;
    list.replaceChildren(
      h('div', { class: 'list-title' }, 'Ordem do rodízio', count),
      ...people.map((p, i) => {
        const nameInput = h('input', {
          type: 'text', value: p.label, disabled: !p.on, placeholder: 'Rafael',
          'aria-label': `Nome no rodízio de ${p.name}`,
          oninput: (e) => { p.label = e.target.value; row.classList.toggle('unmatched', !p.label.trim()); },
          onchange: () => { if (p.label.trim()) onChange('nome'); },
        });
        nameInput.setAttribute('list', listId);
        const sw = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(p.on), 'aria-label': `Rodízio: ${p.name}` }, h('span', { class: 'switch-knob' }));
        sw.onclick = () => {
          p.on = !p.on;
          render();
          onChange('ligar', p);
        };
        const move = (to) => { [people[i], people[to]] = [people[to], people[i]]; render(); onChange('ordem'); };
        const row = h('div', { class: `map-row rot-row rot-edit${p.on ? '' : ' is-off'}${p.on && !p.label.trim() ? ' unmatched' : ''}` },
          sw,
          h('div', { class: 'rot-name' },
            h('div', { class: 'row-title' }, p.on ? `${on.indexOf(p) + 1}. ${p.name}` : `${p.name} (desligado)`),
            nameInput),
          h('div', { class: 'row-actions' },
            button('↑', () => move(i - 1), { variant: 'btn-small', disabled: i === 0, 'aria-label': `Subir ${p.name}` }),
            button('↓', () => move(i + 1), { variant: 'btn-small', disabled: i === people.length - 1, 'aria-label': `Descer ${p.name}` })));
        return row;
      }));
  };
  render();
  return { el: h('div', {}, list, datalist), list, render };
}

const rotativoList = (people) => people.map((p) => ({ userId: p.userId, name: p.label.trim(), on: p.on }));

// Rotativo ao gerar o fluxo: a lista vai dentro do fluxo e depois é mudada pela tela Rotativo.
function rotativoSection(scan) {
  if (!scan.rotativo) return { el: null, values: () => null, missing: () => [] };
  const people = (scan.rotativoUsers ?? []).map((u) => ({ ...u, label: u.label ?? u.name }));
  // Primeira vez (fluxo ainda não ativo): todos começam ligados.
  if (!people.some((p) => p.on)) people.forEach((p) => { p.on = true; });

  const empty = h('div', { class: 'map-row', hidden: true },
    h('div', { class: 'map-from' }, h('div', { class: 'row-title' }, 'Ligue pelo menos uma pessoa no rodízio.')));
  const editor = rotativoEditor(people, {
    teamNames: scan.rotativoTeams,
    onChange: () => {
      const none = !people.some((p) => p.on);
      empty.hidden = !none;
      empty.classList.toggle('unmatched', none);
    },
  });

  const el = section('', 'Quem entra no rodízio',
    h('p', { class: 'hint' }, 'Ligue quem recebe atendimentos, use as setas para a ordem e confira o nome que vai no "nome atendente" (o mesmo que o chatbot usa). Ex.: Rafael'),
    scan.rotativoConnected ? notice('Este cliente já tem um rotativo ativo: esta é a lista atual dele.', 'info') : null,
    people.length ? editor.el : notice('Nenhum usuário na conta do cliente.', 'warn'),
    empty);
  return {
    el,
    values: () => ({ list: rotativoList(people) }),
    missing: () => [
      ...(people.some((p) => p.on) ? [] : [{ label: 'Pessoas do rodízio', row: empty, focus: editor.list.querySelector('.switch') ?? empty }]),
      ...people.filter((p) => p.on && !p.label.trim()).map((p) => ({ label: `Nome no rodízio de ${p.name}`, row: editor.list, focus: editor.list.querySelector('.rot-row.unmatched input') ?? editor.list })),
    ],
  };
}

// Tela Rotativo: liga, desliga, ordena e renomeia. Grava na hora no fluxo do n8n.
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
  swap(body, loading('Lendo o rotativo da conta...'));
  let data;
  try {
    data = await api('rotativo', { action: 'get', clientToken: token });
  } catch (err) {
    retry(body, err, () => loadRotativo(body));
    return;
  }
  if (token !== clientToken()) return; // token trocado no meio: outra leitura já vem
  setTokenStatus('ok');

  if (!data.connected) {
    swap(body,
      notice('Não achei o fluxo Rotativo ativo no n8n para esta conta.', 'warn'),
      howTo('Como ativar o rotativo',
        'Em Fluxos do n8n (ou Configurar tudo), gere o fluxo Rotativo deste cliente.',
        'Importe no n8n e ligue a chave Active.',
        'Volte aqui: a lista aparece e dá para ligar e desligar as pessoas.'),
      h('div', { class: 'toolbar' }, h('span', { class: 'spacer' }),
        button('Verificar de novo', () => loadRotativo(body), { icon: 'refresh' })));
    return;
  }

  const people = data.users;
  const status = h('div');
  // Uma gravação por vez; cada mudança grava a lista inteira.
  let queue = Promise.resolve();
  const save = (kind, person) => {
    status.replaceChildren();
    if (!people.some((p) => p.on)) {
      if (person) { person.on = true; editor.render(); }
      status.replaceChildren(notice('Deixe pelo menos uma pessoa ligada no rotativo.', 'warn'));
      return;
    }
    if (people.some((p) => p.on && !p.label.trim())) {
      status.replaceChildren(notice('Preencha o nome no rodízio de quem está ligado.', 'warn'));
      return;
    }
    const list = rotativoList(people);
    queue = queue.then(async () => {
      try {
        await api('rotativo', { action: 'save', clientToken: clientToken(), list });
        status.replaceChildren(notice(kind === 'ligar' ? `${person.name} ${person.on ? 'ligado' : 'desligado'} no rodízio.` : 'Rodízio atualizado.', 'ok'));
      } catch (err) {
        status.replaceChildren(notice(err.message));
        if (person) { person.on = !person.on; editor.render(); } // volta como estava
      }
    });
  };
  const editor = rotativoEditor(people, { teamNames: data.teamNames, onChange: save });
  swap(body, people.length ? editor.el : notice('Nenhum usuário na conta.', 'info'), status);
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
    data.rotativo ? notice(`Rotativo com ${data.rotativo.people} pessoa(s) ligada(s). Importe e ative o fluxo no n8n; depois ligue e desligue pela tela Rotativo.`, 'ok') : null,
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
      const session = PORTAL === 'cliente'
        ? await api('portal', { action: 'login', email: $('login-email').value, password: $('password').value })
        : await api('login', { password: $('password').value });
      saveSession(session);
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
  if (PORTAL === 'cadastro') {
    renderSignupPage();
    return;
  }
  if (PORTAL === 'cliente') {
    document.title = 'Portal do cliente · Frédy';
    $('reopen').lastChild.textContent = ' Abrir portal';
    $('search').placeholder = 'Procurar...';
  }
  state.session = loadSession();
  if (state.session) showGrid();
  else showLogin();
}

init();
