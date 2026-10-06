import { HttpError } from './http.js';

// Consultas somente leitura na conta informada, para achar IDs rapidamente.
// Cada consulta devolve { columns, rows }; colunas com copy=true ganham botão de copiar.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CARD_PAGES = 5; // até 500 cards por consulta

const col = (key, label, options = {}) => ({ key, label, ...options });
const ID = (key = 'id', label = 'ID') => col(key, label, { copy: true, mono: true });

function requirePanel(params) {
  const panelId = params?.panelId;
  if (typeof panelId !== 'string' || !UUID_RE.test(panelId)) throw new HttpError(400, 'Escolha um painel');
  return panelId;
}

const LOOKUPS = {
  panels: {
    columns: [col('panel', 'Painel'), col('step', 'Etapa'), col('position', 'Ordem'), ID('panelId', 'ID do painel'), ID('stepId', 'ID da etapa (StepId)')],
    async rows(wts) {
      const panels = await wts.getAll('/crm/v2/panel', { IncludeDetails: 'Steps' });
      return panels.filter((p) => !p.archived).flatMap((p) => {
        const steps = (p.steps ?? []).filter((s) => !s.archived).sort((a, b) => a.position - b.position);
        if (!steps.length) return [{ panel: p.title, step: '—', position: '', panelId: p.id, stepId: '' }];
        return steps.map((s, i) => ({ panel: p.title, step: s.title, position: i + 1, panelId: p.id, stepId: s.id }));
      });
    },
  },

  panelFields: {
    needsPanel: true,
    columns: [col('name', 'Campo'), col('type', 'Tipo'), ID('key', 'Key'), ID()],
    async rows(wts, params) {
      const fields = (await wts.get(`/crm/v1/panel/${requirePanel(params)}/custom-fields`)) ?? [];
      return fields.map((f) => ({ name: f.name, type: f.type, key: f.key, id: f.id }));
    },
  },

  lostReasons: {
    needsPanel: true,
    columns: [col('description', 'Motivo'), ID()],
    async rows(wts, params) {
      const reasons = await wts.getAll(`/crm/v1/panel/${requirePanel(params)}/lost-reason`);
      return reasons.map((r) => ({ description: r.description, id: r.id }));
    },
  },

  cards: {
    needsPanel: true,
    columns: [col('number', 'Nº'), col('title', 'Card'), col('step', 'Etapa'), col('contact', 'Contato'), ID('id', 'ID do card'), ID('stepId', 'StepId')],
    async rows(wts, params) {
      const query = { PanelId: requirePanel(params), IncludeDetails: ['StepTitle', 'Contacts'] };
      const cards = [];
      for (let page = 1; page <= MAX_CARD_PAGES; page++) {
        const data = await wts.get('/crm/v2/panel/card', { ...query, PageNumber: page, PageSize: 100 });
        cards.push(...(data?.items ?? []));
        if (!data?.hasMorePages) break;
      }
      return cards.map((c) => ({
        number: c.number,
        title: c.title,
        step: c.stepTitle,
        contact: c.contacts?.map((ct) => ct.name).filter(Boolean).join(', '),
        id: c.id,
        stepId: c.stepId,
      }));
    },
  },

  agents: {
    columns: [col('name', 'Usuário'), col('email', 'E-mail'), col('phone', 'Telefone'), col('profile', 'Perfil'), ID('id', 'ID (agente)'), ID('userId', 'UserId')],
    async rows(wts) {
      const agents = (await wts.get('/core/v1/agent')) ?? [];
      return agents.map((a) => ({ name: a.name, email: a.email, phone: a.phoneNumberFormatted || a.phoneNumber || '', profile: a.profile, id: a.id, userId: a.userId }));
    },
  },

  departments: {
    columns: [col('name', 'Equipe'), col('default', 'Padrão'), ID()],
    async rows(wts) {
      const deps = (await wts.get('/core/v2/department')) ?? [];
      return deps.map((d) => ({ name: d.name, default: d.isDefault ? 'Sim' : '', id: d.id }));
    },
  },

  tags: {
    columns: [col('name', 'Etiqueta'), col('color', 'Cor'), ID()],
    async rows(wts) {
      const tags = (await wts.get('/core/v1/tag')) ?? [];
      return tags.map((t) => ({ name: t.name, color: t.color, id: t.id }));
    },
  },

  chatbots: {
    columns: [col('name', 'Chatbot'), col('type', 'Tipo'), col('status', 'Publicação'), ID('key', 'Bot key'), ID()],
    async rows(wts) {
      const bots = await wts.getAll('/chat/v1/chatbot');
      return bots.filter((b) => !b.archived).map((b) => ({ name: b.name, type: b.type, status: b.publishStatus, key: b.key, id: b.id }));
    },
  },

  sequences: {
    columns: [col('name', 'Sequência'), col('enabled', 'Ativa'), ID()],
    async rows(wts) {
      const sequences = await wts.getAll('/chat/v1/sequence');
      return sequences.map((s) => ({ name: s.name, enabled: s.enabled ? 'Sim' : 'Não', id: s.id }));
    },
  },

  templates: {
    columns: [col('name', 'Modelo'), col('status', 'Status'), col('channel', 'Canal'), ID()],
    async rows(wts) {
      const templates = await wts.getAll('/chat/v1/template', { Archived: false });
      return templates.filter((t) => !t.archived).map((t) => ({
        name: t.name || t.internalName || t.quickReplyAlias,
        status: t.status,
        channel: t.channelType,
        id: t.id,
      }));
    },
  },

  channels: {
    columns: [col('name', 'Canal'), col('number', 'Número'), col('type', 'Tipo'), col('active', 'Ativo'), ID()],
    async rows(wts) {
      const channels = (await wts.get('/chat/v1/channel')) ?? [];
      return channels.map((c) => ({
        name: c.identity?.displayName || c.identity?.humanId,
        number: c.numberFormatted || c.number,
        type: c.type,
        active: c.active ? 'Sim' : 'Não',
        id: c.id,
      }));
    },
  },

  contactFields: {
    columns: [col('name', 'Campo'), col('type', 'Tipo'), ID('key', 'Key'), ID()],
    async rows(wts) {
      const fields = (await wts.get('/core/v1/contact/custom-field')) ?? [];
      return fields.map((f) => ({ name: f.name, type: f.type, key: f.key, id: f.id }));
    },
  },

  portfolios: {
    columns: [col('name', 'Carteira'), col('contacts', 'Contatos'), ID()],
    async rows(wts) {
      const portfolios = await wts.getAll('/core/v1/portfolio', { IncludeDetails: 'ContactCount' });
      return portfolios.map((p) => ({ name: p.name, contacts: p.contactsCount, id: p.id }));
    },
  },

  webhooks: {
    columns: [col('name', 'Webhook'), col('url', 'URL'), col('enabled', 'Ativo'), ID()],
    async rows(wts) {
      const subs = (await wts.get('/core/v1/webhook/subscription')) ?? [];
      return subs.map((s) => ({ name: s.name, url: s.url, enabled: s.enabled ? 'Sim' : 'Não', id: s.id }));
    },
  },
};

export async function runLookup(id, wts, params) {
  const lookup = LOOKUPS[id];
  if (!lookup) throw new HttpError(400, 'Consulta desconhecida');
  const rows = await lookup.rows(wts, params);
  return { columns: lookup.columns, rows };
}

// Lista enxuta de painéis para o seletor das consultas que exigem painel.
export async function listPanels(wts) {
  const panels = await wts.getAll('/crm/v2/panel');
  return panels.filter((p) => !p.archived).map((p) => ({ id: p.id, title: p.title }));
}
