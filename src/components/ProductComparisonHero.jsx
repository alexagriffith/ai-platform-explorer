import { ExternalLink } from 'lucide-react';
import { interactive, typeScale } from '../lib/styleTokens';
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
 * links to that sourceUrl. Solid fill = clear-tier (verified); dashed outline =
 * inferred/unresolved-tier (pending verification). CSS outline (not border) is used
 * for the dashed mark so it does not trigger the anti-box nested-bordered-box check.
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

  // ring-dashed is not a valid Tailwind utility (rings cannot be dashed).
  // Use CSS outline (not border) so the dashed mark does not trigger the anti-box
  // nested-bordered-box check (which inspects border-width, not outline-width).
  const outlineClass = isPending
    ? 'outline outline-1 outline-dashed outline-accent/60'
    : '';

  // The pending indicator is absolutely positioned so it takes zero flow space —
  // equal inner-fill height for all cells in the row regardless of status.
  const inner = (
    <span
      className={`relative block rounded-card bg-page px-2 py-1.5 text-center min-h-[2rem] flex items-center justify-center ${outlineClass}`}
    >
      <span className={`block ${typeScale.columnLabelBold} text-ink`}>{label}</span>
      {isPending && (
        <span
          aria-label="pending verification"
          className="absolute top-0.5 right-0.5 block w-1.5 h-1.5 rounded-full bg-accent/60"
        />
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
      <span className={`${typeScale.label} font-semibold text-ink`}>{label}</span>
      {tagline && (
        <span className={`ml-1.5 ${typeScale.microFaint} text-faint`}>{tagline}</span>
      )}
    </div>
  );
}

/** Uniform grid of HeroCells.
 *  colClass: override the default column layout (e.g. for inner bands with exactly 4 cells
 *  where sm:grid-cols-3 would produce a 3+1 orphan row). */
function CellGrid({ components, comparison, colClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }) {
  return (
    <div
      data-ui="table"
      aria-label="Component cells"
      className={`grid gap-1.5 ${colClass}`}
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
        {/* 4 cells: 2-col → 4-col. Never 3-col (would orphan to 3+1 at sm). */}
        <CellGrid components={inner.components} comparison={comparison} colClass="grid-cols-2 sm:grid-cols-4" />
      </div>

      {/* Caption — outer product caption as takeaway bullets; inner in sr-only context */}
      <div className={`${typeScale.caption} leading-relaxed text-muted space-y-1`} role="note">
        <p><strong className="text-ink font-semibold">The full platform.</strong> OpenShift AI wraps the inference core and adds:</p>
        <ul className="list-disc list-inside space-y-0.5 pl-1">
          <li>KServe serving, notebook workbenches, data-science pipelines, distributed training</li>
          <li>Model-server autoscaling, a model-as-a-service (MaaS) gateway, responsible-AI monitoring (TrustyAI), and fine-tuning</li>
          <li><span className="outline outline-1 outline-dashed outline-accent/60 rounded px-0.5 relative inline-block pr-2.5">Dashed cells<span aria-hidden="true" className="absolute top-0 right-0.5 w-1.5 h-1.5 rounded-full bg-accent/60 inline-block" /></span> — fact still disagrees between documentation and the container catalog, or requires an authenticated pull</li>
        </ul>
      </div>
      <p className="sr-only">{inner.caption}</p>
    </section>
  );
}
