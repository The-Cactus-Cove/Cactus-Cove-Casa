// Walk the guest portal in mock mode (demo stay link, PIN 1234).
import { chromium } from 'playwright';

const base = process.env.BASE;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

async function shot(name, { full = true } = {}) {
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`${name.padEnd(24)} ${overflow ? 'OVERFLOW' : 'ok'}`);
  await page.screenshot({ path: `/out/${name}.png`, fullPage: full });
}
const click = (name, opts = {}) => page.getByRole('button', { name, exact: true, ...opts }).first().click();
const tab = async (name) => {
  await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: new RegExp(`^${name}`) }).click();
  await page.waitForLoadState('networkidle');
};
async function stage(label) {
  await click(label);
  await page.waitForLoadState('networkidle');
}

await page.goto(`${base}/`);
await shot('00-no-link', { full: false });

await page.goto(`${base}/s/demo`);
await page.fill('#pin', '9999');
await page.click('button[type=submit]');
await page.getByRole('alert').waitFor();
await shot('01-sign-in-error', { full: false });
await page.fill('#pin', '1234');
await page.click('button[type=submit]');
await page.waitForURL(`${base}/`);
await stage('During stay');
await shot('02-home');

await tab('Doors');
await click('Unlock all until', { exact: false });
await shot('03-doors-hold-all-sheet', { full: false });
await click('Unlock until', { exact: false });
await page.waitForTimeout(400);
await shot('03-doors');

await tab('Home');
await shot('04-home-badges', { full: false });

await tab('Thermostat');
await shot('05-thermostat');

await tab('TVs');
await page.locator('summary', { hasText: "Kid's room TV" }).click();
await shot('06-tvs');

await page.setViewportSize({ width: 1280, height: 900 });
await tab('Home');
await shot('07-desktop-home');
await tab('TVs');
await shot('07-desktop-tvs', { full: false });
await page.setViewportSize({ width: 390, height: 844 });

await tab('Home');
await stage('Before check-in');
await shot('08-before');
const guide = await page.goto(`${base}/guide/`);
console.log(`guide before check-in -> ${page.url().replace(base, '')} (${guide.status()})`);
await page.goto(`${base}/doors`);
console.log(`/doors before check-in -> ${page.url().replace(base, '')}`);

await stage('Checkout day');
await shot('09-checkout-day');
await click('Check out');
await click('Yes, check out');
await page.getByText('Happy trails').waitFor();
await shot('10-ended', { full: false });

await browser.close();
