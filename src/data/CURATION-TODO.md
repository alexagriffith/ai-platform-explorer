# Product Comparison — Curation TODO (bill of materials + capability truth)

**Status: DRAFT. Every cell below is an illustrative placeholder awaiting human-verified truth.**

This ledger is the human gate for `src/data/productComparisons.js`. The dual-view "Product
Comparison" tab currently renders illustrative placeholder rows behind a visible draft banner.
Those rows must NOT be treated as confirmed product contents until a human curates each cell
against a primary source and flips its flag.

## Who executes this

A person — Alexa plus Claude working together in a work-log session — NOT an autonomous coding
agent. An agent must never flip `illustrative` or `draft`, and must never compose new product
claims from model knowledge, the open web, or training data. Placeholder text in the data file
today is either copied/lightly-adapted from strings already shipped in this repo's own catalog
(`products.js`, `subComponents.js`) or the literal sentinel
`Pending curation — confirm with your Red Hat account team`.

## The flip rule (test-enforced ordering)

Per cell, in order:

1. Retrieve the primary source (see "Sources of truth" below) and read the actual line that
   settles the cell.
2. Replace the placeholder `detail` text with the sourced truth (or confirm the copied text is
   correct at bill-of-materials granularity).
3. Set the correct vocabulary value: `included | add-on | not-included | confirm` for BOM rows,
   `yes | partial | no | confirm` for capability rows. **An absence claim ("not-included"/"no") is
   a truth claim too — only assert it from a source that states it.**
4. Set that row's `illustrative: false`.
5. Replace `sourceRef` with the real citation: `<source file / URL>#<location>, retrieved <date>`
   (for a repository, the pinned commit/tag).

Only when **every** row in the comparison has `illustrative: false` do you set the comparison's
`draft: false`. `src/data/productComparisons.test.js` enforces this ordering: it fails if
`draft === false` while any row is still `illustrative: true`, and it requires a non-empty
`sourceRef` on every illustrative row. When the flags flip, the UI draft banner, the PNG-export
watermark, and the copied-summary DRAFT prefix all disappear automatically — no code change.

## Sources of truth

**Primary (machine-readable, highest trust — prefer these for the bill of materials):**

- **S3a — Operator bundles / ClusterServiceVersion (CSV) manifests.** The literal list of what each
  operator installs (the Red Hat OpenShift AI operator; the Red Hat AI Inference Server operator).
  This is ground truth for the BOM view.
- **S3b — Helm charts + rendered image lists.** For the standard-Kubernetes (non-OpenShift) install
  path: `values.yaml` plus rendered manifests, and the disconnected-install image list, enumerate
  exactly what ships there.
- **S3c — Upstream repositories** (llm-d, vLLM, KServe): pin the tags each product release consumes.

**Supporting (documentation — use for support scope and capability claims):**

- **S1 — Red Hat supported-configurations bill-of-materials article:**
  `https://access.redhat.com/articles/rhoai-supported-configs-3.x`
  (HTTP 200 as of 2026-07-09; the request did not redirect, but access.redhat.com articles commonly
  sit behind customer-portal SSO — confirm during curation that the fetched page is real content and
  not a login wall; retrieve via an authenticated browser session and save the copy locally).
  **Naming ambiguity to resolve during curation:** the article slug says "rhoai-supported-configs"
  while the July 2026 platform sync referred to it as the inference-server BOM — whether it
  enumerates the Red Hat AI Inference Server BOM, the Red Hat OpenShift AI BOM, or both is itself a
  curation question. Where documentation and a manifest disagree, the manifest (S3) wins and the
  disagreement is recorded as an open question for the product team.
- **S2 — Product documentation on `https://docs.redhat.com`** for both products (release notes for
  support scope and capability inclusion).
- **S4 — `knowledge-registry.md`** in this repo. When curated claims land, ADD the S1 article (and
  any manifest/repo sources used) to the registry **in the same commit** — the repo rule is that
  content claims trace to listed sources. Placeholders trace to existing in-repo strings today, so
  the registry is not edited until real claims start tracing to S1/S3.

**Retrieval protocol (Alexa's requirement — no drift, no hallucination):**

- **Download, don't browse.** Save every source into
  `projects/architect-data/knowledge-sources/product-comparison-bom/` (in the work-log, not this public
  repo) with its retrieval date and, for repositories, the pinned commit/tag. Rebuild each cell only
  from the local copy — diffable, auditable, re-checkable at the next release.
- **Pin one release pair.** Version the whole comparison against ONE named release (for example the
  3.5 line the docs URL currently resolves to). No mixing versions across cells. Next release =
  re-extraction diff, not re-research.
- **Two-person rule.** Extraction can be automated; the flip to verified stays a human act after
  reading the cited line.

## Cells to curate (16 bill-of-materials + 16 capability = 32)

Product sides: **A = Red Hat AI Inference Server** · **B = Red Hat OpenShift AI (RHOAI)**.
"Current value" shows the shipped placeholder text and its current vocabulary flag.

### Bill-of-materials view (bomRows)

| # | Row (component area) | Side | Current placeholder value | Truth needed | Source to check |
|---|---|---|---|---|---|
| 1 | Inference engine | A | `included` — "vLLM Engine — high-throughput large language model (LLM) inference" | Confirm the vLLM engine ships in the inference server at BOM level and how it is packaged | S3a, S3c, S1 |
| 2 | Inference engine | B | `included` — "KServe model serving with vLLM runtime support" | Confirm KServe with vLLM runtime ships in RHOAI at BOM level | S3a, S1 |
| 3 | OpenAI-compatible API endpoint | A | `included` — "OpenAI-Compatible API — standard API interface" | Confirm the OpenAI-compatible API endpoint is a shipped component | S3a, S2 |
| 4 | OpenAI-compatible API endpoint | B | `included` — "Served through KServe model serving (OpenAI-compatible API)" | Confirm RHOAI exposes the OpenAI-compatible API via KServe at BOM level | S3a, S2 |
| 5 | Model loading and caching | A | `included` — "Model Loader — dynamic model loading and caching" | Confirm the model-loader component ships in the inference server | S3a |
| 6 | Model loading and caching | B | `confirm` — pending sentinel | Determine whether RHOAI ships an equivalent model loader/cache and cite it (or `not-included`) | S3a, S2 |
| 7 | Notebooks / workbenches | A | `confirm` — pending sentinel | Determine whether the inference server includes notebooks/workbenches (expected not — confirm from a source) | S1, S2 |
| 8 | Notebooks / workbenches | B | `included` — "Workbenches — multi-user notebook environments for data science, managed by the Kubeflow notebook controller" | Confirm workbenches ship in RHOAI at BOM level | S3a, S2 |
| 9 | Machine-learning pipelines | A | `confirm` — pending sentinel | Determine whether the inference server includes ML pipelines and cite it (or `not-included`) | S1, S2 |
| 10 | Machine-learning pipelines | B | `included` — "Data Science Pipelines — Kubeflow Pipelines for machine-learning workflows" | Confirm Data Science Pipelines ship in RHOAI at BOM level | S3a, S2 |
| 11 | Distributed training | A | `confirm` — pending sentinel | Determine whether the inference server includes distributed training and cite it (or `not-included`) | S1, S2 |
| 12 | Distributed training | B | `included` — "Distributed Workloads — training across multiple nodes and graphics processing units (GPUs)" | Confirm distributed workloads ship in RHOAI at BOM level | S3a, S2 |
| 13 | Container platform requirement | A | `confirm` — "Runs on Kubernetes footprints — confirm supported platforms with your Red Hat account team" | Confirm the supported container-platform footprints for the inference server | S1, S2 |
| 14 | Container platform requirement | B | `included` — "Requires Red Hat OpenShift as the container platform (self-managed or managed ROSA/ARO)" | Confirm RHOAI's OpenShift requirement and supported managed variants for the pinned release | S1, S2 |
| 15 | Operators, container images, and versions per release | A | `confirm` — pending sentinel | THE heart of the BOM: enumerate the inference server's operators, images, and versions for the pinned release | S3a, S3b, S1 |
| 16 | Operators, container images, and versions per release | B | `confirm` — pending sentinel | THE heart of the BOM: enumerate RHOAI's operators, images, and versions for the pinned release | S3a, S3b, S1 |

### Capability view (capabilityRows)

| # | Row (capability) | Side | Current placeholder value | Truth needed | Source to check |
|---|---|---|---|---|---|
| 17 | Model serving (large language model inference) | A | `yes` — "High-throughput serving of large language models (LLMs)" | Confirm serving support and its scope for the inference server | S2 |
| 18 | Model serving (large language model inference) | B | `yes` — "Production inferencing as part of the full machine-learning lifecycle" | Confirm serving support and its scope for RHOAI | S2 |
| 19 | Autoscaling of model servers | A | `confirm` — pending sentinel | Determine whether the inference server supports model-server autoscaling and cite it (or `no`) | S2 |
| 20 | Autoscaling of model servers | B | `yes` — "Via KServe — Horizontal Pod Autoscaler (HPA), KEDA, or Knative" | Confirm RHOAI/KServe autoscaling mechanisms for the pinned release | S2 |
| 21 | Gateway / model-as-a-service access layer | A | `confirm` — "Red Hat AI Gateway integration — confirm availability and scope with your Red Hat account team" | Confirm AI Gateway availability/scope for the inference server (gateway is `Check with Red Hat` in the catalog) | S2 |
| 22 | Gateway / model-as-a-service access layer | B | `confirm` — "Red Hat AI Gateway integration — confirm availability and scope with your Red Hat account team" | Confirm AI Gateway availability/scope for RHOAI | S2 |
| 23 | Observability and responsible-AI monitoring | A | `confirm` — pending sentinel | Determine the inference server's observability/responsible-AI story and cite it (or `no`/`partial`) | S2 |
| 24 | Observability and responsible-AI monitoring | B | `yes` — "TrustyAI — explainability, monitoring, and audit trails" | Confirm TrustyAI inclusion/scope in RHOAI | S2 |
| 25 | Notebooks and experimentation | A | `confirm` — pending sentinel | Determine whether the inference server offers notebooks/experimentation and cite it (or `no`) | S2 |
| 26 | Notebooks and experimentation | B | `yes` — "Workbenches — multi-user notebook environments for data science" | Confirm workbenches capability in RHOAI | S2 |
| 27 | Automated machine-learning pipelines | A | `confirm` — pending sentinel | Determine whether the inference server offers ML pipelines and cite it (or `no`) | S2 |
| 28 | Automated machine-learning pipelines | B | `yes` — "Kubeflow Pipelines-based automation for repeatable machine-learning workflows" | Confirm Data Science Pipelines capability in RHOAI | S2 |
| 29 | Model registry integration | A | `yes` (status `Tech Preview`) — "Integrates with Model Registry" | Confirm Model Registry integration + maturity for the inference server | S2 |
| 30 | Model registry integration | B | `yes` (status `Tech Preview`) — "Integrates with Model Registry" | Confirm Model Registry integration + maturity for RHOAI | S2 |
| 31 | Model fine-tuning and alignment | A | `confirm` — pending sentinel | Determine whether the inference server offers fine-tuning/alignment and cite it (or `no`) | S2 |
| 32 | Model fine-tuning and alignment | B | `yes` — "InstructLab — alignment and fine-tuning using synthetic data and the LAB method" | Confirm fine-tuning/alignment (InstructLab) scope in RHOAI | S2 |

## Not in v1 scope (curation-time decision, not an agent decision)

The first comparison pair is deliberately **Red Hat AI Inference Server vs Red Hat OpenShift AI**
only. Excluded from v1:

- **Red Hat AI Enterprise** (`rhaie`) — the integrated OpenShift + OpenShift AI path.
- **The standard-Kubernetes portfolio path** (`rhai`) — the non-OpenShift (EKS/AKS/GKE/self-managed)
  path, and the delivery differences it implies.

Adding either as a second comparison object (or a third product column) is a decision to make during
curation, not automatically.

## Sign-off

Curated by: ____   Date: ____   Product-manager / source sign-off (if obtained): ____

---

## Component versions — provenance ledger (37 rows in `src/data/componentVersions.js`)

Source: `src/data/componentVersions.js`. Two tables — RHOAI 3.5-ea.2 (22 rows) and RHAI 3.4 (15 rows).

### RHOAI 3.5-ea.2 — 22 component rows

Status: **sourced (manifest 2e3c420, verified by independent review)**

All 22 rows trace to pinned commit `2e3c4206e9a35fb9cbe5eaacf257695560520e83` of
`opendatahub-io/opendatahub-operator` `get_all_manifests.sh`. Each row carries a per-line
`sourceUrl` pointing to the exact line in that file (e.g. `#L40`). Independent review confirmed
line-by-line: every version string, SHA, and line reference matches the pinned document.
No edits needed until the next release extraction.

| Row | Component | Version | Line |
|-----|-----------|---------|------|
| 1 | Dashboard (odh-dashboard) | rhoai-3.5-ea.2 @b2fe40c | L40 |
| 2 | Workbenches — kf-notebook-controller | rhoai-3.5-ea.2 @0dfef85 | L41 |
| 3 | Workbenches — odh-notebook-controller | rhoai-3.5-ea.2 @0dfef85 | L42 |
| 4 | Workbenches — Notebooks | rhoai-3.5-ea.2 @77780fe | L43 |
| 5 | KServe | rhoai-3.5-ea.2 @f255870 | L44 |
| 6 | Ray (KubeRay) | rhoai-3.5-ea.2 @d14f765 | L45 |
| 7 | TrustyAI Service Operator | rhoai-3.5-ea.2 @ac6e72e | L46 |
| 8 | Model Registry Operator | rhoai-3.5-ea.2 @33d02a8 | L47 |
| 9 | Training Operator (Kubeflow) | rhoai-3.5-ea.2 @16a06f5 | L48 |
| 10 | Data Science Pipelines Operator | rhoai-3.5-ea.2 @24f6be6 | L49 |
| 11 | ODH Model Controller | rhoai-3.5-ea.2 @8af23e6 | L50 |
| 12 | Feast Operator | rhoai-3.5-ea.2 @c87449c | L51 |
| 13 | OGX Kubernetes Operator | rhoai-3.5-ea.2 @bff797d | L52 |
| 14 | Trainer | rhoai-3.5-ea.2 @77010a2 | L53 |
| 15 | Models as a Service (MaaS) Billing | rhoai-3.5-ea.2 @df0370f | L54 |
| 16 | MLflow Operator | rhoai-3.5-ea.2 @79d5739 | L55 |
| 17 | Spark Operator | rhoai-3.5-ea.2 @afe2757 | L56 |
| 18 | Workload Variant Autoscaler | rhoai-3.5-ea.2 @a3a58e1 | L57 |
| 19 | cert-manager Operator (chart) | rhoai-3.5-ea.2 @7060bda | L74 |
| 20 | LWS Operator (chart) | rhoai-3.5-ea.2 @7060bda | L75 |
| 21 | Sail Operator (chart) | rhoai-3.5-ea.2 @7060bda | L76 |
| 22 | Gateway API (chart) | rhoai-3.5-ea.2 @7060bda | L77 |

### RHAI 3.4 — 15 component rows

Status: **pending public source — needs official 3.4 release-notes or catalog URL per row**

Version values are known from internal verification. No public URL exists yet that confirms
these exact version strings for Red Hat AI Inference Server 3.4. The UI renders these rows with
dashed/pending styling and no source hyperlinks until a public source is available.

Action required (human, not agent): when the RHAI 3.4 release notes or a public operator
manifest appears on `docs.redhat.com` or `catalog.redhat.com`, update each row's `sourceUrl`
and `sourceLabel` in `src/data/componentVersions.js` and update this ledger to 'sourced'.

| Row | Component | Version | Needed source |
|-----|-----------|---------|---------------|
| 1 | Red Hat AI Inference | 3.4.0 | Official 3.4 release notes or catalog manifest URL |
| 2 | vLLM | 0.18.0+rhaiv.7 | Official 3.4 release notes or catalog manifest URL |
| 3 | RHAI Operator | XKS 3.4.0 | Official 3.4 release notes or catalog manifest URL |
| 4 | Cloud Manager Operator | 3.4.0 | Official 3.4 release notes or catalog manifest URL |
| 5 | llm-d Inference Scheduler | v0.7.1 | Official 3.4 release notes or catalog manifest URL |
| 6 | llm-d Workload Variant Autoscaler | v0.6.0 | Official 3.4 release notes or catalog manifest URL |
| 7 | Gateway API | v1.4.0 | Official 3.4 release notes or catalog manifest URL |
| 8 | Gateway API Inference Extension | v1.3.1 | Official 3.4 release notes or catalog manifest URL |
| 9 | Istio | 1.27.8_ossm | Official 3.4 release notes or catalog manifest URL |
| 10 | Sail Operator | v3.2.3 | Official 3.4 release notes or catalog manifest URL |
| 11 | cert-manager | v1.18.4 | Official 3.4 release notes or catalog manifest URL |
| 12 | LWS (Leader Worker Set) | v0.7.0 | Official 3.4 release notes or catalog manifest URL |
| 13 | KServe (LLMISvc Controller) | v0.17.0 | Official 3.4 release notes or catalog manifest URL |
| 14 | EKS (Kubernetes) | v1.34.8-eks | Official 3.4 release notes or catalog manifest URL |
| 15 | Helm Chart | 0.1.20887+863cde804 | Official 3.4 release notes or catalog manifest URL |
