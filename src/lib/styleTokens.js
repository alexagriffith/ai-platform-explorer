/**
 * Shared DESIGN-LAW class-string maps (docs/DESIGN-LAW.md).
 * Complete Tailwind literals only — no logic, no template-built classes.
 * Extend in later restyle steps; do not re-implement maps inside components.
 */

export const border = {
  hair: 'border-hair',
  edge: 'border-edge',
  divideHair: 'divide-hair',
};

export const surface = {
  raised: 'bg-surface',
  tint: 'bg-tint',
};

export const text = {
  ink: 'text-ink',
  muted: 'text-muted',
  faint: 'text-faint',
  link: 'text-link',
  onAccent: 'text-on-accent',
};

/** Hover / focus / motion vocabulary shared by interactive controls. */
export const interactive = {
  hoverTint: 'hover:bg-tint',
  focusRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page',
  transition:
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
  transitionAll:
    'transition-all duration-150 ease-out motion-reduce:transition-none',
  microElevate:
    'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
};

export const button = {
  primary:
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-accent text-on-accent text-sm font-medium hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none disabled:opacity-50 disabled:pointer-events-none',
  /** Compact primary: same red fill, same inline weight — matches toggle.base height so controls share one scale. */
  primaryCompact:
    'inline-flex items-center gap-1 px-2 py-0.5 rounded-card bg-accent text-on-accent text-xs font-medium hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none disabled:opacity-50 disabled:pointer-events-none',
  secondary:
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card border border-edge text-ink text-sm font-medium hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none',
  /** Compact secondary: same outline, matches toggle.base height. */
  secondaryCompact:
    'inline-flex items-center gap-1 px-2 py-0.5 rounded-card border border-edge text-ink text-xs font-medium hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none',
};

export const field = {
  input:
    'w-full rounded-card border border-edge bg-page px-4 py-2 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none',
};

/** Segmented control / detail-level chips. */
export const toggle = {
  /** Shared sizing/shape — apply to every chip in the segmented control. */
  base: 'px-2 py-0.5 rounded-card text-xs font-medium',
  active: 'bg-accent text-on-accent',
  inactive: 'bg-tint text-muted hover:text-ink',
};

/**
 * Status / provider maps formerly inlined in CapabilityArchitectureView.
 * Green = configured/complete only; red accent = primary/selected UI; neutrals elsewhere.
 */
export const status = {
  completeBanner: 'bg-green-600 text-white',
  completeCard: 'rounded-card border border-edge bg-surface',
  requiredBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  /** Amber = warning/attention (DESIGN-LAW: status-only, never decorative). */
  attention: {
    text: 'text-amber-700 dark:text-amber-400',
    textStrong: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    badgeBordered: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    block: 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800',
  },
};

/**
 * Product maturity status text-color map (GA | Tech Preview | Dev Preview | Check with Red Hat).
 * Formerly inlined in ProductExplorer. Status vocabulary is enforced by catalogIntegrity.test.js.
 */
export const productStatus = {
  'GA':                 'text-green-700 dark:text-green-400',
  'Tech Preview':       status.attention.text,
  'Dev Preview':        'text-muted',
  'Check with Red Hat': 'text-faint',
};

export const providerMark = {
  redHat: 'bg-green-600',
  customer: 'bg-tint border border-edge',
  partner: 'border border-hair bg-page',
};

export const card = {
  unselected:
    'rounded-card border border-dashed border-edge bg-surface text-left hover:border-accent hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-all duration-150 ease-out motion-reduce:transition-none',
  selected:
    'rounded-card border border-edge bg-surface transition-all duration-150 ease-out motion-reduce:transition-none',
  selectedClickable:
    'cursor-pointer hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
};

export const badge = {
  neutral: 'rounded-card border border-hair bg-page px-2 py-0.5 text-xs text-muted',
  customer: 'rounded-card px-2 py-0.5 text-xs bg-tint border border-edge text-ink',
  positive: 'rounded-card px-2 py-0.5 text-xs bg-green-600 text-white',
  /**
   * 'Recommended' badge — amber attention hue (DESIGN-LAW: red = brand/action only;
   * Recommended is an attention marker, not a brand or action element).
   */
  recommended: 'rounded-card px-2 py-0.5 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-medium',
};

export const modal = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4',
  /** Lighter scrim for side-panel drawers (not full-modal dimming). */
  overlayScrim: 'fixed inset-0 bg-black/20 dark:bg-black/40',
  panel: 'w-full max-h-[90vh] overflow-y-auto rounded-panel border border-edge bg-surface',
  panelWide: 'max-w-4xl',
  panelMedium: 'max-w-2xl',
  /** Narrow: hugs text at ~65ch (option-picker, configure modals). */
  panelNarrow: 'max-w-[65ch]',
  header: 'sticky top-0 z-10 border-b border-hair bg-surface px-4 py-4',
  body: 'space-y-4 p-4',
  section: 'space-y-3 border-t border-hair pt-5 first:border-t-0 first:pt-0',
};

/**
 * Density law (docs/DESIGN-LAW.md §"Density & composition law").
 * Compact panel/section chrome — paddings shrink, content dominates.
 */
export const density = {
  /** Outer panel chrome (replace p-4/p-6 on section containers). */
  panelPad: 'px-3 py-2',
  /** Inner section chrome within a panel. */
  sectionPad: 'px-2 py-1.5',
  /** Header/label row within a panel. */
  headerPad: 'px-3 py-2',
  /** Content area within a card box. */
  cardPad: 'px-2 py-1',
  /** Gap between sibling boxes in a row. */
  rowGap: 'gap-2',
  /** Gap between stacked sections. */
  stackGap: 'space-y-2',
};

/**
 * Type scale — semantic role tokens (docs/DESIGN-LAW.md §"Type scale roles").
 *
 * Hierarchy (size + weight):
 *   pageTitle > sectionTitle > cardTitle > primaryHeading
 *   > componentName > body > bodyStrong > label > caption > meta
 *
 * Every token is a COMPLETE Tailwind literal (size + weight + leading).
 * Components must import from here; raw text-size classes in component
 * JSX are counted by the rawTextSizeMax ratchet in scripts/gate.py.
 *
 * Role→size table (canonical reference, matches docs/DESIGN-LAW.md):
 *   pageTitle          text-2xl  bold     tight   — tab / page-level H1
 *   sectionTitle       text-xl   semibold tight   — major section heading
 *   cardTitle          text-base semibold snug    — card or panel heading
 *   primaryHeading     text-xl   bold     tight   — decision-guide question / recommendation
 *   componentName      text-sm   bold     tight   — product/capability name (the point of every box)
 *   body               text-sm   normal   snug    — readable surface body text
 *   bodyStrong         text-sm   medium   snug    — emphasized body (inline strong)
 *   label              text-xs   medium   normal  — form label / field label
 *   groupLabel         text-xs   semibold wide    — section/group heading (uppercase tracking)
 *   caption            text-xs   normal   snug    — supporting description under a card name
 *   meta               text-[11px] normal snug    — faint tertiary metadata
 *
 * Legacy aliases (kept so existing callers compile; alias to the canonical role):
 *   secondary          → caption
 *   recommendationHeading → primaryHeading
 */
// Shared literals for roles that intentionally share one type treatment. Declaring the string ONCE
// here (rather than repeating it per role) is the "decide once" guarantee: change the tier in one
// place and every role on it moves together. Literals stay complete strings (Tailwind JIT-safe).
// Any accidental duplicate NOT routed through one of these is caught by styleTokens.test.js.
const _title2xlBold = 'text-2xl font-bold leading-tight'; // pageTitle · monoTitle
const _titleXlBold = 'text-xl font-bold leading-tight';   // primaryHeading · recommendationHeading
const _smBoldTight = 'text-sm font-bold leading-tight';   // componentName · subPanelTitle
const _xsSnug = 'text-xs leading-snug';                    // caption · tableCell · secondary

export const typeScale = {
  // ── Page / section headings ─────────────────────────────────────────────────
  /** Tab or page-level H1 — largest structural heading. */
  pageTitle: _title2xlBold,
  /** Major section heading within a tab — anchors a content region. */
  sectionTitle: 'text-xl font-semibold leading-tight',
  /** Card or panel heading — names a discrete content unit. */
  cardTitle: 'text-base font-semibold leading-snug',

  // ── Primary outcome surface ──────────────────────────────────────────────────
  /**
   * Decision-guide question/recommendation — primary outcome heading.
   * One step above componentName; used for the recommendation card product-name heading.
   */
  primaryHeading: _titleXlBold,

  // ── Component / product identity ────────────────────────────────────────────
  /** Component / product name — the point of every unit box. */
  componentName: _smBoldTight,

  // ── Body ────────────────────────────────────────────────────────────────────
  /** Primary readable body text — used on recommendation bodies and detail paragraphs. */
  body: 'text-sm leading-snug',
  /** Emphasized body text — inline strong without size change. */
  bodyStrong: 'text-sm font-medium leading-snug',

  // ── Labels / meta ────────────────────────────────────────────────────────────
  /** Form label or short field label. */
  label: 'text-xs font-medium leading-normal',
  /** Group / section label — visible, not shouting; uppercase tracking. */
  groupLabel: 'text-xs font-semibold uppercase tracking-wide',
  /** Supporting description / caption under a card or chip name. */
  caption: _xsSnug,
  /** Faint tertiary metadata — timestamps, counts, footnotes. */
  meta: 'text-[11px] leading-snug',

  // ── Panel / sub-panel headings ───────────────────────────────────────────────
  /**
   * Panel or section heading — base size, bold (stronger than cardTitle's semibold).
   * Used for deployment-tab section headers, comparison panel titles.
   */
  panelTitle: 'text-base font-bold leading-tight',
  /**
   * Sub-panel heading — sm size, bold.
   * Used for migration notes, docs-link section headers within a card.
   */
  subPanelTitle: _smBoldTight,
  /**
   * Sub-panel heading — sm size, semibold.
   * Used for YAML column headers, resource tree column headers.
   */
  subSectionTitle: 'text-sm font-semibold leading-tight',
  /**
   * Detail panel section title — lg size, semibold.
   * Used for side-panel / drawer section headers (What it does, Key Fields).
   */
  detailSectionTitle: 'text-lg font-semibold leading-tight',
  /**
   * Hero / orient question — 3xl–4xl, extrabold, responsive.
   * Used for the ProductComparisonView BEAT 1 orient question.
   */
  heroTitle: 'text-3xl font-extrabold tracking-tight leading-tight',
  /**
   * Hero subtitle — base size, leading-relaxed.
   * Used for the ProductComparisonView orient framing sentence.
   */
  heroSubtitle: 'text-base leading-relaxed',
  /**
   * Product / decision name in the DECIDE beat — lg, semibold, snug.
   * Distinct from cardTitle (base) and sectionTitle (xl).
   */
  decideName: 'text-lg font-semibold leading-snug',
  /**
   * Monospace display heading — 2xl, bold. Used for resource-kind panel H1.
   */
  monoTitle: _title2xlBold,
  /**
   * Monospace body line — sm, mono. Used for resource kind clickable labels, YAML kind labels.
   */
  monoBody: 'text-sm font-mono font-semibold leading-snug',
  /**
   * Monospace code / pre block — xs, mono, relaxed. Used for YAML <pre> blocks.
   */
  monoCode: 'text-xs font-mono leading-relaxed',
  /**
   * Micro label — 10px/[10px], semibold, uppercase, tracking-wider.
   * Used for the StickyHeader "Component" label, DecisionCard tag, pending-verification labels.
   */
  microLabel: 'text-[10px] font-semibold uppercase tracking-wider',
  /**
   * Micro faint — 10px/[10px], normal weight.
   * Used for descriptor lines in StickyHeader, tagline in ZoneLabel.
   */
  microFaint: 'text-[10px] leading-snug',
  /**
   * Table cell content — xs, normal. Used for data cells in comparison tables.
   */
  tableCell: _xsSnug,
  /**
   * Table cell content, emphasized — xs, medium. Used for after-state cells in delta table.
   */
  tableCellStrong: 'text-xs font-medium leading-snug',
  /**
   * Table column header — xs, semibold, uppercase, tracking-wide.
   * Used for thead <th> labels in comparison tables.
   */
  tableHeader: 'text-xs font-semibold uppercase tracking-wider',
  /**
   * Inline nav tab — sm, medium. Used for tab strip buttons.
   */
  navTab: 'text-sm font-medium leading-normal',
  /**
   * Support mark / presence symbol display — lg, leading-none.
   * Used for ✓/✕/~ Unicode symbols in BOM ledger and capability tables.
   */
  symbolDisplay: 'text-lg leading-none',
  /**
   * Column label bold — xs, bold, tight. Used for ledger product column name labels.
   * Distinct from label (medium) and groupLabel (semibold + tracking).
   */
  columnLabelBold: 'text-xs font-bold leading-snug',
  /**
   * Column label bold, responsive — xs→sm at sm breakpoint. Used in StickyHeader product labels.
   */
  columnLabelBoldSm: 'text-xs font-bold leading-snug sm:text-sm',
  /**
   * Micro faint, responsive — [10px]→xs at sm breakpoint. Used in StickyHeader descriptor + ZoneLabel tagline.
   */
  microFaintSm: 'text-[10px] leading-snug sm:text-xs',
  /**
   * Micro label, responsive — [10px]→xs at sm breakpoint. Used for StickyHeader "Component" center label.
   */
  microLabelSm: 'text-[10px] font-semibold uppercase tracking-wider sm:text-xs',
  /**
   * Caption, responsive — xs→sm at sm breakpoint. Used for detail/description cells in comparison tables.
   */
  captionSm: 'text-xs leading-snug sm:text-sm',
  /**
   * Hero subtitle, responsive — base→lg at sm breakpoint.
   */
  heroSubtitleSm: 'text-base leading-relaxed sm:text-lg',

  // ── Legacy aliases (do NOT remove — existing callers depend on these) ────────
  /** @deprecated Use typeScale.caption — kept for back-compat. */
  secondary: _xsSnug,
  /** @deprecated Use typeScale.primaryHeading — kept for back-compat. */
  recommendationHeading: _titleXlBold,
};

/**
 * Categorical mark tokens (Accent law + Density law).
 * Applied as a thin FULL ring around the whole box, or as dots on neutral surfaces —
 * NEVER a one-sided (left/right) side-panel highlight, and never a surface fill.
 * A ring (box-shadow) is used, not a border, so a marked element nested inside a
 * bordered container does not count as a nested bordered box (anti-box law).
 * (One-sided side accents are banned app-wide; see gate.py "one-sided side-accent".)
 * Meanings: redHat = Red Hat provenance, openSource = community/open-source,
 *           partner = hardware / partner / third-party, customer = your organization.
 */
export const categoricalMark = {
  /** Red Hat — thin red ring around the whole box. */
  redHat: 'ring-1 ring-inset ring-red-600',
  /** Open Source — thin blue ring around the whole box. */
  openSource: 'ring-1 ring-inset ring-blue-500',
  /** Partner / Hardware / Third-party — thin teal ring around the whole box. */
  partner: 'ring-1 ring-inset ring-teal-500',
  /** Customer / Your organization — thin neutral ring around the whole box. */
  customer: 'ring-1 ring-inset ring-edge',
};

/**
 * Capability support / presence marks for comparison tables.
 * Symbols: ✓ yes · ~ partial · ✕ no · ? confirm.
 * Class strings reuse productStatus / status.attention hues — single source.
 */
export const supportMark = {
  yes:     { symbol: '✓', ariaLabel: 'supported',            className: `${productStatus['GA']} font-bold` },
  partial: { symbol: '~', ariaLabel: 'partially supported',  className: `${status.attention.text} font-bold` },
  no:      { symbol: '✕', ariaLabel: 'not supported',        className: 'text-faint font-bold' },
  confirm: { symbol: '?', ariaLabel: 'confirm with Red Hat', className: 'text-faint' },
};

/**
 * Hardware cost/performance badge class maps for GPU comparison tables.
 * Used by TrainingDeepDive; centralized here per the no-re-implement-color-maps rule.
 */
export const hwBadge = {
  cost: (cost) => {
    if (['Highest', 'Very High', 'High'].includes(cost)) {
      return 'rounded-card px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }
    return 'rounded-card px-2 py-0.5 text-xs font-medium bg-tint text-muted';
  },
  performance: (perf) => {
    if (perf === 'Maximum' || perf === 'Excellent' || perf.startsWith('Very Good')) {
      return 'rounded-card px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
    return 'rounded-card px-2 py-0.5 text-xs font-medium bg-tint text-ink';
  },
};

/**
 * Small bullet-dot classes matching categoricalMark colors (for list item markers).
 * Use instead of a hardcoded `bg-accent` whenever a dot must follow its group's mark.
 */
export const categoricalDot = {
  redHat:     'bg-red-600',
  openSource: 'bg-blue-500',
  partner:    'bg-teal-500',
  customer:   'bg-edge',
};

/**
 * Legend chip classes matching categoricalMark colors.
 * Pair each chip with the categoricalMark key of the same name.
 */
export const legendChip = {
  redHat: 'w-3 h-3 rounded-card bg-red-600',
  openSource: 'w-3 h-3 rounded-card bg-blue-500',
  partner: 'w-3 h-3 rounded-card bg-teal-500',
  customer: 'w-3 h-3 rounded-card border-2 border-dashed border-edge bg-page',
};

/**
 * Ordering & redundancy law (DESIGN-LAW.md): Red Hat options render first in any
 * option enumeration. Stable otherwise (preserves relative order within each group).
 *
 * Usage: capability.options.slice().sort(redHatFirst)
 */
export function redHatFirst(a, b) {
  const aIsRH = a.provider === 'Red Hat' ? 0 : 1;
  const bIsRH = b.provider === 'Red Hat' ? 0 : 1;
  return aIsRH - bIsRH;
}
