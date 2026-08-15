import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valueAfter = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const tema = valueAfter('--tema', 'seu cabelo natural');
const saida = resolve(valueAfter('--saida', join(here, 'cartao-final-curva-viva.png')));
const url = new URL(pathToFileURL(join(here, 'cartao-final.html')));
url.searchParams.set('tema', tema);

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const page = await browser.newPage({
  viewport: { width: 1000, height: 1500 },
  deviceScaleFactor: 1,
});

await page.goto(url.href);
await page.waitForLoadState('networkidle');
await page.screenshot({ path: saida, fullPage: false });
console.log(saida);

await browser.close();
