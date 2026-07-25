# Configuração do Combina Casa

Este guia separa o que você faz uma única vez do que fará no dia a dia.

## O que já está pronto

- O site e o visual.
- Três fichas de produto com fontes.
- Três artigos de referência.
- Validação de dados.
- Automação de preço preparada.
- Criação de rascunho com aprovação.

## Configuração única

### 1. Criar o repositório

1. Crie um repositório público no GitHub.
2. Envie todos os arquivos desta pasta.
3. Use `main` como a branch principal.

### 2. Conectar ao Cloudflare Pages

1. Entre no Cloudflare.
2. Abra **Workers & Pages** e escolha **Create application**.
3. Conecte o repositório do GitHub.
4. Em comando de build, informe `pnpm build`.
5. Em pasta de saída, informe `dist`.
6. Adicione a variável `SITE_URL` com o endereço definitivo do site.

Cada aprovação incorporada na branch `main` será publicada automaticamente.

### 3. Habilitar o botão “Criar rascunho”

Esta etapa exige uma assinatura Claude Pro, Max, Team ou Enterprise.

1. Instale o Claude Code no computador.
2. Abra o PowerShell e execute `claude setup-token`.
3. Entre na sua conta do Claude e copie o token exibido.
4. No GitHub, abra **Settings → Secrets and variables → Actions**.
5. Crie o secret `CLAUDE_CODE_OAUTH_TOKEN` e cole o token.
6. Em **Settings → Actions → General**, escolha **Read and write permissions** e
   marque **Allow GitHub Actions to create and approve pull requests**.

O token é secreto. Nunca o escreva em um arquivo do projeto.

### 4. Preços do Mercado Livre

Cada preço deve apontar para um anúncio específico. Por isso, os preços começam
vazios.

Quando os anúncios forem escolhidos:

1. Informe o ID `MLB...` no campo `mercadoLivreId` do produto.
2. Cadastre `ML_ACCESS_TOKEN` nos secrets do GitHub, se a API exigir.
3. Execute **Actions → Atualizar dados → Run workflow**.

Produto sem preço continua no ar, mas exibe “preço ainda não coletado”.

## Operação normal

### Pedir um artigo

1. Abra **Actions** no GitHub.
2. Escolha **Criar rascunho**.
3. Clique em **Run workflow**.
4. Informe a pergunta e o ID do produto.
5. Aguarde a criação de uma pull request.
6. Leia o texto e confira as fontes.
7. Se estiver correto, clique em **Merge pull request** e depois em
   **Confirm merge**.

Até a aprovação, o artigo permanece invisível. Depois da confirmação, a
automação troca o estado do texto e o Cloudflare publica a nova versão.

### Parar tudo

Crie na raiz do repositório um arquivo vazio chamado `PAUSE`. As automações
encerrarão antes de alterar dados.

Apague o arquivo somente quando quiser retomá-las.

## Regra de segurança

O site não fornece orientação de instalação elétrica, dimensionamento de carga,
chuveiros ou aparelhos de alta potência. Esses casos exigem fabricante e
profissional habilitado.
