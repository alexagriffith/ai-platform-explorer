import { useState, useCallback } from 'react';
import { AlertCircle, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { productComparisons, isComparisonDraft } from '../data/productComparisons';
import SharedSpineLedger from './SharedSpineLedger';
import { buildLedgerModel } from '../lib/ledgerModel';

/**
 * ProductComparisonView — the Product Comparison tab, structured as THREE BEATS top to bottom so a
 * customer can answer "which Red Hat AI product do I need?" without reading a spec sheet:
 *
 *   BEAT 1 · ORIENT  — the question + one framing sentence, in the largest type on the page.
 *   BEAT 2 · DECIDE  — two equal cards: the need you have -> the product that meets it, two facts each.
 *   BEAT 3 · PROVE   — the shared-spine bill-of-materials ledger (SharedSpineLedger): the same
 *                      component down the center, each product's presence flanking it, the shared core
 *                      reading as one continuous band (containment as shape).
 *
 * Below the beats, the previous per-cell provenance tables live on UNCHANGED inside a collapsed
 * "Detailed provenance" section. All comparison data is still illustrative behind the amber draft
 * banner (see src/data/CURATION-TODO.md); this view flips no flag and derives the ledger read-only.
 */

const CAPTURE_ROOT_ID = 'product-comparison-capture-root';

const INCLUSION_LABEL = {
  included: 'Included',
  'add-on': 'Add-on',
  'not-included': 'Not included',
  confirm: 'Confirm with Red Hat'
};

const SUPPORT_LABEL = {
  yes: 'Yes',
  partial: 'Partial',
  no: 'No',
  confirm: 'Confirm with Red Hat'
};

const DRAFT_BANNER_TEXT =
  'Draft — pending bill of materials (BOM) curation. Rows below are illustrative placeholders, not confirmed product contents. Confirm anything here with your Red Hat account team.';

function inclusionLabel(value) {
  return INCLUSION_LABEL[value] || value || 'Unknown';
}

function supportLabel(value) {
  return SUPPORT_LABEL[value] || value || 'Unknown';
}

/** One product cell in the DETAILED provenance tables (unchanged): a single plain-text status label
 *  above the detail line, with per-cell maturity appended when present, and the source link. */
function ProductCell({ cell, kind }) {
  if (!cell) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">—</span>;
  }
  const label = kind === 'bom' ? inclusionLabel(cell.included) : supportLabel(cell.support);
  const detail = cell.status ? `${cell.detail} — ${cell.status}` : cell.detail;
  const pending = cell.tier && cell.tier !== 'clear';
  return (
    <div className="space-y-1">
      <div className="text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{detail}</div>
      {cell.sourceUrl && (
        <a
          href={cell.sourceUrl}
          target="_blank"
          rel="noopener"
          title={cell.sourceLabel || 'Open source'}
          className="inline-flex items-start gap-1 text-xs font-medium text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline transition-colors"
        >
          <ExternalLink size={12} className="mt-0.5 flex-shrink-0" />
          <span>{cell.sourceLabel || 'Source'}</span>
        </a>
      )}
      {pending && (
        <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Pending verification
        </div>
      )}
    </div>
  );
}

function OverlapCell({ overlap }) {
  if (overlap === true) {
    return <span className="text-sm font-medium text-gray-900 dark:text-white">Shared</span>;
  }
  return <span className="text-sm text-gray-400 dark:text-gray-500">—</span>;
}

function DraftBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-lg">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-start gap-2 text-white">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">{DRAFT_BANNER_TEXT}</p>
        </div>
      </div>
    </div>
  );
}

/* ── BEAT 1 · ORIENT ─────────────────────────────────────────────────────────────────────────── */
/** The question and one framing sentence, in the largest type on the page. Nothing else. */
function OrientBeat() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
        Which Red Hat AI product do you need?
      </h2>
      <p className="mt-4 text-lg sm:text-xl leading-relaxed text-gray-600 dark:text-gray-300">
        The Inference Server is the engine. OpenShift AI is the platform built around it — and the
        engine is also sold on its own.
      </p>
    </div>
  );
}

/* ── BEAT 2 · DECIDE ─────────────────────────────────────────────────────────────────────────── */
/** Two equal-height cards: the need -> the product -> two facts. Left = Inference Server (blue),
 *  right = OpenShift AI (purple), matching the ledger's column colors. */
function DecisionCard({ tone, need, product, facts }) {
  const styles =
    tone === 'a'
      ? {
          card: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20',
          product: 'text-blue-800 dark:text-blue-200',
          dot: 'bg-blue-500'
        }
      : {
          card: 'border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20',
          product: 'text-purple-800 dark:text-purple-200',
          dot: 'bg-purple-500'
        };
  return (
    <div className={`flex h-full flex-col rounded-xl border-2 p-5 sm:p-6 ${styles.card}`}>
      <h3 className="text-lg sm:text-xl font-bold leading-snug text-gray-900 dark:text-white">{need}</h3>
      <div className={`mt-3 text-base font-semibold ${styles.product}`}>→ {product}</div>
      <ul className="mt-4 space-y-2.5">
        {facts.map((fact) => (
          <li key={fact} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
            <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${styles.dot}`} />
            <span className="leading-relaxed">{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionBeat() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-6">
      <DecisionCard
        tone="a"
        need="You just need to serve models, fast"
        product="Red Hat AI Inference Server"
        facts={['One container · vLLM engine', 'Runs anywhere — any Kubernetes, plain Linux']}
      />
      <DecisionCard
        tone="b"
        need="You need the whole machine-learning lifecycle"
        product="Red Hat OpenShift AI"
        facts={['Notebooks → pipelines → serving · includes the Inference Server', 'Requires OpenShift']}
      />
    </div>
  );
}

/* ── Detailed provenance tables (unchanged) ──────────────────────────────────────────────────── */
function ComparisonTableShell({ columns, children }) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[140px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BomTable({ comparison }) {
  const { a, b } = comparison.products;
  return (
    <ComparisonTableShell columns={['Component area', a.label, b.label]}>
      {comparison.bomRows.map((row) => (
        <tr key={row.area} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <div className="font-medium text-sm text-gray-900 dark:text-white">{row.area}</div>
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <ProductCell cell={row.a} kind="bom" />
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <ProductCell cell={row.b} kind="bom" />
          </td>
        </tr>
      ))}
    </ComparisonTableShell>
  );
}

function CapabilityTable({ comparison }) {
  const { a, b } = comparison.products;
  return (
    <ComparisonTableShell columns={['Capability', a.label, b.label, 'Overlap']}>
      {comparison.capabilityRows.map((row) => (
        <tr key={row.capability} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <div className="font-medium text-sm text-gray-900 dark:text-white">{row.capability}</div>
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <ProductCell cell={row.a} kind="capability" />
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <ProductCell cell={row.b} kind="capability" />
          </td>
          <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
            <OverlapCell overlap={row.overlap} />
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

const TOGGLES = [
  { id: 'bom', label: 'Bill of materials (BOM)' },
  { id: 'capabilities', label: 'Capabilities' }
];

export default function ProductComparisonView() {
  const comparison = productComparisons[0] ?? null;
  const [view, setView] = useState('bom');
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
        backgroundColor: isDark ? '#111827' : '#f3f4f6'
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
            onClick={handleDownloadPng}
            disabled={pngBusy}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-60"
          >
            <Download size={16} />
            {pngBusy ? 'Exporting…' : 'Export PNG'}
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {copyDone ? <Check size={16} /> : <Copy size={16} />}
            {copyDone ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      </div>
      {pngError && <p className="text-right text-xs text-red-600 dark:text-red-400">{pngError}</p>}

      {/* CAPTURE ROOT — the three beats (+ draft banner) are what the PNG export captures. */}
      <div id={CAPTURE_ROOT_ID} className="space-y-8">
        {isComparisonDraft(comparison) && <DraftBanner />}
        <OrientBeat />
        <DecisionBeat />
        <SharedSpineLedger comparison={comparison} />
      </div>

      {/* Detailed provenance (collapsed, unchanged) — every cell links to its source. */}
      <details className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer select-none px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-lg">
          <span>Detailed provenance tables (bill of materials + capabilities)</span>
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">every cell links to its source</span>
        </summary>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <nav className="flex gap-1 px-4 border-b border-gray-200 dark:border-gray-700">
            {TOGGLES.map((toggle) => (
              <button
                key={toggle.id}
                onClick={() => setView(toggle.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  view === toggle.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {toggle.label}
              </button>
            ))}
          </nav>
          <div className="p-4 sm:p-6">
            {view === 'bom' ? <BomTable comparison={comparison} /> : <CapabilityTable comparison={comparison} />}
          </div>
        </div>
      </details>

      {/* Documentation links (outside the capture root). */}
      {comparison.docsLinks && comparison.docsLinks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Additional Resources</h3>
          <ul className="space-y-2">
            {comparison.docsLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
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
