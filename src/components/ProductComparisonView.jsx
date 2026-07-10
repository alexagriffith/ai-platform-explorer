import { useState, useCallback } from 'react';
import { AlertCircle, Users, Download, Copy, Check } from 'lucide-react';
import {
  productComparisons,
  getProductComparisonById,
  getProductComparisonList,
  isComparisonDraft
} from '../data/productComparisons';

/**
 * ProductComparisonView
 *
 * Sixth top-level tab: compares two Red Hat AI products as ONE comparison object rendered two ways —
 * a bill of materials (BOM) view (what components ship in each product) and a Capability view (what
 * each product lets you do, and where they overlap). All comparison data ships as illustrative
 * placeholders behind a visible draft banner until a human curates it (see src/data/CURATION-TODO.md).
 */

// Shared badge palette — complete Tailwind literals (no template-built class strings). One config per
// vocabulary value; `.label` is reused by the copyable summary so the text matches the badges.
const CAPTURE_ROOT_ID = 'product-comparison-capture-root';

const BADGE_BASE = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full';
const GREEN = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
const BLUE = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
const GRAY = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
const YELLOW = 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
const AMBER = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';

const INCLUSION_BADGE = {
  'included': { label: 'Included', className: GREEN },
  'add-on': { label: 'Add-on', className: BLUE },
  'not-included': { label: 'Not included', className: GRAY },
  'confirm': { label: 'Confirm with Red Hat', className: AMBER }
};

const SUPPORT_BADGE = {
  'yes': { label: 'Yes', className: GREEN },
  'partial': { label: 'Partial', className: YELLOW },
  'no': { label: 'No', className: GRAY },
  'confirm': { label: 'Confirm with Red Hat', className: AMBER }
};

const DRAFT_BANNER_TEXT =
  'Draft — pending bill of materials (BOM) curation. Rows below are illustrative placeholders, not confirmed product contents. Confirm anything here with your Red Hat account team.';

function inclusionConfig(value) {
  return INCLUSION_BADGE[value] || { label: value || 'Unknown', className: GRAY };
}

function supportConfig(value) {
  return SUPPORT_BADGE[value] || { label: value || 'Unknown', className: GRAY };
}

function InclusionBadge({ value }) {
  const config = inclusionConfig(value);
  return <span className={`${BADGE_BASE} ${config.className}`}>{config.label}</span>;
}

function SupportBadge({ value }) {
  const config = supportConfig(value);
  return <span className={`${BADGE_BASE} ${config.className}`}>{config.label}</span>;
}

/** One product cell: a badge plus the detail line, with per-cell status appended when present. */
function ProductCell({ cell, kind }) {
  if (!cell) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">—</span>;
  }
  const detail = cell.status ? `${cell.detail} — ${cell.status}` : cell.detail;
  return (
    <div className="space-y-1.5">
      {kind === 'bom' ? <InclusionBadge value={cell.included} /> : <SupportBadge value={cell.support} />}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{detail}</div>
    </div>
  );
}

function OverlapCell({ overlap }) {
  if (overlap === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-300">
        <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Shared
      </span>
    );
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

function ProductComparisonSelector({ selectedId, onSelect }) {
  const comparisons = getProductComparisonList();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Comparison</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare two Red Hat AI products side by side: what ships in each (bill of materials view) and
          what you can do with each (capability view).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {comparisons.map((comparison) => {
          const isSelected = selectedId === comparison.id;
          return (
            <button
              key={comparison.id}
              onClick={() => onSelect(comparison.id)}
              className={`text-left p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{comparison.title}</h3>
                {comparison.draft && (
                  <span className={`${BADGE_BASE} ${AMBER} flex-shrink-0`}>Draft</span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{comparison.description}</p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users size={16} className="mr-2 flex-shrink-0" />
                <span className="italic">For: {comparison.audience || 'Technical teams'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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

/** Private (unexported) pure text builder for the copyable summary — mirrors buildWorkshopCopyText. */
function buildProductComparisonCopyText(comparison, view) {
  const lines = [];
  if (isComparisonDraft(comparison)) {
    lines.push('DRAFT — pending bill of materials (BOM) curation; confirm with your Red Hat account team.');
    lines.push('');
  }
  lines.push(comparison.title);
  lines.push('');
  const aLabel = comparison.products.a.label;
  const bLabel = comparison.products.b.label;
  if (view === 'bom') {
    lines.push('Bill of materials (BOM):');
    for (const row of comparison.bomRows) {
      const aWord = inclusionConfig(row.a?.included).label;
      const bWord = inclusionConfig(row.b?.included).label;
      lines.push(`${row.area}: ${aLabel} = ${aWord}; ${bLabel} = ${bWord}`);
    }
  } else {
    lines.push('Capabilities:');
    for (const row of comparison.capabilityRows) {
      const aWord = supportConfig(row.a?.support).label;
      const bWord = supportConfig(row.b?.support).label;
      lines.push(`${row.capability}: ${aLabel} = ${aWord}; ${bLabel} = ${bWord}`);
    }
  }
  return lines.join('\n');
}

const TOGGLES = [
  { id: 'bom', label: 'Bill of materials (BOM)' },
  { id: 'capabilities', label: 'Capabilities' }
];

export default function ProductComparisonView() {
  const [selectedId, setSelectedId] = useState(productComparisons[0]?.id ?? null);
  const [view, setView] = useState('bom');
  const [copyDone, setCopyDone] = useState(false);
  const [pngBusy, setPngBusy] = useState(false);
  const [pngError, setPngError] = useState('');

  const comparison = selectedId ? getProductComparisonById(selectedId) : null;

  const handleSelect = (id) => {
    setSelectedId(id);
    setView('bom');
    setCopyDone(false);
    setPngError('');
  };

  const handleCopy = async () => {
    if (!comparison) return;
    const text = buildProductComparisonCopyText(comparison, view);
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

  return (
    <div className="space-y-8">
      <ProductComparisonSelector selectedId={selectedId} onSelect={handleSelect} />

      {comparison && (
        <div key={comparison.id} className="space-y-6">
          <div id={CAPTURE_ROOT_ID} className="space-y-6">
            {isComparisonDraft(comparison) && <DraftBanner />}

            {/* Header card with title/description/audience and the actions row */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{comparison.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{comparison.description}</p>
                  <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">For: {comparison.audience}</p>
                </div>
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
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
                  {pngError && (
                    <p className="text-xs text-red-600 dark:text-red-400">{pngError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* View toggle + active table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex gap-1 px-4">
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
              </div>
              <div key={comparison.id} className="p-4 sm:p-6">
                {view === 'bom' ? <BomTable comparison={comparison} /> : <CapabilityTable comparison={comparison} />}
              </div>
            </div>
          </div>

          {/* Documentation links (outside the capture root) */}
          {comparison.docsLinks && comparison.docsLinks.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Resources</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {comparison.docsLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
