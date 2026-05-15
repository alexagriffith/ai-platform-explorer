import { useState } from 'react';
import { Layers, Hammer, Settings, Info, HelpCircle, ArrowRight } from 'lucide-react';
import CapabilityArchitectureView from './CapabilityArchitectureView';
import InteractiveBuilder from './InteractiveBuilder';
import CustomerConfig from './CustomerConfig';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-4">
          <Layers className="text-purple-600 mt-1" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Architecture Builder
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose how you want to build your Red Hat AI stack
            </p>
          </div>
        </div>

        {/* Mode Selector - Dropdown with inline description */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <label htmlFor="architecture-mode" className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Build Mode:
            </label>
            <select
              id="architecture-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium hover:border-purple-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-colors"
            >
              {modes.map((modeOption) => (
                <option key={modeOption.id} value={modeOption.id}>
                  {modeOption.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-24">
            {currentMode.description}
          </p>
        </div>

        {/* Help Link */}
        <div>
          <button
            onClick={onSwitchToDecisions}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg hover:shadow-md transition-all group"
          >
            <HelpCircle size={20} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Not sure what to choose?
            </span>
            <ArrowRight size={16} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-semibold text-purple-600">
              Use Decision Guides
            </span>
          </button>
        </div>
      </div>

      {/* Active Mode Content */}
      {currentMode.component}
    </div>
  );
}
