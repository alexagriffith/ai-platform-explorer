import { Shield, Cpu, Layers, Route, Database, TrendingUp, Settings, Box, FileText, Zap } from 'lucide-react';
import { typeScale } from '../lib/styleTokens';

/**
 * QuickComparisonTable
 *
 * Side-by-side comparison table for alternative technology choices (not upgrades).
 * Shows key differences in an easy-to-scan format.
 *
 * Column identifiers use ink/muted — no hue-coded columns.
 * Similarity highlights use green (status=match), differences use neutral surfaces.
 * The "bottom line" callout uses tint + accent border (single accent rule).
 */
export default function QuickComparisonTable({ comparison }) {
  if (!comparison || comparison.comparisonType !== 'alternative') {
    return null;
  }

  const { before, after } = comparison;

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
    <div className="space-y-4">
      <div>
        <h3 className={`${typeScale.panelTitle} text-ink mb-1`}>
          Quick Comparison: At-a-Glance
        </h3>
        <p className={`${typeScale.body} text-muted`}>
          Users choose between these platforms based on governance, hardware strategy, and Kubernetes approach.
          Both leverage similar underlying technologies but with different operational models.
        </p>
      </div>

      {/* Similarities First — green is status-semantic: "these things match" */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-card px-4 py-3">
        <h4 className={`${typeScale.subPanelTitle} text-ink mb-2 flex items-center gap-2`}>
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What They Share
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              <span className={`${typeScale.body} text-ink`}>
                <strong>Same vLLM backend</strong> - Both orchestrate vLLM inference engines
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              <span className={`${typeScale.body} text-ink`}>
                <strong>NIXL (NVIDIA's inference transfer library) for key-value (KV) cache transfer</strong> - GPU-to-GPU cache movement over InfiniBand or RDMA over Converged Ethernet (RoCE)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              <span className={`${typeScale.body} text-ink`}>
                <strong>Disaggregated serving</strong> - Separate prefill/decode phases for optimization
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              <span className={`${typeScale.body} text-ink`}>
                <strong>Prefix-aware caching</strong> - Cross-node KV cache with tiered offload
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              <span className={`${typeScale.body} text-ink`}>
                <strong>Apache 2.0 open source</strong> - Both freely available and modifiable
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
              <span className={`${typeScale.body} text-ink`}>
                <strong>Can work together</strong> - Shared components (such as NIXL) let the projects interoperate rather than compete outright
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Differences header */}
      <div>
        <h4 className={`${typeScale.subPanelTitle} text-ink mb-1 flex items-center gap-2`}>
          <svg className="w-4 h-4 text-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Key Differences (Where You Choose)
        </h4>
        <p className={`${typeScale.caption} text-muted`}>
          Published head-to-head benchmarks are limited, so evaluate performance on your own workload.
          In practice, the choice usually comes down to governance model, hardware diversity, and Kubernetes integration approach.
        </p>
      </div>

      {/* Comparison Table — neutral dark header, no hue columns */}
      <div className="overflow-x-auto rounded-card border border-edge">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-tint border-b border-edge">
              <th className={`px-3 py-2 text-left ${typeScale.tableHeader} text-muted border-r border-hair w-1/4`}>
                Category
              </th>
              <th className={`px-3 py-2 text-left ${typeScale.tableHeader} text-ink border-r border-hair w-[37.5%]`}>
                {before.label}
              </th>
              <th className={`px-3 py-2 text-left ${typeScale.tableHeader} text-ink w-[37.5%]`}>
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
                  className="border-b border-hair bg-surface hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none"
                >
                  <td className="px-3 py-2 border-r border-hair">
                    <div className="flex items-center gap-1.5">
                      <Icon
                        size={15}
                        className={`flex-shrink-0 ${isHighWeight ? 'text-link' : 'text-faint'}`}
                      />
                      <span className={`${typeScale.bodyStrong} ${isHighWeight ? 'text-ink' : 'text-muted'}`}>
                        {cat.category}
                      </span>
                    </div>
                  </td>
                  <td className={`px-3 py-2 ${typeScale.tableCell} text-ink border-r border-hair`}>
                    {cat.beforeValue}
                  </td>
                  <td className={`px-3 py-2 ${typeScale.tableCell} text-ink`}>
                    {cat.afterValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Comparison Sections */}
      <div className="space-y-3">

        {/* Technical Architecture */}
        <div className="rounded-card border border-edge bg-surface">
          <div className="px-4 py-2 border-b border-hair">
            <h4 className={`${typeScale.subPanelTitle} text-ink`}>
              Technical Architecture Comparison
            </h4>
          </div>
          <div className="p-4">
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
        <div className="rounded-card border border-edge bg-surface">
          <div className="px-4 py-2 border-b border-hair">
            <h4 className={`${typeScale.subPanelTitle} text-ink`}>
              Operational &amp; Business Comparison
            </h4>
          </div>
          <div className="p-4">
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

      {/* Bottom Line — accent border for the primary decision callout */}
      <div className="bg-tint border border-accent rounded-card px-4 py-3">
        <h4 className={`${typeScale.subPanelTitle} text-ink mb-2`}>
          The Bottom Line: When to Choose Which
        </h4>
        <div className="space-y-2">
          <p className={`${typeScale.body} text-ink`}>
            <strong>Published head-to-head benchmarks are limited; evaluate on your own workload.</strong>{' '}
            They share core technologies (vLLM, NIXL, disaggregated serving) and can even work together,
            but users still choose one as their primary platform.
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="bg-surface rounded-card px-3 py-2 border border-edge">
              <h5 className={`${typeScale.subSectionTitle} text-ink mb-1.5`}>Choose Dynamo if:</h5>
              <ul className={`${typeScale.caption} text-muted space-y-1`}>
                <li>• Committed to NVIDIA GPU ecosystem</li>
                <li>• Value multi-engine support (TensorRT-LLM, SGLang)</li>
                <li>• Want NVIDIA-led tooling and optimization</li>
                <li>• Need Grove gang scheduling features</li>
              </ul>
            </div>
            <div className="bg-surface rounded-card px-3 py-2 border border-edge">
              <h5 className={`${typeScale.subSectionTitle} text-ink mb-1.5`}>Choose llm-d if:</h5>
              <ul className={`${typeScale.caption} text-muted space-y-1`}>
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
    <div className="space-y-2">
      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${typeScale.label} text-muted font-medium`}>
          Feature
        </div>
        <div className={`${typeScale.label} text-ink font-semibold text-center`}>
          {beforeLabel}
        </div>
        <div className={`${typeScale.label} text-ink font-semibold text-center`}>
          {afterLabel}
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <ComparisonRow key={idx} row={row} />
        ))}
      </div>
    </div>
  );
}

/**
 * ComparisonRow - Individual feature comparison.
 * Similar rows use green (status=match); different rows use neutral surfaces.
 */
function ComparisonRow({ row }) {
  const { label, before, after, similar } = row;

  return (
    <div className={`grid grid-cols-3 gap-3 px-2 py-1.5 rounded-card border ${
      similar
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
        : 'border-hair bg-tint'
    }`}>
      {/* Feature Label */}
      <div className={`${typeScale.label} font-medium text-ink flex items-center gap-1.5`}>
        {similar && (
          <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {label}
      </div>

      {/* Before Technology */}
      <div className={`${typeScale.tableCell} text-ink px-2 py-1 bg-surface rounded-card border border-hair`}>
        {before}
      </div>

      {/* After Technology */}
      <div className={`${typeScale.tableCell} text-ink px-2 py-1 bg-surface rounded-card border border-hair`}>
        {after}
      </div>
    </div>
  );
}
