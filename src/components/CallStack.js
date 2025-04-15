import React from 'react';

export default function CallStack({ stack }) {
  return (
    <div className="call-stack">
      <h3>Call Stack</h3>
      <div className="stack-items">
        {stack.map((item, index) => (
          <div key={index} className="stack-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}