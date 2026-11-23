import { chromium } from 'playwright';

const url = `${process.env.BASE}${process.env.URL_PATH ?? '/'}`;
const viewports = { desktop: 1280, tablet: 820, phone: 390 };

const browser = await chromium.launch();
for (const [name, width] of Object.entries(viewports)) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`${name.padEnd(8)} ${width}px  ${scrollWidth > width ? `OVERFLOW (${scrollWidth}px)` : 'no overflow'}`);
  await page.screenshot({ path: `/out/${name}.png`, fullPage: true });
}
await browser.close();
