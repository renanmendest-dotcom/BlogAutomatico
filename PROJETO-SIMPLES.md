# Combina Casa — versão simples

## Objetivo

Criar um site brasileiro que responda, com fonte e data, se um dispositivo de
casa inteligente funciona com Alexa, Google Home ou outros ecossistemas.

O site começa pequeno e assistido. A automação publica apenas depois que o
processo provar que consegue produzir rascunhos corretos.

## O que existe na primeira versão

1. Site estático em Astro, hospedável gratuitamente no Cloudflare Pages.
2. Catálogo com três produtos já apresentados e sete itens na fila de verificação.
3. Três artigos de referência.
4. Validação automática de fonte, data e produto antes de cada build.
5. Atualizador de preço preparado para receber IDs do Mercado Livre.
6. Um botão no GitHub para pedir um rascunho ao Claude.
7. O rascunho abre uma solicitação de aprovação; ele não é publicado sozinho.
8. Arquivo `PAUSE` como botão de emergência para as automações.

## O que foi adiado

- Pesquisa automática de pautas.
- Quatro agentes separados.
- Publicação sem aprovação.
- Horários aleatórios.
- Histórico completo de preços.
- Painel e integrações com Search Console.
- Testes automáticos em outras IAs.

## Regra principal

Uma afirmação sem fonte vira “não verificado”. Preço ausente não é estimado.
Conteúdo sobre dimensionamento ou instalação elétrica não é produzido.
