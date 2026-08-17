# Programação Pinterest, 16 a 22 de agosto de 2026

## Objetivo

Programar 21 Pins orgânicos no próprio Pinterest, três por dia durante sete
dias, todos com destino no domínio oficial da Curva Viva.

## Cadência

- 16 de agosto: 22h, 22h40 e 23h20, horário de Brasília.
- 17 a 22 de agosto: 9h, 14h e 20h, horário de Brasília.
- O CSV registra os horários em UTC, conforme a documentação de importação em
  massa do Pinterest.

## Estratégia

- Manhã: dúvida prática com resposta inicial clara.
- Tarde: conteúdo salvável, comparativo ou passo a passo.
- Noite: escolha de produto, diagnóstico de rotina ou guia completo.
- Todos os destinos usam `https://www.curvaviva.com.br`.
- As 21 artes são originais e não repetem a mesma combinação de chamada,
  texto e imagem.

## Geração das imagens

Foi usado o gerador de imagens integrado para oito fotografias realistas, sem
texto, logo ou produto inventado. O conjunto de prompts pediu cenas editoriais
verticais de aplicação de óleo nas pontas, definição no cabelo úmido, mousse
na palma, day after com borrifador, secagem com difusor, comparação de texturas,
análise de uma mecha cacheada e enxágue de condicionador. Os arquivos usados
estão em `fotos/` e as peças finais em `public/pinterest/programacao-2026-08-16/`.

## Produtos

As artes de produto usam fotografias reais das embalagens exatas. O recorte é
integrado ao fundo da peça com composição por multiplicação e sombra suave, de
modo que o fundo branco do arquivo de origem não apareça como um retângulo.
Nenhum rótulo foi redesenhado por inteligência artificial.

## Arquivos

- Artes públicas: `public/pinterest/programacao-2026-08-16/pin-01.png` a
  `pin-21.png`.
- CSV de importação: `pinterest-bulk.csv`.
- CSV de recuperação das linhas rejeitadas: `pinterest-bulk-rejeitados.csv`.
- Tamanho das artes: 1.000 × 1.500 px, proporção 2:3.

## Status

- [x] Pautas e destinos definidos.
- [x] Fotografias realistas e embalagens originais reunidas.
- [x] Revisão visual final.
- [x] `pnpm validar`, `pnpm check` e `pnpm build`.
- [x] Arquivos publicados no domínio oficial e verificados com HTTP 200.
- [x] CSV importado no Pinterest às 20h42 de 16 de agosto de 2026.
- [x] Processamento interno do Pinterest concluído e conferido em 17 de agosto.
- [x] O primeiro lote deixou um Pin publicado e 11 Pins na fila privada
  `Pins agendados`, totalizando 12 linhas aceitas.
- [x] As nove linhas rejeitadas com `Duplicar link do Pin` foram reunidas em um
  segundo CSV, com parâmetros de rastreamento únicos por peça.
- [x] Os sete horários futuros originais foram mantidos. As duas peças cujo
  horário já havia passado foram movidas para 23 de agosto, às 9h e 14h.
- [x] O Pinterest aceitou o segundo CSV e a fila passou de 11 para 20 Pins
  agendados. Com o Pin do lote já publicado, as 21 peças estão contabilizadas.
