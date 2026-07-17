import { useState } from 'react';
import { FileCode, Table, GitCompare, ChevronDown, ChevronRight, Zap } from 'lucide-react';
import DeploymentComparisonSelector from './DeploymentComparisonSelector';
import YAMLDiffView from './YAMLDiffView';
import CapabilityDeltaTable from './CapabilityDeltaTable';
import ResourceTreeView from './ResourceTreeView';
import QuickComparisonTable from './QuickComparisonTable';
import { getComparisonById } from '../data/deploymentComparisons';
import { interactive, text } from '../lib/styleTokens';
import { distributingGridCols } from '../lib/layout';

/**
 * DeploymentImpactView
 *
 * Main view for the Deployment Impact Explorer (V2 feature).
 * Orchestrates comparison selection and displays before/after analysis in tabs.
 */
export default function DeploymentImpactView() {
  const [selectedComparisonId, setSelectedComparisonId] = useState(null);
  const [activeTab, setActiveTab] = useState('yaml');
  const [migrationNotesExpanded, setMigrationNotesExpanded] = useState(false);

  const comparison = selectedComparisonId ? getComparisonById(selectedComparisonId) : null;

  // Reset active tab when comparison changes
  const handleSelectComparison = (id) => {
    setSelectedComparisonId(id);
    const newComparison = getComparisonById(id);
    setActiveTab(newComparison?.comparisonType === 'alternative' ? 'quick' : 'yaml');
  };

  // For alternative comparisons (not upgrades), show Quick Comparison tab first
  const tabs = comparison?.comparisonType === 'alternative'
    ? [
        { id: 'quick', name: 'Quick Comparison', icon: Zap },
        { id: 'yaml', name: 'YAML Diff', icon: FileCode },
        { id: 'resources', name: 'Resource Tree', icon: GitCompare },
        { id: 'capabilities', name: 'Capability Delta', icon: Table }
      ]
    : [
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
            <h3 className="text-base font-bold text-ink leading-tight mb-1">
              {comparison.title}
            </h3>
            <p className="text-sm text-muted">
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
                      className={`flex items-center gap-1.5 px-3 py-2 font-medium text-sm ${interactive.transition} ${interactive.focusRing} border-b-2 ${
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
              {activeTab === 'quick' && <QuickComparisonTable comparison={comparison} />}
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
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  {migrationNotesExpanded ? (
                    <ChevronDown size={16} className="text-faint" />
                  ) : (
                    <ChevronRight size={16} className="text-faint" />
                  )}
                  Migration Notes
                  <span className="ml-1 text-xs font-normal text-muted">
                    ({comparison.migrationNotes.length} tips)
                  </span>
                </h3>
              </button>
              {migrationNotesExpanded && (
                <div className="px-4 pb-4">
                  <ul className="space-y-2">
                    {comparison.migrationNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-tint border border-edge text-muted rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-ink leading-snug">
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
              <h3 data-ui="section-header" className={`text-sm font-bold ${text.ink} mb-2`}>
                Additional Resources
              </h3>
              <div className={`grid ${distributingGridCols(comparison.docsLinks.length)} gap-2`}>
                {comparison.docsLinks.map((link, idx) => (
                  <a
                    data-ui="control"
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 text-link underline-offset-2 hover:underline ${interactive.transition} ${interactive.focusRing} rounded-card`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm font-medium">
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
