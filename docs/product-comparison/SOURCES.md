# SOURCES — Product Comparison BOM (Red Hat AI Inference Server vs Red Hat OpenShift AI)

**Curation extraction pass. Retrieved 2026-07-10.**
Governing protocol: `strategy.md` ("Curation source protocol") +
`src/data/CURATION-TODO.md`. Download-don't-browse; every cell in
`CURATION-ANSWERS.md` traces to one of these local copies with a verbatim quote.

> **Public-repo scrubbing note.** This is a scrubbed copy for the public repository. Three
> adjustments were made to the pinned sources so the tree honors this repo's naming rule and
> carries no individual's name: (1) the Open Data Hub / OpenShift AI operator `README.md` is
> **referenced by its public URL + pinned commit but not mirrored locally**, because its section
> headings contain the four-letter inference-server acronym this repo bans; the load-bearing
> operator artifacts (`get_all_manifests.sh`, the DataScienceCluster types, the CSV manifests) are
> mirrored instead. (2) In `s2b-docs-redhat-newpins/rhai-3-supported-configs.txt` the single
> occurrence of that banned acronym has been expanded to its full product name (a marked, in-place
> note flags it). (3) Retrieval-provenance lines that named an individual have been generalized to
> "an authenticated Red Hat customer-portal browser session".

**Pinned release pair (stated once, applied to every cell):**
- **Product A = Red Hat AI Inference Server (RHAIS) 3.1** — the latest fully-published standalone
  product-documentation line (vLLM core 0.9.0.1). A newer "Red Hat AI Inference 3.4" line exists
  (embedded in RHOAI 3.4, see S1) — version skew is flagged per-cell, not smoothed over.
- **Product B = Red Hat OpenShift AI (RHOAI) 3.4 (GA)** for support-scope / capability truth (S1),
  with the **RHOAI 3.5.0-ea.2** operator (S3a) used for component *composition* (bill of materials)
  where the GA article does not enumerate at manifest granularity. 3.5 is Early Access (pre-GA);
  the S1 supported-configs table currently tops out at 3.4 GA. Where 3.4 (doc) and 3.5-ea.2
  (manifest) differ, both are cited.

---

## Retrieval-channel finding (important, affects reproducibility)

- **`access.redhat.com` (customer portal): fetchable anonymously via curl** — HTTP 200,
  `x-auth-token: none`, real article body (not a login wall). S1 was downloaded this way.
- **`docs.redhat.com` and `developers.redhat.com`: edge-block curl AND WebFetch with HTTP 403**
  (Akamai-style bot detection) — including the PDF render paths. These were retrieved instead via
  **an authenticated Red Hat customer-portal browser session**, which the
  governing protocol explicitly sanctions ("Red Hat sources behind login/edge — retrievable via
  an authenticated browser session, then saved locally"). Saved as `.txt` (verbatim article body).

---

## S1 — Red Hat supported-configurations article (customer portal)

| File | URL | Retrieved | Notes |
|---|---|---|---|
| `s1-access-redhat/access-redhat-rhoai-supported-configs-3.x.html` (raw, 118 KB) and `…-3.x.txt` (462-line text extraction incl. 183 table rows) | https://access.redhat.com/articles/rhoai-supported-configs-3.x | 2026-07-10 | Article "Red Hat OpenShift AI: Supported Configurations for 3.x", page-**Updated 2026-06-24**. Anonymous curl, HTTP 200, real content. **Naming-ambiguity question RESOLVED:** the article enumerates **RHOAI**; "Red Hat AI Inference" appears **as a line item within it** (GA 3.4.0), and a separate "Supported AI accelerators for Red Hat AI Inference Server" article is referenced. Text extracted with `scratchpad/html2text.py` (stdlib, table-preserving). |

## S2 — Product documentation on docs.redhat.com (via authenticated browser)

| File | URL | Retrieved | Pinned version |
|---|---|---|---|
| `s2-docs-redhat/rhais-3.1-getting-started.txt` | https://docs.redhat.com/en/documentation/red_hat_ai_inference_server/3.1/html-single/getting_started/index | 2026-07-10 | RHAIS 3.1 (© 2025) |
| `s2-docs-redhat/rhais-3.1-supported-product-and-hardware-configurations.txt` | https://docs.redhat.com/en/documentation/red_hat_ai_inference_server/3.1/html-single/supported_product_and_hardware_configurations/index | 2026-07-10 | RHAIS 3.1 (© 2025) |

RHOAI product docs (introduction/release-notes) were NOT separately downloaded: S1 (a docs.redhat.com-
adjacent supported-configs article) already enumerates the RHOAI component set + support phases at
higher fidelity than the introduction guide, and S3a gives manifest-level composition. Logged as a
known, deliberate gap (see CURATION-ANSWERS "unresolved / needs").

## S3a — Open Data Hub / RHOAI operator (machine-readable BOM ground truth)

Repo: **opendatahub-io/opendatahub-operator** · Tag **`v3.5.0-ea.2`** · annotated-tag object
`5123ff97d005fa22712466c5b32bec65540eb34c` → **commit `2e3c4206e9a35fb9cbe5eaacf257695560520e83`**.
Retrieved 2026-07-10 (raw.githubusercontent.com at the pinned tag; repo state confirmed via `gh api`).

| File | Repo path | Why it matters |
|---|---|---|
| `s3a-odh-operator/get_all_manifests.sh` | `/get_all_manifests.sh` | **THE BOM map.** Separate ODH (`opendatahub-io`) and RHOAI (`red-hat-data-services`) component lists, each `repo:name:ref@commit:folder` — 18 component manifests + 4 Helm chart deps (cert-manager, lws-operator, sail-operator/Istio, gateway-api) + 3 platform manifests (osd-configs, hardwareprofiles, connectionAPI), all pinned to `rhoai-3.5-ea.2` commits. |
| `s3a-odh-operator/api-dsc/datasciencecluster_v2_types.go` | `/api/datasciencecluster/v2/datasciencecluster_types.go` | Authoritative v2 component enumeration (Dashboard, Workbenches, AIPipelines, Kserve, Kueue, Ray, TrustyAI, ModelRegistry, TrainingOperator, FeastOperator, LlamaStackOperator[Deprecated→OGX], OGX, MLflowOperator, Trainer, SparkOperator). Contains the verbatim "Kserve … Only RawDeployment mode is supported." |
| `s3a-odh-operator/component-params-env.yaml` | `/component-params-env.yaml` | States "Removed with InstrutLab pipeline removal since RHOAI 3.0" (×3, RHOAIENG-60396) and caikit-nlp removal since 3.0; references the `rhai-on-xks` Helm chart (S3b path). |
| `s3a-odh-operator/api-components/*_types.go` (24 files) | `/api/components/v1alpha1/*` | Per-component config surfaces. `kserve_types.go` shows RawDeployment service config + NVIDIA NIM + Models-as-a-Service integration hooks. `.odh.go`/`.rhoai.go` variants for modelregistry + workbenches = upstream/downstream divergence. `modelmeshserving`/`codeflare` exist only as v1alpha1 backward-compat (dropped from DSC v2). |
| `s3a-odh-operator/csv/rhods-operator.clusterserviceversion.yaml`, `csv/opendatahub-operator.clusterserviceversion.yaml` | `/config/rhoai/manifests/bases/…`, `/config/manifests/bases/…` | Operator CSV (OLM) metadata for the RHOAI vs ODH operator builds. |
| `s3a-odh-operator/dockerfiles/rhoai-bundle.Dockerfile`, `dockerfiles/rhoai.Dockerfile` | `/Dockerfiles/…` | Build/bundle context. (The operator `README.md` is referenced by its public URL + pinned commit but not mirrored here — see the scrubbing note above.) |

## S3b — Helm charts / rendered image lists (non-OpenShift Kubernetes install path)

**Not directly downloaded (logged gap).** `component-params-env.yaml` (S3a) references
`RHOAI-Build-Config helm/rhai-on-xks-chart/values.yaml (rhaiOperator.relatedImages)` and lists
`rhai_helm_components: - kserve` — i.e. the "RHAI on xKS" chart exists and is the definitive
disconnected-install image list, but it lives in the private `RHOAI-Build-Config` repo (not fetched
here). Recorded as the source to pull for the disconnected-image / "what ships on EKS/AKS/GKE" question.

## S3c — Upstream repositories (readme/release level; pinned tags)

Retrieved 2026-07-10 (raw.githubusercontent.com at the pinned tag; latest releases confirmed via `gh api`).

| File | Repo | Pinned tag | Tag-ref object SHA | Note on shipped version |
|---|---|---|---|---|
| `s3c-upstream/vllm-README.md` | vllm-project/vllm | `v0.24.0` (latest release; `v0.25.0` tag also exists) | `ee0da84ab9e04ac7610e28580af62c365e898389` | README-level pin only. **Shipped versions differ:** RHAIS 3.1 = vLLM **0.9.0.1** (S2); RHOAI 3.4 = vLLM **0.18.0** CUDA (S1). |
| `s3c-upstream/kserve-README.md` | kserve/kserve | `v0.19.0` (latest release) | `b0eda63d2c105479140af8ec9149d992b7e44be5` | RHOAI 3.4 ships KServe **0.17.0** (S1); ODH/RHOAI use a fork (`opendatahub-io/kserve`, `red-hat-data-services/kserve`) per get_all_manifests.sh. |
| `s3c-upstream/llm-d-README.md` | llm-d/llm-d | `v0.8.1` (latest release) | `1c381e3d5b3653ef20200c2bbcd1e3da4eb34358` | RHOAI 3.4 ships "Distributed Inference with llm-d" **0.7.1** (S1). llm-d README names the "workload variant autoscaler" (= RHOAI `wva`). |

## Secondary sources (prior curation — inferred-tier only, per addendum)

Used only where a primary was unavailable, and never to promote a cell to "clear". Where these cite a
primary URL, the primary was followed (all resolved to the S-sources above or were 403-blocked).

| File | What it is | Use |
|---|---|---|
| `knowledge-registry.md` (this repo) | Explorer's source registry | Confirms intended primaries (docs.redhat.com, vLLM/llm-d/KServe sites). No new primary URLs beyond S1-S3c. |
| `src/data/*.js` (products.js, subComponents.js, …) in this repo | Placeholder-string provenance | Citations point to **Red Hat OpenShift AI 2.x** docs (stale for the 3.x pin). Origin of the CURATION-TODO placeholder text. |
| Internal field-notes catalog (not in this repo) | Index of prior-curation exports | Index only. |
| Internal draft article on inference-server-on-Kubernetes (not in this repo; cites developers.redhat.com/articles/2026/06/15 + /06/16, both 403 to curl) | Inferred-tier corroboration for the inference-server-on-Kubernetes architecture (KServe LLMInferenceService, llm-d-router, InferencePool, cloud-manager portability across EKS/AKS/GKE/on-prem). Any customer-specific material in the source was excluded from answers. |
| Internal field notes (not in this repo) | Field notes | Inferred-tier context only (autoscaling, positioning). |

Two additional internal repositories were inventoried (model-benchmarking / deployment manifests and
an architecture-diagram tool respectively) — neither carried product-composition BOM claims relevant
to these 32 cells (no primary followed).

---

# CATALOG VERIFICATION PASS — added 2026-07-10 (registry-level BOM)

Second pass to satisfy the "exact definition in code/catalog" bar: verify every chip against the
**catalog.redhat.com public container API** (the registry-level bill of materials) and the
**productized downstream** operator repo, then re-fetch the newer product docs now that the edge
block has changed. New local copies pinned below; per-cell upgrades are in
`CURATION-ANSWERS.md → "Catalog verification 2026-07-10"`.

## Retrieval-channel updates (supersede the 2026-07-10 finding above)

- **`catalog.redhat.com/api/containers/v1` (Pyxis): fully anonymous, curl-able JSON.** The API root
  `/v1/` 404s and `/v1/docs/filtering-language` does NOT exist (also 404) — but `/v1/openapi.json`
  and `/v1/docs/` are HTTP 200 and the data endpoints work anonymously.
  **Working filter syntax (RSQL, hard-won):** the `filter` param says *"Structure your filter as if
  you were querying Images directly. E.g. `repositories.published==true`."* Operators that WORK:
  exact `==` (e.g. `filter=repository==rhaiis/vllm-cuda-rhel9`) and set membership
  `=in=` (e.g. `filter=repository=in=(rhaiis/vllm-cuda-rhel9,rhaiis/vllm-rocm-rhel9)`).
  Operators that DO NOT work (return `total:0`, silently): `*` wildcards (`repository==rhaiis*`,
  `repository==rhaiis/*`), regex `=~`, and quoted forms. **Discovery is by exact name or `=in=`
  batch, not prefix.** Always URL-encode via `curl -G --data-urlencode "filter=…"`. The best
  enumerator is the product-listing → repositories relation (below), which returns the full set.
- **`docs.redhat.com`: NOW anonymously curl-able with the *default* curl UA (HTTP 200, real body).**
  Inverted Akamai rule: a browser-like `User-Agent` and WebFetch both 403 ("Access Denied", 511 B),
  but plain `curl` (default `curl/8.x` UA, no `-A`) returns the full article (100 KB-1 MB). This
  **closes the S2 RHOAI-doc gap** — the prior pass used an authenticated portal browser session; this pass re-pulled RHAIS 3.3
  and RHOAI 3.4 docs by curl. (If this breaks again, fall back to an authenticated Red Hat customer-portal browser session.)
- **`registry.redhat.io`: auth-gated (HTTP 401 anonymous).** `registry.access.redhat.com` mirror
  serves the `rhaiis/*` inference images anonymously, but the `rhai/rhai-on-xks-chart` Helm chart is
  `requires_terms:true` and 403s anonymous pull ("only available on registry.redhat.io") — see S3b.

## S2b — Product docs re-pinned to current releases (docs.redhat.com, default-UA curl)

| File | URL | Retrieved | Pin |
|---|---|---|---|
| `s2b-docs-redhat-newpins/rhais-3.3-release-notes.txt` | .../red_hat_ai_inference_server/3.3/html-single/release_notes | 2026-07-10 | RHAIS **3.3.0–3.3.3**; enumerates the 6 images `rhaiis/vllm-{cpu,cuda,neuron,rocm,spyre,tpu}-rhel9`; vLLM progression **v0.11.0 → v0.12.0 → v0.13.0** |
| `s2b-docs-redhat-newpins/rhai-3-supported-configs.txt` | .../red_hat_ai/3/html-single/supported_product_and_hardware_configurations/index | 2026-07-10 | Unified **Red Hat AI 3** supported-configs (the current umbrella; supersedes the 3.1 pin in S2). Contains verbatim "OpenShift Container Platform Operators are not required", "Kubernetes (not OpenShift…", "Linux (not RHEL)", "standalone", and RHOAI-embedded "vLLM v0.18.0" + "LLM Compressor support/version" |
| `s2b-docs-redhat-newpins/rhoai-3.4-installing.txt` | .../red_hat_openshift_ai_self-managed/3.4/html-single/installing_and_uninstalling_openshift_ai_self-managed/index | 2026-07-10 | RHOAI **3.4** install/architecture — canonical RHOAI-doc citation for OpenShift requirement ("OpenShift Container Platform 4.19") + DataScienceCluster component enumeration (workbenches, kserve, distributed workloads, trustyai, data science pipelines, model registry) |

## S3d — Downstream *productized* operator (red-hat-data-services, the RHOAI build)

Repo: **red-hat-data-services/rhods-operator** (the productized downstream of
`opendatahub-io/opendatahub-operator`; RHOAI mode = `ODH_PLATFORM_TYPE=rhoai`). Public.

| File | Repo path / pin | Why it matters |
|---|---|---|
| `s3d-downstream-rhods-operator/get_all_manifests-rhoai-3.4.sh` | branch `rhoai-3.4` @ commit **`25cfa1c4c89bed2b84c7da6f5eb411d5871ca1df`** | The **GA-productized** BOM map (S3a was upstream ODH v3.5.0-ea.2). Pins every component to `red-hat-data-services:<comp>:rhoai-3.4@<commit>` — e.g. `kserve→…kserve:rhoai-3.4@ca0df0a…` (release-v0.17), `trainer→…trainer:rhoai-3.4@f5d41a3…`, `maas→…maas-billing:rhoai-3.4@…`, `wva→…workload-variant-autoscaler:rhoai-3.4-ea.2@…`. Confirms S3a's component set at the productized-3.4 level. Branches `cherry-pick/rhoai-3.5-ea.2/*` and `fix/cve-2026-25681-rhoai-3.4` also present. |

## S4 — catalog.redhat.com container API (registry-level BOM ground truth)

Retrieved 2026-07-10 via `curl` against `https://catalog.redhat.com/api/containers/v1`. Saved JSON:

| File | Query | What it proves |
|---|---|---|
| `s4-catalog-api/rhaiis-images.json` | `/repositories?filter=repository=in=(rhaiis/vllm-*)` | RHAIS registry BOM: **`rhaiis/vllm-cuda-rhel9`, `vllm-rocm-rhel9`, `vllm-spyre-rhel9` = Generally Available; `vllm-tpu-rhel9` = Tech Preview**; all `content_stream_tags` = `['3.2.2','3.3']` (newest actual tag **3.3.5**). Registry `registry.access.redhat.com`. Version-currency delta vs the docs-pinned 3.1. |
| `s4-catalog-api/rhoai-product-listing.json` + `rhoai-listing-repositories*.json` + `rhoai-bom-combined.json` | product-listing **`63b85b573112fe5a95ee9a3a`** ("Red Hat OpenShift AI", type=`container stack`, published) and its `/repositories` (2 pages) | **THE RHOAI registry BOM: 158 distinct `rhoai/odh-*` repos — 121 GA / 35 Tech Preview / 2 Beta.** Includes RHOAI's own engine images `odh-vllm-{cuda,rocm,gaudi,cpu}-rhel9` (GA; the "RHAIS ⊂ RHOAI" nested line at registry level), full KServe stack, `odh-llm-d-*`, `odh-maas-*`, `odh-model-registry-*` (**Tech Preview**), `odh-mlflow-*` (**Beta**), `odh-feast-*`/`odh-feature-server-*` (**Tech Preview**), `odh-ogx-*`/`odh-llama-stack-*` (TP). 3.x-only images carry `content_stream_tags` **`v3.4`** and **`v3.5-ea.1`**, tying the catalog to the pinned release pair. |
| `s4-catalog-api/rhai-on-xks-chart-repo.json` | `/repositories/id/69d5330e2782c2d898f3899e` | See S3b — the xKS Helm chart's catalog record. |

## S3b — RHAI-on-xKS Helm chart (non-OpenShift Kubernetes path) — NOW LOCATED (binary still auth-gated)

The chart the maintainer authorized (catalog entry `.../containers/rhai/rhai-on-xks-chart/69d5330e2782c2d898f3899e`)
resolves via the API to repository **`registry.access.redhat.com/rhai/rhai-on-xks-chart`**,
`display_data.short_description` = *"RHAI Helm chart for non-OLM installation on kubernetes cluster"*,
`long_description` = *"This chart installs the RHAI operator and its cloud manager components on a
kubernetes cluster"*, `release_categories:['Tech Preview']`, `content_stream_tags:['v3.4']`,
`requires_terms:true`, `protected_for_pull:false`.
**Tags → digests (pins):** `v3.4`/`v3.4.2` = `sha256:fae51e2e355d3a32f4efa907c5ea33159a78e315d35abc792c76dd672dba1188`;
`v3.4.1` = `sha256:256f2a3cb35ca37ff0854df0e30c8227ddbb69ac7866951aa7aecb03731a5764`;
`v3.5.0-ea.1` = `sha256:b85d7484635f861b7b35490e162e87e1c175812747c85e935aadaf95c20db3ca`.
**Chart body still NOT downloaded (auth gap):** anonymous `helm pull oci://registry.access.redhat.com/rhai/rhai-on-xks-chart --version v3.4`
→ 403 *"This repo requires terms acceptance and is only available on registry.redhat.io"*;
`registry.redhat.io` manifest HEAD → 401. **Exact command for a maintainer (with a Red Hat login):**
```
helm registry login registry.redhat.io        # Red Hat Customer Portal creds
helm pull oci://registry.redhat.io/rhai/rhai-on-xks-chart --version v3.4
tar xzf rhai-on-xks-chart-*.tgz && cat rhai-on-xks-chart/values.yaml   # rhaiOperator.relatedImages = the definitive xKS image list
```
Save the extracted `Chart.yaml` + `values.yaml` into `s3b-rhai-on-xks-chart/` (pin the v3.4 digest).
This is the ONE remaining cell (the disconnected/EKS image list) not settleable anonymously online.

---

# ADDENDUM 2026-07-10 — the two RHAI delivery Helm charts (per platform)

Both charts live under the **`rhai` (Red Hat AI)** namespace on `registry.access.redhat.com` — ONE
product family, TWO delivery charts (one per install path). Catalog UI URLs (both HTTP 200) + Pyxis
API records saved to `s4-catalog-api/`.

| Chart | Catalog UI URL | Catalog id (pin) | Pyxis record | Release / stream | short_description |
|---|---|---|---|---|---|
| **rhai-on-openshift-chart** (OpenShift path) | https://catalog.redhat.com/en/software/containers/rhai/rhai-on-openshift-chart/69d5326b4f12a69777fa181d | `69d5326b4f12a69777fa181d` | `s4-catalog-api/rhai-on-openshift-chart-repo.json` | Tech Preview · `content_stream_tags:['v3.4']` · `requires_terms:true` · `protected_for_pull:false` | "A Helm chart for installing ODH/RHOAI dependencies and component configurations on OpenShift." (long: "installs the operators and configurations required by OpenShift AI (RHOAI) on OpenShift") |
| **rhai-on-xks-chart** (any-Kubernetes path) | https://catalog.redhat.com/en/software/containers/rhai/rhai-on-xks-chart/69d5330e2782c2d898f3899e | `69d5330e2782c2d898f3899e` | `s4-catalog-api/rhai-on-xks-chart-repo.json` | Tech Preview · `content_stream_tags:['v3.4']` · `requires_terms:true` | "RHAI Helm chart for non-OLM installation on kubernetes cluster." |

**Naming finding (load-bearing for comparison wording):** the two charts are NOT symmetric copies.
`rhai-on-openshift-chart` lays down the **full OpenShift AI (RHOAI) platform** (operators + config) on
OpenShift; `rhai-on-xks-chart` lays down the **portable RHAI inference operator + cloud-manager** via
**non-OLM** install on any Kubernetes (EKS/AKS/GKE/self-managed). Same "Red Hat AI" family, two
platform wirings — which maps directly onto the dual-view nested containment (xks chart = the inner
portable core; openshift chart = the outer platform). Wired as `sourceUrl` in
`src/data/productComparisons.js`: cell 13-A (container platform
requirement, RHAIS) → xks chart; cell 14-B (requires OpenShift, RHOAI) → openshift chart.

**Chart bodies still auth-gated (`requires_terms:true`).** Anonymous `helm pull` → 403 ("requires
terms acceptance and is only available on registry.redhat.io"). Exact commands for a maintainer (Red Hat
Customer Portal creds) — these yield the definitive per-path image lists (`values.yaml`
`rhaiOperator.relatedImages` / dependency image sets = the per-path bill of materials):
```
helm registry login registry.redhat.io
# OpenShift path (RHOAI operators + config):
helm pull oci://registry.redhat.io/rhai/rhai-on-openshift-chart --version v3.4
# Any-Kubernetes path (portable RHAI inference operator, non-OLM):
helm pull oci://registry.redhat.io/rhai/rhai-on-xks-chart --version v3.4
for t in rhai-on-openshift-chart rhai-on-xks-chart; do tar xzf $t-*.tgz && cat $t/Chart.yaml $t/values.yaml; done
```
On pull, save extracted `Chart.yaml` + `values.yaml` into `s3b-rhai-on-openshift-chart/` and
`s3b-rhai-on-xks-chart/` (pin the v3.4 digest) — then cells 13-A / 14-B / 15-A / 16-B can move from the
catalog-record link to the actual image manifest.

---

# VERIFICATION ROUND 2 — 2026-07-13 (per-image catalog records for the dashed cells)

Round 2 hunts public evidence for the 5 dashed hero cells. New **public** sources pinned below: live
`catalog.redhat.com` Pyxis records for the three operators whose *maturity* the dashed cells turn on.
Each was re-queried live 2026-07-13 (anonymous `curl -G .../api/containers/v1/repositories
--data-urlencode "filter=repository==<repo>"`) and **rendered-validated in headless Chromium** (the
`npm run validate:links` bar: body text > 500 chars — each renders ~2.2 KB). These are wired as
`sourceUrl`s in `productComparisons.js` (see CURATION-ANSWERS "Verification round 2").

**Retrieval-channel note:** the `.../api/containers/v1/docs/filtering-language` endpoint (referenced by
the round-2 task brief) **still returns HTTP 404** — as the round-1 catalog note already recorded, the
only working RSQL operators are exact `==` and set `=in=`; there is no live filtering-language doc.

## S4b — catalog.redhat.com per-image records (Pyxis; registry `registry.access.redhat.com`)

| Catalog UI URL (validated, renders) | Pyxis _id | release_categories | content_stream_tags | Settles |
|---|---|---|---|---|
| https://catalog.redhat.com/en/software/containers/rhoai/odh-model-registry-operator-rhel9/680ce1dbe9a268d7e393ef08 | 680ce1dbe9a268d7e393ef08 | **Tech Preview** | v2.16, v2.19, v2.22 | Cell 30 Model Registry · B → **UNRESOLVED→CLEAR** |
| https://catalog.redhat.com/en/software/containers/rhoai/odh-mod-arch-model-registry-rhel9/68c2a9fe2565a5c654a66735 | 68c2a9fe2565a5c654a66735 | **Generally Available** | v2.25 | The GA "AI Hub" front-end that explains the S1 doc naming (not wired as a cell URL; corroboration) |
| https://catalog.redhat.com/en/software/containers/rhoai/odh-feast-operator-rhel9/680cdf2212946c2aa95e43b7 | 680cdf2212946c2aa95e43b7 | **Tech Preview** | v2.16, v2.19, v2.22 | Feast · B conflict (catalog side) — CONFLICT STANDS |
| https://catalog.redhat.com/en/software/containers/rhoai/odh-mlflow-operator-rhel9/6943fa398d961d8560907f31 | 6943fa398d961d8560907f31 | **Beta** | v3.2 | MLflow · B conflict (catalog side) — CONFLICT STANDS |
| https://catalog.redhat.com/en/software/containers/rhoai/odh-llm-d-kv-cache-rhel9/69a86959cf7404e2aadd5ae4 | 69a86959cf7404e2aadd5ae4 | **Generally Available** | v3.4 | llm-d · B — GA sub-image (scheduler/sidecar are TP) — CONFLICT STANDS (partial) |

(`odh-llm-d-inference-scheduler-rhel9` and `odh-llm-d-routing-sidecar-rhel9` re-confirmed **Tech Preview**
this round; matches the 2026-07-10 saved `s4-catalog-api/rhoai-listing-repositories*.json`.)

## rhai chart helm-pull commands — RECORDED (confirmed, not retried)

Per the round-2 brief, the two `rhai/*` delivery charts are `requires_terms:true` (auth-gated) and were
**not** re-pulled. The exact `helm pull` commands for a maintainer (Red Hat Customer Portal creds) are already
recorded above and unchanged — **S3b** (`rhai-on-xks-chart`, the disconnected/EKS image list) and the
**ADDENDUM** block (both `rhai-on-openshift-chart` + `rhai-on-xks-chart`, with v3.4 digest pins). No new
pull attempted; those remain the one bill-of-materials input only an authenticated Red Hat customer-portal session can fetch.
