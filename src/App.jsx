import { useState } from 'react';
import { Layers, Target, Package, GitBranch, AlertCircle, GitCompare } from 'lucide-react';
import ArchitectureHub from './components/ArchitectureHub';
import ProductExplorer from './components/ProductExplorer';
import UseCaseView from './components/UseCaseView';
import DecisionFlowchart from './components/DecisionFlowchart';
import DeploymentImpactView from './components/DeploymentImpactView';
import AcronymGlossary from './components/AcronymGlossary';

function App() {
  const [currentView, setCurrentView] = useState('architecture');
  const [customerEnv, setCustomerEnv] = useState({
    hasKubernetes: false,
    hasOpenShift: false,
    hasGPUs: false,
    gpuType: null,
    hasApiGateway: false,
    hasModelRegistry: false,
    hasVectorDB: false,
    useCase: null,
    teamSize: 'small',
    deployment: 'cloud'
  });
  // Canonical architecture blueprint: flat map capabilityId -> optionId (see README "Application state").
  const [selectedCapabilities, setSelectedCapabilities] = useState({});
  const [selectedDecisionGuide, setSelectedDecisionGuide] = useState('');

  const views = [
    { id: 'architecture', name: 'Architecture', icon: Layers },
    { id: 'decisions', name: 'Decision Guides', icon: GitBranch },
    { id: 'use-cases', name: 'Use Cases', icon: Target },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'deployment-impact', name: 'Deployment Impact', icon: GitCompare }
  ];

  const renderView = () => {
    switch (currentView) {
      case 'architecture':
        return (
          <ArchitectureHub
            customerEnv={customerEnv}
            setCustomerEnv={setCustomerEnv}
            selectedCapabilities={selectedCapabilities}
            setSelectedCapabilities={setSelectedCapabilities}
            onSwitchToDecisions={() => setCurrentView('decisions')}
          />
        );
      case 'products':
        return <ProductExplorer />;
      case 'decisions':
        return (
          <DecisionFlowchart
            selectedCapabilities={selectedCapabilities}
            setSelectedCapabilities={setSelectedCapabilities}
            onSwitchToArchitecture={() => setCurrentView('architecture')}
            selectedDecisionGuide={selectedDecisionGuide}
            setSelectedDecisionGuide={setSelectedDecisionGuide}
          />
        );
      case 'use-cases':
        return <UseCaseView customerEnv={customerEnv} />;
      case 'deployment-impact':
        return <DeploymentImpactView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg sm:text-xl">RH</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Red Hat AI Platform Explorer
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                Interactive visualization of Red Hat's AI offerings
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* WIP Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center gap-2 text-white">
            <AlertCircle size={16} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-center">
              Work In Progress: Content and features subject to change
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex gap-0.5 sm:gap-1 overflow-x-auto">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => {
                    // Reset decision guide when clicking the tab
                    if (view.id === 'decisions') {
                      setSelectedDecisionGuide('');
                    }
                    setCurrentView(view.id);
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
                    currentView === view.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  title={view.name}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="hidden sm:inline">{view.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Red Hat AI Platform Explorer • Prototype</p>
        </div>
      </footer>

      <AcronymGlossary />
    </div>
  );
}

export default App;
