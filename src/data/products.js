export const products = [
  {
    id: 'rhaie',
    name: 'Red Hat AI Enterprise (RHAIE)',
    description: 'The name this explorer uses for the combined OpenShift plus OpenShift AI platform path — building, tuning, and deploying AI models and applications on one integrated stack. Confirm current packaging and naming with your Red Hat account team.',
    category: 'Integrated Platform',
    status: 'Check with Red Hat',
    layer: 'platform',
    required: true,
    connections: ['rhoai', 'openshift'],
    resources: {
      docs: 'https://docs.redhat.com/en/documentation/red_hat_ai_enterprise'
    }
  },
  {
    id: 'rhoai',
    name: 'Red Hat OpenShift AI (RHOAI)',
    description: 'AI/ML platform for OpenShift. Provides full ML lifecycle capabilities on OpenShift clusters (self-managed or managed ROSA/ARO). Requires OpenShift as the container platform.',
    category: 'AI/ML Platform',
    status: 'GA',
    layer: 'platform',
    required: true,
    connections: ['openshift', 'model-registry', 'trustyai', 'ai-inference'],
    useCases: ['Distributed AI workloads', 'Large-scale training', 'Production inferencing', 'Enterprise ML on OpenShift'],
    customerProfile: ['MLOps teams', 'Data scientists', 'Enterprise dev teams with OpenShift'],
    deploymentPattern: 'OpenShift (self-managed or ROSA/ARO)',
    resources: {
      docs: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed'
    }
  },
  {
    id: 'rhai',
    name: 'Red Hat AI (portfolio name)',
    description: 'Red Hat AI is the umbrella name for the Red Hat AI portfolio, not a separate product. This explorer uses it for the Red Hat AI path on standard Kubernetes clusters (Amazon EKS, Azure AKS, Google GKE, or self-managed) when your container platform is not OpenShift. Confirm the supported offering and scope with your Red Hat account team.',
    category: 'AI/ML Platform',
    status: 'Check with Red Hat',
    layer: 'platform',
    required: false,
    connections: ['ai-inference', 'model-registry'],
    useCases: ['Cloud-native Kubernetes AI', 'EKS/AKS/GKE deployments', 'Standard Kubernetes without OpenShift'],
    customerProfile: ['Platform teams on EKS/AKS/GKE', 'Kubernetes platform engineering', 'Cloud-native teams'],
    deploymentPattern: 'Standard Kubernetes (EKS, AKS, GKE, self-managed)',
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'rhel-ai',
    name: 'Red Hat Enterprise Linux AI (RHEL AI)',
    description: 'A generative AI inference platform for Linux environments. Delivered as a portable bootc image built on Red Hat Enterprise Linux (RHEL). Uses the vLLM engine for LLM inference and includes the Red Hat AI Model Optimization Toolkit (llm-compressor) for model quantization and compression. Runs on bare metal or virtual machines — no Kubernetes required.',
    category: 'Model Platform',
    status: 'GA',
    layer: 'platform',
    required: false,
    connections: ['llama-stack-distribution'],
    useCases: ['LLM inference on bare metal or VMs', 'Edge and air-gapped deployments', 'Model quantization and compression', 'Linux-native AI serving without Kubernetes'],
    customerProfile: ['Edge deployments', 'Developers', 'Small teams', 'Linux infrastructure teams'],
    deploymentPattern: 'Bare metal or VM (RHEL, no container orchestration required)',
    resources: {
      docs: 'https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_ai/3.2'
    }
  },
  {
    id: 'ai-inference',
    name: 'Red Hat AI Inference Server',
    description: 'An optimized runtime and engine for high-performance large language model (LLM) inference.',
    category: 'Model Serving',
    status: 'GA',
    layer: 'services',
    required: false,
    connections: ['rhoai', 'model-registry'],
    useCases: ['High-throughput serving of LLMs'],
    customerProfile: ['Infrastructure teams', 'Platform engineers'],
    deploymentPattern: 'Scalable GPU-optimized nodes',
    resources: {
      docs: 'https://docs.redhat.com/en/documentation/red_hat_ai_inference_server'
    }
  },
  {
    id: 'kserve',
    name: 'KServe',
    description: 'Model serving platform built into Red Hat OpenShift AI. Supports multiple runtimes (vLLM, TorchServe, TensorFlow, etc.) with autoscaling (Horizontal Pod Autoscaler, KEDA, or Knative), canary deployments, and InferenceGraph pipelines.',
    category: 'Model Serving',
    status: 'GA',
    layer: 'services',
    required: false,
    connections: ['rhoai', 'ai-inference'],
    useCases: ['Multi-framework model serving', 'InferenceGraph DAG pipelines', 'Canary deployments', 'A/B testing'],
    customerProfile: ['ML platform teams', 'MLOps engineers', 'Data scientists'],
    deploymentPattern: 'Kubernetes-native serving abstraction',
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'batch-gateway',
    name: 'Red Hat Batch Gateway',
    description: 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team. OpenAI-compatible batch inference API for large asynchronous large language model (LLM) workloads.',
    category: 'Model Serving',
    status: 'Dev Preview',
    layer: 'services',
    required: false,
    connections: ['ai-inference', 'rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'rh-evaluation',
    name: 'OpenShift AI evaluation (EvalHub pattern)',
    description: 'Model evaluation (EvalHub pattern) — Technology Preview; confirm scope with your Red Hat account team.',
    category: 'Evaluation',
    status: 'Tech Preview',
    layer: 'services',
    required: false,
    connections: ['rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'fms-guardrails',
    name: 'Guardrails (content safety)',
    description: 'Policy and safety controls for generative workloads — confirm productized path and scope with your account team.',
    category: 'Governance',
    status: 'Tech Preview',
    layer: 'services',
    required: false,
    connections: ['trustyai', 'rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'instructlab',
    name: 'InstructLab',
    description: 'An open source framework for model alignment and fine-tuning using synthetic data generation and the LAB method. Confirm availability and supported integration path with your Red Hat account team.',
    category: 'Training / Alignment',
    status: 'GA',
    layer: 'services',
    required: false,
    connections: ['rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'rhoai-distributed',
    name: 'OpenShift AI — distributed training',
    description: 'Ray / CodeFlare style distributed jobs on OpenShift AI for larger training footprints.',
    category: 'Training',
    status: 'GA',
    layer: 'services',
    required: false,
    connections: ['rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'data-science-pipelines',
    name: 'Data Science Pipelines',
    description: 'Kubeflow Pipelines-based automation for repeatable ML workflows on OpenShift AI.',
    category: 'MLOps',
    status: 'GA',
    layer: 'services',
    required: false,
    connections: ['rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'project-navigator',
    name: 'Project Navigator',
    description: 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team. An intent-based AI workflow orchestrator that aims to simplify model selection and infrastructure choices via natural language.',
    category: 'AI Orchestration',
    status: 'Dev Preview',
    layer: 'application',
    required: false,
    connections: ['rhoai'],
    useCases: ['Simplifying model deployment', 'Infrastructure optimization'],
    customerProfile: ['AI Engineers', 'Platform teams'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'gen-ai-studio',
    name: 'Gen AI Studio',
    description: 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team. A central point in the dashboard for generative AI asset consumption, experimentation, and prompt testing.',
    category: 'AI Developer Tool',
    status: 'Tech Preview',
    layer: 'application',
    required: false,
    connections: ['rhoai'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'trustyai',
    name: 'TrustyAI',
    description: 'A toolkit for ensuring responsible AI development through explainability, monitoring, and audit trails.',
    category: 'AI Governance',
    status: 'GA',
    layer: 'services',
    required: false,
    swappable: false,
    connections: ['rhoai', 'prometheus'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'model-registry',
    name: 'Model Registry',
    description: 'A central repository for managing metadata, versioning, and tracking models from inception to deployment.',
    category: 'MLOps / Metadata',
    status: 'Tech Preview',
    layer: 'services',
    required: false,
    swappable: true,
    connections: ['rhoai', 'ai-inference'],
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'ai-gateway',
    name: 'Red Hat AI Gateway',
    description: 'Model-as-a-Service gateway providing OpenAI-compatible APIs for accessing self-hosted and external models. Includes usage tracking, policy enforcement, and centralized model catalog management. Confirm availability and scope with your Red Hat account team.',
    category: 'Gateway',
    status: 'Check with Red Hat',
    layer: 'application',
    required: false,
    swappable: true,
    byoOption: true,
    connections: ['rhoai', 'ai-inference'],
    useCases: ['Multi-model API access', 'External model integration', 'Usage tracking and cost control', 'Centralized model governance'],
    customerProfile: ['Platform teams', 'MLOps engineers', 'App developers needing model access'],
    deploymentPattern: 'Centralized gateway for model access',
    resources: {
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'openshift',
    name: 'Red Hat OpenShift',
    description: 'Kubernetes platform for containerized applications.',
    category: 'Infrastructure',
    status: 'GA',
    layer: 'infrastructure',
    required: true,
    connections: [],
    resources: {
      docs: 'https://docs.redhat.com/en/documentation/openshift_container_platform'
    }
  }
];

export const layers = [
  { id: 'application', name: 'Application / Tooling Layer', color: '#8B5CF6' },
  { id: 'services', name: 'AI Services Layer', color: '#06B6D4' },
  { id: 'platform', name: 'Platform / Runtime Layer', color: '#10B981' },
  { id: 'infrastructure', name: 'Infrastructure Layer', color: '#F59E0B' }
];

export const thirdPartyOptions = [
  {
    id: 'custom-gateway',
    name: 'Custom API Gateway',
    replaces: 'ai-gateway',
    description: 'Use your own API gateway for routing and security'
  },
  {
    id: 'custom-registry',
    name: 'Custom Model Registry',
    replaces: 'model-registry',
    description: 'Bring your own model registry (MLflow, etc.)'
  },
  {
    id: 'elastic-vector',
    name: 'Elastic Vector DB',
    category: 'Data',
    description: 'A partner vector database option for retrieval-augmented generation (RAG) implementations',
    connections: ['rhoai']
  },
  {
    id: 'custom-storage',
    name: 'S3-Compatible Storage',
    category: 'Data',
    description: 'External object storage for datasets and models',
    connections: ['rhoai']
  }
];
