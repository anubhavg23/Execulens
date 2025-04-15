import React from 'react';

export default function ControlPanel({
  onRun,
  onStep,
  onPause,
  onReset,
  speed,
  onSpeedChange,
  isRunning
}) {
  return (
    <div className="control-panel">
      <div className="buttons">
        <button onClick={onRun} disabled={isRunning}>Run</button>
        <button onClick={onStep} disabled={isRunning}>Step</button>
        <button onClick={onPause} disabled={!isRunning}>Pause</button>
        <button onClick={onReset}>Reset</button>
      </div>
      <div className="speed-control">
        <label>Speed:</label>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          step="100" 
          value={speed} 
          onChange={(e) => onSpeedChange(Number(e.target.value))} 
        />
        <span>{speed}ms</span>
      </div>
    </div>
  );
}