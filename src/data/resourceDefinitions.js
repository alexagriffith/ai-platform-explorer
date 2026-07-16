/**
 * Kubernetes and KServe Resource Definitions
 *
 * Provides detailed information about resource types for the Deployment Impact Explorer.
 * Used by ResourceTreeView to show descriptions, fields, and documentation links.
 */

export const resourceDefinitions = {
  // Kubernetes Core Resources
  Deployment: {
    kind: 'Deployment',
    apiVersion: 'apps/v1',
    category: 'Kubernetes Workload',
    description: 'Manages a replicated set of Pods, handling rolling updates and rollbacks. You define the desired state (replicas, pod template) and the Deployment controller ensures the actual state matches.',
    keyFields: [
      { name: 'spec.replicas', description: 'Number of pod instances to run' },
      { name: 'spec.selector', description: 'Label selector for matching pods' },
      { name: 'spec.template', description: 'Pod template (containers, volumes, etc.)' },
      { name: 'spec.strategy', description: 'Update strategy (RollingUpdate or Recreate)' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    usedBy: 'user'
  },

  ReplicaSet: {
    kind: 'ReplicaSet',
    apiVersion: 'apps/v1',
    category: 'Kubernetes Workload',
    description: 'Ensures a specified number of pod replicas are running at any time. Usually managed by Deployments rather than created directly.',
    keyFields: [
      { name: 'spec.replicas', description: 'Desired number of pods' },
      { name: 'spec.selector', description: 'Label selector for pods' },
      { name: 'spec.template', description: 'Pod template to create' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/',
    usedBy: 'controller'
  },

  Pod: {
    kind: 'Pod',
    apiVersion: 'v1',
    category: 'Kubernetes Workload',
    description: 'The smallest deployable unit in Kubernetes. A Pod encapsulates one or more containers, storage, network identity, and configuration options.',
    keyFields: [
      { name: 'spec.containers', description: 'List of containers to run' },
      { name: 'spec.volumes', description: 'Storage volumes available to containers' },
      { name: 'spec.nodeSelector', description: 'Node selection constraints (e.g., GPU nodes)' },
      { name: 'spec.tolerations', description: 'Tolerations for node taints' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/pods/',
    usedBy: 'controller'
  },

  Service: {
    kind: 'Service',
    apiVersion: 'v1',
    category: 'Kubernetes Networking',
    description: 'Exposes a set of Pods as a network service. Acts as a load balancer with a stable IP/DNS name, even as pod IPs change.',
    keyFields: [
      { name: 'spec.selector', description: 'Label selector to identify backend pods' },
      { name: 'spec.ports', description: 'Ports to expose' },
      { name: 'spec.type', description: 'ClusterIP (internal), NodePort, or LoadBalancer' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/service/',
    usedBy: 'user'
  },

  Route: {
    kind: 'Route',
    apiVersion: 'route.openshift.io/v1',
    category: 'OpenShift Networking',
    description: 'OpenShift-specific resource that exposes a Service at a hostname (external access). Routes handle TLS termination and can do traffic splitting.',
    keyFields: [
      { name: 'spec.to', description: 'Target Service' },
      { name: 'spec.host', description: 'External hostname (auto-generated or custom)' },
      { name: 'spec.tls', description: 'TLS termination configuration' },
      { name: 'spec.port', description: 'Target port on the Service' }
    ],
    docsUrl: 'https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/ingress_and_load_balancing/routes',
    usedBy: 'user'
  },

  Ingress: {
    kind: 'Ingress',
    apiVersion: 'networking.k8s.io/v1',
    category: 'Kubernetes Networking',
    description: 'Exposes HTTP/HTTPS routes to Services based on hostname and path. Requires an Ingress controller (nginx, Traefik, etc.) to handle traffic.',
    keyFields: [
      { name: 'spec.rules', description: 'Routing rules (host + path → Service)' },
      { name: 'spec.tls', description: 'TLS configuration for HTTPS' },
      { name: 'spec.ingressClassName', description: 'Which Ingress controller handles this' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/services-networking/ingress/',
    usedBy: 'user'
  },

  // KServe Resources
  InferenceService: {
    kind: 'InferenceService',
    apiVersion: 'serving.kserve.io/v1beta1',
    category: 'KServe',
    description: 'KServe\'s high-level abstraction for deploying machine learning models. Handles predictor pods, autoscaling, traffic routing, and model lifecycle.',
    keyFields: [
      { name: 'spec.predictor', description: 'Main model serving component (required)' },
      { name: 'spec.predictor.model', description: 'Model configuration (format, runtime, storage)' },
      { name: 'spec.predictor.model.runtime', description: 'ServingRuntime to use (e.g., vllm-runtime)' },
      { name: 'spec.transformer', description: 'Optional preprocessing component' },
      { name: 'spec.explainer', description: 'Optional model explanation component' },
      { name: 'metadata.annotations', description: 'Deployment mode, autoscaling config, etc.' }
    ],
    docsUrl: 'https://kserve.github.io/website/docs/reference/crd-api#serving.kserve.io/v1beta1.InferenceService',
    usedBy: 'user'
  },

  ServingRuntime: {
    kind: 'ServingRuntime',
    apiVersion: 'serving.kserve.io/v1alpha1',
    category: 'KServe',
    description: 'Defines a reusable model serving runtime (vLLM, TGI, Triton, etc.). Platform teams create ServingRuntimes once and share them across app teams. App teams reference the runtime by name in their InferenceServices.',
    keyFields: [
      { name: 'spec.supportedModelFormats', description: 'Which model formats this runtime can serve' },
      { name: 'spec.containers', description: 'Container template with runtime image and args' },
      { name: 'spec.protocolVersions', description: 'Supported inference protocols (v1, v2)' },
      { name: 'spec.grpcEndpoint', description: 'gRPC endpoint if supported' }
    ],
    docsUrl: 'https://kserve.github.io/website/docs/concepts/resources/servingruntime',
    usedBy: 'platform'
  },

  VirtualService: {
    kind: 'VirtualService',
    apiVersion: 'networking.istio.io/v1beta1',
    category: 'Istio Networking',
    description: 'Istio resource that configures traffic routing rules. KServe uses VirtualServices for canary deployments and traffic splitting between model versions.',
    keyFields: [
      { name: 'spec.hosts', description: 'Destination hostnames' },
      { name: 'spec.http', description: 'HTTP routing rules (match, route, weight)' },
      { name: 'spec.gateways', description: 'Which Istio Gateways handle this traffic' }
    ],
    docsUrl: 'https://istio.io/latest/docs/reference/config/networking/virtual-service/',
    usedBy: 'controller'
  },

  HTTPRoute: {
    kind: 'HTTPRoute',
    apiVersion: 'gateway.networking.k8s.io/v1',
    category: 'Gateway API',
    description: 'Kubernetes Gateway API resource for HTTP routing. Alternative to Istio VirtualService; KServe can use either depending on networking stack.',
    keyFields: [
      { name: 'spec.parentRefs', description: 'Which Gateways handle this route' },
      { name: 'spec.hostnames', description: 'Hostnames to match' },
      { name: 'spec.rules', description: 'Routing rules (match, backend refs, filters)' }
    ],
    docsUrl: 'https://gateway-api.sigs.k8s.io/reference/api-types/httproute/',
    usedBy: 'controller'
  },

  // Storage
  PersistentVolumeClaim: {
    kind: 'PersistentVolumeClaim',
    apiVersion: 'v1',
    category: 'Kubernetes Storage',
    description: 'Request for persistent storage. Binds to a PersistentVolume to provide durable storage for Pods (e.g., model artifacts).',
    keyFields: [
      { name: 'spec.accessModes', description: 'ReadWriteOnce, ReadOnlyMany, or ReadWriteMany' },
      { name: 'spec.resources.requests.storage', description: 'Storage size requested' },
      { name: 'spec.storageClassName', description: 'Type of storage (SSD, HDD, etc.)' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/',
    usedBy: 'user'
  },

  // Configuration
  ConfigMap: {
    kind: 'ConfigMap',
    apiVersion: 'v1',
    category: 'Kubernetes Configuration',
    description: 'Stores non-sensitive configuration data as key-value pairs. Can be mounted as files or environment variables in Pods.',
    keyFields: [
      { name: 'data', description: 'Key-value pairs of configuration data' },
      { name: 'binaryData', description: 'Binary data (base64 encoded)' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/configuration/configmap/',
    usedBy: 'user'
  },

  Secret: {
    kind: 'Secret',
    apiVersion: 'v1',
    category: 'Kubernetes Configuration',
    description: 'Stores sensitive data (passwords, tokens, SSH keys) in base64 encoding. Should be encrypted at rest via cluster configuration.',
    keyFields: [
      { name: 'type', description: 'Opaque, kubernetes.io/tls, etc.' },
      { name: 'data', description: 'Key-value pairs (base64 encoded)' },
      { name: 'stringData', description: 'Plain text data (auto-encoded on create)' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/configuration/secret/',
    usedBy: 'user'
  },

  // OpenShift AI (RHOAI) Resources
  DataScienceCluster: {
    kind: 'DataScienceCluster',
    apiVersion: 'datasciencecluster.opendatahub.io/v1',
    category: 'OpenShift AI',
    description: 'Top-level OpenShift AI resource that turns platform components (model serving, workbenches, pipelines, distributed workloads) on or off for the cluster. Platform teams create one DataScienceCluster to configure which capabilities are available.',
    keyFields: [
      { name: 'spec.components', description: 'Which OpenShift AI components are enabled (Managed, Removed, or Unmanaged)' },
      { name: 'spec.components.kserve', description: 'Model serving configuration' },
      { name: 'spec.components.workbenches', description: 'Jupyter workbench (notebook) configuration' },
      { name: 'spec.components.dashboard', description: 'OpenShift AI dashboard configuration' }
    ],
    docsUrl: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5',
    usedBy: 'platform'
  },

  Notebook: {
    kind: 'Notebook',
    apiVersion: 'kubeflow.org/v1',
    category: 'OpenShift AI',
    description: 'A single-user Jupyter workbench in OpenShift AI. Each data scientist gets a Notebook that runs their development environment (Python, libraries, GPU access) as a long-lived pod they can start and stop.',
    keyFields: [
      { name: 'spec.template', description: 'Pod template for the workbench container (image, resources)' },
      { name: 'metadata.annotations', description: 'Idle-culling, image selection, and stop/start state' },
      { name: 'spec.template.spec.containers', description: 'Workbench container with notebook image and GPU requests' }
    ],
    docsUrl: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5',
    usedBy: 'user'
  },

  StatefulSet: {
    kind: 'StatefulSet',
    apiVersion: 'apps/v1',
    category: 'Kubernetes Workload',
    description: 'Manages a set of Pods with stable, unique identities and stable storage. Unlike a Deployment, each pod keeps its name and attached volume across restarts, which suits workloads that need per-pod state (such as a single-user workbench).',
    keyFields: [
      { name: 'spec.replicas', description: 'Number of pod instances to run' },
      { name: 'spec.serviceName', description: 'The headless Service that governs pod network identity' },
      { name: 'spec.volumeClaimTemplates', description: 'Per-pod persistent storage templates' },
      { name: 'spec.template', description: 'Pod template (containers, volumes, etc.)' }
    ],
    docsUrl: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/',
    usedBy: 'controller'
  }
};

/**
 * Get resource definition by kind
 */
export function getResourceDefinition(kind) {
  return resourceDefinitions[kind] || {
    kind,
    category: 'Unknown',
    description: 'No description available for this resource type.',
    keyFields: [],
    docsUrl: null,
    usedBy: 'unknown'
  };
}
