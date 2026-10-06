import { HttpError } from './http.js';

// Importar contatos de uma planilha: POST /core/v2/contact/batch (até 100 por vez).
// Contato que já existe (mesmo telefone, Instagram ou e-mail) é atualizado.

export const CONTACT_BATCH = 100;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KEY_RE = /^[\w.-]{1,100}$/;

const text = (v, max) => String(v ?? '').trim().slice(0, max);

function readContact(row, i) {
  const name = text(row?.name, 255);
  const phoneNumber = String(row?.phoneNumber ?? '').replace(/\D/g, '').slice(0, 20);
  const email = text(row?.email, 255).toLowerCase();
  const instagram = text(row?.instagram, 255).replace(/^@/, '');
  const annotation = text(row?.annotation, 4000);
  if (!phoneNumber && !email && !instagram) throw new HttpError(400, `Linha ${i + 1}: precisa de telefone, e-mail ou Instagram`);
  if (phoneNumber && phoneNumber.length < 10) throw new HttpError(400, `Linha ${i + 1}: telefone curto demais (${phoneNumber})`);
  if (email && !EMAIL_RE.test(email)) throw new HttpError(400, `Linha ${i + 1}: e-mail inválido`);
  const tagNames = (Array.isArray(row?.tags) ? row.tags : []).map((t) => text(t, 100)).filter(Boolean).slice(0, 30);
  const customFields = {};
  for (const [key, value] of Object.entries(row?.customFields ?? {})) {
    if (!KEY_RE.test(key)) throw new HttpError(400, `Linha ${i + 1}: campo personalizado inválido`);
    const v = text(value, 2000);
    if (v) customFields[key] = v;
  }
  return {
    ...(name && { name }),
    ...(phoneNumber && { phoneNumber }),
    ...(email && { email }),
    ...(instagram && { instagram }),
    ...(annotation && { annotation }),
    ...(tagNames.length && { tagNames }),
    ...(Object.keys(customFields).length && { customFields }),
  };
}

/** Envia um lote de contatos (a tela manda de 100 em 100 e mostra o progresso). */
export async function importContacts(wts, { contacts, tagNames, sequenceIds }) {
  if (!Array.isArray(contacts) || !contacts.length || contacts.length > CONTACT_BATCH) throw new HttpError(400, 'Lote de contatos inválido');
  const extraTags = (Array.isArray(tagNames) ? tagNames : []).map((t) => text(t, 100)).filter(Boolean).slice(0, 30);
  const sequences = (Array.isArray(sequenceIds) ? sequenceIds : []).filter((id) => UUID_RE.test(String(id)));
  const items = contacts.map((row, i) => {
    const contact = readContact(row, i);
    // Etiquetas da planilha + as escolhidas para todos (por nome; as que existem só são ligadas).
    const tags = [...new Set([...(contact.tagNames ?? []), ...extraTags])];
    if (tags.length) contact.tagNames = tags;
    if (sequences.length) contact.sequenceIds = sequences;
    return contact;
  });
  // Contato que já existe: só muda o que veio na planilha (sem isso o WTS
  // regrava todos os campos e apagaria nome, e-mail e campos que não vieram).
  const has = (k) => items.some((it) => it[k] !== undefined);
  const upsertFields = [
    has('name') && 'Name', has('email') && 'Email', has('instagram') && 'Instagram', has('annotation') && 'Annotation',
    has('tagNames') && 'Tags', has('customFields') && 'CustomFields', has('sequenceIds') && 'SequenceIds',
  ].filter(Boolean);
  const saved = await wts.post('/core/v2/contact/batch', {
    items,
    options: { upsert: true, upsertTagOperation: 'INSERTIFNOTEXISTS', upsertFields: upsertFields.length ? upsertFields : ['PhoneNumber'] },
  });
  return { saved: Array.isArray(saved) ? saved.length : items.length };
}

/** Cria uma etiqueta nova (ex.: "Ex-cliente") para usar na importação. */
export async function createTag(wts, name) {
  const tagName = text(name, 255);
  if (!tagName) throw new HttpError(400, 'Escreva o nome da etiqueta');
  const existing = (await wts.get('/core/v1/tag')) ?? [];
  const list = Array.isArray(existing) ? existing : existing.items ?? [];
  const same = list.find((t) => String(t.name ?? '').trim().toLowerCase() === tagName.toLowerCase());
  if (same) return { tag: { id: same.id, name: same.name }, existed: true };
  const tag = await wts.post('/core/v1/tag', { name: tagName });
  return { tag: { id: tag?.id, name: tag?.name ?? tagName }, existed: false };
}

/** Opções da tela: etiquetas, sequências e campos personalizados de contato. */
export async function importOptions(wts) {
  const [tags, sequences, fields] = await Promise.all([
    wts.get('/core/v1/tag'),
    wts.getAll('/chat/v1/sequence'),
    wts.get('/core/v1/contact/custom-field'),
  ]);
  const list = (v) => (Array.isArray(v) ? v : Array.isArray(v?.items) ? v.items : []);
  return {
    tags: list(tags).map((t) => ({ id: t.id, name: t.name })).filter((t) => t.id && t.name),
    sequences: list(sequences).map((s) => ({ id: s.id, name: s.name })).filter((s) => s.id && s.name),
    fields: list(fields).filter((f) => f.key && f.type !== 'GROUP').map((f) => ({ key: f.key, name: f.name || f.key })),
  };
}
