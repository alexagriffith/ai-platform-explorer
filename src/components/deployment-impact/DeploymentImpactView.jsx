import { useState } from 'react';
import { FileCode, Table, GitCompare, ChevronDown, ChevronRight } from 'lucide-react';
import DeploymentComparisonSelector from './DeploymentComparisonSelector';
import YAMLDiffView from './YAMLDiffView';
import CapabilityDeltaTable from './CapabilityDeltaTable';
import ResourceTreeView from './ResourceTreeView';
import { getComparisonById } from '../../data/deploymentComparisons';
import { interactive, text, typeScale } from '../../lib/styleTokens';

/**
 * DeploymentImpactView
 *
 * Main view for the Deployment Impact Explorer (V2 feature).
 * Orchestrates comparison selection and displays before/after analysis in tabs.
 *
 * Note: the former llm-d vs Dynamo "alternative" Quick Comparison surface was
 * removed — do not reintroduce competitor head-to-head content without an
 * explicit product decision.
 */
export default function DeploymentImpactView() {
  const [selectedComparisonId, setSelectedComparisonId] = useState(null);
  const [activeTab, setActiveTab] = useState('yaml');
  const [migrationNotesExpanded, setMigrationNotesExpanded] = useState(false);

  const comparison = selectedComparisonId ? getComparisonById(selectedComparisonId) : null;

  const handleSelectComparison = (id) => {
    setSelectedComparisonId(id);
    setActiveTab('yaml');
  };

  const tabs = [
    { id: 'yaml', name: 'YAML Diff', icon: FileCode },
    { id: 'resources', name: 'Resource Tree', icon: GitCompare },
    { id: 'capabilities', name: 'Capability Delta', icon: Table }
  ];

  return (
    <div data-tab="deployment-impact" className="space-y-4">
      <DeploymentComparisonSelector
        selectedComparisonId={selectedComparisonId}
        onSelectComparison={handleSelectComparison}
      />

      {comparison && (
        <div key={comparison.id} className="space-y-3">
          {/* Comparison Header */}
          <div data-ui="card" className="rounded-card border border-edge bg-surface px-4 py-3">
            <h3 className={`${typeScale.panelTitle} text-ink mb-1`}>
              {comparison.title}
            </h3>
            <p className={`${typeScale.body} text-muted`}>
              {comparison.description}
            </p>
          </div>

          {/* View Tabs */}
          <div data-ui="card" className="rounded-card border border-edge bg-surface">
            <div className="border-b border-hair">
              <nav className="flex px-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      data-ui="control"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 ${typeScale.navTab} ${interactive.transition} ${interactive.focusRing} border-b-2 ${
                        activeTab === tab.id
                          ? 'border-accent text-link'
                          : 'border-transparent text-muted hover:text-ink'
                      }`}
                    >
                      <Icon size={15} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4">
              {activeTab === 'yaml' && <YAMLDiffView comparison={comparison} />}
              {activeTab === 'resources' && <ResourceTreeView comparison={comparison} />}
              {activeTab === 'capabilities' && <CapabilityDeltaTable comparison={comparison} />}
            </div>
          </div>

          {/* Migration Notes */}
          {comparison.migrationNotes && comparison.migrationNotes.length > 0 && (
            <div data-ui="card" className="rounded-card border border-edge bg-surface">
              <button
                data-ui="section-header"
                onClick={() => setMigrationNotesExpanded(!migrationNotesExpanded)}
                aria-expanded={migrationNotesExpanded}
                className={`w-full px-4 py-2 flex items-center justify-between ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
              >
                <h3 className={`${typeScale.subPanelTitle} text-ink flex items-center gap-2`}>
                  {migrationNotesExpanded ? (
                    <ChevronDown size={16} className="text-faint" />
                  ) : (
                    <ChevronRight size={16} className="text-faint" />
                  )}
                  Migration Notes
                  <span className={`ml-1 ${typeScale.caption} font-normal text-muted`}>
                    ({comparison.migrationNotes.length} tips)
                  </span>
                </h3>
              </button>
              {migrationNotesExpanded && (
                <div className="px-4 pb-4">
                  <ul className="space-y-2">
                    {comparison.migrationNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`flex-shrink-0 w-5 h-5 bg-tint border border-edge text-muted rounded-full flex items-center justify-center ${typeScale.label} font-semibold mt-0.5`}>
                          {idx + 1}
                        </span>
                        <span className={`${typeScale.body} text-ink`}>
                          {note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Documentation Links */}
          {comparison.docsLinks && comparison.docsLinks.length > 0 && (
            <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
              <h3 data-ui="section-header" className={`${typeScale.subPanelTitle} ${text.ink} mb-2`}>
                Additional Resources
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {comparison.docsLinks.map((link, idx) => (
                  <a
                    data-ui="control"
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-none flex items-center gap-2 px-3 py-2 text-link underline-offset-2 hover:underline ${interactive.transition} ${interactive.focusRing} rounded-card`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className={typeScale.bodyStrong}>
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
