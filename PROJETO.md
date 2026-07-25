# Projeto: Blog automatizado de casa inteligente (BR)

> Documento de especificação para o Claude Code. Leia inteiro antes de escrever qualquer linha de código.

---

## 0\. Como usar este documento

Você vai construir um sistema completo: um site estático \+ um pipeline de agentes que pesquisa demanda, coleta dados reais de produtos, escreve artigos e publica sozinho na nuvem.

**Ordem de execução obrigatória:**

1. Fase A — infraestrutura e site (sem conteúdo)  
2. Fase B — camada de dados e coletores  
3. Fase C — agentes de conteúdo  
4. Fase D — agendador e publicação automática

Não pule para a Fase C antes da B estar funcionando com dados reais. O sistema inteiro depende disso e a Seção 3 explica por quê.

Ao terminar cada fase, pare e reporte o que foi feito antes de seguir.

---

## 1\. Objetivo

Um blog em português brasileiro sobre casa inteligente que:

- Rankeia em busca orgânica no Google  
- É **citado como fonte** quando alguém pergunta a uma IA (ChatGPT, Gemini, Perplexity, AI Overviews) sobre compatibilidade e escolha de dispositivos  
- Monetiza via programa de afiliados do Mercado Livre  
- Roda 100% sozinho na nuvem, sem intervenção humana no ciclo de publicação

**Restrição de custo:** o operador tem assinatura Claude Code e orçamento de até R$ 100/mês para tudo. Hospedagem, CI e coleta de dados devem ser gratuitos. O único custo fixo aceito é o domínio.

---

## 2\. Nicho e posicionamento

**Nicho:** casa inteligente / automação residencial acessível no Brasil.

**Eixo editorial:** compatibilidade. Não "review do produto X", e sim "o que funciona com o quê, em que condição, a que preço".

**Público:** brasileiro que já tem uma Alexa ou um Google Nest e quer expandir, ou que está comprando o primeiro dispositivo e não sabe se vai funcionar com o que já tem.

**Marcas relevantes no catálogo do Mercado Livre:** Intelbras, Positivo Casa Inteligente, Geonav, Multilaser, Elgin, Xiaomi/Mi, Tuya e derivados, Sonoff, TP-Link Tapo, Philips Hue.

**Dores reais que definem as pautas:**

- Funciona com Alexa? Com Google Home? Com os dois?  
- Precisa de hub ou conecta direto no Wi-Fi?  
- Wi-Fi 2.4 GHz ou 5 GHz? (a maioria dos dispositivos baratos só fala 2.4)  
- 127V ou 220V? Bivolt?  
- Suporta Matter?  
- Funciona sem internet?  
- Aguenta a corrente do chuveiro / ar-condicionado?

**O que NÃO é escopo:** câmeras de segurança profissionais, alarmes monitorados, projetos de instalação elétrica. Isso puxa para território de segurança e obra, onde conteúdo automatizado não deve opinar.

---

## 3\. Princípio central: o dado é o produto

Leia esta seção duas vezes.

Um artigo que só reembala o que já está nos dez primeiros resultados do Google não ranqueia e não é citado por IA. O que este sistema vende não é prosa — é **uma tabela de compatibilidade mantida atualizada que não existe em português**.

Portanto:

- **Todo artigo precisa carregar dado estruturado coletado por máquina**: preço atual, faixa de preço observada ao longo do tempo, protocolo, voltagem, requisito de hub, assistentes suportados, reputação do vendedor.  
- **Um artigo sem dado real não pode ser publicado.** Isso é uma trava técnica, não uma recomendação. Veja Seção 11\.  
- **A prosa é o invólucro do dado, não o contrário.** Se o texto pode existir sem a tabela, o artigo está errado.

O sistema tem uma vantagem estrutural sobre sites humanos: consegue reverificar preço, disponibilidade e compatibilidade de centenas de produtos toda semana. Nenhum blogueiro faz isso. É aí que ele ganha — e só aí.

---

## 4\. Stack

| Camada | Escolha | Por quê |
| :---- | :---- | :---- |
| Site | Astro | Estático, rápido, content collections em Markdown, controle total do HTML e do schema |
| Estilo | CSS puro com custom properties | Sem dependência de build de framework; o site é simples |
| Conteúdo | Markdown com frontmatter tipado | Versionado em git, diffável, fácil de gerar e auditar |
| Dados | JSON versionado no repositório | Sem banco, sem custo, histórico de preço vem de graça pelo git |
| CI / execução | GitHub Actions | Gratuito em repositório público |
| Agente | `anthropics/claude-code-action@v1` em modo headless | Autenticação por `CLAUDE_CODE_OAUTH_TOKEN` |
| Deploy | Cloudflare Pages | Gratuito, CDN global, build automático a cada push |
| Analytics | Cloudflare Web Analytics | Gratuito, sem cookie, sem banner de consentimento |

Sem WordPress. Sem banco de dados. Sem servidor.

---

## 5\. Estrutura do repositório

/

├── .github/workflows/

│   ├── descobrir.yml          \# semanal — agente de descoberta

│   ├── coletar.yml            \# diário — atualiza preços e specs

│   ├── publicar.yml           \# diário — decide e executa publicação

│   └── deploy.yml             \# a cada push na main

│

├── data/

│   ├── produtos.json          \# catálogo com specs e preço atual

│   ├── precos-historico.json  \# série temporal de preço por produto

│   ├── compatibilidade.json   \# a matriz — o ativo principal

│   ├── pautas.json            \# fila de pautas priorizadas

│   ├── publicados.json        \# estado: o que já saiu, quando

│   └── links-afiliado.json    \# mapa MLB item id → URL de afiliado

│

├── scripts/

│   ├── coletar-ml.ts          \# cliente da API do Mercado Livre

│   ├── coletar-trends.ts      \# Google Trends \+ autocomplete

│   ├── priorizar-pautas.ts    \# scoring das pautas

│   ├── agendador.ts           \# decide se publica hoje e a que hora

│   └── validar-post.ts        \# trava de qualidade pré-publicação

│

├── src/

│   ├── content/posts/         \# os artigos em .md

│   ├── components/            \# componentes Astro

│   ├── layouts/

│   ├── pages/

│   └── styles/

│

├── CLAUDE.md                  \# regras permanentes para os agentes

├── PAUSE                      \# se este arquivo existir, tudo para

└── PROJETO.md                 \# este documento

---

## 6\. Camada de dados

### 6.1 API do Mercado Livre

**Primeira tarefa da Fase B: descobrir o estado atual da autenticação.**

O Mercado Livre restringiu endpoints que antes eram públicos. Verifique se `https://api.mercadolibre.com/sites/MLB/search` ainda responde sem token. Se exigir autenticação:

1. Crie uma aplicação em `developers.mercadolivre.com.br`  
2. Use o fluxo `client_credentials` para obter access token  
3. Guarde `ML_CLIENT_ID` e `ML_CLIENT_SECRET` como secrets do repositório  
4. Implemente refresh automático do token no coletor

Trate rate limit com backoff exponencial. Se o coletor falhar, ele não pode derrubar o pipeline inteiro — registre o erro, use o último dado bom e siga.

**Campos a extrair por produto:**

id, título, preço, preço\_original, disponível,

vendedor: { id, nome, reputação, vendas\_totais },

atributos: { marca, modelo, voltagem, conectividade, ... },

permalink, thumbnail, quantidade\_vendida

`quantidade_vendida` é o melhor proxy de demanda que existe de graça. Use.

### 6.2 Descoberta de demanda (custo zero)

Três fontes, nesta ordem de confiança:

1. **Google autocomplete** — `suggestqueries.google.com` com `hl=pt-BR&gl=BR`. Expanda cada semente com sufixos e com o alfabeto (`melhor lâmpada inteligente a`, `... b`, ...). Isso revela cauda longa real.  
2. **People Also Ask** do Google para as sementes principais.  
3. **Google Trends** via biblioteca não-oficial. Trate como direcional, não como número absoluto.

Deixe um slot configurável para API paga de keyword (DataForSEO ou similar), **desligado por padrão**, ativável por variável de ambiente.

### 6.3 A matriz de compatibilidade

O ativo mais importante do projeto. `data/compatibilidade.json`:

{

  "produto\_id": "MLB1234567890",

  "nome": "...",

  "protocolo": "wifi\_2.4 | zigbee | bluetooth | matter | thread",

  "hub\_necessario": true,

  "hub\_modelos": \["..."\],

  "assistentes": {

    "alexa": "nativo | via\_hub | nao | nao\_verificado",

    "google\_home": "...",

    "apple\_home": "...",

    "smartthings": "..."

  },

  "voltagem": "127 | 220 | bivolt",

  "funciona\_offline": false,

  "app\_fabricante": "...",

  "fonte": "manual\_fabricante | ficha\_ml | site\_oficial",

  "url\_fonte": "https://...",

  "verificado\_em": "2026-07-24"

}

**Regra rígida:** o valor `nao_verificado` é obrigatório quando a fonte não confirma. **Nunca infira compatibilidade.** Um dado inventado sobre compatibilidade destrói a única coisa que dá valor a este site. Prefira lacuna honesta a palpite.

Cada campo carrega sua fonte e a data. O site exibe ambos. É isso que torna o conteúdo citável.

---

## 7\. Os agentes

Quatro agentes, cada um com um workflow e um escopo fechado.

### 7.1 Agente de descoberta — semanal (domingo)

**Entrada:** sementes de nicho \+ `publicados.json` **Saída:** `pautas.json` atualizado

O que faz:

1. Expande sementes via autocomplete e PAA  
2. Filtra: descarta termos sem intenção comercial ou informacional clara  
3. Cruza com `produtos.json` — a pauta precisa ter produtos reais associados  
4. Pontua cada pauta:

score \= (sinal\_de\_demanda × 0.3)

      \+ (formato\_citável\_por\_IA × 0.3)

      \+ (potencial\_de\_comissão × 0.2)

      \+ (lacuna\_competitiva × 0.2)

`formato_citável_por_IA` é alto quando a pauta é uma pergunta factual e fechada ("a lâmpada X funciona com Alexa?") e baixo quando é opinativa e ampla ("vale a pena ter casa inteligente?").

`lacuna_competitiva`: faça uma busca real e avalie se os primeiros resultados respondem bem. Se respondem, a pauta vale menos.

5. Deduplica contra tudo que já foi publicado, por similaridade semântica do título e da intenção — não por string exata

### 7.2 Agente coletor — diário

**Entrada:** `produtos.json` **Saída:** preços atualizados, histórico, alertas de mudança

O que faz:

1. Reconsulta todos os produtos ativos na API do ML  
2. Grava preço do dia em `precos-historico.json`  
3. Marca produtos que saíram de linha ou ficaram indisponíveis  
4. **Dispara atualização de artigos** cujo produto mudou de preço acima de 15% ou saiu do ar

Este agente não escreve prosa. Só move dados.

### 7.3 Agente redator

**Entrada:** uma pauta do topo da fila \+ dados dos produtos relacionados **Saída:** um arquivo `.md` em `src/content/posts/`

Regras de escrita (também vão no `CLAUDE.md`):

- **Resposta direta nos primeiros 2 parágrafos.** Nada de introdução contextualizando o assunto. A pergunta do título é respondida antes de qualquer coisa.  
- **Títulos de seção em formato de pergunta**, espelhando como as pessoas perguntam.  
- **Cada seção abre com:** entidade \+ verbo \+ afirmação específica com dado. Não com transição.  
- **Tabela comparativa obrigatória** em qualquer artigo que mencione mais de um produto.  
- **Bloco de FAQ ao final**, com respostas de 40 a 60 palavras cada — esse é o comprimento que motores generativos extraem melhor.  
- **Toda afirmação factual carrega fonte e data.**  
- Parágrafos curtos. Sem "em conclusão", sem "resumindo o que vimos". Se o dado é bom, ele vai no começo.  
- Português brasileiro, registro direto, sem hipérbole de marketing.

**Comprimento:** entre 900 e 1.600 palavras. Se a pauta não sustenta 900 palavras de conteúdo com substância, ela não vira artigo — vira entrada na matriz de compatibilidade.

### 7.4 Agente publicador — diário

Ver Seção 10\.

---

## 8\. Formato do post

### 8.1 Frontmatter

\---

titulo: "..."

pergunta\_principal: "..."       \# a query exata que o post responde

resposta\_curta: "..."           \# 40-60 palavras, vira o FAQPage schema

slug: "..."

publicado\_em: 2026-07-24

atualizado\_em: 2026-07-24

categoria: "iluminacao | tomadas | assistentes | sensores | hubs"

produtos: \["MLB123...", "MLB456..."\]

fontes:

  \- { titulo: "...", url: "...", acessado\_em: 2026-07-24 }

verificado\_em: 2026-07-24

\---

### 8.2 Dados estruturados

Cada post emite, no `<head>`:

- `Article` com `datePublished` e `dateModified` reais  
- `FAQPage` gerado a partir do bloco de FAQ  
- `Product` \+ `Offer` para cada produto citado, com preço e disponibilidade da coleta mais recente  
- `ItemList` quando o post é um ranking  
- `BreadcrumbList`  
- `Organization` no layout global

Schema errado é pior que schema ausente. Valide contra o Rich Results Test antes de considerar a Fase A concluída.

### 8.3 Autoria — leia com atenção

**Não invente uma pessoa.** Nada de "João Silva, especialista em automação residencial há 10 anos". Autoria falsa com credencial inventada é exatamente o sinal que derruba confiança, e é o tipo de coisa que, quando descoberta, mata o domínio de vez.

Em vez disso, publique sob uma **identidade editorial transparente**: uma página "Como fazemos" explicando que as fichas de compatibilidade são compiladas automaticamente a partir de manuais de fabricante e dados do Mercado Livre, com data de verificação em cada campo, e que erros podem ser reportados.

Isso é verdade, é auditável, e — para conteúdo de dado factual — constrói mais confiança que um perfil fictício. O schema `Organization` carrega essa identidade.

---

## 9\. Design do site

Direção visual: **etiqueta de equipamento elétrico**. O vocabulário visual vem do mundo do assunto — plaquetas de voltagem, LEDs de status, fichas técnicas impressas em serigrafia.

**Paleta (6 tokens):**

\--base:      \#EEF0F1;  /\* cinza de plástico de espelho de tomada \*/

\--tinta:     \#14202B;  /\* azul-tinta quase preto, para texto \*/

\--traco:     \#C4CBD0;  /\* linhas e divisórias \*/

\--ok:        \#0F7B6C;  /\* verde-instrumento: compatível \*/

\--atencao:   \#C2410C;  /\* laranja de etiqueta de aviso: incompatível \*/

\--nulo:      \#8A9099;  /\* cinza: não verificado \*/

Fundo claro e frio, nunca creme. Sem gradiente. Sem sombra difusa.

**Tipografia (3 papéis):**

- Display: uma grotesca condensada — texto em equipamento é sempre condensado  
- Corpo: uma humanista de boa leitura em telas pequenas  
- Dados: monoespaçada para preço, voltagem, protocolo e datas

Preço e voltagem **sempre** em monoespaçada. É o que separa "dado" de "texto" visualmente.

**Elemento assinatura: o chip de compatibilidade.**

Um componente inline, reutilizado em todo o site, que mostra `dispositivo ↔ assistente` com um indicador de estado de três posições: compatível / incompatível / não verificado. Ele carrega a data de verificação e a fonte no hover.

É o mesmo componente que emite o schema. A coisa que dá valor ao site é também a coisa que o identifica visualmente. Toda a ousadia do design mora aqui — o resto fica quieto e disciplinado.

**Piso de qualidade:** responsivo até 360px, foco de teclado visível, `prefers-reduced-motion` respeitado, Lighthouse acima de 95 em performance.

---

## 10\. Cadência e agendamento

### 10.1 O calendário

| Fase | Período | Ritmo |
| :---- | :---- | :---- |
| 1 | Semanas 1–6 | 3 posts/semana |
| 2 | Semanas 7–16 | 4 posts/semana |
| 3 | Mês 5 em diante | 3 novos \+ 2 atualizações/semana |

**Teto rígido: 180 posts no ano 1\.** O agendador deve recusar publicação ao atingir o teto e registrar o motivo.

A partir da Fase 3, atualizar vale mais que publicar. Preço e disponibilidade mudam sozinhos — isso gera `dateModified` legítimo e é o que mantém o conteúdo vivo.

### 10.2 Ritmo humano

O workflow `publicar.yml` roda diariamente em três horários candidatos. O `agendador.ts` decide:

1. Hoje é dia de publicar? (probabilidade derivada do ritmo da fase, com viés para terça a sexta)  
2. Já publicou hoje? Se sim, aborta.  
3. Sorteia um atraso de 0 a 90 minutos antes de executar  
4. Nunca publica dois posts com menos de 18 horas de intervalo  
5. Fins de semana têm probabilidade reduzida, mas não zero

Sem lote. Sem horário redondo. Sem padrão detectável.

---

## 11\. Guardrails

Implemente todos. São travas, não sugestões.

**Trava de dado.** `validar-post.ts` bloqueia a publicação se o artigo tiver menos de 3 pontos de dado coletado por máquina, ou se citar preço sem data de coleta.

**Trava de duplicação.** Bloqueia se a similaridade de intenção com um post existente passar do limite. Compare intenção, não string.

**Trava de compatibilidade inventada.** Se o texto afirma compatibilidade que não está em `compatibilidade.json` com fonte, o post é rejeitado e volta para a fila.

**Trava de volume.** Máximo 1 post/dia, máximo 5/semana, teto anual de 180\.

**Kill switch.** Se o arquivo `PAUSE` existir na raiz, todos os workflows abortam no primeiro passo. Criar esse arquivo é como o operador para tudo pelo celular.

**Trava de custo.** `--max-turns` em todos os workflows. Timeout de job. Se um agente exceder o orçamento de turnos, aborta e abre uma issue em vez de insistir.

**Log auditável.** Todo post publicado gera um commit com mensagem estruturada: pauta de origem, produtos consultados, fontes usadas, agente responsável.

---

## 12\. Setup manual — o que o operador faz uma vez

Estes passos são humanos. Gere um `SETUP.md` no repositório com o passo a passo detalhado.

1. **Domínio.** Registrar. Sugestões: `casaconectada.com.br`, `combinacasa.com.br`, `ligadoemcasa.com.br`. Pode ser em qualquer registrador — Registro.br é o mais barato para `.com.br`.  
     
2. **Repositório GitHub público.** Público porque minutos de Actions são gratuitos assim.  
     
3. **Token do Claude Code.** Rodar `claude setup-token` localmente e salvar o resultado como secret `CLAUDE_CODE_OAUTH_TOKEN`. *Atenção: esse token consome a mesma cota da assinatura usada interativamente. Se o pipeline começar a atrapalhar o uso normal, reduza a frequência antes de qualquer outra coisa.*  
     
4. **Cloudflare Pages.** Conectar ao repositório, apontar o domínio, ativar Web Analytics.  
     
5. **Aplicação Mercado Livre** em `developers.mercadolivre.com.br`, se a API exigir autenticação. Secrets `ML_CLIENT_ID` e `ML_CLIENT_SECRET`.  
     
6. **Google Search Console.** Verificar o domínio, enviar o sitemap.  
     
7. **Programa de afiliados do Mercado Livre** — fazer **depois** de \~18 artigos publicados, em `mercadolivre.com.br/l/afiliados-home`. Canal sem conteúdo é motivo comum de recusa. Declarar o blog como canal e "casa inteligente" como nicho.  
     
8. **Links de afiliado.** Popular `data/links-afiliado.json` com o mapa `id do produto → URL de afiliado`, gerado no painel do ML.  
     
   *Tarefa da Fase B: investigar se o ML oferece endpoint programático para gerar esses links. Se oferecer, automatize e descarte o arquivo. Se não, o operador popula em lotes de 20 a 30 produtos, o que dá conta de meses de conteúdo. Produto sem link de afiliado mapeado é citado com link normal — nunca omitido, porque a utilidade do artigo vem antes da comissão.*

---

## 13\. Fases de construção

**Fase A — infraestrutura** Site Astro no ar, layout, componente do chip de compatibilidade, schemas validados, deploy automático funcionando, 3 posts escritos à mão como referência de formato.

**Fase B — dados** Cliente da API do ML funcionando, coletor de trends, `produtos.json` populado com pelo menos 60 produtos reais, matriz de compatibilidade com pelo menos 40 entradas verificadas.

**Fase C — agentes** Descoberta e redação funcionando em modo manual (disparado por `workflow_dispatch`), com validação passando.

**Fase D — automação** Crons ativos, agendador com ritmo humano, guardrails testados, kill switch verificado.

Só depois da Fase D o operador solicita entrada no programa de afiliados.

---

## 14\. O que monitorar

Painel simples, gerado semanalmente pelo próprio pipeline como issue no repositório:

- Posts publicados vs. teto  
- Páginas indexadas (Search Console API)  
- Impressões e cliques por artigo  
- Consultas que trazem tráfego — realimentam a descoberta de pautas  
- Produtos com dado desatualizado há mais de 14 dias  
- Campos `nao_verificado` na matriz — é a lista de tarefas de melhoria

**Teste mensal de citação:** perguntar às três IAs principais 10 perguntas do nicho e registrar se o site aparece como fonte. Essa é a métrica que importa mais que posição no Google.

---

## 15\. Fora de escopo agora

Não construa, não sugira, não comece:

- Newsletter  
- Redes sociais  
- Comentários  
- Área de membros  
- Múltiplos idiomas  
- Qualquer marketplace além do Mercado Livre

Uma coisa bem feita. Expansão só depois que a Fase 3 estiver rodando estável.

---

## 16\. Regra final

Se em algum momento a escolha for entre **publicar mais** e **publicar com dado verificado**, escolha o dado verificado. O volume é fácil e vale pouco. A matriz de compatibilidade correta e atualizada é difícil e é a única coisa aqui que ninguém mais tem.  
