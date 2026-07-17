import { useEffect } from 'react';
import { X, Check, Microscope } from 'lucide-react';
import { isCapabilityOptionDisabled, MCP_CAPABILITY_ID, LLAMA_STACK_CAPABILITY_ID } from '../lib/platformAiConstraints';
import { badge, button, card, interactive, modal, redHatFirst, text } from '../lib/styleTokens';
import { solutionDetails } from '../data/solutionDetails';

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
        className={`${modal.panel} ${modal.panelMedium}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`text-2xl font-bold ${text.ink}`}>Configure: {capability.name}</h3>
              <p className={`mt-1 text-sm ${text.muted}`}>{capability.description}</p>
              {pairingHint && (
                <p className={`mt-2 text-xs ${text.faint}`}>{pairingHint}</p>
              )}
            </div>
            <button
              type="button"
              title="Remove"
              aria-label="Remove"
              onClick={() => {
                onRemoveFromStack(capability.id);
              }}
              className={`rounded-card p-2 ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className={modal.body}>
          <div className="space-y-3">
            {capability.options.slice().sort(redHatFirst).map((option) => {
              const isSelected = getSelectedOption(capability.id) === option.id;
              const disabled = isCapabilityOptionDisabled(capability, option.id, selectedCapabilities);

              return (
                <div
                  key={option.id}
                  className={`${card.selected} ${disabled ? 'bg-page opacity-70' : 'bg-surface'} p-4`}
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
                            <span className={badge.neutral}>
                              N/A for pairing
                            </span>
                          )}
                          {option.isCustomer && (
                            <span className={badge.customer}>
                              Customer
                            </span>
                          )}
                          {option.recommended && (
                            <span className={badge.positive}>
                              Recommended
                            </span>
                          )}
                          {option.status && (
                            <span className={badge.neutral}>
                              {option.status}
                            </span>
                          )}
                        </div>
                        {option.provider && !option.name.includes(option.provider) && (
                          <div className={`mb-1 text-sm font-semibold ${text.muted}`}>
                            {option.provider}
                          </div>
                        )}
                        <p className={`text-sm ${text.muted}`}>{option.description}</p>
                      </div>
                    </div>
                  </button>
                  {option.provider === 'Red Hat' && solutionDetails[option.id] && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeepDive(option.id);
                        }}
                        className={`${button.secondary} w-full justify-center`}
                      >
                        <Microscope size={16} />
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
