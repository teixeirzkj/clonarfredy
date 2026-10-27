# Setup da Conta (WTS / Frédy)

Página aberta pelo menu personalizado do WTS para implantar a conta de um cliente
copiando o padrão da **conta modelo**, só com a API pública do WTS.

## Três páginas

| Endereço | Quem usa | O que faz |
|---|---|---|
| `/` | Equipe Frédy (senha `APP_PASSWORD`) | Tudo, inclusive Fluxos do n8n, Montar prompt e a tela **Clientes** |
| `/portal` (ou `/cliente`) | Portal do cliente (login por e-mail + senha) | Landing simples, "Abrir a Frédy" em destaque, passo a passo em vídeo (cada passo abre com o vídeo; sem vídeo mostra o espaço "em breve") as ferramentas liberadas e **Montar minha IA** (o cliente conversa com a Frédy, que pergunta, monta o agente e testa com ele; ao finalizar, o prompt chega para a equipe em Clientes → "Ver IA"). O endereço `/portal` vai como atalho dentro da Frédy. A equipe cria o acesso em Clientes → "Contas da Helena" (token gerado pela API de parceiro, login = e-mail do dono) ou o acesso nasce no cadastro |
| `/cadastro?pre=ID` | Cliente vindo da página de pagamento | Pré-cadastro criado pela página de pagamento (`action: preSignup` com `PRE_SIGNUP_SECRET`, ver docs/INTEGRACAO-PAGAMENTO.md): tudo preenchido, plano travado e usuários limitados pelo plano. Ao criar a conta, o cliente entra no portal já logado |
| `/cadastro` | Cliente novo (sem login) | Envia CNPJ, empresa, endereço (CEP preenche), responsável, senha do portal e usuários. Com `HELENA_PARTNER_TOKEN`, **cria a conta sozinha**: confere o CNPJ na Receita (ATIVA) e se já existe conta, cria a empresa (`POST /v1/company`, status ONBOARDING, apps e limites do plano em `templates/planos.json`; cada plano tem um link `/cadastro?plano=<id>` e a equipe pode trocar o plano na tela Clientes), gera o token (`POST /v1/company/{id}/tokens`), cria os usuários, copia etiquetas e equipes e libera o portal. Se alguma trava barrar, fica em **Clientes** com o motivo e o botão "Tentar de novo" |
| `/cliente` | Cliente que já tem acesso (e-mail + senha) | Passo a passo com vídeos (`templates/guia.json`), Rotativo, consultas, conferências, chatbots padrão, importar contatos, arquivar cards, etiquetas/equipes/usuários. Sem n8n, prompt e webhooks |

No portal o token do WTS nunca aparece: fica guardado criptografado (AES-256-GCM) e o servidor usa o da conta do cliente logado. As rotas são só da equipe por padrão; as liberadas para o cliente declaram `roles: ['admin', 'client']`.

## O que a página faz

| Área | O que faz |
|---|---|
| **Configurar tudo** | Implantação em etapas numa tela: cliente → etiquetas/equipes/webhooks → prompt da IA → fluxos do n8n marcados (agente, mover card, rotativo) → baixar ou criar todos |
| **Rotativo** | Rodízio de atendentes sem planilha e sem equipe, com peso por pessoa (peso 2 = o dobro de atendimentos, rodízio intercalado). A lista (quem está ligado, ordem e o nome que vai no `nomeatendente`) fica na memória do próprio fluxo do n8n (`$getWorkflowStaticData`). A tela Rotativo lê e grava essa lista por um segundo webhook do fluxo (`rotativo-config/<id da conta>`), protegido por uma chave derivada de `SESSION_SECRET` (trocar o segredo exige gerar o fluxo de novo). O chatbot continua levando para a equipe de cada atendente. **Transbordo** (opcional, na tela Rotativo): o fluxo anota na conversa quem recebeu e quando (metadata da sessão) e, a cada 15 min (só dentro do horário de atendimento, a menos que a opção seja desligada na tela), passa para a próxima pessoa ligada as conversas que ninguém assumiu em X minutos ou horas (mínimo 1 min; relógio a cada minuto) (`PUT /v1/session/{id}/transfer` para a equipe com o nome dela + troca do `nomeatendente`), repetindo até ter resposta. Conversa que uma pessoa já cuidou (respondeu, assumiu, ou transferiu para outra equipe ou outra pessoa) sai do transbordo para sempre; o fluxo anota a equipe onde o rotativo a deixou e, se mudou, foi transferência manual. "Atendida" = o atendente respondeu (lê as mensagens da conversa; funciona com distribuição automática) ou, se escolhido, alguém assumiu. O fluxo guarda na própria memória quais conversas distribuiu (e grava o mesmo no metadata da conversa, como reserva); quando não há o que transbordar, o nó "Quem transborda" devolve o motivo, visível na execução. O config devolve `versao`; a tela avisa quando o fluxo do cliente é de versão anterior (precisa gerar de novo) |
| Etiquetas / Equipes / Webhooks | Mesmo fluxo, um tipo por vez (`/core/v1/tag`, `/core/v1/department`, `/core/v1/webhook/subscription`). Nos webhooks, o nome da empresa no fim da URL é trocado pelo do cliente (`…/alteracaodepainelembarque22palmitos` → `…/alteracaodepainelcontaexemplo`) |
| Usuários | Cria usuários a partir de um formulário (`/core/v1/agent`) |
| **Fluxos do n8n** | Lê os fluxos padrão, acha os IDs da conta modelo (painel, etapas, campos, bot key, etiquetas, equipes...) e troca pelos do cliente, casando pelo nome. Download do `.json`, copiar para colar no n8n, ou criar direto via API do n8n |
| **Montar prompt da IA** | Adapta o prompt padrão com as mensagens do cliente usando Claude (`claude-opus-5-5`, com fallback automático se o modelo recusar). O resultado pode ir direto para o fluxo do agente |
| **Montar minha IA** (portal) | O cliente conversa com a Frédy (`templates/ia-coletor.md`, adaptado do Coletor do WhatsApp; modelo `IA_MODEL`, padrão `claude-sonnet-5-5`): uma pergunta por vez, depois ela vira o agente para testar (`[SIM:nome]`) e encerra com `[FIM]`. Ao finalizar, o servidor extrai o resumo dos campos, monta o prompt no molde da equipe (mesmo de Montar prompt) e guarda tudo (`lib/setup-chat.js`). A tela Clientes mostra "IA pronta" e o botão "Ver IA": campos, prompt, conversa, baixar .txt e "Gerar fluxo do n8n com este prompt". O cliente não baixa prompt nem fluxos |
| **Arquivar cards** | Escolhe painel e coluna, filtra por data (criação ou atualização: todos, até, a partir de, entre) e situação, mostra a prévia e arquiva em lotes (`GET /crm/v2/panel/card` + `PUT /crm/v3/panel/card/{id}` com status ARCHIVED) |
| Conferir | Compara modelo × cliente em modelos de mensagem, painéis/etapas, chatbots, sequências e campos (a API não permite criar esses) |
| **Consultar** | Botões que listam dados da conta do token informado, com IDs para copiar e CSV: painéis e StepIds, campos do painel, cards, motivos de perda, usuários, equipes, etiquetas, bot keys, sequências, modelos, canais, campos do contato, carteiras, webhooks |

Todo bloco de criação segue **prévia (dry-run) → confirmação → log por item**.

## Fluxos padrão do n8n

Coloque os `.json` exportados do n8n em `templates/n8n/` (ou envie o arquivo pela
própria tela). Veja `templates/n8n/LEIA-ME.md`. O prompt padrão da IA fica em
`templates/prompt-padrao.md` e pode ser editado na tela.

## Segurança

- Nenhum token no front: toda chamada ao WTS, n8n e Anthropic passa por `/api`.
- Token da conta modelo, chave da Anthropic e do n8n ficam em env vars.
- Token do cliente: digitado a cada uso, só na memória da página, nunca salvo nem logado.
  Exceção consciente: se o fluxo do n8n tiver o token do modelo escrito nos nós e você
  marcar "trocar o token", o token do cliente vai dentro do arquivo gerado.
- Acesso por senha (`APP_PASSWORD`) com sessão assinada (HMAC, 8 h) no header `X-Session-Token`.
- Token do cliente igual ao da conta modelo é recusado.
- Rate limit WTS: uma chamada por vez por conta, ≥ 350 ms entre elas, retry com backoff no 429.
- CSP restrita; a página só pode ser embutida em `*.wts.chat` e `*.flw.chat` (`vercel.json`).
- As mensagens do cliente usadas no montador de prompt são enviadas à API da Anthropic. A conversa "Montar minha IA" do portal também, e fica guardada no banco (por cliente) para a equipe ver.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `WTS_MODEL_TOKEN` | Token da conta modelo |
| `APP_PASSWORD` | Senha da página |
| `SESSION_SECRET` | Segredo da sessão (mín. 32 caracteres) |
| `ANTHROPIC_API_KEY` | Montar prompt da IA (equipe) e Montar minha IA (portal). `IA_MODEL` (opcional) troca o modelo da conversa do portal (padrão `claude-sonnet-5-5`) |
| `WEBHOOK_MODEL_SLUG` | Opcional: trecho da conta modelo no fim das URLs dos webhooks (padrão `embarque22palmitos`), trocado pelo identificador do cliente |
| `N8N_BASE_URL`, `N8N_API_KEY` | Opcional: botão "Criar no n8n" |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Banco do portal (tabela `portal_kv`, criada com `docs/supabase.sql`). A chave service_role fica só no servidor. Sem banco, o portal e o cadastro não funcionam na Vercel |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Alternativa ao Supabase: Upstash Redis |
| `DATA_SECRET` | Opcional: chave para criptografar os tokens dos clientes (sem ela, usa o `SESSION_SECRET`; trocar qualquer uma invalida os tokens guardados) |
| `HELENA_PARTNER_TOKEN` | Token de Parceiro (Admin → Personalizar → Integração): liga a criação automática da conta pelo cadastro |
| `HELENA_API_BASE` | Opcional: base da API de parceiro (padrão `https://api.helena.run`) |
| `FREDY_APP_URL` | Opcional: sistema para onde o cliente vai depois de criar a conta (padrão `https://fredy.wts.chat/`) |
| `PORTAL_AUTO_CREATE` | Opcional: `off` desliga a criação automática (o cadastro só chega para a equipe) |
| `SIGNUP_WEBHOOK_URL`, `PRE_SIGNUP_SECRET` (chave da integração com a página de pagamento, ver docs/INTEGRACAO-PAGAMENTO.md), `PUBLIC_URL` (endereço público da página, para os links mandados para fora; sem ele usa o host da requisição) | Opcional: recebe cada cadastro novo (ex.: fluxo do n8n que avisa a equipe no WhatsApp) |
| `N8N_WEBHOOK_BASE` | Opcional: base das URLs de webhook mostradas (padrão `https://webhooks.tedyleads.com.br/webhook/`) |

## Rodar localmente

Requer Node 20+.

```powershell
npm.cmd install
node scripts/dev.js        # http://localhost:3000 (lê .env.local)
```

## Deploy na Vercel

1. Suba o repositório (privado) no GitHub e importe na Vercel.
2. Framework Preset **Other**, sem build command, Output Directory `public`.
3. Cadastre as variáveis acima em **Settings → Environment Variables**.
4. As funções usam até 300 s (`vercel.json`), necessário para o montador de prompt.
