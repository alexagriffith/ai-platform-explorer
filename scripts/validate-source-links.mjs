#!/usr/bin/env node
/**
 * validate-source-links.mjs — "links must render, not just resolve".
 *
 * The bar this enforces is Alexa's actual rule: a source link is only good if a real browser
 * shows CONTENT when you click it — not merely that curl gets HTTP 200. A page can return 200
 * with a heavy body and still paint blank (client shell that never hydrates, a referrer/bot
 * challenge, an SPA error). That is exactly the "clicked the cell, got a completely blank page"
 * failure this guards against.
 *
 * What it does: loads EVERY source URL in the product-comparison data — every bomRows /
 * capabilityRows side `sourceUrl`, plus every `docsLinks` url — in headless Chromium and asserts
 * the RENDERED body text exceeds MIN_CHARS. The hero cells resolve to those same row sides
 * (see resolveHeroCell), so covering the row sides covers every hero link too.
 *
 * Strictness: pages are opened with NO Referer on purpose. That is the harshest case — if a URL
 * only renders when a referrer is present, it is fragile and we want to know. (The app itself now
 * links with rel="noopener" so a real click DOES send a referrer; this check is the safety net
 * one notch stricter than production.)
 *
 * Run:   npm run validate:links      (or: node scripts/validate-source-links.mjs)
 * Exit:  0 = every link renders content · 1 = one or more render blank/short (prints which URLs
 *        failed and which rows cite them, so the fix is a source swap on exactly those rows).
 *
 * NOT wired into `npm run check`: it needs network + a browser and would make the fast
 * lint+unit+build gate non-hermetic. Run it when source URLs change or during a link audit.
 */

import { productComparisons } from '../src/data/productComparisons.js';

const MIN_CHARS = 500;            // Alexa's rule: "renders content" > this many visible chars.
const NAV_TIMEOUT_MS = 30000;     // per-page navigation ceiling.
const RENDER_POLL_MS = 1000;      // re-measure innerText this often...
const RENDER_POLL_MAX = 15;       // ...up to this many times (client-hydrated pages need a beat).
const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** Every distinct URL rendered somewhere in the product-comparison data, with who cites it. */
function collectUrls() {
  const map = new Map(); // url -> Set(citation labels)
  const add = (url, who) => {
    if (typeof url !== 'string' || !url) return;
    if (!map.has(url)) map.set(url, new Set());
    map.get(url).add(who);
  };
  for (const comp of productComparisons) {
    const rows = [...(comp.bomRows ?? []), ...(comp.capabilityRows ?? [])];
    for (const row of rows) {
      const key = row.area ?? row.capability ?? '(row)';
      for (const side of ['a', 'b']) add(row[side]?.sourceUrl, `${comp.id} · ${key} [${side}]`);
    }
    for (const link of comp.docsLinks ?? []) add(link.url, `${comp.id} · docsLinks: ${link.label}`);
  }
  return map;
}

/** Navigate (no referrer) and return the longest rendered body-text length we observe. */
async function renderedLength(context, url) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  let status = null;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
    status = resp ? resp.status() : null;
  } catch (e) {
    await page.close();
    return { status, len: 0, errors: [`navigation failed: ${e.message}`] };
  }
  let len = 0;
  for (let i = 0; i < RENDER_POLL_MAX; i++) {
    try {
      len = await page.evaluate(() => (document.body ? document.body.innerText.trim().length : 0));
    } catch { /* transient navigation churn — retry */ }
    if (len > MIN_CHARS) break;
    await page.waitForTimeout(RENDER_POLL_MS);
  }
  await page.close();
  return { status, len, errors: errors.slice(0, 3) };
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error(
      'playwright is required to run this check.\n' +
      '  npm i -D playwright && npx playwright install chromium\n' +
      'Then: npm run validate:links'
    );
    process.exit(2);
  }

  const urls = collectUrls();
  console.log(`Validating ${urls.size} source URLs — rendered body text must exceed ${MIN_CHARS} chars.\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: REAL_UA, viewport: { width: 1440, height: 900 } });

  const failures = [];
  for (const [url, whoSet] of urls) {
    const { status, len, errors } = await renderedLength(context, url);
    const pass = len > MIN_CHARS;
    console.log(`  ${pass ? 'PASS' : 'FAIL'}  len=${String(len).padStart(7)}  status=${status ?? '—'}  ${url}`);
    if (!pass) {
      const who = [...whoSet];
      console.log(`        cited by: ${who.join('; ')}`);
      if (errors.length) console.log(`        errors: ${errors.join(' | ')}`);
      failures.push({ url, len, who });
    }
  }

  await browser.close();

  console.log(`\n${'='.repeat(60)}`);
  if (failures.length === 0) {
    console.log(`All ${urls.size} source links render content (> ${MIN_CHARS} chars). PASS.`);
    process.exit(0);
  }
  console.log(`${failures.length} of ${urls.size} source links render blank/short (<= ${MIN_CHARS} chars):`);
  for (const f of failures) console.log(`  - ${f.url}  (len ${f.len})  <- ${f.who.join('; ')}`);
  console.log('\nSwap each failing sourceUrl for an equivalent that renders (GitHub blob at the pinned');
  console.log('commit, or access.redhat.com article), update its sourceLabel to match, and re-run.');
  process.exit(1);
}

main();
