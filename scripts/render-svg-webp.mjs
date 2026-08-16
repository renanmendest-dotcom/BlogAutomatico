import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [sourceDir, outputDir] = process.argv.slice(2);
if (!sourceDir || !outputDir) {
  throw new Error('Uso: node scripts/render-svg-webp.mjs <diretorio-svg> <diretorio-saida>');
}

const files = [
  'capa-pesa-ou-nao.svg',
  'onde-aplicar.svg',
  'teste-tres-lavagens.svg',
  'sinais-e-ajustes.svg',
];

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage();

for (const file of files) {
  const svg = await readFile(path.join(sourceDir, file), 'utf8');
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  await page.setContent('<canvas id="canvas" width="1200" height="800"></canvas>');
  const result = await page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, 1200, 800);
    return canvas.toDataURL('image/webp', 0.9).split(',')[1];
  }, dataUrl);
  await writeFile(path.join(outputDir, file.replace('.svg', '.webp')), Buffer.from(result, 'base64'));
}

await browser.close();
