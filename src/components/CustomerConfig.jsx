import { useState } from 'react';
import { Server, Settings, Sparkles, Copy, X } from 'lucide-react';
import { products, thirdPartyOptions } from '../data/products';
import { border, button, density, interactive, modal, text, typeScale } from '../lib/styleTokens';

function getSuggestedProductIds(customerEnv) {
  const recommended = products.filter((p) => p.required).map((p) => p.id);

  if (customerEnv.useCase === 'inference') {
    recommended.push('ai-inference');
    if (!customerEnv.hasApiGateway) {
      recommended.push('ai-gateway');
    }
  }

  if (customerEnv.useCase === 'training') {
    recommended.push('rhoai');
    if (!customerEnv.hasModelRegistry) {
      recommended.push('model-registry');
    }
  }

  if (customerEnv.useCase === 'full-stack') {
    recommended.push('rhoai', 'ai-inference', 'model-registry', 'trustyai', 'gen-ai-studio');
    if (!customerEnv.hasApiGateway) {
      recommended.push('ai-gateway');
    }
  }

  if (customerEnv.teamSize === 'large' || customerEnv.deployment === 'hybrid') {
    recommended.push('rhoai', 'trustyai');
  }

  if (customerEnv.teamSize === 'small' && customerEnv.deployment === 'on-premise') {
    recommended.push('rhel-ai');
  }

  return [...new Set(recommended)];
}

function productLabel(productId) {
  const p = products.find((x) => x.id === productId);
  if (p) return p.name;
  const t = thirdPartyOptions.find((x) => x.id === productId);
  if (t) return t.name;
  return productId;
}

function buildWorkshopCopyText(customerEnv, suggestedIds) {
  const lines = [
    'Workshop Suggestions',
    '',
    'Environment:',
    `- OpenShift: ${customerEnv.hasOpenShift ? 'yes' : 'no'}`,
    `- Kubernetes: ${customerEnv.hasKubernetes ? 'yes' : 'no'}`,
    `- GPUs: ${customerEnv.hasGPUs ? 'yes' : 'no'}`,
    `- API gateway: ${customerEnv.hasApiGateway ? 'yes' : 'no'}`,
    `- Model registry: ${customerEnv.hasModelRegistry ? 'yes' : 'no'}`,
    `- Use case: ${customerEnv.useCase || 'not set'}`,
    `- Team size: ${customerEnv.teamSize}`,
    `- Deployment: ${customerEnv.deployment}`,
    '',
    'Suggested products:',
    ...suggestedIds.map((id) => `- ${productLabel(id)}`),
    '',
    'Next: Build Your Stack → Architecture'
  ];
  return lines.join('\n');
}

export default function CustomerConfig({ customerEnv, setCustomerEnv }) {
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestedProductIds, setSuggestedProductIds] = useState([]);
  const [copyDone, setCopyDone] = useState(false);

  const updateEnv = (key, value) => {
    setCustomerEnv(prev => ({ ...prev, [key]: value }));
  };

  const openSuggestionPreview = () => {
    const ids = getSuggestedProductIds(customerEnv);
    setSuggestedProductIds(ids);
    setCopyDone(false);
    setShowSuggestionModal(true);
  };

  const copySuggestionText = async () => {
    const text = buildWorkshopCopyText(customerEnv, suggestedProductIds);
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
    } catch {
      setCopyDone(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div data-ui="card" className={`bg-surface rounded-card border ${border.hair} ${density.panelPad}`}>
        <h2 className={`font-bold text-lg ${text.ink} mb-1`}>
          Configure Customer Environment
        </h2>
        <p className={`${typeScale.secondary} ${text.muted}`}>
          Capture the customer&apos;s existing footprint and constraints. Use the preview to copy a draft checklist for
          the workshop — nothing here updates the architecture canvas automatically.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Existing Infrastructure */}
        <div data-ui="card" className={`bg-surface rounded-card border ${border.hair} ${density.panelPad}`}>
          <h3 className={`${typeScale.componentName} ${text.ink} mb-3 flex items-center gap-2`}>
            <Server size={16} className="text-faint" />
            Existing Infrastructure
          </h3>

          <div className={`space-y-3 divide-y ${border.divideHair}`}>
            <label className={`flex items-center gap-3 cursor-pointer pt-0 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.hasKubernetes}
                onChange={(e) => updateEnv('hasKubernetes', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Has Kubernetes</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer pt-3 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.hasOpenShift}
                onChange={(e) => updateEnv('hasOpenShift', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Has OpenShift</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer pt-3 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.hasGPUs}
                onChange={(e) => updateEnv('hasGPUs', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Has GPUs</span>
            </label>

            {customerEnv.hasGPUs && (
              <div className="ml-7 space-y-1 pt-2">
                <label className={`block ${typeScale.secondary} ${text.muted}`}>GPU Type:</label>
                <select
                  value={customerEnv.gpuType || ''}
                  onChange={(e) => updateEnv('gpuType', e.target.value)}
                  className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
                >
                  <option value="">Select...</option>
                  <option value="nvidia">NVIDIA</option>
                  <option value="amd">AMD</option>
                  <option value="intel">Intel</option>
                  <option value="tpu">Google TPU</option>
                </select>
              </div>
            )}

            <label className={`flex items-center gap-3 cursor-pointer pt-3 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.hasApiGateway}
                onChange={(e) => updateEnv('hasApiGateway', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Has API Gateway</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer pt-3 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.hasModelRegistry}
                onChange={(e) => updateEnv('hasModelRegistry', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Has Model Registry (MLflow, etc.)</span>
            </label>

            <label className={`flex items-center gap-3 cursor-pointer pt-3 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.hasVectorDB}
                onChange={(e) => updateEnv('hasVectorDB', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Has Vector Database</span>
            </label>
          </div>
        </div>

        {/* Requirements */}
        <div data-ui="card" className={`bg-surface rounded-card border ${border.hair} ${density.panelPad}`}>
          <h3 className={`${typeScale.componentName} ${text.ink} mb-3 flex items-center gap-2`}>
            <Settings size={16} className="text-faint" />
            Requirements &amp; Goals
          </h3>

          <div className={`space-y-3 divide-y ${border.divideHair}`}>
            <div>
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Primary Use Case
              </label>
              <select
                value={customerEnv.useCase || ''}
                onChange={(e) => updateEnv('useCase', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="">Select...</option>
                <option value="inference">Model Inference/Serving</option>
                <option value="training">Model Training &amp; Fine-tuning</option>
                <option value="full-stack">Full ML Lifecycle (Train + Serve)</option>
                <option value="experimentation">Experimentation &amp; POCs</option>
                <option value="agentic">Agentic AI &amp; Orchestration</option>
                <option value="rag">Retrieval Augmented Generation (RAG)</option>
              </select>
            </div>

            <div className="pt-3">
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Team Size
              </label>
              <select
                value={customerEnv.teamSize}
                onChange={(e) => updateEnv('teamSize', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="small">Small (1–10 people)</option>
                <option value="medium">Medium (10–50 people)</option>
                <option value="large">Large (50+ people)</option>
              </select>
            </div>

            <div className="pt-3">
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Deployment Model
              </label>
              <select
                value={customerEnv.deployment}
                onChange={(e) => updateEnv('deployment', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="cloud">Public Cloud</option>
                <option value="on-premise">On-Premise</option>
                <option value="hybrid">Hybrid Cloud</option>
                <option value="edge">Edge Computing</option>
              </select>
            </div>

            <div className="pt-3">
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Expected Scale
              </label>
              <select
                value={customerEnv.scale || 'medium'}
                onChange={(e) => updateEnv('scale', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="small">Small (&lt;100 req/sec)</option>
                <option value="medium">Medium (100–1,000 req/sec)</option>
                <option value="large">Large (1,000–10k req/sec)</option>
                <option value="enterprise">Enterprise (10k+ req/sec)</option>
              </select>
            </div>

            <div className="pt-3">
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Number of Models
              </label>
              <select
                value={customerEnv.modelCount || 'few'}
                onChange={(e) => updateEnv('modelCount', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="single">Single Model</option>
                <option value="few">Few (2–5)</option>
                <option value="many">Many (5–20)</option>
                <option value="extensive">Extensive (20+)</option>
              </select>
            </div>

            <div className="pt-3">
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Workload Type
              </label>
              <select
                value={customerEnv.workloadType || 'inference'}
                onChange={(e) => updateEnv('workloadType', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="inference">Inference Only</option>
                <option value="training">Training Only</option>
                <option value="mixed">Mixed (50/50)</option>
                <option value="training-heavy">Training Heavy (70/30)</option>
                <option value="inference-heavy">Inference Heavy (70/30)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Requirements */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Compliance & Security */}
        <div data-ui="card" className={`bg-surface rounded-card border ${border.hair} ${density.panelPad}`}>
          <h3 className={`${typeScale.componentName} ${text.ink} mb-3`}>
            Compliance &amp; Security
          </h3>
          <div className={`space-y-2 divide-y ${border.divideHair}`}>
            <label className={`flex items-center gap-2 cursor-pointer pt-0 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.requiresCompliance || false}
                onChange={(e) => updateEnv('requiresCompliance', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Regulatory Compliance (HIPAA, SOC2)</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.requiresAirGap || false}
                onChange={(e) => updateEnv('requiresAirGap', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Air-gapped Environment</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.requiresDataResidency || false}
                onChange={(e) => updateEnv('requiresDataResidency', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Data Residency Requirements</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.requiresModelGovernance || false}
                onChange={(e) => updateEnv('requiresModelGovernance', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Model Governance &amp; Audit Trail</span>
            </label>
          </div>
        </div>

        {/* Integration & Data */}
        <div data-ui="card" className={`bg-surface rounded-card border ${border.hair} ${density.panelPad}`}>
          <h3 className={`${typeScale.componentName} ${text.ink} mb-3`}>
            Integration &amp; Data
          </h3>
          <div className={`space-y-2 divide-y ${border.divideHair}`}>
            <label className={`flex items-center gap-2 cursor-pointer pt-0 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.needsDataPipeline || false}
                onChange={(e) => updateEnv('needsDataPipeline', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Data Pipeline Integration</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.needsCICD || false}
                onChange={(e) => updateEnv('needsCICD', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>CI/CD for ML Models</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.needsExperimentTracking || false}
                onChange={(e) => updateEnv('needsExperimentTracking', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Experiment Tracking</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.needsFeatureStore || false}
                onChange={(e) => updateEnv('needsFeatureStore', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Feature Store</span>
            </label>
          </div>
        </div>

        {/* Operations & Budget */}
        <div data-ui="card" className={`bg-surface rounded-card border ${border.hair} ${density.panelPad}`}>
          <h3 className={`${typeScale.componentName} ${text.ink} mb-3`}>
            Operations &amp; Budget
          </h3>
          <div className={`space-y-3 divide-y ${border.divideHair}`}>
            <div>
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Timeline
              </label>
              <select
                value={customerEnv.timeline || 'months'}
                onChange={(e) => updateEnv('timeline', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="weeks">Weeks (POC)</option>
                <option value="months">1–3 Months</option>
                <option value="quarter">3–6 Months</option>
                <option value="year">6+ Months</option>
              </select>
            </div>
            <div className="pt-3">
              <label className={`block ${typeScale.secondary} font-medium ${text.muted} mb-1`}>
                Budget Priority
              </label>
              <select
                value={customerEnv.budgetPriority || 'balanced'}
                onChange={(e) => updateEnv('budgetPriority', e.target.value)}
                className={`w-full px-3 py-1.5 bg-page border ${border.hair} rounded-card ${text.ink} ${typeScale.secondary} ${interactive.transition} ${interactive.focusRing}`}
              >
                <option value="minimal">Cost Optimization</option>
                <option value="balanced">Balanced</option>
                <option value="performance">Performance First</option>
              </select>
            </div>
            <label className={`flex items-center gap-2 cursor-pointer pt-3 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.needsMultiCluster || false}
                onChange={(e) => updateEnv('needsMultiCluster', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Multi-cluster Support</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer pt-2 ${interactive.transition}`}>
              <input
                type="checkbox"
                checked={customerEnv.needsDisasterRecovery || false}
                onChange={(e) => updateEnv('needsDisasterRecovery', e.target.checked)}
                className={`w-4 h-4 rounded border-edge text-accent ${interactive.focusRing}`}
              />
              <span className={`${typeScale.secondary} ${text.ink}`}>Disaster Recovery</span>
            </label>
          </div>
        </div>
      </div>

      {/* Suggestion preview */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={openSuggestionPreview}
          className={`${button.primary} ${interactive.microElevate}`}
        >
          <Sparkles size={16} />
          Preview workshop suggestions
        </button>
      </div>

      <p className={`text-center ${typeScale.secondary} ${text.faint} max-w-xl mx-auto`}>
        Opens a modal with a plain-text summary you can copy into notes. Build Your Stack is unchanged — record
        architecture choices there when you are ready.
      </p>

      {showSuggestionModal && (
        <div
          data-ui="overlay"
          className={modal.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggestion-modal-title"
          onClick={() => setShowSuggestionModal(false)}
        >
          <div
            data-ui="card"
            className="bg-surface rounded-card max-w-lg w-full max-h-[90vh] overflow-y-auto border border-edge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b border-hair">
              <div>
                <h3 id="suggestion-modal-title" className={`text-lg font-bold ${text.ink}`}>
                  Suggestion preview
                </h3>
                <p className={`text-sm ${text.muted} mt-1`}>
                  Draft only — for facilitator notes. Does not update Build Your Stack or the Products tab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuggestionModal(false)}
                className={`p-2 rounded-card ${text.faint} hover:bg-tint ${interactive.transition} ${interactive.focusRing}`}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="rounded-card bg-draft-bg border border-draft-border p-3 text-sm text-draft-fg">
                Work in progress: heuristics are intentionally simple. Treat this as a conversation starter, not an
                automated design.
              </div>

              <div>
                <p className={`text-sm font-semibold ${text.ink} mb-2`}>Suggested products to discuss</p>
                <ul className={`space-y-1 text-sm ${text.muted}`}>
                  {suggestedProductIds.map((id) => (
                    <li key={id}>• {productLabel(id)}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className={`text-sm font-semibold ${text.ink} mb-2`}>Context summary</p>
                <ul className={`space-y-1 text-sm ${text.muted}`}>
                  {customerEnv.hasOpenShift && <li>✓ OpenShift in environment</li>}
                  {!customerEnv.hasOpenShift && <li>→ OpenShift called out as a typical base to validate</li>}
                  {customerEnv.hasApiGateway && <li>✓ Existing API gateway noted</li>}
                  {!customerEnv.hasApiGateway && customerEnv.useCase === 'inference' && (
                    <li>→ Gateway may warrant discussion for inference paths</li>
                  )}
                  {customerEnv.hasModelRegistry && <li>✓ Model registry present</li>}
                  {customerEnv.useCase && <li>→ Use case set to: {customerEnv.useCase}</li>}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={copySuggestionText}
                  className={button.primary}
                >
                  <Copy size={16} />
                  Copy full text
                </button>
                {copyDone && <span className="text-sm text-green-600 self-center">Copied.</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
