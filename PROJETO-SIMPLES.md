# Combina Casa, versão automática assistida

## Objetivo

Criar um site brasileiro que descubra dúvidas reais sobre casa inteligente e
responda, com fonte e data, se um dispositivo funciona com Alexa, Google Home ou
outros ecossistemas.

Uma vez por semana, a inteligência artificial pesquisa oportunidades, encontra
um produto, consulta fontes técnicas, localiza uma oferta candidata e cria um
rascunho. Uma pessoa decide se o conteúdo será publicado.

## O que existe na primeira versão

1. Site estático em Astro, publicável automaticamente no Vercel.
2. Catálogo com três produtos já apresentados e sete itens na fila de verificação.
3. Três artigos de referência.
4. Validação automática de fonte, data e produto antes de cada build.
5. Atualizador de preço preparado para receber IDs do Mercado Livre.
6. Pesquisa semanal de dúvidas e oportunidades na internet.
7. Pesquisa de fabricante e anúncio candidato.
8. Redação preparada para busca, leitura rápida e perguntas frequentes.
9. Um único rascunho por vez, aberto para aprovação no GitHub.
10. Publicação automática somente depois da aprovação.
11. Arquivo `PAUSE` como botão de emergência para as automações.

## O que foi adiado

- Quatro agentes separados.
- Publicação sem aprovação.
- Horários aleatórios.
- Histórico completo de preços.
- Painel e integrações com Search Console.
- Testes automáticos em outras IAs.
- Geração automática de links de afiliado, pois o programa exige a conta do
  proprietário.

## Regra principal

Uma afirmação sem fonte vira “não verificado”. Preço ausente não é estimado.
Conteúdo sobre dimensionamento ou instalação elétrica não é produzido.
