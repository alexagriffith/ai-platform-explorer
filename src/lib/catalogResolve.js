import { products, thirdPartyOptions } from '../data/products';

/**
 * Capability-aligned or OSS references used in use cases / workshops (not always a billable SKU row).
 * Labels are human-readable; maturity is informational.
 */
export const WORKSHOP_REFERENCE_LABELS = {
  kserve: { label: 'KServe (model serving pattern)', maturity: 'Capability / CNCF-style serving on the platform' },
  'batch-gateway': { label: 'Batch Gateway (batch inference API)', maturity: 'Early stage — confirm availability with your Red Hat account team' },
  'rh-evaluation': { label: 'Evaluation / EvalHub (quality & benchmarks)', maturity: 'Technology Preview — confirm scope with your Red Hat account team' },
  'fms-guardrails': { label: 'Guardrails (content safety)', maturity: 'Capability area — confirm fit with governance requirements' },
  instructlab: { label: 'InstructLab (alignment / LAB method)', maturity: 'Typically bundled with RHEL AI or used with OpenShift AI' },
  'llama-stack-distribution': { label: 'Llama Stack distribution', maturity: 'Technology Preview — confirm availability with your Red Hat account team' },
  'rhoai-distributed': { label: 'Distributed training (OpenShift AI)', maturity: 'Capability on OpenShift AI' },
  'data-science-pipelines': { label: 'Data Science Pipelines (Kubeflow Pipelines)', maturity: 'Capability on OpenShift AI' },
  elastic: { label: 'Elasticsearch / Elastic vector search', maturity: 'Partner or customer-operated data plane' },
  pgvector: { label: 'pgvector (PostgreSQL extension)', maturity: 'Open source pattern; operational responsibility with customer' },
  pinecone: { label: 'Pinecone (managed vector DB)', maturity: 'Third-party SaaS — not a Red Hat SKU' },
  'azure-blob': { label: 'Azure Blob Storage', maturity: 'Cloud object store (customer or partner operated)' },
  gcs: { label: 'Google Cloud Storage', maturity: 'Cloud object store (customer or partner operated)' },
  noobaa: { label: 'Multi-cloud object gateway (NooBaa-class)', maturity: 'Pattern / product family — confirm supported integrations' },
  'elastic-cloud': { label: 'Elastic Cloud (managed)', maturity: 'Partner SaaS' },
  'elastic-self': { label: 'Self-managed Elastic stack', maturity: 'Customer-operated' },
  'odf-small': { label: 'OpenShift Data Foundation (smaller footprint)', maturity: 'GA (confirm sizing with storage team)' },
  'odf-large': { label: 'OpenShift Data Foundation (scale-out)', maturity: 'GA' },
  'odf-hybrid': { label: 'ODF hybrid data footprint', maturity: 'GA — validate topology' },
  's3-hybrid': { label: 'S3-class storage in hybrid layouts', maturity: 'Pattern — attach concrete cloud accounts' },
  'nvidia-h100': { label: 'NVIDIA H100-class accelerators', maturity: 'Hardware selection — confirm with platform team' },
  'nvidia-a100': { label: 'NVIDIA A100-class accelerators', maturity: 'Hardware selection' },
  'nvidia-a10g': { label: 'NVIDIA A10G-class accelerators', maturity: 'Hardware selection' },
  'nvidia-l40s': { label: 'NVIDIA L40S-class accelerators', maturity: 'Hardware selection' },
  'amd-mi': { label: 'AMD Instinct / MI-series accelerators', maturity: 'Hardware selection' },
  'intel-gaudi': { label: 'Intel Gaudi / Data Center GPU', maturity: 'Hardware selection' },
  'cpu-only': { label: 'CPU-only footprint', maturity: 'For constrained proofs of concept — validate model size vs latency' },
  'rhel-hosts': {
    label: 'RHEL servers (bare metal / VMs)',
    maturity: 'Primary runtime for RHEL AI in this workshop model — not a Kubernetes cluster'
  }
};

export function getCatalogEntry(id) {
  const p = products.find((x) => x.id === id);
  if (p) return { kind: 'product', id, name: p.name, status: p.status, description: p.description };
  const t = thirdPartyOptions.find((x) => x.id === id);
  if (t) return { kind: 'thirdParty', id, name: t.name, status: null, description: t.description };
  const ref = WORKSHOP_REFERENCE_LABELS[id];
  if (ref) return { kind: 'reference', id, name: ref.label, status: ref.maturity, description: ref.maturity };
  return null;
}

/** Display string for chips, lists, and UI copy — never raw ids for known references. */
export function getCatalogDisplayName(id) {
  const entry = getCatalogEntry(id);
  if (entry) return entry.name;
  return id;
}
