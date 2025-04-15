import React from 'react';

export default function ExecutionControls({ onRun, onStep, onPause, isRunning }) {
  return (
    <div className="execution-controls">
      <button 
        onClick={onRun} 
        className="control-button run-button"
        disabled={isRunning}
      >
        Run
      </button>
      <button 
        onClick={onStep} 
        className="control-button step-button"
        disabled={isRunning}
      >
        Step
      </button>
      <button 
        onClick={onPause} 
        className="control-button pause-button"
        disabled={!isRunning}
      >
        Pause
      </button>
    </div>
  );
}