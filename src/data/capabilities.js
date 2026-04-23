// Capability-based architecture - customers choose category first, then provider
export const capabilities = {
  application: [
    {
      id: 'gateway',
      name: 'API Gateway',
      description: 'API gateway for routing, authentication, and rate limiting',
      required: false,
      options: [
        {
          id: 'rh-gateway',
          provider: 'Red Hat',
          name: 'Red Hat AI Gateway',
          description: 'Authorino + Limitador + Envoy for AI workloads',
          status: 'GA',
          recommended: true
        },
        {
          id: 'customer-gateway',
          provider: 'Customer',
          name: 'Existing API Gateway',
          description: 'Customer-provided gateway (Kong, Apigee, etc.)',
          isCustomer: true
        },
        {
          id: 'no-gateway',
          provider: 'None',
          name: 'No Gateway',
          description: 'Direct access without gateway',
          isNone: true
        }
      ]
    },
    {
      id: 'orchestration',
      name: 'AI Workflow Orchestration',
      description: 'Orchestrate complex AI workflows and agent interactions',
      required: false,
      options: [
        {
          id: 'project-navigator',
          provider: 'Red Hat',
          name: 'Project Navigator',
          description: 'Intent-based AI workflow orchestrator',
          status: 'Dev Preview',
          recommended: true
        },
        {
          id: 'customer-orchestration',
          provider: 'Customer',
          name: 'Existing Orchestration',
          description: 'Customer-provided (Airflow, Prefect, etc.)',
          isCustomer: true
        }
      ]
    },
    {
      id: 'gen-ai-tools',
      name: 'Generative AI Tools',
      description: 'Prompt testing, experimentation, and asset management',
      required: false,
      options: [
        {
          id: 'gen-ai-studio',
          provider: 'Red Hat',
          name: 'Gen AI Studio',
          description: 'Prompt lab and asset library',
          status: 'Tech Preview',
          recommended: true
        }
      ]
    }
  ],
  services: [
    {
      id: 'model-training',
      name: 'Model Training',
      description: 'Train and fine-tune AI models at scale',
      required: false,
      subLayer: 'core', // Core training layer
      position: 'base',
      options: [
        {
          id: 'rhoai-distributed',
          provider: 'Red Hat',
          name: 'RHOAI Distributed Workloads',
          description: 'Multi-node distributed training with Ray and Training Operator',
          status: 'GA',
          recommended: true
        },
        {
          id: 'instructlab',
          provider: 'Red Hat',
          name: 'InstructLab',
          description: 'Model alignment and fine-tuning with synthetic data generation',
          status: 'GA'
        },
        {
          id: 'data-science-pipelines',
          provider: 'Red Hat',
          name: 'Data Science Pipelines',
          description: 'Automated ML workflows with Kubeflow Pipelines',
          status: 'GA'
        },
        {
          id: 'custom-training',
          provider: 'Customer',
          name: 'Custom Training Infrastructure',
          description: 'Customer-provided training frameworks and infrastructure',
          isCustomer: true
        }
      ]
    },
    {
      id: 'model-serving',
      name: 'Model Serving',
      description: 'Deploy and serve AI models with high performance',
      required: true,
      subLayer: 'core', // Core inference layer
      position: 'base',
      options: [
        {
          id: 'ai-inference',
          provider: 'Red Hat',
          name: 'Red Hat AI Inference Server',
          description: 'vLLM-based high-performance LLM serving',
          status: 'GA',
          recommended: true
        },
        {
          id: 'kserve',
          provider: 'Red Hat',
          name: 'KServe (via RHOAI)',
          description: 'Multi-framework model serving',
          status: 'GA'
        },
        {
          id: 'customer-serving',
          provider: 'Customer',
          name: 'Custom Serving Infrastructure',
          description: 'Customer-provided serving layer',
          isCustomer: true
        }
      ]
    },
    {
      id: 'model-registry',
      name: 'Model Registry',
      description: 'Version control and metadata management for models',
      required: false,
      subLayer: 'core', // Same level as serving - adjacent
      position: 'adjacent',
      options: [
        {
          id: 'rh-model-registry',
          provider: 'Red Hat',
          name: 'Red Hat Model Registry',
          description: 'Integrated model versioning and tracking',
          status: 'Tech Preview',
          recommended: true
        },
        {
          id: 'mlflow',
          provider: 'Customer',
          name: 'MLflow',
          description: 'Customer-managed MLflow instance',
          isCustomer: true
        },
        {
          id: 'custom-registry',
          provider: 'Customer',
          name: 'Other Model Registry',
          description: 'Weights & Biases, Neptune, etc.',
          isCustomer: true
        }
      ]
    },
    {
      id: 'observability',
      name: 'Observability & Monitoring',
      description: 'Monitor AI workloads, track metrics, and analyze performance',
      required: false,
      subLayer: 'wrapper', // Wraps around core services
      position: 'wrapper',
      options: [
        {
          id: 'rh-observability',
          provider: 'Red Hat',
          name: 'OpenShift Monitoring Stack',
          description: 'Prometheus + Grafana for AI workloads',
          status: 'GA',
          recommended: true
        },
        {
          id: 'customer-monitoring',
          provider: 'Customer',
          name: 'Existing Monitoring',
          description: 'Datadog, New Relic, Dynatrace, etc.',
          isCustomer: true
        }
      ]
    },
    {
      id: 'governance',
      name: 'AI Governance & Trust',
      description: 'Explainability, fairness, and audit trails for responsible AI',
      required: false,
      subLayer: 'wrapper', // Wraps around serving for compliance
      position: 'wrapper',
      options: [
        {
          id: 'trustyai',
          provider: 'Red Hat',
          name: 'TrustyAI',
          description: 'Explainability, monitoring, and compliance',
          status: 'GA',
          recommended: true
        },
        {
          id: 'customer-governance',
          provider: 'Customer',
          name: 'Custom Governance Tools',
          description: 'Customer-provided governance solution',
          isCustomer: true
        }
      ]
    },
    {
      id: 'evaluation',
      name: 'Model Evaluation',
      description: 'Test, benchmark, and validate AI model quality',
      required: false,
      subLayer: 'orchestration', // Higher level - evaluates models
      position: 'orchestration',
      options: [
        {
          id: 'rh-evaluation',
          provider: 'Red Hat',
          name: 'Integrated Evaluation (RHOAI)',
          description: 'Built-in model evaluation pipelines',
          status: 'GA',
          recommended: true
        },
        {
          id: 'instructlab-eval',
          provider: 'Red Hat',
          name: 'InstructLab Evaluation',
          description: 'LAB-based model quality assessment',
          status: 'GA'
        },
        {
          id: 'customer-evaluation',
          provider: 'Customer',
          name: 'Custom Evaluation Framework',
          description: 'Customer evaluation tools (HELM, EleutherAI, etc.)',
          isCustomer: true
        }
      ]
    },
    {
      id: 'mcp',
      name: 'Model Context Protocol (MCP)',
      description: 'Connect AI models to external tools and data sources',
      required: false,
      subLayer: 'orchestration', // Higher level - connects to tools
      position: 'orchestration',
      options: [
        {
          id: 'rh-mcp-full',
          provider: 'Red Hat',
          name: 'Full MCP Ecosystem',
          description: 'Complete platform: Registry + Catalog + Lifecycle Operator + Gateway',
          status: 'Tech Preview',
          recommended: true
        },
        {
          id: 'rh-mcp-catalog',
          provider: 'Red Hat',
          name: 'MCP Catalog & Registry',
          description: 'Browse and discover MCP servers with governance (no auto-deployment)',
          status: 'Tech Preview'
        },
        {
          id: 'rh-mcp-registry',
          provider: 'Red Hat',
          name: 'MCP Registry Only',
          description: 'System of record for MCP governance and metadata',
          status: 'Tech Preview'
        },
        {
          id: 'custom-mcp',
          provider: 'Customer',
          name: 'Self-hosted MCP Servers',
          description: 'Customer-deployed MCP implementations',
          isCustomer: true
        }
      ]
    },
    {
      id: 'vector-db',
      name: 'Vector Database',
      description: 'Store and retrieve embeddings for RAG and semantic search',
      required: false,
      subLayer: 'core', // Same level as serving - adjacent (for RAG)
      position: 'adjacent',
      options: [
        {
          id: 'elastic',
          provider: 'Partner',
          name: 'Elastic (Preferred)',
          description: 'Red Hat partnership - preferred vector DB',
          status: 'GA',
          recommended: true
        },
        {
          id: 'pgvector',
          provider: 'Open Source',
          name: 'PostgreSQL + pgvector',
          description: 'PostgreSQL with vector extension',
          status: 'GA'
        },
        {
          id: 'customer-vectordb',
          provider: 'Customer',
          name: 'Other Vector DB',
          description: 'Pinecone, Weaviate, Milvus, etc.',
          isCustomer: true
        }
      ]
    }
  ],
  platform: [
    {
      id: 'ai-platform',
      name: 'AI/ML Platform',
      description: 'Core platform for building, training, and deploying models',
      required: true,
      options: [
        {
          id: 'rhaie',
          provider: 'Red Hat',
          name: 'Red Hat AI Enterprise (RHAIE)',
          description: 'Complete integrated AI platform (OpenShift + OpenShift AI)',
          status: 'GA',
          recommended: true
        },
        {
          id: 'rhoai',
          provider: 'Red Hat',
          name: 'Red Hat OpenShift AI (RHOAI)',
          description: 'AI/ML platform on existing OpenShift',
          status: 'GA',
          recommended: true
        },
        {
          id: 'rhel-ai',
          provider: 'Red Hat',
          name: 'Red Hat Enterprise Linux AI',
          description: 'Foundation models on individual RHEL servers',
          status: 'GA'
        }
      ]
    },
    {
      id: 'data-storage',
      name: 'Data Storage',
      description: 'Object storage for datasets, models, and artifacts',
      required: false,
      options: [
        {
          id: 'odf',
          provider: 'Red Hat',
          name: 'OpenShift Data Foundation',
          description: 'Integrated S3-compatible storage',
          status: 'GA',
          recommended: true
        },
        {
          id: 's3',
          provider: 'AWS',
          name: 'Amazon S3',
          description: 'AWS object storage',
          status: 'GA'
        },
        {
          id: 'customer-storage',
          provider: 'Customer',
          name: 'Existing Object Storage',
          description: 'MinIO, Azure Blob, GCS, etc.',
          isCustomer: true
        }
      ]
    }
  ],
  infrastructure: [
    {
      id: 'container-platform',
      name: 'Container Platform',
      description: 'Kubernetes platform for running AI workloads',
      required: true,
      options: [
        {
          id: 'openshift',
          provider: 'Red Hat',
          name: 'Red Hat OpenShift',
          description: 'Enterprise Kubernetes platform',
          status: 'GA',
          recommended: true
        },
        {
          id: 'kubernetes',
          provider: 'Customer',
          name: 'Existing Kubernetes',
          description: 'Customer-managed Kubernetes cluster',
          isCustomer: true
        }
      ]
    },
    {
      id: 'accelerators',
      name: 'Hardware Accelerators',
      description: 'GPUs and specialized hardware for AI workloads',
      required: false,
      options: [
        {
          id: 'nvidia-gpu',
          provider: 'NVIDIA',
          name: 'NVIDIA GPUs',
          description: 'A100, H100, etc. with CUDA support',
          status: 'GA',
          recommended: true
        },
        {
          id: 'amd-gpu',
          provider: 'AMD',
          name: 'AMD GPUs',
          description: 'MI-series accelerators',
          status: 'GA'
        },
        {
          id: 'intel-gpu',
          provider: 'Intel',
          name: 'Intel GPUs/Gaudi',
          description: 'Intel Data Center GPU and Gaudi accelerators',
          status: 'GA'
        },
        {
          id: 'google-tpu',
          provider: 'Google',
          name: 'Google TPU',
          description: 'Tensor Processing Units',
          status: 'GA'
        },
        {
          id: 'cpu-only',
          provider: 'CPU',
          name: 'CPU Only',
          description: 'Run on standard CPUs without accelerators',
          isNone: true
        }
      ]
    }
  ]
};

export const capabilityLayers = [
  { id: 'application', name: 'Application / Tooling Layer', color: '#8B5CF6' },
  { id: 'services', name: 'AI Services Layer', color: '#06B6D4' },
  { id: 'platform', name: 'Platform / Runtime Layer', color: '#10B981' },
  { id: 'infrastructure', name: 'Infrastructure Layer', color: '#F59E0B' }
];
