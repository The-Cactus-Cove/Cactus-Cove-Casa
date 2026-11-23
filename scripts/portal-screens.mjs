// Walk the guest portal in mock mode (demo stay link, PIN 1234) at phone width.
import { chromium } from 'playwright';

const base = process.env.BASE;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

async function shot(name, { full = true } = {}) {
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`${name.padEnd(22)} ${overflow ? 'OVERFLOW' : 'ok'}`);
  await page.screenshot({ path: `/out/${name}.png`, fullPage: full });
}

async function stage(label) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.waitForLoadState('networkidle');
}

await page.goto(`${base}/`);
await shot('00-no-link');

await page.goto(`${base}/s/demo`);
await page.fill('#pin', '9999');
await page.click('button[type=submit]');
await page.getByRole('alert').waitFor();
await shot('01-sign-in-error', { full: false });

await page.fill('#pin', '1234');
await page.click('button[type=submit]');
await page.waitForURL(`${base}/`);
await stage('During stay');
await shot('02-during');

await page.getByRole('button', { name: 'Keep unlocked for a while…' }).first().click();
await shot('03-hold-sheet', { full: false });
await page.getByRole('button', { name: 'Never mind' }).click();

await page.getByRole('button', { name: "Kid's room", exact: true }).click();
await page.getByRole('button', { name: 'One night', exact: true }).click();
await page.waitForTimeout(400);
await page.locator('#lockout-kids').scrollIntoViewIfNeeded();
await shot('03b-kids-lockout', { full: false });

await stage('Before check-in');
await shot('04-before');

await stage('Checkout day');
await shot('05-checkout-day');

await page.getByRole('button', { name: 'Check out', exact: true }).click();
await page.getByRole('button', { name: 'Yes, check out' }).click();
await page.getByText('Happy trails').waitFor();
await shot('06-ended', { full: false });

await browser.close();
