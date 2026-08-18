# Correção dos Pins, 17 de agosto de 2026

## Causa do erro

O lote original foi importado por CSV, formato que cria apenas um arquivo de
mídia por linha. As artes únicas continham uma seta de continuidade, o que
prometia outra página sem existir um carrossel. A revisão anterior conferiu os
arquivos, mas não comparou a quantidade de páginas da peça com a quantidade
exibida na página pública.

## Pesquisa no Pinterest

Antes da correção foram pesquisadas as consultas `cabelo ondulado`,
`finalização cabelo ondulado` e `creme para cabelo ondulado`. Os padrões úteis
observados foram: promessa direta na capa, correspondência exata com a busca,
close de textura, cabelo ocupando grande parte do quadro, produto real em
contexto e variação de frente, perfil, costas, mãos e enquadramento sem rosto.

## Correções

- Os três Pins únicos já publicados foram substituídos por carrosséis reais de
  cinco páginas e só então excluídos.
- Cada carrossel termina com logo redonda, pedido para seguir
  `@curvavivaoficial` e convite para acessar `curvaviva.com.br`.
- As 18 peças futuras foram canceladas antes da nova importação.
- As 21 capas únicas foram renderizadas novamente sem seta ou indicação de
  deslize. O CSV corrigido contém as 18 peças futuras e usa URLs de mídia
  diferentes das versões antigas.
- O conjunto visual passou a alternar perfil, costas, close de cabelo, mãos,
  aplicação, difusor, day after e embalagens reais recortadas.
- A regra permanente foi adicionada a `.github/INSTRUCOES-IA.md`.

## Carrosséis publicados

- Óleo de argan: https://br.pinterest.com/pin/1146236542701525867/
- Três ajustes de definição: https://br.pinterest.com/pin/1146236542701525976/
- Umidade uniforme: https://br.pinterest.com/pin/1146236542701526097/

Os três endereços públicos mostram cinco imagens e apontam para o domínio
oficial da Curva Viva.

## Revisão 1

Conferidos os três carrosséis página por página, os títulos, descrições,
destinos, domínio, proporção 2:3, logo, quantidade de cinco imagens e cartão
final. As capas únicas foram validadas para não conter `deslize`, `arraste`,
`para o lado` ou seta. As embalagens continuam sendo fotografias reais e não
apresentam retângulo branco visível.

## Revisão 2

Conferidos intenção de busca, clareza do gancho, leitura no celular, repetição
visual, naturalidade, hierarquia, CTA e coerência entre a promessa da capa e o
formato publicado. A revisão pública do perfil confirmou os três carrosséis com
cinco imagens cada e capas visualmente diferentes.

## Testes e processamento

- `pnpm validar`: passou.
- `pnpm check`: passou sem erros ou avisos.
- `pnpm build`: passou, 43 páginas geradas.
- Revisão visual: `revisao-visual-carrosseis.png` e
  `../programacao-2026-08-16/revisao-visual-v2.png`.
- Commit dos arquivos: `a360e9d`.
- O Pinterest aceitou `pinterest-bulk-corrigido.csv` e informou que os 18 Pins
  estão sendo criados. O processamento pode levar até duas horas e a plataforma
  enviará email se alguma linha precisar de correção.

Nenhuma campanha, patrocínio, orçamento ou cobrança foi criado.

## Auditoria adicional de 18 de agosto de 2026

A quantidade de cinco páginas estava correta, mas as três versões repetiam
composições humanas. Elas foram substituídas por artes com pose, expressão e
ângulo diferentes em cada página com pessoa. Os novos Pins foram conferidos
página por página antes da exclusão dos anteriores:

- Óleo de argan: https://br.pinterest.com/pin/1146236542701571598/
- Três ajustes de definição: https://br.pinterest.com/pin/1146236542701571900/
- Umidade uniforme: https://br.pinterest.com/pin/1146236542701572782/
