import { useState } from 'react';
import { Package, Scale, Network } from 'lucide-react';
import ProductComparisonView from './ProductComparisonView';
import ProductExplorer from './ProductExplorer';
import MCPEcosystemFull from './MCPEcosystemFull';
import { interactive, text } from '../lib/styleTokens';

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
 * ProductsHub — the Products tab.
 * Sub-views: Compare (opens by default, the demo closer) | Catalog | MCP Ecosystem.
 * Each sub-view renders its existing component unchanged; no data edits.
 */
export default function ProductsHub() {
  const [subView, setSubView] = useState('compare');

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
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 ${interactive.transition} ${interactive.focusRing} whitespace-nowrap ${
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
      {subView === 'compare' && <ProductComparisonView />}
      {subView === 'catalog' && <ProductExplorer />}
      {subView === 'mcp-ecosystem' && <MCPEcosystemFull />}
    </div>
  );
}
