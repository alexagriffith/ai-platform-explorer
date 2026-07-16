import { Cpu, Zap, GitBranch, Database, ArrowRight, CheckCircle, Info } from 'lucide-react';

export default function TrainingDeepDive() {
  const trainingWorkflow = [
    {
      step: 'Data Preparation',
      description: 'Load and preprocess datasets',
      tools: ['S3-compatible storage', 'Data Science Pipelines']
    },
    {
      step: 'Environment Setup',
      description: 'Configure notebooks and dependencies',
      tools: ['Workbenches (managed notebooks)', 'Custom images']
    },
    {
      step: 'Training Execution',
      description: 'Run distributed training jobs',
      tools: ['Ray (distributed compute)', 'Kubeflow Training Operator']
    },
    {
      step: 'Evaluation',
      description: 'Test model performance',
      tools: ['Evaluation pipelines', 'Benchmark suites (e.g., MMLU knowledge test, HumanEval coding test)']
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
      when: 'Single-server, out-of-the-box environment for serving and light fine-tuning of foundation models on one machine',
      bestFor: 'Edge deployments, getting started, simple fine-tuning'
    },
    {
      choose: 'Red Hat OpenShift AI (RHOAI) Distributed Workloads',
      when: 'Enterprise-scale training jobs across clusters of multiple GPUs/nodes',
      bestFor: 'Large models (70B+ params), multi-node distributed training'
    },
    {
      choose: 'InstructLab (open source project)',
      when: 'You want taxonomy-driven synthetic data generation to add skills or knowledge, and have confirmed current support status with your Red Hat team',
      bestFor: 'Limited training data, synthetic data generation, subject-matter-expert-driven improvement'
    },
    {
      choose: 'Custom Infrastructure',
      when: 'Specialized, air-gapped, or highly specific hardware configurations',
      bestFor: 'Unique requirements not met by standard SKUs'
    }
  ];

  const hardwareComparison = [
    {
      gpu: 'NVIDIA H200',
      memory: '141GB HBM3e',
      bestFor: 'Large model training and inference; successor to H100 with more memory',
      cost: 'Highest',
      performance: 'Maximum'
    },
    {
      gpu: 'NVIDIA H100',
      memory: '80GB HBM3',
      bestFor: 'Training large models (70B+ parameters)',
      cost: 'Highest',
      performance: 'Maximum'
    },
    {
      gpu: 'AMD MI300X',
      memory: '192GB HBM3',
      bestFor: 'Large model training with high memory requirements, H100 alternative',
      cost: 'Very High',
      performance: 'Excellent'
    },
    {
      gpu: 'NVIDIA A100',
      memory: '40GB / 80GB',
      bestFor: 'Most production fine-tuning (7B-70B parameters) — 70B feasible with parameter-efficient methods and multi-GPU sharding',
      cost: 'High',
      performance: 'Excellent'
    },
    {
      gpu: 'NVIDIA L40S',
      memory: '48GB',
      bestFor: 'Inference-optimized, cost-effective serving, light fine-tuning',
      cost: 'Medium',
      performance: 'Very Good (inference)'
    },
    {
      gpu: 'NVIDIA A10G',
      memory: '24GB',
      bestFor: 'Cost-effective inference, small model training (<7B params)',
      cost: 'Medium-Low',
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

  const costBadge = (cost) => {
    if (['Highest', 'Very High', 'High'].includes(cost)) {
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }
    return 'rounded-full px-2 py-0.5 text-xs font-medium bg-tint text-muted';
  };

  const perfBadge = (performance) => {
    if (performance === 'Maximum' || performance === 'Excellent') {
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
    return 'rounded-full px-2 py-0.5 text-xs font-medium bg-tint text-ink';
  };

  return (
    <div className="space-y-6">
      {/* Header — no border */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h2 className="text-2xl font-bold text-ink mb-1">
          Model Training & Fine-Tuning
        </h2>
        <p className="text-muted text-sm">
          Build, train, and fine-tune AI models at enterprise scale
        </p>
      </div>

      {/* Training vs Inference — no border on outer panel */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <GitBranch className="text-muted" size={18} />
          Training vs. Inference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-tint">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Aspect</th>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Training</th>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Inference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {trainingVsInference.map((row, index) => (
                <tr key={index} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className="px-4 py-3 font-medium text-ink">{row.aspect}</td>
                  <td className="px-4 py-3 text-muted">{row.training}</td>
                  <td className="px-4 py-3 text-muted">{row.inference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training Workflow — no border on outer, no border on step cards */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-4">
          Typical Training Workflow
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          {trainingWorkflow.map((stage, index) => (
            <div key={index} className="relative">
              {index < trainingWorkflow.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-2 z-10">
                  <ArrowRight className="text-muted" size={18} />
                </div>
              )}
              <div className="rounded-card bg-tint p-4 relative z-20">
                <div className="text-xs font-semibold text-faint mb-1">
                  STEP {index + 1}
                </div>
                <h4 className="font-bold text-ink mb-1 text-sm">
                  {stage.step}
                </h4>
                <p className="text-xs text-muted mb-3">
                  {stage.description}
                </p>
                <div className="space-y-1">
                  {stage.tools.map((tool, i) => (
                    <div key={i} className="text-xs text-ink flex items-start gap-1">
                      <span className="text-accent flex-shrink-0">•</span>
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Matrix — no border on outer panel, items use tint only */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-4">
          Product Decision Matrix
        </h3>
        <div className="divide-y divide-hair">
          {decisionMatrix.map((option, index) => (
            <div
              key={index}
              className="py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                <div className="flex-1">
                  <h4 className="font-bold text-ink mb-0.5">
                    Choose {option.choose}
                  </h4>
                  <p className="text-sm text-muted mb-0.5">
                    <strong className="text-ink">When:</strong> {option.when}
                  </p>
                  <p className="text-sm text-muted">
                    <strong className="text-ink">Best for:</strong> {option.bestFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Comparison — no border on outer */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-1 flex items-center gap-2">
          <Cpu className="text-muted" size={18} />
          GPU Hardware for Training
        </h3>
        <p className="text-sm text-muted mb-4">
          Representative examples — GPU availability and pricing change quickly; confirm current options with your hardware vendor.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-tint">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">GPU</th>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Memory</th>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Best For</th>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Cost</th>
                <th className="px-4 py-2 text-left font-semibold text-ink border-b border-hair">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {hardwareComparison.map((hw, index) => (
                <tr key={index} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className="px-4 py-3 font-semibold text-ink">{hw.gpu}</td>
                  <td className="px-4 py-3 text-muted">{hw.memory}</td>
                  <td className="px-4 py-3 text-muted">{hw.bestFor}</td>
                  <td className="px-4 py-3">
                    <span className={costBadge(hw.cost)}>{hw.cost}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={perfBadge(hw.performance)}>{hw.performance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training vs Fine-Tuning — no border, two columns separated by hairline */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-4">
          Training vs. Fine-Tuning
        </h3>
        <div className="grid md:grid-cols-2 divide-y divide-hair md:divide-y-0 md:divide-x">
          <div className="pb-4 md:pb-0 md:pr-6">
            <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
              <Zap size={15} className="text-muted" />
              Full Training
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Trains a model from scratch (rare for large language models — most organizations start from a foundation model)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Requires massive datasets (TBs of data)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Multi-node distributed workloads essential</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Red Hat OpenShift AI distributed workloads (Ray) support large multi-node jobs</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 md:pt-0 md:pl-6">
            <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
              <Database size={15} className="text-muted" />
              Fine-Tuning
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Adapts existing model to specific data/tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Works with limited data via synthetic generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Small-to-medium scale compared to pre-training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">•</span>
                <span>Use OpenShift AI fine-tuning workflows (supervised fine-tuning, LoRA adapters); InstructLab is an option for taxonomy-driven synthetic data — confirm current support status with your Red Hat account team</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="rounded-card bg-surface px-5 py-4">
        <div className="flex items-start gap-2">
          <Info className="text-muted mt-0.5 flex-shrink-0" size={17} />
          <div className="flex-1">
            <h4 className="font-semibold text-ink mb-1">Resources & Contacts</h4>
            <div className="text-sm text-muted space-y-1">
              <p><strong className="text-ink">Questions:</strong> Ask your Red Hat account team.</p>
              <p><strong className="text-ink">Docs:</strong> Working with distributed workloads, Red Hat OpenShift AI (docs.redhat.com)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
