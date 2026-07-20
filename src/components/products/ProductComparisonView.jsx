import { useState, useCallback } from 'react';
import { AlertCircle, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { productComparisons, isComparisonDraft } from '../../data/productComparisons';
import SharedSpineLedger from './SharedSpineLedger';
import ProductComparisonHero from './ProductComparisonHero';
import { buildLedgerModel } from '../../lib/ledgerModel';
import { interactive, supportMark as SUPPORT_MARK, typeScale } from '../../lib/styleTokens';

/**
 * ProductComparisonView — the Product Comparison tab, structured as THREE BEATS top to bottom so a
 * customer can answer "which Red Hat AI product do I need?" without reading a spec sheet:
 *
 *   BEAT 1 · ORIENT  — the question + one framing sentence, in the largest type on the page.
 *   BEAT 2 · DECIDE  — two equal columns (box-free, split by one hairline): the need you have ->
 *                      the product that meets it, two facts each.
 *   BEAT 3 · PROVE   — the shared-spine bill-of-materials ledger (SharedSpineLedger): the same
 *                      component down the center, each product's presence flanking it, the shared
 *                      core reading as one continuous band (containment as shape).
 *
 * STYLING (2026-07-16 restyle): Red Hat / PatternFly skin — neutral surfaces, a SINGLE Red Hat red
 * accent, one surface per section, zero nested bordered boxes, hairline dividers over containers
 * (see planning/DESIGN-NOTES.md). Below the beats, the per-cell provenance tables live on unchanged
 * (logic-wise) inside a collapsed "Detailed provenance" section. All comparison data is still
 * illustrative behind the draft banner (see src/data/CURATION-TODO.md); this view flips no flag and
 * derives the ledger read-only.
 */

const CAPTURE_ROOT_ID = 'product-comparison-capture-root';

const INCLUSION_LABEL = {
  included: 'Included',
  'add-on': 'Add-on',
  'not-included': 'Not included',
  confirm: 'Confirm with Red Hat'
};


const DRAFT_BANNER_TEXT =
  'Draft — pending bill of materials (BOM) curation. Rows below are illustrative placeholders, not confirmed product contents. Confirm anything here with your Red Hat account team.';

function inclusionLabel(value) {
  return INCLUSION_LABEL[value] || value || 'Unknown';
}

/** Capability presence cell: check/X mark (✓/✕) + source link. Never Yes/No text. */
function CapabilityPresenceCell({ cell }) {
  if (!cell) return <span className={`${typeScale.caption} text-faint`} aria-label="no data">—</span>;
  const mark = SUPPORT_MARK[cell.support] || { symbol: '?', ariaLabel: cell.support || 'unknown', className: 'text-faint' };
  const pending = cell.tier && cell.tier !== 'clear';
  const detail = cell.status ? `${cell.detail} — ${cell.status}` : cell.detail;
  return (
    <div className="space-y-1">
      <span className={`${typeScale.symbolDisplay} ${mark.className}`} aria-label={mark.ariaLabel}>
        {mark.symbol}
      </span>
      <div className={`${typeScale.captionSm} text-muted`}>{detail}</div>
      {cell.sourceUrl && (
        <a
          href={cell.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={cell.sourceLabel || 'Open source'}
          className={`inline-flex items-start gap-1 ${typeScale.label} font-medium text-link hover:underline ${interactive.transition} ${interactive.focusRing}`}
        >
          <ExternalLink size={12} className="mt-0.5 flex-shrink-0" />
          <span>{cell.sourceLabel || 'Source'}</span>
        </a>
      )}
      {pending && (
        <div className={`${typeScale.microLabel} tracking-wide text-accent`}>
          Pending verification
        </div>
      )}
    </div>
  );
}

/** One product cell in the BOM rows: inclusion label above detail + source link. */
function BomCell({ cell }) {
  if (!cell) {
    return <span className={`${typeScale.caption} text-faint`}>—</span>;
  }
  const label = inclusionLabel(cell.included);
  const detail = cell.status ? `${cell.detail} — ${cell.status}` : cell.detail;
  const pending = cell.tier && cell.tier !== 'clear';
  return (
    <div className="space-y-1">
      <div className={`${typeScale.bodyStrong} text-ink`}>{label}</div>
      <div className={`${typeScale.captionSm} text-muted`}>{detail}</div>
      {cell.sourceUrl && (
        <a
          href={cell.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={cell.sourceLabel || 'Open source'}
          className={`inline-flex items-start gap-1 ${typeScale.label} font-medium text-link hover:underline ${interactive.transition} ${interactive.focusRing}`}
        >
          <ExternalLink size={12} className="mt-0.5 flex-shrink-0" />
          <span>{cell.sourceLabel || 'Source'}</span>
        </a>
      )}
      {pending && (
        <div className={`${typeScale.microLabel} tracking-wide text-accent`}>
          Pending verification
        </div>
      )}
    </div>
  );
}

/** Draft caution — one surface, no nested boxes: a pale-red fill (deep red in dark) with the red
 *  accent icon. Distinct from the page in both themes (checked by the style gate). */
function DraftBanner() {
  return (
    <div data-draft-banner className="rounded-card bg-draft-bg px-4 sm:px-6 py-3">
      <div className="flex items-start gap-2 text-draft-fg">
        <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-accent" />
        <p className={`${typeScale.captionSm} font-medium leading-relaxed`}>{DRAFT_BANNER_TEXT}</p>
      </div>
    </div>
  );
}

/* ── BEAT 1 · ORIENT ─────────────────────────────────────────────────────────────────────────── */
/** The question and one framing sentence, in the largest type on the page. No box. */
function OrientBeat() {
  return (
    <div className="max-w-3xl">
      <h2 className={`font-display ${typeScale.heroTitle} sm:text-4xl text-ink`}>
        Which Red Hat AI product do you need?
      </h2>
      <p className={`mt-2 ${typeScale.heroSubtitleSm} text-muted`}>
        The Inference Server is the engine. OpenShift AI is the platform built around it — and the
        engine is also sold on its own.
      </p>
    </div>
  );
}

/* ── BEAT 2 · DECIDE ─────────────────────────────────────────────────────────────────────────── */
/** One card: a small uppercase tag above the product name, nothing else.
 *  Two of these sit in an equal-width grid split by one hairline (anti-box, equal-cell law). */
function DecisionCard({ tag, name, className = '' }) {
  return (
    <div
      data-ui="card"
      className={`flex h-full flex-col justify-center ${className}`}
    >
      <div className={`${typeScale.microLabel} tracking-widest text-accent mb-1`}>
        {tag}
      </div>
      <div className={`${typeScale.decideName} text-ink`}>{name}</div>
    </div>
  );
}

function DecisionBeat({ comparison }) {
  const { a, b } = comparison.products;
  return (
    <div className="grid grid-cols-1 divide-y divide-hair md:grid-cols-2 md:divide-y-0 md:divide-x">
      <DecisionCard
        tag={a.decisionTag}
        name={a.label}
        className="pb-4 md:pb-0 md:pr-6"
      />
      <DecisionCard
        tag={b.decisionTag}
        name={b.label}
        className="pt-4 md:pt-0 md:pl-6"
      />
    </div>
  );
}

/* ── Detailed provenance tables ──────────────────────────────────────────────────────────────── */
/** Box-free table: a hairline under the header row, hairlines between body rows, no outer border. */
function ComparisonTableShell({ columns, children }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-edge">
            {columns.map((col) => (
              <th
                key={col}
                className={`px-3 sm:px-4 py-2 text-left ${typeScale.tableHeader} text-faint min-w-[140px]`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hair">{children}</tbody>
      </table>
    </div>
  );
}

/**
 * ProvenanceTable — single grouped table replacing the former two-table toggle.
 * Groups: "Bill of materials" (bomRows) then "Capabilities" (capabilityRows).
 * Overlap column dropped. Capability presence = ✓/✕ marks, never Yes/No words.
 * Tier + source-link rules unchanged: solid requires clear tier + working link.
 */
function GroupHeaderRow({ label, colSpan }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        data-ui="section-header"
        className="px-3 sm:px-4 py-1.5 bg-tint border-b border-edge"
      >
        <span className={`${typeScale.tableHeader} text-faint`}>{label}</span>
      </td>
    </tr>
  );
}

function ProvenanceTable({ comparison }) {
  const { a, b } = comparison.products;
  const colSpan = 3;
  return (
    <ComparisonTableShell columns={['Component / capability', a.label, b.label]}>
      <GroupHeaderRow label="Bill of materials" colSpan={colSpan} />
      {comparison.bomRows.map((row) => (
        <tr key={row.area}>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <div className={`${typeScale.bodyStrong} text-ink`}>{row.area}</div>
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <BomCell cell={row.a} />
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <BomCell cell={row.b} />
          </td>
        </tr>
      ))}
      <GroupHeaderRow label="Capabilities" colSpan={colSpan} />
      {comparison.capabilityRows.map((row) => (
        <tr key={row.capability}>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <div className={`${typeScale.bodyStrong} text-ink`}>{row.capability}</div>
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <CapabilityPresenceCell cell={row.a} />
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <CapabilityPresenceCell cell={row.b} />
          </td>
        </tr>
      ))}
    </ComparisonTableShell>
  );
}

/** Copyable summary — mirrors the three beats and the shared-spine ledger so copied text matches the
 *  screen. Present = "yes", present-but-inferred = "yes (pending verification)", absent = "—". */
function markWord(side) {
  if (!side.present) return '—';
  return side.verified ? 'yes' : 'yes (pending verification)';
}

function buildProductComparisonCopyText(comparison) {
  const lines = [];
  if (isComparisonDraft(comparison)) {
    lines.push('DRAFT — pending bill of materials (BOM) curation; confirm with your Red Hat account team.');
    lines.push('');
  }
  lines.push('Which Red Hat AI product do you need?');
  lines.push(
    'The Inference Server is the engine. OpenShift AI is the platform built around it — and the engine is also sold on its own.'
  );
  lines.push('');
  lines.push('You just need to serve models, fast → Red Hat AI Inference Server');
  lines.push('  • One container · vLLM engine');
  lines.push('  • Runs anywhere — any Kubernetes, plain Linux');
  lines.push('');
  lines.push('You need the whole machine-learning lifecycle → Red Hat OpenShift AI');
  lines.push('  • Notebooks → pipelines → serving · includes the Inference Server');
  lines.push('  • Requires OpenShift');
  lines.push('');
  lines.push('What ships in each product (Red Hat AI Inference Server · Red Hat OpenShift AI):');
  for (const group of buildLedgerModel(comparison)) {
    lines.push('');
    lines.push(`[${group.title}]`);
    for (const row of group.rows) {
      lines.push(`  ${row.name}: ${markWord(row.a)} · ${markWord(row.b)}`);
    }
  }
  return lines.join('\n');
}


export default function ProductComparisonView() {
  const comparison = productComparisons[0] ?? null;
  const [copyDone, setCopyDone] = useState(false);
  const [pngBusy, setPngBusy] = useState(false);
  const [pngError, setPngError] = useState('');

  const handleCopy = async () => {
    if (!comparison) return;
    const text = buildProductComparisonCopyText(comparison);
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setCopyDone(false);
    }
  };

  const handleDownloadPng = useCallback(async () => {
    const el = document.getElementById(CAPTURE_ROOT_ID);
    if (!el || pngBusy || !comparison) return;
    setPngBusy(true);
    setPngError('');
    try {
      // Lazy-load the export library so it stays out of the main bundle.
      const { toPng } = await import('html-to-image');
      const isDark = document.documentElement.classList.contains('dark');
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: isDark ? '#151515' : '#f2f2f2'
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `product-comparison-${comparison.id}-${new Date().toISOString().slice(0, 10)}.png`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('PNG export failed:', err);
      setPngError('Export failed. Try again.');
    } finally {
      setPngBusy(false);
    }
  }, [pngBusy, comparison]);

  if (!comparison) return null;

  return (
    <div className="space-y-6">
      {/* Toolbar — outside the capture root, so the exported image is the three beats alone. */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <button
            data-ui="control"
            onClick={handleDownloadPng}
            disabled={pngBusy}
            className={`inline-flex items-center gap-2 px-3 py-2 ${typeScale.navTab} rounded-card border border-edge text-ink hover:bg-tint ${interactive.transition} ${interactive.focusRing} disabled:opacity-60`}
          >
            <Download size={16} />
            {pngBusy ? 'Exporting…' : 'Export PNG'}
          </button>
          <button
            data-ui="control"
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-3 py-2 ${typeScale.navTab} rounded-card border border-edge text-ink hover:bg-tint ${interactive.transition} ${interactive.focusRing}`}
          >
            {copyDone ? <Check size={16} /> : <Copy size={16} />}
            {copyDone ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      </div>
      {pngError && <p className={`text-right ${typeScale.caption} text-accent`}>{pngError}</p>}

      {/* CAPTURE ROOT — the three beats (+ draft banner) are what the PNG export captures. */}
      <div id={CAPTURE_ROOT_ID} className="space-y-6">
        {isComparisonDraft(comparison) && <DraftBanner />}
        <OrientBeat />
        <DecisionBeat comparison={comparison} />
        <ProductComparisonHero comparison={comparison} />
        <SharedSpineLedger comparison={comparison} />
      </div>

      {/* Detailed provenance (collapsed) — single grouped table; no toggle. */}
      <details className="border-t border-hair pt-2">
        <summary className={`cursor-pointer select-none px-1 py-3 flex flex-wrap items-center justify-between gap-2 ${typeScale.bodyStrong} text-ink hover:text-link`}>
          <span>Detailed provenance (bill of materials + capabilities)</span>
          <span className={`${typeScale.caption} font-normal text-faint`}>every cell links to its source</span>
        </summary>
        <div className="pt-4">
          <ProvenanceTable comparison={comparison} />
        </div>
      </details>

      {/* Documentation links (outside the capture root) — box-free, separated by a top hairline. */}
      {comparison.docsLinks && comparison.docsLinks.length > 0 && (
        <div className="border-t border-hair pt-4">
          <h3 className={`${typeScale.subSectionTitle} text-ink mb-2`}>Additional resources</h3>
          <ul className="space-y-2">
            {comparison.docsLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${typeScale.navTab} text-link hover:underline ${interactive.transition} ${interactive.focusRing}`}
                >
                  <ExternalLink size={14} className="flex-shrink-0" />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
