# Programação do Pinterest — 24 a 30 de agosto de 2026

## Objetivo

Programar 21 Pins orgânicos, três por dia durante sete dias, somente no
Pinterest. O lote começa na manhã seguinte ao último agendamento registrado,
que está previsto para 23 de agosto de 2026 às 14h, horário de Brasília.

## Composição

- 7 artigos, com 3 ângulos diferentes por artigo.
- 14 Pins com fotografias realistas inéditas.
- 7 infográficos de consulta, um por artigo.
- Todos em 1.000 × 1.500 px, proporção 2:3.
- Todos entregam a resposta central na arte ou na descrição.
- Nenhum Pin único usa seta, numeração de página ou chamada para deslizar.
- Cada destino leva ao artigo correspondente com UTM exclusivo.

## Cadência em horário de Brasília

| Data | Manhã | Tarde | Noite |
|---|---:|---:|---:|
| 24/08 | 09:18 | 14:37 | 20:11 |
| 25/08 | 08:52 | 13:41 | 19:26 |
| 26/08 | 10:07 | 15:22 | 20:03 |
| 27/08 | 09:34 | 14:06 | 20:48 |
| 28/08 | 08:41 | 13:19 | 19:57 |
| 29/08 | 10:26 | 15:43 | 20:12 |
| 30/08 | 09:09 | 14:54 | 20:32 |

O CSV usa UTC, conforme a documentação oficial do importador em massa do
Pinterest. Os horários variam deliberadamente e as pautas são alternadas para
evitar cadência mecânica.

## Arquivos

- Artes públicas: `public/pinterest/programacao-2026-08-24/pin-01.png` a
  `pin-21.png`.
- CSV: `pinterest-bulk.csv`.
- Manifesto com texto alternativo: `manifesto-pins.json`.
- Revisão visual: `revisao-visual.png`.
- Fotografias e prompts: `fotos/` e `PROMPTS-IMAGEGEN.md`.

## Revisões

- [x] Pesquisa de consultas e padrões do Pinterest.
- [x] Revisão 1: fatos, coerência, promessa completa, links, horários, imagens,
  proporção e ausência de falso carrossel.
- [x] Revisão 2: intenção de busca, potencial de salvamento, leitura no celular,
  variedade visual, voz natural e CTA.
- [ ] Arquivos publicados no domínio oficial e conferidos com HTTP 200.
- [ ] Fila atual conferida ao vivo no Pinterest.
- [ ] CSV enviado no Pinterest.
- [ ] As 21 linhas confirmadas na fila privada com datas, horários e pastas.
- [ ] Texto alternativo aplicado ou conferido em cada Pin, quando a interface
  permitir a edição do agendamento.

## Pendência de navegador

O Chrome está aberto e a extensão está instalada e habilitada, mas o registro
do componente de comunicação da extensão está ausente no Windows. Pela regra
da integração, o agente não deve reparar esse componente. É necessário
reinstalar o plugin de navegador pela interface de plugins do Codex e então
retomar a conferência e o envio.

