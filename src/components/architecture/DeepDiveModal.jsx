import { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ListChecks, Layers, GitBranch } from 'lucide-react';
import { solutionDetails } from '../../data/solutionDetails';
import { interactive, modal, text, typeScale } from '../../lib/styleTokens';

const DEFAULT_REQUIREMENTS =
  'Confirm supported versions, cluster capacity, and network policy with official documentation and your platform team.';

function Section({ title, icon: Icon, children }) {
  return (
    <section className={modal.section}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-accent flex-shrink-0" />}
        <h3 className={`${typeScale.groupLabel} ${text.ink}`}>{title}</h3>
      </div>
      <div className={`space-y-2 ${typeScale.secondary} ${text.muted}`}>{children}</div>
    </section>
  );
}

/**
 * Split a bullet on its first ": " — render the term bold, the rest as secondary.
 * Bullets without ": " render unchanged.
 */
function BulletItem({ text: item }) {
  const sep = item.indexOf(': ');
  if (sep === -1) return <span>{item}</span>;
  return (
    <>
      <strong className="text-ink">{item.slice(0, sep)}</strong>
      {': '}
      {item.slice(sep + 2)}
    </>
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
      data-ui="overlay"
      className={modal.overlay}
      onClick={onClose}
    >
      <div
        data-ui="card"
        role="dialog"
        aria-modal="true"
        aria-label={details.name}
        className={`${modal.panel} ${modal.panelWide}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal.header}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className={`${typeScale.primaryHeading} ${text.ink}`}>{details.name}</h2>
              <p className={`mt-1 ${typeScale.secondary} ${text.muted}`}>{details.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`flex-shrink-0 rounded-card p-2 ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className={modal.body}>
          <Section title="What it provides" icon={BookOpen}>
            {caps.length > 0 ? (
              <ul className={`grid ${caps.length >= 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-4 gap-y-1`}>
                {caps.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent flex-shrink-0 mt-0.5">·</span>
                    <BulletItem text={c} />
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>

          <Section title="Requirements" icon={ListChecks}>
            <p>{reqs}</p>
          </Section>

          <Section title="Best for" icon={BookOpen}>
            {useCases.length > 0 ? (
              <ul className={`grid ${useCases.length >= 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-4 gap-y-1`}>
                {useCases.map((u, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent flex-shrink-0 mt-0.5">·</span>
                    <BulletItem text={u} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={text.faint}>Discuss in workshop</p>
            )}
          </Section>

          {showArchitectureDiagram && (
            <Section title="Architecture overview" icon={GitBranch}>
              <div className="space-y-3 rounded-card bg-tint px-3 py-2">
                <div>
                  <div className={`mb-2 ${typeScale.groupLabel} ${text.faint}`}>Core components</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {components.map((component, idx) => (
                      <div key={idx} data-ui="chip" className="rounded-card bg-surface px-2 py-1.5 flex-none">
                        <div className={`${typeScale.secondary} font-bold ${text.ink} mb-0.5`}>
                          {component.name}
                        </div>
                        <div className={`${typeScale.meta} ${text.muted}`}>{component.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {integrations.length > 0 && (
                  <div className="border-t border-hair pt-2">
                    <div className={`mb-2 ${typeScale.groupLabel} ${text.faint}`}>External integrations</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {integrations.map((integration, idx) => (
                        <div key={idx} data-ui="chip" className="rounded-card bg-page px-2 py-1.5 flex-none">
                          <div className={`${typeScale.secondary} font-semibold ${text.ink} mb-0.5`}>
                            {integration.name}
                          </div>
                          <div className={`${typeScale.meta} ${text.muted}`}>{integration.purpose}</div>
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
              <div className="grid md:grid-cols-2 gap-2">
                {components.map((component, idx) => (
                  <div key={idx} className="rounded-card bg-tint px-2 py-1.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`${typeScale.secondary} font-bold ${text.ink}`}>{component.name}</h4>
                      <span className={`flex-shrink-0 rounded-card bg-page px-1.5 py-0.5 ${typeScale.meta} ${text.muted}`}>
                        {component.role}
                      </span>
                    </div>
                    {component.description ? (
                      <p className={`${typeScale.secondary} ${text.muted}`}>{component.description}</p>
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
                    className="flex flex-col gap-1 py-1.5 first:pt-0 last:pb-0 sm:flex-row sm:justify-between"
                  >
                    <span className={`font-medium ${text.ink}`}>{int.name}</span>
                    <span className={`${typeScale.secondary} sm:max-w-[55%] sm:text-right ${text.muted}`}>{int.purpose}</span>
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
                  className={`inline-flex items-center gap-2 font-medium ${text.link} hover:underline ${interactive.transition} ${interactive.focusRing} rounded-card`}
                >
                  <ExternalLink size={14} />
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
