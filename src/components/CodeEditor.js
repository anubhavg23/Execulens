import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, code, onChange, onMount }) {
  return (
    <Editor
      height="70vh"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={onChange}
      onMount={onMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        glyphMargin: true,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        automaticLayout: true
      }}
    />
  );
}