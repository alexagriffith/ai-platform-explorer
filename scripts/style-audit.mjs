/* -----------------------------------------------------------------------------
 * style-audit.mjs — deterministic Playwright style checks for every tab listed
 * in scripts/style-ledger.json (migratedTabs). Invoked by scripts/gate.py; not
 * meant to be run directly in normal workflows. Exits 0 with no output on PASS;
 * on failure prints one line per violation and exits 1 (gate.py forwards those).
 *
 * Shared measured checks (every migrated tab, both themes where noted):
 *   1. Zero bordered box nested inside another bordered box within the tab
 *      (a "box" = borders on >=3 sides and NOT a circle/pill; 1-2 sided borders
 *      are hairline rules and allowed).
 *   2. <=2 distinct non-zero border-radius values in the tab.
 *   3. No horizontal scroll at 1440px and at 375px.
 *
 * Product Comparison extras (kept when that tab is on the ledger):
 *   4. Ledger cells: the two product columns are equal width to each other and
 *      uniform row-to-row; every ledger cell is the same height.
 *   5. The draft banner renders visibly, distinct from the page, in BOTH themes.
 *
 * Usage: node scripts/style-audit.mjs <url>
 * -------------------------------------------------------------------------- */
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, '..') + '/');
const { chromium } = require('playwright');

const URL = process.argv[2];
if (!URL) {
  console.error('style-audit: no url argument');
  process.exit(1);
}

const ledger = JSON.parse(readFileSync(resolve(__dirname, 'style-ledger.json'), 'utf8'));
const migratedTabs = ledger.migratedTabs || [];
if (!migratedTabs.length) {
  console.error('style-audit: migratedTabs empty in style-ledger.json');
  process.exit(1);
}

const problems = [];

async function openTab(page, navLabel, tabId) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: new RegExp(navLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first().click();
  await page.locator(`[data-tab="${tabId}"]`).first().waitFor({ timeout: 15000 });
  if (tabId === 'product-comparison') {
    await page.getByText('What ships in each product').first().waitFor({ timeout: 15000 });
  }
  await page.waitForTimeout(300);
}

// DOM-side audit: nested boxes + radius budget (+ product-comparison ledger geometry).
// Returns a list of problem strings. tabId is passed in from Node.
function tabProbe(tabId) {
  const out = [];
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [`tab container [data-tab="${tabId}"] not found`];

  const rect = (el) => el.getBoundingClientRect();
  const visible = (el) => {
    const r = rect(el);
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') !== 0;
  };
  const r2 = (n) => Math.round(n * 100) / 100;

  // Product Comparison: ledger cell geometry
  if (tabId === 'product-comparison') {
    const A = [...tab.querySelectorAll('[data-ledger-cell="a"]')].map(rect);
    const B = [...tab.querySelectorAll('[data-ledger-cell="b"]')].map(rect);
    const N = [...tab.querySelectorAll('[data-ledger-cell="name"]')].map(rect);
    if (!A.length || !B.length) out.push('ledger presence cells [data-ledger-cell] not found');
    const uniform = (arr, key, label) => {
      if (arr.length < 2) return;
      const first = arr[0][key];
      for (const d of arr) if (Math.abs(d[key] - first) > 1.0) { out.push(`ledger ${label} not uniform: ${r2(d[key])} vs ${r2(first)}`); return; }
    };
    uniform(A, 'width', 'left-product cell width');
    uniform(A, 'height', 'left-product cell height');
    uniform(B, 'width', 'right-product cell width');
    uniform(B, 'height', 'right-product cell height');
    uniform(N, 'width', 'name cell width');
    uniform(N, 'height', 'name cell height');
    if (A.length && B.length) {
      if (Math.abs(A[0].width - B[0].width) > 1.0) out.push(`product columns unequal width: left=${r2(A[0].width)} right=${r2(B[0].width)}`);
      if (Math.abs(A[0].height - B[0].height) > 1.0) out.push(`product cells unequal height: left=${r2(A[0].height)} right=${r2(B[0].height)}`);
    }
    const allCells = [...A, ...B, ...N];
    if (allCells.length) {
      const h0 = allCells[0].height;
      for (const c of allCells) if (Math.abs(c.height - h0) > 1.0) { out.push(`ledger cell heights differ: ${r2(c.height)} vs ${r2(h0)}`); break; }
    }
  }

  // Nested bordered boxes
  const SIDES = ['Top', 'Right', 'Bottom', 'Left'];
  const isBox = (el) => {
    const s = getComputedStyle(el);
    let n = 0;
    for (const side of SIDES) {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const style = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      const transparent = col === 'transparent' || col === 'rgba(0, 0, 0, 0)';
      if (w >= 1 && style !== 'none' && style !== 'hidden' && !transparent) n++;
    }
    if (n < 3) return false; // hairline rule / divider, not a container box
    const r = rect(el);
    const radius = Math.max(parseFloat(s.borderTopLeftRadius) || 0, parseFloat(s.borderBottomRightRadius) || 0);
    if (radius >= Math.min(r.width, r.height) / 2 - 0.5) return false; // circle / pill = a mark, not a box
    return true;
  };
  const boxes = [...tab.querySelectorAll('*')].filter((el) => visible(el) && isBox(el));
  const boxSet = new Set(boxes);
  for (const el of boxes) {
    let p = el.parentElement;
    while (p && p !== tab.parentElement) {
      if (boxSet.has(p)) {
        out.push(`nested bordered box: <${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.')}> inside <${p.tagName.toLowerCase()}.${(p.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.')}>`);
        break;
      }
      p = p.parentElement;
    }
  }

  // Distinct non-zero border-radius values
  const radii = new Set();
  for (const el of tab.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    for (const corner of ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius']) {
      const v = parseFloat(s[corner]) || 0;
      if (v > 0.5) radii.add(Math.round(v));
    }
  }
  if (radii.size > 2) out.push(`>2 distinct border-radius values in tab: [${[...radii].sort((a, b) => a - b).join(', ')}]`);

  return out;
}

function noHorizontalScroll() {
  const de = document.documentElement;
  return de.scrollWidth - de.clientWidth; // >1 means horizontal overflow
}

function draftBannerState() {
  const b = document.querySelector('[data-draft-banner]');
  if (!b) return { ok: false, reason: 'draft banner [data-draft-banner] not found' };
  const r = b.getBoundingClientRect();
  const s = getComputedStyle(b);
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const vis = r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') !== 0;
  const transparent = s.backgroundColor === 'transparent' || s.backgroundColor === 'rgba(0, 0, 0, 0)';
  return { ok: vis && !transparent && s.backgroundColor !== bodyBg, visible: vis, transparent, bg: s.backgroundColor, bodyBg };
}

async function auditTab(browser, tab) {
  const { id: tabId, navLabel } = tab;
  const prefix = (label) => `[${tabId} ${label}]`;

  // --- 1440px, light: geometry + boxes + radii + horizontal scroll (+ PC extras) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await openTab(page, navLabel, tabId);
    for (const p of await page.evaluate(tabProbe, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    const overflow = await page.evaluate(noHorizontalScroll);
    if (overflow > 1) problems.push(`${prefix('1440')} horizontal scroll: scrollWidth exceeds clientWidth by ${overflow}px`);
    if (tabId === 'product-comparison') {
      const banner = await page.evaluate(draftBannerState);
      if (!banner.ok) problems.push(`${prefix('1440 light')} draft banner not visibly distinct: ${JSON.stringify(banner)}`);
    }
    await ctx.close();
  }
  // --- 1440px, dark: boxes + radii (+ PC banner) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
    const page = await ctx.newPage();
    await openTab(page, navLabel, tabId);
    for (const p of await page.evaluate(tabProbe, tabId)) problems.push(`${prefix('1440 dark')} ${p}`);
    if (tabId === 'product-comparison') {
      const banner = await page.evaluate(draftBannerState);
      if (!banner.ok) problems.push(`${prefix('1440 dark')} draft banner not visibly distinct: ${JSON.stringify(banner)}`);
    }
    await ctx.close();
  }
  // --- 375px, light: no horizontal scroll on mobile ---
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await openTab(page, navLabel, tabId);
    const overflow = await page.evaluate(noHorizontalScroll);
    if (overflow > 1) problems.push(`${prefix('375')} horizontal scroll: scrollWidth exceeds clientWidth by ${overflow}px`);
    await ctx.close();
  }
}

async function run() {
  const browser = await chromium.launch();
  try {
    for (const tab of migratedTabs) {
      await auditTab(browser, tab);
    }
  } finally {
    await browser.close();
  }

  if (problems.length) {
    for (const p of problems) console.log(p);
    process.exit(1);
  }
  process.exit(0);
}

run().catch((err) => {
  console.log('style-audit crashed: ' + (err && err.stack ? err.stack : err));
  process.exit(1);
});
