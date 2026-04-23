import { CheckCircle, XCircle, AlertCircle, Zap, Database, Sparkles } from 'lucide-react';

export default function FineTuningDecisionMatrix() {
  const approaches = [
    {
      name: 'Fine-Tuning',
      icon: Sparkles,
      color: 'purple',
      bestFor: 'Deep model alignment, complex domain-specific terminology, or intricate document structures',
      whenToUse: [
        'Specialized industry jargon or terminology',
        'Complex domain knowledge not in training data',
        'Specific writing style or tone requirements',
        'Intricate reasoning patterns needed'
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
        'Expensive GPU compute costs',
        'Model becomes static until retrained'
      ],
      effort: 'High',
      cost: 'High',
      latency: 'Low (inference)',
      accuracy: 'Excellent'
    },
    {
      name: 'RAG',
      icon: Database,
      color: 'blue',
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
      accuracy: 'Very Good'
    },
    {
      name: 'Pre-trained',
      icon: Zap,
      color: 'green',
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
      accuracy: 'Good'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-600',
        icon: 'bg-purple-600',
        badge: 'bg-purple-600 text-white'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-600',
        icon: 'bg-blue-600',
        badge: 'bg-blue-600 text-white'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-600',
        icon: 'bg-green-600',
        badge: 'bg-green-600 text-white'
      }
    };
    return colors[color];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Fine-Tuning vs. RAG vs. Pre-trained: Decision Matrix
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Choose the right approach for your AI application based on your requirements
      </p>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {approaches.map((approach) => {
          const Icon = approach.icon;
          const colors = getColorClasses(approach.color);

          return (
            <div
              key={approach.name}
              className={`border-2 ${colors.border} rounded-lg overflow-hidden`}
            >
              {/* Header */}
              <div className={`${colors.bg} p-4 border-b-2 ${colors.border}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${colors.icon} text-white p-2 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                  <h4 className={`font-bold text-lg ${colors.text}`}>
                    {approach.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {approach.bestFor}
                </p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* When to Use */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    When to Use
                  </h5>
                  <ul className="space-y-1">
                    {approach.whenToUse.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <AlertCircle size={14} className={colors.text + ' mt-0.5 flex-shrink-0'} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pros */}
                <div>
                  <h5 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-2">
                    Advantages
                  </h5>
                  <ul className="space-y-1">
                    {approach.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h5 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-2">
                    Tradeoffs
                  </h5>
                  <ul className="space-y-1">
                    {approach.cons.slice(0, 3).map((con, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <XCircle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Effort</div>
                    <div className={`text-sm font-semibold ${colors.text}`}>{approach.effort}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Cost</div>
                    <div className={`text-sm font-semibold ${colors.text}`}>{approach.cost}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Latency</div>
                    <div className={`text-sm font-semibold ${colors.text}`}>{approach.latency}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
                    <div className={`text-sm font-semibold ${colors.text}`}>{approach.accuracy}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Helper */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Decision Guide</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Sparkles className="text-purple-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Choose Fine-Tuning</strong> if you need the model to deeply understand complex domain knowledge and can invest in training infrastructure
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Database className="text-blue-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Choose RAG</strong> if your data changes frequently, you need citations, or you want to avoid model training
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="text-green-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Choose Pre-trained</strong> if you need fast deployment for general tasks without specialized knowledge requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
