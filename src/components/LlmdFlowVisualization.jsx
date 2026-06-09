import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Zap } from 'lucide-react';

/**
 * LlmdFlowVisualization
 *
 * Interactive animated flow diagram showing how requests flow through llm-d
 * inference platform with Gateway API, EPP routing, and disaggregated serving.
 *
 * Inspired by Red Hat AI Gateway flow visualizer but built for llm-d architecture.
 */
export default function LlmdFlowVisualization() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
  const [selectedFlow, setSelectedFlow] = useState('cache-hit'); // cache-hit, cache-miss, disaggregated

  // Flow definitions
  const flows = {
    'cache-hit': {
      name: 'Cache Hit Flow (Fast Path)',
      description: 'Request with high prefix cache overlap - routed to pod with cached KV',
      color: 'text-green-600 dark:text-green-400',
      steps: [
        {
          id: 1,
          component: 'User Request',
          action: 'POST /v1/completions',
          detail: 'Prompt: "Summarize the Q4 earnings report..."',
          position: { x: 50, y: 20 }
        },
        {
          id: 2,
          component: 'Gateway API (Istio/Envoy)',
          action: 'Receives request',
          detail: 'HTTP/2 ingress with TLS termination',
          position: { x: 50, y: 120 }
        },
        {
          id: 3,
          component: 'Envoy ext-proc',
          action: 'Calls EPP via gRPC',
          detail: 'External processing hook for routing decision',
          position: { x: 50, y: 220 }
        },
        {
          id: 4,
          component: 'EPP (Endpoint Picker)',
          action: 'Queries KV Cache Index',
          detail: 'Calculates prefix-cache-score for each pod',
          position: { x: 250, y: 220 }
        },
        {
          id: 5,
          component: 'KV Cache Index',
          action: 'Returns cache hit rates',
          detail: 'Pod A: 85% hit, Pod B: 12% hit, Pod C: 8% hit',
          position: { x: 450, y: 220 }
        },
        {
          id: 6,
          component: 'EPP Decision',
          action: 'Selects Pod A (highest hit rate)',
          detail: 'Intelligent routing based on cache overlap',
          position: { x: 250, y: 320 }
        },
        {
          id: 7,
          component: 'vLLM Pod A',
          action: 'Serves with cached KV',
          detail: '85% of prefill skipped - fast TTFT',
          position: { x: 250, y: 420 }
        },
        {
          id: 8,
          component: 'Response',
          action: 'Streaming tokens',
          detail: 'Low latency due to cache hit',
          position: { x: 50, y: 520 }
        }
      ]
    },
    'cache-miss': {
      name: 'Cache Miss Flow (Cold Start)',
      description: 'New prompt with no cache overlap - full prefill required',
      color: 'text-orange-600 dark:text-orange-400',
      steps: [
        {
          id: 1,
          component: 'User Request',
          action: 'POST /v1/completions',
          detail: 'Prompt: "Tell me about quantum computing..."',
          position: { x: 50, y: 20 }
        },
        {
          id: 2,
          component: 'Gateway API (Istio/Envoy)',
          action: 'Receives request',
          detail: 'HTTP/2 ingress with TLS termination',
          position: { x: 50, y: 120 }
        },
        {
          id: 3,
          component: 'Envoy ext-proc',
          action: 'Calls EPP via gRPC',
          detail: 'External processing hook for routing decision',
          position: { x: 50, y: 220 }
        },
        {
          id: 4,
          component: 'EPP (Endpoint Picker)',
          action: 'Queries KV Cache Index',
          detail: 'Calculates prefix-cache-score for each pod',
          position: { x: 250, y: 220 }
        },
        {
          id: 5,
          component: 'KV Cache Index',
          action: 'Returns low hit rates',
          detail: 'Pod A: 5% hit, Pod B: 3% hit, Pod C: 2% hit',
          position: { x: 450, y: 220 }
        },
        {
          id: 6,
          component: 'EPP Decision',
          action: 'Selects least-loaded pod (Pod B)',
          detail: 'Fallback to queue depth when cache doesn\'t help',
          position: { x: 250, y: 320 }
        },
        {
          id: 7,
          component: 'vLLM Pod B',
          action: 'Full prefill required',
          detail: 'No cached KV - compute entire context',
          position: { x: 250, y: 420 }
        },
        {
          id: 8,
          component: 'KV Cache Store',
          action: 'Caches new prefix',
          detail: 'Stores KV for future requests with similar prefix',
          position: { x: 450, y: 420 }
        },
        {
          id: 9,
          component: 'Response',
          action: 'Streaming tokens',
          detail: 'Higher TTFT due to full prefill',
          position: { x: 50, y: 520 }
        }
      ]
    },
    'disaggregated': {
      name: 'Disaggregated Serving (P/D Split)',
      description: 'Static pool configuration with separate prefill and decode phases',
      color: 'text-purple-600 dark:text-purple-400',
      steps: [
        {
          id: 1,
          component: 'User Request',
          action: 'POST /v1/completions',
          detail: 'Long prompt requiring disaggregation',
          position: { x: 50, y: 20 }
        },
        {
          id: 2,
          component: 'Gateway API',
          action: 'Routes to prefill pool',
          detail: 'EPP determines prefill vs decode',
          position: { x: 50, y: 120 }
        },
        {
          id: 3,
          component: 'Prefill Pool (vLLM)',
          action: 'Computes KV cache',
          detail: 'Smaller TP, optimized for compute-bound phase',
          position: { x: 250, y: 220 }
        },
        {
          id: 4,
          component: 'NIXL Transfer',
          action: 'GPU-to-GPU KV transfer',
          detail: 'InfiniBand/RoCE RDMA - wire-speed transfer',
          position: { x: 250, y: 320 }
        },
        {
          id: 5,
          component: 'Decode Pool (vLLM)',
          action: 'Receives KV cache',
          detail: 'Larger TP, optimized for memory-bound phase',
          position: { x: 450, y: 320 }
        },
        {
          id: 6,
          component: 'Token Generation',
          action: 'Autoregressive decode',
          detail: 'Stream tokens using transferred KV',
          position: { x: 450, y: 420 }
        },
        {
          id: 7,
          component: 'Response',
          action: 'Streaming tokens',
          detail: 'Optimized throughput from specialized pools',
          position: { x: 50, y: 520 }
        }
      ]
    }
  };

  const flow = flows[selectedFlow];

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying && currentStep < flow.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, playbackSpeed);
      return () => clearTimeout(timer);
    } else if (currentStep >= flow.steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, playbackSpeed, flow.steps.length]);

  const handlePlay = () => {
    if (currentStep >= flow.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
    setIsPlaying(false);
  };

  const currentStepData = flow.steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="text-purple-600 dark:text-purple-400" size={28} />
          llm-d Request Flow Visualizer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive visualization of how llm-d routes and serves inference requests with
          KV-cache aware routing and disaggregated serving.
        </p>
      </div>

      {/* Flow Selector */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(flows).map(([key, f]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedFlow(key);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFlow === key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Flow Description */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className={`font-medium ${flow.color}`}>
          {flow.description}
        </p>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-8 min-h-[600px] relative overflow-hidden">
        {/* Draw connections between steps */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {flow.steps.slice(0, currentStep + 1).map((step, idx) => {
            if (idx === 0) return null;
            const prevStep = flow.steps[idx - 1];
            return (
              <line
                key={`line-${idx}`}
                x1={prevStep.position.x}
                y1={prevStep.position.y + 30}
                x2={step.position.x}
                y2={step.position.y - 10}
                stroke="currentColor"
                strokeWidth="2"
                className={`${flow.color} opacity-50`}
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>

        {/* Render step nodes */}
        {flow.steps.slice(0, currentStep + 1).map((step, idx) => (
          <div
            key={step.id}
            className={`absolute transition-all duration-500 ${
              idx === currentStep ? 'scale-110 z-10' : 'scale-100 opacity-70'
            }`}
            style={{
              left: `${step.position.x}px`,
              top: `${step.position.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className={`px-4 py-3 rounded-lg shadow-lg border-2 bg-white dark:bg-gray-900 min-w-[200px] ${
                idx === currentStep
                  ? `border-purple-500 dark:border-purple-400 ${flow.color}`
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="font-bold text-sm mb-1">{step.component}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                {step.action}
              </div>
              {idx === currentStep && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                  {step.detail}
                </div>
              )}
            </div>
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
              {step.id}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Step"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(flow.steps.length - 1, currentStep + 1))}
              disabled={currentStep >= flow.steps.length - 1}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Step"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-3 py-1 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
            </select>
          </div>

          {/* Progress */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {flow.steps.length}
          </div>
        </div>

        {/* Step Timeline */}
        <div className="mt-4 flex gap-1">
          {flow.steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              className={`flex-1 h-2 rounded transition-all ${
                idx <= currentStep
                  ? 'bg-purple-600 dark:bg-purple-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              } ${idx === currentStep ? 'h-3' : ''}`}
              title={`Step ${idx + 1}: ${step.component}`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Detail */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Step {currentStep + 1}: {currentStepData.component}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Action:</strong> {currentStepData.action}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Detail:</strong> {currentStepData.detail}
        </p>
      </div>

      {/* Technical Notes */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">EPP Routing</h4>
          <p className="text-sm text-green-800 dark:text-green-200">
            Endpoint Picker queries KV cache index to route requests to pods with highest
            prefix overlap, improving cache hit rate by 3x.
          </p>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-2">Gateway API</h4>
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Extends CNCF Gateway API standard with Envoy ext-proc for intelligent routing
            decisions without vendor-specific CRDs.
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">NIXL Transfer</h4>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            GPU-to-GPU KV cache transfer over InfiniBand/RoCE RDMA for wire-speed
            disaggregated serving between prefill and decode pools.
          </p>
        </div>
      </div>
    </div>
  );
}
