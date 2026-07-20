# Design Law — Red Hat AI Platform Explorer

> The single visual contract for EVERY tab of this app. Components are restyled to this law
> atomically — a view either fully complies (and its files join the migrated ledger in
> `scripts/gate.py`) or it keeps its legacy look until its turn. No half-styled views.
> The law is enforced mechanically by `python3 scripts/gate.py`; this document is the
> human-readable source the gate encodes.

## Foundation

- **Tokens:** PatternFly v6.6.0 design tokens, vendored and pinned at
  `src/styles/patternfly-tokens.css`. Type scale, spacing scale, and neutral surfaces come
  from tokens — never ad-hoc values.
- **One shared token module** for color/status/provider class maps (`src/lib/styleTokens.js`).
  No component re-implements a color map. Tailwind class strings are complete literals,
  never template-built.

## Type scale roles (added ws/typescale-foundation)

All type hierarchy lives in `typeScale` in `src/lib/styleTokens.js`.
Components use semantic role tokens; raw `text-xs/sm/base/lg/xl` literals
in component JSX are counted by the `rawTextSizeMax` ratchet in `scripts/gate.py`
(ceiling: never increases; decrements as components migrate).

| Role | Size | Weight | Leading | Use |
|---|---|---|---|---|
| `pageTitle` | `text-2xl` | bold | tight | Tab / page H1 |
| `sectionTitle` | `text-xl` | semibold | tight | Major section heading |
| `primaryHeading` | `text-xl` | bold | tight | Decision-guide question / recommendation |
| `cardTitle` | `text-base` | semibold | snug | Card or panel heading |
| `componentName` | `text-sm` | bold | tight | Product/capability name (the point of every unit box) |
| `body` | `text-sm` | normal | snug | Primary readable body text |
| `bodyStrong` | `text-sm` | medium | snug | Emphasized inline body text |
| `label` | `text-xs` | medium | normal | Form label / field label |
| `groupLabel` | `text-xs` | semibold | wide (uppercase + tracking) | Section/group label |
| `caption` | `text-xs` | normal | snug | Supporting description under a name |
| `meta` | `text-[11px]` | normal | snug | Faint tertiary metadata |

Legacy aliases still exported (do not remove): `secondary` → `caption`, `recommendationHeading` → `primaryHeading`.

## Accent law (revised 2026-07-16 — Alexa: "we can't just be black, gray, red, and white")

Color is welcome; *meaningless* color is not. Every hue on the page must answer "what does
this color tell the reader?"

- **Red = brand and action.** Identity (logo, active tab), primary action, verification
  marks, source links, the draft banner. In categorical contexts red additionally marks
  **Red Hat provenance**.
- **Blue = interactive/informational.** Links-as-affordance, selection outlines, informational
  callouts.
- **Categorical marks:** where component type or provenance carries meaning, use a small
  fixed palette — red (Red Hat), blue (open source), teal (partner/hardware), neutral outline
  (customer/your organization) — applied as **outlines, dots, or left hairlines on a neutral
  surface, never as surface fills**. If color encodes a category, a **colored legend is
  mandatory** and its chips must show the actual mark colors.
- **Status colors are status-only:** green = success/complete, amber = warning/attention.
  Never decoration, never section identity.
- **Banned outright:** gradients (`bg-gradient-*`), purple/pink/indigo/violet/fuchsia classes,
  multi-hue *surface* theming, decorative shadows, emoji in customer-visible strings.

## Lightness

The page should feel light and modern without abandoning the token palette:

- **Light theme:** near-white layered neutrals (page slightly darker than surface), hairline
  separators (`border-hair`) instead of full borders, generous whitespace. Surfaces separate
  by tone and spacing, not by boxes.
- **Dark theme:** true dark neutrals, same structure. Both themes are first-class. Theming is
  class-based (`html.dark`) with a header toggle: default follows the operating system, an
  explicit user choice wins and persists (localStorage `theme`). Verify both themes via the
  toggle or emulation.
- **Typography over containers:** hierarchy comes from the type scale and whitespace.
  Headings orient, labels group, containers are a last resort.

## Interactivity (motion law)

"Interactive" comes from motion and response, not new hues:

- Every interactive element has a visible hover state (background tint shift, underline, or
  accent reveal) and a `focus-visible` ring for keyboard users.
- Transitions: 150–200ms, ease-out, on hover/focus/expand/selection. Nothing over 300ms.
- Micro-elevation on hover is allowed (≤2px translate or one subtle token shadow) for
  genuinely clickable cards only.
- Disclosure (expand/collapse) animates; content never pops.
- Respect `prefers-reduced-motion`: all non-essential motion collapses to instant.

## Density & composition law (added 2026-07-16, from Alexa's solution-map direction)

The reference standard is the AI Architect solution-map style: compact, aligned, text-forward.

1. **Text-forward sizing.** The component NAME is the point of every box and gets the size;
   chrome (padding, borders, badges, group labels) shrinks around it. Secondary text is one
   step down but readable. Group labels (e.g. a section's "Serving") sit a step ABOVE
   body-secondary — visible, not shouting.
2. **The content-hugging exception.** Inner boxes inside a panel size to their text — this is
   the ONE sanctioned size variance. Everything else obeys the grid.
3. **Grid discipline.** Sibling boxes equal width; rows middle-aligned vertically (never
   top-aligned against a taller sibling); even distribution across the row.
4. **Duplicates compress.** N identical structures render side-by-side (or counted), never as
   tall stacked repetition. Compression must lose zero information.
5. **Empty space collapses.** Whitespace separates, it does not pad for its own sake. Target:
   a tab's primary view reads on roughly one screen at 1440x900.
6. **Clean, clear, consistent, concise** — when two treatments both satisfy the law, pick the
   one with less chrome and fewer pixels.

## Takeaways law (added 2026-07-16 — "people want takeaways; they will not read a blob")

Every piece of UI content is scanned before it is read. Choose the highest form the
information allows — best first:

1. **Visual** — marks, table, diagram. If the information has structure, show the structure.
2. **Short bullets with bold lead terms** — each bullet opens with a **bold takeaway term**
   (a few words), then one short clause. One idea per bullet. A bullet that wraps twice is
   a paragraph wearing a disguise.
3. **One short sentence.**
4. **Banned: the undifferentiated prose blob** — multi-clause paragraphs with no bolding and
   no structure. If a paragraph is unavoidable, its first words are the takeaway.

- A summary or subtitle never repeats verbatim as body text — say it once.
- Copy passes apply the Strunk rules (active voice, positive form, concrete language, omit
  needless words) UNDER the content law: extraction from verified sources, never authorship.

## Anti-box law (unchanged, now app-wide)

- One surface per section; zero nested bordered boxes.
- **No one-sided side-panel highlight (added 2026-07-19, Alexa).** A box is never
  highlighted with a one-sided (left/right) accent border — no `border-l-*`/`border-r-*`
  with a width (`-2/-4/-8`) or a color/token. Highlight a box with a thin FULL outline
  around all four sides, or with nothing. (Tab underlines `border-b-2` and drawn
  connector/line elements `border-t-2` are lines, not box highlights, and are allowed.)
  Enforced hard, app-wide, by `gate.py` section `one-sided side-accent`.
  - **The one permitted exception (Alexa, 2026-07-19):** the short vertical accent tick
    that sits immediately left of a *section heading* — Build Your Stack layer titles
    (`CapabilityArchitectureView.jsx`, `w-0.5 h-5 bg-accent`) and the Interactive Builder
    layer headings (`InteractiveBuilder.jsx`, `w-1 h-6`). That is a heading marker, not a
    box highlight. It is the ONLY place a left bar is acceptable — do not add left bars
    anywhere else, and do not remove these.
- **One canvas per view:** every tab renders on a single uninterrupted background plane.
  A tab's root element is `bg-page`; its content panels sit on `bg-surface`. There is no
  second page-level background plane inside a tab — only surface-on-page layering.
- Identical cell dimensions within any component (±1px at 1440px viewport).
- Maximum 2 border-radius values page-wide.
- Grid-aligned; even distribution; no horizontal scroll.
- Single-page-friendly at 1440px: a view's primary beats visible with minimal scroll.
- Lead with the audience's question, not the data's structure: orient → decide → prove.

## Plain language (restated from CLAUDE.md — it is part of the visual contract)

No bare acronyms in customer-visible strings (expand on first use per component); no emojis;
no hedge-free absolutes.

## Ordering & redundancy law (added 2026-07-17)
- Red Hat options list first in any option enumeration; order is information.
- Provider identity is conveyed by the categorical mark, never by repeating text a name
  already contains. Say it once; the mark is the badge.
- A subtitle must add information beyond its title or not exist.

## Spacing law (added 2026-07-17 — PatternFly spacers + proximity ratios)
- Only five spacers exist: 4/8/12/16/24px. Every padding, gap, and margin is one of them.
- Proximity ratios: within an element (title->subtitle) <=4px; inside a card 8px; between
  sibling cards 8-12px; between groups 16px; between sections 24px. Space INSIDE is always
  less than space BETWEEN — that is what makes content group.
- Cards hug content: height = text + 8px vertical padding; no min-heights, no centering
  into slack.
- One level of surface padding: a band pads its cards OR cards pad themselves — never both.
- Balanced rows (global): N equal siblings render in rows differing by at most one, never
  an orphan row. Unit boxes have width bounds (~200-360px at 1440); column count follows
  content width.
- Row text alignment: titles, badges, and controls in one row share a vertical center.

**Exceptions clause (2px and 6px, F12):** 2px is allowed for micro-padding on badge/chip
  rings (`py-0.5`, `px-0.5`) and focus rings. 6px is allowed for icon-button touch targets
  (`p-1.5`), table cell rows (`py-1.5`), and icon-to-label gap alignment (`gap-1.5`). These
  are the only values outside the five-spacer set. Any additional exception requires a
  comment and a DESIGN-LAW update.

## Component contract (added 2026-07-17 — closed-world auditing)

Every rendered surface declares its archetype via `data-ui`:
`card | chip | chip-row | section-header | label-row | prose-list | table | control | overlay`.
The audit fails any bordered, surfaced, or interactive element without an archetype. Exemptions
exist only as per-instance `data-ui-exempt="reason"` annotations — visible in the markup,
counted in the gate output. All instances of one archetype on a page must share computed
alignment, type size, and padding (the uniformity invariant).

## Enforcement

`scripts/gate.py` enforces this law two ways:

1. **Static scan** — banned class patterns above, checked per-file against the migrated
   ledger; the count of unmigrated files must never increase.
2. **Measured checks** (Playwright, `scripts/style-audit.mjs`) — nested-border count,
   radius budget, cell geometry, horizontal scroll, both themes — run for every migrated tab.

A view joins the ledger in the same commit that restyles it. The gate goes red if a ledger
file regresses.
