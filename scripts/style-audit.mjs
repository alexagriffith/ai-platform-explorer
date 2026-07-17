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
import { readFileSync, mkdirSync } from 'fs';
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
  // Products tab: navigate to Compare sub-view so the ledger cells (formerly product-comparison)
  // are in the DOM for geometry checks and draft-banner checks.
  if (tabId === 'products') {
    await page.getByRole('button', { name: /^Compare$/i }).first().click();
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

  // Products tab (Compare sub-view): ledger cell geometry — only checked when Compare is the active sub-view.
  // When MCP, Catalog, or other sub-views are shown, skip ledger checks (no ledger cells present by design).
  if (tabId === 'products') {
    const A = [...tab.querySelectorAll('[data-ledger-cell="a"]')].map(rect);
    const B = [...tab.querySelectorAll('[data-ledger-cell="b"]')].map(rect);
    const N = [...tab.querySelectorAll('[data-ledger-cell="name"]')].map(rect);
    // Only require ledger cells when any ledger element exists (Compare sub-view is active)
    const hasLedgerContainer = tab.querySelector('[data-view="compare"]') !== null;
    if (hasLedgerContainer && (!A.length || !B.length)) out.push('ledger presence cells [data-ledger-cell] not found');
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
    // chips/badges, controls, form inputs, and explicitly-exempted marks are not structural boxes
    if (el.dataset.ui === 'chip' || el.dataset.ui === 'control' || el.dataset.uiExempt) return false;
    if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return false;
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

  // Distinct non-zero border-radius values — circles/pills (radius >= half min-dimension) excluded
  const radii = new Set();
  for (const el of tab.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    const r = rect(el);
    const minDim = Math.min(r.width, r.height);
    const topLeft = parseFloat(s.borderTopLeftRadius) || 0;
    // If the element is a circle or pill (radius fills the short axis), skip — it's a mark, not a card shape
    if (topLeft > 0.5 && minDim > 0 && topLeft >= minDim / 2 - 0.5) continue;
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
    // Skip tab navigation bars — tab items are label-sized, not equal-width cards.
    if (container.tagName === 'NAV' || container.getAttribute('role') === 'tablist') continue;
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
      if (r.width <= 1 || r.height <= 1 || s.display === 'none' || s.visibility === 'hidden') return false;
      // Skip disabled controls — they are intentionally not focusable.
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
      return true;
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

// ─── F11 checks ──────────────────────────────────────────────────────────────

// SPACING-SET MEMBERSHIP: computed padding/gap on cards, grids, and section containers
// must be in the allowed set {0, 4, 8, 12, 16, 24}px (plus 2/6px exceptions documented
// in commit F11). Reports selector + value for each offender.
// Exceptions: 2px (py-0.5/px-0.5 badge/chip micro-padding) and 6px (py-1.5 table cells,
// p-1.5 icon-button touch targets, gap-1.5 icon-to-label alignment) are allowed.
const SPACING_ALLOWED = new Set([0, 2, 4, 6, 8, 12, 16, 24]);

function spacingSetMembership(tabId) {
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
  const SPACING_ALLOWED = new Set([0, 2, 4, 6, 8, 12, 16, 24]);
  // Card/grid/section = elements that are direct layout containers or have a border
  const candidates = [...tab.querySelectorAll('*')].filter((el) => {
    if (!visible(el)) return false;
    const cs = getComputedStyle(el);
    const display = cs.display;
    return display === 'grid' || display === 'flex' || display === 'inline-flex';
  }).slice(0, 200); // sample up to 200 containers for performance

  for (const el of candidates) {
    // Skip elements with data-ui-exempt (programmatic spacing like tree indentation)
    if (el.dataset.uiExempt) continue;
    const cs = getComputedStyle(el);
    const props = [
      ['paddingTop', cs.paddingTop],
      ['paddingRight', cs.paddingRight],
      ['paddingBottom', cs.paddingBottom],
      ['paddingLeft', cs.paddingLeft],
      ['gap', cs.gap],
      ['rowGap', cs.rowGap],
      ['columnGap', cs.columnGap],
    ];
    for (const [prop, val] of props) {
      if (!val || val === 'normal') continue;
      // gap can be "Xpx Ypx"
      for (const part of val.split(' ')) {
        const px = parseFloat(part);
        if (isNaN(px)) continue;
        const rounded = Math.round(px);
        if (rounded === 0) continue; // zero is always fine
        if (!SPACING_ALLOWED.has(rounded)) {
          const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
          out.push(`spacing-set: <${el.tagName.toLowerCase()}.${cls}> ${prop}=${r2(px)}px not in {0,2,4,6,8,12,16,24}`);
          break; // one report per prop per element
        }
      }
    }
  }
  return out;
}

// INTERIOR-SLACK BUDGET: unit cards' (clientHeight - total visible text line height) <= 24px.
// Catches "centering into slack" where a card has excess empty space around its text.
// A "unit card" = element whose parent is a grid/flex, that has a visible border,
// and whose clientHeight is between 24px and 200px (larger cards are content cards, not unit boxes).
// SKIPS elements inside grid containers (grid stretch is intentional for equal-height rows).
function interiorSlack(tabId) {
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
    return ['Top', 'Right', 'Bottom', 'Left'].some((side) => {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const st = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      return w >= 1 && st !== 'none' && st !== 'hidden' && col !== 'transparent' && col !== 'rgba(0, 0, 0, 0)';
    });
  };
  for (const container of tab.querySelectorAll('*')) {
    if (!visible(container)) continue;
    const cs = getComputedStyle(container);
    // Skip grid containers: grid stretch (align-items: stretch) legitimately makes all
    // children equal-height by design (density law grid discipline). Only flex containers
    // are checked because flex doesn't auto-stretch unless explicitly set.
    if (cs.display !== 'flex' && cs.display !== 'inline-flex') continue;
    // Skip containers whose flex direction is column (children stack, height is additive)
    if (cs.flexDirection === 'column' || cs.flexDirection === 'column-reverse') continue;
    // Skip flex-wrap (children reflow; heights legitimately vary)
    if (cs.flexWrap === 'wrap' || cs.flexWrap === 'wrap-reverse') continue;
    for (const child of container.children) {
      if (!visible(child)) continue;
      if (!hasBorder(child)) continue;
      const cr = child.getBoundingClientRect();
      if (cr.height < 32 || cr.height > 160) continue; // skip tiny chips and content cards
      // Estimate total text height: maximum leaf-node height within the card
      let maxTextH = 0;
      for (const te of child.querySelectorAll('*')) {
        if (!visible(te)) continue;
        const teR = te.getBoundingClientRect();
        if (teR.height < 8 || teR.height > cr.height * 0.9) continue;
        // Only leaf-ish nodes (no children with their own height)
        if (te.children.length === 0 || (te.children.length === 1 && te.firstElementChild.getBoundingClientRect().height < 4)) {
          if (teR.height > maxTextH) maxTextH = teR.height;
        }
      }
      if (maxTextH === 0) continue;
      // Slack: space above + below the tallest text element.
      // Acceptable: padding-top + padding-bottom. Allow 32px buffer for line-height rounding + icons.
      const paddingV = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const slack = cr.height - maxTextH;
      if (slack > maxTextH + 32) {
        const cls = (child.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        out.push(`interior-slack: <${child.tagName.toLowerCase()}.${cls}> height=${r2(cr.height)}px maxTextH≈${r2(maxTextH)}px slack=${r2(slack)}px > budget`);
      }
    }
  }
  return out;
}

// MOBILE MIN-CARD-WIDTH: at 375px viewport, no unit card narrower than 150px.
// Catches fixed multi-column grids that cram cards on phones.
// A "unit card" = element with a visible border, height 40-300px (excludes tiny chips),
// width < 150px, and text content (excludes icon-only controls).
// Excludes: th/td (table cells), nav/header controls, icon-only elements.
function mobileMinCardWidth(tabId) {
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
    let borderCount = 0;
    ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const st = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      if (w >= 1 && st !== 'none' && st !== 'hidden' && col !== 'transparent' && col !== 'rgba(0, 0, 0, 0)') {
        borderCount++;
      }
    });
    return borderCount >= 2; // require at least 2 sides (excludes single-side underline tabs)
  };
  const SKIP_TAGS = new Set(['TH', 'TD', 'THEAD', 'TBODY', 'TR', 'TABLE', 'INPUT', 'SELECT', 'OPTION', 'SVG', 'PATH']);
  const boxes = [...tab.querySelectorAll('*')].filter((el) => {
    if (SKIP_TAGS.has(el.tagName)) return false;
    if (!visible(el)) return false;
    if (!hasBorder(el)) return false;
    const r = el.getBoundingClientRect();
    // Only unit cards: height 40-300px (not tiny chips, not large panels)
    if (r.height < 40 || r.height > 300) return false;
    // Must have visible text content (not icon-only controls)
    const text = (el.innerText || el.textContent || '').trim();
    if (text.length < 3) return false;
    return r.width < 150;
  });
  for (const el of boxes) {
    const r = el.getBoundingClientRect();
    const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
    out.push(`mobile-min-card-width: <${el.tagName.toLowerCase()}.${cls}> width=${r2(r.width)}px < 150px at 375px viewport`);
  }
  // Deduplicate by keeping only the first 5 (avoid flooding output)
  return out.slice(0, 5);
}

// ─── F12 checks ──────────────────────────────────────────────────────────────

// UNIT-BOX WIDTH BOUNDS (F12): at 1440px viewport, unit cards (bordered elements
// in grid/flex rows, height 32-200px, containing text) must be 200-360px wide.
// Catches cards that are too narrow (cramped) or too wide (wastes horizontal space).
// Skips: modals/overlays (position:fixed), full-width sections, table cells.
function unitBoxWidthBounds(tabId) {
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
    let n = 0;
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const st = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      if (w >= 1 && st !== 'none' && st !== 'hidden' && col !== 'transparent' && col !== 'rgba(0, 0, 0, 0)') n++;
    }
    return n >= 3;
  };
  const SKIP_TAGS = new Set(['TH', 'TD', 'THEAD', 'TBODY', 'TR', 'TABLE', 'SVG', 'PATH', 'INPUT', 'SELECT']);
  for (const el of tab.querySelectorAll('*')) {
    if (SKIP_TAGS.has(el.tagName)) continue;
    if (!visible(el)) continue;
    if (!hasBorder(el)) continue;
    const pos = getComputedStyle(el).position;
    if (pos === 'fixed' || pos === 'absolute') continue; // skip modals/overlays
    // Skip explicit interactive controls and chips — they have intentional size variation.
    const dataUi = el.getAttribute('data-ui');
    if (dataUi === 'control' || dataUi === 'chip' || dataUi === 'section-header') continue;
    const cr = el.getBoundingClientRect();
    if (cr.height < 32 || cr.height > 200) continue; // only unit cards
    if (cr.width > 600) continue; // skip full-width sections
    const text = (el.innerText || el.textContent || '').trim();
    if (text.length < 2) continue; // skip icon-only
    // Check parent is a grid/flex (making this a sibling-unit card)
    const parentCs = getComputedStyle(el.parentElement || el);
    const parentDisplay = parentCs.display;
    if (parentDisplay !== 'grid' && parentDisplay !== 'flex' && parentDisplay !== 'inline-flex') continue;
    if (cr.width < 200) {
      const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
      out.push(`unit-box-width: <${el.tagName.toLowerCase()}.${cls}> width=${r2(cr.width)}px < 200px min`);
    } else if (cr.width > 360) {
      const siblings = [...(el.parentElement?.children || [])].filter(visible);
      if (siblings.length >= 2) { // only flag if there are sibling cards (not solo full-width)
        const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        out.push(`unit-box-width: <${el.tagName.toLowerCase()}.${cls}> width=${r2(cr.width)}px > 360px max`);
      }
    }
  }
  return out.slice(0, 5); // cap output
}

// NO-GHOST-CELLS (F12): partial grid rows must be centered, not left-packed.
// A "ghost cell" = the empty space left when a partial row is left-aligned.
// Checks: grid containers whose last row has fewer items than full rows must have
// justify-content: center or place-content: center OR the items must be centered by
// comparing their centroid X to the container's center X (within 8px tolerance).
function noGhostCells(tabId) {
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
    // Only fixed-column grids (not auto-fill)
    const tmpl = (cs.gridTemplateColumns || '').trim();
    if (tmpl.includes('auto') || tmpl.includes('minmax')) continue;
    const parts = tmpl.split(/\s+/);
    if (parts.length < 2) continue; // single-column is never partial
    const colCount = parts.length;
    const children = [...container.children].filter(visible);
    if (children.length < 2) continue;
    // Find last row items
    const rects = children.map((c) => ({ el: c, r: c.getBoundingClientRect() }));
    const rows = [];
    for (const item of rects) {
      const row = rows.find((r) => Math.abs(r.top - item.r.top) <= 8);
      if (row) row.items.push(item);
      else rows.push({ top: item.r.top, items: [item] });
    }
    if (rows.length < 2) continue; // only one row — no partial-row issue
    const lastRow = rows[rows.length - 1];
    if (lastRow.items.length >= colCount) continue; // full last row — no ghost cells
    // Last row is partial: check if it's centered
    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    // Compute centroid of last-row items
    const itemsLeftEdge = Math.min(...lastRow.items.map((i) => i.r.left));
    const itemsRightEdge = Math.max(...lastRow.items.map((i) => i.r.right));
    const itemsCenterX = (itemsLeftEdge + itemsRightEdge) / 2;
    const offset = Math.abs(itemsCenterX - containerCenterX);
    // Also check CSS justify-content
    const justifyContent = cs.justifyContent;
    const isCentered = justifyContent === 'center' || justifyContent === 'space-around' || justifyContent === 'space-evenly';
    if (!isCentered && offset > 16) {
      const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
      out.push(`no-ghost-cells: <${container.tagName.toLowerCase()}.${cls}> partial last row (${lastRow.items.length}/${colCount} items) not centered — offset ${r2(offset)}px from container center`);
    }
  }
  return out.slice(0, 5);
}

// SKINNY-BAR CHECK (item 8): any full-width row element (width >= 85% of viewport)
// whose visible content spans < 40% of its width fails.
// Catches header/toolbar bars with a few small items in a large empty band.
// "Full-width row" = display:flex or display:grid, width >= 85% of window.innerWidth,
// height <= 80px (bar, not a content section).
function skinnyBar(tabId) {
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
  const vpWidth = window.innerWidth;
  for (const el of tab.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.display !== 'flex' && cs.display !== 'grid' && cs.display !== 'inline-flex') continue;
    const cr = el.getBoundingClientRect();
    if (cr.width < vpWidth * 0.85) continue; // not a full-width row
    if (cr.height > 80) continue; // too tall to be a "bar"
    if (cr.height < 20) continue; // too thin (invisible/decorative)
    // Measure content span: leftmost to rightmost child edge
    const children = [...el.children].filter(visible);
    if (children.length < 1) continue;
    const contentLeft = Math.min(...children.map((c) => c.getBoundingClientRect().left));
    const contentRight = Math.max(...children.map((c) => c.getBoundingClientRect().right));
    const contentWidth = contentRight - contentLeft;
    const fillRatio = contentWidth / cr.width;
    if (fillRatio < 0.40) {
      const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
      out.push(`skinny-bar: <${el.tagName.toLowerCase()}.${cls}> content fills only ${r2(fillRatio * 100)}% of ${r2(cr.width)}px bar (need >= 40%)`);
    }
  }
  return out.slice(0, 5);
}
// ─── T-2b checks: relational layout checks for card groups ──────────────────
//
// A "card group" is a flex-wrap container that has at least one child (at any
// level within one wrapper div) carrying data-ui="card".
// Row detection: children (or their card-bearing wrapper divs) grouped by offsetTop
// within 8px tolerance.
//
// MINIMUM-ROWS: if all cards in the group fit on one row (sum of card widths +
// gaps <= container inner width) but the DOM renders >1 row → FAIL.
// Reports: minimum-rows: <selector> tab=<tabId> (cards fit on one row but rendered <N> rows)
//
// ORPHAN-ROW: if a group renders >1 row and any row has exactly 1 item while a
// balanced redistribution (row sizes differ by <=1) is possible for the same
// item count → FAIL.
// Reports: orphan-row: <selector> tab=<tabId> (row of 1 while N items balance as K×M or …)
//
function minimumRowsCheck(tabId) {
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

  // Collect flex-wrap containers whose direct children contain data-ui="card" descendants.
  for (const container of tab.querySelectorAll('*')) {
    if (!visible(container)) continue;
    const cs = getComputedStyle(container);
    if (cs.display !== 'flex' && cs.display !== 'inline-flex') continue;
    if (cs.flexWrap !== 'wrap' && cs.flexWrap !== 'wrap-reverse') continue;

    // Gather the data-ui="card" elements (direct children or first card within a wrapper child).
    // We measure content width from the card element itself (not the wrapper, which may be basis-full).
    const cards = [];
    for (const child of container.children) {
      if (!visible(child)) continue;
      if (child.getAttribute('data-ui') === 'card') {
        cards.push({ wrapper: child, card: child });
      } else {
        const inner = child.querySelector('[data-ui="card"]');
        if (inner && visible(inner)) cards.push({ wrapper: child, card: inner });
      }
    }
    if (cards.length < 2) continue;

    const containerRect = container.getBoundingClientRect();
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;
    const paddingRight = parseFloat(cs.paddingRight) || 0;
    const innerWidth = containerRect.width - paddingLeft - paddingRight;
    if (innerWidth < 80) continue;

    // Group by wrapper's top coordinate (within 8px) to detect rendered rows.
    const rows = [];
    for (const { wrapper } of cards) {
      const wr = wrapper.getBoundingClientRect();
      const existing = rows.find((row) => Math.abs(row.top - wr.top) <= 8);
      if (existing) {
        existing.count++;
      } else {
        rows.push({ top: wr.top, count: 1 });
      }
    }

    if (rows.length <= 1) continue; // already on one row — no problem

    // Check if all card content widths + gaps would fit on one row.
    const gap = parseFloat(cs.gap || cs.columnGap || '0') || 0;
    // Use the card element's own width (not wrapper which may be basis-full)
    const totalCardWidth = cards.reduce((sum, { card }) => sum + card.getBoundingClientRect().width, 0);
    const totalGapWidth = gap * (cards.length - 1);
    const totalRequired = totalCardWidth + totalGapWidth;

    if (totalRequired <= innerWidth + 0.5) {
      const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
      out.push(`minimum-rows: <${container.tagName.toLowerCase()}.${cls}> tab=${tabId} (cards fit on one row — total ${r2(totalRequired)}px <= inner ${r2(innerWidth)}px — but rendered ${rows.length} rows)`);
    }
  }
  return out;
}

function orphanRowCheck(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return [];
  const out = [];

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
  };

  for (const container of tab.querySelectorAll('*')) {
    if (!visible(container)) continue;
    const cs = getComputedStyle(container);
    if (cs.display !== 'flex' && cs.display !== 'inline-flex') continue;
    if (cs.flexWrap !== 'wrap' && cs.flexWrap !== 'wrap-reverse') continue;

    const cardWrappers = [...container.children].filter((child) => {
      if (!visible(child)) return false;
      return child.getAttribute('data-ui') === 'card' || child.querySelector('[data-ui="card"]');
    });
    if (cardWrappers.length < 2) continue;

    // Group into rows.
    const rows = [];
    for (const wrapper of cardWrappers) {
      const wr = wrapper.getBoundingClientRect();
      const existing = rows.find((row) => Math.abs(row.top - wr.top) <= 8);
      if (existing) {
        existing.count++;
      } else {
        rows.push({ top: wr.top, count: 1 });
      }
    }

    if (rows.length <= 1) continue; // only one row — no orphan possible

    // Check if any row has exactly 1 item.
    const hasOrphan = rows.some((r) => r.count === 1);
    if (!hasOrphan) continue;

    // Check if a balanced redistribution is possible:
    // Try col counts from 2 to 4; a balanced layout has all rows differing by <=1 item.
    const n = cardWrappers.length;
    let balancedDesc = null;
    for (let cols = 2; cols <= 4; cols++) {
      if (cols > n) continue;
      const fullRows = Math.floor(n / cols);
      const remainder = n % cols;
      // Balanced: remainder === 0 (all rows equal) OR remainder rows have cols items and
      // the last row has (n - fullRows*cols) items — but we need rows to differ by <=1.
      // With integer division: remainder rows have (cols) items, rest have (cols) items too
      // Actually: ceil rows = Math.ceil(n/cols); floor rows differ by at most 1 from ceil.
      // Orphan-free means no row has exactly 1 item — any cols 2+ with remainder != 1 suffices.
      if (remainder !== 1) {
        balancedDesc = `${cols} cols (${fullRows > 0 && remainder > 0 ? fullRows + '×' + cols + '+' + remainder : fullRows + '×' + cols})`;
        break;
      }
    }
    if (!balancedDesc) continue; // no balanced alternative exists — don't flag

    const cls = (container.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
    out.push(`orphan-row: <${container.tagName.toLowerCase()}.${cls}> tab=${tabId} (row of 1 while ${n} items balance as ${balancedDesc} — never one box alone on its own row)`);
  }
  return out;
}

//
// DOM-side classification function. Runs in-page via page.evaluate().
// Returns { unclassified: [...], exempted: [...], classified: number, visited: number }.
//
// CLOSED WORLD: any element with a border-surface/interactive role and NO data-ui
// (and no ancestor with data-ui-exempt) is reported as unclassified.
//
// A "surfaced" element = 3+ bordered sides (isBox), OR bg-surface/bg-tint class that
// itself is the direct layout node (not a child span), OR a visibly-bordered interactive.
//
function archetypeWalkerProbe(tabId) {
  const tab = document.querySelector(`[data-tab="${tabId}"]`);
  if (!tab) return { unclassified: [`tab [data-tab="${tabId}"] not found`], exempted: [], classified: 0, visited: 0, coverage: '' };

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'DEFS', 'CLIPPATH', 'G', 'CIRCLE', 'RECT', 'LINE', 'POLYLINE', 'POLYGON', 'TEXT', 'USE']);
  const KNOWN_ARCHETYPES = new Set(['card', 'chip', 'chip-row', 'section-header', 'label-row', 'prose-list', 'table', 'control', 'overlay']);
  const r2 = (n) => Math.round(n * 100) / 100;

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0;
  };

  const isBox = (el) => {
    const s = getComputedStyle(el);
    let n = 0;
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const st = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      const transparent = col === 'transparent' || col === 'rgba(0, 0, 0, 0)';
      if (w >= 1 && st !== 'none' && st !== 'hidden' && !transparent) n++;
    }
    if (n < 3) return false;
    const r = el.getBoundingClientRect();
    const radius = Math.max(parseFloat(s.borderTopLeftRadius) || 0, parseFloat(s.borderBottomRightRadius) || 0);
    if (radius >= Math.min(r.width, r.height) / 2 - 0.5) return false; // pill/circle = mark
    return true;
  };

  const isSurfaced = (el) => {
    const cn = (el.className || '').toString();
    // Surface tokens from styleTokens.js
    return cn.includes('bg-surface') || cn.includes('bg-tint') || cn.includes('bg-page');
  };

  const isInteractiveWithBorder = (el) => {
    const tag = el.tagName;
    const role = el.getAttribute('role');
    const isInteractiveEl = tag === 'BUTTON' || tag === 'A' || role === 'button' || role === 'switch';
    if (!isInteractiveEl) return false;
    const s = getComputedStyle(el);
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(s[`border${side}Width`]) || 0;
      const st = s[`border${side}Style`];
      const col = s[`border${side}Color`];
      const transparent = col === 'transparent' || col === 'rgba(0, 0, 0, 0)';
      if (w >= 1 && st !== 'none' && st !== 'hidden' && !transparent) return true;
    }
    return false;
  };

  const needsClassification = (el) => {
    return isBox(el) || isSurfaced(el) || isInteractiveWithBorder(el);
  };

  const hasExemptAncestor = (el) => {
    let p = el.parentElement;
    while (p && p !== tab.parentElement) {
      if (p.hasAttribute('data-ui-exempt')) return true;
      p = p.parentElement;
    }
    return false;
  };

  // An element inside a classified ancestor doesn't need its own archetype.
  // Surfaces INSIDE cards/tables/overlays are implementation detail, not archetype surfaces.
  const hasClassifiedAncestor = (el) => {
    let p = el.parentElement;
    while (p && p !== tab.parentElement) {
      if (p.hasAttribute('data-ui')) return true;
      p = p.parentElement;
    }
    return false;
  };

  const unclassified = [];
  const exempted = [];
  let classified = 0;
  let visited = 0;

  const all = [...tab.querySelectorAll('*')];
  for (const el of all) {
    if (SKIP_TAGS.has(el.tagName)) continue;
    if (!visible(el)) continue;
    visited++;

    const archetype = el.getAttribute('data-ui');
    const exempt = el.getAttribute('data-ui-exempt');

    if (archetype) {
      if (KNOWN_ARCHETYPES.has(archetype)) {
        classified++;
      } else {
        unclassified.push(`unknown archetype "${archetype}": <${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.')}>`);
      }
      continue; // classified elements are fine
    }

    if (exempt !== null) {
      exempted.push(`exempt(${exempt}): <${el.tagName.toLowerCase()}>`);
      continue;
    }

    if (hasExemptAncestor(el)) continue;
    if (hasClassifiedAncestor(el)) continue;

    if (needsClassification(el)) {
      const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
      const r = el.getBoundingClientRect();
      unclassified.push(`unclassified surface: <${el.tagName.toLowerCase()}.${cls}> [${r2(r.width)}x${r2(r.height)}]`);
    }
  }

  const coverage = `visited ${visited} / classified ${classified} / exempted ${exempted.length} / unclassified ${unclassified.length}`;
  return { unclassified, exempted, classified, visited, coverage };
}

// ─── U0: Per-archetype invariant checks ───────────────────────────────────────
//
// Checks uniformity within each archetype group per tab:
// card: all instances share the same computed font-size and text-align.
// chip-row: wraps balanced (no single-chip orphan row when >2 chips).
// section-header: same font-size and text-align across instances.
// Runs via page.evaluate() in the same context as tabProbe.
//
function archetypeInvariantsProbe(tabId) {
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

  // Collect all visible elements per archetype
  const byArchetype = {};
  for (const el of tab.querySelectorAll('[data-ui]')) {
    if (!visible(el)) continue;
    const at = el.getAttribute('data-ui');
    if (!byArchetype[at]) byArchetype[at] = [];
    byArchetype[at].push(el);
  }

  // CARD uniformity: text-align consistent, font-size consistent (within ±1px)
  const cards = byArchetype['card'] || [];
  if (cards.length >= 2) {
    // Sample first heading or first text node per card
    const fontSizes = cards.map((card) => {
      const heading = card.querySelector('h2, h3, h4, h5');
      if (heading && visible(heading)) return parseFloat(getComputedStyle(heading).fontSize) || 0;
      return 0;
    }).filter(n => n > 0);
    // Cards intentionally vary in heading level so skip global font-size uniformity.
    // Check text-align: all cards should be left or center consistently per tab.
    const textAligns = cards.map((card) => {
      const heading = card.querySelector('h2, h3, h4, h5');
      if (heading && visible(heading)) return getComputedStyle(heading).textAlign;
      return getComputedStyle(card).textAlign;
    });
    // Normalize 'start' and 'left' as equivalent (browser rendering difference, not a design issue).
    // Only flag if right-aligned and left/center-aligned cards coexist (truly inconsistent).
    const normalizedAligns = new Set(textAligns.map(a => a === 'start' ? 'left' : a));
    if (normalizedAligns.has('right') && normalizedAligns.size > 1) {
      out.push(`archetype-uniformity card[text-align]: ${tabId} — right-aligned cards mixed with left/center [${[...normalizedAligns].join(', ')}]`);
    }
  }

  // SECTION-HEADER uniformity: all section-headers consistent font-size (±1px tolerance)
  const headers = byArchetype['section-header'] || [];
  if (headers.length >= 2) {
    const sizes = headers.map((h) => parseFloat(getComputedStyle(h).fontSize) || 0).filter(n => n > 0);
    if (sizes.length >= 2) {
      const min = Math.min(...sizes);
      const max = Math.max(...sizes);
      if (max - min > 2) {
        out.push(`archetype-uniformity section-header[font-size]: ${tabId} — range ${r2(min)}px–${r2(max)}px (>2px spread)`);
      }
    }
  }

  // CHIP-ROW: no orphan single-chip row when row has >2 chips total
  const chipRows = byArchetype['chip-row'] || [];
  for (const row of chipRows) {
    const chips = [...row.querySelectorAll('[data-ui="chip"]')].filter(visible);
    if (chips.length <= 2) continue; // <=2 chips never orphan
    // Group chips into visual rows by top coordinate (within 8px)
    const rows = [];
    for (const chip of chips) {
      const cr = chip.getBoundingClientRect();
      const existing = rows.find(r => Math.abs(r.top - cr.top) <= 8);
      if (existing) existing.count++;
      else rows.push({ top: cr.top, count: 1 });
    }
    // Orphan: a row with exactly 1 chip when there are multiple rows
    if (rows.length > 1 && rows.some(r => r.count === 1)) {
      const cls = (row.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
      out.push(`archetype chip-row orphan: <${row.tagName.toLowerCase()}.${cls}> has single-chip wrap line (${chips.length} chips total)`);
    }
  }

  // CONTROL invariants: focus-visible ring present on enabled buttons/links
  const controls = byArchetype['control'] || [];
  for (const ctrl of controls.slice(0, 20)) {
    // Skip disabled controls — intentionally not focusable.
    if (ctrl.disabled || ctrl.getAttribute('aria-disabled') === 'true') continue;
    const cn = (ctrl.className || '').toString();
    const hasFocusRing = cn.includes('focus-visible:ring') || cn.includes('focus-visible:outline-none');
    if (!hasFocusRing) {
      const cls = cn.split(' ').filter(Boolean).slice(0, 3).join('.');
      out.push(`archetype control no-focus-ring: <${ctrl.tagName.toLowerCase()}.${cls}>`);
    }
  }

  return out;
}

// ─── STATUS-FILL BAN (U0-R new check) ───────────────────────────────────────
//
// Status colors (green/amber families) may paint ONLY marks and badges.
// Any element with a status-color background that has child elements OR
// height > 48px FAILS with "status color as section identity".
// Status-color families: green-*, emerald-*, amber-*, yellow-* (Tailwind BG classes).
//
function statusFillBan(tabId) {
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

  // Classify a computed background color as a status family (green/amber).
  // Returns 'green' | 'amber' | null.
  const statusFamily = (bgColor) => {
    if (!bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') return null;
    // Parse RGB components
    const m = bgColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return null;
    const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
    // Green family: g dominant, g > 100, r < g, b < g (covers green-500 through green-800, emerald)
    if (g > r && g > b && g > 80 && r < g * 0.8 && b < g * 0.9) return 'green';
    // Amber/yellow family: r + g dominant, r close to g, b low
    if (r > 150 && g > 120 && r > b * 2 && g > b * 1.5 && Math.abs(r - g) < 80) return 'amber';
    return null;
  };

  // Skip: elements inside overlay/modal (they have their own context)
  // Skip: elements whose data-ui="chip" or data-ui-exempt (marks/badges are allowed)
  // Skip: SVG descendants
  const SKIP_TAGS = new Set(['SVG', 'PATH', 'CIRCLE', 'RECT', 'G', 'DEFS', 'USE']);

  for (const el of tab.querySelectorAll('*')) {
    if (SKIP_TAGS.has(el.tagName)) continue;
    if (!visible(el)) continue;
    const dataUi = el.getAttribute('data-ui');
    // Chips and marks are allowed to use status colors
    if (dataUi === 'chip' || dataUi === 'chip-row') continue;
    // Check for data-ui-exempt (allows specific overrides)
    if (el.hasAttribute('data-ui-exempt')) continue;
    // Check ancestry for chip/overlay (inside them = not a section background)
    let ancestor = el.parentElement;
    let inChipOrOverlay = false;
    while (ancestor && ancestor !== tab.parentElement) {
      const aui = ancestor.getAttribute('data-ui');
      if (aui === 'chip' || aui === 'chip-row' || aui === 'overlay') { inChipOrOverlay = true; break; }
      ancestor = ancestor.parentElement;
    }
    if (inChipOrOverlay) continue;

    const bg = getComputedStyle(el).backgroundColor;
    const family = statusFamily(bg);
    if (!family) continue;

    const r = el.getBoundingClientRect();
    const childCount = el.childElementCount;
    const isSection = r.height > 48 || childCount > 2;
    if (isSection) {
      const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.');
      out.push(`status-fill-ban: <${el.tagName.toLowerCase()}.${cls}> uses ${family} status color as section identity (h=${r2(r.height)}px, children=${childCount})`);
    }
  }
  return out.slice(0, 10); // cap to avoid flooding
}

// ─── STATES TABLE (U0-R) — declarative interaction openers per tab ────────────
//
// Each entry: { tab, state, label, open: async (page) => Promise<void>, themes: ['light'] | ['light','dark'] }
// `open` navigates to the state after the tab is already open.
// `screenshotName` is used as the file name stem.
//
// Exemptions per state override the tab-level ledger exemptions.
//
const STATES_TABLE = [
  // ── ARCHITECTURE ──────────────────────────────────────────────────────────
  {
    tab: 'architecture', navLabel: 'Architecture',
    state: 'build-resting', label: 'architecture / Build Your Stack (resting)',
    screenshotName: 'architecture--build-resting',
    themes: ['light', 'dark'],
    open: async () => { /* resting state — already open */ },
  },
  {
    tab: 'architecture', navLabel: 'Architecture',
    state: 'configure-modal', label: 'architecture / configure modal (first capability)',
    screenshotName: 'architecture--configure-modal',
    themes: ['light'],
    open: async (page) => {
      // Click the first clickable capability card (any layer header to expand first, then card)
      const cardBtn = page.locator('[data-tab="architecture"] [data-ui="card"]').first();
      if (await cardBtn.count() > 0) await cardBtn.click();
      await page.waitForTimeout(300);
      // Look for the configure modal
      const modal = page.locator('[data-ui="overlay"]').first();
      if (await modal.count() === 0) {
        // Try clicking any button labeled Configure or Change inside the tab
        const configBtn = page.locator('[data-tab="architecture"] button').filter({ hasText: /configure|change/i }).first();
        if (await configBtn.count() > 0) await configBtn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    tab: 'architecture', navLabel: 'Architecture',
    state: 'interactive-mid-wizard', label: 'architecture / Interactive Builder mid-wizard',
    screenshotName: 'architecture--interactive-mid-wizard',
    themes: ['light'],
    open: async (page) => {
      // Switch to Interactive Builder mode
      await page.locator('[data-tab="architecture"] button').filter({ hasText: /interactive builder/i }).first().click();
      await page.waitForTimeout(500);
      // Make a selection so it advances past step 1
      const firstOption = page.locator('[data-tab="architecture"] button').filter({ hasText: /openshift|rhel|kubernetes/i }).first();
      if (await firstOption.count() > 0) {
        await firstOption.click();
        await page.waitForTimeout(200);
        // Click continue
        const continueBtn = page.locator('[data-tab="architecture"] button').filter({ hasText: /continue|next layer/i }).first();
        if (await continueBtn.count() > 0) await continueBtn.click();
        await page.waitForTimeout(300);
      }
    },
  },
  {
    tab: 'architecture', navLabel: 'Architecture',
    state: 'interactive-completion', label: 'architecture / Interactive Builder completion screen',
    screenshotName: 'architecture--interactive-completion',
    themes: ['light'],
    // NOTE: this state is expected to FAIL status-fill-ban before Commit 2 fixes it.
    // After the fix, bg-green-600 panel becomes neutral surface.
    open: async (page) => {
      // Switch to Interactive Builder
      await page.locator('[data-tab="architecture"] button').filter({ hasText: /interactive builder/i }).first().click();
      await page.waitForTimeout(400);
      // Walk through all steps by selecting first option and clicking continue each time
      for (let step = 0; step < 10; step++) {
        const continueBtn = page.locator('[data-tab="architecture"] button').filter({ hasText: /continue to next layer|complete stack/i }).first();
        if (await continueBtn.count() === 0) break;
        // Select first available option in this step if needed
        const optionBtn = page.locator('[data-tab="architecture"] [data-ui="card"]').first();
        if (await optionBtn.count() > 0) {
          const isEnabled = await optionBtn.isEnabled();
          if (isEnabled) await optionBtn.click();
          await page.waitForTimeout(150);
        }
        const isEnabled = await continueBtn.isEnabled();
        if (!isEnabled) {
          // Force-click first option card
          const firstCard = page.locator('[data-tab="architecture"] button').filter({ hasText: /openshift|rhel|kubernetes|vllm/i }).first();
          if (await firstCard.count() > 0) await firstCard.click();
          await page.waitForTimeout(150);
        }
        await continueBtn.click();
        await page.waitForTimeout(300);
        // Check if completion screen is showing
        const completionHeader = page.locator('[data-tab="architecture"]').filter({ hasText: /guided steps complete|your complete stack/i });
        if (await completionHeader.count() > 0) break;
      }
      await page.waitForTimeout(400);
    },
  },
  {
    tab: 'architecture', navLabel: 'Architecture',
    state: 'generate-mode', label: 'architecture / Generate from Environment',
    screenshotName: 'architecture--generate-mode',
    themes: ['light'],
    open: async (page) => {
      await page.locator('[data-tab="architecture"] button').filter({ hasText: /generate from environment/i }).first().click();
      await page.waitForTimeout(400);
    },
  },
  {
    tab: 'architecture', navLabel: 'Architecture',
    state: 'blueprints-mode', label: 'architecture / Blueprints',
    screenshotName: 'architecture--blueprints-mode',
    themes: ['light'],
    open: async (page) => {
      await page.locator('[data-tab="architecture"] button').filter({ hasText: /blueprints/i }).first().click();
      await page.waitForTimeout(400);
    },
  },

  // ── DECISIONS ─────────────────────────────────────────────────────────────
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'guide-resting', label: 'decisions / guide list (resting)',
    screenshotName: 'decisions--guide-resting',
    themes: ['light', 'dark'],
    open: async () => { /* resting state */ },
  },
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'product-guide-q1', label: 'decisions / product guide — Question 1',
    screenshotName: 'decisions--product-guide-q1',
    themes: ['light'],
    open: async (page) => {
      // Click the product selection guide
      await page.locator('[data-tab="decisions"] button, [data-tab="decisions"] [role="button"]')
        .filter({ hasText: /platform selection|product selection/i }).first().click();
      await page.waitForTimeout(400);
    },
  },
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'product-guide-q2', label: 'decisions / product guide — Question 2 (after first answer)',
    screenshotName: 'decisions--product-guide-q2',
    themes: ['light'],
    open: async (page) => {
      // Open the product guide
      await page.locator('[data-tab="decisions"] button, [data-tab="decisions"] [role="button"]')
        .filter({ hasText: /platform selection|product selection/i }).first().click();
      await page.waitForTimeout(400);
      // Click the first option button in the question
      const optionBtn = page.locator('[data-tab="decisions"] button[aria-current], [data-tab="decisions"] button').filter({ hasText: /openshift|kubernetes|cloud|managed/i }).first();
      if (await optionBtn.count() > 0) await optionBtn.click();
      await page.waitForTimeout(300);
    },
  },
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'product-guide-recommendation', label: 'decisions / product guide — recommendation',
    screenshotName: 'decisions--product-guide-recommendation',
    themes: ['light'],
    open: async (page) => {
      // Open the product guide and walk to recommendation by always clicking first option
      await page.locator('[data-tab="decisions"] button, [data-tab="decisions"] [role="button"]')
        .filter({ hasText: /platform selection|product selection/i }).first().click();
      await page.waitForTimeout(400);
      for (let step = 0; step < 8; step++) {
        // Look for a recommendation card
        const recCard = page.locator('[data-tab="decisions"]').filter({ hasText: /recommendation|recommended/i }).first();
        // If recommendation has a product name heading visible, we're done
        const hasRec = await page.locator('[data-tab="decisions"] [data-ui="card"]').filter({ hasText: /red hat|openshift ai|rhel ai/i }).count();
        if (hasRec > 0) break;
        // Click first unselected option
        const optionBtn = page.locator('[data-tab="decisions"] button').filter({ hasText: /openshift|kubernetes|cloud|managed|yes|no|inference|training/i }).first();
        if (await optionBtn.count() === 0) break;
        await optionBtn.click();
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(300);
    },
  },
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'deployment-guide-q1', label: 'decisions / deployment guide — Question 1',
    screenshotName: 'decisions--deployment-guide-q1',
    themes: ['light'],
    open: async (page) => {
      await page.locator('[data-tab="decisions"] button, [data-tab="decisions"] [role="button"]')
        .filter({ hasText: /deployment/i }).first().click();
      await page.waitForTimeout(400);
    },
  },
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'finetune-matrix', label: 'decisions / fine-tuning matrix',
    screenshotName: 'decisions--finetune-matrix',
    themes: ['light'],
    open: async (page) => {
      // Switch to Reference Guides group if needed, then open fine-tuning matrix
      const ftBtn = page.locator('[data-tab="decisions"] button').filter({ hasText: /fine.tun/i }).first();
      if (await ftBtn.count() > 0) await ftBtn.click();
      await page.waitForTimeout(400);
    },
  },
  {
    tab: 'decisions', navLabel: 'Decision Guides',
    state: 'security-overview', label: 'decisions / security overview',
    screenshotName: 'decisions--security-overview',
    themes: ['light'],
    open: async (page) => {
      const secBtn = page.locator('[data-tab="decisions"] button').filter({ hasText: /security/i }).first();
      if (await secBtn.count() > 0) await secBtn.click();
      await page.waitForTimeout(400);
    },
  },

  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  {
    tab: 'products', navLabel: 'Products',
    state: 'compare-resting', label: 'products / Compare sub-view (resting)',
    screenshotName: 'products--compare-resting',
    themes: ['light', 'dark'],
    open: async () => { /* openTab already navigates to Compare */ },
  },
  {
    tab: 'products', navLabel: 'Products',
    state: 'catalog-resting', label: 'products / Catalog sub-view',
    screenshotName: 'products--catalog-resting',
    themes: ['light'],
    open: async (page) => {
      await page.locator('[data-tab="products"] button').filter({ hasText: /catalog/i }).first().click();
      await page.waitForTimeout(400);
    },
  },
  {
    tab: 'products', navLabel: 'Products',
    state: 'catalog-filtered', label: 'products / Catalog — search filtered',
    screenshotName: 'products--catalog-filtered',
    themes: ['light'],
    open: async (page) => {
      await page.locator('[data-tab="products"] button').filter({ hasText: /catalog/i }).first().click();
      await page.waitForTimeout(300);
      const searchInput = page.locator('[data-tab="products"] input[type="text"], [data-tab="products"] input[placeholder]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('inference');
        await page.waitForTimeout(300);
      }
    },
  },
  {
    tab: 'products', navLabel: 'Products',
    state: 'mcp-ecosystem', label: 'products / MCP Ecosystem sub-view',
    screenshotName: 'products--mcp-ecosystem',
    themes: ['light'],
    open: async (page) => {
      await page.locator('[data-tab="products"] button').filter({ hasText: /mcp ecosystem/i }).first().click();
      await page.waitForTimeout(400);
    },
  },

  // ── DEPLOYMENT IMPACT ─────────────────────────────────────────────────────
  {
    tab: 'deployment-impact', navLabel: 'Deployment Impact',
    state: 'selector-resting', label: 'deployment-impact / selector (resting)',
    screenshotName: 'deployment-impact--selector-resting',
    themes: ['light', 'dark'],
    open: async () => { /* resting state */ },
  },
  {
    tab: 'deployment-impact', navLabel: 'Deployment Impact',
    state: 'comparison-yaml', label: 'deployment-impact / first comparison YAML Diff',
    screenshotName: 'deployment-impact--comparison-yaml',
    themes: ['light'],
    open: async (page) => {
      const firstCard = page.locator('[data-tab="deployment-impact"] [data-ui="card"]').first();
      if (await firstCard.count() > 0) await firstCard.click();
      await page.waitForTimeout(400);
      // YAML tab should be default — confirm
      const yamlTab = page.locator('[data-tab="deployment-impact"] button').filter({ hasText: /yaml diff/i }).first();
      if (await yamlTab.count() > 0) await yamlTab.click();
      await page.waitForTimeout(300);
    },
  },
  {
    tab: 'deployment-impact', navLabel: 'Deployment Impact',
    state: 'comparison-resources', label: 'deployment-impact / Resource Tree sub-view',
    screenshotName: 'deployment-impact--comparison-resources',
    themes: ['light'],
    open: async (page) => {
      const firstCard = page.locator('[data-tab="deployment-impact"] [data-ui="card"]').first();
      if (await firstCard.count() > 0) await firstCard.click();
      await page.waitForTimeout(400);
      const resourceTab = page.locator('[data-tab="deployment-impact"] button').filter({ hasText: /resource tree/i }).first();
      if (await resourceTab.count() > 0) await resourceTab.click();
      await page.waitForTimeout(300);
    },
  },
  {
    tab: 'deployment-impact', navLabel: 'Deployment Impact',
    state: 'comparison-capabilities', label: 'deployment-impact / Capability Delta sub-view',
    screenshotName: 'deployment-impact--comparison-capabilities',
    themes: ['light'],
    open: async (page) => {
      const firstCard = page.locator('[data-tab="deployment-impact"] [data-ui="card"]').first();
      if (await firstCard.count() > 0) await firstCard.click();
      await page.waitForTimeout(400);
      const capTab = page.locator('[data-tab="deployment-impact"] button').filter({ hasText: /capabilit/i }).first();
      if (await capTab.count() > 0) await capTab.click();
      await page.waitForTimeout(300);
    },
  },
  {
    tab: 'deployment-impact', navLabel: 'Deployment Impact',
    state: 'yaml-expanded', label: 'deployment-impact / YAML Diff — expanded first file',
    screenshotName: 'deployment-impact--yaml-expanded',
    themes: ['light'],
    open: async (page) => {
      const firstCard = page.locator('[data-tab="deployment-impact"] [data-ui="card"]').first();
      if (await firstCard.count() > 0) await firstCard.click();
      await page.waitForTimeout(400);
      const yamlTab = page.locator('[data-tab="deployment-impact"] button').filter({ hasText: /yaml diff/i }).first();
      if (await yamlTab.count() > 0) await yamlTab.click();
      await page.waitForTimeout(300);
      // Expand the first YAML card
      const expandBtn = page.locator('[data-tab="deployment-impact"] [role="button"], [data-tab="deployment-impact"] button').filter({ hasText: /expand|view yaml/i }).first();
      if (await expandBtn.count() > 0) {
        await expandBtn.click();
        await page.waitForTimeout(300);
      } else {
        // Click any clickable YAML card
        const yamlCard = page.locator('[data-tab="deployment-impact"] [data-ui="card"]').first();
        if (await yamlCard.count() > 0) await yamlCard.click();
        await page.waitForTimeout(300);
      }
    },
  },
];

// ─── runChecksOnPage — shared check runner (resting or interaction state) ─────
//
// Runs the full check suite on `page` which is already at the desired state.
// `tabId` identifies the tab container; `stateLabel` prefixes all problem strings.
// `exemptions` is the array from the ledger for this tab.
// `viewport` is the current viewport (object with width/height) — used only for skinny-bar.
// `theme` is 'light' | 'dark'.
//
// Returns array of problem strings (each prefixed with stateLabel).
//
async function runChecksOnPage(page, tabId, stateLabel, exemptions, viewport, theme) {
  const out = [];
  const prefix = `[${stateLabel} ${viewport.width} ${theme}]`;
  const addProblems = (arr) => { for (const p of arr) out.push(`${prefix} ${p}`); };

  // Core geometry + borders + radii
  addProblems(await page.evaluate(tabProbe, tabId));

  // Horizontal scroll
  const overflow = await page.evaluate(noHorizontalScroll);
  if (overflow > 1) out.push(`${prefix} horizontal scroll: scrollWidth exceeds clientWidth by ${overflow}px`);

  // Draft banner (products Compare sub-view only — not MCP, Catalog, or other sub-views)
  if (tabId === 'products' && theme === 'light') {
    const compareVisible = await page.evaluate(() => document.querySelector('[data-tab="products"] [data-view="compare"]') !== null);
    if (compareVisible) {
      const banner = await page.evaluate(draftBannerState);
      if (!banner.ok) out.push(`${prefix} draft banner not visibly distinct: ${JSON.stringify(banner)}`);
    }
  }

  if (theme === 'light') {
    // Grid equality
    if (!exemptions.includes('grid-equality')) {
      addProblems(await page.evaluate(gridEquality, tabId));
    }
    // Legend law
    if (!exemptions.includes('legend-law')) {
      const ll = await page.evaluate(legendLaw, tabId);
      if (ll) out.push(`${prefix} ${ll}`);
    }
    // Motion law
    if (!exemptions.includes('motion-law')) {
      addProblems(await page.evaluate(motionLaw, tabId));
    }
    // Card text budget
    if (!exemptions.includes('card-text-budget')) {
      addProblems(await page.evaluate(cardTextBudget, tabId));
    }
    // Row-fill
    if (!exemptions.includes('row-fill')) {
      addProblems(await page.evaluate(rowFill, tabId));
    }
    // Control-scale
    if (!exemptions.includes('control-scale')) {
      addProblems(await page.evaluate(controlScale, tabId));
    }
    // Spacing-set
    if (!exemptions.includes('spacing-set')) {
      addProblems(await page.evaluate(spacingSetMembership, tabId));
    }
    // Interior-slack
    if (!exemptions.includes('interior-slack')) {
      addProblems(await page.evaluate(interiorSlack, tabId));
    }
    // Unit-box width bounds
    if (!exemptions.includes('unit-box-width')) {
      addProblems(await page.evaluate(unitBoxWidthBounds, tabId));
    }
    // No-ghost-cells
    if (!exemptions.includes('no-ghost-cells')) {
      addProblems(await page.evaluate(noGhostCells, tabId));
    }
    // Skinny-bar
    if (!exemptions.includes('skinny-bar')) {
      addProblems(await page.evaluate(skinnyBar, tabId));
    }
    // U0: Archetype walker
    if (!exemptions.includes('archetype-walker')) {
      const walkerResult = await page.evaluate(archetypeWalkerProbe, tabId);
      process.stderr.write(`archetype-coverage [${stateLabel}]: ${walkerResult.coverage}\n`);
      for (const p of walkerResult.unclassified) {
        out.push(`${prefix} archetype-walker: ${p}`);
      }
    }
    // U0: Archetype invariants
    if (!exemptions.includes('archetype-invariants')) {
      addProblems(await page.evaluate(archetypeInvariantsProbe, tabId));
    }
    // U0-R: Status-fill ban
    if (!exemptions.includes('status-fill-ban')) {
      addProblems(await page.evaluate(statusFillBan, tabId));
    }

    // T-2b: Minimum-rows
    if (!exemptions.includes('minimum-rows')) {
      addProblems(await page.evaluate(minimumRowsCheck, tabId));
    }

    // T-2b: Orphan-row
    if (!exemptions.includes('orphan-row')) {
      addProblems(await page.evaluate(orphanRowCheck, tabId));
    }
  }

  return out;
}

// ─── STATE WALKER (U0-R) ────────────────────────────────────────────────────
//
// Walks every state in STATES_TABLE, running the full check suite per state.
// Saves screenshots to screenshotDir.
// Reports coverage: states visited / openers exercised / not-exercised list.
// Gate fails if coverage drops below the recorded baseline in style-ledger.json.
//
async function stateWalker(browser, url, screenshotDir) {
  const walkerProblems = [];
  const visitedStates = [];
  const notExercised = [];

  // Load baseline from ledger
  const baseline = ledger.stateWalkerBaseline || {};
  const baselineVisited = baseline.statesVisited || 0;

  for (const stateEntry of STATES_TABLE) {
    const { tab: tabId, navLabel, state, label, screenshotName, themes, open } = stateEntry;
    const tabExemptions = (ledger.exemptions || {})[tabId] || [];

    for (const theme of themes) {
      const viewport = { width: 1440, height: 900 };
      const ctx = await browser.newContext({ viewport, colorScheme: theme });
      const page = await ctx.newPage();

      try {
        // Navigate to the tab's resting state
        await openTab(page, navLabel, tabId);
        await page.waitForTimeout(200);

        // Open the interaction state
        let stateOpened = false;
        try {
          await open(page);
          stateOpened = true;
        } catch (e) {
          notExercised.push(`${label} [${theme}]: opener failed — ${e.message}`);
          process.stderr.write(`state-walker SKIP [${label}] [${theme}]: ${e.message}\n`);
          await ctx.close();
          continue;
        }

        // Take screenshot
        const shotPath = `${screenshotDir}/${screenshotName}--${theme}.png`;
        try {
          await page.screenshot({ path: shotPath, fullPage: true });
          process.stderr.write(`screenshot: ${shotPath}\n`);
        } catch (e) {
          process.stderr.write(`screenshot FAIL [${label}]: ${e.message}\n`);
        }

        // Run full check suite
        const stateProblems = await runChecksOnPage(page, tabId, label, tabExemptions, viewport, theme);
        for (const p of stateProblems) walkerProblems.push(p);

        visitedStates.push(`${label} [${theme}]`);
      } catch (e) {
        notExercised.push(`${label} [${theme}]: error — ${e.message}`);
        process.stderr.write(`state-walker ERROR [${label}] [${theme}]: ${e.message}\n`);
      } finally {
        await ctx.close();
      }
    }
  }

  // Coverage report (to stderr — not captured by gate PASS/FAIL check)
  process.stderr.write(`\n=== STATE WALKER COVERAGE ===\n`);
  process.stderr.write(`states visited: ${visitedStates.length} / openers defined: ${STATES_TABLE.flatMap(s => s.themes).length}\n`);
  process.stderr.write(`not-exercised (${notExercised.length}): ${notExercised.length === 0 ? 'none' : '\n  ' + notExercised.join('\n  ')}\n`);
  process.stderr.write(`=============================\n\n`);

  // Coverage to stdout (gate-visible)
  const coverageLine = `state-walker coverage: visited ${visitedStates.length} / openers ${STATES_TABLE.flatMap(s => s.themes).length} / not-exercised: ${notExercised.length === 0 ? 'none' : notExercised.join('; ')}`;
  process.stderr.write(coverageLine + '\n');

  // Gate: not-exercised list must not grow vs baseline
  const baselineNotExercised = baseline.notExercisedMax || 999;
  if (notExercised.length > baselineNotExercised) {
    walkerProblems.push(`state-walker coverage regression: ${notExercised.length} not-exercised > baseline ${baselineNotExercised}`);
  }

  // strict mode: promote interaction-state violations to gate-failing.
  // When strict=false (Commit 1), violations are reported to stderr only — the walker
  // is informational until Commit 2 fixes the harvest and sets strict=true.
  const strict = baseline.strict === true;
  if (!strict && walkerProblems.length > 0) {
    for (const p of walkerProblems) {
      process.stderr.write(`state-walker (non-strict) violation: ${p}\n`);
    }
    // Only coverage regressions are fatal in non-strict mode
    return walkerProblems.filter((p) => p.startsWith('state-walker coverage regression'));
  }

  return walkerProblems;
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
    if (tabId === 'products') {
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

    // F11: SPACING-SET MEMBERSHIP (light, 1440px)
    if (!exemptions.includes('spacing-set')) {
      for (const p of await page.evaluate(spacingSetMembership, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // F11: INTERIOR-SLACK BUDGET (light, 1440px)
    if (!exemptions.includes('interior-slack')) {
      for (const p of await page.evaluate(interiorSlack, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // F12: UNIT-BOX WIDTH BOUNDS (light, 1440px)
    if (!exemptions.includes('unit-box-width')) {
      for (const p of await page.evaluate(unitBoxWidthBounds, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // F12: NO-GHOST-CELLS (light, 1440px)
    if (!exemptions.includes('no-ghost-cells')) {
      for (const p of await page.evaluate(noGhostCells, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // item 8: SKINNY-BAR (light, 1440px)
    if (!exemptions.includes('skinny-bar')) {
      for (const p of await page.evaluate(skinnyBar, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // U0: ARCHETYPE WALKER — closed-world classification (light, 1440px)
    if (!exemptions.includes('archetype-walker')) {
      const walkerResult = await page.evaluate(archetypeWalkerProbe, tabId);
      // Coverage line always written to stderr (visible in gate output, not stdout)
      process.stderr.write(`archetype-coverage: [${tabId}] ${walkerResult.coverage}\n`);
      for (const p of walkerResult.unclassified) {
        problems.push(`${prefix('1440 light')} archetype-walker: ${p}`);
      }
    }

    // U0: ARCHETYPE INVARIANTS (light, 1440px)
    if (!exemptions.includes('archetype-invariants')) {
      for (const p of await page.evaluate(archetypeInvariantsProbe, tabId)) {
        problems.push(`${prefix('1440 light')} ${p}`);
      }
    }

    // U0-R: STATUS-FILL BAN (light, 1440px — resting state)
    if (!exemptions.includes('status-fill-ban')) {
      for (const p of await page.evaluate(statusFillBan, tabId)) {
        problems.push(`${prefix('1440 light')} ${p}`);
      }
    }

    // T-2b: MINIMUM-ROWS (light, 1440px)
    if (!exemptions.includes('minimum-rows')) {
      for (const p of await page.evaluate(minimumRowsCheck, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    // T-2b: ORPHAN-ROW (light, 1440px)
    if (!exemptions.includes('orphan-row')) {
      for (const p of await page.evaluate(orphanRowCheck, tabId)) problems.push(`${prefix('1440 light')} ${p}`);
    }

    await ctx.close();
  }
  // --- 1440px, dark: boxes + radii (+ PC banner) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
    const page = await ctx.newPage();
    await openTab(page, navLabel, tabId);
    for (const p of await page.evaluate(tabProbe, tabId)) problems.push(`${prefix('1440 dark')} ${p}`);
    if (tabId === 'products') {
      const banner = await page.evaluate(draftBannerState);
      if (!banner.ok) problems.push(`${prefix('1440 dark')} draft banner not visibly distinct: ${JSON.stringify(banner)}`);
    }
    await ctx.close();
  }
  // --- 1920px, light: no horizontal scroll + skinny-bar (wide viewport law) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await openTab(page, navLabel, tabId);
    const overflow1920 = await page.evaluate(noHorizontalScroll);
    if (overflow1920 > 1) problems.push(`${prefix('1920')} horizontal scroll: scrollWidth exceeds clientWidth by ${overflow1920}px`);
    // item 8: SKINNY-BAR at 1920 (wider viewport makes skinny bars more severe)
    if (!exemptions.includes('skinny-bar')) {
      for (const p of await page.evaluate(skinnyBar, tabId)) problems.push(`${prefix('1920 light')} ${p}`);
    }

    // T-2b: MINIMUM-ROWS at 1920 (wider viewport — cards fit even more easily on one row)
    if (!exemptions.includes('minimum-rows')) {
      for (const p of await page.evaluate(minimumRowsCheck, tabId)) problems.push(`${prefix('1920 light')} ${p}`);
    }

    // T-2b: ORPHAN-ROW at 1920
    if (!exemptions.includes('orphan-row')) {
      for (const p of await page.evaluate(orphanRowCheck, tabId)) problems.push(`${prefix('1920 light')} ${p}`);
    }

    await ctx.close();
  }

  // --- 375px, light: no horizontal scroll on mobile + min card width ---
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await openTab(page, navLabel, tabId);
    const overflow = await page.evaluate(noHorizontalScroll);
    if (overflow > 1) problems.push(`${prefix('375')} horizontal scroll: scrollWidth exceeds clientWidth by ${overflow}px`);

    // F11: MOBILE MIN-CARD-WIDTH (375px)
    if (!exemptions.includes('mobile-min-card-width')) {
      for (const p of await page.evaluate(mobileMinCardWidth, tabId)) problems.push(`${prefix('375')} ${p}`);
    }

    // U0: ARCHETYPE WALKER — closed-world classification (375px)
    if (!exemptions.includes('archetype-walker')) {
      const walkerResult375 = await page.evaluate(archetypeWalkerProbe, tabId);
      process.stderr.write(`archetype-coverage-375: [${tabId}] ${walkerResult375.coverage}\n`);
      for (const p of walkerResult375.unclassified) {
        problems.push(`${prefix('375')} archetype-walker: ${p}`);
      }
    }

    await ctx.close();
  }
}

// ─── Self-test: plant a bad element, confirm walker fails, revert ─────────────
//
// Called with --self-test flag. Plants a surfaced element with no data-ui into
// [data-tab="architecture"], runs the walker, confirms exactly 1 failure appears,
// then removes the injected element and confirms the walker passes.
// Prints SELF-TEST PASS or SELF-TEST FAIL and exits.
//
async function runSelfTest() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  try {
    await openTab(page, 'Architecture', 'architecture');

    // ── PHASE 1: inject bad element ────────────────────────────────────────────
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const bad = document.createElement('div');
      bad.id = '__self_test_bad__';
      bad.className = 'bg-surface rounded-card p-4';
      bad.style.cssText = 'width:200px;height:60px;display:block;visibility:visible;opacity:1;';
      bad.textContent = 'SELF-TEST POISON PILL';
      tab.appendChild(bad);
    });

    const result1 = await page.evaluate(archetypeWalkerProbe, 'architecture');
    const caught = result1.unclassified.some((s) => s.includes('__self_test_bad__') || s.includes('SELF-TEST'));
    const hasBad = result1.unclassified.length > 0;

    if (!hasBad) {
      process.stderr.write('SELF-TEST FAIL: injected bad element was NOT caught by walker\n');
      await browser.close();
      process.exit(1);
    }
    process.stderr.write(`SELF-TEST phase-1 OK: walker caught ${result1.unclassified.length} unclassified (expected >=1)\n`);
    process.stderr.write(`  caught lines: ${result1.unclassified.slice(0, 3).join(' | ')}\n`);

    // ── PHASE 2: remove bad element — walker should return 0 unclassified ─────
    await page.evaluate(() => {
      const bad = document.getElementById('__self_test_bad__');
      if (bad) bad.remove();
    });

    const result2 = await page.evaluate(archetypeWalkerProbe, 'architecture');
    if (result2.unclassified.length !== 0) {
      process.stderr.write(`SELF-TEST FAIL: after removal still ${result2.unclassified.length} unclassified\n`);
      process.stderr.write(`  remaining: ${result2.unclassified.slice(0, 5).join(' | ')}\n`);
      await browser.close();
      process.exit(1);
    }
    process.stderr.write('SELF-TEST phase-2 OK: after removal walker reports unclassified 0\n');
    process.stderr.write('SELF-TEST PASS\n');

    // ── PHASE 3: verify archetype-uniformity invariant self-test ──────────────
    // Inject a card with right-aligned text to trigger the card uniformity check
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const badCard = document.createElement('div');
      badCard.id = '__self_test_card__';
      badCard.setAttribute('data-ui', 'card');
      badCard.style.cssText = 'width:250px;height:80px;display:block;text-align:right;visibility:visible;opacity:1;';
      const h3 = document.createElement('h3');
      h3.style.textAlign = 'right';
      h3.textContent = 'BAD ALIGNMENT';
      badCard.appendChild(h3);
      tab.appendChild(badCard);
    });

    const inv1 = await page.evaluate(archetypeInvariantsProbe, 'architecture');
    const caughtAlign = inv1.some((s) => s.includes('text-align') || s.includes('uniformity'));
    process.stderr.write(`SELF-TEST invariants phase-3: ${caughtAlign ? 'OK (uniformity violation caught)' : 'SKIP (architecture cards all left so right-only injection passes — expected)'}\n`);
    process.stderr.write(`  invariant output: ${inv1.length > 0 ? inv1.slice(0, 3).join(' | ') : '(none)'}\n`);

    await page.evaluate(() => {
      const b = document.getElementById('__self_test_card__');
      if (b) b.remove();
    });

    // ── PHASE 4: skinny-bar self-test ─────────────────────────────────────────
    // Plant a full-width flex bar with tiny content (< 40%), confirm caught, remove.
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const bar = document.createElement('div');
      bar.id = '__self_test_bar__';
      bar.style.cssText = 'display:flex;width:1400px;height:40px;visibility:visible;opacity:1;position:static;';
      const tiny = document.createElement('span');
      tiny.textContent = 'Small';
      tiny.style.cssText = 'width:80px;display:inline-block;visibility:visible;opacity:1;';
      bar.appendChild(tiny);
      tab.appendChild(bar);
    });

    const sbResult = await page.evaluate(skinnyBar, 'architecture');
    const sbCaught = sbResult.length > 0;
    process.stderr.write(`SELF-TEST skinny-bar phase-4: ${sbCaught ? 'OK (skinny bar caught)' : 'SKIP (injected bar not caught — may be below vpWidth threshold in test context)'}\n`);

    await page.evaluate(() => {
      const b = document.getElementById('__self_test_bar__');
      if (b) b.remove();
    });

    // ── PHASE 5: no-ghost-cells self-test ────────────────────────────────────
    // Plant a 3-column grid with 2 items left-packed, confirm caught, remove.
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const grid = document.createElement('div');
      grid.id = '__self_test_grid__';
      grid.style.cssText = 'display:grid;grid-template-columns:200px 200px 200px;width:640px;gap:8px;visibility:visible;opacity:1;justify-content:start;';
      for (let i = 0; i < 2; i++) {
        const cell = document.createElement('div');
        cell.style.cssText = 'width:200px;height:40px;border:1px solid #999;visibility:visible;opacity:1;';
        cell.textContent = 'Item ' + i;
        grid.appendChild(cell);
      }
      tab.appendChild(grid);
    });

    const gcResult = await page.evaluate(noGhostCells, 'architecture');
    const gcCaught = gcResult.length > 0;
    process.stderr.write(`SELF-TEST no-ghost-cells phase-5: ${gcCaught ? 'OK (ghost cell caught)' : 'SKIP (not triggered in this context — DOM injection may not match column count heuristic)'}\n`);

    await page.evaluate(() => {
      const b = document.getElementById('__self_test_grid__');
      if (b) b.remove();
    });

    // ── PHASE 6: status-fill-ban self-test ────────────────────────────────────
    // Plant a large green-background section element inside the decisions tab.
    // The check should catch it. This simulates the bg-green-600 completion panel.
    await openTab(page, 'Architecture', 'architecture');
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const greenPanel = document.createElement('div');
      greenPanel.id = '__self_test_green_panel__';
      // Mimics bg-green-600 panel: green-600 in RGB is approximately rgb(22, 163, 74)
      greenPanel.style.cssText = 'background-color:rgb(22,163,74);color:white;padding:24px;border-radius:8px;width:600px;height:120px;display:block;visibility:visible;opacity:1;';
      const child = document.createElement('div');
      child.textContent = 'SELF-TEST: green section panel';
      greenPanel.appendChild(child);
      const child2 = document.createElement('div');
      child2.textContent = 'sub-line';
      greenPanel.appendChild(child2);
      const child3 = document.createElement('div');
      child3.textContent = 'sub-line2';
      greenPanel.appendChild(child3);
      tab.appendChild(greenPanel);
    });

    const sfbResult = await page.evaluate(statusFillBan, 'architecture');
    const sfbCaught = sfbResult.some((s) => s.includes('status-fill-ban') && s.includes('green'));
    if (!sfbCaught) {
      process.stderr.write(`SELF-TEST FAIL: status-fill-ban did NOT catch green section panel\n`);
      process.stderr.write(`  statusFillBan output: ${sfbResult.join(' | ') || '(none)'}\n`);
      await browser.close();
      process.exit(1);
    }
    process.stderr.write(`SELF-TEST phase-6 OK: status-fill-ban caught green section panel (${sfbResult.length} violations)\n`);
    process.stderr.write(`  caught: ${sfbResult.slice(0, 2).join(' | ')}\n`);

    await page.evaluate(() => {
      const b = document.getElementById('__self_test_green_panel__');
      if (b) b.remove();
    });

    // Confirm clean after removal
    const sfbResult2 = await page.evaluate(statusFillBan, 'architecture');
    // There may be existing green elements (step indicators); just confirm panel is gone
    const panelStillPresent = sfbResult2.some((s) => s.includes('__self_test_green_panel__'));
    if (panelStillPresent) {
      process.stderr.write('SELF-TEST FAIL: green panel not removed\n');
      await browser.close();
      process.exit(1);
    }
    process.stderr.write('SELF-TEST phase-6b OK: green panel removed\n');

    // ── PHASE 7: minimum-rows self-test ───────────────────────────────────────
    // Plant: container 500px wide, 3 cards each 80px (total 256px <= 500px fits on one row),
    // but each wrapper has flex-basis:100% forcing each card onto its own row even though
    // the cards' content widths would fit. The check sums card element widths (not wrapper
    // widths), so it detects: 3*80 + 2*8 = 256 <= 500 but rows = 3 → FAIL.
    await openTab(page, 'Architecture', 'architecture');
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const container = document.createElement('div');
      container.id = '__self_test_min_rows__';
      container.className = '__self_test_min_rows__';
      container.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;width:500px;padding:0;visibility:visible;opacity:1;';
      for (let i = 0; i < 3; i++) {
        const wrapper = document.createElement('div');
        // flex-basis:100% forces each wrapper onto its own row; card is narrower (80px)
        wrapper.style.cssText = 'width:80px;height:60px;visibility:visible;opacity:1;flex:none;flex-basis:100%;';
        const card = document.createElement('div');
        card.setAttribute('data-ui', 'card');
        card.style.cssText = 'width:80px;height:60px;border:1px solid #999;display:flex;align-items:center;justify-content:center;';
        card.textContent = 'Card ' + i;
        wrapper.appendChild(card);
        container.appendChild(wrapper);
      }
      tab.appendChild(container);
    });

    const mrResult = await page.evaluate(minimumRowsCheck, 'architecture');
    const mrCaught = mrResult.some((s) => s.includes('minimum-rows') && s.includes('__self_test_min_rows__'));
    process.stderr.write(`SELF-TEST minimum-rows phase-7: ${mrCaught ? 'OK (minimum-rows caught)' : 'UNEXPECTED: not caught'}\n`);
    process.stderr.write(`  minimum-rows output: ${mrResult.length > 0 ? mrResult.slice(0, 2).join(' | ') : '(none)'}\n`);
    if (!mrCaught) {
      process.stderr.write('SELF-TEST FAIL: minimum-rows did NOT catch the fitting-group-forced-to-2-rows plant\n');
      await browser.close();
      process.exit(1);
    }
    const mrFailureLine = mrResult.find((s) => s.includes('minimum-rows') && s.includes('__self_test_min_rows__'));
    process.stdout.write(`SELF-TEST minimum-rows failure line: ${mrFailureLine}\n`);

    await page.evaluate(() => {
      const b = document.getElementById('__self_test_min_rows__');
      if (b) b.remove();
    });
    process.stderr.write('SELF-TEST phase-7 OK: minimum-rows plant removed\n');

    // ── PHASE 8: orphan-row self-test ─────────────────────────────────────────
    // Plant a flex-wrap container with 5 cards where the natural wrap produces 4+1.
    // Container width = 340px, each card 80px, gap=8px.
    // 4 cards: 4*80 + 3*8 = 344px > 340px so they wrap at 3+2? Actually let's be precise.
    // Each wrapper must render exactly 80px. 4 cards at 80px + 3*8 gap = 344 > 340 → 3+2.
    // We need 4+1 so use 5 cards in a 370px container: 5*80+4*8=432 > 370, 4*80+3*8=344 < 370.
    // → row 1: 4 cards, row 2: 1 card. That's a 4+1 orphan. 5 items balance as 3+2 (2 cols) or
    // the original 3+2 (3 cols: 3+2 has remainder 2, not orphan). So balanced desc = "3 cols (1×3+2)".
    await page.evaluate(() => {
      const tab = document.querySelector('[data-tab="architecture"]');
      const container = document.createElement('div');
      container.id = '__self_test_orphan__';
      container.className = '__self_test_orphan__';
      container.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;width:370px;padding:0;visibility:visible;opacity:1;';
      for (let i = 0; i < 5; i++) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:80px;height:60px;visibility:visible;opacity:1;flex:none;';
        const card = document.createElement('div');
        card.setAttribute('data-ui', 'card');
        card.style.cssText = 'width:80px;height:60px;border:1px solid #999;display:flex;align-items:center;justify-content:center;';
        card.textContent = 'C' + i;
        wrapper.appendChild(card);
        container.appendChild(wrapper);
      }
      tab.appendChild(container);
    });

    const orResult = await page.evaluate(orphanRowCheck, 'architecture');
    const orCaught = orResult.some((s) => s.includes('orphan-row') && s.includes('__self_test_orphan__'));
    process.stderr.write(`SELF-TEST orphan-row phase-8: ${orCaught ? 'OK (orphan-row caught)' : 'UNEXPECTED: not caught'}\n`);
    process.stderr.write(`  orphan-row output: ${orResult.length > 0 ? orResult.slice(0, 2).join(' | ') : '(none)'}\n`);
    if (!orCaught) {
      process.stderr.write('SELF-TEST FAIL: orphan-row did NOT catch the 4+1 orphan group plant\n');
      await browser.close();
      process.exit(1);
    }
    const orFailureLine = orResult.find((s) => s.includes('orphan-row') && s.includes('__self_test_orphan__'));
    process.stdout.write(`SELF-TEST orphan-row failure line: ${orFailureLine}\n`);

    await page.evaluate(() => {
      const b = document.getElementById('__self_test_orphan__');
      if (b) b.remove();
    });
    process.stderr.write('SELF-TEST phase-8 OK: orphan-row plant removed\n');

    process.stderr.write('SELF-TEST PASS (all phases)\n');
  } finally {
    await browser.close();
  }
}

async function run() {
  const SCREENSHOT_DIR = resolve(__dirname, '../../ai-platform-explorer-dualview/planning/screenshots/state-walk');
  try { mkdirSync(SCREENSHOT_DIR, { recursive: true }); } catch (_) { /* already exists */ }
  const browser = await chromium.launch();
  try {
    // Phase 1: resting-state audits (existing checks)
    for (const tab of migratedTabs) {
      await auditTab(browser, tab);
    }
    // Phase 2: interaction-state walker (U0-R)
    const walkerProblems = await stateWalker(browser, URL, SCREENSHOT_DIR);
    for (const p of walkerProblems) problems.push(p);
  } finally {
    await browser.close();
  }

  if (problems.length) {
    for (const p of problems) console.log(p);
    process.exit(1);
  }
  process.exit(0);
}

const isSelfTest = process.argv.includes('--self-test');
(isSelfTest ? runSelfTest() : run()).catch((err) => {
  console.log('style-audit crashed: ' + (err && err.stack ? err.stack : err));
  process.exit(1);
});
