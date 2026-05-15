import { useState, useRef } from 'react';
import { Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCatalogDisplayName } from '../data/catalogResolve';
import MCPEcosystemFull from './MCPEcosystemFull';
import FineTuningDecisionMatrix from './FineTuningDecisionMatrix';
import RAGArchitecture from './RAGArchitecture';
import SecurityOverview from './SecurityOverview';
import TrainingDeepDive from './TrainingDeepDive';

export default function UseCaseView() {
  const [selectedUseCases, setSelectedUseCases] = useState([]);
  const useCaseRefs = useRef({});
  const useCases = [
    {
      id: 'inference',
      title: 'Model Inference & Serving',
      description: 'Deploy and serve AI models at scale with high performance',
      recommendedProducts: ['rhoai', 'ai-inference', 'ai-gateway', 'openshift'],
      customerProfiles: ['Platform engineers', 'MLOps teams', 'Infrastructure teams'],
      deploymentPatterns: ['High-throughput API serving', 'Multi-model deployment', 'A/B testing'],
      considerations: [
        'GPU availability and optimization',
        'Auto-scaling based on load',
        'API gateway for rate limiting and auth',
        'Model versioning strategy'
      ]
    },
    {
      id: 'training',
      title: 'Model Training & Fine-tuning',
      description: 'Build, experiment, and fine-tune AI models',
      recommendedProducts: ['rhoai', 'rhel-ai', 'model-registry', 'openshift'],
      customerProfiles: ['Data scientists', 'ML engineers', 'Research teams'],
      deploymentPatterns: ['Distributed training', 'Hyperparameter tuning', 'Experiment tracking'],
      considerations: [
        'Compute requirements (GPU/CPU)',
        'Data storage and versioning',
        'Experiment tracking and reproducibility',
        'Model registry for versioning'
      ]
    },
    {
      id: 'full-stack',
      title: 'Full ML Lifecycle',
      description: 'End-to-end ML platform from experimentation to production',
      recommendedProducts: ['rhaie', 'rhoai', 'ai-inference', 'model-registry', 'trustyai', 'gen-ai-studio', 'openshift'],
      customerProfiles: ['Enterprise ML teams', 'AI Centers of Excellence', 'Large organizations'],
      deploymentPatterns: ['Hybrid cloud', 'Multi-cluster', 'GitOps workflows'],
      considerations: [
        'Team collaboration and governance',
        'CI/CD for ML models',
        'Monitoring and observability',
        'Cost optimization across environments'
      ]
    },
    {
      id: 'experimentation',
      title: 'Experimentation & POCs',
      description: 'Quick start for AI experimentation and proof of concepts',
      recommendedProducts: ['rhel-ai', 'gen-ai-studio'],
      customerProfiles: ['Developers', 'Small teams', 'Startups'],
      deploymentPatterns: ['Single server', 'Local development', 'Rapid prototyping'],
      considerations: [
        'Easy setup and onboarding',
        'Cost-effective starting point',
        'Path to production scaling',
        'Learning curve and documentation'
      ]
    },
    {
      id: 'agentic',
      title: 'Agentic AI & Orchestration',
      description: 'Build autonomous agents and complex AI workflows',
      recommendedProducts: ['project-navigator', 'rhoai', 'ai-gateway', 'openshift'],
      customerProfiles: ['AI Engineers', 'Senior Architects', 'Innovation teams'],
      deploymentPatterns: ['Multi-agent systems', 'Workflow orchestration', 'Tool integration'],
      considerations: [
        'Agent coordination and communication',
        'External tool integration',
        'Error handling and retry logic',
        'Security and access control'
      ]
    },
    {
      id: 'rag',
      title: 'RAG (Retrieval Augmented Generation) with AutoRAG',
      description: 'Build RAG applications with automated chunking, embedding, and retrieval optimization',
      recommendedProducts: ['project-navigator', 'rhoai', 'ai-inference', 'gen-ai-studio', 'ai-gateway'],
      customerProfiles: ['Enterprise developers', 'Knowledge management teams', 'Customer support'],
      deploymentPatterns: [
        'AutoRAG optimization pipeline: chunking → embedding → top-K tuning',
        'Document processing: PDF, docx, pptx, md, html, text',
        'OCR for images, ASR for audio',
        'Vector database integration (Elastic, pgvector)',
        'Intent-based routing via Project Navigator'
      ],
      considerations: [
        'AutoRAG automates chunking strategy (character, recursive, semantic)',
        'Embedding model selection (Granite, sentence-transformers, etc.)',
        'Top-K retrieval optimization for precision/recall',
        'Document formats: PDF, docx, pptx, md, html, plain text',
        'OCR for image-based text, ASR for audio conversion',
        'Vector DB choice: Elastic (preferred partner), pgvector, others',
        'RAGAS evaluation for answer correctness and faithfulness',
        'Project Navigator for intent-based workflow orchestration'
      ]
    },
    {
      id: 'security-testing',
      title: 'LLM Security & Vulnerability Testing',
      description: 'Test LLMs for vulnerabilities, attacks, and robustness with Garak',
      recommendedProducts: ['rh-evaluation', 'trustyai', 'fms-guardrails'],
      customerProfiles: ['Security engineers', 'ML security teams', 'Compliance officers'],
      deploymentPatterns: [
        'Pre-production security scanning',
        'Continuous security testing in CI/CD',
        'Robustness validation before release'
      ],
      considerations: [
        'Garak runs 100+ attack vectors (can be slow)',
        'Requires security expertise to interpret results',
        'Should be part of pre-deployment checklist',
        'Combine with guardrails for runtime protection',
        'Test both base models and fine-tuned versions',
        'Jailbreak attempt detection',
        'Prompt injection vulnerability scanning',
        'Toxic output prevention validation'
      ]
    },
    {
      id: 'disaggregated-serving',
      title: 'Disaggregated LLM Serving (Prefill/Decode Split)',
      description: 'Cost-optimize LLM inference by splitting prefill and decode phases',
      recommendedProducts: ['ai-inference', 'kserve', 'openshift'],
      customerProfiles: ['Cost-conscious teams', 'High-volume inference', 'Infrastructure engineers'],
      deploymentPatterns: [
        'Split prefill (prompt processing) and decode (token generation)',
        'Advanced routing (llm-d) with KV cache awareness',
        'LeaderWorkerSet for multi-node coordination',
        'GPU optimization for different phases'
      ],
      considerations: [
        'Prefill is compute-bound (benefits from high FLOPS GPUs)',
        'Decode is memory-bound (benefits from high memory bandwidth)',
        'Can use different GPU types for each phase',
        'Advanced scheduler (llm-d) handles KV cache routing between phases',
        'Reduces overall GPU costs for large-scale deployments',
        'Requires understanding of LLM inference internals',
        'Best for high-volume production workloads (1M+ requests/day)',
        'LLMInferenceService API (v1alpha2) supports this pattern'
      ]
    },
    {
      id: 'batch-inference',
      title: 'High-Volume Batch Inference',
      description: 'Process large batches of offline inference requests cost-efficiently',
      recommendedProducts: ['batch-gateway', 'ai-inference', 'openshift'],
      customerProfiles: ['Data processing teams', 'Analytics teams', 'Cost-optimization engineers'],
      deploymentPatterns: [
        'OpenAI-compatible Batch API (/v1/batches)',
        'JSONL file upload with 50K+ requests per batch',
        'Asynchronous processing with priority queue',
        'S3-backed file storage for inputs/outputs'
      ],
      considerations: [
        'Cost-efficient: better GPU utilization than real-time',
        'Up to 50,000 requests per batch (200 MB max file size)',
        'Asynchronous: results available after minutes/hours',
        'OpenAI-compatible API for easy migration',
        'Multi-tenant support via X-MaaS-User header',
        'Redis or PostgreSQL for job metadata',
        'S3-compatible storage for batch files',
        'Use cases: document processing, data analysis, offline tasks',
        'Not suitable for real-time or interactive workloads'
      ]
    }
  ];

  const scrollToUseCase = (useCaseId) => {
    useCaseRefs.current[useCaseId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleUseCase = (useCaseId) => {
    setSelectedUseCases(prev => {
      if (prev.includes(useCaseId)) {
        return prev.filter(id => id !== useCaseId);
      } else {
        return [...prev, useCaseId];
      }
    });
    scrollToUseCase(useCaseId);
  };

  const selectAllUseCases = () => {
    setSelectedUseCases(useCases.map(uc => uc.id));
  };

  const clearUseCases = () => {
    setSelectedUseCases([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Use Cases
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Explore common AI use cases and recommended Red Hat solutions for each scenario.
        </p>

        {/* Quick Jump to Use Case */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Quick Jump:
            </span>
            <button
              onClick={selectAllUseCases}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearUseCases}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {useCases.map(useCase => (
              <button
                key={useCase.id}
                onClick={() => toggleUseCase(useCase.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedUseCases.includes(useCase.id)
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {useCase.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        {useCases
          .filter(useCase => selectedUseCases.length === 0 || selectedUseCases.includes(useCase.id))
          .map(useCase => (
          <div
            key={useCase.id}
            ref={(el) => (useCaseRefs.current[useCase.id] = el)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow scroll-mt-4"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-white mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {useCase.title}
                  </h3>
                  <p className="text-purple-100">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Recommended Products */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Recommended Products
                </h4>
                <div className="flex flex-wrap gap-2">
                  {useCase.recommendedProducts.map(productId => (
                    <span
                      key={productId}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-sm font-medium"
                    >
                      {getCatalogDisplayName(productId)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Profiles */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  WHO IS THIS FOR?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {useCase.customerProfiles.map((profile, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm"
                    >
                      {profile}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deployment Patterns */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  DEPLOYMENT PATTERNS
                </h4>
                <div className="grid md:grid-cols-3 gap-2">
                  {useCase.deploymentPatterns.map((pattern, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <ArrowRight size={14} className="text-purple-600" />
                      <span>{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Considerations */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  KEY CONSIDERATIONS
                </h4>
                <ul className="space-y-1">
                  {useCase.considerations.map((consideration, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fine-Tuning Decision Matrix */}
      <FineTuningDecisionMatrix />

      {/* Training Deep Dive */}
      <TrainingDeepDive />

      {/* RAG Architecture */}
      <RAGArchitecture />

      {/* MCP Ecosystem */}
      <MCPEcosystemFull />

      {/* Security Overview */}
      <SecurityOverview />

      {/* When to Use What */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Decision Guide
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <ArrowRight className="text-purple-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>RHEL AI</strong> for individual servers, fine-tuning, and getting started quickly
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="text-purple-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>OpenShift AI</strong> for distributed workloads, large teams, and production ML
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="text-purple-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Red Hat AI Enterprise</strong> for complete platform with simplified procurement
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="text-purple-600 mt-0.5" size={16} />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>AI Inference Server</strong> for high-performance LLM serving with GPU optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
