import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { interactive, button, typeScale } from '../lib/styleTokens';

/**
 * YAMLDiffView
 *
 * Shows side-by-side YAML comparison for deployment resources.
 * Displays what the user submits before (e.g., Deployment) vs after (e.g., InferenceService).
 *
 * Column accent dots: neutral/muted — status diff (add/remove) uses green/amber tokens only.
 */
export default function YAMLDiffView({ comparison }) {
  if (!comparison) {
    return (
      <div className="text-center py-8 text-muted">
        Select a comparison to view YAML diff
      </div>
    );
  }

  const { before, after } = comparison;
  const isAlternative = comparison.comparisonType === 'alternative';

  // Dot colors: muted-neutral for alternative (no status meaning); amber=before, green=after for upgrade diff
  const leftConfig = isAlternative
    ? { label: before.label, dotClass: 'bg-muted', prefix: '', state: 'option-a' }
    : { label: before.label, dotClass: 'bg-amber-500', prefix: 'Before: ', state: 'before' };

  const rightConfig = isAlternative
    ? { label: after.label, dotClass: 'bg-accent', prefix: '', state: 'option-b' }
    : { label: after.label, dotClass: 'bg-green-600', prefix: 'After: ', state: 'after' };

  return (
    <div className="space-y-3">
      <div>
        <h3 className={`${typeScale.panelTitle} text-ink mb-1`}>
          {isAlternative ? 'What You Submit: Side-by-Side' : 'What You Submit: Before vs After'}
        </h3>
        <p className={`${typeScale.body} text-muted`}>
          {isAlternative
            ? 'Compare the YAML specifications for each platform approach.'
            : 'See how the YAML you write changes when adopting this platform component.'}
        </p>
        {!isAlternative && (
          <div className="flex items-center gap-4 mt-1.5" aria-label="Color legend">
            <span className={`flex items-center gap-1.5 ${typeScale.caption} text-muted`}>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
              Before (existing)
            </span>
            <span className={`flex items-center gap-1.5 ${typeScale.caption} text-muted`}>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600 flex-shrink-0" aria-hidden="true" />
              After (with platform)
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left State */}
        <div className="space-y-2">
          <div className="sticky top-0 bg-surface py-2 border-b border-hair">
            <h4 className={`${typeScale.subSectionTitle} text-ink flex items-center`}>
              <span className={`inline-block w-2.5 h-2.5 ${leftConfig.dotClass} rounded-full mr-2`}></span>
              {leftConfig.prefix}{leftConfig.label}
            </h4>
          </div>

          {before.submittedResources.map((resource) => (
            <YAMLResource key={resource.name} resource={resource} state={leftConfig.state} />
          ))}
        </div>

        {/* Right State */}
        <div className="space-y-2">
          <div className="sticky top-0 bg-surface py-2 border-b border-hair">
            <h4 className={`${typeScale.subSectionTitle} text-ink flex items-center`}>
              <span className={`inline-block w-2.5 h-2.5 ${rightConfig.dotClass} rounded-full mr-2`}></span>
              {rightConfig.prefix}{rightConfig.label}
            </h4>
          </div>

          {after.submittedResources.map((resource) => (
            <YAMLResource key={resource.name} resource={resource} state={rightConfig.state} />
          ))}
        </div>
      </div>

    </div>
  );
}

/**
 * YAMLResource - Individual YAML snippet with copy button
 *
 * Border accent carries diff-status meaning only:
 *   before  → amber (attention/warning token)
 *   after   → green (success token)
 *   option-a/b → neutral edge
 */
function YAMLResource({ resource, state }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resource.yamlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 2000);
    }
  };

  // Status-semantic left-accent: amber = before/warning, green = after/success, neutral = option
  const stateColorMap = {
    'before': 'border-l-amber-400 dark:border-l-amber-600',
    'after': 'border-l-green-500 dark:border-l-green-600',
    'option-a': 'border-l-edge',
    'option-b': 'border-l-accent'
  };
  const stateColor = stateColorMap[state] || stateColorMap['before'];

  return (
    <div data-ui="card" data-ui-exempt="yaml-diff-card" className={`border border-edge border-l-4 ${stateColor} rounded-card overflow-hidden bg-surface`}>
      {/* Header - clickable to expand/collapse */}
      <div
        data-ui="section-header"
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        className={`w-full px-3 py-2 bg-tint border-b border-hair hover:bg-page ${interactive.transition} ${interactive.focusRing} text-left cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-1">
            {isExpanded ? (
              <ChevronDown size={14} className="text-faint flex-shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-faint flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className={`${typeScale.monoBody} text-ink`}>
                  {resource.kind}
                </span>
                <span className={`${typeScale.caption} text-muted`}>
                  {resource.apiVersion}
                </span>
              </div>
              <p className={`${typeScale.caption} text-muted`}>
                {resource.description}
              </p>
            </div>
          </div>

          <button
            data-ui="control"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={`${button.secondary} flex-shrink-0`}
            title="Copy YAML"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span>Copied!</span>
              </>
            ) : copyFailed ? (
              <>
                <Copy size={14} className="text-accent" />
                <span>Copy failed</span>
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

      {/* YAML Content - collapsible */}
      {isExpanded && (
        <div className="overflow-x-auto border-t border-hair max-h-96 overflow-y-auto">
          <pre className={`p-4 ${typeScale.monoCode} text-ink bg-page`}>
            <code>{resource.yamlSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
