import { useState } from 'react';
import { Cpu, Zap, GitBranch, Database, ArrowRight, CheckCircle, XCircle, Info } from 'lucide-react';

export default function TrainingDeepDive() {
  const [expandedSection, setExpandedSection] = useState('workflow');

  const trainingWorkflow = [
    {
      step: 'Data Preparation',
      description: 'Load and preprocess datasets',
      tools: ['S3-compatible storage', 'Data Science Pipelines']
    },
    {
      step: 'Environment Setup',
      description: 'Configure notebooks and dependencies',
      tools: ['JupyterHub Workbenches', 'Custom images']
    },
    {
      step: 'Training Execution',
      description: 'Run distributed training jobs',
      tools: ['Ray', 'Training Operator', 'CodeFlare']
    },
    {
      step: 'Evaluation',
      description: 'Test model performance',
      tools: ['Evaluation pipelines', 'MMLU', 'HumanEval']
    },
    {
      step: 'Registration',
      description: 'Version and store trained model',
      tools: ['Model Registry', 'Metadata tracking']
    }
  ];

  const trainingVsInference = [
    {
      aspect: 'Workload Type',
      training: 'Long-running batch process',
      inference: 'Low-latency real-time execution'
    },
    {
      aspect: 'Goal',
      training: 'Adjust model parameters based on data',
      inference: 'Execute pre-trained model for predictions'
    },
    {
      aspect: 'GPU Usage',
      training: 'High memory, sustained compute (A100, H100)',
      inference: 'Optimized for throughput/latency (A10G, L40S)'
    },
    {
      aspect: 'Duration',
      training: 'Hours to days',
      inference: 'Milliseconds to seconds'
    },
    {
      aspect: 'Parallelism',
      training: 'Data + Tensor parallelism across nodes',
      inference: 'Batch processing, continuous batching'
    }
  ];

  const decisionMatrix = [
    {
      choose: 'RHEL AI',
      when: 'Single-server, out-of-the-box environment for LAB-tuning foundation models',
      bestFor: 'Edge deployments, getting started, simple fine-tuning'
    },
    {
      choose: 'RHOAI Distributed Workloads',
      when: 'Enterprise-scale training jobs across clusters of multiple GPUs/nodes',
      bestFor: 'Large models (70B+ params), multi-node distributed training'
    },
    {
      choose: 'InstructLab',
      when: 'Improve model skills or domain knowledge using taxonomy-driven approach',
      bestFor: 'Limited training data, synthetic data generation, SME-driven improvement'
    },
    {
      choose: 'Custom Infrastructure',
      when: 'Specialized, air-gapped, or highly specific hardware configurations',
      bestFor: 'Unique requirements not met by standard SKUs'
    }
  ];

  const hardwareComparison = [
    {
      gpu: 'NVIDIA H100',
      memory: '80GB HBM3',
      bestFor: 'Training largest models (70B-175B+ params)',
      cost: 'Highest',
      performance: 'Maximum'
    },
    {
      gpu: 'NVIDIA A100',
      memory: '40GB / 80GB',
      bestFor: 'Medium to large model training (7B-70B params)',
      cost: 'High',
      performance: 'Excellent'
    },
    {
      gpu: 'NVIDIA A10G',
      memory: '24GB',
      bestFor: 'Small model training, fine-tuning (<7B params)',
      cost: 'Medium',
      performance: 'Good'
    },
    {
      gpu: 'CPU Only',
      memory: 'System RAM',
      bestFor: 'Prototyping, very small models',
      cost: 'Low',
      performance: 'Limited'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Model Training & Fine-Tuning
        </h2>
        <p className="text-orange-100">
          Build, train, and fine-tune AI models at enterprise scale
        </p>
      </div>

      {/* Training vs Inference */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GitBranch className="text-orange-600" size={20} />
          Training vs. Inference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Aspect</th>
                <th className="px-4 py-2 text-left font-semibold text-orange-700 dark:text-orange-300">Training</th>
                <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-300">Inference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {trainingVsInference.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.aspect}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.training}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.inference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training Workflow */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Typical Training Workflow
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          {trainingWorkflow.map((stage, index) => (
            <div key={index} className="relative">
              {index < trainingWorkflow.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-2 z-10">
                  <ArrowRight className="text-gray-400" size={20} />
                </div>
              )}
              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-lg p-4 relative z-20">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  STEP {index + 1}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                  {stage.step}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {stage.description}
                </p>
                <div className="space-y-1">
                  {stage.tools.map((tool, i) => (
                    <div key={i} className="text-xs text-orange-700 dark:text-orange-300 flex items-start gap-1">
                      <span>•</span>
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Product Decision Matrix
        </h3>
        <div className="space-y-3">
          {decisionMatrix.map((option, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="text-orange-600 mt-0.5 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    Choose {option.choose}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>When:</strong> {option.when}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Best for:</strong> {option.bestFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Cpu className="text-orange-600" size={20} />
          GPU Hardware for Training
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">GPU</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Memory</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Best For</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Cost</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {hardwareComparison.map((hw, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{hw.gpu}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{hw.memory}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{hw.bestFor}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      hw.cost === 'Highest' || hw.cost === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      hw.cost === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {hw.cost}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      hw.performance === 'Maximum' || hw.performance === 'Excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      hw.performance === 'Good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {hw.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training vs Fine-Tuning */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Training vs. Fine-Tuning
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Zap size={18} />
              Full Training
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Builds model from scratch or pre-training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Requires massive datasets (TBs of data)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Multi-node distributed workloads essential</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Use RHOAI Distributed Workloads with Ray</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2 flex items-center gap-2">
              <Database size={18} />
              Fine-Tuning (InstructLab)
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Adapts existing model to specific data/tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Works with limited data via synthetic generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Small-to-medium scale, taxonomy-driven</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Use InstructLab for domain-specific alignment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-2">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Resources & Contacts</h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p><strong>SMEs:</strong> Mustafa (Training-Hub), Abhishek Bhanwalder (SDG)</p>
              <p><strong>Slack:</strong> #forum-openshift-ai, #forum-instructlab, #team-openshift-ai-platform</p>
              <p><strong>Docs:</strong> Working with Data Science Pipelines (docs.redhat.com)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
