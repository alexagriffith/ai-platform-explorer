import { Sparkles, Database, Zap } from 'lucide-react';

export const fineTuningApproaches = [
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
