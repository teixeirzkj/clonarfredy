import { route } from '../lib/http.js';
import { n8nConfigured } from '../lib/n8n.js';
import { resolveModelSlug } from '../lib/slug.js';

// Configurações que a tela precisa mostrar (nada sensível).
export default route(async () => ({
  modelSlug: resolveModelSlug(''),
  n8nConfigured: n8nConfigured(),
}));
