import { checkPassword, issueSession } from '../lib/auth.js';
import { HttpError, route } from '../lib/http.js';

const FAILURE_DELAY_MS = 800; // freia tentativas de força bruta

export default route(
  async ({ body }) => {
    if (!checkPassword(body.password)) {
      await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
      throw new HttpError(401, 'Senha incorreta');
    }
    return issueSession();
  },
  { auth: false },
);
