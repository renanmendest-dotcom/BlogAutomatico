# SETUP.md

Passos que só um humano faz. Cada um é executado uma vez.

A ordem importa: os passos 1 a 4 põem o site no ar e são o que fecha a Fase A. Os
passos 5 e 6 são pré-requisito da Fase B. Os passos 7 e 8 só depois de a Fase D
estar rodando.

## O que já está pronto

O repositório já contém o site Astro, o layout, o chip de compatibilidade, os
schemas JSON-LD validados, o workflow de CI e três artigos de referência de
formato. Para rodar localmente:

```bash
npm install
```

```bash
npm run dev
```

Antes de qualquer commit:

```bash
npm run validar
```

---

## 1. Domínio

Registrar um `.com.br`. Sugestões ainda em aberto: `casaconectada.com.br`,
`combinacasa.com.br`, `ligadoemcasa.com.br`. O Registro.br é o mais barato para
`.com.br` e é o registrador oficial — outros revendem em cima dele.

Este é o único custo fixo aceito no projeto.

**Depois de registrar:** abra [`src/consts.ts`](src/consts.ts) e troque
`SITE.url` pelo domínio real, sem barra no final. Troque também `SITE.email` por
um endereço que você lê — ele aparece na página `/como-fazemos` e no schema
`Organization` como canal de correção, e precisa funcionar de verdade.

`SITE.url` é a única fonte da verdade: canonical, sitemap, robots.txt e todos os
schemas leem de lá. Não há outro lugar para trocar.

## 2. Repositório GitHub público

Público porque minutos de GitHub Actions são gratuitos assim. O repositório já
existe; confirme em *Settings → General* que a visibilidade é **Public**.

O código ser público também é parte da proposta editorial: `/como-fazemos` diz
que o histórico de correções fica no repositório do site.

## 3. Token do Claude Code

Necessário só a partir da Fase C, mas dá para deixar pronto.

```bash
claude setup-token
```

Salve o resultado em *Settings → Secrets and variables → Actions → New
repository secret*, com o nome `CLAUDE_CODE_OAUTH_TOKEN`.

**Atenção:** esse token consome a mesma cota da assinatura que você usa
interativamente. Se o pipeline começar a atrapalhar o uso normal, **reduza a
frequência dos crons antes de qualquer outra coisa** — antes de trocar de modelo,
antes de cortar escopo.

## 4. Cloudflare Pages

É o passo que põe o site no ar. Em *Workers & Pages → Create → Pages → Connect
to Git*, escolha este repositório e configure:

| Campo | Valor |
| :---- | :---- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Node version | variável de ambiente `NODE_VERSION` = `24` |

A partir daí, todo push na `main` dispara build e deploy automáticos. O workflow
`deploy.yml` do GitHub Actions roda em paralelo como portão de qualidade: ele não
publica nada, mas marca o commit como quebrado se a checagem de tipos, o build ou
a validação de JSON-LD falharem.

**Domínio.** Em *Custom domains*, adicione o domínio registrado no passo 1 e siga
as instruções de DNS. Se o domínio estiver no Registro.br, aponte os
nameservers para o Cloudflare — é mais simples que manter registros CNAME lá.

**Web Analytics.** Em *Analytics & Logs → Web Analytics*, adicione o site e copie
o token. Gratuito, sem cookie e sem banner de consentimento. Cadastre o token em
*Settings → Environment variables* do projeto Pages, como
`PUBLIC_CF_ANALYTICS_TOKEN`. Sem essa variável, nenhum script de analytics é
carregado — o site não faz uma requisição externa sequer.

## 5. Aplicação no Mercado Livre — BLOQUEANTE

**Verificado em 25/07/2026: a API do Mercado Livre não responde mais sem
autenticação.** Nem a busca, nem o endpoint básico `/sites/MLB`. Todos devolvem
HTTP 403 com `PA_UNAUTHORIZED_RESULT_FROM_POLICIES`. Não existe caminho grátis
sem credencial.

Consequência prática: **enquanto este passo não for feito, o site não tem preço
nenhum.** Sem preço não há `Product`/`Offer` no schema, e a trava de dado impede
publicação automática de artigo. O pipeline continua rodando e o site continua no
ar — mas parado no conteúdo que já existe.

O que fazer:

1. Entre em `developers.mercadolivre.com.br` com sua conta do Mercado Livre.
2. Crie uma aplicação. Não precisa ser vendedor — a aplicação é de leitura.
3. Anote o **Client ID** e o **Client Secret**.
4. No GitHub, em *Settings → Secrets and variables → Actions*, crie dois secrets:
   `ML_CLIENT_ID` e `ML_CLIENT_SECRET`.

Para conferir se funcionou, rode localmente:

```bash
npm run coletar:ml:diagnostico
```

Ele imprime o estado da autenticação em uma linha. Também dá para rodar pelo
GitHub, no workflow `coletar`, marcando a opção de diagnóstico.

O coletor usa o fluxo `client_credentials` e renova o token sozinho. Se a API
falhar, ele registra o erro, mantém o último dado bom e não derruba o pipeline.

## 6. Google Search Console

Adicione a propriedade de domínio e verifique pelo registro DNS TXT (mais
simples, já que o DNS estará no Cloudflare). Depois envie o sitemap:

```
https://SEU-DOMINIO/sitemap-index.xml
```

O `robots.txt` já aponta para ele e é gerado automaticamente pelo build.

## 7. Programa de afiliados do Mercado Livre

**Faça depois de uns 18 artigos publicados**, em
`mercadolivre.com.br/l/afiliados-home`. Canal sem conteúdo é motivo comum de
recusa. Declare o blog como canal e "casa inteligente" como nicho.

## 8. Links de afiliado

Popule `data/links-afiliado.json` com o mapa `id do produto → URL de afiliado`,
gerado no painel do ML, em lotes de 20 a 30 produtos — o que dá conta de meses de
conteúdo.

Produto sem link de afiliado mapeado é citado com o permalink normal, nunca
omitido: a utilidade do artigo vem antes da comissão. O site já se comporta assim.

---

## Depois do deploy: validar os schemas no Google

O `npm run validar` checa o JSON-LD localmente, mas o Rich Results Test precisa
de URL pública. Assim que o site estiver no ar, teste em
`search.google.com/test/rich-results` pelo menos:

- a home
- `/compatibilidade`
- um post

Esperado: `Article`, `FAQPage` e `BreadcrumbList` reconhecidos, sem erro.
`Product` só aparece depois que a Fase B popular `produtos.json` com preço — sem
preço coletado, o nó não é emitido de propósito.

## Como pausar tudo

Crie um arquivo chamado `PAUSE` na raiz do repositório, com um motivo dentro.
Dá para fazer pelo celular, na interface web do GitHub: *Add file → Create new
file*, nome `PAUSE`, escreve o motivo, commit.

Todo workflow checa esse arquivo no primeiro passo e aborta. Para retomar, apague
o arquivo.
