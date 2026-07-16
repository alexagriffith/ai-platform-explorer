import { TrendingUp, AlertTriangle, Minus } from 'lucide-react';

/**
 * CapabilityDeltaTable
 *
 * Shows a comparison table of capabilities before and after adopting a platform component.
 * Highlights positive gains, tradeoffs, and neutral changes.
 *
 * Impact colors are STATUS-semantic: green=positive/success, amber=tradeoff/warning, neutral=neutral.
 */
export default function CapabilityDeltaTable({ comparison }) {
  if (!comparison || !comparison.capabilityDelta) {
    return (
      <div className="text-center py-8 text-muted">
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
        <h3 className="text-xl font-bold text-ink mb-2">
          {isAlternativeComparison ? 'Feature Comparison' : 'Capability Changes'}
        </h3>
        <p className="text-muted">
          {isAlternativeComparison
            ? 'How do these two technologies compare across key capabilities and operational characteristics?'
            : 'What features and operational characteristics change when you adopt this platform component?'
          }
        </p>
      </div>

      {/* Impact Summary — status-semantic badge colors */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-card">
          <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-ink">
            <strong className="text-green-700 dark:text-green-300">{impactCounts.positive}</strong> {isAlternativeComparison ? 'Advantages' : 'Improvements'}
          </span>
        </div>

        {impactCounts.tradeoff > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-card">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-ink">
              <strong className="text-amber-700 dark:text-amber-300">{impactCounts.tradeoff}</strong> Tradeoffs
            </span>
          </div>
        )}

        {impactCounts.neutral > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-tint border border-hair rounded-card">
            <Minus size={16} className="text-muted" />
            <span className="text-ink">
              <strong>{impactCounts.neutral}</strong> Neutral
            </span>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-edge rounded-card -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-tint">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider min-w-[140px]">
                  Capability
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider min-w-[120px]">
                  {isAlternativeComparison ? comparison.before.label : 'Before'}
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider min-w-[120px]">
                  {isAlternativeComparison ? comparison.after.label : 'After'}
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider min-w-[100px]">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-hair">
              {capabilityDelta.map((delta, idx) => (
                <tr key={idx} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div>
                      <div className="font-medium text-sm text-ink">
                        {delta.capability}
                      </div>
                      {delta.notes && (
                        <div className="text-xs sm:text-sm text-muted mt-1">
                          {delta.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-ink">
                    {delta.beforeState}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-ink font-medium">
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
      <div className="p-4 bg-tint border border-hair rounded-card">
        <h4 className="text-sm font-semibold text-ink mb-2">Understanding Impact</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted">
          <div>
            <span className="font-medium text-green-600 dark:text-green-400">Positive:</span> {isAlternativeComparison
              ? `Advantage of ${comparison.after.label}`
              : 'Clear improvement or new capability'
            }
          </div>
          <div>
            <span className="font-medium text-amber-600 dark:text-amber-400">Tradeoff:</span> {isAlternativeComparison
              ? 'Different strengths and weaknesses between options'
              : 'Gain something, but accept added complexity or constraint'
            }
          </div>
          <div>
            <span className="font-medium text-muted">Neutral:</span> {isAlternativeComparison
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
 * ImpactBadge - Visual indicator for capability impact.
 * Colors are STATUS-semantic only (green=success, amber=warning, neutral=neutral).
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
      className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
    },
    neutral: {
      icon: Minus,
      label: 'Neutral',
      className: 'bg-tint text-muted border-edge dark:bg-tint dark:text-muted dark:border-edge'
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
