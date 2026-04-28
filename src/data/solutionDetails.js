// Deep dive details for Red Hat solutions
export const solutionDetails = {
  'rh-gateway': {
    name: 'Red Hat AI Gateway',
    description: 'Enterprise-grade API gateway for AI workloads with authentication, rate limiting, and semantic routing',
    architecture: {
      components: [
        { name: 'Authorino', role: 'Authentication & Authorization', description: 'Kubernetes-native auth service supporting OAuth, OIDC, API keys, mTLS' },
        { name: 'Kuadrant (Limitador)', role: 'Rate Limiting & Quotas', description: 'Distributed rate limiting service with token bucket algorithm and quota management' },
        { name: 'Envoy Proxy', role: 'L7 Proxy', description: 'High-performance proxy for routing, load balancing, and circuit breaking' },
        { name: 'llm-d Router', role: 'Semantic Routing', description: 'Token-aware scheduling with KV cache-aware routing for GPU optimization' }
      ],
      integrations: [
        { name: 'OpenShift Service Mesh', purpose: 'Traffic management and observability' },
        { name: 'Red Hat SSO / Keycloak', purpose: 'Identity provider integration' },
        { name: 'Prometheus', purpose: 'Metrics and monitoring' },
        { name: 'Project Navigator', purpose: 'Intent-based workflow orchestration' },
        { name: 'AutoRAG', purpose: 'Optimized RAG endpoint routing' }
      ]
    },
    capabilities: [
      'Authentication: OAuth, OIDC, API keys, mTLS',
      'SLO-based priority routing (latency-sensitive vs throughput-sensitive)',
      'KV Cache-aware intelligent routing for GPU utilization',
      'Rate limiting and quota management per user/tenant',
      'Semantic routing with intent-based model selection',
      'Request routing and load balancing',
      'Circuit breaking and retry policies',
      'API analytics and metrics',
      'RBAC policy enforcement'
    ],
    useCases: [
      'Multi-tenant AI platforms requiring isolation',
      'Production inference endpoints with SLAs (<200ms TTFT)',
      'External API exposure with security requirements',
      'Usage-based billing and quota management',
      'Intent-based routing to optimal models'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['#forum-ai-gateway', 'ai-gateway-support@redhat.com']
  },
  'openshift': {
    name: 'Red Hat OpenShift',
    description: 'Enterprise Kubernetes platform providing the foundation for AI workloads',
    architecture: {
      components: [
        { name: 'Control Plane', role: 'Cluster Management', description: 'API Server, etcd, Controller Manager, Scheduler' },
        { name: 'Compute Nodes', role: 'Workload Execution', description: 'Worker nodes with kubelet, GPU support, auto-scaling' },
        { name: 'OpenShift SDN/OVN', role: 'Networking', description: 'Software-defined networking with network policies' },
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
    documentation: 'https://docs.openshift.com',
    contacts: ['#forum-openshift', 'openshift-support@redhat.com']
  },
  'rhoai': {
    name: 'Red Hat OpenShift AI (RHOAI)',
    description: 'Comprehensive AI/ML platform for the full machine learning lifecycle with AutoRAG and InstructLab',
    architecture: {
      components: [
        { name: 'JupyterHub / Workbenches', role: 'Development', description: 'Multi-user notebooks with GPU support and custom images' },
        { name: 'Data Science Pipelines', role: 'MLOps', description: 'Kubeflow Pipelines (KFP) for workflow orchestration' },
        { name: 'Model Serving (KServe)', role: 'Inference', description: 'Multi-framework serving with auto-scaling' },
        { name: 'Distributed Workloads', role: 'Training', description: 'CodeFlare/Ray for distributed training' },
        { name: 'AutoRAG', role: 'RAG Optimization', description: 'Automated optimization of chunking, embeddings, and top-K retrieval' },
        { name: 'InstructLab', role: 'Fine-Tuning', description: 'LAB-based synthetic data generation and model fine-tuning' },
        { name: 'Dashboard', role: 'Management', description: 'Unified UI for projects and resources' }
      ],
      integrations: [
        { name: 'S3-compatible storage', purpose: 'Data and model artifacts' },
        { name: 'Model Registry', purpose: 'Version control and metadata' },
        { name: 'TrustyAI', purpose: 'Model explainability and monitoring' },
        { name: 'OpenShift Pipelines', purpose: 'CI/CD integration' },
        { name: 'Vector Databases', purpose: 'RAG with Elastic, pgvector, etc.' }
      ]
    },
    capabilities: [
      'Jupyter notebooks with GPU scheduling',
      'Pipeline-based ML workflows (KFP)',
      'Multi-framework model serving (TensorFlow, PyTorch, ONNX, etc.)',
      'Distributed training across multiple GPUs/nodes',
      'AutoRAG: Automated chunking strategy, embedding model, and top-K optimization',
      'InstructLab integration: LAB-based fine-tuning with synthetic data generation',
      'Document processing: PDF, docx, pptx, md, html, plain text',
      'OCR for image-based text and ASR for audio conversion',
      'Experiment tracking and versioning',
      'Model evaluation with MMLU, HumanEval, and custom benchmarks',
      'Model monitoring and drift detection',
      'Integration with partner tools (VSCode, RStudio)'
    ],
    useCases: [
      'Enterprise ML platform for data science teams',
      'Production model deployment and serving',
      'Distributed training of large models',
      'RAG applications with AutoRAG optimization',
      'Fine-tuning with InstructLab',
      'MLOps automation and governance'
    ],
    documentation: 'https://docs.redhat.com/rhoai',
    contacts: ['#forum-openshift-ai', '#forum-rhai-docs', 'Suhas Kashyap (AutoRAG/Navigator SME)']
  },
  'rhoai-distributed': {
    name: 'RHOAI Distributed Workloads',
    description: 'Enterprise-scale distributed training across multi-node GPU clusters',
    architecture: {
      components: [
        { name: 'Ray', role: 'Distributed Computing', description: 'Framework for parallelizing training across multiple nodes' },
        { name: 'Training Operator', role: 'Job Management', description: 'Kubernetes-native orchestration for PyTorch, TensorFlow jobs' },
        { name: 'CodeFlare', role: 'Resource Management', description: 'Manages distributed resources on OpenShift' }
      ],
      integrations: [
        { name: 'JupyterHub', purpose: 'Development environment for training code' },
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
    documentation: 'https://docs.redhat.com/rhoai',
    contacts: ['#forum-openshift-ai', 'Mustafa (Training-Hub SME)']
  },
  'instructlab': {
    name: 'InstructLab',
    description: 'Model alignment and fine-tuning using synthetic data generation and the LAB method',
    architecture: {
      components: [
        { name: 'LAB Method', role: 'Training Algorithm', description: 'Large-scale Alignment for chatBots - multi-phase training approach' },
        { name: 'Synthetic Data Generation', role: 'Data Creation', description: 'Generates training data from taxonomy definitions' },
        { name: 'Taxonomy System', role: 'Knowledge Organization', description: 'Structured approach to defining skills and knowledge' }
      ],
      integrations: [
        { name: 'RHEL AI', purpose: 'Bundled for single-server fine-tuning' },
        { name: 'OpenShift AI', purpose: 'Distributed multi-phase training pipelines' },
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
      'Subject matter expert-driven model improvement',
      'Alignment for specific use cases or industries'
    ],
    documentation: 'https://docs.redhat.com/instructlab',
    contacts: ['#forum-instructlab', 'Abhishek Bhanwalder (SDG SME)']
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
        { name: 'JupyterHub', purpose: 'Develop and test pipelines' },
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
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/latest/html/working_with_data_science_pipelines',
    contacts: ['#forum-openshift-ai', '#team-openshift-ai-platform']
  },
  'ai-inference': {
    name: 'Red Hat AI Inference Server',
    description: 'High-performance LLM serving powered by vLLM and llm-d for advanced token-aware scheduling, KV cache routing, and SLO-based priority',
    architecture: {
      components: [
        { name: 'llm-d Inference Scheduler', role: 'Advanced Scheduling', description: 'Token-aware scheduling, KV cache routing, split-phase prefill/decode, SLO-based priority routing (latency vs throughput)' },
        { name: 'vLLM Runtime', role: 'Inference Engine', description: 'PagedAttention, continuous batching, multi-GPU support - orchestrated by llm-d' },
        { name: 'TGIS', role: 'Text Generation', description: 'Alternative runtime for streaming and batch inference' },
        { name: 'Model Cache', role: 'Performance', description: 'In-memory caching and model preloading' }
      ],
      integrations: [
        { name: 'llm-d Gateway', purpose: 'Semantic routing and intelligent request distribution' },
        { name: 'Model Registry', purpose: 'Model versioning and deployment' },
        { name: 'Prometheus', purpose: 'Performance metrics and SLIs' },
        { name: 'AI Gateway', purpose: 'Authentication, rate limiting, and semantic routing integration' },
        { name: 'GPU Operator', purpose: 'NVIDIA GPU optimization and scheduling' }
      ]
    },
    capabilities: [
      '🚀 llm-d Token-Aware Scheduling: Intelligent request routing based on token count',
      '🚀 llm-d KV Cache Routing: Maximize GPU utilization with cache-aware scheduling',
      '🚀 llm-d SLO-Based Priority: Latency-sensitive (<200ms TTFT) vs throughput-sensitive routing',
      '🚀 llm-d Split-Phase Inference: Disaggregated prefill/decode for cost optimization',
      'vLLM-based high-performance serving with PagedAttention',
      'Continuous batching for maximum throughput',
      'Multi-GPU tensor parallelism',
      'Token streaming for real-time responses',
      'Model quantization (INT8, FP16)',
      'Auto-scaling based on load and GPU utilization'
    ],
    useCases: [
      'Production LLM inference requiring <200ms TTFT (llm-d latency-sensitive routing)',
      'High-throughput background workloads (llm-d throughput-sensitive routing)',
      'Multi-model serving with intelligent routing (llm-d semantic routing)',
      'Cost-optimized disaggregated serving (llm-d split-phase prefill/decode)',
      'Real-time chatbot applications at scale',
      'Batch processing of text generation with efficiency'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['#forum-ai-inference', 'Shumaila Yaseen (SME)', '#team-llm-d']
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
        { name: 'RHOAI Pipelines', purpose: 'Automated model registration' },
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
    contacts: ['#forum-model-registry']
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
      'Custom metrics for AI workloads',
      'Pre-built Grafana dashboards for ML',
      'GPU utilization and memory tracking',
      'Inference latency and throughput monitoring',
      'Token usage and cost tracking',
      'Multi-cluster metrics aggregation',
      'Alert rules for model degradation'
    ],
    useCases: [
      'Monitor production model performance',
      'Track GPU utilization and costs',
      'Alert on model drift or errors',
      'Capacity planning for inference workloads'
    ],
    documentation: 'https://docs.redhat.com/openshift/monitoring',
    contacts: ['#forum-openshift-monitoring']
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
    documentation: 'https://docs.redhat.com/trustyai',
    contacts: ['#forum-trustyai']
  },
  'rh-mcp-full': {
    name: 'Full MCP Ecosystem',
    description: 'Complete Model Context Protocol platform with governance, discovery, deployment, and security',
    architecture: {
      components: [
        { name: 'MCP Catalog', role: 'Discovery', description: 'Browse and filter MCP servers by category and trust tier' },
        { name: 'MCP Lifecycle Operator', role: 'Management', description: 'Kubernetes-native MCP server orchestration' },
        { name: 'MCP Gateway', role: 'Routing', description: 'Centralized access control and tool aggregation' },
        { name: 'MCP Registry', role: 'Governance', description: 'Metadata, certification, and security scanning' },
        { name: 'Ingestion Pipeline', role: 'Validation', description: 'Four-stage validation: Validate → Scan → Sign & Certify → Publish' }
      ],
      integrations: [
        { name: 'Partner MCP Servers', purpose: 'Confluent, MongoDB, Elastic, Azure, AWS, Google Cloud' },
        { name: 'Model Serving', purpose: 'Connect models to external tools' },
        { name: 'AI Gateway', purpose: 'Authentication and policy enforcement' },
        { name: 'Project Navigator', purpose: 'Intent-based agent orchestration' }
      ]
    },
    capabilities: [
      'Four-stage ingestion pipeline: Validate → Scan → Sign & Certify → Publish',
      'Curated marketplace of certified MCP servers',
      'One-click deployment with security scanning',
      'CVE detection and vulnerability analysis',
      'Cryptographic signing and trust verification',
      'Tool aggregation across multiple backends',
      'RBAC access control and policy enforcement',
      'Kubernetes-native management',
      'Partner integrations (Confluent, MongoDB, Elastic, Azure, AWS, GCP)'
    ],
    useCases: [
      'Agentic AI with external tool access',
      'RAG with enterprise data sources',
      'Multi-agent orchestration',
      'Secure tool integration with certified partners'
    ],
    documentation: 'https://docs.redhat.com/mcp',
    contacts: ['#forum-mcp-gateway', '#team-rh-ai-agent-ops', 'Catherine (Cat) Weeks (SME)']
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
    documentation: 'https://docs.redhat.com/mcp',
    contacts: ['#forum-mcp-gateway', 'Catherine (Cat) Weeks (SME)']
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
    documentation: 'https://docs.redhat.com/mcp',
    contacts: ['#forum-mcp-gateway', 'Catherine (Cat) Weeks (SME)']
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
        { name: 'RHOAI', purpose: 'Dataset and model storage' },
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
    documentation: 'https://docs.redhat.com/odf',
    contacts: ['#forum-odf', '#forum-storage']
  },
  'kserve': {
    name: 'KServe (via RHOAI)',
    description: 'Kubernetes-native multi-framework model serving with HTTPRoute-based ingress and advanced LLM capabilities',
    architecture: {
      components: [
        { name: 'KServe Controller', role: 'Orchestration', description: 'Reconciles InferenceService, InferenceGraph, TrainedModel, LLMInferenceService CRs' },
        { name: 'Storage Initializer', role: 'Model Loading', description: 'Downloads model artifacts from S3, GCS, Azure Blob into serving containers' },
        { name: 'KServe Agent', role: 'Model Management', description: 'Logging, batching, multi-model serving management' },
        { name: 'KServe Router', role: 'InferenceGraph', description: 'DAG-based routing for multi-model inference pipelines' },
        { name: 'kube-rbac-proxy', role: 'Authentication', description: 'Sidecar for auth/authz when security annotation enabled' },
        { name: 'LLMInferenceService Controller', role: 'LLM Serving', description: 'Specialized controller for LLM workloads with llm-d integration' }
      ],
      integrations: [
        { name: 'Gateway API (HTTPRoute)', purpose: 'Ingress routing via openshift-ai-inference Gateway' },
        { name: 'llm-d Scheduler', purpose: 'Token-aware scheduling and KV cache routing for LLMs' },
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
      'LLMInferenceService API (v1alpha2) with llm-d integration',
      'TrainedModel API for multi-model serving on shared runtimes',
      'HTTPRoute-based ingress with Gateway API',
      'kube-rbac-proxy authentication when enabled',
      'Model artifact download from S3/GCS/Azure Blob',
      'Auto-scaling with HPA and KEDA',
      'Multi-node LLM serving with LeaderWorkerSet',
      'Token-aware scheduling and KV cache routing (llm-d)',
      'Support for custom serving runtimes (ServingRuntime CRD)'
    ],
    useCases: [
      'Multi-framework ML model serving across TensorFlow, PyTorch, ONNX',
      'InferenceGraph pipelines for pre/post-processing workflows',
      'LLM serving with advanced scheduling and KV cache optimization',
      'Multi-model serving sharing runtime resources',
      'Production serving with authentication and authorization',
      'Auto-scaling inference workloads based on load'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/latest/html/serving_models',
    contacts: ['#forum-openshift-ai', '#team-kserve']
  },
  'rh-evaluation': {
    name: 'EvalHub (RHOAI Model Evaluation)',
    description: 'Kubernetes-native evaluation orchestration platform routing to multiple benchmark frameworks with MLflow integration',
    architecture: {
      components: [
        { name: 'EvalHub API Server', role: 'Orchestration', description: 'REST API for creating, managing, and tracking evaluation jobs' },
        { name: 'Kubernetes Runtime', role: 'Job Execution', description: 'Creates batch Jobs and ConfigMaps for evaluation workloads in tenant namespaces' },
        { name: 'lm-evaluation-harness Adapter', role: 'LLM Benchmarks', description: 'Runs 167+ LLM benchmarks (MMLU, HellaSwag, TruthfulQA, etc.)' },
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
      'lm-evaluation-harness: 167+ benchmarks (MMLU, HellaSwag, TruthfulQA, etc.)',
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
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/latest/html/evaluating_models',
    contacts: ['#forum-trustyai', '#team-trustyai']
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
        { name: 'RHOAI Pipelines', purpose: 'Automated evaluation in training workflows' },
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
    documentation: 'https://docs.redhat.com/instructlab',
    contacts: ['#forum-instructlab', 'Abhishek Bhanwalder (SDG SME)']
  },
  'project-navigator': {
    name: 'Project Navigator',
    description: 'Intent-based AI workflow orchestrator with AutoRAG optimization and multi-agent coordination',
    architecture: {
      components: [
        { name: 'Intent Router', role: 'Request Analysis', description: 'Analyzes user intent and routes to optimal workflow' },
        { name: 'AutoRAG Optimizer', role: 'RAG Configuration', description: 'Automated optimization of chunking, embeddings, and top-K retrieval' },
        { name: 'Workflow Engine', role: 'Orchestration', description: 'Coordinates multi-step AI workflows and agent interactions' },
        { name: 'Model Selector', role: 'Routing', description: 'Selects optimal model based on intent and SLO requirements' }
      ],
      integrations: [
        { name: 'Red Hat AI Gateway', purpose: 'Semantic routing and authentication' },
        { name: 'Model Serving', purpose: 'Execute model inference requests' },
        { name: 'Vector Databases', purpose: 'RAG with optimized retrieval strategies' },
        { name: 'MCP Servers', purpose: 'External tool integration for agentic workflows' }
      ]
    },
    capabilities: [
      'Intent-based routing to optimal models and workflows',
      'AutoRAG: Automated chunking strategy optimization',
      'AutoRAG: Embedding model selection and tuning',
      'AutoRAG: Top-K retrieval parameter optimization',
      'Multi-agent workflow coordination',
      'SLO-aware model selection (latency vs throughput)',
      'Document processing: PDF, docx, pptx, md, html, plain text',
      'OCR for image-based text extraction',
      'ASR for audio-to-text conversion',
      'Workflow templates for common AI patterns',
      'Integration with Red Hat AI Gateway for semantic routing'
    ],
    useCases: [
      'RAG applications with automated optimization',
      'Intent-based model routing for multi-model systems',
      'Multi-step AI workflows requiring orchestration',
      'Agentic AI with tool integration via MCP',
      'Production AI systems with SLO requirements'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['Suhas Kashyap (AutoRAG/Navigator SME)', '#forum-project-navigator']
  },
  'gen-ai-studio': {
    name: 'Gen AI Studio',
    description: 'Prompt testing, experimentation, and AI asset management platform',
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
        { name: 'RHOAI Dashboard', purpose: 'Unified UI integration' }
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
    documentation: 'https://docs.redhat.com/rhoai',
    contacts: ['#forum-openshift-ai']
  },
  'rhaie': {
    name: 'Red Hat AI Enterprise (RHAIE)',
    description: 'Complete integrated AI platform bundling OpenShift and OpenShift AI with optimized deployment',
    architecture: {
      components: [
        { name: 'OpenShift Platform', role: 'Infrastructure', description: 'Enterprise Kubernetes with GPU support and networking' },
        { name: 'OpenShift AI', role: 'AI/ML Platform', description: 'Full ML lifecycle: notebooks, pipelines, training, serving' },
        { name: 'Integrated Monitoring', role: 'Observability', description: 'Pre-configured Prometheus + Grafana for AI workloads' },
        { name: 'GPU Operator', role: 'Acceleration', description: 'NVIDIA GPU management and scheduling' }
      ],
      integrations: [
        { name: 'OpenShift Data Foundation', purpose: 'Integrated storage solution (optional)' },
        { name: 'Red Hat SSO', purpose: 'Unified identity and access management' },
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
    documentation: 'https://docs.redhat.com/rhoai',
    contacts: ['#forum-openshift-ai', 'Red Hat Sales']
  },
  'rhel-ai': {
    name: 'Red Hat Enterprise Linux AI',
    description: 'Granite foundation models and InstructLab on individual RHEL servers for single-node inference and fine-tuning',
    architecture: {
      components: [
        { name: 'Granite Models', role: 'Foundation Models', description: 'Pre-trained IBM Granite LLMs optimized for enterprise use' },
        { name: 'InstructLab Runtime', role: 'Fine-Tuning', description: 'LAB-based model alignment on single RHEL server' },
        { name: 'vLLM Server', role: 'Inference', description: 'High-performance LLM serving on RHEL' },
        { name: 'Model Manager', role: 'Lifecycle', description: 'Manage models and runtime configurations on RHEL' }
      ],
      integrations: [
        { name: 'RHEL Subscription', purpose: 'Base operating system and support' },
        { name: 'Podman', purpose: 'Container runtime for model serving' },
        { name: 'systemd', purpose: 'Service management for inference endpoints' }
      ]
    },
    capabilities: [
      'Granite foundation models (3B, 8B, 20B, 34B parameters)',
      'InstructLab for single-server fine-tuning with LAB method',
      'vLLM-based inference serving on RHEL',
      'No Kubernetes/OpenShift required',
      'Optimized for edge and single-server deployments',
      'RHEL security and compliance features',
      'Support for NVIDIA GPUs on RHEL',
      'Synthetic data generation with InstructLab',
      'Model quantization for reduced resource usage'
    ],
    useCases: [
      'Edge AI deployments without Kubernetes',
      'Single-server LLM inference',
      'Department-level AI without platform overhead',
      'Fine-tuning on individual workstations or servers',
      'Air-gapped environments on RHEL',
      'Development and testing before scaling to RHOAI'
    ],
    documentation: 'https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_ai',
    contacts: ['#forum-rhel-ai', 'RHEL AI Product Team']
  },
  'batch-gateway': {
    name: 'Red Hat Batch Gateway',
    description: 'OpenAI-compatible batch inference API gateway for processing bulk LLM requests asynchronously',
    architecture: {
      components: [
        { name: 'API Server', role: 'REST API', description: 'OpenAI-compatible /v1/files and /v1/batches endpoints' },
        { name: 'Batch Processor', role: 'Worker Pool', description: 'Polls priority queue and dispatches jobs to inference backends' },
        { name: 'Redis Queue', role: 'Job Queue', description: 'Priority queue for pending batch jobs with tenant isolation' },
        { name: 'S3 Storage', role: 'File Storage', description: 'Stores input JSONL files and output results' }
      ],
      integrations: [
        { name: 'llm-d Gateway', purpose: 'Downstream inference endpoint for batch requests' },
        { name: 'AI Inference Server', purpose: 'Alternative inference backend (OpenAI-compatible)' },
        { name: 'Redis', purpose: 'Job queue, metadata, and event handling' },
        { name: 'S3-compatible storage', purpose: 'Batch file storage (input/output)' },
        { name: 'PostgreSQL', purpose: 'Alternative metadata backend' }
      ]
    },
    capabilities: [
      'OpenAI-compatible Batch API (/v1/batches)',
      'Files API for JSONL upload/download (/v1/files)',
      'Up to 50,000 requests per batch file (200 MB max)',
      'Asynchronous processing with priority queue',
      'Multi-tenant support via X-MaaS-User header',
      'Configurable worker pool for concurrent processing',
      'Redis or PostgreSQL backend for metadata',
      'S3 or local filesystem for file storage',
      'Retry logic with exponential backoff',
      'mTLS support for inference backend connections',
      'Prometheus metrics and health endpoints'
    ],
    useCases: [
      'High-volume offline inference (e.g., processing 100K+ documents overnight)',
      'Cost-optimized inference (batch requests use resources more efficiently)',
      'Asynchronous workflows where real-time response not needed',
      'Large-scale data processing and analysis',
      'Background tasks requiring LLM inference at scale'
    ],
    documentation: 'https://github.com/red-hat-data-services/batch-gateway',
    contacts: ['#team-llm-d', '#forum-ai-inference']
  },
  'fms-guardrails': {
    name: 'FMS Guardrails Orchestrator',
    description: 'REST API middleware coordinating AI text generation with content safety guardrails',
    architecture: {
      components: [
        { name: 'Orchestrator Server', role: 'Middleware', description: 'Routes requests through detector → chunker → LLM pipeline (Rust/Axum)' },
        { name: 'Detector Client', role: 'Safety Analysis', description: 'Connects to HAP and other detector services for content analysis' },
        { name: 'Chunker Client', role: 'Tokenization', description: 'Text segmentation for detector processing (gRPC)' },
        { name: 'Generation Client', role: 'LLM Backend', description: 'Connects to TGIS, caikit-nlp, or OpenAI-compatible APIs' }
      ],
      integrations: [
        { name: 'TGIS / caikit-nlp', purpose: 'Text generation backends (gRPC)' },
        { name: 'vLLM / OpenAI-compatible', purpose: 'Alternative generation backend (HTTP)' },
        { name: 'HAP Detector', purpose: 'Hate, Abuse, Profanity detection service' },
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
    contacts: ['#forum-ai-safety', '#team-fms-guardrails']
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
        { name: 'PostgreSQL Backend', role: 'Persistence', description: 'KV store, inference logs, agent state, file metadata' }
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
    documentation: 'https://github.com/red-hat-data-services/llama-stack-distribution',
    contacts: ['#forum-llama-stack', '#team-rhoai-platform']
  }
};
