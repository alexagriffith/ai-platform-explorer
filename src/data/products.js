export const products = [
  {
    id: 'rhaie',
    name: 'Red Hat AI Enterprise (RHAIE)',
    description: 'A comprehensive, integrated AI platform combining OpenShift AI and OpenShift for building, tuning, and deploying AI models and applications.',
    category: 'Integrated Platform',
    status: 'GA',
    layer: 'platform',
    required: true,
    connections: ['rhoai', 'openshift'],
    resources: {
      docs: 'https://docs.redhat.com',
      contacts: ['#forum-openshift-ai']
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
      docs: 'https://docs.redhat.com',
      contacts: ['#forum-openshift-ai', '#forum-rhai-docs']
    }
  },
  {
    id: 'rhai',
    name: 'Red Hat AI (RHAI)',
    description: 'AI/ML platform for standard Kubernetes (non-OpenShift). Provides AI capabilities on EKS, AKS, GKE, and self-managed Kubernetes clusters. Use this when your container platform is not OpenShift.',
    category: 'AI/ML Platform',
    status: 'GA',
    layer: 'platform',
    required: false,
    connections: ['ai-inference', 'model-registry'],
    useCases: ['Cloud-native Kubernetes AI', 'EKS/AKS/GKE deployments', 'Standard K8s without OpenShift'],
    customerProfile: ['Platform teams on EKS/AKS/GKE', 'Kubernetes platform engineering', 'Cloud-native teams'],
    deploymentPattern: 'Standard Kubernetes (EKS, AKS, GKE, self-managed)',
    resources: {
      docs: 'https://docs.redhat.com',
      contacts: ['#forum-openshift-ai']
    }
  },
  {
    id: 'rhel-ai',
    name: 'Red Hat Enterprise Linux AI (RHEL AI)',
    description: 'Foundation model platform for running LLMs on individual RHEL servers. Single-node only. InstructLab-focused fine-tuning and serving. Not for distributed training or production-scale deployments (use RHOAI or RHAI instead).',
    category: 'Model Platform',
    status: 'GA',
    layer: 'platform',
    required: false,
    connections: ['llama-stack', 'instructlab'],
    useCases: ['InstructLab fine-tuning', 'Edge deployments', 'Development environments', 'Single-server serving'],
    customerProfile: ['Edge deployments', 'Developers', 'Small teams', 'Single-node use cases'],
    deploymentPattern: 'Single RHEL server (not distributed)',
    resources: {
      docs: 'https://docs.redhat.com',
      contacts: ['#forum-llama-stack']
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
      docs: 'https://docs.redhat.com'
    }
  },
  {
    id: 'kserve',
    name: 'KServe',
    description: 'Model serving platform built into Red Hat OpenShift AI. Supports multiple runtimes (vLLM, TorchServe, TensorFlow, etc.) with autoscaling (HPA/KEDA/Knative), canary deployments, and InferenceGraph pipelines.',
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
    description: 'OpenAI-compatible batch inference API for large asynchronous LLM workloads.',
    category: 'Model Serving',
    status: 'Technology Preview',
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
    description: 'Evaluation workflows and harness integration for model quality — treat as a capability area to confirm with documentation.',
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
    description: 'Alignment and fine-tuning using synthetic data and the LAB method (often paired with RHEL AI or OpenShift AI).',
    category: 'Training / Alignment',
    status: 'GA',
    layer: 'services',
    required: false,
    connections: ['rhel-ai', 'rhoai'],
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
    description: 'An intent-based AI workflow orchestrator that simplifies model selection and infrastructure optimization via natural language.',
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
    description: 'A central point in the dashboard for access to generative AI asset consumption, experimentation, and prompt testing.',
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
    description: 'Model-as-a-Service gateway providing OpenAI-compatible APIs for accessing self-hosted and external models (NVIDIA Nemotron, etc.). Includes usage tracking, policy enforcement, and centralized model catalog management.',
    category: 'Gateway',
    status: 'GA',
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
      docs: 'https://docs.redhat.com'
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
    description: 'Preferred vector database for RAG implementations',
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
