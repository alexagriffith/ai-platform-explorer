import { ExternalLink } from 'lucide-react';
import { interactive } from '../lib/styleTokens';
import { readSide } from '../lib/ledgerModel';

/**
 * ProductComparisonHero — CONTAINMENT DIAGRAM from hero data in productComparisons.js.
 *
 * Layout: outer ring = Red Hat OpenShift AI (the platform). Inside it, a nested
 * section = Red Hat AI Inference Server (the engine). Nesting geometry conveys
 * the containment relationship; zone labels are product names; cells carry
 * canonical component/capability names.
 *
 * Anti-box law: outer ring uses ONE border. Inner section uses a tinted surface
 * (bg-tint) without any additional border — tonal separation only. No nested
 * bordered boxes permitted by DESIGN-LAW.md.
 *
 * Every cell resolves tier + sourceUrl from the row-side data it references and
 * links to that sourceUrl. Solid fill = clear-tier (verified); dashed ring =
 * inferred/unresolved-tier (pending verification).
 *
 * data-ui archetypes: section-header on zone labels, card on each component cell,
 * table on the grid wrapper.
 */

/** Resolve a hero cell's source data from the live comparison rows. */
function resolveCell(cell, comparison) {
  const rows = cell.view === 'capability' ? comparison.capabilityRows : comparison.bomRows;
  const row = (rows ?? []).find((r) => (r.area ?? r.capability) === cell.key);
  if (!row) return null;
  const raw = row[cell.side];
  if (!raw) return null;
  const side = readSide(raw, cell.view);
  return {
    ...side,
    sourceUrl: raw.sourceUrl || null,
    sourceLabel: raw.sourceLabel || null,
  };
}

/** One component cell — page-surface background for equal contrast in both the outer (bg-surface) and inner (bg-tint) zones. */
function HeroCell({ label, resolved }) {
  const isVerified = resolved && resolved.verified;
  const isPending = resolved && resolved.present && !resolved.verified;
  const url = resolved?.sourceUrl || null;
  const title = resolved?.sourceLabel || label;

  const ringClass = isPending
    ? 'ring-1 ring-dashed ring-accent/60'
    : '';

  const inner = (
    <span
      className={`block rounded-card bg-page px-2 py-1.5 text-center ${ringClass}`}
    >
      <span className="block text-xs font-semibold leading-tight text-ink">{label}</span>
      {isPending && (
        <span className="block mt-0.5 text-[10px] text-accent font-medium">
          pending
        </span>
      )}
      {isVerified && (
        <span className="sr-only"> — verified</span>
      )}
    </span>
  );

  if (!url) {
    return (
      <div data-ui="card" className={`${interactive.transition}`}>
        {inner}
      </div>
    );
  }

  return (
    <a
      data-ui="card"
      href={url}
      target="_blank"
      rel="noopener"
      title={title}
      aria-label={`${label} — source: ${title}`}
      className={`group block ${interactive.transition} ${interactive.focusRing} rounded-card`}
    >
      {inner}
      <ExternalLink
        size={10}
        aria-hidden="true"
        className="mx-auto mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity text-faint"
      />
    </a>
  );
}

/** Zone label row above a grid of cells. */
function ZoneLabel({ label, tagline }) {
  return (
    <div data-ui="section-header" className="mb-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      {tagline && (
        <span className="ml-1.5 text-[10px] text-faint">{tagline}</span>
      )}
    </div>
  );
}

/** Uniform grid of HeroCells. */
function CellGrid({ components, comparison }) {
  return (
    <div
      data-ui="table"
      aria-label="Component cells"
      className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4"
    >
      {components.map((cell) => {
        const resolved = resolveCell(cell, comparison);
        return (
          <HeroCell key={cell.label} label={cell.label} resolved={resolved} />
        );
      })}
    </div>
  );
}

export default function ProductComparisonHero({ comparison }) {
  const { hero } = comparison;
  if (!hero) return null;

  const { inner, outer } = hero;

  return (
    <section
      data-ui="table"
      aria-label="Containment diagram — Red Hat AI Inference Server inside Red Hat OpenShift AI"
      className="rounded-card border border-edge bg-surface px-4 py-4 space-y-3"
    >
      {/* Outer zone label — OpenShift AI (the platform) */}
      <ZoneLabel label={outer.label} tagline={outer.tagline} />

      {/* Outer cells grid */}
      <CellGrid components={outer.components} comparison={comparison} />

      {/* Inner zone — Inference Server (the engine), tinted surface, no border.
          Anti-box: bg-tint surface only; outer section carries the sole border.
          data-ui-exempt: structural sub-zone inside data-ui="table" parent. */}
      <div
        data-ui-exempt="inner-zone inside data-ui=table containment diagram"
        className="rounded-card bg-tint px-3 py-3 space-y-2"
      >
        <ZoneLabel label={inner.label} tagline={inner.tagline} />
        <CellGrid components={inner.components} comparison={comparison} />
      </div>

      {/* Caption — outer product caption only; inner caption in sr-only context */}
      <p className="text-xs leading-relaxed text-muted">
        {outer.caption}
      </p>
      <p className="sr-only">{inner.caption}</p>
    </section>
  );
}
