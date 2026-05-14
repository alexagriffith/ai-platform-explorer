import { ChevronRight, ChevronDown, Box, User, Cpu } from 'lucide-react';
import { useState } from 'react';

/**
 * ResourceTreeView
 *
 * Shows Kubernetes resource hierarchy before and after adopting a platform component.
 * Displays parent-child relationships (e.g., Deployment → ReplicaSet → Pod).
 */
export default function ResourceTreeView({ comparison }) {
  if (!comparison) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Select a comparison to view resource tree
      </div>
    );
  }

  const { before, after } = comparison;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Kubernetes Resource Tree
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          What objects get created in your cluster? Who creates them (you or controllers)?
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
              <ResourceTreeNode key={idx} node={resource} />
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
              <ResourceTreeNode key={idx} node={resource} />
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
    </div>
  );
}

/**
 * ResourceTreeNode - Individual node in the tree with expand/collapse
 */
function ResourceTreeNode({ node, depth = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const creatorConfig = {
    user: { icon: User, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    controller: { icon: Cpu, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    operator: { icon: Box, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' }
  };

  const config = creatorConfig[node.createdBy] || creatorConfig.controller;
  const CreatorIcon = config.icon;

  return (
    <div>
      {/* Node row */}
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${config.bgColor}`}
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

        {/* Resource kind and name */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {node.kind}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {node.name}
          </span>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, idx) => (
            <ResourceTreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
