import { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ListChecks, Layers, GitBranch } from 'lucide-react';
import { solutionDetails } from '../data/solutionDetails';

const DEFAULT_REQUIREMENTS =
  'Confirm supported versions, cluster capacity, and network policy with official documentation and your platform team.';

function Section({ title, icon: Icon, children }) {
  return (
    <section className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700/80 flex items-center gap-2">
        {Icon && <Icon size={18} className="text-purple-600 flex-shrink-0" />}
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">{title}</h3>
      </div>
      <div className="p-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">{children}</div>
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={details.name}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-t-lg flex items-start justify-between gap-3 z-10">
          <div>
            <h2 className="text-2xl font-bold leading-tight">{details.name}</h2>
            <p className="text-purple-100 text-sm mt-1 line-clamp-3">{details.description}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg flex-shrink-0" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <div className="p-5 space-y-4">
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
              <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700 space-y-6">
                <div>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Core components
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {components.map((component, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-400 dark:border-purple-500 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="font-bold text-sm text-gray-900 dark:text-white mb-1 leading-snug">
                          {component.name}
                        </div>
                        <div className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded inline-block">
                          {component.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {integrations.length > 0 && (
                  <div className="border-t-2 border-purple-300 dark:border-purple-600 pt-4">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      External integrations
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {integrations.map((integration, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                            {integration.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{integration.purpose}</div>
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
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{component.name}</h4>
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded flex-shrink-0">
                        {component.role}
                      </span>
                    </div>
                    {component.description ? (
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{component.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {!showArchitectureDiagram && integrations.length > 0 && (
            <Section title="Integrations" icon={Layers}>
              <ul className="space-y-2">
                {integrations.map((int, i) => (
                  <li
                    key={i}
                    className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{int.name}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-right sm:max-w-[55%]">{int.purpose}</span>
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
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  <ExternalLink size={16} />
                  Official documentation
                </a>
              )}
              {details.contacts?.length > 0 && (
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">Contacts: </span>
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
