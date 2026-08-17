import { chromium } from 'playwright';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..', '..');
const publicDir = join(root, 'public', 'pinterest', 'programacao-2026-08-16');
const correctionPhotoDir = join(root, 'midia-social', 'pinterest', 'correcao-2026-08-17', 'fotos');
const logo = join(root, 'public', 'logo-curva-viva.png');
const site = 'https://www.curvaviva.com.br';

const boards = {
  ondas: 'Cabelo ondulado: leveza e definição',
  cachos: 'Cabelo cacheado: definição e cuidado',
  finalizacao: 'Finalização e day after',
  produtos: 'Produtos para cabelos com curvatura',
};

const pins = [
  {
    id: '01', kind: 'photo', photo: 'foto-oleo.png', palette: 'peach',
    eyebrow: 'ONDAS LEVES', headline: 'Óleo de argan pesa nas ondas?',
    body: 'A dose e o lugar da aplicação mudam tudo. Comece pelas pontas e avalie só depois de seco.',
    cta: 'Veja como testar sem pesar',
    title: 'Óleo de argan pesa no cabelo ondulado? Veja como usar',
    description: 'Óleo no cabelo ondulado pode dar acabamento sem apagar o movimento. Veja onde aplicar, como ajustar a quantidade e quais sinais observar depois que as ondas secarem.',
    link: '/artigos/oleo-de-argan-pesa-no-cabelo-ondulado/', board: boards.ondas,
    publish: '2026-08-17T01:00:00', keywords: 'cabelo ondulado, óleo de argan, ondas leves, frizz',
  },
  {
    id: '02', kind: 'photo', photo: 'foto-oleo.png', palette: 'sage',
    eyebrow: 'SALVE ESTE TESTE', headline: '3 sinais de excesso de óleo',
    body: 'Raiz baixa, mechas coladas e toque carregado depois de seco pedem menos produto na próxima lavagem.',
    cta: 'Entenda cada sinal',
    title: '3 sinais de excesso de óleo no cabelo ondulado',
    description: 'Suas ondas perderam volume depois do óleo? Estes sinais ajudam a diferenciar acabamento de excesso e a ajustar uma coisa por vez na próxima finalização.',
    link: '/artigos/oleo-de-argan-pesa-no-cabelo-ondulado/', board: boards.finalizacao,
    publish: '2026-08-17T01:40:00', keywords: 'óleo no cabelo, cabelo ondulado pesado, finalização, ondas',
  },
  {
    id: '03', kind: 'product', products: ['lola-argan-oil-50ml.webp'], palette: 'rose',
    eyebrow: 'PRODUTO EM FOCO', headline: 'Lola Argan Oil 50 mL',
    body: 'A marca orienta pouca quantidade no comprimento e nas pontas. Faz sentido para quem busca acabamento localizado.',
    cta: 'Leia a análise completa',
    title: 'Lola Argan Oil 50 mL: para quem faz sentido?',
    description: 'O Lola Argan Oil 50 mL combina com uma finalização leve? Veja a indicação oficial, o modo de uso e como testar o óleo nas pontas sem mudar toda a rotina.',
    link: '/artigos/oleo-de-argan-pesa-no-cabelo-ondulado/', board: boards.produtos,
    publish: '2026-08-17T02:20:00', keywords: 'Lola Argan Oil, óleo de argan, cabelo ondulado, finalizador',
  },
  {
    id: '04', kind: 'photo', photo: 'foto-definicao.png', palette: 'lavender',
    eyebrow: 'DEFINIÇÃO SEM PESO', headline: 'Ondulado não define? Faça 3 ajustes',
    body: 'Molhe por igual, reduza a dose e pare de tocar enquanto seca. Pequenos ajustes deixam o teste mais claro.',
    cta: 'Veja os erros mais comuns',
    title: 'Cabelo ondulado não define? Comece por estes 3 ajustes',
    description: 'Se as ondas somem durante a secagem, o problema pode estar na água, na dose ou no excesso de manipulação. Veja oito erros comuns e como testar cada ajuste.',
    link: '/artigos/cabelo-ondulado-nao-define-erros/', board: boards.ondas,
    publish: '2026-08-17T12:00:00', keywords: 'cabelo ondulado não define, finalizar ondas, cabelo 2A 2B 2C',
  },
  {
    id: '05', kind: 'photo', photo: 'foto-definicao.png', palette: 'sky',
    eyebrow: 'DETALHE QUE MUDA TUDO', headline: 'Finalize com o cabelo úmido por igual',
    body: 'Partes quase secas recebem o produto de outro jeito. Borrife água antes de continuar a finalização.',
    cta: 'Aprenda o passo a passo',
    title: 'Por que finalizar o cabelo ondulado úmido por igual?',
    description: 'Uma mecha quase seca e outra molhada podem responder de formas diferentes ao mesmo finalizador. Veja como uniformizar a umidade e distribuir melhor o produto.',
    link: '/artigos/cabelo-ondulado-nao-define-erros/', board: boards.finalizacao,
    publish: '2026-08-17T17:00:00', keywords: 'finalização cabelo ondulado, cabelo úmido, ondas definidas',
  },
  {
    id: '06', kind: 'photo', photo: 'foto-definicao.png', palette: 'peach',
    eyebrow: 'GUIA COMPLETO', headline: '8 erros que desmontam as ondas',
    body: 'Do excesso de creme ao toque durante a secagem. Descubra o que ajustar sem trocar todos os produtos.',
    cta: 'Confira os 8 erros',
    title: '8 erros que fazem o cabelo ondulado perder definição',
    description: 'As ondas não duram ou ficam sem forma? Reunimos oito erros de finalização que podem atrapalhar a definição e um teste simples para cada um.',
    link: '/artigos/cabelo-ondulado-nao-define-erros/', board: boards.ondas,
    publish: '2026-08-17T23:00:00', keywords: 'erros cabelo ondulado, definição, finalização ondulada, frizz',
  },
  {
    id: '07', kind: 'product', products: ['widi-ondulando.png', 'salon-line-definicao.png', 'inoar-meu-cacho.png'], palette: 'sage',
    eyebrow: 'COMPARATIVO', headline: 'Creme pesa nas ondas? Compare 3 escolhas',
    body: 'Indicação, tamanho e modo de uso ajudam a escolher. A dose pequena continua sendo o melhor primeiro teste.',
    cta: 'Compare as três opções',
    title: 'Creme para cabelo ondulado sem pesar: compare 3 opções',
    description: 'Compare Widi Care Ondulando a Juba, Salon Line Definição Natural e Inoar Meu Cacho Meu Crush por indicação, tamanho e forma de uso.',
    link: '/artigos/melhores-cremes-para-cabelo-ondulado-sem-pesar/', board: boards.produtos,
    publish: '2026-08-18T12:00:00', keywords: 'creme cabelo ondulado, creme sem pesar, Widi Care, Salon Line, Inoar',
  },
  {
    id: '08', kind: 'product', products: ['widi-ondulando.png'], palette: 'sky',
    eyebrow: 'ONDAS 2A, 2B E 2C', headline: 'Widi Ondulando a Juba: o que conferir',
    body: 'É a indicação mais específica do comparativo. Ainda assim, quantidade e distância da raiz fazem diferença.',
    cta: 'Veja pontos fortes e atenção',
    title: 'Widi Care Ondulando a Juba: vale para suas ondas?',
    description: 'O creme Widi Care Ondulando a Juba foi desenvolvido para ondas. Veja por que ele liderou o comparativo e o que observar antes de aumentar a dose.',
    link: '/artigos/melhores-cremes-para-cabelo-ondulado-sem-pesar/', board: boards.produtos,
    publish: '2026-08-18T17:00:00', keywords: 'Widi Ondulando a Juba, creme para ondas, cabelo 2A 2B 2C',
  },
  {
    id: '09', kind: 'product', products: ['widi-ondulando.png', 'salon-line-definicao.png', 'inoar-meu-cacho.png'], palette: 'rose',
    eyebrow: 'ESCOLHA COM CALMA', headline: '3 cremes para ondulado sem pesar',
    body: 'Uma opção focada em ondas, uma embalagem econômica e uma escolha versátil para várias curvaturas.',
    cta: 'Descubra qual combina com você',
    title: '3 cremes para cabelo ondulado sem pesar',
    description: 'Quer definição sem derrubar o volume? Veja três cremes de pentear para cabelo ondulado e escolha pela proposta, tamanho e necessidade da sua rotina.',
    link: '/artigos/melhores-cremes-para-cabelo-ondulado-sem-pesar/', board: boards.ondas,
    publish: '2026-08-18T23:00:00', keywords: 'melhor creme ondulado, ondas sem pesar, creme de pentear',
  },
  {
    id: '10', kind: 'photo', photo: 'foto-mousse.png', palette: 'lavender',
    eyebrow: 'ONDULADO FINO', headline: 'Mousse funciona sem pesar?',
    body: 'A espuma pode substituir o creme no primeiro teste, mas a textura sozinha não garante leveza.',
    cta: 'Veja como testar',
    title: 'Mousse funciona no cabelo ondulado fino sem pesar?',
    description: 'Quando o creme derruba o volume, o mousse pode ser uma alternativa. Entenda como usar pouca quantidade e quando vale testar sem creme por baixo.',
    link: '/artigos/mousse-para-cabelo-ondulado-fino-funciona-sem-pesar/', board: boards.ondas,
    publish: '2026-08-19T12:00:00', keywords: 'mousse cabelo ondulado, ondulado fino, volume, finalização leve',
  },
  {
    id: '11', kind: 'product', products: ['widi-juba-mousse.webp'], palette: 'peach',
    eyebrow: 'PRODUTO EM FOCO', headline: 'Juba Mousse 200 mL: para quem faz sentido?',
    body: 'A marca inclui ondulados na indicação e permite usar o mousse puro ou depois do creme.',
    cta: 'Leia antes de escolher',
    title: 'Widi Care Juba Mousse 200 mL: para quem faz sentido?',
    description: 'Veja a indicação oficial do Widi Care Juba Mousse, como a marca orienta aplicar e por que ele pode entrar num teste de finalização com menos camadas.',
    link: '/artigos/mousse-para-cabelo-ondulado-fino-funciona-sem-pesar/', board: boards.produtos,
    publish: '2026-08-19T17:00:00', keywords: 'Juba Mousse, Widi Care, mousse ondulado, finalizador',
  },
  {
    id: '12', kind: 'photo', photo: 'foto-comparacao.png', palette: 'sage',
    eyebrow: 'TEXTURA E FIXAÇÃO', headline: 'Creme ou gelatina: qual escolher?',
    body: 'Creme tende a priorizar maciez. Gelatina costuma entrar quando a forma precisa durar mais.',
    cta: 'Compare sem complicar',
    title: 'Creme de pentear ou gelatina: qual escolher?',
    description: 'Creme e gelatina não fazem exatamente o mesmo papel. Compare maciez, definição, fixação e descubra qual textura atende melhor a sua prioridade.',
    link: '/artigos/creme-de-pentear-ou-gelatina-qual-escolher-2026/', board: boards.finalizacao,
    publish: '2026-08-19T23:00:00', keywords: 'creme ou gelatina, finalização, definição, cabelo cacheado ondulado',
  },
  {
    id: '13', kind: 'photo', photo: 'foto-comparacao.png', palette: 'sky',
    eyebrow: 'ORDEM DA FINALIZAÇÃO', headline: 'Gelatina antes ou depois do creme?',
    body: 'Na rotina mais comum, o creme entra primeiro e a gelatina por cima. Mas a dose é parte da resposta.',
    cta: 'Veja a ordem e os ajustes',
    title: 'Gelatina antes ou depois do creme de pentear?',
    description: 'Descubra a ordem mais comum entre creme e gelatina, quando usar os dois e como reduzir a quantidade se o cabelo ficar pesado ou rígido.',
    link: '/artigos/gelatina-antes-ou-depois-do-creme-de-pentear-2026/', board: boards.finalizacao,
    publish: '2026-08-20T12:00:00', keywords: 'gelatina antes ou depois do creme, finalização, cachos definidos',
  },
  {
    id: '14', kind: 'photo', photo: 'foto-lavagem.png', palette: 'rose',
    eyebrow: 'NÃO É TUDO IGUAL', headline: 'Leave-in ou creme de pentear?',
    body: 'A diferença está na proposta, na textura e no acabamento. O nome sozinho não decide o que vai pesar.',
    cta: 'Entenda qual escolher',
    title: 'Leave-in ou creme de pentear: qual é melhor?',
    description: 'Leave-in e creme de pentear podem parecer iguais, mas a proposta e o acabamento mudam. Veja o que observar no rótulo e na sua rotina.',
    link: '/artigos/leave-in-ou-creme-de-pentear/', board: boards.finalizacao,
    publish: '2026-08-20T17:00:00', keywords: 'leave-in ou creme de pentear, finalização, cabelo cacheado ondulado',
  },
  {
    id: '15', kind: 'photo', photo: 'foto-lavagem.png', palette: 'lavender',
    eyebrow: 'ALERTA DE EXCESSO', headline: '3 sinais de finalização pesada',
    body: 'Pouco movimento, raiz baixa e sensação de resíduo. Ajuste uma camada por vez para achar a causa.',
    cta: 'Simplifique sua rotina',
    title: '3 sinais de que a finalização está pesada',
    description: 'Seu cabelo seca sem movimento e com sensação de resíduo? Veja sinais de excesso e como descobrir se o problema está na dose ou na soma de camadas.',
    link: '/artigos/leave-in-ou-creme-de-pentear/', board: boards.finalizacao,
    publish: '2026-08-20T23:00:00', keywords: 'finalização pesada, cabelo sem volume, excesso de produto',
  },
  {
    id: '16', kind: 'photo', photo: 'foto-difusor.png', palette: 'peach',
    eyebrow: 'SECAGEM COM DIFUSOR', headline: 'Precisa de protetor térmico?',
    body: 'O difusor usa calor. Escolha um produto que declare proteção térmica e siga a orientação da embalagem.',
    cta: 'Veja como proteger os fios',
    title: 'Precisa usar protetor térmico no difusor?',
    description: 'O difusor distribui o ar, mas continua usando calor. Entenda quando aplicar proteção térmica e quais cuidados ajudam na secagem de ondas e cachos.',
    link: '/artigos/precisa-usar-protetor-termico-no-difusor/', board: boards.finalizacao,
    publish: '2026-08-21T12:00:00', keywords: 'protetor térmico difusor, secar cachos, cabelo ondulado',
  },
  {
    id: '17', kind: 'photo', photo: 'foto-day-after.png', palette: 'sage',
    eyebrow: 'DIA SEGUINTE', headline: 'Day after: umedeça ou lave?',
    body: 'Se couro cabeludo e fios estão confortáveis, umedecer só as partes amassadas pode ser suficiente.',
    cta: 'Recupere sem encharcar',
    title: 'Day after: umedecer os cachos ou lavar de novo?',
    description: 'Nem todo day after pede lavagem completa. Veja quando umedecer só as áreas amassadas e como evitar acrescentar produto demais.',
    link: '/artigos/como-recuperar-os-cachos-no-day-after-sem-lavar/', board: boards.finalizacao,
    publish: '2026-08-21T17:00:00', keywords: 'day after cachos, recuperar cachos, cabelo cacheado',
  },
  {
    id: '18', kind: 'photo', photo: 'foto-day-after.png', palette: 'sky',
    eyebrow: 'SALVE PARA AMANHÃ', headline: '3 passos para recuperar os cachos',
    body: 'Separe as áreas amassadas, borrife pouca água e modele apenas o que perdeu forma.',
    cta: 'Veja o guia completo',
    title: '3 passos para recuperar os cachos no day after',
    description: 'Recupere o desenho dos cachos sem molhar tudo: identifique as áreas amassadas, use pouca água e modele apenas as mechas que perderam forma.',
    link: '/artigos/como-recuperar-os-cachos-no-day-after-sem-lavar/', board: boards.cachos,
    publish: '2026-08-21T23:00:00', keywords: 'recuperar cachos, day after, cachos definidos',
  },
  {
    id: '19', kind: 'photo', photo: 'foto-cacheada.png', palette: 'rose',
    eyebrow: 'ESCOLHA MAIS CLARA', headline: 'Melhor creme para cacheados: como escolher',
    body: 'Cruze espessura do fio, acabamento desejado, tamanho e modo de uso antes de olhar só para a promessa.',
    cta: 'Compare 7 opções',
    title: 'Melhores cremes para cabelo cacheado: como escolher',
    description: 'Compare sete cremes de pentear para cabelo cacheado e escolha por proposta, espessura do fio, tamanho e acabamento desejado.',
    link: '/artigos/melhores-cremes-de-pentear-para-cabelo-cacheado/', board: boards.cachos,
    publish: '2026-08-22T12:00:00', keywords: 'melhor creme cabelo cacheado, creme de pentear, cachos definidos',
  },
  {
    id: '20', kind: 'product', products: ['lola-meu-cacho.webp'], palette: 'lavender',
    eyebrow: 'PRODUTO EM FOCO', headline: 'Lola Meu Cacho Minha Vida',
    body: 'A marca direciona o creme aos fios cacheados, com proposta de desembaraço, maciez e definição.',
    cta: 'Veja para qual cabelo serve',
    title: 'Lola Meu Cacho Minha Vida: para qual cabelo serve?',
    description: 'Veja a indicação oficial do Lola Meu Cacho Minha Vida 500 g, os ingredientes destacados e como começar com pouca quantidade no cabelo úmido.',
    link: '/artigos/lola-meu-cacho-minha-vida-para-qual-cabelo/', board: boards.produtos,
    publish: '2026-08-22T17:00:00', keywords: 'Lola Meu Cacho Minha Vida, creme cacheado, creme de pentear',
  },
  {
    id: '21', kind: 'product', products: ['skala-mais-cachos.webp'], palette: 'sage',
    eyebrow: 'DÚVIDA DE QUEM TEM ONDAS', headline: 'Skala Mais Cachos serve para ondulado?',
    body: 'A indicação principal é para cacheados, crespos, crespíssimos e transição. Onduladas devem testar pouca quantidade.',
    cta: 'Leia antes de comprar',
    title: 'Skala Mais Cachos serve para cabelo ondulado?',
    description: 'A Skala direciona o Mais Cachos a cacheados, crespos, crespíssimos e transição. Veja o que uma pessoa ondulada deve observar antes de comprar.',
    link: '/artigos/skala-mais-cachos-serve-para-cabelo-ondulado/', board: boards.produtos,
    publish: '2026-08-22T23:00:00', keywords: 'Skala Mais Cachos, cabelo ondulado, creme 3 em 1',
  },
];

const palettes = {
  peach: ['#fff5ea', '#e77659', '#682f32'],
  sage: ['#f2f6e9', '#718666', '#26433c'],
  rose: ['#fff1f3', '#b86779', '#5b2637'],
  lavender: ['#f5f0fb', '#846eaa', '#332b55'],
  sky: ['#eef8f8', '#4f8b91', '#204247'],
};

const correctedPhotos = new Map([
  ['01', '03-oleo-pontas-perfil.png'],
  ['02', '04-textura-sem-rosto.png'],
  ['04', '02-close-mecha-umida.png'],
  ['05', '01-umidade-uniforme.png'],
  ['06', '04-textura-sem-rosto.png'],
  ['10', '05-mousse-vista-superior.png'],
  ['12', '08-close-cacho.png'],
  ['13', '02-close-mecha-umida.png'],
  ['14', '04-textura-sem-rosto.png'],
  ['15', '08-close-cacho.png'],
  ['16', '06-difusor-lateral.png'],
  ['17', '07-day-after-janela.png'],
  ['18', '08-close-cacho.png'],
  ['19', '07-day-after-janela.png'],
]);

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

function mimeType(path) {
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function imageUrl(path) {
  const data = await readFile(path);
  return `data:${mimeType(path)};base64,${data.toString('base64')}`;
}

async function cardHtml(pin, productSources) {
  const [light, accent, ink] = palettes[pin.palette];
  const media = pin.kind === 'photo'
    ? `<img class="photo" src="${await imageUrl(correctedPhotos.has(pin.id) ? join(correctionPhotoDir, correctedPhotos.get(pin.id)) : join(here, 'fotos', pin.photo))}" alt="">`
    : `<div class="product-stage">${pin.products.map((product, index) => `<img class="product product-${index + 1}" src="${productSources.get(product)}" alt="">`).join('')}</div>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:1000px;height:1500px;overflow:hidden}
    body{font-family:Arial,Helvetica,sans-serif;background:${light};color:${ink}}
    .card{position:relative;width:1000px;height:1500px;overflow:hidden;background:${light}}
    .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 46%}
    .photo-shade{position:absolute;inset:0;background:linear-gradient(180deg,${light} 0%,${light}F4 34%,${light}7A 56%,${ink}14 78%,${ink}B8 100%)}
    .blob{position:absolute;border-radius:999px;background:${accent};opacity:.16}.b1{width:510px;height:510px;right:-190px;top:-130px}.b2{width:420px;height:420px;left:-180px;bottom:100px}
    .product-stage{position:absolute;left:40px;right:40px;top:590px;height:620px;display:flex;align-items:center;justify-content:center;gap:8px;padding:34px;border-radius:60px;background:linear-gradient(145deg,#ffffffa8,${accent}24);box-shadow:0 28px 70px #0000001c;isolation:isolate}
    .product{max-width:46%;max-height:560px;object-fit:contain;mix-blend-mode:multiply;filter:drop-shadow(0 28px 22px #00000036);-webkit-mask-image:radial-gradient(ellipse 58% 58% at center,#000 68%,transparent 100%);mask-image:radial-gradient(ellipse 58% 58% at center,#000 68%,transparent 100%)}
    .product-stage .product:first-child:nth-last-child(3),.product-stage .product:first-child:nth-last-child(3)~.product{max-width:31%;max-height:470px}
    .product-stage .product:nth-child(2){transform:translateY(-24px)}
    .content{position:absolute;left:72px;right:72px;top:72px;z-index:4}
    .eyebrow{display:inline-block;padding:13px 22px;border-radius:999px;background:${accent};color:#fff;font-size:25px;font-weight:800;letter-spacing:2px}
    h1{font-family:Georgia,'Times New Roman',serif;font-size:${pin.headline.length > 38 ? 72 : 82}px;line-height:.97;letter-spacing:-3.3px;margin:30px 0 24px;max-width:890px;text-wrap:balance}
    .body{font-size:34px;line-height:1.25;font-weight:600;max-width:855px;text-wrap:balance}
    .footer{position:absolute;left:72px;right:72px;bottom:52px;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:28px}
    .cta{background:${accent};color:#fff;border-radius:999px;padding:20px 29px;font-size:27px;font-weight:800;box-shadow:0 12px 32px #00000024}
    .brand{display:flex;align-items:center;gap:14px;background:#fffef8e8;border-radius:999px;padding:10px 20px 10px 10px;box-shadow:0 10px 28px #0002;color:${ink};font-size:22px;font-weight:800;white-space:nowrap}
    .brand img{width:67px;height:67px;border-radius:50%;object-fit:cover}.brand small{display:block;font-size:16px;font-weight:700;margin-top:2px}
  </style></head><body><main class="card">${media}${pin.kind === 'photo' ? '<div class="photo-shade"></div>' : '<div class="blob b1"></div><div class="blob b2"></div>'}<section class="content"><div class="eyebrow">${escapeHtml(pin.eyebrow)}</div><h1>${escapeHtml(pin.headline)}</h1><div class="body">${escapeHtml(pin.body)}</div></section><footer class="footer"><div class="cta">${escapeHtml(pin.cta)}</div><div class="brand"><img src="${await imageUrl(logo)}" alt=""><span>Curva Viva<small>curvaviva.com.br</small></span></div></footer></main></body></html>`;
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

await mkdir(publicDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });

async function cropProductMargins(path) {
  const src = await imageUrl(path);
  return page.evaluate(async (source) => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = frame;
    const width = canvas.width;
    const height = canvas.height;
    const cornerIndexes = [0, width - 1, width * (height - 1), width * height - 1];
    const targets = cornerIndexes.map((index) => {
      const offset = index * 4;
      return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
    });
    const isForeground = (index) => {
      const offset = index * 4;
      if (data[offset + 3] < 32) return false;
      return targets.every(([r, g, b, a]) => {
        if (a < 32) return true;
        const dr = data[offset] - r;
        const dg = data[offset + 1] - g;
        const db = data[offset + 2] - b;
        return Math.sqrt(dr * dr + dg * dg + db * db) > 48;
      });
    };
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!isForeground(y * width + x)) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (minX > maxX || minY > maxY) return source;
    const padX = Math.round(width * 0.035);
    const padY = Math.round(height * 0.035);
    minX = Math.max(0, minX - padX);
    minY = Math.max(0, minY - padY);
    maxX = Math.min(width - 1, maxX + padX);
    maxY = Math.min(height - 1, maxY + padY);
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    const output = document.createElement('canvas');
    output.width = cropWidth;
    output.height = cropHeight;
    output.getContext('2d').drawImage(image, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    return output.toDataURL('image/png');
  }, src);
}

const productNames = [...new Set(pins.flatMap((pin) => pin.products ?? []))];
const productSources = new Map();
for (const product of productNames) {
  productSources.set(product, await cropProductMargins(join(here, 'produtos', product)));
}

for (const pin of pins) {
  await page.setContent(await cardHtml(pin, productSources), { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(publicDir, `pin-${pin.id}-v2.png`) });
}

await page.setViewportSize({ width: 1100, height: 1850 });
const reviewCards = await Promise.all(pins.map(async (pin) => `<figure><img src="${await imageUrl(join(publicDir, `pin-${pin.id}-v2.png`))}" alt="Pin ${pin.id}"><figcaption>${pin.id}</figcaption></figure>`));
await page.setContent(`<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#ede8e1;font-family:Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}figure{position:relative;margin:0;border-radius:15px;overflow:hidden;background:#fff;box-shadow:0 6px 18px #0002}img{display:block;width:100%;aspect-ratio:2/3;object-fit:cover}figcaption{position:absolute;right:8px;top:8px;border-radius:99px;background:#fff;color:#542638;padding:5px 9px;font-weight:800;font-size:15px}</style></head><body><main class="grid">${reviewCards.join('')}</main></body></html>`, { waitUntil: 'networkidle' });
await page.screenshot({ path: join(here, 'revisao-visual-v2.png') });

await browser.close();

const header = ['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords'];
const rows = pins.map((pin) => [
  pin.title,
  `${site}/pinterest/programacao-2026-08-16/pin-${pin.id}.png`,
  pin.board,
  '',
  pin.description,
  `${site}${pin.link}`,
  pin.publish,
  pin.keywords,
].map(csvCell).join(','));
await writeFile(join(here, 'pinterest-bulk.csv'), `\uFEFF${header.map(csvCell).join(',')}\r\n${rows.join('\r\n')}\r\n`, 'utf8');
await copyFile(join(here, 'pinterest-bulk.csv'), join(publicDir, 'pinterest-bulk.csv'));

const retrySchedule = new Map([
  ['05', '2026-08-17T17:00:00'],
  ['06', '2026-08-17T23:00:00'],
  ['08', '2026-08-18T17:00:00'],
  ['09', '2026-08-18T23:00:00'],
  ['11', '2026-08-19T17:00:00'],
  ['15', '2026-08-20T23:00:00'],
  ['18', '2026-08-21T23:00:00'],
  ['02', '2026-08-23T12:00:00'],
  ['03', '2026-08-23T17:00:00'],
]);
const retryRows = [...retrySchedule].map(([id, publish]) => {
  const pin = pins.find((candidate) => candidate.id === id);
  const tracking = `utm_source=pinterest&utm_medium=organic&utm_campaign=programacao_2026_08_16&utm_content=pin_${pin.id}`;
  return [
    pin.title,
    `${site}/pinterest/programacao-2026-08-16/pin-${pin.id}.png`,
    pin.board,
    '',
    pin.description,
    `${site}${pin.link}?${tracking}`,
    publish,
    pin.keywords,
  ].map(csvCell).join(',');
});
await writeFile(join(here, 'pinterest-bulk-rejeitados.csv'), `\uFEFF${header.map(csvCell).join(',')}\r\n${retryRows.join('\r\n')}\r\n`, 'utf8');

const publishedIds = new Set(['01', '04', '05']);
const correctedRows = pins.filter((pin) => !publishedIds.has(pin.id)).map((pin) => {
  const tracking = `utm_source=pinterest&utm_medium=organic&utm_campaign=programacao_2026_08_16_v2&utm_content=pin_${pin.id}`;
  return [
    pin.title,
    `${site}/pinterest/programacao-2026-08-16/pin-${pin.id}-v2.png`,
    pin.board,
    '',
    pin.description,
    `${site}${pin.link}?${tracking}`,
    retrySchedule.get(pin.id) ?? pin.publish,
    pin.keywords,
  ].map(csvCell).join(',');
});
await writeFile(join(here, 'pinterest-bulk-corrigido.csv'), `\uFEFF${header.map(csvCell).join(',')}\r\n${correctedRows.join('\r\n')}\r\n`, 'utf8');

const misleadingCue = /desliz|arrast|para o lado|→/i;
for (const pin of pins) {
  if (misleadingCue.test(`${pin.eyebrow} ${pin.headline} ${pin.body} ${pin.cta}`)) {
    throw new Error(`Pin único ${pin.id} contém indicação falsa de continuidade`);
  }
}

console.log(`Renderizados ${pins.length} Pins em ${publicDir}`);
console.log(`CSV criado em ${join(here, 'pinterest-bulk.csv')}`);
console.log(`CSV de recuperação criado em ${join(here, 'pinterest-bulk-rejeitados.csv')}`);
console.log(`CSV corrigido criado em ${join(here, 'pinterest-bulk-corrigido.csv')}`);
