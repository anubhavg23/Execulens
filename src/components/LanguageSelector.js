import React from 'react';

export default function LanguageSelector({ language, onChange }) {
  return (
    <select 
      value={language} 
      onChange={(e) => onChange(e.target.value)}
      className="language-selector"
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
    </select>
  );
}