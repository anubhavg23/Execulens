import React from 'react';

export default function ExecutionTimeline({ steps, currentStep, onStepSelect }) {
  return (
    <div className="execution-timeline">
      <h3>Execution Timeline</h3>
      <div className="steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step ${index === currentStep ? 'active' : ''}`}
            onClick={() => onStepSelect(index)}
          >
            {step.description}
          </div>
        ))}
      </div>
    </div>
  );
}