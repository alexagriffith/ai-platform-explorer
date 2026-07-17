import { CheckCircle, XCircle, AlertCircle, Zap, Database, Sparkles } from 'lucide-react';
import { typeScale, density, status } from '../lib/styleTokens';
import { fineTuningApproaches } from '../data/fineTuningApproaches';

export default function FineTuningDecisionMatrix() {
  const approaches = fineTuningApproaches;

  return (
    <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
      <h3 className={`${typeScale.componentName} text-ink mb-0.5`}>
        Fine-Tuning vs. Retrieval-Augmented Generation (RAG) vs. Pre-trained: Decision Matrix
      </h3>
      <p className={`${typeScale.secondary} text-muted mb-3`}>
        Choose the right approach for your AI application based on your requirements
      </p>

      {/* Comparison Grid — no borders on cards, tint background only */}
      <div className={`grid md:grid-cols-3 ${density.rowGap} mb-3`}>
        {approaches.map((approach) => {
          const Icon = approach.icon;

          return (
            <div
              key={approach.name}
              data-ui="card"
              className="rounded-card bg-tint overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-hair px-3 py-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon size={14} className="text-muted" />
                  <h4 className={`${typeScale.componentName} text-ink`}>{approach.name}</h4>
                </div>
                <p className={`${typeScale.meta} text-muted`}>{approach.bestFor}</p>
              </div>

              {/* Content */}
              <div className="px-3 py-2 space-y-2">
                {/* When to Use */}
                <div>
                  <h5 className={`${typeScale.groupLabel} text-faint mb-1`}>When to Use</h5>
                  <ul className="space-y-0.5">
                    {approach.whenToUse.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertCircle size={11} className="text-muted mt-0.5 flex-shrink-0" />
                        <span className={`${typeScale.secondary} text-ink`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pros */}
                <div>
                  <h5 className={`${typeScale.groupLabel} text-green-600 mb-1`}>Advantages</h5>
                  <ul className="space-y-0.5">
                    {approach.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle size={11} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span className={`${typeScale.secondary} text-ink`}>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h5 className={`${typeScale.groupLabel} ${status.attention.text} mb-1`}>Tradeoffs</h5>
                  <ul className="space-y-0.5">
                    {approach.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <XCircle size={11} className={`${status.attention.text} mt-0.5 flex-shrink-0`} />
                        <span className={`${typeScale.secondary} text-ink`}>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-hair">
                  <div>
                    <div className={`${typeScale.meta} text-faint`}>Effort</div>
                    <div className={`${typeScale.secondary} font-semibold text-ink`}>{approach.effort}</div>
                  </div>
                  <div>
                    <div className={`${typeScale.meta} text-faint`}>Cost</div>
                    <div className={`${typeScale.secondary} font-semibold text-ink`}>{approach.cost}</div>
                  </div>
                  <div>
                    <div className={`${typeScale.meta} text-faint`}>Latency</div>
                    <div className={`${typeScale.secondary} font-semibold text-ink`}>{approach.latency}</div>
                  </div>
                  <div>
                    <div className={`${typeScale.meta} text-faint`}>Domain fit</div>
                    <div className={`${typeScale.secondary} font-semibold text-ink`}>{approach.accuracy}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Helper — tint background, no border */}
      <div data-ui="card" className="rounded-card bg-tint px-3 py-2">
        <h4 className={`${typeScale.secondary} font-semibold text-ink mb-1`}>Which approach fits?</h4>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="flex items-start gap-1.5">
            <Sparkles className="text-muted mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>Choose Fine-Tuning</strong> if you need the model to deeply understand complex domain knowledge and can invest in training infrastructure
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <Database className="text-muted mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>Choose RAG</strong> if your data changes frequently, you need citations, or you want to avoid model training
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <Zap className="text-muted mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>Choose Pre-trained</strong> if you need fast deployment for general tasks without specialized knowledge requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
