import React from 'react';

const OutputPanel = ({ output }) => {
  return (
    <div className="output-panel">
      <h3>Output</h3>
      <div className="output-content">
        {output.length > 0 ? (
          output.map((line, index) => (
            <div key={index} className="output-line">
              <span className="output-prefix">&gt;</span>
              {line}
            </div>
          ))
        ) : (
          <div className="no-output">No output yet</div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;  // Make sure to export as default