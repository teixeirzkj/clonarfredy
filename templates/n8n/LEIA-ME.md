# Fluxos padrão do n8n

Coloque aqui os fluxos padrão exportados do n8n (`.json`), do jeito que estão
na conta modelo. A página encontra sozinha os IDs da conta modelo dentro do
fluxo (painel, etapas, campos, bot key, etiquetas, equipes...) e troca pelos
da conta do cliente.

Antes de colocar um arquivo aqui:
- Use credenciais do n8n no lugar de token escrito direto nos nós.
- Para o agente de IA: use um nó "AI Agent" (o prompt vai no System Message)
  ou escreva `{{PROMPT_CLIENTE}}` onde o prompt deve entrar.
