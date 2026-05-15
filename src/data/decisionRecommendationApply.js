/**
 * Explicit workshop mappings from Decision Guide leaf keys → capability option IDs.
 * Keys MUST match `recommendation` strings on flow options and keys in `flow.recommendations`.
 * Patches merge into the flat blueprint map, then `reconcileContainerAiPlatform` runs (OpenShift/RHAI rules).
 */

import { reconcileContainerAiPlatform } from '../lib/platformAiConstraints';

const p = (capabilityId, optionId) => ({ capabilityId, optionId });

/** @type {Record<string, { capabilityId: string, optionId: string }[]>} */
export const DECISION_RECOMMENDATION_PATCHES = {
  // —— Product ——
  'RHEL AI': [p('container-platform', 'rhel-hosts'), p('ai-platform', 'rhel-ai')],
  RHOAI: [p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  RHAIE: [p('container-platform', 'openshift'), p('ai-platform', 'rhaie')],
  'AI-Inference': [p('model-serving', 'ai-inference')],
  'RHOAI+OpenShift': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],

  // —— Deployment ——
  'on-prem-small': [p('container-platform', 'rhel-hosts'), p('ai-platform', 'rhel-ai'), p('accelerators', 'cpu-only')],
  'on-prem-large': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai'), p('accelerators', 'nvidia-gpu')],
  'cloud-openshift-inference': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai'), p('model-serving', 'ai-inference')],
  'cloud-openshift-training': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'cloud-openshift-both': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai'), p('model-registry', 'rh-model-registry')],
  'cloud-kubernetes-inference': [p('container-platform', 'kubernetes'), p('ai-platform', 'rhai'), p('model-serving', 'ai-inference')],
  'cloud-kubernetes-training': [p('container-platform', 'kubernetes'), p('ai-platform', 'rhai')],
  'cloud-kubernetes-both': [p('container-platform', 'kubernetes'), p('ai-platform', 'rhai'), p('model-registry', 'rh-model-registry')],
  'hybrid-train-onprem': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'hybrid-inference-onprem': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai'), p('model-serving', 'ai-inference')],

  // —— Architecture patterns ——
  'simple-inference': [p('model-serving', 'ai-inference')],
  'complex-inference': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('model-serving', 'kserve'),
    p('model-registry', 'rh-model-registry')
  ],
  'simple-training': [p('container-platform', 'openshift'), p('ai-platform', 'rhoai'), p('model-training', 'instructlab')],
  'distributed-training': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('model-training', 'rhoai-distributed'),
    p('model-registry', 'rh-model-registry')
  ],
  'simple-mlops': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('model-registry', 'rh-model-registry'),
    p('model-serving', 'kserve')
  ],
  'enterprise-mlops': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('model-registry', 'rh-model-registry'),
    p('governance', 'trustyai'),
    p('model-training', 'data-science-pipelines')
  ],
  'rag-documents': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('vector-db', 'elastic'),
    p('model-serving', 'ai-inference')
  ],
  'rag-database': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('vector-db', 'pgvector'),
    p('model-serving', 'ai-inference')
  ],
  'rag-complex': [
    p('container-platform', 'openshift'),
    p('ai-platform', 'rhoai'),
    p('vector-db', 'elastic'),
    p('mcp', 'rh-mcp-full'),
    p('model-serving', 'ai-inference')
  ],

  // —— GPU —— (accelerator family only; hardware SKU is discussion detail)
  'nvidia-h100': [p('accelerators', 'nvidia-gpu')],
  'nvidia-a100': [p('accelerators', 'nvidia-gpu')],
  'nvidia-a10g': [p('accelerators', 'nvidia-gpu')],
  'nvidia-l40s': [p('accelerators', 'nvidia-gpu')],
  'amd-mi': [p('accelerators', 'amd-gpu')],
  'intel-gaudi': [p('accelerators', 'intel-gpu')],
  'cpu-only': [p('accelerators', 'cpu-only')],

  // —— Vector ——
  pinecone: [p('vector-db', 'customer-vectordb')],
  'elastic-cloud': [p('vector-db', 'elastic')],
  'elastic-self': [p('vector-db', 'elastic')],
  pgvector: [p('vector-db', 'pgvector')],

  // —— Storage ——
  'odf-small': [p('data-storage', 'odf')],
  'odf-large': [p('data-storage', 'odf')],
  s3: [p('data-storage', 's3')],
  'azure-blob': [p('data-storage', 'customer-storage')],
  gcs: [p('data-storage', 'customer-storage')],
  noobaa: [p('data-storage', 'customer-storage')],
  'odf-hybrid': [p('data-storage', 'odf')],
  's3-hybrid': [p('data-storage', 's3')],

  // —— Serving / batch ——
  'Batch-Gateway': [p('batch-inference', 'batch-gateway')],
  'AI-Inference-Realtime': [p('model-serving', 'ai-inference')],
  'AI-Inference-Scale': [p('model-serving', 'ai-inference'), p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'AI-Inference-Queue': [p('model-serving', 'ai-inference')],
  Either: [p('model-serving', 'ai-inference')],

  // —— Evaluation ——
  'lm-eval-harness': [p('evaluation', 'rh-evaluation')],
  'lm-eval-custom': [p('evaluation', 'rh-evaluation')],
  GuideLLM: [p('evaluation', 'rh-evaluation')],
  RAGAS: [p('evaluation', 'rh-evaluation')],
  'RAGAS-custom': [p('evaluation', 'rh-evaluation')],
  Garak: [p('evaluation', 'rh-evaluation')],

  // —— Fine-tuning / training flows ——
  InstructLab: [p('model-training', 'instructlab'), p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'Distributed-Workloads': [p('model-training', 'rhoai-distributed'), p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'Data-Science-Pipelines': [p('model-training', 'data-science-pipelines'), p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'Either-Fine-Tune': [p('model-training', 'instructlab')],
  'InstructLab-or-Pipelines': [p('model-training', 'data-science-pipelines')],

  // —— Advanced serving ——
  KServe: [p('model-serving', 'kserve'), p('container-platform', 'openshift'), p('ai-platform', 'rhoai')],
  'Either-Serving': [p('model-serving', 'ai-inference')]
};

export function getPatchesForRecommendationKey(recommendationKey) {
  const list = DECISION_RECOMMENDATION_PATCHES[recommendationKey];
  return Array.isArray(list) ? list : null;
}

/**
 * @returns {{ next: Record<string, string>, applied: boolean }}
 */
export function mergeDecisionPatches(prevFlat, recommendationKey) {
  const patches = getPatchesForRecommendationKey(recommendationKey);
  if (!patches || patches.length === 0) {
    return { next: prevFlat, applied: false };
  }
  const merged = { ...prevFlat };
  for (const { capabilityId, optionId } of patches) {
    merged[capabilityId] = optionId;
  }
  return { next: reconcileContainerAiPlatform(merged), applied: true };
}
