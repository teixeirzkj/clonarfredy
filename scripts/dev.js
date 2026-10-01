// Servidor local que imita a Vercel: arquivos de /public e funções de /api.
// Uso: npm run dev  (lê variáveis de .env.local)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };

const envFile = join(root, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const pageHeaders = vercel.headers[0].headers;

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  const apiMatch = pathname.match(/^\/api\/([a-z-]+)$/);
  if (apiMatch) {
    const file = join(root, 'api', `${apiMatch[1]}.js`);
    if (!existsSync(file)) return res.writeHead(404).end();
    const { default: handler } = await import(pathToFileURL(file).href);
    return handler(req, res);
  }

  const relative = normalize(pathname === '/' ? 'index.html' : pathname.slice(1));
  if (relative.startsWith('..')) return res.writeHead(400).end();
  try {
    const body = await readFile(join(root, 'public', relative));
    for (const { key, value } of pageHeaders) res.setHeader(key, value);
    res.writeHead(200, { 'Content-Type': TYPES[extname(relative)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => console.log(`Setup da Conta em http://localhost:${PORT}`));
