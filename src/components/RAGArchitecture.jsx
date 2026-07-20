import { ArrowRight, Settings } from 'lucide-react';
import { typeScale, density } from '../lib/styleTokens';
import { ragPipeline, ragDocumentFormats, ragOptimizations } from '../data/ragArchitecture';

export default function RAGArchitecture() {
  const pipeline = ragPipeline;
  const documentFormats = ragDocumentFormats;
  const optimizations = ragOptimizations;

  return (
    <div className={density.stackGap}>
      {/* RAG Pipeline — numbered flow on one surface (no nested boxes); red step-nodes are the accent */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-4">
        <h3 className={`${typeScale.componentName} text-ink`}>Retrieval-augmented generation (RAG) architecture pipeline</h3>
        <p className={`${typeScale.caption} text-muted`}>
          How a query flows from request to a grounded answer
        </p>

        <div className="mt-4 grid gap-x-6 gap-y-4 md:grid-cols-4">
          {pipeline.map((stage, index) => (
            <div key={index} className="relative">
              {index < pipeline.length - 1 && (
                <ArrowRight
                  size={16}
                  className="text-faint hidden md:block absolute top-1 -right-4 z-10"
                  aria-hidden
                />
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full bg-accent text-on-accent shrink-0 ${typeScale.caption} font-bold`}
                >
                  {index + 1}
                </span>
                <h4 className={`${typeScale.componentName} text-ink`}>{stage.stage}</h4>
              </div>
              <p className={`${typeScale.caption} text-muted mb-1.5`}>{stage.description}</p>
              <ul className="space-y-1">
                {stage.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className={`text-muted flex-shrink-0 ${typeScale.caption}`}>•</span>
                    <span className={`${typeScale.caption} text-ink`}>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Document Processing + RAG Config Tuning side-by-side */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Document Processing */}
          <div>
            <h3 className={`${typeScale.componentName} text-ink mb-0.5`}>Document Processing & Ingestion</h3>
            <p className={`${typeScale.caption} text-muted mb-2`}>
              Common source formats a RAG ingestion pipeline needs to handle, and the typical processing technique for each
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {documentFormats.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <div key={index} className="flex items-start gap-1.5">
                    <Icon className="text-muted flex-shrink-0 mt-0.5" size={12} />
                    <div className="min-w-0">
                      <div className={`${typeScale.bodyStrong} text-ink`}>{doc.format}</div>
                      <div className={`${typeScale.caption} text-muted`}>{doc.technique}</div>
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
            <p className={`${typeScale.caption} text-muted mb-2`}>
              Parameters worth testing systematically to improve retrieval quality
            </p>
            <div className={`grid grid-cols-2 ${density.rowGap} mb-2`}>
              {optimizations.map((opt, index) => (
                <div key={index} data-ui="card" className="rounded-card bg-tint px-2 py-1.5">
                  <h4 className={`${typeScale.componentName} text-ink mb-0.5`}>{opt.name}</h4>
                  <p className={`${typeScale.caption} text-muted mb-0.5`}>{opt.description}</p>
                  <div className={`${typeScale.caption} text-faint`}>Optimizes: {opt.optimizes}</div>
                </div>
              ))}
            </div>
            <p className={`${typeScale.caption} text-ink`}>
              <strong>Goal:</strong> systematically test these parameters against a labeled question set, then deploy the best-scoring configuration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
