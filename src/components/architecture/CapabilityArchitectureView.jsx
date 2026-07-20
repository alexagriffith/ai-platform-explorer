import { useState, useCallback } from 'react';
import {
  Building2,
  Sparkles,
  X,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Workflow,
  RotateCcw,
  CheckCircle2,
  Image,
  Check,
  Plus
} from 'lucide-react';
import { capabilities, capabilityLayers } from '../../data/capabilities';
import { solutionDetails } from '../../data/solutionDetails';
import { subComponents } from '../../data/subComponents';
import DeepDiveModal from './DeepDiveModal';
import FlowVisualization from './FlowVisualization';
import { capabilityMapToFlowShape } from '../../lib/capabilityBlueprint';
import {
  reconcileContainerAiPlatform,
  isCapabilityOptionDisabled
} from '../../lib/platformAiConstraints';
import CapabilityConfigurationModal from './CapabilityConfigurationModal';
import {
  button,
  card,
  categoricalMark,
  density,
  interactive,
  legendChip,
  status,
  text,
  toggle,
  typeScale,
} from '../../lib/styleTokens';

/**
 * Returns Tailwind class strings for equal-width capability card grids.
 * grid: applied to the grid container; wrap: optional centering wrapper class.
 * All strings are complete literals so Tailwind JIT includes them.
 */
function capGridClass(count) {
  // wrap: centering container enforcing max card width ≤ 360px; w-full ensures block sizing.
  // Budget: N cols × 354px + (N-1) × 8px gap; stay well under 360px ceiling.
  // grid: 2 cols on mobile keeps cells ≥ 150px at 375px viewport.
  if (count <= 2) return { wrap: 'w-full', grid: 'grid grid-cols-2 gap-2' };
  if (count === 3) return { wrap: 'w-full max-w-[1078px] mx-auto', grid: 'grid grid-cols-2 sm:grid-cols-3 gap-2' };
  if (count === 4) return { wrap: 'w-full max-w-[1440px] mx-auto', grid: 'grid grid-cols-2 sm:grid-cols-4 gap-2' };
  // 5+: 2 cols on mobile, 3 default, 5 at lg
  return { wrap: 'w-full max-w-[1078px] mx-auto', grid: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2' };
}

/** Renders a responsive equal-width grid of CapabilityCard elements. */
function CapGrid({ count, indent, children }) {
  const { wrap, grid } = capGridClass(count);
  const inner = <div className={grid}>{children}</div>;
  // Indent collapses at narrow viewports to prevent card width falling below 150px minimum.
  const indented = indent ? <div className="sm:pl-4">{inner}</div> : inner;
  return wrap ? <div className={wrap}>{indented}</div> : indented;
}

/** Map option provider string to a categoricalMark key. */
function providerMarkKey(option) {
  if (!option) return 'customer';
  if (option.isCustomer) return 'customer';
  if (option.provider === 'Red Hat') return 'redHat';
  if (option.provider === 'Customer') return 'customer';
  if (option.provider === 'Open Source') return 'openSource';
  // Unknown/unrecognized providers default to neutral customer mark
  if (!option.provider) return 'customer';
  return 'partner';
}

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
      data-ui="section-header"
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`flex w-full items-center gap-2 pl-4 pr-2 py-1.5 rounded-card text-left ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
    >
      <span className={`${text.faint} shrink-0 flex items-center`} aria-hidden>
        {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </span>
      <span className={`${typeScale.groupLabel} ${text.faint} shrink-0`}>
        {title}
      </span>
      <span className="flex-1 h-px bg-hair min-w-[1rem]" />
    </button>
  );
}

function CapabilityCard({
  capability,
  // layerColor/compact retained on callers for props-flow stability; hue/size theming removed (DESIGN-LAW density pass).
  // eslint-disable-next-line no-unused-vars
  compact: _compact,
  selectedCapabilities,
  expandedComponents,
  onConfigure,
  onDeepDive,
  onToggleExpanded,
  onRemove,
  uiExempt,
}) {
  const selectedOptionId = selectedCapabilities[capability.id];
  const isSelected = selectedOptionId !== undefined;
  const selectedOption = capability.options.find(o => o.id === selectedOptionId);
  const hasSubComponents = selectedOptionId && subComponents[selectedOptionId];
  const isExpanded = expandedComponents.has(selectedOptionId);

  if (!isSelected) {
    return (
      <button
        data-ui="card"
        data-capability={capability.id}
        data-ui-exempt={uiExempt || undefined}
        onClick={() => onConfigure(capability)}
        aria-label={`Configure ${capability.name}`}
        className={`${card.unselected} group px-2 py-2 w-full h-full`}
      >
        <div className="flex flex-col items-center text-center gap-1 min-h-0">
          <h4 className={`${typeScale.componentName} ${text.ink}`}>
            {capability.name}
            {capability.required && (
              <span className={`ml-1 px-1 py-0.5 ${typeScale.microFaint} ${status.requiredBadge} rounded-card`}>
                Req
              </span>
            )}
          </h4>
          <Plus
            size={14}
            className={`${text.faint} group-hover:text-link ${interactive.transition}`}
            aria-hidden
          />
        </div>
      </button>
    );
  }

  const hasDeepDive = selectedOption?.provider === 'Red Hat' && solutionDetails[selectedOptionId];
  const markClass = categoricalMark[providerMarkKey(selectedOption)];

  return (
    <div
      data-ui="card"
      data-capability={capability.id}
      data-ui-exempt={uiExempt || undefined}
      className={`rounded-card bg-surface h-full flex flex-col ${interactive.transitionAll} ${markClass}`}
    >
      {/* Identity — click = configure/change. Left-aligned block: icon · name · chosen option. */}
      <div className="flex items-start gap-1">
        <button
          type="button"
          onClick={() => onConfigure(capability)}
          className={`flex-1 min-w-0 flex items-start gap-2 px-2 py-1.5 rounded-tl-card text-left ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
          title={`Change ${capability.name}`}
          aria-label={`Change: ${capability.name} — currently ${selectedOption?.name || ''}`}
        >
          <CheckCircle2 size={12} className="text-green-600 shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className={`${typeScale.componentName} ${text.ink}`}>
              {capability.name}
              {selectedOption?.isCustomer && (
                <Building2 size={10} className={`inline ml-1 mb-0.5 ${text.muted}`} title="Customer-provided" />
              )}
            </div>
            <div className={`${typeScale.caption} ${text.muted} truncate`}>
              {selectedOption?.name}
            </div>
          </div>
        </button>
        {hasSubComponents && (
          <button
            type="button"
            onClick={() => onToggleExpanded(selectedOptionId)}
            className={`p-1.5 rounded-tr-card ${interactive.hoverTint} flex-shrink-0 ${interactive.transition} ${interactive.focusRing}`}
            title={isExpanded ? 'Collapse components' : 'Expand components'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown size={12} className="flex-shrink-0" />
            ) : (
              <ChevronRight size={12} className="flex-shrink-0" />
            )}
          </button>
        )}
      </div>
      {/* Footer — status (left) and actions (right) on one line, pinned to the bottom edge. */}
      <div className="mt-auto px-2 py-1 flex items-center gap-2 border-t border-hair">
        {selectedOption?.status && (
          <span className={`${typeScale.caption} ${text.faint}`}>
            {selectedOption.status}
          </span>
        )}
        <div className="ml-auto flex items-center gap-3">
          {hasDeepDive && (
            <button
              type="button"
              onClick={() => onDeepDive(selectedOptionId)}
              className={`${typeScale.caption} font-medium ${text.link} underline underline-offset-2 hover:no-underline ${interactive.transition} ${interactive.focusRing} rounded-sm`}
            >
              Details
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(capability.id); }}
            className={`flex items-center gap-1 ${typeScale.caption} font-medium text-faint hover:text-ink ${interactive.transition} ${interactive.focusRing} rounded-sm`}
            title="Remove from stack"
            aria-label={`Remove ${capability.name} from stack`}
          >
            <X size={10} aria-hidden />
            Remove
          </button>
        </div>
      </div>

      {/* Sub-components (expanded) — hairline list */}
      {isExpanded && hasSubComponents && (
        <div className="border-t border-hair px-2 py-1 bg-tint">
          <div className={`${typeScale.groupLabel} ${text.faint} mb-1`}>Components</div>
          <div className="divide-y divide-hair">
            {subComponents[selectedOptionId].components.map((comp) => (
              <div key={comp.id} className="py-1 first:pt-0 last:pb-0">
                <div className={`${typeScale.secondary} font-semibold ${text.ink}`}>{comp.name}</div>
                <div className={`${typeScale.meta} ${text.link}`}>{comp.role}</div>
                {comp.description && (
                  <div className={`${typeScale.meta} ${text.muted}`}>{comp.description}</div>
                )}
                {comp.stages && (
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {comp.stages.map((stage, idx) => (
                      <span key={idx} className={`${typeScale.meta} px-1.5 py-0.5 bg-surface border border-hair ${text.muted} rounded-card`}>
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
    <div className={density.stackGap}>
      {hasOrchestration && (
        <div className={density.stackGap}>
          <CollapsibleDividerHeader
            title="Orchestration Layer"
            isOpen={servicesSubOpen.orchestration}
            onToggle={() => onToggleSub('orchestration')}
          />
          {servicesSubOpen.orchestration && (
            <CapGrid count={orchestration.length} indent>
              {orchestration.map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact {...cardProps} />
              ))}
            </CapGrid>
          )}
          {hasWrapper && servicesSubOpen.orchestration && (
            <div className="flex justify-center">
              <ArrowDown size={14} className={text.faint} />
            </div>
          )}
        </div>
      )}

      {hasWrapper && (
        <div className={density.stackGap}>
          <CollapsibleDividerHeader
            title="Cross-Cutting Concerns"
            isOpen={servicesSubOpen.wrapper}
            onToggle={() => onToggleSub('wrapper')}
          />
          {servicesSubOpen.wrapper && (
            <CapGrid count={wrapper.length} indent>
              {wrapper.map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact {...cardProps} />
              ))}
            </CapGrid>
          )}
          {hasCore && servicesSubOpen.wrapper && (
            <div className="flex justify-center">
              <ArrowDown size={14} className={text.faint} />
            </div>
          )}
        </div>
      )}

      {hasCore && (
        <div className={density.stackGap}>
          <CollapsibleDividerHeader
            title="Core Services"
            isOpen={servicesSubOpen.core}
            onToggle={() => onToggleSub('core')}
          />
          {servicesSubOpen.core && (
            <CapGrid count={coreBase.length + coreAdjacent.length} indent>
              {[...coreBase, ...coreAdjacent].map((cap) => (
                <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact {...cardProps} />
              ))}
            </CapGrid>
          )}
        </div>
      )}
    </div>
  );
}

export default function CapabilityArchitectureView({ selectedCapabilities, setSelectedCapabilities }) {
  // selectedCapabilities passed as props now
  const [exportMessage, setExportMessage] = useState('');
  const [exportDone, setExportDone] = useState(false);
  const [configuringCapability, setConfiguringCapability] = useState(null);
  const [deepDiveOption, setDeepDiveOption] = useState(null);
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
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2000);
    } catch (err) {
      console.error('PNG export failed:', err);
      setExportMessage('Export failed. Try again.');
    } finally {
      setStackImageBusy(false);
    }
  }, [stackImageBusy]);

  return (
    <div className="space-y-3">
      {/* Header — one surface */}
      <div data-ui="card" className="rounded-card bg-surface px-3 py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className={`font-display ${typeScale.cardTitle} ${text.ink}`}>Build Your AI Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0 items-center">
            <button
              data-ui="chip"
              type="button"
              onClick={() => setViewOrder(viewOrder === 'bottom-up' ? 'top-down' : 'bottom-up')}
              className={`flex items-center gap-1 ${toggle.base} ${toggle.inactive} ${interactive.transition} ${interactive.focusRing}`}
            >
              {viewOrder === 'bottom-up' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              {viewOrder === 'bottom-up' ? 'Infra at bottom' : 'Infra at top'}
            </button>
            <button
              data-ui="control"
              type="button"
              onClick={loadBasicInferenceStack}
              className={button.primaryCompact}
              title="Load starter stack"
            >
              <Sparkles size={12} />
              Quick Start
            </button>
            <button
              data-ui="control"
              type="button"
              onClick={handleDownloadStackPng}
              disabled={stackImageBusy}
              className={button.secondaryCompact}
              title="Export PNG"
            >
              {exportDone
                ? <><Check size={12} className="motion-reduce:hidden" />Exported</>
                : <><Image size={12} />{stackImageBusy ? 'Working…' : 'Export PNG'}</>
              }
            </button>
            {totalSelected > 0 && (
              <button
                data-ui="control"
                type="button"
                onClick={clearEntireStack}
                className={button.secondaryCompact}
                title="Clear all"
              >
                <RotateCcw size={12} />
                Clear stack
              </button>
            )}
            {totalSelected > 0 && (
              <button
                data-ui="control"
                type="button"
                onClick={() => setShowFlowViz(true)}
                className={button.secondaryCompact}
              >
                <Workflow size={12} />
                Architecture flow
              </button>
            )}
          </div>
        </div>
        {exportMessage && (
          <p className={`${typeScale.caption} ${text.muted}`}>{exportMessage}</p>
        )}
      </div>

      {/* Stack — #stack-capture-root is the PNG capture region (layers + legend) */}
      <div
        data-ui="card"
        id="stack-capture-root"
        className="rounded-card bg-tint p-2"
      >
        <div className="space-y-1">
          {(viewOrder === 'bottom-up' ? [...capabilityLayers].reverse() : capabilityLayers).map((layer, index) => {
            const layerCapabilities = getCapabilitiesByLayer(layer.id);
            const isServicesLayer = layer.id === 'services';

            return (
              <div key={layer.id} className="relative">
                <div data-ui="card" className="rounded-card bg-surface">
                  {/* Layer Header (collapsible) */}
                  <button
                    data-ui="section-header"
                    type="button"
                    onClick={() => toggleLayerExpanded(layer.id)}
                    aria-expanded={layerExpanded[layer.id]}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left cursor-pointer ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing} ${
                      layerExpanded[layer.id] ? 'rounded-t-card border-b border-hair' : 'rounded-card'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`${text.faint} shrink-0 flex items-center`} aria-hidden>
                        {layerExpanded[layer.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                      <div className="w-0.5 h-5 rounded-card shrink-0 bg-accent" />
                      <div className="min-w-0">
                        <h3 className={`${typeScale.componentName} ${text.ink}`}>{layer.name}</h3>
                      </div>
                    </div>
                    <div data-ui="chip" className={`px-2 py-0.5 rounded-card ${typeScale.meta} font-bold shrink-0 bg-tint ${text.faint}`}>
                      L{index + 1}
                    </div>
                  </button>

                  {layerExpanded[layer.id] && (
                    <div className="p-2">
                      {isServicesLayer ? (
                        <ServicesLayerContent
                          layerId={layer.id}
                          layerColor={layer.color}
                          servicesSubOpen={servicesSubOpen}
                          onToggleSub={toggleServicesSub}
                          cardProps={cardProps}
                        />
                      ) : (
                        <CapGrid count={layerCapabilities.length}>
                          {layerCapabilities.map(capability => (
                            <CapabilityCard
                              key={capability.id}
                              capability={capability}
                              layerColor={layer.color}
                              compact
                              uiExempt={layerCapabilities.length <= 2 ? 'full-row' : undefined}
                              {...cardProps}
                            />
                          ))}
                        </CapGrid>
                      )}
                    </div>
                  )}
                </div>

                {index < capabilityLayers.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <div className="w-px h-3 bg-hair" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Categorical legend — colored marks + meanings; only shown when at least one selection is active */}
        {Object.keys(selectedCapabilities).length > 0 && (
        <div className="mt-3 pt-2 border-t border-hair flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={legendChip.redHat} />
            <span className={`${typeScale.meta} ${text.muted}`}>Red Hat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={legendChip.openSource} />
            <span className={`${typeScale.meta} ${text.muted}`}>Open source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={legendChip.partner} />
            <span className={`${typeScale.meta} ${text.muted}`}>Partner / hardware</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={legendChip.customer} />
            <span className={`${typeScale.meta} ${text.muted}`}>Customer / optional</span>
          </div>
        </div>
        )}
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
