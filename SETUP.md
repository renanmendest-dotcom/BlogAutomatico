# Configuração simples da Curva Viva

## O que já está pronto

- O site usa Astro e está ligado à Vercel.
- Os arquivos ficam guardados no GitHub.
- A IA tem regras para pesquisar, escrever e revisar.
- Você sempre aprova o artigo antes da publicação.

## O que você precisa configurar uma única vez

### 1. Endereço do site no GitHub

No repositório, abra `Settings`, depois `Secrets and variables`, `Actions` e
`Variables`. Crie:

- Nome: `SITE_URL`
- Valor: `https://blog-automatico-sigma.vercel.app`

Isso informa aos buscadores qual é o endereço oficial do site.

### 2. Acesso da IA no GitHub

No mesmo lugar, mas dentro de `Secrets`, cadastre:

- Nome: `CLAUDE_CODE_OAUTH_TOKEN`
- Valor: o código de acesso fornecido pelo Claude Code

Esse código permite que a IA prepare um rascunho. Ele nunca deve ser escrito
dentro dos arquivos do projeto.

### 3. Programa de afiliados

Faça o cadastro no programa de afiliados da loja escolhida. A prioridade inicial
é a Amazon. Depois da aprovação, coloque o seu link na ficha do produto.

O site nunca mostra um botão de compra enquanto não existir um link real.

## Como aprovar um artigo

1. A IA abre uma solicitação chamada `Revisar`.
2. Você lê o resumo e o artigo no GitHub.
3. Se estiver correto, clique em `Merge pull request`.
4. O site publica o texto automaticamente.
5. Se não gostar, feche a solicitação sem aprovar.

## Como pausar a automação

Crie um arquivo vazio chamado `PAUSE` na pasta principal do projeto. Para voltar
a funcionar, apague apenas esse arquivo.
