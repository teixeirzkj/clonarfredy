import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Chatbots padrão: JSONs em templates/chatbots para copiar e colar no WTS do cliente.
const DIR = join(process.cwd(), 'templates', 'chatbots');
const MAX_SIZE = 3 * 1024 * 1024;

const title = (file) => {
  const base = file.replace(/\.json$/i, '').replace(/[-_]+/g, ' ').trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
};

export async function listChatbots() {
  let files = [];
  try {
    files = await readdir(DIR);
  } catch {
    return [];
  }
  const bots = [];
  for (const file of files.filter((f) => /\.json$/i.test(f)).sort()) {
    const raw = await readFile(join(DIR, file), 'utf8');
    if (raw.length > MAX_SIZE) continue;
    let valid = true;
    let content = raw;
    try {
      content = JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      valid = false;
    }
    const videoFile = file.replace(/\.json$/i, '.video.txt');
    const video = files.includes(videoFile) ? (await readFile(join(DIR, videoFile), 'utf8')).trim().split(/\s+/)[0] : '';
    bots.push({ id: file, name: title(file), content, valid, size: raw.length, video: /^https:\/\//.test(video) ? video : '' });
  }
  return bots;
}
