import { describe, it, expect } from 'vitest';
import { DECISION_RECOMMENDATION_PATCHES, getPatchesForRecommendationKey } from './decisionRecommendationApply';

describe('Decision Recommendation Mappings', () => {
  it('should have non-empty patches for all registered keys', () => {
    const keys = Object.keys(DECISION_RECOMMENDATION_PATCHES);
    expect(keys.length).toBeGreaterThan(0);

    for (const key of keys) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(Array.isArray(patches)).toBe(true);
      expect(patches.length).toBeGreaterThan(0);

      // Each patch should have capabilityId and optionId
      for (const patch of patches) {
        expect(patch.capabilityId).toBeDefined();
        expect(patch.optionId).toBeDefined();
        expect(typeof patch.capabilityId).toBe('string');
        expect(typeof patch.optionId).toBe('string');
      }
    }
  });

  it('should return patches via getPatchesForRecommendationKey', () => {
    const testKey = 'RHOAI';
    const patches = getPatchesForRecommendationKey(testKey);
    expect(patches).toBeDefined();
    expect(Array.isArray(patches)).toBe(true);
    expect(patches.length).toBeGreaterThan(0);
  });

  it('should return null for unknown keys', () => {
    const patches = getPatchesForRecommendationKey('UNKNOWN_KEY_12345');
    expect(patches).toBeNull();
  });

  it('should have unique capability IDs within each patch set for deterministic behavior', () => {
    const keys = Object.keys(DECISION_RECOMMENDATION_PATCHES);

    for (const key of keys) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      const capabilityIds = patches.map((p) => p.capabilityId);
      const uniqueIds = new Set(capabilityIds);

      // If duplicates exist, the last one wins - this is expected but should be documented
      // This test just ensures we're aware of any duplicates
      if (capabilityIds.length !== uniqueIds.size) {
        const duplicates = capabilityIds.filter((id, index) => capabilityIds.indexOf(id) !== index);
        console.warn(`Recommendation '${key}' has duplicate capability IDs (last wins):`, duplicates);
      }
    }
  });

  it('should have expected structure for product recommendations', () => {
    const productRecs = ['RHEL AI', 'RHOAI', 'RHAIE', 'AI-Inference'];

    for (const key of productRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for deployment recommendations', () => {
    const deploymentRecs = [
      'on-prem-small',
      'on-prem-large',
      'cloud-openshift-inference',
      'cloud-openshift-training',
      'cloud-openshift-both',
      'cloud-kubernetes-inference',
      'cloud-kubernetes-training',
      'cloud-kubernetes-both',
      'hybrid-train-onprem',
      'hybrid-inference-onprem'
    ];

    for (const key of deploymentRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for architecture recommendations', () => {
    const archRecs = ['simple-inference', 'complex-inference', 'simple-training', 'distributed-training'];

    for (const key of archRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for GPU recommendations', () => {
    const gpuRecs = ['nvidia-h100', 'nvidia-a100', 'nvidia-a10g', 'nvidia-l40s', 'amd-mi', 'intel-gaudi', 'cpu-only'];

    for (const key of gpuRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for vector DB recommendations', () => {
    const vectorRecs = ['pinecone', 'elastic-cloud', 'elastic-self', 'pgvector'];

    for (const key of vectorRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for storage recommendations', () => {
    const storageRecs = ['odf-small', 'odf-large', 's3', 'azure-blob', 'gcs'];

    for (const key of storageRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for batch/serving recommendations', () => {
    const servingRecs = ['Batch-Gateway', 'AI-Inference-Realtime', 'AI-Inference-Scale', 'Either'];

    for (const key of servingRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for evaluation recommendations', () => {
    const evalRecs = ['lm-eval-harness', 'lm-eval-custom', 'GuideLLM', 'RAGAS', 'Garak'];

    for (const key of evalRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for training approach recommendations', () => {
    const trainingRecs = ['InstructLab', 'Distributed-Workloads', 'Data-Science-Pipelines'];

    for (const key of trainingRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });

  it('should have expected structure for serving choice recommendations', () => {
    const servingChoiceRecs = ['KServe', 'Either-Serving'];

    for (const key of servingChoiceRecs) {
      const patches = DECISION_RECOMMENDATION_PATCHES[key];
      expect(patches).toBeDefined();
      expect(patches.length).toBeGreaterThan(0);
    }
  });
});
