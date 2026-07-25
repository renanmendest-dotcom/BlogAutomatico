# CLAUDE.md

Regras permanentes deste repositório. Valem para qualquer agente e para qualquer
sessão interativa. A especificação completa está em [PROJETO.md](PROJETO.md);
este arquivo é o que precisa estar em contexto para trabalhar.

## O que é este projeto

Um blog estático em português brasileiro sobre casa inteligente, com um pipeline
de agentes que coleta dados de produtos, escreve artigos e publica sozinho.

O que o site vende não é prosa — é uma **matriz de compatibilidade mantida
atualizada que não existe em português**. A prosa é o invólucro do dado. Se um
texto pode existir sem a tabela, o artigo está errado.

## As três regras que não se negociam

1. **Nunca infira compatibilidade.** Se a fonte não confirma, o valor é
   `nao_verificado`. Vale para assistente, protocolo, voltagem, hub e operação
   offline. Um dado inventado sobre compatibilidade destrói a única coisa que dá
   valor a este site. Lacuna honesta vale mais que palpite.
2. **Todo dado carrega fonte e data.** Preço sem data de coleta e compatibilidade
   sem `url_fonte` não entram. O site exibe os dois, e é isso que torna o
   conteúdo citável.
3. **Nunca invente autoria.** Não existe pessoa autora neste site. A identidade é
   organizacional e está em `/como-fazemos`. Nada de "especialista há 10 anos".

Entre publicar mais e publicar com dado verificado, escolha o dado verificado.

## Comandos

```bash
npm run dev
```

```bash
npm run validar
```

`validar` roda a trava da matriz, a checagem de tipos, o build e a validação do
JSON-LD gerado. É o mesmo conjunto que o CI roda. Rode antes de considerar
qualquer mudança pronta.

```bash
npm run coletar:ml:diagnostico
```

Coleta de dados: `coletar:ml` (preços e disponibilidade, exige
`ML_CLIENT_ID`/`ML_CLIENT_SECRET`) e `coletar:demanda` (autocomplete do Google,
não exige nada). Os scripts são `.ts` rodados direto pelo Node 24, sem
compilador — por isso os imports relativos entre eles levam a extensão `.ts`.

## Estrutura

| Caminho | O que é |
| :---- | :---- |
| `data/*.json` | Camada de dados. Formatos em [data/README.md](data/README.md) |
| `scripts/lib/` | HTTP com backoff, IO atômico de `/data`, cliente do ML |
| `src/lib/tipos.ts` | Tipos canônicos de `/data`. Não redeclare formato em outro lugar |
| `src/lib/compat.ts` | Lógica do chip **e** do schema de compatibilidade |
| `src/lib/schema.ts` | Construtores de JSON-LD |
| `src/content/posts/` | Artigos em Markdown com frontmatter tipado |
| `src/content.config.ts` | Schema do frontmatter — o build quebra se não bater |
| `scripts/` | Coletores, agendador e validadores |

## Escrevendo um artigo

O frontmatter é validado no build por `src/content.config.ts`. Campos
obrigatórios: `titulo`, `pergunta_principal`, `resposta_curta`, `slug`,
`publicado_em`, `atualizado_em`, `verificado_em`, `categoria`.

**Não escreva tabela comparativa em Markdown.** A tabela e as fichas técnicas são
geradas a partir de `data/` pelo layout, com base na lista `produtos` do
frontmatter. Isso é proposital: se a tabela pudesse ser digitada à mão, o dado
deixaria de ser o produto. A prosa referencia "a tabela acima".

Regras de escrita:

- **Resposta direta nos dois primeiros parágrafos.** Sem introdução
  contextualizando o assunto. A pergunta do título é respondida antes de tudo.
- **Títulos de seção em formato de pergunta**, espelhando como as pessoas
  perguntam.
- **Cada seção abre com entidade + verbo + afirmação específica com dado.** Não
  com transição.
- **`resposta_curta` e cada resposta do `faq` têm de 40 a 60 palavras.** É o
  comprimento que motores generativos extraem melhor, e o build recusa fora
  disso.
- **Toda afirmação factual carrega fonte e data** em `fontes`.
- Parágrafos curtos. Sem "em conclusão", sem "resumindo o que vimos". Se o dado é
  bom, ele vai no começo.
- Português brasileiro, registro direto, sem hipérbole de marketing.
- **900 a 1.600 palavras.** Pauta que não sustenta 900 palavras com substância
  não vira artigo — vira entrada na matriz de compatibilidade.

O prefixo `REF-` em `produtos` marca item genérico dos posts de referência da
Fase A. **Post gerado por agente nunca usa `REF-`**, e nunca usa
`referencia_formato: true`.

## Fora de escopo

Não construa, não sugira, não comece: newsletter, redes sociais, comentários,
área de membros, múltiplos idiomas, marketplace além do Mercado Livre.

Não escreva sobre câmeras de segurança profissionais, alarmes monitorados ou
projetos de instalação elétrica. É território de segurança e obra, onde conteúdo
automatizado não deve opinar. Quando o assunto encostar aí — chuveiro, quadro de
distribuição, circuito dedicado — a resposta correta é apontar o limite e mandar
procurar eletricista.

## Design

Direção visual: etiqueta de equipamento elétrico. Seis tokens de cor em
`src/styles/global.css`, e só eles — variação por `color-mix` sobre os tokens,
nunca cor nova. Sem gradiente, sem sombra difusa, fundo claro e frio.

Preço, voltagem, protocolo e data **sempre** em monoespaçada (classe `.dado`). É
o que separa dado de texto visualmente.

O chip de compatibilidade (`src/components/ChipCompatibilidade.astro`) é o
elemento assinatura e a única ousadia do design. Ele lê as mesmas funções de
`src/lib/compat.ts` que emitem o JSON-LD, então visual e schema não podem
divergir. Mudou a regra de estado? Muda em `compat.ts`, não no componente.

Piso: responsivo até 360px, foco de teclado visível, `prefers-reduced-motion`
respeitado, Lighthouse acima de 95 em performance.

## Guardrails

- **Kill switch:** se o arquivo `PAUSE` existir na raiz, todo workflow aborta no
  primeiro passo. Nunca remova essa checagem de um workflow.
- **Trava de dado:** artigo com menos de 3 pontos de dado coletado por máquina,
  ou preço sem data de coleta, não publica.
- **Trava de volume:** máximo 1 post/dia, 5/semana, teto de 180 no ano.
- **Trava de custo:** `--max-turns` e timeout em todo workflow. Estourou o
  orçamento de turnos, abre issue — não insiste.
- **Log auditável:** commit de publicação registra pauta de origem, produtos
  consultados, fontes usadas e agente responsável.

## Estado das fases

- **Fase A — infraestrutura:** concluída. Site, layout, chip, schemas validados,
  CI e 3 posts de referência.
- **Fase B — dados:** parcial.
  - Feito: cliente da API do ML com `client_credentials`, backoff e degradação
    segura; coletor de demanda por autocomplete (~1.900 termos reais); trava da
    matriz (`validar-matriz.ts`); workflow `coletar.yml` em `workflow_dispatch`.
  - Falta: `produtos.json` com 60+ produtos — **bloqueado** até
    `ML_CLIENT_ID`/`ML_CLIENT_SECRET` existirem (SETUP.md, passo 5).
  - Falta: matriz com 40 dispositivos verificados. Hoje tem 12.
- **Fase C — agentes:** pendente. Descoberta e redação em `workflow_dispatch`.
- **Fase D — automação:** pendente. Crons, agendador com ritmo humano,
  guardrails testados.

Não pule fase. A Fase C depende de a Fase B estar rodando com dados reais.

## Ampliando a matriz

É o trabalho mais valioso em aberto, e é manual por natureza: cada campo precisa
de uma fonte que o afirme.

O que funciona bem: páginas de produto da `loja.intelbras.com.br` e do
`itead.cc` (SONOFF) respondem a fetch simples e trazem ficha completa. As FAQ
oficiais da TP-Link cobrem uma linha inteira de uma vez.

O que não funciona: `intelbras.com` e os PDFs de datasheet devolvem 403. Lojas em
VTEX/FastStore (Positivo) renderizam a ficha por JavaScript — precisam de
navegador, não de fetch.

**Nunca use resumo de busca como fonte.** Um resumo de resultados de busca
misturou especificações de três produtos diferentes e atribuiu compatibilidade
com Alexa a uma lâmpada cuja página do fabricante não cita assistente nenhum.
A fonte é a página, aberta e lida.
