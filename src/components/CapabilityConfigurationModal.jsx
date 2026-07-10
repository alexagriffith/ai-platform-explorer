import { useEffect } from 'react';
import { X, Check, Microscope } from 'lucide-react';
import { isCapabilityOptionDisabled, MCP_CAPABILITY_ID, LLAMA_STACK_CAPABILITY_ID } from '../lib/platformAiConstraints';

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onBackdropClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Configure: ${capability.name}`}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Configure: {capability.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{capability.description}</p>
            {pairingHint && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{pairingHint}</p>
            )}
          </div>
          <button
            type="button"
            title="Remove"
            aria-label="Remove"
            onClick={() => {
              onRemoveFromStack(capability.id);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3">
          {capability.options.map((option) => {
            const isSelected = getSelectedOption(capability.id) === option.id;
            const disabled = isCapabilityOptionDisabled(capability, option.id, selectedCapabilities);
            return (
              <div
                key={option.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : disabled
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40'
                      : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectOption(capability.id, option.id)}
                  className={`w-full text-left ${disabled ? 'cursor-not-allowed opacity-55' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                      {isSelected ? (
                        <Check size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-gray-900 dark:text-white">{option.name}</h4>
                        {disabled && (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 text-xs rounded">
                            N/A for pairing
                          </span>
                        )}
                        {option.isCustomer && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded">
                            Customer
                          </span>
                        )}
                        {option.recommended && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                            Recommended
                          </span>
                        )}
                        {option.status && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs rounded">
                            {option.status}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {option.provider}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                    </div>
                  </div>
                </button>
                {option.provider === 'Red Hat' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeepDive(option.id);
                    }}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all opacity-100"
                  >
                    <Microscope size={16} />
                    Technical Details
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
