import { useState } from 'react';
import { CheckCircle, RotateCcw, ChevronLeft } from 'lucide-react';

export default function DecisionTree({ flow, onRecommendation }) {
  const [selectedPath, setSelectedPath] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleNodeClick = (stepIndex, optionValue, nextStep) => {
    const newPath = { ...selectedPath, [stepIndex]: optionValue };
    setSelectedPath(newPath);

    if (nextStep !== undefined) {
      setCurrentStep(nextStep);
    } else {
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
    const completedSteps = Object.keys(selectedPath).map(Number).sort((a, b) => b - a);
    if (completedSteps.length === 0) return;

    const lastCompletedStep = completedSteps[0];
    const newPath = { ...selectedPath };
    delete newPath[lastCompletedStep];

    setSelectedPath(newPath);
    setCurrentStep(Math.max(0, lastCompletedStep - 1));
    onRecommendation(null);
  };

  const resetTree = () => {
    setSelectedPath({});
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

  const canGoBack = Object.keys(selectedPath).length > 0;

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
    <div className="space-y-6">
      {/* Breadcrumb and controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {canGoBack && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Your path: </span>
              <span className="italic">{getBreadcrumb()}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go back one step"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <button
            onClick={resetTree}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset all choices"
          >
            <RotateCcw size={16} />
            Reset
          </button>
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
            <div key={stepIndex} className="mb-8">
              {/* Connecting line from previous step */}
              {stepIndex > 0 && shouldShowStep(step, stepIndex) && (
                <div className="flex justify-center mb-4">
                  <div className={`w-0.5 h-8 ${isCompleted ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                </div>
              )}

              {/* Question node */}
              <div className="flex flex-col items-center">
                <div className={`max-w-2xl w-full p-6 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105'
                    : isCompleted
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle size={24} className="text-green-600" />
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          isActive ? 'border-purple-600 bg-purple-200 dark:bg-purple-800' : 'border-gray-400'
                        }`}>
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                            {visibleNumber}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                        {step.question}
                      </h4>

                      {/* Option nodes */}
                      <div className="grid md:grid-cols-2 gap-3">
                        {step.options.map((option) => {
                          const selected = isOptionSelected(stepIndex, option.value);
                          const disabled = !isActive && !selected;

                          return (
                            <button
                              key={option.value}
                              onClick={() => !disabled && handleNodeClick(stepIndex, option.value, option.next)}
                              disabled={disabled}
                              aria-current={selected ? 'true' : undefined}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                selected
                                  ? 'border-purple-600 bg-purple-100 dark:bg-purple-800 shadow-md'
                                  : isActive
                                  ? 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:shadow-md bg-white dark:bg-gray-700'
                                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {selected && <CheckCircle size={16} className="text-purple-600" />}
                                <span className={`font-semibold ${
                                  selected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {option.label}
                                </span>
                              </div>
                              {option.next !== undefined && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  → Continue to next question
                                </div>
                              )}
                              {option.recommendation && (
                                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                  ✓ View recommendation
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
