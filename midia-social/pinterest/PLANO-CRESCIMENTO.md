# Plano de crescimento do Pinterest — a partir de 20 de agosto de 2026

Escrito pelo Claude Code depois de auditar a conta `@curvavivaoficial` e
pesquisar o nicho de cabelo com curvatura no Pinterest brasileiro.

**Este arquivo vale daqui para frente.** Nada do que já foi publicado deve ser
apagado, reescrito ou republicado por causa dele. Os Pins existentes ficam como
estão.

Ele **complementa** o `ESTRATEGIA.md`, que continua valendo em tudo que trata de
voz, honestidade, marcação de IA e limites comerciais. Onde os dois falarem do
mesmo assunto, vale o que está aqui, porque é mais recente e foi medido.

---

## 1. O diagnóstico em uma frase

A conta está tecnicamente correta e comercialmente parada: **20 Pins, 132
visualizações mensais, zero salvamentos e nenhum clique possível para o site**,
porque o Pinterest bloqueou o domínio.

Números medidos em 20 de agosto de 2026, Pin a Pin:

| Métrica | Situação |
|---|---|
| Impressões por Pin | entre 2 e 18 |
| Salvamentos | **0 em todos os Pins** |
| Cliques de saída | 0 a 2 por Pin |
| Visualizações mensais do perfil | 132 |
| Pins publicados | cerca de 20, mais 4 agendados |
| Pastas | 4, bem nomeadas |
| Formato | 2:3, correto |

Zero salvamento em vinte Pins não é azar nem falta de tempo. É a plataforma
dizendo que o material não é do tipo que as pessoas guardam.

---

## 2. Prioridade zero: o domínio bloqueado

Enquanto `curvaviva.com.br` estiver bloqueado, **nenhuma melhoria de arte, texto
ou frequência gera uma única visita ao site.** Os Pins apontam para o próprio
perfil do Pinterest, então o clique morre dentro da plataforma.

Isso é o item mais importante deste documento. Tudo abaixo é secundário.

### O que já se sabe

- O bloqueio foi reproduzido na home e em URL de artigo, com e sem `www`.
- Uma contestação foi enviada em 15 de agosto pelo formulário oficial.
- É um falso positivo de reputação de domínio novo, não um problema de DNS,
  hospedagem ou conteúdo.

### O que fazer agora

1. **Reivindicar o domínio de novo e conferir que ficou de pé.** Verifiquei por
   três caminhos independentes e **hoje não existe nenhum token de verificação
   do Pinterest no site**: não há meta `p:domain_verify` no HTML, não há
   registro TXT no DNS e não há arquivo de verificação. Seja qual for a
   reivindicação feita antes, ela não está ativa. Peça a meta tag ao Pinterest e
   entregue ao Claude Code, que coloca no código e publica, como já foi feito
   com Google e Bing.
2. **Escalar a contestação no fórum oficial**, em `community.pinterest.biz`,
   pedindo revisão humana. O formulário automático nega a maioria dos pedidos
   com resposta genérica; o fórum é o caminho que costuma destravar. Descreva o
   site, diga que é domínio novo com conteúdo próprio e cite que já existe
   contestação aberta.
3. **Não usar endereço alternativo.** Nada de Vercel, encurtador ou redirecionador
   de terceiro. Encurtador em cima de domínio bloqueado é exatamente o padrão
   que o filtro de spam procura e pode custar a conta inteira.
4. **Continuar publicando mesmo assim.** O bloqueio é do link, não da conta. Os
   Pins seguem construindo autoridade e audiência, e ganham o destino certo
   quando o domínio for liberado.
5. **Registrar o teste do bloqueio no `HISTORICO.md` a cada semana**, com data,
   para haver prova de acompanhamento se a contestação precisar ser reforçada.

---

## 3. O que o nicho realmente salva

Pesquisei termos reais no Pinterest brasileiro e olhei o que ocupa o topo.
Existem dois padrões vencedores, e o Curva Viva hoje não faz nenhum dos dois.

### Padrão A — vídeo vertical, para descoberta ampla

Em buscas largas como "cabelo ondulado finalização" e "day after cabelo
cacheado", **de metade a dois terços do topo é vídeo**, em 9:16, com pessoa
real, cabelo real, filmado em casa, com texto curto sobreposto em fonte
elegante.

### Padrão B — infográfico denso, para busca informativa

Em buscas de informação como "cronograma capilar", o topo é o oposto do
minimalismo: **tabelas grandes, coloridas, com muita informação na mesma
imagem**. Calendário de semanas, o que usar em cada etapa, o que evitar, três
variações para três situações. Alguns trazem até um selo escrito "Salve este
Pin".

Esse é o formato que gera salvamento, porque a pessoa guarda para consultar
depois. **Salvamento é consulta futura, não elogio.**

### Onde o Curva Viva está

Os Pins atuais são cartões editoriais bonitos: fundo creme, título em serifa,
um parágrafo curto, sem foto de cabelo e sem informação para consultar depois.
São bonitos de ver e não são úteis de guardar. Daí o zero.

---

## 4. O que muda a partir de agora

### 4.1 Todo artigo vira 3 a 5 artes diferentes, não uma

O algoritmo premia arte nova. Os Pins que mais trazem tráfego são os de imagem
inédita, e uma minoria pequena de Pins responde pela maior parte do tráfego.
Publicar cinco ângulos do mesmo artigo é cinco chances de acertar, não
repetição.

Não é republicar a mesma arte. É imagem, layout e texto diferentes para o mesmo
conteúdo.

### 4.2 Pelo menos um Pin "de consulta" por artigo

Além dos cartões atuais, cada artigo precisa gerar **uma arte que a leitora
queira guardar**. Formatos que funcionam:

- tabela comparativa de produtos, com para quem serve cada um;
- passo a passo numerado da técnica, tudo em uma imagem só;
- calendário ou rotina semanal;
- lista de "o que evitar", com os erros nomeados;
- guia de curvatura, com o que muda entre 2A, 2C, 3B e 4C.

Regra prática: se a imagem responde sozinha e a pessoa vai querer olhar de novo
na hora de lavar o cabelo, ela é salvável. Se ela só anuncia que existe um
artigo, não é.

Essas artes podem ser mais densas que o padrão do site. Aqui, informação vence
elegância.

### 4.3 Cabelo de verdade na imagem

Todos os Pins do topo do nicho mostram cabelo. Os do Curva Viva não mostram
nenhum. As fotos realistas que já são geradas em `midia-social/.../fotos/`
devem aparecer na maioria das artes, mantendo a marcação de IA na plataforma,
como já é feito.

As três personagens ilustradas continuam sendo a identidade do site, mas no
Pinterest elas funcionam melhor como assinatura e cartão final do que como
imagem principal.

### 4.4 Vídeo vertical, quando for possível

O formato 9:16 domina as buscas largas e hoje o Curva Viva não tem nenhum. Não
é urgente, mas é a maior oportunidade não explorada. Um vídeo simples de 15 a
30 segundos mostrando uma técnica já compete.

### 4.5 Frequência

De 20 Pins totais para **3 a 5 Pins novos por dia**, espalhados ao longo do dia
e não em bloco. As primeiras 24 a 48 horas de um Pin definem o quanto ele será
distribuído depois, então concentrar tudo no mesmo minuto desperdiça essa
janela.

Vale a mesma regra dos artigos: variar horário e formato, para a cadência não
ficar mecânica.

---

## 5. Palavras-chave que o próprio Pinterest entrega

O Pinterest mostra os termos relacionados no topo da busca. São a demanda real,
sem achismo. Colhidos em 20 de agosto de 2026:

**Em "cabelo ondulado finalização":** 2a, 2b, 2c, sereia, volume, rolinho,
curto, tesourinha, produtos, topo, masculino.

**Em "cronograma capilar":** crescimento, poroso, produtos, em transição,
química, infantil, barato.

**Em "day after cabelo cacheado":** penteados, penteado fácil, penteado preso,
coque, ideia de penteado, inspo curly hair, camadas, o que fazer.

Esse último merece atenção: no Pinterest, boa parte de quem procura day after
quer **ideia de penteado**, não análise de produto. Vale criar artes que
atendam essa intenção e levem para o conteúdo do site.

O Pinterest também tem um filtro nativo por tipo de cabelo (protetor, crespo,
cacheado, ondulado, liso). Usar esses termos exatos nos títulos e descrições
ajuda a cair na classificação certa.

### Como escrever

- **Título:** a palavra-chave no começo, linguagem de gente. "Cronograma capilar
  para cabelo cacheado poroso" ganha de "Entenda o cronograma".
- **Descrição:** duas ou três frases, com a palavra-chave e os termos vizinhos,
  terminando com um motivo para abrir o artigo.
- **Texto alternativo:** descrever a imagem de verdade, não repetir o título.
- **Pastas:** cada pasta precisa de descrição com palavra-chave. As quatro
  atuais estão bem nomeadas e sem descrição.

---

## 6. Divisão de trabalho

Vale o `PAPEIS.md`. Para o Pinterest:

**Codex:** arte dos Pins, foto, texto, título, descrição, publicação, cadência,
pastas, contestação do bloqueio, registro no `HISTORICO.md`.

**Claude Code:** o que é código do site. Já identificado e pendente:

- meta tag de reivindicação do domínio, quando o token chegar;
- imagem Open Graph própria por artigo, porque hoje **todos os artigos
  compartilham a mesma `/og.png` genérica**, o que empobrece qualquer Pin salvo
  direto do site;
- `article:published_time` e `article:author`, que hoje não existem e são o que
  alimenta o Rich Pin de artigo;
- botão de salvar no Pinterest dentro dos artigos, se for desejado.

---

## 7. Como saber se está funcionando

Na ordem. Não olhe impressão primeiro, ela engana.

1. **Salvamentos.** Hoje é zero. Sair de zero é o primeiro sinal de que a arte
   virou material de consulta.
2. **Cliques de saída.** Só passam a existir depois que o domínio for liberado.
3. **Visitas vindas do Pinterest**, no Google Analytics quando estiver ativo, e
   no painel do Pinterest depois da reivindicação.
4. **Visualizações mensais do perfil.** A menos importante das quatro.

Expectativa honesta de prazo: o Pinterest é lento no começo e acelera. Com o
domínio liberado e cadência diária, tráfego relevante costuma aparecer entre o
segundo e o quarto mês. Antes disso, o que se mede é salvamento.

---

## 8. O que não fazer

- Não apagar nem republicar o que já está publicado só para aplicar este plano.
- Não usar encurtador nem domínio alternativo enquanto o oficial está bloqueado.
- Não repetir a mesma arte em pastas diferentes para simular volume.
- Não encher a descrição de palavra-chave repetida.
- Não prometer resultado que o artigo não sustenta, nem no Pin. A honestidade
  do projeto vale mais que um clique.
- Nada de campanha, impulsionamento ou qualquer ação paga sem autorização
  específica do proprietário.
