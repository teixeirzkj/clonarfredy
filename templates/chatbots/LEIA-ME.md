# Chatbots padrão

Um arquivo `.json` por chatbot, com o texto copiado do editor de chatbot do WTS
(selecionar tudo → copiar). O texto vem no formato
`##CHATBOT_ADVANCED{...}##CHATBOT_ADVANCED`: guarde exatamente assim, porque é
o único formato que o editor do WTS aceita colar.

Pastas (o WTS cria cada tipo em um lugar diferente):

- `atendimento/` → Chatbots de atendimento
- `automacao/` → Chatbots de automação

O nome do arquivo vira o nome na tela: `follow-up-1-dia.json` → "Follow up 1 dia".

A tela **Chatbots padrão** lista os arquivos com botão para copiar (não tem baixar: é colar direto no WTS),
mostra o tipo e a lista "Depois de colar, confira": webhooks, modelos de
mensagem, sequências, etiquetas, cards e transferências que o chatbot usa.
Esses itens vêm com o ID da conta de origem e precisam ser escolhidos de novo
na conta do cliente.

Opcional: para mostrar um vídeo explicando aquele chatbot, crie na mesma pasta
um arquivo `<mesmo nome>.video.txt` com o link do vídeo (YouTube, Loom, Drive).

Chatbots atuais (10/10/2026):

| Arquivo | Tipo | O que faz |
|---|---|---|
| `atendimento/pergunta-ia.json` | Atendimento | Cria card, avisa "I.A ativada", junta as mensagens e chama o webhook da IA; marca etiqueta no sucesso ou no erro |
| `automacao/resposta-ia.json` | Automação | Junta as mensagens e chama o webhook da IA; marca etiqueta no sucesso ou no erro |
| `automacao/follow-up-1-dia.json` | Automação | Marca etiqueta, manda o modelo "FollowUp Orçamento Após 1 dia"; sem resposta em 2 h entra na sequência "Follow 48 horas" |
| `automacao/follow-up-2-dias.json` | Automação | Troca a etiqueta, manda "FollowUp Orçamento Após 2 dias"; sem resposta em 12 h entra em "Follow 72 horas" |
| `automacao/follow-up-3-dias.json` | Automação | Troca a etiqueta, manda "FollowUp Orçamento Após 3 dias"; sem resposta em 12 h entra em "Follow 7 dias" |
| `automacao/checkin.json` | Automação | Manda o modelo "checkin" (botões Preciso de ajuda / Está tudo certo): ajuda → avisa que a equipe segue; tudo certo → deseja boa viagem e encerra |
| `automacao/feedback.json` | Automação | Manda o modelo "feedback" (Sim / Não): Sim → pede detalhes e link de avaliação; Não → pede o que houve; sem resposta válida → transfere para a equipe |
