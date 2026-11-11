# Pendências do Setup da Conta (Frédy)

Lista única do que falta fazer, decidir ou mandar. Atualizada em 03/11/2026.
Quando algo for resolvido, risque aqui (ou peça para o Claude atualizar).

## 0. Portal do cliente (para funcionar na Vercel)

- [x] Banco no **Supabase** ligado (portal e cadastro gravando em produção).
- [x] Cadastro preenche razão social, nome fantasia, CNAE, telefone e endereço pelo CNPJ (Receita). Feito em 10/10, falta publicar.
- [x] Criação automática da conta: `HELENA_PARTNER_TOKEN` na Vercel. A Helena exige apps e limites: planos em `templates/planos.json` (Padrão = print da equipe; Teste = tudo liberado).
- [x] Trocar o Token de Parceiro: o suporte da Helena colou o token na conversa (07/out/2026). Gerar outro em Admin → Personalizar → Integração e atualizar `HELENA_PARTNER_TOKEN` na Vercel. **(01/11: decidido deixar assim)**
- [x] Criar os outros planos de venda em `templates/planos.json` (cada um ganha seu link de cadastro). **(01/11: os planos ficam na página do Eric)**
- [x] Testar o cadastro com um CNPJ da Frédy (ou autorizado) pelo link do plano Teste e conferir a conta criada (status ONBOARDING) no painel de parceiro. Atenção: a conta é criada de verdade na Helena. **(01/11: feito)**
- [x] Cadastro "Seu Mobile": clicar "Tentar de novo" em Clientes (a conta já existe, criada pelo suporte) e conferir o acesso ao portal; depois arquivar ou excluir, porque o CNPJ é de uma loja real. **(01/11: feito)**
- [x] (Opcional) `SIGNUP_WEBHOOK_URL`: fluxo do n8n que avisa a equipe no WhatsApp quando chega cadastro novo. **(01/11: feito)**
- [x] Colocar os links dos vídeos em `templates/guia.json` (campo "video" de cada passo) ou mandar para o Claude colocar.
- [x] Testar com um cliente real: mandar o link `/cadastro`, criar a conta no WTS, criar o acesso em Clientes e mandar o login. **(01/11: feito)**

## 0.1 Portal do cliente v2 (27/10)

- [x] Endereço `/portal` para o atalho na Frédy; landing do portal mais simples; "Abrir a Frédy" em destaque; passo a passo em vídeo (espaço pronto por passo).
- [x] Cadastro pré-preenchido pela página de pagamento (`?pre=ID`), usuários limitados pelo plano, cliente entra no portal já logado ao criar a conta.
- [x] Tela Clientes → "Contas da Helena": criar acesso ao portal para contas existentes (um por um ou todas).
- [x] **Eric**: combinar como a página dele chama a API (docs/INTEGRACAO-PAGAMENTO.md), gerar `PRE_SIGNUP_SECRET` na Vercel e passar por canal seguro; mapear produtos → `plan`. **(01/11: feito)**
- [x] **Vídeos**: gravar e colocar o link em cada passo de `templates/guia.json` (campo `video`); também `<chatbot>.video.txt` nos chatbots.
- [x] **Atalho na Frédy**: colocar `https://clonarfredy.vercel.app/portal` como atalho nas contas dos clientes (ou domínio próprio, se quiserem; aí definir `PUBLIC_URL`). **(01/11: feito)**
- [x] **Ativar para todos**: em Clientes → Contas da Helena, "Criar acesso para todas sem acesso" e mandar e-mail + senha para cada dono (as senhas só aparecem na hora). **(01/11: não: o acesso ao portal é criado quando a pessoa compra o pacote)**
- [x] Portal: ordem e textos dos passos (`templates/guia.json`) podem ser reorganizados quando os vídeos existirem. **(01/11: feito)**

## 1. Segurança (fazer logo)

- [x] **Trocar o token da Belini** no WTS (Ajustes → Integrações → API) e desativar o antigo: apareceu inteiro em prints na conversa. **(01/11: decidido deixar assim)**
- [x] **Trocar o token da América Viagens** no WTS (Ajustes → Integrações → API): o fluxo com o token foi colado na conversa (16/10). Depois gerar o fluxo Rotativo de novo com o token novo. **(01/11: decidido deixar assim)**
- [x] **Trocar o token da conta modelo** (`WTS_MODEL_TOKEN` na Vercel): também apareceu na conversa. **(01/11: decidido deixar assim)**
- [x] **Senha da página** (`APP_PASSWORD`): foi trocada para uma senha escrita na conversa; se quiser, use outra e passe para a equipe por outro canal. Depois de mudar na Vercel: Deployments → ⋯ → Redeploy. **(01/11: decidido deixar assim)**

## 2. Trocar a conta modelo para a Conta Exemplo

- [x] Colocar o token da Conta Exemplo em `WTS_MODEL_TOKEN` na Vercel + Redeploy. **(01/11: a conta modelo já é a Conta Exemplo)**
- [x] Informar como terminam as URLs dos webhooks da Conta Exemplo (o trecho que substitui `embarque22palmitos`, ex.: `contaexemplo`) para ajustar a página / `WEBHOOK_MODEL_SLUG`. **(01/11: a conta modelo já é a Conta Exemplo)**
- [x] Mandar os fluxos do n8n da Conta Exemplo (.json): Mover card, Agente de IA + tools, Rotativo. Os padrões atuais têm IDs da Embarque 22 Palmitos. **(01/11: a conta modelo já é a Conta Exemplo)**

## 3. Arquivos que faltam mandar

- [x] Fluxo **"Alteração em painel"** (.json do n8n) para virar fluxo padrão. **(01/11: fica sem por enquanto)**
- [x] Fluxo de **arquivar cards** que vocês usam hoje (.json): conferir se filtra por data de criação ou de atualização e como arquiva. **(01/11: feito)**
- [x] Chatbots padrão recebidos (10/10): Pergunta IA (atendimento); Resposta IA, Follow up 1, 2 e 3 dias, Checkin e Feedback (automação). Vídeos ligados (01/11).
- [x] Checkin e Feedback têm textos da Berg Viagens (nome, Instagram, link de avaliação no Google). A tela avisa para trocar; ver se vale deixar um texto neutro na versão padrão. **(01/11: textos neutros: "a nossa equipe", [LINK DO INSTAGRAM] e [LINK DE AVALIAÇÃO NO GOOGLE]; o portal avisa para trocar)**
- [x] Chatbot "Pergunta IA": a condição de entrada é "última mensagem = #teste-157" (parece sobra de teste). Confirmar se é isso mesmo ou mandar a versão de produção. **(01/11: fica como está)**
- [x] Follow-ups: os modelos "FollowUp Orçamento Após 1/2/3 dias" e as sequências "Follow 48 horas", "Follow 72 horas" e "Follow 7 dias" precisam existir na conta do cliente. Ver se entram no passo a passo. **(01/11: corretos)**
- [x] Outros modelos de mensagem com **botões fixos** (além de checkin e feedback): nome do modelo + botões. **(01/11: os botões são colocados na hora)**
- [x] **Links dos vídeos** explicativos e em qual tela cada um entra.

## 4. Testar com contas reais

- [x] Fluxos do n8n: importar e ativar (Mover card, Agente de IA, Rotativo). **(01/11: testado)**
- [x] "Criar no n8n": conferir `N8N_BASE_URL` e `N8N_API_KEY` na Vercel + Redeploy (o botão só aparece com as duas). **(01/11: testado)**
- [x] Arquivar cards (começar por uma coluna pequena). **(01/11: testado)**
- [x] Importar contatos (planilha pequena primeiro). **(01/11: testado)**
- [x] Usuários já entrando nas equipes. **(01/11: testado)**
- [x] Conferências: botões dos modelos (abrir "Dados da API" se não aparecerem) e horário de atendimento. **(01/11: testado)**
- [x] Conta onde foram criadas 5 equipes "Rotativo" pela versão antiga: ver se aparecem em algum lugar; se sim, montar limpeza. **(01/11: testado)**

## 5. Esperando algo de fora

- [x] **Chave e créditos na API da Anthropic** para o "Montar prompt" automático e para o **"Montar minha IA" do portal** (sem a chave, o cliente vê o aviso "a IA ainda não está ligada"): criar a chave em console.anthropic.com, colocar `ANTHROPIC_API_KEY` na Vercel + Redeploy (hoje usa o botão "Copiar para o Claude.ai").
- [ ] **Perguntas para o suporte do WTS**: criar conta/empresa pela API, gerar token, criar painel/etapa, campos, chatbots, sequências, modelos, ler conteúdo de chatbots/sequências, botões dos modelos, conectar WhatsApp, alterar horário, criar carteira. Lista completa em `docs/AUTOATENDIMENTO.md`.

## 6. Decisões nossas

- [x] Vários logins por empresa no portal (hoje: um e-mail por empresa; dá para criar outro acesso com o mesmo token). **(01/11: a equipe cria o acesso de cada pessoa)**
- [x] Botão "Redefinir senha" na tela Clientes (gera senha nova para o acesso do cliente). Oferecido, não construído. **(01/11: a equipe cria o acesso de cada pessoa)**

## 7. Próximas funcionalidades (ideias já combinadas)

- [x] **Transbordo do rotativo** (16/10): troca de atendente quando ninguém assume em X horas (tela Rotativo). Para a cliente que pediu: gerar o fluxo Rotativo de novo em Fluxos do n8n, importar no lugar do atual, ativar, e ligar o transbordo na tela Rotativo com 3 horas.
- [x] Transbordo em minutos ou horas (mínimo 5 min) e peso por pessoa no rodízio (16/10). Fluxos gerados antes precisam ser gerados de novo.
- [x] Transbordo v3 (16/10): critério "o atendente respondeu" (funciona com distribuição automática), mínimo 1 min, tela avisa fluxo desatualizado. América Viagens: gerar o fluxo de novo e importar no lugar do atual.
- [x] Transbordo confirmado na América Viagens (16/10): troca em 1 min funcionou. Ajustar para o tempo definitivo.
- [x] Transbordo: confirmar numa conta real o formato de `timezoneDiff` e `dayWeek` do horário de atendimento (o fluxo aceita horas ou minutos, e nomes em inglês ou 0–6). **(01/11: testado)**

- [x] **Montar minha IA** no portal (27/10): conversa com a Frédy (prompt do Coletor adaptado em `templates/ia-coletor.md`), teste do agente e "Finalizar e enviar para a equipe"; resultado em Clientes → "Ver IA". Precisa da chave da Anthropic (item 5).
- [x] Montar minha IA: testar com a chave real e ajustar o prompt do coletor conforme as primeiras conversas (tom, perguntas, quando entrar no teste). **(01/11: testado)**
- [x] Montar minha IA: gerar os fluxos do n8n direto da tela "Ver IA" com o token guardado do cliente (hoje a equipe cola o token na barra e usa "Gerar fluxo do n8n com este prompt"). **(01/11: feito, falta testar com uma IA finalizada)**
- [ ] Fluxo de **aniversário** como fluxo padrão. **(para depois)**
- [ ] **Painel completo da Marité** montado com um clique (já existe o modelo; falta mandar). **(para depois)**
- [ ] Mais automações e fluxos do dia a dia como padrão.
- [ ] **Módulo 2 – motor de automações**: especificado e planejado, ainda não construído. Uma tela onde a equipe monta automações sem n8n: escolhe um acontecimento no WTS (gatilho: conversa nova, mensagem recebida, card mudou de etapa, etiqueta, pagamento...), filtros (canal, painel, etapa, etiqueta) e uma lista de ações (etiquetar, criar/mover card, mandar mensagem ou modelo, iniciar sequência, transferir, chamar webhook), tudo pela API do WTS. **(para depois)**

## 8. Duda (mesma página com a identidade da Duda) — 03/11

No ar desde 03/11: `/duda/portal` (cliente), `/duda` (equipe, mesma senha) e `/duda/cadastro`. Laranja + grafite, logo e nome da Duda, botão para `duda.wts.chat`. Clientes, cadastros e logins separados por marca; a Frédy continua igual. Arquivos da Duda em `templates/duda/` (o que faltar lá vem do padrão da Frédy só no coletor da IA e no prompt padrão).

Vídeos da Duda (editar os da Frédy em vez de gravar tudo):
- [x] Gravação: sistema na Conta Exemplo da Frédy com o logo da Duda por cima (decisão de 11/11: não há conta teste da Duda; o login da Duda só tem contas reais de clientes); portal no acesso de teste "TESTE Claude" em `/duda/portal`. Arquivos em `C:/dev/videos-tutoriais/duda` (src, com-voz, FINAIS).
- [x] Voz: Régis também na Duda (11/11).
- [x] Partes no sistema: logo trocado, legendas com "Frédy" redesenhadas e narração com "Duda" (equipe, etiquetas, horário, geral, WhatsApp, follows, Pergunta/Resposta IA).
- [x] Partes no portal: todas gravadas em `/duda/portal` (equipe, etiquetas e horário só com a abertura do passo, porque os blocos comparam com a conta modelo da Duda).
- [x] Gravados do zero (12/11): IA + painéis + mensagens (regravado sem colunas Ganho/Perdido), Painéis e Modelos (sistema na Conta exemplo com logo da Duda; o modelo não foi salvo).
- [ ] Ficam de fora (são de agência): campos "data de ida/retorno", Checkin e Feedback.
- [ ] YouTube (canal rZ, não listado): 12 de 13 no ar e ligados no guia/chatbots. Falta **11. Horário**: o canal bateu o limite diário de envios (ficou um rascunho "Duda | 11. Horário de atendimento"); terminar depois de 24 h ou da verificação do canal e pôr o link no passo `horario` de `templates/duda/guia.json`. O vídeo antigo da IA (oOnjtN67TGw) fica no canal (decisão de 12/11).
- [ ] Conta exemplo da Frédy: excluir os 3 painéis de teste "Funil de Vendas" (chave FV) criados nas gravações (a exclusão automática foi bloqueada; fazer à mão em CRM → Painéis → engrenagem → Excluir).

Configuração da Duda:
- [x] Conta modelo da Duda (12/11): "Conta Exemplo" na Duda (companyId 11112f52…), token em `WTS_MODEL_TOKEN_DUDA` na Vercel. Já tem: etiquetas (Oportunidade, Em atendimento, Proposta enviada, Em negociação, Venda, Venda perdida, Pendente, Cliente, Lead frio, Follow 24h/48h/72h/7d, Não respondeu follow, Sucesso, Falha, com cores), equipes (Geral, Comercial, Pós-venda) e painéis (Funil de Vendas: Novo contato → Em atendimento → Proposta enviada → Em negociação; Pós-venda: Em andamento → Retorno → Concluído).
- [x] Conta Exemplo da Duda (12/11): chatbots, sequências, modelos e horário **não entram** (decisão do usuário: o cliente cria os chatbots e sequências seguindo os vídeos; horário fica sem). Webhook "Alteração de painel" copiado do modelo da Frédy (mesma URL; o bloco Webhooks troca pelo identificador de cada cliente).
- [x] n8n da Duda: os mesmos fluxos da Frédy (templates/n8n serve às duas marcas).
- [x] Planos da Duda (12/11): os mesmos da Frédy (`templates/duda/planos.json`). Entrada só pelo plug and play do site, nas duas marcas (pré-cadastro com `"brand": "duda"`). `HELENA_PARTNER_TOKEN_DUDA` na Vercel e página de pagamento ligada (12/11): criação automática conferida e compra de teste funcionando nas duas marcas.
- [x] Painéis e mensagens do nicho pela IA (11/11): na Duda, a "Montar minha IA" também monta com o cliente os painéis do CRM (colunas) e escreve os 4 follows no nicho dele (`templates/duda/nicho.json` + `templates/duda/ia-coletor.md`); no fim aparecem para o cliente e em Clientes → Ver IA. A API do WTS não cria painéis nem modelos de mensagem: a equipe cria os painéis e o cliente cola as mensagens. Chatbots, sequências e etiquetas continuam os padrões.
- [x] Prompt padrão genérico da Duda (12/11): `templates/duda/prompt-padrao.md` (studio de pilates fictício, mesmo formato e cabeçalho do n8n da Frédy).
- [ ] (Opcional) `DUDA_APP_URL` na Vercel se o endereço do sistema não for `https://duda.wts.chat/`.

## Já feito (para referência)

Vídeos tutoriais de todos os passos (01/11): 14 vídeos com voz e música no YouTube (não listados), ligados no guia e nos chatbots padrão ·
Configurar tudo em passo a passo · Fluxos do n8n (agente + tools, mover card,
rotativo) · Rotativo sem planilha (lista no fluxo, liga/desliga pela página) ·
Montar prompt (Claude.ai) · Conferências com conteúdo completo e copiar ·
Arquivar cards · Importar contatos · Usuários com equipes · Chatbots padrão ·
Horário de atendimento · Portal do cliente (/cliente) e cadastro (/cadastro) com tela Clientes para a equipe ·
Criação automática da conta na Helena com planos (Padrão e Teste, um link por plano) · Cadastro preenchido pelo CNPJ ·
Montar minha IA no portal (conversa com a Frédy, teste do agente, resultado em Clientes → Ver IA) ·
Portal do cliente sem Rotativo, Chatbots padrão só com Copiar e Importar contatos limitado a 5.000 linhas por planilha (27/10).
