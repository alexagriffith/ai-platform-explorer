import { useState, useEffect } from 'react';
import { Check, ChevronRight, ArrowDown, Building2, Sparkles, RotateCcw, Package, Microscope, ArrowUp, Plus, X, Workflow, HelpCircle, Info } from 'lucide-react';
import { capabilities, capabilityLayers } from '../data/capabilities';
import { optionGuides } from '../data/optionGuides';
import DeepDiveModal from './DeepDiveModal';
import FlowVisualization from './FlowVisualization';

export default function InteractiveBuilder() {
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [builtLayers, setBuiltLayers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [deepDiveOption, setDeepDiveOption] = useState(null);
  const [viewOrder, setViewOrder] = useState('bottom-up'); // 'bottom-up' or 'top-down'
  const [configuringCapability, setConfiguringCapability] = useState(null);
  const [showFlowViz, setShowFlowViz] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState(null);

  // Start from infrastructure (reverse of display order)
  const buildOrder = [...capabilityLayers].reverse();
  const currentLayer = buildOrder[currentLayerIndex];

  // Auto-select ONLY required options on component mount
  useEffect(() => {
    const autoSelected = {};
    buildOrder.forEach(layer => {
      const layerCaps = capabilities[layer.id] || [];
      const layerSelections = {};

      layerCaps.forEach(cap => {
        // Auto-select ONLY if required
        if (cap.required) {
          const recommendedOption = cap.options.find(opt => opt.recommended);
          if (recommendedOption) {
            layerSelections[cap.id] = recommendedOption.id;
          }
        }
      });

      if (Object.keys(layerSelections).length > 0) {
        autoSelected[layer.id] = layerSelections;
      }
    });

    setBuiltLayers(autoSelected);
  }, []); // Only run on mount

  const toggleCapability = (layerId, capabilityId, optionId) => {
    setBuiltLayers(prev => ({
      ...prev,
      [layerId]: {
        ...(prev[layerId] || {}),
        [capabilityId]: optionId
      }
    }));
  };

  const removeCapability = (layerId, capabilityId) => {
    setBuiltLayers(prev => {
      const layerData = { ...(prev[layerId] || {}) };
      delete layerData[capabilityId];
      return {
        ...prev,
        [layerId]: layerData
      };
    });
  };

  const canProceed = () => {
    const layerCaps = capabilities[currentLayer?.id] || [];
    const selectedCaps = builtLayers[currentLayer?.id] || {};

    // Check if all required capabilities are selected
    const requiredCaps = layerCaps.filter(cap => cap.required);
    return requiredCaps.every(cap => selectedCaps[cap.id]);
  };

  const proceedToNextLayer = () => {
    if (currentLayerIndex < buildOrder.length - 1) {
      setCurrentLayerIndex(currentLayerIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const goBackToLayer = (index) => {
    setCurrentLayerIndex(index);
    setIsComplete(false);
  };

  const resetBuilder = () => {
    setCurrentLayerIndex(0);
    setBuiltLayers({});
    setIsComplete(false);
  };

  const getLayerColor = (layerId) => {
    return capabilityLayers.find(l => l.id === layerId)?.color || '#8B5CF6';
  };

  const BuiltLayerCard = ({ layer, index }) => {
    const layerCaps = capabilities[layer.id] || [];
    const selectedCaps = builtLayers[layer.id] || {};
    const selectedCount = Object.keys(selectedCaps).length;
    const layerColor = getLayerColor(layer.id);

    return (
      <div
        className="rounded-lg border-2 bg-white dark:bg-gray-800 shadow-md transition-all"
        style={{ borderColor: layerColor }}
      >
        <div
          className="px-4 py-2 flex items-center justify-between rounded-t-lg"
          style={{
            background: `linear-gradient(135deg, ${layerColor}15, ${layerColor}05)`,
            borderBottom: `2px solid ${layerColor}30`
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: layerColor }} />
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{layer.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {selectedCount} component{selectedCount !== 1 ? 's' : ''} configured
              </p>
            </div>
          </div>
          <button
            onClick={() => goBackToLayer(index)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="p-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedCaps).map(([capId, optionId]) => {
              const capability = layerCaps.find(c => c.id === capId);
              const option = capability?.options.find(o => o.id === optionId);
              if (!capability || !option) return null;

              const canDeepDive = option.provider === 'Red Hat';

              return (
                <button
                  key={capId}
                  onClick={() => canDeepDive && setDeepDiveOption(optionId)}
                  className={`px-2 py-1 rounded text-xs font-medium border transition-all ${
                    canDeepDive ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''
                  } ${
                    option.isCustomer
                      ? 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200'
                      : option.provider === 'Red Hat'
                      ? 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200'
                      : 'bg-purple-50 border-purple-300 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-200'
                  }`}
                  title={canDeepDive ? 'Click for deep dive' : ''}
                >
                  {capability.name}
                  {option.isCustomer && (
                    <Building2 size={10} className="inline ml-1 mb-0.5" />
                  )}
                  {canDeepDive && (
                    <Microscope size={10} className="inline ml-1 mb-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const CapabilitySelector = ({ capability, layerId, layerColor }) => {
    const selectedOptionId = builtLayers[layerId]?.[capability.id];
    const selectedOption = capability.options.find(o => o.id === selectedOptionId);
    const isSelected = !!selectedOptionId;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {capability.name}
              {capability.required && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded">
                  Required
                </span>
              )}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{capability.description}</p>
          </div>
          {isSelected && !capability.required && (
            <button
              onClick={() => removeCapability(layerId, capability.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        <div className="grid gap-2">
          {capability.options.map(option => {
            const isOptionSelected = selectedOptionId === option.id;
            const guide = optionGuides[option.id];
            const isGuideExpanded = expandedGuide === option.id;

            return (
              <div key={option.id} className="space-y-2">
                <button
                  onClick={() => toggleCapability(layerId, capability.id, option.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isOptionSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isOptionSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                      {isOptionSelected ? (
                        <Check size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {option.name}
                          </span>
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
                        {guide && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedGuide(isGuideExpanded ? null : option.id);
                            }}
                            className={`p-1 rounded-full transition-colors ${
                              isGuideExpanded
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                            }`}
                            title="Learn more about this option"
                          >
                            <HelpCircle size={16} />
                          </button>
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

                {/* Expanded Guide */}
                {guide && isGuideExpanded && (
                  <div className="ml-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="grid gap-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Info size={14} className="text-blue-600" />
                          <span className="font-bold text-gray-900 dark:text-white">What it is:</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{guide.whatItIs}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Check size={14} className="text-green-600" />
                          <span className="font-bold text-gray-900 dark:text-white">Why choose:</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{guide.whyChoose}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight size={14} className="text-purple-600" />
                          <span className="font-bold text-gray-900 dark:text-white">When to use:</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{guide.whenToUse}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles size={14} className="text-orange-600" />
                          <span className="font-bold text-gray-900 dark:text-white">Best for:</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{guide.bestFor}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isComplete) {
    const totalComponents = Object.values(builtLayers).reduce(
      (sum, layer) => sum + Object.keys(layer).length,
      0
    );

    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Check size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Stack Build Complete!</h2>
              <p className="text-green-100">Your AI platform architecture is ready</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{buildOrder.length}</div>
              <div className="text-sm text-green-100">Layers Configured</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{totalComponents}</div>
              <div className="text-sm text-green-100">Total Components</div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={resetBuilder}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              <RotateCcw size={18} />
              Start Over
            </button>
            <button
              onClick={() => setShowFlowViz(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Workflow size={18} />
              See Data Flow
            </button>
          </div>
        </div>

        {/* Complete Stack View */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Complete Stack</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on Red Hat solutions (green boxes) to see technical deep dive
              </p>
            </div>
            <div className="flex gap-2">
              {/* View Order Toggle */}
              <button
                onClick={() => setViewOrder(viewOrder === 'bottom-up' ? 'top-down' : 'bottom-up')}
                className="flex items-center gap-2 px-3 py-2 rounded text-xs font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                {viewOrder === 'bottom-up' ? (
                  <>
                    <ArrowUp size={14} />
                    Bottom-Up
                  </>
                ) : (
                  <>
                    <ArrowDown size={14} />
                    Top-Down
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {/* Render based on viewOrder */}
            {(viewOrder === 'bottom-up' ? [...buildOrder].reverse() : buildOrder).map((layer, index) => {
              const originalIndex = viewOrder === 'bottom-up' ? buildOrder.length - 1 - index : index;
              return (
                <div key={layer.id}>
                  <BuiltLayerCard layer={layer} index={originalIndex} />
                  {index < buildOrder.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
            selectedCapabilities={Object.entries(builtLayers).reduce((acc, [layerId, selections]) => {
              acc[layerId] = {};
              Object.entries(selections).forEach(([capId, optionId]) => {
                const cap = capabilities[layerId]?.find(c => c.id === capId);
                if (cap) {
                  acc[layerId][capId] = cap.options.find(o => o.id === optionId);
                }
              });
              return acc;
            }, {})}
            onClose={() => setShowFlowViz(false)}
          />
        )}
      </div>
    );
  }

  const layerColor = getLayerColor(currentLayer?.id);
  const layerCaps = capabilities[currentLayer?.id] || [];
  const progress = ((currentLayerIndex + 1) / buildOrder.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Interactive Stack Builder
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentLayerIndex + 1} of {buildOrder.length}: Configure {currentLayer?.name}
            </p>
          </div>
          <button
            onClick={resetBuilder}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-3">
          {buildOrder.map((layer, idx) => (
            <div key={layer.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  idx < currentLayerIndex
                    ? 'bg-green-500 text-white'
                    : idx === currentLayerIndex
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {idx < currentLayerIndex ? <Check size={16} /> : idx + 1}
              </div>
              {idx < buildOrder.length - 1 && (
                <ChevronRight size={16} className="text-gray-400 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Configuration Area */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2"
            style={{ borderColor: layerColor }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-2 h-12 rounded-full"
                style={{ backgroundColor: layerColor }}
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentLayer?.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure the capabilities for this layer
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {layerCaps.map(capability => (
                <CapabilitySelector
                  key={capability.id}
                  capability={capability}
                  layerId={currentLayer.id}
                  layerColor={layerColor}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentLayerIndex > 0 ? (
                <button
                  onClick={() => setCurrentLayerIndex(currentLayerIndex - 1)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={proceedToNextLayer}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentLayerIndex < buildOrder.length - 1 ? (
                  <>
                    Continue to Next Layer
                    <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    Complete Stack
                    <Check size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stack Preview Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-purple-600" />
              <h4 className="font-bold text-gray-900 dark:text-white">Stack Preview</h4>
            </div>

            <div className="space-y-2">
              {buildOrder.map((layer, index) => {
                const selectedCaps = builtLayers[layer.id] || {};
                const selectedCount = Object.keys(selectedCaps).length;
                const isCurrentLayer = index === currentLayerIndex;
                const isCompleted = index < currentLayerIndex;
                const layerColor = getLayerColor(layer.id);

                return (
                  <div key={layer.id}>
                    <div
                      className={`p-3 rounded-lg border transition-all ${
                        isCurrentLayer
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : isCompleted
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isCompleted ? (
                          <Check size={16} className="text-green-600" />
                        ) : isCurrentLayer ? (
                          <Sparkles size={16} className="text-purple-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {layer.name}
                        </span>
                      </div>
                      {selectedCount > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                          {selectedCount} component{selectedCount !== 1 ? 's' : ''} selected
                        </p>
                      )}
                    </div>
                    {index < buildOrder.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown size={12} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
