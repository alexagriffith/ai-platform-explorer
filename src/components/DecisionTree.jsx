import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

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
        onRecommendation(flow.recommendations[selectedOption.recommendation]);
      }
    }
  };

  const resetTree = () => {
    setSelectedPath({});
    setCurrentStep(0);
    onRecommendation(null);
  };

  const getCurrentFlowStep = () => {
    return flow.steps[currentStep];
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

  return (
    <div className="space-y-6">
      {/* Reset button */}
      <div className="flex justify-end">
        <button
          onClick={resetTree}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Tree visualization */}
      <div className="relative">
        {flow.steps.map((step, stepIndex) => {
          if (!shouldShowStep(step, stepIndex)) return null;

          const isActive = isNodeActive(stepIndex);
          const isCompleted = isNodeCompleted(stepIndex);

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
                            {stepIndex + 1}
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
