/**
 * ledgerModel — pure derivation for the shared-spine bill-of-materials ledger (BEAT 3 of the Product
 * Comparison tab). Kept out of the component file so both SharedSpineLedger.jsx and the copy-summary
 * builder share ONE source of truth, and so the component file only exports a component (react-refresh).
 *
 * READ-ONLY over src/data/productComparisons: every value here is derived from the existing
 * bomRows/capabilityRows. Nothing mutates the data and no illustrative/draft flag is touched.
 */

// Display identity for the two products (matches BEAT 2's decision cards). This ledger is specifically
// this one pair, so the labels + 3-word descriptors are stable constants.
export const LEDGER_PRODUCTS = {
  a: { label: 'Red Hat AI Inference Server', descriptor: 'Engine · Kubernetes or RHEL' },
  b: { label: 'Red Hat OpenShift AI', descriptor: 'Platform · needs OpenShift' }
};

// The three task groups, top to bottom.
export const LEDGER_GROUPS = [
  { id: 'serve', title: 'Serve models' },
  { id: 'build', title: 'Build & train' },
  { id: 'operate', title: 'Operate & govern' }
];

// Map existing data rows -> ledger spine. `view` picks the source array (bomRows | capabilityRows),
// `key` matches a row's `area`/`capability`, `name` is the <=3-word center label, `group` is the task
// header. Order within a group is render order; both-present rows come first so the shared band reads
// as one block. Two delivery/packaging meta-rows ("Container platform requirement", "Operators,
// container images, and versions per release") and the both-unconfirmed "Gateway / model-as-a-service
// access layer" row are intentionally NOT on the spine — no differentiating presence signal — but stay
// fully visible in the Detailed provenance tables below.
const SPINE = [
  // Serve models — the shared core (the Inference Server lives entirely here).
  { view: 'bom', key: 'Inference engine', group: 'serve', name: 'Inference engine' },
  { view: 'bom', key: 'OpenAI-compatible API endpoint', group: 'serve', name: 'OpenAI-compatible API' },
  { view: 'capability', key: 'Model serving (large language model inference)', group: 'serve', name: 'Model serving' },
  { view: 'bom', key: 'Distributed inference (llm-d)', group: 'serve', name: 'Distributed inference' },
  { view: 'bom', key: 'Model loading and caching', group: 'serve', name: 'Model loading' },
  // Build & train — the platform adds the model-building lifecycle.
  { view: 'bom', key: 'Notebooks / workbenches', group: 'build', name: 'Notebooks' },
  { view: 'bom', key: 'Machine-learning pipelines', group: 'build', name: 'Machine-learning pipelines' },
  { view: 'bom', key: 'Distributed training', group: 'build', name: 'Distributed training' },
  { view: 'capability', key: 'Model fine-tuning and alignment', group: 'build', name: 'Fine-tuning' },
  { view: 'bom', key: 'Feature store (Feast)', group: 'build', name: 'Feature store' },
  { view: 'bom', key: 'Experiment tracking (MLflow)', group: 'build', name: 'Experiment tracking' },
  // Operate & govern — day-2 platform capabilities.
  { view: 'capability', key: 'Model registry integration', group: 'operate', name: 'Model registry' },
  { view: 'capability', key: 'Autoscaling of model servers', group: 'operate', name: 'Autoscaling' },
  { view: 'capability', key: 'Observability and responsible-AI monitoring', group: 'operate', name: 'Responsible-AI monitoring' }
];

// Human word for a row-side value — used ONLY in tooltips / screen-reader text / the copy summary,
// never rendered as visible row text (the mark is the visible statement).
const RAW_WORD = {
  included: 'included',
  'add-on': 'included (add-on)',
  'not-included': 'not included',
  confirm: 'confirm with Red Hat',
  yes: 'supported',
  partial: 'partial',
  no: 'not supported'
};

/**
 * Read presence + confidence off one row-side (read-only).
 *  - present: the product actually ships/supports it — BOM included|add-on, capability yes|partial.
 *    Everything else (not-included, no, confirm) is absent: "confirm" means inclusion is not
 *    established, so it is honestly shown as not-present pending curation.
 *  - verified: present AND clear-tier -> solid mark; otherwise a dashed-outline "pending" mark.
 */
export function readSide(side, view) {
  if (!side) {
    return { present: false, verified: false, raw: null, sourceUrl: null, sourceLabel: null };
  }
  const present =
    view === 'capability'
      ? side.support === 'yes' || side.support === 'partial'
      : side.included === 'included' || side.included === 'add-on';
  return {
    present,
    verified: present && side.tier === 'clear',
    raw: side.included ?? side.support ?? null,
    sourceUrl: typeof side.sourceUrl === 'string' && side.sourceUrl ? side.sourceUrl : null,
    sourceLabel: side.sourceLabel ?? null
  };
}

/** Which single source the center NAME links to: prefer a present, verified side (a before b), then
 *  any present side, then any side with a link. */
function pickSource(a, b) {
  const present = [a, b].filter((s) => s.present && s.sourceUrl);
  const chosen =
    present.find((s) => s.verified) || present[0] || [a, b].find((s) => s.sourceUrl) || null;
  return chosen ? { url: chosen.sourceUrl, label: chosen.sourceLabel } : null;
}

/**
 * Build the grouped ledger model. Returns only groups that have >=1 row, and only rows where at least
 * one product is present (so there are never empty double-dash rows).
 */
export function buildLedgerModel(comparison) {
  if (!comparison) return [];
  const groups = LEDGER_GROUPS.map((g) => ({ ...g, rows: [] }));
  const byId = Object.fromEntries(groups.map((g) => [g.id, g]));

  for (const item of SPINE) {
    const rows = item.view === 'capability' ? comparison.capabilityRows : comparison.bomRows;
    const row = (rows ?? []).find((r) => (r.area ?? r.capability) === item.key);
    if (!row) continue; // resilient to upstream data renames — just omit the row
    const a = readSide(row.a, item.view);
    const b = readSide(row.b, item.view);
    if (!a.present && !b.present) continue; // no presence signal on the spine
    byId[item.group].rows.push({
      id: item.key,
      name: item.name,
      a,
      b,
      shared: a.present && b.present,
      link: pickSource(a, b)
    });
  }
  return groups.filter((g) => g.rows.length > 0);
}

/** Tooltip / screen-reader text for one product's presence on a row. */
export function sideTitle(productLabel, side) {
  const word = RAW_WORD[side.raw] || (side.present ? 'included' : 'not included');
  const pending = side.present && !side.verified ? ' — pending verification' : '';
  return `${productLabel}: ${word}${pending}`;
}
