// Deep dive details for Red Hat solutions
export const solutionDetails = {
  'rh-gateway': {
    name: 'Red Hat AI Gateway',
    description: 'Model-as-a-Service gateway providing unified access to self-hosted and external AI models through OpenAI-compatible APIs',
    architecture: {
      components: [
        { name: 'Model Catalog', role: 'Model Discovery', description: 'Centralized catalog of available models (self-hosted and external providers like NVIDIA Nemotron)' },
        { name: 'OpenAI API Adapter', role: 'API Compatibility', description: 'OpenAI-compatible REST API endpoints for chat completions, embeddings, and completions' },
        { name: 'Usage Tracking', role: 'Metering & Analytics', description: 'Track token usage, request counts, and latency per user/model for cost allocation' },
        { name: 'Policy Engine', role: 'Governance', description: 'Enforce access policies, rate limits, and model routing rules based on identity and usage' }
      ],
      integrations: [
        { name: 'Identity Management', purpose: 'Integration with Red Hat single sign-on (SSO)/Keycloak for authentication' },
        { name: 'AI Inference Server', purpose: 'Self-hosted model serving backend' },
        { name: 'External Model APIs', purpose: 'NVIDIA Nemotron, Azure OpenAI, and other external providers' },
        { name: 'Prometheus', purpose: 'Metrics and monitoring for gateway operations' },
        { name: 'OpenShift', purpose: 'Platform deployment and lifecycle management' }
      ]
    },
    capabilities: [
      'OpenAI-compatible API for chat completions, embeddings, and text generation',
      'Unified access to self-hosted models (vLLM, KServe) and external providers',
      'Centralized model catalog with administrator-curated model lists',
      'Usage tracking and metering for cost allocation and chargeback',
      'Policy-based access control (who can access which models)',
      'Rate limiting and quota management per user/tenant',
      'Identity integration with enterprise SSO systems',
      'Request/response logging for audit and compliance',
      'Multi-tenant isolation and security'
    ],
    useCases: [
      'Provide developers with OpenAI-compatible access to internal models',
      'Integrate external models (NVIDIA Nemotron) alongside self-hosted models',
      'Track and allocate AI costs across teams and projects',
      'Enforce governance policies on which teams can use which models',
      'Simplify migration from external APIs to self-hosted models',
      'Multi-tenant SaaS platforms offering AI capabilities'
    ],
    documentation: 'https://docs.redhat.com/en',
    contacts: ['Ask your Red Hat account team.']
  },
  'openshift': {
    name: 'Red Hat OpenShift',
    description: 'Enterprise Kubernetes platform providing the foundation for AI workloads',
    architecture: {
      components: [
        { name: 'Control Plane', role: 'Cluster Management', description: 'API Server, etcd, Controller Manager, Scheduler' },
        { name: 'Compute Nodes', role: 'Workload Execution', description: 'Worker nodes with kubelet, GPU support, auto-scaling' },
        { name: 'OVN-Kubernetes', role: 'Networking', description: 'The OpenShift network layer, providing software-defined networking with network policies' },
        { name: 'Storage Operators', role: 'Persistent Storage', description: 'Dynamic provisioning with CSI drivers' },
        { name: 'Internal Registry', role: 'Container Images', description: 'Integrated image registry with signing' },
        { name: 'Monitoring Stack', role: 'Observability', description: 'Prometheus, Grafana, Alertmanager' }
      ],
      integrations: [
        { name: 'NVIDIA GPU Operator', purpose: 'GPU management and drivers' },
        { name: 'Node Feature Discovery', purpose: 'Hardware capability detection' },
        { name: 'Red Hat Advanced Cluster Management', purpose: 'Multi-cluster orchestration' }
      ]
    },
    capabilities: [
      'Multi-cluster management and federation',
      'GPU scheduling and resource allocation',
      'Automated certificate management',
      'Built-in CI/CD with OpenShift Pipelines',
      'Service mesh integration (Istio)',
      'Security scanning and compliance',
      'Developer console and CLI tools'
    ],
    useCases: [
      'Foundation for all AI/ML workloads',
      'Multi-tenant AI platforms',
      'Hybrid cloud deployments',
      'Edge AI deployments'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/openshift_container_platform',
    contacts: ['Ask your Red Hat account team.']
  },
  'rhoai': {
    name: 'Red Hat OpenShift AI (RHOAI)',
    description: 'Comprehensive AI/ML platform for the full machine learning lifecycle, including model development, training, serving, and model fine-tuning.',
    requirements:
      'Requires a supported Red Hat OpenShift footprint. Confirm version compatibility, GPU scheduling, and storage classes with your platform team.',
    architecture: {
      components: [
        { name: 'Workbenches', role: 'Development', description: 'Multi-user notebook environments (managed by the Kubeflow notebook controller) with GPU support and custom images' },
        { name: 'Data Science Pipelines', role: 'MLOps', description: 'Kubeflow Pipelines (KFP) for workflow orchestration' },
        { name: 'Model Serving (KServe)', role: 'Inference', description: 'Multi-framework serving with auto-scaling' },
        { name: 'Distributed Workloads', role: 'Training', description: 'Kubeflow Trainer v2 and Ray (distributed compute) for distributed training' },
        { name: 'Dashboard', role: 'Management', description: 'Unified UI for projects and resources' }
      ],
      integrations: [
        { name: 'S3-compatible storage', purpose: 'Data and model artifacts' },
        { name: 'Model Registry', purpose: 'Version control and metadata' },
        { name: 'TrustyAI', purpose: 'Model explainability and monitoring' },
        { name: 'OpenShift Pipelines', purpose: 'CI/CD integration' },
        { name: 'Vector Databases', purpose: 'Retrieval-augmented generation (RAG) with partner and open source vector databases such as Elastic and pgvector' }
      ]
    },
    capabilities: [
      'Jupyter notebooks with GPU scheduling',
      'Pipeline-based ML workflows (KFP)',
      'Multi-framework model serving (TensorFlow, PyTorch, ONNX, etc.)',
      'Distributed training across multiple GPUs/nodes (Kubeflow Trainer v2)',
      'Document processing: PDF, docx, pptx, md, html, plain text',
      'Optical character recognition (OCR) for image-based text and automatic speech recognition (ASR) for audio conversion',
      'Experiment tracking and versioning',
      'Model evaluation with MMLU, HumanEval, and custom benchmarks',
      'Model monitoring and drift detection',
      'Integration with partner tools (VSCode, RStudio)'
    ],
    useCases: [
      'Enterprise ML platform for data science teams',
      'Production model deployment and serving',
      'Distributed training of large models',
      'Retrieval-augmented generation (RAG) applications',
      'Model fine-tuning and distributed training',
      'MLOps automation and governance'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5',
    contacts: ['Ask your Red Hat account team.']
  },
  'rhai': {
    name: 'Red Hat AI portfolio',
    description: 'Red Hat AI is the umbrella name for the Red Hat AI portfolio. This explorer uses it for the Red Hat AI path on standard Kubernetes clusters where OpenShift is not the container platform.',
    requirements:
      'Requires a supported non-OpenShift Kubernetes distribution and validated integrations for networking, storage, and observability. Confirm the supported offering and scope with your Red Hat account team.',
    architecture: {
      components: [
        { name: 'Kubernetes-native services', role: 'Runtime', description: 'Serving, routing, and platform integrations designed for upstream or cloud-managed Kubernetes' },
        { name: 'Inference & tooling', role: 'Workloads', description: 'Aligns with Red Hat AI Inference Server and related Kubernetes-first patterns where applicable' }
      ],
      integrations: [
        { name: 'Cloud or self-managed Kubernetes', purpose: 'Control plane and networking outside OpenShift' },
        { name: 'Partner storage & observability', purpose: 'Typically customer-chosen backing services' }
      ]
    },
    capabilities: [
      'Workshop placement: choose this path when the footprint is non-OpenShift Kubernetes',
      'Not interchangeable with OpenShift AI (RHOAI), which assumes OpenShift',
      'Use OpenShift AI or Red Hat AI Enterprise when OpenShift is the agreed container platform'
    ],
    useCases: [
      'EKS, AKS, or GKE estates standardizing on Kubernetes without OpenShift',
      'Upstream Kubernetes with a supported Red Hat AI software path'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['Ask your Red Hat account team.']
  },
  'rhoai-distributed': {
    name: 'OpenShift AI Distributed Workloads',
    description: 'Enterprise-scale distributed training across multi-node GPU clusters',
    architecture: {
      components: [
        { name: 'Ray', role: 'Distributed Computing', description: 'Framework for parallelizing training across multiple nodes' },
        { name: 'Training Operator', role: 'Job Management', description: 'Kubernetes-native orchestration for PyTorch, TensorFlow jobs' },
        { name: 'Kubeflow Trainer v2', role: 'Resource Management', description: 'Kubernetes-native orchestration for distributed training jobs on OpenShift' }
      ],
      integrations: [

        { name: 'Workbenches', purpose: 'Notebook development environment for training code' },
        { name: 'Model Registry', purpose: 'Register and version trained models' },
        { name: 'S3-compatible storage', purpose: 'Store datasets and checkpoints' },
        { name: 'GPU Operator', purpose: 'Multi-GPU and multi-node GPU scheduling' }
      ]
    },
    capabilities: [
      'Multi-node distributed training',
      'Tensor parallelism (split models across GPUs)',
      'Data parallelism (process different batches simultaneously)',
      'Support for PyTorch, TensorFlow, scikit-learn',
      'Ray Tune for hyperparameter optimization',
      'Checkpoint management and recovery',
      'Integration with Data Science Pipelines'
    ],
    useCases: [
      'Training large language models (70B+ parameters)',
      'Distributed deep learning on massive datasets',
      'Multi-GPU and multi-node training jobs',
      'Enterprise-scale model development'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_distributed_workloads',
    contacts: ['Ask your Red Hat account team.']
  },
  'instructlab': {
    name: 'InstructLab',
    description: 'Model alignment and fine-tuning using synthetic data generation and the LAB method. Technology Preview in Red Hat OpenShift AI — confirm current InstructLab support status with your Red Hat account team.',
    architecture: {
      components: [
        { name: 'LAB Method', role: 'Training Algorithm', description: 'Large-scale Alignment for chatBots - multi-phase training approach' },
        { name: 'Synthetic Data Generation', role: 'Data Creation', description: 'Generates training data from taxonomy definitions' },
        { name: 'Taxonomy System', role: 'Knowledge Organization', description: 'Structured approach to defining skills and knowledge' }
      ],
      integrations: [
        { name: 'Model Registry', purpose: 'Version fine-tuned models' }
      ]
    },
    capabilities: [
      'Synthetic data generation from taxonomy',
      'Small-to-medium scale alignment',
      'Domain-specific skill injection',
      'Taxonomy-driven model improvement',
      'Answer correctness and faithfulness evaluation',
      'Reduced need for human-labeled datasets',
      'Multi-phase LAB-tuning pipelines'
    ],
    useCases: [
      'Adding domain knowledge to foundation models',
      'Fine-tuning with limited training data',
      'Subject-matter-expert-driven model improvement',
      'Alignment for specific use cases or industries'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/customize_models_for_gen_ai_and_agentic_ai_applications',
    contacts: ['Ask your Red Hat account team.']
  },
  'data-science-pipelines': {
    name: 'Data Science Pipelines',
    description: 'Automated ML workflow orchestration based on Kubeflow Pipelines',
    architecture: {
      components: [
        { name: 'Kubeflow Pipelines', role: 'Workflow Engine', description: 'Orchestrates multi-step ML workflows' },
        { name: 'Pipeline Components', role: 'Reusable Steps', description: 'Modular components for data prep, training, evaluation' },
        { name: 'Experiment Tracking', role: 'Versioning', description: 'Track pipeline runs and compare results' }
      ],
      integrations: [
        { name: 'S3-compatible storage', purpose: 'Pipeline artifacts and data' },
        { name: 'Model Registry', purpose: 'Register trained models' },
        { name: 'Workbenches', purpose: 'Develop and test pipelines' },
        { name: 'Distributed Workloads', purpose: 'Execute training steps at scale' }
      ]
    },
    capabilities: [
      'Automated data preparation workflows',
      'Reproducible training pipelines',
      'Hyperparameter tuning automation',
      'Multi-step workflow orchestration',
      'Experiment versioning and comparison',
      'Integration with MLflow (Tech Preview)',
      'CI/CD for ML models'
    ],
    useCases: [
      'Automating recurring training tasks',
      'Ensuring reproducibility across teams',
      'MLOps automation and governance',
      'End-to-end ML lifecycle management'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_ai_pipelines',
    contacts: ['Ask your Red Hat account team.']
  },
  'ai-inference': {
    name: 'Red Hat AI Inference Server',
    description: 'High-performance large language model (LLM) serving powered by vLLM with advanced token-aware scheduling, key-value cache (KV cache) routing, and priority routing based on service level objectives (SLOs)',
    requirements:
      'Requires compatible GPU drivers/operators where used and a supported serving topology. Validate latency objectives and model formats with documentation.',
    architecture: {
      components: [
        { name: 'Advanced Inference Scheduler', role: 'Intelligent Scheduling', description: 'Token-aware scheduling, KV cache routing, split-phase prefill/decode, SLO-based priority routing (latency vs throughput)' },
        { name: 'vLLM Runtime', role: 'Inference Engine', description: 'PagedAttention, continuous batching, multi-GPU support with advanced scheduling capabilities' },
        { name: 'Model Cache', role: 'Performance', description: 'In-memory caching and model preloading' }
      ],
      integrations: [
        { name: 'Inference Routing Layer', purpose: 'Semantic routing and intelligent request distribution' },
        { name: 'Model Registry', purpose: 'Model versioning and deployment' },
        { name: 'Prometheus', purpose: 'Performance metrics and SLIs' },
        { name: 'AI Gateway', purpose: 'Authentication, rate limiting, and semantic routing integration' },
        { name: 'GPU Operator', purpose: 'NVIDIA GPU optimization and scheduling' }
      ]
    },
    capabilities: [
      'Token-Aware Scheduling: Intelligent request routing based on token count',
      'KV Cache-Aware Routing: Maximize GPU utilization with cache-aware scheduling',
      'SLO-Based Priority Routing: Latency-sensitive (low time to first token) vs throughput-sensitive workloads',
      'Split-Phase Inference: Disaggregated prefill/decode for cost optimization',
      'vLLM-based high-performance serving with PagedAttention',
      'Continuous batching for maximum throughput',
      'Multi-GPU tensor parallelism',
      'Token streaming for real-time responses',
      'Quantization and reduced-precision formats such as FP8 and INT4 (GPTQ, AWQ)',
      'Autoscaling via Kubernetes Horizontal Pod Autoscaler (HPA) or KEDA based on request queue depth and custom metrics'
    ],
    useCases: [
      'Production LLM inference needing low time to first token (latency-optimized routing)',
      'High-throughput background workloads (throughput-optimized routing)',
      'Multi-model serving with intelligent routing',
      'Cost-optimized disaggregated serving (split-phase prefill/decode)',
      'Real-time chatbot applications at scale',
      'Batch processing of text generation with efficiency'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['Ask your Red Hat account team.']
  },
  'rh-model-registry': {
    name: 'Red Hat Model Registry',
    description: 'Centralized model versioning, metadata, and lifecycle management',
    architecture: {
      components: [
        { name: 'Metadata Store', role: 'Database', description: 'MySQL/PostgreSQL for model metadata and versioning' },
        { name: 'Artifact Storage', role: 'Objects', description: 'S3-compatible storage for model weights' },
        { name: 'Registry API', role: 'Interface', description: 'REST API for registration and discovery' }
      ],
      integrations: [
        { name: 'OpenShift AI Pipelines', purpose: 'Automated model registration' },
        { name: 'Model Serving', purpose: 'Deployment from registry' },
        { name: 'TrustyAI', purpose: 'Model lineage and governance' }
      ]
    },
    capabilities: [
      'Model versioning and tagging',
      'Metadata tracking (metrics, parameters, etc.)',
      'Model lineage and provenance',
      'Search and discovery',
      'Access control and permissions',
      'Integration with ML frameworks'
    ],
    useCases: [
      'Team collaboration on model development',
      'Production model governance',
      'A/B testing and canary deployments',
      'Audit trails for compliance'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['Ask your Red Hat account team.']
  },
  'rh-observability': {
    name: 'OpenShift Monitoring Stack',
    description: 'Integrated Prometheus and Grafana for AI workload monitoring',
    architecture: {
      components: [
        { name: 'Prometheus', role: 'Metrics Collection', description: 'Time-series database for metrics' },
        { name: 'Grafana', role: 'Visualization', description: 'Dashboards and alerting' },
        { name: 'Alertmanager', role: 'Notifications', description: 'Alert routing and silencing' },
        { name: 'Thanos', role: 'Long-term Storage', description: 'Multi-cluster metrics aggregation' }
      ],
      integrations: [
        { name: 'Model Serving', purpose: 'Inference metrics (latency, throughput, errors)' },
        { name: 'GPU Operator', purpose: 'GPU utilization metrics' },
        { name: 'TrustyAI', purpose: 'Model quality metrics' }
      ]
    },
    capabilities: [
      'OpenShift monitoring infrastructure (Prometheus + Grafana + Alertmanager)',
      'Infrastructure metrics out-of-box (pod CPU, memory, network)',
      'GPU metrics require NVIDIA DCGM exporter (customer-configured)',
      'Model-specific metrics require custom ServiceMonitors (customer-defined)',
      'Custom Grafana dashboards for AI workloads (customer-built)',
      'Token usage and cost tracking (requires custom instrumentation)',
      'Multi-cluster metrics aggregation with Thanos',
      'Alert rules for model performance (customer-configured)'
    ],
    useCases: [
      'Monitor production model performance',
      'Track GPU utilization and costs',
      'Alert on model drift or errors',
      'Capacity planning for inference workloads'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html-single/monitoring/index',
    contacts: ['Ask your Red Hat account team.']
  },
  'trustyai': {
    name: 'TrustyAI',
    description: 'AI governance, explainability, and fairness toolkit',
    architecture: {
      components: [
        { name: 'Explainability Engine', role: 'Model Analysis', description: 'LIME, SHAP, counterfactual explanations' },
        { name: 'Fairness Monitor', role: 'Bias Detection', description: 'Drift detection, fairness metrics, disparate impact' },
        { name: 'Audit Trail', role: 'Compliance', description: 'Inference logging, model lineage, reporting' }
      ],
      integrations: [
        { name: 'Model Serving', purpose: 'Intercept and analyze predictions' },
        { name: 'Prometheus', purpose: 'Metrics collection' },
        { name: 'Model Registry', purpose: 'Model lineage tracking' }
      ]
    },
    capabilities: [
      'Model explainability (LIME, SHAP)',
      'Fairness and bias detection',
      'Model drift monitoring',
      'Counterfactual explanations',
      'Inference audit logging',
      'Compliance reporting',
      'Data drift detection'
    ],
    useCases: [
      'Regulated industries (finance, healthcare)',
      'Fair lending and hiring applications',
      'Model risk management',
      'Explainable AI requirements'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/monitoring_your_ai_systems',
    contacts: ['Ask your Red Hat account team.']
  },
  'rh-mcp-full': {
    name: 'Red Hat MCP Platform (Technology Preview)',
    description: 'Model Context Protocol platform components for AI agent tool integration. Note: MCP is an emerging standard - verify component availability and maturity with your Red Hat account team.',
    architecture: {
      components: [
        { name: 'MCP Catalog', role: 'Discovery', description: 'Browse and discover MCP servers' },
        { name: 'MCP Lifecycle Operator', role: 'Management', description: 'Kubernetes-native MCP server management (Tech Preview)' },
        { name: 'MCP Gateway', role: 'Routing', description: 'Access control and tool routing (Tech Preview)' },
        { name: 'MCP Registry', role: 'Governance', description: 'Metadata and governance registry' },
        { name: 'Ingestion Pipeline', role: 'Validation', description: 'MCP server ingestion workflow' }
      ],
      integrations: [
        { name: 'Technology Partner MCP Servers', purpose: 'Confluent Cloud, EDB Postgres AI, HashiCorp (Terraform), Microsoft Azure, Dynatrace, Elastic' },
        { name: 'Community MCP Servers', purpose: 'MongoDB, MariaDB, PostgreSQL, GitHub, GitLab' },
        { name: 'Model Serving', purpose: 'Connect models to external tools' },
        { name: 'AI Gateway', purpose: 'Authentication and policy enforcement' }
      ]
    },
    capabilities: [
      'MCP server discovery and catalog',
      'Governance and metadata registry',
      'Kubernetes-native deployment patterns',
      'Partner MCP server integrations',
      'Tool routing and access control (Tech Preview)',
      'Security scanning for MCP servers',
      'RBAC integration with OpenShift'
    ],
    useCases: [
      'Agentic AI with external tool access',
      'RAG with enterprise data sources',
      'Multi-agent orchestration',
      'Secure tool integration with certified partners'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_ogx',
    contacts: ['Ask your Red Hat account team.']
  },
  'rh-mcp-catalog': {
    name: 'MCP Catalog & Registry',
    description: 'Discovery and governance platform for MCP servers without automated deployment',
    architecture: {
      components: [
        { name: 'MCP Registry', role: 'Governance', description: 'System of record for MCP metadata and certification' },
        { name: 'MCP Catalog', role: 'Discovery', description: 'Browse and filter certified MCP servers' }
      ],
      integrations: [
        { name: 'Partner MCP Servers', purpose: 'View certified partners (Confluent, MongoDB, etc.)' },
        { name: 'AI Gateway', purpose: 'Can integrate for authentication' }
      ]
    },
    capabilities: [
      'Browse certified MCP servers by category',
      'View MCP server metadata and documentation',
      'Track certification and trust levels',
      'Governance and compliance reporting',
      'Manual deployment workflows'
    ],
    useCases: [
      'Teams wanting visibility without auto-deployment',
      'Manual approval workflows required',
      'Browsing available tools before commitment',
      'Governance-focused deployments'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_ogx',
    contacts: ['Ask your Red Hat account team.']
  },
  'rh-mcp-registry': {
    name: 'MCP Registry Only',
    description: 'System of record for MCP governance - API-only, no UI',
    architecture: {
      components: [
        { name: 'MCP Registry', role: 'Governance', description: 'Metadata, certification, and API access' }
      ],
      integrations: [
        { name: 'Custom Tooling', purpose: 'Build your own catalog or deployment tools' },
        { name: 'CI/CD Pipelines', purpose: 'Automated MCP governance checks' }
      ]
    },
    capabilities: [
      'REST API for MCP metadata',
      'Certification tracking and validation',
      'Governance policy enforcement',
      'Headless MCP management',
      'Integration with custom tooling'
    ],
    useCases: [
      'Building custom MCP management interfaces',
      'API-driven governance',
      'Integration with existing tools',
      'Advanced users with custom workflows'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_ogx',
    contacts: ['Ask your Red Hat account team.']
  },
  'odf': {
    name: 'OpenShift Data Foundation',
    description: 'Software-defined storage for persistent data and object storage',
    architecture: {
      components: [
        { name: 'Ceph', role: 'Storage Backend', description: 'Distributed object, block, and file storage' },
        { name: 'NooBaa', role: 'Multi-cloud Gateway', description: 'S3-compatible object storage abstraction' },
        { name: 'CSI Drivers', role: 'Kubernetes Integration', description: 'Dynamic volume provisioning' },
        { name: 'Rook Operator', role: 'Management', description: 'Kubernetes-native Ceph orchestration' }
      ],
      integrations: [
        { name: 'Red Hat OpenShift AI (RHOAI)', purpose: 'Dataset and model storage' },
        { name: 'Model Registry', purpose: 'Model artifact storage' },
        { name: 'Backup/DR', purpose: 'OADP integration' }
      ]
    },
    capabilities: [
      'S3-compatible object storage',
      'Block storage for persistent volumes',
      'File storage (CephFS)',
      'Multi-cloud data mobility',
      'Encryption at rest and in transit',
      'Snapshots and clones',
      'Auto-scaling and rebalancing'
    ],
    useCases: [
      'Dataset storage for training',
      'Model artifact repository',
      'Persistent volumes for notebooks',
      'Multi-cloud data management'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_data_foundation/',
    contacts: ['Ask your Red Hat account team.']
  },
  'kserve': {
    name: 'KServe (via OpenShift AI)',
    description: 'Kubernetes-native multi-framework model serving with HTTPRoute-based ingress and advanced LLM capabilities',
    architecture: {
      components: [
        { name: 'KServe Controller', role: 'Orchestration', description: 'Reconciles InferenceService, InferenceGraph, TrainedModel, and LLMInferenceService custom resources' },
        { name: 'Storage Initializer', role: 'Model Loading', description: 'Downloads model artifacts from S3, GCS, Azure Blob into serving containers' },
        { name: 'KServe Agent', role: 'Model Management', description: 'Logging, batching, multi-model serving management' },
        { name: 'KServe Router', role: 'InferenceGraph', description: 'Directed acyclic graph (DAG) based routing for multi-model inference pipelines' },
        { name: 'kube-rbac-proxy', role: 'Authentication', description: 'Sidecar for auth/authz when security annotation enabled' },
        { name: 'LLMInferenceService Controller', role: 'LLM Serving', description: 'Specialized controller for LLM workloads with advanced scheduling' }
      ],
      integrations: [
        { name: 'Gateway API (HTTPRoute)', purpose: 'Ingress routing via openshift-ai-inference Gateway' },
        { name: 'Advanced Inference Scheduler', purpose: 'Token-aware scheduling and key-value cache (KV cache) routing for large language models' },
        { name: 'Istio/Service Mesh', purpose: 'Optional VirtualService-based ingress (legacy)' },
        { name: 'KEDA', purpose: 'ScaledObject-based autoscaling' },
        { name: 'S3-compatible storage', purpose: 'Model artifact storage' },
        { name: 'OpenTelemetry', purpose: 'Distributed tracing' }
      ]
    },
    capabilities: [
      'Multi-framework serving: TensorFlow, PyTorch, ONNX, Scikit-learn, XGBoost',
      'InferenceService API (v1beta1) for single-model serving',
      'InferenceGraph API (v1alpha1) for DAG-based multi-model pipelines',
      'LLMInferenceService API (v1alpha1) with advanced scheduling',
      'TrainedModel API for multi-model serving on shared runtimes',
      'HTTPRoute-based ingress with Gateway API',
      'kube-rbac-proxy authentication when enabled',
      'Model artifact download from S3/GCS/Azure Blob',
      'Autoscaling via HPA and KEDA (Knative Serving optional for serverless scaling)',
      'Multi-node LLM serving with LeaderWorkerSet',
      'Token-aware scheduling and KV cache routing',
      'Support for custom serving runtimes (ServingRuntime CRD)'
    ],
    useCases: [
      'Multi-framework ML model serving across TensorFlow, PyTorch, ONNX',
      'InferenceGraph pipelines for pre/post-processing workflows',
      'LLM serving with advanced scheduling and KV cache optimization',
      'Multi-model serving sharing runtime resources',
      'Production serving with authentication and authorization',
      'Autoscaling inference workloads (HPA/KEDA based on metrics, Knative for serverless)'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/deploying_models',
    contacts: ['Ask your Red Hat account team.']
  },
  'rh-evaluation': {
    name: 'EvalHub (OpenShift AI Model Evaluation)',
    description: 'Technology Preview — Kubernetes-native evaluation orchestration routing to multiple benchmark frameworks with MLflow integration; confirm scope with your Red Hat account team',
    architecture: {
      components: [
        { name: 'EvalHub API Server', role: 'Orchestration', description: 'REST API for creating, managing, and tracking evaluation jobs' },
        { name: 'Kubernetes Runtime', role: 'Job Execution', description: 'Creates batch Jobs and ConfigMaps for evaluation workloads in tenant namespaces' },
        { name: 'lm-evaluation-harness Adapter', role: 'LLM Benchmarks', description: 'Runs a broad set of large language model benchmarks (MMLU, HellaSwag, TruthfulQA, and others)' },
        { name: 'GuideLLM Adapter', role: 'Performance', description: 'LLM performance and throughput benchmarking' },
        { name: 'LightEval Adapter', role: 'Benchmarks', description: 'Additional evaluation framework support' },
        { name: 'RAGAS Adapter', role: 'RAG Evaluation', description: 'RAG pipeline quality assessment' },
        { name: 'Garak Adapter', role: 'Security', description: 'LLM vulnerability and robustness testing' },
        { name: 'MLflow Integration', role: 'Experiment Tracking', description: 'Logs evaluation results to MLflow tracking server' }
      ],
      integrations: [
        { name: 'TrustyAI Service Operator', purpose: 'Deploys and manages EvalHub via EvalHub CR' },
        { name: 'MLflow', purpose: 'Experiment tracking and result storage' },
        { name: 'Kubernetes API', purpose: 'Job creation, TokenReview, SubjectAccessReview' },
        { name: 'S3-compatible storage', purpose: 'Test data and benchmark dataset storage' }
      ]
    },
    capabilities: [
      'Unified REST API for multi-framework evaluation orchestration',
      'lm-evaluation-harness: a broad set of benchmarks (MMLU, HellaSwag, TruthfulQA, and others)',
      'GuideLLM: Performance and throughput benchmarking',
      'RAGAS: RAG pipeline evaluation (answer correctness, faithfulness)',
      'Garak: LLM security and vulnerability testing',
      'Multi-tenant operation with namespace isolation (X-Tenant header)',
      'Kubernetes TokenReview and SubjectAccessReview-based auth',
      'MLflow experiment tracking integration',
      'Benchmark collections and provider management',
      'PostgreSQL or SQLite storage backends',
      'Prometheus metrics and OpenTelemetry tracing',
      'FIPS-compliant builds'
    ],
    useCases: [
      'Automated model quality assessment across multiple benchmarks',
      'LLM performance and throughput testing with GuideLLM',
      'RAG pipeline evaluation with answer correctness and faithfulness metrics',
      'Security and robustness testing with Garak',
      'Multi-tenant evaluation workflows with experiment tracking',
      'Continuous model evaluation in MLOps pipelines'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/evaluating_ai_systems',
    contacts: ['Ask your Red Hat account team.']
  },
  'instructlab-eval': {
    name: 'InstructLab Evaluation',
    description: 'LAB-based model quality assessment with answer correctness and faithfulness evaluation',
    architecture: {
      components: [
        { name: 'LAB Evaluator', role: 'Assessment', description: 'Evaluates model outputs against taxonomy-defined expectations' },
        { name: 'Synthetic Data Judge', role: 'Quality Check', description: 'Assesses quality of generated synthetic training data' },
        { name: 'Taxonomy Validator', role: 'Correctness', description: 'Validates model responses against skill/knowledge taxonomy' }
      ],
      integrations: [
        { name: 'InstructLab', purpose: 'Evaluate fine-tuned models and synthetic data quality' },
        { name: 'OpenShift AI Pipelines', purpose: 'Automated evaluation in training workflows' },
        { name: 'Model Registry', purpose: 'Track evaluation metrics with model versions' }
      ]
    },
    capabilities: [
      'Answer correctness evaluation against taxonomy',
      'Faithfulness assessment for generated responses',
      'Synthetic data quality validation',
      'Skill injection verification',
      'Knowledge retention testing',
      'Taxonomy-driven evaluation criteria',
      'Integration with LAB training pipelines'
    ],
    useCases: [
      'Validating fine-tuned model quality after LAB training',
      'Assessing synthetic data generation quality',
      'Verifying skill injection effectiveness',
      'Continuous evaluation in InstructLab workflows',
      'Domain-specific model quality assessment'
    ],
    documentation: null,
    contacts: ['Ask your Red Hat account team.']
  },
  'project-navigator': {
    name: 'Project Navigator',
    description: 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team. An intent-based AI workflow orchestrator that aims to simplify model selection and workflow coordination.',
    architecture: {
      components: [
        { name: 'Workflow Orchestration', role: 'Coordination', description: 'Interprets what the user is trying to do and coordinates multi-step AI workflows' },
        { name: 'Model Selection', role: 'Routing', description: 'Helps pick a suitable model for the task at hand' }
      ],
      integrations: [
        { name: 'Model Serving', purpose: 'Execute model inference requests' },
        { name: 'Vector Databases', purpose: 'Retrieval-augmented generation (RAG) workflows' }
      ]
    },
    capabilities: [
      'Intent-based routing to models and workflows (early stage)',
      'Multi-step AI workflow coordination (early stage)',
      'Details and feature set are not confirmed — ask your Red Hat account team'
    ],
    useCases: [
      'Simplifying model selection for multi-model systems',
      'Multi-step AI workflows requiring orchestration'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['Ask your Red Hat account team.']
  },
  'gen-ai-studio': {
    name: 'Gen AI Studio',
    description: 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team. Prompt testing, experimentation, and AI asset management.',
    architecture: {
      components: [
        { name: 'Prompt Lab', role: 'Development', description: 'Interactive environment for prompt engineering and testing' },
        { name: 'Asset Library', role: 'Management', description: 'Version control for prompts, configs, and AI artifacts' },
        { name: 'Experimentation UI', role: 'Testing', description: 'A/B testing and comparison of model outputs' },
        { name: 'Template Manager', role: 'Reusability', description: 'Reusable prompt templates and chains' }
      ],
      integrations: [
        { name: 'Model Serving', purpose: 'Test prompts against deployed models' },
        { name: 'Model Registry', purpose: 'Link prompts to specific model versions' },
        { name: 'OpenShift AI Dashboard', purpose: 'Unified UI integration' }
      ]
    },
    capabilities: [
      'Interactive prompt engineering and testing',
      'A/B testing for prompt variations',
      'Version control for prompts and AI assets',
      'Reusable prompt templates and chains',
      'Multi-model comparison and evaluation',
      'Collaboration features for teams',
      'Integration with model serving endpoints',
      'Export prompts to production workflows'
    ],
    useCases: [
      'Prompt engineering and optimization',
      'Experimentation and A/B testing of AI interactions',
      'Team collaboration on AI assets',
      'Prototyping AI applications before production',
      'Managing prompt libraries across projects'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5',
    contacts: ['Ask your Red Hat account team.']
  },
  'rhaie': {
    name: 'Red Hat AI Enterprise (RHAIE)',
    description: 'The name this explorer uses for the combined OpenShift plus OpenShift AI platform path. Confirm current packaging and naming with your Red Hat account team.',
    architecture: {
      components: [
        { name: 'OpenShift Platform', role: 'Infrastructure', description: 'Enterprise Kubernetes with GPU support and networking' },
        { name: 'OpenShift AI', role: 'AI/ML Platform', description: 'Full ML lifecycle: notebooks, pipelines, training, serving' },
        { name: 'Integrated Monitoring', role: 'Observability', description: 'Pre-configured Prometheus + Grafana for AI workloads' },
        { name: 'GPU Operator', role: 'Acceleration', description: 'NVIDIA GPU management and scheduling' }
      ],
      integrations: [
        { name: 'OpenShift Data Foundation', purpose: 'Integrated storage solution (optional)' },
        { name: 'Red Hat single sign-on (SSO)', purpose: 'Unified identity and access management' },
        { name: 'Advanced Cluster Management', purpose: 'Multi-cluster orchestration (optional)' }
      ]
    },
    capabilities: [
      'Single-stack deployment of OpenShift + OpenShift AI',
      'Optimized configurations for AI/ML workloads',
      'Integrated GPU scheduling and management',
      'Pre-configured monitoring and observability',
      'Simplified licensing and support model',
      'Validated reference architectures',
      'Enterprise support for full stack',
      'All OpenShift AI capabilities included',
      'All OpenShift capabilities included'
    ],
    useCases: [
      'Greenfield AI platform deployments',
      'Organizations wanting single-vendor solution',
      'Simplified procurement and licensing',
      'Turnkey AI infrastructure and platform',
      'Enterprise AI with comprehensive support'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5',
    contacts: ['Ask your Red Hat account team.']
  },
  'rhel-ai': {
    name: 'Red Hat Enterprise Linux AI',
    description: 'A generative AI inference platform for Linux environments, delivered as a portable bootc image built on Red Hat Enterprise Linux (RHEL). Uses the vLLM engine for LLM inference and the Red Hat AI Model Optimization Toolkit (llm-compressor) for model quantization and compression. Runs on bare metal or virtual machines — no Kubernetes required.',
    architecture: {
      components: [
        { name: 'Red Hat AI Inference (vLLM)', role: 'Inference', description: 'High-throughput LLM serving via the vLLM engine, exposed as an OpenAI-compatible API via a systemd Quadlet service' },
        { name: 'Red Hat AI Model Optimization Toolkit', role: 'Model Compression', description: 'llm-compressor for model quantization, sparsity, and compression (CUDA image available; check with Red Hat for other accelerators)' },
        { name: 'Bootc Image', role: 'Delivery', description: 'Portable RHEL-based bootc container image for bare metal and VM deployment' }
      ],
      integrations: [
        { name: 'RHEL Subscription', purpose: 'Base operating system and support' },
        { name: 'Podman', purpose: 'Container runtime for model serving' },
        { name: 'systemd', purpose: 'Service management for inference endpoints (rhaiis Quadlet service)' }
      ]
    },
    capabilities: [
      'LLM inference via vLLM with OpenAI-compatible API (/v1/completions)',
      'Model quantization, sparsity, and compression via Red Hat AI Model Optimization Toolkit (llm-compressor)',
      'Pre-optimized validated models',
      'Model loading from Hugging Face models, ModelCar container images, or OCI artifact images',
      'No Kubernetes or OpenShift required — runs on bare metal or VMs',
      'RHEL security and compliance features',
      'NVIDIA GPU support (CUDA); AMD GPU support (ROCm) for inference only'
    ],
    useCases: [
      'LLM inference on bare metal or virtual machines without Kubernetes',
      'Edge and air-gapped deployments on RHEL',
      'Model quantization and compression before deployment',
      'Linux-native AI serving for teams without an OpenShift footprint',
      'Development and testing before scaling to Red Hat OpenShift AI'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_ai/3.5',
    contacts: ['Ask your Red Hat account team.']
  },
  'batch-gateway': {
    name: 'Red Hat Batch Gateway',
    description: 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team. An OpenAI-compatible batch inference gateway for processing bulk large language model (LLM) requests asynchronously.',
    architecture: {
      components: [
        { name: 'Batch API', role: 'REST API', description: 'OpenAI-compatible batch and file endpoints for submitting bulk requests' },
        { name: 'Batch Processing', role: 'Job Handling', description: 'Queues and dispatches batch jobs to inference backends asynchronously' }
      ],
      integrations: [
        { name: 'AI Inference Server', purpose: 'Downstream inference endpoint for batch requests (OpenAI-compatible)' },
        { name: 'KServe', purpose: 'Alternative inference backend' },
        { name: 'S3-compatible storage', purpose: 'Batch file storage (input/output)' }
      ]
    },
    capabilities: [
      'OpenAI-compatible batch and file APIs (early stage)',
      'Asynchronous processing of bulk inference requests (early stage)',
      'Details and limits are not confirmed — ask your Red Hat account team'
    ],
    useCases: [
      'High-volume offline inference (for example, processing large document sets overnight)',
      'Cost-conscious inference where batch requests use resources more efficiently',
      'Asynchronous workflows where a real-time response is not needed'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['Ask your Red Hat account team.']
  },
  'fms-guardrails': {
    name: 'FMS Guardrails Orchestrator',
    description: 'REST API middleware coordinating AI text generation with content safety guardrails',
    architecture: {
      components: [
        { name: 'Orchestrator Server', role: 'Middleware', description: 'Routes requests through detector → chunker → LLM pipeline (Rust/Axum)' },
        { name: 'Detector Client', role: 'Safety Analysis', description: 'Connects to hate, abuse, and profanity (HAP) detection and other detector services for content analysis' },
        { name: 'Chunker Client', role: 'Tokenization', description: 'Text segmentation for detector processing (gRPC)' },
        { name: 'Generation Client', role: 'LLM Backend', description: 'Connects to vLLM or other OpenAI-compatible model servers' }
      ],
      integrations: [
        { name: 'vLLM / OpenAI-compatible', purpose: 'Text generation backend' },
        { name: 'HAP Detector', purpose: 'Hate, abuse, and profanity detection service' },
        { name: 'Custom Detectors', purpose: 'Configurable content safety services' },
        { name: 'OpenTelemetry', purpose: 'Distributed tracing and metrics' }
      ]
    },
    capabilities: [
      'Content safety detection (hate, abuse, profanity)',
      'Chat message detection and filtering',
      'Context document safety analysis',
      'Generation-coupled detection (real-time screening)',
      'Streaming and unary request patterns',
      'Configurable score thresholds for blocking',
      'TLS and mTLS support for all connections',
      'OpenTelemetry instrumentation',
      'Multiple API versions (v1, v2)',
      'Standalone detection endpoints (no generation)',
      'Rust-based high-performance middleware'
    ],
    useCases: [
      'Regulated industries requiring content moderation',
      'Customer-facing chatbots needing safety controls',
      'Preventing harmful or toxic outputs from LLMs',
      'Compliance with content safety regulations',
      'Multi-layered safety (input + output detection)',
      'Real-time content filtering for production APIs'
    ],
    documentation: 'https://github.com/red-hat-data-services/fms-guardrails-orchestrator',
    contacts: ['Ask your Red Hat account team.']
  },
  'llama-stack-distribution': {
    name: 'Llama Stack Distribution',
    description: 'Meta\'s unified AI/ML API server with inference, agents, safety, evaluation, and vector I/O',
    architecture: {
      components: [
        { name: 'Llama Stack Server', role: 'Unified API', description: 'FastAPI server exposing /v1/* endpoints for all capabilities' },
        { name: 'Inference Providers', role: 'LLM Serving', description: 'vLLM (primary), AWS Bedrock, Azure, Vertex AI, WatsonX, OpenAI' },
        { name: 'Vector Providers', role: 'Embeddings', description: 'Milvus, pgvector, Qdrant, FAISS for vector storage' },
        { name: 'Safety Providers', role: 'Guardrails', description: 'TrustyAI FMS integration for content safety' },
        { name: 'Eval Providers', role: 'Evaluation', description: 'LM Eval, RAGAS, Garak for model assessment' },
        { name: 'Agent Runtime', role: 'Orchestration', description: 'Agent creation, session management, and tool use' },
        { name: 'PostgreSQL Backend', role: 'Persistence', description: 'Key-value (KV) store, inference logs, agent state, file metadata' }
      ],
      integrations: [
        { name: 'vLLM', purpose: 'Primary inference and embedding backend' },
        { name: 'TrustyAI FMS', purpose: 'Safety shield evaluation' },
        { name: 'TrustyAI LM Eval', purpose: 'Model evaluation jobs' },
        { name: 'Kubeflow Pipelines', purpose: 'RAGAS and Garak evaluation execution' },
        { name: 'PostgreSQL', purpose: 'Persistent state storage' },
        { name: 'Milvus Lite', purpose: 'Default inline vector store' },
        { name: 'OpenTelemetry', purpose: 'Traces and metrics export' }
      ]
    },
    capabilities: [
      'OpenAI-compatible chat/completions API (/v1/chat/completions)',
      'Inference with multiple backends (vLLM, Bedrock, Azure, etc.)',
      'Agent creation with tool use and session management',
      'Safety shield evaluation (TrustyAI FMS)',
      'Model evaluation (LM Eval, RAGAS, Garak)',
      'Vector database operations (Milvus, pgvector, Qdrant, FAISS)',
      'File upload and management',
      'Dataset I/O operations',
      'Scoring functions (basic, LLM-as-judge, Braintrust)',
      'Batch processing',
      'PostgreSQL-backed persistence',
      'Multi-arch support (x86_64, arm64)',
      'Sentence transformers for inline embeddings',
      'Pre-downloaded Granite embedding model'
    ],
    useCases: [
      'Unified API for all AI/ML capabilities (single endpoint)',
      'Agentic applications with tool use',
      'RAG applications with integrated vector storage',
      'Model evaluation workflows',
      'Safety-first LLM deployments with built-in guardrails',
      'Multi-provider inference (cloud + on-prem)',
      'Developers familiar with Meta\'s Llama Stack ecosystem'
    ],
    documentation: 'https://github.com/red-hat-data-services/ogx-distribution',
    contacts: ['Ask your Red Hat account team.']
  }
};
