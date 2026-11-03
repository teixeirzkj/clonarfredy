import { readFile } from 'node:fs/promises';
import { templatePath } from './brand.js';

// Passo a passo do portal do cliente (templates/guia.json; Duda em templates/duda/guia.json): título, explicação,
// vídeo (link) e qual tela abrir. Os vídeos entram quando a equipe tiver os links.
export async function readGuide() {
  try {
    const raw = JSON.parse(await readFile(templatePath('guia.json'), 'utf8'));
    return (Array.isArray(raw.steps) ? raw.steps : []).map((s) => ({
      id: String(s.id ?? ''),
      title: String(s.title ?? ''),
      desc: String(s.desc ?? ''),
      tips: Array.isArray(s.tips) ? s.tips.map(String) : [],
      video: /^https:\/\//.test(String(s.video ?? '')) ? String(s.video) : '',
      blocks: Array.isArray(s.blocks) ? s.blocks.map(String) : [],
      link: s.link && /^https:\/\//.test(String(s.link.url ?? '')) ? { label: String(s.link.label || 'Abrir'), url: String(s.link.url) } : null,
      autoDone: s.autoDone === true,
    })).filter((s) => s.id && s.title);
  } catch {
    return [];
  }
}
