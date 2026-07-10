import { ArrowRight, FileText, Image, Mic, Cpu, Zap, Settings } from 'lucide-react';

export default function RAGArchitecture() {
  const pipeline = [
    {
      stage: 'API Gateway',
      icon: Zap,
      color: 'purple',
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
      color: 'blue',
      description: 'Embed the query and fetch relevant document chunks from the vector database',
      details: ['Query embedding', 'Vector similarity search', 'Top-K chunk selection', 'Context assembly into the prompt']
    },
    {
      stage: 'Model Serving',
      icon: Cpu,
      color: 'blue',
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
      color: 'orange',
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

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-600',
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600'
    };
    return colors[color] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* RAG Pipeline Flow */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          RAG Architecture Pipeline
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          API Gateway → Retrieval → Model Serving → Response
        </p>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {pipeline.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <div key={index} className="relative">
                {index < pipeline.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-2 z-10">
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 relative z-20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${getColorClasses(stage.color)} text-white p-2 rounded-lg`}>
                      <Icon size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {stage.stage}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {stage.description}
                  </p>
                  <ul className="space-y-1">
                    {stage.details.map((detail, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1">
                        <span className="text-purple-600">•</span>
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

      {/* Document Processing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Document Processing & Ingestion
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Common source formats a RAG ingestion pipeline needs to handle, and the typical processing technique for each
        </p>

        <div className="grid md:grid-cols-4 gap-3">
          {documentFormats.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <Icon className="text-blue-600" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">
                    {doc.format}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {doc.technique}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RAG Configuration Tuning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-purple-600" size={24} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              RAG Configuration Tuning
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Parameters worth testing systematically to improve retrieval quality
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {autoRAGOptimizations.map((opt, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {opt.name}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {opt.description}
              </p>
              <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                Optimizes: {opt.optimizes}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Goal:</strong> systematically test these parameters against a labeled question set, then deploy the best-scoring configuration
          </p>
        </div>
      </div>
    </div>
  );
}
