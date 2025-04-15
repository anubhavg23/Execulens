import React from 'react';

export default function ExecutionControls({ onRun, onStep, onPause }) {
  return (
    <div className="execution-controls">
      <button onClick={onRun} className="control-button run-button">
        Run
      </button>
      <button onClick={onStep} className="control-button step-button">
        Step
      </button>
      <button onClick={onPause} className="control-button pause-button">
        Pause
      </button>
    </div>
  );
}