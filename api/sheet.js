import { isAuthenticated } from '../lib/auth.js';
import { HttpError, readJson, send } from '../lib/http.js';
import { buildRotativoWorkbook } from '../lib/sheet.js';

// Gera a planilha do rotativo (.xlsx) com os atendentes escolhidos.
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new HttpError(405, 'Método não permitido');
    if (!isAuthenticated(req)) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
    const body = await readJson(req);
    const file = await buildRotativoWorkbook(body.attendants);
    const name = String(body.clientName ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '') || 'cliente';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Rotativo_${name}.xlsx"`);
    res.setHeader('Cache-Control', 'no-store');
    res.end(file);
  } catch (err) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.message });
    console.error('Erro ao gerar planilha:', err?.name, err?.message);
    send(res, 500, { error: 'Erro ao gerar a planilha' });
  }
}
