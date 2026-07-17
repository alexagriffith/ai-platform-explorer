import { Check, ExternalLink } from 'lucide-react';
import { buildLedgerModel, LEDGER_PRODUCTS, sideTitle } from '../lib/ledgerModel';
import { interactive } from '../lib/styleTokens';

/**
 * SharedSpineLedger — BEAT 3 ("PROVE") of the Product Comparison tab.
 *
 * The side-by-side bill of materials as a SHARED SPINE: the component name runs down the CENTER,
 * flanked by each product's presence. Left column = Red Hat AI Inference Server, right column =
 * Red Hat OpenShift AI. One filled mark = present; a faint dash = absent. There are NO status words
 * repeated per row — the mark is the whole statement.
 *
 * SINGLE ACCENT (2026-07-16 restyle): both products use the SAME Red Hat red mark. The product is
 * told by column POSITION (left vs right), not by hue — so the "shared core / platform keeps going"
 * shape still reads with colour removed (a design goal: the layout must read in grayscale). Neutral
 * surfaces, one thin border, hairline row dividers, and a subtle neutral band for the shared core —
 * no vertical cell borders, no shadow stack (see planning/DESIGN-NOTES.md).
 *
 * CONTAINMENT AS SHAPE: a row present in BOTH products gets a subtle neutral background band. The
 * "Serve models" group is where both overlap, so those bands stack into one continuous block at the
 * top — the shared core. Below it only the right column keeps marking present, so the left column's
 * short run reads as *contained inside* the right column's long one. The shape is the argument.
 *
 * CONFIDENCE MADE VISUAL: a present mark is SOLID when the row-side is clear-tier, and a
 * DASHED-OUTLINE "pending" mark when it is inferred/unresolved-tier.
 *
 * All derivation (grouping, short names, presence, confidence, which source a name links to) is pure
 * and lives in ../lib/ledgerModel — this file only renders. Every component NAME is the hyperlink to
 * that row-side's validated public source (rel="noopener"); the external-link icon shows on hover only.
 */

// Present marks share ONE accent (single-accent law); confidence changes the treatment only.
const MARK_SOLID = 'bg-accent text-on-accent';
const MARK_PENDING = 'border-2 border-dashed border-accent text-accent';

// Identical column geometry for the header AND every row. The two PRODUCT columns are exactly equal
// width (equal peers); the center name column is wider. Enforced by scripts/gate.py.
const COLS =
  'grid grid-cols-[56px_minmax(0,1fr)_56px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)]';

const MARK_BASE = 'inline-flex items-center justify-center h-6 w-6 rounded-full';
const LEGEND_SAMPLE = 'inline-flex items-center justify-center h-4 w-4 rounded-full';

function PresenceMark({ side }) {
  if (!side.present) {
    return (
      <>
        <span aria-hidden="true" className="text-xl leading-none text-faint select-none">
          –
        </span>
        <span className="sr-only">not included</span>
      </>
    );
  }
  const cls = side.verified ? MARK_SOLID : MARK_PENDING;
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
      <span className="text-sm font-medium leading-tight text-ink">{row.name}</span>
    );
  }
  return (
    <a
      href={row.link.url}
      target="_blank"
      rel="noopener"
      title={row.link.label || 'Open source'}
      aria-label={row.link.label ? `${row.name} — source: ${row.link.label}` : `${row.name} — open source`}
      className={`group inline-flex items-center justify-center gap-1 text-sm font-medium leading-tight text-ink hover:text-link hover:underline ${interactive.transition} ${interactive.focusRing}`}
    >
      <span>{row.name}</span>
      <ExternalLink
        size={12}
        aria-hidden="true"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}

function LedgerRow({ row, last }) {
  // Both-present rows carry the subtle neutral band; contiguous bands merge into one block.
  const band = row.shared ? 'bg-tint' : 'bg-surface';
  const rounded = last ? 'rounded-b-card' : '';
  return (
    <div className={`${COLS} ${band} ${rounded}`} data-ledger-row>
      <div
        className="flex h-10 items-center justify-center border-b border-hair"
        data-ledger-cell="a"
        title={sideTitle(LEDGER_PRODUCTS.a.label, row.a)}
      >
        <PresenceMark side={row.a} />
      </div>
      <div
        className="flex h-10 items-center justify-center border-b border-hair px-2 text-center"
        data-ledger-cell="name"
      >
        <NameLink row={row} />
      </div>
      <div
        className="flex h-10 items-center justify-center border-b border-hair"
        data-ledger-cell="b"
        title={sideTitle(LEDGER_PRODUCTS.b.label, row.b)}
      >
        <PresenceMark side={row.b} />
      </div>
    </div>
  );
}

function GroupHeader({ title }) {
  return (
    <div className="border-b border-hair bg-tint px-3 py-2 sm:px-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-faint">{title}</span>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-faint">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className={`${LEGEND_SAMPLE} bg-accent text-on-accent`}>
          <Check size={11} strokeWidth={3} />
        </span>
        Verified
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className={`${LEGEND_SAMPLE} border-2 border-dashed border-accent text-accent`}>
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
    <div className={`${COLS} sticky top-0 z-10 border-b border-edge bg-surface`}>
      <div className="flex flex-col items-center justify-center px-2 py-2 text-center">
        <span className="text-xs font-bold leading-tight text-ink sm:text-sm">{LEDGER_PRODUCTS.a.label}</span>
        <span className="mt-0.5 text-[10px] text-faint sm:text-xs">{LEDGER_PRODUCTS.a.descriptor}</span>
      </div>
      <div className="flex items-center justify-center px-2 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-faint sm:text-xs">Component</span>
      </div>
      <div className="flex flex-col items-center justify-center px-2 py-2 text-center">
        <span className="text-xs font-bold leading-tight text-ink sm:text-sm">{LEDGER_PRODUCTS.b.label}</span>
        <span className="mt-0.5 text-[10px] text-faint sm:text-xs">{LEDGER_PRODUCTS.b.descriptor}</span>
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
      data-ledger
      className="rounded-card border border-edge bg-surface"
    >
      <div className="border-b border-hair p-3 sm:p-4">
        <h3 className="mb-1 font-display text-base font-bold text-ink">What ships in each product</h3>
        <p className="mb-2 text-xs leading-relaxed text-muted">
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
