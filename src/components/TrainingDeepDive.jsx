import { Cpu, Zap, GitBranch, Database, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { typeScale, density, hwBadge } from '../lib/styleTokens';

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

  return (
    <div className={density.stackGap}>
      {/* Header — no border */}
      <div className="rounded-card bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className={`${typeScale.componentName} text-ink`}>Model Training & Fine-Tuning</h2>
          <p className={`${typeScale.secondary} text-muted`}>Build, train, and fine-tune AI models at enterprise scale</p>
        </div>
      </div>

      {/* Training vs Inference + Training vs Fine-Tuning side-by-side */}
      <div className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2 flex items-center gap-1.5`}>
          <GitBranch className="text-muted" size={14} />
          Training vs. Inference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tint">
              <tr>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Aspect</th>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Training</th>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Inference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {trainingVsInference.map((row, index) => (
                <tr key={index} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className="px-3 py-1.5 font-medium text-ink text-xs">{row.aspect}</td>
                  <td className="px-3 py-1.5 text-muted text-xs">{row.training}</td>
                  <td className="px-3 py-1.5 text-muted text-xs">{row.inference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training Workflow — no border on outer, no border on step cards */}
      <div className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2`}>Typical Training Workflow</h3>
        <div className={`grid md:grid-cols-5 ${density.rowGap}`}>
          {trainingWorkflow.map((stage, index) => (
            <div key={index} className="relative">
              {index < trainingWorkflow.length - 1 && (
                <div className="hidden md:block absolute top-6 -right-1.5 z-10">
                  <ArrowRight className="text-muted" size={14} />
                </div>
              )}
              <div className="rounded-card bg-tint px-2 py-1.5 relative z-20">
                <div className={`${typeScale.meta} text-faint mb-0.5`}>STEP {index + 1}</div>
                <h4 className={`${typeScale.secondary} font-bold text-ink mb-0.5`}>{stage.step}</h4>
                <p className={`${typeScale.meta} text-muted mb-1`}>{stage.description}</p>
                <div className="space-y-0.5">
                  {stage.tools.map((tool, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-accent flex-shrink-0 text-xs">•</span>
                      <span className={`${typeScale.meta} text-ink`}>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Matrix — no border on outer panel */}
      <div className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2`}>Product Decision Matrix</h3>
        <div className="divide-y divide-hair">
          {decisionMatrix.map((option, index) => (
            <div key={index} className="py-1.5 first:pt-0 last:pb-0">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={13} />
                <div className="flex-1">
                  <h4 className={`${typeScale.secondary} font-bold text-ink mb-0.5`}>Choose {option.choose}</h4>
                  <p className={`${typeScale.meta} text-muted mb-0.5`}>
                    <strong className="text-ink">When:</strong> {option.when}
                  </p>
                  <p className={`${typeScale.meta} text-muted`}>
                    <strong className="text-ink">Best for:</strong> {option.bestFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Comparison — no border on outer */}
      <div className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-0.5 flex items-center gap-1.5`}>
          <Cpu className="text-muted" size={14} />
          GPU Hardware for Training
        </h3>
        <p className={`${typeScale.meta} text-muted mb-2`}>
          Representative examples — GPU availability and pricing change quickly; confirm current options with your hardware vendor.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tint">
              <tr>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">GPU</th>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Memory</th>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Best For</th>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Cost</th>
                <th className="px-3 py-1.5 text-left font-semibold text-ink text-xs border-b border-hair">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {hardwareComparison.map((hw, index) => (
                <tr key={index} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className="px-3 py-1.5 font-semibold text-ink text-xs">{hw.gpu}</td>
                  <td className="px-3 py-1.5 text-muted text-xs">{hw.memory}</td>
                  <td className="px-3 py-1.5 text-muted text-xs">{hw.bestFor}</td>
                  <td className="px-3 py-1.5">
                    <span className={hwBadge.cost(hw.cost)}>{hw.cost}</span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={hwBadge.performance(hw.performance)}>{hw.performance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training vs Fine-Tuning — no border, two columns separated by hairline */}
      <div className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2`}>Training vs. Fine-Tuning</h3>
        <div className="grid md:grid-cols-2 divide-y divide-hair md:divide-y-0 md:divide-x">
          <div className="pb-2 md:pb-0 md:pr-4">
            <h4 className={`${typeScale.secondary} font-semibold text-ink mb-1 flex items-center gap-1.5`}>
              <Zap size={13} className="text-muted" />
              Full Training
            </h4>
            <ul className="space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Trains a model from scratch (rare for large language models — most organizations start from a foundation model)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Requires massive datasets (TBs of data)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Multi-node distributed workloads essential</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Red Hat OpenShift AI distributed workloads (Ray) support large multi-node jobs</span>
              </li>
            </ul>
          </div>
          <div className="pt-2 md:pt-0 md:pl-4">
            <h4 className={`${typeScale.secondary} font-semibold text-ink mb-1 flex items-center gap-1.5`}>
              <Database size={13} className="text-muted" />
              Fine-Tuning
            </h4>
            <ul className="space-y-1">
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Adapts existing model to specific data/tasks</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Works with limited data via synthetic generation</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Small-to-medium scale compared to pre-training</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className={`${typeScale.secondary} text-muted`}>Use OpenShift AI fine-tuning workflows (supervised fine-tuning, LoRA adapters); InstructLab is an option for taxonomy-driven synthetic data — confirm current support status with your Red Hat account team</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="rounded-card bg-surface px-4 py-2">
        <div className="flex items-start gap-2">
          <Info className="text-muted mt-0.5 flex-shrink-0" size={14} />
          <div className="flex-1">
            <h4 className={`${typeScale.secondary} font-semibold text-ink mb-0.5`}>Resources & Contacts</h4>
            <div className={`${typeScale.secondary} text-muted space-y-0.5`}>
              <p><strong className="text-ink">Questions:</strong> Ask your Red Hat account team.</p>
              <p><strong className="text-ink">Docs:</strong> Working with distributed workloads, Red Hat OpenShift AI (docs.redhat.com)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
