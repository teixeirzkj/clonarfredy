import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { HttpError } from './errors.js';
import { getClient } from './clients.js';
import { SYSTEM as PROMPT_SYSTEM, defaultPrompt } from './prompt.js';
import { del, getJson, hit, setJson } from './store.js';

// "Montar minha IA": o cliente conversa com a Frédy no portal (templates/ia-coletor.md),
// ela coleta os 12 campos, testa como o agente ([SIM:nome]) e encerra com [FIM].
// Ao finalizar, o sistema extrai o resumo e monta o prompt final no formato da equipe
// (lib/prompt.js); o resultado fica para a equipe ver em Clientes.

const MODEL = () => process.env.IA_MODEL || 'claude-sonnet-5-5';
const MAX_MESSAGES = 120;
const MAX_TEXT = 2000;
const MIN_MESSAGES_TO_FINISH = 6;
const key = (clientId) => `ia:${clientId}`;
const finalKey = (clientId) => `ia-final:${clientId}`;
const INICIO = '[INICIO]';
const SIM_RE = /^\s*\[SIM:([^\]]{1,60})\]\s*/;
const FIM_RE = /\s*\[FIM\]\s*$/;

const CAMPOS = [
  ['estilo_comunicacao', 'Estilo de comunicação'], ['funcoes', 'Funções do agente'], ['empresa_foco', 'Foco da empresa'],
  ['empresa_tempo', 'Tempo de mercado'], ['empresa_publico', 'Público'], ['empresa_missao', 'Missão e valores'],
  ['empresa_horarios', 'Horários'], ['empresa_endereco', 'Endereço'], ['etapas_atendimento', 'Etapas do atendimento'],
  ['info_produtos', 'Produtos e serviços'], ['regras_limitacoes', 'Regras e limitações'], ['nome_assistente', 'Nome do agente'],
  ['nao_trabalha', 'O que não trabalha'], ['ajustes_simulacao', 'Ajustes pedidos no teste'],
];

const saudacao = (d) => { const h = d.getHours(); return h >= 4 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite'; };

async function systemPrompt(client) {
  let text;
  try {
    text = await readFile(join(process.cwd(), 'templates', 'ia-coletor.md'), 'utf8');
  } catch {
    throw new HttpError(500, 'Prompt do coletor não encontrado (templates/ia-coletor.md)');
  }
  // Nome do responsável vem do cadastro, quando o acesso nasceu dele.
  const signup = client.signupId ? await getJson(`signup:${client.signupId}`).catch(() => null) : null;
  const nome = signup?.owner?.name || client.company;
  const agora = new Date(Date.now() - 3 * 3600000); // horário de Brasília
  return text
    .split('__EMPRESA__').join(client.company)
    .split('__NOME__').join(nome)
    .split('__PRIMEIRO_NOME__').join(String(nome).split(' ')[0])
    .split('__DATA__').join(agora.toISOString().replace('T', ' ').slice(0, 16))
    .split('__SAUDACAO__').join(saudacao(agora));
}

// Erros da API viram mensagens claras (sem a chave).
const apiMessage = (err) => String(err?.error?.error?.message ?? err?.message ?? '').slice(0, 300);
async function ask({ system, messages, maxTokens }) {
  if (!process.env.ANTHROPIC_API_KEY) throw new HttpError(503, 'A IA ainda não está ligada neste portal (falta a chave da Anthropic). Fale com a equipe Frédy.');
  const client = new Anthropic();
  try {
    const res = await client.messages.create({ model: MODEL(), max_tokens: maxTokens, system, messages });
    return res.content.filter((c) => c.type === 'text').map((c) => c.text).join('').trim();
  } catch (err) {
    const detail = apiMessage(err);
    if (err instanceof Anthropic.AuthenticationError) throw new HttpError(500, 'Chave da API da Anthropic inválida');
    if (err instanceof Anthropic.RateLimitError) throw new HttpError(429, 'A IA está ocupada agora. Tente de novo em alguns minutos.');
    if (err instanceof Anthropic.APIConnectionError) throw new HttpError(502, 'Sem conexão com a IA. Tente de novo.');
    if (err instanceof Anthropic.BadRequestError && /credit balance/i.test(detail)) throw new HttpError(402, 'A IA está sem créditos. Fale com a equipe Frédy.');
    if (err instanceof Anthropic.APIError) throw new HttpError(502, `Erro na IA (${err.status ?? 'sem status'}): ${detail}`);
    throw err;
  }
}

const now = () => new Date().toISOString();
const emptyChat = () => ({ messages: [], status: 'coleta', agentName: '', startedAt: now() });
// A IA recebe as próprias respostas com os marcadores ([SIM:nome], [FIM]) para manter o fio.
const toApi = (messages) => messages.map((m) => ({ role: m.role, content: m.raw ?? m.text }));

// Separa os marcadores da resposta e atualiza o estado.
function readReply(chat, raw) {
  let text = raw;
  let sim = false;
  const m = SIM_RE.exec(text);
  if (m) { sim = true; chat.agentName = m[1].trim(); text = text.replace(SIM_RE, ''); chat.status = 'simulacao'; }
  else if (chat.status === 'simulacao') chat.status = 'coleta';
  if (FIM_RE.test(text)) { text = text.replace(FIM_RE, '').trim(); chat.status = 'fim'; }
  return { text, sim };
}

// O que a tela do cliente recebe (a mensagem [INICIO] fica escondida).
export function publicChat(chat) {
  return {
    status: chat.status, agentName: chat.agentName, startedAt: chat.startedAt, finishedAt: chat.finishedAt ?? null,
    messages: chat.messages.filter((m) => !m.hidden).map((m) => ({ role: m.role, text: m.text, sim: Boolean(m.sim), agentName: m.agentName ?? null, at: m.at })),
    canFinish: chat.status === 'fim' || chat.messages.filter((m) => !m.hidden).length >= 12,
  };
}

export async function getChat(clientId) {
  return publicChat((await getJson(key(clientId))) ?? emptyChat());
}

async function reply(clientId, chat, client) {
  const system = await systemPrompt(client);
  const raw = await ask({ system, messages: toApi(chat.messages), maxTokens: 900 });
  const { text, sim } = readReply(chat, raw);
  chat.messages.push({ role: 'assistant', text, raw, sim, agentName: sim ? chat.agentName : null, at: now() });
  await setJson(key(clientId), chat);
  return publicChat(chat);
}

/** Primeira mensagem: a Frédy abre a conversa. */
export async function startChat(clientId) {
  const client = await getClient(clientId);
  if (!client) throw new HttpError(404, 'Cliente não encontrado');
  const existing = await getJson(key(clientId));
  if (existing?.messages?.length) return publicChat(existing);
  const chat = emptyChat();
  chat.messages.push({ role: 'user', text: INICIO, hidden: true, at: now() });
  return reply(clientId, chat, client);
}

/** Mensagem do cliente → resposta da Frédy (coletor ou agente simulado). */
export async function sendMessage(clientId, input) {
  const text = String(input ?? '').trim();
  if (!text) throw new HttpError(400, 'Escreva uma mensagem');
  if (text.length > MAX_TEXT) throw new HttpError(400, `Mensagem longa demais (máximo ${MAX_TEXT} caracteres)`);
  if ((await hit(`ia-rate:${clientId}`, 60 * 60)) > 80) throw new HttpError(429, 'Muitas mensagens em pouco tempo. Espere alguns minutos.');
  const client = await getClient(clientId);
  if (!client) throw new HttpError(404, 'Cliente não encontrado');
  const chat = (await getJson(key(clientId))) ?? emptyChat();
  if (chat.status === 'finalizado') throw new HttpError(409, 'Esta conversa já foi finalizada. Clique em "Conversar de novo" para montar outra versão.');
  if (chat.messages.length >= MAX_MESSAGES) throw new HttpError(400, 'A conversa ficou longa demais. Finalize ou recomece.');
  if (!chat.messages.length) chat.messages.push({ role: 'user', text: INICIO, hidden: true, at: now() }, { role: 'assistant', text: 'Olá! Vamos montar o seu agente.', at: now() });
  chat.messages.push({ role: 'user', text, at: now() });
  return reply(clientId, chat, client);
}

/** Recomeça do zero (o último resultado finalizado continua guardado para a equipe). */
export async function resetChat(clientId) {
  await del(key(clientId));
  return publicChat(emptyChat());
}

const transcript = (chat) => chat.messages.filter((m) => !m.hidden)
  .map((m) => `${m.role === 'user' ? 'CLIENTE' : m.sim ? `AGENTE SIMULADO (${m.agentName})` : 'FRÉDY'}: ${m.text}`).join('\n\n');

const RESUMO_SYSTEM = `Você lê a transcrição de uma conversa entre o time de setup da Frédy e um cliente, e extrai o que foi combinado sobre o agente de IA dele.
Responda SOMENTE com um JSON (sem comentários, sem bloco de código) com estas chaves, todas como texto (string), nas palavras do cliente sempre que possível:
estilo_comunicacao, funcoes, empresa_foco, empresa_tempo, empresa_publico, empresa_missao, empresa_horarios, empresa_endereco, etapas_atendimento, info_produtos, regras_limitacoes, nome_assistente, nao_trabalha, ajustes_simulacao, pendentes.
Regras: campo sem resposta = "PENDENTE"; "nao_trabalha" = o que o cliente disse que NÃO vende/faz (ou "nenhum"); "ajustes_simulacao" = ajustes pedidos durante o teste (ou "nenhum"); "pendentes" = lista separada por vírgula dos campos que ficaram pendentes (ou "nenhum"). Não invente nada que o cliente não disse.`;

function parseResumo(raw) {
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < 0) throw new HttpError(502, 'A IA não devolveu o resumo no formato esperado. Tente finalizar de novo.');
  let obj;
  try { obj = JSON.parse(text.slice(start, end + 1)); } catch { throw new HttpError(502, 'A IA não devolveu o resumo no formato esperado. Tente finalizar de novo.'); }
  const resumo = {};
  for (const [k] of CAMPOS) resumo[k] = String(obj[k] ?? 'PENDENTE').trim().slice(0, 4000) || 'PENDENTE';
  resumo.pendentes = String(obj.pendentes ?? 'nenhum').trim().slice(0, 500);
  return resumo;
}

const resumoText = (resumo) => CAMPOS.map(([k, label]) => `- ${label}: ${resumo[k]}`).join('\n') + `\n- Campos pendentes: ${resumo.pendentes}`;

/** Finaliza: extrai o resumo, monta o prompt final e deixa tudo para a equipe. */
export async function finishChat(clientId) {
  const client = await getClient(clientId);
  if (!client) throw new HttpError(404, 'Cliente não encontrado');
  const chat = await getJson(key(clientId));
  if (!chat || chat.messages.filter((m) => !m.hidden).length < MIN_MESSAGES_TO_FINISH) throw new HttpError(400, 'Converse um pouco mais com a Frédy antes de finalizar: ela ainda não tem o suficiente para montar o agente.');
  if (chat.status === 'finalizado') throw new HttpError(409, 'Esta conversa já foi finalizada.');

  const conversa = transcript(chat);
  const resumo = parseResumo(await ask({ system: RESUMO_SYSTEM, messages: [{ role: 'user', content: `Empresa: ${client.company}\n\n<transcricao>\n${conversa}\n</transcricao>` }], maxTokens: 2500 }));

  // Prompt final no formato da equipe (mesmo molde do "Montar prompt").
  const base = await defaultPrompt();
  let prompt = '';
  if (base) {
    prompt = await ask({
      system: PROMPT_SYSTEM,
      messages: [{ role: 'user', content: [`<prompt_padrao>\n${base}\n</prompt_padrao>`, `<informacoes_cliente>\nCliente: ${client.company}\n\n${resumoText(resumo)}\n\nTrechos da conversa com o cliente:\n${conversa.slice(0, 20000)}\n</informacoes_cliente>`, 'Monte o prompt final deste cliente.'].join('\n\n') }],
      maxTokens: 16000,
    });
  }

  const finishedAt = now();
  const final = { clientId, company: client.company, agentName: resumo.nome_assistente !== 'PENDENTE' ? resumo.nome_assistente : chat.agentName, resumo, prompt, finishedAt, transcript: conversa, messages: chat.messages.filter((m) => !m.hidden).length };
  await setJson(finalKey(clientId), final);
  chat.status = 'finalizado';
  chat.finishedAt = finishedAt;
  await setJson(key(clientId), chat);
  // Resumo no cadastro do cliente, para a tela Clientes mostrar "IA pronta".
  client.ia = { status: 'finalizado', finishedAt, agentName: final.agentName, hasPrompt: Boolean(prompt) };
  await setJson(`client:${clientId}`, client);
  notify({ evento: 'ia_pronta', empresa: client.company, email: client.email, agente: final.agentName, finishedAt, pendentes: resumo.pendentes });
  return publicChat(chat);
}

/** Resultado para a equipe (prompt, resumo, transcrição). */
export async function getFinal(clientId) {
  const final = await getJson(finalKey(clientId));
  if (!final) throw new HttpError(404, 'Este cliente ainda não finalizou a IA');
  return { ...final, campos: CAMPOS.map(([k, label]) => ({ key: k, label, value: final.resumo?.[k] ?? 'PENDENTE' })) };
}

// Aviso para a equipe (opcional): mesmo webhook do cadastro novo.
async function notify(payload) {
  const url = process.env.SIGNUP_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(5000) });
  } catch { /* o resultado já está salvo; o aviso é só conveniência */ }
}
