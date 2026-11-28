import { currentBrand } from './brand.js';
import { HttpError } from './errors.js';
import { getClient, listClients } from './clients.js';
import { addCompanyLimits, findCompanyByDocument, partnerConfigured } from './partner.js';
import { getJson, setJson } from './store.js';

// Adicionais comprados depois do plano: usuário (R$ 47/mês) e canal de atendimento (R$ 97/mês).
// O pagamento é na página de pagamento; aqui só aumenta o limite da conta na plataforma.
const MAX_PER_ORDER = 50;
const orderKey = (id) => `addon-order:${currentBrand().id}:${id}`;
const count = (v) => Math.max(0, Math.min(MAX_PER_ORDER, Math.floor(Number(v) || 0)));

// Acha a conta: pelo id da conta, pelo acesso do portal (e-mail) ou pelo CNPJ.
async function findCompanyId({ companyId, email, cnpj, clientId }) {
  if (companyId && /^[0-9a-f-]{36}$/i.test(String(companyId))) return String(companyId);
  if (clientId) {
    const c = await getClient(String(clientId));
    if (c?.companyId) return c.companyId;
    if (c) throw new HttpError(400, 'Este acesso não está ligado a uma conta da plataforma (criado com token manual). Ajuste os limites direto no Admin.');
  }
  if (email) {
    const c = (await listClients()).find((x) => x.email === String(email).trim().toLowerCase());
    if (c?.companyId) return c.companyId;
  }
  if (cnpj) {
    const company = await findCompanyByDocument(cnpj);
    if (company?.id) return company.id;
  }
  throw new HttpError(404, 'Conta do cliente não encontrada (informe o CNPJ, o e-mail do portal ou o id da conta)');
}

/**
 * Aplica os adicionais na conta. `order.id` evita aplicar duas vezes o mesmo pagamento.
 * Devolve { companyId, antes, depois, repetido? }.
 */
export async function applyAddOn(input) {
  if (!partnerConfigured()) throw new HttpError(503, `Token de Parceiro da ${currentBrand().name} não configurado: não dá para mudar os limites da conta`);
  const users = count(input?.users ?? input?.usuarios);
  const channels = count(input?.channels ?? input?.canais);
  if (!users && !channels) throw new HttpError(400, 'Informe a quantidade de usuários ou de canais adicionais');
  const orderId = String(input?.order?.id ?? input?.orderId ?? input?.pedido ?? '').trim().slice(0, 100);
  if (orderId) {
    const prev = await getJson(orderKey(orderId));
    if (prev) return { ...prev, repetido: true };
  }
  const companyId = await findCompanyId({ companyId: input?.companyId, email: input?.email, cnpj: input?.cnpj, clientId: input?.clientId });
  const { antes, depois } = await addCompanyLimits(companyId, { users, channels });
  const result = { companyId, users, channels, antes, depois, at: new Date().toISOString() };
  if (orderId) await setJson(orderKey(orderId), result);
  return result;
}
