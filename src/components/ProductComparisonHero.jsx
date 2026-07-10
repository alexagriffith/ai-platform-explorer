import { AlertCircle, ExternalLink } from 'lucide-react';
import { resolveHeroCell } from '../data/productComparisons';

/**
 * ProductComparisonHero — the primary view of the Product Comparison tab.
 *
 * Nested containment: the Red Hat AI Inference Server core is drawn INSIDE the Red Hat OpenShift AI
 * platform, so "the Inference Server is the core, OpenShift AI is the platform that wraps it" reads at
 * a glance. Components render inside their product's zone.
 *
 * STRICT alignment (fixes the ragged-chip mockup): every component is a cell in one uniform CSS grid —
 * fixed 4 equal columns, IDENTICAL width/height/border-radius/border-width/type size per cell (<=2
 * words of text), one coherent style per zone. The ONLY sanctioned per-cell variation is confidence:
 * clear-tier cells are solid, inferred/unresolved-tier cells are dashed "pending verification". Both
 * use the same 2px border so geometry never shifts.
 *
 * EVERY FACT HYPERLINKED: each cell is an anchor to that fact's validated public source (GitHub blob
 * at the pinned opendatahub-operator commit, upstream READMEs, access.redhat.com, catalog.redhat.com,
 * or docs.redhat.com), surfaced as a small external-link icon inside the cell — never a raw URL on the
 * page. Provenance and tier come from the referenced bomRows/capabilityRows side via resolveHeroCell.
 *
 * The hero is illustrative:true and rides the same amber draft banner as every row; it flips no flag.
 */

// One uniform cell geometry for every zone. border-2 on ALL cells (solid or dashed) so the box never
// changes size between tiers. Complete Tailwind literals (no template-built class fragments).
const CELL_BASE =
  'group relative flex items-center justify-center text-center h-16 px-3 rounded-lg border-2 ' +
  'text-sm font-medium leading-tight transition-colors focus:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

const ZONE = {
  inner: {
    solid:
      'border-solid border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 ' +
      'text-blue-900 dark:text-blue-100 hover:border-blue-400 dark:hover:border-blue-500 focus-visible:ring-blue-500',
    dashed:
      'border-dashed border-blue-300/70 dark:border-blue-700/70 bg-transparent ' +
      'text-blue-800/70 dark:text-blue-200/60 hover:border-blue-400 dark:hover:border-blue-500 focus-visible:ring-blue-500'
  },
  outer: {
    solid:
      'border-solid border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/40 ' +
      'text-purple-900 dark:text-purple-100 hover:border-purple-400 dark:hover:border-purple-500 focus-visible:ring-purple-500',
    dashed:
      'border-dashed border-purple-300/70 dark:border-purple-700/70 bg-transparent ' +
      'text-purple-800/70 dark:text-purple-200/60 hover:border-purple-400 dark:hover:border-purple-500 focus-visible:ring-purple-500'
  }
};

const UNIFORM_GRID = 'grid grid-cols-2 sm:grid-cols-4 gap-3';

const TAGLINE_PILL =
  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap';
const PILL_INNER = TAGLINE_PILL + ' bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
const PILL_OUTER = TAGLINE_PILL + ' bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200';

/** One source-linked cell. The whole cell is the hyperlink; the label is centered and an external-link
 *  icon sits in the corner (decorative — the link's accessible name is the source label). Falls back to
 *  a non-interactive dashed cell if a fact somehow has no working link (keeps it in the pending tier). */
function HeroCell({ resolved, zone }) {
  const style = resolved.solid ? ZONE[zone].solid : ZONE[zone].dashed;
  const className = `${CELL_BASE} ${style}`;
  const label = <span className="line-clamp-2">{resolved.label}</span>;

  if (!resolved.sourceUrl) {
    return (
      <div className={className} title={resolved.detail || resolved.label}>
        {label}
      </div>
    );
  }

  const accessible = resolved.sourceLabel
    ? `${resolved.label} — source: ${resolved.sourceLabel}`
    : `${resolved.label} — open source`;

  return (
    // rel="noopener" (NOT "noopener noreferrer"): keep the security-critical noopener, but do not
    // strip the Referer. Some first-party docs/CDN edges (docs.redhat.com/access.redhat.com behind
    // Akamai) serve a blank/blocked body to referrer-less hits — a click that opened blank. Sending
    // the app's origin as the Referer is safe here (linking to Red Hat's own public docs).
    <a
      href={resolved.sourceUrl}
      target="_blank"
      rel="noopener"
      className={className}
      title={resolved.sourceLabel || resolved.detail || resolved.label}
      aria-label={accessible}
    >
      {label}
      <ExternalLink
        size={12}
        aria-hidden="true"
        className="absolute top-1.5 right-1.5 opacity-50 group-hover:opacity-90 transition-opacity"
      />
    </a>
  );
}

function HeroGrid({ cells, zone }) {
  return (
    <div className={UNIFORM_GRID}>
      {cells.map((c) => (
        <HeroCell key={`${zone}-${c.label}`} resolved={c} zone={zone} />
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-4 rounded border-2 border-solid border-gray-400 dark:border-gray-500" />
        Verified (clear-tier)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-4 rounded border-2 border-dashed border-gray-400 dark:border-gray-500" />
        Pending verification
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ExternalLink size={12} aria-hidden="true" />
        Every cell links to its source
      </span>
    </div>
  );
}

export default function ProductComparisonHero({ comparison }) {
  const hero = comparison?.hero;
  if (!hero || !hero.inner || !hero.outer) return null;

  const innerCells = (hero.inner.components ?? []).map((c) => resolveHeroCell(comparison, c)).filter(Boolean);
  const outerCells = (hero.outer.components ?? []).map((c) => resolveHeroCell(comparison, c)).filter(Boolean);

  return (
    <section
      aria-label="Product architecture overview — how the two products nest"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">How the two products nest</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Draft — illustrative, pending curation</span>
      </div>
      <div className="mb-4">
        <Legend />
      </div>

      {/* OUTER containment: the Red Hat OpenShift AI platform */}
      <div className="rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50/40 dark:bg-purple-950/20 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm font-bold text-purple-900 dark:text-purple-100">{hero.outer.label}</span>
          {hero.outer.tagline && <span className={PILL_OUTER}>{hero.outer.tagline}</span>}
        </div>

        {/* INNER containment: the Red Hat AI Inference Server core, nested inside the platform */}
        <div className="rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 p-3 sm:p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-bold text-blue-900 dark:text-blue-100">{hero.inner.label}</span>
            {hero.inner.tagline && <span className={PILL_INNER}>{hero.inner.tagline}</span>}
          </div>
          <HeroGrid cells={innerCells} zone="inner" />
          {hero.inner.caption && (
            <p className="mt-3 text-xs text-blue-800/80 dark:text-blue-200/70 leading-relaxed">{hero.inner.caption}</p>
          )}
        </div>

        {/* OUTER platform components — what OpenShift AI adds around the core */}
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-2">
          OpenShift AI adds
        </p>
        <HeroGrid cells={outerCells} zone="outer" />
        {hero.outer.caption && (
          <p className="mt-3 text-xs text-purple-800/80 dark:text-purple-200/70 leading-relaxed">{hero.outer.caption}</p>
        )}
      </div>

      {/* Footnote: dashed cells still link out, but the fact is not yet settled by a single source. */}
      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-gray-400 dark:text-gray-500" />
        <p>
          Dashed cells are inferred- or unresolved-tier: the confidence is lower, the documentation and
          container catalog disagree, or the source needs an authenticated pull. Each still links to its
          source — confirm with your Red Hat account team before treating any cell as final.
        </p>
      </div>
    </section>
  );
}
