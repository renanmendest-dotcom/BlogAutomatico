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

## Estado atual em 15 de agosto de 2026

| | |
|---|---|
| Endereço | `https://www.curvaviva.com.br` (o sem `www` redireciona para o `www`) |
| Endereço antigo | `blog-automatico-sigma.vercel.app`, ainda responde |
| Artigos publicados | 11 |
| Artigos na fila privada | 20 |
| Produtos públicos | 14 (18 cadastros no total) |
| Hospedagem | Vercel, publicação automática a partir da `main` |
| Design | Claude Code |
| Conteúdo | Codex |

**O gargalo hoje é volume de conteúdo.** 11 artigos contra centenas dos
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

- **Dois artigos em formato ranking foram publicados.** O formato estreou em 10
  de agosto, mas os outros 10 rankings da fila ainda precisam ser promovidos para
  reduzir a lacuna de tráfego comercial.
- **Preço e oferta ainda não cobrem todos os produtos públicos.** 10 das 14
  fichas públicas têm preço e 13 têm link de compra. Atualizar as demais quando
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

### 15 de agosto de 2026 — Codex — Bloqueio do domínio no Pinterest explicado

- `curvaviva.com.br`, `www.curvaviva.com.br` e o artigo usado nos Pins
  responderam normalmente por HTTPS. O redirecionamento para `www` e o
  `robots.txt` também estão corretos.
- Reivindicar o domínio comprova ao Pinterest quem é o proprietário, mas não
  aprova o endereço no filtro independente de links suspeitos. O bloqueio é um
  provável falso positivo de reputação do domínio novo, não um problema na
  compra, no DNS ou no site.
- A contestação enviada ao suporte continua sendo o caminho correto. Até a
  revisão, os Pins usam provisoriamente o perfil oficial como destino.

### 15 de agosto de 2026 — Codex — Carrossel republicado com CTA

- O cartão final foi reorganizado com a logo redonda da Curva Viva centralizada
  no topo, título e texto centralizados e bloco de CTA equilibrado para leitura
  no celular.
- O Pin foi republicado com cinco imagens: quatro cartões educativos e o CTA
  final. A página pública confirmou as cinco posições, a pasta correta, as
  marcações de IA e o texto alternativo.
- Novo Pin: `https://br.pinterest.com/pin/1146236542701342527/`.
- O clique continua apontando provisoriamente para o perfil oficial porque o
  Pinterest ainda bloqueia `curvaviva.com.br`. Nenhum patrocínio, campanha ou
  cobrança foi criado.

### 15 de agosto de 2026 — Codex — CTA final obrigatório no Pinterest

- Todo futuro Pin com múltiplas imagens terminará com um cartão de marca que
  usa a logo oficial, convida a seguir `@curvavivaoficial` para acompanhar o
  assunto e apresenta `www.curvaviva.com.br` como fonte dos conteúdos
  completos.
- Criado um modelo vertical 2:3 reutilizável e adaptável ao tema de cada Pin em
  `midia-social/pinterest/modelos/`. A primeira versão, sobre ondas, foi
  renderizada como `pin-05-cta.png` e aprovada visualmente.
- O carrossel já publicado não foi republicado para evitar uma terceira cópia
  do mesmo conteúdo. A nova regra vale obrigatoriamente a partir do próximo Pin.

### 15 de agosto de 2026 — Codex — Primeiro carrossel publicado

- Publicado um novo Pin em carrossel com os quatro cartões já preparados sobre
  ondas que somem quando secam. A página pública confirmou as quatro imagens,
  a pasta correta e as marcações de conteúdo e pessoa gerados por IA.
- O proprietário autorizou o Codex a aceitar termos necessários às publicações
  orgânicas no Pinterest. A autorização não inclui campanha, impulsionamento,
  orçamento, cobrança, forma de pagamento ou qualquer ação que gere gasto.
- O fluxo do criador de Pins para anúncio não exibiu aceite contratual separado
  e publicou organicamente sem custo. A oferta de patrocínio apareceu apenas
  depois da publicação e não foi acionada.
- O domínio `curvaviva.com.br` continua bloqueado pela política de conteúdo do
  Pinterest. O carrossel aponta provisoriamente para o perfil oficial e será
  editado para o artigo quando o suporte liberar o domínio.

### 15 de agosto de 2026 — Codex — Destino do primeiro Pin corrigido

- O primeiro Pin saiu com uma imagem única porque o carrossel só ficou
  disponível pelo Gerenciador de Anúncios/Editor em Massa, cujo uso exige
  aceitar os termos de publicidade do Pinterest. O Codex não aceitou esse
  contrato em nome do proprietário.
- O endereço técnico da Vercel foi removido do Pin por prejudicar a percepção
  da marca. Enquanto o domínio oficial não é liberado, o botão aponta
  provisoriamente para `https://br.pinterest.com/curvavivaoficial/`.
- O Pinterest bloqueou inclusive a página inicial de `curvaviva.com.br` como
  possível spam, apesar de o domínio estar reivindicado pela conta. Uma
  contestação foi enviada pelo formulário oficial "O Pinterest bloqueou meu
  site" e aguarda análise.
- Nenhuma campanha, orçamento ou cobrança foi criada. O carrossel ficará para
  depois do aceite dos termos pelo proprietário e do desbloqueio do domínio.

### 15 de agosto de 2026 — Codex — Primeiro Pin publicado

Publicado o primeiro Pin da Curva Viva sobre ondas que perdem definição ao
secar, com fotografia realista, texto vertical 2:3, comentários habilitados e
link para o guia de oito erros. A publicação foi organizada na pasta de cabelo
ondulado e marcada corretamente como conteúdo modificado por IA. Três cartões
adicionais ficaram prontos para futuras variações.

O domínio novo foi recusado pelo filtro de spam do Pinterest, então o Pin usa o
endereço público anterior da Vercel para o mesmo artigo. O carrossel não foi
ativado porque a plataforma exigiu aceitar um contrato publicitário. A conta de
anunciante Curva Viva foi criada para Brasil e BRL, mas nenhuma campanha,
orçamento ou cobrança foi criada. A estratégia e os ativos ficaram registrados
em `midia-social/pinterest/`.

### 15 de agosto de 2026 — Codex — Perfil oficial no Pinterest configurado

Configurado o perfil `@curvavivaoficial` com a logo do projeto, nome voltado à
busca, descrição da marca e link para `www.curvaviva.com.br`. O domínio foi
reivindicado no Pinterest por meio de `public/pinterest-0eef9.html`, publicado
na Vercel e confirmado pela plataforma, para vincular os Pins futuros ao site
oficial.

Foram criadas cinco pastas públicas, cada uma com descrição própria: cabelo
ondulado, cabelo cacheado, cabelo crespo, finalização e day after, e produtos
para cabelos com curvatura. Nenhum Pin de terceiros foi salvo ou publicado; a
estrutura ficou pronta para receber apenas conteúdo editorial da Curva Viva.

### 15 de agosto de 2026 — Codex — Ranking de cremes para ondulados publicado

Promovido da fila o artigo `melhores-cremes-para-cabelo-ondulado-sem-pesar`,
baseado em duas dúvidas brasileiras recentes e voltado à escolha de compra. O
ranking compara Widi Care Ondulando a Juba 500 ml, Salon Line Definição Natural
1 kg e Inoar Meu Cacho, Meu Crush 500 ml, com cinco perguntas frequentes,
quatro imagens próprias e as embalagens reais hospedadas no projeto.

Os três links de afiliado foram gerados ou reconfirmados no Chrome autenticado:
`meli.la/2Rd12Aj`, `meli.la/2fMcfWh` e `meli.la/2x3jiSP`. A primeira revisão
conferiu fontes oficiais, nomes, tamanhos, ofertas, imagens, links e limites das
alegações. A segunda revisou título, intenção de busca, naturalidade, retenção,
SEO e leitura no celular. `pnpm validar`, `pnpm check`, `pnpm build` e a revisão
visual passaram; a checagem dedicada confirmou os botões, as imagens, a
ausência de rolagem horizontal e as páginas do artigo e produto em 390 e 1.440
px.

### 10 de agosto de 2026 — Codex — Comparativo de leave-in publicado

Promovido da fila o artigo `leave-in-ou-creme-de-pentear`, que responde a uma
dúvida brasileira recente e ajuda a escolher entre preparação, proteção,
desembaraço e modelagem sem tratar o nome da embalagem como regra. O texto tem
quatro infográficos próprios, cinco links internos e uma recomendação
contextual do Widi Care Sou 10 Leave-In 200 ml.

A ficha do produto recebeu imagem real, faixa de R$ 49,00 a R$ 54,90 e o link
de afiliado `meli.la/1S6SpCq`, gerado e validado no Chrome autenticado. A
primeira revisão confirmou fontes, produto, tamanho, oferta, imagem, link e
limites das alegações. A segunda aprovou título, intenção, naturalidade, SEO e
leitura das artes em 390 px. `pnpm validar`, `pnpm check`, `pnpm build` e a
revisão visual passaram sem erros, imagens quebradas ou rolagem horizontal.

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

### 16 de agosto de 2026 — Codex — Óleo de argan e novo carrossel

Publicado o artigo `oleo-de-argan-pesa-no-cabelo-ondulado`, baseado em dúvidas
brasileiras recentes sobre óleo nas pontas e receio de peso. O produto exato é
o Lola Cosmetics Argan Oil Óleo 50 mL, com ficha oficial, imagem da marca,
oferta em loja oficial do Mercado Livre e link de afiliado `https://meli.la/2HGgGc6`.

O artigo recebeu quatro infográficos próprios, passou por duas revisões e foi
aprovado em `pnpm validar`, `pnpm check`, `pnpm build` e revisão visual em
desktop e celular. Artigo e ficha do produto responderam HTTP 200 no domínio
oficial após o push para `main`.

Publicado também o carrossel de cinco imagens no Pinterest:
`https://br.pinterest.com/pin/1146236542701452951/`. A última imagem usa a logo
redonda centralizada e os CTAs permanentes da Curva Viva. O Pin aponta direto
para o artigo em `www.curvaviva.com.br`, que desta vez foi aceito pela
plataforma. Nenhum patrocínio, campanha, orçamento ou cobrança foi criado.

### 16 de agosto de 2026 — Codex — Programação semanal do Pinterest

Criadas 21 artes verticais originais para o Pinterest, com três Pins por dia
entre 16 e 22 de agosto. A grade alterna dúvidas práticas, conteúdo salvável,
comparativos e decisões de produto, sempre com link para um artigo no domínio
oficial `www.curvaviva.com.br`.

As fotografias de contexto foram geradas em modo integrado e as embalagens de
produto são imagens reais. Foi criado um tratamento de margens e dissolução das
bordas para que nenhum produto apareça dentro de retângulo ou quadrado branco,
sem redesenhar rótulos. Todas as 21 peças passaram por revisão visual conjunta.

O CSV foi validado com 21 títulos, 21 horários e 21 destinos únicos. Também
passaram `pnpm validar`, `pnpm check` e `pnpm build`. Os arquivos foram enviados
diretamente para `main` e as imagens inicial e final responderam HTTP 200 no
domínio oficial.

O Pinterest aceitou a importação em massa às 20h42. A plataforma confirmou que
o arquivo foi carregado e que os Pins estão sendo criados, com processamento
estimado em cerca de duas horas e aviso por email apenas em caso de problema.
Nenhuma campanha, orçamento, cobrança ou configuração de anúncios foi aberta.

### 16 de agosto de 2026 — Codex — Correção preparada para o Pin de argan

Confirmado no Pin público `1146236542701452951` que o cartão do Lola Argan Oil
50 mL exibia o fundo branco quadrado da foto de produto. O cartão foi corrigido
localmente com composição por multiplicação e máscara suave, preservando a
embalagem e o rótulo reais sem o quadrado.

O editor do Pinterest foi inspecionado e não oferece substituição, remoção ou
inclusão de mídia em Pin já publicado. Ele permite alterar apenas pasta, título,
descrição, site, texto alternativo e marcações. Para trocar a imagem será
necessário excluir o Pin inteiro e republicar as cinco imagens, o que apaga o
endereço e as estatísticas atuais. A exclusão não foi executada sem confirmação
específica do proprietário.

### 16 de agosto de 2026 — Codex — Pin de argan corrigido e republicado

Com autorização explícita do proprietário, o carrossel de óleo de argan foi
republicado com as cinco imagens em
`https://br.pinterest.com/pin/1146236542701459645/`. A terceira página foi
conferida no Pin público: a embalagem real do Lola Argan Oil 50 mL aparece
recortada e integrada ao círculo rosa, sem o quadrado branco.

O novo Pin mantém a pasta `Cabelo ondulado: leveza e definição`, o título, a
descrição, o texto alternativo, as marcações de IA e o destino oficial
`https://www.curvaviva.com.br/artigos/oleo-de-argan-pesa-no-cabelo-ondulado/`.
Depois da validação, o Pin antigo `1146236542701452951` foi excluído. Nenhum
patrocínio, campanha, orçamento, forma de pagamento ou cobrança foi criado.

### 17 de agosto de 2026 — Codex — Retornos do Pinterest e auditoria do CSV

O Gmail oficial foi conferido. O suporte respondeu à contestação do domínio em
15 de agosto dizendo que considera o site uma violação da Política de Spam e
que não o retirará da lista de bloqueio. Apesar dessa resposta formal, os Pins
mais recentes e a importação em massa aceitaram destinos em
`https://www.curvaviva.com.br`, portanto o domínio com `www` está funcionando
operacionalmente nas publicações atuais.

O email de processamento do CSV informou erro em nove linhas, todas marcadas
como `Duplicar link do Pin`. A auditoria da conta confirmou o resultado real:
um Pin do lote já foi publicado em
`https://br.pinterest.com/pin/1146236542701458841/` e 11 Pins estão na fila
privada `Pins agendados`. Assim, 12 das 21 linhas foram aceitas e nove foram
rejeitadas por repetir o destino de outra linha do mesmo CSV.

Os Pins agendados não aparecem em `Salvos` nem em `Rascunhos`. Eles ficam em
`Perfil > Criados > Pins agendados` e serão publicados automaticamente nos
horários exibidos. Para completar a grade, será necessário um novo lote apenas
com as nove peças rejeitadas, usando URLs de destino únicas e novos horários;
o CSV original não deve ser reenviado para evitar duplicatas.

### 17 de agosto de 2026 — Codex — Nove Pins recuperados e agendados

Criado o arquivo `pinterest-bulk-rejeitados.csv` somente com as nove peças que
falharam no primeiro lote. Cada destino recebeu parâmetros UTM próprios, o que
eliminou a duplicidade sem alterar o artigo final. Os sete horários ainda
futuros foram preservados; os dois horários vencidos foram redistribuídos para
23 de agosto, às 9h e 14h, mantendo no máximo três Pins por dia.

O arquivo foi validado com nove títulos, nove mídias, nove links e nove horários
únicos. Todas as mídias e páginas de destino responderam HTTP 200. Também
passaram `pnpm validar`, `pnpm check` e `pnpm build`.

O novo CSV foi enviado no Chrome autenticado e o Pinterest confirmou o upload.
A fila privada passou de 11 para 20 Pins agendados, com os nove títulos e
horários novos visíveis. Somado ao Pin do primeiro lote que já foi publicado,
as 21 peças estão contabilizadas. Nenhuma campanha, patrocínio, orçamento ou
cobrança foi criado.

### 17 de agosto de 2026 — Codex — Perfil oficial do TikTok organizado

O perfil autenticado do TikTok foi configurado como presença oficial do Curva
Viva. O usuário pessoal `@renanmendes47` foi substituído por
`@curvavivaoficial`, e a nova página pública passou a ser
`https://www.tiktok.com/@curvavivaoficial`.

A logo redonda oficial foi aplicada como foto de perfil. O nome visível já
estava definido como `Curva Viva | Cabelos ondulados` e não pôde ser alterado
novamente antes de 22 de agosto por limite temporário do TikTok. A bio ficou
`Guias para ondulados, cacheados e crespos ✨ curvaviva.com.br`.

A conta está pública e sem vídeos. O editor não apresentou campo de site
clicável para esta conta, então o domínio foi incluído na bio. Não houve troca
para conta empresarial, verificação, promoção ou alteração de dados pessoais,
segurança e cobrança.

### 17 de agosto de 2026 — Codex — Primeiro carrossel do TikTok preparado

Foi pesquisado no próprio TikTok o interesse por cabelo ondulado, falta de
definição, finalização e frizz. A pauta escolhida foi `As ondas aparecem
molhadas e somem quando secam?`, conectada ao artigo existente sobre oito erros
que confundem a definição. Os resultados observados reforçaram o uso de um
gancho de identificação, passos curtos, pedido para salvar e hashtags
específicas do nicho.

Foi criado um carrossel orgânico com oito imagens em proporção 3:4, três fotos
realistas geradas para a publicação, cinco ajustes práticos e um cartão final
com a logo centralizada, convite para seguir `@curvavivaoficial` e acesso a
`curvaviva.com.br`. O material, a legenda, as fontes da pesquisa e os prompts
foram salvos em `midia-social/tiktok/2026-08-17-ondulado-nao-define/`.

As duas revisões passaram. A primeira conferiu fatos, coerência, acentuação,
logo, endereço e ausência de promessas. A segunda conferiu gancho, retenção,
leitura no celular, naturalidade, CTA, hashtags e coerência do áudio pesquisado.
A revisão visual das oito páginas foi salva em `revisao-visual.png`.

Também passaram `pnpm validar`, `pnpm check` e `pnpm build`. O TikTok Studio
confirmou suporte a carrossel de fotos com até 35 imagens e proporção 3:4, mas o
upload não foi concluído porque a extensão do Chrome não conseguiu abrir o
seletor de arquivos. É necessário ativar `Permitir acesso a URLs de arquivo`
nos detalhes da extensão ChatGPT em `chrome://extensions`. Nenhuma imagem foi
enviada e não houve publicação parcial, promoção ou cobrança.
