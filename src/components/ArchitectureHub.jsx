import { useState } from 'react';
import { Layers, HelpCircle } from 'lucide-react';
import CapabilityArchitectureView from './CapabilityArchitectureView';
import InteractiveBuilder from './InteractiveBuilder';
import CustomerConfig from './CustomerConfig';
import RAGArchitecture from './RAGArchitecture';
import TrainingDeepDive from './TrainingDeepDive';
import { interactive, text } from '../lib/styleTokens';

export default function ArchitectureHub({ customerEnv, setCustomerEnv, onSwitchToDecisions, selectedCapabilities, setSelectedCapabilities, initialMode = 'build', onModeChange }) {
  const [mode, setMode] = useState(initialMode); // 'build', 'interactive', 'generate', 'blueprints'

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  const modes = [
    {
      id: 'build',
      name: 'Build Your Stack',
      description: '',
      component: (
        <CapabilityArchitectureView
          onSwitchToGenerate={() => handleModeChange('generate')}
          selectedCapabilities={selectedCapabilities}
          setSelectedCapabilities={setSelectedCapabilities}
        />
      )
    },
    {
      id: 'interactive',
      name: 'Interactive Builder',
      description: 'Step-by-step guided workflow from infrastructure to application',
      component: (
        <InteractiveBuilder
          selectedCapabilities={selectedCapabilities}
          setSelectedCapabilities={setSelectedCapabilities}
        />
      )
    },
    {
      id: 'generate',
      name: 'Generate from Environment',
      description: 'Capture environment signals and copy a draft suggestion list for the workshop',
      component: (
        <CustomerConfig customerEnv={customerEnv} setCustomerEnv={setCustomerEnv} />
      )
    },
    {
      id: 'blueprints',
      name: 'Blueprints',
      description: 'Pre-composed reference architectures — RAG and training patterns (read-only; no stack wiring)',
      component: (
        <div className="space-y-6">
          <RAGArchitecture />
          <TrainingDeepDive />
        </div>
      )
    }
  ];

  const currentMode = modes.find(m => m.id === mode);

  return (
    <div data-tab="architecture" className="space-y-3">
      {/* Header — one surface, hairline separators, no nested boxes */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Layers className="text-accent shrink-0" size={20} />
            <h2 className={`font-display text-base font-bold ${text.ink}`}>
              Architecture Builder
            </h2>
          </div>

          {/* Help — quiet text link */}
          <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0">
            <HelpCircle size={13} className={`${text.faint} flex-shrink-0`} aria-hidden="true" />
            <span className={`text-xs ${text.muted}`}>Not sure what to choose?</span>
            <button
              type="button"
              onClick={onSwitchToDecisions}
              className={`text-xs ${text.link} underline underline-offset-2 hover:no-underline ${interactive.transition} ${interactive.focusRing} rounded-sm`}
            >
              Decision Guides
            </button>
          </div>
        </div>

        {/* Mode nav — text tabs matching top-nav grammar (no borders, no fills) */}
        <div
          className="mt-2 pt-2 border-t border-hair"
        >
          <div role="tablist" aria-label="Architecture mode" className="flex flex-wrap gap-x-4 gap-y-1">
            {modes.map((modeOption) => {
              const active = mode === modeOption.id;
              return (
                <button
                  data-ui="control"
                  key={modeOption.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleModeChange(modeOption.id)}
                  className={`text-xs font-medium pb-0.5 border-b-2 whitespace-nowrap ${interactive.transition} ${interactive.focusRing} rounded-none ${
                    active
                      ? 'border-accent text-link'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {modeOption.name}
                </button>
              );
            })}
          </div>
          {currentMode.description && (
            <p className={`mt-1 text-xs ${text.faint}`}>
              {currentMode.description}
            </p>
          )}
        </div>
      </div>

      {currentMode.component}
    </div>
  );
}
