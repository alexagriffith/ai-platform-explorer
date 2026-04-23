// Deep technical details for drill-down functionality
export const componentDetails = {
  'rhoai': {
    subComponents: [
      {
        id: 'jupyter',
        name: 'JupyterHub / Workbenches',
        type: 'Development Environment',
        description: 'Interactive notebooks and IDEs for data scientists',
        techDetails: ['Multi-user support', 'GPU scheduling', 'Custom notebook images']
      },
      {
        id: 'pipelines',
        name: 'Data Science Pipelines',
        type: 'Workflow Orchestration',
        description: 'Kubeflow Pipelines for ML workflows',
        techDetails: ['Argo Workflows', 'Pipeline versioning', 'Artifact tracking']
      },
      {
        id: 'kserve',
        name: 'Model Serving (KServe)',
        type: 'Inference Runtime',
        description: 'Deploy and serve ML models',
        techDetails: ['Multi-framework support', 'Auto-scaling', 'Canary deployments']
      },
      {
        id: 'distributed-workloads',
        name: 'Distributed Workloads',
        type: 'Training Infrastructure',
        description: 'Multi-node training with CodeFlare/Ray',
        techDetails: ['Ray clusters', 'Multi-GPU training', 'Resource pooling']
      },
      {
        id: 'dashboard',
        name: 'RHOAI Dashboard',
        type: 'UI/Control Plane',
        description: 'Central management interface',
        techDetails: ['Project management', 'Resource monitoring', 'User administration']
      }
    ],
    infrastructure: [
      { type: 'Storage', items: ['S3-compatible object storage', 'Persistent volumes', 'Model registry storage'] },
      { type: 'Networking', items: ['Service mesh (Istio)', 'Ingress/Routes', 'Internal APIs'] },
      { type: 'Compute', items: ['GPU nodes', 'CPU nodes', 'Auto-scaling groups'] }
    ],
    integrations: [
      { name: 'Prometheus', purpose: 'Metrics collection' },
      { name: 'Grafana', purpose: 'Monitoring dashboards' },
      { name: 'OpenShift Service Mesh', purpose: 'Traffic management' },
      { name: 'OpenShift Pipelines', purpose: 'CI/CD integration' }
    ]
  },
  'ai-inference': {
    subComponents: [
      {
        id: 'vllm-runtime',
        name: 'vLLM Runtime',
        type: 'Inference Engine',
        description: 'High-performance LLM serving',
        techDetails: ['PagedAttention', 'Continuous batching', 'Multi-GPU support']
      },
      {
        id: 'tgis',
        name: 'Text Generation Inference Server',
        type: 'Inference Engine',
        description: 'Optimized text generation',
        techDetails: ['Token streaming', 'Batch inference', 'Model quantization']
      },
      {
        id: 'model-cache',
        name: 'Model Cache',
        type: 'Storage',
        description: 'Fast model loading and caching',
        techDetails: ['In-memory caching', 'Model preloading', 'Cache warming']
      }
    ],
    infrastructure: [
      { type: 'GPU Optimization', items: ['CUDA optimization', 'Tensor parallelism', 'GPU memory management'] },
      { type: 'Load Balancing', items: ['Request routing', 'Queue management', 'Auto-scaling'] }
    ],
    integrations: [
      { name: 'Model Registry', purpose: 'Model versioning' },
      { name: 'Prometheus', purpose: 'Performance metrics' },
      { name: 'Authorino', purpose: 'Authentication' }
    ]
  },
  'openshift': {
    subComponents: [
      {
        id: 'control-plane',
        name: 'Control Plane',
        type: 'Cluster Management',
        description: 'Kubernetes control plane components',
        techDetails: ['API Server', 'etcd', 'Controller Manager', 'Scheduler']
      },
      {
        id: 'node-management',
        name: 'Node Management',
        type: 'Compute',
        description: 'Worker node orchestration',
        techDetails: ['MachineConfig Operator', 'Node autoscaling', 'GPU operator']
      },
      {
        id: 'networking',
        name: 'OpenShift SDN/OVN',
        type: 'Networking',
        description: 'Software-defined networking',
        techDetails: ['Pod networking', 'Network policies', 'Service mesh ready']
      },
      {
        id: 'storage',
        name: 'Storage Operators',
        type: 'Storage',
        description: 'Persistent storage management',
        techDetails: ['OCS/ODF', 'Dynamic provisioning', 'CSI drivers']
      },
      {
        id: 'registry',
        name: 'Internal Registry',
        type: 'Container Registry',
        description: 'Integrated container image registry',
        techDetails: ['Image streams', 'Image signing', 'Registry mirroring']
      }
    ],
    infrastructure: [
      { type: 'Security', items: ['SELinux', 'Pod Security', 'Secrets management', 'RBAC'] },
      { type: 'Observability', items: ['Cluster logging', 'Monitoring stack', 'Alerting'] }
    ]
  },
  'model-registry': {
    subComponents: [
      {
        id: 'metadata-store',
        name: 'Metadata Store',
        type: 'Database',
        description: 'Model metadata and versioning',
        techDetails: ['MySQL/PostgreSQL backend', 'Version tracking', 'Lineage tracking']
      },
      {
        id: 'artifact-storage',
        name: 'Artifact Storage',
        type: 'Object Storage',
        description: 'Model weights and artifacts',
        techDetails: ['S3-compatible storage', 'Multi-region support', 'Encryption at rest']
      },
      {
        id: 'registry-api',
        name: 'Registry API',
        type: 'API Server',
        description: 'REST API for model operations',
        techDetails: ['Model registration', 'Search & discovery', 'Access control']
      }
    ]
  },
  'trustyai': {
    subComponents: [
      {
        id: 'explainability',
        name: 'Explainability Engine',
        type: 'AI Analysis',
        description: 'Model explanation and interpretation',
        techDetails: ['LIME', 'SHAP', 'Counterfactual explanations']
      },
      {
        id: 'monitoring',
        name: 'Fairness Monitoring',
        type: 'Observability',
        description: 'Bias and fairness detection',
        techDetails: ['Drift detection', 'Fairness metrics', 'Disparate impact analysis']
      },
      {
        id: 'audit',
        name: 'Audit Trail',
        type: 'Compliance',
        description: 'Decision logging and audit',
        techDetails: ['Inference logging', 'Model lineage', 'Compliance reporting']
      }
    ]
  },
  'gen-ai-studio': {
    subComponents: [
      {
        id: 'prompt-lab',
        name: 'Prompt Lab',
        type: 'Experimentation',
        description: 'Interactive prompt testing',
        techDetails: ['Multi-model testing', 'Prompt versioning', 'A/B comparison']
      },
      {
        id: 'asset-library',
        name: 'Asset Library',
        type: 'Content Management',
        description: 'Reusable prompts and templates',
        techDetails: ['Template library', 'Sharing & collaboration', 'Version control']
      }
    ]
  },
  'rhel-ai': {
    subComponents: [
      {
        id: 'instructlab',
        name: 'InstructLab',
        type: 'Fine-tuning',
        description: 'LAB (Large-scale Alignment for chatBots)',
        techDetails: ['Synthetic data generation', 'Knowledge injection', 'Skills training']
      },
      {
        id: 'granite-models',
        name: 'Granite Models',
        type: 'Foundation Models',
        description: 'IBM Granite model family',
        techDetails: ['Code models', 'Language models', 'Enterprise-focused']
      },
      {
        id: 'vllm-serving',
        name: 'vLLM Serving',
        type: 'Inference',
        description: 'Local model serving',
        techDetails: ['Single-node optimization', 'GPU utilization', 'Fast inference']
      }
    ]
  },
  'ai-gateway': {
    subComponents: [
      {
        id: 'authorino',
        name: 'Authorino',
        type: 'Auth/AuthZ',
        description: 'API authentication and authorization',
        techDetails: ['OAuth/OIDC', 'API keys', 'mTLS', 'Policy enforcement']
      },
      {
        id: 'limitador',
        name: 'Limitador',
        type: 'Rate Limiting',
        description: 'API rate limiting and quotas',
        techDetails: ['Token bucket', 'User quotas', 'Distributed limits']
      },
      {
        id: 'envoy',
        name: 'Envoy Proxy',
        type: 'API Gateway',
        description: 'L7 proxy and routing',
        techDetails: ['Dynamic routing', 'Load balancing', 'Circuit breaking']
      }
    ]
  }
};
