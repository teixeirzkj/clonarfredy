import { HttpError } from './http.js';
import { normalizeName } from './accounts.js';

// Conferências somente leitura: recursos que a API pública só permite listar.
// Cada item vem com o conteúdo completo da conta modelo (detail), para abrir
// na tela e copiar para a conta do cliente.
//   detail = { rows: [[rótulo, valor]], texts: [{ label, value }], lists: [{ label, items, empty }], note }

const ENTITY_LABEL = { CONTACT: 'Contato', PANEL: 'Painel' };
const FIELD_TYPE = {
  GROUP: 'Grupo', STRING: 'Texto curto', TEXT: 'Texto longo', INTEGER: 'Número inteiro', FLOAT: 'Número decimal',
  SINGLESELECT: 'Seleção única', MULTISELECT: 'Seleção múltipla', DATE: 'Data', TIME: 'Hora', DATETIME: 'Data e hora', BOOLEAN: 'Sim/Não',
};
const TEMPLATE_STATUS = { Draft: 'Rascunho', Approved: 'Aprovado', Disapproved: 'Reprovado', InRevision: 'Em análise', Paused: 'Pausado', Disabled: 'Desativado', Deleted: 'Excluído' };
const TEMPLATE_TYPE = {
  QUICKREPLY: 'Resposta rápida', TEMPLATE: 'Modelo', TEMPLATE_CAMPAIGN: 'Campanha', TEMPLATE_SEQUENCE: 'Sequência',
  SYSTEM: 'Sistema', TEMPLATE_SCHEDULED_MESSAGE: 'Mensagem agendada', AUTHENTICATION: 'Autenticação', UNDEFINED: '',
};
const FILE_TYPE = { IMAGE: 'Imagem', VIDEO: 'Vídeo', DOCUMENT: 'Documento' };
const CHANNEL_TYPE = {
  GUPSHUP_WHATSAPP: 'WhatsApp (Gupshup)', DIALOG360_WHATSAPP: 'WhatsApp (360dialog)', CLOUDAPI_WHATSAPP: 'WhatsApp (API oficial)',
  ZAPI_WHATSAPP: 'WhatsApp (Z-API)', EVOLUTIONAPI_WHATSAPP: 'WhatsApp (Evolution)', INSTAGRAM: 'Instagram', MESSENGER: 'Messenger', WEBCHAT: 'Webchat',
};
const BOT_TYPE = { Reactive: 'Reativo', Automation: 'Automação' };
const BOT_STATUS = { NOT_PUBLISHED: 'Não publicado', PUBLISHING: 'Publicando', READY: 'Publicado', FAILED: 'Falhou ao publicar' };
const BOT_USAGE = { Api: 'API', Manual: 'Manual', Campaign: 'Campanha', Sequence: 'Sequência' };
const PANEL_TYPE = { MANAGEMENT: 'Gestão', SALES: 'Vendas' };
const PANEL_SCOPE = { COMPANY: 'Empresa toda', DEPARTMENT: 'Equipes', USER: 'Usuário' };

const yesNo = (v) => (v ? 'Sim' : 'Não');
const clean = (rows) => rows.filter(([, v]) => v !== undefined && v !== null && v !== '');
const asList = (data) => (Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
// A API às vezes devolve um valor solto onde a doc diz lista (e vice-versa).
const arr = (v) => (Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v]);
const str = (v) => (v === undefined || v === null ? '' : typeof v === 'object' ? String(v.name ?? v.title ?? v.text ?? v.value ?? '') : String(v));
const sameText = (a, b) => String(a ?? '').replace(/\s+/g, ' ').trim() === String(b ?? '').replace(/\s+/g, ' ').trim();

// Variáveis usadas no texto ({{1}}, {{nome}}) e as declaradas no modelo.
function templateVariables(t) {
  const inText = [...str(t.text).matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map((m) => `{{${m[1]}}}`);
  const params = arr(t.params).map((p) => str(p?.name ?? p)).filter(Boolean).map((n) => (n.startsWith('{{') ? n : `{{${n}}}`));
  return [...new Set([...inText, ...params])];
}

// Botões: a doc não descreve o formato. Procura em qualquer lugar da resposta
// uma lista com nome de botão (buttons, quickReplies, actions, options...).
const BUTTON_KEY = /button|bot[aã]o|quick.?repl|reply|action|cta|option|choice|interactive/i;

function findButtonLists(value, depth = 0, found = []) {
  if (!value || typeof value !== 'object' || depth > 6) return found;
  for (const [key, child] of Object.entries(value)) {
    if (Array.isArray(child) && child.length && BUTTON_KEY.test(key) && child.every((c) => c && (typeof c === 'string' || typeof c === 'object'))) {
      found.push(child);
    } else if (child && typeof child === 'object' && !Array.isArray(child) && BUTTON_KEY.test(key) && (child.url || child.text || child.title) && !Object.values(child).some((v) => v && typeof v === 'object')) {
      found.push([child]); // um botão sozinho (ex.: { text, url })
    } else if (child && typeof child === 'object') {
      findButtonLists(child, depth + 1, found);
    }
  }
  return found;
}

function buttonLabel(b) {
  if (typeof b === 'string') return b;
  const label = str(b.text ?? b.title ?? b.label ?? b.name ?? b.caption ?? b.reply?.title ?? b.value) || '(sem texto)';
  const target = str(b.url ?? b.link ?? b.phoneNumber ?? b.phone_number ?? b.phone ?? b.payload ?? b.code);
  const type = str(b.type ?? b.buttonType ?? b.kind);
  return `${label}${type ? ` [${type}]` : ''}${target && target !== label ? ` → ${target}` : ''}`;
}

// Botões conhecidos dos modelos padrão (a API pública não devolve os botões).
const KNOWN_BUTTONS = {
  checkin: ['Preciso de ajuda', 'Está tudo certo'],
  feedback: ['Sim', 'Não'],
};
const plainName = (name) => normalizeName(name).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

function templateButtons(t, name) {
  const lists = findButtonLists(t);
  if (lists.length) return [...new Set(lists.flat().map(buttonLabel))];
  return KNOWN_BUTTONS[plainName(name)] ?? null;
}

// Resposta da API do modelo, para conferir onde vêm os botões (sem IDs longos).
function rawTemplate(t) {
  const { id, companyId, channelId, categoryId, createdAt, updatedAt, ...rest } = t;
  return JSON.stringify(rest, null, 2);
}

const DAY_NAME = {
  SUNDAY: 'Domingo', MONDAY: 'Segunda-feira', TUESDAY: 'Terça-feira', WEDNESDAY: 'Quarta-feira', THURSDAY: 'Quinta-feira', FRIDAY: 'Sexta-feira', SATURDAY: 'Sábado',
  0: 'Domingo', 1: 'Segunda-feira', 2: 'Terça-feira', 3: 'Quarta-feira', 4: 'Quinta-feira', 5: 'Sexta-feira', 6: 'Sábado',
};
const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const dayKey = (d) => String(d ?? '').toUpperCase();
const periodsText = (day) => (day?.active === false || !arr(day?.periods).length ? 'Fechado'
  : arr(day.periods).map((p) => `${str(p.startTime).slice(0, 5)} às ${str(p.endTime).slice(0, 5)}`).join(', '));

const CHECKS = {
  templates: async (wts) =>
    (await wts.getAll('/chat/v1/template', { Archived: false, IncludeDetails: ['All', 'Params', 'File', 'Interactive'] }))
      .filter((t) => !t.archived)
      .map((t) => {
        const name = str(t.name) || str(t.internalName) || str(t.quickReplyAlias) || '(sem nome)';
        const buttons = templateButtons(t, name);
        return {
          key: normalizeName(name),
          label: name,
          info: [CHANNEL_TYPE[t.channelType] ?? t.channelType, TEMPLATE_STATUS[t.status] ?? t.status].filter(Boolean).join(' · '),
          compare: { text: t.text, footer: t.footerText },
          detail: {
            rows: clean([
              ['Nome', name],
              ['Nome interno', str(t.internalName)],
              ['Atalho', t.quickReplyAlias ? `/${t.quickReplyAlias}` : ''],
              ['Tipo', arr(t.type).map((x) => TEMPLATE_TYPE[x] ?? str(x)).filter(Boolean).join(', ')],
              ['Categoria', str(t.categoryName)],
              ['Canal', CHANNEL_TYPE[t.channelType] ?? t.channelType],
              ['Status', TEMPLATE_STATUS[t.status] ?? t.status],
              ['Arquivo', FILE_TYPE[t.fileType] ?? ''],
              ['Motivo da reprovação', str(t.rejectedDescription)],
            ]),
            texts: [
              { label: 'Texto', value: str(t.text) },
              ...(t.footerText ? [{ label: 'Rodapé', value: str(t.footerText) }] : []),
            ],
            lists: [
              { label: 'Variáveis', items: templateVariables(t), empty: 'Sem variáveis' },
              { label: 'Botões', items: buttons ?? [], empty: buttons ? 'Sem botões' : 'Sem botões (ou a API não informou)' },
            ],
            raw: rawTemplate(t),
          },
        };
      }),

  panels: async (wts, { detailed }) => {
    const panels = (await wts.getAll('/crm/v2/panel', { IncludeDetails: 'Steps' })).filter((p) => !p.archived);
    const items = [];
    for (const p of panels) {
      const steps = arr(p.steps).filter((s) => s && !s.archived).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      const titles = steps.map((s) => str(s.title).trim()).filter(Boolean);
      const label = str(p.title).trim() || '(sem título)';
      // Campos do painel: só da conta modelo (é o que vai ser copiado).
      let fields = [];
      if (detailed) {
        fields = asList(await wts.get(`/crm/v1/panel/${p.id}/custom-fields`))
          .filter((f) => f && f.type !== 'GROUP')
          .map((f) => { const opts = arr(f.options).map(str).filter(Boolean); return `${str(f.name)}  (${FIELD_TYPE[f.type] ?? str(f.type)}${opts.length ? `: ${opts.join(', ')}` : ''})`; });
      }
      items.push({
        key: normalizeName(label),
        label,
        info: `${titles.length} etapa(s)`,
        extra: titles,
        detail: {
          rows: clean([
            ['Título', label],
            ['Descrição', str(p.description)],
            ['Tipo', PANEL_TYPE[p.type] ?? p.type],
            ['Quem vê', PANEL_SCOPE[p.scope] ?? p.scope],
            ['Perda automática', p.autoLossDays ? `${p.autoLossDays} dia(s) sem movimento` : ''],
          ]),
          texts: [],
          lists: [
            { label: 'Etapas (na ordem)', items: steps.map((s) => `${str(s.title).trim() || '(sem título)'}${s.isInitial ? '  · inicial' : ''}${s.isFinal ? '  · final' : ''}`), empty: 'Sem etapas' },
            ...(detailed ? [{ label: 'Campos personalizados do painel', items: fields, empty: 'Sem campos' }] : []),
          ],
        },
      });
    }
    return items;
  },

  chatbots: async (wts) => {
    const [bots, departments, channels] = await Promise.all([
      wts.getAll('/chat/v1/chatbot'),
      wts.get('/core/v2/department'),
      wts.get('/chat/v1/channel'),
    ]);
    const depName = new Map(asList(departments).map((d) => [d.id, d.name]));
    const channelName = new Map(asList(channels).map((c) => [c.id, c.name || c.number || c.type]));
    return bots.filter((c) => !c.archived).map((c) => {
      const label = str(c.name).trim() || '(sem nome)';
      return {
        key: normalizeName(label),
        label,
        info: [BOT_TYPE[c.type] ?? c.type, BOT_STATUS[c.publishStatus] ?? c.publishStatus].filter(Boolean).join(' · '),
        detail: {
          rows: clean([
            ['Nome', label],
            ['Tipo', BOT_TYPE[c.type] ?? c.type],
            ['Status', BOT_STATUS[c.publishStatus] ?? c.publishStatus],
            ['Usado em', arr(c.automationUsage).map((u) => BOT_USAGE[u] ?? str(u)).join(', ')],
            ['Equipe padrão', c.defaultDepartmentId ? depName.get(c.defaultDepartmentId) ?? '(equipe não encontrada)' : ''],
          ]),
          texts: [],
          lists: [{ label: 'Canais', items: arr(c.channelIds).map((id) => channelName.get(id) ?? '(canal não encontrado)'), empty: 'Nenhum canal' }],
          note: 'As mensagens e os caminhos do chatbot não vêm pela API pública do WTS: monte no WTS seguindo o chatbot da conta modelo.',
        },
      };
    });
  },

  sequences: async (wts) =>
    (await wts.getAll('/chat/v1/sequence')).map((s) => {
      const label = str(s.name).trim() || '(sem nome)';
      return {
        key: normalizeName(label),
        label,
        info: s.enabled ? 'Ativa' : 'Inativa',
        detail: {
          rows: clean([
            ['Nome', label],
            ['Situação', s.enabled ? 'Ativa' : 'Inativa'],
            ['Contatos em andamento', String(s.contactExecutingCount ?? 0)],
          ]),
          texts: [],
          lists: [],
          note: 'As mensagens e os intervalos da sequência não vêm pela API pública do WTS: monte no WTS seguindo a sequência da conta modelo.',
        },
      };
    }),

  // Horário de atendimento: um item por dia, mais a mensagem fora do horário.
  officeHours: async (wts) => {
    const oh = (await wts.get('/core/v1/company/officehours')) ?? {};
    const days = arr(oh.days).slice().sort((a, b) => DAY_ORDER.indexOf(dayKey(a.dayWeek)) - DAY_ORDER.indexOf(dayKey(b.dayWeek)));
    const items = days.map((d) => {
      const label = DAY_NAME[dayKey(d.dayWeek)] ?? DAY_NAME[d.dayWeek] ?? str(d.dayWeek);
      const value = periodsText(d);
      return { key: `dia:${dayKey(d.dayWeek)}`, label, info: value, compare: { value }, detail: { rows: [['Dia', label], ['Horário', value]], texts: [], lists: [] } };
    });
    const limit = oh.limitHours ? 'Sim' : 'Não';
    items.push({ key: 'limite', label: 'Atender só no horário', info: limit, compare: { value: limit }, detail: { rows: [['Atender só no horário', limit]], texts: [], lists: [] } });
    if (oh.offlineResponse) {
      items.push({ key: 'fora', label: 'Mensagem fora do horário', info: 'Texto automático', compare: { value: str(oh.offlineResponse) }, detail: { rows: [], texts: [{ label: 'Mensagem', value: str(oh.offlineResponse) }], lists: [] } });
    }
    return items;
  },

  fields: async (wts) => {
    const result = [];
    for (const entityType of ['CONTACT', 'PANEL']) {
      const fields = asList(await wts.get('/core/v1/custom-field', { EntityType: entityType, NestedList: false }));
      const groupName = new Map(fields.filter((f) => f.type === 'GROUP').map((f) => [f.id, f.name]));
      for (const f of fields) {
        const label = str(f.name).trim() || str(f.key) || '(sem nome)';
        const options = arr(f.options).map(str).filter(Boolean);
        result.push({
          key: `${entityType}:${normalizeName(label)}`,
          label,
          info: [ENTITY_LABEL[entityType], FIELD_TYPE[f.type] ?? f.type].filter(Boolean).join(' · '),
          compare: { type: f.type, options },
          detail: {
            rows: clean([
              ['Nome', label],
              ['Key', f.key],
              ['Onde', ENTITY_LABEL[entityType]],
              ['Tipo', FIELD_TYPE[f.type] ?? f.type],
              ['Grupo', f.parentId ? groupName.get(f.parentId) : ''],
              ['Obrigatório', f.type === 'GROUP' ? '' : yesNo(f.required)],
              ['Visível', yesNo(f.visible !== false)],
              ['Intervalo de valores', f.isValueRange ? 'Sim' : ''],
            ]),
            texts: [],
            lists: options.length ? [{ label: 'Opções', items: options }] : [],
          },
        });
      }
    }
    return result;
  },
};

// Diferenças além do nome (o que precisa ajustar no cliente).
function differences(id, item, match) {
  if (id === 'officeHours') return sameText(item.compare.value, match.compare.value) ? '' : (item.key === 'fora' ? 'Texto diferente no cliente' : `No cliente: ${match.compare.value}`);
  if (id === 'panels') {
    const clientSteps = new Set(match.extra.map(normalizeName));
    const missing = item.extra.filter((s) => !clientSteps.has(normalizeName(s)));
    return missing.length ? `Faltam etapas: ${missing.join(', ')}` : '';
  }
  if (id === 'templates') {
    const notes = [];
    if (!sameText(item.compare.text, match.compare.text)) notes.push('texto');
    if (!sameText(item.compare.footer, match.compare.footer)) notes.push('rodapé');
    return notes.length ? `Diferente do modelo: ${notes.join(' e ')}` : '';
  }
  if (id === 'fields') {
    if (item.compare.type !== match.compare.type) return `Tipo diferente: no cliente é ${FIELD_TYPE[match.compare.type] ?? match.compare.type}`;
    const clientOptions = new Set(match.compare.options.map(normalizeName));
    const missing = item.compare.options.filter((o) => !clientOptions.has(normalizeName(o)));
    return missing.length ? `Faltam opções: ${missing.join(', ')}` : '';
  }
  return '';
}

export async function runCheck(id, { model, client }) {
  const list = CHECKS[id];
  if (!list) throw new HttpError(400, 'Conferência desconhecida');

  let modelItems;
  let clientItems;
  try {
    [modelItems, clientItems] = await Promise.all([list(model, { detailed: true }), list(client, { detailed: false })]);
  } catch (err) {
    if (err instanceof HttpError || err?.name === 'WtsError') throw err;
    // Dado num formato que a doc não descreve: mostra o motivo para facilitar o ajuste.
    console.error('Conferência', id, err?.name, err?.message);
    throw new HttpError(500, `Não consegui ler os dados desta conferência (${err?.message ?? 'erro desconhecido'})`);
  }
  const clientByKey = new Map(clientItems.map((item) => [item.key, item]));
  const modelKeys = new Set(modelItems.map((item) => item.key));

  const seen = new Set();
  const items = [];
  for (const item of modelItems) {
    if (seen.has(item.key)) continue;
    seen.add(item.key);

    const match = clientByKey.get(item.key);
    const note = match ? differences(id, item, match) : '';
    const status = !match ? 'missing' : note ? 'partial' : 'ok';
    items.push({ label: item.label, info: item.info, status, note, detail: item.detail });
  }

  return {
    items,
    summary: {
      total: items.length,
      ok: items.filter((i) => i.status === 'ok').length,
      missing: items.filter((i) => i.status !== 'ok').length,
      onlyInClient: clientItems.filter((i) => !modelKeys.has(i.key)).length,
    },
  };
}
