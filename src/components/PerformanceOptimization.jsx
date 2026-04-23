import { Zap, Layers, Cpu, BarChart3, CheckCircle, ArrowRight, Info } from 'lucide-react';

export default function PerformanceOptimization() {
  const vllmFeatures = [
    {
      name: 'PagedAttention',
      description: 'Manages KV cache by partitioning into non-contiguous memory blocks',
      benefit: '2.17x to 2.82x reduction in GPU memory usage',
      icon: Layers
    },
    {
      name: 'Continuous Batching',
      description: 'Dynamically schedules requests into same forward pass as they arrive',
      benefit: '2.45x to 3.60x throughput improvement',
      icon: BarChart3
    },
    {
      name: 'Tensor Parallelism',
      description: 'Shards large models across multiple GPUs within a single node',
      benefit: 'Enables serving 70B+ parameter models',
      icon: Cpu
    }
  ];

  const llmdCapabilities = [
    {
      capability: 'Token-Aware Scheduling',
      description: 'Routes requests based on actual token counts and available resources',
      impact: 'Prevents queue head-of-line blocking'
    },
    {
      capability: 'KV Cache-Aware Routing',
      description: 'Directs requests to nodes with pre-existing cached context',
      impact: 'Reduces Time-to-First-Token (TTFT) significantly'
    },
    {
      capability: 'Split-Phase Inference',
      description: 'Separates Prefill (context processing) and Decode (token generation)',
      impact: 'Allows independent scaling on different hardware'
    },
    {
      capability: 'SLO-Based Priority',
      description: 'Prioritizes latency-sensitive workloads over throughput-sensitive',
      impact: 'Ensures <200ms TTFT for real-time applications'
    }
  ];

  const decisionMatrix = [
    {
      useCase: 'Single GPU / Single Node',
      tech: 'vLLM',
      why: 'Best-in-class memory efficiency via PagedAttention'
    },
    {
      useCase: 'Multi-Node Cluster',
      tech: 'llm-d',
      why: 'Orchestrates across nodes with cache-aware routing'
    },
    {
      useCase: 'Latency-Critical (Chat)',
      tech: 'vLLM + llm-d',
      why: 'Combines fast serving with priority-based scheduling'
    },
    {
      useCase: 'Non-LLM Models',
      tech: 'OpenVINO / Triton',
      why: 'Optimized for diverse frameworks like PyTorch or ONNX'
    }
  ];

  const vramRequirements = [
    {
      modelSize: '7B - 13B',
      vram: '24GB',
      example: 'NVIDIA A10G',
      notes: 'Single GPU sufficient with PagedAttention'
    },
    {
      modelSize: '30B - 40B',
      vram: '40-80GB',
      example: 'NVIDIA A100',
      notes: 'Single high-memory GPU or 2x A10G with tensor parallelism'
    },
    {
      modelSize: '70B+',
      vram: '80GB+',
      example: 'NVIDIA H100 or multi-A100',
      notes: 'Requires multi-GPU tensor parallelism'
    },
    {
      modelSize: 'Quantized (INT8/FP8)',
      vram: '~50% reduction',
      example: 'Via LLM Compressor',
      notes: 'Maintains accuracy while doubling throughput'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Performance & Optimization
        </h2>
        <p className="text-blue-100">
          Deep dive into vLLM and llm-d for high-performance inference
        </p>
      </div>

      {/* vLLM Engine */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-blue-600" size={28} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              vLLM (Versatile LLM) Engine
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              High-throughput, low-latency serving engine natively embedded in RHOAI
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {vllmFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Icon size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {feature.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {feature.description}
                </p>
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  ⚡ {feature.benefit}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">When to Use vLLM</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Best for models <strong>7B and larger</strong> (e.g., Llama 3, Mistral) where GPU memory and throughput are critical bottlenecks. Typically preferred over TGIS for standard LLMs due to advanced memory management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* llm-d Orchestration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="text-purple-600" size={28} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              llm-d (LLM Distributed Inference)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Orchestration layer for multi-node, multi-GPU environments
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {llmdCapabilities.map((cap, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
            >
              <ArrowRight className="text-purple-600 mt-0.5 flex-shrink-0" size={18} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {cap.capability}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {cap.description}
                </p>
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Impact: {cap.impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Integration Points</h4>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>AI Gateway:</strong> Global request management and routing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>vLLM Runtime:</strong> Works as orchestration layer on top of vLLM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>NVIDIA GPU Operator:</strong> Coordinates resource allocation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* KV Cache Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          KV Cache Management
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">What is KV Cache?</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              A memory buffer that stores previously computed "Keys" and "Values" during token generation,
              preventing redundant calculations for every new word.
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>Without KV Cache:</strong> Recompute all previous tokens → Slow</p>
              <p><strong>With KV Cache:</strong> Reuse cached computations → Fast</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Cache-Aware Routing</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Routing requests to nodes with pre-existing cache hits significantly reduces Time-to-First-Token (TTFT).
            </p>
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700">
              <p className="text-xs font-medium text-cyan-800 dark:text-cyan-200">
                <strong>Optimization:</strong> RHOAI supports shared KV Cache and KV Cache offloading (to CPU memory or storage) via LMCache for massive context windows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Decision Matrix: When to Use What
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Use Case</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Recommended Tech</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Why?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {decisionMatrix.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.useCase}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                      {row.tech}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VRAM Requirements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Cpu className="text-blue-600" size={20} />
          VRAM Requirements for vLLM
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Model Size</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">VRAM Needed</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Example GPU</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {vramRequirements.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{req.modelSize}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{req.vram}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{req.example}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{req.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-2">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Resources & Contacts</h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p><strong>SMEs:</strong> Shumaila Yaseen (vLLM/Inference Docs), Naina Singh (llm-d Feature Owner)</p>
              <p><strong>Slack:</strong> #forum-openshift-ai, #wg-openshift-ai-vllm</p>
              <p><strong>Docs:</strong> Model Serving Guide (docs.redhat.com)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
