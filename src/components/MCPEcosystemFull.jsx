import { useState } from 'react';
import { Database, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { typeScale, density, categoricalMark, categoricalDot, legendChip } from '../lib/styleTokens';
import { mcpServers, mcpEcosystemComponents } from '../data/mcpEcosystem';

/**
 * Category → categoricalMark key mapping.
 * Data keys: 'red-hat' → redHat, 'isv-partners' → partner, 'community' → openSource.
 */
const CATEGORY_MARK = {
  'red-hat': 'redHat',
  'isv-partners': 'partner',
  'community': 'openSource',
};

export default function MCPEcosystemFull() {
  const [expandedCategory, setExpandedCategory] = useState('red-hat');

  const components = mcpEcosystemComponents;

  return (
    <div className={density.stackGap}>
      {/* Header */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
          <div>
            <h2 className={`${typeScale.componentName} text-ink mb-0.5`}>
              The Model Context Protocol (MCP) Ecosystem on OpenShift AI
            </h2>
            <p className={`${typeScale.secondary} text-muted`}>
              A platform approach for discovering, deploying, securing, and governing MCP servers
            </p>
          </div>
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 ${typeScale.caption} text-link hover:text-accent transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page flex-shrink-0`}
          >
            <ExternalLink size={11} />
            <span>MCP specification (modelcontextprotocol.io)</span>
          </a>
        </div>
        <p className={`${typeScale.meta} text-muted`}>
          Technology Preview — verify availability with your Red Hat account team
        </p>
      </div>

      {/* Ingestion Pipeline + Core Components combined */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3 space-y-3">
        {/* Ingestion Pipeline — full-width header row above core components */}
        <div>
          <h3 className={`${typeScale.componentName} text-ink mb-2`}>Ingestion Pipeline</h3>
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            {['Validate', 'Scan', 'Sign', 'Certify', 'Publish'].map((stage, index) => (
              <div key={stage} className="flex items-center gap-1.5">
                <div className={`px-2 py-0.5 rounded-card bg-tint text-ink font-medium ${typeScale.caption}`}>
                  {stage}
                </div>
                {index < 4 && <span className={`text-muted ${typeScale.caption}`}>→</span>}
              </div>
            ))}
          </div>
          <p className={`${typeScale.meta} text-muted`}>
            The planned ingestion workflow validates, scans, and signs MCP servers before publication — confirm certification status in product documentation.
          </p>
        </div>

        {/* Core Components */}
        <div>
          <h3 className={`${typeScale.componentName} text-ink mb-2`}>Core Platform Components</h3>
            {/* Registry */}
            <div data-ui="card" className="rounded-card bg-tint px-3 py-1.5 flex items-center gap-2 mb-2">
              <Database className="text-green-600 flex-shrink-0" size={14} />
              <div className="flex-1 min-w-0">
                <h4 className={`${typeScale.secondary} font-bold text-ink`}>MCP Registry</h4>
                <p className={`${typeScale.meta} text-muted`}>System of Record • Governance Backbone — central repository for all MCP server metadata, certification status, and governance</p>
              </div>
            </div>
            <div className={`grid grid-cols-3 ${density.rowGap}`}>
              {components.map((component) => {
                const Icon = component.icon;
                return (
                  <div key={component.id} data-ui="card" className="rounded-card bg-tint px-2 py-1.5 text-center">
                    <div className="flex flex-col items-center gap-0.5 mb-0.5">
                      <Icon size={12} className="text-muted flex-shrink-0" />
                      <h4 className={`${typeScale.meta} font-bold text-ink`}>{component.name}</h4>
                    </div>
                    <p className={`${typeScale.meta} font-semibold text-muted mb-0.5`}>{component.role}</p>
                    <p className={`${typeScale.meta} text-muted`}>{component.description}</p>
                  </div>
                );
              })}
            </div>
            <p className={`${typeScale.meta} text-ink mt-1.5`}>
              <strong>Registry role:</strong> The registry supplies metadata to the catalog, lifecycle operator, and gateway so components share one source of truth.
            </p>
          </div>
      </div>

      {/* AI assets + Curated MCP Servers */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className={`${typeScale.componentName} text-ink`}>Curated MCP servers</h3>
          <p className={`${typeScale.meta} text-muted`}>
            AI assets, evaluation, and agents — enterprise users consume governed MCP tools through OpenShift AI. Partner catalog expands over time; certification status belongs in product documentation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-2">
          <span className={`${typeScale.groupLabel} text-faint`}>Category:</span>
          {[
            { key: 'redHat', label: 'Red Hat' },
            { key: 'partner', label: 'Technology Partners' },
            { key: 'openSource', label: 'Community' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={legendChip[key]}></span>
              <span className={`${typeScale.meta} text-ink`}>{label}</span>
            </div>
          ))}
        </div>

        <div className={density.stackGap}>
          {Object.entries(mcpServers).map(([key, category]) => {
            const isExpanded = expandedCategory === key;
            const markKey = CATEGORY_MARK[key];

            return (
              <div key={key}>
                <button
                  data-ui="section-header"
                  onClick={() => setExpandedCategory(isExpanded ? null : key)}
                  className={`w-full rounded-card bg-tint px-3 py-2 flex items-center justify-between hover:bg-page transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page ${categoricalMark[markKey]}`}
                >
                  <h4 className={`${typeScale.secondary} font-semibold text-ink`}>
                    {category.title} ({category.servers.length})
                  </h4>
                  {isExpanded ? (
                    <ChevronUp className="text-muted" size={14} />
                  ) : (
                    <ChevronDown className="text-muted" size={14} />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-3 divide-y divide-hair">
                    {category.servers.map((server, index) => (
                      <div key={index} className="py-1.5 flex items-start gap-2">
                        <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${categoricalDot[markKey] ?? categoricalDot.customer}`}></div>
                        <div className="flex-1">
                          <h5 className={`${typeScale.secondary} font-semibold text-ink`}>{server.name}</h5>
                          <p className={`${typeScale.meta} text-muted`}>{server.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
