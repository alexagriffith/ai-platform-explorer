// Guides to help users understand what each option means and why to choose it
export const optionGuides = {
  // Infrastructure Layer
  'openshift': {
    whatItIs: 'Enterprise Kubernetes platform with built-in security, automation, and developer tools',
    whyChoose: 'Industry-standard platform with Red Hat support, GPU scheduling, and AI-optimized features',
    whenToUse: 'Production AI workloads, distributed training, multi-model serving, enterprise environments',
    bestFor: 'Teams that need enterprise support, compliance, and production-grade reliability'
  },
  'kubernetes': {
    whatItIs: 'Standard Kubernetes cluster (any distribution)',
    whyChoose: 'You already run Kubernetes and want to reuse that footprint',
    whenToUse: 'Existing K8s investment, cost optimization, specific K8s distribution requirements',
    bestFor: 'Organizations with K8s expertise and existing clusters'
  },
  'rhel-hosts': {
    whatItIs: 'Dedicated Red Hat Enterprise Linux systems without OpenShift as the AI runtime',
    whyChoose: 'RHEL AI and edge-style LLM footprints that are not scheduled on a shared Kubernetes control plane',
    whenToUse: 'Single-server inference, air-gapped Linux hosts, department-scale AI before cluster rollout',
    bestFor: 'Teams standardizing on RHEL for model hosts and wanting a clear split from cluster-based RHOAI/RHAIE'
  },
  'nvidia-gpu': {
    whatItIs: 'NVIDIA GPUs (A100, H100, etc.) with CUDA support',
    whyChoose: 'Industry standard for AI/ML with best ecosystem support and performance',
    whenToUse: 'Training large models, high-throughput inference, mainstream AI frameworks',
    bestFor: 'Most AI workloads - widest framework compatibility'
  },
  'amd-gpu': {
    whatItIs: 'AMD MI-series accelerators with ROCm',
    whyChoose: 'Alternative to NVIDIA, competitive pricing, open source software stack',
    whenToUse: 'Cost optimization, specific AMD partnerships, avoiding vendor lock-in',
    bestFor: 'Budget-conscious deployments with ROCm-compatible workloads'
  },
  'intel-gpu': {
    whatItIs: 'Intel Data Center GPUs and Gaudi accelerators',
    whyChoose: 'Intel ecosystem integration, competitive pricing for inference',
    whenToUse: 'Intel hardware partnerships, inference-focused workloads',
    bestFor: 'Intel-centric infrastructure, inference optimization'
  },
  'cpu-only': {
    whatItIs: 'Run on standard CPUs without GPU acceleration',
    whyChoose: 'Lower costs, testing/development, or small-scale inference',
    whenToUse: 'Prototyping, small models, budget constraints, non-performance-critical workloads',
    bestFor: 'Getting started, development environments, small-scale deployments'
  },

  // Platform Layer
  'rhaie': {
    whatItIs: 'Complete bundle: OpenShift + OpenShift AI + InstructLab in one SKU',
    whyChoose: 'Simplified procurement, everything you need in one package, single support contract',
    whenToUse: 'Enterprise rollouts, complete platform needed, simplified vendor management',
    bestFor: 'Organizations wanting full-stack solution with streamlined procurement'
  },
  'rhoai': {
    whatItIs: 'AI/ML platform for OpenShift - requires OpenShift as the container platform',
    whyChoose: 'Your container platform is OpenShift (self-managed or ROSA/ARO)',
    whenToUse: 'When running on OpenShift clusters - this is the only Red Hat AI platform option for OpenShift',
    bestFor: 'Teams with OpenShift as their container platform'
  },
  'rhai': {
    whatItIs: 'AI/ML platform for standard Kubernetes - use when your platform is NOT OpenShift',
    whyChoose: 'Your container platform is standard Kubernetes (EKS, AKS, GKE, self-managed K8s)',
    whenToUse: 'When running on non-OpenShift Kubernetes - this is the Red Hat AI platform for standard K8s',
    bestFor: 'Cloud-managed Kubernetes (EKS, AKS, GKE) or self-managed standard Kubernetes estates'
  },
  'rhel-ai': {
    whatItIs:
      'Foundation models and InstructLab fine-tuning on individual RHEL servers - single-node only',
    whyChoose: 'Simple single-server deployment for edge use cases, development, or single-node serving',
    whenToUse:
      'Edge deployments, development environments, single-server use cases. NOT for distributed training or production-scale serving (use RHOAI or RHAI instead). Red Hat MCP SKUs in this app require OpenShift selected as runtime; use hybrid (OpenShift + RHEL AI) or self-hosted MCP if you need both.',
    bestFor: 'Edge deployments, small teams, single-node environments, InstructLab fine-tuning'
  },
  'odf': {
    whatItIs: 'OpenShift Data Foundation - integrated S3-compatible object storage',
    whyChoose: 'OpenShift-native storage integration, on-premises footprint, data sovereignty',
    whenToUse: 'On-prem deployments, data residency requirements, integrated platform',
    bestFor: 'Organizations keeping data on-premises with OpenShift'
  },
  's3': {
    whatItIs: 'Amazon S3 cloud object storage',
    whyChoose: 'Industry standard, highly scalable, pay-as-you-go pricing',
    whenToUse: 'Cloud deployments, AWS ecosystem, unlimited scale needs',
    bestFor: 'Cloud-native teams, AWS customers, variable storage needs'
  },

  // AI Services Layer - Training
  'rhoai-distributed': {
    whatItIs: 'Framework for running training jobs across multiple nodes with Ray and Training Operator',
    whyChoose: 'Accelerates training of large models by utilizing multi-node GPU clusters',
    whenToUse: 'Training models that exceed the memory of a single GPU, large-scale distributed training',
    bestFor: 'MLOps engineers, data scientists training large models (70B+ parameters)'
  },
  'instructlab': {
    whatItIs: 'Model alignment tool using synthetic data generation and the LAB method',
    whyChoose: 'Simplifies fine-tuning by reducing need for massive human-labeled datasets',
    whenToUse: 'Adding specific domain knowledge or skills to foundation models, limited training data',
    bestFor: 'AI developers, subject matter experts, taxonomy-driven model improvement'
  },
  'data-science-pipelines': {
    whatItIs: 'Automated ML workflow engine based on Kubeflow Pipelines',
    whyChoose: 'Ensures reproducibility and scalability of training and data prep steps',
    whenToUse: 'Automating recurring training, evaluation, and deployment tasks',
    bestFor: 'Data scientists, ML engineers needing MLOps automation'
  },
  'custom-training': {
    whatItIs: 'Customer-provided training frameworks and infrastructure',
    whyChoose: 'Full control over training environment, specialized hardware, air-gapped deployments',
    whenToUse: 'Specialized requirements not met by standard offerings, existing training infrastructure',
    bestFor: 'Organizations with existing ML infrastructure or unique requirements'
  },

  // AI Services Layer - Inference
  'ai-inference': {
    whatItIs: 'High-performance vLLM-based server for LLM inference - can deploy via KServe or standalone',
    whyChoose: 'Optimized for LLMs with advanced scheduling, GPU-accelerated, industry-leading performance',
    whenToUse: 'Production LLM APIs, high request volume, low latency requirements, LLM-specific optimizations needed',
    bestFor: 'LLM-only serving workloads demanding maximum performance and advanced scheduling features'
  },
  'kserve': {
    whatItIs: 'Model serving platform built into RHOAI - provides abstraction layer for multiple runtimes',
    whyChoose: 'Platform layer supporting vLLM, TorchServe, TensorFlow, ONNX, etc. with autoscaling and deployment patterns',
    whenToUse: 'Multiple frameworks needed, InferenceGraph pipelines, canary/A/B deployments, non-LLM models',
    bestFor: 'Teams serving diverse model types or needing advanced deployment workflows'
  },
  'rh-model-registry': {
    whatItIs: 'Red Hat Model Registry for versioning and metadata',
    whyChoose: 'Integrated with OpenShift AI, centralized model management, version control',
    whenToUse: 'Team collaboration, model versioning, production model tracking',
    bestFor: 'Organizations needing model governance and versioning'
  },
  'mlflow': {
    whatItIs: 'Open source MLflow registry (customer-managed)',
    whyChoose: 'Industry standard, existing MLflow investment, migration from other platforms',
    whenToUse: 'Existing MLflow usage, specific MLflow features, multi-platform needs',
    bestFor: 'Teams already using MLflow or needing its specific features'
  },
  'elastic': {
    whatItIs: 'Elastic vector database (Red Hat partnership)',
    whyChoose: 'Red Hat-preferred partner, mature product, excellent search capabilities',
    whenToUse: 'RAG applications, semantic search, Red Hat support desired',
    bestFor: 'Production RAG deployments with enterprise support'
  },
  'pgvector': {
    whatItIs: 'PostgreSQL with vector extension',
    whyChoose: 'Open source; reuse existing PostgreSQL skills; often lower licensing cost',
    whenToUse: 'Existing PostgreSQL, cost optimization, simpler deployments',
    bestFor: 'Teams with PostgreSQL experience, budget-conscious projects'
  },
  'rh-observability': {
    whatItIs: 'Prometheus + Grafana monitoring stack (built into OpenShift)',
    whyChoose: 'Integrated with platform, no additional components, unified monitoring',
    whenToUse: 'OpenShift deployments, integrated platform preference, AI metrics needed',
    bestFor: 'Teams wanting integrated monitoring without additional tools'
  },
  'trustyai': {
    whatItIs: 'AI explainability, fairness, and compliance monitoring',
    whyChoose: 'Regulatory compliance, bias detection, model transparency requirements',
    whenToUse: 'Regulated industries, fairness requirements, audit trails needed',
    bestFor: 'Financial services, healthcare, government, regulated industries'
  },
  'rh-evaluation': {
    whatItIs: 'Built-in model evaluation pipelines in OpenShift AI',
    whyChoose: 'Integrated workflow, automated quality gates, version comparison',
    whenToUse: 'Model validation, CI/CD for models, quality benchmarking',
    bestFor: 'Teams automating model quality checks'
  },
  'instructlab-eval': {
    whatItIs: 'LAB-based model quality assessment from InstructLab',
    whyChoose: 'Specialized for fine-tuned models, alignment verification',
    whenToUse: 'Fine-tuning workflows, instruction-following quality checks',
    bestFor: 'Teams using InstructLab for model fine-tuning'
  },
  'rh-mcp-full': {
    whatItIs: 'Complete MCP platform with Registry, Catalog, Lifecycle Operator, and Gateway',
    whyChoose: 'Full governance, discovery, automated deployment, and security for MCP servers',
    whenToUse:
      'Production agentic AI on OpenShift. In this explorer Red Hat MCP is enabled only when Platform & Runtime is OpenShift (hybrid with RHEL AI is fine).',
    bestFor: 'Enterprise teams needing complete MCP lifecycle management'
  },
  'rh-mcp-catalog': {
    whatItIs: 'MCP Catalog and Registry for browsing and discovering certified MCP servers',
    whyChoose: 'Discover available tools without automated deployment - more control over what gets installed',
    whenToUse:
      'Governance-first MCP discovery on OpenShift; same runtime rule as other Red Hat MCP options in this explorer.',
    bestFor: 'Teams that want visibility and governance but prefer manual MCP deployment'
  },
  'rh-mcp-registry': {
    whatItIs: 'MCP Registry only - system of record for MCP governance and metadata',
    whyChoose: 'Track and govern MCP servers without catalog UI or automated deployment',
    whenToUse:
      'Headless MCP governance on OpenShift; same OpenShift runtime requirement as other Red Hat MCP SKUs here.',
    bestFor: 'Advanced users building custom MCP management solutions'
  },

  // Application Layer
  'rh-gateway': {
    whatItIs: 'Red Hat AI Gateway - Model-as-a-Service gateway with OpenAI-compatible APIs',
    whyChoose: 'Unified access to self-hosted and external models, usage tracking, policy enforcement',
    whenToUse: 'Need OpenAI-compatible APIs, multi-model access, cost tracking, or external model integration (NVIDIA Nemotron, etc.)',
    bestFor: 'Enterprise platforms providing developer access to curated model catalogs with governance'
  },
  'project-navigator': {
    whatItIs: 'Intent-based AI workflow orchestrator',
    whyChoose: 'Complex multi-step workflows, agent coordination, intelligent routing',
    whenToUse: 'Agentic AI, workflow automation, complex AI processes',
    bestFor: 'Advanced AI applications with sophisticated orchestration needs'
  },
  'gen-ai-studio': {
    whatItIs: 'Prompt testing, experimentation, and AI asset management (models, prompts, RAG pipelines)',
    whyChoose: 'Iterate on prompts, manage AI assets (deployed models, prompts, RAG configurations), collaborate on development',
    whenToUse: 'Prompt engineering, team collaboration, managing AI assets for experimentation and consumption',
    bestFor: 'Teams developing and refining AI applications with centralized asset discovery'
  }
};
