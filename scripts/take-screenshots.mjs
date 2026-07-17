/**
 * take-screenshots.mjs — full-page screenshots of all four tabs at 1440 and 1920,
 * light and dark themes. Output to the path provided as first argument.
 *
 * Usage: node scripts/take-screenshots.mjs <url> <output-dir>
 */
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, '..') + '/');
const { chromium } = require('playwright');

const URL = process.argv[2];
const OUT_DIR = process.argv[3];
if (!URL || !OUT_DIR) {
  console.error('usage: node take-screenshots.mjs <url> <output-dir>');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const TABS = [
  { navLabel: 'Architecture', id: 'architecture' },
  { navLabel: 'Decision Guides', id: 'decisions' },
  { navLabel: 'Products', id: 'products' },
  { navLabel: 'Deployment Impact', id: 'deployment-impact' },
];

async function openTab(page, navLabel, tabId) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: new RegExp(navLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first().click();
  await page.locator(`[data-tab="${tabId}"]`).first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
}

async function run() {
  const browser = await chromium.launch();
  for (const { width, height, label } of [
    { width: 1440, height: 900, label: '1440' },
    { width: 1920, height: 1080, label: '1920' },
  ]) {
    for (const { theme, label: themeLabel } of [
      { theme: 'light', label: 'light' },
      { theme: 'dark', label: 'dark' },
    ]) {
      const ctx = await browser.newContext({
        viewport: { width, height },
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      for (const tab of TABS) {
        await openTab(page, tab.navLabel, tab.id);
        const filename = `${tab.id}-${themeLabel}-${label}.png`;
        await page.screenshot({
          path: resolve(OUT_DIR, filename),
          fullPage: true,
        });
        console.log(`  saved: ${filename}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log('screenshots complete');
}

run().catch((err) => {
  console.error('screenshot error:', err);
  process.exit(1);
});
