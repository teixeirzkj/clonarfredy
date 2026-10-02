import { customerClient, openAccounts } from '../lib/accounts.js';
import { HttpError, route } from '../lib/http.js';
import { buildPackage, createInN8n, createWtsCredential, listTemplates, loadPackage, n8nConfigured, scanTemplate } from '../lib/n8n.js';
import { readOrder, readRotativo, saveRotativoTeam, TEAM_PLACEHOLDER } from '../lib/rotativo.js';

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

function pathOverrides(value) {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(Object.entries(value).filter(([k, v]) => typeof k === 'string' && typeof v === 'string').map(([k, v]) => [k, v.trim()]));
}

// Fluxos do n8n: listar padrões, descobrir o que trocar e gerar a cópia do cliente.
export default route(async ({ body }) => {
  switch (body.action) {
    case 'templates':
      return { templates: await listTemplates(), n8nConfigured: n8nConfigured() };

    case 'scan': {
      const pkg = await loadPackage(body);
      const accounts = await openAccounts(body.clientToken);
      const scan = await scanTemplate(pkg, { ...accounts, modelToken: process.env.WTS_MODEL_TOKEN, modelSlug: body.modelSlug });
      // Rotativo: usuários do cliente e quem já está ligado (equipe "Rotativo").
      if (scan.rotativo) {
        const rot = await readRotativo(accounts.client);
        Object.assign(scan, { rotativoUsers: rot.users, rotativoTeams: rot.teamNames, rotativoDuplicates: rot.duplicates });
      }
      return scan;
    }

    case 'build': {
      const pkg = await loadPackage(body);
      const auth = body.auth === 'header' ? 'header' : 'credential';
      // Token do cliente: obrigatório no modo header/credencial nova; senão usado se vier (tokens escritos nos nós).
      const needsToken = auth === 'header' || (body.create && body.createCredential);
      const clientToken = needsToken || body.clientToken ? customerClient(body.clientToken) && body.clientToken.trim() : null;
      const options = {
        mapping: body.mapping,
        phoneMapping: body.phoneMapping,
        sheetMapping: body.sheetMapping,
        webhookPaths: pathOverrides(body.webhookPaths),
        clientName: body.clientName,
        prompt: body.prompt,
        modelToken: process.env.WTS_MODEL_TOKEN,
        clientToken,
        replaceToken: Boolean(body.replaceToken),
        clientSlug: body.clientSlug,
        modelSlug: body.modelSlug,
        auth,
      };
      // Rotativo: grava no WTS quem está ligado (equipe "Rotativo") e leva a ordem para o fluxo.
      if (JSON.stringify(pkg.main).includes(TEAM_PLACEHOLDER)) {
        const order = Array.isArray(body.rotativo?.order) ? body.rotativo.order : [];
        const on = Array.isArray(body.rotativo?.on) ? body.rotativo.on : [];
        readOrder(order); // valida antes de mexer no WTS
        const { teamId, created } = await saveRotativoTeam(customerClient(body.clientToken), on);
        options.rotativo = { teamId, order };
        options.rotativoInfo = { created, people: on.length };
      }
      // Gera antes de criar qualquer coisa no n8n: erro de validação não deixa nada órfão.
      let result = await buildPackage(pkg, options);
      if (options.rotativoInfo) result.rotativo = options.rotativoInfo;
      if (!body.create) return result;

      let credential = null;
      if (auth === 'credential' && body.createCredential) {
        credential = reusableCredential(body.credential) ?? await createWtsCredential(requireName(body.clientName), clientToken);
      }
      try {
        result = await buildPackage(pkg, { ...options, credential }, { createSub: createInN8n });
        result.created = await createInN8n(result.workflow);
      } catch (err) {
        // A credencial já existe: devolve para a tela reaproveitar na próxima tentativa.
        if (!credential || !(err instanceof HttpError)) throw err;
        return { ...result, credential, createError: err.message };
      }
      result.credential = credential;
      if (options.rotativoInfo) result.rotativo = options.rotativoInfo;
      return result;
    }

    default:
      throw new HttpError(400, 'Ação desconhecida');
  }
});
