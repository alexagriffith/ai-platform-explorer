# Red Hat AI Inference Server vs Red Hat OpenShift AI Dual-View Comparison — Agent-Executable Implementation Spec

**Version 1.0, 2026-07-09.** Companion to `strategy.md` (the strategic WHY).
**Status: READY FOR EXECUTION — not started.** Executor: an autonomous coding agent.
**Target repo: this repository** (public GitHub + public GitHub Pages site).
**Research basis:** every anchor below was verified by direct file reads on 2026-07-09 against the then-current development branch, HEAD `bb42c43`, with the in-flight review work present as STAGED-BUT-UNCOMMITTED changes (see A.2 — this matters).

**What you are building (one paragraph):** a sixth top-level tab, "Product Comparison", that shows two Red Hat products side by side with a toggle between two renderings of ONE comparison object: a **bill of materials (BOM) view** (what components ship in each product) and a **Capability view** (what you can do with each product, and where they overlap). First and only comparison pair in scope: product id `ai-inference` (Red Hat AI Inference Server; see A.6 naming rule) vs product id `rhoai` (Red Hat OpenShift AI, RHOAI). All comparison data ships as clearly-marked illustrative placeholders behind a visible draft banner; real BOM truth is curated by a human afterwards (Section B — the data fence — is the most important section in this document).

---

## A. HOW TO EXECUTE THIS DOCUMENT (read first, implementing agent)

### A.1 Ground rules

1. **Anchors in this doc were true on 2026-07-09.** The repo moves (an active backlog is being executed there). Before EVERY edit, verify the anchor: locate by the **quoted text**, not the line number (the explorer's own `docs/BACKLOG.md` execution rule 5 says the same). If a file has moved (e.g., the planned WP6 reorg moved components into `src/components/deployment-impact/` etc. — unchecked as of 2026-07-09 but planned), find it with grep and adapt paths. If content is missing or clearly different from what this doc describes, do NOT guess: log it (rule 5) and stop that step for a decision if it is load-bearing.
2. **The explorer repo's own `CLAUDE.md` is the operating contract** — read it in full before your first edit and obey it over anything here if they conflict. The rules that will bite you: content in `src/data/`, logic in `src/lib/`, components only render; no static content object over ~50 lines inside a component; component-definition-at-module-scope only (eslint `react/no-unstable-nested-components` is set to `error`); Tailwind class strings are complete literals, never template-built; new-component ceiling 500 lines; status vocabulary is EXACTLY `'GA' | 'Tech Preview' | 'Dev Preview' | 'Check with Red Hat'` (test-enforced); never rename product/capability/option ids; no bare acronyms in customer-visible strings (expand on first use per component); no emojis in customer-facing strings; no hedge-free absolutes; every `href` verified to resolve before commit. Also read `docs/BACKLOG.md` (its header says agents must) — do NOT execute backlog work packages; just don't collide with them (see A.2).
3. **This is a PUBLIC repo and merging to `main` deploys the public site.** Verified: `.github/workflows/deploy.yml` triggers on `push: branches: [main]`, runs lint → test → build, then deploys `dist/` to GitHub Pages (the live public site). Therefore: **all work happens on a new local feature branch; you never touch `main`; you never `git push` anything** (even a feature branch is publicly visible on GitHub the moment it is pushed). Publication is the maintainer's checkpoint E.2, not yours.
4. **Run the full gate before AND after:** `npm run check` (= `eslint . && vitest run && vite build`, defined in `package.json` scripts). Baseline verified 2026-07-09: lint 0 errors, **49 tests passing across 4 test files**, build succeeds. If the baseline is red BEFORE you change anything → ⛔ STOP, report, do not proceed on a broken base. Never delete or weaken a failing test to get green.
5. **Maintain a deviation log** at `planning/product-comparison-implementation-log.md` (the `planning/` directory is gitignored — verified in `.gitignore` under "Local planning / scope drafts" — so this log never reaches the public repo). Create it in Step 0; append one line per step: `[date] [step-id] DONE | SKIPPED(reason) | DEVIATION(what you found, what you did)`. This makes the run resumable and reviewable.
6. **Commit after every numbered step** with the exact message given, on the feature branch only. The pre-commit leak hook is installed at `.git/hooks/pre-commit` (verified present) and runs automatically; if it blocks a commit, report WHICH FILE failed but NEVER print the contents of `.leak-denylist` (it is a gitignored list of sensitive names — treat it as read-never).
7. **Files you may create:** `src/data/productComparisons.js`, `src/data/productComparisons.test.js`, `src/data/CURATION-TODO.md`, `src/components/ProductComparisonView.jsx`, `planning/product-comparison-implementation-log.md`. **Files you may edit:** `src/App.jsx`, `src/data/catalogIntegrity.test.js`, `src/components/AcronymGlossary.jsx`, `CLAUDE.md`, `README.md`, `docs/ROADMAP.md`. **Everything else is read-only** — see A.5 for the hard do-not-touch list.
8. Use absolute paths in shell commands. Node 18+ and npm are the toolchain; dependencies are already installed (`node_modules/` present).

### A.2 Git-state precondition (⛔ CHECKPOINT — this is the first thing you do)

Verified 2026-07-09: the repo sits on the then-current development branch at HEAD `bb42c43` with a LARGE staged-but-uncommitted changeset (~50 files: `CLAUDE.md`, `docs/BACKLOG.md`, `scripts/pre-commit.sh`, most of `src/` — this is the maintainer's finished Round-1/Round-2 review work, not yet committed). **You must not sweep that staged work into your commits.**

Step-0 procedure:
- Run `git status --porcelain`. If EMPTY → proceed (she committed it since this spec was written; also re-run `git log --oneline -3` and note the new HEAD in your log).
- If NOT empty → ⛔ STOP and ask the maintainer to commit or stash the pre-existing work first. Do not proceed with a dirty tree; do not commit it for them; do not stash it yourself (a stash of 50 staged files is how work gets lost).
- Once clean: `git checkout -b feature/product-comparison-dual-view` from whatever branch is checked out (do NOT switch to `main`).

### A.3 Verified anchor map (the repo as measured on 2026-07-09)

| What | Where (verify before use) |
|---|---|
| Tab registration | `src/App.jsx` — `views` array (lines 28–34, five entries ending `{ id: 'deployment-impact', name: 'Deployment Impact', icon: GitCompare }`); `renderView()` switch (lines 36–67); lucide icon imports (line 2); component imports (lines 3–8) |
| Draft-banner visual precedent | `src/App.jsx` lines 90–100 — the amber "Work In Progress" banner (`bg-gradient-to-r from-amber-500 to-orange-500 …`) |
| Data-file model to imitate | `src/data/deploymentComparisons.js` — per-comparison named exports (`vllmToKServe` line 14, `openshiftToRHOAI` line 444), aggregate `export const deploymentComparisons = [...]` (line 1023), `getComparisonById(id)` (line 1031), `getComparisonList()` (line 1038, returns `{id, title, description, audience}`) |
| View that consumes it | `src/components/DeploymentImpactView.jsx` — `getComparisonById` import (line 8), selector + tab-nav pattern (lines 66–97), content block keyed `key={comparison.id}` (line 54) so child state resets on comparison switch |
| Selector card pattern | `src/components/DeploymentComparisonSelector.jsx` — consumes `getComparisonList()` (line 11), card grid with selected-state ring (lines 34–83) |
| Side-by-side table pattern | `src/components/CapabilityDeltaTable.jsx` — thead/tbody table with per-row badge component `ImpactBadge` at module scope (line 152) |
| Product ids (LOCKED — never rename) | `src/data/products.js` — `id: 'rhoai'` (line 16, name `'Red Hat OpenShift AI (RHOAI)'`, status `'GA'`); `id: 'ai-inference'` (line 64, name `'Red Hat AI Inference Server'`, status `'GA'`). Also present: `rhai` (line 32, portfolio path, `'Check with Red Hat'`), `rhaie` (line 3) — both OUT of v1 scope |
| Proto-BOM (component lists) | `src/data/subComponents.js` — keyed object; key `'rhoai'` (line 155: workbenches, pipelines, kserve, distributed-workloads), key `'ai-inference'` (line 260: vllm-engine, model-loader, api-server). Component shape `{id, name, description, role, stages?, status?}` |
| Capability catalog shape | `src/data/capabilities.js` — object keyed by layer; `id: 'ai-platform'` capability at line 400 (options rhaie/rhoai/rhai/rhel-ai) |
| Integrity-test pattern to extend | `src/data/catalogIntegrity.test.js` — `sources = { capabilities, products, thirdPartyOptions, subComponents }` (line 27), recursive `collect(node, 'status')` walk, asserts every `status` ∈ `VALID_STATUS` (line 12) |
| PNG-export pattern (NO shared module exists) | `src/components/CapabilityArchitectureView.jsx` lines 456–483, `handleDownloadStackPng`: `document.getElementById('stack-capture-root')` → lazy `const { toPng } = await import('html-to-image')` → `toPng(el, { pixelRatio: 2, cacheBust: true, backgroundColor: isDark ? '#111827' : '#f3f4f6' })` → temporary `<a download>` click. Second instance: `src/components/FlowVisualization.jsx` line 226. Dependency `html-to-image@^1.11.13` already in `package.json` |
| Copy-summary pattern | `src/components/CustomerConfig.jsx` — module-scope pure builder `buildWorkshopCopyText(...)` returning `lines.join('\n')` (ends line 68); handler `copySuggestionText` (lines 86–94) using `navigator.clipboard.writeText` with a `copyDone` state flag |
| Status-chip resolution helper | `src/data/catalogResolve.js` — `getCatalogEntry(id)` (line 41) resolves product/thirdParty/reference ids to `{name, status, description}`; `getCatalogDisplayName(id)` (line 52) |
| Acronym glossary | `src/components/AcronymGlossary.jsx` — `glossary` array of `{acronym, fullName, explanation, whenToUse}` starting line 8; has RHOAI/RHAI/RHAIE/MCP/RAG; has NO `BOM` entry. NOTE: backlog WP4 plans to extract this to `src/data/glossary.js` — if that landed, edit the data file instead |
| Test conventions | colocated `Foo.test.js(x)`; vitest default environment is `node`; DOM tests start with `// @vitest-environment jsdom` (see `src/components/InteractiveBuilder.test.jsx`); data-shape-invariant pattern is `src/data/decisionRecommendationApply.test.js` |
| Quality gates | `package.json`: `npm run lint`, `npm test`, `npm run build`, `npm run check` (all three). eslint: `react/no-unstable-nested-components: error`, `react/jsx-key: error`, `react/no-array-index-key: warn` |
| Dev server for browser checks | `.claude/launch.json` → config name `explorer-dev` (`npm run dev`, port 5173). Dark mode is **media-based only** (`tailwind.config.js` has no `darkMode` key → default `media`; there is no in-app toggle) — check dark via OS/devtools emulation |
| Public-site deploy trigger | `.github/workflows/deploy.yml` — on push to `main`: npm ci → lint → test → build → deploy to Pages |

### A.4 Icons (pre-verified so you don't guess)

`lucide-react` (v^1.9.0 per package.json) exports `Scale`, `Columns`, and `ArrowLeftRight` — all three verified importable on 2026-07-09. Use **`Scale`** for the new tab. If the build fails on the import (version drift), fall back to `Columns`.

### A.5 DO NOT TOUCH (hard list)

- `src/lib/platformAiConstraints.js` — the OpenShift/Kubernetes/RHEL ↔ AI-product pairing rules (`reconcileContainerAiPlatform`, `isCapabilityOptionDisabled`). Encodes `OPENSHIFT_ONLY_AI = {rhoai, rhaie}`. Read it if you like; never modify.
- `src/lib/capabilityBlueprint.js` — pure transforms for the canonical `capabilityId → optionId` blueprint map. Not involved in this feature.
- `src/lib/flowVisualizationData.js` — flow-diagram shapes. Not involved.
- Every existing view component and every existing data file EXCEPT the two named edits (`catalogIntegrity.test.js` extension, `AcronymGlossary.jsx` one-entry addition) — in particular do not modify `QuickComparisonTable.jsx` (its hardcoded llm-d/Dynamo prose is a known parked backlog item; not yours), `DeploymentImpactView.jsx`, or `deploymentComparisons.js`.
- `App.jsx` state model: do not add router, store, or new top-level state; the new tab takes NO props (precedent: `UseCaseView`, `DeploymentImpactView`).
- `.leak-denylist`, `.claude/settings.local.json`, `knowledge-registry.md` (registry additions are a HUMAN curation step — see B.5), `docs/BACKLOG.md` content (you add nothing there; it is a defect checklist, not a feature list).

### A.6 Naming rule for public UI strings (sharp edge)

A four-letter internal shorthand for the inference server appears in Red Hat field discussion, but NOT anywhere in the explorer repo (grep-verified) — and it is banned here; do not introduce it. In all customer-visible strings use the catalog names verbatim from `products.js`: **"Red Hat AI Inference Server"** and **"Red Hat OpenShift AI (RHOAI)"**. Expand "bill of materials (BOM)" on first use in every component that says BOM. The customer account names from the strategic plan must NEVER appear anywhere in this repo (public-repo rule + pre-commit hook).

---

## B. THE DATA FENCE (the #1 mess-up risk — read twice)

**You must not invent bill-of-materials or capability truth.** What ships inside Red Hat AI Inference Server vs Red Hat OpenShift AI — operators, images, versions, support scope, capability inclusion — is customer-facing product truth owned by Red Hat product management, not by you. Getting it wrong in a public tool is strictly worse than shipping an honest draft. The fence has five planks:

**B.1 Placeholder-only data.** Every row you write in `src/data/productComparisons.js` carries `illustrative: true` and a `sourceRef` string naming where the placeholder text came from. Placeholder cell text may ONLY be (a) copied/lightly-adapted from strings ALREADY SHIPPED in this repo's own catalog (`products.js`, `subComponents.js`, `capabilities.js` — exact rows given in Step 1; each cites its source), or (b) the literal pending sentinel: `'Pending curation — confirm with your Red Hat account team'`. You may not compose new product claims from your own knowledge, from the web, from training data, or from any document — not even claims you are confident about. Where the repo's existing data does not state something (e.g., "does Red Hat AI Inference Server include an autoscaler?"), the cell value is the pending sentinel with support/inclusion level `'confirm'`. **Absence claims are truth claims too:** never write "not included" unless an existing repo string states it.

**B.2 The visible draft banner, wired to the flag.** The view renders a banner (amber, modeled on the App.jsx WIP banner, lines 90–100) whenever the selected comparison has `draft: true` OR any row with `illustrative: true`: text exactly — `Draft — pending bill of materials (BOM) curation. Rows below are illustrative placeholders, not confirmed product contents. Confirm anything here with your Red Hat account team.` The PNG capture root MUST include this banner (exports carry the watermark), and the copy-summary text MUST begin with a `DRAFT — pending BOM curation` line while the flag is set. The banner is derived from data, never hardcoded-on: when curation later flips the flags, it disappears with no code change.

**B.3 Test-enforced consistency.** `productComparisons.test.js` (Step 2) asserts: if `draft === false` then zero rows have `illustrative: true`; if any row is illustrative then `draft === true`; every illustrative row has a non-empty `sourceRef`. This makes "quietly making data look real" a red test.

**B.4 Flipping `illustrative: false` (and `draft: false`) is a HUMAN-ONLY step.** You never flip either flag, on any row, for any reason — including "the source obviously supports it". Curation happens later: a human curator with an assistant works through `src/data/CURATION-TODO.md` cell by cell against the named sources, flips flags row by row, and replaces each `sourceRef` with the real citation.

**B.5 The curation ledger.** Step 3 generates `src/data/CURATION-TODO.md` listing EVERY cell that needs human-verified truth, with the source of truth named per cell: the Red Hat supported-configurations bill-of-materials article `https://access.redhat.com/articles/rhoai-supported-configs-3.x` (returned HTTP 200 via curl -L on 2026-07-09; re-verify at run time AND confirm the effective URL after redirects is still on `access.redhat.com/articles`, not an SSO login page) plus Red Hat product documentation on docs.redhat.com. Note the naming ambiguity honestly in the ledger: the article slug says "rhoai-supported-configs" while internal field discussion referred to it as the inference-server bill of materials — WHICH product's BOM it enumerates is itself a curation question. Because `knowledge-registry.md` is the repo's source-of-truth list ("no new hard numbers without a source"), adding the article to the registry happens during human curation (when real claims start tracing to it), not now — placeholders trace to existing in-repo strings, which already have registry coverage. Do not put the article URL in the UI's `docsLinks` yet for the same reason; it lives in CURATION-TODO.md only.

---

## C. IMPLEMENTATION STEPS

Execute in order. Each step: PRE-CHECK (verify anchors) → ACTION → VERIFY → COMMIT (exact message) → log line. If a PRE-CHECK fails, log DEVIATION and adapt per A.1; if the deviation is load-bearing (file gone, schema incompatible), stop and ask.

### Step 0 — Preconditions & branch

1. `git -C <repo-root> status --porcelain` → must be EMPTY (else ⛔ per A.2).
2. `git log --oneline -1` → record HEAD in the log file (expected `bb42c43` or later).
3. Verify hooks: `ls .git/hooks/pre-commit` exists (verified 2026-07-09). `pre-push` was NOT installed as of research date — install it per repo convention: `cp scripts/pre-push.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push`.
4. Baseline gate: `npm run check` → lint 0 errors, 49+ tests green, build succeeds. Record counts. Red baseline = ⛔ stop.
5. `git checkout -b feature/product-comparison-dual-view`.
6. Create `planning/product-comparison-implementation-log.md` with header `# Product-comparison implementation log — started <date>` and retro-log steps 0.1–0.5. (Gitignored; no commit contains it.)
7. Read in full, now: repo `CLAUDE.md`, `docs/BACKLOG.md` header + "Execution rules for agents", `docs/ROADMAP.md`, `src/data/deploymentComparisons.js` (the model), `src/data/products.js`, `src/data/subComponents.js`.

No commit for Step 0.

### Step 1 — Data file: `src/data/productComparisons.js`

PRE-CHECK: `src/data/productComparisons.js` does not exist (grep-verified 2026-07-09 that nothing named productComparison exists in src/ or docs/); `products.js` still has ids `ai-inference` and `rhoai`; `subComponents.js` still has keys `'ai-inference'` and `'rhoai'`.

ACTION: create the file with EXACTLY this schema and content (header comment included — it is part of the fence). This is the complete file; do not add rows beyond it.

```js
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
      notes: 'Both products serve models with vLLM under the hood.',
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
      notes: 'This is the heart of the bill of materials — filled only from the supported-configurations article during curation.',
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
```

Fence check on the above before writing: the only `status` values present are `'Tech Preview'` (canonical); every row has `illustrative: true` + `sourceRef`; every claim traces to a quoted existing string or is the PENDING sentinel; no customer names; acronyms expanded (LLM, GPU, HPA, ROSA/ARO appear as shipped in the source strings).

VERIFY: the docsLinks URL must be curl-verified now: `curl -s -o /dev/null -w "%{http_code}" -L https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/` → expect 200 (this exact URL already ships in `deploymentComparisons.js` docsLinks, line ~432). If not 200, remove the link and log. Then `npm run lint && npm test` (still green — nothing imports the file yet).

COMMIT: `Product comparison: draft data model with illustrative placeholder rows (data fence)`

### Step 2 — Integrity tests

PRE-CHECK: `src/data/catalogIntegrity.test.js` still has the `sources` object at/near line 27 (`const sources = { capabilities, products, thirdPartyOptions, subComponents };`).

ACTION (two parts):

(a) Extend `catalogIntegrity.test.js`: add `import { productComparisons } from './productComparisons';` and add `productComparisons` to the `sources` object. That is ALL — the existing recursive walk now enforces the canonical status vocabulary inside the new file for free.

(b) Create colocated `src/data/productComparisons.test.js` (node environment — pure data, no jsdom pragma), modeled on the assertion style of `decisionRecommendationApply.test.js`. It must assert, for every entry in `productComparisons`:
1. `id` is unique, kebab-case (`/^[a-z0-9]+(-[a-z0-9]+)*$/`).
2. `products.a.productId` and `products.b.productId` each resolve to a real entry in `products` from `./products` (import it), and `a` ≠ `b`.
3. `comparisonType === 'product-dual-view'`; `title`, `description`, `audience` are non-empty strings.
4. Every `bomRows[]` entry has non-empty `area`, and `a`/`b` objects whose `included` ∈ `['included','add-on','not-included','confirm']`.
5. Every `capabilityRows[]` entry has non-empty `capability`, `a`/`b` objects whose `support` ∈ `['yes','partial','no','confirm']`, and boolean `overlap`.
6. **Fence consistency:** every row (both arrays) has boolean `illustrative`; every row with `illustrative === true` has a non-empty `sourceRef`; if `draft === false` then NO row has `illustrative === true`; if any row has `illustrative === true` then `draft === true`.
7. `getProductComparisonById('ai-inference-vs-rhoai')` returns the entry; unknown id returns `undefined`; `getProductComparisonList()` items have `{id, title, description, audience, draft}`; `isComparisonDraft(aiInferenceVsRhoai) === true`.
8. Every `docsLinks[].url` starts with `https://`.
9. Every `relatedComparisons[]` id resolves in `deploymentComparisons` (import `getComparisonById` from `./deploymentComparisons`) OR in `productComparisons` — a dangling related id is a failure.

VERIFY: `npm test` → previous count + new tests, all green (expect 49 + ~9 = ~58; exact number depends on how you group `it` blocks — record it).

COMMIT: `Product comparison: integrity tests (id resolution, vocab, draft-flag consistency)`

### Step 3 — Curation ledger: `src/data/CURATION-TODO.md`

ACTION: create the file. Required content (public-safe wording — this file ships in a public repo; no customer names, no internal names):

- Title + preamble: what this ledger is (every cell below is an illustrative placeholder awaiting human-verified truth), who executes it (a human curator with an assistant — NOT an autonomous agent), and the flip rule (per-row: replace placeholder text with sourced truth, set `illustrative: false`, replace `sourceRef` with the real citation; only when ALL rows are done, set the comparison's `draft: false`; the tests in `productComparisons.test.js` enforce ordering).
- Sources of truth, named: (1) Red Hat supported-configurations bill-of-materials article — `https://access.redhat.com/articles/rhoai-supported-configs-3.x` (HTTP 200 as of 2026-07-09; note: confirm during curation whether it enumerates the Red Hat AI Inference Server BOM, the Red Hat OpenShift AI BOM, or both — the slug and field discussion disagree on naming); (2) product documentation under `https://docs.redhat.com` for both products; (3) `knowledge-registry.md` in this repo — when curated claims land, ADD the supported-configs article to the registry in the same commit (registry rule: content claims trace to listed sources).
- A table with one line per placeholder cell — generate it programmatically-faithfully from the data file you just wrote (every `a`/`b` cell of every row in both arrays, including cells that already carry copied catalog text, since copied text still needs BOM-level confirmation). Columns: `View | Row | Product side | Current placeholder | Truth needed | Source to check`. Expect 16 BOM cells + 16 capability cells = 32 lines.
- A "not in v1 scope" note: Red Hat AI Enterprise (`rhaie`) and the standard-Kubernetes portfolio path (`rhai`) are deliberately excluded from the first comparison; adding them is a curation-time decision, not an agent decision.
- Sign-off line: `Curated by: ____  Date: ____  Product-manager/source sign-off (if obtained): ____`.

VERIFY: file contains zero occurrences of any customer name; `git add src/data/CURATION-TODO.md && .git/hooks/pre-commit` passes (report pass/fail only).

COMMIT: `Product comparison: curation TODO ledger (human gate for BOM truth)`

### Step 4 — View component: `src/components/ProductComparisonView.jsx`

PRE-CHECK: confirm the component directory layout ( flat `src/components/` as of 2026-07-09; if backlog WP6 landed, the right home is `src/components/product-comparison/ProductComparisonView.jsx` with `../../data/...` imports — adapt and log).

ACTION: create ONE new component file, under 500 lines, default-exporting `ProductComparisonView` (no props). All sub-pieces defined at module scope in the same file (eslint will error on nested definitions). Structure, in render order:

1. **Selector** — module-scope `ProductComparisonSelector({ selectedId, onSelect })`, a lightly-adapted copy of the card pattern in `DeploymentComparisonSelector.jsx` (lines 34–83) consuming `getProductComparisonList()`. Heading: `Product Comparison`. Intro copy (exact): `Compare two Red Hat AI products side by side: what ships in each (bill of materials view) and what you can do with each (capability view).` Card shows the `draft` flag as a small amber `Draft` chip when true. On mount, auto-select the first comparison (`useState(productComparisons[0]?.id ?? null)` in the parent) so the single-entry case renders content immediately.
2. **Draft banner** — rendered when `isComparisonDraft(comparison)` (import from the data file), amber style copied from `App.jsx` lines 91–99, `AlertCircle` icon, text exactly as specified in B.2. It sits INSIDE the capture root (next item).
3. **Capture root** — `<div id="product-comparison-capture-root">` wrapping banner + header + toggle + active table (so PNG exports carry the draft watermark).
4. **Header card** — title/description/audience, same card classes as `DeploymentImpactView.jsx` lines 56–63.
5. **View toggle** — `const [view, setView] = useState('bom')`; two buttons, `Bill of materials (BOM)` and `Capabilities`, styled exactly like the tab-nav buttons in `DeploymentImpactView.jsx` lines 73–85 (border-b-2, purple active state). Content block keyed `key={comparison.id}` (state-reset-on-switch precedent, `DeploymentImpactView.jsx` line 54).
6. **BOM table** (when `view === 'bom'`) — module-scope `BomTable({ comparison })`. Table markup modeled on `CapabilityDeltaTable.jsx` lines 71–119: columns `Component area | <a.label> | <b.label> | Notes`. Each product cell renders an inclusion badge (module-scope `InclusionBadge`, modeled on `ImpactBadge` in `CapabilityDeltaTable.jsx` line 152): `included` → green `Included`; `add-on` → blue `Add-on`; `not-included` → gray `Not included`; `confirm` → amber `Confirm with Red Hat`. Badge class strings are complete Tailwind literals copied from the existing badge palette (green/blue/gray/yellow variants already used in `CapabilityDeltaTable.jsx` lines 154–168). Below the badge, the `detail` text; per-cell `status`, when present, appended as ` — <status>` (canonical values only). Guard every optional field (`notes`, `status`) — CLAUDE.md guard rule. Row keys: `key={row.area}` (stable; avoid index keys — lint warns).
7. **Capability table** (when `view === 'capabilities'`) — module-scope `CapabilityTable({ comparison })`, same table skeleton: columns `Capability | <a.label> | <b.label> | Overlap`. Support badge (module-scope `SupportBadge`): `yes` → green `Yes`; `partial` → yellow `Partial`; `no` → gray `No`; `confirm` → amber `Confirm with Red Hat`. Overlap column: green check + `Shared` when `overlap === true` (visual precedent: the `similar` styling in `QuickComparisonTable.jsx` `ComparisonRow`, lines 382–393 — copy the pattern, do not import from that file).
8. **Actions row** — two buttons above the tables, inside the header card:
   - **Export PNG**: handler copied from `handleDownloadStackPng` in `CapabilityArchitectureView.jsx` lines 456–483, changing only: element id → `product-comparison-capture-root`, filename → `` `product-comparison-${comparison.id}-${new Date().toISOString().slice(0, 10)}.png` ``, busy-state variable names. Keep the lazy `await import('html-to-image')` exactly (bundle-size decision from Round 1) and the same `toPng` options object.
   - **Copy summary**: module-scope pure builder `function buildProductComparisonCopyText(comparison, view)` — private, NOT exported (verified: `CustomerConfig.jsx` keeps `buildWorkshopCopyText` unexported at line 48, and the active `react-refresh/only-export-components` lint rule flags non-component exports from component files). Modeled on `buildWorkshopCopyText` (plain text, `lines.join('\n')`): first line `DRAFT — pending bill of materials (BOM) curation; confirm with your Red Hat account team.` when `isComparisonDraft(comparison)`; then title; then one line per row of the active view: `<area/capability>: <a.label> = <badge word>; <b.label> = <badge word>`. Handler per `CustomerConfig.jsx` lines 86–94 (`navigator.clipboard.writeText`, `copyDone` state, button label flips to `Copied` then back).
9. **Docs links** — reuse the markup pattern of `DeploymentImpactView.jsx` lines 139–163 over `comparison.docsLinks` (guarded).

Style rules to honor throughout: dark-mode classes on every background/border/text (copy the exact `dark:` pairs from the source patterns); no emojis; expand every acronym on first use within THIS component (bill of materials (BOM) — already in the toggle label and banner; large language model (LLM) etc. arrive pre-expanded in the data strings); no new hard numbers anywhere.

VERIFY: `npm run lint` (0 errors — watch `react/no-unstable-nested-components`), `npm test`, `npm run build` all green. Component file ≤ 500 lines (`wc -l`).

COMMIT: `Product comparison: dual-view component (BOM/capability toggle, PNG export, copy summary)`

### Step 5 — Tab registration in `src/App.jsx` + glossary entry

PRE-CHECK: `views` array still matches the five-entry shape at lines 28–34; switch in `renderView()` at lines 36–67; `AcronymGlossary.jsx` still holds the `glossary` array at line 8 (if extracted to `src/data/glossary.js` per backlog WP4, edit there instead).

ACTION:
1. `App.jsx` line 2: add `Scale` to the existing lucide-react import list (fallback per A.4).
2. Add import after line 7 (`import DeploymentImpactView...`): `import ProductComparisonView from './components/ProductComparisonView';`
3. Append to the `views` array after the `deployment-impact` entry: `{ id: 'product-comparison', name: 'Product Comparison', icon: Scale }`.
4. Add switch case after `case 'deployment-impact':` — `case 'product-comparison': return <ProductComparisonView />;`. No special-case logic in the nav `onClick` (the `decisions` reset at lines 113–115 stays as-is).
5. `AcronymGlossary.jsx`: append ONE entry to the `glossary` array, matching the existing shape exactly:
   `{ acronym: 'BOM', fullName: 'Bill of Materials', explanation: 'The list of components that ship inside a product — for AI platforms: operators, container images, and their versions per release.', whenToUse: 'When clarifying what is actually included in a Red Hat AI product versus what is an add-on.' }`

VERIFY: `npm run check` green. Start the dev server (`.claude/launch.json` config `explorer-dev`, port 5173) and browser-verify: sixth tab renders with icon; selector auto-selects; draft banner visible; toggle switches BOM ↔ Capabilities; badges render; Export PNG downloads a file that INCLUDES the banner; Copy summary puts DRAFT-prefixed text on the clipboard; glossary search finds BOM. Repeat visual pass in dark mode (devtools `prefers-color-scheme: dark` emulation — repo rule: check dark for anything touching backgrounds). Also click through the other five tabs once each — no regressions.

COMMIT: `Product comparison: register tab in App.jsx and add BOM to acronym glossary`

### Step 6 — Docs sync (the repo's own contract requires this)

PRE-CHECK: repo `CLAUDE.md` "Five tabs, wired in `src/App.jsx`" table; `README.md` "Key features" line (line ~5) and "✨ Features" section; `docs/ROADMAP.md` V2 section.

ACTION:
1. `CLAUDE.md`: the tab table lists five tabs — add the row `| product-comparison | Product Comparison | ProductComparisonView |` and change the sentence "Five tabs" → "Six tabs". (CLAUDE.md's own header says: if a rule/fact changes, change the file — never leave it stale.)
2. `README.md`: add to Key features: `dual-view product comparison (bill of materials + capabilities, draft)`; add a short feature block near the Deployment Impact block: name the tab, the two views, and the draft/illustrative status in one sentence.
3. `docs/ROADMAP.md`: add a section `## V3: Product Comparison Dual-View (Phase 1 shipped as draft)` — shipped: side-by-side BOM/capability views for Red Hat AI Inference Server vs Red Hat OpenShift AI with illustrative placeholder data behind a draft banner; still pending: human curation of BOM truth from Red Hat supported-configuration documentation (see `src/data/CURATION-TODO.md`), possible later pairs (Red Hat AI Enterprise, standard-Kubernetes path).
4. Do NOT edit `docs/BACKLOG.md` (nothing there is yours) and do NOT edit `knowledge-registry.md` (B.5 — human curation step).

VERIFY: `npm run check` still green (docs don't affect it, but run it anyway as the step gate); grep the three edited docs for the banned inference-server acronym and any customer account name → zero hits.

COMMIT: `Product comparison: sync CLAUDE.md tab table, README features, ROADMAP entry`

### Step 7 — Final gate & handoff report

1. `npm run check` → record final counts in the log (lint 0, tests all green and strictly more than the Step-0 baseline of 49 — ~58 expected, exact count depends on `it`-block grouping; build OK).
2. Full staged leak check: `git add -A` is already committed; run `.git/hooks/pre-commit` once more against a no-op index to confirm clean (or `bash scripts/pre-commit.sh` if it supports direct invocation — read its header first).
3. `git log --oneline feature/product-comparison-dual-view ^<base-branch>` → exactly 6 commits with the messages above (plus none touching files outside A.1 rule 7's list — verify with `git diff --stat <base>...HEAD`).
4. Confirm NOTHING was pushed: `git status -sb` shows no upstream tracking pushes; you never ran `git push`.
5. Write the handoff summary into the planning log: branch name, HEAD, test counts, any DEVIATION lines, and the two human gates still open (E.1, E.2).

No commit (or a final log-only note — the log is gitignored anyway).

---

## D. VERIFICATION & DEFINITION OF DONE

### Commands (all must pass, run from the repo root)

```bash
npm run lint      # 0 errors (warnings allowed only at pre-existing count)
npm test          # all green; count strictly greater than the Step-0 baseline (49)
npm run build     # succeeds
```

### What the maintainer checks visually (reviewer script — E.1)

1. Sixth tab "Product Comparison" appears last in the nav, `Scale` icon, active-state underline matches the other tabs.
2. The amber draft banner is impossible to miss, reads exactly the B.2 text, and appears in light AND dark mode.
3. BOM view: 8 rows, two product columns headed "Red Hat AI Inference Server" / "Red Hat OpenShift AI (RHOAI)", amber "Confirm with Red Hat" badges wherever truth is pending — nothing reads as confident that shouldn't.
4. Capability view: 8 rows, Yes/Confirm badges, "Shared" overlap markers on serving / gateway / model-registry rows.
5. Export PNG: downloaded image contains the draft banner. Copy summary: pasted text starts with the DRAFT line.
6. The other five tabs are pixel-identical to before (spot-check Architecture and Deployment Impact).
7. `src/data/CURATION-TODO.md` reads as a complete work order she could execute cell-by-cell without re-deriving anything.

### Completion checklist (agent fills into the planning log)

- [ ] Step-0 baseline was clean and green; feature branch created off a clean tree
- [ ] `src/data/productComparisons.js` exists; every row `illustrative: true`; comparison `draft: true`; only canonical `status` values
- [ ] `catalogIntegrity.test.js` sweeps the new file; `productComparisons.test.js` enforces the nine assertions incl. draft-flag consistency
- [ ] `src/data/CURATION-TODO.md` lists all 32 cells with named sources
- [ ] `ProductComparisonView.jsx` ≤ 500 lines, module-scope subcomponents only, dark-mode classes throughout, no emojis, acronyms expanded
- [ ] Tab registered; glossary BOM entry added; CLAUDE.md/README/ROADMAP synced
- [ ] `npm run check` green; browser-verified light + dark; other tabs regression-checked
- [ ] 6 commits with the exact messages; zero pushes; zero edits outside the allowed file list; `main` untouched
- [ ] No occurrence of the banned inference-server acronym or any customer account name anywhere in the repo diff (grep the diff case-insensitively → empty)
- [ ] Deviation log complete — every step-id accounted for

---

## E. HUMAN CHECKPOINTS (hard stops — the agent does not pass these)

**E.1 ⛔ Visual review before merge.** The feature branch stays local until the maintainer runs the D reviewer script and approves. Only the maintainer merges to the base branch and (later) to `main`. Remember: **merge to `main` = automatic deploy to the public site** (A.1 rule 3). Shipping to main WITH the draft banner is an acceptable, maintainer-only decision (the strategic plan's "ship as draft — field tool" path); the agent never makes it.

**E.2 ⛔ Data-curation gate before ANY external sharing.** Before the comparison is shown to a customer, linked in a blog post, or presented as product truth in any channel: a human curator with an assistant executes `src/data/CURATION-TODO.md` against the supported-configurations article and product docs, flips `illustrative` flags row-by-row with citations, adds the article to `knowledge-registry.md`, and finally sets `draft: false` (tests enforce the order). Open question from the strategic plan to resolve at this gate: who owns bill-of-materials sign-off (product management? the platform architects council?) — raise via internal product-management channels. Until this gate passes, the tool is an internal/draft field aid, full stop.

---

## Appendix: adjacent facts the implementer may trip over

- **Roadmap/backlog overlap:** no product-comparison feature exists on `docs/ROADMAP.md` or `docs/BACKLOG.md`. The nearest neighbors — do not conflate: (1) ROADMAP V2 "Deployment Impact Explorer" is migration before/after, a different axis; (2) BACKLOG "Parked" holds a data-driven refactor of `QuickComparisonTable`'s hardcoded llm-d/Dynamo prose into a `comparisonType: 'alternative'` entry — parked, user-decision-gated, and NOT this feature (different tab, different data file). The `comparisonType: 'alternative'` machinery in `DeploymentImpactView.jsx` lines 27–42 is currently dead code; leave it alone.
- **A separate workshop assistant skill exists outside this repo** describing how to add *deployment* comparisons. It is partially stale (says React 18; repo is React 19) and covers a different workflow — the repo's own `CLAUDE.md` wins wherever they disagree.
- **PNG export quirk (do not fix here):** the existing export handlers detect dark mode via `document.documentElement.classList.contains('dark')`, which is always false under this repo's media-based dark mode, so exports always get the light background. Replicate the pattern as-is for consistency; fixing it repo-wide is a separate backlog candidate.
- **`.npmrc` sets `legacy-peer-deps=true`** deliberately (eslint-plugin-react vs eslint 10 — BACKLOG WP0 note). Never remove it; never "fix" `settings.react.version: '19.2'` to `'detect'`.

---

## 📖 Terms

- **Red Hat AI Inference Server** — product id `ai-inference` in the explorer; the inference-focused serving product. Referred to in internal field discussion by a four-letter shorthand that is banned from this public repo — full name only.
- **RHOAI** — Red Hat OpenShift AI: the full AI/machine-learning platform on OpenShift (product id `rhoai`); the other half of the comparison.
- **RHAIE / RHAI / RHEL AI** — Red Hat AI Enterprise (OpenShift+RHOAI bundle) / the portfolio path for standard Kubernetes / the single-server Red Hat Enterprise Linux AI product — all excluded from v1 scope.
- **BOM (bill of materials)** — the list of components shipped in a product (operators, container images, versions, support scope); the truth this feature must NOT invent.
- **Explorer** — `ai-platform-explorer`, this public React 19 + Vite + Tailwind workshop tool on GitHub Pages; field engineers use it live in front of customers.
- **KServe** — model-serving layer built into RHOAI (Kubernetes custom resources over vLLM and other runtimes).
- **vLLM** — the high-throughput large-language-model inference engine at the core of Red Hat AI Inference Server.
- **The motivating customer accounts** — the (unidentified) customer accounts whose confusion motivated this feature; their names are banned from the public repo.
- **Vitest / eslint / `npm run check`** — the explorer's test runner, linter, and combined quality gate (lint + test + build) that every step must keep green.
- **GitHub Pages deploy on `main`** — the explorer's CI publishes `main` straight to the public site; merging = publishing, hence the human-only gates.
