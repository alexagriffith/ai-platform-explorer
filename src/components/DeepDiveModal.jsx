import { X, ExternalLink, Layers as LayersIcon, Network, CheckCircle2, Users, ArrowRight, GitBranch } from 'lucide-react';
import { solutionDetails } from '../data/solutionDetails';

export default function DeepDiveModal({ optionId, onClose }) {
  const details = solutionDetails[optionId];

  if (!details) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{details.name}</h2>
              <p className="text-purple-100">{details.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Visual Connection Map */}
          {details.architecture?.components && details.architecture?.integrations && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GitBranch size={20} className="text-purple-600" />
                Architecture Overview
              </h3>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                {/* Core Components - Grid Layout */}
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Core Components</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {details.architecture.components.map((component, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-400 shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                          {component.name}
                        </div>
                        <div className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded inline-block">
                          {component.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* External Integrations */}
                <div className="border-t-2 border-purple-300 dark:border-purple-600 pt-4">
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    External Integrations
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {details.architecture.integrations.map((integration, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {integration.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {integration.purpose}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* Architecture Components */}
          {details.architecture?.components && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LayersIcon size={20} className="text-purple-600" />
                Architecture Components
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {details.architecture.components.map((component, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">{component.name}</h4>
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                        {component.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {component.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Integrations */}
          {details.architecture?.integrations && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Network size={20} className="text-blue-600" />
                Key Integrations
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {details.architecture.integrations.map((integration, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {integration.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {integration.purpose}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Capabilities */}
          {details.capabilities && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-600" />
                Key Capabilities
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {details.capabilities.map((capability, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Use Cases */}
          {details.useCases && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-orange-600" />
                Common Use Cases
              </h3>
              <ul className="space-y-2">
                {details.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">→</span>
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Resources */}
          <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Resources & Support</h3>
            <div className="space-y-2">
              {details.documentation && (
                <a
                  href={details.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink size={16} />
                  Official Documentation
                </a>
              )}
              {details.contacts && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Contacts: </span>
                  {details.contacts.map((contact, idx) => (
                    <span key={idx} className="text-gray-600 dark:text-gray-400">
                      {contact}
                      {idx < details.contacts.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
