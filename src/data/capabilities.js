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
          description: 'Model-as-a-Service gateway with OpenAI-compatible APIs. Governs access to self-hosted and external models with usage tracking and policy enforcement. Not announced as a standalone generally available product - confirm availability with your Red Hat account team.',
          status: 'Tech Preview',
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
          name: 'Red Hat OpenShift AI (RHOAI) Distributed Workloads',
          description: 'Multi-node distributed training with Ray and Training Operator',
          status: 'GA',
          recommended: true
        },
        {
          id: 'instructlab',
          provider: 'Red Hat',
          name: 'InstructLab',
          description: 'Model alignment and fine-tuning with synthetic data generation — confirm current support status with your Red Hat account team',
          status: 'Tech Preview'
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
          description: 'vLLM-based high-performance large language model (LLM) serving with advanced scheduling. Can be deployed via KServe or standalone.',
          status: 'GA',
          recommended: true
        },
        {
          id: 'kserve',
          provider: 'Red Hat',
          name: 'KServe',
          description: 'Model serving platform built into RHOAI. Supports multiple runtimes (vLLM, TorchServe, TensorFlow, etc.) with autoscaling (Horizontal Pod Autoscaler, KEDA event-driven scaling, or Knative serverless scaling) and advanced deployment patterns.',
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
      id: 'batch-inference',
      name: 'Batch Inference',
      description: 'Asynchronous batch processing for high-volume offline inference',
      required: false,
      subLayer: 'core',
      position: 'adjacent',
      options: [
        {
          id: 'batch-gateway',
          provider: 'Red Hat',
          name: 'Red Hat Batch Gateway',
          description: 'OpenAI-compatible batch inference API (early-stage — confirm current request limits with your Red Hat account team)',
          status: 'Dev Preview',
          recommended: true
        },
        {
          id: 'custom-batch',
          provider: 'Customer',
          name: 'Custom Batch Solution',
          description: 'Customer-provided batch inference infrastructure',
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
          description: 'Prometheus + Grafana + OpenShift alerting. AI-specific metrics (GPU utilization, model latency/throughput) require additional exporters (NVIDIA DCGM) and custom ServiceMonitors/dashboards.',
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
      id: 'content-safety',
      name: 'Content Safety & Guardrails',
      description: 'Content filtering, safety detection, and harmful content prevention',
      required: false,
      subLayer: 'wrapper',
      position: 'wrapper',
      options: [
        {
          id: 'fms-guardrails',
          provider: 'Red Hat',
          name: 'FMS Guardrails Orchestrator',
          description: 'Content safety orchestrator with configurable detectors',
          status: 'Tech Preview',
          recommended: true
        },
        {
          id: 'custom-guardrails',
          provider: 'Customer',
          name: 'Custom Safety Solution',
          description: 'Customer-provided content moderation/safety tools',
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
          name: 'Integrated Evaluation (Red Hat OpenShift AI)',
          description: 'Model evaluation (EvalHub pattern) - Technology Preview; confirm scope with your Red Hat account team.',
          status: 'Tech Preview'
        },
        {
          id: 'instructlab-eval',
          provider: 'Red Hat',
          name: 'InstructLab Evaluation',
          description: 'Large-scale Alignment for chatBots (LAB) method model quality assessment',
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
      description: 'Connect AI agents to external tools and data sources. Note: MCP is an emerging standard - verify component availability with your Red Hat account team.',
      required: false,
      subLayer: 'orchestration', // Higher level - connects to tools
      position: 'orchestration',
      options: [
        {
          id: 'rh-mcp-full',
          provider: 'Red Hat',
          name: 'Full MCP Ecosystem',
          description: 'MCP platform components (Registry, Catalog, Lifecycle Operator, Gateway). Verify availability and maturity of each component.',
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
      id: 'llama-stack',
      name: 'Llama Stack Platform',
      description: 'Unified API for inference, agents, safety, and evaluation',
      required: false,
      subLayer: 'orchestration',
      position: 'orchestration',
      options: [
        {
          id: 'llama-stack-distribution',
          provider: 'Red Hat',
          name: 'Llama Stack Distribution',
          description: 'Red Hat packaging of Llama Stack',
          status: 'Tech Preview',
          recommended: true
        }
      ]
    },
    {
      id: 'vector-db',
      name: 'Vector Database',
      description: 'Store and retrieve embeddings for retrieval-augmented generation (RAG) and semantic search',
      required: false,
      subLayer: 'core', // Same level as serving - adjacent (for RAG)
      position: 'adjacent',
      options: [
        {
          id: 'elastic',
          provider: 'Partner',
          name: 'Elasticsearch',
          description: 'Elasticsearch vector database - partner option',
          status: 'GA'
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
          description: 'Turnkey platform (OpenShift + AI bundled). All-in-one for new AI deployments.',
          status: 'GA',
          recommended: false
        },
        {
          id: 'rhoai',
          provider: 'Red Hat',
          name: 'Red Hat OpenShift AI (RHOAI)',
          description: 'AI/ML platform for OpenShift clusters (self-managed or managed Red Hat OpenShift Service on AWS (ROSA) / Azure Red Hat OpenShift (ARO)). Use this if your container platform is OpenShift.',
          status: 'GA'
        },
        {
          id: 'rhai',
          provider: 'Red Hat',
          name: 'Red Hat AI (RHAI)',
          description: 'This explorer\'s name for the Red Hat AI path on standard Kubernetes (Amazon EKS, Azure AKS, Google GKE, self-managed) - not a distinct generally available product SKU. Use this if your container platform is standard Kubernetes, and confirm packaging with your Red Hat account team.'
        },
        {
          id: 'rhel-ai',
          provider: 'Red Hat',
          name: 'Red Hat Enterprise Linux AI',
          description: 'LLM inference on individual RHEL servers via the vLLM engine (bootc image, bare metal or VM). Single-node only. Best for edge deployments, development environments, and single-server use cases. For distributed training or production-scale serving, use RHOAI or RHAI.',
          status: 'GA'
        }
      ]
    },
    {
      id: 'data-storage',
      name: 'Data Storage',
      description: 'Object storage for datasets, models, and artifacts. Required for training, model registry, and pipeline artifacts. Can use external S3-compatible storage.',
      required: false,
      options: [
        {
          id: 'odf',
          provider: 'Red Hat',
          name: 'OpenShift Data Foundation',
          description: 'Integrated S3-compatible storage. Best for: on-prem, data residency requirements, integrated OpenShift experience.',
          status: 'GA',
          recommended: true
        },
        {
          id: 's3',
          provider: 'AWS',
          name: 'Amazon S3',
          description: 'AWS object storage. Best for: cloud deployments, cost optimization, existing AWS commitment.',
          status: 'GA'
        },
        {
          id: 'customer-storage',
          provider: 'Customer',
          name: 'Existing Object Storage',
          description: 'MinIO, Azure Blob, GCS, etc. Best for: existing storage infrastructure, specific compliance requirements.',
          isCustomer: true
        }
      ]
    }
  ],
  infrastructure: [
    {
      id: 'container-platform',
      name: 'Platform & Runtime',
      description: 'Where workloads run',
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
          description: 'Non-OpenShift Kubernetes (EKS, AKS, GKE, self-managed). Pairs with Red Hat AI (RHAI).',
          isCustomer: true
        },
        {
          id: 'rhel-hosts',
          provider: 'Red Hat',
          name: 'Red Hat Enterprise Linux (RHEL) servers',
          description: 'Bare metal / virtual machines (VMs)',
          status: 'GA',
          recommended: false
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
          description: 'A100, H100, L40S',
          status: 'GA',
          recommended: true
        },
        {
          id: 'amd-gpu',
          provider: 'AMD',
          name: 'AMD GPUs',
          description: 'MI300, MI250',
          status: 'GA'
        },
        {
          id: 'intel-gpu',
          provider: 'Intel',
          name: 'Intel GPUs/Gaudi',
          description: 'Gaudi, Data Center GPU',
          status: 'GA'
        },
        {
          id: 'google-tpu',
          provider: 'Google',
          name: 'Google TPU',
          description: 'Cloud TPUs',
          status: 'GA'
        },
        {
          id: 'cpu-only',
          provider: 'CPU',
          name: 'CPU Only',
          description: 'No GPU',
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
