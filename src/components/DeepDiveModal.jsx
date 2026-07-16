import { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ListChecks, Layers, GitBranch } from 'lucide-react';
import { solutionDetails } from '../data/solutionDetails';
import { interactive, modal, text } from '../lib/styleTokens';

const DEFAULT_REQUIREMENTS =
  'Confirm supported versions, cluster capacity, and network policy with official documentation and your platform team.';

function Section({ title, icon: Icon, children }) {
  return (
    <section className={modal.section}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-accent flex-shrink-0" />}
        <h3 className={`text-sm font-bold uppercase tracking-wide ${text.ink}`}>{title}</h3>
      </div>
      <div className={`space-y-3 text-sm ${text.muted}`}>{children}</div>
    </section>
  );
}

export default function DeepDiveModal({ optionId, onClose }) {
  const details = solutionDetails[optionId];

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!details) return null;

  const reqs = details.requirements || DEFAULT_REQUIREMENTS;
  const caps = (details.capabilities || []).slice(0, 8);
  const useCases = (details.useCases || []).slice(0, 6);
  const components = details.architecture?.components || [];
  const integrations = details.architecture?.integrations || [];
  const showArchitectureDiagram = components.length > 0;

  return (
    <div
      className={modal.overlay}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={details.name}
        className={`${modal.panel} ${modal.panelWide}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className={`text-2xl font-bold leading-tight ${text.ink}`}>{details.name}</h2>
              <p className={`mt-1 text-sm ${text.muted} line-clamp-3`}>{details.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`flex-shrink-0 rounded-card p-2 ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className={modal.body}>
          <Section title="What it provides" icon={BookOpen}>
            <p>{details.description}</p>
            {caps.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {caps.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Requirements" icon={ListChecks}>
            <p>{reqs}</p>
          </Section>

          <Section title="Best for" icon={BookOpen}>
            {useCases.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {useCases.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Discuss in workshop</p>
            )}
          </Section>

          {showArchitectureDiagram && (
            <Section title="Architecture overview" icon={GitBranch}>
              <div className="space-y-5 rounded-card bg-tint p-4 sm:p-5">
                <div>
                  <div className={`mb-3 text-xs font-bold uppercase tracking-wide ${text.faint}`}>
                    Core components
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {components.map((component, idx) => (
                      <div key={idx} className="rounded-card bg-surface p-3">
                        <div className={`mb-1 text-sm font-bold leading-snug ${text.ink}`}>
                          {component.name}
                        </div>
                        <div className="inline-block rounded-card bg-page px-2 py-1 text-xs text-muted">
                          {component.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {integrations.length > 0 && (
                  <div className="border-t border-hair pt-4">
                    <div className={`mb-3 text-xs font-bold uppercase tracking-wide ${text.faint}`}>
                      External integrations
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {integrations.map((integration, idx) => (
                        <div key={idx} className="rounded-card bg-page p-3">
                          <div className={`mb-1 text-sm font-semibold ${text.ink}`}>
                            {integration.name}
                          </div>
                          <div className={`text-xs leading-snug ${text.muted}`}>{integration.purpose}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {components.length > 0 && (
            <Section title="Component details" icon={Layers}>
              <div className="grid md:grid-cols-2 gap-3">
                {components.map((component, idx) => (
                  <div key={idx} className="rounded-card bg-tint p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className={`text-sm font-bold leading-snug ${text.ink}`}>{component.name}</h4>
                      <span className="flex-shrink-0 rounded-card bg-page px-2 py-1 text-xs text-muted">
                        {component.role}
                      </span>
                    </div>
                    {component.description ? (
                      <p className={`text-xs sm:text-sm leading-relaxed ${text.muted}`}>{component.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {!showArchitectureDiagram && integrations.length > 0 && (
            <Section title="Integrations" icon={Layers}>
              <ul className="divide-y divide-hair">
                {integrations.map((int, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-1 py-2 first:pt-0 last:pb-0 sm:flex-row sm:justify-between"
                  >
                    <span className={`font-medium ${text.ink}`}>{int.name}</span>
                    <span className={`text-xs sm:max-w-[55%] sm:text-right ${text.muted}`}>{int.purpose}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Documentation & references" icon={ExternalLink}>
            <div className="space-y-2">
              {details.documentation && (
                <a
                  href={details.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 font-medium ${text.link} hover:underline ${interactive.focusRing} rounded-card`}
                >
                  <ExternalLink size={16} />
                  Official documentation
                </a>
              )}
              {details.contacts?.length > 0 && (
                <p>
                  <span className={`font-semibold ${text.ink}`}>Contacts: </span>
                  {details.contacts.join(', ')}
                </p>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
