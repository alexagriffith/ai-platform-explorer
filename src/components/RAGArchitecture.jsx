import { ArrowRight, FileText, Image, Mic, Cpu, Zap, Settings } from 'lucide-react';
import { typeScale, density } from '../lib/styleTokens';

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
    <div className={density.stackGap}>
      {/* RAG Pipeline Flow — no border on outer panel, no border on stage cards */}
      <div className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-0.5`}>RAG Architecture Pipeline</h3>
        <p className={`${typeScale.meta} text-muted mb-2`}>
          API Gateway → Retrieval → Model Serving → Response
        </p>

        <div className={`grid md:grid-cols-4 ${density.rowGap}`}>
          {pipeline.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <div key={index} className="relative">
                {index < pipeline.length - 1 && (
                  <div className="hidden md:block absolute top-6 -right-1.5 z-10">
                    <ArrowRight className="text-muted" size={14} />
                  </div>
                )}

                <div className="rounded-card bg-tint px-2 py-1.5 relative z-20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={13} className="text-muted flex-shrink-0" />
                    <h4 className={`${typeScale.secondary} font-bold text-ink`}>{stage.stage}</h4>
                  </div>
                  <p className={`${typeScale.meta} text-muted mb-1`}>{stage.description}</p>
                  <ul className="space-y-0.5">
                    {stage.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-accent flex-shrink-0 text-xs">•</span>
                        <span className={`${typeScale.meta} text-ink`}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Processing + RAG Config Tuning side-by-side */}
      <div className="rounded-card bg-surface px-4 py-3">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Document Processing */}
          <div>
            <h3 className={`${typeScale.componentName} text-ink mb-0.5`}>Document Processing & Ingestion</h3>
            <p className={`${typeScale.meta} text-muted mb-2`}>
              Common source formats a RAG ingestion pipeline needs to handle, and the typical processing technique for each
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {documentFormats.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <div key={index} className="flex items-start gap-1.5">
                    <Icon className="text-muted flex-shrink-0 mt-0.5" size={12} />
                    <div className="min-w-0">
                      <div className={`${typeScale.secondary} font-semibold text-ink`}>{doc.format}</div>
                      <div className={`${typeScale.meta} text-muted`}>{doc.technique}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RAG Configuration Tuning */}
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Settings className="text-muted" size={13} />
              <h3 className={`${typeScale.componentName} text-ink`}>RAG Configuration Tuning</h3>
            </div>
            <p className={`${typeScale.meta} text-muted mb-2`}>
              Parameters worth testing systematically to improve retrieval quality
            </p>
            <div className={`grid grid-cols-2 ${density.rowGap} mb-2`}>
              {autoRAGOptimizations.map((opt, index) => (
                <div key={index} className="rounded-card bg-tint px-2 py-1.5">
                  <h4 className={`${typeScale.secondary} font-semibold text-ink mb-0.5`}>{opt.name}</h4>
                  <p className={`${typeScale.meta} text-muted mb-0.5`}>{opt.description}</p>
                  <div className={`${typeScale.meta} text-faint`}>Optimizes: {opt.optimizes}</div>
                </div>
              ))}
            </div>
            <p className={`${typeScale.meta} text-ink`}>
              <strong>Goal:</strong> systematically test these parameters against a labeled question set, then deploy the best-scoring configuration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
