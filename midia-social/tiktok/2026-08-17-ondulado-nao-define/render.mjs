import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });

for (let index = 0; index < 8; index += 1) {
  const url = `${pathToFileURL(join(here, 'carrossel.html')).href}?card=${index}`;
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: join(here, `slide-${String(index + 1).padStart(2, '0')}.png`) });
}

const review = await browser.newPage({ viewport: { width: 2160, height: 1440 }, deviceScaleFactor: 1 });
await review.goto(pathToFileURL(join(here, 'revisao.html')).href);
await review.waitForLoadState('networkidle');
await review.screenshot({ path: join(here, 'revisao-visual.png') });

await browser.close();
