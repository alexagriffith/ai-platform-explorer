# CLAUDE.md — Red Hat AI Platform Explorer

> Auto-loaded every session. This is the operating contract for this repo. Re-read before each task. If a rule needs to change, change THIS FILE — never silently work around it.

## What this is

A **public GitHub Pages workshop tool** (React 19 + Vite + Tailwind v3, static site) that Red Hat field engineers use **live in front of customers** to explore Red Hat AI platform architectures. Six tabs, wired in `src/App.jsx`:

| Tab id | Name | Entry component |
|---|---|---|
| `architecture` | Architecture | `ArchitectureHub` (hosts `CapabilityArchitectureView`, `InteractiveBuilder`, `CustomerConfig`) |
| `decisions` | Decision Guides | `DecisionFlowchart` (hosts `DecisionTree`) |
| `use-cases` | Use Cases | `UseCaseView` (hosts `FineTuningDecisionMatrix`, `TrainingDeepDive`, `RAGArchitecture`, `MCPEcosystemFull`, `SecurityOverview`) |
| `products` | Products | `ProductExplorer` |
| `deployment-impact` | Deployment Impact | `DeploymentImpactView` (hosts `DeploymentComparisonSelector`, `YAMLDiffView`, `ResourceTreeView`, `CapabilityDeltaTable`, `QuickComparisonTable`) |
| `product-comparison` | Product Comparison | `ProductComparisonView` (dual-view: bill of materials + capability comparison; draft data) |

**State model:** no router, no store. `App.jsx` owns `customerEnv` and `selectedCapabilities` — the canonical blueprint map `capabilityId → optionId` that Build Your Stack, the Decision Guides, and the Interactive Builder all read and write. `InteractiveBuilder` syncs its local wizard state up to this map continuously (regression-tested in `InteractiveBuilder.test.jsx`). Pure transforms live in `src/lib/capabilityBlueprint.js`; the OpenShift/Kubernetes/RHEL pairing rules live in `src/lib/platformAiConstraints.js`.

## Locked decisions (do NOT re-open)

- **No router, no state library, no CSS-in-JS.** Vanilla React state + Tailwind classes.
- **No cloud CI.** Quality gates are local hooks + the lint/test steps already in `.github/workflows/deploy.yml` (which deploys `main` straight to the public site).
- **`dist/` and `planning/` are never committed** (gitignored).
- **Content claims trace to the sources in `knowledge-registry.md`.** No new hard numbers without a source.
- **Status vocabulary is exactly:** `'GA' | 'Tech Preview' | 'Dev Preview' | 'Check with Red Hat'` (enforced by `src/data/catalogIntegrity.test.js`). The `provider` field is **open** — it carries vendor/source names (`Red Hat`, `Customer`, `NVIDIA`, `AMD`, `Intel`, `Google`, `AWS`, `Open Source`, …); only the color-badge grouping collapses it to Red Hat / Customer / third-party.
- **Do not rename capability/option/product ids** (`rhai`, `rhaie`, `rhoai`, `ai-inference`, …) — code, tests, and cross-file references depend on them. Fix display strings only.

## Public-repo rules (the sharp edge)

This repo — including every string in `src/` — is on public GitHub AND rendered on a public site. Never commit:

- Internal Red Hat employee names, subject-matter-expert credits, or internal Slack channel names (forum/team/working-group channels). The pre-commit hook blocks these (`scripts/pre-commit.sh` + gitignored `.leak-denylist`); install per clone: `cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`.
- Customer names, internal implementation details (internal headers, queue names), or links to personal/prototype sites as if they were documentation.
- Unannounced product claims without the standard hedge: "Early-stage capability — availability and scope not confirmed; check with your Red Hat account team."
- Fabricated documentation URLs. Every `documentation:`/`href` link must be verified to resolve (200) before commit.

**Plain language everywhere:** no bare acronyms in any customer-visible string — expand on first use per component ("key-value cache (KV cache)"), then plain. No emojis in customer-facing strings. No hedge-free absolutes ("every", "guaranteed", "prevents hallucinations" — say "reduces").

## Code layout & style rules

- **Content lives in `src/data/`, logic in `src/lib/`, components render.** No static content object over ~50 lines inside a component file (this is how stale claims escaped review — content in components was never swept). Existing violations are catalogued in `docs/BACKLOG.md`.
- **Component definitions at module scope only** — never define a component inside another component's body (causes full-subtree remounts).
- **Guard optional data fields** before `.map`/property access if the field is not present on every record of the source data; encode data-shape invariants as data-integrity tests (pattern: `decisionRecommendationApply.test.js`).
- **Tailwind class strings are complete literals**, never template-built (`bg-${color}-500` breaks JIT). Color/status/provider token maps belong in one shared module, not re-implemented per component.
- **Component file ceiling: 500 lines** for new components (`CapabilityArchitectureView` and `InteractiveBuilder` are grandfathered).
- **Tests are colocated** (`Foo.test.js(x)` next to `Foo`). Component tests that need a DOM start with `// @vitest-environment jsdom` (the vitest default here is `node`).

## Verification loop (every change)

1. `npm run lint` — zero errors.
2. `npm test` — all tests green (48+; never delete a failing test to pass).
3. `npm run build` — must succeed (deploy runs the same gates; a red `main` breaks the public site pipeline).
4. UI changes: browser-verify the affected tab(s); check dark mode for anything touching backgrounds (theming is class-based `html.dark` with a header toggle — system default, explicit choice persisted; flip the toggle or emulate).
5. Update the checklist state in `docs/BACKLOG.md` for anything you completed.

## Pointers (don't duplicate content here)

- `docs/BACKLOG.md` — the working checklist: all known defects with prescriptive, agent-executable fixes. **Read it before starting any task.**
- `docs/ROADMAP.md` — phase plan. `docs/V1_MANUAL_TEST_MATRIX.md` — manual smoke paths.
- `knowledge-registry.md` — source-of-truth URLs that content claims must trace to.
- `README.md` — user-facing docs + the "Application state" contract.

## Product Comparison feature — conventions (added 2026-07-16)

**Data fence.** All comparison facts live ONLY in `src/data/productComparisons.js` — components render data, never hardcode facts in JSX. Every row carries `tier` ('clear'|'inferred'|'unresolved') + `sourceUrl` + `sourceLabel`. Solid rendering requires a working source link (no link → dashed/pending). `illustrative`/`draft` flags are HUMAN-ONLY flips (Alexa) — never change them in code or agent runs.

**Provenance.** Primary sources are downloaded + pinned in `~/work-log/projects/architect-data/knowledge-sources/product-comparison-bom/` (SOURCES.md manifest); the cell-by-cell ledger is `src/data/CURATION-TODO.md`. Where two Red Hat sources disagree (docs vs container catalog), surface the conflict — never silently resolve it. Facts are extracted from sources, never written from memory.

**Gate.** Run `python3 scripts/gate.py` after every commit. Contract: prints exactly `PASS` on success (nothing else); on failure prints only the failing section's relevant logs. Never commit on a red gate. (Wraps: npm run check, validate:links renders-not-resolves, leak scan, data integrity, style law.)

**Publish warning.** Merging `main` auto-deploys to the PUBLIC GitHub Pages site. Never push, never merge — Alexa gates publishing. Customer names and the string "RHAII" are banned in tracked files (use full product names: Red Hat AI Inference Server, Red Hat OpenShift AI).

**Style law.** Now app-wide, not comparison-only: the full visual contract lives in `docs/DESIGN-LAW.md` (PatternFly v6.6.0 tokens at `src/styles/patternfly-tokens.css`, single red accent, lightness, motion law, anti-box law, migrated-tab ledger). Views restyle atomically — full compliance + ledger entry in one commit, or legacy until their turn. Enforced by gate.py static scan + measured checks.

**Hygiene.** Leave the tree clean after every step: no dead code, no orphaned files, no stale comments referencing removed things. Cleanup is part of the step, not a later chore. Project working docs live in `planning/` (gitignored); durable scrubbed docs in `docs/`.
