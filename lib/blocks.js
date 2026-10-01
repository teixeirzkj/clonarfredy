import { HttpError } from './http.js';
import { normalizeName } from './accounts.js';
import { readSlug, resolveModelSlug, slugPattern } from './slug.js';

// Cada bloco de criação expõe:
//   plan({ model, client, input }) -> [{ key, label, detail, exists, payload }]
//   create(client, item)
// O plano é sempre recalculado no servidor antes de criar (o front só escolhe chaves).

function uniqueByKey(items) {
  const seen = new Set();
  return items.filter((item) => !seen.has(item.key) && seen.add(item.key));
}

const tags = {
  async plan({ model, client }) {
    const [modelTags, clientTags] = await Promise.all([model.get('/core/v1/tag'), client.get('/core/v1/tag')]);
    const existing = new Set((clientTags ?? []).map((t) => normalizeName(t.name)));

    return uniqueByKey(
      (modelTags ?? [])
        .filter((t) => t.name?.trim())
        .map((t) => ({
          key: normalizeName(t.name),
          label: t.name.trim(),
          // color vem null quando a cor não é da paleta; omitido, a API usa GRAY_600.
          detail: t.color ? `Cor ${t.color}` : 'Cor fora da paleta → GRAY_600',
          exists: existing.has(normalizeName(t.name)),
          payload: { name: t.name.trim(), ...(t.color && { color: t.color }) },
        })),
    );
  },
  create: (client, item) => client.post('/core/v1/tag', item.payload),
};

const DISTRIBUTION_LABEL = { NONE: 'sem restrição', DEPARTMENT_RESTRICTION: 'restrita à equipe', USER_RESTRICTION: 'restrita ao usuário' };

const departments = {
  async plan({ model, client }) {
    const [modelDeps, clientDeps] = await Promise.all([
      model.get('/core/v2/department'),
      client.get('/core/v2/department'),
    ]);
    const existing = new Set((clientDeps ?? []).map((d) => normalizeName(d.name)));

    return uniqueByKey(
      (modelDeps ?? [])
        .filter((d) => d.name?.trim())
        .map((d) => {
          // Na resposta o campo é "distribuitionEnabled" (grafia da API);
          // no body de criação é "distributionIsEnabled".
          // Usuários e canais não são copiados: os IDs são de outra conta.
          const payload = {
            name: d.name.trim(),
            isDefault: false,
            distributionIsEnabled: Boolean(d.distribuitionEnabled),
            ...(d.distributionConfig && { distributionConfig: d.distributionConfig }),
            ...(d.restrictionType && { restrictionType: d.restrictionType }),
          };
          const detail = [
            payload.distributionIsEnabled ? 'Distribuição ligada' : 'Distribuição desligada',
            DISTRIBUTION_LABEL[d.restrictionType],
          ].filter(Boolean).join(' · ');
          return { key: normalizeName(d.name), label: d.name.trim(), detail, exists: existing.has(normalizeName(d.name)), payload };
        }),
    );
  },
  create: (client, item) => client.post('/core/v1/department', item.payload),
};

const webhookKey = (name, url) => `${normalizeName(name)}|${String(url ?? '').trim().toLowerCase()}`;

// O identificador da empresa no fim da URL é trocado pelo do cliente (lib/slug.js).
const webhooks = {
  async plan({ model, client, input }) {
    const [modelSubs, clientSubs] = await Promise.all([
      model.get('/core/v1/webhook/subscription'),
      client.get('/core/v1/webhook/subscription'),
    ]);
    const subs = (modelSubs ?? []).filter((s) => s.url?.trim());

    const clientSlug = readSlug(input?.clientSlug, 'Identificador do cliente');
    const modelSlug = resolveModelSlug(input?.modelSlug, subs.map((s) => s.url));
    const slugRe = modelSlug ? slugPattern(modelSlug) : null;
    const usesSlug = Boolean(slugRe && subs.some((s) => s.url.toLowerCase().includes(modelSlug)));
    if (usesSlug && !clientSlug) throw new HttpError(400, 'Informe o identificador do cliente para montar as URLs dos webhooks');

    const swapSlug = (text) => (usesSlug && clientSlug ? text.replace(slugRe, clientSlug) : text);
    const existing = new Set((clientSubs ?? []).map((s) => webhookKey(s.name ?? s.url, s.url)));

    const items = uniqueByKey(subs.map((s) => {
      // Na listagem, events é PublicWebhookEventDTO[]; na criação, string[].
      const events = (s.events ?? []).map((e) => (typeof e === 'string' ? e : e?.event)).filter(Boolean);
      const url = swapSlug(s.url.trim());
      const name = swapSlug(s.name?.trim() || url).slice(0, 100);
      const changed = url !== s.url.trim();
      return {
        key: webhookKey(s.name ?? s.url, s.url), // estável entre prévia e execução
        label: name,
        detail: `${changed ? 'Nova URL: ' : ''}${url} · ${events.length} evento(s)${s.enabled ? '' : ' · inativo'}`,
        exists: existing.has(webhookKey(name, url)),
        payload: { name, url, enabled: Boolean(s.enabled), events },
      };
    }));

    items.meta = {
      modelSlug,
      clientSlug,
      warning: subs.length && !usesSlug
        ? `Não achei ${modelSlug ? `"${modelSlug}"` : 'o trecho da conta modelo'} nas URLs: elas serão copiadas iguais. Informe o trecho certo para trocar.`
        : '',
    };
    return items;
  },
  create(client, item) {
    if (!item.payload.events.length) throw new HttpError(400, 'Assinatura sem eventos no modelo');
    return client.post('/core/v1/webhook/subscription', item.payload);
  },
};

const PROFILES = ['Admin', 'Agent', 'RestrictedAgent'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseAgentsInput(input) {
  const rows = Array.isArray(input?.users) ? input.users : [];
  if (!rows.length) throw new HttpError(400, 'Adicione pelo menos um usuário');
  if (rows.length > 50) throw new HttpError(400, 'Máximo de 50 usuários por vez');

  return rows.map((row, i) => {
    const name = String(row?.name ?? '').trim();
    const email = String(row?.email ?? '').trim().toLowerCase();
    const phoneNumber = String(row?.phoneNumber ?? '').replace(/[^\d+]/g, '');
    const profile = row?.profile;
    if (!name || name.length > 100) throw new HttpError(400, `Linha ${i + 1}: nome obrigatório (até 100 caracteres)`);
    if (email && !EMAIL_RE.test(email)) throw new HttpError(400, `Linha ${i + 1}: e-mail inválido`);
    if (!PROFILES.includes(profile)) throw new HttpError(400, `Linha ${i + 1}: perfil inválido`);
    return { name, email, phoneNumber, profile };
  });
}

const agents = {
  async plan({ client, input }) {
    const users = parseAgentsInput(input);
    const clientAgents = (await client.get('/core/v1/agent')) ?? [];
    const emails = new Set(clientAgents.map((a) => a.email?.trim().toLowerCase()).filter(Boolean));
    const names = new Set(clientAgents.map((a) => normalizeName(a.name)));

    return uniqueByKey(
      users.map((u) => ({
        key: u.email || `nome:${normalizeName(u.name)}`,
        label: u.name,
        detail: [u.email, u.phoneNumber, u.profile].filter(Boolean).join(' · '),
        exists: u.email ? emails.has(u.email) : names.has(normalizeName(u.name)),
        payload: {
          name: u.name,
          profile: u.profile,
          ...(u.email && { email: u.email }),
          ...(u.phoneNumber && { phoneNumber: u.phoneNumber }),
        },
      })),
    );
  },
  create: (client, item) => client.post('/core/v1/agent', item.payload),
};

export const BLOCKS = { tags, departments, webhooks, agents };

export function getBlock(id) {
  const block = BLOCKS[id];
  if (!block) throw new HttpError(400, 'Bloco desconhecido');
  return block;
}
