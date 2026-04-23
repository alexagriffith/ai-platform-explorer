import { useState } from 'react';
import { X, ArrowDown, Workflow, Maximize2, Minimize2, Database, Cpu, Network, Layers } from 'lucide-react';
import { subComponents } from '../data/subComponents';
import { solutionDetails } from '../data/solutionDetails';

export default function FlowVisualization({ selectedCapabilities, onClose }) {
  const [expandedComponent, setExpandedComponent] = useState(null);
  const [viewMode, setViewMode] = useState('high-level'); // 'high-level' or 'detailed'

  // Build flow based on selected capabilities
  const buildFlow = () => {
    const flow = [];

    // Infrastructure layer
    if (selectedCapabilities.infrastructure?.['container-platform']) {
      const component = {
        id: 'container-platform',
        name: selectedCapabilities.infrastructure['container-platform'].name,
        optionId: Object.entries(selectedCapabilities.infrastructure).find(
          ([k, v]) => k === 'container-platform'
        )?.[1]?.id,
        description: 'Container orchestration and resource management',
        icon: Cpu,
        connections: ['ai-platform']
      };
      flow.push({
        layer: 'Infrastructure',
        layerId: 'infrastructure',
        color: '#F59E0B',
        components: [component]
      });
    }

    // Platform layer
    if (selectedCapabilities.platform?.['ai-platform']) {
      const component = {
        id: 'ai-platform',
        name: selectedCapabilities.platform['ai-platform'].name,
        optionId: Object.values(selectedCapabilities.platform)[0]?.id,
        description: 'AI/ML platform capabilities',
        icon: Layers,
        connections: ['model-serving']
      };
      flow.push({
        layer: 'Platform',
        layerId: 'platform',
        color: '#10B981',
        components: [component]
      });
    }

    // Services layer
    const serviceComponents = [];
    if (selectedCapabilities.services?.['model-serving']) {
      serviceComponents.push({
        id: 'model-serving',
        name: selectedCapabilities.services['model-serving'].name,
        optionId: selectedCapabilities.services['model-serving'].id,
        description: 'Inference requests from applications',
        type: 'core',
        icon: Network,
        connections: ['gateway']
      });
    }
    if (selectedCapabilities.services?.['model-registry']) {
      serviceComponents.push({
        id: 'model-registry',
        name: selectedCapabilities.services['model-registry'].name,
        optionId: selectedCapabilities.services['model-registry'].id,
        description: 'Model versioning and metadata',
        type: 'adjacent',
        icon: Database,
        connections: ['model-serving']
      });
    }
    if (selectedCapabilities.services?.['vector-db']) {
      serviceComponents.push({
        id: 'vector-db',
        name: selectedCapabilities.services['vector-db'].name,
        optionId: selectedCapabilities.services['vector-db'].id,
        description: 'Semantic search for RAG',
        type: 'adjacent',
        icon: Database,
        connections: ['model-serving']
      });
    }
    if (selectedCapabilities.services?.observability) {
      serviceComponents.push({
        id: 'observability',
        name: selectedCapabilities.services.observability.name,
        optionId: selectedCapabilities.services.observability.id,
        description: 'Monitoring and metrics',
        type: 'wrapper',
        icon: Workflow
      });
    }
    if (selectedCapabilities.services?.governance) {
      serviceComponents.push({
        id: 'governance',
        name: selectedCapabilities.services.governance.name,
        optionId: selectedCapabilities.services.governance.id,
        description: 'Compliance and explainability',
        type: 'wrapper',
        icon: Workflow
      });
    }
    if (selectedCapabilities.services?.mcp) {
      serviceComponents.push({
        id: 'mcp',
        name: selectedCapabilities.services.mcp.name,
        optionId: selectedCapabilities.services.mcp.id,
        description: 'Connect to external tools',
        type: 'orchestration',
        icon: Network
      });
    }
    if (selectedCapabilities.services?.evaluation) {
      serviceComponents.push({
        id: 'evaluation',
        name: selectedCapabilities.services.evaluation.name,
        optionId: selectedCapabilities.services.evaluation.id,
        description: 'Model quality validation',
        type: 'orchestration',
        icon: Workflow
      });
    }

    if (serviceComponents.length > 0) {
      flow.push({
        layer: 'AI Services',
        layerId: 'services',
        color: '#06B6D4',
        components: serviceComponents
      });
    }

    // Application layer
    const appComponents = [];
    if (selectedCapabilities.application?.gateway) {
      appComponents.push({
        id: 'gateway',
        name: selectedCapabilities.application.gateway.name,
        optionId: selectedCapabilities.application.gateway.id,
        description: 'API routing, auth, rate limiting',
        icon: Network
      });
    }
    if (selectedCapabilities.application?.orchestration) {
      appComponents.push({
        id: 'orchestration',
        name: selectedCapabilities.application.orchestration.name,
        optionId: selectedCapabilities.application.orchestration.id,
        description: 'Multi-step AI workflows',
        icon: Workflow
      });
    }
    if (selectedCapabilities.application?.['gen-ai-tools']) {
      appComponents.push({
        id: 'gen-ai-tools',
        name: selectedCapabilities.application['gen-ai-tools'].name,
        optionId: selectedCapabilities.application['gen-ai-tools'].id,
        description: 'Prompt testing and experimentation',
        icon: Layers
      });
    }

    if (appComponents.length > 0) {
      flow.push({
        layer: 'Application',
        layerId: 'application',
        color: '#8B5CF6',
        components: appComponents
      });
    }

    return flow.reverse(); // App at top, infra at bottom
  };

  const flow = buildFlow();

  const ComponentBox = ({ component, layerColor, canExpand }) => {
    const Icon = component.icon || Layers;
    const isExpanded = expandedComponent === component.id;
    const hasSubComponents = canExpand && subComponents[component.optionId];

    return (
      <div className="relative">
        <div
          onClick={() => hasSubComponents && setExpandedComponent(isExpanded ? null : component.id)}
          className={`relative p-4 rounded-lg border-2 shadow-lg transition-all ${
            hasSubComponents ? 'cursor-pointer hover:shadow-xl hover:scale-105' : ''
          } ${
            component.type === 'core'
              ? 'bg-blue-600 border-blue-700'
              : component.type === 'wrapper'
              ? 'bg-purple-600 border-purple-700'
              : component.type === 'orchestration'
              ? 'bg-green-600 border-green-700'
              : component.type === 'adjacent'
              ? 'bg-cyan-600 border-cyan-700'
              : 'bg-gray-700 border-gray-600'
          }`}
          style={{ minWidth: '200px', maxWidth: '280px' }}
        >
          {hasSubComponents && (
            <div className="absolute top-2 right-2">
              {isExpanded ? (
                <Minimize2 size={16} className="text-white opacity-70" />
              ) : (
                <Maximize2 size={16} className="text-white opacity-70" />
              )}
            </div>
          )}
          <div className="flex items-start gap-3 mb-2">
            <Icon size={20} className="text-white flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm mb-1 leading-tight">
                {component.name}
              </div>
              <div className="text-xs text-white/80">
                {component.description}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Sub-Components */}
        {isExpanded && hasSubComponents && (
          <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
            <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Internal Components</div>
            <div className="space-y-2">
              {subComponents[component.optionId].components.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-gray-700 rounded border border-gray-600 text-xs"
                >
                  <div className="font-semibold text-white">{sub.name}</div>
                  <div className="text-gray-400 text-xs">{sub.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Workflow size={32} />
                Architecture Flow Diagram
              </h2>
              <p className="text-blue-100">Technical view of component interactions and data flow</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-900">
          {/* Flow Diagram */}
          <div className="space-y-8">
            {flow.map((layer, idx) => (
              <div key={idx}>
                {/* Layer Container */}
                <div
                  className="rounded-lg border-2 p-6"
                  style={{ borderColor: layer.color, backgroundColor: layer.color + '10' }}
                >
                  {/* Layer Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: layer.color }}></div>
                    <h3 className="text-xl font-bold text-white">
                      {layer.layer}
                    </h3>
                    <div className="flex-1 h-px" style={{ backgroundColor: layer.color + '40' }}></div>
                  </div>

                  {/* Components Grid */}
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {layer.components.map((component, cidx) => (
                      <ComponentBox
                        key={cidx}
                        component={component}
                        layerColor={layer.color}
                        canExpand={true}
                      />
                    ))}
                  </div>
                </div>

                {/* Connection Arrow */}
                {idx < flow.length - 1 && (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                    <ArrowDown size={24} className="text-purple-400 -mt-1" strokeWidth={3} />
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full -mt-1"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-5 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Layers size={18} />
              Component Types
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded border-2 border-blue-700"></div>
                <span className="text-gray-300">Core Service (base layer)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-cyan-600 rounded border-2 border-cyan-700"></div>
                <span className="text-gray-300">Adjacent Service (same level)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded border-2 border-purple-700"></div>
                <span className="text-gray-300">Cross-cutting (observability/governance)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-600 rounded border-2 border-green-700"></div>
                <span className="text-gray-300">Orchestration (higher level)</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <Maximize2 size={14} className="inline mr-1" />
                Click on components with expand icon to see internal architecture
              </p>
            </div>
          </div>

          {/* Request Flow */}
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700/50">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <ArrowDown size={18} />
              Data Flow Path
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">1</div>
                <span>User request enters through <strong>Application Layer</strong> (API Gateway)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded">
                <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">2</div>
                <span>Routed to <strong>AI Services</strong> (Model Serving, MCP, etc.)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">3</div>
                <span><strong>Platform Layer</strong> manages compute and resources</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded">
                <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">4</div>
                <span><strong>Infrastructure</strong> provides containers and GPU scheduling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
