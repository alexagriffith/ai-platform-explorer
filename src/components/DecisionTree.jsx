import { useState } from 'react';
import { CheckCircle, RotateCcw, ChevronLeft } from 'lucide-react';
import { button, text, interactive, surface, border, density, typeScale } from '../lib/styleTokens';

export default function DecisionTree({ flow, onRecommendation }) {
  const [selectedPath, setSelectedPath] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  // Ordered stack of answered step indexes along the actual visited path. Flows use
  // non-linear `next` jumps, so "previous step" must come from this history, not index math.
  const [stepHistory, setStepHistory] = useState([]);

  const handleNodeClick = (stepIndex, optionValue, nextStep) => {
    // If an earlier step is re-answered, drop the history (and answers) recorded after it.
    const historyIdx = stepHistory.indexOf(stepIndex);
    const keptHistory = historyIdx >= 0 ? stepHistory.slice(0, historyIdx) : stepHistory;
    const droppedSteps = historyIdx >= 0 ? stepHistory.slice(historyIdx + 1) : [];

    const newPath = { ...selectedPath, [stepIndex]: optionValue };
    for (const dropped of droppedSteps) {
      delete newPath[dropped];
    }
    setSelectedPath(newPath);

    if (nextStep !== undefined) {
      setStepHistory([...keptHistory, stepIndex]);
      setCurrentStep(nextStep);
    } else {
      setStepHistory(keptHistory);
      // End of path - find recommendation
      const currentFlowStep = flow.steps[stepIndex];
      const selectedOption = currentFlowStep.options.find(opt => opt.value === optionValue);
      if (selectedOption?.recommendation && flow.recommendations[selectedOption.recommendation]) {
        onRecommendation({
          ...flow.recommendations[selectedOption.recommendation],
          recommendationKey: selectedOption.recommendation
        });
      }
    }
  };

  const goBack = () => {
    if (stepHistory.length === 0) return;

    const previousStep = stepHistory[stepHistory.length - 1];
    const newPath = { ...selectedPath };
    delete newPath[previousStep];

    setSelectedPath(newPath);
    setStepHistory(stepHistory.slice(0, -1));
    setCurrentStep(previousStep);
    onRecommendation(null);
  };

  const resetTree = () => {
    setSelectedPath({});
    setStepHistory([]);
    setCurrentStep(0);
    onRecommendation(null);
  };

  const isNodeActive = (stepIndex) => {
    return stepIndex === currentStep;
  };

  const isNodeCompleted = (stepIndex) => {
    return selectedPath[stepIndex] !== undefined;
  };

  const isOptionSelected = (stepIndex, optionValue) => {
    return selectedPath[stepIndex] === optionValue;
  };

  const shouldShowStep = (step, stepIndex) => {
    if (stepIndex === 0) return true;
    if (!step.condition) return stepIndex <= currentStep;

    const conditionMet = selectedPath[step.condition.step] === step.condition.value;
    return conditionMet && stepIndex <= currentStep + 1;
  };

  const getBreadcrumb = () => {
    const completedSteps = Object.keys(selectedPath)
      .map(Number)
      .sort((a, b) => a - b);

    return completedSteps
      .map((stepIdx) => {
        const step = flow.steps[stepIdx];
        const optionValue = selectedPath[stepIdx];
        const option = step.options.find((o) => o.value === optionValue);
        return option?.label || optionValue;
      })
      .join(' → ');
  };

  const canGoBack = stepHistory.length > 0;

  // Calculate visible question number (not array index)
  const getVisibleQuestionNumber = (targetStepIndex) => {
    let visibleCount = 0;
    for (let i = 0; i <= targetStepIndex; i++) {
      if (shouldShowStep(flow.steps[i], i)) {
        visibleCount++;
      }
    }
    return visibleCount;
  };

  return (
    <div className={density.stackGap}>
      {/* Breadcrumb and controls — centered column matching question node width */}
      <div className="flex flex-col items-center gap-2">
        <div className="max-w-2xl w-full flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {canGoBack && (
              <div className={`${typeScale.secondary} ${text.muted}`}>
                <span className="font-semibold">Your path: </span>
                <span className="italic">{getBreadcrumb()}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              data-ui="control"
              onClick={goBack}
              disabled={!canGoBack}
              className={`flex items-center gap-1.5 ${button.secondary} disabled:opacity-50 disabled:pointer-events-none`}
              aria-label="Go back one step"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <button
              data-ui="control"
              onClick={resetTree}
              className={`flex items-center gap-1.5 ${button.secondary}`}
              aria-label="Reset all choices"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="relative">
        {flow.steps.map((step, stepIndex) => {
          if (!shouldShowStep(step, stepIndex)) return null;

          const isActive = isNodeActive(stepIndex);
          const isCompleted = isNodeCompleted(stepIndex);
          const visibleNumber = getVisibleQuestionNumber(stepIndex);

          return (
            <div key={stepIndex} className="mb-4">
              {/* Connecting line from previous step */}
              {stepIndex > 0 && shouldShowStep(step, stepIndex) && (
                <div className="flex justify-center mb-2">
                  <div className={`w-0.5 h-4 ${isCompleted ? 'bg-accent' : 'bg-edge dark:bg-edge'}`}></div>
                </div>
              )}

              {/* Question node */}
              <div className="flex flex-col items-center">
                <div data-ui="card" className={`max-w-2xl w-full ${density.sectionPad} rounded-card border ${interactive.transitionAll} ${
                  isActive
                    ? `border-accent ${surface.tint}`
                    : isCompleted
                    ? `border-edge ${surface.raised}`
                    : `${border.edge} ${surface.raised}`
                }`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          isActive ? 'border-accent bg-accent' : `${border.edge} ${surface.tint}`
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`${typeScale.componentName} ${text.ink} mb-2`}>
                        <span className="text-accent mr-1">
                          Question {visibleNumber}:
                        </span>
                        {step.question}
                      </h4>

                      {/* Option nodes — content-hugging (flex-none), centered row; wraps only when
                          content genuinely cannot fit. Basis from text, not fractional width. */}
                      <div className={`flex flex-wrap justify-center ${density.rowGap}`}>
                        {step.options.map((option) => {
                          const selected = isOptionSelected(stepIndex, option.value);
                          const disabled = !isActive && !selected;

                          return (
                            <button
                              key={option.value}
                              data-ui="control"
                              onClick={() => !disabled && handleNodeClick(stepIndex, option.value, option.next)}
                              disabled={disabled}
                              aria-current={selected ? 'true' : undefined}
                              className={`flex-none ${density.cardPad} rounded-card border-2 text-left ${interactive.transitionAll} ${
                                selected
                                  ? `border-accent ${surface.tint}`
                                  : isActive
                                  ? `${border.edge} hover:border-accent ${surface.raised} ${interactive.hoverTint}`
                                  : `${border.hair} ${surface.tint} opacity-50 cursor-not-allowed`
                              } ${!disabled ? interactive.focusRing : ''}`}
                            >
                              <div className="flex items-center gap-1.5">
                                {selected && <CheckCircle size={14} className="text-accent flex-shrink-0" />}
                                <span className={`${typeScale.secondary} font-semibold ${text.ink}`}>
                                  {option.label}
                                </span>
                              </div>
                              {option.recommendation && (
                                <div className={`mt-0.5 ${typeScale.meta} text-green-600 dark:text-green-400 font-semibold`}>
                                  View recommendation
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
