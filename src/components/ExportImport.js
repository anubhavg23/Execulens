import React from 'react';

export default function ExportImport({ onExport, onImport }) {
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          onImport(data);
        } catch (error) {
          console.error('Error parsing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="export-import">
      <button onClick={() => {
        const data = onExport();
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'execulens-session.json';
        a.click();
      }}>Export Session</button>
      
      <label className="import-button">
        Import Session
        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </label>
    </div>
  );
}