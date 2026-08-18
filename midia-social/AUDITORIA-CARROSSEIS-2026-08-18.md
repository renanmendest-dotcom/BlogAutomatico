# Auditoria de carrosséis, 18 de agosto de 2026

## Escopo

Foram conferidos os carrosséis recentes do Pinterest e do TikTok e toda a fila
de Pins agendados. A auditoria aplicou as duas regras absolutas: publicar todas
as imagens planejadas e não repetir pose, expressão facial ou ângulo dentro do
mesmo carrossel.

## Resultado dos publicados

As quantidades dos seis carrosséis recentes estavam completas, mas todos
repetiam ao menos uma composição humana. As artes foram renderizadas novamente
com fotografias diferentes, os substitutos foram publicados e conferidos antes
da remoção das versões antigas.

### Pinterest

Cada substituto contém exatamente cinco imagens navegáveis:

- `1146236542701525867` → `1146236542701571598`
- `1146236542701525976` → `1146236542701571900`
- `1146236542701342527` → `1146236542701572254`
- `1146236542701459645` → `1146236542701572676`
- `1146236542701526097` → `1146236542701572782`

### TikTok

- `7675107568791964948` → `7675358039632858376`
- O substituto contém exatamente oito imagens, está visível para `Todos` e tem
  o rótulo de conteúdo gerado por IA ativado.

## Agendamentos

O Pinterest mantém 16 Pins agendados. Eles são peças individuais planejadas
como imagem única, cada uma com um arquivo de mídia e sem indicação visual de
continuação. Portanto, nenhum agendamento foi apagado ou republicado.

## Segunda auditoria: promessa e entrega

Uma conferência posterior comparou título, arte e CTA com o conteúdo efetivamente
entregue em `mídias + descrição`. Essa revisão encontrou três peças incompletas:

- O Pin público `1146236542701531629` prometia oito erros, mas não os enumerava.
  A descrição foi editada e agora contém os oito itens.
- O agendamento `3777270183128086144` prometia três cremes, mas não dizia quais.
  A descrição agora identifica Widi Care Ondulando a Juba, Salon Line Definição
  Natural e Inoar Meu Cacho, Meu Crush.
- O agendamento `3777270307213954176` prometia comparar sete opções, mas não as
  listava. A descrição agora identifica as sete opções.

Não foi necessário apagar ou republicar essas peças, porque a correção completa
cabia na descrição editável do Pinterest. As demais publicações e os outros 14
agendamentos passaram na conferência: toda promessa numérica ou resposta central
está presente na imagem ou na descrição.

O gerador local agora valida os detalhes obrigatórios de cada promessa numérica
e interrompe a geração se algum item estiver ausente. A regra vale para imagem
única, carrossel, vídeo e qualquer outra publicação em rede social.

## Verificação

- Contagem antes do upload: 5/5 em cada carrossel do Pinterest e 8 imagens no
  editor do TikTok.
- Conferência pública: páginas navegadas após cada publicação.
- Variedade visual: todas as imagens com pessoa agora usam composição, pose,
  expressão ou ângulo distintos dentro do respectivo carrossel.
- Exclusão: cada versão antiga foi removida apenas depois da validação da nova.
- Completude: toda lista, comparação ou quantidade prometida foi confrontada com
  o conteúdo visível na mídia e na descrição.
