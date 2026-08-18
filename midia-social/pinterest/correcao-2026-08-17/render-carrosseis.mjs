import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..', '..');
const output = join(root, 'public', 'pinterest', 'correcao-2026-08-17');
const photos = join(here, 'fotos');
const logo = join(root, 'public', 'logo-curva-viva.png');

const carousels = [
  {
    id: 'oleo-sem-pesar',
    title: 'Óleo de argan pesa no cabelo ondulado? Veja como usar',
    description: 'Óleo no cabelo ondulado pode dar acabamento sem apagar o movimento. Veja onde aplicar, como ajustar a quantidade e quais sinais observar depois que as ondas secarem.',
    link: 'https://www.curvaviva.com.br/artigos/oleo-de-argan-pesa-no-cabelo-ondulado/?utm_source=pinterest&utm_medium=organic&utm_campaign=correcao_carrossel&utm_content=oleo_sem_pesar',
    board: 'Cabelo ondulado: leveza e definição',
    slides: [
      ['03-oleo-pontas-perfil.png', 'ÓLEO NAS ONDAS', 'Óleo de argan pesa no cabelo ondulado?', 'Pode pesar, mas a dose e o lugar da aplicação mudam tudo.', 'Deslize para fazer um teste mais leve'],
      ['04-textura-sem-rosto.png', 'PASSO 1', 'Comece pelas pontas', 'Evite a raiz no primeiro teste. Concentre a aplicação nas áreas mais ressecadas.', '2/5'],
      ['02-close-mecha-umida.png', 'PASSO 2', 'Use uma gota e espalhe bem', 'Aqueça entre as mãos e encoste aos poucos. É mais fácil acrescentar do que retirar.', '3/5'],
      ['08-close-cacho.png', 'PASSO 3', 'Observe só depois de seco', 'Raiz baixa, mechas coladas e toque carregado pedem menos óleo na próxima vez.', '4/5'],
    ],
  },
  {
    id: 'tres-ajustes-definicao',
    title: 'Cabelo ondulado não define? Comece por estes 3 ajustes',
    description: 'Se as ondas somem durante a secagem, o problema pode estar na água, na dose ou no excesso de manipulação. Veja três ajustes antes de trocar os produtos.',
    link: 'https://www.curvaviva.com.br/artigos/cabelo-ondulado-nao-define-erros/?utm_source=pinterest&utm_medium=organic&utm_campaign=correcao_carrossel&utm_content=tres_ajustes',
    board: 'Cabelo ondulado: leveza e definição',
    slides: [
      ['07-day-after-janela.png', 'DEFINIÇÃO SEM PESO', 'Ondulado não define? Faça 3 ajustes', 'Teste uma mudança por lavagem para descobrir o que suas ondas pedem.', 'Deslize e salve para testar depois'],
      ['01-umidade-uniforme.png', 'AJUSTE 1', 'Molhe por igual', 'Partes quase secas recebem o produto de outro jeito. Borrife água antes de continuar.', '2/5'],
      ['05-mousse-vista-superior.png', 'AJUSTE 2', 'Comece com menos creme', 'Excesso pode baixar a raiz, esticar as ondas e deixar a secagem mais lenta.', '3/5'],
      ['06-difusor-lateral.png', 'AJUSTE 3', 'Pare de tocar enquanto seca', 'O movimento das mãos durante a secagem pode desmontar a forma que apareceu molhada.', '4/5'],
    ],
  },
  {
    id: 'umidade-uniforme',
    title: 'Por que finalizar o cabelo ondulado úmido por igual?',
    description: 'Uma mecha quase seca e outra molhada podem responder de formas diferentes ao mesmo finalizador. Veja como uniformizar a umidade e distribuir melhor o produto.',
    link: 'https://www.curvaviva.com.br/artigos/cabelo-ondulado-nao-define-erros/?utm_source=pinterest&utm_medium=organic&utm_campaign=correcao_carrossel&utm_content=umidade_uniforme',
    board: 'Finalização e day after',
    slides: [
      ['01-umidade-uniforme.png', 'DETALHE QUE MUDA TUDO', 'Finalize com o cabelo úmido por igual', 'Mechas em níveis diferentes de umidade podem responder de formas diferentes.', 'Deslize para ver o passo a passo'],
      ['04-textura-sem-rosto.png', 'PASSO 1', 'Divida o cabelo em partes', 'Assim fica mais fácil perceber quais áreas estão secando antes de receber o finalizador.', '2/5'],
      ['07-day-after-janela.png', 'PASSO 2', 'Borrife água onde for preciso', 'Umedeça novamente as mechas quase secas antes de continuar a aplicação.', '3/5'],
      ['02-close-mecha-umida.png', 'PASSO 3', 'Distribua e amasse', 'Espalhe uma pequena dose por mecha e amasse de baixo para cima sem exagerar.', '4/5'],
    ],
  },
];

function mime(path) {
  return path.endsWith('.png') ? 'image/png' : 'image/jpeg';
}

async function dataUrl(path) {
  const data = await readFile(path);
  return `data:${mime(path)};base64,${data.toString('base64')}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

async function slideHtml(slide, logoUrl) {
  const [photo, eyebrow, title, body, marker] = slide;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:1000px;height:1500px;overflow:hidden}
    body{font-family:Arial,Helvetica,sans-serif;background:#f6eee7;color:#3b2332}.card{position:relative;width:100%;height:100%;overflow:hidden}
    .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.wash{position:absolute;inset:0;background:linear-gradient(180deg,#fff7f0f7 0%,#fff7f0dd 35%,#4b28321f 62%,#29131ccf 100%)}
    .content{position:absolute;inset:0;padding:72px;display:flex;flex-direction:column}.eyebrow{align-self:flex-start;padding:13px 21px;border-radius:999px;background:#a64c61;color:white;font-size:24px;font-weight:800;letter-spacing:1.8px}
    h1{font-family:Georgia,'Times New Roman',serif;font-size:76px;line-height:.98;letter-spacing:-3px;max-width:860px;margin:30px 0 23px;text-wrap:balance}p{font-size:34px;line-height:1.24;font-weight:650;max-width:840px;margin:0;text-wrap:balance}
    .footer{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:25px}.marker{padding:18px 25px;border-radius:999px;background:#38202eea;color:white;font-size:26px;font-weight:800}.brand{display:flex;align-items:center;gap:12px;padding:9px 18px 9px 9px;border-radius:999px;background:#fffdf7ef;font-size:22px;font-weight:800}.brand img{width:62px;height:62px;border-radius:50%}
  </style></head><body><main class="card"><img class="photo" src="${await dataUrl(join(photos, photo))}" alt=""><div class="wash"></div><section class="content"><div class="eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p><footer class="footer"><div class="marker">${escapeHtml(marker)}</div><div class="brand"><img src="${logoUrl}" alt="">Curva Viva</div></footer></section></main></body></html>`;
}

function ctaHtml(logoUrl) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:1000px;height:1500px;overflow:hidden}body{background:radial-gradient(circle at 50% 28%,#fffaf3 0 20%,#f4e6dc 56%,#dbc6cf 100%);font-family:Arial,Helvetica,sans-serif;color:#4b263b}.card{width:100%;height:100%;padding:118px 80px;display:flex;flex-direction:column;align-items:center;text-align:center}.logo{width:285px;height:285px;border-radius:50%;object-fit:cover;box-shadow:0 28px 70px #4b263b38;margin:48px 0 55px}.eyebrow{font-size:25px;font-weight:800;letter-spacing:2px;color:#a64c61}.title{font-family:Georgia,'Times New Roman',serif;font-size:74px;line-height:1.02;letter-spacing:-2.7px;margin:0 0 32px;max-width:820px}.body{font-size:34px;line-height:1.3;font-weight:650;max-width:820px}.follow{margin-top:50px;padding:22px 34px;border-radius:999px;background:#a64c61;color:white;font-size:30px;font-weight:800}.site{margin-top:30px;font-size:31px;font-weight:800}.page{margin-top:auto;font-size:23px;font-weight:800;color:#7b5366}</style></head><body><main class="card"><div class="eyebrow">CONTINUE COM A CURVA VIVA</div><img class="logo" src="${logoUrl}" alt="Logo Curva Viva"><h1 class="title">Seu cabelo, suas regras, sem drama</h1><div class="body">Siga a página para receber mais guias claros e visite o site oficial para ler o conteúdo completo.</div><div class="follow">Siga @curvavivaoficial</div><div class="site">curvaviva.com.br</div><div class="page">5/5</div></main></body></html>`;
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
const logoUrl = await dataUrl(logo);

for (const carousel of carousels) {
  if (carousel.slides.length !== 4) throw new Error(`${carousel.id} precisa de quatro páginas de conteúdo`);
  for (let index = 0; index < carousel.slides.length; index += 1) {
    await page.setContent(await slideHtml(carousel.slides[index], logoUrl), { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(output, `${carousel.id}-${String(index + 1).padStart(2, '0')}.png`) });
  }
  await page.setContent(ctaHtml(logoUrl), { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(output, `${carousel.id}-05-cta.png`) });
}

await page.setViewportSize({ width: 1250, height: 1100 });
const cards = [];
for (const carousel of carousels) {
  for (let index = 1; index <= 5; index += 1) {
    const suffix = index === 5 ? '05-cta' : String(index).padStart(2, '0');
    cards.push(`<figure><img src="${await dataUrl(join(output, `${carousel.id}-${suffix}.png`))}" alt=""><figcaption>${escapeHtml(carousel.id)} ${index}/5</figcaption></figure>`);
  }
}
await page.setContent(`<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;padding:22px;background:#e9e2dc;font-family:Arial}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}figure{margin:0;background:white;border-radius:12px;overflow:hidden;box-shadow:0 5px 16px #0002}img{width:100%;display:block;aspect-ratio:2/3;object-fit:cover}figcaption{padding:8px;font-size:12px;font-weight:700}</style></head><body><main class="grid">${cards.join('')}</main></body></html>`, { waitUntil: 'networkidle' });
await page.screenshot({ path: join(here, 'revisao-visual-carrosseis.png'), fullPage: true });
await browser.close();

await writeFile(join(here, 'manifesto-carrosseis.json'), `${JSON.stringify(carousels.map(({ slides, ...metadata }) => ({ ...metadata, pages: slides.length + 1 })), null, 2)}\n`, 'utf8');
console.log(`Renderizados ${carousels.length} carrosséis reais, todos com 5 páginas.`);
