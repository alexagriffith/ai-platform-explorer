import { useState, useEffect } from 'react';
import { Layers, Package, GitBranch, AlertCircle, GitCompare, Sun, Moon } from 'lucide-react';
import ArchitectureHub from './components/ArchitectureHub';
import ProductsHub from './components/ProductsHub';
import DecisionFlowchart from './components/DecisionFlowchart';
import DeploymentImpactView from './components/DeploymentImpactView';
import AcronymGlossary from './components/AcronymGlossary';
import { interactive } from './lib/styleTokens';

/**
 * Returns whether .dark is currently on <html>.
 * A null stored value means "follow system" — the pre-paint script already
 * set the class; we just read it here to seed React state.
 */
function readCurrentDark() {
  return document.documentElement.classList.contains('dark');
}

/**
 * Minimal hook for the dark/light toggle. Persists explicit choices to
 * localStorage; when no explicit choice exists, listens to the system media
 * query and follows live OS changes.
 *
 * localStorage reads/writes are wrapped in try/catch for sandboxed/privacy
 * contexts where storage access throws (e.g. Firefox strict mode, sandboxed
 * iframes). The handler checks for a stored preference before acting so an
 * explicit user choice is never overridden by a subsequent OS change.
 */
function useTheme() {
  const [isDark, setIsDark] = useState(readCurrentDark);

  useEffect(() => {
    let stored;
    try { stored = localStorage.getItem('theme'); } catch { stored = null; }
    if (stored) return; // explicit choice — don't listen to system

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      // Bail if the user has since made an explicit choice
      let currentStored;
      try { currentStored = localStorage.getItem('theme'); } catch { currentStored = null; }
      if (currentStored) return;
      document.documentElement.classList.toggle('dark', e.matches);
      setIsDark(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* sandboxed */ }
    setIsDark(next);
  }

  return { isDark, toggleTheme };
}

function App() {
  const [currentView, setCurrentView] = useState('architecture');
  const { isDark, toggleTheme } = useTheme();
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
  // Architecture sub-mode — lifted so the use-case index can deep-link to Blueprints.
  const [architectureMode, setArchitectureMode] = useState('build');

  /**
   * Cross-tab deep-link handler used by the use-case index in ProductsHub.
   * Accepts { tab, architectureMode?, decisionGuide? }.
   */
  const handleNavigate = ({ tab, architectureMode: mode, decisionGuide }) => {
    if (mode) setArchitectureMode(mode);
    if (decisionGuide !== undefined) setSelectedDecisionGuide(decisionGuide);
    setCurrentView(tab);
  };

  // Four-tab bar: Architecture · Decision Guides · Products · Deployment Impact.
  // Removed ids (use-cases, product-comparison) are still handled in renderView as
  // backward-compat stubs (redirect to Products) but do not appear in navigation.
  const views = [
    { id: 'architecture', name: 'Architecture', icon: Layers },
    { id: 'decisions', name: 'Decision Guides', icon: GitBranch },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'deployment-impact', name: 'Deployment Impact', icon: GitCompare },
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
            initialMode={architectureMode}
            onModeChange={setArchitectureMode}
          />
        );
      // product-comparison is now the Compare sub-view inside Products; both render ProductsHub
      case 'products':
        return <ProductsHub onNavigate={handleNavigate} />;
      case 'product-comparison':
        return <ProductsHub onNavigate={handleNavigate} />;
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
        return <ProductsHub onNavigate={handleNavigate} />;
      case 'deployment-impact':
        return <DeploymentImpactView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-surface border-b border-edge">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-lg sm:text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2 min-w-0">
                  <span className="truncate">Red Hat AI Platform Explorer</span>
                  <span className="inline-block bg-accent w-[0.7em] h-[0.7em] rounded-sm flex-shrink-0" aria-hidden="true" />
                </h1>
                <p className="text-xs sm:text-sm text-muted hidden sm:block">
                  Interactive visualization of Red Hat's AI offerings
                </p>
              </div>
            </div>
            <span className="hidden sm:block text-[11px] leading-snug text-muted flex-shrink-0">
              created by{' '}
              <a
                href="https://www.linkedin.com/in/alexa-griffith/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-link underline-offset-2 hover:underline rounded-sm ${interactive.focusRing} ${interactive.transition}`}
              >
                Alexa Griffith
              </a>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`flex-shrink-0 p-2 rounded-card text-muted ${interactive.hoverTint} ${interactive.focusRing} ${interactive.transition}`}
            >
              {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Work-in-progress strip — quiet by design; the per-tab draft banner is the loud caution. */}
      <div className="bg-surface border-b border-hair">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-center gap-2 text-muted">
            <AlertCircle size={13} className="flex-shrink-0 text-accent" />
            <p className="text-xs font-medium text-center">
              Work in progress — content and features subject to change
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-surface border-b border-edge">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex gap-0.5 sm:gap-1 overflow-x-auto">
            {views.map((view) => {
              const Icon = view.icon;
              const active = currentView === view.id;
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
                  className={`flex items-center justify-center sm:justify-start gap-2 min-w-[44px] px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
                    active
                      ? 'border-accent text-link'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                  aria-label={view.name}
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
      <footer className="mt-12 py-6 border-t border-hair">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted">
          <p>Red Hat AI Platform Explorer • Prototype</p>
        </div>
      </footer>

      <AcronymGlossary />
    </div>
  );
}

export default App;
