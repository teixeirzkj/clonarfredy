# Setup da Conta (WTS / Frédy)

Página aberta pelo menu personalizado do WTS para implantar a conta de um cliente
copiando o padrão da **conta modelo**, só com a API pública do WTS.

## O que a página faz

| Área | O que faz |
|---|---|
| **Configurar tudo** | Prévia única de etiquetas, equipes e webhooks padrão que faltam; cria tudo com um clique |
| Etiquetas / Equipes / Webhooks | Mesmo fluxo, um tipo por vez (`/core/v1/tag`, `/core/v1/department`, `/core/v1/webhook/subscription`) |
| Usuários | Cria usuários a partir de um formulário (`/core/v1/agent`) |
| **Fluxos do n8n** | Lê os fluxos padrão, acha os IDs da conta modelo (painel, etapas, campos, bot key, etiquetas, equipes...) e troca pelos do cliente, casando pelo nome. Download do `.json`, copiar para colar no n8n, ou criar direto via API do n8n |
| **Montar prompt da IA** | Adapta o prompt padrão com as mensagens do cliente usando Claude (`claude-opus-5-5`, com fallback automático se o modelo recusar). O resultado pode ir direto para o fluxo do agente |
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
- As mensagens do cliente usadas no montador de prompt são enviadas à API da Anthropic.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `WTS_MODEL_TOKEN` | Token da conta modelo |
| `APP_PASSWORD` | Senha da página |
| `SESSION_SECRET` | Segredo da sessão (mín. 32 caracteres) |
| `ANTHROPIC_API_KEY` | Montar prompt da IA |
| `N8N_BASE_URL`, `N8N_API_KEY` | Opcional: botão "Criar no n8n" |

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
