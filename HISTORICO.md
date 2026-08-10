# Histórico do projeto

Registro do que já foi feito e decidido na Curva Viva. Existe para que o
proprietário não precise reexplicar o projeto a cada conversa.

## Como usar este arquivo

**Se você é uma IA começando uma conversa:** leia este arquivo antes de mexer em
qualquer coisa. Ele conta o estado atual e o porquê das decisões. Depois leia
`PAPEIS.md` para saber o que é da sua área.

**Ao terminar um trabalho:** acrescente uma entrada no topo da lista, com data,
quem fez, o que mudou e por quê. Entrada curta, em linguagem simples. Se uma
decisão foi tomada na conversa, registre também: é isso que evita a pergunta se
repetir.

Registrar **por que** importa mais do que registrar o que. O `git log` já conta
o que mudou.

---

## Estado atual em 10 de agosto de 2026

| | |
|---|---|
| Endereço | `https://www.curvaviva.com.br` (o sem `www` redireciona para o `www`) |
| Endereço antigo | `blog-automatico-sigma.vercel.app`, ainda responde |
| Artigos publicados | 9 |
| Artigos na fila privada | 22 |
| Produtos públicos | 12 (16 cadastros no total) |
| Hospedagem | Vercel, publicação automática a partir da `main` |
| Design | Claude Code |
| Conteúdo | Codex |

**O gargalo hoje é volume de conteúdo.** 9 artigos contra centenas dos
concorrentes. Nenhum ajuste técnico compensa isso.

---

## Decisões que já estão tomadas

Não precisam ser rediscutidas, salvo se o proprietário mudar de ideia.

- **Divisão de trabalho.** Claude Code cuida de design, componentes,
  acessibilidade, desempenho, navegação e SEO técnico. Codex cuida de artigos,
  produtos, preços e imagens de conteúdo. Detalhes em `PAPEIS.md`.
- **A regra "não usar Claude neste projeto" foi revogada** pelo proprietário em
  7 de agosto de 2026.
- **Honestidade epistêmica é o principal ativo do projeto.** O site nunca
  declara ter testado o que não testou, e todo guia mostra as fontes com link e
  data. Nenhum concorrente do nicho faz isso. Não trocar isso por linguagem
  vendedora.
- **Movimento na interface é mínimo de propósito.** Existe uma única animação
  automática no site (a entrada dos três retratos no topo da home). Em blog, o
  trabalho é ler; movimento decorativo atrapalha e piora Core Web Vitals.
- **Newsletter não é prioridade agora.**
- **Rastreadores de IA são liberados de propósito** no `robots.txt`. Um dos
  objetivos é ser citado como fonte por ChatGPT, Claude, Perplexity e Gemini.
- **Mercado Livre só pelo Chrome do proprietário.** Pesquisa de oferta, acesso
  à conta de afiliado e geração de link `meli.la` usam exclusivamente o Chrome
  já autenticado. O navegador interno do Codex não deve acessar essa conta.
- **Imagem de artigo precisa funcionar para a leitora.** Em rankings, usar
  embalagens reais em vez de produtos genéricos desenhados. Infográficos levam
  título, rótulos e conclusão prática; arte confusa ou com aparência evidente
  de IA é reprovada mesmo quando cumpre tamanho e paleta.
- **Vocabulário do nicho nunca é conhecimento presumido.** Termos como
  `day after`, `fitagem`, `dedoliss`, `co-wash`, `leave-in`, `finalização` e
  `fixação` são explicados na primeira ocorrência. Códigos como `3C` e `4A`
  aparecem apenas quando a marca os usa, sempre acompanhados de `cacheado` ou
  `crespo` e tratados como classificação comercial, não regra universal.

---

## O que está em aberto

- **Só um artigo em formato ranking foi publicado.** O formato estreou em 10 de
  agosto, mas os outros 11 rankings da fila ainda precisam ser promovidos para
  reduzir a lacuna de tráfego comercial.
- **Preço e oferta ainda não cobrem todos os produtos públicos.** 7 das 12
  fichas públicas têm preço e 10 têm link de compra. Atualizar as demais quando
  houver oferta exata conferida.
- **Autor do site é uma entidade genérica** ("Curadoria Curva Viva"). O
  concorrente assina com pessoa real, foto e bio. Decisão pendente do
  proprietário.
- **Falta pedir indexação manual das páginas.** O sitemap foi aceito pelos dois
  serviços, então a descoberta acontece sozinha, mas pedir indexação acelera as
  primeiras páginas. Vale se o Google demorar.
- **Redes sociais**: o proprietário vai criar contas no Reddit, Pinterest,
  Instagram e TikTok. A publicação será automatizada pelo Codex, usando o
  navegador já logado. No TikTok, apenas carrossel de imagens com música. O
  objetivo é tráfego e sinal de marca, que pesa mais que backlink para citação
  em IA. Quando os perfis existirem, o Claude Code adiciona `sameAs` no schema
  de `Organization`.
- **Contato do site é `contato@curvaviva.com.br`**, definido em
  `src/lib/site.ts`. A caixa precisa existir de verdade: é o canal previsto na
  LGPD.
- **As páginas legais foram escritas por IA e não passaram por advogado.**
  Servem como base sólida, mas convém revisão humana.

---

## Mudanças

### 10 de agosto de 2026 — Codex — Guia de definição para ondulados publicado

Promovido da fila o artigo `cabelo-ondulado-nao-define-erros`, um guia educativo
com oito causas práticas, teste de três lavagens, 2.034 palavras, cinco links
internos e quatro imagens próprias. A capa preserva a personagem ondulada e os
três infográficos mostram erro, hipótese e ação em texto legível, sem potes
genéricos. A embalagem real do Juba Mousse foi hospedada no projeto para não
depender do carregamento externo.

A ficha do Juba Mousse 200 ml recebeu preço de R$ 51,78 e o link de afiliado
`meli.la/2fykFpR`, ambos conferidos na oferta exata pelo Chrome autenticado. A
primeira revisão confirmou fontes oficiais, produto, tamanho, imagem, preço e
destino do link. A segunda revisão conferiu texto e artes em celular e desktop,
sem rolagem horizontal ou imagem quebrada. `pnpm validar`, `pnpm check`,
`pnpm build` e o relatório visual passaram com `"aprovado": true`.

### 10 de agosto de 2026 — Codex — Linguagem dos oito artigos revisada

Todos os artigos publicados foram relidos como se a leitora estivesse chegando
ao assunto pela primeira vez. Códigos de formato deixaram de aparecer soltos e
o vocabulário técnico passou a ser traduzido em português comum na primeira
menção. Produtos, recomendações e links existentes foram preservados; o ranking
recebeu uma fonte científica sobre os limites das classificações capilares.

As duas revisões editoriais, `pnpm validar`, `pnpm check`, `pnpm build` e a
revisão visual em 17 telas passaram. Os oito artigos foram conferidos em 390 px,
sem imagens quebradas nem rolagem horizontal, e o relatório retornou
`"aprovado": true`.

### 10 de agosto de 2026 — Codex — Imagens do primeiro ranking refeitas

As quatro imagens do ranking de cremes foram revisadas pela ótica da leitora.
A capa passou a combinar a avatar oficial com as embalagens reais dos três
destaques, sem potes genéricos. As outras três artes viraram infográficos com
título, rótulos e orientação prática legível no celular. O feedback virou regra
do manual editorial para impedir que densidade de imagem seja confundida com
clareza ou credibilidade.

A revisão factual confirmou a correspondência das três embalagens e a avatar
canônica; a revisão de leitura conferiu as quatro artes em desktop e celular.
`pnpm validar`, `pnpm check`, `pnpm build` e `node scripts/revisar-visual.cjs`
passaram, com o relatório visual em `"aprovado": true`.

### 10 de agosto de 2026 — Codex — Primeiro ranking publicado

Promovido da fila o artigo `melhores-cremes-de-pentear-para-cabelo-cacheado`,
com sete recomendações, quatro ilustrações próprias, tabela de preço por 100 g
ou ml e cinco perguntas frequentes. Cinco produtos foram completados e os links
`meli.la` foram gerados e validados na conta de afiliado pelo Chrome autenticado
do proprietário. O projeto passou a ter 8 artigos e 12 produtos públicos.

As duas revisões editoriais, `pnpm validar`, `pnpm check`, `pnpm build` e a
revisão visual em desktop e celular passaram. A fila foi marcada com a data real
e ficou registrada como regra permanente a proibição de acessar a conta do
Mercado Livre pelo navegador interno do Codex.

### 8 de agosto de 2026 — Codex — Depósito editorial de quatro semanas

Foi pesquisado o padrão de conteúdo do AnalisaMelhor, NutriCabelo e #todecacho,
além de dúvidas recentes de leitoras. O padrão mais forte combina rankings de
produto com resposta direta, comparativos de decisão e guias práticos com alta
densidade visual. A pesquisa e as fontes ficaram registradas em
`fila-publicacao/PESQUISA-CONCORRENTES.md`.

Foi criada uma fila privada com 24 artigos: 12 rankings, 6 comparativos e 6
guias educativos, suficiente para aproximadamente quatro semanas na cadência
de 5 a 7 textos por semana. Cada rascunho já possui desenvolvimento, tabela,
FAQ, links internos planejados, fontes-base, pendências de atualização e quatro
briefs de imagem.

O depósito ficou deliberadamente fora de `src/data/posts/`, dentro de
`fila-publicacao/`. Portanto, nenhum desses artigos foi publicado, indexado,
adicionado ao sitemap ou exibido na busca. Antes de promover cada texto, ainda
é obrigatório atualizar fontes e produtos, cadastrar preço/oferta/link/imagem,
produzir as quatro ilustrações e realizar as duas revisões do manual editorial.

### 8 de agosto de 2026 — Claude Code — Search Console e Bing cadastrados

Os dois estão verificados e com o sitemap enviado. Feito operando o navegador
do proprietário, que aprovou o login na Microsoft e o consentimento OAuth do
BingWebmasterTools, porque login e concessão de permissão não são feitos por IA.

| | Google | Bing |
|---|---|---|
| Propriedade | `https://www.curvaviva.com.br/`, prefixo de URL | mesmo endereço |
| Verificação | arquivo HTML + meta tag | arquivo XML + meta tag |
| Sitemap | processado, 28 páginas | enviado, sem erros |

Os dois métodos de verificação foram implantados em cada serviço, em vez de um
só: eles revalidam de tempos em tempos, e se um método cair o outro segura a
propriedade. Os tokens ficam em `src/lib/site.ts` e os arquivos em `public/`.

**Não apagar** `public/google639db46a26cb5b78.html`, `public/BingSiteAuth.xml`
nem os campos de verificação em `src/lib/site.ts`. Perder isso derruba a
propriedade nos dois serviços.

A verificação foi feita por código em vez de registro TXT no DNS de propósito:
fica versionada, sobrevive a deploy e não depende de mexer na Hostinger.

O painel do Bing tem uma seção **AI Performance** em beta, que mostra
aparições em respostas de IA. É a métrica mais direta do objetivo de ser citado
por LLM, e vale acompanhar quando começar a haver dado.

### 8 de agosto de 2026 — Codex — Personagens de corpo inteiro

Criadas versões individuais de corpo inteiro da ondulada, da cacheada e da
crespa, dois trios para composição e folhas com vistas frontal, três-quartos e
perfil em `public/avatares/`. O figurino e as proporções agora também fazem parte
da referência canônica, para manter as personagens consistentes em artigos e
novas páginas. A home não foi alterada: o trio com área livre para texto ficou
preparado para o Claude Code usar quando refizer o layout.

### 8 de agosto de 2026 — Codex — Avatares definitivos

Substituídos os quatro avatares provisórios pelas identidades definitivas da
ondulada, da cacheada e da crespa, mantendo os caminhos e as proporções usados
pelo site. Criadas também uma folha conjunta e referências individuais com
vista frontal, três-quartos e perfil em `public/avatares/referencia/`, para que
as ilustrações dos próximos artigos preservem rosto, cabelo, pele, roupa e
estilo visual. O fundo foi fixado no creme exato do site.

### 7 de agosto de 2026 — Claude Code — Páginas legais e histórico

Criadas as páginas de privacidade, termos de uso, isenção de responsabilidade,
divulgação de afiliados e contato, com layout próprio e entrada no sitemap.
Rodapé reorganizado em três colunas para abrigá-las. Aviso de afiliado passa a
aparecer no topo de todo artigo que tenha link de compra, o que era uma lacuna
de conformidade.

Dados institucionais centralizados em `src/lib/site.ts` para não haver duas
versões do mesmo contato espalhadas pelo site.

Este arquivo de histórico foi criado.

### 7 de agosto de 2026 — Claude Code — Indexação no domínio próprio

O domínio `curvaviva.com.br` entrou no ar. A Vercel já injetava o endereço novo,
então canonical, og:url, sitemap e robots saíam corretos sem mudar configuração.

Adicionados `WebSite` com `SearchAction`, `BreadcrumbList` nas páginas de
produto e `AggregateOffer` no `Product` quando há preço conferido. O
`robots.txt` passou a liberar treze rastreadores de IA explicitamente.

Criado `vercel.json` com 301 do endereço antigo. **Ele ainda não está ativo**:
aquele endereço está servindo um deploy anterior. O risco é baixo porque o
canonical de lá já aponta para o domínio novo, mas resolver de vez exige mexer
no painel da Vercel.

### 7 de agosto de 2026 — Claude Code — Busca, herói e papéis

Herói refeito: os retratos saíram de baixo do texto e foram para o lado, em
tamanho menor. A ilustração larga ocupava quase uma tela inteira.

Busca criada em `/busca/`, com índice estático em `/busca.json`. Roda inteira no
navegador, sem servidor e sem serviço externo. Ignora acento nos dois lados.

Criado o `PAPEIS.md`.

### 7 de agosto de 2026 — Claude Code — Home visual e suporte a ranking

O cartão com "2 3 4" foi removido. O proprietário abriu o site e não entendeu o
que aqueles números eram, o que confirmou o problema. No lugar entraram
ilustrações das três curvaturas.

Adicionados trilha de navegação nos artigos, bloco de artigos relacionados,
campo de preço com custo por 100 g calculado, e suporte completo ao modelo de
artigo `ranking` (3 a 10 produtos, contra o teto de 2 dos outros).

O campo "Combina com" virou "Melhor para": o antigo repetia exatamente
"Ondulados, Cacheados, Crespos" em 5 dos 7 produtos, ou seja, não separava nada.

Instruções do Codex reescritas em `.github/INSTRUCOES-IA.md` cobrindo volume,
cadência, formato de ranking, densidade de imagem e ficha das personagens.

### 7 de agosto de 2026 — Codex — Guia de protetor térmico

Publicado `precisa-usar-protetor-termico-no-difusor` e cadastrado o produto
Curvas Mágicas Névoa Iluminadora. Entrou no meio de uma sessão de design do
Claude Code, sem conflito, mas foi o que motivou a regra de conferir
`git fetch` antes de commitar.

### 7 de agosto de 2026 — Claude Code — Sistema visual refeito

O `global.css` tinha três camadas de refinamento empilhadas que se
sobrescreviam. Virou um sistema único com tokens.

Tipografia própria hospedada no projeto (Fraunces e Inter). Antes o site usava
Georgia e declarava Inter sem nunca carregar. Escala tipográfica reduzida:
o herói caiu de 7,8rem para 4,25rem.

Paleta unificada: havia três vermelhos de famílias diferentes brigando entre si.

**Corrigido um bug antigo de contraste:** o botão "Quero esse produto" dentro
dos artigos tinha texto ameixa sobre fundo vermelho, cerca de 1,5:1, praticamente
ilegível. A regra `.prose a` vencia `.purchase-button` por especificidade. O
problema já existia antes desta mudança.

---

## Perguntas que o proprietário já fez

Registradas para não se repetirem.

- **"O design está bom? Movimento deixaria melhor?"** O design está sólido. As
  fraquezas que sobram não são de movimento: fotos de produto inconsistentes
  (vêm do Mercado Livre com iluminações diferentes), artigos ainda sem
  ilustração e falta de âncora visual dentro do texto. Movimento decorativo foi
  desaconselhado.
- **"Por que não dava para fazer a busca?"** Dava. Era só prioridade. Foi feita
  em seguida.
- **"O Node estava mesmo faltando?"** Estava. Varredura completa do disco achou
  `node.exe` apenas dentro do cache do próprio Codex. Node 24.19.0 e pnpm 11.9.0
  foram instalados em `%LOCALAPPDATA%\Programs\nodejs`, no PATH do usuário.
- **"O que os concorrentes têm que eu não tenho?"** Medido em
  nutricabelo.com.br, analisamelhor.com.br e todecacho.com.br: volume de
  artigos, formato ranking, preço nas fichas, densidade de imagem (12 por
  artigo contra 1) e autor com nome real. O Curva Viva ganha deles em fontes
  abertas, honestidade e navegação por curvatura.
