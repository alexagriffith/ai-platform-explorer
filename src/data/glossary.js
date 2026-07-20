/**
 * Acronym glossary — customer-facing plain-language expansions.
 * Rendered by AcronymGlossary; keep content here, not in the component.
 */
export const glossary = [
  {
    acronym: 'RHOAI',
    fullName: 'Red Hat OpenShift AI',
    explanation: 'The main hybrid cloud platform for building and running AI.',
    whenToUse: 'For enterprise-scale model training and deployment.'
  },
  {
    acronym: 'RHAI',
    fullName: 'Red Hat AI',
    explanation: 'In this explorer, Red Hat AI (RHAI) is the path for standard Kubernetes (non-OpenShift) estates — distinct from Red Hat OpenShift AI (RHOAI), which assumes OpenShift.',
    whenToUse: 'When the agreed footprint is EKS, AKS, GKE, or upstream Kubernetes without OpenShift.'
  },
  {
    acronym: 'RHAIE',
    fullName: 'Red Hat AI Enterprise',
    explanation: 'An integrated package of OpenShift and Red Hat OpenShift AI (RHOAI).',
    whenToUse: 'When buying a complete, pre-configured AI platform.'
  },
  {
    acronym: 'MCP',
    fullName: 'Model Context Protocol',
    explanation: 'A standard for connecting AI agents to enterprise tools.',
    whenToUse: 'When building agents that need to use external APIs.'
  },
  {
    acronym: 'RAG',
    fullName: 'Retrieval-Augmented Generation',
    explanation: 'Grounding AI in your own data to reduce hallucinations.',
    whenToUse: 'When you need accurate answers from your documents.'
  },
  {
    acronym: 'KServe',
    fullName: 'KServe (a project name, formerly KFServing — not an acronym)',
    explanation: 'Open source model serving platform for Kubernetes that hosts and "serves" models for apps.',
    whenToUse: 'To provide a model as a production-ready API.'
  },
  {
    acronym: 'vLLM',
    fullName: 'vLLM (not an abbreviation; the "v" refers to virtual-memory-style management of the model\'s key-value cache)',
    explanation: 'An open source, high-throughput inference engine for serving large language models.',
    whenToUse: 'To maximize GPU performance and lower response times.'
  },
  {
    acronym: 'RBAC',
    fullName: 'Role-Based Access Control',
    explanation: 'Security model that restricts system access based on user roles.',
    whenToUse: 'For managing permissions and access control in multi-tenant environments.'
  },
  {
    acronym: 'OCR',
    fullName: 'Optical Character Recognition',
    explanation: 'Technology to extract text from images and scanned documents.',
    whenToUse: 'When processing PDF scans or image-based documents for RAG.'
  },
  {
    acronym: 'ASR',
    fullName: 'Automatic Speech Recognition',
    explanation: 'Converts audio files to text for processing.',
    whenToUse: 'When ingesting audio data into RAG pipelines.'
  },
  {
    acronym: 'SLO',
    fullName: 'Service Level Objective',
    explanation: 'Target performance metrics like latency or throughput.',
    whenToUse: 'Setting performance requirements for production AI services.'
  },
  {
    acronym: 'ODF',
    fullName: 'OpenShift Data Foundation',
    explanation: 'Software-defined storage providing S3-compatible object storage.',
    whenToUse: 'For storing datasets, models, and artifacts on-premises.'
  },
  {
    acronym: 'RHEL AI',
    fullName: 'Red Hat Enterprise Linux AI',
    explanation: 'Foundation models and serving on individual RHEL servers.',
    whenToUse: 'For single-server deployments and edge AI use cases.'
  },
  {
    acronym: 'LAB',
    fullName: 'Large-scale Alignment for chatBots',
    explanation: 'Multi-phase training method used by InstructLab for model fine-tuning.',
    whenToUse: 'When fine-tuning models with synthetic data and taxonomy-driven approaches.'
  },
  {
    acronym: 'SDG',
    fullName: 'Synthetic Data Generation',
    explanation: 'Automated creation of training data from taxonomy definitions.',
    whenToUse: 'When you have limited human-labeled data but need to fine-tune models.'
  },
  {
    acronym: 'KFP',
    fullName: 'Kubeflow Pipelines',
    explanation: 'Workflow orchestration system for automating ML pipelines.',
    whenToUse: 'For building reproducible, automated ML workflows in OpenShift AI.'
  },
  {
    acronym: 'Ray',
    fullName: 'Ray Distributed Framework',
    explanation: 'Framework for parallelizing compute workloads across clusters.',
    whenToUse: 'For distributed training jobs that span multiple nodes and GPUs.'
  },
  {
    acronym: 'TTFT',
    fullName: 'Time to First Token',
    explanation: 'Latency metric measuring time until the first output token is generated.',
    whenToUse: 'When optimizing real-time inference performance for chatbots.'
  },
  {
    acronym: 'BOM',
    fullName: 'Bill of Materials',
    explanation: 'The list of components that ship inside a product — for AI platforms: operators, container images, and their versions per release.',
    whenToUse: 'When clarifying what is actually included in a Red Hat AI product versus what is an add-on.'
  },
  {
    acronym: 'llm-d',
    fullName: 'llm-d (a project name, not an acronym — the "d" stands for distributed)',
    explanation: 'A distributed-inference serving layer that adds key-value cache (KV-cache)-aware routing, prefill/decode disaggregation, and service-level-objective (SLO)-aware autoscaling on top of model servers such as vLLM.',
    whenToUse: 'When the routing story or inference-server bill of materials mentions distributed inference, KV-cache-aware scheduling, or prefill/decode split.'
  }
];
