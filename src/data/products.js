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
    description: 'A hybrid cloud AI platform for data scientists and developers to build, train, deploy, and monitor AI/ML models.',
    category: 'AI/ML Platform',
    status: 'GA',
    layer: 'platform',
    required: true,
    connections: ['openshift', 'model-registry', 'trustyai', 'ai-inference'],
    useCases: ['Distributed AI workloads', 'Large-scale training', 'Production inferencing'],
    customerProfile: ['MLOps teams', 'Data scientists', 'Enterprise dev teams'],
    deploymentPattern: 'Hybrid cloud, multi-cluster',
    resources: {
      docs: 'https://docs.redhat.com',
      contacts: ['#forum-openshift-ai', '#forum-rhai-docs']
    }
  },
  {
    id: 'rhel-ai',
    name: 'Red Hat Enterprise Linux AI (RHEL AI)',
    description: 'A foundation model platform for consistently running large language models (LLMs) in individual Linux server environments.',
    category: 'Model Platform',
    status: 'GA',
    layer: 'platform',
    required: false,
    connections: ['llama-stack'],
    useCases: ['Fine-tuning models', 'Serving models in isolated environments'],
    customerProfile: ['Developers', 'Small teams starting AI'],
    deploymentPattern: 'Single Linux server',
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
    name: 'AI Gateway',
    description: 'Centralized access control, authentication, and policy enforcement for AI services.',
    category: 'Gateway',
    status: 'GA',
    layer: 'application',
    required: false,
    swappable: true,
    byoOption: true,
    connections: ['rhoai'],
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
