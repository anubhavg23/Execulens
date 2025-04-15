// src/components/VariableInspector.js
import React from 'react';

export default function VariableInspector({ variables }) {
  return (
    <div className="variable-inspector">
      <h3>Variables</h3>
      <div className="variables-list">
        {Object.keys(variables).length > 0 ? (
          Object.entries(variables).map(([name, value]) => (
            <div key={name} className="variable-item">
              <span className="variable-name">{name}:</span>
              <span className="variable-value">{JSON.stringify(value)}</span>
            </div>
          ))
        ) : (
          <div className="no-variables">No variables defined</div>
        )}
      </div>
    </div>
  );
}