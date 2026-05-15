import { ArrowRight, Users, GitCompare } from 'lucide-react';
import { getComparisonList } from '../data/deploymentComparisons';

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
        <GitCompare className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
        <p className="text-gray-600 dark:text-gray-400">No deployment comparisons available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Deployment Impact Explorer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Understand the concrete implementation changes when adopting Red Hat AI platform components.
          Compare before and after states for YAML, resource trees, capabilities, and operational responsibilities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {comparisons.map((comparison) => {
          const isSelected = selectedComparisonId === comparison.id;

          return (
            <button
              key={comparison.id}
              onClick={() => onSelectComparison(comparison.id)}
              className={`
                text-left p-6 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {comparison.title}
                </h3>
                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {comparison.description}
              </p>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users size={16} className="mr-2" />
                <span className="italic">For: {comparison.audience || 'Technical teams'}</span>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span>View Comparison</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {comparisons.length === 1 && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>V2.0 MVP:</strong> We're starting with the most common technical question (vLLM → KServe).
            Future comparisons will include: No Gateway → AI Gateway, Standalone K8s → RHOAI, and more.
          </p>
        </div>
      )}
    </div>
  );
}
