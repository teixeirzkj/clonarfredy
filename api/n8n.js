import { customerClient, openAccounts } from '../lib/accounts.js';
import { HttpError, route } from '../lib/http.js';
import { buildWorkflow, createInN8n, createWtsCredential, listTemplates, loadTemplate, n8nConfigured, scanTemplate } from '../lib/n8n.js';

// Credencial já criada nesta sessão para o mesmo cliente (evita duplicar ao gerar o 2º fluxo).
function reusableCredential(value) {
  if (!value || typeof value.id !== 'string' || !/^[\w-]{1,64}$/.test(value.id)) return null;
  return { id: value.id, name: String(value.name ?? '').slice(0, 100) };
}

function requireName(name) {
  const value = String(name ?? '').trim();
  if (!value) throw new HttpError(400, 'Informe o nome do cliente: ele vira o nome da credencial no n8n');
  return value.slice(0, 80);
}

// Fluxos do n8n: listar padrões, descobrir o que trocar e gerar a cópia do cliente.
export default route(async ({ body }) => {
  switch (body.action) {
    case 'templates':
      return { templates: await listTemplates(), n8nConfigured: n8nConfigured() };

    case 'scan': {
      const workflow = await loadTemplate(body);
      const accounts = await openAccounts(body.clientToken);
      return scanTemplate(workflow, { ...accounts, modelToken: process.env.WTS_MODEL_TOKEN, modelSlug: body.modelSlug });
    }

    case 'build': {
      const workflow = await loadTemplate(body);
      const needsToken = body.replaceToken || (body.create && body.createCredential);
      const clientToken = needsToken ? customerClient(body.clientToken) && body.clientToken.trim() : null;
      const options = {
        mapping: body.mapping,
        clientName: body.clientName,
        prompt: body.prompt,
        modelToken: process.env.WTS_MODEL_TOKEN,
        clientToken,
        replaceToken: Boolean(body.replaceToken),
        clientSlug: body.clientSlug,
        modelSlug: body.modelSlug,
      };
      // Gera antes de criar qualquer coisa no n8n: erro de validação não deixa credencial órfã.
      let result = buildWorkflow(workflow, options);
      if (!body.create) return result;

      let credential = null;
      if (body.createCredential) {
        credential = reusableCredential(body.credential) ?? await createWtsCredential(requireName(body.clientName), clientToken);
        result = buildWorkflow(workflow, { ...options, credential });
      }
      result.credential = credential;
      try {
        result.created = await createInN8n(result.workflow);
      } catch (err) {
        // A credencial já existe: devolve para a tela reaproveitar na próxima tentativa.
        if (!credential || !(err instanceof HttpError)) throw err;
        result.createError = err.message;
      }
      return result;
    }

    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
});
