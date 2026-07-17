import { useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Package,
  Cloud,
  Cpu,
  Database,
  HardDrive,
  Zap,
  Target,
  GraduationCap,
  Server
} from 'lucide-react';
import DecisionTree from './DecisionTree';
import { mergeDecisionPatches, getPatchesForRecommendationKey } from '../data/decisionRecommendationApply';
import { capabilities } from '../data/capabilities';
import { products } from '../data/products';
import { reconcileContainerAiPlatform } from '../lib/platformAiConstraints';
import { button, text, interactive, modal, surface, border, density, typeScale, productStatus } from '../lib/styleTokens';

/**
 * Return a balanced grid-cols class (complete literals — Tailwind JIT rule).
 * Mirrors the helper in CapabilityArchitectureView: no orphan trailing rows.
 */
function distributingGridCols(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  if (count === 4) return 'grid-cols-4';
  if (count === 5) return 'grid-cols-3'; // 3+2
  if (count === 6) return 'grid-cols-3'; // 3+3
  if (count === 7) return 'grid-cols-4'; // 4+3
  return 'grid-cols-4';
}

/** Look up status from products catalog by id. Returns null when no match. */
const productStatusFromCatalog = (productId) => {
  if (!productId) return null;
  return products.find((p) => p.id === productId)?.status ?? null;
};

const HEDGE_LINE = 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team.';

const guideMetadata = {
  product: { icon: Package, category: 'Product Selection', group: 'getting-started' },
  deployment: { icon: Cloud, category: 'Deployment Strategy', group: 'getting-started' },
  architecture: { icon: GitBranch, category: 'Architecture Design', group: 'getting-started' },
  gpu: { icon: Cpu, category: 'Hardware', group: 'infrastructure' },
  storage: { icon: HardDrive, category: 'Storage', group: 'infrastructure' },
  vectordb: { icon: Database, category: 'Vector Database', group: 'infrastructure' },
  servingChoice: { icon: Server, category: 'Serving Platform', group: 'technical' },
  batchVsRealtime: { icon: Zap, category: 'Inference Pattern', group: 'technical' },
  trainingApproach: { icon: GraduationCap, category: 'Training Method', group: 'technical' },
  evaluationFramework: { icon: Target, category: 'Evaluation Tools', group: 'technical' }
};

const guideGroups = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Choose your platform and overall architecture',
    guides: ['product', 'deployment', 'architecture'],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure & Resources',
    description: 'Select hardware, storage, and data infrastructure',
    guides: ['gpu', 'storage', 'vectordb'],
  },
  {
    id: 'technical',
    title: 'Technical Implementation',
    description: 'Configure serving, training, and evaluation approaches',
    guides: ['servingChoice', 'batchVsRealtime', 'trainingApproach', 'evaluationFramework'],
  }
];

// Static decision-guide content. Hoisted to module scope so it is not rebuilt on every render.
const decisionFlows = {
  product: {
    title: 'Which Red Hat AI Product Should I Use?',
    description: 'Find the right Red Hat AI product for your needs',
    steps: [
      {
        question: 'What is your primary deployment target?',
        options: [
          { value: 'single-server', label: 'Single Server / Workstation', next: 1 },
          { value: 'kubernetes', label: 'Kubernetes / OpenShift Cluster', next: 2 },
          { value: 'both', label: 'Both / Not Sure', next: 3 }
        ]
      },
      {
        question: 'Do you need to fine-tune models?',
        condition: { step: 0, value: 'single-server' },
        options: [
          { value: 'yes', label: 'Yes, fine-tuning is critical', recommendation: 'RHEL AI' },
          { value: 'no', label: 'No, just inference', recommendation: 'RHEL AI' }
        ],
        recommendation: {
          product: 'Red Hat Enterprise Linux AI',
          why: 'RHEL AI is optimized for single-server deployments with built-in InstructLab for fine-tuning',
          tradeoffs: [
            { pro: 'Simple setup on individual servers', con: 'Limited to single-node scaling' },
            { pro: 'Includes InstructLab for fine-tuning', con: 'Not ideal for distributed workloads' }
          ]
        }
      },
      {
        question: 'What is your team size and use case?',
        condition: { step: 0, value: 'kubernetes' },
        options: [
          { value: 'small-inference', label: 'Small team, mainly inference', next: 4 },
          { value: 'large-mlops', label: 'Large team, full MLOps lifecycle', next: 5 },
          { value: 'enterprise', label: 'Enterprise-wide AI initiative', next: 6 }
        ]
      },
      {
        question: 'Do you already have OpenShift?',
        condition: { step: 0, value: 'both' },
        options: [
          { value: 'yes', label: 'Yes, OpenShift is already deployed', recommendation: 'RHOAI' },
          { value: 'no', label: 'No OpenShift yet', recommendation: 'RHAIE' },
          { value: 'dont-know', label: 'Not sure / Need to check', next: 2 }
        ]
      },
      {
        question: 'Do you need distributed training or just serving?',
        condition: { step: 2, value: 'small-inference' },
        options: [
          { value: 'serving', label: 'Mainly model serving', recommendation: 'AI-Inference' },
          { value: 'both', label: 'Both training and serving', recommendation: 'RHOAI' }
        ]
      },
      {
        question: 'Do you have existing OpenShift?',
        condition: { step: 2, value: 'large-mlops' },
        options: [
          { value: 'yes', label: 'Yes', recommendation: 'RHOAI' },
          { value: 'no', label: 'No', recommendation: 'RHAIE' }
        ]
      },
      {
        question: 'Procurement preference?',
        condition: { step: 2, value: 'enterprise' },
        options: [
          { value: 'bundled', label: 'Prefer single SKU / bundled', recommendation: 'RHAIE' },
          { value: 'separate', label: 'Prefer separate components', recommendation: 'RHOAI+OpenShift' }
        ],
        recommendation: {
          product: 'Red Hat AI Enterprise (RHAIE)',
          why: 'RHAIE provides everything in one package: OpenShift + OpenShift AI + InstructLab',
          tradeoffs: [
            { pro: 'Simplified procurement', con: 'Less flexibility in component selection' },
            { pro: 'Pre-integrated stack', con: 'May include components you don\'t need' }
          ]
        }
      }
    ],
    recommendations: {
      'RHEL AI': {
        product: 'Red Hat Enterprise Linux AI',
        productId: 'rhel-ai',
        icon: '🖥️',
        why: 'Optimized for single-server deployments with built-in model serving and fine-tuning',
        bestFor: ['Small teams', 'Getting started', 'Edge deployments', 'Fine-tuning workloads'],
        tradeoffs: [
          { pro: 'Simple setup and management', con: 'Limited to single-node' },
          { pro: 'Includes InstructLab', con: 'No distributed training' },
          { pro: 'Lower barrier to entry', con: 'Harder to scale to production' }
        ],
        alternatives: ['For distributed: OpenShift AI', 'For cloud-native: Kubernetes-based solutions']
      },
      'RHOAI': {
        product: 'Red Hat OpenShift AI',
        productId: 'rhoai',
        platformRequirement: 'Requires OpenShift',
        icon: '☸️',
        why: 'Full ML lifecycle platform for teams that need distributed workloads and production MLOps',
        bestFor: ['Large teams', 'Production ML', 'Distributed training', 'Multi-model serving'],
        tradeoffs: [
          { pro: 'Full MLOps lifecycle', con: 'Requires OpenShift knowledge' },
          { pro: 'Distributed workloads', con: 'More complex setup' },
          { pro: 'Production-grade', con: 'Higher resource requirements' }
        ],
        alternatives: ['For single-server: RHEL AI', 'For bundled: RHAIE']
      },
      'RHAIE': {
        product: 'Red Hat AI Enterprise',
        productId: 'rhaie',
        icon: '🎁',
        why: 'Complete integrated platform: OpenShift + OpenShift AI + InstructLab in one SKU',
        bestFor: ['Enterprise initiatives', 'Simplified procurement', 'Complete platform'],
        tradeoffs: [
          { pro: 'Everything bundled', con: 'Less component flexibility' },
          { pro: 'Single support contract', con: 'May include unused components' },
          { pro: 'Simplified billing', con: 'Fixed configuration' }
        ],
        alternatives: ['For flexibility: OpenShift + OpenShift AI separately']
      },
      'AI-Inference': {
        product: 'Red Hat AI Inference Server',
        productId: 'ai-inference',
        icon: '⚡',
        why: 'High-performance vLLM-based serving optimized for LLMs',
        bestFor: ['Inference-only', 'High throughput', 'LLM serving', 'Production APIs'],
        tradeoffs: [
          { pro: 'Optimized for inference', con: 'No training capabilities' },
          { pro: 'High performance', con: 'Specialized use case' },
          { pro: 'vLLM integration', con: 'Limited to serving workloads' }
        ],
        alternatives: ['For full lifecycle: OpenShift AI', 'For training: RHOAI']
      },
      'RHOAI+OpenShift': {
        product: 'OpenShift + OpenShift AI (Separate)',
        icon: '🔧',
        why: 'Maximum flexibility - buy components separately based on your needs',
        bestFor: ['Custom configurations', 'Existing OpenShift', 'Incremental adoption'],
        tradeoffs: [
          { pro: 'Component flexibility', con: 'Multiple procurement items' },
          { pro: 'Pay for what you use', con: 'More complex licensing' },
          { pro: 'Incremental adoption', con: 'Requires integration knowledge' }
        ],
        alternatives: ['For simplicity: RHAIE bundled']
      }
    }
  },
  deployment: {
    title: 'Where Should I Deploy My AI Workloads?',
    description: 'Choose the right deployment model',
    steps: [
      {
        question: 'What are your data residency requirements?',
        options: [
          { value: 'strict', label: 'Must stay on-premises (compliance, air-gap)', next: 1 },
          { value: 'flexible', label: 'Can use public cloud', next: 2 },
          { value: 'hybrid', label: 'Need both', next: 5 }
        ]
      },
      {
        question: 'What is your scale?',
        condition: { step: 0, value: 'strict' },
        options: [
          { value: 'small', label: 'Small scale (few servers)', recommendation: 'on-prem-small' },
          { value: 'large', label: 'Large scale (data center)', recommendation: 'on-prem-large' }
        ]
      },
      {
        question: 'Do you have or want managed OpenShift on cloud?',
        condition: { step: 0, value: 'flexible' },
        options: [
          { value: 'yes', label: 'Yes, using managed OpenShift (ROSA/ARO)', next: 3 },
          { value: 'no', label: 'No, using native cloud Kubernetes (EKS/AKS/GKE)', next: 4 }
        ]
      },
      {
        question: 'Primary workload type?',
        condition: { step: 2, value: 'yes' },
        options: [
          { value: 'inference', label: 'Mainly inference', recommendation: 'cloud-openshift-inference' },
          { value: 'training', label: 'Training and experimentation', recommendation: 'cloud-openshift-training' },
          { value: 'both', label: 'Both training and inference', recommendation: 'cloud-openshift-both' }
        ]
      },
      {
        question: 'Primary workload type?',
        condition: { step: 2, value: 'no' },
        options: [
          { value: 'inference', label: 'Mainly inference', recommendation: 'cloud-kubernetes-inference' },
          { value: 'training', label: 'Training and experimentation', recommendation: 'cloud-kubernetes-training' },
          { value: 'both', label: 'Both training and inference', recommendation: 'cloud-kubernetes-both' }
        ]
      },
      {
        question: 'Which workloads need to stay on-prem?',
        condition: { step: 0, value: 'hybrid' },
        options: [
          { value: 'training', label: 'Training (sensitive data)', recommendation: 'hybrid-train-onprem' },
          { value: 'inference', label: 'Inference (low latency)', recommendation: 'hybrid-inference-onprem' }
        ]
      }
    ],
    recommendations: {
      'on-prem-small': {
        product: 'On-Premises (Small Scale)',
        icon: '🏢',
        why: 'RHEL AI on individual servers or small OpenShift cluster',
        bestFor: ['Compliance requirements', 'Air-gapped environments', 'Edge deployments'],
        tradeoffs: [
          { pro: 'Full data control', con: 'Limited scalability' },
          { pro: 'No cloud costs', con: 'Hardware procurement needed' },
          { pro: 'Low latency', con: 'Maintenance burden' }
        ],
        alternatives: ['For scale: Larger on-prem cluster', 'For flexibility: Hybrid cloud']
      },
      'on-prem-large': {
        product: 'On-Premises Data Center',
        icon: '🏭',
        why: 'OpenShift AI on your own infrastructure for large-scale workloads',
        bestFor: ['Large enterprises', 'Strict compliance', 'High-volume training'],
        tradeoffs: [
          { pro: 'Complete control', con: 'High CapEx' },
          { pro: 'Maximum security', con: 'Complex management' },
          { pro: 'Predictable costs', con: 'Slower to scale' }
        ],
        alternatives: ['Hybrid for burst capacity', 'Managed OpenShift on cloud']
      },
      'cloud-openshift-inference': {
        product: 'Managed OpenShift on Cloud (Inference)',
        icon: '☁️',
        why: 'Managed OpenShift (ROSA/ARO) with RHOAI and AI Inference Server',
        bestFor: ['Production APIs', 'OpenShift expertise', 'Enterprise support'],
        tradeoffs: [
          { pro: 'Red Hat support', con: 'Higher cost than native Kubernetes' },
          { pro: 'OpenShift features', con: 'Cloud egress costs' },
          { pro: 'Managed infrastructure', con: 'Vendor-specific' }
        ],
        alternatives: ['Native Kubernetes for lower cost', 'On-prem for data residency']
      },
      'cloud-openshift-training': {
        product: 'Managed OpenShift on Cloud (Training)',
        icon: '🧪',
        why: 'Managed OpenShift AI (ROSA/ARO) for experimentation and model development',
        bestFor: ['Experimentation', 'OpenShift teams', 'Bursty workloads'],
        tradeoffs: [
          { pro: 'Access to latest GPUs', con: 'Expensive for sustained use' },
          { pro: 'Red Hat support', con: 'Higher cost than native Kubernetes' },
          { pro: 'Fast provisioning', con: 'Data transfer costs' }
        ],
        alternatives: ['Native Kubernetes for lower cost', 'On-prem for cost optimization']
      },
      'cloud-openshift-both': {
        product: 'Managed OpenShift on Cloud (Full Lifecycle)',
        icon: '🔄',
        why: 'Complete ML platform with managed OpenShift AI (ROSA/ARO)',
        bestFor: ['OpenShift-first teams', 'Enterprise support', 'Full lifecycle'],
        tradeoffs: [
          { pro: 'End-to-end platform', con: 'Higher ongoing costs' },
          { pro: 'Red Hat support', con: 'Vendor-specific' },
          { pro: 'Easy collaboration', con: 'Compliance considerations' }
        ],
        alternatives: ['Native Kubernetes for lower cost', 'Hybrid for flexibility']
      },
      'cloud-kubernetes-inference': {
        product: 'Native Cloud Kubernetes (Inference)',
        icon: '☁️',
        why: 'EKS/AKS/GKE with Red Hat AI (RHAI) and AI Inference Server',
        bestFor: ['Production APIs', 'Cloud-native teams', 'Cost optimization'],
        tradeoffs: [
          { pro: 'Lower cost than OpenShift', con: 'No Red Hat support for Kubernetes' },
          { pro: 'Native cloud integration', con: 'Cloud egress costs' },
          { pro: 'Managed infrastructure', con: 'Self-managed AI platform' }
        ],
        alternatives: ['Managed OpenShift for support', 'On-prem for data residency']
      },
      'cloud-kubernetes-training': {
        product: 'Native Cloud Kubernetes (Training)',
        icon: '🧪',
        why: 'EKS/AKS/GKE with Red Hat AI (RHAI) for model development',
        bestFor: ['Experimentation', 'Cloud-native teams', 'Cost-conscious'],
        tradeoffs: [
          { pro: 'Access to latest GPUs', con: 'Expensive for sustained use' },
          { pro: 'Lower cost than OpenShift', con: 'Less enterprise support' },
          { pro: 'Fast provisioning', con: 'Data transfer costs' }
        ],
        alternatives: ['Managed OpenShift for support', 'On-prem for cost optimization']
      },
      'cloud-kubernetes-both': {
        product: 'Native Cloud Kubernetes (Full Lifecycle)',
        icon: '🔄',
        why: 'Complete ML platform with RHAI on EKS/AKS/GKE',
        bestFor: ['Cloud-native teams', 'Cost optimization', 'Kubernetes expertise'],
        tradeoffs: [
          { pro: 'End-to-end platform', con: 'Higher ongoing costs' },
          { pro: 'Lower cost than OpenShift', con: 'Less enterprise support' },
          { pro: 'Easy collaboration', con: 'Compliance considerations' }
        ],
        alternatives: ['Managed OpenShift for support', 'Hybrid for flexibility']
      },
      'hybrid-train-onprem': {
        product: 'Hybrid (Training On-Prem, Inference Cloud)',
        icon: '🔀',
        why: 'Train on sensitive data on-prem, deploy models to cloud for serving',
        bestFor: ['Regulated industries', 'Cost optimization', 'Best of both worlds'],
        tradeoffs: [
          { pro: 'Data stays secure', con: 'Complex networking' },
          { pro: 'Cloud scale for serving', con: 'Multiple environments to manage' },
          { pro: 'Optimized costs', con: 'Model transfer overhead' }
        ],
        alternatives: ['Full on-prem for simplicity', 'Full cloud if allowed']
      },
      'hybrid-inference-onprem': {
        product: 'Hybrid (Inference On-Prem/Edge)',
        icon: '🌐',
        why: 'Train in cloud, deploy inference close to users or on edge',
        bestFor: ['Low latency requirements', 'Edge AI', 'Manufacturing'],
        tradeoffs: [
          { pro: 'Ultra-low latency', con: 'Distributed management' },
          { pro: 'Works offline', con: 'Model sync complexity' },
          { pro: 'Local data processing', con: 'Limited compute per location' }
        ],
        alternatives: ['Cloud-only for simplicity', 'Full edge for offline capability']
      }
    }
  },
  architecture: {
    title: 'How Should I Architect My AI Solution?',
    description: 'Design your technical architecture',
    steps: [
      {
        question: 'What is your primary use case?',
        options: [
          { value: 'inference', label: 'Model inference/serving', next: 1 },
          { value: 'training', label: 'Model training', next: 2 },
          { value: 'full', label: 'Full ML lifecycle', next: 3 },
          { value: 'rag', label: 'RAG (Retrieval Augmented Generation)', next: 4 }
        ]
      },
      {
        question: 'Do you need multi-model serving?',
        condition: { step: 0, value: 'inference' },
        options: [
          { value: 'single', label: 'Single model', recommendation: 'simple-inference' },
          { value: 'multi', label: 'Multiple models', recommendation: 'complex-inference' }
        ]
      },
      {
        question: 'Training scale?',
        condition: { step: 0, value: 'training' },
        options: [
          { value: 'single', label: 'Single GPU / Small scale', recommendation: 'simple-training' },
          { value: 'distributed', label: 'Distributed training', recommendation: 'distributed-training' }
        ]
      },
      {
        question: 'Team size and governance needs?',
        condition: { step: 0, value: 'full' },
        options: [
          { value: 'small', label: 'Small team, minimal governance', recommendation: 'simple-mlops' },
          { value: 'enterprise', label: 'Enterprise, strict governance', recommendation: 'enterprise-mlops' }
        ]
      },
      {
        question: 'What is your data source?',
        condition: { step: 0, value: 'rag' },
        options: [
          { value: 'documents', label: 'Documents and files', recommendation: 'rag-documents' },
          { value: 'database', label: 'Existing databases', recommendation: 'rag-database' },
          { value: 'both', label: 'Multiple sources', recommendation: 'rag-complex' }
        ]
      }
    ],
    recommendations: {
      'simple-inference': {
        product: 'Simple Inference Architecture',
        icon: '⚡',
        why: 'Minimal setup for single-model serving',
        bestFor: ['Single model', 'Simple APIs', 'Getting started'],
        components: ['AI Inference Server', 'API Gateway (optional)', 'OpenShift (base)'],
        tradeoffs: [
          { pro: 'Simple to set up', con: 'Limited to one model' },
          { pro: 'Low overhead', con: 'No A/B testing' },
          { pro: 'Easy to understand', con: 'Manual model updates' }
        ],
        alternatives: ['For multiple models: Complex inference', 'For training too: Full MLOps']
      },
      'complex-inference': {
        product: 'Multi-Model Inference Architecture',
        icon: '🎯',
        why: 'Serve multiple models with routing and versioning',
        bestFor: ['Multiple models', 'A/B testing', 'Production serving'],
        components: ['KServe model serving', 'Model Registry', 'API Gateway', 'Observability', 'OpenShift AI'],
        tradeoffs: [
          { pro: 'Multi-model support', con: 'More complex setup' },
          { pro: 'A/B testing', con: 'Higher resource usage' },
          { pro: 'Version management', con: 'Requires ModelOps practices' }
        ],
        alternatives: ['For simplicity: Single model', 'For training: Full lifecycle']
      },
      'simple-training': {
        product: 'Simple Training Setup',
        icon: '🧪',
        why: 'Single-node training for experimentation',
        bestFor: ['Experimentation', 'Fine-tuning', 'Small datasets'],
        components: ['RHEL AI or workbenches', 'Model Registry (optional)', 'GPU node'],
        tradeoffs: [
          { pro: 'Quick to start', con: 'Limited to single GPU' },
          { pro: 'Low complexity', con: 'Slow for large models' },
          { pro: 'Easy debugging', con: 'No distributed training' }
        ],
        alternatives: ['For scale: Distributed training', 'For production: Full MLOps']
      },
      'distributed-training': {
        product: 'Distributed Training Architecture',
        icon: '🚀',
        why: 'Multi-node training for large models and datasets',
        bestFor: ['Large models', 'Big datasets', 'Production training'],
        components: ['OpenShift AI Distributed Workloads', 'Model Registry', 'Data Science Pipelines', 'Object Storage'],
        tradeoffs: [
          { pro: 'Handles large scale', con: 'Complex orchestration' },
          { pro: 'Faster training', con: 'Higher costs' },
          { pro: 'Production-grade', con: 'Steeper learning curve' }
        ],
        alternatives: ['For small scale: Simple training', 'For serving too: Full lifecycle']
      },
      'simple-mlops': {
        product: 'Basic MLOps Platform',
        icon: '🔄',
        why: 'Train and serve with minimal governance overhead',
        bestFor: ['Small teams', 'Startups', 'Rapid iteration'],
        components: ['OpenShift AI', 'Model Registry', 'KServe', 'Basic monitoring'],
        tradeoffs: [
          { pro: 'End-to-end platform', con: 'Limited governance' },
          { pro: 'Fast iteration', con: 'Manual processes' },
          { pro: 'Lower overhead', con: 'Compliance gaps' }
        ],
        alternatives: ['For governance: Enterprise MLOps', 'For inference only: Simple serving']
      },
      'enterprise-mlops': {
        product: 'Enterprise MLOps Platform',
        icon: '🏢',
        why: 'Complete platform with governance, compliance, and audit trails',
        bestFor: ['Large enterprises', 'Regulated industries', 'Strict governance'],
        components: ['OpenShift AI', 'Model Registry', 'TrustyAI', 'Pipelines', 'Observability', 'API Gateway'],
        tradeoffs: [
          { pro: 'Full governance', con: 'Complex setup' },
          { pro: 'Audit trails', con: 'Slower to change' },
          { pro: 'Compliance-ready', con: 'Higher overhead' }
        ],
        alternatives: ['For simplicity: Basic MLOps', 'For specific needs: Build custom']
      },
      'rag-documents': {
        product: 'RAG Architecture (Documents)',
        icon: '📚',
        why: 'Process documents and provide contextual answers',
        bestFor: ['Document Q&A', 'Knowledge bases', 'Support chatbots'],
        components: ['Vector DB (Elastic)', 'LLM Serving', 'Document processing pipeline', 'Embedding model'],
        tradeoffs: [
          { pro: 'Accurate retrieval', con: 'Document processing overhead' },
          { pro: 'Source attribution', con: 'Storage for embeddings' },
          { pro: 'Easy to update knowledge', con: 'Chunking complexity' }
        ],
        alternatives: ['For structured data: RAG with databases', 'For fine-tuning: InstructLab']
      },
      'rag-database': {
        product: 'RAG Architecture (Databases)',
        icon: '🗄️',
        why: 'Query structured data with natural language',
        bestFor: ['Database queries', 'Analytics', 'Business intelligence'],
        components: ['Vector DB', 'LLM Serving', 'Database connectors', 'SQL generation'],
        tradeoffs: [
          { pro: 'Structured queries', con: 'Schema knowledge needed' },
          { pro: 'Real-time data', con: 'Connection management' },
          { pro: 'Accurate for structured data', con: 'Limited to DB schema' }
        ],
        alternatives: ['For documents: Document RAG', 'For both: Complex RAG']
      },
      'rag-complex': {
        product: 'Advanced RAG Architecture',
        icon: '🌐',
        why: 'Multi-source RAG with sophisticated retrieval',
        bestFor: ['Enterprise search', 'Multi-source knowledge', 'Complex queries'],
        components: ['Vector DB', 'MCP for tool integration', 'LLM Serving', 'Multi-source connectors', 'Re-ranking'],
        tradeoffs: [
          { pro: 'Comprehensive knowledge', con: 'High complexity' },
          { pro: 'Best accuracy', con: 'More moving parts' },
          { pro: 'Flexible sources', con: 'Higher latency' }
        ],
        alternatives: ['For simpler: Single-source RAG', 'For fine-tuning: InstructLab instead']
      }
    }
  },
  gpu: {
    title: 'Which GPU Hardware Should I Use?',
    description: 'Choose the right accelerator for your AI workloads',
    steps: [
      {
        question: 'What is your primary workload?',
        options: [
          { value: 'training', label: 'Model training (especially large models)', next: 1 },
          { value: 'inference', label: 'Model inference/serving', next: 2 },
          { value: 'both', label: 'Both training and inference', next: 3 },
          { value: 'poc', label: 'POC / Getting started', next: 4 }
        ]
      },
      {
        question: 'Training scale and budget?',
        condition: { step: 0, value: 'training' },
        options: [
          { value: 'high-budget', label: 'Large models, maximum performance, budget flexible', recommendation: 'nvidia-h100' },
          { value: 'mid-budget', label: 'Standard models, good performance, moderate budget', recommendation: 'nvidia-a100' },
          { value: 'low-budget', label: 'Smaller models, cost-conscious', recommendation: 'amd-mi' }
        ]
      },
      {
        question: 'Latency and throughput requirements?',
        condition: { step: 0, value: 'inference' },
        options: [
          { value: 'high-throughput', label: 'High throughput, many concurrent requests', recommendation: 'nvidia-a10g' },
          { value: 'balanced', label: 'Balanced latency and cost', recommendation: 'nvidia-l40s' },
          { value: 'cost-optimized', label: 'Cost-optimized, moderate load', recommendation: 'intel-gaudi' }
        ]
      },
      {
        question: 'What is your primary constraint?',
        condition: { step: 0, value: 'both' },
        options: [
          { value: 'performance', label: 'Maximum performance', recommendation: 'nvidia-h100' },
          { value: 'balance', label: 'Balance of performance and cost', recommendation: 'nvidia-a100' },
          { value: 'cost', label: 'Cost optimization', recommendation: 'amd-mi' }
        ]
      },
      {
        question: 'Budget and scale for POC?',
        condition: { step: 0, value: 'poc' },
        options: [
          { value: 'minimal', label: 'Minimal cost, just testing concepts', recommendation: 'cpu-only' },
          { value: 'realistic', label: 'Need realistic performance testing', recommendation: 'nvidia-a10g' }
        ]
      }
    ],
    recommendations: {
      'nvidia-h100': {
        product: 'NVIDIA H100 GPUs',
        icon: '🚀',
        why: 'Latest generation, highest performance for both training and inference',
        bestFor: ['Large language models (70B+ parameters)', 'Distributed training', 'Production inference at scale'],
        tradeoffs: [
          { pro: 'Best performance available', con: 'Highest cost per GPU' },
          { pro: '80GB HBM3 memory', con: 'Limited availability' },
          { pro: 'Transformer Engine', con: 'May be overkill for smaller models' }
        ],
        alternatives: ['A100 for better availability', 'A10G for cost optimization']
      },
      'nvidia-a100': {
        product: 'NVIDIA A100 GPUs',
        icon: '⚡',
        why: 'Proven workhorse for ML training and inference with great availability',
        bestFor: ['Medium to large models', 'Distributed training', 'Multi-GPU setups'],
        tradeoffs: [
          { pro: 'Excellent performance', con: 'Expensive for inference-only' },
          { pro: '40GB or 80GB options', con: 'Previous generation' },
          { pro: 'Wide availability', con: 'Lower performance than H100' }
        ],
        alternatives: ['H100 for max performance', 'A10G for inference-only']
      },
      'nvidia-a10g': {
        product: 'NVIDIA A10G GPUs',
        icon: '💰',
        why: 'Cost-effective inference and light training, excellent for production serving',
        bestFor: ['LLM inference', 'Model serving APIs', 'Cost-sensitive workloads'],
        tradeoffs: [
          { pro: 'Cost-effective for inference workloads', con: 'Not ideal for large model training' },
          { pro: '24GB memory', con: 'Memory limited for 70B+ models' },
          { pro: 'Widely available in cloud', con: 'Lower FP64 performance' }
        ],
        alternatives: ['L40S for better performance', 'A100 for training']
      },
      'nvidia-l40s': {
        product: 'NVIDIA L40S GPUs',
        icon: '🎯',
        why: 'Balanced GPU for inference and visualization workloads',
        bestFor: ['Production inference', 'Multi-modal models', 'Hybrid workloads'],
        tradeoffs: [
          { pro: 'Good inference performance', con: 'Not optimized for training' },
          { pro: '48GB memory', con: 'More expensive than A10G' },
          { pro: 'Ada Lovelace architecture', con: 'Less common than A100/A10G' }
        ],
        alternatives: ['A10G for cost savings', 'H100 for max throughput']
      },
      'amd-mi': {
        product: 'AMD MI-Series GPUs',
        icon: '🔧',
        why: 'Open-source alternative to NVIDIA with competitive pricing',
        bestFor: ['Cost optimization', 'Avoiding vendor lock-in', 'ROCm-compatible workloads'],
        tradeoffs: [
          { pro: 'Lower cost than NVIDIA', con: 'Smaller ecosystem' },
          { pro: 'Open-source ROCm', con: 'Less framework support' },
          { pro: 'Good for training', con: 'Requires ROCm expertise' }
        ],
        alternatives: ['NVIDIA for wider support', 'Intel for alternative vendor']
      },
      'intel-gaudi': {
        product: 'Intel Gaudi Accelerators',
        icon: '🔷',
        why: 'Intel alternative focused on training and inference efficiency',
        bestFor: ['Intel infrastructure', 'Cost-optimized inference', 'LLM workloads'],
        tradeoffs: [
          { pro: 'Competitive pricing', con: 'Smaller ecosystem than NVIDIA' },
          { pro: 'Optimized for LLMs', con: 'Framework support still growing' },
          { pro: 'Good power efficiency', con: 'Less proven in production' }
        ],
        alternatives: ['NVIDIA for maturity', 'AMD for open source']
      },
      'cpu-only': {
        product: 'CPU-Only (No GPU)',
        icon: '💻',
        why: 'Lowest cost option for testing and small-scale workloads',
        bestFor: ['POCs', 'Development', 'Small models', 'Budget constraints'],
        tradeoffs: [
          { pro: 'No GPU costs', con: 'Very slow for training' },
          { pro: 'Universal availability', con: 'Not suitable for production' },
          { pro: 'Easy to get started', con: 'Limited to small models' }
        ],
        alternatives: ['A10G for production', 'Cloud GPUs for flexibility']
      }
    }
  },
  vectordb: {
    title: 'Which Vector Database for RAG?',
    description: 'Choose the right vector database for your RAG application',
    steps: [
      {
        question: 'What is your deployment preference?',
        options: [
          { value: 'managed', label: 'Prefer managed/cloud service', next: 1 },
          { value: 'self-hosted', label: 'Self-hosted on OpenShift', next: 2 },
          { value: 'existing', label: 'Already have a database', next: 3 }
        ]
      },
      {
        question: 'What is your scale?',
        condition: { step: 0, value: 'managed' },
        options: [
          { value: 'small', label: 'Small scale (<1M vectors)', recommendation: 'pinecone' },
          { value: 'large', label: 'Large scale (1M+ vectors)', recommendation: 'elastic-cloud' }
        ]
      },
      {
        question: 'Do you want Red Hat support?',
        condition: { step: 0, value: 'self-hosted' },
        options: [
          { value: 'yes', label: 'Yes, prefer Red Hat partnership', recommendation: 'elastic-self' },
          { value: 'no', label: 'No, open source is fine', recommendation: 'pgvector' }
        ]
      },
      {
        question: 'What database do you currently use?',
        condition: { step: 0, value: 'existing' },
        options: [
          { value: 'postgres', label: 'PostgreSQL', recommendation: 'pgvector' },
          { value: 'elastic', label: 'Elasticsearch', recommendation: 'elastic-self' },
          { value: 'other', label: 'Other / None', recommendation: 'elastic-self' }
        ]
      }
    ],
    recommendations: {
      'elastic-cloud': {
        product: 'Elastic (Cloud)',
        icon: '☁️',
        why: 'Red Hat preferred partner with mature vector search and enterprise features',
        bestFor: ['Large scale', 'Enterprise support', 'Hybrid search (keyword + vector)'],
        tradeoffs: [
          { pro: 'Red Hat partnership', con: 'Higher cost than open source' },
          { pro: 'Hybrid search built-in', con: 'Vendor lock-in' },
          { pro: 'Fully managed', con: 'Less control' }
        ],
        alternatives: ['Elastic self-hosted for control', 'Pinecone for simplicity']
      },
      'elastic-self': {
        product: 'Elastic (Self-Hosted)',
        icon: '🔍',
        why: 'Deploy on OpenShift with Red Hat support, full control',
        bestFor: ['Data sovereignty', 'On-premises', 'Red Hat support needed'],
        tradeoffs: [
          { pro: 'Full control', con: 'You manage infrastructure' },
          { pro: 'Red Hat support available', con: 'Setup complexity' },
          { pro: 'Hybrid search', con: 'Resource intensive' }
        ],
        alternatives: ['Elastic Cloud for managed', 'pgvector for simplicity']
      },
      'pgvector': {
        product: 'PostgreSQL + pgvector',
        icon: '🐘',
        why: 'Open source vector extension for PostgreSQL, simple and cost-effective',
        bestFor: ['Existing PostgreSQL users', 'Budget-conscious', 'Simpler deployments'],
        tradeoffs: [
          { pro: 'Reuse PostgreSQL expertise', con: 'Less optimized than purpose-built' },
          { pro: 'Open source', con: 'No enterprise support' },
          { pro: 'Low cost', con: 'Limited to PostgreSQL performance' }
        ],
        alternatives: ['Elastic for enterprise features', 'Milvus for scale']
      },
      'pinecone': {
        product: 'Pinecone',
        icon: '🌲',
        why: 'Purpose-built managed vector database, simple to use',
        bestFor: ['Fast time-to-market', 'Startups', 'Small to medium scale'],
        tradeoffs: [
          { pro: 'Easiest to get started', con: 'Vendor lock-in' },
          { pro: 'Fully managed', con: 'Can get expensive at scale' },
          { pro: 'Good performance', con: 'Cloud-only' }
        ],
        alternatives: ['Elastic for Red Hat support', 'pgvector for cost savings']
      }
    }
  },
  storage: {
    title: 'Where Should I Store AI Data?',
    description: 'Choose the right storage strategy for datasets and models',
    steps: [
      {
        question: 'Where is your AI platform deployed?',
        options: [
          { value: 'on-prem', label: 'On-premises / Private cloud', next: 1 },
          { value: 'public-cloud', label: 'Public cloud (AWS/Azure/GCP)', next: 2 },
          { value: 'hybrid', label: 'Hybrid (both)', next: 3 }
        ]
      },
      {
        question: 'What is your data scale?',
        condition: { step: 0, value: 'on-prem' },
        options: [
          { value: 'small', label: 'Small (<10TB)', recommendation: 'odf-small' },
          { value: 'large', label: 'Large (10TB+)', recommendation: 'odf-large' }
        ]
      },
      {
        question: 'Which cloud provider?',
        condition: { step: 0, value: 'public-cloud' },
        options: [
          { value: 'aws', label: 'AWS', recommendation: 's3' },
          { value: 'azure', label: 'Azure', recommendation: 'azure-blob' },
          { value: 'gcp', label: 'GCP', recommendation: 'gcs' },
          { value: 'multi', label: 'Multi-cloud', recommendation: 'noobaa' }
        ]
      },
      {
        question: 'Primary data location?',
        condition: { step: 0, value: 'hybrid' },
        options: [
          { value: 'mostly-on-prem', label: 'Mostly on-premises', recommendation: 'odf-hybrid' },
          { value: 'mostly-cloud', label: 'Mostly cloud', recommendation: 's3-hybrid' },
          { value: 'balanced', label: 'Evenly distributed', recommendation: 'noobaa' }
        ]
      }
    ],
    recommendations: {
      'odf-small': {
        product: 'OpenShift Data Foundation (Small)',
        icon: '💾',
        why: 'Integrated S3-compatible storage for small to medium datasets on OpenShift',
        bestFor: ['On-premises deployments', 'Data sovereignty', '<10TB datasets'],
        tradeoffs: [
          { pro: 'OpenShift-native integration', con: 'Limited to on-prem' },
          { pro: 'S3-compatible API', con: 'Requires storage infrastructure' },
          { pro: 'Data stays on-prem', con: 'More expensive than cloud at scale' }
        ],
        alternatives: ['S3 for cloud', 'ODF Large for bigger datasets']
      },
      'odf-large': {
        product: 'OpenShift Data Foundation (Large)',
        icon: '🏢',
        why: 'Scalable on-premises S3-compatible storage with Ceph backend',
        bestFor: ['Large on-prem deployments', 'Petabyte scale', 'Data residency'],
        tradeoffs: [
          { pro: 'Scales to petabytes', con: 'Complex to manage at scale' },
          { pro: 'Full control', con: 'Higher operational burden' },
          { pro: 'No cloud egress costs', con: 'Requires hardware investment' }
        ],
        alternatives: ['Hybrid with cloud for burst', 'NooBaa for multi-cloud']
      },
      's3': {
        product: 'Amazon S3',
        icon: '☁️',
        why: 'Industry-standard cloud object storage, pay-as-you-go',
        bestFor: ['AWS deployments', 'Cloud-native teams', 'Variable storage needs'],
        tradeoffs: [
          { pro: 'Unlimited scale', con: 'Egress costs can be high' },
          { pro: 'No infrastructure management', con: 'Data in public cloud' },
          { pro: 'Pay-as-you-go', con: 'Costs increase with scale' }
        ],
        alternatives: ['ODF for on-prem', 'GCS/Azure for multi-cloud']
      },
      'azure-blob': {
        product: 'Azure Blob Storage',
        icon: '🔷',
        why: 'Azure native object storage with hot/cool/archive tiers',
        bestFor: ['Azure deployments', 'Microsoft ecosystem', 'Tiered storage'],
        tradeoffs: [
          { pro: 'Azure integration', con: 'Azure vendor lock-in' },
          { pro: 'Tiered pricing', con: 'Complex pricing model' },
          { pro: 'Global availability', con: 'Egress costs' }
        ],
        alternatives: ['S3 for AWS', 'ODF for on-prem']
      },
      'gcs': {
        product: 'Google Cloud Storage',
        icon: '🌐',
        why: 'GCP native object storage with excellent network performance',
        bestFor: ['GCP deployments', 'Global distribution', 'Data analytics'],
        tradeoffs: [
          { pro: 'GCP integration', con: 'GCP vendor lock-in' },
          { pro: 'Fast network', con: 'Egress costs' },
          { pro: 'Good for analytics', con: 'Complex for small teams' }
        ],
        alternatives: ['S3 for AWS', 'ODF for on-prem']
      },
      'noobaa': {
        product: 'NooBaa (Multi-Cloud Gateway)',
        icon: '🌍',
        why: 'S3-compatible multi-cloud abstraction layer from ODF',
        bestFor: ['Multi-cloud strategy', 'Cloud migration', 'Avoiding lock-in'],
        tradeoffs: [
          { pro: 'Cloud-agnostic', con: 'Additional abstraction layer' },
          { pro: 'Data mobility', con: 'Complexity' },
          { pro: 'Hybrid cloud support', con: 'Performance overhead' }
        ],
        alternatives: ['S3 for simplicity', 'ODF for full on-prem']
      },
      'odf-hybrid': {
        product: 'ODF with Cloud Tiering',
        icon: '🔄',
        why: 'Primary storage on-prem with cloud tiering for cold data',
        bestFor: ['Hybrid deployments', 'Cost optimization', 'Data gravity on-prem'],
        tradeoffs: [
          { pro: 'Hot data on-prem', con: 'Complex setup' },
          { pro: 'Cold data in cloud', con: 'Retrieval latency' },
          { pro: 'Cost optimized', con: 'Requires both infrastructures' }
        ],
        alternatives: ['Full ODF for simplicity', 'Full S3 for cloud-first']
      },
      's3-hybrid': {
        product: 'S3 with On-Prem Caching',
        icon: '⚡',
        why: 'Primary storage in cloud with on-prem caching for performance',
        bestFor: ['Cloud-first hybrid', 'Low-latency access', 'Burst workloads'],
        tradeoffs: [
          { pro: 'Unlimited cloud scale', con: 'Egress costs' },
          { pro: 'Local cache performance', con: 'Cache management complexity' },
          { pro: 'Flexible', con: 'Requires both systems' }
        ],
        alternatives: ['Full S3 for cloud', 'Full ODF for on-prem']
      }
    }
  },
  batchVsRealtime: {
    title: 'Batch vs Real-time Inference',
    description: 'Choose the right inference pattern for your workload',
    steps: [
      {
        question: 'What is your latency requirement?',
        options: [
          { value: 'real-time', label: 'Real-time (<500ms)', next: 1 },
          { value: 'near-real-time', label: 'Near real-time (1-5 seconds)', next: 2 },
          { value: 'async', label: 'Asynchronous (minutes to hours)', next: 3 }
        ]
      },
      {
        question: 'What is your request volume?',
        condition: { step: 0, value: 'real-time' },
        options: [
          { value: 'low', label: '<100 req/sec', recommendation: 'AI-Inference-Realtime' },
          { value: 'high', label: '>100 req/sec', recommendation: 'AI-Inference-Scale' }
        ]
      },
      {
        question: 'Can you tolerate some queueing?',
        condition: { step: 0, value: 'near-real-time' },
        options: [
          { value: 'yes', label: 'Yes, queueing is acceptable', recommendation: 'AI-Inference-Queue' },
          { value: 'no', label: 'No, need immediate processing', recommendation: 'AI-Inference-Realtime' }
        ]
      },
      {
        question: 'What is your batch size?',
        condition: { step: 0, value: 'async' },
        options: [
          { value: 'large', label: '>10K requests per batch', recommendation: 'Batch-Gateway' },
          { value: 'small', label: '<10K requests', recommendation: 'Either' }
        ]
      }
    ],
    recommendations: {
      'Batch-Gateway': {
        product: 'Red Hat Batch Gateway',
        icon: '📦',
        why: 'Optimized for high-volume asynchronous processing with cost efficiency',
        bestFor: ['Offline processing', 'Large datasets', 'Cost optimization', 'Non-urgent workloads'],
        tradeoffs: [
          { pro: 'Cost-efficient (better GPU utilization)', con: 'No real-time results' },
          { pro: 'Handles 50K+ requests per batch', con: 'Requires async workflow design' },
          { pro: 'OpenAI-compatible API', con: 'Tech Preview status' }
        ],
        alternatives: ['For real-time: AI Inference Server']
      },
      'AI-Inference-Realtime': {
        product: 'Red Hat AI Inference Server',
        icon: '⚡',
        why: 'Low-latency serving with (llm-d) token-aware scheduling',
        bestFor: ['Chatbots', 'Interactive apps', 'Real-time APIs', 'User-facing services'],
        tradeoffs: [
          { pro: 'Sub-200ms TTFT possible', con: 'Higher cost per request' },
          { pro: '(llm-d) KV cache routing', con: 'Requires more GPU resources' }
        ],
        alternatives: ['For batch: Batch Gateway', 'For cost: Batch processing']
      },
      'AI-Inference-Scale': {
        product: 'Red Hat AI Inference Server (scaled)',
        icon: '🚀',
        why: 'High-throughput real-time serving with auto-scaling',
        bestFor: ['High-traffic APIs', 'Production scale', 'SLO requirements'],
        tradeoffs: [
          { pro: 'Handles high request rate', con: 'Higher infrastructure cost' },
          { pro: 'Auto-scaling', con: 'Complex capacity planning' }
        ],
        alternatives: ['For lower volume: Standard AI Inference', 'For batch: Batch Gateway']
      },
      'AI-Inference-Queue': {
        product: 'Red Hat AI Inference Server with queueing',
        icon: '📊',
        why: 'Near real-time with request queuing for cost balance',
        bestFor: ['Some latency tolerance', 'Cost-conscious', 'Bursty traffic'],
        tradeoffs: [
          { pro: 'Lower cost than pure real-time', con: 'Variable latency' },
          { pro: 'Handles bursts', con: 'Not suitable for strict SLOs' }
        ],
        alternatives: ['For strict SLOs: Real-time', 'For batch: Batch Gateway']
      },
      'Either': {
        product: 'Either Batch or Real-time',
        icon: '🔀',
        why: 'Small batch sizes work with either pattern',
        bestFor: ['Flexible requirements', 'Small scale'],
        tradeoffs: [
          { pro: 'Can choose based on other factors', con: 'Need to evaluate cost vs latency' },
          { pro: 'Both options viable', con: 'May need to test both' }
        ],
        alternatives: ['Test both approaches']
      }
    }
  },
  evaluationFramework: {
    title: 'Which Evaluation Framework?',
    description: 'Choose the right evaluation tool for your use case',
    steps: [
      {
        question: 'What are you evaluating?',
        options: [
          { value: 'llm-quality', label: 'LLM quality (MMLU, HellaSwag, etc.)', next: 1 },
          { value: 'performance', label: 'Performance (throughput, latency)', next: 2 },
          { value: 'rag', label: 'RAG pipeline quality', next: 3 },
          { value: 'security', label: 'Security & vulnerabilities', next: 4 }
        ]
      },
      {
        question: 'How many benchmarks do you need?',
        condition: { step: 0, value: 'llm-quality' },
        options: [
          { value: 'comprehensive', label: '100+ standard benchmarks', recommendation: 'lm-eval-harness' },
          { value: 'custom', label: 'Custom evaluation metrics', recommendation: 'lm-eval-custom' }
        ]
      },
      {
        question: 'What performance metrics?',
        condition: { step: 0, value: 'performance' },
        options: [
          { value: 'throughput', label: 'Throughput & token/sec', recommendation: 'GuideLLM' },
          { value: 'both', label: 'Throughput + latency', recommendation: 'GuideLLM' }
        ]
      },
      {
        question: 'What RAG aspects?',
        condition: { step: 0, value: 'rag' },
        options: [
          { value: 'all', label: 'Answer correctness + faithfulness', recommendation: 'RAGAS' },
          { value: 'custom', label: 'Custom RAG metrics', recommendation: 'RAGAS-custom' }
        ]
      },
      {
        question: 'What security concerns?',
        condition: { step: 0, value: 'security' },
        options: [
          { value: 'vulnerabilities', label: 'LLM vulnerabilities & attacks', recommendation: 'Garak' },
          { value: 'robustness', label: 'Robustness testing', recommendation: 'Garak' }
        ]
      }
    ],
    recommendations: {
      'lm-eval-harness': {
        product: 'LM Evaluation Harness (via EvalHub)',
        icon: '📊',
        why: '167+ standard benchmarks including MMLU, HellaSwag, TruthfulQA',
        bestFor: ['Comprehensive quality assessment', 'Standard benchmark comparison', 'Academic research', 'Model releases'],
        tradeoffs: [
          { pro: '167+ pre-configured benchmarks', con: 'Can be slow for large models' },
          { pro: 'Industry-standard metrics', con: 'Less customizable than custom eval' }
        ],
        alternatives: ['For performance: GuideLLM', 'For RAG: RAGAS']
      },
      'lm-eval-custom': {
        product: 'LM Evaluation Harness (custom)',
        icon: '🔧',
        why: 'Create custom evaluation tasks for domain-specific needs',
        bestFor: ['Domain-specific evaluation', 'Custom metrics', 'Specialized benchmarks'],
        tradeoffs: [
          { pro: 'Fully customizable', con: 'Requires task authoring' },
          { pro: 'Domain-specific', con: 'Not comparable to standard benchmarks' }
        ],
        alternatives: ['For standard: lm-eval-harness', 'For RAG: RAGAS']
      },
      'GuideLLM': {
        product: 'GuideLLM (via EvalHub)',
        icon: '🚀',
        why: 'Performance benchmarking for throughput and latency optimization',
        bestFor: ['Performance tuning', 'Capacity planning', 'SLO validation', 'Infrastructure sizing'],
        tradeoffs: [
          { pro: 'Real-world performance metrics', con: 'Not focused on quality' },
          { pro: 'Throughput optimization', con: 'Requires representative workload' }
        ],
        alternatives: ['For quality: lm-eval-harness', 'For RAG: RAGAS']
      },
      'RAGAS': {
        product: 'RAGAS (via EvalHub)',
        icon: '🔍',
        why: 'RAG-specific evaluation: answer correctness, faithfulness, context precision',
        bestFor: ['RAG application quality', 'Retrieval optimization', 'Answer validation', 'AutoRAG tuning'],
        tradeoffs: [
          { pro: 'RAG-specific metrics', con: 'Only for RAG pipelines' },
          { pro: 'Answer correctness + faithfulness', con: 'Requires ground truth data' }
        ],
        alternatives: ['For general: lm-eval-harness', 'For performance: GuideLLM']
      },
      'RAGAS-custom': {
        product: 'RAGAS (custom metrics)',
        icon: '🎯',
        why: 'Custom RAG evaluation metrics for specific use cases',
        bestFor: ['Domain-specific RAG', 'Custom answer validation', 'Specialized retrieval'],
        tradeoffs: [
          { pro: 'Tailored to your RAG pipeline', con: 'Requires metric design' },
          { pro: 'Domain-specific', con: 'Not comparable to standard' }
        ],
        alternatives: ['For standard: RAGAS', 'For general: lm-eval-harness']
      },
      'Garak': {
        product: 'Garak (via EvalHub)',
        icon: '🛡️',
        why: 'LLM vulnerability scanner and robustness testing',
        bestFor: ['Security testing', 'Vulnerability detection', 'Robustness validation', 'Pre-production checks'],
        tradeoffs: [
          { pro: 'Finds security issues', con: 'Can be slow (many attack vectors)' },
          { pro: 'Robustness testing', con: 'Requires security expertise to interpret' }
        ],
        alternatives: ['For quality: lm-eval-harness', 'For performance: GuideLLM']
      }
    }
  },
  trainingApproach: {
    title: 'Which Training Approach?',
    description: 'Choose between InstructLab, Distributed Workloads, or Pipelines',
    steps: [
      {
        question: 'What is your training goal?',
        options: [
          { value: 'fine-tune', label: 'Fine-tune with limited data', next: 1 },
          { value: 'large-scale', label: 'Large-scale multi-node training', next: 2 },
          { value: 'automated', label: 'Automated workflow / MLOps', next: 3 }
        ]
      },
      {
        question: 'Do you have labeled training data?',
        condition: { step: 0, value: 'fine-tune' },
        options: [
          { value: 'no', label: 'No, need synthetic data generation', recommendation: 'InstructLab' },
          { value: 'yes', label: 'Yes, have training dataset', recommendation: 'Either-Fine-Tune' }
        ]
      },
      {
        question: 'How many GPUs/nodes needed?',
        condition: { step: 0, value: 'large-scale' },
        options: [
          { value: 'multi-node', label: 'Multi-node (8+ GPUs)', recommendation: 'Distributed-Workloads' },
          { value: 'single-node', label: 'Single-node (<8 GPUs)', recommendation: 'InstructLab-or-Pipelines' }
        ]
      },
      {
        question: 'Need reproducible workflows?',
        condition: { step: 0, value: 'automated' },
        options: [
          { value: 'yes', label: 'Yes, CI/CD for ML', recommendation: 'Data-Science-Pipelines' },
          { value: 'no', label: 'No, one-off training', recommendation: 'Distributed-Workloads' }
        ]
      }
    ],
    recommendations: {
      'InstructLab': {
        product: 'InstructLab',
        icon: '🧬',
        why: 'LAB-based fine-tuning with synthetic data generation from taxonomy',
        bestFor: ['Limited training data', 'Domain knowledge injection', 'SME-driven improvements', 'Small-to-medium models'],
        tradeoffs: [
          { pro: 'Synthetic data generation', con: 'Not for 70B+ models' },
          { pro: 'Taxonomy-driven approach', con: 'Requires taxonomy creation' },
          { pro: 'Less data labeling needed', con: 'Multi-phase training complexity' }
        ],
        alternatives: ['For scale: Distributed Workloads', 'For automation: Data Science Pipelines']
      },
      'Distributed-Workloads': {
        product: 'RHOAI Distributed Workloads',
        icon: '⚙️',
        why: 'Multi-node distributed training with Ray, PyTorchJob, and Kueue',
        bestFor: ['Large models (70B+)', 'Multi-GPU training', 'Tensor parallelism', 'Data parallelism'],
        tradeoffs: [
          { pro: 'Scales to 100+ GPUs', con: 'More complex infrastructure' },
          { pro: 'Tensor + data parallelism', con: 'Higher cost' },
          { pro: 'Ray and KubeFlow support', con: 'Steeper learning curve' }
        ],
        alternatives: ['For simplicity: InstructLab', 'For automation: Data Science Pipelines']
      },
      'Data-Science-Pipelines': {
        product: 'Data Science Pipelines',
        icon: '🔄',
        why: 'Automated ML workflows with Kubeflow Pipelines',
        bestFor: ['MLOps automation', 'Reproducible training', 'CI/CD for models', 'Team collaboration'],
        tradeoffs: [
          { pro: 'Reproducible pipelines', con: 'Requires pipeline authoring' },
          { pro: 'Experiment tracking', con: 'More overhead than ad-hoc training' },
          { pro: 'Integration with MLflow', con: 'Learning curve for KFP' }
        ],
        alternatives: ['For simplicity: InstructLab', 'For scale: Distributed Workloads']
      },
      'Either-Fine-Tune': {
        product: 'InstructLab or Distributed Workloads',
        icon: '🔀',
        why: 'Both can work with existing datasets - choose based on scale',
        bestFor: ['Flexible requirements', 'Have training data'],
        tradeoffs: [
          { pro: 'Multiple viable options', con: 'Need to evaluate scale needs' },
          { pro: 'Can choose later', con: 'Should test with sample' }
        ],
        alternatives: ['For synthesis: InstructLab', 'For scale: Distributed Workloads']
      },
      'InstructLab-or-Pipelines': {
        product: 'InstructLab or Data Science Pipelines',
        icon: '🔀',
        why: 'Single-node can use either approach',
        bestFor: ['Single-node training', 'Moderate scale'],
        tradeoffs: [
          { pro: 'Both work for single-node', con: 'Choose based on automation needs' },
          { pro: 'Can combine both', con: 'Pipelines add overhead' }
        ],
        alternatives: ['For automation: Pipelines', 'For synthesis: InstructLab']
      }
    }
  },
  servingChoice: {
    title: 'KServe or AI Inference Server?',
    description: 'Choose the right serving platform for your models',
    steps: [
      {
        question: 'What type of models are you serving?',
        options: [
          { value: 'llms-only', label: 'LLMs only (GPT, Llama, Mistral, etc.)', next: 1 },
          { value: 'multi-framework', label: 'Multiple frameworks (TF, PyTorch, ONNX, XGBoost)', next: 2 },
          { value: 'pipelines', label: 'Multi-model pipelines (pre/post-processing)', next: 3 }
        ]
      },
      {
        question: 'Do you need advanced LLM features?',
        condition: { step: 0, value: 'llms-only' },
        options: [
          { value: 'yes', label: 'Yes (token-aware scheduling, KV cache routing, split-phase)', recommendation: 'AI-Inference' },
          { value: 'no', label: 'No, standard serving is fine', recommendation: 'Either-Serving' }
        ]
      },
      {
        question: 'How many different frameworks?',
        condition: { step: 0, value: 'multi-framework' },
        options: [
          { value: 'many', label: '3+ different frameworks', recommendation: 'KServe' },
          { value: 'few', label: '1-2 frameworks', recommendation: 'Either-Serving' }
        ]
      },
      {
        question: 'Need InferenceGraph DAGs?',
        condition: { step: 0, value: 'pipelines' },
        options: [
          { value: 'yes', label: 'Yes, complex pipelines', recommendation: 'KServe' },
          { value: 'no', label: 'No, simple chaining', recommendation: 'Either-Serving' }
        ]
      }
    ],
    recommendations: {
      'AI-Inference': {
        product: 'Red Hat AI Inference Server',
        productId: 'ai-inference',
        icon: '🚀',
        why: 'LLM-optimized serving with (llm-d) token-aware scheduling and KV cache routing',
        bestFor: ['LLM-only workloads', 'Low-latency requirements (<200ms TTFT)', 'GPU optimization', 'SLO-based routing'],
        tradeoffs: [
          { pro: '(llm-d) Token-aware scheduling', con: 'LLM-focused (not multi-framework)' },
          { pro: 'KV cache routing for efficiency', con: 'Newer, less mature than KServe' },
          { pro: 'Split-phase prefill/decode', con: 'More complex setup than standard serving' }
        ],
        alternatives: ['For multi-framework: KServe', 'For pipelines: KServe InferenceGraph']
      },
      'KServe': {
        product: 'KServe (via RHOAI)',
        productId: 'kserve',
        platformRequirement: 'Requires OpenShift',
        icon: '🎯',
        why: 'Multi-framework serving with InferenceGraph support for complex pipelines',
        bestFor: ['Multiple ML frameworks', 'InferenceGraph DAGs', 'TrainedModel multi-model serving', 'Mature production needs'],
        tradeoffs: [
          { pro: 'Multi-framework (TF, PyTorch, ONNX, etc.)', con: 'Less optimized for LLMs than AI Inference' },
          { pro: 'InferenceGraph for pipelines', con: 'More complex for simple LLM serving' },
          { pro: 'Mature, widely adopted', con: 'Lacks advanced LLM-specific optimizations' }
        ],
        alternatives: ['For LLM-only: AI Inference Server', 'For simplicity: AI Inference Server']
      },
      'Either-Serving': {
        product: 'Either KServe or AI Inference',
        icon: '🔀',
        why: 'Both can handle this use case - choose based on other factors',
        bestFor: ['Standard LLM serving', '1-2 frameworks', 'Simple requirements'],
        tradeoffs: [
          { pro: 'Multiple viable options', con: 'Need to evaluate other criteria' },
          { pro: 'Both work', con: 'Should test performance' }
        ],
        alternatives: ['For advanced LLM features: AI Inference', 'For maturity: KServe']
      }
    }
  }
};

export default function DecisionFlowchart({
  selectedCapabilities,
  setSelectedCapabilities,
  onSwitchToArchitecture,
  selectedDecisionGuide,
  setSelectedDecisionGuide
}) {
  const [treeRecommendation, setTreeRecommendation] = useState(null);
  const [applyNotice, setApplyNotice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Use prop for selected decision
  const selectedDecision = selectedDecisionGuide;
  const setSelectedDecision = setSelectedDecisionGuide;

  const getCurrentFlow = () => {
    if (!selectedDecision || !decisionFlows[selectedDecision]) return null;
    return decisionFlows[selectedDecision];
  };

  const getCapabilityName = (capabilityId) => {
    for (const layer of Object.values(capabilities)) {
      const cap = layer.find((c) => c.id === capabilityId);
      if (cap) return cap.name;
    }
    return capabilityId;
  };

  const getOptionName = (capabilityId, optionId) => {
    for (const layer of Object.values(capabilities)) {
      const cap = layer.find((c) => c.id === capabilityId);
      if (cap) {
        const opt = cap.options.find((o) => o.id === optionId);
        if (opt) return opt.name;
      }
    }
    return optionId;
  };

  const generatePreview = () => {
    if (!treeRecommendation) return null;
    const key = treeRecommendation.recommendationKey;
    if (!key) return null;

    const patches = getPatchesForRecommendationKey(key);
    if (!patches || patches.length === 0) return null;

    const merged = { ...selectedCapabilities };
    for (const { capabilityId, optionId } of patches) {
      merged[capabilityId] = optionId;
    }

    const reconciledBefore = reconcileContainerAiPlatform(selectedCapabilities);
    const reconciledAfter = reconcileContainerAiPlatform(merged);

    const changes = [];
    const reconciliationChanges = [];

    for (const { capabilityId, optionId } of patches) {
      const prevOption = selectedCapabilities[capabilityId];
      const capName = getCapabilityName(capabilityId);
      const optName = getOptionName(capabilityId, optionId);

      if (!prevOption) {
        changes.push({ type: 'add', capabilityId, capName, optName });
      } else if (prevOption !== optionId) {
        const prevOptName = getOptionName(capabilityId, prevOption);
        changes.push({ type: 'update', capabilityId, capName, optName, prevOptName });
      }
    }

    for (const capabilityId of Object.keys(reconciledAfter)) {
      const reconciledValue = reconciledAfter[capabilityId];
      const mergedValue = merged[capabilityId];
      const beforeValue = reconciledBefore[capabilityId];

      if (reconciledValue !== mergedValue && reconciledValue !== beforeValue) {
        const capName = getCapabilityName(capabilityId);
        const optName = getOptionName(capabilityId, reconciledValue);
        reconciliationChanges.push({ capabilityId, capName, optName });
      }
    }

    return { changes, reconciliationChanges };
  };

  const addRecommendationToArchitecture = () => {
    if (!treeRecommendation) return;
    const key = treeRecommendation.recommendationKey;
    if (!key) {
      setApplyNotice('This path has no stable workshop mapping yet — capture choices in Build Your Stack.');
      setShowPreview(false);
      return;
    }
    const { next, applied } = mergeDecisionPatches(selectedCapabilities, key);
    if (!applied) {
      setApplyNotice(
        'No blueprint rows are mapped for this card yet. Use Build Your Stack to record the agreed components.'
      );
      setShowPreview(false);
      return;
    }
    setApplyNotice(null);
    setShowPreview(false);
    setSelectedCapabilities(next);
    if (onSwitchToArchitecture) {
      onSwitchToArchitecture();
    }
  };

  const flow = getCurrentFlow();

  return (
    <div data-tab="decisions" className={`rounded-card border ${border.hair} ${surface.raised} ${density.panelPad}`}>
      <h3 className={`${typeScale.groupLabel} ${text.ink} mb-3 flex items-center gap-2`}>
        <GitBranch size={16} className="text-accent" />
        Decision Guides
      </h3>

      {!selectedDecision ? (
        <div className={density.stackGap}>
          {guideGroups.map((group) => {
            return (
              <div key={group.id} className={`border-t ${border.hair} pt-3 first:border-t-0 first:pt-0`}>
                {/* Group Header */}
                <div className="mb-2">
                  <h3 className={`${typeScale.componentName} ${text.ink}`}>
                    {group.title}
                  </h3>
                  <p className={`${typeScale.secondary} ${text.muted} mt-0.5`}>
                    {group.description}
                  </p>
                </div>

                {/* Group Guides */}
                <div className={`grid ${distributingGridCols(group.guides.length)} ${density.rowGap}`}>
                  {group.guides.map((guideKey) => {
                    const flowData = decisionFlows[guideKey];
                    const meta = guideMetadata[guideKey];
                    const Icon = meta.icon;

                    return (
                      <button
                        key={guideKey}
                        onClick={() => {
                          setApplyNotice(null);
                          setSelectedDecision(guideKey);
                        }}
                        className={`${density.sectionPad} text-center rounded-card border ${border.hair} ${surface.tint} hover:border-accent hover:bg-tint ${interactive.transition} ${interactive.focusRing} group`}
                      >
                        <div className="flex flex-col items-center gap-0.5 mb-1">
                          <Icon size={16} className={`${text.muted} group-hover:text-accent ${interactive.transition} flex-shrink-0`} />
                          <div className="min-w-0">
                            <div className={`${typeScale.meta} font-semibold ${text.faint} uppercase tracking-wide mb-0.5`}>
                              {meta.category}
                            </div>
                            <h4 className={`${typeScale.componentName} ${text.ink}`}>
                              {flowData.title}
                            </h4>
                          </div>
                        </div>
                        <p className={`${typeScale.secondary} ${text.muted}`}>
                          {flowData.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <h4 className={`${typeScale.componentName} ${text.ink}`}>{flow.title}</h4>
            <button
              onClick={() => {
                setApplyNotice(null);
                setSelectedDecision('');
                setTreeRecommendation(null);
              }}
              className={`text-sm text-link hover:underline ${interactive.transition} ${interactive.focusRing}`}
            >
              ← Change Decision Type
            </button>
          </div>

          {!treeRecommendation ? (
            /* Decision Tree */
            <DecisionTree
              flow={flow}
              onRecommendation={(rec) => {
                setApplyNotice(null);
                setTreeRecommendation(rec);
              }}
            />
          ) : (
            /* Recommendation */
            <div className={density.stackGap}>
              <div className={`${density.sectionPad} rounded-card border ${border.hair} ${surface.raised}`}>
                {(() => {
                  const catalogStatus = productStatusFromCatalog(treeRecommendation.productId);
                  return (
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-card border ${border.edge} ${surface.tint}`}>
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className={`${typeScale.componentName} ${text.ink}`}>
                        {treeRecommendation.product}
                      </h4>
                      {catalogStatus && (
                        <span className={`${typeScale.meta} font-medium ${productStatus[catalogStatus] ?? text.muted}`}>
                          {catalogStatus}
                        </span>
                      )}
                      {treeRecommendation.platformRequirement && (
                        <span className={`${typeScale.meta} ${text.faint}`}>
                          · {treeRecommendation.platformRequirement}
                        </span>
                      )}
                    </div>
                    {catalogStatus === 'Check with Red Hat' && (
                      <p className={`${typeScale.secondary} ${text.muted} mb-1`}>
                        {HEDGE_LINE}
                      </p>
                    )}
                    <p className={`${typeScale.secondary} ${text.muted} mb-2`}>
                      <strong>Why:</strong> {treeRecommendation.why}
                    </p>
                    {treeRecommendation.bestFor && (
                      <div className="mb-2">
                        <p className={`${typeScale.meta} font-semibold ${text.muted} mb-1`}>Best for:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {treeRecommendation.bestFor.map((item, idx) => (
                            <span key={idx} className={`px-2 py-0.5 ${surface.tint} border ${border.hair} rounded-card ${typeScale.secondary} ${text.muted}`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {treeRecommendation.components && (
                      <div>
                        <p className={`${typeScale.meta} font-semibold ${text.muted} mb-1`}>Key components:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {treeRecommendation.components.map((comp, idx) => (
                            <span key={idx} className={`px-2 py-0.5 ${surface.tint} border ${border.hair} rounded-card ${typeScale.secondary} ${text.ink}`}>
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                  );
                })()}

                {/* Tradeoffs — side by side */}
                {treeRecommendation.tradeoffs && (
                  <div className={`grid md:grid-cols-2 gap-3 mt-3 pt-3 border-t ${border.hair}`}>
                    <div>
                      <h5 className={`font-bold text-green-700 dark:text-green-400 mb-1.5 flex items-center gap-1 ${typeScale.secondary}`}>
                        <CheckCircle size={14} />
                        Advantages
                      </h5>
                      <ul className={`space-y-1 ${typeScale.secondary}`}>
                        {treeRecommendation.tradeoffs.map((t, idx) => (
                          <li key={idx} className={`${text.muted} flex items-start gap-1`}>
                            <span className="text-green-600 flex-shrink-0">✓</span>
                            <span>{t.pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className={`font-bold text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1 ${typeScale.secondary}`}>
                        <XCircle size={14} />
                        Tradeoffs
                      </h5>
                      <ul className={`space-y-1 ${typeScale.secondary}`}>
                        {treeRecommendation.tradeoffs.map((t, idx) => (
                          <li key={idx} className={`${text.muted} flex items-start gap-1`}>
                            <span className="text-amber-600 flex-shrink-0">!</span>
                            <span>{t.con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Alternatives */}
                {treeRecommendation.alternatives && (
                  <div className={`mt-3 pt-3 border-t ${border.hair}`}>
                    <p className={`${typeScale.meta} font-semibold ${text.muted} mb-1.5`}>
                      Alternative options:
                    </p>
                    <ul className={`space-y-1 ${typeScale.secondary} ${text.muted}`}>
                      {treeRecommendation.alternatives.map((alt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRight size={12} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Preview modal */}
              {showPreview && (() => {
                const preview = generatePreview();
                return preview ? (
                  <div className={modal.overlay} onClick={() => setShowPreview(false)}>
                    <div className={`${modal.panel} ${modal.panelMedium}`} onClick={(e) => e.stopPropagation()}>
                      <div className={modal.header}>
                        <h4 className={`${typeScale.componentName} ${text.ink} flex items-center gap-2`}>
                          <Eye size={16} className="text-accent" />
                          Preview Changes to Your Stack
                        </h4>
                      </div>
                      <div className={modal.body}>

                      {preview.changes.length > 0 && (
                        <div className="mb-3">
                          <p className={`${typeScale.secondary} font-semibold ${text.muted} mb-1.5`}>Will apply:</p>
                          <div className="space-y-1.5">
                            {preview.changes.map((change, idx) => (
                              <div key={idx} className={`${density.cardPad} rounded-card border ${border.hair} ${surface.tint}`}>
                                {change.type === 'add' && (
                                  <p className={typeScale.secondary}>
                                    <span className="font-semibold text-green-700 dark:text-green-400">Add:</span>{' '}
                                    <span className="font-bold">{change.capName}</span> → {change.optName}
                                  </p>
                                )}
                                {change.type === 'update' && (
                                  <p className={typeScale.secondary}>
                                    <span className="font-semibold text-accent">Update:</span>{' '}
                                    <span className="font-bold">{change.capName}</span> → {change.optName}{' '}
                                    <span className={text.faint}>(was: {change.prevOptName})</span>
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {preview.reconciliationChanges.length > 0 && (
                        <div className="mb-3">
                          <p className={`${typeScale.secondary} font-semibold ${text.muted} mb-1.5`}>Also updates (compatibility):</p>
                          <div className="space-y-1.5">
                            {preview.reconciliationChanges.map((change, idx) => (
                              <div key={idx} className={`${density.cardPad} rounded-card border ${border.hair} ${surface.tint}`}>
                                <p className={typeScale.secondary}>
                                  <span className="font-bold">{change.capName}</span> → {change.optName}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {preview.changes.length === 0 && preview.reconciliationChanges.length === 0 && (
                        <p className={`${text.muted} mb-3 ${typeScale.secondary}`}>No changes to your current stack.</p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={addRecommendationToArchitecture}
                          className={`flex-1 flex items-center justify-center gap-2 ${button.primary}`}
                        >
                          <Plus size={16} />
                          Confirm & Add to Stack
                        </button>
                        <button
                          onClick={() => setShowPreview(false)}
                          className={button.secondary}
                        >
                          Cancel
                        </button>
                      </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (!treeRecommendation?.recommendationKey) {
                      setApplyNotice('This path has no stable workshop mapping yet — capture choices in Build Your Stack.');
                      return;
                    }
                    const patches = getPatchesForRecommendationKey(treeRecommendation.recommendationKey);
                    if (!patches || patches.length === 0) {
                      setApplyNotice('No blueprint rows are mapped for this card yet. Use Build Your Stack to record the agreed components.');
                      return;
                    }
                    setApplyNotice(null);
                    setShowPreview(true);
                  }}
                  className={`flex items-center gap-1.5 ${button.primary}`}
                >
                  <Eye size={16} />
                  Preview & Add to Stack
                </button>
                <button
                  onClick={() => {
                    setApplyNotice(null);
                    setShowPreview(false);
                    setTreeRecommendation(null);
                  }}
                  className={button.secondary}
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    setApplyNotice(null);
                    setShowPreview(false);
                    setSelectedDecision('');
                    setTreeRecommendation(null);
                  }}
                  className={button.secondary}
                >
                  Try Different Guide
                </button>
              </div>
              {applyNotice && (
                <p className={`${typeScale.secondary} text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-card px-3 py-2`}>
                  {applyNotice}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
