import { useState } from 'react';
import { GitBranch, ArrowRight, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export default function DecisionFlowchart() {
  const [selectedDecision, setSelectedDecision] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const decisionFlows = {
    product: {
      title: 'Which Red Hat AI Product Should I Use?',
      description: 'Find the right Red Hat AI product for your needs',
      steps: [
        {
          question: 'What is your primary deployment target?',
          options: [
            { value: 'single-server', label: 'Single Server / Workstation', next: 1 },
            { value: 'kubernetes', label: 'Kubernetes / OpenShift Cluster', next: 2 },
            { value: 'both', label: 'Both / Not Sure', next: 3 }
          ]
        },
        {
          question: 'Do you need to fine-tune models?',
          condition: { step: 0, value: 'single-server' },
          options: [
            { value: 'yes', label: 'Yes, fine-tuning is critical', recommendation: 'RHEL AI' },
            { value: 'no', label: 'No, just inference', recommendation: 'RHEL AI' }
          ],
          recommendation: {
            product: 'Red Hat Enterprise Linux AI',
            why: 'RHEL AI is optimized for single-server deployments with built-in InstructLab for fine-tuning',
            tradeoffs: [
              { pro: 'Simple setup on individual servers', con: 'Limited to single-node scaling' },
              { pro: 'Includes InstructLab for fine-tuning', con: 'Not ideal for distributed workloads' }
            ]
          }
        },
        {
          question: 'What is your team size and use case?',
          condition: { step: 0, value: 'kubernetes' },
          options: [
            { value: 'small-inference', label: 'Small team, mainly inference', next: 4 },
            { value: 'large-mlops', label: 'Large team, full MLOps lifecycle', next: 5 },
            { value: 'enterprise', label: 'Enterprise-wide AI initiative', next: 6 }
          ]
        },
        {
          question: 'Do you already have OpenShift?',
          condition: { step: 0, value: 'both' },
          options: [
            { value: 'yes', label: 'Yes, OpenShift is already deployed', recommendation: 'RHOAI' },
            { value: 'no', label: 'No OpenShift yet', recommendation: 'RHAIE' },
            { value: 'dont-know', label: 'Not sure / Need to check', next: 2 }
          ]
        },
        {
          question: 'Do you need distributed training or just serving?',
          condition: { step: 2, value: 'small-inference' },
          options: [
            { value: 'serving', label: 'Mainly model serving', recommendation: 'AI-Inference' },
            { value: 'both', label: 'Both training and serving', recommendation: 'RHOAI' }
          ]
        },
        {
          question: 'Do you have existing OpenShift?',
          condition: { step: 2, value: 'large-mlops' },
          options: [
            { value: 'yes', label: 'Yes', recommendation: 'RHOAI' },
            { value: 'no', label: 'No', recommendation: 'RHAIE' }
          ]
        },
        {
          question: 'Procurement preference?',
          condition: { step: 2, value: 'enterprise' },
          options: [
            { value: 'bundled', label: 'Prefer single SKU / bundled', recommendation: 'RHAIE' },
            { value: 'separate', label: 'Prefer separate components', recommendation: 'RHOAI+OpenShift' }
          ],
          recommendation: {
            product: 'Red Hat AI Enterprise (RHAIE)',
            why: 'RHAIE provides everything in one package: OpenShift + OpenShift AI + InstructLab',
            tradeoffs: [
              { pro: 'Simplified procurement', con: 'Less flexibility in component selection' },
              { pro: 'Pre-integrated stack', con: 'May include components you don\'t need' }
            ]
          }
        }
      ],
      recommendations: {
        'RHEL AI': {
          product: 'Red Hat Enterprise Linux AI',
          icon: '🖥️',
          why: 'Optimized for single-server deployments with built-in model serving and fine-tuning',
          bestFor: ['Small teams', 'Getting started', 'Edge deployments', 'Fine-tuning workloads'],
          tradeoffs: [
            { pro: 'Simple setup and management', con: 'Limited to single-node' },
            { pro: 'Includes InstructLab', con: 'No distributed training' },
            { pro: 'Lower barrier to entry', con: 'Harder to scale to production' }
          ],
          alternatives: ['For distributed: OpenShift AI', 'For cloud-native: Kubernetes-based solutions']
        },
        'RHOAI': {
          product: 'Red Hat OpenShift AI',
          icon: '☸️',
          why: 'Full ML lifecycle platform for teams that need distributed workloads and production MLOps',
          bestFor: ['Large teams', 'Production ML', 'Distributed training', 'Multi-model serving'],
          tradeoffs: [
            { pro: 'Full MLOps lifecycle', con: 'Requires OpenShift knowledge' },
            { pro: 'Distributed workloads', con: 'More complex setup' },
            { pro: 'Production-grade', con: 'Higher resource requirements' }
          ],
          alternatives: ['For single-server: RHEL AI', 'For bundled: RHAIE']
        },
        'RHAIE': {
          product: 'Red Hat AI Enterprise',
          icon: '🎁',
          why: 'Complete integrated platform: OpenShift + OpenShift AI + InstructLab in one SKU',
          bestFor: ['Enterprise initiatives', 'Simplified procurement', 'Complete platform'],
          tradeoffs: [
            { pro: 'Everything bundled', con: 'Less component flexibility' },
            { pro: 'Single support contract', con: 'May include unused components' },
            { pro: 'Simplified billing', con: 'Fixed configuration' }
          ],
          alternatives: ['For flexibility: OpenShift + OpenShift AI separately']
        },
        'AI-Inference': {
          product: 'Red Hat AI Inference Server',
          icon: '⚡',
          why: 'High-performance vLLM-based serving optimized for LLMs',
          bestFor: ['Inference-only', 'High throughput', 'LLM serving', 'Production APIs'],
          tradeoffs: [
            { pro: 'Optimized for inference', con: 'No training capabilities' },
            { pro: 'High performance', con: 'Specialized use case' },
            { pro: 'vLLM integration', con: 'Limited to serving workloads' }
          ],
          alternatives: ['For full lifecycle: OpenShift AI', 'For training: RHOAI']
        },
        'RHOAI+OpenShift': {
          product: 'OpenShift + OpenShift AI (Separate)',
          icon: '🔧',
          why: 'Maximum flexibility - buy components separately based on your needs',
          bestFor: ['Custom configurations', 'Existing OpenShift', 'Incremental adoption'],
          tradeoffs: [
            { pro: 'Component flexibility', con: 'Multiple procurement items' },
            { pro: 'Pay for what you use', con: 'More complex licensing' },
            { pro: 'Incremental adoption', con: 'Requires integration knowledge' }
          ],
          alternatives: ['For simplicity: RHAIE bundled']
        }
      }
    },
    deployment: {
      title: 'Where Should I Deploy My AI Workloads?',
      description: 'Choose the right deployment model',
      steps: [
        {
          question: 'What are your data residency requirements?',
          options: [
            { value: 'strict', label: 'Must stay on-premises (compliance, air-gap)', next: 1 },
            { value: 'flexible', label: 'Can use public cloud', next: 2 },
            { value: 'hybrid', label: 'Need both', next: 3 }
          ]
        },
        {
          question: 'What is your scale?',
          condition: { step: 0, value: 'strict' },
          options: [
            { value: 'small', label: 'Small scale (few servers)', recommendation: 'on-prem-small' },
            { value: 'large', label: 'Large scale (data center)', recommendation: 'on-prem-large' }
          ]
        },
        {
          question: 'Primary workload type?',
          condition: { step: 0, value: 'flexible' },
          options: [
            { value: 'inference', label: 'Mainly inference', recommendation: 'cloud-inference' },
            { value: 'training', label: 'Training and experimentation', recommendation: 'cloud-training' },
            { value: 'both', label: 'Both training and inference', recommendation: 'cloud-both' }
          ]
        },
        {
          question: 'Which workloads need to stay on-prem?',
          condition: { step: 0, value: 'hybrid' },
          options: [
            { value: 'training', label: 'Training (sensitive data)', recommendation: 'hybrid-train-onprem' },
            { value: 'inference', label: 'Inference (low latency)', recommendation: 'hybrid-inference-onprem' }
          ]
        }
      ],
      recommendations: {
        'on-prem-small': {
          product: 'On-Premises (Small Scale)',
          icon: '🏢',
          why: 'RHEL AI on individual servers or small OpenShift cluster',
          bestFor: ['Compliance requirements', 'Air-gapped environments', 'Edge deployments'],
          tradeoffs: [
            { pro: 'Full data control', con: 'Limited scalability' },
            { pro: 'No cloud costs', con: 'Hardware procurement needed' },
            { pro: 'Low latency', con: 'Maintenance burden' }
          ],
          alternatives: ['For scale: Larger on-prem cluster', 'For flexibility: Hybrid cloud']
        },
        'on-prem-large': {
          product: 'On-Premises Data Center',
          icon: '🏭',
          why: 'OpenShift AI on your own infrastructure for large-scale workloads',
          bestFor: ['Large enterprises', 'Strict compliance', 'High-volume training'],
          tradeoffs: [
            { pro: 'Complete control', con: 'High CapEx' },
            { pro: 'Maximum security', con: 'Complex management' },
            { pro: 'Predictable costs', con: 'Slower to scale' }
          ],
          alternatives: ['Hybrid for burst capacity', 'Managed OpenShift on cloud']
        },
        'cloud-inference': {
          product: 'Public Cloud (Inference)',
          icon: '☁️',
          why: 'Managed OpenShift on AWS/Azure/GCP with AI Inference Server',
          bestFor: ['Production APIs', 'Global reach', 'Variable load'],
          tradeoffs: [
            { pro: 'Global availability', con: 'Network latency' },
            { pro: 'Auto-scaling', con: 'Cloud egress costs' },
            { pro: 'Managed infrastructure', con: 'Data transfer costs' }
          ],
          alternatives: ['On-prem for data residency', 'Edge for ultra-low latency']
        },
        'cloud-training': {
          product: 'Public Cloud (Training)',
          icon: '🧪',
          why: 'Cloud-based OpenShift AI for experimentation and model development',
          bestFor: ['Experimentation', 'Bursty workloads', 'Startups'],
          tradeoffs: [
            { pro: 'Access to latest GPUs', con: 'Expensive for sustained use' },
            { pro: 'No upfront investment', con: 'Vendor lock-in risk' },
            { pro: 'Fast provisioning', con: 'Data transfer costs' }
          ],
          alternatives: ['On-prem for cost optimization', 'Hybrid for flexibility']
        },
        'cloud-both': {
          product: 'Public Cloud (Full Lifecycle)',
          icon: '🔄',
          why: 'Complete ML platform in the cloud with OpenShift AI',
          bestFor: ['Cloud-native teams', 'Rapid iteration', 'Global deployment'],
          tradeoffs: [
            { pro: 'End-to-end platform', con: 'Higher ongoing costs' },
            { pro: 'Fully managed', con: 'Less control' },
            { pro: 'Easy collaboration', con: 'Compliance considerations' }
          ],
          alternatives: ['Hybrid for cost/compliance balance']
        },
        'hybrid-train-onprem': {
          product: 'Hybrid (Training On-Prem, Inference Cloud)',
          icon: '🔀',
          why: 'Train on sensitive data on-prem, deploy models to cloud for serving',
          bestFor: ['Regulated industries', 'Cost optimization', 'Best of both worlds'],
          tradeoffs: [
            { pro: 'Data stays secure', con: 'Complex networking' },
            { pro: 'Cloud scale for serving', con: 'Multiple environments to manage' },
            { pro: 'Optimized costs', con: 'Model transfer overhead' }
          ],
          alternatives: ['Full on-prem for simplicity', 'Full cloud if allowed']
        },
        'hybrid-inference-onprem': {
          product: 'Hybrid (Inference On-Prem/Edge)',
          icon: '🌐',
          why: 'Train in cloud, deploy inference close to users or on edge',
          bestFor: ['Low latency requirements', 'Edge AI', 'Manufacturing'],
          tradeoffs: [
            { pro: 'Ultra-low latency', con: 'Distributed management' },
            { pro: 'Works offline', con: 'Model sync complexity' },
            { pro: 'Local data processing', con: 'Limited compute per location' }
          ],
          alternatives: ['Cloud-only for simplicity', 'Full edge for offline capability']
        }
      }
    },
    architecture: {
      title: 'How Should I Architect My AI Solution?',
      description: 'Design your technical architecture',
      steps: [
        {
          question: 'What is your primary use case?',
          options: [
            { value: 'inference', label: 'Model inference/serving', next: 1 },
            { value: 'training', label: 'Model training', next: 2 },
            { value: 'full', label: 'Full ML lifecycle', next: 3 },
            { value: 'rag', label: 'RAG (Retrieval Augmented Generation)', next: 4 }
          ]
        },
        {
          question: 'Do you need multi-model serving?',
          condition: { step: 0, value: 'inference' },
          options: [
            { value: 'single', label: 'Single model', recommendation: 'simple-inference' },
            { value: 'multi', label: 'Multiple models', recommendation: 'complex-inference' }
          ]
        },
        {
          question: 'Training scale?',
          condition: { step: 0, value: 'training' },
          options: [
            { value: 'single', label: 'Single GPU / Small scale', recommendation: 'simple-training' },
            { value: 'distributed', label: 'Distributed training', recommendation: 'distributed-training' }
          ]
        },
        {
          question: 'Team size and governance needs?',
          condition: { step: 0, value: 'full' },
          options: [
            { value: 'small', label: 'Small team, minimal governance', recommendation: 'simple-mlops' },
            { value: 'enterprise', label: 'Enterprise, strict governance', recommendation: 'enterprise-mlops' }
          ]
        },
        {
          question: 'What is your data source?',
          condition: { step: 0, value: 'rag' },
          options: [
            { value: 'documents', label: 'Documents and files', recommendation: 'rag-documents' },
            { value: 'database', label: 'Existing databases', recommendation: 'rag-database' },
            { value: 'both', label: 'Multiple sources', recommendation: 'rag-complex' }
          ]
        }
      ],
      recommendations: {
        'simple-inference': {
          product: 'Simple Inference Architecture',
          icon: '⚡',
          why: 'Minimal setup for single-model serving',
          bestFor: ['Single model', 'Simple APIs', 'Getting started'],
          components: ['AI Inference Server', 'API Gateway (optional)', 'OpenShift (base)'],
          tradeoffs: [
            { pro: 'Simple to set up', con: 'Limited to one model' },
            { pro: 'Low overhead', con: 'No A/B testing' },
            { pro: 'Easy to understand', con: 'Manual model updates' }
          ],
          alternatives: ['For multiple models: Complex inference', 'For training too: Full MLOps']
        },
        'complex-inference': {
          product: 'Multi-Model Inference Architecture',
          icon: '🎯',
          why: 'Serve multiple models with routing and versioning',
          bestFor: ['Multiple models', 'A/B testing', 'Production serving'],
          components: ['KServe/ModelMesh', 'Model Registry', 'API Gateway', 'Observability', 'OpenShift AI'],
          tradeoffs: [
            { pro: 'Multi-model support', con: 'More complex setup' },
            { pro: 'A/B testing', con: 'Higher resource usage' },
            { pro: 'Version management', con: 'Requires ModelOps practices' }
          ],
          alternatives: ['For simplicity: Single model', 'For training: Full lifecycle']
        },
        'simple-training': {
          product: 'Simple Training Setup',
          icon: '🧪',
          why: 'Single-node training for experimentation',
          bestFor: ['Experimentation', 'Fine-tuning', 'Small datasets'],
          components: ['RHEL AI or JupyterHub', 'Model Registry (optional)', 'GPU node'],
          tradeoffs: [
            { pro: 'Quick to start', con: 'Limited to single GPU' },
            { pro: 'Low complexity', con: 'Slow for large models' },
            { pro: 'Easy debugging', con: 'No distributed training' }
          ],
          alternatives: ['For scale: Distributed training', 'For production: Full MLOps']
        },
        'distributed-training': {
          product: 'Distributed Training Architecture',
          icon: '🚀',
          why: 'Multi-node training for large models and datasets',
          bestFor: ['Large models', 'Big datasets', 'Production training'],
          components: ['OpenShift AI Distributed Workloads', 'Model Registry', 'Data Science Pipelines', 'Object Storage'],
          tradeoffs: [
            { pro: 'Handles large scale', con: 'Complex orchestration' },
            { pro: 'Faster training', con: 'Higher costs' },
            { pro: 'Production-grade', con: 'Steeper learning curve' }
          ],
          alternatives: ['For small scale: Simple training', 'For serving too: Full lifecycle']
        },
        'simple-mlops': {
          product: 'Basic MLOps Platform',
          icon: '🔄',
          why: 'Train and serve with minimal governance overhead',
          bestFor: ['Small teams', 'Startups', 'Rapid iteration'],
          components: ['OpenShift AI', 'Model Registry', 'KServe', 'Basic monitoring'],
          tradeoffs: [
            { pro: 'End-to-end platform', con: 'Limited governance' },
            { pro: 'Fast iteration', con: 'Manual processes' },
            { pro: 'Lower overhead', con: 'Compliance gaps' }
          ],
          alternatives: ['For governance: Enterprise MLOps', 'For inference only: Simple serving']
        },
        'enterprise-mlops': {
          product: 'Enterprise MLOps Platform',
          icon: '🏢',
          why: 'Complete platform with governance, compliance, and audit trails',
          bestFor: ['Large enterprises', 'Regulated industries', 'Strict governance'],
          components: ['OpenShift AI', 'Model Registry', 'TrustyAI', 'Pipelines', 'Observability', 'API Gateway'],
          tradeoffs: [
            { pro: 'Full governance', con: 'Complex setup' },
            { pro: 'Audit trails', con: 'Slower to change' },
            { pro: 'Compliance-ready', con: 'Higher overhead' }
          ],
          alternatives: ['For simplicity: Basic MLOps', 'For specific needs: Build custom']
        },
        'rag-documents': {
          product: 'RAG Architecture (Documents)',
          icon: '📚',
          why: 'Process documents and provide contextual answers',
          bestFor: ['Document Q&A', 'Knowledge bases', 'Support chatbots'],
          components: ['Vector DB (Elastic)', 'LLM Serving', 'Document processing pipeline', 'Embedding model'],
          tradeoffs: [
            { pro: 'Accurate retrieval', con: 'Document processing overhead' },
            { pro: 'Source attribution', con: 'Storage for embeddings' },
            { pro: 'Easy to update knowledge', con: 'Chunking complexity' }
          ],
          alternatives: ['For structured data: RAG with databases', 'For fine-tuning: InstructLab']
        },
        'rag-database': {
          product: 'RAG Architecture (Databases)',
          icon: '🗄️',
          why: 'Query structured data with natural language',
          bestFor: ['Database queries', 'Analytics', 'Business intelligence'],
          components: ['Vector DB', 'LLM Serving', 'Database connectors', 'SQL generation'],
          tradeoffs: [
            { pro: 'Structured queries', con: 'Schema knowledge needed' },
            { pro: 'Real-time data', con: 'Connection management' },
            { pro: 'Accurate for structured data', con: 'Limited to DB schema' }
          ],
          alternatives: ['For documents: Document RAG', 'For both: Complex RAG']
        },
        'rag-complex': {
          product: 'Advanced RAG Architecture',
          icon: '🌐',
          why: 'Multi-source RAG with sophisticated retrieval',
          bestFor: ['Enterprise search', 'Multi-source knowledge', 'Complex queries'],
          components: ['Vector DB', 'MCP for tool integration', 'LLM Serving', 'Multi-source connectors', 'Re-ranking'],
          tradeoffs: [
            { pro: 'Comprehensive knowledge', con: 'High complexity' },
            { pro: 'Best accuracy', con: 'More moving parts' },
            { pro: 'Flexible sources', con: 'Higher latency' }
          ],
          alternatives: ['For simpler: Single-source RAG', 'For fine-tuning: InstructLab instead']
        }
      }
    }
  };

  const handleAnswer = (value, next) => {
    const newAnswers = { ...userAnswers, [currentStep]: value };
    setUserAnswers(newAnswers);

    if (next !== undefined) {
      setCurrentStep(next);
    } else {
      // End of flow - handled by recommendation
    }
  };

  const resetFlow = () => {
    setCurrentStep(0);
    setUserAnswers({});
  };

  const getCurrentFlow = () => {
    if (!selectedDecision || !decisionFlows[selectedDecision]) return null;
    return decisionFlows[selectedDecision];
  };

  const flow = getCurrentFlow();
  const currentFlowStep = flow?.steps[currentStep];

  // Check if we should show a recommendation
  const getRecommendation = () => {
    if (!currentFlowStep) return null;

    const selectedOption = currentFlowStep.options?.find(
      opt => opt.value === userAnswers[currentStep]
    );

    if (selectedOption?.recommendation && flow.recommendations[selectedOption.recommendation]) {
      return flow.recommendations[selectedOption.recommendation];
    }

    if (currentFlowStep.recommendation) {
      return currentFlowStep.recommendation;
    }

    return null;
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <GitBranch size={24} className="text-purple-600" />
        Decision Flowchart
      </h3>

      {!selectedDecision ? (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select the type of decision you need help with:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(decisionFlows).map(([key, flowData]) => (
              <button
                key={key}
                onClick={() => setSelectedDecision(key)}
                className="p-4 text-left rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  {flowData.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {flowData.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{flow.title}</h4>
              <button
                onClick={() => {
                  setSelectedDecision('');
                  resetFlow();
                }}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Change Decision Type
              </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / flow.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {!recommendation ? (
            /* Question */
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-3">
                  <HelpCircle size={24} className="text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Step {currentStep + 1}: {currentFlowStep?.question}
                    </p>
                    <div className="space-y-2">
                      {currentFlowStep?.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(option.value, option.next)}
                          className="w-full p-3 text-left rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 bg-white dark:bg-gray-800 transition-all hover:shadow-md"
                        >
                          <div className="flex items-center gap-2">
                            <ArrowRight size={16} className="text-purple-600" />
                            <span className="text-gray-900 dark:text-white">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Back button */}
              {currentStep > 0 && (
                <button
                  onClick={() => {
                    const newAnswers = { ...userAnswers };
                    delete newAnswers[currentStep];
                    setUserAnswers(newAnswers);
                    setCurrentStep(currentStep - 1);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                >
                  ← Go Back
                </button>
              )}
            </div>
          ) : (
            /* Recommendation */
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-500 dark:border-green-600">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{recommendation.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={24} className="text-green-600" />
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {recommendation.product}
                      </h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      <strong>Why:</strong> {recommendation.why}
                    </p>
                    {recommendation.bestFor && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Best for:</p>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.bestFor.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {recommendation.components && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Key components:</p>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.components.map((comp, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tradeoffs */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                    <h5 className="font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                      <CheckCircle size={16} />
                      Advantages
                    </h5>
                    <ul className="space-y-1 text-sm">
                      {recommendation.tradeoffs.map((t, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                          <span className="text-green-600">✓</span>
                          <span>{t.pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                    <h5 className="font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                      <XCircle size={16} />
                      Tradeoffs
                    </h5>
                    <ul className="space-y-1 text-sm">
                      {recommendation.tradeoffs.map((t, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                          <span className="text-orange-600">!</span>
                          <span>{t.con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Alternatives */}
                {recommendation.alternatives && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Alternative options:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {recommendation.alternatives.map((alt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetFlow}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    setSelectedDecision('');
                    resetFlow();
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Try Different Decision
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
