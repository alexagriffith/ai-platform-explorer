import { Cpu, Zap, GitBranch, Database, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { typeScale, density, hwBadge, text } from '../lib/styleTokens';
import { trainingWorkflow, trainingVsInference, trainingDecisionMatrix, hardwareComparison } from '../data/trainingDeepDive';

export default function TrainingDeepDive() {
  const decisionMatrix = trainingDecisionMatrix;

  return (
    <div className={density.stackGap}>
      {/* Header — no border */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className={`${typeScale.componentName} text-ink`}>Model Training & Fine-Tuning</h2>
          <p className={`${typeScale.secondary} text-muted`}>Build, train, and fine-tune AI models at enterprise scale</p>
        </div>
      </div>

      {/* Training vs Inference + Training vs Fine-Tuning side-by-side */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2 flex items-center gap-1.5`}>
          <GitBranch className="text-muted" size={14} />
          Training vs. Inference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tint">
              <tr>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Aspect</th>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Training</th>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Inference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {trainingVsInference.map((row, index) => (
                <tr key={index} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className={`px-3 py-1.5 ${typeScale.tableCellStrong} ${text.ink}`}>{row.aspect}</td>
                  <td className={`px-3 py-1.5 ${typeScale.tableCell} ${text.muted}`}>{row.training}</td>
                  <td className={`px-3 py-1.5 ${typeScale.tableCell} ${text.muted}`}>{row.inference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training Workflow — numbered flow on one surface (matches the RAG pipeline) */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-4">
        <h3 className={`${typeScale.componentName} text-ink`}>Typical Training Workflow</h3>
        <p className={`${typeScale.caption} text-muted`}>
          From raw data to a registered, deployable model
        </p>

        <div className="mt-4 grid gap-x-6 gap-y-4 md:grid-cols-5">
          {trainingWorkflow.map((stage, index) => (
            <div key={index} className="relative">
              {index < trainingWorkflow.length - 1 && (
                <ArrowRight
                  size={16}
                  className="text-faint hidden md:block absolute top-1 -right-4 z-10"
                  aria-hidden
                />
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full bg-accent text-on-accent shrink-0 ${typeScale.caption} font-bold`}
                >
                  {index + 1}
                </span>
                <h4 className={`${typeScale.componentName} text-ink`}>{stage.step}</h4>
              </div>
              <p className={`${typeScale.caption} text-muted mb-1.5`}>{stage.description}</p>
              <ul className="space-y-1">
                {stage.tools.map((tool, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className={`text-muted flex-shrink-0 ${typeScale.caption}`}>•</span>
                    <span className={`${typeScale.caption} text-ink`}>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Matrix — no border on outer panel */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2`}>Product Decision Matrix</h3>
        <div className="divide-y divide-hair">
          {decisionMatrix.map((option, index) => (
            <div key={index} className="py-1.5 first:pt-0 last:pb-0">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={13} />
                <div className="flex-1">
                  <h4 className={`${typeScale.secondary} font-bold text-ink mb-0.5`}>Choose {option.choose}</h4>
                  <p className={`${typeScale.meta} text-muted mb-0.5`}>
                    <strong className="text-ink">When:</strong> {option.when}
                  </p>
                  <p className={`${typeScale.meta} text-muted`}>
                    <strong className="text-ink">Best for:</strong> {option.bestFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Comparison — no border on outer */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-0.5 flex items-center gap-1.5`}>
          <Cpu className="text-muted" size={14} />
          GPU Hardware for Training
        </h3>
        <p className={`${typeScale.meta} text-muted mb-1`}>
          Representative examples — GPU availability and pricing change quickly; confirm current options with your hardware vendor.
        </p>
        {/* Legend — categorical marks for cost/perf scale */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
          <div className="flex items-center gap-3">
            <span className={`${typeScale.meta} text-muted font-semibold uppercase tracking-wide`}>Cost:</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-300 dark:bg-amber-700" aria-hidden="true" />
              <span className={`${typeScale.meta} text-muted`}>High/Very High/Highest</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-tint border border-hair" aria-hidden="true" />
              <span className={`${typeScale.meta} text-muted`}>Moderate</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${typeScale.meta} text-muted font-semibold uppercase tracking-wide`}>Performance:</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-300 dark:bg-green-700" aria-hidden="true" />
              <span className={`${typeScale.meta} text-muted`}>Maximum/Excellent/Very Good</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-tint border border-hair" aria-hidden="true" />
              <span className={`${typeScale.meta} text-muted`}>Good</span>
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tint">
              <tr>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>GPU</th>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Memory</th>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Best For</th>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Cost</th>
                <th className={`px-3 py-1.5 text-left ${typeScale.label} ${text.ink} font-semibold border-b border-hair`}>Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {hardwareComparison.map((hw, index) => (
                <tr key={index} className="hover:bg-tint transition-colors duration-150 ease-out motion-reduce:transition-none">
                  <td className={`px-3 py-1.5 ${typeScale.tableCellStrong} ${text.ink}`}>{hw.gpu}</td>
                  <td className={`px-3 py-1.5 ${typeScale.tableCell} ${text.muted}`}>{hw.memory}</td>
                  <td className={`px-3 py-1.5 ${typeScale.tableCell} ${text.muted}`}>{hw.bestFor}</td>
                  <td className="px-3 py-1.5">
                    <span className={hwBadge.cost(hw.cost)}>{hw.cost}</span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={hwBadge.performance(hw.performance)}>{hw.performance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training vs Fine-Tuning — no border, two columns separated by hairline */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-3">
        <h3 className={`${typeScale.componentName} text-ink mb-2`}>Training vs. Fine-Tuning</h3>
        <div className="grid md:grid-cols-2 divide-y divide-hair md:divide-y-0 md:divide-x">
          <div className="pb-2 md:pb-0 md:pr-4">
            <h4 className={`${typeScale.secondary} font-semibold text-ink mb-1 flex items-center gap-1.5`}>
              <Zap size={13} className="text-muted" />
              Full Training
            </h4>
            <ul className="space-y-1">
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Trains a model from scratch (rare for large language models — most organizations start from a foundation model)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Requires massive datasets (TBs of data)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Multi-node distributed workloads essential</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Red Hat OpenShift AI distributed workloads (Ray) support large multi-node jobs</span>
              </li>
            </ul>
          </div>
          <div className="pt-2 md:pt-0 md:pl-4">
            <h4 className={`${typeScale.secondary} font-semibold text-ink mb-1 flex items-center gap-1.5`}>
              <Database size={13} className="text-muted" />
              Fine-Tuning
            </h4>
            <ul className="space-y-1">
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Adapts existing model to specific data/tasks</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Works with limited data via synthetic generation</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Small-to-medium scale compared to pre-training</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                <span className={`${typeScale.secondary} text-muted`}>Use OpenShift AI fine-tuning workflows (supervised fine-tuning, LoRA adapters); InstructLab is an option for taxonomy-driven synthetic data — confirm current support status with your Red Hat account team</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div data-ui="card" className="rounded-card bg-surface px-4 py-2">
        <div className="flex items-start gap-2">
          <Info className="text-muted mt-0.5 flex-shrink-0" size={14} />
          <div className="flex-1">
            <h4 className={`${typeScale.secondary} font-semibold text-ink mb-0.5`}>Resources & Contacts</h4>
            <div className={`${typeScale.secondary} text-muted space-y-0.5`}>
              <p><strong className="text-ink">Questions:</strong> Ask your Red Hat account team.</p>
              <p><strong className="text-ink">Docs:</strong> Working with distributed workloads, Red Hat OpenShift AI (docs.redhat.com)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
