import { Check, ExternalLink } from 'lucide-react';
import { buildLedgerModel, LEDGER_PRODUCTS, sideTitle } from '../lib/ledgerModel';

/**
 * SharedSpineLedger — BEAT 3 ("PROVE") of the Product Comparison tab.
 *
 * The side-by-side bill of materials as a SHARED SPINE: the component name runs down the CENTER,
 * flanked by each product's presence. Left column = Red Hat AI Inference Server, right column =
 * Red Hat OpenShift AI. One filled mark = present; a faint dash = absent. There are NO status words
 * repeated per row — the mark is the whole statement.
 *
 * CONTAINMENT AS SHAPE: a row present in BOTH products gets a subtle background band spanning the
 * whole row. The "Serve models" group is where both products overlap, so those bands stack into one
 * continuous block at the top — the shared core. Below it only the right column (the platform) keeps
 * marking present, so the left column's short run reads as *contained inside* the right column's long
 * one. The shape is the argument; we never label a row "shared".
 *
 * CONFIDENCE MADE VISUAL (same rule as resolveHeroCell): a present mark is SOLID when the underlying
 * row-side is clear-tier, and a DASHED-OUTLINE "pending" mark when it is inferred/unresolved-tier.
 *
 * All derivation (grouping, short names, presence, confidence, which source a name links to) is pure
 * and lives in ../lib/ledgerModel — this file only renders. Every component NAME is the hyperlink to
 * that row-side's validated public source (rel="noopener"); the external-link icon shows on hover only.
 */

// Full literal Tailwind classes per product + confidence (no runtime-built class fragments, so the
// JIT compiler keeps them). Solid = present & clear-tier; pending = present & inferred/unresolved.
const MARK = {
  a: {
    solid: 'bg-blue-600 text-white dark:bg-blue-500',
    pending: 'border-2 border-dashed border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-300'
  },
  b: {
    solid: 'bg-purple-600 text-white dark:bg-purple-500',
    pending: 'border-2 border-dashed border-purple-400 text-purple-600 dark:border-purple-500 dark:text-purple-300'
  }
};

// Identical column geometry for the sticky header AND every row, so marks align in strict columns.
const COLS =
  'grid grid-cols-[64px_minmax(0,1fr)_64px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)]';

const MARK_BASE = 'inline-flex items-center justify-center h-6 w-6 rounded-full';
const LEGEND_SAMPLE = 'inline-flex items-center justify-center h-4 w-4 rounded-full';

function PresenceMark({ side, product }) {
  if (!side.present) {
    return (
      <>
        <span aria-hidden="true" className="text-xl leading-none text-gray-300 dark:text-gray-600 select-none">
          –
        </span>
        <span className="sr-only">not included</span>
      </>
    );
  }
  const cls = side.verified ? MARK[product].solid : MARK[product].pending;
  return (
    <>
      <span aria-hidden="true" className={`${MARK_BASE} ${cls}`}>
        <Check size={14} strokeWidth={3} />
      </span>
      <span className="sr-only">{side.verified ? 'included' : 'included, pending verification'}</span>
    </>
  );
}

function NameLink({ row }) {
  if (!row.link) {
    return (
      <span className="text-sm font-medium leading-tight text-gray-900 dark:text-white line-clamp-2">
        {row.name}
      </span>
    );
  }
  return (
    <a
      href={row.link.url}
      target="_blank"
      rel="noopener"
      title={row.link.label || 'Open source'}
      aria-label={row.link.label ? `${row.name} — source: ${row.link.label}` : `${row.name} — open source`}
      className="group inline-flex items-center justify-center gap-1 text-sm font-medium leading-tight text-gray-900 dark:text-white hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors"
    >
      <span className="line-clamp-2">{row.name}</span>
      <ExternalLink
        size={12}
        aria-hidden="true"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}

function LedgerRow({ row, last }) {
  // Both-present rows carry the subtle containment band; contiguous bands merge into one block.
  const band = row.shared ? 'bg-indigo-50/70 dark:bg-indigo-950/30' : 'bg-white dark:bg-gray-800';
  const rounded = last ? 'rounded-b-lg' : '';
  return (
    <div className={`${COLS} ${band} ${rounded}`}>
      <div
        className="flex h-12 items-center justify-center border-b border-r border-gray-100 dark:border-gray-800"
        title={sideTitle(LEDGER_PRODUCTS.a.label, row.a)}
      >
        <PresenceMark side={row.a} product="a" />
      </div>
      <div className="flex h-12 items-center justify-center border-b border-gray-100 px-2 text-center dark:border-gray-800">
        <NameLink row={row} />
      </div>
      <div
        className="flex h-12 items-center justify-center border-b border-l border-gray-100 dark:border-gray-800"
        title={sideTitle(LEDGER_PRODUCTS.b.label, row.b)}
      >
        <PresenceMark side={row.b} product="b" />
      </div>
    </div>
  );
}

function GroupHeader({ title }) {
  return (
    <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/60 sm:px-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {title}
      </span>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className={`${LEGEND_SAMPLE} bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900`}>
          <Check size={11} strokeWidth={3} />
        </span>
        Verified
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className={`${LEGEND_SAMPLE} border-2 border-dashed border-gray-400 text-gray-500 dark:border-gray-500 dark:text-gray-300`}
        >
          <Check size={11} strokeWidth={3} />
        </span>
        Pending verification
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ExternalLink size={12} aria-hidden="true" />
        Every name links to its source
      </span>
    </div>
  );
}

function StickyHeader() {
  return (
    <div
      className={`${COLS} sticky top-0 z-10 border-b-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
    >
      <div className="flex flex-col items-center justify-center border-r border-gray-100 px-2 py-3 text-center dark:border-gray-800">
        <span className="text-xs font-bold leading-tight text-blue-800 dark:text-blue-200 sm:text-sm">
          {LEDGER_PRODUCTS.a.label}
        </span>
        <span className="mt-0.5 text-[10px] text-blue-600/80 dark:text-blue-300/70 sm:text-xs">
          {LEDGER_PRODUCTS.a.descriptor}
        </span>
      </div>
      <div className="flex items-center justify-center px-2 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:text-xs">
          Component
        </span>
      </div>
      <div className="flex flex-col items-center justify-center border-l border-gray-100 px-2 py-3 text-center dark:border-gray-800">
        <span className="text-xs font-bold leading-tight text-purple-800 dark:text-purple-200 sm:text-sm">
          {LEDGER_PRODUCTS.b.label}
        </span>
        <span className="mt-0.5 text-[10px] text-purple-600/80 dark:text-purple-300/70 sm:text-xs">
          {LEDGER_PRODUCTS.b.descriptor}
        </span>
      </div>
    </div>
  );
}

export default function SharedSpineLedger({ comparison }) {
  const groups = buildLedgerModel(comparison);
  if (groups.length === 0) return null;

  // Id of the final row so it can round the ledger's bottom corners (no overflow-hidden wrapper is
  // used — that would break the viewport-sticky header).
  const lastGroup = groups[groups.length - 1];
  const lastRowId = lastGroup.rows[lastGroup.rows.length - 1]?.id;

  return (
    <section
      aria-label="What ships in each product — side-by-side bill of materials"
      className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="border-b border-gray-200 p-4 dark:border-gray-700 sm:p-5">
        <h3 className="mb-1 text-base font-bold text-gray-900 dark:text-white">What ships in each product</h3>
        <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          One component per row, both products side by side. The shaded band is the core they share;
          below it, only the platform keeps going.
        </p>
        <Legend />
      </div>

      <StickyHeader />

      <div>
        {groups.map((group) => (
          <div key={group.id}>
            <GroupHeader title={group.title} />
            {group.rows.map((row) => (
              <LedgerRow key={row.id} row={row} last={row.id === lastRowId} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
