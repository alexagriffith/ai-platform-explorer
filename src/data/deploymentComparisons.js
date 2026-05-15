/**
 * Deployment Comparison Data Model
 *
 * Defines before/after deployment comparisons for technical migration planning.
 * Used by the Deployment Impact Explorer (V2 feature).
 */

/**
 * vLLM Direct Deployment → KServe Managed Inference
 *
 * The most common technical question: "Why should I use KServe instead of deploying vLLM directly?"
 * This comparison shows the concrete implementation changes, not just feature lists.
 */
export const vllmToKServe = {
  id: 'vllm-to-kserve',
  title: 'Raw vLLM → KServe Managed Inference',
  description: 'Adopt KServe abstractions for standardized model serving lifecycle',
  audience: 'Platform engineers migrating from direct vLLM deployment',

  before: {
    label: 'Raw vLLM on Kubernetes',

    submittedResources: [
      {
        kind: 'Deployment',
        apiVersion: 'apps/v1',
        name: 'vllm-model-server',
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-model-server
  namespace: models
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vllm-server
  template:
    metadata:
      labels:
        app: vllm-server
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:v0.4.2
        args:
          - "--model"
          - "meta-llama/Llama-2-7b-chat-hf"
          - "--dtype"
          - "float16"
          - "--max-model-len"
          - "4096"
        ports:
        - containerPort: 8000
          protocol: TCP
        resources:
          limits:
            nvidia.com/gpu: 1
          requests:
            nvidia.com/gpu: 1
        env:
        - name: HUGGING_FACE_HUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token
              key: token`,
        description: 'User-managed pod specification with full vLLM configuration'
      },
      {
        kind: 'Service',
        apiVersion: 'v1',
        name: 'vllm-service',
        yamlSnippet: `apiVersion: v1
kind: Service
metadata:
  name: vllm-service
  namespace: models
spec:
  selector:
    app: vllm-server
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP`,
        description: 'Load balancer for vLLM pods'
      },
      {
        kind: 'Route',
        apiVersion: 'route.openshift.io/v1',
        name: 'vllm-route',
        yamlSnippet: `apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: vllm-route
  namespace: models
spec:
  to:
    kind: Service
    name: vllm-service
  port:
    targetPort: 8000
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect`,
        description: 'External access (OpenShift Route or Ingress on vanilla K8s)'
      }
    ],

    clusterResources: [
      {
        kind: 'Deployment',
        name: 'vllm-model-server',
        plane: 'control',
        children: [
          {
            kind: 'ReplicaSet',
            name: 'vllm-model-server-abc123',
            plane: 'control',
            children: [
              { kind: 'Pod', name: 'vllm-model-server-abc123-1', plane: 'data', children: [] },
              { kind: 'Pod', name: 'vllm-model-server-abc123-2', plane: 'data', children: [] }
            ]
          }
        ]
      },
      { kind: 'Service', name: 'vllm-service', plane: 'data', children: [] },
      { kind: 'Route', name: 'vllm-route', plane: 'data', children: [] }
    ],

    controlPlane: [
      { name: 'Kubernetes Controllers', type: 'controller', description: 'Standard K8s reconciliation (Deployment, ReplicaSet)', optional: false }
    ],

    dataPlane: [
      { name: 'vLLM Pod', type: 'pod', description: 'Model server container with GPU', optional: false },
      { name: 'Service', type: 'service', description: 'ClusterIP load balancer', optional: false },
      { name: 'Route/Ingress', type: 'gateway', description: 'External HTTPS access', optional: false }
    ],

    capabilities: [
      'Model serving (OpenAI-compatible API)',
      'GPU scheduling',
      'Basic load balancing',
      'Manual scaling'
    ],

    appTeamOwns: [
      'Deployment manifest with full pod spec',
      'Scaling policy (replica count)',
      'Health checks and probes',
      'Runtime configuration (model, dtype, max-len)',
      'Model storage mounting (if using PVC)',
      'Rollout strategy',
      'Monitoring and alerting setup',
      'Secret management (HF token)'
    ],

    platformTeamOwns: [
      'GPU node provisioning',
      'Base Kubernetes platform',
      'Container registry access',
      'Network policies'
    ]
  },

  after: {
    label: 'KServe Managed Inference',

    submittedResources: [
      {
        kind: 'InferenceService',
        apiVersion: 'serving.kserve.io/v1beta1',
        name: 'llama-model',
        yamlSnippet: `apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: llama-model
  namespace: models
  annotations:
    serving.kserve.io/deploymentMode: "RawDeployment"
spec:
  predictor:
    model:
      modelFormat:
        name: vllm
      runtime: vllm-runtime
      storageUri: "s3://my-models/llama-2-7b-chat-hf"
      resources:
        limits:
          nvidia.com/gpu: 1
        requests:
          nvidia.com/gpu: 1`,
        description: 'High-level model serving specification - KServe handles the rest'
      },
      {
        kind: 'ServingRuntime',
        apiVersion: 'serving.kserve.io/v1alpha1',
        name: 'vllm-runtime',
        yamlSnippet: `apiVersion: serving.kserve.io/v1alpha1
kind: ServingRuntime
metadata:
  name: vllm-runtime
  namespace: models
spec:
  supportedModelFormats:
    - name: vllm
      version: "1"
  containers:
    - name: kserve-container
      image: vllm/vllm-openai:v0.4.2
      args:
        - "--model"
        - "{{.Name}}"
        - "--dtype"
        - "float16"
      env:
        - name: HUGGING_FACE_HUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token
              key: token
  protocolVersions:
    - v1
    - v2`,
        description: 'Reusable runtime template (often platform-provided, shared across teams)'
      }
    ],

    clusterResources: [
      {
        kind: 'InferenceService',
        name: 'llama-model',
        plane: 'control',
        children: [
          {
            kind: 'Deployment',
            name: 'llama-model-predictor',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'llama-model-predictor-xyz789',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'llama-model-predictor-xyz789-1', plane: 'data', children: [] },
                  { kind: 'Pod', name: 'llama-model-predictor-xyz789-2', plane: 'data', children: [] }
                ]
              }
            ]
          },
          { kind: 'Service', name: 'llama-model-predictor', plane: 'data', children: [] },
          { kind: 'VirtualService', name: 'llama-model', plane: 'control', children: [] },
          { kind: 'Route', name: 'llama-model', plane: 'data', children: [] }
        ]
      },
      {
        kind: 'ServingRuntime',
        name: 'vllm-runtime',
        plane: 'control',
        children: []
      }
    ],

    controlPlane: [
      { name: 'KServe Controller', type: 'controller', description: 'Reconciles InferenceService CRDs into Deployments/Services', optional: false },
      { name: 'KServe Webhook', type: 'webhook', description: 'Validates and mutates InferenceService specs', optional: false },
      { name: 'Kubernetes Controllers', type: 'controller', description: 'Standard K8s reconciliation for generated resources', optional: false }
    ],

    dataPlane: [
      { name: 'Predictor Pod', type: 'pod', description: 'KServe-managed vLLM container with standardized lifecycle', optional: false },
      { name: 'Service', type: 'service', description: 'Controller-created ClusterIP service', optional: false },
      { name: 'Route', type: 'gateway', description: 'Controller-created external route', optional: false },
      { name: 'Storage Initializer', type: 'pod', description: 'Optional init container for model download from S3/PVC', optional: true }
    ],

    capabilities: [
      'Model serving (OpenAI-compatible API)',
      'GPU scheduling',
      'Controller-managed lifecycle',
      'Standardized InferenceService API',
      'Runtime abstraction (shared across teams)',
      'Model storage abstraction (s3://, pvc://)',
      'Autoscaling ready (HPA or Knative)',
      'Canary rollouts (with Knative mode)',
      'Multi-framework support (swap runtime without changing app code)'
    ],

    appTeamOwns: [
      'InferenceService spec (high-level)',
      'Model storage location (S3 URI or PVC)',
      'Runtime selection (from platform catalog)',
      'Resource requests (GPU, memory)',
      'Secrets (HF token, S3 credentials)'
    ],

    platformTeamOwns: [
      'GPU node provisioning',
      'KServe installation and upgrades',
      'ServingRuntime catalog (standardized runtimes)',
      'Gateway/routing configuration',
      'Autoscaling policies (if using HPA/Knative)',
      'Monitoring integration (Prometheus ServiceMonitors)',
      'Model storage backend (S3, object storage)',
      'Network policies and security'
    ]
  },

  capabilityDelta: [
    {
      capability: 'Model serving API',
      beforeState: 'Manual implementation',
      afterState: 'Standardized InferenceService',
      impact: 'positive',
      notes: 'Common API across teams and clusters - easier to move workloads'
    },
    {
      capability: 'Lifecycle management',
      beforeState: 'App team manages Deployment',
      afterState: 'Controller-managed',
      impact: 'positive',
      notes: 'Platform handles reconciliation, health checks, and updates'
    },
    {
      capability: 'Runtime abstraction',
      beforeState: 'Hardcoded in Deployment',
      afterState: 'Reusable ServingRuntime',
      impact: 'positive',
      notes: 'Platform team provides catalog, app teams select from list'
    },
    {
      capability: 'Model storage',
      beforeState: 'Manual PVC mounting or baked into image',
      afterState: 'Declarative storageUri (s3://, pvc://)',
      impact: 'positive',
      notes: 'KServe handles download via storage initializer'
    },
    {
      capability: 'Autoscaling',
      beforeState: 'Manual HPA setup',
      afterState: 'Integrated (HPA or Knative)',
      impact: 'positive',
      notes: 'Platform configures autoscaling policies centrally'
    },
    {
      capability: 'Multi-framework support',
      beforeState: 'Separate Deployment per framework',
      afterState: 'Change runtime, keep InferenceService',
      impact: 'positive',
      notes: 'Swap vLLM → TGI → Triton without app code changes'
    },
    {
      capability: 'Operational complexity',
      beforeState: 'Lower upfront (just K8s)',
      afterState: 'Higher platform abstraction',
      impact: 'tradeoff',
      notes: 'More controllers to understand, but centralized management reduces per-app burden'
    },
    {
      capability: 'CRDs and controllers',
      beforeState: 'None (standard K8s)',
      afterState: 'KServe CRDs + controllers',
      impact: 'tradeoff',
      notes: 'Increased control plane complexity, requires KServe expertise'
    },
    {
      capability: 'Debugging surface',
      beforeState: 'Deployment → Pod → logs',
      afterState: 'InferenceService → Predictor → Deployment → Pod → logs + controller events',
      impact: 'tradeoff',
      notes: 'More layers to check, but better status reporting via CRD .status fields'
    }
  ],

  operationalShifts: [
    {
      area: 'Deployment',
      before: 'App team writes full Deployment YAML with pod spec, args, env vars',
      after: 'App team writes InferenceService, platform provides ServingRuntime catalog',
      teamImpact: 'both'
    },
    {
      area: 'Scaling',
      before: 'App team manually configures HPA with custom metrics',
      after: 'Platform provides autoscaling via HPA or Knative integration',
      teamImpact: 'platform-team'
    },
    {
      area: 'Rollouts',
      before: 'App team manages rolling update strategy in Deployment spec',
      after: 'KServe handles rollout; canary supported in Knative mode',
      teamImpact: 'platform-team'
    },
    {
      area: 'Troubleshooting',
      before: 'kubectl describe deployment → rs → pod → logs',
      after: 'kubectl describe inferenceservice → check .status.conditions → deployment → pod → logs + controller logs',
      teamImpact: 'both'
    },
    {
      area: 'Monitoring',
      before: 'App team sets up custom Prometheus scrape configs',
      after: 'Platform exposes standard KServe metrics via ServiceMonitors',
      teamImpact: 'platform-team'
    },
    {
      area: 'Model updates',
      before: 'Change image tag or PVC contents, manually trigger rollout',
      after: 'Update storageUri in InferenceService, KServe pulls new model and rolls pods',
      teamImpact: 'app-team'
    }
  ],

  migrationNotes: [
    'Platform team must install KServe before app teams can deploy InferenceServices',
    'ServingRuntimes should be pre-created by platform team and shared across namespaces (or use ClusterServingRuntime)',
    'Existing vLLM Deployments can coexist with KServe workloads during migration - migrate incrementally',
    'Test KServe controller reconciliation in non-prod first - watch controller logs for CRD validation errors',
    'GPU node affinity and tolerations may need adjustment depending on KServe runtime pod template',
    'If using S3 storage, ensure pods have IRSA (AWS) or Workload Identity (GCP) for credentials',
    'KServe raw deployment mode (used above) keeps familiar Deployment behavior; serverless mode (Knative) adds scale-to-zero but requires Knative Serving',
    'Monitor InferenceService .status.conditions for reconciliation errors - more detailed than Deployment status'
  ],

  docsLinks: [
    { label: 'KServe Documentation', url: 'https://kserve.github.io/website/' },
    { label: 'KServe v1beta1 API Reference', url: 'https://kserve.github.io/website/latest/reference/api/' },
    { label: 'RHOAI Model Serving Guide', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/' },
    { label: 'vLLM Runtime Configuration', url: 'https://docs.vllm.ai/en/latest/' },
    { label: 'ServingRuntime Examples', url: 'https://github.com/kserve/kserve/tree/master/config/runtimes' }
  ],

  relatedComparisons: [
    // Future comparisons (not yet implemented):
    // 'kserve-to-rhoai',     // Next step: wrap KServe in RHOAI platform
    // 'kserve-serverless',   // KServe raw → KServe + Knative serverless
    // 'add-ai-gateway'       // Parallel: add AI Gateway on top of KServe
  ]
};

/**
 * All available deployment comparisons
 *
 * V2.0 MVP ships with one comparison (vLLM → KServe).
 * Future comparisons will be added here.
 */
export const deploymentComparisons = [
  vllmToKServe
  // Future: noGatewayToAIGateway, k8sToRHOAI, vllmToLLMD, etc.
];

/**
 * Get a comparison by ID
 */
export function getComparisonById(id) {
  return deploymentComparisons.find(comp => comp.id === id);
}

/**
 * Get all comparison IDs and titles (for selector UI)
 */
export function getComparisonList() {
  return deploymentComparisons.map(comp => ({
    id: comp.id,
    title: comp.title,
    description: comp.description
  }));
}
