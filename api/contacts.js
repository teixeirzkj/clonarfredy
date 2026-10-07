import { customerClient } from '../lib/accounts.js';
import { createTag, importContacts, importOptions } from '../lib/contacts.js';
import { HttpError, route } from '../lib/http.js';

// Importar contatos de uma planilha para a conta do cliente.
export default route(async ({ body }) => {
  const wts = customerClient(body.clientToken);
  switch (body.action) {
    case 'options':
      return importOptions(wts);
    case 'createTag':
      return createTag(wts, body.name);
    case 'import':
      return importContacts(wts, body);
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
}, { roles: ['admin', 'client'] });
