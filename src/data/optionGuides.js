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
    whyChoose: 'You already have Kubernetes and want to leverage existing infrastructure',
    whenToUse: 'Existing K8s investment, cost optimization, specific K8s distribution requirements',
    bestFor: 'Organizations with K8s expertise and existing clusters'
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
    whatItIs: 'AI/ML platform that runs on existing OpenShift clusters',
    whyChoose: 'You already have OpenShift, or want component flexibility',
    whenToUse: 'Existing OpenShift deployment, incremental AI adoption, custom configurations',
    bestFor: 'Teams with OpenShift experience, existing clusters, flexible deployments'
  },
  'rhel-ai': {
    whatItIs: 'Foundation models and serving on individual RHEL servers',
    whyChoose: 'Simple single-server deployment, includes InstructLab for fine-tuning',
    whenToUse: 'Edge deployments, single servers, getting started, fine-tuning focus',
    bestFor: 'Small teams, edge use cases, rapid prototyping, learning'
  },
  'odf': {
    whatItIs: 'OpenShift Data Foundation - integrated S3-compatible object storage',
    whyChoose: 'Seamless OpenShift integration, on-premises storage, data sovereignty',
    whenToUse: 'On-prem deployments, data residency requirements, integrated platform',
    bestFor: 'Organizations keeping data on-premises with OpenShift'
  },
  's3': {
    whatItIs: 'Amazon S3 cloud object storage',
    whyChoose: 'Industry standard, highly scalable, pay-as-you-go pricing',
    whenToUse: 'Cloud deployments, AWS ecosystem, unlimited scale needs',
    bestFor: 'Cloud-native teams, AWS customers, variable storage needs'
  },

  // AI Services Layer
  'ai-inference': {
    whatItIs: 'High-performance vLLM-based server for LLM inference',
    whyChoose: 'Optimized for speed and throughput, GPU-accelerated, industry-leading performance',
    whenToUse: 'Production LLM APIs, high request volume, low latency requirements',
    bestFor: 'LLM serving workloads demanding maximum performance'
  },
  'kserve': {
    whatItIs: 'Multi-framework model serving (part of OpenShift AI)',
    whyChoose: 'Supports multiple frameworks, Kubernetes-native, flexible routing',
    whenToUse: 'Multiple model types, A/B testing, canary deployments, framework flexibility',
    bestFor: 'Teams serving diverse model types beyond just LLMs'
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
    whyChoose: 'Open source, leverage existing PostgreSQL expertise, cost-effective',
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
  'rh-mcp': {
    whatItIs: 'Managed Model Context Protocol server ecosystem',
    whyChoose: 'Connect AI to external tools, APIs, and data sources securely',
    whenToUse: 'Agentic AI, tool-using models, complex workflows',
    bestFor: 'Advanced AI applications needing external tool integration'
  },

  // Application Layer
  'rh-gateway': {
    whatItIs: 'Red Hat AI Gateway - Authorino + Limitador + Envoy for AI APIs',
    whyChoose: 'Built for AI workloads, rate limiting, authentication, routing',
    whenToUse: 'Production APIs, multi-tenancy, auth/rate limiting needed',
    bestFor: 'Production AI services requiring enterprise API management'
  },
  'project-navigator': {
    whatItIs: 'Intent-based AI workflow orchestrator',
    whyChoose: 'Complex multi-step workflows, agent coordination, intelligent routing',
    whenToUse: 'Agentic AI, workflow automation, complex AI processes',
    bestFor: 'Advanced AI applications with sophisticated orchestration needs'
  },
  'gen-ai-studio': {
    whatItIs: 'Prompt testing, experimentation, and asset management',
    whyChoose: 'Iterate on prompts, manage assets, collaborate on AI development',
    whenToUse: 'Prompt engineering, team collaboration, asset management',
    bestFor: 'Teams developing and refining AI applications'
  }
};
