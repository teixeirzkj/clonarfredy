import { openAccounts } from '../lib/accounts.js';
import { runCheck } from '../lib/checks.js';
import { route } from '../lib/http.js';

// Conferência somente leitura: modelo × cliente.
export default route(async ({ body }) => {
  const accounts = await openAccounts(body.clientToken);
  return runCheck(body.check, accounts);
});
