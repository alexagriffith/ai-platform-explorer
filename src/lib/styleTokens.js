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

export const field = {
  input:
    'w-full rounded-card border border-edge bg-page px-4 py-2 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none',
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

export const badge = {
  neutral: 'rounded-card border border-hair bg-page px-2 py-0.5 text-xs text-muted',
  customer: 'rounded-card px-2 py-0.5 text-xs bg-tint border border-edge text-ink',
  positive: 'rounded-card px-2 py-0.5 text-xs bg-green-600 text-white',
};

export const modal = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4',
  panel: 'w-full max-h-[90vh] overflow-y-auto rounded-panel border border-edge bg-surface',
  panelWide: 'max-w-4xl',
  panelMedium: 'max-w-2xl',
  header: 'sticky top-0 z-10 border-b border-hair bg-surface px-5 py-4',
  body: 'space-y-5 p-5',
  section: 'space-y-3 border-t border-hair pt-5 first:border-t-0 first:pt-0',
};
