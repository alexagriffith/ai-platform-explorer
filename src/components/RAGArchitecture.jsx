import { ArrowRight, FileText, Image, Mic, Cpu, Zap, Settings } from 'lucide-react';

export default function RAGArchitecture() {
  const pipeline = [
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

  const documentFormats = [
    { format: 'PDF', icon: FileText, technique: 'optical character recognition (OCR) for scans' },
    { format: 'DOCX', icon: FileText, technique: 'Text extraction' },
    { format: 'PPTX', icon: FileText, technique: 'Slide parsing' },
    { format: 'Markdown', icon: FileText, technique: 'Direct parsing' },
    { format: 'HTML', icon: FileText, technique: 'Markup parsing' },
    { format: 'Plain Text', icon: FileText, technique: 'Direct ingestion' },
    { format: 'Images', icon: Image, technique: 'OCR extraction' },
    { format: 'Audio', icon: Mic, technique: 'automatic speech recognition (ASR) conversion' }
  ];

  const autoRAGOptimizations = [
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

  return (
    <div className="space-y-6">
      {/* RAG Pipeline Flow — no border on outer panel, no border on stage cards */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-xl font-bold text-ink mb-1">
          RAG Architecture Pipeline
        </h3>
        <p className="text-muted text-sm mb-5">
          API Gateway → Retrieval → Model Serving → Response
        </p>

        <div className="grid md:grid-cols-4 gap-4">
          {pipeline.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <div key={index} className="relative">
                {index < pipeline.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-2 z-10">
                    <ArrowRight className="text-muted" size={18} />
                  </div>
                )}

                <div className="rounded-card bg-tint p-4 relative z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={15} className="text-muted flex-shrink-0" />
                    <h4 className="font-bold text-ink text-sm">
                      {stage.stage}
                    </h4>
                  </div>
                  <p className="text-xs text-muted mb-2">
                    {stage.description}
                  </p>
                  <ul className="space-y-1">
                    {stage.details.map((detail, i) => (
                      <li key={i} className="text-xs text-ink flex items-start gap-1">
                        <span className="text-accent flex-shrink-0">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Processing — no border on outer, no border on format items */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-xl font-bold text-ink mb-1">
          Document Processing & Ingestion
        </h3>
        <p className="text-muted text-sm mb-4">
          Common source formats a RAG ingestion pipeline needs to handle, and the typical processing technique for each
        </p>

        <div className="grid md:grid-cols-4 gap-3">
          {documentFormats.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 py-2 border-b border-hair last:border-b-0 md:border-b-0 md:py-0"
              >
                <Icon className="text-muted flex-shrink-0" size={15} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ink">
                    {doc.format}
                  </div>
                  <div className="text-xs text-muted">
                    {doc.technique}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RAG Configuration Tuning — no border on outer, grid items use tint, no border */}
      <div className="rounded-card bg-surface px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-muted" size={18} />
          <div>
            <h3 className="text-xl font-bold text-ink">
              RAG Configuration Tuning
            </h3>
            <p className="text-muted text-sm">
              Parameters worth testing systematically to improve retrieval quality
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {autoRAGOptimizations.map((opt, index) => (
            <div
              key={index}
              className="rounded-card bg-tint px-4 py-3"
            >
              <h4 className="font-semibold text-ink mb-1">
                {opt.name}
              </h4>
              <p className="text-sm text-muted mb-1.5">
                {opt.description}
              </p>
              <div className="text-xs text-muted">
                Optimizes: {opt.optimizes}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-hair pt-3">
          <p className="text-sm text-ink">
            <strong>Goal:</strong> systematically test these parameters against a labeled question set, then deploy the best-scoring configuration
          </p>
        </div>
      </div>
    </div>
  );
}
