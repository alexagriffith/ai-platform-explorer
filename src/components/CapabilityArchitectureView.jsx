import { useState, useCallback } from 'react';
import {
  Plus,
  Building2,
  Sparkles,
  X,
  Trash2,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Workflow,
  RotateCcw,
  CheckCircle2,
  Image
} from 'lucide-react';
import { capabilities, capabilityLayers } from '../data/capabilities';
import { solutionDetails } from '../data/solutionDetails';
import { subComponents } from '../data/subComponents';
import DeepDiveModal from './DeepDiveModal';
import FlowVisualization from './FlowVisualization';
import { capabilityMapToFlowShape } from '../lib/capabilityBlueprint';
import {
  reconcileContainerAiPlatform,
  isCapabilityOptionDisabled
} from '../lib/platformAiConstraints';
import CapabilityConfigurationModal from './CapabilityConfigurationModal';
import {
  button,
  card,
  interactive,
  providerMark,
  status,
  text,
  toggle,
} from '../lib/styleTokens';

function getCapabilitiesByLayer(layerId) {
  return capabilities[layerId] || [];
}

function getCapabilitiesBySubLayer(layerId, subLayer) {
  return getCapabilitiesByLayer(layerId).filter((cap) => cap.subLayer === subLayer);
}

/** Sub-section header for AI Services (Orchestration / Cross-cutting / Core). */
function CollapsibleDividerHeader({ title, isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-card text-left ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
    >
      <span className={`${text.faint} shrink-0 flex items-center`} aria-hidden>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>
      <span className={`text-xs font-bold ${text.muted} uppercase tracking-wide shrink-0`}>
        {title}
      </span>
      <span className="flex-1 h-px bg-hair min-w-[1rem]" />
    </button>
  );
}

function CapabilityCard({
  capability,
  // layerColor retained on callers for props-flow stability; hue theming removed (DESIGN-LAW).
  compact = false,
  selectedCapabilities,
  detailLevel,
  expandedComponents,
  onConfigure,
  onDeepDive,
  onToggleExpanded,
  onRemove
}) {
  const availableCount = capability.options.filter(
    (o) => !isCapabilityOptionDisabled(capability, o.id, selectedCapabilities)
  ).length;
  const selectedOptionId = selectedCapabilities[capability.id];
  const isSelected = selectedOptionId !== undefined;
  const selectedOption = capability.options.find(o => o.id === selectedOptionId);
  const hasSubComponents = selectedOptionId && subComponents[selectedOptionId];
  const isExpanded = expandedComponents.has(selectedOptionId);

  if (!isSelected) {
    return (
      <button
        onClick={() => onConfigure(capability)}
        className={`${card.unselected} group ${compact ? 'p-2' : 'p-4'}`}
      >
        <div className="flex items-start gap-2">
          <Plus size={compact ? 12 : 16} className={`mt-0.5 opacity-50 group-hover:opacity-100 flex-shrink-0 ${text.faint} group-hover:text-accent`} />
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-bold uppercase tracking-wide ${text.faint} mb-1`}>
              Not selected
            </p>
            <h4 className={`font-bold ${text.ink} truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              {capability.name}
              {capability.required && (
                <span className={`ml-1 text-xs px-1 py-0.5 ${status.requiredBadge} rounded-card`}>
                  Req
                </span>
              )}
            </h4>
            {!compact && detailLevel === 2 && (
              <p className={`text-xs ${text.muted} mt-1 line-clamp-2`}>
                {capability.description}
              </p>
            )}
            {detailLevel === 2 && (
              <div className={`mt-1 text-xs ${text.faint}`}>
                {availableCount === capability.options.length
                  ? `${capability.options.length} option${capability.options.length !== 1 ? 's' : ''}`
                  : `${availableCount} of ${capability.options.length} options match current pairing`}
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
      className={`${status.completeCard} ${interactive.transitionAll} ${
        hasDeepDive ? card.selectedClickable : ''
      }`}
      role={hasDeepDive ? 'button' : undefined}
      tabIndex={hasDeepDive ? 0 : undefined}
      onClick={() => hasDeepDive && onDeepDive(selectedOptionId)}
      onKeyDown={(e) => {
        if (!hasDeepDive || e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDeepDive(selectedOptionId);
        }
      }}
      aria-label={`Selected: ${capability.name} — ${selectedOption?.name || ''}`}
    >
      <div className={`flex items-center gap-2 rounded-t-card ${compact ? 'px-2 py-1.5' : 'px-3 py-2'} ${status.completeBanner}`}>
        <CheckCircle2 size={compact ? 14 : 18} className="shrink-0 opacity-95" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className={`font-bold uppercase tracking-wide opacity-95 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
            Selected
          </div>
          <div className={`font-bold leading-tight truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {selectedOption?.name}
          </div>
        </div>
      </div>
      <div className={`${compact ? 'p-2' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex flex-1 min-w-0 items-start gap-1">
            {hasSubComponents && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpanded(selectedOptionId);
                }}
                className={`p-0.5 rounded-card ${interactive.hoverTint} flex-shrink-0 mt-0.5 ${interactive.transition} ${interactive.focusRing}`}
                title={isExpanded ? 'Collapse components' : 'Expand components'}
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="flex-shrink-0" />
                ) : (
                  <ChevronRight size={14} className="flex-shrink-0" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onConfigure(capability);
              }}
              className={`flex-1 min-w-0 text-left cursor-pointer hover:opacity-80 ${interactive.transition} ${interactive.focusRing}`}
              title="Change option"
            >
              <div className="flex items-center gap-1 mb-1">
                <h4 className={`font-bold ${text.ink} truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                  {capability.name}
                </h4>
                {selectedOption?.isCustomer && (
                  <Building2 size={compact ? 10 : 14} className={`${text.muted} flex-shrink-0`} title="Customer-provided" />
                )}
              </div>
              <div className={`font-semibold ${text.muted} truncate ${compact ? 'text-xs' : 'text-xs'}`}>
                {detailLevel === 2 ? `${selectedOption?.provider}: ${selectedOption?.name}` : selectedOption?.name}
              </div>
              {detailLevel === 2 && selectedOption?.status && (
                <div className={`text-xs ${text.faint} mt-0.5`}>
                  {selectedOption.status}
                </div>
              )}
            </button>
          </div>
          <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onConfigure(capability)}
              className={`p-1 rounded-card ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
              title={capability.required ? 'Change (required)' : 'Change'}
              aria-label="Change"
            >
              <X size={compact ? 10 : 14} />
            </button>
            {!capability.required && (
              <button
                type="button"
                onClick={() => onRemove(capability.id)}
                className={`p-1 rounded-card ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
                title="Remove"
                aria-label="Remove"
              >
                <Trash2 size={compact ? 10 : 14} />
              </button>
            )}
          </div>
        </div>
        {!compact && detailLevel === 2 && (
          <p className={`text-xs ${text.muted} line-clamp-1`}>
            {selectedOption?.description}
          </p>
        )}
      </div>

      {/* Sub-components (expanded) — hairline list, no nested bordered boxes */}
      {isExpanded && hasSubComponents && (
        <div className="border-t border-hair px-3 py-2 bg-tint">
          <div className={`text-xs font-semibold ${text.muted} mb-2`}>Components</div>
          <div className="divide-y divide-hair">
            {subComponents[selectedOptionId].components.map((comp) => (
              <div key={comp.id} className="py-2 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${text.ink}`}>
                      {comp.name}
                    </div>
                    <div className={`text-xs ${text.link}`}>
                      {comp.role}
                    </div>
                  </div>
                </div>
                <div className={`text-xs ${text.muted} mt-1`}>
                  {comp.description}
                </div>
                {comp.stages && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {comp.stages.map((stage, idx) => (
                      <span key={idx} className={`text-xs px-2 py-0.5 bg-surface border border-hair ${text.muted} rounded-card`}>
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
}

function ServicesLayerContent({ layerId, layerColor, servicesSubOpen, onToggleSub, cardProps }) {
  const coreBase = getCapabilitiesBySubLayer(layerId, 'core').filter((c) => c.position === 'base');
  const coreAdjacent = getCapabilitiesBySubLayer(layerId, 'core').filter((c) => c.position === 'adjacent');
  const wrapper = getCapabilitiesBySubLayer(layerId, 'wrapper');
  const orchestration = getCapabilitiesBySubLayer(layerId, 'orchestration');

  const hasCore = coreBase.length > 0 || coreAdjacent.length > 0;
  const hasWrapper = wrapper.length > 0;
  const hasOrchestration = orchestration.length > 0;

  return (
    <div className="space-y-3">
      {hasOrchestration && (
        <div className="space-y-2">
          <CollapsibleDividerHeader
            title="Orchestration Layer"
            isOpen={servicesSubOpen.orchestration}
            onToggle={() => onToggleSub('orchestration')}
          />
          {servicesSubOpen.orchestration && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {orchestration.map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact {...cardProps} />
              ))}
            </div>
          )}
          {hasWrapper && servicesSubOpen.orchestration && (
            <div className="flex justify-center">
              <ArrowDown size={16} className={text.faint} />
            </div>
          )}
        </div>
      )}

      {hasWrapper && (
        <div className="space-y-2">
          <CollapsibleDividerHeader
            title="Cross-Cutting Concerns"
            isOpen={servicesSubOpen.wrapper}
            onToggle={() => onToggleSub('wrapper')}
          />
          {servicesSubOpen.wrapper && (
            <div className="grid grid-cols-2 gap-2">
              {wrapper.map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact {...cardProps} />
              ))}
            </div>
          )}
          {hasCore && servicesSubOpen.wrapper && (
            <div className="flex justify-center">
              <ArrowDown size={16} className={text.faint} />
            </div>
          )}
        </div>
      )}

      {hasCore && (
        <div className="space-y-2">
          <CollapsibleDividerHeader
            title="Core Services"
            isOpen={servicesSubOpen.core}
            onToggle={() => onToggleSub('core')}
          />
          {servicesSubOpen.core && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {coreBase.map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact={false} {...cardProps} />
              ))}
              {coreAdjacent.map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact {...cardProps} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CapabilityArchitectureView({ selectedCapabilities, setSelectedCapabilities }) {
  // selectedCapabilities passed as props now
  const [exportMessage, setExportMessage] = useState('');
  const [configuringCapability, setConfiguringCapability] = useState(null);
  const [deepDiveOption, setDeepDiveOption] = useState(null);
  const [detailLevel, setDetailLevel] = useState(2); // 1: basic, 2: technical
  const [viewOrder, setViewOrder] = useState('bottom-up'); // 'bottom-up' or 'top-down'
  const [expandedComponents, setExpandedComponents] = useState(new Set());
  const [showFlowViz, setShowFlowViz] = useState(false);
  const [stackImageBusy, setStackImageBusy] = useState(false);
  const [layerExpanded, setLayerExpanded] = useState(() =>
    Object.fromEntries(capabilityLayers.map((l) => [l.id, true]))
  );
  const [servicesSubOpen, setServicesSubOpen] = useState({
    orchestration: true,
    wrapper: true,
    core: true
  });

  const toggleLayerExpanded = (layerId) => {
    setLayerExpanded((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const toggleServicesSub = (key) => {
    setServicesSubOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isCapabilitySelected = (capabilityId) => {
    return selectedCapabilities[capabilityId] !== undefined;
  };

  const getSelectedOption = (capabilityId) => {
    return selectedCapabilities[capabilityId];
  };

  const selectCapabilityOption = (capabilityId, optionId) => {
    setSelectedCapabilities(prev => {
      const cap = Object.values(capabilities)
        .flat()
        .find((c) => c.id === capabilityId);
      if (cap && isCapabilityOptionDisabled(cap, optionId, prev)) return prev;
      return reconcileContainerAiPlatform({
        ...prev,
        [capabilityId]: optionId
      });
    });
    setConfiguringCapability(null);
  };

  const removeCapability = (capabilityId) => {
    setSelectedCapabilities(prev => {
      const updated = { ...prev };
      delete updated[capabilityId];
      return reconcileContainerAiPlatform(updated);
    });
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
    setSelectedCapabilities(reconcileContainerAiPlatform(basicStack));
  };

  const clearEntireStack = () => {
    setSelectedCapabilities(reconcileContainerAiPlatform({}));
    setExportMessage('');
  };

  const totalSelected = Object.keys(selectedCapabilities).length;

  // Shared props for the module-scope CapabilityCard (state + handlers it used to close over).
  const cardProps = {
    selectedCapabilities,
    detailLevel,
    expandedComponents,
    onConfigure: setConfiguringCapability,
    onDeepDive: setDeepDiveOption,
    onToggleExpanded: toggleExpanded,
    onRemove: removeCapability
  };

  const handleDownloadStackPng = useCallback(async () => {
    const el = document.getElementById('stack-capture-root');
    if (!el || stackImageBusy) return;
    setStackImageBusy(true);
    try {
      // Lazy-load the export library so it stays out of the main bundle.
      const { toPng } = await import('html-to-image');
      const isDark = document.documentElement.classList.contains('dark');
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: isDark ? '#111827' : '#f3f4f6'
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ai-stack-${new Date().toISOString().slice(0, 10)}.png`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setExportMessage('');
    } catch (err) {
      console.error('PNG export failed:', err);
      setExportMessage('Export failed. Try again.');
    } finally {
      setStackImageBusy(false);
    }
  }, [stackImageBusy]);

  return (
    <div className="space-y-6">
      {/* Header — one surface */}
      <div className="rounded-card border border-edge bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-semibold uppercase tracking-wide ${text.faint} mb-1`}>
              Architecture exploration
            </p>
            <h2 className={`font-display text-xl font-bold ${text.ink}`}>Build Your AI Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={loadBasicInferenceStack}
              className={button.primary}
              title="Load starter stack"
            >
              <Sparkles size={14} />
              Quick Start
            </button>
            <button
              type="button"
              onClick={handleDownloadStackPng}
              disabled={stackImageBusy}
              className={button.secondary}
              title="Export as PNG"
            >
              <Image size={14} />
              {stackImageBusy ? 'Working…' : 'Export Stack'}
            </button>
            {totalSelected > 0 && (
              <button
                type="button"
                onClick={clearEntireStack}
                className={button.secondary}
                title="Clear all"
              >
                <RotateCcw size={14} />
                Clear stack
              </button>
            )}
            {totalSelected > 0 && (
              <button
                type="button"
                onClick={() => setShowFlowViz(true)}
                className={button.secondary}
              >
                <Workflow size={14} />
                Architecture flow
              </button>
            )}
          </div>
        </div>
        {exportMessage && (
          <p className={`text-xs ${text.muted} mb-3`}>{exportMessage}</p>
        )}
        <div className="pt-3 mt-1 border-t border-hair">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${text.muted}`}>Detail Level:</span>
              <div className="flex gap-1">
                {[
                  { level: 1, label: 'Basic' },
                  { level: 2, label: 'Technical' }
                ].map(({ level, label }) => (
                  <button
                    key={level}
                    onClick={() => setDetailLevel(level)}
                    className={`px-3 py-1 rounded-card text-xs font-medium ${interactive.transition} ${interactive.focusRing} ${
                      detailLevel === level ? toggle.active : toggle.inactive
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Order Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${text.muted}`}>View:</span>
              <button
                type="button"
                onClick={() => setViewOrder(viewOrder === 'bottom-up' ? 'top-down' : 'bottom-up')}
                className={`flex items-center gap-2 px-3 py-1 rounded-card text-xs font-medium ${toggle.inactive} ${interactive.transition} ${interactive.focusRing}`}
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
      </div>

      {/* Stack — #stack-capture-root is the PNG capture region (layers + legend) */}
      <div
        id="stack-capture-root"
        className="rounded-card bg-tint p-8"
      >
        <div className="max-w-5xl mx-auto space-y-1">
          {/* Render layers based on viewOrder */}
          {(viewOrder === 'bottom-up' ? [...capabilityLayers].reverse() : capabilityLayers).map((layer, index) => {
            const layerCapabilities = getCapabilitiesByLayer(layer.id);
            const selectedCount = layerCapabilities.filter(cap => isCapabilitySelected(cap.id)).length;
            const isServicesLayer = layer.id === 'services';

            return (
              <div key={layer.id} className="relative">
                {/* Layer Container — one surface, no per-layer hue */}
                <div className="rounded-card border border-edge bg-surface">
                  {/* Layer Header (collapsible) */}
                  <button
                    type="button"
                    onClick={() => toggleLayerExpanded(layer.id)}
                    aria-expanded={layerExpanded[layer.id]}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing} ${
                      layerExpanded[layer.id] ? 'rounded-t-card border-b border-hair' : 'rounded-card'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`${text.muted} shrink-0 flex items-center`} aria-hidden>
                        {layerExpanded[layer.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </span>
                      <div className="w-1 h-8 rounded-full shrink-0 bg-accent" />
                      <div className="min-w-0">
                        <h3 className={`font-bold ${text.ink}`}>
                          {layer.name}
                        </h3>
                        <p className={`text-xs ${text.muted}`}>
                          {selectedCount} of {layerCapabilities.length} configured
                          {isServicesLayer && ' • Showing sub-layers'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 bg-tint ${text.faint}`}>
                      L{index + 1}
                    </div>
                  </button>

                  {/* Layer Content */}
                  {layerExpanded[layer.id] && (
                  <div className="p-4">
                    {isServicesLayer ? (
                      <ServicesLayerContent
                        layerId={layer.id}
                        layerColor={layer.color}
                        servicesSubOpen={servicesSubOpen}
                        onToggleSub={toggleServicesSub}
                        cardProps={cardProps}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {layerCapabilities.map(capability => (
                          <div key={capability.id} className="w-full md:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]">
                            <CapabilityCard
                              capability={capability}
                              layerColor={layer.color}
                              {...cardProps}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  )}
                </div>

                {/* Connection Arrow (except for top layer) */}
                {index < capabilityLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-0.5 h-4 bg-hair" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className={`mt-6 flex items-center justify-center gap-6 text-xs ${text.muted} flex-wrap`}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${providerMark.redHat} rounded-card`}></div>
            <span>Red Hat Solution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${providerMark.customer} rounded-card`}></div>
            <span>Customer Solution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${providerMark.partner} rounded-card`}></div>
            <span>Partner/Other</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDown size={12} />
            <span>AI Services shows sub-layers</span>
          </div>
        </div>
      </div>

      {configuringCapability && (
        <CapabilityConfigurationModal
          capability={configuringCapability}
          selectedCapabilities={selectedCapabilities}
          getSelectedOption={getSelectedOption}
          onBackdropClose={() => setConfiguringCapability(null)}
          onRemoveFromStack={(id) => {
            removeCapability(id);
            setConfiguringCapability(null);
          }}
          onSelectOption={selectCapabilityOption}
          onDeepDive={setDeepDiveOption}
        />
      )}

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
          selectedCapabilities={capabilityMapToFlowShape(selectedCapabilities)}
          onClose={() => setShowFlowViz(false)}
        />
      )}
    </div>
  );
}
