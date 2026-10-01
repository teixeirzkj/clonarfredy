import { HttpError } from './http.js';
import { normalizeName } from './accounts.js';

// Conferências somente leitura: recursos que a API pública só permite listar.
// Cada uma devolve itens { key, label, info, extra } por conta.

const ENTITY_LABEL = { CONTACT: 'Contato', PANEL: 'Painel' };

const CHECKS = {
  templates: async (wts) =>
    (await wts.getAll('/chat/v1/template', { Archived: false }))
      .filter((t) => !t.archived)
      .map((t) => {
        const name = t.name || t.internalName || t.quickReplyAlias || '(sem nome)';
        return { key: normalizeName(name), label: name, info: [t.channelType, t.status].filter(Boolean).join(' · ') };
      }),

  panels: async (wts) =>
    (await wts.getAll('/crm/v2/panel', { IncludeDetails: 'Steps' }))
      .filter((p) => !p.archived)
      .map((p) => {
        const steps = (p.steps ?? [])
          .filter((s) => !s.archived)
          .sort((a, b) => a.position - b.position)
          .map((s) => s.title?.trim())
          .filter(Boolean);
        const label = p.title?.trim() || '(sem título)';
        return { key: normalizeName(label), label, info: `${steps.length} etapa(s)`, extra: steps };
      }),

  chatbots: async (wts) =>
    (await wts.getAll('/chat/v1/chatbot'))
      .filter((c) => !c.archived)
      .map((c) => {
        const label = c.name?.trim() || '(sem nome)';
        return { key: normalizeName(label), label, info: [c.type, c.publishStatus].filter(Boolean).join(' · ') };
      }),

  sequences: async (wts) =>
    (await wts.getAll('/chat/v1/sequence')).map((s) => {
      const label = s.name?.trim() || '(sem nome)';
      return { key: normalizeName(label), label, info: s.enabled ? 'Ativa' : 'Inativa' };
    }),

  fields: async (wts) => {
    const result = [];
    for (const entityType of ['CONTACT', 'PANEL']) {
      const fields = (await wts.get('/core/v1/custom-field', { EntityType: entityType, NestedList: false })) ?? [];
      for (const f of fields) {
        const label = f.name?.trim() || f.key || '(sem nome)';
        result.push({
          key: `${entityType}:${normalizeName(label)}`,
          label,
          info: [ENTITY_LABEL[entityType], f.type === 'GROUP' ? 'grupo' : f.type].filter(Boolean).join(' · '),
        });
      }
    }
    return result;
  },
};

export async function runCheck(id, { model, client }) {
  const list = CHECKS[id];
  if (!list) throw new HttpError(400, 'Conferência desconhecida');

  const [modelItems, clientItems] = await Promise.all([list(model), list(client)]);
  const clientByKey = new Map(clientItems.map((item) => [item.key, item]));
  const modelKeys = new Set(modelItems.map((item) => item.key));

  const seen = new Set();
  const items = [];
  for (const item of modelItems) {
    if (seen.has(item.key)) continue;
    seen.add(item.key);

    const match = clientByKey.get(item.key);
    let status = match ? 'ok' : 'missing';
    let note = '';
    // Painéis: o título existir não basta, as etapas também precisam bater.
    if (match && item.extra) {
      const clientSteps = new Set(match.extra.map(normalizeName));
      const missingSteps = item.extra.filter((s) => !clientSteps.has(normalizeName(s)));
      if (missingSteps.length) {
        status = 'partial';
        note = `Faltam etapas: ${missingSteps.join(', ')}`;
      }
    }
    items.push({ label: item.label, info: item.info, status, note });
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
