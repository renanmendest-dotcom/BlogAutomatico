# Configuração simples do Combina Casa

O sistema pesquisa uma oportunidade por semana e mantém somente um artigo
esperando aprovação.

## O que já está pronto

- Site, páginas de produto e artigos.
- Pesquisa automática de dúvidas na internet.
- Pesquisa de produto, fabricante e anúncio candidato.
- Redação com fontes e perguntas frequentes.
- Bloqueio de travessão, pressão comercial e orientação elétrica.
- Aprovação humana antes da publicação.
- Publicação automática pelo GitHub e pelo Vercel.
- Espaço seguro para links de afiliado autorizados.

## Configuração feita uma única vez

### 1. Confirmar o GitHub

O repositório deve conter as pastas `.github`, `scripts` e `src`. A branch
principal deve se chamar `main`.

### 2. Conectar ao Vercel

1. No Vercel, clique em **Add New** e depois em **Project**.
2. Importe o repositório do GitHub.
3. Confirme o framework **Astro**.
4. Clique em **Deploy**.
5. Copie o endereço criado pelo Vercel.
6. No Vercel e no GitHub, cadastre `SITE_URL` com esse endereço.

Cada alteração aprovada na branch `main` será publicada automaticamente.

### 3. Habilitar a inteligência artificial

Esta etapa exige uma assinatura Claude Pro, Max, Team ou Enterprise.

1. Instale o Claude Code.
2. Gere um token com `claude setup-token`.
3. No GitHub, abra **Settings**, **Secrets and variables** e **Actions**.
4. Crie o secret `CLAUDE_CODE_OAUTH_TOKEN` e cole o token.
5. Em **Settings**, **Actions** e **General**, escolha **Read and write
   permissions**.
6. Marque **Allow GitHub Actions to create and approve pull requests**.

O token é secreto e nunca deve ser enviado por mensagem ou salvo no projeto.

## Funcionamento semanal

Toda segunda-feira pela manhã:

1. A IA procura dúvidas e oportunidades na internet.
2. Confere se o assunto ainda não existe no site.
3. Identifica o produto exato.
4. Consulta fabricante e outras fontes técnicas.
5. Localiza um anúncio candidato.
6. Escreve e confere um único artigo.
7. Abre uma solicitação no GitHub para sua aprovação.

Se já existir um artigo esperando sua decisão, a automação não cria outro.

## Sua decisão

Abra **Pull requests** no GitHub e escolha o artigo.

- **Merge pull request** aprova e publica.
- **Close pull request** descarta.
- Um comentário pode registrar o que precisa ser corrigido.

Até a aprovação, o artigo permanece invisível.

## Links de afiliado

A IA encontra o anúncio candidato, mas não pode transformar um link comum em
link de afiliado.

1. Abra o anúncio sugerido.
2. Gere o link na Central ou na Barra de Afiliados.
3. Envie o link autorizado para inclusão no produto.

O site marca links comerciais e informa a possibilidade de comissão.

## Parar a automação

Crie na raiz do repositório um arquivo chamado `PAUSE`. As automações encerrarão
sem pesquisar ou alterar dados.

Apague o arquivo quando quiser retomar.

## Regra de segurança

Uma afirmação sem fonte vira `Não verificado`. O site não produz orientação de
instalação elétrica ou dimensionamento de carga.
