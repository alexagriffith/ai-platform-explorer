export const trainingWorkflow = [
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
    tools: ['Ray (distributed compute)', 'Kubeflow Trainer v2']
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

export const trainingVsInference = [
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

export const trainingDecisionMatrix = [
  {
    choose: 'Red Hat Enterprise Linux AI (RHEL AI)',
    when: 'Out-of-the-box, single-server inference for foundation models',
    bestFor: 'Edge, getting started, single-server inference'
  },
  {
    choose: 'Red Hat OpenShift AI (RHOAI) Distributed Workloads',
    when: 'Enterprise training across multi-GPU, multi-node clusters',
    bestFor: 'Large models (70B+), distributed training'
  },
  {
    choose: 'InstructLab (open source project)',
    when: 'Taxonomy-driven synthetic data to add skills or knowledge (confirm support with your Red Hat team)',
    bestFor: 'Limited data; subject-matter-expert-driven improvement'
  },
  {
    choose: 'Custom Infrastructure',
    when: 'Air-gapped or highly specific hardware configurations',
    bestFor: 'Requirements not met by standard SKUs'
  }
];

export const hardwareComparison = [
  {
    gpu: 'NVIDIA H200',
    memory: '141GB HBM3e',
    bestFor: 'Large model training and inference; more memory than H100',
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
    bestFor: 'Large model training, high memory; H100 alternative',
    cost: 'Very High',
    performance: 'Excellent'
  },
  {
    gpu: 'NVIDIA A100',
    memory: '40GB / 80GB',
    bestFor: 'Production fine-tuning (7B–70B); 70B with parameter-efficient methods and sharding',
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
