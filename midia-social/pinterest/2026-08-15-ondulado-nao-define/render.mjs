import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });

for (let i = 0; i < 4; i += 1) {
  const url = `${pathToFileURL(join(here, 'cartoes.html')).href}?card=${i}`;
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  console.log(i + 1, await page.locator('.eyebrow').innerText());
  await page.screenshot({ path: join(here, `pin-0${i + 1}.png`), fullPage: false });
}

await browser.close();
