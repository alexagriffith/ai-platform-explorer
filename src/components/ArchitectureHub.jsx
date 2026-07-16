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
    <div data-tab="architecture" className="space-y-6">
      {/* Header — one surface, hairline separators, no nested boxes */}
      <div className="rounded-card border border-edge bg-surface p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <Layers className="text-accent mt-1" size={28} />
            <div>
              <h2 className={`font-display text-2xl font-bold ${text.ink} mb-2`}>
                Architecture Builder
              </h2>
              <p className={text.muted}>
                Choose how you want to build your Red Hat AI stack
              </p>
            </div>
          </div>

          {/* Help — inline row, not a nested bordered box */}
          <div className="inline-flex items-center gap-2 flex-shrink-0">
            <HelpCircle size={16} className={`${text.faint} flex-shrink-0`} />
            <span className={`text-sm ${text.muted} whitespace-nowrap`}>
              Not sure what to choose?
            </span>
            <button
              onClick={onSwitchToDecisions}
              className={`${button.primary} group`}
            >
              <span>Decision Guides</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-150 ease-out motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </button>
          </div>
        </div>

        {/* Mode Selector - Dropdown with inline description */}
        <div className="mb-0 border-t border-hair pt-4">
          <div className="flex items-center gap-3 mb-2">
            <label htmlFor="architecture-mode" className={`text-sm font-semibold ${text.muted} whitespace-nowrap`}>
              Build Mode:
            </label>
            <select
              id="architecture-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className={`flex-1 px-4 py-2 bg-surface border border-edge rounded-card ${text.ink} font-medium hover:border-accent ${interactive.focusRing} ${interactive.transition}`}
            >
              {modes.map((modeOption) => (
                <option key={modeOption.id} value={modeOption.id}>
                  {modeOption.name}
                </option>
              ))}
            </select>
          </div>
          <p className={`text-xs ${text.faint} ml-24`}>
            {currentMode.description}
          </p>
        </div>
      </div>

      {/* Active Mode Content */}
      {currentMode.component}
    </div>
  );
}
