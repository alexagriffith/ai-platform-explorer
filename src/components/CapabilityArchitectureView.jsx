import { useState } from 'react';
import { Plus, Check, Info, Building2, Sparkles, X, ArrowDown, Microscope, ArrowUp, ChevronDown, ChevronRight, Workflow } from 'lucide-react';
import { capabilities, capabilityLayers } from '../data/capabilities';
import { solutionDetails } from '../data/solutionDetails';
import { subComponents } from '../data/subComponents';
import DeepDiveModal from './DeepDiveModal';
import FlowVisualization from './FlowVisualization';

export default function CapabilityArchitectureView({ onSwitchToGenerate }) {
  const [selectedCapabilities, setSelectedCapabilities] = useState({});
  const [configuringCapability, setConfiguringCapability] = useState(null);
  const [deepDiveOption, setDeepDiveOption] = useState(null);
  const [detailLevel, setDetailLevel] = useState(2); // 1: basic, 2: standard, 3: technical
  const [viewOrder, setViewOrder] = useState('bottom-up'); // 'bottom-up' or 'top-down'
  const [expandedComponents, setExpandedComponents] = useState(new Set());
  const [showFlowViz, setShowFlowViz] = useState(false);

  const isCapabilitySelected = (capabilityId) => {
    return selectedCapabilities[capabilityId] !== undefined;
  };

  const getSelectedOption = (capabilityId) => {
    return selectedCapabilities[capabilityId];
  };

  const selectCapabilityOption = (capabilityId, optionId) => {
    setSelectedCapabilities(prev => ({
      ...prev,
      [capabilityId]: optionId
    }));
    setConfiguringCapability(null);
  };

  const removeCapability = (capabilityId) => {
    setSelectedCapabilities(prev => {
      const updated = { ...prev };
      delete updated[capabilityId];
      return updated;
    });
  };

  const getCapabilitiesByLayer = (layerId) => {
    return capabilities[layerId] || [];
  };

  const getCapabilitiesBySubLayer = (layerId, subLayer) => {
    const layerCaps = capabilities[layerId] || [];
    return layerCaps.filter(cap => cap.subLayer === subLayer);
  };

  const toggleExpanded = (optionId) => {
    setExpandedComponents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const loadBasicInferenceStack = () => {
    // Pre-populate a minimal viable inference stack
    const basicStack = {
      'container-platform': 'openshift',      // OpenShift as foundation
      'ai-platform': 'rhoai',                 // OpenShift AI
      'model-serving': 'ai-inference',        // AI Inference Server
      'accelerators': 'nvidia-gpu'            // NVIDIA GPUs
    };
    setSelectedCapabilities(basicStack);
  };

  const CapabilityCard = ({ capability, layerColor, compact = false, showDetails = true }) => {
    const isSelected = isCapabilitySelected(capability.id);
    const selectedOptionId = getSelectedOption(capability.id);
    const selectedOption = capability.options.find(o => o.id === selectedOptionId);
    const hasSubComponents = selectedOptionId && subComponents[selectedOptionId];
    const isExpanded = expandedComponents.has(selectedOptionId);

    if (!isSelected) {
      return (
        <button
          onClick={() => setConfiguringCapability(capability)}
          className={`rounded-lg border-2 border-dashed hover:border-solid transition-all hover:shadow-md group text-left ${
            compact ? 'p-2' : 'p-4'
          }`}
          style={{ borderColor: layerColor + '80' }}
        >
          <div className="flex items-start gap-2">
            <Plus size={compact ? 12 : 16} className="mt-0.5 opacity-50 group-hover:opacity-100 flex-shrink-0" style={{ color: layerColor }} />
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-gray-900 dark:text-white truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {capability.name}
                {capability.required && (
                  <span className="ml-1 text-xs px-1 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                    Req
                  </span>
                )}
              </h4>
              {!compact && detailLevel >= 2 && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {capability.description}
                </p>
              )}
              {detailLevel >= 2 && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {capability.options.length} option{capability.options.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </button>
      );
    }

    const hasDeepDive = selectedOption?.provider === 'Red Hat' && solutionDetails[selectedOptionId];

    return (
      <div
        className={`rounded-lg border-2 shadow-md transition-all ${
          selectedOption?.isCustomer
            ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
            : selectedOption?.provider === 'Red Hat'
            ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
            : 'bg-purple-50 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700'
        } ${hasDeepDive ? 'cursor-pointer hover:shadow-lg' : ''}`}
        style={{ borderLeftWidth: '4px', borderLeftColor: layerColor }}
        onClick={() => hasDeepDive && setDeepDiveOption(selectedOptionId)}
      >
        <div className={`${compact ? 'p-2' : 'p-4'}`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                hasSubComponents && toggleExpanded(selectedOptionId);
              }}
              className={`flex-1 min-w-0 text-left ${hasSubComponents ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-1 mb-1">
                {hasSubComponents && (
                  isExpanded ? <ChevronDown size={14} className="flex-shrink-0" /> : <ChevronRight size={14} className="flex-shrink-0" />
                )}
                <h4 className={`font-bold text-gray-900 dark:text-white truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                  {capability.name}
                </h4>
                {selectedOption?.isCustomer && (
                  <Building2 size={compact ? 10 : 14} className="text-blue-600 flex-shrink-0" title="Customer-provided" />
                )}
              </div>
              <div className={`font-semibold text-gray-700 dark:text-gray-300 truncate ${compact ? 'text-xs' : 'text-xs'}`}>
                {detailLevel >= 2 ? `${selectedOption?.provider}: ${selectedOption?.name}` : selectedOption?.name}
              </div>
              {detailLevel >= 3 && selectedOption?.status && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Status: {selectedOption.status}
                </div>
              )}
            </button>
            <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setConfiguringCapability(capability)}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title="Change option"
              >
                <Sparkles size={compact ? 10 : 14} />
              </button>
              {!capability.required && (
                <button
                  onClick={() => removeCapability(capability.id)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="Remove capability"
                >
                  <X size={compact ? 10 : 14} />
                </button>
              )}
            </div>
          </div>
          {!compact && detailLevel >= 2 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
              {selectedOption?.description}
            </p>
          )}
          {hasDeepDive && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              Click to see architecture details →
            </div>
          )}
        </div>

        {/* Sub-components (expanded) */}
        {isExpanded && hasSubComponents && (
          <div className="border-t border-gray-300 dark:border-gray-600 px-3 py-2 bg-white/50 dark:bg-gray-900/50">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2">Components:</div>
            <div className="space-y-1">
              {subComponents[selectedOptionId].components.map((comp) => (
                <div
                  key={comp.id}
                  className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-gray-900 dark:text-white">
                        {comp.name}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        {comp.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {comp.description}
                  </div>
                  {comp.stages && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {comp.stages.map((stage, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          {stage}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ServicesLayerContent = ({ layerId, layerColor }) => {
    // Group capabilities by sub-layer
    const coreBase = getCapabilitiesBySubLayer(layerId, 'core').filter(c => c.position === 'base');
    const coreAdjacent = getCapabilitiesBySubLayer(layerId, 'core').filter(c => c.position === 'adjacent');
    const wrapper = getCapabilitiesBySubLayer(layerId, 'wrapper');
    const orchestration = getCapabilitiesBySubLayer(layerId, 'orchestration');

    const hasCore = coreBase.length > 0 || coreAdjacent.length > 0;
    const hasWrapper = wrapper.length > 0;
    const hasOrchestration = orchestration.length > 0;

    return (
      <div className="space-y-3">
        {/* Orchestration Layer (Top) */}
        {hasOrchestration && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                Orchestration Layer
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {orchestration.map(cap => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact />
              ))}
            </div>
            {hasWrapper && (
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Wrapper Layer (Around Core) */}
        {hasWrapper && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                Cross-Cutting Concerns
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {wrapper.map(cap => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact />
              ))}
            </div>
            {hasCore && (
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Core Layer (Base + Adjacent) */}
        {hasCore && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                Core Services
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Base takes full width or left side */}
              {coreBase.map(cap => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact={false} />
              ))}
              {/* Adjacent components */}
              {coreAdjacent.map(cap => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ConfigurationModal = () => {
    if (!configuringCapability) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={() => setConfiguringCapability(null)}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Configure: {configuringCapability.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {configuringCapability.description}
              </p>
            </div>
            <button
              onClick={() => setConfiguringCapability(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-3">
            {configuringCapability.options.map(option => {
              const isSelected = getSelectedOption(configuringCapability.id) === option.id;
              const hasDeepDive = solutionDetails[option.id];
              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => selectCapabilityOption(configuringCapability.id, option.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                        {isSelected ? <Check size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {option.name}
                          </h4>
                          {option.isCustomer && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded">
                              Customer
                            </span>
                          )}
                          {option.recommended && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                              Recommended
                            </span>
                          )}
                          {option.status && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs rounded">
                              {option.status}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Provider: <span className="font-semibold">{option.provider}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                  {option.provider === 'Red Hat' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeepDiveOption(option.id);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <Microscope size={16} />
                      Deep Dive into Technical Details
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const totalSelected = Object.keys(selectedCapabilities).length;
  const redhatCount = Object.values(selectedCapabilities).filter(optionId => {
    for (const layer of Object.values(capabilities)) {
      for (const cap of layer) {
        const option = cap.options.find(o => o.id === optionId);
        if (option?.provider === 'Red Hat') return true;
      }
    }
    return false;
  }).length;
  const customerCount = totalSelected - redhatCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Build Your AI Stack
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose capabilities • Select Red Hat or your own solutions • Build from bottom up
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={loadBasicInferenceStack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
              title="Load a basic inference stack to get started"
            >
              <Sparkles size={14} />
              Quick Start
            </button>
            {totalSelected > 0 && (
              <button
                onClick={() => setShowFlowViz(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Workflow size={14} />
                Data Flow
              </button>
            )}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Detail Level:</span>
                <div className="flex gap-1">
                  {[
                    { level: 1, label: 'Basic' },
                    { level: 2, label: 'Standard' },
                    { level: 3, label: 'Technical' }
                  ].map(({ level, label }) => (
                    <button
                      key={level}
                      onClick={() => setDetailLevel(level)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        detailLevel === level
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Order Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">View:</span>
                <button
                  onClick={() => setViewOrder(viewOrder === 'bottom-up' ? 'top-down' : 'bottom-up')}
                  className="flex items-center gap-2 px-3 py-1 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {viewOrder === 'bottom-up' ? (
                    <>
                      <ArrowUp size={12} />
                      Bottom-Up (Infra at Bottom)
                    </>
                  ) : (
                    <>
                      <ArrowDown size={12} />
                      Top-Down (Infra at Top)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalSelected}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {redhatCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Red Hat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {customerCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Customer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stack */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto space-y-1">
          {/* Render layers based on viewOrder */}
          {(viewOrder === 'bottom-up' ? [...capabilityLayers].reverse() : capabilityLayers).map((layer, index) => {
            const layerCapabilities = getCapabilitiesByLayer(layer.id);
            const selectedCount = layerCapabilities.filter(cap => isCapabilitySelected(cap.id)).length;
            const isServicesLayer = layer.id === 'services';

            return (
              <div key={layer.id} className="relative">
                {/* Layer Container */}
                <div
                  className="rounded-lg border-2 bg-white dark:bg-gray-800 shadow-lg"
                  style={{ borderColor: layer.color }}
                >
                  {/* Layer Header */}
                  <div
                    className="px-4 py-3 flex items-center justify-between rounded-t-lg"
                    style={{
                      background: `linear-gradient(135deg, ${layer.color}15, ${layer.color}05)`,
                      borderBottom: `2px solid ${layer.color}30`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {layer.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {selectedCount} of {layerCapabilities.length} configured
                          {isServicesLayer && ' • Showing sub-layers'}
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: layer.color + '20',
                        color: layer.color
                      }}
                    >
                      L{index + 1}
                    </div>
                  </div>

                  {/* Layer Content */}
                  <div className="p-4">
                    {isServicesLayer ? (
                      <ServicesLayerContent layerId={layer.id} layerColor={layer.color} />
                    ) : (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {layerCapabilities.map(capability => (
                          <div key={capability.id} className="w-full md:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]">
                            <CapabilityCard
                              capability={capability}
                              layerColor={layer.color}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connection Arrow (except for top layer) */}
                {index < capabilityLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div
                      className="w-0.5 h-4"
                      style={{ backgroundColor: layer.color + '40' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
            <span>Red Hat Solution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
            <span>Customer Solution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-200 border border-purple-400 rounded"></div>
            <span>Partner/Other</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDown size={12} />
            <span>AI Services shows sub-layers</span>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal />

      {/* Deep Dive Modal */}
      {deepDiveOption && (
        <DeepDiveModal
          optionId={deepDiveOption}
          onClose={() => setDeepDiveOption(null)}
        />
      )}

      {/* Flow Visualization Modal */}
      {showFlowViz && (
        <FlowVisualization
          selectedCapabilities={Object.entries(selectedCapabilities).reduce((acc, [capId, optionId]) => {
            // Find the capability and option details
            for (const [layerId, layerCaps] of Object.entries(capabilities)) {
              const cap = layerCaps.find(c => c.id === capId);
              if (cap) {
                const option = cap.options.find(o => o.id === optionId);
                if (!acc[layerId]) acc[layerId] = {};
                acc[layerId][capId] = option;
                break;
              }
            }
            return acc;
          }, {})}
          onClose={() => setShowFlowViz(false)}
        />
      )}
    </div>
  );
}
