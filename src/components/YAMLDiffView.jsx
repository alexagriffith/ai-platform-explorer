import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          What You Submit: Before vs After
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          See how the YAML you write changes when adopting this platform component.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before State */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Before: {before.label}
            </h4>
          </div>

          {before.submittedResources.map((resource, idx) => (
            <YAMLResource key={idx} resource={resource} state="before" />
          ))}
        </div>

        {/* After State */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              After: {after.label}
            </h4>
          </div>

          {after.submittedResources.map((resource, idx) => (
            <YAMLResource key={idx} resource={resource} state="after" />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Key takeaway:</strong> You submit{' '}
          <strong className="text-orange-600 dark:text-orange-400">{before.submittedResources.length} resource{before.submittedResources.length !== 1 ? 's' : ''}</strong>{' '}
          before, and{' '}
          <strong className="text-green-600 dark:text-green-400">{after.submittedResources.length} resource{after.submittedResources.length !== 1 ? 's' : ''}</strong>{' '}
          after. The platform handles the rest.
        </p>
      </div>
    </div>
  );
}

/**
 * YAMLResource - Individual YAML snippet with copy button
 */
function YAMLResource({ resource, state }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resource.yamlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const stateColor = state === 'before'
    ? 'border-orange-300 dark:border-orange-700'
    : 'border-green-300 dark:border-green-700';

  return (
    <div className={`border-2 ${stateColor} rounded-lg overflow-hidden bg-white dark:bg-gray-800`}>
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
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

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
      </div>

      {/* YAML Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-xs font-mono leading-relaxed text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
          <code>{resource.yamlSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
