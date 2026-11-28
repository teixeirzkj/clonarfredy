# Black — Plug & Play do Frédy (preparação)

Responsável: Riquelme Teixeira · Apoio: Time de Soluções/Onboarding · Prazo: 04/12
Objetivo: padronizar a configuração do Frédy para implantar rápido as agências que contratarem na Black.
(A Duda usa o mesmo plano e o mesmo caminho, em `/duda`.)

Legenda: ✅ conferido no sistema · 🔧 corrigido agora · 👥 tarefa da equipe (decisão, teste ou atendimento)

## 1. Status do checklist

| Item | Status | Onde / como |
|---|---|---|
| Estrutura do plano Plug & Play | ✅ | `templates/planos.json` → `plug-and-play` (só abre pela página de pagamento) |
| Funcionalidades do plano básico | ✅ | Ver seção 2 |
| Oferta a partir de R$ 497 | 👥 | O preço fica na página de pagamento (Asaas), não neste sistema |
| Três usuários | ✅ | `agents: 3` |
| Uma inteligência artificial | ✅ | `aiAgents: 1` + app `AI_AGENT` |
| Nome "Lambus Base" | 👥 | Não aparece no sistema; validar com quem citou na reunião |
| Estrutura padrão da IA básica | ✅ | "Montar minha IA" no portal + `templates/prompt-padrao.md` + fluxos do n8n |
| Modelo de configuração replicável | ✅ | Conta Exemplo (conta modelo) → etiquetas e equipes copiadas na criação; chatbots padrão para copiar |
| Fluxo de instalação padronizado | ✅ | Passo a passo do portal (12 passos, todos com vídeo) |
| Cliente faz a própria instalação | ✅ | Portal do cliente (`/portal`) com vídeos, ferramentas e a IA |
| Contratação com suporte de setup | 👥 | Decidir o que muda (preço/plano). Técnica: a equipe já faz tudo pela página da equipe ("Configurar tudo") |
| Usuários extras | 🔧 | O pré-cadastro já aceitava `usersCount`; **agora a conta também nasce com esse limite** (antes, quem pagava 5 e cadastrava 3 ficava com limite 3) |
| Funcionalidades adicionais depois | ✅ / 👥 | A equipe troca o plano do cadastro em Clientes; a lista do que vender a mais é decisão comercial |
| Configuração inicial do WhatsApp | ✅ | Passo 2 do guia, com vídeo (API oficial pela Meta) |
| Testar a IA básica | 👥 | A conversa "Montar minha IA" foi testada em 11/11; o agente respondendo no WhatsApp é teste da equipe na primeira conta |
| Testar o atendimento pelo WhatsApp | 👥 | Precisa de número conectado: teste da equipe |
| Checklist técnico de ativação | ✅ | Seção 3 |
| Informações mínimas para iniciar | ✅ | Seção 4 |
| Procedimento de entrega | ✅ | Seção 5 |
| Implantação básica em ~7 dias | 👥 | Feita pela equipe; roteiro sugerido na seção 6 |
| Quantas contas ativar ao mesmo tempo | 👥 | A criação da conta é automática (não limita); o gargalo é a equipe nos passos dela (seção 6) |
| Prioridades até 18/12, melhorias para janeiro, contingência | 👥 | Decisão da equipe; o que está pendente no sistema está em `docs/PENDENCIAS.md` |

## 2. O que o Plug & Play inclui (como está no sistema)

- **3 usuários** e **1 agente de IA**.
- **Canais:** 1 WhatsApp (sem Instagram, Messenger ou webchat).
- **Recursos:** IA, campanhas, motivos de atendimento, mensagens agendadas, diálogos, painéis (CRM) e atraso de mensagem.
- **Chatbots de atendimento:** liberados. **Chatbots de automação e sequências:** zerados de propósito; o cliente passa a criar quando conecta o número.
- Comparado ao plano **Padrão**: o Padrão tem distribuição de atendimento, sequências, transcrição, carteira de contatos, Instagram e Messenger, e chatbots de automação liberados.

## 3. Checklist técnico de ativação (por cliente)

1. Pagamento confirmado → a página de pagamento chama o pré-cadastro e o cliente recebe o link.
2. Cliente preenche o cadastro (CNPJ, responsável, senha do portal, usuários).
3. Conferir em **Clientes** (página da equipe) se o cadastro ficou **concluído**. Se travou, ler o motivo e clicar em **Tentar de novo**.
4. Conferir no Frédy (Admin → Contas) se a conta existe, com o plano e os usuários certos.
5. Conferir na conta: etiquetas e equipes padrão copiadas.
6. Cliente conecta o WhatsApp (passo 2 do guia). Confirmar que o número aparece em Ajustes → Canais.
7. Cliente faz a conversa "Montar minha IA" (passo 9) → a equipe vê em Clientes → **Ver IA**.
8. Equipe gera o fluxo do n8n com o prompt do cliente (botão em Ver IA) e liga o agente.
9. Cliente cola os chatbots Pergunta IA e Resposta IA; a equipe liga o webhook do agente.
10. **Teste final:** mandar uma mensagem de outro número para o WhatsApp do cliente e conferir a resposta da IA, o card no funil e as etiquetas.

## 4. Informações mínimas para iniciar

Vêm do pagamento e do cadastro; sem elas a conta não é criada:
- CNPJ **ativo** na Receita (a conta não é criada se não estiver ativo ou se já existir conta com ele).
- Razão social e nome fantasia.
- Responsável: nome, e-mail (vira o login do portal) e telefone.
- Endereço (o CEP preenche).
- Usuários: nome e e-mail de cada um (até o limite pago).
- Para a IA (na conversa do portal ou repassadas pela equipe): como o agente fala, o que a empresa vende, como funciona o orçamento, horários, regras e o nome do agente.
- Para o WhatsApp: número que vai ser usado e acesso ao Facebook/Meta da empresa.

## 5. Procedimento de entrega ao cliente

1. Ao terminar o cadastro, o cliente já cai no **portal logado** (`/portal`) com o passo a passo.
2. Mensagem de boas-vindas da equipe (sugestão): link do portal, login (e-mail do cadastro), "comece pelo passo 2 (conectar o WhatsApp)".
3. Acompanhar em **Clientes** o avanço (passos concluídos e se a IA foi finalizada).
4. Quando a IA estiver finalizada, a equipe liga o agente (seção 3, itens 8 e 9) e faz o teste final.
5. Avisar o cliente que está no ar.

## 6. Roteiro sugerido de implantação (~7 dias, equipe)

| Dia | O quê |
|---|---|
| 1 | Pagamento e cadastro; conferir a conta e mandar as boas-vindas |
| 1–2 | Cliente conecta o WhatsApp (ajudar quem travar na Meta) |
| 2–3 | Cliente faz a conversa "Montar minha IA" e os passos do guia |
| 3–4 | Equipe gera o fluxo do n8n e liga o agente |
| 5 | Teste final pelo WhatsApp e ajustes no prompt |
| 6–7 | Folga para atrasos (Meta, documentos) e entrega |

Capacidade: a criação da conta, os vídeos e a conversa com a IA não dependem da equipe (escalam sozinhos). O tempo da equipe por cliente fica nos itens 3, 8, 9 e 10 do checklist técnico, além do suporte na conexão do WhatsApp. Medir nas primeiras contas quanto tempo isso leva para calcular quantas dá para ativar por dia.
