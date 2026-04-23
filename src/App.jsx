import { useState } from 'react';
import { Layers, Target, Package, Info, GitBranch } from 'lucide-react';
import ArchitectureHub from './components/ArchitectureHub';
import ProductExplorer from './components/ProductExplorer';
import UseCaseView from './components/UseCaseView';
import DecisionFlowchart from './components/DecisionFlowchart';
import AcronymGlossary from './components/AcronymGlossary';
import { products } from './data/products';

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
  const [selectedProducts, setSelectedProducts] = useState(
    products.filter(p => p.required).map(p => p.id)
  );

  const views = [
    { id: 'architecture', name: 'Architecture', icon: Layers },
    { id: 'decisions', name: 'Decision Guide', icon: GitBranch },
    { id: 'use-cases', name: 'Use Cases', icon: Target },
    { id: 'products', name: 'Products', icon: Package }
  ];

  const renderView = () => {
    switch (currentView) {
      case 'architecture':
        return (
          <ArchitectureHub
            customerEnv={customerEnv}
            setCustomerEnv={setCustomerEnv}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        );
      case 'products':
        return (
          <ProductExplorer
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        );
      case 'decisions':
        return <DecisionFlowchart />;
      case 'use-cases':
        return <UseCaseView customerEnv={customerEnv} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RH</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Red Hat AI Platform Explorer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive visualization of Red Hat's AI offerings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Info size={16} />
              <span>Build your stack • Choose Red Hat or customer solutions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                    currentView === view.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  {view.name}
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
          <p>Red Hat AI Platform Explorer • Internal Demo Tool</p>
        </div>
      </footer>

      {/* Floating Acronym Glossary */}
      <AcronymGlossary />
    </div>
  );
}

export default App;
