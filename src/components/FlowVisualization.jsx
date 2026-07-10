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

function nameById(flow, id) {
  for (const layer of flow) {
    const c = layer.components.find((x) => x.id === id);
    if (c) return c.name;
  }
  return id;
}

function LayerBridge({ edges }) {
  if (!edges?.length) {
    return (
      <div className="flex flex-col items-center py-4">
        <div className="w-px h-6 bg-gradient-to-b from-purple-500/40 to-blue-500/40 rounded-full" />
        <ArrowDown size={22} className="text-purple-400/60 -my-0.5" strokeWidth={2} />
        <div className="w-px h-6 bg-gradient-to-b from-blue-500/40 to-purple-500/40 rounded-full" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center py-3 gap-3 px-2 w-full">
      {edges.map((e) => (
        <div
          key={`${e.from}-${e.to}`}
          className="flex flex-col items-center gap-1.5 w-full max-w-lg"
          title={e.label}
        >
          <div
            className={`w-3/4 max-w-sm ${
              e.required ? 'border-t-2 border-emerald-400/85' : 'border-t-2 border-dashed border-cyan-400/55'
            }`}
          />
          <span className="text-[11px] text-center text-gray-400 leading-snug px-2">{e.label}</span>
          <ArrowDown size={18} className="text-purple-400/65 shrink-0" strokeWidth={2} />
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

  const typeClass =
    component.type === 'core'
      ? 'bg-blue-600 border-blue-700'
      : component.type === 'wrapper'
        ? 'bg-purple-600 border-purple-700'
        : component.type === 'orchestration'
          ? 'bg-green-600 border-green-700'
          : component.type === 'adjacent'
            ? 'bg-cyan-600 border-cyan-700'
            : 'bg-gray-700 border-gray-600';

  return (
    <div className={`relative transition-all duration-200 ${dimmed ? 'opacity-[0.22] scale-[0.98]' : ''}`}>
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
        className={`relative p-4 rounded-lg border-2 shadow-lg transition-all cursor-pointer hover:ring-2 hover:ring-white/25 ${
          isSuggested ? 'border-dashed border-cyan-300/70 ring-1 ring-cyan-400/30 bg-opacity-90' : ''
        } ${typeClass} ${resolvedFocusId === component.id ? 'ring-2 ring-amber-300/90 ring-offset-2 ring-offset-gray-900' : ''}`}
        style={{ minWidth: '200px', maxWidth: '280px' }}
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
            className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 z-[1]"
            aria-label={isExpanded ? 'Collapse internal view' : 'Expand internal components'}
          >
            {isExpanded ? (
              <Minimize2 size={16} className="text-white opacity-70" />
            ) : (
              <Maximize2 size={16} className="text-white opacity-70" />
            )}
          </button>
        )}
        <div className="flex items-start gap-3 mb-2 pr-6">
          <Icon size={20} className="text-white flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-sm mb-1 leading-tight">{component.name}</div>
            {isSuggested && component.suggestionHint && (
              <p className="text-[11px] text-cyan-100/90 leading-snug mb-1">{component.suggestionHint}</p>
            )}
            <div className="text-xs text-white/80">{component.description}</div>
            {component.operationsStewardLabel && (
              <div className="text-[10px] mt-1.5 text-white/70 border-t border-white/10 pt-1.5">
                {component.operationsStewardLabel}
              </div>
            )}
          </div>
        </div>
        {isSuggested && (
          <div className="text-[10px] uppercase tracking-wide text-cyan-200/80 border-t border-white/15 pt-2 mt-1">
            Not in current stack
          </div>
        )}
      </div>

      {isExpanded && hasSubComponents && (
        <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600" onClick={(e) => e.stopPropagation()}>
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Internal components</div>
          <div className="space-y-2">
            {subComponents[component.optionId].components.map((sub, idx) => (
              <div key={idx} className="p-2 bg-gray-700 rounded border border-gray-600 text-xs">
                <div className="font-semibold text-white">{sub.name}</div>
                <div className="text-gray-400 text-xs">{sub.role}</div>
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

  // Escape clears component focus first; when nothing is focused it closes the modal.
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
      // Lazy-load the export library so it stays out of the main bundle.
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(captureEl, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#1e40af'
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
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Architecture flow"
        className="bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Workflow size={32} />
                Architecture flow
              </h2>
              <p className="text-blue-100 text-sm max-w-2xl">
                Visual guide showing how components relate and connect in your AI stack.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleExportPng}
                disabled={exportingPng}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                {exportingPng ? 'Exporting...' : 'Export as PNG'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div id="flow-viz-capture" className="p-8 bg-gray-900">
          <div className="space-y-0">
            {flow.map((layer, idx) => (
              <div key={layer.layerId}>
                <div
                  className="rounded-lg border-2 p-6"
                  style={{ borderColor: layer.color, backgroundColor: layer.color + '10' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: layer.color }} />
                    <h3 className="text-xl font-bold text-white">{layer.layer}</h3>
                    <div className="flex-1 h-px" style={{ backgroundColor: layer.color + '40' }} />
                  </div>

                  <div className="flex items-center justify-center gap-4 flex-wrap">
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
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">In this layer</p>
                      {sameEdgesByLayerIndex.get(idx).map((e) => (
                        <p
                          key={`${e.from}-${e.to}`}
                          className="text-xs text-gray-300 leading-snug flex flex-wrap items-baseline gap-x-2 gap-y-1"
                          title={e.label}
                        >
                          <span className="text-white/90 font-medium">{nameById(flow, e.from)}</span>
                          <span
                            className={
                              e.required
                                ? 'text-emerald-300/90 font-mono text-[11px]'
                                : 'text-cyan-300/90 font-mono text-[11px] border-b border-dashed border-cyan-500/40'
                            }
                          >
                            {e.required ? '· spine ·' : '· optional ·'}
                          </span>
                          <span className="text-white/90 font-medium">{nameById(flow, e.to)}</span>
                          <span className="text-gray-500">· {e.label}</span>
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

          <div className="mt-8 p-5 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Layers size={18} />
              Legend & facilitation
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Between layers</p>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 border-t-2 border-emerald-400 shrink-0" />
                  <span>Solid = platform dependency (expected together)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 border-t-2 border-dashed border-cyan-400/60 shrink-0" />
                  <span>Dashed = common pairing (discussion-dependent)</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Components</p>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded border-2 border-blue-700 shrink-0" />
                  <span className="text-gray-300">Core service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-cyan-600 rounded border-2 border-dashed border-cyan-300 shrink-0" />
                  <span className="text-gray-300">Optional (dashed outline)</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-700 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <Crosshair size={16} className="text-gray-400 shrink-0" />
              <span>
                Click a box to <strong className="text-gray-200">focus</strong> it and its linked neighbors; press{' '}
                <kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200 text-xs">Esc</kbd> to clear.
              </span>
              {focusActive && (
                <button
                  type="button"
                  onClick={() => setFocusedId(null)}
                  className="ml-auto text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Clear focus
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 pt-1">
              <Maximize2 size={12} className="inline mr-1 align-text-bottom opacity-70" />
              Expand icon opens internal detail without changing focus. Hover a component for short relationship hints.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
