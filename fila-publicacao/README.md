# Depósito editorial da Curva Viva

Esta pasta guarda artigos que **não estão publicados**. O Astro carrega apenas
os arquivos de `src/data/posts/`, portanto nada daqui entra no site, no sitemap
ou na busca interna.

## Estado dos textos

Os arquivos em `artigos/` são rascunhos editoriais completos: já têm pergunta,
resposta curta, estrutura, tabela, desenvolvimento, checklist, FAQ, fontes-base
e plano de imagens. Eles não são copiáveis às cegas para a área pública porque
produto, fórmula, disponibilidade, preço, imagem e link de compra mudam.

Antes de publicar qualquer um:

1. confirmar que não surgiu outro artigo com a mesma intenção de busca;
2. reler as fontes oficiais e atualizar todas as afirmações factuais;
3. escolher de 3 a 10 produtos no ranking e cadastrar as fichas completas;
4. gerar o link de afiliado na conta conectada e conferir imagem e oferta;
5. criar as quatro ilustrações indicadas no plano visual do rascunho;
6. converter o cabeçalho para o schema de `src/data/posts/`;
7. fazer as duas revisões independentes do manual editorial;
8. rodar validação, Astro Check, build e revisão visual;
9. só então mover uma cópia para `src/data/posts/` e publicar.

Datas e preços não ficam congelados no depósito. Eles são preenchidos no dia da
publicação para não transformar um rascunho antigo em informação enganosa.

## Cadência sugerida

A fila foi montada para 5 a 7 artigos por semana. Nas execuções de segunda,
quarta e sexta, publique um ou dois textos, em horários variados e nunca no
mesmo minuto. Alterne ranking, comparativo e educativo; não publique uma semana
inteira com títulos e estruturas idênticas.

## Arquivos de controle

- `PESQUISA-CONCORRENTES.md`: evidências e decisões que originaram a fila.
- `FILA.md`: ordem sugerida, intenção, formato e cluster editorial.
- `artigos/`: rascunhos completos, ainda isolados do site.
