import { useState } from 'react';
import { FileCode, Table, GitCompare } from 'lucide-react';
import DeploymentComparisonSelector from './DeploymentComparisonSelector';
import YAMLDiffView from './YAMLDiffView';
import CapabilityDeltaTable from './CapabilityDeltaTable';
import ResourceTreeView from './ResourceTreeView';
import { getComparisonById } from '../data/deploymentComparisons';

/**
 * DeploymentImpactView
 *
 * Main view for the Deployment Impact Explorer (V2 feature).
 * Orchestrates comparison selection and displays before/after analysis in tabs.
 */
export default function DeploymentImpactView() {
  const [selectedComparisonId, setSelectedComparisonId] = useState(null);
  const [activeTab, setActiveTab] = useState('yaml');

  const comparison = selectedComparisonId ? getComparisonById(selectedComparisonId) : null;

  const tabs = [
    { id: 'yaml', name: 'YAML Diff', icon: FileCode },
    { id: 'resources', name: 'Resource Tree', icon: GitCompare },
    { id: 'capabilities', name: 'Capability Delta', icon: Table }
  ];

  return (
    <div className="space-y-8">
      {/* Comparison Selector */}
      <DeploymentComparisonSelector
        selectedComparisonId={selectedComparisonId}
        onSelectComparison={setSelectedComparisonId}
      />

      {/* Comparison Content */}
      {comparison && (
        <div className="space-y-6">
          {/* Comparison Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {comparison.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {comparison.description}
            </p>
          </div>

          {/* View Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-1 px-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                        activeTab === tab.id
                          ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'yaml' && <YAMLDiffView comparison={comparison} />}
              {activeTab === 'resources' && <ResourceTreeView comparison={comparison} />}
              {activeTab === 'capabilities' && <CapabilityDeltaTable comparison={comparison} />}
            </div>
          </div>

          {/* Migration Notes */}
          {comparison.migrationNotes && comparison.migrationNotes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Migration Notes
              </h3>
              <ul className="space-y-2">
                {comparison.migrationNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documentation Links */}
          {comparison.docsLinks && comparison.docsLinks.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Additional Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {comparison.docsLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
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
