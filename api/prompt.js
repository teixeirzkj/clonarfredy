import { isAuthenticated } from '../lib/auth.js';
import { HttpError, readJson, send } from '../lib/http.js';
import { CLAUDE_AI_SUFFIX, SYSTEM, buildPrompt, checkPromptInput, defaultPrompt } from '../lib/prompt.js';

// action "default": devolve o prompt padrão.
// action "build": gera o prompt do cliente em streaming (NDJSON: uma linha por evento).
export default async function handler(req, res) {
  let streaming = false;
  const write = (event) => res.write(`${JSON.stringify(event)}\n`);

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'Método não permitido');
    if (!isAuthenticated(req)) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
    const body = await readJson(req);

    // As instruções vão junto para o botão "Copiar para o Claude.ai" (sem custo de API).
    if (body.action === 'default') return send(res, 200, { prompt: await defaultPrompt(), instructions: SYSTEM, claudeSuffix: CLAUDE_AI_SUFFIX });
    if (body.action !== 'build') throw new HttpError(400, 'Ação desconhecida');
    checkPromptInput(body);

    const controller = new AbortController();
    res.on('close', () => { if (!res.writableEnded) controller.abort(); });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Accel-Buffering', 'no');
    streaming = true;

    const stopReason = await buildPrompt({ ...body, signal: controller.signal }, (text) => write({ type: 'text', text }));
    if (stopReason === 'refusal') write({ type: 'error', message: 'O modelo recusou gerar este prompt. Revise as informações e tente de novo.' });
    else if (stopReason === 'max_tokens') write({ type: 'warning', message: 'O prompt ficou longo demais e foi cortado no fim.' });
    write({ type: 'done' });
    res.end();
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof HttpError ? err.message : 'Erro interno. Tente novamente.';
    if (!(err instanceof HttpError)) console.error('Erro inesperado no prompt:', err?.name, err?.message);
    if (!streaming) return send(res, status, { error: message });
    write({ type: 'error', message });
    res.end();
  }
}
