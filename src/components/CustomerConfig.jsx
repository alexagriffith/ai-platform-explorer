import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import { products, thirdPartyOptions } from '../data/products';

export default function CustomerConfig({ customerEnv, setCustomerEnv, setSelectedProducts }) {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const updateEnv = (key, value) => {
    setCustomerEnv(prev => ({ ...prev, [key]: value }));
  };

  const generateRecommendations = () => {
    const recommended = products.filter(p => p.required).map(p => p.id);

    // Add recommendations based on customer environment
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

    setSelectedProducts([...new Set(recommended)]);
    setShowRecommendations(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Configure Customer Environment
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your customer's existing infrastructure and requirements to get personalized recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Existing Infrastructure */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            Existing Infrastructure
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.hasKubernetes}
                onChange={(e) => updateEnv('hasKubernetes', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Has Kubernetes</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.hasOpenShift}
                onChange={(e) => updateEnv('hasOpenShift', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Has OpenShift</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.hasGPUs}
                onChange={(e) => updateEnv('hasGPUs', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Has GPUs</span>
            </label>

            {customerEnv.hasGPUs && (
              <div className="ml-8 space-y-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300">GPU Type:</label>
                <select
                  value={customerEnv.gpuType || ''}
                  onChange={(e) => updateEnv('gpuType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                  <option value="">Select...</option>
                  <option value="nvidia">NVIDIA</option>
                  <option value="amd">AMD</option>
                  <option value="intel">Intel</option>
                  <option value="tpu">Google TPU</option>
                </select>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.hasApiGateway}
                onChange={(e) => updateEnv('hasApiGateway', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Has API Gateway</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.hasModelRegistry}
                onChange={(e) => updateEnv('hasModelRegistry', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Has Model Registry (MLflow, etc.)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.hasVectorDB}
                onChange={(e) => updateEnv('hasVectorDB', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Has Vector Database</span>
            </label>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-blue-600" />
            Requirements & Goals
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Use Case
              </label>
              <select
                value={customerEnv.useCase || ''}
                onChange={(e) => updateEnv('useCase', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="">Select...</option>
                <option value="inference">Model Inference/Serving</option>
                <option value="training">Model Training & Fine-tuning</option>
                <option value="full-stack">Full ML Lifecycle (Train + Serve)</option>
                <option value="experimentation">Experimentation & POCs</option>
                <option value="agentic">Agentic AI & Orchestration</option>
                <option value="rag">RAG (Retrieval Augmented Generation)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size
              </label>
              <select
                value={customerEnv.teamSize}
                onChange={(e) => updateEnv('teamSize', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="small">Small (1-10 people)</option>
                <option value="medium">Medium (10-50 people)</option>
                <option value="large">Large (50+ people)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deployment Model
              </label>
              <select
                value={customerEnv.deployment}
                onChange={(e) => updateEnv('deployment', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="cloud">Public Cloud</option>
                <option value="on-premise">On-Premise</option>
                <option value="hybrid">Hybrid Cloud</option>
                <option value="edge">Edge Computing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Scale
              </label>
              <select
                value={customerEnv.scale || 'medium'}
                onChange={(e) => updateEnv('scale', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="small">Small (&lt;100 req/sec)</option>
                <option value="medium">Medium (100-1000 req/sec)</option>
                <option value="large">Large (1000-10k req/sec)</option>
                <option value="enterprise">Enterprise (10k+ req/sec)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Models
              </label>
              <select
                value={customerEnv.modelCount || 'few'}
                onChange={(e) => updateEnv('modelCount', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="single">Single Model</option>
                <option value="few">Few Models (2-5)</option>
                <option value="many">Many Models (5-20)</option>
                <option value="extensive">Extensive (20+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workload Type
              </label>
              <select
                value={customerEnv.workloadType || 'inference'}
                onChange={(e) => updateEnv('workloadType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
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
      <div className="grid md:grid-cols-3 gap-6">
        {/* Compliance & Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compliance & Security
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.requiresCompliance || false}
                onChange={(e) => updateEnv('requiresCompliance', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Regulatory Compliance (HIPAA, SOC2, etc.)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.requiresAirGap || false}
                onChange={(e) => updateEnv('requiresAirGap', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Air-gapped Environment</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.requiresDataResidency || false}
                onChange={(e) => updateEnv('requiresDataResidency', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Data Residency Requirements</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.requiresModelGovernance || false}
                onChange={(e) => updateEnv('requiresModelGovernance', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Model Governance & Audit Trail</span>
            </label>
          </div>
        </div>

        {/* Integration & Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Integration & Data
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.needsDataPipeline || false}
                onChange={(e) => updateEnv('needsDataPipeline', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Data Pipeline Integration</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.needsCICD || false}
                onChange={(e) => updateEnv('needsCICD', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">CI/CD for ML Models</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.needsExperimentTracking || false}
                onChange={(e) => updateEnv('needsExperimentTracking', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Experiment Tracking</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.needsFeatureStore || false}
                onChange={(e) => updateEnv('needsFeatureStore', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Feature Store</span>
            </label>
          </div>
        </div>

        {/* Operations & Budget */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Operations & Budget
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeline
              </label>
              <select
                value={customerEnv.timeline || 'months'}
                onChange={(e) => updateEnv('timeline', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="weeks">Weeks (POC)</option>
                <option value="months">1-3 Months</option>
                <option value="quarter">3-6 Months</option>
                <option value="year">6+ Months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget Priority
              </label>
              <select
                value={customerEnv.budgetPriority || 'balanced'}
                onChange={(e) => updateEnv('budgetPriority', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="minimal">Cost Optimization</option>
                <option value="balanced">Balanced</option>
                <option value="performance">Performance First</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.needsMultiCluster || false}
                onChange={(e) => updateEnv('needsMultiCluster', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Multi-cluster Support</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerEnv.needsDisasterRecovery || false}
                onChange={(e) => updateEnv('needsDisasterRecovery', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Disaster Recovery</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generateRecommendations}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Sparkles size={20} />
          Generate Recommended Architecture
        </button>
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles size={24} className="text-purple-600" />
            Recommendations Generated
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Based on your customer's environment, we've updated the architecture view with recommended components.
            Switch to the <strong>Architecture</strong> tab to see the visualization!
          </p>
          <div className="bg-white dark:bg-gray-800 rounded p-4 text-sm">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Quick Summary:</p>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              {customerEnv.hasOpenShift && <li>✓ Customer has OpenShift - great foundation!</li>}
              {!customerEnv.hasOpenShift && <li>→ Will need OpenShift as the base platform</li>}
              {customerEnv.hasApiGateway && <li>✓ Can integrate with existing API Gateway</li>}
              {customerEnv.hasModelRegistry && <li>✓ Can use existing Model Registry</li>}
              {customerEnv.useCase && <li>→ Optimized for {customerEnv.useCase} use case</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
