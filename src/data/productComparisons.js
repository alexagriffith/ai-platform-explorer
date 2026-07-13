/**
 * Product Comparison Data Model (dual-view: bill of materials + capabilities)
 *
 * One comparison object per product pair, rendered by ProductComparisonView:
 *  - Nested-containment hero (primary): the Inference Server core nested inside the OpenShift AI
 *    platform, as a strict uniform grid of source-linked component cells (see ProductComparisonHero).
 *  - BOM view (secondary provenance table): which components ship in each product (bomRows).
 *  - Capability view (secondary provenance table): what each product lets you do (capabilityRows).
 *
 * DATA FENCE — READ BEFORE EDITING:
 * Every row carries `illustrative: true` until a HUMAN curates it against the sources
 * listed in ./CURATION-TODO.md and flips the flag with a real citation in `sourceRef`.
 * Agents and automated edits must never flip `illustrative` or `draft`, and must not
 * add product claims that do not already exist in this repo's catalog files or in the
 * curated extraction ledger (work-log product-comparison-bom/CURATION-ANSWERS.md).
 * While `draft` is true the UI shows a "Draft — pending BOM curation" banner, PNG
 * exports include it, and copied summaries are prefixed with a DRAFT line.
 * Enforced by src/data/productComparisons.test.js and catalogIntegrity.test.js.
 *
 * PER-FACT SOURCE LINKS (added 2026-07-10, additive — no flag/vocab flip):
 * Each side (a/b) of each row now carries `tier`, `sourceUrl`, and `sourceLabel`. These are
 * metadata for verification, not a curation flip: the placeholder `included`/`support`/`detail`
 * values are unchanged and `illustrative`/`draft` stay true. Provenance is the curated extraction
 * in work-log .../product-comparison-bom/CURATION-ANSWERS.md + SOURCES.md; every `sourceUrl` is a
 * PUBLIC origin URL validated to HTTP 200 by curl on 2026-07-10 (see SRC below). `tier` records the
 * extraction confidence ('clear' | 'inferred' | 'unresolved') so the hero can render clear-tier facts
 * as solid cells and inferred/unresolved facts as dashed "pending verification" cells in the same grid.
 *
 * Field vocabularies (test-enforced):
 *  - bomRows[].a/b.included: 'included' | 'add-on' | 'not-included' | 'confirm'
 *  - capabilityRows[].a/b.support: 'yes' | 'partial' | 'no' | 'confirm'
 *  - a/b.tier: 'clear' | 'inferred' | 'unresolved'
 *  - any `status` field: 'GA' | 'Tech Preview' | 'Dev Preview' | 'Check with Red Hat'
 *    (the canonical four — put maturity prose anywhere else in `detail`, never in `status`)
 */

const PENDING = 'Pending curation — confirm with your Red Hat account team';

// PUBLIC source origins — all validated HTTP 200 via curl on 2026-07-10. Never render these raw on
// the page; they are hrefs behind a human-readable `sourceLabel`. Pins:
//  - opendatahub-io/opendatahub-operator @ tag v3.5.0-ea.2 = commit 2e3c4206e9a35fb9cbe5eaacf257695560520e83
//  - vllm-project/vllm README @ ee0da84ab9e04ac7610e28580af62c365e898389
//  - kserve/kserve README @ b0eda63d2c105479140af8ec9149d992b7e44be5
//  - llm-d/llm-d README @ tag v0.8.1 (the tag-object SHA is NOT a tree-ish; the tag name resolves — 200)
//  - docs.redhat.com pages return 200 to default-UA curl (real 100 KB-1 MB article bodies, 2026-07-10)
const ODH = 'https://github.com/opendatahub-io/opendatahub-operator/blob/2e3c4206e9a35fb9cbe5eaacf257695560520e83';
const gam = (line) => `${ODH}/get_all_manifests.sh${line ? `#L${line}` : ''}`;
const dsc = (line) => `${ODH}/api/datasciencecluster/v2/datasciencecluster_types.go${line ? `#L${line}` : ''}`;
const cpe = (line) => `${ODH}/component-params-env.yaml${line ? `#L${line}` : ''}`;
const vllm = (line) => `https://github.com/vllm-project/vllm/blob/ee0da84ab9e04ac7610e28580af62c365e898389/README.md${line ? `#L${line}` : ''}`;

const SRC = {
  kserveReadme: 'https://github.com/kserve/kserve/blob/b0eda63d2c105479140af8ec9149d992b7e44be5/README.md',
  llmdReadme: 'https://github.com/llm-d/llm-d/blob/v0.8.1/README.md',
  rhaisGettingStarted:
    'https://docs.redhat.com/en/documentation/red_hat_ai_inference_server/3.1/html-single/getting_started/index',
  rhaisSupportedConfigs:
    'https://docs.redhat.com/en/documentation/red_hat_ai_inference_server/3.1/html-single/supported_product_and_hardware_configurations/index',
  rhoaiInstalling:
    'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.4/html-single/installing_and_uninstalling_openshift_ai_self-managed/index',
  rhoaiSupportedConfigs: 'https://access.redhat.com/articles/rhoai-supported-configs-3.x',
  rhoaiCatalog: 'https://catalog.redhat.com/software/container-stacks/detail/63b85b573112fe5a95ee9a3a',
  // Two delivery Helm charts, both under the Red Hat AI ("rhai") namespace — one product family, two
  // platform wirings (Alexa's framing, 2026-07-10). Catalog API (requires_terms:true, Tech Preview,
  // content_stream_tags v3.4) confirms the split; chart bodies stay auth-gated (pull commands in
  // work-log SOURCES.md S3b). Both catalog UI URLs validated HTTP 200.
  rhaiXksChart: 'https://catalog.redhat.com/en/software/containers/rhai/rhai-on-xks-chart/69d5330e2782c2d898f3899e',
  rhaiOpenshiftChart: 'https://catalog.redhat.com/en/software/containers/rhai/rhai-on-openshift-chart/69d5326b4f12a69777fa181d',
  // Verification round 2 (2026-07-13): per-image catalog records that carry the disputed maturity
  // (release_categories), fetched live from the catalog.redhat.com Pyxis API and rendered-validated
  // (~2.2 KB body each) in headless Chromium. Each points a weak cell AT the exact catalog fact its
  // maturity turns on:
  //  - odh-model-registry-operator-rhel9 → release_categories:['Tech Preview'] (_id 680ce1db…) — settles cell 30
  //  - odh-feast-operator-rhel9          → ['Tech Preview'] (_id 680cdf22…) — catalog side of the Feast doc-vs-catalog conflict
  //  - odh-mlflow-operator-rhel9         → ['Beta']         (_id 6943fa39…) — catalog side of the MLflow doc-vs-catalog conflict
  rhoaiModelRegistryCatalog:
    'https://catalog.redhat.com/en/software/containers/rhoai/odh-model-registry-operator-rhel9/680ce1dbe9a268d7e393ef08',
  rhoaiFeastCatalog:
    'https://catalog.redhat.com/en/software/containers/rhoai/odh-feast-operator-rhel9/680cdf2212946c2aa95e43b7',
  rhoaiMlflowCatalog:
    'https://catalog.redhat.com/en/software/containers/rhoai/odh-mlflow-operator-rhel9/6943fa398d961d8560907f31'
};

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
      a: {
        included: 'included',
        detail: 'vLLM Engine — high-throughput large language model (LLM) inference',
        tier: 'clear',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — Getting started (leverages the upstream vLLM project)'
      },
      b: {
        included: 'included',
        detail: 'KServe model serving with vLLM runtime support',
        tier: 'clear',
        sourceUrl: gam(44),
        sourceLabel: 'opendatahub-operator get_all_manifests.sh — kserve (red-hat-data-services:kserve:rhoai-3.5-ea.2)'
      },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (ai-inference.vllm-engine; rhoai.kserve) — pending BOM curation'
    },
    {
      area: 'OpenAI-compatible API endpoint',
      a: {
        included: 'included',
        detail: 'OpenAI-Compatible API — standard API interface',
        tier: 'clear',
        sourceUrl: vllm(49),
        sourceLabel: 'vLLM README — "OpenAI-compatible API server" (the RHAIS engine)'
      },
      b: {
        included: 'included',
        detail: 'Served through KServe model serving (OpenAI-compatible API)',
        tier: 'clear',
        sourceUrl: SRC.kserveReadme,
        sourceLabel: 'KServe README — "OpenAI-compatible inference protocol"'
      },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (ai-inference.api-server) and deploymentComparisons.js capabilities — pending BOM curation'
    },
    {
      area: 'Model loading and caching',
      a: {
        included: 'included',
        detail: 'Model Loader — dynamic model loading and caching',
        tier: 'inferred',
        sourceUrl: vllm(32),
        sourceLabel: 'vLLM README — "prefix caching" (loading/caching is intrinsic to the engine, not a discrete component)'
      },
      b: {
        included: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.kserveReadme,
        sourceLabel: 'KServe README — "Model Caching" / "KV Cache Offloading" (in the KServe README, not an RHOAI doc)'
      },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (ai-inference.model-loader) — pending BOM curation'
    },
    {
      area: 'Notebooks / workbenches',
      a: {
        included: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — "a container image that optimizes serving and inferencing" (scope: no workbench component)'
      },
      b: {
        included: 'included',
        detail: 'Workbenches — multi-user notebook environments for data science, managed by the Kubeflow notebook controller',
        tier: 'clear',
        sourceUrl: gam(41),
        sourceLabel: 'opendatahub-operator get_all_manifests.sh — workbenches/kf-notebook-controller'
      },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.workbenches) — pending BOM curation'
    },
    {
      area: 'Machine-learning pipelines',
      a: {
        included: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — serving/inferencing scope (no pipelines component)'
      },
      b: {
        included: 'included',
        detail: 'Data Science Pipelines — Kubeflow Pipelines for machine-learning workflows',
        tier: 'clear',
        sourceUrl: dsc(40),
        sourceLabel: 'opendatahub-operator DataScienceCluster v2 API — AIPipelines component'
      },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.pipelines) — pending BOM curation'
    },
    {
      area: 'Distributed training',
      a: {
        included: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — inference-time tensor parallelism only (no training component)'
      },
      b: {
        included: 'included',
        detail: 'Distributed Workloads — training across multiple nodes and graphics processing units (GPUs)',
        tier: 'clear',
        sourceUrl: gam(53),
        sourceLabel: 'opendatahub-operator get_all_manifests.sh — trainer (Kubeflow Trainer v2)'
      },
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.distributed-workloads) — pending BOM curation'
    },
    {
      area: 'Container platform requirement',
      a: {
        included: 'confirm',
        detail: 'Runs on Kubernetes footprints — confirm supported platforms with your Red Hat account team',
        tier: 'clear',
        sourceUrl: SRC.rhaiXksChart,
        sourceLabel: 'Red Hat AI any-Kubernetes Helm chart (rhai/rhai-on-xks-chart) — non-OLM install on any Kubernetes (EKS/AKS/GKE/self-managed); catalog.redhat.com, Tech Preview v3.4'
      },
      b: {
        included: 'included',
        detail: 'Requires Red Hat OpenShift as the container platform (self-managed or managed ROSA/ARO)',
        tier: 'clear',
        sourceUrl: SRC.rhaiOpenshiftChart,
        sourceLabel: 'Red Hat AI on-OpenShift Helm chart (rhai/rhai-on-openshift-chart) — installs OpenShift AI (RHOAI) operators + configuration on OpenShift; catalog.redhat.com, Tech Preview v3.4'
      },
      illustrative: true,
      sourceRef: 'Placeholder from products.js (rhoai description; QuickComparisonTable enterprise-distribution row) — pending BOM curation'
    },
    {
      area: 'Operators, container images, and versions per release',
      a: {
        included: 'confirm',
        detail: PENDING,
        tier: 'clear',
        sourceUrl: SRC.rhaisSupportedConfigs,
        sourceLabel: 'Red Hat AI Inference Server 3.1 supported configs — rhaiis/vllm-* container images table (no product operator)'
      },
      b: {
        included: 'confirm',
        detail: PENDING,
        tier: 'clear',
        sourceUrl: gam(),
        sourceLabel: 'opendatahub-operator get_all_manifests.sh — full RHOAI component manifest map (single rhods-operator)'
      },
      illustrative: true,
      sourceRef: 'No in-repo source — pending BOM curation'
    },

    // PROPOSED ADDITIONAL COMPONENT ROWS (from CURATION-ANSWERS.md "PROPOSED NEW ROWS"). The 8+8
    // placeholders are not the component universe; the operator manifests enumerate more. These three
    // ship in RHOAI's operator BOM but carry a documentation-vs-catalog maturity conflict, so they are
    // inferred-tier and render as dashed "pending verification" cells. illustrative:true, fence intact.
    {
      area: 'Feature store (Feast)',
      a: {
        included: 'not-included',
        detail: 'Not part of the Inference Server container (serving/inferencing scope)',
        tier: 'inferred',
        sourceUrl: SRC.rhaisSupportedConfigs,
        sourceLabel: 'Red Hat AI Inference Server 3.1 supported configs — serving scope (no feature store)'
      },
      b: {
        included: 'included',
        detail: 'Feature Store (Feast) — documentation says GA 0.62.0; container catalog lists it Tech Preview (conflict)',
        tier: 'inferred',
        sourceUrl: SRC.rhoaiFeastCatalog,
        sourceLabel:
          'Red Hat OpenShift AI container catalog — odh-feast-operator (release_categories: Tech Preview): the catalog side of a standing conflict with the supported-configs doc ("Feature Store GA 0.62.0"). Both sources current (round 2, 2026-07-13); product team to reconcile — kept inferred, not upgraded.'
      },
      illustrative: true,
      sourceRef: 'Proposed row from CURATION-ANSWERS.md (Feast) — CONFLICT STANDS after round 2: S1 doc "GA 0.62.0" vs live catalog "Tech Preview" (2026-07-13); pending BOM curation'
    },
    {
      area: 'Experiment tracking (MLflow)',
      a: {
        included: 'not-included',
        detail: 'Not part of the Inference Server container (serving/inferencing scope)',
        tier: 'inferred',
        sourceUrl: SRC.rhaisSupportedConfigs,
        sourceLabel: 'Red Hat AI Inference Server 3.1 supported configs — serving scope (no experiment tracking)'
      },
      b: {
        included: 'included',
        detail: 'MLflow experiment tracking — documentation says GA 3.10.1; container catalog lists it Beta (conflict)',
        tier: 'inferred',
        sourceUrl: SRC.rhoaiMlflowCatalog,
        sourceLabel:
          'Red Hat OpenShift AI container catalog — odh-mlflow-operator (release_categories: Beta): the catalog side of a standing conflict with the supported-configs doc ("MLflow GA 3.10.1"). "Beta" is deliberately kept in prose, not the status field (not a canonical status value). Both sources current (round 2, 2026-07-13); product team to reconcile — kept inferred, not upgraded.'
      },
      illustrative: true,
      sourceRef: 'Proposed row from CURATION-ANSWERS.md (MLflow) — CONFLICT STANDS after round 2: S1 doc "GA 3.10.1" vs live catalog "Beta" (2026-07-13); pending BOM curation'
    },
    {
      area: 'Distributed inference (llm-d)',
      a: {
        included: 'add-on',
        detail: 'llm-d layers on the Inference Server when it runs on Kubernetes (prefill/decode disaggregation)',
        tier: 'inferred',
        sourceUrl: SRC.llmdReadme,
        sourceLabel: 'llm-d README — distributed inference / SLO-aware autoscaling layer'
      },
      b: {
        included: 'included',
        detail: 'Distributed Inference with llm-d — mixed maturity across sub-images (kv-cache GA; scheduler/sidecar Tech Preview)',
        tier: 'inferred',
        sourceUrl: SRC.llmdReadme,
        sourceLabel:
          'llm-d README (what the layer is: distributed inference / prefill-decode disaggregation, RHOAI "Distributed Inference with llm-d"). Maturity is a standing doc-vs-catalog conflict — round-2 catalog check (2026-07-13): odh-llm-d-kv-cache Generally Available, but odh-llm-d-inference-scheduler and odh-llm-d-routing-sidecar Tech Preview, vs the supported-configs doc\'s flat "GA 0.7.1"; product team to confirm the aggregate — kept inferred, not upgraded.'
      },
      illustrative: true,
      sourceRef: 'Proposed row from CURATION-ANSWERS.md (llm-d) — CONFLICT STANDS after round 2: S1 flat "GA 0.7.1" vs live catalog kv-cache GA + scheduler/sidecar Tech Preview (2026-07-13); pending BOM curation'
    }
  ],

  capabilityRows: [
    {
      capability: 'Model serving (large language model inference)',
      a: {
        support: 'yes',
        detail: 'High-throughput serving of large language models (LLMs)',
        tier: 'clear',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — "optimizes serving and inferencing with LLMs"'
      },
      b: {
        support: 'yes',
        detail: 'Production inferencing as part of the full machine-learning lifecycle',
        tier: 'clear',
        sourceUrl: SRC.rhoaiSupportedConfigs,
        sourceLabel: 'Red Hat OpenShift AI supported configs — supported model-serving runtimes (KServe + vLLM)'
      },
      overlap: true,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (ai-inference.useCases; rhoai.useCases) — pending curation'
    },
    {
      capability: 'Autoscaling of model servers',
      a: {
        support: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — no autoscaling mechanism (provided by surrounding orchestration)'
      },
      b: {
        support: 'yes',
        detail: 'Via KServe — Horizontal Pod Autoscaler (HPA), KEDA, or Knative',
        tier: 'clear',
        sourceUrl: dsc(43),
        sourceLabel: 'opendatahub-operator DataScienceCluster v2 API — "Only RawDeployment mode is supported" (HPA/KEDA; not Knative)'
      },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (kserve description) — pending curation'
    },
    {
      capability: 'Gateway / model-as-a-service access layer',
      a: {
        support: 'confirm',
        detail: 'Red Hat AI Gateway integration — confirm availability and scope with your Red Hat account team',
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — no gateway/MaaS layer in the container (added by the platform)'
      },
      b: {
        support: 'confirm',
        detail: 'Red Hat AI Gateway integration — confirm availability and scope with your Red Hat account team',
        tier: 'clear',
        sourceUrl: gam(54),
        sourceLabel: 'opendatahub-operator get_all_manifests.sh — maas (Models-as-a-Service; RHCL/Kuadrant-backed)'
      },
      overlap: true,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (ai-gateway, status Check with Red Hat, connections include both products) — pending curation'
    },
    {
      capability: 'Observability and responsible-AI monitoring',
      a: {
        support: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — vLLM serving metrics only (no responsible-AI tooling)'
      },
      b: {
        support: 'yes',
        detail: 'TrustyAI — explainability, monitoring, and audit trails',
        tier: 'clear',
        sourceUrl: gam(46),
        sourceLabel: 'opendatahub-operator get_all_manifests.sh — trustyai (TrustyAI service operator)'
      },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (trustyai, connections rhoai) — pending curation'
    },
    {
      capability: 'Notebooks and experimentation',
      a: {
        support: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — serving/inferencing scope (no notebooks)'
      },
      b: {
        support: 'yes',
        detail: 'Workbenches — multi-user notebook environments for data science',
        tier: 'clear',
        sourceUrl: SRC.rhoaiSupportedConfigs,
        sourceLabel: 'Red Hat OpenShift AI supported configs — Workbenches GA (supported workbench images)'
      },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from subComponents.js (rhoai.workbenches) — pending curation'
    },
    {
      capability: 'Automated machine-learning pipelines',
      a: {
        support: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisGettingStarted,
        sourceLabel: 'Red Hat AI Inference Server 3.1 docs — serving/inferencing scope (no pipelines)'
      },
      b: {
        support: 'yes',
        detail: 'Kubeflow Pipelines-based automation for repeatable machine-learning workflows',
        tier: 'clear',
        sourceUrl: SRC.rhoaiSupportedConfigs,
        sourceLabel: 'Red Hat OpenShift AI supported configs — Data science pipelines GA (Argo Workflows backend)'
      },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (data-science-pipelines) — pending curation'
    },
    {
      capability: 'Model registry integration',
      a: {
        support: 'yes',
        detail: 'Integrates with Model Registry',
        status: 'Tech Preview',
        tier: 'inferred',
        sourceUrl: SRC.rhoaiCatalog,
        sourceLabel: 'Red Hat OpenShift AI container catalog — model-registry images live only under rhoai/ (not part of the RHAIS BOM)'
      },
      b: {
        support: 'yes',
        detail: 'Integrates with Model Registry (registry service Tech Preview; model-catalog front-end GA)',
        status: 'Tech Preview',
        tier: 'clear',
        sourceUrl: SRC.rhoaiModelRegistryCatalog,
        sourceLabel:
          'Red Hat OpenShift AI container catalog — odh-model-registry-operator (release_categories: Tech Preview). Resolves the round-1 "AI Hub vs Model Registry" conflict: the model-registry service/operator ships as Tech Preview, while its catalog front-end (odh-mod-arch-model-registry, the supported-configs "AI Hub GA" line) is Generally Available — different layers, not a contradiction. Live-verified 2026-07-13.'
      },
      overlap: true,
      illustrative: true,
      sourceRef: 'From CURATION-ANSWERS.md cell 30 — UNRESOLVED → CLEAR after round 2: live catalog (2026-07-13) settles inclusion + Tech Preview maturity of the model-registry service, GA front-end explains the doc naming gap; still illustrative pending the human flip'
    },
    {
      capability: 'Model fine-tuning and alignment',
      a: {
        support: 'confirm',
        detail: PENDING,
        tier: 'inferred',
        sourceUrl: SRC.rhaisSupportedConfigs,
        sourceLabel: 'Red Hat AI Inference Server 3.1 supported configs — LLM Compressor (compression, not fine-tuning)'
      },
      b: {
        support: 'yes',
        detail: 'InstructLab — alignment and fine-tuning using synthetic data and the LAB method',
        tier: 'clear',
        sourceUrl: cpe(20),
        sourceLabel: 'opendatahub-operator component-params-env.yaml — "Removed with InstrutLab pipeline removal since RHOAI 3.0" (now Kubeflow Trainer v2)'
      },
      overlap: false,
      illustrative: true,
      sourceRef: 'Placeholder from products.js (instructlab, connections rhoai) — pending curation'
    }
  ],

  // NESTED-CONTAINMENT HERO (primary view; rendered by ProductComparisonHero above the collapsed
  // provenance tables). The two products are drawn as a containment relationship — the Red Hat AI
  // Inference Server core nested INSIDE the Red Hat OpenShift AI platform — with components as a
  // strict uniform grid of source-linked cells. Each cell REFERENCES a row+side (no duplicated
  // provenance): the hero resolves `{ view, key, side }` to that row's side to pull the validated
  // `tier` / `sourceUrl` / `sourceLabel` / `detail`. Solid vs dashed is decided at render time from
  // the resolved tier + link validity (clear-tier + working link = solid; otherwise dashed). Labels
  // are <=2 words by design so the grid stays strictly uniform; acronyms are expanded in the zone
  // taglines/captions and per-cell source labels, never crammed into a cell. illustrative:true — this
  // flips no illustrative/draft flag; the hero rides the same draft banner as every row.
  hero: {
    illustrative: true,
    sourceRef:
      'Nested-containment view of the bomRows/capabilityRows above; each cell links to that row-side\'s validated public source. Confidence tiers per CURATION-ANSWERS.md (clear-tier cells solid; inferred/unresolved-tier cells dashed "pending verification"). Every sourceUrl validated HTTP 200 by curl 2026-07-10 (GitHub blobs @ opendatahub-operator 2e3c4206…, vLLM/KServe/llm-d READMEs, access.redhat.com, catalog.redhat.com, docs.redhat.com). No illustrative/draft flag touched.',
    inner: {
      productKey: 'a',
      label: 'Red Hat AI Inference Server',
      tagline: 'also sold standalone · runs on any Kubernetes or Linux',
      caption:
        'The inference core. Sold standalone and running on any Kubernetes, Red Hat Enterprise Linux (RHEL), or Linux host — no OpenShift required. Clear-tier cells are the vLLM serving engine, an OpenAI-compatible API, and large language model serving.',
      components: [
        { label: 'vLLM Engine', view: 'bom', key: 'Inference engine', side: 'a' },
        { label: 'OpenAI API', view: 'bom', key: 'OpenAI-compatible API endpoint', side: 'a' },
        { label: 'Model Serving', view: 'capability', key: 'Model serving (large language model inference)', side: 'a' },
        { label: 'Model Loading', view: 'bom', key: 'Model loading and caching', side: 'a' }
      ]
    },
    outer: {
      productKey: 'b',
      label: 'Red Hat OpenShift AI',
      tagline: 'platform · requires OpenShift',
      caption:
        'The full platform. OpenShift AI wraps the inference core and adds KServe serving, notebook workbenches, data science pipelines, distributed training, model-server autoscaling, a model-as-a-service (MaaS) gateway, responsible-AI monitoring (TrustyAI), and fine-tuning. Dashed cells still disagree between documentation and the container catalog, or need an authenticated pull.',
      components: [
        { label: 'KServe', view: 'bom', key: 'Inference engine', side: 'b' },
        { label: 'Workbenches', view: 'bom', key: 'Notebooks / workbenches', side: 'b' },
        { label: 'Pipelines', view: 'bom', key: 'Machine-learning pipelines', side: 'b' },
        { label: 'Distributed Training', view: 'bom', key: 'Distributed training', side: 'b' },
        { label: 'Autoscaling', view: 'capability', key: 'Autoscaling of model servers', side: 'b' },
        { label: 'AI Gateway', view: 'capability', key: 'Gateway / model-as-a-service access layer', side: 'b' },
        { label: 'TrustyAI', view: 'capability', key: 'Observability and responsible-AI monitoring', side: 'b' },
        { label: 'Fine-tuning', view: 'capability', key: 'Model fine-tuning and alignment', side: 'b' },
        { label: 'Model Registry', view: 'capability', key: 'Model registry integration', side: 'b' },
        { label: 'Feature Store', view: 'bom', key: 'Feature store (Feast)', side: 'b' },
        { label: 'MLflow', view: 'bom', key: 'Experiment tracking (MLflow)', side: 'b' },
        { label: 'llm-d', view: 'bom', key: 'Distributed inference (llm-d)', side: 'b' }
      ]
    }
  },

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

/**
 * Resolve a hero cell reference to its underlying row side. Returns the label plus the row-side's
 * tier / sourceUrl / sourceLabel / detail — the single source of provenance (no duplication). A cell
 * renders SOLID only when its resolved tier is 'clear' AND it has a source link; otherwise it renders
 * in the dashed "pending verification" style (inferred/unresolved tier, or a missing/broken link).
 */
export function resolveHeroCell(comparison, cell) {
  if (!comparison || !cell) return null;
  const rows = cell.view === 'capability' ? comparison.capabilityRows : comparison.bomRows;
  const row = (rows ?? []).find((r) => (r.area ?? r.capability) === cell.key);
  const side = row?.[cell.side];
  if (!side) {
    return { label: cell.label, tier: 'inferred', sourceUrl: null, sourceLabel: null, detail: null, solid: false };
  }
  const solid = side.tier === 'clear' && typeof side.sourceUrl === 'string' && side.sourceUrl.length > 0;
  return {
    label: cell.label,
    tier: side.tier ?? 'inferred',
    sourceUrl: side.sourceUrl ?? null,
    sourceLabel: side.sourceLabel ?? null,
    detail: side.detail ?? null,
    solid
  };
}
