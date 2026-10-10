import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Chatbots padrão: texto copiado do editor de chatbot do WTS (formato
// ##CHATBOT_ADVANCED{...}##CHATBOT_ADVANCED), um arquivo por chatbot, em
// templates/chatbots/atendimento (chatbots de atendimento) e
// templates/chatbots/automacao (chatbots de automação). O texto é copiado
// exatamente como está, porque o editor do WTS só aceita colar nesse formato.
const DIR = join(process.cwd(), 'templates', 'chatbots');
const KINDS = [['atendimento', 'Atendimento'], ['automacao', 'Automação']];
const MAX_SIZE = 3 * 1024 * 1024;
const MARK = '##CHATBOT_ADVANCED';
const WORDS = { ia: 'IA', ai: 'AI', crm: 'CRM' };

const title = (file) => file.replace(/\.json$/i, '').replace(/[-_]+/g, ' ').trim()
  .split(' ').map((w, i) => WORDS[w.toLowerCase()] ?? (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(' ');

// O JSON pode vir puro ou entre os marcadores do WTS.
function parse(raw) {
  const text = raw.trim();
  const inner = text.startsWith(MARK) && text.endsWith(MARK) ? text.slice(MARK.length, -MARK.length) : text;
  return JSON.parse(inner);
}

// O que o chatbot usa da conta de origem e precisa ser conferido depois de colar
// (o WTS não acha etiquetas, painéis, modelos e sequências pelo ID em outra conta).
function checksOf(json) {
  const out = { webhooks: new Set(), templates: new Set(), sequences: new Set(), links: new Set(), tags: 0, cards: 0, transfers: 0 };
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    // Ações aparecem em node.action, dentro de menus (maxRetriesAchievedAction) e em opções.
    if (node.type === 'WEBHOOK' && node.webhook?.url) out.webhooks.add(node.webhook.url);
    if (node.type === 'SET_CONTACT_TAG' && node.contactTagIds?.length) out.tags += 1;
    if (node.type === 'CARD' && node.card) out.cards += 1;
    if (node.type === 'SEQUENCE_OPERATION' && node.sequence?.name) out.sequences.add(node.sequence.name);
    if (node.type === 'TRANSFER_SESSION' || node.transferDepartmentId) out.transfers += 1;
    if (node.type === 'TEMPLATE' && node.template?.template?.name) out.templates.add(node.template.template.name);
    // Links escritos nas mensagens (Instagram, avaliação no Google...) são da empresa de origem.
    if (node.message?.text) for (const m of String(node.message.text).match(/https?:\/\/\S+/g) ?? []) out.links.add(m);
    Object.values(node).forEach(walk);
  };
  walk(json);
  return [
    ...[...out.webhooks].map((u) => `Webhook: ${u} → trocar pelo endereço do fluxo n8n deste cliente`),
    ...[...out.templates].map((n) => `Modelo de mensagem "${n}": precisa existir e estar aprovado na conta`),
    ...[...out.sequences].map((n) => `Sequência "${n}": precisa existir na conta`),
    out.tags ? `Etiquetas: ${out.tags} ação(ões) marcam ou tiram etiqueta → escolher a etiqueta de novo` : null,
    out.cards ? `Card: ${out.cards} ação(ões) criam ou mudam card → escolher o painel e a etapa` : null,
    out.transfers ? `Transferência: ${out.transfers} ação(ões) mandam para uma equipe → escolher a equipe` : null,
    ...[...out.links].map((u) => `Link na mensagem: ${u} → trocar pelo do cliente`),
    'Textos das mensagens: conferir nome da empresa e tom (vieram da conta de origem)',
  ].filter(Boolean);
}

export async function listChatbots() {
  const bots = [];
  for (const [kind, kindLabel] of KINDS) {
    const dir = join(DIR, kind);
    let files = [];
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }
    for (const file of files.filter((f) => /\.json$/i.test(f)).sort()) {
      const raw = await readFile(join(dir, file), 'utf8');
      if (raw.length > MAX_SIZE) continue;
      let valid = true;
      let checks = [];
      try {
        checks = checksOf(parse(raw));
      } catch {
        valid = false;
      }
      const videoFile = file.replace(/\.json$/i, '.video.txt');
      const video = files.includes(videoFile) ? (await readFile(join(dir, videoFile), 'utf8')).trim().split(/\s+/)[0] : '';
      bots.push({ id: `${kind}/${file}`, name: title(file), kind, kindLabel, content: raw.trim(), valid, checks, size: raw.length, video: /^https:\/\//.test(video) ? video : '' });
    }
  }
  return bots;
}
