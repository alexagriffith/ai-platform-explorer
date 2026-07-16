# Design notes — restyle to Red Hat AI (Product Comparison sprint, 2026-07-16)

Alexa's verdict on the pre-restyle UI: *"so cluttered, boxes different sizes, too many
boxes, looks Claude-generated — I want Red Hat AI style; clean, clear, concise,
consistent; easy to look at on a single page."*

This file records the **visual principles** we are applying and where they came from. The
principles are mined (read-only) from the architecture-diagram generator in
`~/github/ai-architect-playbook`, which went through the same clutter→clean journey and
codified the result into a binding formatting contract (`docs/STYLE-RULES.md`) plus a
geometry test (`tests/diagram-formatting.spec.js`). We take its **principles**, but apply
**Red Hat / PatternFly styling** (neutral surfaces + a single Red Hat red accent), not the
playbook's own indigo skin.

Acronyms spelled out at first use: BOM = bill of materials; DOM = Document Object Model;
CSS = Cascading Style Sheets; PatternFly = Red Hat's open-source design system.

---

## The one rule everything else hangs off — the "box budget"

> A border, fill, or card must **earn its place** by marking a real boundary. When a layout
> feels cluttered, **cut a container or turn it into an aligned row — never add another box.**

Source: `ai-architect-playbook/docs/STYLE-RULES.md` §0 north star — *"When rules compete, cut
content and simplify structure before adding another container"* — and §2 "Container and box
budget". This is the direct antidote to "too many boxes, boxes different sizes."

---

## The 12 principles, translated to this comparison UI

Ordered by leverage for this tab. Each: principle → playbook evidence → how we apply it here.

1. **Spend a strict box budget.** A box marks a *real* boundary (interactive choice, selected
   object, real caution). No card-per-fact, no card-per-section, at most one containing border
   level per section.
   *Evidence:* STYLE-RULES §1–2.
   *Applied:* Beats 1–2 (Orient, Decide) carry **zero** boxes — they sit on the page as type and
   aligned columns. Only the ledger (Beat 3) gets **one** surface, because a dense data table
   earns a defining edge. The draft banner is the one other surface (a real caution). Everything
   else that used to be a card (decision cards, "Additional Resources", provenance shell) becomes
   heading + hairline-separated rows.

2. **Rows are the default primitive for repeated facts** — `label / value` as *separate*
   elements, one fact per row, never fused into one string or joined with `·`.
   *Evidence:* STYLE-RULES §3 "Row grammar", §4.
   *Applied:* The ledger already is a row primitive (component name center, presence flanking).
   The decision beat's supporting facts render as short rows, not comma-joined sentences.

3. **Uniform geometry: identical width, height, and padding per peer; equal-height rows.**
   *Evidence:* STYLE-RULES §2; the geometry test asserts equal width/height within each visual
   row to a 3px tolerance.
   *Applied:* Every ledger row is the same height; the two product (presence) columns are exactly
   equal width to each other and identical row-to-row. The two decision columns are equal-height
   via a stretch grid. Enforced deterministically in `scripts/gate.py` (Playwright measures cell
   geometry).

4. **One informational accent; color never carries meaning alone; the layout must read in
   grayscale.**
   *Evidence:* STYLE-RULES §7 (*"one informational accent… color never carries meaning alone"*);
   the playbook removed a per-node "rainbow" in favour of neutral cards + one accent.
   *Applied:* We replace the blue / purple / indigo / amber rainbow with **Red Hat red
   (`#ee0000`, PatternFly `red-50`) as the single accent** on neutral gray surfaces. Presence in
   the ledger is now one red mark for *both* products — the product is told by **column position**
   (left vs right), not by hue, so the "shared core / platform keeps going" shape still reads with
   colour removed. Red is reserved for presence, active state, and links.

5. **Prefer whitespace and hairline dividers over containers.**
   *Evidence:* STYLE-RULES §2; CHANGELOG *"box-free option rows (hairline dividers, tint only on
   the selected row) instead of a box around every option."*
   *Applied:* The ledger drops all vertical cell borders; columns align on the grid, rows are
   separated by a single hairline. The decision beat separates its two columns with one vertical
   hairline instead of two coloured cards.

6. **At most three text roles per surface; adjacent tiers must differ visibly in size/weight.**
   *Evidence:* STYLE-RULES §6; DIAGRAM spec P3-1 (*"never two adjacent tiers at the same size"*).
   *Applied:* Each section uses at most three roles — heading (Red Hat Display scale), body/value
   (Red Hat Text), and a muted supporting label — each a clearly distinct PatternFly type step.

7. **Group by semantic role, structurally — not with a caption.**
   *Evidence:* diagram composer tags every section with a `role`; DIAGRAM spec: *"visible
   HIERARCHY and GROUPING, not a caption."*
   *Applied:* The ledger keeps its three task groups (Serve / Build / Operate) as quiet
   uppercase band labels with a hairline, so grouping is structural, not explained in prose.

8. **De-duplicate ruthlessly — each fact appears once** across heading, subhead, and cell.
   *Evidence:* STYLE-RULES §4; DIAGRAM spec P3-5.
   *Applied:* Two stacked "work-in-progress / draft" warnings were redundant; the global banner
   is quieted to a thin strip so the tab-level draft banner is the single caution that reads.

9. **One dominant object and a fixed reading order per surface** (Purpose → primary object →
   primary action → supporting detail).
   *Evidence:* STYLE-RULES §1, §9.3.
   *Applied:* The question (Beat 1) is the one dominant object; toolbar/provenance/resources are
   visually subordinate (smaller, quieter, below the fold). The PNG-export toolbar does not
   compete with the headline.

10. **Cap peer elements and center a lone item — never let one element balloon to full width.**
    *Evidence:* STYLE-RULES §2, §9.5; the test hard-fails boxes over ~206px.
    *Applied:* Presence marks are fixed-size (a 24px circle), centered in their column; a lone
    mark never stretches. Buttons are content-sized, not full-bleed.

11. **Membership = one thin muted outline, not a stack of bars + dots + fills.**
    *Evidence:* STYLE-RULES §9.5; a reverted mistake that re-added 3px accent bars + corner dots.
    *Applied:* The ledger surface is one thin neutral border; the shared-core band is one subtle
    neutral tint — no accent bar, no shadow stack, no double-decoration.

12. **Encode the geometry rules as a test and ratchet them.**
    *Evidence:* `tests/diagram-formatting.spec.js`; STYLE-RULES §12 (*"new violations: zero
    tolerance"*).
    *Applied:* `scripts/gate.py` runs Playwright style checks: equal ledger cell geometry, zero
    bordered-box-inside-bordered-box in the tab, ≤2 distinct border-radius values, no horizontal
    scroll at 1440px and 375px, draft banner visible in both themes. The gate prints only `PASS`
    or the failing section — clutter cannot creep back silently.

---

## Red Hat styling decisions (the skin we apply, not the playbook's)

- **Tokens:** vendored PatternFly v6.6.0 design tokens (`src/styles/patternfly-tokens.css`),
  mapped to a small semantic layer in `src/index.css`. Colour, spacer, type, and radius scales
  come from PatternFly.
- **Accent:** Red Hat red `#ee0000` (`red-50`) — the *single* accent. Hover/pressed uses
  `red-60 #a60000`; the draft surface uses `red-05 #fef0f0` (light) / `red-80 #3f0000` (dark).
- **Surfaces:** neutral grays — page `gray-10 #f2f2f2`, surface white, text `gray-95 #151515`,
  muted `gray-60 #4d4d4d`, hairline `gray-20 #e0e0e0`, border `gray-30 #c7c7c7`. Dark theme
  swaps the same roles down the gray ramp via `prefers-color-scheme`.
- **Type:** Red Hat Text / Red Hat Display font stacks (falling back to system fonts if the Red
  Hat fonts are not installed — we do **not** vendor font files, to keep the bundle small).
- **Radius:** exactly two non-zero values in the tab — 6px (`radius-200`) for surfaces/controls,
  full-circle (`radius-500`) for presence marks.
- **Density:** single-page-friendly at 1440px — beats 1–3 read with minimal scrolling; the
  detailed provenance stays collapsed.

## Explicitly NOT changed
- No edits to `src/data/productComparisons.js` facts or the illustrative/draft flags.
- The ledger's data model, grouping, and "containment as shape" logic (`src/lib/ledgerModel.js`)
  are untouched — this is a rendering/skin change only.
