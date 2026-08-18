# Autonomia do projeto

**Antes de mexer em qualquer coisa, leia [HISTORICO.md](./HISTORICO.md).** Ele
conta o estado atual do projeto, o que já foi decidido e o que está em aberto.
Ao terminar um trabalho, acrescente uma entrada lá.

A divisão de responsabilidade entre as duas IAs está em [PAPEIS.md](./PAPEIS.md).
Em resumo: o Claude Code cuida do design e do front-end, o Codex cuida do
conteúdo e das publicações. Leia esse arquivo antes de mexer em algo que não é
da sua área.

O proprietário autoriza os agentes de IA deste projeto, Codex e Claude Code, a
executar, sem nova consulta, as ações normais necessárias para concluir este
projeto, incluindo:

- editar e criar arquivos do site;
- executar testes e corrigir erros;
- criar commits e enviar alterações ao GitHub;
- publicar pela integração com a Vercel;
- conferir o site público depois da publicação;
- pesquisar produtos e gerar links na conta de afiliado já conectada.

Não interromper o trabalho apenas para pedir autorização para `commit`, `push`,
nova implantação ou correções necessárias ao objetivo já aprovado.

## Publicação automática

- O Codex e o Claude Code estão autorizados a trabalhar neste projeto.
- Não abrir pull request nem aguardar aprovação humana para artigos novos.
- Antes de publicar, fazer duas revisões independentes.
- A primeira revisão confere fatos, fontes, produto, link, imagem e coerência.
- A segunda revisão confere potencial de clique, intenção de busca, linguagem
  natural, retenção, SEO, leitura no celular e qualidade da recomendação.
- Publicar diretamente em `main` somente quando as duas revisões e todos os
  testes passarem.
- Publicar no máximo dois artigos por execução automática, nunca no mesmo
  minuto e variando o horário entre execuções, para a cadência não ficar
  mecânica. As regras de volume, formato e imagem estão em
  `.github/INSTRUCOES-IA.md`.

## Acesso ao Mercado Livre

- O portal de afiliados do Mercado Livre deve ser operado exclusivamente no
  Chrome do proprietário, já autenticado pela extensão do Codex.
- Nunca usar o navegador interno do Codex para pesquisar ofertas, abrir a conta
  de afiliado ou gerar links `meli.la`.
- Se o Chrome não estiver aberto, conectado ou autenticado, interromper apenas
  essa etapa e pedir ao proprietário que deixe o navegador pronto.

## Linguagem pública e produtos

- Nunca expor no site pedidos do proprietário, regras internas, decisões de
  layout, etapas de revisão ou explicações sobre como o conteúdo foi produzido.
- Quando uma informação do produto estiver ausente, omitir o campo público em
  vez de mostrar avisos como "não informado" ou "não encontrado".
- Todo produto público deve ter imagem, descrição e botão de compra juntos no
  mesmo bloco, com contraste forte e leitura fácil no celular.
- Priorizar sempre a solução prática para a leitora.

## Regra absoluta para carrosséis em redes sociais

- Sempre verificar se **todas** as imagens planejadas foram anexadas antes de
  publicar qualquer carrossel, em qualquer rede social.
- Dentro do mesmo carrossel, nenhuma imagem com pessoa pode repetir pose,
  expressão facial ou ângulo já usados em outra imagem. Cada aparição precisa
  ser visualmente diferente de todas as demais do conjunto.
- Recortar, espelhar, aproximar, mudar o fundo ou trocar apenas o texto não
  transforma a mesma pose e expressão em uma imagem diferente.
- Depois da publicação, abrir a postagem pública e conferir uma por uma, na
  ordem, até a última imagem. A quantidade pública precisa ser exatamente igual
  à quantidade de arquivos planejados.
- Conferência por amostragem, prévia parcial, miniatura da capa ou confirmação
  de upload não servem como prova de carrossel completo.
- Se não for possível confirmar a contagem completa antes e depois da
  publicação, não concluir nem declarar a postagem como publicada. Registrar a
  pendência e interromper somente essa publicação.
- Importação ou ferramenta que aceite uma única mídia por item não cria
  carrossel. Nesse caso, usar o fluxo próprio de múltiplas imagens da rede ou
  não publicar como carrossel.

Esta autorização não inclui informar ou armazenar senhas no projeto, realizar
compras, alterar dados financeiros ou de segurança, apagar conteúdo de forma
irreversível ou ampliar o objetivo do projeto para algo diferente do solicitado.
