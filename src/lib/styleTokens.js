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
  requiredBadge: 'bg-draft-bg text-draft-fg',
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
 * Type scale for the density law.
 * component-name > group-label > body-secondary (one step each).
 */
export const typeScale = {
  /** Component / product name — the point of every box. */
  componentName: 'text-sm font-bold leading-tight',
  /** Group / section label — visible, not shouting. */
  groupLabel: 'text-xs font-semibold uppercase tracking-wide',
  /** Secondary / supporting text — one step below component name. */
  secondary: 'text-xs leading-snug',
  /** Faint / tertiary metadata. */
  meta: 'text-[11px] leading-snug',
};

/**
 * Categorical mark tokens (Accent law + Density law).
 * Applied as outlines, left hairlines, or dots on neutral surfaces — NEVER surface fills.
 * Meanings: redHat = Red Hat provenance, openSource = community/open-source,
 *           partner = hardware / partner / third-party, customer = your organization.
 */
export const categoricalMark = {
  /** Red Hat — red left hairline + subtle red tint outline. */
  redHat: 'border-l-2 border-l-red-600 border border-red-200 dark:border-red-900',
  /** Open Source — blue left hairline + subtle blue tint outline. */
  openSource: 'border-l-2 border-l-blue-500 border border-blue-200 dark:border-blue-900',
  /** Partner / Hardware / Third-party — teal left hairline + subtle teal tint outline. */
  partner: 'border-l-2 border-l-teal-500 border border-teal-200 dark:border-teal-900',
  /** Customer / Your organization — neutral outline only (no hue). */
  customer: 'border border-dashed border-edge',
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
