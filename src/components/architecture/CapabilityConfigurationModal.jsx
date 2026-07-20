import { useEffect } from 'react';
import { X, Check, Microscope } from 'lucide-react';
import { isCapabilityOptionDisabled, MCP_CAPABILITY_ID, LLAMA_STACK_CAPABILITY_ID } from '../../lib/platformAiConstraints';
import { badge, interactive, modal, productStatus, redHatFirst, text, typeScale } from '../../lib/styleTokens';
import { solutionDetails } from '../../data/solutionDetails';

/**
 * Layer option picker for Build Your Stack. Backdrop = cancel; header ✕ = remove capability + close.
 */
export default function CapabilityConfigurationModal({
  capability,
  selectedCapabilities,
  getSelectedOption,
  onBackdropClose,
  onRemoveFromStack,
  onSelectOption,
  onDeepDive
}) {
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape') onBackdropClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBackdropClose]);

  if (!capability) return null;

  const anyDisabled = capability.options.some((o) =>
    isCapabilityOptionDisabled(capability, o.id, selectedCapabilities)
  );
  const pairingHint =
    anyDisabled && capability.id === MCP_CAPABILITY_ID
      ? 'MCP requires OpenShift in this configuration'
      : anyDisabled && capability.id === LLAMA_STACK_CAPABILITY_ID
        ? 'Llama Stack not available with current platform selection'
        : anyDisabled
          ? 'Greyed options not available with current platform selection'
          : null;

  return (
    <div
      data-ui="overlay"
      className={modal.overlay}
      onClick={onBackdropClose}
    >
      <div
        data-ui="card"
        role="dialog"
        aria-modal="true"
        aria-label={`Configure: ${capability.name}`}
        className={`${modal.panel} ${modal.panelNarrow}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`${typeScale.pageTitle} ${text.ink}`}>Configure: {capability.name}</h3>
              <p className={`mt-1 ${typeScale.body} ${text.muted}`}>{capability.description}</p>
              {pairingHint && (
                <p className={`mt-2 ${typeScale.caption} ${text.faint}`}>{pairingHint}</p>
              )}
            </div>
            <button
              type="button"
              title="Remove"
              aria-label="Remove"
              onClick={() => {
                onRemoveFromStack(capability.id);
              }}
              className={`flex items-center gap-1 ${typeScale.label} text-faint hover:text-ink rounded-card px-2 py-1 ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
            >
              <X size={14} aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>

        <div className={modal.body}>
          <div className="divide-y divide-hair">
            {capability.options.slice().sort(redHatFirst).map((option) => {
              const isSelected = getSelectedOption(capability.id) === option.id;
              const disabled = isCapabilityOptionDisabled(capability, option.id, selectedCapabilities);

              return (
                <div
                  key={option.id}
                  className={`${disabled ? 'bg-page opacity-70' : isSelected ? 'bg-tint' : ''} p-4`}
                >
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectOption(capability.id, option.id)}
                    className={`w-full text-left ${disabled ? 'cursor-not-allowed' : ''} ${interactive.focusRing} rounded-card`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${isSelected ? 'text-accent' : text.faint}`}>
                        {isSelected ? (
                          <Check size={20} />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-current" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2 flex-wrap">
                          <h4 className={`font-bold ${text.ink}`}>{option.name}</h4>
                          {disabled && (
                            <span className={`rounded-card px-2 py-0.5 ${typeScale.caption} bg-page text-muted`}>
                              N/A for pairing
                            </span>
                          )}
                          {option.isCustomer && (
                            <span className={`rounded-card px-2 py-0.5 ${typeScale.caption} bg-tint text-ink`}>
                              Customer
                            </span>
                          )}
                          {option.recommended && (
                            <span className={badge.recommended}>
                              Recommended
                            </span>
                          )}
                          {option.status && (
                            <span data-ui="chip" className={`rounded-card px-2 py-0.5 ${typeScale.caption} bg-page border border-hair ${productStatus[option.status] ?? 'text-muted'}`}>
                              {option.status}
                            </span>
                          )}
                        </div>
                        <p className={`${typeScale.body} ${text.muted}`}>{option.description}</p>
                      </div>
                    </div>
                  </button>
                  {option.provider === 'Red Hat' && solutionDetails[option.id] && (
                    <div className="mt-3 pt-3 border-t border-hair">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeepDive(option.id);
                        }}
                        className={`inline-flex items-center gap-1.5 ${typeScale.bodyStrong} text-link hover:underline ${interactive.focusRing} ${interactive.transition} rounded-card`}
                      >
                        <Microscope size={14} aria-hidden="true" />
                        Technical Details
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
