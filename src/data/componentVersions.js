/**
 * Component version tables — per-product, pinned to a specific release.
 *
 * DATA FENCE: extraction only. Every entry is transcribed verbatim from a pinned source;
 * no versions are inferred, guessed, or mixed across releases.
 *
 * Field contract:
 *   component   — display name of the component (string)
 *   version     — exact version string from the source (string)
 *   sourceUrl   — public URL pointing to the exact source line or document
 *   sourceLabel — human-readable label for the source link
 *
 * Table-level fields:
 *   productId       — matches the product id in productComparisons.js ('ai-inference' | 'rhoai')
 *   release         — version string of the product release this table describes
 *   extractionDate  — ISO date this table was extracted / last verified
 *   sourceUrl       — top-level source document URL for the table
 *   sourceLabel     — human-readable label for the top-level source
 */

// Pinned commit for the RHOAI 3.5-ea.2 get_all_manifests.sh
const ODH_COMMIT = '2e3c4206e9a35fb9cbe5eaacf257695560520e83';
const ODH_BASE = `https://github.com/opendatahub-io/opendatahub-operator/blob/${ODH_COMMIT}`;
const gam = (line) => `${ODH_BASE}/get_all_manifests.sh${line ? `#L${line}` : ''}`;

const RHAI_PENDING_LABEL = 'Internal verification — public source pending';

export const componentVersions = [
  {
    productId: 'ai-inference',
    release: '3.4',
    extractionDate: '2026-07-17',
    sourceUrl: null,
    sourceLabel: RHAI_PENDING_LABEL,
    components: [
      { component: 'Red Hat AI Inference', version: '3.4.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'vLLM', version: '0.18.0+rhaiv.7', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'RHAI Operator', version: 'XKS 3.4.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'Cloud Manager Operator', version: '3.4.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'llm-d Inference Scheduler', version: 'v0.7.1', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'llm-d Workload Variant Autoscaler', version: 'v0.6.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'Gateway API', version: 'v1.4.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'Gateway API Inference Extension', version: 'v1.3.1', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'Istio', version: '1.27.8_ossm', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'Sail Operator', version: 'v3.2.3', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'cert-manager', version: 'v1.18.4', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'LWS (Leader Worker Set)', version: 'v0.7.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'KServe (LLMISvc Controller)', version: 'v0.17.0', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'EKS (Kubernetes)', version: 'v1.34.8-eks', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
      { component: 'Helm Chart', version: '0.1.20887+863cde804', sourceUrl: null, sourceLabel: RHAI_PENDING_LABEL },
    ]
  },
  {
    productId: 'rhoai',
    release: '3.5-ea.2',
    extractionDate: '2026-07-17',
    sourceUrl: gam(),
    sourceLabel: 'opendatahub-operator get_all_manifests.sh @ 2e3c420 (RHOAI 3.5-ea.2 tag)',
    // Parsed from RHOAI_COMPONENT_MANIFESTS and RHOAI_COMPONENT_CHARTS in get_all_manifests.sh.
    // Format per entry: repo-org:repo-name:ref-name@commit-sha:source-folder
    // component = display name; version = ref-name (tag/branch); sha = first 7 chars of commit-sha.
    components: [
      // RHOAI_COMPONENT_MANIFESTS lines 40-57
      { component: 'Dashboard (odh-dashboard)', version: 'rhoai-3.5-ea.2', sha: 'b2fe40c', sourceUrl: gam(40), sourceLabel: 'get_all_manifests.sh L40' },
      { component: 'Workbenches — kf-notebook-controller', version: 'rhoai-3.5-ea.2', sha: '0dfef85', sourceUrl: gam(41), sourceLabel: 'get_all_manifests.sh L41' },
      { component: 'Workbenches — odh-notebook-controller', version: 'rhoai-3.5-ea.2', sha: '0dfef85', sourceUrl: gam(42), sourceLabel: 'get_all_manifests.sh L42' },
      { component: 'Workbenches — Notebooks', version: 'rhoai-3.5-ea.2', sha: '77780fe', sourceUrl: gam(43), sourceLabel: 'get_all_manifests.sh L43' },
      { component: 'KServe', version: 'rhoai-3.5-ea.2', sha: 'f255870', sourceUrl: gam(44), sourceLabel: 'get_all_manifests.sh L44' },
      { component: 'Ray (KubeRay)', version: 'rhoai-3.5-ea.2', sha: 'd14f765', sourceUrl: gam(45), sourceLabel: 'get_all_manifests.sh L45' },
      { component: 'TrustyAI Service Operator', version: 'rhoai-3.5-ea.2', sha: 'ac6e72e', sourceUrl: gam(46), sourceLabel: 'get_all_manifests.sh L46' },
      { component: 'Model Registry Operator', version: 'rhoai-3.5-ea.2', sha: '33d02a8', sourceUrl: gam(47), sourceLabel: 'get_all_manifests.sh L47' },
      { component: 'Training Operator (Kubeflow)', version: 'rhoai-3.5-ea.2', sha: '16a06f5', sourceUrl: gam(48), sourceLabel: 'get_all_manifests.sh L48' },
      { component: 'Data Science Pipelines Operator', version: 'rhoai-3.5-ea.2', sha: '24f6be6', sourceUrl: gam(49), sourceLabel: 'get_all_manifests.sh L49' },
      { component: 'ODH Model Controller', version: 'rhoai-3.5-ea.2', sha: '8af23e6', sourceUrl: gam(50), sourceLabel: 'get_all_manifests.sh L50' },
      { component: 'Feast Operator', version: 'rhoai-3.5-ea.2', sha: 'c87449c', sourceUrl: gam(51), sourceLabel: 'get_all_manifests.sh L51' },
      { component: 'OGX Kubernetes Operator', version: 'rhoai-3.5-ea.2', sha: 'bff797d', sourceUrl: gam(52), sourceLabel: 'get_all_manifests.sh L52' },
      { component: 'Trainer', version: 'rhoai-3.5-ea.2', sha: '77010a2', sourceUrl: gam(53), sourceLabel: 'get_all_manifests.sh L53' },
      { component: 'Models as a Service (MaaS) Billing', version: 'rhoai-3.5-ea.2', sha: 'df0370f', sourceUrl: gam(54), sourceLabel: 'get_all_manifests.sh L54' },
      { component: 'MLflow Operator', version: 'rhoai-3.5-ea.2', sha: '79d5739', sourceUrl: gam(55), sourceLabel: 'get_all_manifests.sh L55' },
      { component: 'Spark Operator', version: 'rhoai-3.5-ea.2', sha: 'afe2757', sourceUrl: gam(56), sourceLabel: 'get_all_manifests.sh L56' },
      { component: 'Workload Variant Autoscaler', version: 'rhoai-3.5-ea.2', sha: 'a3a58e1', sourceUrl: gam(57), sourceLabel: 'get_all_manifests.sh L57' },
      // RHOAI_COMPONENT_CHARTS lines 74-77
      { component: 'cert-manager Operator (chart)', version: 'rhoai-3.5-ea.2', sha: '7060bda', sourceUrl: gam(74), sourceLabel: 'get_all_manifests.sh L74' },
      { component: 'LWS Operator (chart)', version: 'rhoai-3.5-ea.2', sha: '7060bda', sourceUrl: gam(75), sourceLabel: 'get_all_manifests.sh L75' },
      { component: 'Sail Operator (chart)', version: 'rhoai-3.5-ea.2', sha: '7060bda', sourceUrl: gam(76), sourceLabel: 'get_all_manifests.sh L76' },
      { component: 'Gateway API (chart)', version: 'rhoai-3.5-ea.2', sha: '7060bda', sourceUrl: gam(77), sourceLabel: 'get_all_manifests.sh L77' },
    ]
  }
];

/** Look up the version table for a given product id. Returns undefined if not found. */
export function getComponentVersions(productId) {
  return componentVersions.find((t) => t.productId === productId);
}
