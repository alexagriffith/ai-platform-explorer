import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
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
      className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
    >
      <span className="text-gray-500 dark:text-gray-400 shrink-0 flex items-center" aria-hidden>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>
      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide shrink-0">
        {title}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 min-w-[1rem]" />
    </button>
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

  const CapabilityCard = ({ capability, layerColor, compact = false }) => {
    const availableCount = capability.options.filter(
      (o) => !isCapabilityOptionDisabled(capability, o.id, selectedCapabilities)
    ).length;
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
          } bg-gray-50/50 dark:bg-gray-900/30`}
          style={{ borderColor: layerColor + '55' }}
        >
          <div className="flex items-start gap-2">
            <Plus size={compact ? 12 : 16} className="mt-0.5 opacity-50 group-hover:opacity-100 flex-shrink-0" style={{ color: layerColor }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                Not selected
              </p>
              <h4 className={`font-bold text-gray-900 dark:text-white truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                {capability.name}
                {capability.required && (
                  <span className="ml-1 text-xs px-1 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                    Req
                  </span>
                )}
              </h4>
              {!compact && detailLevel === 2 && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {capability.description}
                </p>
              )}
              {detailLevel === 2 && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
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

    const selectedBannerClass = selectedOption?.isCustomer
      ? 'bg-blue-600 text-white border-b border-blue-700/80'
      : selectedOption?.provider === 'Red Hat'
        ? 'bg-emerald-600 text-white border-b border-emerald-800/80'
        : 'bg-purple-600 text-white border-b border-purple-800/80';

    return (
      <div
        className={`rounded-lg border-[3px] shadow-lg transition-all ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 ${
          selectedOption?.isCustomer
            ? 'bg-blue-50 border-blue-400 ring-blue-400/60 dark:bg-blue-950/40 dark:border-blue-500 dark:ring-blue-500/50'
            : selectedOption?.provider === 'Red Hat'
              ? 'bg-green-50 border-emerald-500 ring-emerald-500/50 dark:bg-emerald-950/35 dark:border-emerald-400 dark:ring-emerald-400/45'
              : 'bg-purple-50 border-purple-400 ring-purple-400/55 dark:bg-purple-950/40 dark:border-purple-400 dark:ring-purple-400/45'
        } ${hasDeepDive ? 'cursor-pointer hover:shadow-xl' : ''}`}
        style={{ borderLeftWidth: '6px', borderLeftColor: layerColor }}
        onClick={() => hasDeepDive && setDeepDiveOption(selectedOptionId)}
        aria-label={`Selected: ${capability.name} — ${selectedOption?.name || ''}`}
      >
        <div className={`flex items-center gap-2 rounded-t-md ${compact ? 'px-2 py-1.5' : 'px-3 py-2'} ${selectedBannerClass}`}>
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
                    toggleExpanded(selectedOptionId);
                  }}
                  className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0 mt-0.5"
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
                  setConfiguringCapability(capability);
                }}
                className="flex-1 min-w-0 text-left cursor-pointer hover:opacity-80"
                title="Change option"
              >
                <div className="flex items-center gap-1 mb-1">
                  <h4 className={`font-bold text-gray-900 dark:text-white truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                    {capability.name}
                  </h4>
                  {selectedOption?.isCustomer && (
                    <Building2 size={compact ? 10 : 14} className="text-blue-600 flex-shrink-0" title="Customer-provided" />
                  )}
                </div>
                <div className={`font-semibold text-gray-700 dark:text-gray-300 truncate ${compact ? 'text-xs' : 'text-xs'}`}>
                  {detailLevel === 2 ? `${selectedOption?.provider}: ${selectedOption?.name}` : selectedOption?.name}
                </div>
                {detailLevel === 2 && selectedOption?.status && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {selectedOption.status}
                  </div>
                )}
              </button>
            </div>
            <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setConfiguringCapability(capability)}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title={capability.required ? 'Change (required)' : 'Change'}
                aria-label="Change"
              >
                <X size={compact ? 10 : 14} />
              </button>
              {!capability.required && (
                <button
                  type="button"
                  onClick={() => removeCapability(capability.id)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="Remove"
                  aria-label="Remove"
                >
                  <Trash2 size={compact ? 10 : 14} />
                </button>
              )}
            </div>
          </div>
          {!compact && detailLevel === 2 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
              {selectedOption?.description}
            </p>
          )}
        </div>

        {/* Sub-components (expanded) */}
        {isExpanded && hasSubComponents && (
          <div className="border-t border-gray-300 dark:border-gray-600 px-3 py-2 bg-white/50 dark:bg-gray-900/50">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Components</div>
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
              onToggle={() => toggleServicesSub('orchestration')}
            />
            {servicesSubOpen.orchestration && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {orchestration.map((cap) => (
                  <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact />
                ))}
              </div>
            )}
            {hasWrapper && servicesSubOpen.orchestration && (
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        )}

        {hasWrapper && (
          <div className="space-y-2">
            <CollapsibleDividerHeader
              title="Cross-Cutting Concerns"
              isOpen={servicesSubOpen.wrapper}
              onToggle={() => toggleServicesSub('wrapper')}
            />
            {servicesSubOpen.wrapper && (
              <div className="grid grid-cols-2 gap-2">
                {wrapper.map((cap) => (
                  <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact />
                ))}
              </div>
            )}
            {hasCore && servicesSubOpen.wrapper && (
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        )}

        {hasCore && (
          <div className="space-y-2">
            <CollapsibleDividerHeader
              title="Core Services"
              isOpen={servicesSubOpen.core}
              onToggle={() => toggleServicesSub('core')}
            />
            {servicesSubOpen.core && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {coreBase.map((cap) => (
                  <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact={false} />
                ))}
                {coreAdjacent.map((cap) => (
                  <CapabilityCard key={cap.id} capability={cap} layerColor={layerColor} compact />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const totalSelected = Object.keys(selectedCapabilities).length;

  const handleDownloadStackPng = useCallback(async () => {
    const el = document.getElementById('stack-capture-root');
    if (!el || stackImageBusy) return;
    setStackImageBusy(true);
    try {
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
    } catch {
      setExportMessage('Export failed. Try again.');
    } finally {
      setStackImageBusy(false);
    }
  }, [stackImageBusy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Architecture exploration
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Build Your AI Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={loadBasicInferenceStack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
              title="Load starter stack"
            >
              <Sparkles size={14} />
              Quick Start
            </button>
            <button
              type="button"
              onClick={handleDownloadStackPng}
              disabled={stackImageBusy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:pointer-events-none"
              title="Export as PNG"
            >
              <Image size={14} />
              {stackImageBusy ? 'Working…' : 'Export Stack'}
            </button>
            {totalSelected > 0 && (
              <button
                type="button"
                onClick={clearEntireStack}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-all"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Workflow size={14} />
                Architecture flow
              </button>
            )}
          </div>
        </div>
        {exportMessage && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{exportMessage}</p>
        )}
        <div className="pt-3 mt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Detail Level:</span>
              <div className="flex gap-1">
                {[
                  { level: 1, label: 'Basic' },
                  { level: 2, label: 'Technical' }
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
                type="button"
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
      </div>

      {/* Stack — #stack-capture-root is the PNG capture region (layers + legend) */}
      <div
        id="stack-capture-root"
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700"
      >
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
                  {/* Layer Header (collapsible) */}
                  <button
                    type="button"
                    onClick={() => toggleLayerExpanded(layer.id)}
                    aria-expanded={layerExpanded[layer.id]}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:brightness-[0.98] dark:hover:brightness-110 transition-[filter] ${
                      layerExpanded[layer.id] ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${layer.color}15, ${layer.color}05)`,
                      borderBottom: layerExpanded[layer.id] ? `2px solid ${layer.color}30` : undefined
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-gray-600 dark:text-gray-300 shrink-0 flex items-center" aria-hidden>
                        {layerExpanded[layer.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </span>
                      <div
                        className="w-1 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <div className="min-w-0">
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
                      className="px-3 py-1 rounded-full text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: layer.color + '20',
                        color: layer.color
                      }}
                    >
                      L{index + 1}
                    </div>
                  </button>

                  {/* Layer Content */}
                  {layerExpanded[layer.id] && (
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
                  )}
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
