/**
 * Shared DESIGN-LAW class-string maps (docs/DESIGN-LAW.md).
 * Complete Tailwind literals only — no logic, no template-built classes.
 * Extend in later restyle steps; do not re-implement maps inside components.
 */

export const surface = {
  page: 'bg-page',
  raised: 'bg-surface',
  tint: 'bg-tint',
};

export const border = {
  hair: 'border-hair',
  edge: 'border-edge',
  divideHair: 'divide-hair',
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
  secondary:
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card border border-edge text-ink text-sm font-medium hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none',
};

/** Segmented control / detail-level chips. */
export const toggle = {
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
