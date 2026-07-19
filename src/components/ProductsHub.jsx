import { useState } from 'react';
import { Package, Scale, Network } from 'lucide-react';
import ProductComparisonView from './ProductComparisonView';
import ProductExplorer from './ProductExplorer';
import MCPEcosystemFull from './MCPEcosystemFull';
import { interactive, text, typeScale } from '../lib/styleTokens';

const SUB_VIEWS = [
  {
    id: 'compare',
    name: 'Compare',
    icon: Scale,
    description: 'Which Red Hat AI product do you need? Side-by-side bill of materials.',
  },
  {
    id: 'catalog',
    name: 'Catalog',
    icon: Package,
    description: 'Browse Red Hat AI portfolio components, maturity status, and documentation.',
  },
  {
    id: 'mcp-ecosystem',
    name: 'MCP Ecosystem',
    icon: Network,
    description: 'Model Context Protocol (MCP) components, servers, and provenance.',
  },
];

/**
 * Use-case index entries — verbatim names from the former Use Cases tab.
 * Each links to its new home via onNavigate (cross-tab) or setSubView (in-tab).
 */
const USE_CASE_INDEX = [
  {
    title: 'Model Inference & Serving',
    action: 'products-catalog',
  },
  {
    title: 'Model Training & Fine-tuning',
    action: 'architecture-blueprints',
  },
  {
    title: 'Full ML Lifecycle',
    action: 'products-catalog',
  },
  {
    title: 'Experimentation & POCs',
    action: 'products-catalog',
  },
  {
    title: 'Agentic AI & Orchestration',
    action: 'products-mcp',
  },
  {
    title: 'RAG (Retrieval-Augmented Generation)',
    action: 'architecture-blueprints',
  },
  {
    title: 'LLM Security & Vulnerability Testing',
    action: 'decisions-security',
  },
  {
    title: 'Disaggregated LLM Serving (Prefill/Decode Split)',
    action: 'products-catalog',
  },
  {
    title: 'High-Volume Batch Inference',
    action: 'products-catalog',
  },
];

/**
 * ProductsHub — the Products tab.
 * Sub-views: Compare (opens by default, the demo closer) | Catalog | MCP Ecosystem.
 * Each sub-view renders its existing component unchanged; no data edits.
 *
 * onNavigate({ tab, architectureMode?, decisionGuide? }) — cross-tab deep-link callback.
 */
export default function ProductsHub({ onNavigate }) {
  const [subView, setSubView] = useState('compare');

  const handleUseCaseLink = (action) => {
    switch (action) {
      case 'products-catalog':
        setSubView('catalog');
        break;
      case 'products-mcp':
        setSubView('mcp-ecosystem');
        break;
      case 'architecture-blueprints':
        if (onNavigate) onNavigate({ tab: 'architecture', architectureMode: 'blueprints' });
        break;
      case 'decisions-security':
        if (onNavigate) onNavigate({ tab: 'decisions', decisionGuide: 'security' });
        break;
      default:
        break;
    }
  };

  return (
    <div data-tab="products" className="space-y-3">
      {/* Sub-view selector */}
      <nav
        aria-label="Products sub-views"
        className="flex gap-0.5 border-b border-hair"
      >
        {SUB_VIEWS.map((sv) => {
          const Icon = sv.icon;
          const active = subView === sv.id;
          return (
            <button
              key={sv.id}
              data-ui="control"
              onClick={() => setSubView(sv.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 ${typeScale.navTab} border-b-2 ${interactive.transition} ${interactive.focusRing} whitespace-nowrap ${
                active
                  ? 'border-accent text-link'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" aria-hidden="true" />
              <span className={`hidden sm:inline ${text.ink}`}>{sv.name}</span>
              <span className="sm:hidden">{sv.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Active sub-view */}
      {subView === 'compare' && <div data-view="compare"><ProductComparisonView /></div>}
      {subView === 'catalog' && (
        <>
          {/* Browse by use case — catalog-only index; Compare opens unobstructed */}
          <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className={`${typeScale.subSectionTitle} ${text.ink}`}>Browse by use case</h3>
              <span className={`${typeScale.caption} ${text.muted}`}>Each use case links to its guide in this app</span>
            </div>
            <div className="flex flex-wrap items-center gap-y-1">
              {USE_CASE_INDEX.map((uc, idx) => (
                <span key={uc.title} className="inline-flex items-center">
                  {idx > 0 && (
                    <span className={`mx-2 select-none ${text.faint}`} aria-hidden="true">·</span>
                  )}
                  <button
                    data-ui="control"
                    onClick={() => handleUseCaseLink(uc.action)}
                    className={`${typeScale.caption} ${text.muted} hover:text-link hover:underline underline-offset-2 ${interactive.transition} ${interactive.focusRing} rounded-sm`}
                  >
                    {uc.title}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <ProductExplorer />
        </>
      )}
      {subView === 'mcp-ecosystem' && <MCPEcosystemFull />}
    </div>
  );
}
