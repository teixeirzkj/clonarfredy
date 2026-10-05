import { customerClient } from '../lib/accounts.js';
import { archiveCards, panelsWithSteps, previewCards } from '../lib/cards.js';
import { HttpError, route } from '../lib/http.js';

// Arquivar cards de uma coluna: painéis, prévia e arquivamento em lotes.
export default route(async ({ body }) => {
  const wts = customerClient(body.clientToken);
  switch (body.action) {
    case 'panels':
      return { panels: await panelsWithSteps(wts) };
    case 'preview':
      return previewCards(wts, body.filter);
    case 'archive':
      return archiveCards(wts, body.ids);
    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
});
