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
        image: vllm/vllm-openai:latest  # pin to the current vLLM release for production
        args:
          - "--model"
          - "meta-llama/Llama-3.1-8B-Instruct"
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
        description: 'External access (OpenShift Route or Ingress on standard Kubernetes)'
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
      { name: 'Kubernetes Controllers', type: 'controller', description: 'Standard Kubernetes reconciliation (Deployment, ReplicaSet)', optional: false }
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
      storageUri: "s3://my-models/llama-3.1-8b-instruct"
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
      image: vllm/vllm-openai:latest  # pin to the current vLLM release for production
      args:
        - "--model=/mnt/models"
        - "--served-model-name={{.Name}}"
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
      { name: 'Kubernetes Controllers', type: 'controller', description: 'Standard Kubernetes reconciliation for generated resources', optional: false }
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
      beforeState: 'Lower upfront (just Kubernetes)',
      afterState: 'Higher platform abstraction',
      impact: 'tradeoff',
      notes: 'More controllers to understand, but centralized management reduces per-app burden'
    },
    {
      capability: 'CRDs and controllers',
      beforeState: 'None (standard Kubernetes)',
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
    'If using S3 storage, ensure pods have IAM Roles for Service Accounts (IRSA) on AWS or Workload Identity on Google Cloud for credentials',
    'KServe raw deployment mode (used above) keeps familiar Deployment behavior; serverless mode (Knative) adds scale-to-zero but requires Knative Serving',
    'Monitor InferenceService .status.conditions for reconciliation errors - more detailed than Deployment status'
  ],

  docsLinks: [
    { label: 'KServe Documentation', url: 'https://kserve.github.io/website/' },
    { label: 'KServe v1beta1 API Reference', url: 'https://kserve.github.io/website/docs/reference/crd-api' },
    { label: 'RHOAI Model Serving Guide', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5' },
    { label: 'vLLM Runtime Configuration', url: 'https://docs.vllm.ai/en/latest/' },
    { label: 'ServingRuntime Examples', url: 'https://github.com/kserve/kserve/tree/master/config/runtimes' }
  ],

  relatedComparisons: [
    'openshift-to-rhoai'  // Next step: adopt full RHOAI platform
  ]
};

/**
 * OpenShift → Red Hat OpenShift AI Platform
 *
 * The platform adoption question: "Why should we adopt RHOAI instead of building our own AI/ML workflows on OpenShift?"
 * This comparison shows the end-to-end ML lifecycle transformation.
 */
export const openshiftToRHOAI = {
  id: 'openshift-to-rhoai',
  title: 'OpenShift → Red Hat OpenShift AI (RHOAI)',
  description: 'Adopt integrated AI/ML platform for end-to-end data science workflows',
  audience: 'Platform teams evaluating RHOAI vs custom-built ML infrastructure',

  before: {
    label: 'DIY ML on OpenShift',

    submittedResources: [
      {
        kind: 'Deployment',
        apiVersion: 'apps/v1',
        name: 'jupyter-notebook',
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: jupyter-notebook
  namespace: ml-team
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jupyter
  template:
    metadata:
      labels:
        app: jupyter
    spec:
      containers:
      - name: jupyter
        image: jupyter/datascience-notebook:latest
        ports:
        - containerPort: 8888
        env:
        - name: JUPYTER_ENABLE_LAB
          value: "yes"
        volumeMounts:
        - name: workspace
          mountPath: /home/jovyan/work
      volumes:
      - name: workspace
        persistentVolumeClaim:
          claimName: jupyter-workspace`,
        description: 'Manual notebook deployment - app team manages lifecycle'
      },
      {
        kind: 'Deployment',
        apiVersion: 'apps/v1',
        name: 'model-server',
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-server
  namespace: ml-team
spec:
  replicas: 2
  selector:
    matchLabels:
      app: model-server
  template:
    metadata:
      labels:
        app: model-server
    spec:
      containers:
      - name: server
        image: custom-ml-server:v1
        ports:
        - containerPort: 8080
        resources:
          limits:
            nvidia.com/gpu: 1`,
        description: 'Manual model serving - no standardized lifecycle'
      }
    ],

    clusterResources: [
      {
        kind: 'Deployment',
        name: 'jupyter-notebook',
        plane: 'control',
        children: [
          {
            kind: 'ReplicaSet',
            name: 'jupyter-notebook-abc',
            plane: 'control',
            children: [
              { kind: 'Pod', name: 'jupyter-notebook-abc-1', plane: 'data', children: [] }
            ]
          }
        ]
      },
      {
        kind: 'Deployment',
        name: 'model-server',
        plane: 'control',
        children: [
          {
            kind: 'ReplicaSet',
            name: 'model-server-xyz',
            plane: 'control',
            children: [
              { kind: 'Pod', name: 'model-server-xyz-1', plane: 'data', children: [] },
              { kind: 'Pod', name: 'model-server-xyz-2', plane: 'data', children: [] }
            ]
          }
        ]
      },
      { kind: 'Service', name: 'jupyter-service', plane: 'data', children: [] },
      { kind: 'Service', name: 'model-service', plane: 'data', children: [] },
      { kind: 'Route', name: 'jupyter-route', plane: 'data', children: [] },
      { kind: 'Route', name: 'model-route', plane: 'data', children: [] },
      { kind: 'PersistentVolumeClaim', name: 'jupyter-workspace', plane: 'data', children: [] }
    ],

    controlPlane: [
      { name: 'Kubernetes Controllers', type: 'controller', description: 'Standard Kubernetes reconciliation only', optional: false }
    ],

    dataPlane: [
      { name: 'Jupyter Notebook Pod', type: 'pod', description: 'Data science workspace', optional: false },
      { name: 'Model Server Pod', type: 'pod', description: 'Custom model serving', optional: false },
      { name: 'Services & Routes', type: 'service', description: 'Manual network config', optional: false },
      { name: 'PVC', type: 'storage', description: 'Manual storage provisioning', optional: false }
    ],

    capabilities: [
      'Jupyter notebooks (self-managed)',
      'Custom model serving',
      'Manual pipeline orchestration',
      'Basic GPU scheduling',
      'Self-managed storage'
    ],

    appTeamOwns: [
      'Jupyter deployment and upgrades',
      'Model serving infrastructure',
      'Pipeline definitions and execution',
      'Storage provisioning and management',
      'Model versioning approach',
      'Experiment tracking (if any)',
      'Monitoring and logging setup',
      'Security policies',
      'Resource quotas',
      'Team collaboration workflows'
    ],

    platformTeamOwns: [
      'OpenShift cluster',
      'GPU node provisioning',
      'Container registry',
      'Base networking'
    ]
  },

  after: {
    label: 'RHOAI Platform',

    submittedResources: [
      {
        kind: 'DataScienceCluster',
        apiVersion: 'datasciencecluster.opendatahub.io/v1',
        name: 'default-dsc',
        yamlSnippet: `apiVersion: datasciencecluster.opendatahub.io/v1
kind: DataScienceCluster
metadata:
  name: default-dsc
spec:
  components:
    dashboard:
      managementState: Managed
    workbenches:
      managementState: Managed
    datasciencepipelines:
      managementState: Managed
    kserve:
      managementState: Managed
      serving:
        ingressGateway:
          certificate:
            type: SelfSigned
        managementState: Managed
    modelmeshserving:
      managementState: Removed
    modelregistry:
      managementState: Managed`,
        description: 'Platform-level configuration - enables integrated ML services'
      },
      {
        kind: 'Notebook',
        apiVersion: 'kubeflow.org/v1',
        name: 'data-science-workbench',
        yamlSnippet: `apiVersion: kubeflow.org/v1
kind: Notebook
metadata:
  name: data-science-workbench
  namespace: ml-project
  labels:
    app: data-science-workbench
spec:
  template:
    spec:
      containers:
      - name: notebook
        image: quay.io/opendatahub/workbench-images:jupyter-datascience-notebook
        resources:
          requests:
            memory: "8Gi"
            cpu: "2"
          limits:
            memory: "8Gi"
            cpu: "2"`,
        description: 'RHOAI-managed notebook - platform handles lifecycle'
      },
      {
        kind: 'InferenceService',
        apiVersion: 'serving.kserve.io/v1beta1',
        name: 'production-model',
        yamlSnippet: `apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: production-model
  namespace: ml-project
  annotations:
    serving.kserve.io/deploymentMode: "RawDeployment"
spec:
  predictor:
    model:
      modelFormat:
        name: sklearn
      runtime: kserve-sklearnserver
      storageUri: "pvc://models/fraud-detection/v1"
      resources:
        limits:
          cpu: "2"
          memory: 4Gi`,
        description: 'Standardized model serving with KServe integration'
      }
    ],

    clusterResources: [
      {
        kind: 'DataScienceCluster',
        name: 'default-dsc',
        plane: 'control',
        children: [
          // RHOAI Dashboard
          {
            kind: 'Deployment',
            name: 'rhods-dashboard',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'rhods-dashboard-abc',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'rhods-dashboard-abc-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          { kind: 'Service', name: 'rhods-dashboard', plane: 'data', children: [] },
          { kind: 'Route', name: 'rhods-dashboard', plane: 'data', children: [] },

          // Workbench Controller
          {
            kind: 'Deployment',
            name: 'notebook-controller',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'notebook-controller-xyz',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'notebook-controller-xyz-1', plane: 'data', children: [] }
                ]
              }
            ]
          },

          // KServe Controller
          {
            kind: 'Deployment',
            name: 'kserve-controller-manager',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'kserve-controller-manager-def',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'kserve-controller-manager-def-1', plane: 'data', children: [] }
                ]
              }
            ]
          },

          // Data Science Pipelines (multiple components)
          {
            kind: 'Deployment',
            name: 'ds-pipeline-persistenceagent',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'ds-pipeline-persistenceagent-ghi',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'ds-pipeline-persistenceagent-ghi-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          {
            kind: 'Deployment',
            name: 'ds-pipeline-scheduledworkflow',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'ds-pipeline-scheduledworkflow-jkl',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'ds-pipeline-scheduledworkflow-jkl-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          {
            kind: 'Deployment',
            name: 'ds-pipeline-ui',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'ds-pipeline-ui-mno',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'ds-pipeline-ui-mno-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          { kind: 'Service', name: 'ds-pipeline-ui', plane: 'data', children: [] },

          // Model Registry
          {
            kind: 'Deployment',
            name: 'model-registry',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'model-registry-pqr',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'model-registry-pqr-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          {
            kind: 'Deployment',
            name: 'model-registry-db',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'model-registry-db-stu',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'model-registry-db-stu-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          { kind: 'Service', name: 'model-registry', plane: 'data', children: [] },
          { kind: 'PersistentVolumeClaim', name: 'model-registry-db', plane: 'data', children: [] }
        ]
      },

      // User workbench notebook (created by user)
      {
        kind: 'Notebook',
        name: 'data-science-workbench',
        plane: 'control',
        children: [
          {
            kind: 'StatefulSet',
            name: 'data-science-workbench',
            plane: 'control',
            children: [
              { kind: 'Pod', name: 'data-science-workbench-0', plane: 'data', children: [] }
            ]
          },
          { kind: 'Service', name: 'data-science-workbench', plane: 'data', children: [] },
          { kind: 'Route', name: 'data-science-workbench', plane: 'data', children: [] },
          { kind: 'PersistentVolumeClaim', name: 'data-science-workbench', plane: 'data', children: [] }
        ]
      },

      // User InferenceService (created by user)
      {
        kind: 'InferenceService',
        name: 'production-model',
        plane: 'control',
        children: [
          {
            kind: 'Deployment',
            name: 'production-model-predictor',
            plane: 'control',
            children: [
              {
                kind: 'ReplicaSet',
                name: 'production-model-predictor-xyz',
                plane: 'control',
                children: [
                  { kind: 'Pod', name: 'production-model-predictor-xyz-1', plane: 'data', children: [] }
                ]
              }
            ]
          },
          { kind: 'Service', name: 'production-model-predictor', plane: 'data', children: [] },
          { kind: 'Route', name: 'production-model', plane: 'data', children: [] }
        ]
      }
    ],

    controlPlane: [
      { name: 'RHOAI Operator', type: 'controller', description: 'Manages DataScienceCluster and platform components', optional: false },
      { name: 'Workbench Controller', type: 'controller', description: 'Manages notebook lifecycle (start, stop, resource limits)', optional: false },
      { name: 'KServe Controller', type: 'controller', description: 'Manages model serving lifecycle', optional: false },
      { name: 'Pipeline Controller', type: 'controller', description: 'Orchestrates ML workflows', optional: false },
      { name: 'Model Registry', type: 'service', description: 'Centralized model versioning and metadata', optional: false }
    ],

    dataPlane: [
      { name: 'Workbench Pods', type: 'pod', description: 'Managed Jupyter notebooks with integrated tooling', optional: false },
      { name: 'Model Server Pods', type: 'pod', description: 'KServe-managed inference endpoints', optional: false },
      { name: 'Pipeline Pods', type: 'pod', description: 'Workflow execution (Argo Workflows)', optional: false },
      { name: 'Dashboard', type: 'service', description: 'Central UI for platform access', optional: false }
    ],

    capabilities: [
      'Integrated workbenches (managed notebooks via the Kubeflow notebook controller) with templates',
      'Data Science Pipelines (Kubeflow Pipelines)',
      'Model Registry for versioning and lineage',
      'KServe model serving (multi-framework)',
      'Distributed training with Ray (distributed compute) and Kubeflow Trainer v2',
      'TrustyAI for explainability and monitoring',
      'Centralized dashboard and project management',
      'Role-based access control (RBAC)',
      'GPU resource management',
      'Integration with OpenShift security (OAuth, RBAC)',
      'Pre-built notebook images with ML libraries'
    ],

    appTeamOwns: [
      'Data science code and notebooks',
      'Model training logic',
      'Pipeline definitions (YAML)',
      'InferenceService specs',
      'Model artifacts (storage location)',
      'Experiment parameters'
    ],

    platformTeamOwns: [
      'RHOAI installation and upgrades',
      'DataScienceCluster configuration',
      'Workbench image catalog',
      'ServingRuntime catalog',
      'Model Registry backend',
      'Pipeline orchestration backend',
      'GPU node pools',
      'Platform-level RBAC policies',
      'Monitoring and alerting integration',
      'S3/object storage backend',
      'TLS certificates and ingress'
    ]
  },

  capabilityDelta: [
    {
      capability: 'Data science workflows',
      beforeState: 'Manual notebook deployments, self-managed',
      afterState: 'Integrated workbenches with start/stop lifecycle',
      impact: 'positive',
      notes: 'Platform provides standardized notebook images, resource management, and collaboration'
    },
    {
      capability: 'Model serving',
      beforeState: 'Custom containers, manual deployment',
      afterState: 'KServe InferenceService with multi-framework support',
      impact: 'positive',
      notes: 'Standardized API, autoscaling, canary rollouts, runtime catalog'
    },
    {
      capability: 'ML pipelines',
      beforeState: 'Custom scripts or external orchestration',
      afterState: 'Data Science Pipelines (Kubeflow Pipelines)',
      impact: 'positive',
      notes: 'Visual pipeline builder, reusable components, experiment tracking'
    },
    {
      capability: 'Model versioning',
      beforeState: 'Manual tracking (Git, S3 paths, spreadsheets)',
      afterState: 'Model Registry with lineage and metadata',
      impact: 'positive',
      notes: 'Centralized catalog, version comparison, promote-to-production workflows'
    },
    {
      capability: 'Distributed training',
      beforeState: 'Not available or custom implementation',
      afterState: 'Ray (distributed compute) and Kubeflow Trainer v2 for multi-node training',
      impact: 'positive',
      notes: 'Scale training across GPU nodes without managing Ray cluster'
    },
    {
      capability: 'Team collaboration',
      beforeState: 'Manual namespace setup, ad-hoc sharing',
      afterState: 'Data Science Projects with RBAC',
      impact: 'positive',
      notes: 'Project-based isolation, role assignments, shared resources'
    },
    {
      capability: 'Platform complexity',
      beforeState: 'Lower - just OpenShift primitives',
      afterState: 'Higher - RHOAI operators and CRDs',
      impact: 'tradeoff',
      notes: 'More moving parts to understand, but centralized management reduces per-team burden'
    },
    {
      capability: 'Upgrade management',
      beforeState: 'App teams upgrade notebooks individually',
      afterState: 'Platform team manages RHOAI upgrades',
      impact: 'tradeoff',
      notes: 'Centralized upgrades ensure consistency but require coordination'
    },
    {
      capability: 'Customization flexibility',
      beforeState: 'Complete control over all components',
      afterState: 'Work within RHOAI abstractions',
      impact: 'tradeoff',
      notes: 'Less flexibility for edge cases, but standardization enables scale'
    }
  ],

  migrationNotes: [
    'RHOAI requires a currently supported OpenShift version - check the Red Hat OpenShift AI documentation for the supported version matrix before installation',
    'Plan for DataScienceCluster configuration - decide which components to enable (dashboard, workbenches, pipelines, KServe, model registry)',
    'Existing notebook Deployments can run alongside RHOAI workbenches during migration - migrate teams incrementally',
    'Model Registry requires S3-compatible storage - ensure object storage is available (ODF, AWS S3, MinIO)',
    'Data Science Pipelines v2 runs on Argo Workflows (the earlier Tekton-based v1 backend was removed) - existing CI/CD pipelines can coexist',
    'GPU nodes must have NVIDIA GPU Operator installed - RHOAI does not install GPU drivers',
    'Set up Data Science Projects (namespaces) for team isolation before onboarding users',
    'Pre-pull notebook images to worker nodes to reduce workbench startup time',
    'Configure OAuth integration for dashboard access - aligns with OpenShift RBAC',
    'Test workbench start/stop lifecycle in non-prod - watch RHOAI operator logs for reconciliation errors'
  ],

  docsLinks: [
    { label: 'RHOAI Documentation', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5' },
    { label: 'Installing RHOAI', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/installing_and_uninstalling_openshift_ai_self-managed' },
    { label: 'Data Science Pipelines', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_ai_pipelines' },
    { label: 'Model Registry', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_model_registries' },
    { label: 'Distributed Workloads (Ray)', url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/working_with_distributed_workloads' }
  ],

  relatedComparisons: [
    'vllm-to-kserve'  // Previous step: KServe serving patterns
  ]
};

/**
 * All available deployment comparisons
 */
export const deploymentComparisons = [
  vllmToKServe,
  openshiftToRHOAI
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
    description: comp.description,
    audience: comp.audience
  }));
}
