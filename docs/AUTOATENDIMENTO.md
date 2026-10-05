# Autoatendimento do cliente — o que dá e o que não dá

Ideia: o cliente recebe uma página, faz o cadastro, cria a conta no WTS como
conta de implantação e configura sozinho pelo sistema (copiar o padrão, criar
painel, ver vídeos, conectar o WhatsApp, colar os chatbots).

Conferido na documentação pública da API do WTS (109 endpoints, out/2026).

## Já existe na página

| Item | Como |
|---|---|
| Etiquetas, equipes, webhooks, usuários | Copia da conta modelo, com prévia (`POST /core/v1/tag`, `/department`, `/webhook/subscription`, `/agent`) |
| Usuários já nas equipes | Ao criar o usuário, marca as equipes (`PUT /core/v1/department/{id}/agents`) |
| Importar contatos | Planilha CSV → `POST /core/v2/contact/batch` (até 100 por vez, atualiza quem já existe), com etiquetas, campos e sequência |
| Arquivar cards | Coluna + período → `PUT /crm/v3/panel/card/{id}` com status `ARCHIVED` |
| Rotativo | Lista no fluxo do n8n, liga/desliga pela página |
| Chatbots padrão | Biblioteca de JSON para copiar e colar no WTS (pasta `templates/chatbots`) |
| Conferências | Modelos de mensagem, painéis/etapas, chatbots, sequências, campos e horário de atendimento (modelo × cliente) |

## Dá para fazer (próximos passos, dependem de decisão nossa)

1. **Acesso do cliente (perfil cliente × admin)**: login por cliente, só com as
   telas liberadas (ex.: Rotativo, Importar contatos, Chatbots padrão, vídeos).
   Fluxos do n8n e prompt da IA ficam só para a equipe.
   - Decidir: como o cliente entra (link + senha por cliente? e-mail?), quais
     telas ele vê e onde ficam os vídeos (links do YouTube/Loom/Drive).
   - Precisa guardar os clientes em algum lugar (hoje a página não tem banco
     de dados; dá para usar o banco da própria Vercel).
2. **Página de cadastro do cliente** (CNPJ, nome, apelido/usuário, e-mail,
   endereço): dá para montar o formulário e mandar os dados para a equipe
   (n8n, e-mail ou planilha). **Não** dá para criar a conta no WTS por ela
   (ver abaixo). Senha: não recolher pelo formulário; o WTS manda o convite.
3. **Vídeos explicativos** em cada tela: só precisamos dos links.

## Não dá pela API pública (perguntar ao suporte do WTS)

| O que queremos | Situação na API pública | Pergunta para o suporte |
|---|---|---|
| Criar a conta/empresa do cliente (CNPJ, endereço, conta de implantação) | Não existe endpoint de empresa (só `GET /core/v1/company/officehours`) | Existe API de parceiro/revenda para criar contas? Ou outra forma de automatizar? |
| Gerar o token da API da conta nova | Não existe | Dá para gerar o token ao criar a conta, ou só pelo painel? |
| Criar painéis e etapas | Só listar (`GET /crm/v2/panel`) | Há endpoint para criar painel/etapa, ou importar/duplicar painel de outra conta? |
| Criar campos personalizados (contato e painel) | Só listar | Há endpoint para criar campos? |
| Criar chatbots | Só listar e disparar | O editor aceita importar JSON? Há endpoint para criar/importar? |
| Criar sequências | Só listar e incluir contatos | Há endpoint para criar sequência e as mensagens dela? |
| Criar modelos de mensagem (templates) | Só listar | Há endpoint para criar/enviar para aprovação? |
| Ler o conteúdo de chatbots e sequências | Não vem na listagem | Há endpoint de detalhe com os passos? |
| Botões dos modelos de mensagem | Não descritos na resposta | Em que campo vêm os botões do template? |
| Conectar o WhatsApp (canal) | Só listar canais | Há como gerar o QR code / conectar pela API? |
| Horário de atendimento | Só ler | Há endpoint para alterar? |
| Carteiras | Só listar e incluir contatos | Há endpoint para criar carteira? |
