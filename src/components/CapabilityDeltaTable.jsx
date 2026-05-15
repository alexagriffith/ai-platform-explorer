import { TrendingUp, AlertTriangle, Minus } from 'lucide-react';

/**
 * CapabilityDeltaTable
 *
 * Shows a comparison table of capabilities before and after adopting a platform component.
 * Highlights positive gains, tradeoffs, and neutral changes.
 */
export default function CapabilityDeltaTable({ comparison }) {
  if (!comparison || !comparison.capabilityDelta) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Select a comparison to view capability changes
      </div>
    );
  }

  const { capabilityDelta } = comparison;

  const impactCounts = {
    positive: capabilityDelta.filter(d => d.impact === 'positive').length,
    tradeoff: capabilityDelta.filter(d => d.impact === 'tradeoff').length,
    neutral: capabilityDelta.filter(d => d.impact === 'neutral').length
  };

  const isAlternativeComparison = comparison.comparisonType === 'alternative';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {isAlternativeComparison ? 'Feature Comparison' : 'Capability Changes'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {isAlternativeComparison
            ? 'How do these two technologies compare across key capabilities and operational characteristics?'
            : 'What features and operational characteristics change when you adopt this platform component?'
          }
        </p>
      </div>

      {/* Impact Summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-gray-700 dark:text-gray-300">
            <strong className="text-green-700 dark:text-green-300">{impactCounts.positive}</strong> {isAlternativeComparison ? 'Advantages' : 'Improvements'}
          </span>
        </div>

        {impactCounts.tradeoff > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong className="text-yellow-700 dark:text-yellow-300">{impactCounts.tradeoff}</strong> Tradeoffs
            </span>
          </div>
        )}

        {impactCounts.neutral > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            <Minus size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{impactCounts.neutral}</strong> Neutral
            </span>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[140px]">
                  Capability
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                  {isAlternativeComparison ? comparison.before.label : 'Before'}
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                  {isAlternativeComparison ? comparison.after.label : 'After'}
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[100px]">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {capabilityDelta.map((delta, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {delta.capability}
                      </div>
                      {delta.notes && (
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {delta.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {delta.beforeState}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {delta.afterState}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <ImpactBadge impact={delta.impact} isAlternativeComparison={isAlternativeComparison} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Understanding Impact</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium text-green-600 dark:text-green-400">Positive:</span> {isAlternativeComparison
              ? `Advantage of ${comparison.after.label}`
              : 'Clear improvement or new capability'
            }
          </div>
          <div>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">Tradeoff:</span> {isAlternativeComparison
              ? 'Different strengths and weaknesses between options'
              : 'Gain something, but accept added complexity or constraint'
            }
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Neutral:</span> {isAlternativeComparison
              ? 'Similar capabilities between options'
              : 'Different approach, similar outcome'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ImpactBadge - Visual indicator for capability impact
 */
function ImpactBadge({ impact, isAlternativeComparison }) {
  const badgeConfig = {
    positive: {
      icon: TrendingUp,
      label: isAlternativeComparison ? 'Advantage' : 'Improvement',
      className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
    },
    tradeoff: {
      icon: AlertTriangle,
      label: 'Tradeoff',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
    },
    neutral: {
      icon: Minus,
      label: 'Neutral',
      className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    }
  };

  const config = badgeConfig[impact] || badgeConfig.neutral;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full ${config.className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}
