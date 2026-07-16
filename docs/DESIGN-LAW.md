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

## Anti-box law (unchanged, now app-wide)

- One surface per section; zero nested bordered boxes.
- Identical cell dimensions within any component (±1px at 1440px viewport).
- Maximum 2 border-radius values page-wide.
- Grid-aligned; even distribution; no horizontal scroll.
- Single-page-friendly at 1440px: a view's primary beats visible with minimal scroll.
- Lead with the audience's question, not the data's structure: orient → decide → prove.

## Plain language (restated from CLAUDE.md — it is part of the visual contract)

No bare acronyms in customer-visible strings (expand on first use per component); no emojis;
no hedge-free absolutes.

## Enforcement

`scripts/gate.py` enforces this law two ways:

1. **Static scan** — banned class patterns above, checked per-file against the migrated
   ledger; the count of unmigrated files must never increase.
2. **Measured checks** (Playwright, `scripts/style-audit.mjs`) — nested-border count,
   radius budget, cell geometry, horizontal scroll, both themes — run for every migrated tab.

A view joins the ledger in the same commit that restyles it. The gate goes red if a ledger
file regresses.
