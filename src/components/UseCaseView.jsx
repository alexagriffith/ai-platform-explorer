import { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCatalogDisplayName, getCatalogEntry } from '../data/catalogResolve';
import { typeScale, density, badge } from '../lib/styleTokens';
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
      recommendedProducts: ['llama-stack-distribution', 'rhoai', 'ai-gateway', 'openshift'],
      customerProfiles: ['AI Engineers', 'Senior Architects', 'Innovation teams'],
      deploymentPatterns: ['Multi-agent systems', 'Workflow orchestration', 'Tool integration'],
      considerations: [
        'Agent coordination and communication',
        'External tool integration',
        'Error handling and retry logic',
        'Security and access control',
        'Llama Stack provides the agent and tool-calling APIs; Model Context Protocol (MCP) connects agents to external tools — see the MCP ecosystem section below'
      ]
    },
    {
      id: 'rag',
      title: 'Retrieval Augmented Generation (RAG)',
      description: 'Build RAG applications that ground model answers in your own documents',
      recommendedProducts: ['project-navigator', 'rhoai', 'ai-inference', 'gen-ai-studio', 'ai-gateway'],
      customerProfiles: ['Enterprise developers', 'Knowledge management teams', 'Customer support'],
      deploymentPatterns: [
        'Retrieval pipeline: chunking → embedding → top-K tuning',
        'Document processing: PDF, docx, pptx, md, html, text',
        'Vector database integration (Elasticsearch, pgvector, Milvus, others)',
        'Intent-based routing via Project Navigator'
      ],
      considerations: [
        'Choose a chunking strategy (fixed-size, recursive, or semantic splitting) and validate it against your documents',
        'Embedding model selection (Granite, sentence-transformers, etc.)',
        'Top-K retrieval optimization for precision/recall',
        'Vector database choice: Elasticsearch (partner option), PostgreSQL with pgvector (open source), Milvus, or your existing vector database',
        'RAGAS (an open source RAG evaluation framework) for answer correctness and faithfulness',
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
        'Garak runs a large library of attack probes — full scans can take hours',
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
        'Advanced routing (llm-d) with key-value cache (KV cache) awareness',
        'LeaderWorkerSet (a Kubernetes resource for multi-pod model serving) for multi-node coordination',
        'GPU optimization for different phases'
      ],
      considerations: [
        'Prefill is compute-bound (benefits from high-throughput GPUs)',
        'Decode is memory-bound (benefits from high memory bandwidth)',
        'Can use different GPU types for each phase',
        'Advanced scheduler (llm-d) handles key-value (KV) cache routing between phases',
        'Reduces overall GPU costs for large-scale deployments',
        'Requires understanding of LLM inference internals',
        'Best suited to sustained high-volume production workloads where GPU cost dominates',
        'Served through the LLMInferenceService resource in KServe (early-stage API — confirm the current version with your Red Hat team)'
      ]
    },
    {
      id: 'batch-inference',
      title: 'High-Volume Batch Inference',
      description: 'Process large batches of offline inference requests cost-efficiently',
      recommendedProducts: ['batch-gateway', 'ai-inference', 'openshift'],
      customerProfiles: ['Data processing teams', 'Analytics teams', 'Cost-optimization engineers'],
      deploymentPatterns: [
        'OpenAI-compatible batch API (endpoint details subject to change)',
        'JSONL (JSON Lines) file upload for large request batches',
        'Asynchronous processing with priority queue',
        'S3-backed file storage for inputs/outputs'
      ],
      considerations: [
        'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team',
        'Cost-efficient: better GPU utilization than real-time',
        'Large batches per job — confirm current request and file-size limits with your Red Hat team',
        'Asynchronous: results available after minutes/hours',
        'OpenAI-compatible API for easy migration',
        'S3-compatible object storage for batch files',
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


  return (
    <div className="space-y-3">
      {/* Header */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <h2 className={`${typeScale.componentName} text-ink`}>Use Cases</h2>
          <p className={`${typeScale.secondary} text-muted`}>
            Explore common AI use cases and recommended Red Hat solutions for each scenario.
          </p>
        </div>

        {/* Quick Jump */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${typeScale.groupLabel} text-ink`}>Jump:</span>
          {selectedUseCases.length > 0 && (
            <button
              onClick={() => setSelectedUseCases([])}
              className="px-3 py-1 rounded-card bg-tint text-muted text-xs font-medium hover:text-ink transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            >
              Show all
            </button>
          )}
          {useCases.map(useCase => (
            <button
              key={useCase.id}
              onClick={() => toggleUseCase(useCase.id)}
              className={`px-3 py-1 rounded-card text-xs font-medium transition-all duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page ${
                selectedUseCases.includes(useCase.id)
                  ? 'border border-accent text-link bg-tint'
                  : 'bg-tint text-muted hover:text-ink'
              }`}
            >
              {useCase.title}
            </button>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className={density.stackGap}>
        {useCases
          .filter(useCase => selectedUseCases.length === 0 || selectedUseCases.includes(useCase.id))
          .map(useCase => (
          <div
            key={useCase.id}
            data-ui="card"
            ref={(el) => (useCaseRefs.current[useCase.id] = el)}
            className="rounded-card bg-surface overflow-hidden scroll-mt-4"
          >
            <div className="border-b border-hair px-4 py-2 flex flex-col items-center text-center gap-0.5">
              <h3 className={`${typeScale.componentName} text-ink`}>{useCase.title}</h3>
              <span className={`${typeScale.secondary} text-muted`}>{useCase.description}</span>
            </div>

            <div className="px-4 py-2 space-y-2">
              {/* Products + Who rows side-by-side */}
              <div className="grid md:grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <h4 className={`${typeScale.groupLabel} text-muted mb-1 flex items-center gap-1`}>
                    <CheckCircle2 size={11} className="text-green-600" />
                    Recommended Products
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {useCase.recommendedProducts.map(productId => {
                      const entry = getCatalogEntry(productId);
                      const name = entry ? entry.name : getCatalogDisplayName(productId);
                      const statusSuffix =
                        entry && entry.status && entry.status !== 'GA' ? ` — ${entry.status}` : '';
                      return (
                        <span key={productId} className={badge.neutral}>
                          {name}{statusSuffix}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className={`${typeScale.groupLabel} text-muted mb-1`}>Who is this for?</h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {useCase.customerProfiles.map((profile, i) => (
                      <span key={i} className={`${typeScale.secondary} text-muted`}>{profile}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-hair pt-2 grid md:grid-cols-2 gap-4">
                {/* Deployment Patterns */}
                <div>
                  <h4 className={`${typeScale.groupLabel} text-muted mb-1`}>Deployment patterns</h4>
                  <ul className="space-y-0.5">
                    {useCase.deploymentPatterns.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <ArrowRight size={11} className="text-accent mt-0.5 flex-shrink-0" />
                        <span className={`${typeScale.secondary} text-ink`}>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Considerations */}
                <div>
                  <h4 className={`${typeScale.groupLabel} text-muted mb-1`}>Key considerations</h4>
                  <ul className="space-y-0.5">
                    {useCase.considerations.map((consideration, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-accent flex-shrink-0 text-xs mt-0.5">•</span>
                        <span className={`${typeScale.secondary} text-ink`}>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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

      {/* Quick Decision Guide */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2`}>Quick Decision Guide</h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-1">
          <div className="flex items-start gap-1.5">
            <ArrowRight className="text-accent mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>RHEL AI</strong> for individual servers, fine-tuning, and getting started quickly
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <ArrowRight className="text-accent mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>OpenShift AI</strong> for distributed workloads, large teams, and production ML
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <ArrowRight className="text-accent mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>Red Hat AI Enterprise</strong> for the combined OpenShift + OpenShift AI platform path — confirm current packaging with your Red Hat account team
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <ArrowRight className="text-accent mt-0.5 flex-shrink-0" size={12} />
            <p className={`${typeScale.secondary} text-ink`}>
              <strong>AI Inference Server</strong> for high-performance LLM serving with GPU optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
