import React from 'react';

const BreakpointManager = ({ breakpoints, onToggle }) => {
  return (
    <div className="breakpoint-manager">
      <h3>Breakpoints</h3>
      {breakpoints.length > 0 ? (
        <div className="breakpoints-list">
          {breakpoints.map((line, index) => (
            <div key={index} className="breakpoint">
              <span>Line {line}</span>
              <button onClick={() => onToggle(line)}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-breakpoints">No breakpoints set</div>
      )}
    </div>
  );
};

export default BreakpointManager;