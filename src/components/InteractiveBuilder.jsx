import { useState, useEffect } from 'react';
import { Check, ChevronRight, ArrowDown, ArrowRight, Building2, Sparkles, RotateCcw, Package, Microscope, ArrowUp, Workflow, HelpCircle, Info } from 'lucide-react';
import { capabilities, capabilityLayers } from '../data/capabilities';
import { optionGuides } from '../data/optionGuides';
import {
  flattenBuiltLayersToMap,
  expandCapabilityMapToBuiltLayers,
  capabilityMapToFlowShape
} from '../lib/capabilityBlueprint';
import { reconcileContainerAiPlatform, isCapabilityOptionDisabled } from '../lib/platformAiConstraints';
import { button, interactive, providerMark, status, text, toggle } from '../lib/styleTokens';
import DeepDiveModal from './DeepDiveModal';
import FlowVisualization from './FlowVisualization';

function fillLayerDefaults(layer) {
  const layerCaps = capabilities[layer.id] || [];
  const layerSelections = {};
  for (const cap of layerCaps) {
    if (cap.required) {
      const recommendedOption = cap.options.find((opt) => opt.recommended);
      if (recommendedOption) {
        layerSelections[cap.id] = recommendedOption.id;
      }
    }
  }
  return layerSelections;
}

// Build from infrastructure up (reverse of display order). Static — safe at module scope.
const buildOrder = [...capabilityLayers].reverse();
const layerAccentClass = 'bg-accent';
const layerStripeClass = 'bg-tint';

/** Only the first wizard layer — avoids locking Platform & Runtime from a not-yet-chosen AI / ML platform. */
function buildInitialBuiltLayers(buildOrder) {
  if (!buildOrder.length) return {};
  const first = buildOrder[0];
  return { [first.id]: fillLayerDefaults(first) };
}

function truncateBuiltLayersAfter(prev, lastIndexInclusive, buildOrder) {
  const kept = {};
  for (let i = 0; i <= lastIndexInclusive; i++) {
    const lid = buildOrder[i]?.id;
    if (lid && prev[lid]) kept[lid] = { ...prev[lid] };
  }
  return expandCapabilityMapToBuiltLayers(reconcileContainerAiPlatform(flattenBuiltLayersToMap(kept)));
}

function BuiltLayerCard({ layer, index, selectedCaps, onEdit, onDeepDive }) {
  const layerCaps = capabilities[layer.id] || [];
  const selectedCount = Object.keys(selectedCaps).length;

  return (
    <div data-ui="card" className={`rounded-card bg-surface ${interactive.transitionAll}`}>
      <div data-ui="section-header" className={`px-4 py-3 flex items-center justify-between rounded-t-card border-b border-hair ${layerStripeClass}`}>
        <div className="flex items-center gap-2">
          <div className={`w-1 h-6 rounded-full ${layerAccentClass}`} />
          <div>
            <h4 className={`font-bold text-sm ${text.ink}`}>{layer.name}</h4>
            <p className={`text-xs ${text.muted}`}>
              {selectedCount} component{selectedCount !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>
        <button
          onClick={() => onEdit(index)}
          className={`text-xs font-medium ${text.link} hover:underline ${interactive.focusRing} rounded-card`}
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
              data-ui="chip"
              key={capId}
              onClick={() => canDeepDive && onDeepDive(optionId)}
              className={`px-2 py-1 rounded-card text-xs font-medium border ${interactive.transitionAll} ${
                canDeepDive ? 'cursor-pointer hover:-translate-y-0.5 motion-reduce:hover:translate-y-0' : ''
              } ${
                option.isCustomer
                  ? `${providerMark.customer} ${text.ink}`
                  : option.provider === 'Red Hat'
                  ? `${providerMark.redHat} text-white`
                  : `${providerMark.partner} ${text.ink}`
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
}

function CapabilitySelector({
  capability,
  layerId,
  builtLayers,
  expandedGuide,
  setExpandedGuide,
  onToggle,
  onRemove
}) {
  const flatForRules = flattenBuiltLayersToMap(builtLayers);
  const selectedOptionId = builtLayers[layerId]?.[capability.id];
  const isSelected = !!selectedOptionId;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-bold ${text.ink} flex items-center gap-2`}>
            {capability.name}
            {capability.required && (
              <span className={`px-2 py-0.5 ${status.requiredBadge} text-xs rounded-card`}>
                Required
              </span>
            )}
          </h4>
          <p className={`text-sm ${text.muted}`}>{capability.description}</p>
        </div>
        {isSelected && !capability.required && (
          <button
            onClick={() => onRemove(layerId, capability.id)}
            className={`text-sm ${text.link} hover:underline ${interactive.focusRing} rounded-card`}
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid gap-2">
        {capability.options.map((option) => {
          const isOptionSelected = selectedOptionId === option.id;
          const guide = optionGuides[option.id];
          const isGuideExpanded = expandedGuide === option.id;
          const disabled = isCapabilityOptionDisabled(capability, option.id, flatForRules);

          return (
            <div key={option.id} className="space-y-2">
              <button
                data-ui="card"
                type="button"
                aria-disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  onToggle(layerId, capability.id, option.id);
                }}
                className={`w-full p-3 rounded-card border ${interactive.transitionAll} ${interactive.focusRing} text-left ${
                  disabled
                    ? 'cursor-not-allowed border-edge bg-page opacity-55'
                    : isOptionSelected
                      ? 'border-accent bg-tint'
                      : 'border-edge bg-surface hover:border-accent hover:bg-tint'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${isOptionSelected ? 'text-accent' : text.faint}`}>
                    {isOptionSelected ? (
                      <Check size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold ${text.ink}`}>
                          {option.name}
                        </span>
                        {disabled && (
                          <span className={`px-2 py-0.5 bg-page ${text.muted} border border-edge text-xs rounded-card`}>
                            N/A
                          </span>
                        )}
                        {option.isCustomer && (
                          <span className={`px-2 py-0.5 ${providerMark.customer} ${text.ink} text-xs rounded-card`}>
                            Customer
                          </span>
                        )}
                        {option.recommended && (
                          <span className={`px-2 py-0.5 ${status.completeBanner} text-xs rounded-card`}>
                            Recommended
                          </span>
                        )}
                        {option.status && (
                          <span className={`px-2 py-0.5 bg-page ${text.muted} border border-hair text-xs rounded-card`}>
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
                          className={`p-1 rounded-card ${interactive.transition} ${interactive.focusRing} ${
                            isGuideExpanded
                              ? 'bg-tint text-accent'
                              : `${interactive.hoverTint} ${text.faint}`
                          }`}
                          title="Learn more about this option"
                        >
                          <HelpCircle size={16} />
                        </button>
                      )}
                    </div>
                    <div className={`text-sm ${text.muted} mb-1`}>
                      Provider: <span className="font-semibold">{option.provider}</span>
                    </div>
                    <p className={`text-sm ${text.muted}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Guide */}
              {guide && isGuideExpanded && (
                <div className="ml-8 p-4 bg-tint rounded-card border border-edge">
                  <div className="grid gap-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Info size={14} className="text-accent" />
                        <span className={`font-bold ${text.ink}`}>What it is:</span>
                      </div>
                      <p className={text.muted}>{guide.whatItIs}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Check size={14} className="text-green-600" />
                        <span className={`font-bold ${text.ink}`}>Why choose:</span>
                      </div>
                      <p className={text.muted}>{guide.whyChoose}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowRight size={14} className="text-accent" />
                        <span className={`font-bold ${text.ink}`}>When to use:</span>
                      </div>
                      <p className={text.muted}>{guide.whenToUse}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-accent" />
                        <span className={`font-bold ${text.ink}`}>Best for:</span>
                      </div>
                      <p className={text.muted}>{guide.bestFor}</p>
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
}

export default function InteractiveBuilder({ selectedCapabilities = {}, setSelectedCapabilities }) {
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  // Hydrate from canonical Build Your Stack map when present; otherwise required-option defaults.
  const [builtLayers, setBuiltLayers] = useState(() => {
    if (Object.keys(selectedCapabilities).length > 0) {
      return expandCapabilityMapToBuiltLayers(reconcileContainerAiPlatform(selectedCapabilities));
    }
    const initial = buildInitialBuiltLayers(buildOrder);
    const flat = reconcileContainerAiPlatform(flattenBuiltLayersToMap(initial));
    return expandCapabilityMapToBuiltLayers(flat);
  });
  const [isComplete, setIsComplete] = useState(false);
  const [deepDiveOption, setDeepDiveOption] = useState(null);
  const [viewOrder, setViewOrder] = useState('bottom-up'); // 'bottom-up' or 'top-down'
  const [showFlowViz, setShowFlowViz] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState(null);

  const currentLayer = buildOrder[currentLayerIndex];

  // Continuously sync wizard selections up to the single blueprint map so partial progress
  // survives mode switches and rollbacks (Back / Edit) are never reverted by stale parent state.
  useEffect(() => {
    setSelectedCapabilities(reconcileContainerAiPlatform(flattenBuiltLayersToMap(builtLayers)));
  }, [builtLayers, setSelectedCapabilities]);

  const toggleCapability = (layerId, capabilityId, optionId) => {
    setBuiltLayers((prev) => {
      const flat = flattenBuiltLayersToMap(prev);
      const cap = Object.values(capabilities)
        .flat()
        .find((c) => c.id === capabilityId);
      if (cap && isCapabilityOptionDisabled(cap, optionId, flat)) return prev;
      const nextFlat = { ...flat, [capabilityId]: optionId };
      const reconciled = reconcileContainerAiPlatform(nextFlat);
      return expandCapabilityMapToBuiltLayers(reconciled);
    });
  };

  const removeCapability = (layerId, capabilityId) => {
    setBuiltLayers(prev => {
      const layerData = { ...(prev[layerId] || {}) };
      delete layerData[capabilityId];
      const next = { ...prev, [layerId]: layerData };
      const reconciled = reconcileContainerAiPlatform(flattenBuiltLayersToMap(next));
      return expandCapabilityMapToBuiltLayers(reconciled);
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
      const nextIdx = currentLayerIndex + 1;
      const nextLayer = buildOrder[nextIdx];
      setBuiltLayers((prev) => {
        const defaults = fillLayerDefaults(nextLayer);
        const merged = {
          ...prev,
          [nextLayer.id]: { ...defaults, ...(prev[nextLayer.id] || {}) }
        };
        return expandCapabilityMapToBuiltLayers(reconcileContainerAiPlatform(flattenBuiltLayersToMap(merged)));
      });
      setCurrentLayerIndex(nextIdx);
    } else {
      setIsComplete(true);
    }
  };

  const goBackToLayer = (index) => {
    setIsComplete(false);
    setBuiltLayers((prev) => truncateBuiltLayersAfter(prev, index, buildOrder));
    setCurrentLayerIndex(index);
  };

  const stepBack = () => {
    if (currentLayerIndex <= 0) return;
    const newIdx = currentLayerIndex - 1;
    setBuiltLayers((prev) => truncateBuiltLayersAfter(prev, newIdx, buildOrder));
    setCurrentLayerIndex(newIdx);
  };

  const resetBuilder = () => {
    setCurrentLayerIndex(0);
    setIsComplete(false);
    // The sync effect pushes the reset selections up to the blueprint map.
    const initial = buildInitialBuiltLayers(buildOrder);
    const flat = reconcileContainerAiPlatform(flattenBuiltLayersToMap(initial));
    setBuiltLayers(expandCapabilityMapToBuiltLayers(flat));
  };

  if (isComplete) {
    const totalComponents = Object.values(builtLayers).reduce(
      (sum, layer) => sum + Object.keys(layer).length,
      0
    );

    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className={`${status.completeBanner} rounded-card p-6`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Check size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Guided steps complete</h2>
              <p className="text-green-100">
                Selections are saved to Build Your Stack — switch to that mode above to review or fine-tune by layer.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 rounded-card px-4 py-2">
              <div className="text-2xl font-bold">{buildOrder.length}</div>
              <div className="text-sm text-green-100">Layers Configured</div>
            </div>
            <div className="bg-white/20 rounded-card px-4 py-2">
              <div className="text-2xl font-bold">{totalComponents}</div>
              <div className="text-sm text-green-100">Total Components</div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={resetBuilder}
              className={button.secondary}
            >
              <RotateCcw size={18} />
              Start Over
            </button>
            <button
              onClick={() => setShowFlowViz(true)}
              className={button.primary}
            >
              <Workflow size={18} />
              See Data Flow
            </button>
          </div>
        </div>

        {/* Complete Stack View */}
        <div className="bg-tint rounded-card p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className={`text-xl font-bold ${text.ink}`}>Your Complete Stack</h3>
            </div>
            <div className="flex gap-2">
              {/* View Order Toggle */}
              <button
                onClick={() => setViewOrder(viewOrder === 'bottom-up' ? 'top-down' : 'bottom-up')}
                className={`flex items-center gap-2 px-3 py-2 rounded-card text-xs font-medium border border-edge ${toggle.inactive} ${interactive.transition} ${interactive.focusRing}`}
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
                  <BuiltLayerCard
                    layer={layer}
                    index={originalIndex}
                    selectedCaps={builtLayers[layer.id] || {}}
                    onEdit={goBackToLayer}
                    onDeepDive={setDeepDiveOption}
                  />
                  {index < buildOrder.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={16} className={text.faint} />
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
            selectedCapabilities={capabilityMapToFlowShape(flattenBuiltLayersToMap(builtLayers))}
            onClose={() => setShowFlowViz(false)}
          />
        )}
      </div>
    );
  }

  const layerCaps = capabilities[currentLayer?.id] || [];
  const progress = ((currentLayerIndex + 1) / buildOrder.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-surface rounded-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className={`text-xl font-bold ${text.ink}`}>
              Interactive Stack Builder
            </h2>
            <p className={`text-sm ${text.muted}`}>
              Step {currentLayerIndex + 1} of {buildOrder.length}
            </p>
          </div>
          <button
            onClick={resetBuilder}
            className={`text-sm ${text.muted} hover:text-ink flex items-center gap-1 ${interactive.transition} ${interactive.focusRing} rounded-card`}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-page rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-all duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-3">
          {buildOrder.map((layer, idx) => (
            <div key={layer.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${interactive.transitionAll} ${
                  idx < currentLayerIndex
                    ? 'bg-green-600 text-white'
                    : idx === currentLayerIndex
                    ? 'bg-accent text-on-accent'
                    : 'bg-page text-muted'
                }`}
              >
                {idx < currentLayerIndex ? <Check size={16} /> : idx + 1}
              </div>
              {idx < buildOrder.length - 1 && (
                <ChevronRight size={16} className={`${text.faint} mx-1`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Configuration Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface rounded-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-2 h-12 rounded-full ${layerAccentClass}`} />
              <div>
                <h3 className={`text-2xl font-bold ${text.ink}`}>
                  {currentLayer?.name}
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              {layerCaps.map(capability => (
                <CapabilitySelector
                  key={capability.id}
                  capability={capability}
                  layerId={currentLayer.id}
                  builtLayers={builtLayers}
                  expandedGuide={expandedGuide}
                  setExpandedGuide={setExpandedGuide}
                  onToggle={toggleCapability}
                  onRemove={removeCapability}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-hair">
              {currentLayerIndex > 0 ? (
                <button
                  type="button"
                  onClick={stepBack}
                  className={button.secondary}
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={proceedToNextLayer}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-card font-semibold ${interactive.transitionAll} ${
                  canProceed()
                    ? 'bg-accent text-on-accent hover:bg-accent-strong'
                    : 'bg-page text-muted cursor-not-allowed'
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
          <div className="bg-surface rounded-card p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-accent" />
              <h4 className={`font-bold ${text.ink}`}>Stack Preview</h4>
            </div>

            <div className="space-y-2">
              {buildOrder.map((layer, index) => {
                const isCurrentLayer = index === currentLayerIndex;
                const isCompleted = index < currentLayerIndex;
                return (
                  <div key={layer.id}>
                    <div
                      className={`p-3 rounded-card border ${interactive.transitionAll} ${
                        isCurrentLayer
                          ? 'border-accent bg-tint'
                          : isCompleted
                          ? 'border-edge bg-surface'
                          : 'border-edge bg-page'
                      } border-l-4 border-l-accent`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isCompleted ? (
                          <Check size={16} className="text-green-600" />
                        ) : isCurrentLayer ? (
                          <Sparkles size={16} className="text-accent" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-edge" />
                        )}
                        <span className={`font-semibold text-sm ${text.ink}`}>
                          {layer.name}
                        </span>
                      </div>
                    </div>
                    {index < buildOrder.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown size={12} className={text.faint} />
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
