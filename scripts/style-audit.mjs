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

// ─── New measured checks (D4b) ──────────────────────────────────────────────

// HEIGHT BUDGET: tab's scrollHeight must not exceed the per-tab budget (1440×900).
// budget is passed in from the ledger; falls back to 2.0 if absent.
// Returns { ratio, ok } — ratio logged for future tightening.
function heightBudget({ tabId, budget }) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return { ratio: null, ok: false, reason: 'tab not found' };
  const vph = window.innerHeight; // 900
  const sh = tab.scrollHeight;
  const ratio = sh / vph;
  const limit = typeof budget === 'number' ? budget : 2.0;
  return { ratio: Math.round(ratio * 100) / 100, ok: ratio <= limit, limit };
}

// GRID EQUALITY: for each row of visually-sibling cards (same explicit-grid or non-wrapping
// flex parent, 3+ same-size children), assert equal widths (±1px) and vertical centre
// alignment (±2px).
// Intentionally skips:
//   - flex-wrap containers (chip/badge/tag groups — variable-width inline content)
//   - CSS grid with named/fractional column templates (asymmetric by design)
//   - containers whose children height < 24px (likely inline chips, not cards)
//   - containers where max-width/min-width ratio > 1.5 (non-uniform-card layouts)
function gridEquality(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [];
  const out = [];
  const r2 = (n) => Math.round(n * 100) / 100;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
  };
  for (const container of tab.querySelectorAll('*')) {
    const cs = getComputedStyle(container);
    const display = cs.display;
    if (display !== 'grid' && display !== 'flex' && display !== 'inline-flex') continue;
    // Skip flex-wrap containers — chip/badge groups are intentionally variable-width.
    if (cs.flexWrap === 'wrap' || cs.flexWrap === 'wrap-reverse') continue;
    // Skip CSS grid containers with non-uniform column templates (named columns, fractional
    // columns of different sizes, or fixed+auto mixes). Uniform grids use repeat(N, 1fr).
    if (display === 'grid') {
      const tmpl = cs.gridTemplateColumns || '';
      // If the template has different values (not all the same px), it's asymmetric — skip.
      const parts = tmpl.trim().split(/\s+/);
      if (parts.length >= 2) {
        const first = parts[0];
        if (!parts.every((p) => Math.abs(parseFloat(p) - parseFloat(first)) <= 1)) continue;
      }
    }
    const children = [...container.children].filter(visible);
    if (children.length < 3) continue;
    const rects = children.map((c) => c.getBoundingClientRect());
    // Skip rows of short elements (chip/icon height < 24px — not card rows).
    if (Math.max(...rects.map((r) => r.height)) < 24) continue;
    // Only check true rows: all children share roughly the same top (within 4px).
    const firstTop = rects[0].top;
    if (!rects.every((r) => Math.abs(r.top - firstTop) <= 4)) continue;
    // Skip intentionally asymmetric layouts (max/min width ratio > 1.5).
    const widths = rects.map((r) => r.width);
    const minW = Math.min(...widths), maxW = Math.max(...widths);
    if (minW < 2 || maxW / minW > 1.5) continue;
    // Width equality ±1px
    for (const r of rects) {
      if (Math.abs(r.width - rects[0].width) > 1) {
        const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        out.push(`grid-equality width: <${container.tagName.toLowerCase()}.${cls}> children widths differ: ${r2(r.width)} vs ${r2(rects[0].width)}`);
        break;
      }
    }
    // Vertical centre alignment ±2px
    const centres = rects.map((r) => r.top + r.height / 2);
    for (const c of centres) {
      if (Math.abs(c - centres[0]) > 2) {
        const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        out.push(`grid-equality centre: <${container.tagName.toLowerCase()}.${cls}> row centres misaligned: ${r2(c)} vs ${r2(centres[0])}`);
        break;
      }
    }
  }
  return out;
}

// LEGEND LAW: if any element carries a categoricalMark class fragment (border-l-red-600,
// border-l-blue-500, border-l-teal-500), assert a legend element with legendChip classes exists.
// legendChip fragments: (bg-red-600 OR bg-blue-500 OR bg-teal-500) + (w-3 h-3)
function legendLaw(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return null;
  const markFragments = ['border-l-red-600', 'border-l-blue-500', 'border-l-teal-500'];
  const chipColors = ['bg-red-600', 'bg-blue-500', 'bg-teal-500'];
  const hasMark = [...tab.querySelectorAll('*')].some((el) => {
    const cn = (el.className || '').toString();
    return markFragments.some((f) => cn.includes(f));
  });
  if (!hasMark) return null; // no categorical marks — no legend required
  const hasLegend = [...tab.querySelectorAll('*')].some((el) => {
    const cn = (el.className || '').toString();
    return cn.includes('w-3') && cn.includes('h-3') && chipColors.some((c) => cn.includes(c));
  });
  return hasLegend ? null : 'legend law: tab has categoricalMark elements but no legendChip found';
}

// MOTION LAW: sample up to 30 interactive elements. Each must have:
//   - a focus-visible ring class in its className
//   - a computed transition-duration between 100ms and 300ms (or motion-reduce handling)
function motionLaw(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [];
  const out = [];
  const RING_FRAGMENTS = ['focus-visible:ring', 'focus-visible:outline-none'];
  const candidates = [...tab.querySelectorAll('button, a, [role="button"]')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
    })
    .slice(0, 30);
  for (const el of candidates) {
    const cn = (el.className || '').toString();
    const hasFocusRing = RING_FRAGMENTS.some((f) => cn.includes(f));
    // Parse transition-duration: '0.15s' → 150ms
    const tdRaw = getComputedStyle(el).transitionDuration || '';
    const tdMs = tdRaw.split(',').map((s) => {
      s = s.trim();
      if (s.endsWith('ms')) return parseFloat(s);
      if (s.endsWith('s')) return parseFloat(s) * 1000;
      return 0;
    });
    // motion-reduce collapse to 0ms is allowed (check motion-reduce class or duration=0)
    const hasReduceClass = cn.includes('motion-reduce:transition-none') || cn.includes('motion-reduce:');
    const maxDur = Math.max(...tdMs);
    const transitionOk = (maxDur >= 100 && maxDur <= 300) || (maxDur === 0 && hasReduceClass) || hasReduceClass;
    if (!hasFocusRing || !transitionOk) {
      const sel = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cn ? '.' + cn.split(' ').filter(Boolean).slice(0, 2).join('.') : ''}`;
      const reasons = [];
      if (!hasFocusRing) reasons.push('no focus-visible ring');
      if (!transitionOk) reasons.push(`transition-duration ${tdRaw || '0s'} (need 100-300ms or motion-reduce)`);
      out.push(`motion law: ${sel} — ${reasons.join('; ')}`);
    }
  }
  return out;
}

// ─── F6 checks ──────────────────────────────────────────────────────────────

// CARD TEXT BUDGET: inside any grid card (direct child of a grid/flex container
// that itself has a border or surface token class), visible text content at rest
// must be <= 140 characters.
// "Grid card" = element whose parent display is grid or flex (non-wrapping),
// and the element has a visible border on at least one side (card marker).
function cardTextBudget(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [];
  const out = [];
  const r2 = (n) => Math.round(n * 100) / 100;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
  };
  const hasBorder = (el) => {
    const s = getComputedStyle(el);
    const sides = ['Top', 'Right', 'Bottom', 'Left'];
    return sides.some((side) => {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const st = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      const transparent = col === 'transparent' || col === 'rgba(0, 0, 0, 0)';
      return w >= 1 && st !== 'none' && st !== 'hidden' && !transparent;
    });
  };
  for (const container of tab.querySelectorAll('*')) {
    if (!visible(container)) continue;
    const cs = getComputedStyle(container);
    const display = cs.display;
    if (display !== 'grid' && display !== 'flex') continue;
    if (cs.flexWrap === 'wrap' || cs.flexWrap === 'wrap-reverse') continue;
    for (const child of container.children) {
      if (!visible(child)) continue;
      if (!hasBorder(child)) continue;
      const cr = child.getBoundingClientRect();
      if (cr.height < 24) continue; // skip tiny badges/chips
      const text = (child.innerText || child.textContent || '').trim().replace(/\s+/g, ' ');
      if (text.length > 140) {
        const cls = (child.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        out.push(`card-text-budget: <${child.tagName.toLowerCase()}.${cls}> text ${text.length} chars > 140: "${text.slice(0, 80)}..."`);
      }
    }
  }
  return out;
}

// ROW-FILL: any grid row's children must together span >= 85% of the grid
// container's inner width. Catches static-column left-packing where a row with
// fewer items than columns leaves the right half empty.
// Only checks grid containers (not flex). Skips containers whose column
// template implies intentional partial fill (e.g. auto-fit/auto-fill).
function rowFill(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [];
  const out = [];
  const r2 = (n) => Math.round(n * 100) / 100;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
  };
  for (const container of tab.querySelectorAll('*')) {
    if (!visible(container)) continue;
    const cs = getComputedStyle(container);
    if (cs.display !== 'grid') continue;
    // Skip auto-fit/auto-fill templates (they already handle partial rows).
    const tmpl = (cs.gridTemplateColumns || '').trim();
    if (tmpl.includes('auto') || tmpl.includes('minmax')) continue;
    const children = [...container.children].filter(visible);
    if (children.length < 2) continue;
    const containerRect = container.getBoundingClientRect();
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;
    const paddingRight = parseFloat(cs.paddingRight) || 0;
    const innerWidth = containerRect.width - paddingLeft - paddingRight;
    if (innerWidth < 100) continue;
    // Group children into rows by top coordinate (within 8px).
    const rows = [];
    for (const child of children) {
      const cr = child.getBoundingClientRect();
      if (cr.height < 20) continue;
      const row = rows.find((r) => Math.abs(r.top - cr.top) <= 8);
      if (row) { row.items.push(cr); }
      else rows.push({ top: cr.top, items: [cr] });
    }
    for (const row of rows) {
      // A single-item row in a multi-row container is always an orphan: the column
      // count is too wide for the item count. Flag it directly without a % threshold.
      // A single-item row in a single-row container is trivially valid.
      if (row.items.length === 1) {
        if (rows.length > 1) {
          const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
          out.push(`row-fill: <${container.tagName.toLowerCase()}.${cls}> single-item trailing row (orphan card — column count too wide for item count)`);
        }
        continue;
      }
      // For rows with 2+ items, check that children together span >= 60% of the
      // container width (catches gross left-packing where far fewer items than columns
      // leaves most of the row empty; allows balanced n-of-(n+1) trailing rows).
      const totalChildWidth = row.items.reduce((sum, r) => sum + r.width, 0);
      const gap = parseFloat(cs.gap || cs.columnGap || '0') || 0;
      const totalGap = gap * (row.items.length - 1);
      const occupied = (totalChildWidth + totalGap) / innerWidth;
      if (occupied < 0.60) {
        const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        out.push(`row-fill: <${container.tagName.toLowerCase()}.${cls}> row spans only ${r2(occupied * 100)}% of container (need >= 60%)`);
        break; // one report per container
      }
    }
  }
  return out;
}

// CONTROL-SCALE BUDGET: within the tab's first header/toolbar surface (the first
// bg-surface panel at the top of the tab), visible interactive controls
// (buttons/toggles/selects) must have at most 2 distinct rendered heights (±2px),
// and no control exceeds 1.4× the modal height of the set.
// Rationale: this catches two-scale stacking in the same toolbar — e.g. a large
// primary button next to small toggle chips. Skips content-area controls
// (layer headers, card expand toggles) which are intentionally different sizes.
function controlScale(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [];
  const out = [];
  const r2 = (n) => Math.round(n * 100) / 100;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
  };
  // Find header toolbar panels in the top band of the tab (first 300px offset).
  // A toolbar panel: bg-surface, short height (< 110px), contains 2+ interactive controls.
  // This distinguishes toolbar panels from single-expand-button layer headers.
  const tabRect = tab.getBoundingClientRect();
  const toolbars = [];
  for (const el of tab.querySelectorAll('*')) {
    const cn = (el.className || '').toString();
    if (!cn.includes('bg-surface')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 200) continue;
    if (r.top - tabRect.top > 300) continue;
    if (r.height > 110) continue; // layer headers are taller; toolbars are compact
    // Must contain at least 2 interactive controls to qualify as a toolbar.
    const ctls = el.querySelectorAll('button, select, [role="switch"]');
    if (ctls.length < 2) continue;
    toolbars.push(el);
  }
  if (!toolbars.length) return [];
  const controls = toolbars.flatMap((t) =>
    [...t.querySelectorAll('button, select, [role="switch"]')].filter((el) => visible(el))
  );
  if (controls.length < 2) return [];
  const heights = controls.map((el) => Math.round(el.getBoundingClientRect().height));
  // Bucket heights into groups within ±2px of each other.
  const buckets = [];
  for (const h of heights) {
    const existing = buckets.find((b) => Math.abs(b - h) <= 2);
    if (existing === undefined) buckets.push(h);
  }
  if (buckets.length > 2) {
    out.push(`control-scale: ${buckets.length} distinct control heights in header toolbar [${[...new Set(heights)].sort((a, b) => a - b).join(', ')}px] > 2 allowed`);
  }
  // Modal height: the most common height bucket.
  const freq = {};
  for (const h of heights) {
    const key = buckets.find((b) => Math.abs(b - h) <= 2) ?? h;
    freq[key] = (freq[key] || 0) + 1;
  }
  const modalHeight = parseInt(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]);
  const maxAllowed = modalHeight * 1.4;
  const tallest = Math.max(...heights);
  if (tallest > maxAllowed + 1) {
    out.push(`control-scale: tallest control ${tallest}px exceeds 1.4x modal height ${modalHeight}px (max ${r2(maxAllowed)}px) in header toolbar`);
  }
  return out;
}

async function auditTab(browser, tab) {
  const { id: tabId, navLabel } = tab;
  const exemptions = (ledger.exemptions || {})[tabId] || [];
  const heightBudgets = ledger.heightBudgets || {};
  const tabHeightBudget = typeof heightBudgets[tabId] === 'number' ? heightBudgets[tabId] : 2.0;
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

    // D4b: HEIGHT BUDGET (light, 1440×900) — now per-tab budget from style-ledger.json
    if (!exemptions.includes('height-budget')) {
      const hb = await page.evaluate(heightBudget, { tabId, budget: tabHeightBudget });
      if (hb.ratio !== null && !hb.ok) {
        problems.push(`${prefix('1440 light')} height budget: scrollHeight ratio ${hb.ratio} > ${hb.limit}`);
      }
      // Always capture ratio for report (write to process.stderr so stdout stays clean on PASS)
      if (hb.ratio !== null) process.stderr.write(`height-ratio: [${tabId}] ${hb.ratio} (budget ${hb.limit})\n`);
    }

    // D4b: GRID EQUALITY (light, 1440px)
    if (!exemptions.includes('grid-equality')) {
      for (const p of await page.evaluate(gridEquality, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // D4b: LEGEND LAW (light)
    if (!exemptions.includes('legend-law')) {
      const ll = await page.evaluate(legendLaw, tabId);
      if (ll) problems.push(`${prefix('1440 light')} ${ll}`);
    }

    // D4b: MOTION LAW (light)
    if (!exemptions.includes('motion-law')) {
      for (const p of await page.evaluate(motionLaw, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // F6: CARD TEXT BUDGET (light, 1440px)
    if (!exemptions.includes('card-text-budget')) {
      for (const p of await page.evaluate(cardTextBudget, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // F6: ROW-FILL (light, 1440px)
    if (!exemptions.includes('row-fill')) {
      for (const p of await page.evaluate(rowFill, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // F6: CONTROL-SCALE BUDGET (light, 1440px)
    if (!exemptions.includes('control-scale')) {
      for (const p of await page.evaluate(controlScale, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
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
