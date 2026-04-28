# AI Platform Explorer Enhancement Plan

Based on the RHOAI 3.4 architecture documentation, this plan outlines 4 major improvements to the website.

---

## Task 1: Add Missing Products (Batch Gateway, Guardrails, Llama Stack)

### 1.1 Batch Gateway
**Location in capabilities.js**: `services` layer, `core` subLayer, `position: 'adjacent'` (next to model-serving)

**New Capability Entry**:
```javascript
{
  id: 'batch-inference',
  name: 'Batch Inference',
  description: 'Asynchronous batch processing for high-volume offline inference',
  required: false,
  subLayer: 'core',
  position: 'adjacent',
  options: [
    {
      id: 'batch-gateway',
      provider: 'Red Hat',
      name: 'Red Hat Batch Gateway',
      description: 'OpenAI-compatible batch inference API (up to 50K requests per batch)',
      status: 'Tech Preview',
      recommended: true
    },
    {
      id: 'custom-batch',
      provider: 'Customer',
      name: 'Custom Batch Solution',
      description: 'Customer-provided batch inference infrastructure',
      isCustomer: true
    }
  ]
}
```

**Deep Dive Entry** (solutionDetails.js):
```javascript
'batch-gateway': {
  name: 'Red Hat Batch Gateway',
  description: 'OpenAI-compatible batch inference API gateway for processing bulk LLM requests asynchronously',
  architecture: {
    components: [
      { name: 'API Server', role: 'REST API', description: 'OpenAI-compatible /v1/files and /v1/batches endpoints' },
      { name: 'Batch Processor', role: 'Worker Pool', description: 'Polls priority queue and dispatches jobs to inference backends' },
      { name: 'Redis Queue', role: 'Job Queue', description: 'Priority queue for pending batch jobs with tenant isolation' },
      { name: 'S3 Storage', role: 'File Storage', description: 'Stores input JSONL files and output results' }
    ],
    integrations: [
      { name: 'llm-d Gateway', purpose: 'Downstream inference endpoint for batch requests' },
      { name: 'AI Inference Server', purpose: 'Alternative inference backend (OpenAI-compatible)' },
      { name: 'Redis', purpose: 'Job queue, metadata, and event handling' },
      { name: 'S3-compatible storage', purpose: 'Batch file storage (input/output)' }
    ]
  },
  capabilities: [
    'OpenAI-compatible Batch API (/v1/batches)',
    'Files API for JSONL upload/download (/v1/files)',
    'Up to 50,000 requests per batch file (200 MB max)',
    'Asynchronous processing with priority queue',
    'Multi-tenant support via X-MaaS-User header',
    'Configurable worker pool for concurrent processing',
    'Redis or PostgreSQL backend for metadata',
    'S3 or local filesystem for file storage',
    'Retry logic with exponential backoff',
    'mTLS support for inference backend connections',
    'Prometheus metrics and health endpoints'
  ],
  useCases: [
    'High-volume offline inference (e.g., processing 100K+ documents overnight)',
    'Cost-optimized inference (batch requests use resources more efficiently)',
    'Asynchronous workflows where real-time response not needed',
    'Large-scale data processing and analysis',
    'Background tasks requiring LLM inference at scale'
  ],
  documentation: 'https://github.com/red-hat-data-services/batch-gateway',
  contacts: ['#team-llm-d', '#forum-ai-inference']
}
```

### 1.2 FMS Guardrails Orchestrator
**Location in capabilities.js**: `services` layer, `wrapper` subLayer (wraps around serving for safety)

**New Capability Entry**:
```javascript
{
  id: 'content-safety',
  name: 'Content Safety & Guardrails',
  description: 'Content filtering, safety detection, and harmful content prevention',
  required: false,
  subLayer: 'wrapper',
  position: 'wrapper',
  options: [
    {
      id: 'fms-guardrails',
      provider: 'Red Hat',
      name: 'FMS Guardrails Orchestrator',
      description: 'Content safety orchestrator with configurable detectors',
      status: 'Tech Preview',
      recommended: true
    },
    {
      id: 'custom-guardrails',
      provider: 'Customer',
      name: 'Custom Safety Solution',
      description: 'Customer-provided content moderation/safety tools',
      isCustomer: true
    }
  ]
}
```

**Deep Dive Entry**:
```javascript
'fms-guardrails': {
  name: 'FMS Guardrails Orchestrator',
  description: 'REST API middleware coordinating AI text generation with content safety guardrails',
  architecture: {
    components: [
      { name: 'Orchestrator Server', role: 'Middleware', description: 'Routes requests through detector → chunker → LLM pipeline (Rust/Axum)' },
      { name: 'Detector Client', role: 'Safety Analysis', description: 'Connects to HAP and other detector services for content analysis' },
      { name: 'Chunker Client', role: 'Tokenization', description: 'Text segmentation for detector processing (gRPC)' },
      { name: 'Generation Client', role: 'LLM Backend', description: 'Connects to TGIS, caikit-nlp, or OpenAI-compatible APIs' }
    ],
    integrations: [
      { name: 'TGIS / caikit-nlp', purpose: 'Text generation backends (gRPC)' },
      { name: 'vLLM / OpenAI-compatible', purpose: 'Alternative generation backend (HTTP)' },
      { name: 'HAP Detector', purpose: 'Hate, Abuse, Profanity detection service' },
      { name: 'Custom Detectors', purpose: 'Configurable content safety services' },
      { name: 'OpenTelemetry', purpose: 'Distributed tracing and metrics' }
    ]
  },
  capabilities: [
    'Content safety detection (hate, abuse, profanity)',
    'Chat message detection and filtering',
    'Context document safety analysis',
    'Generation-coupled detection (real-time screening)',
    'Streaming and unary request patterns',
    'Configurable score thresholds for blocking',
    'TLS and mTLS support for all connections',
    'OpenTelemetry instrumentation',
    'Multiple API versions (v1, v2)',
    'Standalone detection endpoints (no generation)',
    'Rust-based high-performance middleware'
  ],
  useCases: [
    'Regulated industries requiring content moderation',
    'Customer-facing chatbots needing safety controls',
    'Preventing harmful or toxic outputs from LLMs',
    'Compliance with content safety regulations',
    'Multi-layered safety (input + output detection)',
    'Real-time content filtering for production APIs'
  ],
  documentation: 'https://github.com/red-hat-data-services/fms-guardrails-orchestrator',
  contacts: ['#forum-ai-safety', '#team-fms-guardrails']
}
```

### 1.3 Llama Stack
**Location in capabilities.js**: `services` layer, `orchestration` subLayer (higher-level unified API)

**New Capability Entry**:
```javascript
{
  id: 'llama-stack',
  name: 'Llama Stack Platform',
  description: 'Meta\'s unified API for inference, agents, safety, eval, and vector I/O',
  required: false,
  subLayer: 'orchestration',
  position: 'orchestration',
  options: [
    {
      id: 'llama-stack-distribution',
      provider: 'Red Hat',
      name: 'Llama Stack Distribution',
      description: 'RHOAI-integrated Llama Stack with vLLM, TrustyAI, and RAGAS',
      status: 'Tech Preview',
      recommended: true
    }
  ]
}
```

**Deep Dive Entry**:
```javascript
'llama-stack-distribution': {
  name: 'Llama Stack Distribution',
  description: 'Meta\'s unified AI/ML API server with inference, agents, safety, evaluation, and vector I/O',
  architecture: {
    components: [
      { name: 'Llama Stack Server', role: 'Unified API', description: 'FastAPI server exposing /v1/* endpoints for all capabilities' },
      { name: 'Inference Providers', role: 'LLM Serving', description: 'vLLM (primary), AWS Bedrock, Azure, Vertex AI, WatsonX, OpenAI' },
      { name: 'Vector Providers', role: 'Embeddings', description: 'Milvus, pgvector, Qdrant, FAISS for vector storage' },
      { name: 'Safety Providers', role: 'Guardrails', description: 'TrustyAI FMS integration for content safety' },
      { name: 'Eval Providers', role: 'Evaluation', description: 'LM Eval, RAGAS, Garak for model assessment' },
      { name: 'Agent Runtime', role: 'Orchestration', description: 'Agent creation, session management, and tool use' },
      { name: 'PostgreSQL Backend', role: 'Persistence', description: 'KV store, inference logs, agent state, file metadata' }
    ],
    integrations: [
      { name: 'vLLM', purpose: 'Primary inference and embedding backend' },
      { name: 'TrustyAI FMS', purpose: 'Safety shield evaluation' },
      { name: 'TrustyAI LM Eval', purpose: 'Model evaluation jobs' },
      { name: 'Kubeflow Pipelines', purpose: 'RAGAS and Garak evaluation execution' },
      { name: 'PostgreSQL', purpose: 'Persistent state storage' },
      { name: 'Milvus Lite', purpose: 'Default inline vector store' },
      { name: 'OpenTelemetry', purpose: 'Traces and metrics export' }
    ]
  },
  capabilities: [
    'OpenAI-compatible chat/completions API (/v1/chat/completions)',
    'Inference with multiple backends (vLLM, Bedrock, Azure, etc.)',
    'Agent creation with tool use and session management',
    'Safety shield evaluation (TrustyAI FMS)',
    'Model evaluation (LM Eval, RAGAS, Garak)',
    'Vector database operations (Milvus, pgvector, Qdrant, FAISS)',
    'File upload and management',
    'Dataset I/O operations',
    'Scoring functions (basic, LLM-as-judge, Braintrust)',
    'Batch processing',
    'PostgreSQL-backed persistence',
    'Multi-arch support (x86_64, arm64)',
    'Sentence transformers for inline embeddings',
    'Pre-downloaded Granite embedding model'
  ],
  useCases: [
    'Unified API for all AI/ML capabilities (single endpoint)',
    'Agentic applications with tool use',
    'RAG applications with integrated vector storage',
    'Model evaluation workflows',
    'Safety-first LLM deployments with built-in guardrails',
    'Multi-provider inference (cloud + on-prem)',
    'Developers familiar with Meta\'s Llama Stack ecosystem'
  ],
  documentation: 'https://github.com/red-hat-data-services/llama-stack-distribution',
  contacts: ['#forum-llama-stack', '#team-rhoai-platform']
}
```

---

## Task 2: Enhance Decision Flowcharts

Add 4 new decision flows to `src/components/DecisionFlowchart.jsx`:

### 2.1 Batch vs Real-time Inference
```javascript
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
      ]
    },
    'AI-Inference-Realtime': {
      product: 'Red Hat AI Inference Server',
      icon: '⚡',
      why: 'Low-latency serving with llm-d token-aware scheduling',
      bestFor: ['Chatbots', 'Interactive apps', 'Real-time APIs', 'User-facing services'],
      tradeoffs: [
        { pro: 'Sub-200ms TTFT possible', con: 'Higher cost per request' },
        { pro: 'llm-d KV cache routing', con: 'Requires more GPU resources' }
      ]
    }
  }
}
```

### 2.2 Evaluation Framework Selection
```javascript
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
      ]
    },
    'GuideLLM': {
      product: 'GuideLLM (via EvalHub)',
      icon: '🚀',
      why: 'Performance benchmarking for throughput and latency optimization',
      bestFor: ['Performance tuning', 'Capacity planning', 'SLO validation', 'Infrastructure sizing'],
      tradeoffs: [
        { pro: 'Real-world performance metrics', con: 'Not focused on quality' },
        { pro: 'Throughput optimization', con: 'Requires representative workload' }
      ]
    },
    'RAGAS': {
      product: 'RAGAS (via EvalHub)',
      icon: '🔍',
      why: 'RAG-specific evaluation: answer correctness, faithfulness, context precision',
      bestFor: ['RAG application quality', 'Retrieval optimization', 'Answer validation', 'AutoRAG tuning'],
      tradeoffs: [
        { pro: 'RAG-specific metrics', con: 'Only for RAG pipelines' },
        { pro: 'Answer correctness + faithfulness', con: 'Requires ground truth data' }
      ]
    },
    'Garak': {
      product: 'Garak (via EvalHub)',
      icon: '🛡️',
      why: 'LLM vulnerability scanner and robustness testing',
      bestFor: ['Security testing', 'Vulnerability detection', 'Robustness validation', 'Pre-production checks'],
      tradeoffs: [
        { pro: 'Finds security issues', con: 'Can be slow (many attack vectors)' },
        { pro: 'Robustness testing', con: 'Requires security expertise to interpret' }
      ]
    }
  }
}
```

### 2.3 Training Approach Selection
```javascript
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
      ]
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
      ]
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
      ]
    }
  }
}
```

### 2.4 Serving Choice (KServe vs AI Inference Server)
```javascript
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
        { value: 'yes', label: 'Yes (llm-d, KV cache routing, split-phase)', recommendation: 'AI-Inference' },
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
      icon: '🚀',
      why: 'LLM-optimized serving with llm-d token-aware scheduling and KV cache routing',
      bestFor: ['LLM-only workloads', 'Low-latency requirements (<200ms TTFT)', 'GPU optimization', 'SLO-based routing'],
      tradeoffs: [
        { pro: 'llm-d token-aware scheduling', con: 'LLM-focused (not multi-framework)' },
        { pro: 'KV cache routing for efficiency', con: 'Newer, less mature than KServe' },
        { pro: 'Split-phase prefill/decode', con: 'Requires llm-d understanding' }
      ],
      alternatives: ['For multi-framework: KServe', 'For pipelines: KServe InferenceGraph']
    },
    'KServe': {
      product: 'KServe (via RHOAI)',
      icon: '🎯',
      why: 'Multi-framework serving with InferenceGraph support for complex pipelines',
      bestFor: ['Multiple ML frameworks', 'InferenceGraph DAGs', 'TrainedModel multi-model serving', 'Mature production needs'],
      tradeoffs: [
        { pro: 'Multi-framework (TF, PyTorch, ONNX, etc.)', con: 'Less optimized for LLMs than AI Inference' },
        { pro: 'InferenceGraph for pipelines', con: 'More complex for simple LLM serving' },
        { pro: 'Mature, widely adopted', con: 'Lacks llm-d advanced features' }
      ],
      alternatives: ['For LLM-only: AI Inference Server', 'For simplicity: AI Inference Server']
    }
  }
}
```

---

## Task 3: Add New Use Case Guides

Add 4 new use cases to `src/components/UseCaseView.jsx`:

### 3.1 Security Testing Use Case
```javascript
{
  id: 'security-testing',
  title: 'LLM Security & Vulnerability Testing',
  description: 'Test LLMs for vulnerabilities, attacks, and robustness with Garak',
  recommendedProducts: ['rh-evaluation', 'trustyai', 'fms-guardrails'],
  customerProfiles: ['Security engineers', 'ML security teams', 'Compliance officers'],
  deploymentPatterns: [
    'Pre-production security scanning',
    'Continuous security testing in CI/CD',
    'Robustness validation before release'
  ],
  considerations: [
    'Garak runs 100+ attack vectors (can be slow)',
    'Requires security expertise to interpret results',
    'Should be part of pre-deployment checklist',
    'Combine with guardrails for runtime protection',
    'Test both base models and fine-tuned versions'
  ]
}
```

### 3.2 RAG Optimization (enhanced existing)
Enhance the existing `rag` use case with AutoRAG details:
```javascript
{
  id: 'rag',
  title: 'RAG (Retrieval Augmented Generation) with AutoRAG',
  description: 'Build RAG applications with automated chunking, embedding, and retrieval optimization',
  recommendedProducts: ['project-navigator', 'rhoai', 'ai-inference', 'gen-ai-studio', 'ai-gateway'],
  customerProfiles: ['Enterprise developers', 'Knowledge management teams', 'Customer support'],
  deploymentPatterns: [
    'AutoRAG optimization pipeline: chunking → embedding → top-K tuning',
    'Document processing: PDF, docx, pptx, md, html, text',
    'OCR for images, ASR for audio',
    'Vector database integration (Elastic, pgvector)',
    'Intent-based routing via Project Navigator'
  ],
  considerations: [
    'AutoRAG automates chunking strategy (character, recursive, semantic)',
    'Embedding model selection (Granite, sentence-transformers, etc.)',
    'Top-K retrieval optimization for precision/recall',
    'Document formats: PDF, docx, pptx, md, html, plain text',
    'OCR for image-based text, ASR for audio conversion',
    'Vector DB choice: Elastic (preferred partner), pgvector, others',
    'RAGAS evaluation for answer correctness and faithfulness',
    'Project Navigator for intent-based workflow orchestration'
  ]
}
```

### 3.3 Disaggregated Serving Use Case
```javascript
{
  id: 'disaggregated-serving',
  title: 'Disaggregated LLM Serving (Prefill/Decode Split)',
  description: 'Cost-optimize LLM inference by splitting prefill and decode phases',
  recommendedProducts: ['ai-inference', 'kserve', 'openshift'],
  customerProfiles: ['Cost-conscious teams', 'High-volume inference', 'Infrastructure engineers'],
  deploymentPatterns: [
    'Split prefill (prompt processing) and decode (token generation)',
    'llm-d routing with KV cache awareness',
    'LeaderWorkerSet for multi-node coordination',
    'GPU optimization for different phases'
  ],
  considerations: [
    'Prefill is compute-bound (benefits from high FLOPS GPUs)',
    'Decode is memory-bound (benefits from high memory bandwidth)',
    'Can use different GPU types for each phase',
    'llm-d handles KV cache routing between phases',
    'Reduces overall GPU costs for large-scale deployments',
    'Requires understanding of LLM inference internals',
    'Best for high-volume production workloads (1M+ requests/day)',
    'LLMInferenceService API (v1alpha2) supports this pattern'
  ]
}
```

### 3.4 Batch Inference Use Case
```javascript
{
  id: 'batch-inference',
  title: 'High-Volume Batch Inference',
  description: 'Process large batches of offline inference requests cost-efficiently',
  recommendedProducts: ['batch-gateway', 'ai-inference', 'openshift'],
  customerProfiles: ['Data processing teams', 'Analytics teams', 'Cost-optimization engineers'],
  deploymentPatterns: [
    'OpenAI-compatible Batch API (/v1/batches)',
    'JSONL file upload with 50K+ requests per batch',
    'Asynchronous processing with priority queue',
    'S3-backed file storage for inputs/outputs'
  ],
  considerations: [
    'Cost-efficient: better GPU utilization than real-time',
    'Up to 50,000 requests per batch (200 MB max file size)',
    'Asynchronous: results available after minutes/hours',
    'OpenAI-compatible API for easy migration',
    'Multi-tenant support via X-MaaS-User header',
    'Redis or PostgreSQL for job metadata',
    'S3-compatible storage for batch files',
    'Use cases: document processing, data analysis, offline tasks',
    'Not suitable for real-time or interactive workloads'
  ]
}
```

---

## Task 4: Better Highlight llm-d Features

### 4.1 Update AI Inference Server Deep Dive
Modify the existing `'ai-inference'` entry in `solutionDetails.js`:

**Before** (current structure):
```javascript
'ai-inference': {
  name: 'Red Hat AI Inference Server',
  description: 'High-performance LLM serving optimized for throughput and latency with intelligent routing',
  architecture: {
    components: [
      { name: 'vLLM Runtime', ... },
      { name: 'llm-d', ... },  // Buried as one component among others
      ...
    ]
  }
}
```

**After** (enhanced structure):
```javascript
'ai-inference': {
  name: 'Red Hat AI Inference Server',
  description: 'High-performance LLM serving powered by vLLM and llm-d for advanced token-aware scheduling, KV cache routing, and SLO-based priority',
  
  // NEW: Add llm-d badge/highlight
  badge: {
    text: 'Powered by llm-d',
    color: 'purple',
    description: 'Unique differentiator: token-aware scheduling and KV cache optimization'
  },
  
  architecture: {
    components: [
      // MOVE llm-d to TOP and EXPAND
      { 
        name: 'llm-d (Inference Scheduler)', 
        role: 'Advanced Scheduling', 
        description: 'Token-aware scheduling, KV cache routing, split-phase prefill/decode, SLO-based priority routing (latency vs throughput)'
      },
      { 
        name: 'vLLM Runtime', 
        role: 'Inference Engine', 
        description: 'PagedAttention, continuous batching, multi-GPU support - orchestrated by llm-d'
      },
      { name: 'TGIS', role: 'Text Generation', description: 'Alternative runtime for streaming and batch inference' },
      { name: 'Model Cache', role: 'Performance', description: 'In-memory caching and model preloading' }
    ],
    integrations: [
      { name: 'llm-d Gateway', purpose: 'Semantic routing and intelligent request distribution' },
      { name: 'Model Registry', purpose: 'Model versioning and deployment' },
      { name: 'Prometheus', purpose: 'Performance metrics and SLIs' },
      { name: 'AI Gateway', purpose: 'Authentication, rate limiting, and semantic routing integration' },
      { name: 'GPU Operator', purpose: 'NVIDIA GPU optimization and scheduling' }
    ]
  },
  
  capabilities: [
    // HIGHLIGHT llm-d features at the top
    '🚀 llm-d Token-Aware Scheduling: Intelligent request routing based on token count',
    '🚀 llm-d KV Cache Routing: Maximize GPU utilization with cache-aware scheduling',
    '🚀 llm-d SLO-Based Priority: Latency-sensitive (<200ms TTFT) vs throughput-sensitive routing',
    '🚀 llm-d Split-Phase Inference: Disaggregated prefill/decode for cost optimization',
    'vLLM-based high-performance serving',
    'PagedAttention for memory efficiency',
    'Continuous batching for throughput',
    'Multi-GPU tensor parallelism',
    'Token streaming for real-time responses',
    'Model quantization (INT8, FP16)',
    'Auto-scaling based on load and GPU utilization'
  ],
  
  useCases: [
    'Production LLM inference requiring <200ms TTFT (llm-d latency-sensitive routing)',
    'High-throughput background workloads (llm-d throughput-sensitive routing)',
    'Multi-model serving with intelligent routing (llm-d semantic routing)',
    'Cost-optimized disaggregated serving (llm-d split-phase prefill/decode)',
    'Real-time chatbot applications',
    'Batch processing of text generation'
  ],
  
  // NEW: Add specific llm-d section
  keyFeatures: {
    'llm-d Token-Aware Scheduling': {
      description: 'Routes requests to optimal replicas based on input token count and current load',
      benefit: 'Better load balancing and reduced queuing delays'
    },
    'llm-d KV Cache Routing': {
      description: 'Directs requests to replicas that already have KV cache for the prompt prefix',
      benefit: 'Significantly faster TTFT by reusing cached computations'
    },
    'llm-d SLO-Based Priority': {
      description: 'Separates latency-sensitive (<200ms TTFT) from throughput-sensitive workloads',
      benefit: 'Meet strict SLOs while maximizing overall throughput'
    },
    'llm-d Split-Phase Inference': {
      description: 'Disaggregates prefill (prompt processing) and decode (token generation) phases',
      benefit: 'Use different GPU types for each phase, reducing costs by 30-50%'
    }
  },
  
  documentation: 'https://docs.redhat.com',
  contacts: ['#forum-ai-inference', 'Shumaila Yaseen (SME)', '#team-llm-d']
}
```

### 4.2 Add Visual Badge Support
Consider adding a visual indicator in `DeepDiveModal.jsx` to highlight llm-d:

```javascript
// In DeepDiveModal.jsx header section
{details.badge && (
  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${details.badge.color}-100 dark:bg-${details.badge.color}-900 text-${details.badge.color}-800 dark:text-${details.badge.color}-200`}>
    <span className="font-semibold text-sm">{details.badge.text}</span>
  </div>
)}
```

---

## Implementation Order

1. **Task 4 first** (easiest, immediate impact) - Highlight llm-d features
2. **Task 1** (medium complexity) - Add missing products
3. **Task 2** (complex) - Enhance decision flowcharts  
4. **Task 3** (medium complexity) - Add use case guides

## Testing Checklist

After each task:
- [ ] All capability boxes render correctly
- [ ] "Deep Dive into Technical Details" buttons appear for Red Hat options
- [ ] Modal dialogs open with correct architecture information
- [ ] Decision flowcharts navigate without errors
- [ ] Use case filters work correctly
- [ ] No console errors or warnings
- [ ] Dark mode displays correctly
- [ ] Responsive design works on mobile

## Files Modified Summary

- `src/data/capabilities.js` - Add 3 new capability entries
- `src/data/solutionDetails.js` - Add 4 new deep dives + enhance ai-inference
- `src/components/DecisionFlowchart.jsx` - Add 4 new decision flows
- `src/components/UseCaseView.jsx` - Add 3 new use cases + enhance RAG
- `src/components/DeepDiveModal.jsx` (optional) - Add badge support
