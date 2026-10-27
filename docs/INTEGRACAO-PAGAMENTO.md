# Integração com a página de pagamento (pré-cadastro)

Depois que o cliente escolhe o plano e o pagamento é confirmado na página de pagamento,
ela chama esta API, recebe um **link de cadastro já preenchido** e manda o cliente para
ele. O cliente confere os dados, cria a senha do portal, completa os usuários (limitados
pelo plano pago) e a conta é criada. No fim, ele cai no portal do cliente já logado, com
o botão da Frédy e o passo a passo em vídeo.

## Chamada

`POST https://clonarfredy.vercel.app/api/portal` com JSON:

```json
{
  "action": "preSignup",
  "secret": "<PRE_SIGNUP_SECRET>",
  "data": {
    "plan": "padrao",
    "cnpj": "12.345.678/0001-90",
    "company": { "legalName": "Clínica Exemplo LTDA", "tradeName": "Clínica Exemplo", "segment": "Clínica", "phone": "4733330000", "site": "www.exemplo.com.br" },
    "address": { "cep": "01001000", "street": "Praça da Sé", "number": "100", "complement": "Sala 2", "district": "Sé", "city": "São Paulo", "uf": "SP" },
    "owner": { "name": "Maria Souza", "email": "maria@exemplo.com.br", "phone": "47999990000" },
    "users": [
      { "name": "Maria Souza", "nickname": "Maria", "email": "maria@exemplo.com.br", "phone": "47999990000", "profile": "Admin" },
      { "name": "Ana Lima", "nickname": "Ana", "email": "ana@exemplo.com.br", "profile": "Agent" }
    ],
    "usersCount": 2,
    "order": { "id": "PED-123", "product": "Plano Padrão mensal", "amount": 297 }
  }
}
```

- A chave também pode ir no header `X-Integracao` em vez de `secret`. Ela fica na
  variável `PRE_SIGNUP_SECRET` da Vercel; combinar o valor com a equipe Frédy.
- Só `plan` é obrigatório: é o `id` de um plano em `templates/planos.json` (hoje `padrao`
  e `teste`). Tudo o mais é opcional e só preenche a tela; o cliente pode corrigir.
- Os nomes dos campos também podem vir em português: `plano`, `empresa` (`razaoSocial`,
  `nomeFantasia`, `segmento`, `telefone`), `endereco` (`rua`, `numero`, `complemento`,
  `bairro`, `cidade`, `uf`), `responsavel` (`nome`, `email`, `telefone`), `usuarios`
  (quantidade), `pedido`, `produto`, `valor`.
- `profile`: `Admin` ou `Agent` (atendente).

## Resposta

```json
{ "ok": true, "id": "k3Jf9...", "url": "https://clonarfredy.vercel.app/cadastro?pre=k3Jf9...", "expiresAt": "2026-11-03T12:00:00.000Z", "plan": "padrao", "maxUsers": 3 }
```

Mande o cliente para `url` (redirecionamento ou botão "Continuar o cadastro"). O link vale
por **7 dias** e só **uma vez**. Erros: `401` chave errada, `400` plano inválido.

## O que acontece na tela

- Tudo que veio no pedido já aparece preenchido; o CNPJ ainda consulta a Receita para
  completar o que faltar (endereço, CNAE).
- O plano fica travado e o número de usuários é limitado pelo plano (`config.agents` em
  `templates/planos.json`). O servidor também recusa cadastros acima do limite.
- A conta é criada na Helena com o plano do pedido; o cadastro guarda `order` (id,
  produto, valor) para a equipe ver na tela Clientes.

## Teste rápido (curl)

```bash
curl -X POST https://clonarfredy.vercel.app/api/portal \
  -H "Content-Type: application/json" \
  -d '{"action":"preSignup","secret":"<PRE_SIGNUP_SECRET>","data":{"plan":"teste","owner":{"name":"Teste","email":"teste@exemplo.com"},"usersCount":2,"order":{"id":"TESTE-1","product":"Plano Teste"}}}'
```

## Pendências para fechar com o Eric

- Qual plataforma faz o pagamento e se ela consegue chamar uma API depois da confirmação
  (chamada direta do servidor dele, ou webhook da plataforma de pagamento). Se só der para
  configurar um "redirecionar depois do pagamento" sem chamada de API, a gente adapta.
- Lista dos produtos dele e qual `plan` corresponde a cada um.
- Valor da chave `PRE_SIGNUP_SECRET` (gerar e colocar na Vercel; passar para ele por canal
  seguro, não por chat).
