import { ChevronRight, ChevronDown, Server, Workflow, X, ExternalLink, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getResourceDefinition } from '../data/resourceDefinitions';
import { interactive, modal, button } from '../lib/styleTokens';

/**
 * ResourceTreeView
 *
 * Shows Kubernetes resource hierarchy before and after adopting a platform component.
 * Displays parent-child relationships (e.g., Deployment → ReplicaSet → Pod).
 * Click on any resource kind to see detailed information in a side panel.
 *
 * Plane colors: workload-management=accent-tinted (primary identity), runtime=neutral-tinted.
 * NEW/REMOVED diff badges use green/amber status tokens.
 */
export default function ResourceTreeView({ comparison }) {
  const [selectedResourceKind, setSelectedResourceKind] = useState(null);

  if (!comparison) {
    return (
      <div className="text-center py-8 text-muted">
        Select a comparison to view resource tree
      </div>
    );
  }

  const { before, after } = comparison;

  // Build sets of resource kinds for diffing
  const getResourceKinds = (resources) => {
    const kinds = new Set();
    const traverse = (node) => {
      kinds.add(node.kind);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    resources.forEach(traverse);
    return kinds;
  };

  const beforeKinds = getResourceKinds(before.clusterResources);
  const afterKinds = getResourceKinds(after.clusterResources);

  const isAlternative = comparison.comparisonType === 'alternative';

  const leftConfig = isAlternative
    ? { label: before.label, dotClass: 'bg-muted', prefix: '' }
    : { label: before.label, dotClass: 'bg-amber-500', prefix: 'Before: ' };

  const rightConfig = isAlternative
    ? { label: after.label, dotClass: 'bg-accent', prefix: '' }
    : { label: after.label, dotClass: 'bg-green-600', prefix: 'After: ' };

  return (
    <div className="space-y-3 relative">
      <div>
        <h3 className="text-base font-bold text-ink mb-1">
          Kubernetes Resource Tree
        </h3>
        <p className="text-sm text-muted">
          {isAlternative
            ? 'Compare what Kubernetes resources each platform creates from similar user inputs.'
            : 'See how the resource structure changes when adopting this platform component.'}
          {' '}
          <span className="inline-flex items-center gap-1 text-xs text-link">
            <Info size={13} />
            Click any resource type to learn more
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left State */}
        <div>
          <div className="mb-2 pb-1.5 border-b border-hair">
            <h4 className="text-sm font-semibold text-ink flex items-center">
              <span className={`inline-block w-2.5 h-2.5 ${leftConfig.dotClass} rounded-full mr-2`}></span>
              {leftConfig.prefix}{leftConfig.label}
            </h4>
          </div>

          <div className="space-y-1">
            {before.clusterResources.map((resource, idx) => (
              <ResourceTreeNode
                key={idx}
                node={resource}
                onSelectKind={setSelectedResourceKind}
                selectedKind={selectedResourceKind}
                diffStatus="before"
                otherKinds={afterKinds}
                isAlternative={isAlternative}
              />
            ))}
          </div>
        </div>

        {/* Right State */}
        <div>
          <div className="mb-2 pb-1.5 border-b border-hair">
            <h4 className="text-sm font-semibold text-ink flex items-center">
              <span className={`inline-block w-2.5 h-2.5 ${rightConfig.dotClass} rounded-full mr-2`}></span>
              {rightConfig.prefix}{rightConfig.label}
            </h4>
          </div>

          <div className="space-y-1">
            {after.clusterResources.map((resource, idx) => (
              <ResourceTreeNode
                key={idx}
                node={resource}
                onSelectKind={setSelectedResourceKind}
                selectedKind={selectedResourceKind}
                diffStatus="after"
                otherKinds={beforeKinds}
                isAlternative={isAlternative}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-3 py-2 bg-tint border border-hair rounded-card">
        <h4 className="text-xs font-semibold text-ink mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Workflow size={16} className="text-link" />
              <span className="text-ink">
                <strong>Workload management:</strong> define and manage what runs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Server size={16} className="text-muted" />
              <span className="text-ink">
                <strong>Runtime resources:</strong> what actually runs and serves traffic
              </span>
            </div>
          </div>
          {!isAlternative && (
            <div className="flex items-center gap-3 text-xs pt-1.5 border-t border-hair">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-card">
                  NEW
                </span>
                <span className="text-ink">Added by platform</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-card">
                  REMOVED
                </span>
                <span className="text-ink">No longer needed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resource Detail Side Panel */}
      {selectedResourceKind && (
        <ResourceDetailPanel
          resourceKind={selectedResourceKind}
          onClose={() => setSelectedResourceKind(null)}
        />
      )}
    </div>
  );
}

/**
 * ResourceTreeNode - Individual node in the tree with expand/collapse and clickable resource kind
 */
function ResourceTreeNode({ node, depth = 0, onSelectKind, selectedKind, diffStatus, otherKinds, isAlternative }) {
  const [isExpanded, setIsExpanded] = useState(depth <= 1);
  const hasChildren = node.children && node.children.length > 0;

  // Workload-management resources (Deployment, ReplicaSet) = accent-tinted; runtime resources (Pod) = page-tinted
  const planeConfig = {
    control: { icon: Workflow, iconClass: 'text-link', bgClass: 'bg-tint' },
    data:    { icon: Server,   iconClass: 'text-muted', bgClass: 'bg-page' }
  };

  const config = planeConfig[node.plane] || planeConfig.control;
  const PlaneIcon = config.icon;
  const isSelected = selectedKind === node.kind;

  // Status diff badges — green = new/added, amber = removed (not red; removed ≠ error)
  let badge = null;
  if (!isAlternative) {
    if (diffStatus === 'after' && !otherKinds.has(node.kind)) {
      badge = { text: 'NEW', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    } else if (diffStatus === 'before' && !otherKinds.has(node.kind)) {
      badge = { text: 'REMOVED', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' };
    }
  }

  return (
    <div>
      {/* Node row — paddingLeft is a dynamic structural indent, not a color */}
      <div
        className={`flex items-center gap-2 py-1.5 px-3 rounded-card ${interactive.transition} ${config.bgClass} ${
          isSelected ? 'ring-2 ring-accent' : ''
        }`}
        style={{ paddingLeft: `${depth * 20 + 10}px` }}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? `Collapse ${node.kind}` : `Expand ${node.kind}`}
            aria-expanded={isExpanded}
            className={`flex-shrink-0 p-0.5 hover:bg-surface rounded-card border border-transparent hover:border-hair ${interactive.transition}`}
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-muted" />
            ) : (
              <ChevronRight size={16} className="text-muted" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Plane icon */}
        <PlaneIcon size={16} className={config.iconClass} />

        {/* Resource kind (clickable) and name */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => onSelectKind(node.kind)}
            className={`font-mono text-sm font-semibold text-ink hover:text-link underline decoration-dotted underline-offset-2 cursor-pointer ${interactive.transition}`}
          >
            {node.kind}
          </button>
          <span className="text-xs text-muted font-mono">
            {node.name}
          </span>
          {badge && (
            <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-card ${badge.className}`}>
              {badge.text}
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, idx) => (
            <ResourceTreeNode
              key={idx}
              node={child}
              depth={depth + 1}
              onSelectKind={onSelectKind}
              selectedKind={selectedKind}
              diffStatus={diffStatus}
              otherKinds={otherKinds}
              isAlternative={isAlternative}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ResourceDetailPanel - Side panel showing resource type details
 */
function ResourceDetailPanel({ resourceKind, onClose }) {
  const resource = getResourceDefinition(resourceKind);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${modal.overlayScrim} z-40`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={resourceKind}
        className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-surface border-l border-edge z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className={`${modal.header} flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold bg-tint border border-edge text-muted rounded-card">
                {resource.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-ink font-mono">
              {resource.kind}
            </h2>
            {resource.apiVersion && (
              <p className="text-sm text-muted font-mono mt-1">
                {resource.apiVersion}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-tint rounded-card ${interactive.transition}`}
          >
            <X size={20} className="text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              What it does
            </h3>
            <p className="text-ink leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Key Fields */}
          {resource.keyFields && resource.keyFields.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Key Fields
              </h3>
              <div className="space-y-3">
                {resource.keyFields.map((field, idx) => (
                  <div key={idx} className="border-l-2 border-accent pl-4">
                    <code className="text-sm font-mono font-semibold text-link">
                      {field.name}
                    </code>
                    <p className="text-sm text-ink mt-1">
                      {field.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentation Link */}
          {resource.docsUrl && (
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Documentation
              </h3>
              <a
                href={resource.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={button.secondary}
              >
                <ExternalLink size={16} />
                <span className="font-medium">View Official Docs</span>
              </a>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
