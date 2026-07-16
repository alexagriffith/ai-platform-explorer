# CURATION-ANSWERS — RHAIS vs RHOAI product comparison (32 cells)

**Extraction pass, 2026-07-10, by Claude (agent). Extract-only from the downloaded sources in
`SOURCES.md`. Every proposed value carries a verbatim quote + provenance. This is a PROPOSAL for the
human two-person flip — no `illustrative`/`draft` flag was touched, and nothing here is authoritative
until a human reviewer reads the cited line and flips it in `productComparisons.js`.**

- **A = Red Hat AI Inference Server (RHAIS) 3.1** · **B = Red Hat OpenShift AI (RHOAI) 3.4 GA / 3.5.0-ea.2 manifests**
- Confidence tiers: **clear** (primary states it directly) · **inferred** (follows from product
  scope / a related-source line, not a direct statement) · **unresolved** (downloads can't settle it).
- **Absence claims** ("not-included"/"no") for the A side rest on RHAIS's scoping statement
  ("a container image that optimizes serving and inferencing with LLMs") — honest but **inferred**;
  a one-line RHAIS-PM confirmation would raise them to clear.

## Counts
- **Resolved-clear: 19** — 1,2,3,4,8,10,12,13,14,15,16,17,18,20,22,24,26,28,32
- **Inferred: 12** — 5,6,7,9,11,19,21,23,25,27,29,31
- **Unresolved: 1** — 30 (inclusion inferred; GA/Tech-Preview *maturity* unresolved)
- **Source-vs-source conflicts: 1** — cell 30 area (S1 doc vs S3a manifest naming/inclusion)
- **Placeholder corrections (high-value deltas, placeholder was wrong for the 3.x pin): 3** — cells 20, 29, 32

---

# BILL-OF-MATERIALS VIEW (bomRows)

### Cell 1 — Inference engine · A (RHAIS) — proposed: `included` — CLEAR
Detail: "Built on the upstream vLLM engine; RHAIS 3.1 ships vLLM core 0.9.0.1, delivered as the `rhaiis/vllm-*` container images."
- Quote: "AI Inference Server leverages the upstream vLLM project, which provides state-of-the-art inferencing features." — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Ch.1, retrieved 2026-07-10.
- Quote: "| vLLM core | 0.9.0.1 |" — `s2-docs-redhat/rhais-3.1-supported-product-and-hardware-configurations.txt`, Table 1.1.

### Cell 2 — Inference engine · B (RHOAI) — proposed: `included` — CLEAR
Detail: "KServe model serving (GA 0.17.0) with vLLM runtimes; RHOAI 3.4 ships vLLM 0.18.0 (CUDA)."
- Quote: "| KServe | GA | 0.15 | GA | 0.17.0 |" and "| vLLM CUDA | v0.13.0 | v0.18.0 |" — `s1-access-redhat/…-3.x.txt`, "Architecture, Version and Components" / "RHOAI and vLLM version compatibility".
- Quote: `["kserve"]="red-hat-data-services:kserve:rhoai-3.5-ea.2@f255870…:config"` — `s3a-odh-operator/get_all_manifests.sh`, RHOAI_COMPONENT_MANIFESTS.

### Cell 3 — OpenAI-compatible API endpoint · A — proposed: `included` — CLEAR
Detail: "vLLM (the RHAIS engine) exposes an OpenAI-compatible API server."
- Quote: "OpenAI-compatible API server, plus Anthropic Messages API and gRPC support" — `s3c-upstream/vllm-README.md`, line 49.
- Corroboration: benchmark "Other options for --backend are: tgi, lmdeploy, deepspeed-mii, openai, and openai-chat" — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Ch.4.

### Cell 4 — OpenAI-compatible API endpoint · B — proposed: `included` — CLEAR
Detail: "Served via KServe, which provides an OpenAI-compatible inference protocol."
- Quote: "Standardization: OpenAI-compatible inference protocol for seamless integration with LLMs" — `s3c-upstream/kserve-README.md`, Generative-AI features (line 26).

### Cell 5 — Model loading and caching · A — proposed: `included` (as intrinsic capability) — INFERRED
Detail: "Model loading/caching is intrinsic to the vLLM engine (registry.redhat.io / Hugging Face pull, local-path load, prefix caching) — not a separately named 'Model Loader' component in RHAIS docs."
- Quote: "Continuous batching of incoming requests, chunked prefill, prefix caching" — `s3c-upstream/vllm-README.md`, line 32.
- Quote (loading behavior): "When Red Hat AI Inference Server loads a model from disk, the process sometimes hangs… store the model in a local disk…" — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Ch.5.1.
- Note: the placeholder's discrete "Model Loader" component name is NOT verified in any primary; recommend rewording to "vLLM model loading + prefix caching".

### Cell 6 — Model loading and caching · B — proposed: `included` — INFERRED
Detail: "Via KServe: intelligent model caching and KV-cache offloading to CPU/disk."
- Quote: "Model Caching: Intelligent model caching to reduce loading times…" and "KV Cache Offloading: Advanced memory management with KV cache offloading to CPU/disk…" — `s3c-upstream/kserve-README.md`, lines 28-29.
- Inclusion basis: KServe ships in RHOAI (Cell 2). Inferred because the caching detail is in the KServe README, not an RHOAI doc.

### Cell 7 — Notebooks / workbenches · A — proposed: `not-included` — INFERRED (scope)
Detail: "RHAIS is a serving/inferencing container image; its docs enumerate no notebook/workbench component."
- Quote: "Red Hat AI Inference Server is a container image that optimizes serving and inferencing with LLMs." — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Preface.
- Needs: 1-line RHAIS-PM confirmation to reach clear (no explicit "notebooks not included" statement exists).

### Cell 8 — Notebooks / workbenches · B — proposed: `included` — CLEAR
Detail: "Workbenches GA 1.10.0 — Kubeflow notebook controller + odh-notebook-controller + prebuilt notebook images (Jupyter/Code Server, incl. CUDA/ROCm, TrustyAI, PyTorch LLM Compressor)."
- Quote: "| Workbenches | GA | 1.10.0 | GA | 1.10.0 |" — `s1-access-redhat/…-3.x.txt`, component table; plus the "Supported workbench images" section (Jupyter/Code Server image tables).
- Quote: `["workbenches/kf-notebook-controller"]="red-hat-data-services:kubeflow:rhoai-3.5-ea.2@…"` (+ odh-notebook-controller, notebooks) — `s3a-odh-operator/get_all_manifests.sh`.

### Cell 9 — Machine-learning pipelines · A — proposed: `not-included` — INFERRED (scope)
Detail: "No pipelines component in the RHAIS container (serving/inferencing only)."
- Quote: (scope) "Red Hat AI Inference Server is a container image that optimizes serving and inferencing with LLMs." — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Preface.

### Cell 10 — Machine-learning pipelines · B — proposed: `included` — CLEAR
Detail: "Data Science Pipelines GA 2.16.0 (Argo Workflows v3.7.3 backend); the DSC v2 API field is now `aipipelines`."
- Quote: "| Data science pipelines | GA | 2.5.0 | GA | 2.16.0 |" and "| Argo Workflows | GA | v3.6.7 | GA | v3.7.3 |" — `s1-access-redhat/…-3.x.txt`, component table.
- Quote: "// AIPipelines component configuration." — `s3a-odh-operator/api-dsc/datasciencecluster_v2_types.go`, line 39.
- Note: InstructLab data-science-pipeline was removed since 3.0 (see Cell 32).

### Cell 11 — Distributed training · A — proposed: `not-included` — INFERRED (scope)
Detail: "RHAIS does inference-time tensor parallelism, not distributed *training*."
- Quote: "It also uses tensor parallelism to distribute LLM workloads across multiple GPUs." (this is for inference) — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Ch.1. No training component in RHAIS docs.

### Cell 12 — Distributed training · B — proposed: `included` — CLEAR
Detail: "Distributed training via Kubeflow Trainer v2 (GA 2.1.0) + Kubeflow Training Operator v1 (Deprecated 1.9.0) + KubeRay (GA 1.4.2); Ray-based and torch-distributed ClusterTrainingRuntimes."
- Quote: "| Kubeflow Trainer v2 | GA | 2.1.0 |", "| Kubeflow v1 Training Operator | Deprecated | 1.9.0 |", "| Kuberay | GA | 1.4.2 |" — `s1-access-redhat/…-3.x.txt`, component table; plus "Ray-based training images" and "Kubeflow Trainer v2 ClusterTrainingRuntimes" (torch-distributed, training-hub) tables.
- Note: placeholder term "Distributed Workloads" is the RHOAI 2.x umbrella that included **CodeFlare**; CodeFlare is **dropped from the DSC v2 API** (`datasciencecluster_v2_types.go` has no CodeFlare field). Recommend updating terminology to "Kubeflow Trainer v2 / KubeRay".

### Cell 13 — Container platform requirement · A — proposed: `not-included` (no OpenShift requirement) — CLEAR
Detail: "No OpenShift requirement. Runs as a container image on OpenShift 4.14-4.18, ROSA, RHEL 9.2-10.0, generic Linux, or generic Kubernetes — 'OpenShift Container Platform Operators are not required.'"
- Quote: "Red Hat AI Inference Server is available only as a container image. The host operating system and kernel must support the required accelerator drivers." — `s2-docs-redhat/rhais-3.1-supported-product-and-hardware-configurations.txt`, Ch.3 Note.
- Quote: Table 3.1 rows — "Red Hat Enterprise Linux (RHEL) | 9.2 - 10.0", "Linux (not RHEL) | … OpenShift Container Platform Operators are not required.", "Kubernetes (not OpenShift Container Platform)" — same file, Ch.3.
- **Vocab flag:** `included/not-included` fits awkwardly for a "requirement" row; the truth is "portable / no OpenShift required." Put the nuance in `detail`, not the flag. This is the single sharpest A-vs-B differentiator.

### Cell 14 — Container platform requirement · B — proposed: `included` — CLEAR
Detail: "Requires Red Hat OpenShift (installed via the RHOAI Operator). Self-managed on OCP (x86_64/ppc64le/s390x/aarch64) across bare metal, SNO, IBM Cloud/Power/Z, AWS/GCP/Azure/vSphere/Nutanix/Oracle; managed OSD, ROSA (classic + HCP), ARO, OpenShift Kubernetes Engine. Not supported on MicroShift."
- Quote: "You install OpenShift AI Self-Managed by installing the Red Hat OpenShift AI Operator… RHOAI Self-Managed is supported on OpenShift Container Platform running on x86_64, ppc64le, s390x and aarch64 architectures." — `s1-access-redhat/…-3.x.txt`, "Red Hat OpenShift AI Self-Managed".
- Quote: "Currently, RHOAI Self-Managed is not supported on OpenShift running on platforms such as MicroShift." — same section.

### Cell 15 — Operators, container images, versions · A — proposed: `included` (enumerated) — CLEAR
Detail: "No product operator. Delivered as container images from `registry.access.redhat.com/rhaiis`: `rhaiis/vllm-cuda-rhel9` (vLLM 0.9.0.1), `rhaiis/vllm-rocm-rhel9` (vLLM 0.8.4), `rhaiis/vllm-xla-rhel9` (vLLM 0.8.5); optional LLM Compressor 0.5.1 (Tech Preview). On OpenShift, requires NVIDIA GPU Operator 24.3 / AMD GPU Operator 6.2 + Node Feature Discovery."
- Quote: Table 2.1-2.3 container images + "| LLM Compressor | 0.5.1 Technology Preview |" — `s2-docs-redhat/rhais-3.1-supported-product-and-hardware-configurations.txt`, Ch.1-2.
- Quote: "Security and critical bug fixes are delivered as container images available from the registry.access.redhat.com/rhaiis container registry…" — same file, Ch.5.

### Cell 16 — Operators, container images, versions · B — proposed: `included` (enumerated) — CLEAR
Detail: "Single RHOAI Operator (`rhods-operator`) managing a DataScienceCluster. RHOAI 3.4 GA component versions: Dashboard 2.0.0, Data science pipelines 2.16.0 (Argo v3.7.3), Distributed Inference with llm-d 0.7.1, Feature Store 0.62.0, KServe 0.17.0, Red Hat AI Inference 3.4.0, Kubeflow Trainer v2 2.1.0, KubeRay 1.4.2, Llama Stack Operator TP 0.9.0, LMEval 0.4.8, MaaS 0.1.1, MLflow 3.10.1, AI Hub 0.3.9, TrustyAI 1.37.0, Workbenches 1.10.0 (+ IBM Spyre Operator on s390x). For 3.5-ea.2, 18 upstream component manifests + 4 chart deps (cert-manager, lws-operator, sail-operator, gateway-api) + platform manifests (osd-configs, hardwareprofiles, connectionAPI) are enumerated with pinned commits."
- Quote (versions): the x86_64 "Architecture, Version and Components" table — `s1-access-redhat/…-3.x.txt`.
- Quote (manifest map): entire `RHOAI_COMPONENT_MANIFESTS` + `RHOAI_COMPONENT_CHARTS` + `PLATFORM_MANIFESTS` blocks — `s3a-odh-operator/get_all_manifests.sh`, lines 39-57, 73-78, 107-111.
- Note: 3.4 GA (doc) vs 3.5-ea.2 (manifest) version skew — cite both when this cell is finalized.

---

# CAPABILITY VIEW (capabilityRows)

### Cell 17 — Model serving (LLM inference) · A — proposed: `yes` — CLEAR
- Quote: "Red Hat AI Inference Server is a container image that optimizes serving and inferencing with LLMs." + "continuous batching… tensor parallelism… paged attention… reduced latency and higher throughput." — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Preface/Ch.1.

### Cell 18 — Model serving (LLM inference) · B — proposed: `yes` — CLEAR
Detail: "Production LLM serving via KServe (GA 0.17.0) + vLLM runtimes; also predictive-AI serving (OVMS, NVIDIA Triton, MLServer, Caikit)."
- Quote: "Supported model-serving runtimes" table (vLLM NVIDIA/AMD/Gaudi/CPU/Spyre ServingRuntimes for KServe; OpenVINO Model Server; MLServer; Caikit) — `s1-access-redhat/…-3.x.txt`.

### Cell 19 — Autoscaling of model servers · A — proposed: `no` (standalone) / `partial` — INFERRED
Detail: "The RHAIS container itself provides no autoscaling; scaling is provided by the surrounding orchestration (KServe / llm-d / Kubernetes HPA) when RHAIS runs on Kubernetes."
- Basis: no autoscaling mechanism in RHAIS getting-started / supported-configs. Inferred from scope; corroborated (secondary) by internal field notes and KServe's autoscaling being a KServe/K8s feature.

### Cell 20 — Autoscaling of model servers · B — proposed: `yes` — CLEAR  ⚠️ PLACEHOLDER CORRECTION
Detail (corrected): "Autoscaling of KServe **RawDeployment** model servers via Kubernetes HPA/KEDA. RHOAI 3.5 KServe supports RawDeployment mode ONLY, so Knative/Serverless scale-to-zero is not the mechanism. RHOAI 3.5-ea.2 also ships a workload-variant-autoscaler (WVA) and llm-d provides SLO-aware autoscaling."
- Quote: "Kserve component configuration. // Only RawDeployment mode is supported." — `s3a-odh-operator/api-dsc/datasciencecluster_v2_types.go`, lines 43-44.
- Quote: every runtime's "Deployment mode" = "Raw" — `s1-access-redhat/…-3.x.txt`, "Deployment requirements for supported model-serving runtimes".
- Quote: "[Standard Kubernetes Installation]… this option does not support canary deployment and request based autoscaling with scale-to-zero." — `s3c-upstream/kserve-README.md`, line 50.
- Quote: `["wva"]="red-hat-data-services:workload-variant-autoscaler:rhoai-3.5-ea.2@…"` — `s3a-odh-operator/get_all_manifests.sh`, line 57; and "proactive, SLO-aware autoscaling based on real-time inference signals" — `s3c-upstream/llm-d-README.md`, line 28.
- **Correction:** placeholder detail "Via KServe — Horizontal Pod Autoscaler (HPA), KEDA, or **Knative**" — "Knative" is wrong for the 3.5 RawDeployment-only pin. Keep HPA/KEDA; drop/qualify Knative.

### Cell 21 — Gateway / model-as-a-service access layer · A — proposed: `no` — INFERRED
Detail: "The RHAIS container includes no gateway/MaaS layer; a gateway (KServe inference gateway / Red Hat Connectivity Link) is a separate layer added when RHAIS is deployed on Kubernetes/OpenShift."
- Basis: no gateway/MaaS in RHAIS docs. Inferred from scope; the gateway is a RHOAI/platform concern (Cell 22).

### Cell 22 — Gateway / model-as-a-service access layer · B — proposed: `yes` — CLEAR
Detail: "Models-as-a-Service (MaaS) GA 0.1.1 in 3.4. When MaaS is enabled, Red Hat Connectivity Link (RHCL) deploys via the Kuadrant Operator for authentication, authorization, and rate limiting. RHOAI 3.5-ea.2 ships a `maas` component + a Gateway API chart."
- Quote: "| MaaS | TP | 0.0.2 | GA | 0.1.1 |" — `s1-access-redhat/…-3.x.txt`, component table.
- Quote: "Starting with RHOAI 3.4, Red Hat Connectivity Link (RHCL) is included in Red Hat AI SKUs for Models as a Service (MaaS) use cases only… When MaaS is enabled, RHCL is deployed via the Kuadrant Operator, which provides authentication, authorization, and rate limiting." — same file, "Operator Dependencies".
- Quote: `["maas"]="red-hat-data-services:maas-billing:rhoai-3.5-ea.2@…"` + `["gateway-api"]=…` — `s3a-odh-operator/get_all_manifests.sh`, lines 54, 77.
- Naming: the placeholder's "Red Hat AI Gateway" maps to MaaS + RHCL/Kuadrant in the sources.

### Cell 23 — Observability / responsible-AI monitoring · A — proposed: `partial` — INFERRED
Detail: "RHAIS exposes vLLM serving metrics (TTFT, TPOT, latency, throughput) for observability; it includes no responsible-AI / explainability / audit tooling."
- Quote: "Time to first token (TTFT)… Time per output token (TPOT)… Latency… Throughput" — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Ch.4 (metrics = clear). Responsible-AI absence = scope inference.

### Cell 24 — Observability / responsible-AI monitoring · B — proposed: `yes` — CLEAR
Detail: "TrustyAI GA 1.37.0 (explainability, bias/drift monitoring, audit); LM evaluation via LMEval GA 0.4.8; TrustyAI workbench images."
- Quote: "| TrustyAI | GA | 1.37.0 | GA | 1.37.0 |" and "| LMEval | GA | 0.4.8 |" — `s1-access-redhat/…-3.x.txt`, component table.
- Quote: `["trustyai"]="red-hat-data-services:trustyai-service-operator:rhoai-3.5-ea.2@…"` — `s3a-odh-operator/get_all_manifests.sh`, line 46.

### Cell 25 — Notebooks and experimentation · A — proposed: `no` — INFERRED (scope) — see Cell 7.
- Quote (scope): "Red Hat AI Inference Server is a container image that optimizes serving and inferencing with LLMs." — `s2-docs-redhat/rhais-3.1-getting-started.txt`, Preface.

### Cell 26 — Notebooks and experimentation · B — proposed: `yes` — CLEAR — see Cell 8.
- Quote: "| Workbenches | GA | 1.10.0 |" + "Supported workbench images" tables — `s1-access-redhat/…-3.x.txt`.

### Cell 27 — Automated machine-learning pipelines · A — proposed: `no` — INFERRED (scope) — see Cell 9.

### Cell 28 — Automated machine-learning pipelines · B — proposed: `yes` — CLEAR — see Cell 10.
- Quote: "| Data science pipelines | GA | … | GA | 2.16.0 |" — `s1-access-redhat/…-3.x.txt`.

### Cell 29 — Model registry integration · A — proposed: `no` / `not-included` — INFERRED  ⚠️ PLACEHOLDER CORRECTION
Detail: "Model Registry is not part of the RHAIS container; it is a RHOAI platform component."
- Basis: RHAIS docs describe only serving/inferencing (Preface/Ch.1) — no model registry. The model-registry-operator appears only under RHOAI's manifests (Cell 30), not RHAIS.
- **Correction:** placeholder said `yes` (Tech Preview) for A. At RHAIS-container BOM granularity that is not supported by any RHAIS primary; it appears to reflect the shared "Red Hat AI" model registry, not the RHAIS bill of materials.

### Cell 30 — Model registry integration · B — proposed: `yes` (ships); maturity UNRESOLVED  ⚠️ SOURCE-vs-SOURCE CONFLICT
Detail: "Model Registry ships (model-registry-operator v0.3.10 in 3.5-ea.2; DSC `ModelRegistry` component). GA/Tech-Preview maturity for the pinned release is NOT settled by the downloads."
- Quote (ships): `["modelregistry"]="red-hat-data-services:model-registry-operator:rhoai-3.5-ea.2@33d02a8…"` — `s3a-odh-operator/get_all_manifests.sh`, line 47; "// ModelRegistry component configuration." — `datasciencecluster_v2_types.go`, line 55.
- **CONFLICT:** the S1 RHOAI 3.4 component table lists "| AI Hub | GA | 0.3.5 | GA | 0.3.9 |" but has **no line named "Model Registry"** — so the supported-configs doc (S1) and the operator manifests (S3a) describe this area differently (AI Hub vs model-registry-operator). Whether "AI Hub" is the 3.x front-end for Model Registry, and the model-registry maturity (placeholder said Tech Preview), needs RHOAI release-notes or product-team confirmation.

### Cell 31 — Model fine-tuning and alignment · A — proposed: `no` — INFERRED
Detail: "RHAIS is an inference runtime; it does not fine-tune/align. It includes LLM Compressor (post-training quantization/compression) — model optimization, not fine-tuning."
- Quote: "| LLM Compressor | 0.5.1 Technology Preview |" — `s2-docs-redhat/rhais-3.1-supported-product-and-hardware-configurations.txt`, Table 1.1 (LLM Compressor fact = clear; "not fine-tuning" = scope inference).

### Cell 32 — Model fine-tuning and alignment · B — proposed: `yes` — CLEAR  ⚠️ PLACEHOLDER CORRECTION
Detail (corrected): "Fine-tuning/alignment via Kubeflow Trainer v2 ClusterTrainingRuntimes (training-hub, torch-distributed) with PEFT, TRL, DeepSpeed, Unsloth. **InstructLab (the LAB method) was REMOVED from RHOAI since 3.0** — the placeholder's InstructLab claim is stale for the 3.4/3.5 pin."
- Quote: "reason: Removed with InstrutLab pipeline removal since RHOAI 3.0" (applies to `RELATED_IMAGE_ODH_ML_PIPELINES_RUNTIME_GENERIC_IMAGE`, `RELATED_IMAGE_DSP_INSTRUCTLAB_NVIDIA_IMAGE`, `RELATED_IMAGE_DSP_TOOLBOX_IMAGE`; Jira RHOAIENG-60396) — `s3a-odh-operator/component-params-env.yaml`, lines 18-23.
- Quote (replacement mechanism): "Kubeflow Trainer v2 ClusterTrainingRuntimes… ready-to-use templates for distributed PyTorch training jobs" with "training-hub … PEFT: 0.18.1, TRL: 0.24.0, DeepSpeed: 0.18.9, Unsloth …" — `s1-access-redhat/…-3.x.txt`, "Kubeflow Trainer v2 ClusterTrainingRuntimes".
- **Correction:** flip the RHOAI fine-tuning detail from "InstructLab" to "Kubeflow Trainer v2 (training-hub / torch-distributed; PEFT/TRL/DeepSpeed)."

---

# PROPOSED NEW ROWS (addendum item 3 — the 8+8 placeholders are not the component universe)

The RHOAI/ODH operator's `get_all_manifests.sh` + `datasciencecluster_v2_types.go` enumerate ~18
components; RHAIS supported-configs adds LLM Compressor. Component areas the current table omits, each
already sourced below (recommend adding as BOM + capability rows):

| Proposed area | A (RHAIS) | B (RHOAI) | Source |
|---|---|---|---|
| **Model optimization / compression (LLM Compressor)** | `included` — LLM Compressor 0.5.1 (Tech Preview) | `included` — "PyTorch LLM Compressor" workbench image (LLM-Compressor 0.9) | S2 RHAIS Table 1.1; S1 workbench-images table |
| **Distributed inference / P-D disaggregation (llm-d)** | `partial` — llm-d layers on RHAIS on K8s (secondary EKS notes) | `included` — "Distributed Inference with llm-d" GA 0.7.1 (needs OCP 4.20+) | S1 component table (note 1); `s3c-upstream/llm-d-README.md` |
| **Feature store (Feast)** | `not-included` | `included` — "Feature Store GA 0.62.0"; `feastoperator` manifest | S1 table; get_all_manifests.sh line 51 |
| **Model evaluation (LMEval)** | `no` | `yes` — "LMEval GA 0.4.8" | S1 component table |
| **Experiment tracking (MLflow)** | `no` | `yes` — "MLflow GA 3.10.1"; `mlflowoperator` manifest | S1 table; get_all_manifests.sh line 55 |
| **Model catalog (AI Hub)** | `no` | `yes` — "AI Hub GA 0.3.9" | S1 component table |
| **Agentic / GenAI runtime (Llama Stack → OGX)** | `no` | `add-on` — "Llama Stack Operator TP 0.9.0"; DSC marks LlamaStackOperator "Deprecated: Use OGX instead" | S1 table; datasciencecluster_v2_types.go lines 64-69 |
| **Dependency operators (Service Mesh/Istio, Serverless/Knative, Kueue, cert-manager, LeaderWorkerSet, Gateway API, Authorino, GPU operators)** | RHAIS needs only GPU operators (on OCP) | RHOAI requires a stack of operator deps | S1 "Operator Dependencies"; get_all_manifests.sh charts; S2 RHAIS Ch.4 |
| **Data processing (Spark)** | `not-included` | `included` — `sparkoperator` manifest | get_all_manifests.sh line 56 |

Also worth encoding as explicit deltas:
- **Dropped in RHOAI 3.x:** ModelMesh serving and CodeFlare (present only as v1alpha1 backward-compat
  types; absent from the DSC v2 component set) — `datasciencecluster_v2_types.go` (no ModelMesh/CodeFlare fields).
- **RHAIS ⊂ RHOAI:** "Red Hat AI Inference | GA | 3.4.0" is itself a line item in the RHOAI BOM
  (`s1-access-redhat/…-3.x.txt`) — the two products are nested, and version independently
  (RHAIS 3.1 = vLLM 0.9.0.1; RHOAI-embedded 3.4.0 = vLLM 0.18.0).

---

# UNRESOLVED / WHAT'S NEEDED
- **Cell 30 maturity** — GA vs Tech-Preview of RHOAI Model Registry for the pinned release, and the
  AI-Hub-vs-Model-Registry naming reconciliation → RHOAI 3.4/3.5 release notes or PM confirmation.
- **RHOAI introduction/release-notes (S2)** — not separately downloaded (S1 covered composition).
  Pull if capability-view *prose* (vs the component facts above) needs a canonical RHOAI-doc citation.
- **S3b disconnected-install image list** — the `RHOAI-Build-Config helm/rhai-on-xks-chart/values.yaml`
  (rhaiOperator.relatedImages) is the definitive "what images ship on non-OpenShift Kubernetes" answer;
  it lives in a private build-config repo not fetched here.
- **RHAIS absence claims (cells 7,9,11,25,27,29,31)** — currently inferred from RHAIS product scope;
  a 1-line RHAIS-PM "these platform features are not in the RHAIS container" confirmation flips them to clear.
  → **Most now upgraded by the catalog pass below** (registry-level image enumeration).

---

# CATALOG VERIFICATION 2026-07-10 (registry-level BOM — the "exact definition in catalog")

Second pass verifying every chip against the **catalog.redhat.com container API** (registry BOM),
the **productized downstream** operator repo (S3d), and re-pulled current product docs (S2b, now
curl-able). New sources pinned in `SOURCES.md`. Working catalog filter syntax (for reuse):
`curl -G "…/api/containers/v1/repositories" --data-urlencode "filter=repository=in=(name1,name2)"` —
only `==` and `=in=` work; `*`/regex return `total:0`. Full RHOAI set via product-listing
`63b85b573112fe5a95ee9a3a`'s `/repositories`.

## Verification scorecard
- **Confirmed at registry/catalog level (already clear, now catalog-backed): 14** — cells 1,2,3,4,13,14,15,16,17,18,20,22,24,32
- **Upgraded a tier: 8** — cell **30 UNRESOLVED → CLEAR (Tech Preview)**; cells **7,9,11,25,27,31 INFERRED → CLEAR** (absence now proven by the complete RHAIS image enumeration); cell **29 INFERRED → CLEAR** (model-registry exists only under `rhoai/`, never `rhaiis/`)
- **Strengthened, kept inferred: 4** — cells 5,6,19,21,23 (mechanism-in-engine / surrounding-orchestration claims; no separate image to point at)
- **New sources pinned: 6** — S4 catalog API (3 JSON sets), S3d downstream rhoai-3.4 manifest, S2b (3 re-pulled docs), S3b chart record (binary still auth-gated)
- **Still unverifiable anonymously online: 1** — the rhai-on-xks-chart's internal `values.yaml` image list (registry.redhat.io auth + terms); exact pull command for a maintainer is in SOURCES.md S3b.
- **Source conflict resolved: 1** — cell-30 "AI Hub vs Model Registry" (see below).
- **Version-currency delta surfaced: RHAIS docs pin = 3.1, but catalog GA = 3.3.5 (vLLM 0.13.0); RHOAI catalog carries v3.4 + v3.5-ea.1 streams.**

## Per-component catalog evidence (image/repo → catalog path → quote)

### RHAIS side (Product A) — registry `registry.access.redhat.com`, product-listing not linked; images verified by exact `==`
- **Cells 1, 3, 15, 17 (inference engine / OpenAI API / images / serving) → CLEAR, catalog-confirmed.**
  Images: `rhaiis/vllm-cuda-rhel9` **GA**, `rhaiis/vllm-rocm-rhel9` **GA**, `rhaiis/vllm-spyre-rhel9` **GA**,
  `rhaiis/vllm-tpu-rhel9` **Tech Preview** — path `/api/containers/v1/repositories?filter=repository=in=(…)`,
  `release_categories` + `content_stream_tags:['3.2.2','3.3']`; `display_data.name` = "Red Hat AI Inference Server for NVIDIA CUDA".
  Doc corroboration (`s2b/rhais-3.3-release-notes.txt`): the 6-image table `rhaiis/vllm-{cpu,cuda,neuron,rocm,spyre,tpu}-rhel9` + "vLLM v0.13.0".
  **Currency note:** newest actual tag `3.3.5-…`; the docs-pinned 3.1 is stale — when the maintainer finalizes, decide whether to re-pin A to 3.3.
- **Cells 7, 9, 11, 25, 27, 31 (RHAIS scoped absences: notebooks/pipelines/training/experimentation/fine-tuning) → INFERRED ➜ CLEAR.**
  Basis upgraded from pure scope to *complete image enumeration*: the RHAIS product's entire published image set is the
  6 `rhaiis/vllm-*-rhel9` serving images (S2b release notes table; catalog confirms 4 of them GA/TP) — **no notebook,
  pipeline, training, or fine-tuning image exists in the product.** Cell 31 keeps its LLM-Compressor nuance:
  "LLM Compressor support/version" present in `s2b/rhai-3-supported-configs.txt` (compression ≠ fine-tuning).
- **Cell 13 (no OpenShift requirement / runs anywhere) → CLEAR, double-confirmed.**
  `s2b/rhai-3-supported-configs.txt` verbatim: "OpenShift Container Platform Operators are not required",
  "Kubernetes (not OpenShift…", "Linux (not RHEL)", "standalone". Plus the **rhai-on-xks-chart** catalog record
  (`/repositories/id/69d5330e2782c2d898f3899e`): "This chart installs the RHAI operator and its cloud manager
  components on a kubernetes cluster", Tech Preview, `content_stream_tags:['v3.4']`.
- **Cell 29 (RHAIS model registry = not-included) → INFERRED ➜ CLEAR.** Every `odh-model-registry-*` image lives under
  the `rhoai/` namespace (RHOAI product-listing); there is **no `rhaiis/…model-registry` image** — registry-level proof
  that Model Registry is a RHOAI component, not part of the RHAIS BOM.

### RHOAI side (Product B) — product-listing `63b85b573112fe5a95ee9a3a` ("Red Hat OpenShift AI", container stack), 158 repos
- **Cells 2, 4, 18 (KServe + vLLM runtimes / OpenAI API / serving incl. predictive) → CLEAR, catalog-confirmed.**
  `rhoai/odh-kserve-controller-rhel9` **GA**, `odh-kserve-router-rhel9` **GA**, `odh-kserve-storage-initializer-rhel9` **GA**,
  `odh-kserve-llmisvc-controller-rhel9` **TP** (the LLMInferenceService controller, streams `v3.4`);
  RHOAI's own engine images `odh-vllm-{cuda,rocm,gaudi,cpu}-rhel9` **GA**; predictive serving `odh-openvino-model-server-rhel9`
  **GA**, `odh-caikit-nlp-rhel9`/`odh-caikit-tgis-serving-rhel9` **GA**. Downstream manifest: `["kserve"]="red-hat-data-services:kserve:rhoai-3.4@ca0df0a…:config"` (`s3d/get_all_manifests-rhoai-3.4.sh`).
  (Placeholder's "NVIDIA Triton" — no `odh-triton-*` image found in the 158-repo set; OVMS + Caikit are the confirmed predictive runtimes. Flag for the flip.)
- **Cells 8/26, 10/28, 12 (workbenches / pipelines / distributed training) → CLEAR, catalog-confirmed.**
  Workbenches: `odh-notebook-controller-rhel8`, `odh-kf-notebook-controller-rhel8`, `odh-workbench-jupyter-*` (GA).
  Pipelines: `odh-data-science-pipelines-operator-controller-rhel8` + `odh-ml-pipelines-*` (GA). Training:
  `odh-training-operator-rhel8` (GA), downstream `["trainer"]="red-hat-data-services:trainer:rhoai-3.4@f5d41a3…"`.
- **Cell 14 (requires OpenShift) → CLEAR.** `s2b/rhoai-3.4-installing.txt`: DataScienceCluster + "OpenShift Container Platform 4.19".
- **Cell 16 (RHOAI operators/images/versions) → CLEAR.** Catalog product-listing = 158 distinct repos (121 GA / 35 TP / 2 Beta);
  downstream `get_all_manifests-rhoai-3.4.sh` @ `25cfa1c4…` pins each component to `red-hat-data-services:<comp>:rhoai-3.4@<commit>`.
- **Cell 20 (autoscaling) → CLEAR, correction confirmed.** `odh-workload-variant-autoscaler-controller-rhel9` **TP** (the WVA),
  `odh-llm-d-inference-scheduler-rhel9` **TP**. No Knative image in the serving path (RawDeployment-only holds).
- **Cell 22 (MaaS / gateway) → CLEAR.** `odh-maas-api-rhel9` **GA** (streams `v3.0`), `odh-maas-controller-rhel9` **GA**,
  `odh-ai-gateway-payload-processing-rhel9` **TP** (streams `v3.4`).
- **Cell 24 (observability / responsible-AI) → CLEAR.** `odh-trustyai-service-rhel8` **GA**, `odh-trustyai-service-operator-rhel8`
  **GA**; guardrails `odh-fms-guardrails-orchestrator-rhel9` **GA**. (LMEval: no standalone `odh-lmeval` image; `odh-eval-hub-rhel9` **TP** is the 3.x eval surface — reconcile term at flip.)
- **Cell 30 (RHOAI Model Registry) → UNRESOLVED ➜ CLEAR (Tech Preview). Source conflict RESOLVED.**
  `rhoai/odh-model-registry-rhel8`, `odh-model-registry-rhel9`, `odh-model-registry-operator-rhel8/9` — **all `release_categories:['Tech Preview']`**
  (catalog product-listing). The S1-vs-S3a "AI Hub vs Model Registry" conflict is explained by the catalog: the **front-end**
  `odh-mod-arch-model-registry-rhel9` is **GA** (= "AI Hub" in S1) while the **underlying model-registry service/operator is Tech Preview**.
  So: Model Registry ships, maturity = **Tech Preview** (matches the original placeholder's `Tech Preview`).
- **Cell 32 (fine-tuning via Trainer v2, not InstructLab) → CLEAR, correction confirmed.** `odh-training-operator` GA + downstream
  `trainer:rhoai-3.4`; **no `odh-instructlab-*` image** in the 158-repo listing (InstructLab removed, per S3a component-params-env.yaml RHOAIENG-60396).

### Proposed-new-rows — catalog refinements (maturity skew vs S1 doc, worth encoding)
- **llm-d (distributed inference):** `odh-llm-d-kv-cache-rhel9` **GA** (streams `v3.4`), `odh-llm-d-inference-scheduler-rhel9` **TP**,
  `odh-llm-d-routing-sidecar-rhel9` **TP** — mixed maturity, refines S1's flat "GA 0.7.1".
- **Feature Store (Feast):** `odh-feast-operator-rhel8/9` + `odh-feature-server-rhel8/9` **all Tech Preview** — catalog **conflicts** with
  S1 "Feature Store GA 0.62.0". Flag: doc GA vs catalog TP.
- **MLflow:** `odh-mlflow-rhel9` + `odh-mlflow-operator-rhel9` **Beta** — catalog **conflicts** with S1 "MLflow GA 3.10.1".
  (Note: "Beta" is not one of the four canonical `status` values — encode maturity in `detail`, not `status`.)
- **Model catalog / AI Hub:** `odh-mod-arch-model-registry-rhel9` **GA** (the GA front-end over the TP registry).
- **Agentic (Llama Stack → OGX):** `odh-llama-stack-core-rhel9`/`odh-llama-stack-k8s-operator-rhel9` **TP** AND
  `odh-ogx-core-rhel9`/`odh-ogx-k8s-operator-rhel9` **TP** (streams `v3.5-ea.1`) — confirms the DSC "LlamaStackOperator
  Deprecated: use OGX" note; both ship as TP during the transition.
- **NEW RHOAI-only surfaces not in the 32 cells** (candidates for rows, all **TP**): `odh-automl-rhel9`, `odh-autorag-rhel9`,
  `odh-eval-hub-rhel9` — AutoML, Auto-RAG, and an evaluation hub added in the 3.x line.

## What still needs human curation (unchanged human gates + the one online gap)
- **rhai-on-xks-chart `values.yaml`** (the definitive EKS/AKS/GKE disconnected image list) — auth-gated; pull command in SOURCES.md S3b.
- **The two-person flip** still applies: this pass raised confidence and added registry citations, but did NOT touch any
  `illustrative`/`draft` flag in `productComparisons.js` — a human reviewer reads the cited catalog line and flips.
- **Version re-pin decision:** catalog shows A at 3.3.5 GA (not 3.1) and B carrying v3.4 + v3.5-ea.1 — decide the final pinned pair.

📖 Terms
- **RHAIS** (Red Hat AI Inference Server): the standalone vLLM-based serving container; also embedded in RHOAI. Catalog `rhaiis/*` images.
- **RHOAI** (Red Hat OpenShift AI): the full AI/ML platform operator; requires OpenShift. Catalog product-listing `63b85b57…`, `rhoai/odh-*` images.
- **Pyxis**: the engine behind the catalog.redhat.com container API; RSQL-style filters, but only `==`/`=in=` work here.
- **RSQL**: the filter grammar (`==`, `=in=`, `;`=and, `,`=or) the catalog API accepts on the `filter` param.
- **content_stream_tags**: the catalog field naming a repo's supported version streams (e.g. `v3.4`) — how we tied images to the pinned release.
- **release_categories**: the catalog field carrying maturity (Generally Available / Tech Preview / Beta) per image — the maturity ground truth.
- **WVA** (Workload Variant Autoscaler): RHOAI's SLO-aware model autoscaler; catalog `odh-workload-variant-autoscaler-controller` (TP).
- **llm-d**: Red Hat's distributed-inference / prefill-decode-disaggregation layer; catalog `odh-llm-d-*` (kv-cache GA, scheduler/sidecar TP).
- **MaaS** (Models-as-a-Service): RHOAI's gateway/rate-limit layer (Kuadrant/RHCL-backed); catalog `odh-maas-*` (GA).
- **OGX**: the successor to Llama Stack Operator for agentic/GenAI runtime; catalog `odh-ogx-*` (TP, v3.5-ea.1).
- **xKS**: "any Kubernetes" (EKS/AKS/GKE/self-managed) — the non-OpenShift install path delivered by `rhai-on-xks-chart`.
- **DataScienceCluster (DSC)**: the RHOAI operator's top-level CR whose v2 API enumerates the enabled components.

---

# Verification round 2 — 2026-07-13

**Scope: the 5 cells that render dashed ("pending verification") in the nested-containment hero.**
Objective — for each, hunt public evidence (live catalog.redhat.com Pyxis API, the pinned
opendatahub manifests, product docs) and reach one of three verdicts: **UPGRADED to clear**,
**CONFLICT STANDS** (escalate), or **STILL UNRESOLVED/INFERRED** (what's needed). By Claude (agent),
extract-only; the two-person `illustrative`/`draft` flip is untouched.

Live Pyxis re-query (2026-07-13, anonymous `curl -G .../api/containers/v1/repositories --data-urlencode
"filter=repository==<repo>"`; the `/docs/filtering-language` path the round-1 note and this task both
reference **still 404s** — the working grammar is the documented `==` / `=in=` only):

| Repo (registry.access.redhat.com) | release_categories | content_stream_tags | Pyxis _id |
|---|---|---|---|
| `rhoai/odh-model-registry-operator-rhel9` | **Tech Preview** | v2.16, v2.19, v2.22 | 680ce1dbe9a268d7e393ef08 |
| `rhoai/odh-mod-arch-model-registry-rhel9` (front-end / "AI Hub") | **Generally Available** | v2.25 | 68c2a9fe2565a5c654a66735 |
| `rhoai/odh-feast-operator-rhel9` | **Tech Preview** | v2.16, v2.19, v2.22 | 680cdf2212946c2aa95e43b7 |
| `rhoai/odh-mlflow-operator-rhel9` | **Beta** | v3.2 | 6943fa398d961d8560907f31 |
| `rhoai/odh-llm-d-kv-cache-rhel9` | **Generally Available** | v3.4 | 69a86959cf7404e2aadd5ae4 |
| `rhoai/odh-llm-d-inference-scheduler-rhel9` | Tech Preview | — | — |
| `rhoai/odh-llm-d-routing-sidecar-rhel9` | Tech Preview | — | — |

(Maturity is unchanged from the 2026-07-10 saved JSON — re-confirmed live. Note the version-stream
quirk: model-registry and feast operators still publish only **2.x** streams even in the 3.x product;
this doesn't change `release_categories`, which is the per-repo maturity ground truth.)

## Per-cell verdicts

### Cell — Model Loading · A (bomRows "Model loading and caching", hero inner) → **STILL INFERRED (no upgrade)**
The model-loading + caching *capability* is clearly intrinsic to the vLLM engine (README "chunked
prefill, prefix caching"; getting-started Ch.5 load-from-disk), but there is **no discrete "Model
Loader" image or component** in either the `rhaiis/*` or `rhoai/odh-*` catalog namespaces to point a
solid, catalog-backed cell at. Upgrading to clear would require **rewording the cell from a discrete
"Model Loader" component to "vLLM model loading + prefix caching"** (a content change — human-gated,
not a tier bump) or a one-line RHAIS-PM confirmation. Left `inferred` / dashed. **Data: untouched.**

### Cell 30 — Model Registry · B (capabilityRows "Model registry integration", hero outer) → **UNRESOLVED → CLEAR (Tech Preview)** ✅ upgraded
The round-1 "AI Hub vs Model Registry" conflict is **genuinely resolved** by the catalog — they are
*different layers, not a contradiction*: the model-registry **service/operator** (`odh-model-registry-operator-rhel9`)
ships **Tech Preview**, while its **catalog front-end** (`odh-mod-arch-model-registry-rhel9`, the
supported-configs "AI Hub GA" line) is **Generally Available**. Net fact — Model Registry integration
ships; registry service maturity = Tech Preview — is now directly, registry-level evidenced.
- Quote: `odh-model-registry-operator-rhel9` `release_categories:['Tech Preview']` — Pyxis, _id 680ce1db…, live 2026-07-13.
- Quote: `odh-mod-arch-model-registry-rhel9` `release_categories:['Generally Available']` — Pyxis, _id 68c2a9fe….
- **Data applied:** `tier` `unresolved` → `clear`; `sourceUrl` → the catalog operator record; `sourceLabel`/`detail`
  updated; `status` stays `Tech Preview` (unchanged, canonical). Hero "Model Registry" cell now renders **solid**.
- Side A (RHAIS) stays `inferred`: the capability row's `support:'yes'` sits in tension with "no `rhaiis/…model-registry`
  image" — a genuine "does RHAIS-standalone integrate with the shared registry?" question left for the maintainer (see below).

### Cell — Feature Store (Feast) · B (bomRows "Feature store (Feast)", hero outer) → **CONFLICT STANDS** (escalate)
- Doc (S1 supported-configs, page-updated 2026-06-24): "Feature Store **GA** 0.62.0".
- Catalog (live 2026-07-13): `odh-feast-operator-rhel9` **+** `odh-feature-server-rhel8/9` — **all Tech Preview**.
- Two current, authoritative Red Hat sources disagree on maturity; nothing in the downloads breaks the tie.
  **Kept `inferred` / dashed.** **Data applied:** `sourceUrl` moved gam(feastoperator manifest) → the catalog
  operator record (so a click lands on the *disputed* Tech-Preview fact, not just "it ships"); `sourceLabel` reframes it
  as a standing conflict. Escalate to product team: is Feast GA or Tech Preview for the 3.4/3.5 line?

### Cell — Experiment tracking (MLflow) · B (bomRows "Experiment tracking (MLflow)", hero outer) → **CONFLICT STANDS** (escalate)
- Doc (S1): "MLflow **GA** 3.10.1".
- Catalog (live 2026-07-13): `odh-mlflow-rhel9` **+** `odh-mlflow-operator-rhel9` — **Beta** (a newer front-end
  `odh-mod-arch-mlflow-rhel9` is Tech Preview). "Beta" is **not** a canonical `status` value, so it stays in prose, never the status field.
- Kept `inferred` / dashed. **Data applied:** `sourceUrl` → catalog mlflow-operator record; `sourceLabel` reframes the
  GA-vs-Beta conflict. Escalate: is MLflow GA, Beta, or Tech Preview for the pinned release?

### Cell — Distributed inference (llm-d) · B (bomRows "Distributed inference (llm-d)", hero outer) → **CONFLICT STANDS (partial)** (escalate)
- Doc (S1): flat "Distributed Inference with llm-d **GA** 0.7.1".
- Catalog (live 2026-07-13): `odh-llm-d-kv-cache-rhel9` **GA**, but `odh-llm-d-inference-scheduler-rhel9` and
  `odh-llm-d-routing-sidecar-rhel9` **Tech Preview** — the doc's single "GA" line overstates the prefill/decode
  disaggregation path (the scheduler + routing-sidecar you actually need are TP).
- Unlike Model Registry (a coherent two-layer GA-front-end/TP-service story that *matches* a separate doc line), llm-d
  is a **single doc line the catalog contradicts** for two of three sub-images → treated as a live conflict, not resolved.
  Kept `inferred` / dashed (also the no-hype call: don't paint a partly-TP disaggregation path as solid GA). **Data applied:**
  `sourceLabel` enriched with the catalog split + escalation; `sourceUrl` kept on the upstream llm-d README (the "what it is").
  Escalate: what is the **aggregate** supported maturity of the llm-d disaggregation path?

## Scorecard (round 2)
- **Upgraded a tier: 1** — Model Registry · B (**UNRESOLVED → CLEAR**, Tech Preview).
- **Conflict stands, escalate to product team: 3** — Feast · B (GA vs Tech Preview), MLflow · B (GA vs Beta),
  llm-d · B (flat GA vs kv-cache GA + scheduler/sidecar Tech Preview).
- **Still inferred, no catalog upgrade possible: 1** — Model Loading · A (no discrete image; needs a content reword or PM line).
- **New public sources pinned: 3** catalog operator records (model-registry, feast, mlflow) — see SOURCES.md S4 round-2 block.
- **Gates:** `npm run check` green (eslint + 62 tests + build, exit 0); `npm run validate:links` — all 23 links render
  (>500 chars headless), the 3 new catalog records at 2276 / 2231 / 2238 chars.

## What still needs human curation (human gates — round 2)
1. **The two-person flip** — this pass raised confidence + added registry citations but did NOT touch any
   `illustrative`/`draft` flag. A human reviewer reads the cited catalog line and flips.
2. **Product-team reconciliation (3 conflicts):** Feast GA-vs-Tech-Preview, MLflow GA-vs-Beta, llm-d aggregate maturity.
   These are doc-vs-catalog disagreements between two current Red Hat sources — only the product team can settle them.
3. **Model Registry · A (RHAIS side):** does RHAIS-standalone "integrate with" the shared Model Registry (`support:'yes'`),
   given no `rhaiis/…model-registry` image ships? Capability-vs-BOM ambiguity for the maintainer to rule on.
4. **Model Loading reword:** approve "vLLM model loading + prefix caching" (capability) in place of the discrete
   "Model Loader" component name, or get a one-line RHAIS-PM confirmation — either flips it clear.
5. **rhai chart bodies (unchanged from round 1):** `requires_terms:true`, auth-gated; exact `helm pull` commands for both
   the OpenShift-path and xKS-path charts are recorded in SOURCES.md (S3b + addendum). Not retried this round.

📖 Terms (round 2 additions)
- **Pyxis `release_categories`**: the per-repo maturity field (Generally Available / Tech Preview / Beta) — the
  registry-level ground truth used to adjudicate every maturity conflict here.
- **`odh-mod-arch-*`**: the "model architecture / hub" front-end images (e.g. `odh-mod-arch-model-registry-rhel9` GA) that
  sit over an underlying service — the layer that explains the supported-configs "AI Hub" naming vs the manifests' service name.
- **Beta**: a catalog maturity below Tech Preview seen on MLflow — deliberately NOT one of the four canonical `status`
  values (GA / Tech Preview / Dev Preview / Check with Red Hat), so it lives in cell prose, never the status field.
