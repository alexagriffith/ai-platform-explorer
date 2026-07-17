import { useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
} from 'lucide-react';
import DecisionTree from './DecisionTree';
import FineTuningDecisionMatrix from './FineTuningDecisionMatrix';
import SecurityOverview from './SecurityOverview';
import { mergeDecisionPatches, getPatchesForRecommendationKey } from '../data/decisionRecommendationApply';
import { capabilities } from '../data/capabilities';
import { products } from '../data/products';
import { reconcileContainerAiPlatform } from '../lib/platformAiConstraints';
import { button, text, interactive, modal, surface, border, density, typeScale, productStatus } from '../lib/styleTokens';
import { distributingGridCols } from '../lib/layout';
import { guideMetadata, guideGroups, decisionFlows } from '../data/decisionGuides';

/** Look up status from products catalog by id. Returns null when no match. */
const productStatusFromCatalog = (productId) => {
  if (!productId) return null;
  return products.find((p) => p.id === productId)?.status ?? null;
};

const HEDGE_LINE = 'Early-stage capability — availability and scope not confirmed; check with your Red Hat account team.';

export default function DecisionFlowchart({
  selectedCapabilities,
  setSelectedCapabilities,
  onSwitchToArchitecture,
  selectedDecisionGuide,
  setSelectedDecisionGuide
}) {
  const [treeRecommendation, setTreeRecommendation] = useState(null);
  const [applyNotice, setApplyNotice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Use prop for selected decision
  const selectedDecision = selectedDecisionGuide;
  const setSelectedDecision = setSelectedDecisionGuide;

  const getCurrentFlow = () => {
    if (!selectedDecision || !decisionFlows[selectedDecision]) return null;
    return decisionFlows[selectedDecision];
  };

  const getCapabilityName = (capabilityId) => {
    for (const layer of Object.values(capabilities)) {
      const cap = layer.find((c) => c.id === capabilityId);
      if (cap) return cap.name;
    }
    return capabilityId;
  };

  const getOptionName = (capabilityId, optionId) => {
    for (const layer of Object.values(capabilities)) {
      const cap = layer.find((c) => c.id === capabilityId);
      if (cap) {
        const opt = cap.options.find((o) => o.id === optionId);
        if (opt) return opt.name;
      }
    }
    return optionId;
  };

  const generatePreview = () => {
    if (!treeRecommendation) return null;
    const key = treeRecommendation.recommendationKey;
    if (!key) return null;

    const patches = getPatchesForRecommendationKey(key);
    if (!patches || patches.length === 0) return null;

    const merged = { ...selectedCapabilities };
    for (const { capabilityId, optionId } of patches) {
      merged[capabilityId] = optionId;
    }

    const reconciledBefore = reconcileContainerAiPlatform(selectedCapabilities);
    const reconciledAfter = reconcileContainerAiPlatform(merged);

    const changes = [];
    const reconciliationChanges = [];

    for (const { capabilityId, optionId } of patches) {
      const prevOption = selectedCapabilities[capabilityId];
      const capName = getCapabilityName(capabilityId);
      const optName = getOptionName(capabilityId, optionId);

      if (!prevOption) {
        changes.push({ type: 'add', capabilityId, capName, optName });
      } else if (prevOption !== optionId) {
        const prevOptName = getOptionName(capabilityId, prevOption);
        changes.push({ type: 'update', capabilityId, capName, optName, prevOptName });
      }
    }

    for (const capabilityId of Object.keys(reconciledAfter)) {
      const reconciledValue = reconciledAfter[capabilityId];
      const mergedValue = merged[capabilityId];
      const beforeValue = reconciledBefore[capabilityId];

      if (reconciledValue !== mergedValue && reconciledValue !== beforeValue) {
        const capName = getCapabilityName(capabilityId);
        const optName = getOptionName(capabilityId, reconciledValue);
        reconciliationChanges.push({ capabilityId, capName, optName });
      }
    }

    return { changes, reconciliationChanges };
  };

  const addRecommendationToArchitecture = () => {
    if (!treeRecommendation) return;
    const key = treeRecommendation.recommendationKey;
    if (!key) {
      setApplyNotice('This path has no stable workshop mapping yet — capture choices in Build Your Stack.');
      setShowPreview(false);
      return;
    }
    const { next, applied } = mergeDecisionPatches(selectedCapabilities, key);
    if (!applied) {
      setApplyNotice(
        'No blueprint rows are mapped for this card yet. Use Build Your Stack to record the agreed components.'
      );
      setShowPreview(false);
      return;
    }
    setApplyNotice(null);
    setShowPreview(false);
    setSelectedCapabilities(next);
    if (onSwitchToArchitecture) {
      onSwitchToArchitecture();
    }
  };

  const flow = getCurrentFlow();

  return (
    <div data-tab="decisions" className={`rounded-card border ${border.hair} ${surface.raised} ${density.panelPad}`}>
      <h3 className={`${typeScale.groupLabel} ${text.ink} mb-3 flex items-center gap-2`}>
        <GitBranch size={16} className="text-accent" />
        Decision Guides
      </h3>

      {!selectedDecision ? (
        <div className={density.stackGap}>
          {guideGroups.map((group) => {
            return (
              <div key={group.id} className={`border-t ${border.hair} pt-3 first:border-t-0 first:pt-0`}>
                {/* Group Header */}
                <div className="mb-2">
                  <h3 className={`${typeScale.componentName} ${text.ink}`}>
                    {group.title}
                  </h3>
                  <p className={`${typeScale.secondary} ${text.muted} mt-0.5`}>
                    {group.description}
                  </p>
                </div>

                {/* Group Guides */}
                <div className={`grid ${distributingGridCols(group.guides.length)} ${density.rowGap}`}>
                  {group.guides.map((guideKey) => {
                    const flowData = decisionFlows[guideKey];
                    const meta = guideMetadata[guideKey];
                    const Icon = meta.icon;

                    return (
                      <button
                        data-ui="card"
                        key={guideKey}
                        onClick={() => {
                          setApplyNotice(null);
                          setSelectedDecision(guideKey);
                        }}
                        className={`${density.sectionPad} text-center rounded-card border ${border.hair} ${surface.tint} hover:border-accent hover:bg-tint ${interactive.transition} ${interactive.focusRing} group`}
                      >
                        <div className="flex flex-col items-center gap-0.5 mb-1">
                          <Icon size={16} className={`${text.muted} group-hover:text-accent ${interactive.transition} flex-shrink-0`} />
                          <div className="min-w-0">
                            <div className={`${typeScale.meta} font-semibold ${text.faint} uppercase tracking-wide mb-0.5`}>
                              {meta.category}
                            </div>
                            <h4 className={`${typeScale.componentName} ${text.ink}`}>
                              {flowData.title}
                            </h4>
                          </div>
                        </div>
                        {flowData.description && (
                          <p className={`${typeScale.secondary} ${text.muted}`}>
                            {flowData.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <h4 className={`${typeScale.componentName} ${text.ink}`}>{flow.title}</h4>
            <button
              onClick={() => {
                setApplyNotice(null);
                setSelectedDecision('');
                setTreeRecommendation(null);
              }}
              className={`text-sm text-link hover:underline ${interactive.transition} ${interactive.focusRing}`}
            >
              ← Change Decision Type
            </button>
          </div>

          {flow.referenceComponent === 'FineTuningDecisionMatrix' ? (
            <FineTuningDecisionMatrix />
          ) : flow.referenceComponent === 'SecurityOverview' ? (
            <SecurityOverview />
          ) : !treeRecommendation ? (
            /* Decision Tree */
            <DecisionTree
              flow={flow}
              onRecommendation={(rec) => {
                setApplyNotice(null);
                setTreeRecommendation(rec);
              }}
            />
          ) : (
            /* Recommendation */
            <div className={density.stackGap}>
              <div data-ui="card" className={`${density.sectionPad} rounded-card border ${border.hair} ${surface.raised}`}>
                {(() => {
                  const catalogStatus = productStatusFromCatalog(treeRecommendation.productId);
                  return (
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className={`${typeScale.componentName} ${text.ink}`}>
                        {treeRecommendation.product}
                      </h4>
                      {catalogStatus && (
                        <span className={`${typeScale.meta} font-medium ${productStatus[catalogStatus] ?? text.muted}`}>
                          {catalogStatus}
                        </span>
                      )}
                      {treeRecommendation.platformRequirement && (
                        <span className={`${typeScale.meta} ${text.faint}`}>
                          · {treeRecommendation.platformRequirement}
                        </span>
                      )}
                    </div>
                    {catalogStatus === 'Check with Red Hat' && (
                      <p className={`${typeScale.secondary} ${text.muted} mb-1`}>
                        {HEDGE_LINE}
                      </p>
                    )}
                    <p className={`${typeScale.secondary} ${text.muted} mb-2`}>
                      <strong>Why:</strong> {treeRecommendation.why}
                    </p>
                    {treeRecommendation.bestFor && (
                      <div className="mb-2">
                        <p className={`${typeScale.meta} font-semibold ${text.muted} mb-1`}>Best for:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {treeRecommendation.bestFor.map((item, idx) => (
                            <span data-ui="chip" key={idx} className={`px-2 py-0.5 ${surface.tint} border ${border.hair} rounded-card ${typeScale.secondary} ${text.muted}`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {treeRecommendation.components && (
                      <div>
                        <p className={`${typeScale.meta} font-semibold ${text.muted} mb-1`}>Key components:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {treeRecommendation.components.map((comp, idx) => (
                            <span data-ui="chip" key={idx} className={`px-2 py-0.5 ${surface.tint} border ${border.hair} rounded-card ${typeScale.secondary} ${text.ink}`}>
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                  );
                })()}

                {/* Advantages + Tradeoffs — separated by hairline rule */}
                {treeRecommendation.tradeoffs && (
                  <div className={`grid md:grid-cols-2 gap-3 pt-3 border-t ${border.hair}`}>
                    <div>
                      <h5 className={`font-bold text-green-700 dark:text-green-400 mb-1.5 flex items-center gap-1 ${typeScale.secondary}`}>
                        <CheckCircle size={14} />
                        Advantages
                      </h5>
                      <ul className={`space-y-1 ${typeScale.secondary}`}>
                        {treeRecommendation.tradeoffs.map((t, idx) => (
                          <li key={idx} className={`${text.muted} flex items-start gap-1`}>
                            <span className="text-green-600 flex-shrink-0">✓</span>
                            <span>{t.pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className={`font-bold text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1 ${typeScale.secondary}`}>
                        <XCircle size={14} />
                        Tradeoffs
                      </h5>
                      <ul className={`space-y-1 ${typeScale.secondary}`}>
                        {treeRecommendation.tradeoffs.map((t, idx) => (
                          <li key={idx} className={`${text.muted} flex items-start gap-1`}>
                            <span className="text-amber-600 flex-shrink-0">!</span>
                            <span>{t.con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Alternatives — separated by hairline rule */}
                {treeRecommendation.alternatives && (
                  <div className={`pt-3 border-t ${border.hair}`}>
                    <p className={`${typeScale.meta} font-semibold ${text.muted} mb-1.5`}>
                      Alternative options:
                    </p>
                    <ul className={`space-y-1 ${typeScale.secondary} ${text.muted}`}>
                      {treeRecommendation.alternatives.map((alt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRight size={12} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Preview modal */}
              {showPreview && (() => {
                const preview = generatePreview();
                return preview ? (
                  <div className={modal.overlay} onClick={() => setShowPreview(false)}>
                    <div className={`${modal.panel} ${modal.panelMedium}`} onClick={(e) => e.stopPropagation()}>
                      <div className={modal.header}>
                        <h4 className={`${typeScale.componentName} ${text.ink} flex items-center gap-2`}>
                          <Eye size={16} className="text-accent" />
                          Preview Changes to Your Stack
                        </h4>
                      </div>
                      <div className={modal.body}>

                      {preview.changes.length > 0 && (
                        <div className="mb-3">
                          <p className={`${typeScale.secondary} font-semibold ${text.muted} mb-1.5`}>Will apply:</p>
                          <div className="space-y-2">
                            {preview.changes.map((change, idx) => (
                              <div key={idx} className={`${density.cardPad} rounded-card border ${border.hair} ${surface.tint}`}>
                                {change.type === 'add' && (
                                  <p className={typeScale.secondary}>
                                    <span className="font-semibold text-green-700 dark:text-green-400">Add:</span>{' '}
                                    <span className="font-bold">{change.capName}</span> → {change.optName}
                                  </p>
                                )}
                                {change.type === 'update' && (
                                  <p className={typeScale.secondary}>
                                    <span className="font-semibold text-accent">Update:</span>{' '}
                                    <span className="font-bold">{change.capName}</span> → {change.optName}{' '}
                                    <span className={text.faint}>(was: {change.prevOptName})</span>
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {preview.reconciliationChanges.length > 0 && (
                        <div className="mb-3">
                          <p className={`${typeScale.secondary} font-semibold ${text.muted} mb-1.5`}>Also updates (compatibility):</p>
                          <div className="space-y-2">
                            {preview.reconciliationChanges.map((change, idx) => (
                              <div key={idx} className={`${density.cardPad} rounded-card border ${border.hair} ${surface.tint}`}>
                                <p className={typeScale.secondary}>
                                  <span className="font-bold">{change.capName}</span> → {change.optName}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {preview.changes.length === 0 && preview.reconciliationChanges.length === 0 && (
                        <p className={`${text.muted} mb-3 ${typeScale.secondary}`}>No changes to your current stack.</p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={addRecommendationToArchitecture}
                          className={`flex-1 flex items-center justify-center gap-2 ${button.primary}`}
                        >
                          <Plus size={16} />
                          Confirm & Add to Stack
                        </button>
                        <button
                          onClick={() => setShowPreview(false)}
                          className={button.secondary}
                        >
                          Cancel
                        </button>
                      </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (!treeRecommendation?.recommendationKey) {
                      setApplyNotice('This path has no stable workshop mapping yet — capture choices in Build Your Stack.');
                      return;
                    }
                    const patches = getPatchesForRecommendationKey(treeRecommendation.recommendationKey);
                    if (!patches || patches.length === 0) {
                      setApplyNotice('No blueprint rows are mapped for this card yet. Use Build Your Stack to record the agreed components.');
                      return;
                    }
                    setApplyNotice(null);
                    setShowPreview(true);
                  }}
                  className={`flex items-center gap-1.5 ${button.primary}`}
                >
                  <Eye size={16} />
                  Preview & Add to Stack
                </button>
                <button
                  onClick={() => {
                    setApplyNotice(null);
                    setShowPreview(false);
                    setTreeRecommendation(null);
                  }}
                  className={button.secondary}
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    setApplyNotice(null);
                    setShowPreview(false);
                    setSelectedDecision('');
                    setTreeRecommendation(null);
                  }}
                  className={button.secondary}
                >
                  Try Different Guide
                </button>
              </div>
              {applyNotice && (
                <p className={`${typeScale.secondary} text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-card px-3 py-2`}>
                  {applyNotice}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
