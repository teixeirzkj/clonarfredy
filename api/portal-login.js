import { issueSession } from '../lib/auth.js';
import { authenticate } from '../lib/clients.js';
import { clientIp, route } from '../lib/http.js';

// Login do portal do cliente (e-mail + senha).
export default route(async ({ req, body }) => {
  const client = await authenticate(body.email, body.password, clientIp(req));
  return { ...issueSession({ role: 'client', clientId: client.id }), company: client.company };
}, { auth: false });
