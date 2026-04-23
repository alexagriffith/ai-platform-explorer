import { useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';

export default function AcronymGlossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const glossary = [
    {
      acronym: 'RHOAI',
      fullName: 'Red Hat OpenShift AI',
      explanation: 'The main hybrid cloud platform for building and running AI.',
      whenToUse: 'For enterprise-scale model training and deployment.'
    },
    {
      acronym: 'RHAIE',
      fullName: 'Red Hat AI Enterprise',
      explanation: 'An integrated package of OpenShift and RHOAI.',
      whenToUse: 'When buying a complete, pre-configured AI platform.'
    },
    {
      acronym: 'MCP',
      fullName: 'Model Context Protocol',
      explanation: 'A standard for connecting AI agents to enterprise tools.',
      whenToUse: 'When building agents that need to use external APIs.'
    },
    {
      acronym: 'RAG',
      fullName: 'Retrieval-Augmented Generation',
      explanation: 'Grounding AI in your own data to stop hallucinations.',
      whenToUse: 'When you need accurate answers from your documents.'
    },
    {
      acronym: 'KServe',
      fullName: 'Kubernetes Model Serving',
      explanation: 'The engine that hosts and "serves" the model for apps.',
      whenToUse: 'To provide a model as a production-ready API.'
    },
    {
      acronym: 'vLLM',
      fullName: 'Versatile LLM',
      explanation: 'A specialized high-speed engine for serving large models.',
      whenToUse: 'To maximize GPU performance and lower response times.'
    },
    {
      acronym: 'llm-d',
      fullName: 'LLM Distributed Inference',
      explanation: 'Token-aware scheduling system for intelligent request routing.',
      whenToUse: 'For optimizing GPU utilization with KV cache-aware routing.'
    },
    {
      acronym: 'RBAC',
      fullName: 'Role-Based Access Control',
      explanation: 'Security model that restricts system access based on user roles.',
      whenToUse: 'For managing permissions and access control in multi-tenant environments.'
    },
    {
      acronym: 'OCR',
      fullName: 'Optical Character Recognition',
      explanation: 'Technology to extract text from images and scanned documents.',
      whenToUse: 'When processing PDF scans or image-based documents for RAG.'
    },
    {
      acronym: 'ASR',
      fullName: 'Automatic Speech Recognition',
      explanation: 'Converts audio files to text for processing.',
      whenToUse: 'When ingesting audio data into RAG pipelines.'
    },
    {
      acronym: 'SLO',
      fullName: 'Service Level Objective',
      explanation: 'Target performance metrics like latency or throughput.',
      whenToUse: 'Setting performance requirements for production AI services.'
    },
    {
      acronym: 'ODF',
      fullName: 'OpenShift Data Foundation',
      explanation: 'Software-defined storage providing S3-compatible object storage.',
      whenToUse: 'For storing datasets, models, and artifacts on-premises.'
    },
    {
      acronym: 'RHEL AI',
      fullName: 'Red Hat Enterprise Linux AI',
      explanation: 'Foundation models and serving on individual RHEL servers.',
      whenToUse: 'For single-server deployments and edge AI use cases.'
    },
    {
      acronym: 'LAB',
      fullName: 'Large-scale Alignment for chatBots',
      explanation: 'Multi-phase training method used by InstructLab for model fine-tuning.',
      whenToUse: 'When fine-tuning models with synthetic data and taxonomy-driven approaches.'
    },
    {
      acronym: 'SDG',
      fullName: 'Synthetic Data Generation',
      explanation: 'Automated creation of training data from taxonomy definitions.',
      whenToUse: 'When you have limited human-labeled data but need to fine-tune models.'
    },
    {
      acronym: 'KFP',
      fullName: 'Kubeflow Pipelines',
      explanation: 'Workflow orchestration system for automating ML pipelines.',
      whenToUse: 'For building reproducible, automated ML workflows in OpenShift AI.'
    },
    {
      acronym: 'Ray',
      fullName: 'Ray Distributed Framework',
      explanation: 'Framework for parallelizing compute workloads across clusters.',
      whenToUse: 'For distributed training jobs that span multiple nodes and GPUs.'
    },
    {
      acronym: 'TTFT',
      fullName: 'Time to First Token',
      explanation: 'Latency metric measuring time until the first output token is generated.',
      whenToUse: 'When optimizing real-time inference performance for chatbots.'
    }
  ];

  const filteredGlossary = glossary.filter(item =>
    item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 z-50"
      >
        <BookOpen size={20} />
        <span className="font-medium">Acronym Guide</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen size={28} />
              <h2 className="text-2xl font-bold">Acronym Glossary</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-purple-100">
            Plain English explanations of Red Hat AI terminology
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search acronyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Glossary Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Acronym
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  What It Means
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  When to Use
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGlossary.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {item.acronym}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.fullName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.explanation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.whenToUse}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          {filteredGlossary.length} {filteredGlossary.length === 1 ? 'term' : 'terms'} displayed
        </div>
      </div>
    </div>
  );
}
