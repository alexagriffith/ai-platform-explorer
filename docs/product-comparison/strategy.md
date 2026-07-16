# Product Comparison Dual-View (bill of materials view + capability view) — Strategy & Curation Protocol

**Status:** Planned feature, curation in progress. **Origin:** field observation — customers deploying
more than one Red Hat AI product could not tell what actually ships inside each one; there was no
side-by-side comparison and no published bill of materials (BOM). The decision that followed: build a
dual-view comparison (a BOM view + a capability view) inside this explorer, backed by a strict,
source-traceable curation protocol so no cell is ever written from memory.

## Why this feature is worth building

1. **It answers a real, repeated field question** — "what is actually in each of these products, and
   where do they overlap?" — that customers running more than one Red Hat AI product keep asking.
2. **The substrate already exists in this repo.** The explorer already ships a product catalog
   (`src/data/products.js`), a component/sub-component map that is effectively a proto-BOM
   (`src/data/subComponents.js`), a before/after comparison data model and view
   (`src/data/deploymentComparisons.js` + the Deployment Impact view — the exact UI pattern this
   feature reuses), and the OpenShift/Kubernetes ↔ AI-product pairing rules
   (`src/lib/platformAiConstraints.js`). The dual-view is a new rendering over the same shapes, not new
   infrastructure.
3. **One research pass, two deliverables.** The curated comparison table is also the research basis for
   a companion "what's actually different between these products?" explainer — the tool and the writeup
   share a single sourced dataset.

## What "dual-view" means concretely (in the explorer)

One comparison object, two renderings, per product pair (first pair in scope: Red Hat AI Inference
Server vs Red Hat OpenShift AI; the family later extends to additional products):

- **Bill of materials (BOM) view:** a side-by-side component table — what literally ships in each
  product (operators, container images, versions, support scope). Source of truth: the Red Hat
  supported-configurations article on `access.redhat.com` plus product documentation on
  `docs.redhat.com`.
- **Capability view:** a side-by-side "what can it do" — serving, autoscaling, gateway / model-as-a-service,
  observability, notebooks, pipelines, and so on — mapped to which product provides each capability and
  where the two overlap. Largely derivable from the existing capability catalog and product
  connections already in the repo.
- The user toggles between views; the PNG export and the copyable text summary already exist in the tool
  and are reused.

## Effort estimate (honest)

| Piece | Effort | Notes |
|---|---|---|
| Explorer reconnaissance | done | Existing data shapes confirmed reusable |
| BOM data curation | 0.5–1 day | The real work: extracting truth from the supported-configs BOM + docs; accuracy over speed |
| Dual-view UI (new tab reusing the comparison patterns) | 0.5–1 day; a v1 in one build session | Data model mirrors `deploymentComparisons.js` |
| Accuracy review / product sign-off | days to ~2 weeks async | The long pole. Customer-facing truth needs a bill-of-materials owner's sign-off (product management). Ship as "draft — field tool" first to avoid blocking |
| Companion writeup from the same research | 0.5 day | Reuses the curated table |

**Realistic path:** a draft v1 in the explorer within roughly two working days of effort (an assistant
writes the code; a human curates and validates the data); an officially blessed version follows review.

## Open questions

- Who owns bill-of-materials truth for sign-off? (Route to product management.)
- Scope: the first inference-server-vs-platform pair only, or also include the enterprise bundle and the
  standard-Kubernetes delivery differences (`platformAiConstraints.js` already encodes some of these)?

## Next actions (when green-lit)

1. Curate the BOM comparison table from the supported-configs document (human + assistant).
2. Implement the dual-view tab in the explorer (one build session).
3. Surface the feature to product management as prioritization evidence and confirm the sign-off path.
4. Draft the companion explainer from the same table.

---

## Curation source protocol (a hard requirement: no drift, no hallucination)

**Rule: every cell in the comparison must be EXTRACTED from a downloaded primary source — never written
from memory, human or model.**

### Primary sources, in trust order

1. **Operator bundles / ClusterServiceVersion manifests** — the literal list of what each operator
   installs (the Red Hat OpenShift AI operator; the Red Hat AI Inference Server delivery). Machine-readable
   ground truth for the bill-of-materials view.
2. **Helm charts + image lists** — the non-OpenShift Kubernetes install path; `values.yaml` + rendered
   manifests enumerate exactly what ships there. The disconnected-install image list (the same artifact
   behind a large enterprise customer's "how many images actually ship?" finding) is the definitive
   "what images ship" answer.
3. **Upstream repositories** — llm-d, vLLM, KServe: pin the tags each product release consumes.
4. **Product documentation** — the supported-configurations bill-of-materials article + release notes:
   use for support scope and capability claims. Where docs and manifests disagree, the manifest wins and
   the disagreement is recorded as an open question for the product team — that disagreement is itself
   valuable field intelligence.

### Protocol

- **Download, don't browse:** every source is saved into the repo's pinned `sources/` tree with its
  retrieval date and, for repositories, the pinned commit/tag. The comparison is rebuilt only from these
  local copies — diffable, auditable, re-checkable at the next release.
- **Pin a release:** the whole comparison is versioned against ONE named release pair. No mixing versions
  across cells. The next release is a re-extraction diff, not a re-research.
- **Every cell carries provenance:** `source: <file>#<location>, retrieved <date>` in the data file. A
  cell with no provenance cannot flip from `illustrative` to verified — the integrity test enforces this
  mechanically.
- **Two-person rule stays:** extraction can be automated; the flip to "verified" remains a human act
  after checking the cited line.

### Honest residual risks

- Some Red Hat sources sit behind login (the customer portal) — retrievable via an authenticated Red Hat
  customer-portal browser session, then saved locally like everything else.
- "Included capability" at marketing granularity sometimes has no manifest equivalent (for example,
  support statements) — those cells cite documentation and are labeled as support-scope claims, not
  shipped-component facts.

---

📖 Terms

- **Red Hat AI Inference Server** — the standalone, vLLM-based model-serving container (product id
  `ai-inference` in this repo); the inference-focused half of the first comparison pair.
- **Red Hat OpenShift AI** — the full artificial-intelligence / machine-learning platform that runs on
  OpenShift (product id `rhoai`); the other half of the comparison.
- **bill of materials (BOM)** — the list of components shipped in a product (operators, container images,
  versions, support scope); the truth this feature must never invent.
- **KServe** — the model-serving layer built into Red Hat OpenShift AI (Kubernetes custom resources over
  vLLM and other runtimes).
- **vLLM** — the high-throughput large-language-model inference engine at the core of Red Hat AI Inference
  Server.
- **llm-d** — Red Hat's distributed-inference / prefill-decode-disaggregation layer.
- **ClusterServiceVersion** — the Operator Lifecycle Manager manifest that declares exactly what an
  operator installs; used here as machine-readable bill-of-materials ground truth.
