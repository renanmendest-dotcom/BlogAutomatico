# Programação do Pinterest: 31 de agosto a 6 de setembro de 2026

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
- cada destino tem UTM próprio para evitar duplicidade no importador e medir o
  ângulo criativo.

## Cadência em horário de Brasília

| Data | Manhã | Tarde | Noite |
|---|---:|---:|---:|
| 31/08 | 09:12 | 14:46 | 20:08 |
| 01/09 | 08:57 | 13:33 | 19:44 |
| 02/09 | 09:28 | 14:11 | 20:39 |
| 03/09 | 08:43 | 13:58 | 19:21 |
| 04/09 | 09:36 | 15:07 | 20:18 |
| 05/09 | 10:14 | 14:29 | 19:52 |
| 06/09 | 09:05 | 15:38 | 20:26 |

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
- [ ] CSV enviado ao Pinterest;
- [ ] 21 linhas confirmadas na fila com datas, horários, títulos e pastas.

## Estado

As peças e o CSV estão prontos, passaram por todas as validações e as 21 mídias
respondem com HTTP 200 no domínio oficial. O envio ao Pinterest será registrado
aqui depois da conferência da fila.
