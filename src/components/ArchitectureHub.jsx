import { useState } from 'react';
import { Layers, Hammer, Settings, Info } from 'lucide-react';
import CapabilityArchitectureView from './CapabilityArchitectureView';
import InteractiveBuilder from './InteractiveBuilder';
import CustomerConfig from './CustomerConfig';

export default function ArchitectureHub({ customerEnv, setCustomerEnv, selectedProducts, setSelectedProducts }) {
  const [mode, setMode] = useState('build'); // 'build', 'interactive', 'generate'

  const modes = [
    {
      id: 'build',
      name: 'Build Your Stack',
      icon: Layers,
      description: 'Layer-by-layer architecture builder with flexible component selection',
      component: <CapabilityArchitectureView />
    },
    {
      id: 'interactive',
      name: 'Interactive Builder',
      icon: Hammer,
      description: 'Step-by-step guided workflow from infrastructure to application',
      component: <InteractiveBuilder />
    },
    {
      id: 'generate',
      name: 'Generate from Environment',
      icon: Settings,
      description: 'Answer questions about your setup and get automated recommendations',
      component: (
        <CustomerConfig
          customerEnv={customerEnv}
          setCustomerEnv={setCustomerEnv}
          setSelectedProducts={setSelectedProducts}
        />
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

        {/* Mode Selector */}
        <div className="grid md:grid-cols-3 gap-4">
          {modes.map((modeOption) => {
            const Icon = modeOption.icon;
            const isSelected = mode === modeOption.id;

            return (
              <button
                key={modeOption.id}
                onClick={() => setMode(modeOption.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-400 dark:hover:border-purple-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold mb-1 ${
                      isSelected
                        ? 'text-purple-900 dark:text-purple-100'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {modeOption.name}
                    </h3>
                    <p className={`text-sm ${
                      isSelected
                        ? 'text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {modeOption.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Active
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {mode === 'build' && 'Click capability boxes to explore options. Green = Red Hat, Blue = Customer, Purple = Partner.'}
            {mode === 'interactive' && 'Follow the step-by-step guide to build your stack from the ground up.'}
            {mode === 'generate' && 'Tell us about your current environment and we\'ll recommend the best Red Hat AI solutions.'}
          </p>
        </div>
      </div>

      {/* Render Selected Mode */}
      <div>
        {currentMode?.component}
      </div>
    </div>
  );
}
