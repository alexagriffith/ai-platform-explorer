import { useState, useMemo, useEffect, useCallback } from 'react';
import { X, ArrowDown, Workflow, Maximize2, Minimize2, Download, Layers, Crosshair } from 'lucide-react';
import { subComponents } from '../data/subComponents';
import {
  collectFlowLayersFromNested,
  collectFlowStructuralEdges,
  collectSameLayerStructuralEdges,
  collectBridgeStructuralEdges,
  getFocusNeighborSet
} from '../lib/flowVisualizationData';
import { interactive, modal, text, button, categoricalMark, legendChip, typeScale } from '../lib/styleTokens';

function nameById(flow, id) {
  for (const layer of flow) {
    const c = layer.components.find((x) => x.id === id);
    if (c) return c.name;
  }
  return id;
}

/** Map component type to a categoricalMark key for the outline accent. */
function typeMarkKey(type) {
  if (type === 'core' || type === 'orchestration') return 'redHat';
  if (type === 'wrapper') return 'openSource';
  if (type === 'adjacent') return 'partner';
  return 'customer';
}

function LayerBridge({ edges }) {
  if (!edges?.length) {
    return (
      <div className="flex flex-col items-center py-2">
        <div className="w-px h-4 bg-hair" />
        <ArrowDown size={16} className={text.faint} strokeWidth={2} />
        <div className="w-px h-4 bg-hair" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center py-2 gap-2 px-2 w-full">
      {edges.map((e) => (
        <div
          key={`${e.from}-${e.to}`}
          className="flex flex-col items-center gap-1 w-full max-w-lg"
          title={e.label}
        >
          <div
            className={`w-3/4 max-w-sm ${
              e.required ? 'border-t-2 border-accent' : 'border-t-2 border-dashed border-edge'
            }`}
          />
          <span className={`${typeScale.meta} text-center ${text.faint} px-2`}>{e.label}</span>
          <ArrowDown size={14} className={text.faint} strokeWidth={2} />
        </div>
      ))}
    </div>
  );
}

function ComponentBox({
  component,
  canExpand,
  expandedComponent,
  onToggleExpand,
  focusActive,
  focusNeighborSet,
  resolvedFocusId,
  edgeHintsByNode,
  onCardClick
}) {
  const Icon = component.icon || Layers;
  const isExpanded = expandedComponent === component.id;
  const hasSubComponents = canExpand && subComponents[component.optionId];
  const dimmed = focusActive && focusNeighborSet && !focusNeighborSet.has(component.id);
  const isSuggested = Boolean(component.isSuggested);
  const edgeHint = edgeHintsByNode.get(component.id);
  const markKey = typeMarkKey(component.type);
  const markClass = categoricalMark[markKey];

  return (
    <div className={`relative transition-all duration-150 motion-reduce:transition-none ${dimmed ? 'opacity-30' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCardClick(component.id);
          }
        }}
        onClick={() => onCardClick(component.id)}
        className={`relative rounded-card bg-surface ${interactive.transition} ${interactive.focusRing} cursor-pointer hover:bg-tint ${markClass} ${
          isSuggested ? 'opacity-70' : ''
        } ${resolvedFocusId === component.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-page' : ''}`}
        style={{ minWidth: '160px', maxWidth: '240px' }}
        title={
          isSuggested
            ? [component.suggestionHint, edgeHint].filter(Boolean).join('\n\n')
            : [component.description, edgeHint].filter(Boolean).join('\n\n') || undefined
        }
      >
        {hasSubComponents && (
          <button
            type="button"
            data-expand-toggle
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(isExpanded ? null : component.id);
            }}
            className={`absolute top-1.5 right-1.5 p-0.5 rounded-card ${interactive.hoverTint} ${interactive.focusRing} z-[1]`}
            aria-label={isExpanded ? 'Collapse internal view' : 'Expand internal components'}
          >
            {isExpanded ? (
              <Minimize2 size={12} className={text.faint} />
            ) : (
              <Maximize2 size={12} className={text.faint} />
            )}
          </button>
        )}
        <div className="px-2 py-1.5 pr-6">
          <div className="flex items-start gap-1.5">
            <Icon size={14} className="text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className={`${typeScale.componentName} ${text.ink} mb-0.5`}>{component.name}</div>
              {isSuggested && component.suggestionHint && (
                <p className={`${typeScale.meta} ${text.muted} mb-0.5`}>{component.suggestionHint}</p>
              )}
              <div className={`${typeScale.secondary} ${text.muted}`}>{component.description}</div>
              {component.operationsStewardLabel && (
                <div className={`${typeScale.meta} ${text.faint} border-t border-hair pt-1 mt-1`}>
                  {component.operationsStewardLabel}
                </div>
              )}
            </div>
          </div>
          {isSuggested && (
            <div className={`${typeScale.meta} ${text.faint} border-t border-hair pt-1 mt-1`}>
              Not in current stack
            </div>
          )}
        </div>
      </div>

      {isExpanded && hasSubComponents && (
        <div className="mt-1.5 border border-hair rounded-card bg-tint" onClick={(e) => e.stopPropagation()}>
          <div className={`${typeScale.groupLabel} ${text.faint} px-2 py-1 border-b border-hair`}>Internal components</div>
          <div className="divide-y divide-hair">
            {subComponents[component.optionId].components.map((sub, idx) => (
              <div key={idx} className="px-2 py-1">
                <div className={`${typeScale.secondary} font-semibold ${text.ink}`}>{sub.name}</div>
                <div className={`${typeScale.meta} ${text.muted}`}>{sub.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlowVisualization({ selectedCapabilities, onClose }) {
  const [expandedComponent, setExpandedComponent] = useState(null);
  const [exportingPng, setExportingPng] = useState(false);
  const [focusedId, setFocusedId] = useState(null);

  const flow = useMemo(() => collectFlowLayersFromNested(selectedCapabilities), [selectedCapabilities]);
  const structuralEdges = useMemo(() => collectFlowStructuralEdges(flow), [flow]);
  const sameLayerEdges = useMemo(() => collectSameLayerStructuralEdges(flow, structuralEdges), [flow, structuralEdges]);

  const sameEdgesByLayerIndex = useMemo(() => {
    const map = new Map();
    for (const e of sameLayerEdges) {
      const fromLayer = flow.findIndex((l) => l.components.some((c) => c.id === e.from));
      if (fromLayer < 0) continue;
      if (!map.has(fromLayer)) map.set(fromLayer, []);
      map.get(fromLayer).push(e);
    }
    return map;
  }, [flow, sameLayerEdges]);

  const allFlowIds = useMemo(() => new Set(flow.flatMap((l) => l.components.map((c) => c.id))), [flow]);
  const resolvedFocusId = focusedId && allFlowIds.has(focusedId) ? focusedId : null;

  const focusNeighborSet = useMemo(
    () => getFocusNeighborSet(resolvedFocusId, structuralEdges),
    [resolvedFocusId, structuralEdges]
  );

  const focusActive = Boolean(resolvedFocusId);

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key !== 'Escape') return;
      if (focusedId) {
        setFocusedId(null);
      } else {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedId, onClose]);

  const edgeHintsByNode = useMemo(() => {
    const m = new Map();
    for (const e of structuralEdges) {
      const fromN = nameById(flow, e.from);
      const toN = nameById(flow, e.to);
      if (!m.has(e.from)) m.set(e.from, []);
      if (!m.has(e.to)) m.set(e.to, []);
      m.get(e.from).push(`→ ${toN}: ${e.label}`);
      m.get(e.to).push(`← ${fromN}: ${e.label}`);
    }
    for (const [k, arr] of m) {
      m.set(k, arr.slice(0, 4).join('\n'));
    }
    return m;
  }, [flow, structuralEdges]);

  const handleExportPng = useCallback(async () => {
    const captureEl = document.getElementById('flow-viz-capture');
    if (!captureEl) return;

    setExportingPng(true);
    try {
      const { toPng } = await import('html-to-image');
      const isDarkMode = document.documentElement.classList.contains('dark');
      const dataUrl = await toPng(captureEl, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: isDarkMode ? '#151515' : '#f2f2f2'
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `red-hat-ai-architecture-flow-${new Date().toISOString().split('T')[0]}.png`;
      a.click();
    } catch (err) {
      console.error('PNG export failed:', err);
    } finally {
      setExportingPng(false);
    }
  }, []);

  const handleCardClick = useCallback((componentId) => {
    setFocusedId((cur) => (cur === componentId ? null : componentId));
  }, []);

  return (
    <div
      className={modal.overlay}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Architecture flow"
        className="bg-surface rounded-panel border border-edge max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-hair bg-surface px-4 py-3 rounded-t-panel">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Workflow size={18} className="text-accent" />
              <h2 className={`font-bold ${text.ink}`}>Architecture flow</h2>
              <p className={`${typeScale.secondary} ${text.muted} hidden sm:block`}>
                How components relate and connect in your AI stack.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleExportPng}
                disabled={exportingPng}
                className={button.secondary}
              >
                <Download size={14} />
                {exportingPng ? 'Exporting…' : 'Export PNG'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-card ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
                aria-label="Close"
              >
                <X size={18} className={text.muted} />
              </button>
            </div>
          </div>
        </div>

        <div id="flow-viz-capture" className="p-4 bg-page">
          <div className="space-y-0">
            {flow.map((layer, idx) => (
              <div key={layer.layerId}>
                <div className="rounded-card border border-edge bg-surface px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-0.5 h-5 rounded-full bg-accent shrink-0" />
                    <h3 className={`${typeScale.groupLabel} ${text.ink}`}>{layer.layer}</h3>
                    <div className="flex-1 h-px bg-hair" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 justify-items-center">
                    {layer.components.map((component, cidx) => (
                      <ComponentBox
                        key={`${component.id}-${cidx}`}
                        component={component}
                        canExpand={true}
                        expandedComponent={expandedComponent}
                        onToggleExpand={setExpandedComponent}
                        focusActive={focusActive}
                        focusNeighborSet={focusNeighborSet}
                        resolvedFocusId={resolvedFocusId}
                        edgeHintsByNode={edgeHintsByNode}
                        onCardClick={handleCardClick}
                      />
                    ))}
                  </div>

                  {sameEdgesByLayerIndex.get(idx)?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-hair space-y-1">
                      <p className={`${typeScale.meta} font-semibold uppercase tracking-wide ${text.faint}`}>In this layer</p>
                      {sameEdgesByLayerIndex.get(idx).map((e) => (
                        <p
                          key={`${e.from}-${e.to}`}
                          className={`${typeScale.secondary} ${text.muted} flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5`}
                          title={e.label}
                        >
                          <span className={`font-medium ${text.ink}`}>{nameById(flow, e.from)}</span>
                          <span className={`font-mono ${typeScale.meta} ${e.required ? 'text-accent' : text.faint}`}>
                            {e.required ? '· spine ·' : '· optional ·'}
                          </span>
                          <span className={`font-medium ${text.ink}`}>{nameById(flow, e.to)}</span>
                          <span className={text.faint}>· {e.label}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {idx < flow.length - 1 && (
                  <LayerBridge edges={collectBridgeStructuralEdges(flow, structuralEdges, idx)} />
                )}
              </div>
            ))}
          </div>

          {/* Legend & facilitation */}
          <div className="mt-4 border-t border-hair pt-3 space-y-3">
            <div className="flex flex-wrap gap-4">
              {/* Categorical marks legend */}
              <div className="space-y-1.5">
                <p className={`${typeScale.meta} font-semibold uppercase tracking-wide ${text.faint}`}>Component type</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={legendChip.redHat} />
                    <span className={`${typeScale.secondary} ${text.muted}`}>Red Hat</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={legendChip.openSource} />
                    <span className={`${typeScale.secondary} ${text.muted}`}>Open source</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={legendChip.partner} />
                    <span className={`${typeScale.secondary} ${text.muted}`}>Partner / hardware</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={legendChip.customer} />
                    <span className={`${typeScale.secondary} ${text.muted}`}>Customer / optional</span>
                  </div>
                </div>
              </div>
              {/* Edge legend */}
              <div className="space-y-1.5">
                <p className={`${typeScale.meta} font-semibold uppercase tracking-wide ${text.faint}`}>Between layers</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 border-t-2 border-accent shrink-0" />
                    <span className={`${typeScale.secondary} ${text.muted}`}>Platform dependency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 border-t-2 border-dashed border-edge shrink-0" />
                    <span className={`${typeScale.secondary} ${text.muted}`}>Common pairing</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex flex-wrap items-center gap-2 ${typeScale.secondary} ${text.muted}`}>
              <Crosshair size={13} className={`${text.faint} shrink-0`} />
              <span>
                Click a box to <strong className={text.ink}>focus</strong> it and its linked neighbors; press{' '}
                <kbd className={`px-1 py-0.5 rounded-card border border-hair bg-tint ${text.muted} ${typeScale.meta}`}>Esc</kbd> to clear.
              </span>
              {focusActive && (
                <button
                  type="button"
                  onClick={() => setFocusedId(null)}
                  className={`ml-auto ${typeScale.secondary} font-semibold text-link hover:underline ${interactive.focusRing} rounded-card`}
                >
                  Clear focus
                </button>
              )}
            </div>
            <div className={`${typeScale.meta} ${text.faint}`}>
              <Maximize2 size={11} className="inline mr-1 align-text-bottom opacity-70" />
              Expand icon opens internal detail without changing focus. Hover a component for short relationship hints.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
