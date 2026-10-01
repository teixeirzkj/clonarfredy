import { HttpError } from './http.js';

// Identificador da empresa no fim das URLs/paths de webhook, ex.:
//   .../webhook/alteracaodepainelembarque22palmitos  (conta modelo)
//   .../webhook/alteracaodepainelcontaexemplo        (cliente)
// Usado ao copiar as assinaturas de webhook do WTS e ao gerar os fluxos do n8n,
// para os dois apontarem para o mesmo path.

const SLUG_RE = /^[a-z0-9_-]{2,80}$/;
const DEFAULT_MODEL_SLUG = 'embarque22palmitos'; // conta modelo atual; WEBHOOK_MODEL_SLUG sobrescreve
const MIN_DETECTED_SLUG = 4;

export const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function readSlug(value, label) {
  const slug = String(value ?? '').trim().toLowerCase();
  if (slug && !SLUG_RE.test(slug)) throw new HttpError(400, `${label}: use só letras minúsculas, números, - ou _ (sem espaços)`);
  return slug;
}

function lastSegment(url) {
  try {
    return new URL(url).pathname.split('/').filter(Boolean).pop()?.toLowerCase() ?? '';
  } catch {
    return '';
  }
}

// Final comum das URLs (só funciona com 2+ URLs diferentes).
function detectFromUrls(urls) {
  const segments = [...new Set(urls.map(lastSegment).filter(Boolean))];
  if (segments.length < 2) return '';
  let suffix = segments[0];
  for (const s of segments.slice(1)) {
    while (suffix && !s.endsWith(suffix)) suffix = suffix.slice(1);
  }
  return suffix.length >= MIN_DETECTED_SLUG ? suffix : '';
}

export function resolveModelSlug(fromInput, urls = []) {
  return readSlug(fromInput, 'Trecho da conta modelo')
    || readSlug(process.env.WEBHOOK_MODEL_SLUG, 'WEBHOOK_MODEL_SLUG')
    || detectFromUrls(urls)
    || DEFAULT_MODEL_SLUG;
}

export function slugPattern(modelSlug) {
  return new RegExp(escapeRe(modelSlug), 'gi');
}
