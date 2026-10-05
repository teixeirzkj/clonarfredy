import { HttpError } from './http.js';

// Arquivar cards de uma coluna (etapa) de um painel, com filtro de data.
// Listar: GET /crm/v2/panel/card (PanelId, StepId, Statuses, CreatedAt/UpdatedAt).
// Arquivar: PUT /crm/v3/panel/card/{id} com { fields: ["Status"], status: "ARCHIVED" }.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ['OPEN', 'WON', 'LOST'];
const MAX_CARDS = 5000; // teto de uma prévia (50 páginas de 100)
export const ARCHIVE_BATCH = 25; // cards por chamada (cada um é um PUT, ~350 ms); a tela pausa entre lotes

const uuid = (value, label) => {
  const v = String(value ?? '').trim();
  if (!UUID_RE.test(v)) throw new HttpError(400, `${label} inválido`);
  return v;
};

function isoDate(value, label) {
  if (value === undefined || value === null || value === '') return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new HttpError(400, `${label} inválida`);
  return d.toISOString();
}

/** Painéis com as etapas (na ordem) e quantos cards há em cada uma. */
export async function panelsWithSteps(wts) {
  const panels = await wts.getAll('/crm/v2/panel', { IncludeDetails: 'Steps' });
  return panels
    .filter((p) => !p.archived)
    .map((p) => ({
      id: p.id,
      title: String(p.title ?? '').trim() || '(sem título)',
      steps: (Array.isArray(p.steps) ? p.steps : [])
        .filter((s) => s && !s.archived)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((s) => ({ id: s.id, title: String(s.title ?? '').trim() || '(sem título)', count: typeof s.cardCount === 'number' ? s.cardCount : null })),
    }));
}

/** Cards que seriam arquivados com o filtro (prévia). */
export async function previewCards(wts, filter) {
  const panelId = uuid(filter?.panelId, 'Painel');
  const stepId = uuid(filter?.stepId, 'Coluna');
  const statuses = (Array.isArray(filter?.statuses) ? filter.statuses : STATUSES).filter((s) => STATUSES.includes(s));
  if (!statuses.length) throw new HttpError(400, 'Escolha pelo menos uma situação (abertos, ganhos ou perdidos)');
  const field = filter?.dateField === 'updated' ? 'UpdatedAt' : 'CreatedAt';
  const after = isoDate(filter?.after, 'Data inicial');
  const before = isoDate(filter?.before, 'Data final');
  if (after && before && after > before) throw new HttpError(400, 'A data inicial é depois da data final');

  const query = {
    PanelId: panelId,
    StepId: stepId,
    Statuses: statuses,
    IncludeDetails: 'Contacts',
    ...(after && { [`${field}.After`]: after }),
    ...(before && { [`${field}.Before`]: before }),
  };
  const cards = await wts.getAll('/crm/v2/panel/card', query);
  // Confere de novo no servidor: só a coluna escolhida e sem os já arquivados.
  const list = cards
    .filter((c) => c && c.stepId === stepId && c.status !== 'ARCHIVED' && !c.archived)
    .slice(0, MAX_CARDS)
    .map((c) => ({
      id: c.id,
      title: String(c.title ?? '').trim() || '(sem título)',
      contact: Array.isArray(c.contacts) ? String(c.contacts[0]?.name ?? '').trim() : '',
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  return { cards: list, truncated: cards.length > MAX_CARDS };
}

/** Arquiva um lote de cards (a tela manda em lotes e mostra o progresso). */
export async function archiveCards(wts, ids) {
  if (!Array.isArray(ids) || !ids.length || ids.length > ARCHIVE_BATCH) throw new HttpError(400, 'Lote de cards inválido');
  const results = [];
  for (const raw of ids) {
    const id = uuid(raw, 'Card');
    try {
      await wts.put(`/crm/v3/panel/card/${id}`, { fields: ['Status'], status: 'ARCHIVED' });
      results.push({ id, status: 'ok' });
    } catch (err) {
      if (err?.name !== 'WtsError') throw err;
      results.push({ id, status: 'error', message: err.message });
    }
  }
  return { results };
}
