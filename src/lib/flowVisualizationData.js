import { Cpu, Layers, Network, Workflow, Database } from 'lucide-react';
import { capabilities } from '../data/capabilities';

const LAYER_ORDER = ['infrastructure', 'platform', 'services', 'application'];

const LAYER_TEMPLATES = {
  infrastructure: { layer: 'Infrastructure', layerId: 'infrastructure', color: '#F59E0B', components: [] },
  platform: { layer: 'Platform', layerId: 'platform', color: '#10B981', components: [] },
  services: { layer: 'AI Services', layerId: 'services', color: '#06B6D4', components: [] },
  application: { layer: 'Application', layerId: 'application', color: '#8B5CF6', components: [] }
};

/**
 * Workshop-oriented relationships (not validation). Shown when both endpoints exist in the flow.
 * required: solid emphasis; optional: dashed / softer.
 */
export const FLOW_STRUCTURAL_EDGES = [
  { from: 'gateway', to: 'model-serving', required: false, label: 'Routes inference traffic' },
  { from: 'gen-ai-tools', to: 'vector-db', required: false, label: 'Grounds prompts in your embeddings' },
  { from: 'orchestration', to: 'model-serving', required: false, label: 'Workflows invoke served models' },
  { from: 'model-serving', to: 'ai-platform', required: true, label: 'Serving lifecycle on the ML platform' },
  { from: 'ai-platform', to: 'container-platform', required: true, label: 'ML platform runs on this runtime' },
  { from: 'model-registry', to: 'model-serving', required: false, label: 'Stores model artifacts for serving' },
  { from: 'vector-db', to: 'model-serving', required: false, label: 'Feeds retrieval context into inference' },
  { from: 'observability', to: 'model-serving', required: false, label: 'Surfaces metrics around serving' },
  { from: 'evaluation', to: 'model-serving', required: false, label: 'Benchmarks models in production context' },
  { from: 'mcp', to: 'model-serving', required: false, label: 'Tool calls complement model endpoints' },
  { from: 'governance', to: 'model-serving', required: false, label: 'Risk and lineage alongside models' }
];

function capabilityMeta(layerId, capId) {
  const list = capabilities[layerId];
  const cap = list?.find((c) => c.id === capId);
  return cap ? { name: cap.name, description: cap.description } : { name: capId, description: '' };
}

function ensureLayer(flowAsc, layerId) {
  if (flowAsc.some((l) => l.layerId === layerId)) return;
  const template = LAYER_TEMPLATES[layerId];
  if (!template) return;
  const insertOrder = LAYER_ORDER.indexOf(layerId);
  let insertAt = flowAsc.length;
  for (let i = 0; i < flowAsc.length; i++) {
    const cur = LAYER_ORDER.indexOf(flowAsc[i].layerId);
    if (cur > insertOrder) {
      insertAt = i;
      break;
    }
  }
  flowAsc.splice(insertAt, 0, { ...template, components: [] });
}

function ghostComponent(layerId, capId, hint, type, Icon) {
  const meta = capabilityMeta(layerId, capId);
  return {
    id: capId,
    name: meta.name,
    optionId: null,
    description: meta.description,
    type: type || 'adjacent',
    icon: Icon || Database,
    isSuggested: true,
    suggestionHint: hint
  };
}

/** Who typically runs the plane — workshop cue, not a compliance label. */
function operationsStewardLabel(opt) {
  if (!opt || typeof opt !== 'object') return null;
  if (opt.isCustomer || opt.provider === 'Customer') return 'Customer-operated';
  if (opt.provider === 'Red Hat') return 'Red Hat on platform';
  return null;
}

/**
 * Optional pairing hints: ghost nodes only (neutral wording; not dependency errors).
 */
function collectGhostSpecs(nested) {
  const has = (layer, id) => Boolean(nested[layer]?.[id]);
  const optId = (layer, id) => nested[layer]?.[id]?.id;
  const specs = [];
  const seen = new Set();

  const push = (layerId, capId, hint, type, Icon) => {
    const key = `${layerId}:${capId}`;
    if (seen.has(key)) return;
    if (has(layerId, capId)) return;
    seen.add(key);
    specs.push({ layerId, capId, hint, type, icon: Icon });
  };

  const ai = optId('platform', 'ai-platform');
  const openshiftAiFamily = ai === 'rhoai' || ai === 'rhaie';

  if (has('application', 'gen-ai-tools') && optId('application', 'gen-ai-tools') === 'gen-ai-studio' && !has('services', 'vector-db')) {
    push('services', 'vector-db', 'Recommended for RAG-style workloads', 'adjacent', Database);
  } else if (has('services', 'model-serving') && !has('services', 'vector-db')) {
    push('services', 'vector-db', 'Adds a retrieval plane if prompts need your data', 'adjacent', Database);
  }

  if (has('services', 'model-serving') && ['rhoai', 'rhaie', 'rhai'].includes(ai) && !has('services', 'observability')) {
    push('services', 'observability', 'Often paired with observability when serving is in scope', 'wrapper', Workflow);
  }

  if (has('services', 'model-serving') && openshiftAiFamily && !has('services', 'model-registry')) {
    push('services', 'model-registry', 'Helps when models move toward production promotion', 'adjacent', Database);
  }

  if (has('services', 'model-serving') && !has('application', 'gateway')) {
    push('application', 'gateway', 'Often relevant when inference is exposed outside the cluster', 'adjacent', Network);
  }

  return specs;
}

function injectGhosts(flowAsc, nested) {
  const specs = collectGhostSpecs(nested);
  for (const spec of specs) {
    ensureLayer(flowAsc, spec.layerId);
    const layer = flowAsc.find((l) => l.layerId === spec.layerId);
    if (!layer) continue;
    if (layer.components.some((c) => c.id === spec.capId)) continue;
    layer.components.push(ghostComponent(spec.layerId, spec.capId, spec.hint, spec.type, spec.icon));
  }
}

/**
 * Serializable flow layers derived from the same nested shape FlowVisualization consumes
 * (output of capabilityMapToFlowShape / builtLayers flow shape).
 */
export function collectFlowLayersFromNested(selectedCapabilities) {
  const nested = selectedCapabilities && typeof selectedCapabilities === 'object' ? selectedCapabilities : {};
  const flow = [];

  if (nested.infrastructure?.['container-platform']) {
    const opt = nested.infrastructure['container-platform'];
    flow.push({
      layer: 'Infrastructure',
      layerId: 'infrastructure',
      color: '#F59E0B',
      components: [
        {
          id: 'container-platform',
          name: opt.name,
          optionId: opt.id,
          description: 'Container orchestration and resource management',
          icon: Cpu,
          operationsStewardLabel: operationsStewardLabel(opt)
        }
      ]
    });
  }

  if (nested.platform?.['ai-platform']) {
    const opt = nested.platform['ai-platform'];
    flow.push({
      layer: 'Platform',
      layerId: 'platform',
      color: '#10B981',
      components: [
        {
          id: 'ai-platform',
          name: opt.name,
          optionId: opt.id,
          description: 'AI/ML platform capabilities',
          icon: Layers,
          operationsStewardLabel: operationsStewardLabel(opt)
        }
      ]
    });
  }

  const serviceComponents = [];
  const pushSvc = (id, opt, description, type, Icon) => {
    if (!opt) return;
    serviceComponents.push({
      id,
      name: opt.name,
      optionId: opt.id,
      description,
      type,
      icon: Icon,
      operationsStewardLabel: operationsStewardLabel(opt)
    });
  };

  pushSvc(
    'model-serving',
    nested.services?.['model-serving'],
    'Inference requests from applications',
    'core',
    Network
  );
  pushSvc(
    'model-registry',
    nested.services?.['model-registry'],
    'Model versioning and metadata',
    'adjacent',
    Database
  );
  pushSvc(
    'vector-db',
    nested.services?.['vector-db'],
    'Semantic search for RAG',
    'adjacent',
    Database
  );
  if (nested.services?.observability) {
    const opt = nested.services.observability;
    serviceComponents.push({
      id: 'observability',
      name: opt.name,
      optionId: opt.id,
      description: 'Monitoring and metrics',
      type: 'wrapper',
      icon: Workflow,
      operationsStewardLabel: operationsStewardLabel(opt)
    });
  }
  if (nested.services?.governance) {
    const opt = nested.services.governance;
    serviceComponents.push({
      id: 'governance',
      name: opt.name,
      optionId: opt.id,
      description: 'Compliance and explainability',
      type: 'wrapper',
      icon: Workflow,
      operationsStewardLabel: operationsStewardLabel(opt)
    });
  }
  if (nested.services?.mcp) {
    const opt = nested.services.mcp;
    serviceComponents.push({
      id: 'mcp',
      name: opt.name,
      optionId: opt.id,
      description: 'Connect to external tools',
      type: 'orchestration',
      icon: Network,
      operationsStewardLabel: operationsStewardLabel(opt)
    });
  }
  if (nested.services?.evaluation) {
    const opt = nested.services.evaluation;
    serviceComponents.push({
      id: 'evaluation',
      name: opt.name,
      optionId: opt.id,
      description: 'Model quality validation',
      type: 'orchestration',
      icon: Workflow,
      operationsStewardLabel: operationsStewardLabel(opt)
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

  const appComponents = [];
  if (nested.application?.gateway) {
    const opt = nested.application.gateway;
    appComponents.push({
      id: 'gateway',
      name: opt.name,
      optionId: opt.id,
      description: 'API routing, auth, rate limiting',
      icon: Network,
      operationsStewardLabel: operationsStewardLabel(opt)
    });
  }
  if (nested.application?.orchestration) {
    const opt = nested.application.orchestration;
    appComponents.push({
      id: 'orchestration',
      name: opt.name,
      optionId: opt.id,
      description: 'Multi-step AI workflows',
      icon: Workflow,
      operationsStewardLabel: operationsStewardLabel(opt)
    });
  }
  if (nested.application?.['gen-ai-tools']) {
    const opt = nested.application['gen-ai-tools'];
    appComponents.push({
      id: 'gen-ai-tools',
      name: opt.name,
      optionId: opt.id,
      description: 'Prompt testing and experimentation',
      icon: Layers,
      operationsStewardLabel: operationsStewardLabel(opt)
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

  injectGhosts(flow, nested);
  return flow.reverse();
}

export function buildFlowComponentIndexMap(flow) {
  const m = new Map();
  flow.forEach((layer, idx) => {
    for (const c of layer.components) m.set(c.id, idx);
  });
  return m;
}

export function collectFlowStructuralEdges(flow) {
  const ids = new Set();
  flow.forEach((l) => l.components.forEach((c) => ids.add(c.id)));
  return FLOW_STRUCTURAL_EDGES.filter((e) => ids.has(e.from) && ids.has(e.to));
}

/** Edges whose endpoints both live in the same layer (for inline row hints). */
export function collectSameLayerStructuralEdges(flow, edges) {
  const idx = buildFlowComponentIndexMap(flow);
  return edges.filter((e) => idx.get(e.from) === idx.get(e.to));
}

/** Edges crossing the gap directly below `layerIndex` (between layerIndex and layerIndex+1). */
export function collectBridgeStructuralEdges(flow, edges, layerIndex) {
  const idx = buildFlowComponentIndexMap(flow);
  return edges.filter((e) => {
    const a = idx.get(e.from);
    const b = idx.get(e.to);
    if (a === undefined || b === undefined) return false;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    return lo === layerIndex && hi === layerIndex + 1;
  });
}

/** Facilitator focus: focused id + immediate neighbors along structural edges. */
export function getFocusNeighborSet(focusedId, edges) {
  if (!focusedId) return null;
  const adj = new Map();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, new Set());
    if (!adj.has(e.to)) adj.set(e.to, new Set());
    adj.get(e.from).add(e.to);
    adj.get(e.to).add(e.from);
  }
  const out = new Set([focusedId]);
  for (const n of adj.get(focusedId) || []) out.add(n);
  return out;
}
