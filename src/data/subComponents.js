// Sub-components for capabilities that have internal architecture
export const subComponents = {
  'rh-mcp-full': {
    name: 'Full MCP Ecosystem',
    components: [
      {
        id: 'mcp-registry',
        name: 'MCP Registry',
        description: 'System of Record for governance and lifecycle management',
        role: 'Governance & Backbone'
      },
      {
        id: 'mcp-catalog',
        name: 'MCP Catalog',
        description: 'Discover, browse, and one-click deploy MCP servers',
        role: 'Discovery & Launch'
      },
      {
        id: 'mcp-lifecycle',
        name: 'MCP Lifecycle Operator',
        description: 'Kubernetes-native deployment, configuration, and updates',
        role: 'Deploy, Configure, Update'
      },
      {
        id: 'mcp-gateway',
        name: 'MCP Gateway',
        description: 'Security, access control, and policy enforcement',
        role: 'Secure & Aggregate'
      },
      {
        id: 'mcp-ingestion',
        name: 'Ingestion Pipeline',
        description: 'Supply chain security: validate, scan, sign, certify, publish',
        role: 'Trust & Integrity',
        stages: ['Validate', 'Scan', 'Sign', 'Certify', 'Publish']
      }
    ]
  },
  'rh-mcp-catalog': {
    name: 'MCP Catalog & Registry',
    components: [
      {
        id: 'mcp-registry',
        name: 'MCP Registry',
        description: 'System of Record for governance and lifecycle management',
        role: 'Governance & Backbone'
      },
      {
        id: 'mcp-catalog',
        name: 'MCP Catalog',
        description: 'Discover and browse certified MCP servers',
        role: 'Discovery'
      }
    ]
  },
  'rh-mcp-registry': {
    name: 'MCP Registry Only',
    components: [
      {
        id: 'mcp-registry',
        name: 'MCP Registry',
        description: 'System of Record for governance, metadata, and certification tracking',
        role: 'Governance & Backbone'
      }
    ]
  },
  'rhoai': {
    name: 'Red Hat OpenShift AI',
    components: [
      {
        id: 'jupyterhub',
        name: 'JupyterHub',
        description: 'Multi-user notebook environment for data science',
        role: 'Experimentation'
      },
      {
        id: 'pipelines',
        name: 'Data Science Pipelines',
        description: 'Kubeflow Pipelines for ML workflows',
        role: 'Orchestration'
      },
      {
        id: 'kserve',
        name: 'KServe',
        description: 'Multi-framework model serving',
        role: 'Model Serving'
      },
      {
        id: 'distributed-workloads',
        name: 'Distributed Workloads',
        description: 'Training across multiple nodes and GPUs',
        role: 'Training'
      },
      {
        id: 'model-mesh',
        name: 'ModelMesh',
        description: 'Intelligent model routing and serving',
        role: 'Model Management'
      }
    ]
  },
  'rhaie': {
    name: 'Red Hat AI Enterprise',
    components: [
      {
        id: 'openshift',
        name: 'OpenShift Platform',
        description: 'Enterprise Kubernetes foundation',
        role: 'Infrastructure'
      },
      {
        id: 'openshift-ai',
        name: 'OpenShift AI',
        description: 'AI/ML platform capabilities',
        role: 'AI Platform'
      },
      {
        id: 'instructlab',
        name: 'InstructLab',
        description: 'Model alignment and fine-tuning',
        role: 'Model Development'
      }
    ]
  },
  'openshift': {
    name: 'Red Hat OpenShift',
    components: [
      {
        id: 'control-plane',
        name: 'Control Plane',
        description: 'API Server, etcd, Controller Manager, Scheduler',
        role: 'Cluster Management'
      },
      {
        id: 'compute-nodes',
        name: 'Compute Nodes',
        description: 'Worker nodes with kubelet, GPU support, auto-scaling',
        role: 'Workload Execution'
      },
      {
        id: 'sdn-ovn',
        name: 'SDN/OVN',
        description: 'Software-defined networking with network policies',
        role: 'Networking'
      },
      {
        id: 'storage-operators',
        name: 'Storage Operators',
        description: 'Dynamic provisioning with CSI drivers',
        role: 'Persistent Storage'
      },
      {
        id: 'monitoring-stack',
        name: 'Monitoring Stack',
        description: 'Prometheus, Grafana, Alertmanager',
        role: 'Observability'
      }
    ]
  },
  'trustyai': {
    name: 'TrustyAI',
    components: [
      {
        id: 'explainability',
        name: 'Explainability Engine',
        description: 'LIME, SHAP, and counterfactual explanations',
        role: 'Model Interpretation'
      },
      {
        id: 'fairness',
        name: 'Fairness Monitoring',
        description: 'Bias detection and mitigation',
        role: 'Responsible AI'
      },
      {
        id: 'audit-trail',
        name: 'Audit Trail',
        description: 'Decision logging and compliance reporting',
        role: 'Governance'
      }
    ]
  },
  'ai-inference': {
    name: 'Red Hat AI Inference Server',
    components: [
      {
        id: 'vllm-engine',
        name: 'vLLM Engine',
        description: 'High-throughput LLM inference',
        role: 'Core Inference'
      },
      {
        id: 'model-loader',
        name: 'Model Loader',
        description: 'Dynamic model loading and caching',
        role: 'Model Management'
      },
      {
        id: 'api-server',
        name: 'OpenAI-Compatible API',
        description: 'Standard API interface',
        role: 'API Layer'
      }
    ]
  }
};
