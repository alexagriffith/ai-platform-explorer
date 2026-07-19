import { ArrowRight, Users, GitCompare } from 'lucide-react';
import { getComparisonList } from '../data/deploymentComparisons';
import { interactive, border, typeScale } from '../lib/styleTokens';

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
    <div className="space-y-3">
      <div>
        <h2 className={`${typeScale.panelTitle} text-ink mb-1`}>
          Deployment Impact Explorer
        </h2>
        <p className={`${typeScale.body} text-muted`}>
          Understand the concrete implementation changes when adopting Red Hat AI platform components.
          Compare before and after states for YAML, resource trees, and capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {comparisons.map((comparison) => {
          const isSelected = selectedComparisonId === comparison.id;

          return (
            <button
              data-ui="card"
              key={comparison.id}
              onClick={() => onSelectComparison(comparison.id)}
              className={`
                text-center px-4 py-3 rounded-card border-2 ${interactive.transitionAll}
                ${interactive.focusRing}
                ${isSelected
                  ? 'border-accent bg-tint'
                  : `${border.edge} bg-surface hover:border-accent hover:bg-tint`
                }
              `}
            >
              <div className="flex flex-col items-center gap-1 mb-2">
                <h3 className={`${typeScale.subSectionTitle} text-ink`}>
                  {comparison.title}
                </h3>
              </div>

              <p className={`${typeScale.caption} text-muted mb-2`}>
                {comparison.description}
              </p>

              <div className={`flex items-center justify-center ${typeScale.caption} text-muted`}>
                <Users size={13} className="mr-1.5" />
                <span className="italic">For: {comparison.audience || 'Technical teams'}</span>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-hair">
                  <div className={`flex items-center justify-center text-link ${typeScale.navTab}`}>
                    <span>View Comparison</span>
                    <ArrowRight size={14} className="ml-1.5" />
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
