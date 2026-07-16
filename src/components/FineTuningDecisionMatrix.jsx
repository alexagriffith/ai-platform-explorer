import { CheckCircle, XCircle, AlertCircle, Zap, Database, Sparkles } from 'lucide-react';
import { typeScale, density, status } from '../lib/styleTokens';

export default function FineTuningDecisionMatrix() {
  const approaches = [
    {
      name: 'Fine-Tuning',
      icon: Sparkles,
      bestFor: 'Deep model alignment, complex domain-specific terminology, or intricate document structures',
      whenToUse: [
        'Specialized industry jargon or terminology',
        'Complex domain knowledge not in training data',
        'Specific writing style or tone requirements',
        'Parameter-efficient options (LoRA adapters) reduce cost and hardware needs significantly'
      ],
      pros: [
        'Model learns domain-specific patterns',
        'Better long-term performance',
        'No retrieval overhead',
        'Can modify model behavior'
      ],
      cons: [
        'Requires training data and infrastructure',
        'Time-consuming (hours to days)',
        'GPU compute costs (much lower with parameter-efficient methods like LoRA — low-rank adaptation)',
        'Model becomes static until retrained'
      ],
      effort: 'High',
      cost: 'Medium-High (low with LoRA)',
      latency: 'Low (inference)',
      accuracy: 'Excellent (style & domain patterns)'
    },
    {
      name: 'RAG (Retrieval-Augmented Generation)',
      icon: Database,
      bestFor: 'Dynamic, frequently changing information that requires citations',
      whenToUse: [
        'Data changes frequently',
        'Need source attribution/citations',
        'Large knowledge base (100s-1000s of docs)',
        'Multiple data sources to query'
      ],
      pros: [
        'No model training needed',
        'Information stays current',
        'Provides source citations',
        'Easy to add/update documents'
      ],
      cons: [
        'Retrieval quality varies',
        'Added latency for lookup',
        'Requires vector database',
        'Chunking strategy matters'
      ],
      effort: 'Medium',
      cost: 'Medium',
      latency: 'Medium (retrieval)',
      accuracy: 'Excellent (current facts, cited)'
    },
    {
      name: 'Pre-trained',
      icon: Zap,
      bestFor: 'General tasks with low complexity and common knowledge',
      whenToUse: [
        'General-purpose tasks',
        'Low budget/fast deployment',
        'Common knowledge questions',
        'Non-critical applications'
      ],
      pros: [
        'Zero setup time',
        'Lowest cost',
        'Fastest to deploy',
        'No infrastructure needed'
      ],
      cons: [
        'No domain specialization',
        'May hallucinate on specifics',
        'Limited to training cutoff',
        'No custom knowledge'
      ],
      effort: 'Low',
      cost: 'Low',
      latency: 'Low',
      accuracy: 'Good (general knowledge)'
    }
  ];

  return (
    <div className="rounded-card bg-surface px-4 py-3">
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
      <div className="rounded-card bg-tint px-3 py-2">
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
