import { ChevronRight, ChevronDown, Box, User, Cpu, X, ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';
import { getResourceDefinition } from '../data/resourceDefinitions';

/**
 * ResourceTreeView
 *
 * Shows Kubernetes resource hierarchy before and after adopting a platform component.
 * Displays parent-child relationships (e.g., Deployment → ReplicaSet → Pod).
 * Click on any resource kind to see detailed information in a side panel.
 */
export default function ResourceTreeView({ comparison }) {
  const [selectedResourceKind, setSelectedResourceKind] = useState(null);

  if (!comparison) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Select a comparison to view resource tree
      </div>
    );
  }

  const { before, after } = comparison;

  return (
    <div className="space-y-6 relative">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Kubernetes Resource Tree
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          What objects get created in your cluster? Who creates them (you or controllers)?
          <span className="inline-flex items-center gap-1 ml-2 text-sm text-blue-600 dark:text-blue-400">
            <Info size={14} />
            Click any resource type to learn more
          </span>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before State */}
        <div>
          <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Before: {before.label}
            </h4>
          </div>

          <div className="space-y-1">
            {before.clusterResources.map((resource, idx) => (
              <ResourceTreeNode
                key={idx}
                node={resource}
                onSelectKind={setSelectedResourceKind}
                selectedKind={selectedResourceKind}
              />
            ))}
          </div>
        </div>

        {/* After State */}
        <div>
          <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              After: {after.label}
            </h4>
          </div>

          <div className="space-y-1">
            {after.clusterResources.map((resource, idx) => (
              <ResourceTreeNode
                key={idx}
                node={resource}
                onSelectKind={setSelectedResourceKind}
                selectedKind={selectedResourceKind}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Creator Legend</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>User:</strong> You submit this YAML
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Controller:</strong> Created automatically
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Box size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Operator:</strong> Operator-managed
            </span>
          </div>
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
function ResourceTreeNode({ node, depth = 0, onSelectKind, selectedKind }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const creatorConfig = {
    user: { icon: User, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    controller: { icon: Cpu, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    operator: { icon: Box, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' }
  };

  const config = creatorConfig[node.createdBy] || creatorConfig.controller;
  const CreatorIcon = config.icon;
  const isSelected = selectedKind === node.kind;

  return (
    <div>
      {/* Node row */}
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded transition-colors ${config.bgColor} ${
          isSelected ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''
        }`}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
        ) : (
          <div className="w-5" /> // Spacer for alignment
        )}

        {/* Creator icon */}
        <CreatorIcon size={16} className={config.color} />

        {/* Resource kind (clickable) and name */}
        <div className="flex items-baseline gap-2">
          <button
            onClick={() => onSelectKind(node.kind)}
            className="font-mono text-sm font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 underline decoration-dotted underline-offset-2 cursor-pointer transition-colors"
          >
            {node.kind}
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {node.name}
          </span>
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded">
                {resource.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {resource.kind}
            </h2>
            {resource.apiVersion && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
                {resource.apiVersion}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What it does
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Key Fields */}
          {resource.keyFields && resource.keyFields.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Fields
              </h3>
              <div className="space-y-3">
                {resource.keyFields.map((field, idx) => (
                  <div key={idx} className="border-l-2 border-purple-500 pl-4">
                    <code className="text-sm font-mono font-semibold text-purple-600 dark:text-purple-400">
                      {field.name}
                    </code>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Documentation
              </h3>
              <a
                href={resource.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <ExternalLink size={16} />
                <span className="font-medium">View Official Docs</span>
              </a>
            </div>
          )}

          {/* Created By */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {resource.usedBy === 'user' && (
                <>
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                  <span><strong>You submit this</strong> in your YAML manifests</span>
                </>
              )}
              {resource.usedBy === 'controller' && (
                <>
                  <Cpu size={16} className="text-purple-600 dark:text-purple-400" />
                  <span><strong>Created automatically</strong> by Kubernetes controllers</span>
                </>
              )}
              {resource.usedBy === 'operator' && (
                <>
                  <Box size={16} className="text-green-600 dark:text-green-400" />
                  <span><strong>Managed by operator</strong> based on higher-level resources</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
