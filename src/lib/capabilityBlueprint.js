import { capabilities } from '../data/capabilities';

/**
 * Canonical stack selections in the app are stored as a flat map:
 *   { [capabilityId]: optionId }
 * This is the single source of truth for Build Your Stack, decision apply, and (when synced) Interactive Builder.
 * Runtime ↔ AI pairing plus workshop rules for Red Hat MCP (OpenShift-only) and Llama Stack distribution
 * (not on RHAI-only Kubernetes) are enforced in `src/lib/platformAiConstraints.js`.
 */

export function findLayerIdForCapability(capabilityId) {
  for (const [layerId, layerCaps] of Object.entries(capabilities)) {
    if (layerCaps.some((c) => c.id === capabilityId)) return layerId;
  }
  return null;
}

/** Merge per-layer wizard state into the flat capability map shape. */
export function flattenBuiltLayersToMap(builtLayers) {
  const out = {};
  if (!builtLayers || typeof builtLayers !== 'object') return out;
  for (const selections of Object.values(builtLayers)) {
    if (!selections || typeof selections !== 'object') continue;
    for (const [capId, optionId] of Object.entries(selections)) {
      out[capId] = optionId;
    }
  }
  return out;
}

/** Expand flat map into InteractiveBuilder's builtLayers shape (layerId -> { capId -> optionId }). */
export function expandCapabilityMapToBuiltLayers(flatMap) {
  const built = {};
  if (!flatMap || typeof flatMap !== 'object') return built;
  for (const [capId, optionId] of Object.entries(flatMap)) {
    const layerId = findLayerIdForCapability(capId);
    if (!layerId) continue;
    if (!built[layerId]) built[layerId] = {};
    built[layerId][capId] = optionId;
  }
  return built;
}

/** Shape expected by FlowVisualization: nested by layer with full option objects. */
export function capabilityMapToFlowShape(flatMap) {
  return Object.entries(flatMap || {}).reduce((acc, [capId, optionId]) => {
    for (const [layerId, layerCaps] of Object.entries(capabilities)) {
      const cap = layerCaps.find((c) => c.id === capId);
      if (cap) {
        const option = cap.options.find((o) => o.id === optionId);
        if (option) {
          if (!acc[layerId]) acc[layerId] = {};
          acc[layerId][capId] = option;
        }
        break;
      }
    }
    return acc;
  }, {});
}
