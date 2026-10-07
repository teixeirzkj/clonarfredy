import { clientIp, HttpError, route } from '../lib/http.js';
import { createSignup, lookupCep } from '../lib/signups.js';

// Página /cadastro (aberta, sem login): envio do cadastro e busca de CEP.
export default route(async ({ req, body }) => {
  switch (body.action) {
    case 'cep':
      return lookupCep(body.cep);
    case 'send':
      return createSignup(body.data, clientIp(req));
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
}, { auth: false });
