import { customerClient } from '../lib/accounts.js';
import { HttpError, route } from '../lib/http.js';
import { readRotativo, saveRotativo } from '../lib/rotativo.js';

// Tela Rotativo: lê e grava quem está no rodízio (fica no próprio fluxo do n8n).
export default route(async ({ body }) => {
  const wts = customerClient(body.clientToken);
  switch (body.action) {
    case 'get':
      return readRotativo(wts);
    case 'save':
      return saveRotativo(wts, body.list);
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
});
