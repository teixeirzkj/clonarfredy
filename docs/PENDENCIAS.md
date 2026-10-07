# Pendências do Setup da Conta (Frédy)

Lista única do que falta fazer, decidir ou mandar. Atualizada em 05/10/2026.
Quando algo for resolvido, risque aqui (ou peça para o Claude atualizar).

## 0. Portal do cliente (para funcionar na Vercel)

- [ ] Ligar o banco no **Supabase**: rodar `docs/supabase.sql` no SQL Editor; criar na Vercel `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API) e dar Redeploy.
- [ ] Criação automática da conta: criar `HELENA_PARTNER_TOKEN` na Vercel (Token de Parceiro: Admin → Personalizar → Integração) + Redeploy, e preencher os limites do plano em `templates/plano-padrao.json`.
- [ ] Testar o cadastro com um CNPJ real de teste e conferir a conta criada (status ONBOARDING) no painel de parceiro.
- [ ] (Opcional) `SIGNUP_WEBHOOK_URL`: fluxo do n8n que avisa a equipe no WhatsApp quando chega cadastro novo.
- [ ] Colocar os links dos vídeos em `templates/guia.json` (campo "video" de cada passo) ou mandar para o Claude colocar.
- [ ] Testar com um cliente real: mandar o link `/cadastro`, criar a conta no WTS, criar o acesso em Clientes e mandar o login.

## 1. Segurança (fazer logo)

- [ ] **Trocar o token da Belini** no WTS (Ajustes → Integrações → API) e desativar o antigo: apareceu inteiro em prints na conversa.
- [ ] **Trocar o token da conta modelo** (`WTS_MODEL_TOKEN` na Vercel): também apareceu na conversa.
- [ ] **Senha da página** (`APP_PASSWORD`): foi trocada para uma senha escrita na conversa; se quiser, use outra e passe para a equipe por outro canal. Depois de mudar na Vercel: Deployments → ⋯ → Redeploy.

## 2. Trocar a conta modelo para a Conta Exemplo

- [ ] Colocar o token da Conta Exemplo em `WTS_MODEL_TOKEN` na Vercel + Redeploy.
- [ ] Informar como terminam as URLs dos webhooks da Conta Exemplo (o trecho que substitui `embarque22palmitos`, ex.: `contaexemplo`) para ajustar a página / `WEBHOOK_MODEL_SLUG`.
- [ ] Mandar os fluxos do n8n da Conta Exemplo (.json): Mover card, Agente de IA + tools, Rotativo. Os padrões atuais têm IDs da Embarque 22 Palmitos.

## 3. Arquivos que faltam mandar

- [ ] Fluxo **"Alteração em painel"** (.json do n8n) para virar fluxo padrão.
- [ ] Fluxo de **arquivar cards** que vocês usam hoje (.json): conferir se filtra por data de criação ou de atualização e como arquiva.
- [ ] **JSON de cada chatbot padrão** da conta modelo (e link de vídeo, se tiver) para a tela "Chatbots padrão" (pasta `templates/chatbots`).
- [ ] Outros modelos de mensagem com **botões fixos** (além de checkin e feedback): nome do modelo + botões.
- [ ] **Links dos vídeos** explicativos e em qual tela cada um entra.

## 4. Testar com contas reais

- [ ] Fluxos do n8n: importar e ativar (Mover card, Agente de IA, Rotativo).
- [ ] "Criar no n8n": conferir `N8N_BASE_URL` e `N8N_API_KEY` na Vercel + Redeploy (o botão só aparece com as duas).
- [ ] Arquivar cards (começar por uma coluna pequena).
- [ ] Importar contatos (planilha pequena primeiro).
- [ ] Usuários já entrando nas equipes.
- [ ] Conferências: botões dos modelos (abrir "Dados da API" se não aparecerem) e horário de atendimento.
- [ ] Conta onde foram criadas 5 equipes "Rotativo" pela versão antiga: ver se aparecem em algum lugar; se sim, montar limpeza.

## 5. Esperando algo de fora

- [ ] **Créditos na API da Anthropic** para o "Montar prompt" automático (hoje usa o botão "Copiar para o Claude.ai").
- [ ] **Perguntas para o suporte do WTS**: criar conta/empresa pela API, gerar token, criar painel/etapa, campos, chatbots, sequências, modelos, ler conteúdo de chatbots/sequências, botões dos modelos, conectar WhatsApp, alterar horário, criar carteira. Lista completa em `docs/AUTOATENDIMENTO.md`.

## 6. Decisões nossas

- [ ] Vários logins por empresa no portal (hoje: um e-mail por empresa; dá para criar outro acesso com o mesmo token).

## 7. Próximas funcionalidades (ideias já combinadas)

- [ ] Fluxo de **aniversário** como fluxo padrão.
- [ ] **Painel completo da Marité** montado com um clique (já existe o modelo; falta mandar).
- [ ] Mais automações e fluxos do dia a dia como padrão.
- [ ] **Módulo 2 – motor de automações**: especificado e planejado, ainda não construído.

## Já feito (para referência)

Configurar tudo em passo a passo · Fluxos do n8n (agente + tools, mover card,
rotativo) · Rotativo sem planilha (lista no fluxo, liga/desliga pela página) ·
Montar prompt (Claude.ai) · Conferências com conteúdo completo e copiar ·
Arquivar cards · Importar contatos · Usuários com equipes · Chatbots padrão ·
Horário de atendimento · Portal do cliente (/cliente) e cadastro (/cadastro) com tela Clientes para a equipe.
