# Pendências do Setup da Conta (Frédy)

Lista única do que falta fazer, decidir ou mandar. Atualizada em 10/10/2026.
Quando algo for resolvido, risque aqui (ou peça para o Claude atualizar).

## 0. Portal do cliente (para funcionar na Vercel)

- [x] Banco no **Supabase** ligado (portal e cadastro gravando em produção).
- [x] Cadastro preenche razão social, nome fantasia, CNAE, telefone e endereço pelo CNPJ (Receita). Feito em 10/10, falta publicar.
- [x] Criação automática da conta: `HELENA_PARTNER_TOKEN` na Vercel. A Helena exige apps e limites: planos em `templates/planos.json` (Padrão = print da equipe; Teste = tudo liberado).
- [ ] Trocar o Token de Parceiro: o suporte da Helena colou o token na conversa (07/out/2026). Gerar outro em Admin → Personalizar → Integração e atualizar `HELENA_PARTNER_TOKEN` na Vercel.
- [ ] Criar os outros planos de venda em `templates/planos.json` (cada um ganha seu link de cadastro).
- [ ] Testar o cadastro com um CNPJ da Frédy (ou autorizado) pelo link do plano Teste e conferir a conta criada (status ONBOARDING) no painel de parceiro. Atenção: a conta é criada de verdade na Helena.
- [ ] Cadastro "Seu Mobile": clicar "Tentar de novo" em Clientes (a conta já existe, criada pelo suporte) e conferir o acesso ao portal; depois arquivar ou excluir, porque o CNPJ é de uma loja real.
- [ ] (Opcional) `SIGNUP_WEBHOOK_URL`: fluxo do n8n que avisa a equipe no WhatsApp quando chega cadastro novo.
- [ ] Colocar os links dos vídeos em `templates/guia.json` (campo "video" de cada passo) ou mandar para o Claude colocar.
- [ ] Testar com um cliente real: mandar o link `/cadastro`, criar a conta no WTS, criar o acesso em Clientes e mandar o login.

## 0.1 Portal do cliente v2 (27/10)

- [x] Endereço `/portal` para o atalho na Frédy; landing do portal mais simples; "Abrir a Frédy" em destaque; passo a passo em vídeo (espaço pronto por passo).
- [x] Cadastro pré-preenchido pela página de pagamento (`?pre=ID`), usuários limitados pelo plano, cliente entra no portal já logado ao criar a conta.
- [x] Tela Clientes → "Contas da Helena": criar acesso ao portal para contas existentes (um por um ou todas).
- [ ] **Eric**: combinar como a página dele chama a API (docs/INTEGRACAO-PAGAMENTO.md), gerar `PRE_SIGNUP_SECRET` na Vercel e passar por canal seguro; mapear produtos → `plan`.
- [ ] **Vídeos**: gravar e colocar o link em cada passo de `templates/guia.json` (campo `video`); também `<chatbot>.video.txt` nos chatbots.
- [ ] **Atalho na Frédy**: colocar `https://clonarfredy.vercel.app/portal` como atalho nas contas dos clientes (ou domínio próprio, se quiserem; aí definir `PUBLIC_URL`).
- [ ] **Ativar para todos**: em Clientes → Contas da Helena, "Criar acesso para todas sem acesso" e mandar e-mail + senha para cada dono (as senhas só aparecem na hora).
- [ ] Portal: ordem e textos dos passos (`templates/guia.json`) podem ser reorganizados quando os vídeos existirem.

## 1. Segurança (fazer logo)

- [ ] **Trocar o token da Belini** no WTS (Ajustes → Integrações → API) e desativar o antigo: apareceu inteiro em prints na conversa.
- [ ] **Trocar o token da América Viagens** no WTS (Ajustes → Integrações → API): o fluxo com o token foi colado na conversa (16/10). Depois gerar o fluxo Rotativo de novo com o token novo.
- [ ] **Trocar o token da conta modelo** (`WTS_MODEL_TOKEN` na Vercel): também apareceu na conversa.
- [ ] **Senha da página** (`APP_PASSWORD`): foi trocada para uma senha escrita na conversa; se quiser, use outra e passe para a equipe por outro canal. Depois de mudar na Vercel: Deployments → ⋯ → Redeploy.

## 2. Trocar a conta modelo para a Conta Exemplo

- [ ] Colocar o token da Conta Exemplo em `WTS_MODEL_TOKEN` na Vercel + Redeploy.
- [ ] Informar como terminam as URLs dos webhooks da Conta Exemplo (o trecho que substitui `embarque22palmitos`, ex.: `contaexemplo`) para ajustar a página / `WEBHOOK_MODEL_SLUG`.
- [ ] Mandar os fluxos do n8n da Conta Exemplo (.json): Mover card, Agente de IA + tools, Rotativo. Os padrões atuais têm IDs da Embarque 22 Palmitos.

## 3. Arquivos que faltam mandar

- [ ] Fluxo **"Alteração em painel"** (.json do n8n) para virar fluxo padrão.
- [ ] Fluxo de **arquivar cards** que vocês usam hoje (.json): conferir se filtra por data de criação ou de atualização e como arquiva.
- [x] Chatbots padrão recebidos (10/10): Pergunta IA (atendimento); Resposta IA, Follow up 1, 2 e 3 dias, Checkin e Feedback (automação). Faltam só os vídeos (`<nome>.video.txt`).
- [ ] Checkin e Feedback têm textos da Berg Viagens (nome, Instagram, link de avaliação no Google). A tela avisa para trocar; ver se vale deixar um texto neutro na versão padrão.
- [ ] Chatbot "Pergunta IA": a condição de entrada é "última mensagem = #teste-157" (parece sobra de teste). Confirmar se é isso mesmo ou mandar a versão de produção.
- [ ] Follow-ups: os modelos "FollowUp Orçamento Após 1/2/3 dias" e as sequências "Follow 48 horas", "Follow 72 horas" e "Follow 7 dias" precisam existir na conta do cliente. Ver se entram no passo a passo.
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

- [ ] **Chave e créditos na API da Anthropic** para o "Montar prompt" automático e para o **"Montar minha IA" do portal** (sem a chave, o cliente vê o aviso "a IA ainda não está ligada"): criar a chave em console.anthropic.com, colocar `ANTHROPIC_API_KEY` na Vercel + Redeploy (hoje usa o botão "Copiar para o Claude.ai").
- [ ] **Perguntas para o suporte do WTS**: criar conta/empresa pela API, gerar token, criar painel/etapa, campos, chatbots, sequências, modelos, ler conteúdo de chatbots/sequências, botões dos modelos, conectar WhatsApp, alterar horário, criar carteira. Lista completa em `docs/AUTOATENDIMENTO.md`.

## 6. Decisões nossas

- [ ] Vários logins por empresa no portal (hoje: um e-mail por empresa; dá para criar outro acesso com o mesmo token).
- [ ] Botão "Redefinir senha" na tela Clientes (gera senha nova para o acesso do cliente). Oferecido, não construído.

## 7. Próximas funcionalidades (ideias já combinadas)

- [x] **Transbordo do rotativo** (16/10): troca de atendente quando ninguém assume em X horas (tela Rotativo). Para a cliente que pediu: gerar o fluxo Rotativo de novo em Fluxos do n8n, importar no lugar do atual, ativar, e ligar o transbordo na tela Rotativo com 3 horas.
- [x] Transbordo em minutos ou horas (mínimo 5 min) e peso por pessoa no rodízio (16/10). Fluxos gerados antes precisam ser gerados de novo.
- [x] Transbordo v3 (16/10): critério "o atendente respondeu" (funciona com distribuição automática), mínimo 1 min, tela avisa fluxo desatualizado. América Viagens: gerar o fluxo de novo e importar no lugar do atual.
- [x] Transbordo confirmado na América Viagens (16/10): troca em 1 min funcionou. Ajustar para o tempo definitivo.
- [ ] Transbordo: confirmar numa conta real o formato de `timezoneDiff` e `dayWeek` do horário de atendimento (o fluxo aceita horas ou minutos, e nomes em inglês ou 0–6).

- [x] **Montar minha IA** no portal (27/10): conversa com a Frédy (prompt do Coletor adaptado em `templates/ia-coletor.md`), teste do agente e "Finalizar e enviar para a equipe"; resultado em Clientes → "Ver IA". Precisa da chave da Anthropic (item 5).
- [ ] Montar minha IA: testar com a chave real e ajustar o prompt do coletor conforme as primeiras conversas (tom, perguntas, quando entrar no teste).
- [ ] Montar minha IA: gerar os fluxos do n8n direto da tela "Ver IA" com o token guardado do cliente (hoje a equipe cola o token na barra e usa "Gerar fluxo do n8n com este prompt").
- [ ] Fluxo de **aniversário** como fluxo padrão.
- [ ] **Painel completo da Marité** montado com um clique (já existe o modelo; falta mandar).
- [ ] Mais automações e fluxos do dia a dia como padrão.
- [ ] **Módulo 2 – motor de automações**: especificado e planejado, ainda não construído.

## Já feito (para referência)

Configurar tudo em passo a passo · Fluxos do n8n (agente + tools, mover card,
rotativo) · Rotativo sem planilha (lista no fluxo, liga/desliga pela página) ·
Montar prompt (Claude.ai) · Conferências com conteúdo completo e copiar ·
Arquivar cards · Importar contatos · Usuários com equipes · Chatbots padrão ·
Horário de atendimento · Portal do cliente (/cliente) e cadastro (/cadastro) com tela Clientes para a equipe ·
Criação automática da conta na Helena com planos (Padrão e Teste, um link por plano) · Cadastro preenchido pelo CNPJ ·
Montar minha IA no portal (conversa com a Frédy, teste do agente, resultado em Clientes → Ver IA) ·
Portal do cliente sem Rotativo, Chatbots padrão só com Copiar e Importar contatos limitado a 5.000 linhas por planilha (27/10).
