import { Shield, Cpu, Layers, Route, Database, TrendingUp, Settings, Box, FileText, Zap } from 'lucide-react';

/**
 * QuickComparisonTable
 *
 * Side-by-side comparison table for alternative technology choices (not upgrades).
 * Shows key differences in an easy-to-scan format.
 */
export default function QuickComparisonTable({ comparison }) {
  if (!comparison || comparison.comparisonType !== 'alternative') {
    return null;
  }

  const { before, after } = comparison;

  // Icon mapping for decision factors
  const iconMap = {
    shield: Shield,
    cpu: Cpu,
    layers: Layers,
    route: Route,
    database: Database,
    'trending-up': TrendingUp,
    settings: Settings,
    box: Box,
    'file-text': FileText,
    zap: Zap,
    users: Shield
  };

  // Combine decision factors from both sides
  const beforeFactors = before.decisionFactors || [];
  const afterFactors = after.decisionFactors || [];
  const categories = beforeFactors.map((beforeFactor, idx) => {
    const afterFactor = afterFactors[idx];
    return {
      category: beforeFactor.category,
      beforeValue: beforeFactor.value,
      afterValue: afterFactor?.value ?? '—',
      icon: beforeFactor.icon,
      weight: beforeFactor.weight
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Quick Comparison: At-a-Glance
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Users choose between these platforms based on governance, hardware strategy, and Kubernetes approach.
          Both leverage similar underlying technologies but with different operational models.
        </p>
      </div>

      {/* Similarities First */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What They Share
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Same vLLM backend</strong> - Both orchestrate vLLM inference engines
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>NIXL (NVIDIA's inference transfer library) for key-value (KV) cache transfer</strong> - GPU-to-GPU cache movement over InfiniBand or RDMA over Converged Ethernet (RoCE)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Disaggregated serving</strong> - Separate prefill/decode phases for optimization
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Prefix-aware caching</strong> - Cross-node KV cache with tiered offload
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Apache 2.0 open source</strong> - Both freely available and modifiable
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Can work together</strong> - Shared components (such as NIXL) let the projects interoperate rather than compete outright
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Now the Differences */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Key Differences (Where You Choose)
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Published head-to-head benchmarks are limited, so evaluate performance on your own workload.
          In practice, the choice usually comes down to governance model, hardware diversity, and Kubernetes integration approach.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 dark:bg-gray-950">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400 border-r border-gray-700 w-1/4">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-orange-400 border-r border-gray-700 w-[37.5%]">
                {before.label}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-400 w-[37.5%]">
                {after.label}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => {
              const Icon = iconMap[cat.icon] || Box;
              const isHighWeight = cat.weight === 'high';

              return (
                <tr
                  key={idx}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Icon
                        size={18}
                        className={`flex-shrink-0 ${
                          isHighWeight
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                      <span className={`font-medium ${
                        isHighWeight
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {cat.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    {cat.beforeValue}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {cat.afterValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Color Guide</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong className="text-orange-600 dark:text-orange-400">{before.label}</strong> features
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong className="text-blue-600 dark:text-blue-400">{after.label}</strong> features
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <svg className="w-3 h-3 text-green-600 dark:text-green-400 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Similar capabilities
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Comparison Sections */}
      <div className="space-y-6 mt-8">

        {/* Technical Architecture */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Technical Architecture Comparison
            </h4>
          </div>
          <div className="p-6">
            <ComparisonSection
              beforeLabel={before.label}
              afterLabel={after.label}
              rows={[
                {
                  label: "API Standard",
                  before: "Own Kubernetes custom resource definitions (CRDs) + Grove abstraction",
                  after: "Extends Gateway API, a Cloud Native Computing Foundation (CNCF) standard",
                  similar: false
                },
                {
                  label: "Inference Engine",
                  before: "vLLM, TensorRT-LLM, SGLang, PyTorch",
                  after: "vLLM",
                  similar: false
                },
                {
                  label: "Routing",
                  before: "Built-in router, global radix tree, GPU-level",
                  after: "Endpoint picker (EPP) at the Gateway API layer, cluster-wide pod scoring",
                  similar: false
                },
                {
                  label: "Prefill/Decode Disaggregation",
                  before: "NIXL, conditional (dynamic per-request decision)",
                  after: "NIXL, static pool configuration",
                  similar: false
                },
                {
                  label: "Key-Value (KV) Cache",
                  before: "Cross-node, prefix-aware, tiered offload",
                  after: "Cross-node, prefix-aware, tiered offload",
                  similar: true
                }
              ]}
            />
          </div>
        </div>

        {/* Operational & Business */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Operational & Business Comparison
            </h4>
          </div>
          <div className="p-6">
            <ComparisonSection
              beforeLabel={before.label}
              afterLabel={after.label}
              rows={[
                {
                  label: "Hardware",
                  before: "NVIDIA GPUs",
                  after: "NVIDIA and AMD Instinct accelerators (MI300X, MI325X, MI355X), with more platforms emerging",
                  similar: false
                },
                {
                  label: "Control Plane",
                  before: "NVIDIA-native orchestration primitives",
                  after: "Kubernetes custom resources, deployed via KServe (a CNCF incubating project)",
                  similar: false
                },
                {
                  label: "Governance",
                  before: "Open source (Apache 2.0), NVIDIA-controlled",
                  after: "Open source (Apache 2.0), led by Red Hat with founding contributors including Google, IBM, NVIDIA, and CoreWeave",
                  similar: false
                },
                {
                  label: "Enterprise Distribution",
                  before: "NVIDIA AI Enterprise",
                  after: "Red Hat OpenShift AI (on OpenShift) / Red Hat AI Inference Server (on any Kubernetes)",
                  similar: false
                },
                {
                  label: "Procurement Fit",
                  before: "Single-vendor GPU dependency",
                  after: "Multi-vendor compliant",
                  similar: false
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          The Bottom Line: When to Choose Which
        </h4>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Published head-to-head benchmarks are limited; evaluate on your own workload.</strong>{' '}
            They share core technologies (vLLM, NIXL, disaggregated serving) and can even work together,
            but users still choose one as their primary platform.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Dynamo if:</h5>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Committed to NVIDIA GPU ecosystem</li>
                <li>• Value multi-engine support (TensorRT-LLM, SGLang)</li>
                <li>• Want NVIDIA-led tooling and optimization</li>
                <li>• Need Grove gang scheduling features</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Choose llm-d if:</h5>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Need multi-vendor hardware (AMD, Intel, Google tensor processing units)</li>
                <li>• Prefer open, multi-vendor community governance</li>
                <li>• Want the Gateway API standard (not vendor-specific custom resources)</li>
                <li>• Need deep OpenShift integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ComparisonSection - Clearly labeled comparison table
 */
function ComparisonSection({ beforeLabel, afterLabel, rows }) {
  return (
    <div className="space-y-4">
      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-4">
        <div className="font-medium text-gray-500 dark:text-gray-400 text-sm">
          Feature
        </div>
        <div className="font-semibold text-orange-600 dark:text-orange-400 text-sm text-center">
          {beforeLabel}
        </div>
        <div className="font-semibold text-blue-600 dark:text-blue-400 text-sm text-center">
          {afterLabel}
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <ComparisonRow key={idx} row={row} />
        ))}
      </div>
    </div>
  );
}

/**
 * ComparisonRow - Individual feature comparison
 */
function ComparisonRow({ row }) {
  const { label, before, after, similar } = row;

  return (
    <div className={`grid grid-cols-3 gap-4 p-3 rounded-lg border ${
      similar
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
    }`}>
      {/* Feature Label */}
      <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
        {similar && (
          <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {label}
      </div>

      {/* Before Technology */}
      <div className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
        {before}
      </div>

      {/* After Technology */}
      <div className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        {after}
      </div>
    </div>
  );
}
