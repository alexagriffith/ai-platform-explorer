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
  'ai-inference': {
    name: 'Red Hat AI Inference Server',
    description: 'High-performance LLM serving optimized for throughput and latency with intelligent routing',
    architecture: {
      components: [
        { name: 'vLLM Runtime', role: 'Inference Engine', description: 'PagedAttention, continuous batching, multi-GPU support' },
        { name: 'llm-d', role: 'Distributed Inference', description: 'Token-aware scheduling, KV cache routing, split-phase inference' },
        { name: 'TGIS', role: 'Text Generation', description: 'Optimized for streaming and batch inference' },
        { name: 'Model Cache', role: 'Performance', description: 'In-memory caching and model preloading' }
      ],
      integrations: [
        { name: 'Model Registry', purpose: 'Model versioning and deployment' },
        { name: 'Prometheus', purpose: 'Performance metrics and SLIs' },
        { name: 'AI Gateway', purpose: 'Authentication, rate limiting, and semantic routing' },
        { name: 'GPU Operator', purpose: 'NVIDIA GPU optimization and scheduling' }
      ]
    },
    capabilities: [
      'vLLM-based high-performance serving',
      'llm-d token-aware scheduling and KV cache routing',
      'SLO-based priority: latency-sensitive vs throughput-sensitive workloads',
      'PagedAttention for memory efficiency',
      'Continuous batching for throughput',
      'Multi-GPU tensor parallelism',
      'Token streaming for real-time responses',
      'Model quantization (INT8, FP16)',
      'Auto-scaling based on load and GPU utilization'
    ],
    useCases: [
      'Production LLM inference at scale',
      'Real-time chatbot applications (<200ms TTFT)',
      'Batch processing of text generation',
      'Multi-model serving with intelligent routing',
      'High-throughput background workloads'
    ],
    documentation: 'https://docs.redhat.com',
    contacts: ['#forum-ai-inference', 'Shumaila Yaseen (SME)']
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
  }
};
