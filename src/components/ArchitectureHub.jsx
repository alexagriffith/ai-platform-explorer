import { useState } from 'react';
import { Layers, Hammer, Settings, HelpCircle, ArrowRight } from 'lucide-react';
import CapabilityArchitectureView from './CapabilityArchitectureView';
import InteractiveBuilder from './InteractiveBuilder';
import CustomerConfig from './CustomerConfig';
import { button, interactive, text } from '../lib/styleTokens';

export default function ArchitectureHub({ customerEnv, setCustomerEnv, onSwitchToDecisions, selectedCapabilities, setSelectedCapabilities }) {
  const [mode, setMode] = useState('build'); // 'build', 'interactive', 'generate'

  const modes = [
    {
      id: 'build',
      name: 'Build Your Stack',
      icon: Layers,
      description: 'Layer-by-layer architecture builder with flexible component selection',
      component: (
        <CapabilityArchitectureView
          onSwitchToGenerate={() => setMode('generate')}
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

          {/* Help — inline row */}
          <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
            <HelpCircle size={14} className={`${text.faint} flex-shrink-0`} />
            <span className={`text-xs ${text.muted}`}>Not sure what to choose?</span>
            <button
              onClick={onSwitchToDecisions}
              className={`${button.primaryCompact} group`}
            >
              <span>Decision Guides</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-150 ease-out motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-2 pt-2 border-t border-hair flex flex-col gap-1 sm:flex-row sm:items-center">
          <label htmlFor="architecture-mode" className={`text-xs font-semibold ${text.muted} whitespace-nowrap shrink-0`}>
            Build mode:
          </label>
          <select
            id="architecture-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className={`flex-1 px-2 py-0.5 bg-surface border border-edge rounded-card text-xs ${text.ink} font-medium hover:border-accent ${interactive.focusRing} ${interactive.transition}`}
          >
            {modes.map((modeOption) => (
              <option key={modeOption.id} value={modeOption.id}>
                {modeOption.name}
              </option>
            ))}
          </select>
          <p className={`text-xs ${text.faint} sm:ml-2`}>
            {currentMode.description}
          </p>
        </div>
      </div>

      {currentMode.component}
    </div>
  );
}
