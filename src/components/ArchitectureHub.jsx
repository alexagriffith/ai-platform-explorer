import { useState } from 'react';
import { Layers, Hammer, Settings, HelpCircle, BookOpen } from 'lucide-react';
import CapabilityArchitectureView from './CapabilityArchitectureView';
import InteractiveBuilder from './InteractiveBuilder';
import CustomerConfig from './CustomerConfig';
import RAGArchitecture from './RAGArchitecture';
import TrainingDeepDive from './TrainingDeepDive';
import { interactive, text, toggle } from '../lib/styleTokens';

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
      icon: Layers,
      description: 'Layer-by-layer architecture builder with flexible component selection',
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
      icon: Hammer,
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
      icon: Settings,
      description: 'Capture environment signals and copy a draft suggestion list for the workshop',
      component: (
        <CustomerConfig customerEnv={customerEnv} setCustomerEnv={setCustomerEnv} />
      )
    },
    {
      id: 'blueprints',
      name: 'Blueprints',
      icon: BookOpen,
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

        {/* Mode segmented control — all modes visible at content width */}
        <div
          data-ui="chip-row"
          className="mt-2 pt-2 border-t border-hair flex flex-col gap-1.5 sm:flex-row sm:items-center"
        >
          <span className={`text-xs font-semibold ${text.muted} whitespace-nowrap shrink-0`}>
            Mode:
          </span>
          <div role="tablist" aria-label="Architecture mode" className="flex flex-wrap gap-1">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              const active = mode === modeOption.id;
              return (
                <button
                  data-ui="chip"
                  key={modeOption.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleModeChange(modeOption.id)}
                  className={`inline-flex items-center gap-1 ${toggle.base} ${active ? toggle.active : toggle.inactive} ${interactive.transition} ${interactive.focusRing}`}
                >
                  <Icon size={11} aria-hidden="true" />
                  {modeOption.name}
                </button>
              );
            })}
          </div>
          <p className={`text-xs ${text.faint} sm:ml-1`}>
            {currentMode.description}
          </p>
        </div>
      </div>

      {currentMode.component}
    </div>
  );
}
