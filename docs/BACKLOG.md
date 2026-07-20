# Backlog

Working checklist for this repo. Every open item is written to be **directly executable by an agent with no further research**: exact location, the problem, the prescriptive fix, and per-package verification. Read `CLAUDE.md` first — it defines the locked decisions, public-repo rules, and style rules the fixes below enforce.

**Execution rules for agents:**
1. Work one package (WP) at a time. File ownership per package is exclusive — do not touch files outside your package.
2. Run order: WP0 → (WP1, WP2, WP3 may run in parallel — disjoint files) → WP4 → WP5 → WP6 → WP7. WP4 must wait for WP1–WP3 because it edits the same data files.
3. Never rename capability/option/product ids. Fix display strings only.
4. After each package: `npm run lint` (0 errors), `npm test` (all green), `npm run build` (succeeds), browser-check the affected tab(s) in light AND dark mode (dark = flip the header toggle or emulate in devtools; theming is class-based `html.dark`, persisted to `localStorage`, falls back to `matchMedia`), stage everything and run `.git/hooks/pre-commit` (leak check must pass), then check off the items here.
5. Line numbers below were exact at review time (2026-07-03) but drift as edits land — locate by the quoted text, not the number.

---

## Round 1 — completed 2026-07-03 (summary)

Adversarial review #1 found and fixed: internal employee names + Slack channels published on the live site (all scrubbed; pre-commit leak hook added — it caught one more leak in `TrainingDeepDive.jsx` on first run); invented "Versatile LLM"/"Kubernetes Model Serving" glossary expansions; RHAI/RHAIE/AI-Gateway GA badges → honest `'Check with Red Hat'`; broken KServe migration YAML (`storageUri` + `--model {{.Name}}` → `/mnt/models` + `--served-model-name`); fictional `Workbench` CRD → `kubeflow.org/v1 Notebook`; stale JupyterHub/TGIS/ModelMesh/OpenShift-SDN/Tekton claims purged; unsourced numbers removed; llm-d-vs-Dynamo governance/SKU errors fixed; ~2,600 lines of dead components + `playwright`/`reactflow`/`html2canvas` deps deleted; InteractiveBuilder one-way sync bug fixed (+4 regression tests, suite now 48); nested components hoisted; PNG export deduped + lazy-loaded (bundle 794→583 KB); lint+test gates added to deploy.yml; DecisionTree back-nav rebuilt on a history stack; modal a11y (role/aria/Escape); README/ROADMAP/knowledge-registry updated; Google Fonts removed (system font stack).

Still open from Round 1:
- [ ] **Branding decision (user call):** purple-pink "RH" gradient vs the Red Hat brand standards `knowledge-registry.md` cites — decide and align.
- [x] Editorial discipline codified — now enforced by `CLAUDE.md` (public-repo rules + style rules).

---

## Round 2 — adversarial review #2 (2026-07-03): the components Round 1 never covered

Reviewed: `TrainingDeepDive`, `FineTuningDecisionMatrix`, `UseCaseView`, `RAGArchitecture`, `MCPEcosystemFull`, `DeploymentImpactView` + its four sub-views, plus a whole-repo structure/patterns review. Root cause of most findings: **these components keep their content inline instead of in `src/data/`, so the Round-1 data-file sweep never touched them** (WP4 fixes the root cause).

---

### WP0 — Tooling & guardrails ✅ COMPLETE (2026-07-05)

Files owned: `eslint.config.js`, `package.json`, `scripts/`, `src/data/capabilities.js` (one status string only), new test file.

- [x] **`eslint-plugin-react` + `no-unstable-nested-components` rule.** Enabled `react/no-unstable-nested-components: ['error', { allowAsProps: true }]`, `react/jsx-key: 'error'`, `react/no-array-index-key: 'warn'`. Result: 0 errors (Round 1 hoisting confirmed complete, now locked in), 49 array-index-key warnings (deliberately warn-level).
  - **Peer-dep note for future agents:** `eslint-plugin-react@7.37.5` does NOT officially support eslint 10 (peer range tops out at `^9.7`) AND its version-autodetection calls `getFilename()`, an API eslint 10 removed → hard crash with `settings.react.version: 'detect'`. Resolution: (1) `.npmrc` sets `legacy-peer-deps=true` so both `npm install` and CI `npm ci` accept the install; (2) `settings.react.version` is PINNED to `'19.2'` (a literal) in `eslint.config.js` — this skips the crashing autodetect path. Do not switch back to `'detect'`. If eslint-plugin-react ships eslint-10 support later, remove both workarounds.
- [x] **npm scripts added:** `lint:fix`, `check` (`eslint . && vitest run && vite build`), `test:coverage` (+ `@vitest/coverage-v8` devDep). Also added `@testing-library/dom` — a missing peer of `@testing-library/react` v16 that the legacy-peer-deps reinstall exposed (component tests need it).
- [x] **Pre-push hook** `scripts/pre-push.sh` (runs `npm run lint && npm test`). Install per clone: `cp scripts/pre-push.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push`.
- [x] **Status-vocabulary stray fixed:** `capabilities.js` batch-gateway `'Technology Preview'` → `'Dev Preview'`.
- [x] **Data-integrity test** `src/data/catalogIntegrity.test.js` — recursive walk asserting every `status` field is in the canonical 4-value set. **Correction vs. plan:** the `provider` assertion was DROPPED — empirically the `provider` field is an OPEN set (carries `NVIDIA`/`AMD`/`Intel`/`Google`/`AWS`/`Open Source`/`CPU`, not just Red Hat/Customer/None); only the color-badge grouping collapses it. CLAUDE.md was corrected to match. WP5's badge helper is where the 3-way grouping lives, not a data vocabulary.
- [x] **Stale worktree pruned** (`git worktree remove --force`).

Verified: `npm run check` green (lint 0 errors, 49 tests pass, build succeeds); leak hook passes; Products tab renders corrected badges in the browser.

---

### WP1 — Training content truthfulness ✅ COMPLETE (2026-07-05)

All 20 items applied and browser-verified (H200 row present, cost badges now red/yellow not green, "Domain fit" replaces "Accuracy", InstructLab reframed, no CodeFlare/"3-5x A100"/"Fine-Tuning (InstructLab)"). Follow-up: the `getColorClasses` fallback returns a string but the call site destructures an object — unreachable today (only purple/blue/green ever reach it); a true object-shape fallback is folded into WP5 (color-token consolidation).

Files owned: `src/components/TrainingDeepDive.jsx`, `src/components/FineTuningDecisionMatrix.jsx` — nothing else. Both are prop-less and imported only by `UseCaseView.jsx` (lines 5/8, rendered at 351/354), so every fix is drop-in with zero call-site changes. Cross-file items are listed in WP4-adjacent **WP-D** below — do NOT edit data files in this package.

- [x] **[CRITICAL] Unhedged LAB-tuning/InstructLab positioning.** `TrainingDeepDive.jsx:62-64`: `when: 'Single-server, out-of-the-box environment for LAB-tuning foundation models'`. Red Hat AI 3 (Oct 2025) repositioned customization around supervised fine-tuning/LoRA; the taxonomy-driven InstructLab flow is no longer the flagship path, and "LAB" is a bare acronym here. Fix: `when: 'Single-server, out-of-the-box environment for serving and light fine-tuning of foundation models on one machine'`; keep `bestFor` unchanged.
- [x] **[CRITICAL] Fine-tuning ≠ InstructLab.** `TrainingDeepDive.jsx:316` header `Fine-Tuning (InstructLab)` → `Fine-Tuning`. Line 333 bullet `Use InstructLab for domain-specific alignment` → `Use OpenShift AI fine-tuning workflows (supervised fine-tuning, LoRA adapters); InstructLab is an option for taxonomy-driven synthetic data — confirm current support status with your Red Hat account team`. Line 329 `Small-to-medium scale, taxonomy-driven` → `Small-to-medium scale compared to pre-training`.
- [x] **[CRITICAL] InstructLab listed as a peer product in the decision matrix (category error) + bare "SME".** `TrainingDeepDive.jsx:72-75`. Replace the entry with: `choose: 'InstructLab (open source project)', when: 'You want taxonomy-driven synthetic data generation to add skills or knowledge, and have confirmed current support status with your Red Hat team', bestFor: 'Limited training data, synthetic data generation, subject-matter-expert-driven improvement'`.
- [x] **[MAJOR] CodeFlare listed as a current training tool (deprecated in RHOAI 2.x).** `TrainingDeepDive.jsx:18`: `tools: ['Ray', 'Training Operator', 'CodeFlare']` → `tools: ['Ray (distributed compute)', 'Kubeflow Training Operator']` (matches `capabilities.js:87`).
- [x] **[MAJOR] Cost-badge logic renders 'Very High' and 'Medium-Low' as GREEN.** `TrainingDeepDive.jsx:259-263`: the ternary only matches `'Highest'|'High'` (red) and `'Medium'` (yellow); AMD MI300X (`'Very High'`, line 95) falls through to green. Fix: `['Highest','Very High','High'].includes(hw.cost) ? red-classes : ['Medium','Medium-Low'].includes(hw.cost) ? yellow-classes : green-classes` (keep the existing class strings).
- [x] **[MAJOR] Unsourced price multiplier.** `TrainingDeepDive.jsx:88`: `cost: 'Highest (3-5x A100)'` → `cost: 'Highest'`.
- [x] **[MAJOR] GPU table two generations stale.** `TrainingDeepDive.jsx:83-126`: (a) add row `{ gpu: 'NVIDIA H200', memory: '141GB HBM3e', bestFor: 'Large model training and inference; successor to H100 with more memory', cost: 'Highest', performance: 'Maximum' }`; (b) H100 `bestFor` (line 87) → `'Training large models (70B+ parameters)'` (drop the "175B+ params, fastest R&D iteration" framing); (c) add caveat line under the table heading: `Representative examples — GPU availability and pricing change quickly; confirm current options with your hardware vendor.`
- [x] **[MAJOR] Fine-tuning card ignores LoRA and oversells cost.** `FineTuningDecisionMatrix.jsx:23-29`: con at line 25 → `'GPU compute costs (much lower with parameter-efficient methods like LoRA — low-rank adaptation)'`; add a pro/whenToUse line `'Parameter-efficient options (LoRA adapters) reduce cost and hardware needs significantly'`; `cost: 'High'` → `cost: 'Medium-High (low with LoRA)'`.
- [x] **[MAJOR] "Accuracy" scalar ranks fine-tuning above RAG as fact.** `FineTuningDecisionMatrix.jsx:31, 59, 87` + metric label at line 215. Rename label `Accuracy` → `Domain fit`; values → `'Excellent (style & domain patterns)'` (fine-tuning) / `'Excellent (current facts, cited)'` (RAG) / `'Good (general knowledge)'` (pre-trained).
- [x] **[MAJOR] Pre-training-from-scratch overclaim.** `TrainingDeepDive.jsx:297` → `'Trains a model from scratch (rare for large language models — most organizations start from a foundation model)'`; line 309 → `'Red Hat OpenShift AI distributed workloads (Ray) support large multi-node jobs'`.
- [x] **[MAJOR] Bare "RAG" as card title + section heading.** `FineTuningDecisionMatrix.jsx:34` → `name: 'RAG (Retrieval-Augmented Generation)'`; line 121 heading → `Fine-Tuning vs. Retrieval-Augmented Generation (RAG) vs. Pre-trained: Decision Matrix`; line 238 `Choose RAG` may stay.
- [x] **[MAJOR] Bare "RHOAI".** `TrainingDeepDive.jsx:67` → `choose: 'Red Hat OpenShift AI (RHOAI) Distributed Workloads'`.
- [x] **[MINOR] Bare benchmark acronyms.** `TrainingDeepDive.jsx:23` → `tools: ['Evaluation pipelines', 'Benchmark suites (e.g., MMLU knowledge test, HumanEval coding test)']`.
- [x] **[MINOR] Hand-wavy "with techniques".** `TrainingDeepDive.jsx:101` → `'Most production fine-tuning (7B-70B parameters) — 70B feasible with parameter-efficient methods and multi-GPU sharding'`.
- [x] **[MINOR] Performance badge flattens 'Very Good (inference)' to gray.** `TrainingDeepDive.jsx:268-272`: add `hw.performance.startsWith('Very Good')` to the blue branch.
- [x] **[MINOR] `.slice(0, 3)` silently drops the 4th pro/con of every approach.** `FineTuningDecisionMatrix.jsx:176, 191`. Remove both `.slice(0, 3)` calls (preferred — the 4th entries are good content), or delete the 4th entries from the data at lines 16-27/44-55/72-83 so the file matches what ships.
- [x] **[MINOR] Duplicate "Quick Decision Guide" headings on one page.** `FineTuningDecisionMatrix.jsx:227` → rename heading to `Which approach fits?` (UseCaseView.jsx:368 keeps the other).
- [x] **[MINOR] Wrong doc pointer.** `TrainingDeepDive.jsx:348` → `Docs: Working with distributed workloads, Red Hat OpenShift AI (docs.redhat.com)`.
- [x] **[HYGIENE] `getColorClasses` returns `undefined` for unknown colors.** `FineTuningDecisionMatrix.jsx:91-116`: add fallback `return colors[color] || 'bg-gray-600 text-white';` (inputs are hardcoded today; this is crash-proofing before WP4 externalizes the data).

Note for the fixer: `solutionDetails.js:191` expands LAB as `'Large-scale Alignment for chatBots'` — that expansion is CORRECT (IBM Research LAB paper); reuse it wherever LAB needs expanding, do not "fix" it.

Verify: lint/test/build + browser-check the Use Cases tab (both components render there), light + dark.

---

### WP2 — Use Cases & RAG truthfulness ✅ COMPLETE (2026-07-05)

All items applied and browser-verified (RAG pipeline now has a Retrieval stage, no "AutoRAG" in customer text, product chips show maturity status, Elastic-preferred claim gone, batch internals removed). **Cross-file item resolved early:** the agentic use case now recommends `llama-stack-distribution`, which did NOT resolve in `catalogResolve.js` (would have leaked the raw id on a chip — a CLAUDE.md violation). Fixed immediately by adding a `llama-stack-distribution` entry to `WORKSHOP_REFERENCE_LABELS` (label "Llama Stack distribution", Tech Preview maturity) — browser-confirmed the chip shows the name, no raw id. This was a WP-D-class item done inline to avoid leaving a regression in the tree.

Files owned: `src/components/UseCaseView.jsx`, `src/components/RAGArchitecture.jsx`, `src/App.jsx` (one prop removal only). Cross-checks were verified at review time: all 14 `recommendedProducts` ids resolve; no emojis present.

- [x] **[CRITICAL] "Elastic (preferred partner)" survives here after being purged from data files.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2 (2026-07-17); no "preferred partner" text survives in any tracked file. `optionGuides.js:139` correctly says "partner option".
- [x] **[CRITICAL] API version contradicts the fixed data files.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2. `solutionDetails.js:542` consistently uses `v1alpha1`.
- [x] **[CRITICAL] "AutoRAG" headlined but exists in no catalog.** SKIPPED(already-fixed): `RAGArchitecture.jsx` heading already reads "RAG Configuration Tuning"; subtitle already reads "Parameters worth testing systematically to improve retrieval quality". Internal variable renamed `autoRAGOptimizations` → `optimizations` (ws/truth-rag).
- [x] **[CRITICAL] The "RAG Architecture Pipeline" has no retrieval step.** SKIPPED(already-fixed): `ragArchitecture.js` has `stage: 'Retrieval'` between API Gateway and Model Serving; subtitle reads "API Gateway → Retrieval → Model Serving → Response".
- [x] **[MAJOR] Hedge-free RAG output claims.** SKIPPED(already-fixed): `ragArchitecture.js` Response stage: description "Answer generated from the retrieved context"; details include "Answers constrained to retrieved context (reduces, does not eliminate, unsupported statements)"; no "Low latency" or "Grounded output with citations".
- [x] **[MAJOR] Automated-deployment overclaim.** SKIPPED(already-fixed): `RAGArchitecture.jsx` Goal line already reads "systematically test these parameters against a labeled question set, then deploy the best-scoring configuration".
- [x] **[MAJOR] Batch numbers: one orphan, one self-contradiction.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2; no "50,000" or "200 MB" batch claims survive in any tracked file.
- [x] **[MAJOR] Dev Preview Batch Gateway shown as finished, with internal implementation details.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2; no X-MaaS-User, Redis-for-metadata, or "up to 50K" claims survive.
- [x] **[MAJOR] Product chips hide maturity status.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2.
- [x] **[MAJOR] Unsourced Garak probe count.** SKIPPED(already-fixed): `UseCaseView.jsx` removed; `decisionGuides.js:1119` already reads "runs a large library of attack probes".
- [x] **[MAJOR] Invented traffic threshold.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2.
- [x] **[MAJOR] RHAIE oversold against its own hedged status.** SKIPPED(already-fixed): `UseCaseView.jsx` removed by WS-IA-2; `decisionGuides.js:130` already hedges "confirm current packaging".
- [x] **[MAJOR] Agentic use case ignores the repo's own agentic story (Llama Stack + MCP).** SKIPPED(already-fixed): `UseCaseView.jsx` removed; `catalogResolve.js` already has `llama-stack-distribution` entry (added when WP2 was completed 2026-07-05).
- [x] **[MAJOR] Unattributed ingestion capability sheet.** SKIPPED(already-fixed): `ragArchitecture.js` subtitle already reads "Common source formats a RAG ingestion pipeline needs to handle, and the typical processing technique for each". `UseCaseView.jsx` references gone with WS-IA-2.
- [x] **[MAJOR by house rule] Bare acronyms sweep.** SKIPPED(already-fixed): `ragArchitecture.js` already expands OAuth/OIDC/mTLS, SLO, KV cache, OCR, ASR on first use. `UseCaseView.jsx` references (RAGAS, LeaderWorkerSet, JSONL, S3-compat) gone with WS-IA-2.
- [x] **[MINOR] "Web scraping" mislabel.** SKIPPED(already-fixed): `ragArchitecture.js:49` already reads `technique: 'Markup parsing'`.
- [x] **[MINOR] NVIDIA-only GPU stage.** SKIPPED(already-fixed): `ragArchitecture.js` Model Serving stage already reads "NVIDIA, AMD, or Intel accelerators"; standalone GPU stage removed.
- [x] **[MINOR] Dead prop.** SKIPPED(already-fixed): `UseCaseView.jsx` no longer rendered from `App.jsx`; WS-IA-2 removed it entirely.
- [x] **[HYGIENE] `getColorClasses` fallback.** SKIPPED(already-fixed): `RAGArchitecture.jsx` has no `getColorClasses` function; content moved to `ragArchitecture.js` data file with no color logic.

Verify: lint/test/build + browser-check the Use Cases tab end-to-end (cards, filters, all five sub-sections), light + dark.

---

### WP3 — MCP truthfulness + Deployment Impact robustness ✅ COMPLETE (2026-07-05)

All items applied and browser-verified. **Dark-mode YAML black-slab fix confirmed via computed styles** on a clean dev-server boot: the expanded `<pre>` wrapper now has `max-height: 384px`, `overflow-y: auto`, `border-top: 1px`, and the `<pre>` background is `rgb(3,7,18)` (gray-950, distinct from the page) — the undifferentiated near-black slab is gone. Also confirmed: the personal github.io prototype link removed, MCP Tech-Preview banner present, selector copy trimmed to "...resource trees, and capabilities.", `decisionFactors` guarded. (The `<button>`-nesting and unresolved-`html2canvas` errors seen transiently in dev-server logs during the parallel edits were mid-write snapshots; a clean server restart shows zero errors and `npm run build` passes.)

Files owned: `src/components/MCPEcosystemFull.jsx`, `src/components/DeploymentImpactView.jsx`, `src/components/DeploymentComparisonSelector.jsx`, `src/components/YAMLDiffView.jsx`, `src/components/ResourceTreeView.jsx`, `src/components/CapabilityDeltaTable.jsx`, `src/components/QuickComparisonTable.jsx`, `src/data/resourceDefinitions.js`. (solutionDetails.js edits live in WP-D.)

- [x] **[CRITICAL] MCP platform presented as shipping; data files say Tech Preview.** `MCPEcosystemFull.jsx:117-227`: add a visible banner inside the header block (after line 123): `Technology Preview — verify availability with your Red Hat account team`; append `(Technology Preview)` to each of the four component cards' `role` or description strings in the `components` array (lines 42-76), mirroring `solutionDetails.js:401-402` which already labels two of them.
- [x] **[MAJOR] Customer-facing link to a personal GitHub Pages prototype.** `MCPEcosystemFull.jsx:124-132`: the `View Full MCP Ecosystem Guide` link points to a personal `github.io` site (no support commitment, leaks a prototype). DELETE the `<a>` block, or repoint to `https://modelcontextprotocol.io` and relabel `MCP specification (modelcontextprotocol.io)`.
- [x] **[MAJOR] Absolute certification claim.** `MCPEcosystemFull.jsx:151`: `'Every MCP server goes through security scanning and certification before being published'` → `'The planned ingestion workflow validates, scans, and signs MCP servers before publication — confirm certification status in product documentation.'`
- [x] **[CRITICAL, latent white-screen] Unguarded `decisionFactors` in QuickComparisonTable.** `QuickComparisonTable.jsx:32-37`: currently unreachable (no `comparisonType: 'alternative'` entry exists), but the first alternative comparison added without `decisionFactors` throws and white-screens the tab. Fix: `const beforeFactors = before.decisionFactors || []; const afterFactors = after.decisionFactors || [];`, map over `beforeFactors`, and use `afterFactor?.value ?? '—'`.
- [x] **[MAJOR, requested-bug diagnosis] Giant black region in YAML Diff dark mode.** `YAMLDiffView.jsx:156-161`. Cause (verified): expanded `<pre>` uses `dark:bg-gray-900` — same color as the card header and near-same as the page background — with no max-height, so a 39-line snippet renders an ~800px undifferentiated near-black slab whose right two-thirds is empty. Fix (mechanical): on the `<pre>` (line 158) change `dark:bg-gray-900` → `dark:bg-gray-950`; on the wrapper div (line 157) add `border-t border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto`.
- [x] **[MAJOR, invalid HTML] Nested `<button>` in YAML card header.** `YAMLDiffView.jsx:106-153`: the Copy `<button>` (132) sits inside the expand/collapse `<button>` (106). Fix: change the outer element to `<div role="button" tabIndex={0} onClick={...} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setIsExpanded(!isExpanded);}}} aria-expanded={isExpanded} className="...cursor-pointer">`.
- [x] **[MAJOR] Expansion/selection state leaks across comparison switches.** One mechanical fix subsumes all three instances: in `DeploymentImpactView.jsx` key the comparison content block on the comparison — `{comparison && (<div key={comparison.id} className="space-y-6">`. Bonus: change `key={idx}` → `key={resource.name}` at `YAMLDiffView.jsx:54, 68`.
- [x] **[MAJOR, latent] ResourceTreeView recursion drops `isAlternative`.** `ResourceTreeView.jsx:246-255`: the recursive `<ResourceTreeNode>` doesn't pass `isAlternative`, so nested nodes would show spurious NEW/REMOVED badges in a future alternative comparison. Fix: add `isAlternative={isAlternative}` to the child render.
- [x] **[MAJOR] Selector copy promises a view that doesn't exist.** `DeploymentComparisonSelector.jsx:29-31` advertises "operational responsibilities" but nothing renders `operationalShifts`/`appTeamOwns`/`platformTeamOwns`/`controlPlane`/`dataPlane` (grep-confirmed: only the data file references them). Mechanical fix: trim the sentence to `...for YAML, resource trees, and capabilities.` (An "Ownership" tab rendering that data is a parked enhancement — see bottom.)
- [x] **[MINOR] "MCP" never expanded; bare NoSQL/CI-CD.** `MCPEcosystemFull.jsx:119` → `'The Model Context Protocol (MCP) Ecosystem on OpenShift AI'`; line 33 → `'Document database (stores JSON-like records)'`; line 37 → `'DevOps platform with built-in build and release automation'`.
- [x] **[MINOR] Icon-only tree buttons unlabeled.** `ResourceTreeView.jsx:207-216`: add `` aria-label={isExpanded ? `Collapse ${node.kind}` : `Expand ${node.kind}`} aria-expanded={isExpanded} ``. Also `DeploymentImpactView.jsx:102`: add `aria-expanded={migrationNotesExpanded}`.
- [x] **[MINOR] ResourceDetailPanel is not a dialog.** `ResourceTreeView.jsx:266-359`: add `role="dialog" aria-modal="true" aria-label={resourceKind}` to the panel div (~278) and an Escape-keydown `useEffect` calling `onClose()`.
- [x] **[MINOR] Copy failure invisible to the user.** `YAMLDiffView.jsx:90-92`: add `copyFailed` state set in the catch (auto-clear after 2s) and render `Copy failed` in the button when set.
- [x] **[MINOR] Three resource kinds missing from resourceDefinitions.** `src/data/resourceDefinitions.js`: the RHOAI tree uses `DataScienceCluster`, `Notebook`, `StatefulSet` which all fall to the "Unknown / no description" fallback. Add three entries following the existing schema; `DataScienceCluster` apiVersion is `datasciencecluster.opendatahub.io/v1`, docs URL reuse from `deploymentComparisons.js:1008`.
- [x] **[MINOR] Invalid Tailwind class.** `QuickComparisonTable.jsx:129, 132`: `w-3/8` generates nothing → replace both with `w-[37.5%]`.
- [x] **[MINOR] Tone/trademark.** `MCPEcosystemFull.jsx:177`: `SOURCE OF TRUTH` pill → `System of record`; line 22: `'EDB Postgres® AI'` → `'EDB Postgres AI'` (only `®` in the repo — all-or-none rule).

Verify: lint/test/build + browser-check the Deployment Impact tab (expand YAML cards in dark mode — the black-slab must be visibly fixed; switch comparisons and confirm expansion state resets) and the MCP section of the Use Cases tab.

---

### WP-D — Cross-file data alignment (run AFTER WP1–WP3; serial, one agent)

Files owned: `src/data/solutionDetails.js`, `src/data/capabilities.js`, `src/data/products.js`.

- [ ] **[CRITICAL, verified 404] Fabricated documentation URLs.** `solutionDetails.js:427, 456, 484`: `documentation: 'https://docs.redhat.com/mcp'` returns 404 (verified 2026-07-03). Also `:392` `https://docs.redhat.com/trustyai` (404). Sweep ALL `docs.redhat.com/<shortword>` values (suspects at lines 122, 183, 216, 359: `/rhoai`, `/instructlab`, `/openshift/monitoring`) — for each, either substitute the verified pattern `https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/` (in use at `solutionDetails.js:250`) or set `documentation: null`. **Verify every remaining URL returns 200 before committing** (`curl -s -o /dev/null -w "%{http_code}" <url>`).
- [x] **[MAJOR] MCP partner-roster contradiction.** DONE(ws/content-consistency 2026-07-17): `solutionDetails.js` rh-mcp-full integrations now split into two rows matching `mcpEcosystem.js` exactly — Technology Partner MCP Servers (Confluent Cloud, EDB Postgres AI, HashiCorp, Azure, Dynatrace, Elastic) + Community MCP Servers (MongoDB, MariaDB, PostgreSQL, GitHub, GitLab). AWS/Google Cloud removed (not in mcpEcosystem.js). Longer-term single-source item is in WP4.
- [x] **[MAJOR] InstructLab maturity + hedging alignment.** DONE(ws/content-consistency 2026-07-17): (a) `capabilities.js`: InstructLab option `status: 'GA'` → `'Tech Preview'` — RHOAI 2.18 release notes (Tech Preview section) confirm both InstructLab pipeline and distributed InstructLab training as Technology Preview; no GA announcement found through 3.x releases. Source (200): https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/2.18/html/release_notes/technology-preview-features_relnotes. (b) `solutionDetails.js` instructlab description updated to explicitly name "Technology Preview in Red Hat OpenShift AI" + standard confirmation hedge. rhel-ai entry already clean (describes inference only, no InstructLab training framing).
- [x] **[MINOR] Batch-gateway status already normalized in WP0** (`capabilities.js:191`) — confirmed `products.js` `'Dev Preview'` matches `capabilities.js` `'Dev Preview'` after WP0. SKIPPED(already-fixed, ws/content-consistency 2026-07-17).

Verify: lint/test/build (the WP0 integrity test guards the vocabulary); grep `docs.redhat.com/` and curl-check each hit.

---

### WP4 — Extract inline content to `src/data/` (root-cause fix; run after WP1–WP3 + WP-D)

Everything below moves content only — no wording changes (content is already corrected by earlier WPs). Keep exports named as listed; icons: keep icon components in data (precedent: `lib/flowVisualizationData.js` imports lucide) EXCEPT `guideMetadata` where string names + an `iconMap` in the component is cleaner. After each extraction add `?? []` guards on any field not present on every record.

- [ ] `DecisionFlowchart.jsx`: move `guideMetadata` (24-35), `guideGroups` (37-63), `decisionFlows` (65-1301 — 1,237 lines) → `src/data/decisionGuides.js`. Cuts the component from 1,733 to ~455 lines.
- [ ] `UseCaseView.jsx`: `useCases` (13-177) → `src/data/useCases.js`.
- [ ] `AcronymGlossary.jsx`: `glossary` (8-117) → `src/data/glossary.js`.
- [ ] `TrainingDeepDive.jsx`: `trainingWorkflow`, `trainingVsInference`, `decisionMatrix`→`trainingDecisionMatrix`, `hardwareComparison` (4-126) → `src/data/trainingDeepDive.js`.
- [ ] `FineTuningDecisionMatrix.jsx`: `approaches` (4-89) → `fineTuningApproaches` in `src/data/fineTuningApproaches.js`.
- [ ] `SecurityOverview.jsx`: `securityLayers` (4-77) → `src/data/securityLayers.js`.
- [ ] `MCPEcosystemFull.jsx`: `mcpServers` (7-40), `components`→`mcpEcosystemComponents` (42-76) → `src/data/mcpEcosystem.js`. Then point `solutionDetails.js:407` at this single source (resolves the roster contradiction permanently).
- [ ] `RAGArchitecture.jsx`: `pipeline`→`ragPipeline`, `documentFormats`→`ragDocumentFormats`, `autoRAGOptimizations`→`ragOptimizations` (4-67) → `src/data/ragArchitecture.js`.
- [ ] Do NOT extract: `DeepDiveModal.jsx` `DEFAULT_REQUIREMENTS` (one string), `CustomerConfig.jsx` `getSuggestedProductIds` (logic-with-content; fine in place).

Verify: lint/test/build; every tab browser-checked (this touches all five); `git diff --stat` should show near-pure moves.

---

### WP5 — Shared color/status tokens

Files owned: new `src/lib/colorTokens.js` + the components listed.

- [ ] Create `src/lib/colorTokens.js` exporting: `statusBadgeClass(status)` (canonical 4-value map: GA→green, Tech Preview→blue, Dev Preview→yellow, Check with Red Hat→gray; unknown→gray), `providerClasses(option, variant)` (Customer=blue, Red Hat=green/emerald, third-party=purple; variants: `banner`/`card`/`chip`), and `colorTokens(color)` (the generic named-color→Tailwind map). All values complete Tailwind class-string literals — never template-built (JIT rule, see CLAUDE.md).
- [ ] Replace the duplicates: status maps at `ProductExplorer.jsx:21-23` (currently the only colored one), `InteractiveBuilder.jsx:214`, `CapabilityConfigurationModal.jsx:119-123`; provider ternaries at `CapabilityArchitectureView.jsx:121-124` and `:129-135` (note: currently uses different shades than its own banner — unify), `InteractiveBuilder.jsx:100-105`, `:204-208`, `CapabilityConfigurationModal.jsx:109-113`; local `colors` maps at `RAGArchitecture.jsx:70`, `MCPEcosystemFull.jsx:79`, `SecurityOverview.jsx:80`, `FineTuningDecisionMatrix.jsx:92`.
- [ ] Add a data-integrity assertion (extend WP0's test): every status the components can receive maps to a non-undefined class via `statusBadgeClass`.

Verify: lint/test/build; visual spot-check Products tab badges + Architecture tab provider colors, light + dark.

---

### WP6 — Directory reorganization (LAST; one dedicated commit, `git mv` only, zero logic changes)

Decision (made — do not re-litigate): **light grouping, not a full feature-folder reorg.** `src/data/` stays cross-feature (capabilities.js serves 3 tabs); the import graph is already clean (zero cross-tab component imports).

Target:

```
src/
  App.jsx  main.jsx  index.css
  components/
    architecture/       ArchitectureHub, CapabilityArchitectureView, InteractiveBuilder(+.test.jsx),
                        CustomerConfig, CapabilityConfigurationModal, FlowVisualization, DeepDiveModal
    decision-guides/    DecisionFlowchart, DecisionTree
    use-cases/          UseCaseView, MCPEcosystemFull, FineTuningDecisionMatrix,
                        RAGArchitecture, SecurityOverview, TrainingDeepDive
    products/           ProductExplorer
    deployment-impact/  DeploymentImpactView, DeploymentComparisonSelector, YAMLDiffView,
                        CapabilityDeltaTable, ResourceTreeView
    shared/             AcronymGlossary
  data/                 content only (catalog + feature data files, incl. WP4 extractions)
  lib/                  ALL logic: existing lib files + catalogResolve.js + decisionRecommendationApply.js(+.test.js)
```

Mechanical steps (import-change list verified against actual import statements at review time):

- [ ] `git mv` the components into the folders above. Sibling `./X` imports within a folder are unchanged. Data/lib imports in moved components change `../data/…`→`../../data/…` and `../lib/…`→`../../lib/…` — affected lines: CapabilityArchitectureView 17-19, 22-26; InteractiveBuilder 3-10; CustomerConfig 3; CapabilityConfigurationModal 3; FlowVisualization 3-10; DeepDiveModal 3; DecisionFlowchart 20-22; UseCaseView 3; ProductExplorer 3; DeploymentImpactView 8; DeploymentComparisonSelector 2; ResourceTreeView 3. DecisionTree, YAMLDiffView, CapabilityDeltaTable, the five use-cases siblings, AcronymGlossary: no import changes.
- [ ] `App.jsx` imports (lines 3-8) update to the new folder paths.
- [ ] `git mv src/data/catalogResolve.js src/lib/` — inside it, `./products`→`../data/products`; importers: `UseCaseView.jsx` (covered), `src/lib/libPureFunctions.test.js:10` → `./catalogResolve`.
- [ ] `git mv src/data/decisionRecommendationApply.js src/data/decisionRecommendationApply.test.js src/lib/` — inside: `../lib/platformAiConstraints`→`./platformAiConstraints`; test: `./capabilities`→`../data/capabilities`; importers: `DecisionFlowchart.jsx` (covered), `libPureFunctions.test.js:9` → `./decisionRecommendationApply`. (WP0's `catalogIntegrity.test.js` moves to `src/lib/` too if it imports moved modules.)
- [ ] No config changes needed: vitest glob `src/**/*.test.{js,jsx}` still matches; no path aliases exist; eslint globs unaffected.
- [ ] Update the layout map in `CLAUDE.md` and the project-structure tree in `README.md` to the new paths.

Verify: `npm run check` green; every tab loads in the browser; `git log --follow` on one moved file shows history preserved.

---

---

### WS-IA-2 — IA restructure 6→4 tabs ✅ COMPLETE (2026-07-17)

Tab bar reduced from 6 to 4 (Architecture · Decision Guides · Products · Deployment Impact).
- Products absorbs Product Comparison + MCP Ecosystem (ProductsHub, opens on Compare)
- Architecture gains Blueprints mode (RAGArchitecture + TrainingDeepDive, read-only)
- Decision Guides gains Reference Guides group (FineTuningDecisionMatrix + SecurityOverview)
- Browse-by-use-case index (9 use-case names, deep-link to new homes) in Products landing
- style-ledger.json: use-cases/product-comparison tabs removed; ProductsHub.jsx added to migrated
- style-audit.mjs: Products tab opens Compare sub-view for ledger geometry + draft banner checks
- use-cases height-budget/card-text-budget/control-scale exemptions dissolved (sub-view architecture fixed the root cause)

---

### U0 — Closed-world component audit ✅ COMPLETE (2026-07-17)

Branch: `ws/style-unification`. Two commits.

**Commit 1 — component contract:**
- Appended `## Component contract` section to `docs/DESIGN-LAW.md` defining nine archetypes (`card`, `chip`, `chip-row`, `section-header`, `label-row`, `prose-list`, `table`, `control`, `overlay`) and the closed-world rule.
- Swept all 27 migrated component files to add `data-ui` attributes to qualifying surfaces. `data-ui-exempt` used only for `LedgerRow` (structural grid inside `data-ui="table"` parent).

**Commit 2 — recursive walker:**
- Added `archetypeWalkerProbe()` and `archetypeInvariantsProbe()` to `scripts/style-audit.mjs` — recursive DOM traversal classifying elements by `data-ui`, reporting `visited N / classified M / exempted K / unclassified 0` per tab.
- Closed-world check: any bordered/surfaced/interactive element without `data-ui` (and no classified/exempt ancestor) fails with selector named.
- Per-archetype uniformity invariant: `card[text-align]` (right-align mixed with left/center fails), `section-header[font-size]` (>2px spread fails), `chip-row orphan` (single-chip wrap line fails), `control no-focus-ring`.
- Self-test: `--self-test` flag plants a bad element (caught by walker), removes it (unclassified drops to 0), plants a right-aligned card (uniformity invariant caught). All three phases pass.

**First-run failure harvest (what old heuristics missed):**
- 2 unclassified `rounded-card bg-surface` divs in `use-cases` (`UseCaseView.jsx:327`, `TrainingDeepDive.jsx:193`)
- 3 unclassified `<input>`/`<select>` controls in `products` tab
- 5 unclassified controls/toolbar buttons in `product-comparison`
- `SharedSpineLedger` `LedgerRow` bg-tint rows (14 — exempted as interior of table; `GroupHeader` and `StickyHeader` → `section-header`)

**Gate result:** `PASS`. Coverage per tab: architecture 203/40/0/0, product-comparison 560/9/14/0, deployment-impact 23/2/0/0, decisions 103/10/0/0, products 230/21/0/0, use-cases 1631/56/0/0.

---

### Review-fixes notes — deferred items (2026-07-17)

- [x] **Nested `<button>` inside `<button data-ui="card">` in InteractiveBuilder option cards** (`src/components/InteractiveBuilder.jsx`, `CapabilitySelector` component, "Learn more" guide toggle). Fixed (ws/nested-button 2026-07-17): outer option card changed from `<button data-ui="card">` to `<div role="button" tabIndex={0} aria-pressed aria-disabled onKeyDown Enter/Space>` with the guide toggle `<button>` extracted as an absolutely-positioned sibling. `validateDOMNesting` warning eliminated from vitest output; all 71 tests green.

- [x] **`DecisionTree` "View recommendation" link uses `text-green-600`** — already fixed: `View recommendation` uses `text-link` (`DecisionTree.jsx`). Remaining `text-green-600` on the completed-step `CheckCircle` is correct (green = complete status).

- [x] **`ComponentVersionsPanel` links missing `rel='noopener noreferrer'`** — panel absorbed into `SharedSpineLedger`; source links already use `rel="noopener"` / `rel="noopener noreferrer"`.

---

### ws/review2-notes — second-review fixes (2026-07-17)

- [x] **Token consolidation: `supportMark` shared map** (`src/lib/styleTokens.js`). Added `supportMark` export (symbols ✓ ~ ✕ ?) whose class strings reuse `productStatus['GA']` and `status.attention.text` — single source of truth per WP5 no-re-implement rule. `ProductComparisonView.jsx` updated to import and use it (local `SUPPORT_MARK` constant removed). Also fixed `ProductComparisonHero.jsx` docstring: 'labels are PRODUCT NAMES ONLY' → accurate: zone labels are product names; cells carry canonical component/capability names.

- [x] **CodeFlare staleness sweep** (`src/data/products.js`, `subComponents.js`, `deploymentComparisons.js`, `solutionDetails.js`). Applied same replacement pattern WP1 used in `trainingDeepDive.js:15`. Removed/replaced all CodeFlare mentions with Kubeflow Trainer v2 / Ray (distributed compute) framing consistent with `capabilities.js:87`. No new claims — wording reused from repo.

- [x] **WP3 verification** (`docs/BACKLOG.md`). Verified all 15 WP3 items against current code: (a) MCP Tech Preview banner — already fixed; (b) `QuickComparisonTable` `decisionFactors` guard — already fixed; (c) `YAMLDiffView` nested button + dark-mode black slab — already fixed. All checkboxes marked `[x]` to match the `✅ COMPLETE` header.

---

### Parked (do not do without a user decision)

- "Ownership" tab in Deployment Impact rendering `operationalShifts`/`appTeamOwns`/`platformTeamOwns` (hundreds of lines of corrected data currently invisible) — feature addition, needs design.
- Using `customerEnv` in UseCaseView to pre-highlight relevant use cases (the prop being removed in WP2) — feature idea.
- Rendering `RAGArchitecture` only when the RAG use case is selected (UseCaseView currently always renders five heavy sections) — perf/UX call.

### Deprecated / removed (do not reintroduce without an explicit product decision)

- **llm-d vs Dynamo Quick Comparison** (2026-07-20): deleted `QuickComparisonTable.jsx` and stripped `comparisonType: 'alternative'` wiring from Deployment Impact. Competitor head-to-head content must not ship. Migration-path comparisons (vLLM→KServe, OpenShift→RHOAI) remain.
