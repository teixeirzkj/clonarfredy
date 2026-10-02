import { customerClient } from '../lib/accounts.js';
import { HttpError, route } from '../lib/http.js';
import { mergeRotativoTeams, readRotativo, toggleRotativo } from '../lib/rotativo.js';

// Tela Rotativo: lista os usuários do cliente e liga/desliga quem recebe atendimentos.
export default route(async ({ body }) => {
  const wts = customerClient(body.clientToken);
  switch (body.action) {
    case 'get':
      return readRotativo(wts);
    case 'toggle':
      return toggleRotativo(wts, body.userId, Boolean(body.on));
    case 'merge':
      return mergeRotativoTeams(wts);
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
});
