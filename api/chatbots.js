import { listChatbots } from '../lib/chatbots.js';
import { route } from '../lib/http.js';

// Lista os chatbots padrão (JSON para copiar e colar no WTS).
export default route(async () => ({ chatbots: await listChatbots() }), { roles: ['admin', 'client'] });
