import { customerClient, openAccounts } from '../lib/accounts.js';
import { HttpError, route } from '../lib/http.js';
import { buildWorkflow, createInN8n, listTemplates, loadTemplate, n8nConfigured, scanTemplate } from '../lib/n8n.js';

// Fluxos do n8n: listar padrões, descobrir o que trocar e gerar a cópia do cliente.
export default route(async ({ body }) => {
  switch (body.action) {
    case 'templates':
      return { templates: await listTemplates(), n8nConfigured: n8nConfigured() };

    case 'scan': {
      const workflow = await loadTemplate(body);
      const accounts = await openAccounts(body.clientToken);
      return scanTemplate(workflow, { ...accounts, modelToken: process.env.WTS_MODEL_TOKEN });
    }

    case 'build': {
      const workflow = await loadTemplate(body);
      const clientToken = body.replaceToken ? customerClient(body.clientToken) && body.clientToken.trim() : null;
      const result = buildWorkflow(workflow, {
        mapping: body.mapping,
        clientName: body.clientName,
        prompt: body.prompt,
        modelToken: process.env.WTS_MODEL_TOKEN,
        clientToken,
        replaceToken: Boolean(body.replaceToken),
      });
      if (body.create) result.created = await createInN8n(result.workflow);
      return result;
    }

    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
});
