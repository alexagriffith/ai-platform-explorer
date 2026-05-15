import { describe, it, expect } from 'vitest';
import { collectFlowLayersFromNested } from './flowVisualizationData';
import { reconcileContainerAiPlatform, isCapabilityOptionDisabled, AI_PLATFORM_CAPABILITY_ID, CONTAINER_PLATFORM_CAPABILITY_ID, MCP_CAPABILITY_ID, LLAMA_STACK_CAPABILITY_ID } from './platformAiConstraints';
import {
  capabilityMapToFlowShape,
  flattenBuiltLayersToMap,
  expandCapabilityMapToBuiltLayers
} from './capabilityBlueprint';
import { generateDataFlowSummaryTextFromNested } from './dataFlowSummaryText';
import { mergeDecisionPatches } from '../data/decisionRecommendationApply';
import { getCatalogDisplayName, getCatalogEntry } from '../data/catalogResolve';

/** Reject accidental undefined/null tokens or object stringification in customer-facing text. */
function expectNoBadExportTokens(text) {
  expect(text, 'output must be a string').toEqual(expect.any(String));
  expect(text).not.toMatch(/\bundefined\b/);
  expect(text).not.toMatch(/\bnull\b/);
  expect(text).not.toContain('[object Object]');
}

describe('reconcileContainerAiPlatform (platform compatibility)', () => {
  it('RHOAI implies OpenShift when container was Kubernetes', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'kubernetes',
      'ai-platform': 'rhoai'
    });
    expect(out['container-platform']).toBe('openshift');
    expect(out['ai-platform']).toBe('rhoai');
  });

  it('RHAIE implies OpenShift when container was Kubernetes', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'kubernetes',
      'ai-platform': 'rhaie'
    });
    expect(out['container-platform']).toBe('openshift');
    expect(out['ai-platform']).toBe('rhaie');
  });

  it('Existing Kubernetes + incompatible AI (RHEL AI) coerces AI to RHAI', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'kubernetes',
      'ai-platform': 'rhel-ai'
    });
    expect(out['container-platform']).toBe('kubernetes');
    expect(out['ai-platform']).toBe('rhai');
  });

  it('OpenShift + RHAI removes invalid AI selection (current reconciliation rule)', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'openshift',
      'ai-platform': 'rhai'
    });
    expect(out['container-platform']).toBe('openshift');
    expect(out['ai-platform']).toBeUndefined();
  });

  it('Kubernetes + RHAI stays valid', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'kubernetes',
      'ai-platform': 'rhai'
    });
    expect(out['container-platform']).toBe('kubernetes');
    expect(out['ai-platform']).toBe('rhai');
  });

  it('OpenShift-only AI wins before RHEL-host forcing when both were inconsistent', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'rhel-hosts',
      'ai-platform': 'rhoai'
    });
    expect(out['container-platform']).toBe('openshift');
    expect(out['ai-platform']).toBe('rhoai');
  });

  it('RHEL hosts + RHAI coerces to RHEL AI', () => {
    const out = reconcileContainerAiPlatform({
      'container-platform': 'rhel-hosts',
      'ai-platform': 'rhai'
    });
    expect(out['ai-platform']).toBe('rhel-ai');
  });
});

describe('blueprint transforms', () => {
  it('flattenBuiltLayersToMap handles empty and nested layers', () => {
    expect(flattenBuiltLayersToMap({})).toEqual({});
    expect(
      flattenBuiltLayersToMap({
        platform: { 'ai-platform': 'rhoai' },
        infrastructure: { 'container-platform': 'openshift' }
      })
    ).toEqual({
      'ai-platform': 'rhoai',
      'container-platform': 'openshift'
    });
  });

  it('expandCapabilityMapToBuiltLayers round-trips with flatten', () => {
    const flat = {
      'container-platform': 'openshift',
      'ai-platform': 'rhoai',
      'model-serving': 'ai-inference'
    };
    const built = expandCapabilityMapToBuiltLayers(flat);
    const back = flattenBuiltLayersToMap(built);
    expect(back).toEqual(flat);
  });

  it('capabilityMapToFlowShape nests options by layer', () => {
    const shape = capabilityMapToFlowShape({
      'container-platform': 'openshift',
      'ai-platform': 'rhoai',
      'model-serving': 'ai-inference'
    });
    expect(shape.infrastructure?.['container-platform']?.id).toBe('openshift');
    expect(shape.platform?.['ai-platform']?.id).toBe('rhoai');
    expect(shape.services?.['model-serving']?.id).toBe('ai-inference');
  });
});

describe('generateDataFlowSummaryTextFromNested (data flow clipboard text)', () => {
  it('handles minimal / empty nested shape with readable fallback', () => {
    const text = generateDataFlowSummaryTextFromNested({});
    expectNoBadExportTokens(text);
    expect(text).toContain('Data flow summary');
    expect(text).toMatch(/No components|Build Your Stack/i);
  });

  it('handles fuller stack with layer sections', () => {
    const nested = capabilityMapToFlowShape({
      'container-platform': 'openshift',
      'ai-platform': 'rhoai',
      'model-serving': 'ai-inference'
    });
    const text = generateDataFlowSummaryTextFromNested(nested);
    expectNoBadExportTokens(text);
    expect(text).toMatch(/INFRASTRUCTURE|Infrastructure/i);
    expect(text).toMatch(/PLATFORM|Platform/i);
    expect(text).toMatch(/OpenShift|Inference|serving/i);
  });
});

describe('collectFlowLayersFromNested', () => {
  it('returns empty array when nested shape is empty', () => {
    expect(collectFlowLayersFromNested({})).toEqual([]);
  });
});

describe('isCapabilityOptionDisabled (compatibility matrix)', () => {
  const aiCap = { id: AI_PLATFORM_CAPABILITY_ID };
  const containerCap = { id: CONTAINER_PLATFORM_CAPABILITY_ID };
  const mcpCap = { id: MCP_CAPABILITY_ID };
  const llamaCap = { id: LLAMA_STACK_CAPABILITY_ID };

  it('on Kubernetes, only RHAI is enabled among AI options; RHOAI and RHEL AI are disabled', () => {
    const map = { 'container-platform': 'kubernetes', 'ai-platform': 'rhai' };
    expect(isCapabilityOptionDisabled(aiCap, 'rhai', map)).toBe(false);
    expect(isCapabilityOptionDisabled(aiCap, 'rhoai', map)).toBe(true);
    expect(isCapabilityOptionDisabled(aiCap, 'rhel-ai', map)).toBe(true);
  });

  it('on OpenShift, RHAI (K8s-only SKU in this model) is disabled; RHOAI stays available', () => {
    const map = { 'container-platform': 'openshift', 'ai-platform': 'rhoai' };
    expect(isCapabilityOptionDisabled(aiCap, 'rhai', map)).toBe(true);
    expect(isCapabilityOptionDisabled(aiCap, 'rhoai', map)).toBe(false);
  });

  it('on RHEL hosts, only RHEL AI is valid for the AI layer', () => {
    const map = { 'container-platform': 'rhel-hosts', 'ai-platform': 'rhel-ai' };
    expect(isCapabilityOptionDisabled(aiCap, 'rhel-ai', map)).toBe(false);
    expect(isCapabilityOptionDisabled(aiCap, 'rhoai', map)).toBe(true);
  });

  it('when AI is RHOAI, container layer cannot be Kubernetes (OpenShift is forced elsewhere)', () => {
    const map = { 'container-platform': 'openshift', 'ai-platform': 'rhoai' };
    expect(isCapabilityOptionDisabled(containerCap, 'kubernetes', map)).toBe(true);
    expect(isCapabilityOptionDisabled(containerCap, 'openshift', map)).toBe(false);
  });

  it('Red Hat MCP operator options require OpenShift as container', () => {
    const onK8s = { 'container-platform': 'kubernetes', 'ai-platform': 'rhai' };
    const onOcp = { 'container-platform': 'openshift', 'ai-platform': 'rhoai' };
    expect(isCapabilityOptionDisabled(mcpCap, 'rh-mcp-full', onK8s)).toBe(true);
    expect(isCapabilityOptionDisabled(mcpCap, 'rh-mcp-full', onOcp)).toBe(false);
  });

  it('Llama Stack distribution option is disabled on generic Kubernetes', () => {
    const map = { 'container-platform': 'kubernetes', 'ai-platform': 'rhai' };
    expect(isCapabilityOptionDisabled(llamaCap, 'llama-stack-distribution', map)).toBe(true);
  });
});

describe('catalogResolve (display names & unknown ids)', () => {
  it('getCatalogDisplayName resolves a product id to the catalog name', () => {
    expect(getCatalogDisplayName('openshift')).toMatch(/OpenShift/i);
  });

  it('getCatalogDisplayName resolves workshop reference ids to labels', () => {
    expect(getCatalogDisplayName('kserve')).toContain('KServe');
  });

  it('getCatalogDisplayName falls back to the raw id when unknown', () => {
    expect(getCatalogDisplayName('unknown-workshop-id-xyz')).toBe('unknown-workshop-id-xyz');
  });

  it('getCatalogEntry returns null for unknown ids', () => {
    expect(getCatalogEntry('not-in-catalog-999')).toBeNull();
  });

  it('getCatalogEntry classifies product vs workshop reference', () => {
    expect(getCatalogEntry('openshift')?.kind).toBe('product');
    expect(getCatalogEntry('odf-hybrid')?.kind).toBe('reference');
  });
});

describe('decisionRecommendationApply (runtime safety)', () => {
  it('AI-Inference patch is defined once and applies serving only', () => {
    const { next, applied } = mergeDecisionPatches({}, 'AI-Inference');
    expect(applied).toBe(true);
    expect(next['model-serving']).toBe('ai-inference');
  });

  it('RHOAI patch sets OpenShift + OpenShift AI and reconciles with prior Kubernetes + RHAI', () => {
    const prev = { 'container-platform': 'kubernetes', 'ai-platform': 'rhai' };
    const { next, applied } = mergeDecisionPatches(prev, 'RHOAI');
    expect(applied).toBe(true);
    expect(next['container-platform']).toBe('openshift');
    expect(next['ai-platform']).toBe('rhoai');
  });

  it('cloud-inference adds container, AI, and serving', () => {
    const { next, applied } = mergeDecisionPatches({}, 'cloud-inference');
    expect(applied).toBe(true);
    expect(next['container-platform']).toBe('openshift');
    expect(next['ai-platform']).toBe('rhoai');
    expect(next['model-serving']).toBe('ai-inference');
  });

  it('Either-Serving maps to AI inference serving option', () => {
    const { next, applied } = mergeDecisionPatches({}, 'Either-Serving');
    expect(applied).toBe(true);
    expect(next['model-serving']).toBe('ai-inference');
  });

  it('KServe patch includes OpenShift AI stack after reconcile', () => {
    const { next, applied } = mergeDecisionPatches({}, 'KServe');
    expect(applied).toBe(true);
    expect(next['model-serving']).toBe('kserve');
    expect(next['container-platform']).toBe('openshift');
    expect(next['ai-platform']).toBe('rhoai');
  });

  it('unknown recommendation key leaves map unchanged', () => {
    const prev = { 'container-platform': 'openshift', 'ai-platform': 'rhoai' };
    const { next, applied } = mergeDecisionPatches(prev, 'not-a-real-recommendation-key');
    expect(applied).toBe(false);
    expect(next).toEqual(prev);
  });
});
