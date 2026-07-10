/**
 * Product Comparison Data Model (dual-view: bill of materials + capabilities)
 *
 * One comparison object per product pair, rendered two ways by ProductComparisonView:
 *  - BOM view: which components ship in each product (bomRows)
 *  - Capability view: what you can do with each product, and overlap (capabilityRows)
 *
 * DATA FENCE — READ BEFORE EDITING:
 * Every row carries `illustrative: true` until a HUMAN curates it against the sources
 * listed in ./CURATION-TODO.md and flips the flag with a real citation in `sourceRef`.
 * Agents and automated edits must never flip `illustrative` or `draft`, and must not
 * add product claims that do not already exist in this repo's catalog files.
 * While `draft` is true the UI shows a "Draft — pending BOM curation" banner, PNG
 * exports include it, and copied summaries are prefixed with a DRAFT line.
 * Enforced by src/data/productComparisons.test.js and catalogIntegrity.test.js.
 *
 * Field vocabularies (test-enforced):
 *  - bomRows[].a/b.included: 'included' | 'add-on' | 'not-included' | 'confirm'
 *  - capabilityRows[].a/b.support: 'yes' | 'partial' | 'no' | 'confirm'
 *  - any `status` field: 'GA' | 'Tech Preview' | 'Dev Preview' | 'Check with Red Hat'
 *    (the canonical four — put maturity prose anywhere else in `detail`, never in `status`)
 */

const PENDING = 'Pending curation — confirm with your Red Hat account team';

export const aiInferenceVsRhoai = {
  id: 'ai-inference-vs-rhoai',
  comparisonType: 'product-dual-view',
  title: 'Red Hat AI Inference Server vs Red Hat OpenShift AI',
  description:
    'What ships in each product (bill of materials view) and what each product lets you do (capability view). Draft — contents pending curation against Red Hat supported-configuration documentation.',
  audience: 'Teams deciding between the inference-focused runtime and the full AI/ML platform',
  draft: true,
  products: {
    a: { productId: 'ai-inference', label: 'Red Hat AI Inference Server' },
    b: { productId: 'rhoai', label: 'Red Hat OpenShift AI (RHOAI)' }
  },

  bomRows: [
    {
      area: 'Inference engine',
      a: { included: 'included', detail: 'vLLM Engine — high-throughput large language model (LLM) inference' },
      b: { included: 'included', detail: 'KServe model serving with vLLM runtime support' },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (ai-inference.vllm-engine; rhoai.kserve) — pending BOM curation'
    },
    {
      area: 'OpenAI-compatible API endpoint',
      a: { included: 'included', detail: 'OpenAI-Compatible API — standard API interface' },
      b: { included: 'included', detail: 'Served through KServe model serving (OpenAI-compatible API)' },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (ai-inference.api-server) and deploymentComparisons.js capabilities — pending BOM curation'
    },
    {
      area: 'Model loading and caching',
      a: { included: 'included', detail: 'Model Loader — dynamic model loading and caching' },
      b: { included: 'confirm', detail: PENDING },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (ai-inference.model-loader) — pending BOM curation'
    },
    {
      area: 'Notebooks / workbenches',
      a: { included: 'confirm', detail: PENDING },
      b: { included: 'included', detail: 'Workbenches — multi-user notebook environments for data science, managed by the Kubeflow notebook controller' },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.workbenches) — pending BOM curation'
    },
    {
      area: 'Machine-learning pipelines',
      a: { included: 'confirm', detail: PENDING },
      b: { included: 'included', detail: 'Data Science Pipelines — Kubeflow Pipelines for machine-learning workflows' },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.pipelines) — pending BOM curation'
    },
    {
      area: 'Distributed training',
      a: { included: 'confirm', detail: PENDING },
      b: { included: 'included', detail: 'Distributed Workloads — training across multiple nodes and graphics processing units (GPUs)' },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.distributed-workloads) — pending BOM curation'
    },
    {
      area: 'Container platform requirement',
      a: { included: 'confirm', detail: 'Runs on Kubernetes footprints — confirm supported platforms with your Red Hat account team' },
      b: { included: 'included', detail: 'Requires Red Hat OpenShift as the container platform (self-managed or managed ROSA/ARO)' },
      illustrative: true,
      sourceRef: 'Placeholder from products.js (rhoai description; QuickComparisonTable enterprise-distribution row) — pending BOM curation'
    },
    {
      area: 'Operators, container images, and versions per release',
      a: { included: 'confirm', detail: PENDING },
      b: { included: 'confirm', detail: PENDING },
      illustrative: true,
      sourceRef: 'No in-repo source — pending BOM curation'
    }
  ],

  capabilityRows: [
    {
      capability: 'Model serving (large language model inference)',
      a: { support: 'yes', detail: 'High-throughput serving of large language models (LLMs)' },
      b: { support: 'yes', detail: 'Production inferencing as part of the full machine-learning lifecycle' },
      overlap: true,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (ai-inference.useCases; rhoai.useCases) — pending curation'
    },
    {
      capability: 'Autoscaling of model servers',
      a: { support: 'confirm', detail: PENDING },
      b: { support: 'yes', detail: 'Via KServe — Horizontal Pod Autoscaler (HPA), KEDA, or Knative' },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (kserve description) — pending curation'
    },
    {
      capability: 'Gateway / model-as-a-service access layer',
      a: { support: 'confirm', detail: 'Red Hat AI Gateway integration — confirm availability and scope with your Red Hat account team' },
      b: { support: 'confirm', detail: 'Red Hat AI Gateway integration — confirm availability and scope with your Red Hat account team' },
      overlap: true,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (ai-gateway, status Check with Red Hat, connections include both products) — pending curation'
    },
    {
      capability: 'Observability and responsible-AI monitoring',
      a: { support: 'confirm', detail: PENDING },
      b: { support: 'yes', detail: 'TrustyAI — explainability, monitoring, and audit trails' },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (trustyai, connections rhoai) — pending curation'
    },
    {
      capability: 'Notebooks and experimentation',
      a: { support: 'confirm', detail: PENDING },
      b: { support: 'yes', detail: 'Workbenches — multi-user notebook environments for data science' },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.workbenches) — pending curation'
    },
    {
      capability: 'Automated machine-learning pipelines',
      a: { support: 'confirm', detail: PENDING },
      b: { support: 'yes', detail: 'Kubeflow Pipelines-based automation for repeatable machine-learning workflows' },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (data-science-pipelines) — pending curation'
    },
    {
      capability: 'Model registry integration',
      a: { support: 'yes', detail: 'Integrates with Model Registry', status: 'Tech Preview' },
      b: { support: 'yes', detail: 'Integrates with Model Registry', status: 'Tech Preview' },
      overlap: true,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (model-registry, status Tech Preview, connections include both products) — pending curation'
    },
    {
      capability: 'Model fine-tuning and alignment',
      a: { support: 'confirm', detail: PENDING },
      b: { support: 'yes', detail: 'InstructLab — alignment and fine-tuning using synthetic data and the LAB method' },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (instructlab, connections rhoai) — pending curation'
    }
  ],

  docsLinks: [
    {
      label: 'Red Hat OpenShift AI documentation (docs.redhat.com)',
      url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/'
    }
  ],

  relatedComparisons: ['openshift-to-rhoai']
};

export const productComparisons = [aiInferenceVsRhoai];

export function getProductComparisonById(id) {
  return productComparisons.find((comp) => comp.id === id);
}

export function getProductComparisonList() {
  return productComparisons.map((comp) => ({
    id: comp.id,
    title: comp.title,
    description: comp.description,
    audience: comp.audience,
    draft: comp.draft === true
  }));
}

/** True when the comparison still contains uncurated (illustrative) rows or is flagged draft. */
export function isComparisonDraft(comparison) {
  if (!comparison) return false;
  if (comparison.draft === true) return true;
  const rows = [...(comparison.bomRows ?? []), ...(comparison.capabilityRows ?? [])];
  return rows.some((row) => row.illustrative === true);
}
