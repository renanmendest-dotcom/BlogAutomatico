# Programação do Pinterest: 1 a 7 de setembro de 2026

## Objetivo

Programar 21 Pins orgânicos, três por dia durante sete dias, usando o
desempenho real da conta para priorizar checklists, comparações, decisões de
produto e problemas específicos.

## Composição

- 11 infográficos de consulta;
- 7 fotografias realistas inéditas;
- 3 cartões de produto com embalagens reais;
- 18 CTAs específicos de salvamento;
- 3 CTAs de aprofundamento para produto;
- todos em 1.000 x 1.500 px, proporção 2:3;
- cada promessa numérica entregue integralmente na arte ou na descrição;
- nenhuma peça única usa seta, página, deslize ou falsa indicação de carrossel;
- os destinos usam o endereço público alternativo aceito pelo Pinterest, sem
  parâmetros de rastreamento.

## Cadência em horário de Brasília

| Data | Manhã | Tarde | Noite |
|---|---:|---:|---:|
| 01/09 | 09:00 | 14:30 | 20:00 |
| 02/09 | 09:00 | 13:30 | 19:30 |
| 03/09 | 09:30 | 14:00 | 20:30 |
| 04/09 | 08:30 | 14:00 | 19:30 |
| 05/09 | 09:30 | 15:00 | 20:30 |
| 06/09 | 10:00 | 14:30 | 20:00 |
| 07/09 | 09:00 | 15:30 | 20:30 |

O CSV usa UTC, como exige o importador em massa do Pinterest.

## Arquivos

- Artes públicas: `public/pinterest/programacao-2026-08-31/pin-01.png` a
  `pin-21.png`;
- CSV: `pinterest-bulk.csv`;
- manifesto com texto alternativo: `manifesto-pins.json`;
- análise: `ANALISE-DESEMPENHO.md`;
- revisão visual: `revisao-visual.png`;
- fotos e prompts: `fotos/` e `PROMPTS-IMAGEGEN.md`.

## Revisões

- [x] Pesquisa do desempenho real no Pinterest Analytics;
- [x] Pesquisa de nicho e práticas oficiais sobre CTAs e salvamentos;
- [x] Revisão 1: métricas, fatos, produtos, imagens reais, links, horários,
  textos completos, proporção e ausência de falso carrossel;
- [x] Revisão 2: potencial de clique e salvamento, intenção de busca,
  naturalidade, leitura no celular, contraste, variedade visual e CTA;
- [x] `pnpm validar`, `pnpm check`, `pnpm build` e revisão visual final;
- [x] mídias publicadas no domínio oficial e conferidas com HTTP 200;
- [x] CSV enviado ao Pinterest;
- [x] 21 Pins criados individualmente e confirmados na fila com datas, horários,
  títulos e pastas.

## Estado

As peças e o CSV passaram por todas as validações e as 21 mídias respondem com
HTTP 200 no domínio oficial. O Pinterest confirmou `Upload concluído` em 30 de
agosto, mas em 31 de agosto a fila web e o aplicativo mostravam zero Pins novos.
Nenhum email ou aviso de erro foi emitido. O lote não deve ser reenviado pelo
importador silencioso.

A correção foi concluída em 31 de agosto. O criador individual recusou os links
do domínio principal, com e sem UTM, mas aceitou o endereço público alternativo
`https://blog-automatico-sigma.vercel.app` sem parâmetros. Os 21 Pins foram
criados individualmente para 1 a 7 de setembro e a fila privada foi conferida
integralmente: 21 títulos únicos, cada um com data, horário e pasta corretos.

As sete peças com fotografias geradas receberam as marcações de conteúdo
modificado por IA e de pessoa gerada por IA. Seis rascunhos que haviam entrado
na pasta padrão foram removidos e recriados nas pastas corretas antes da
conferência final.
