import { ArrowRight, Users, GitCompare } from 'lucide-react';
import { getComparisonList } from '../data/deploymentComparisons';
import { interactive, border } from '../lib/styleTokens';

/**
 * DeploymentComparisonSelector
 *
 * Allows users to select a deployment comparison to view (e.g., vLLM → KServe).
 * Displays available comparisons as cards with title, description, and audience.
 */
export default function DeploymentComparisonSelector({ selectedComparisonId, onSelectComparison }) {
  const comparisons = getComparisonList();

  if (comparisons.length === 0) {
    return (
      <div className="text-center py-12">
        <GitCompare className="mx-auto text-faint mb-4" size={48} />
        <p className="text-muted">No deployment comparisons available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink mb-2">
          Deployment Impact Explorer
        </h2>
        <p className="text-muted">
          Understand the concrete implementation changes when adopting Red Hat AI platform components.
          Compare before and after states for YAML, resource trees, and capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {comparisons.map((comparison) => {
          const isSelected = selectedComparisonId === comparison.id;

          return (
            <button
              key={comparison.id}
              onClick={() => onSelectComparison(comparison.id)}
              className={`
                text-left p-6 rounded-card border-2 ${interactive.transitionAll}
                ${interactive.focusRing}
                ${isSelected
                  ? 'border-accent bg-tint'
                  : `${border.edge} bg-surface hover:border-accent hover:bg-tint`
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-ink pr-4">
                  {comparison.title}
                </h3>
                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-on-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-muted mb-4 leading-relaxed">
                {comparison.description}
              </p>

              <div className="flex items-center text-sm text-muted">
                <Users size={16} className="mr-2" />
                <span className="italic">For: {comparison.audience || 'Technical teams'}</span>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-hair">
                  <div className="flex items-center text-link font-medium">
                    <span>View Comparison</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
