import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * YAMLDiffView
 *
 * Shows side-by-side YAML comparison for deployment resources.
 * Displays what the user submits before (e.g., Deployment) vs after (e.g., InferenceService).
 */
export default function YAMLDiffView({ comparison }) {
  if (!comparison) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Select a comparison to view YAML diff
      </div>
    );
  }

  const { before, after } = comparison;
  const isAlternative = comparison.comparisonType === 'alternative';

  // Configure labels and colors based on comparison type
  const leftConfig = isAlternative
    ? { label: before.label, color: 'bg-blue-500', prefix: '', state: 'option-a' }
    : { label: before.label, color: 'bg-orange-500', prefix: 'Before: ', state: 'before' };

  const rightConfig = isAlternative
    ? { label: after.label, color: 'bg-purple-500', prefix: '', state: 'option-b' }
    : { label: after.label, color: 'bg-green-500', prefix: 'After: ', state: 'after' };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {isAlternative ? 'What You Submit: Side-by-Side' : 'What You Submit: Before vs After'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {isAlternative
            ? 'Compare the YAML specifications for each platform approach.'
            : 'See how the YAML you write changes when adopting this platform component.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left State */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className={`inline-block w-3 h-3 ${leftConfig.color} rounded-full mr-2`}></span>
              {leftConfig.prefix}{leftConfig.label}
            </h4>
          </div>

          {before.submittedResources.map((resource, idx) => (
            <YAMLResource key={idx} resource={resource} state={leftConfig.state} />
          ))}
        </div>

        {/* Right State */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className={`inline-block w-3 h-3 ${rightConfig.color} rounded-full mr-2`}></span>
              {rightConfig.prefix}{rightConfig.label}
            </h4>
          </div>

          {after.submittedResources.map((resource, idx) => (
            <YAMLResource key={idx} resource={resource} state={rightConfig.state} />
          ))}
        </div>
      </div>

    </div>
  );
}

/**
 * YAMLResource - Individual YAML snippet with copy button
 */
function YAMLResource({ resource, state }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resource.yamlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const stateColorMap = {
    'before': 'border-orange-300 dark:border-orange-700',
    'after': 'border-green-300 dark:border-green-700',
    'option-a': 'border-blue-300 dark:border-blue-700',
    'option-b': 'border-purple-300 dark:border-purple-700'
  };
  const stateColor = stateColorMap[state] || stateColorMap['before'];

  return (
    <div className={`border-2 ${stateColor} rounded-lg overflow-hidden bg-white dark:bg-gray-800`}>
      {/* Header - clickable to expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {resource.kind}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {resource.apiVersion}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {resource.description}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title="Copy YAML"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </button>

      {/* YAML Content - collapsible */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <pre className="p-4 text-xs font-mono leading-relaxed text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
            <code>{resource.yamlSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
