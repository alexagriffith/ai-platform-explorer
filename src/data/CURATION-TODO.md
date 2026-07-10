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
