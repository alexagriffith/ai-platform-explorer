import { ArrowRight, FileText, Image, Mic, Cpu, Zap } from 'lucide-react';

export const ragPipeline = [
  {
    stage: 'API Gateway',
    icon: Zap,
    description: 'Routing, rate-limiting, and authentication',
    details: [
      'Request routing',
      'Rate limiting',
      'Authentication — single sign-on standards (OAuth, OIDC) and mutual TLS certificates (mTLS)',
      'service-level objective (SLO) based priority'
    ]
  },
  {
    stage: 'Retrieval',
    icon: FileText,
    description: 'Embed the query and fetch relevant document chunks from the vector database',
    details: ['Query embedding', 'Vector similarity search', 'Top-K chunk selection', 'Context assembly into the prompt']
  },
  {
    stage: 'Model Serving',
    icon: Cpu,
    description: 'vLLM/KServe inference engine on NVIDIA, AMD, or Intel accelerators',
    details: [
      'vLLM runtime',
      'Advanced routing (llm-d)',
      'key-value cache (KV cache) awareness',
      'Tensor parallelism, PagedAttention, and multi-GPU support'
    ]
  },
  {
    stage: 'Response',
    icon: ArrowRight,
    description: 'Answer generated from the retrieved context',
    details: [
      'Token streaming',
      'Source references when the application surfaces them',
      'Answers constrained to retrieved context (reduces, does not eliminate, unsupported statements)'
    ]
  }
];

export const ragDocumentFormats = [
  { format: 'PDF', icon: FileText, technique: 'optical character recognition (OCR) for scans' },
  { format: 'DOCX', icon: FileText, technique: 'Text extraction' },
  { format: 'PPTX', icon: FileText, technique: 'Slide parsing' },
  { format: 'Markdown', icon: FileText, technique: 'Direct parsing' },
  { format: 'HTML', icon: FileText, technique: 'Markup parsing' },
  { format: 'Plain Text', icon: FileText, technique: 'Direct ingestion' },
  { format: 'Images', icon: Image, technique: 'OCR extraction' },
  { format: 'Audio', icon: Mic, technique: 'automatic speech recognition (ASR) conversion' }
];

export const ragOptimizations = [
  {
    name: 'Chunking Strategy',
    description: 'Tests multiple chunk sizes and overlap strategies',
    optimizes: 'Context window vs. retrieval accuracy'
  },
  {
    name: 'Embedding Models',
    description: 'Compares different embedding models for semantic similarity',
    optimizes: 'Retrieval quality and speed'
  },
  {
    name: 'Top-K Retrieval',
    description: 'Tunes the number of documents retrieved',
    optimizes: 'Precision vs. recall tradeoff'
  },
  {
    name: 'Vector Store Selection',
    description: 'Evaluates different vector database backends',
    optimizes: 'Query latency and scalability'
  }
];
