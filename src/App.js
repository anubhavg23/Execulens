import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import * as esprima from 'esprima';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import ExecutionTimeline from './components/ExecutionTimeline';
import VariableInspector from './components/VariableInspector';
import CallStack from './components/CallStack';
import BreakpointManager from './components/BreakpointManager';
import LanguageSelector from './components/LanguageSelector';
import OutputPanel from './components/OutputPanel';
import './App.css';

function ControlPanel({
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
      <button onClick={onRun} disabled={isRunning}>Run</button>
      <button onClick={onStep} disabled={isRunning}>Step</button>
      <button onClick={onPause} disabled={!isRunning}>Pause</button>
      <button onClick={onReset}>Reset</button>
      <div className="speed-control">
        <span>Speed: {speed}ms</span>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          value={speed} 
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

function getNodeDescription(node) {
  if (!node) return 'Unknown step';
  if (node.type === 'VariableDeclaration') return 'Variable declaration';
  if (node.type === 'FunctionDeclaration') return 'Function declaration';
  if (node.type === 'ExpressionStatement') return 'Expression';
  return node.type;
}

function evaluateExpression(node, variables) {
  if (!node) return undefined;
  if (node.type === 'Literal') return node.value;
  if (node.type === 'Identifier') return variables[node.name];
  if (node.type === 'BinaryExpression') {
    const left = evaluateExpression(node.left, variables);
    const right = evaluateExpression(node.right, variables);
    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      default: return undefined;
    }
  }
  return undefined;
}

const DEFAULT_CODE = {
  javascript: `// Simple code example
let x = 5;
let y = 10;
let sum = x + y;
console.log(sum);`,
  python: `# Simple code example
x = 5
y = 10
sum = x + y
print(sum)`
};

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [executionState, setExecutionState] = useState({
    steps: [],
    currentStep: -1,
    variables: {},
    callStack: ['global'],
    output: [],
    breakpoints: []
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const editorRef = useRef(null);

  const parseCode = useCallback(() => {
    try {
      let ast;
      if (language === 'javascript') {
        ast = esprima.parseScript(code, { range: true, loc: true });
      } else {
        ast = parse(code, {
          sourceType: 'module',
          plugins: ['python'],
          ranges: true,
          loc: true
        });
      }
      
      const steps = [];
      const variables = {};
      const callStack = ['global'];
      
      const processNode = (node) => {
        const step = {
          line: node.loc.start.line,
          node,
          variables: {...variables},
          callStack: [...callStack],
          description: getNodeDescription(node)
        };
        
        steps.push(step);
        
        if (node.type === 'VariableDeclaration') {
          node.declarations.forEach(decl => {
            if (decl.id && decl.init) {
              variables[decl.id.name] = evaluateExpression(decl.init, variables);
            }
          });
        }
      };
      
      if (language === 'javascript') {
        ast.body.forEach(processNode);
      } else {
        traverse(ast, {
          enter(path) {
            processNode(path.node);
          }
        });
      }
      
      return steps;
    } catch (error) {
      console.error('Parsing error:', error);
      setExecutionState(prev => ({
        ...prev,
        output: [`Parsing error: ${error.message}`]
      }));
      return [];
    }
  }, [code, language]);

  const executeCode = useCallback(() => {
    const steps = parseCode();
    setExecutionState({
      steps,
      currentStep: -1,
      variables: {},
      callStack: ['global'],
      output: ['Execution started...'],
      breakpoints: executionState.breakpoints
    });
    setIsRunning(true);
  }, [executionState.breakpoints, parseCode]);

  const executeStep = useCallback(() => {
    setExecutionState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) {
        setIsRunning(false);
        return {
          ...prev,
          output: [...prev.output, 'Execution completed']
        };
      }

      const nextStep = prev.currentStep + 1;
      const step = prev.steps[nextStep];
      const newVariables = {...prev.variables};
      const newCallStack = [...prev.callStack];
      let newOutput = [...prev.output];

      // Handle console.log/output
      if (step.node.type === 'ExpressionStatement' && 
          step.node.expression.type === 'CallExpression' &&
          step.node.expression.callee.object?.name === 'console' &&
          step.node.expression.callee.property?.name === 'log') {
        const args = step.node.expression.arguments.map(arg => {
          const value = evaluateExpression(arg, newVariables);
          return value !== undefined ? value.toString() : 'undefined';
        });
        newOutput.push(`> ${args.join(' ')}`);
      }

      // Handle variable declarations
      if (step.node.type === 'VariableDeclaration') {
        step.node.declarations.forEach(decl => {
          if (decl.id && decl.init) {
            newVariables[decl.id.name] = evaluateExpression(decl.init, newVariables);
          }
        });
      }

      // Handle expressions (like assignments)
      if (step.node.type === 'ExpressionStatement' && 
          step.node.expression.type === 'AssignmentExpression') {
        const { left, right } = step.node.expression;
        if (left.type === 'Identifier') {
          newVariables[left.name] = evaluateExpression(right, newVariables);
        }
      }

      return {
        ...prev,
        currentStep: nextStep,
        variables: newVariables,
        callStack: newCallStack,
        output: newOutput
      };
    });
  }, []);

  const toggleBreakpoint = useCallback((lineNumber) => {
    setExecutionState(prev => {
      const newBreakpoints = prev.breakpoints.includes(lineNumber)
        ? prev.breakpoints.filter(line => line !== lineNumber)
        : [...prev.breakpoints, lineNumber];
      
      // Sort breakpoints for better display
      const sortedBreakpoints = [...newBreakpoints].sort((a, b) => a - b);
      
      return {
        ...prev,
        breakpoints: sortedBreakpoints
      };
    });
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && executionState.currentStep < executionState.steps.length - 1) {
      const nextStep = executionState.currentStep + 1;
      const nextLine = executionState.steps[nextStep]?.line;
      
      if (executionState.breakpoints.includes(nextLine)) {
        setIsRunning(false);
        setExecutionState(prev => ({
          ...prev,
          output: [...prev.output, `Breakpoint hit at line ${nextLine}`]
        }));
      } else {
        timer = setTimeout(executeStep, speed);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, executionState, speed, executeStep]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>👁️<span className="gradient-text">ExecuLens <br></br>Zoom into the logic behind the code</span></h1>
        <LanguageSelector 
          language={language} 
          onChange={(lang) => {
            setLanguage(lang);
            setCode(DEFAULT_CODE[lang]);
          }} 
        />
      </header>
      
      <div className="main-content">
        <div className="editor-panel">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              
              // Add breakpoint decorations
              const updateBreakpointDecorations = () => {
                const decorations = executionState.breakpoints.map(lineNumber => ({
                  range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                  options: {
                    glyphMarginClassName: 'breakpoint-glyph',
                    glyphMarginHoverMessage: { value: 'Breakpoint' }
                  }
                }));
                editor.deltaDecorations([], decorations);
              };

              editor.onMouseDown((e) => {
                if (e.target.type === 6) { // Gutter element
                  const lineNumber = e.target.position.lineNumber;
                  toggleBreakpoint(lineNumber);
                  // Update decorations after toggle
                  setTimeout(updateBreakpointDecorations, 0);
                }
              });

              // Initial decoration setup
              updateBreakpointDecorations();
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              glyphMargin: true,
              lineNumbers: 'on',
              automaticLayout: true
            }}
          />
        </div>
        
        <div className="visualization-panel">
          <div className="visualization-scroll-container">
            <ControlPanel
              onRun={executeCode}
              onStep={executeStep}
              onPause={() => setIsRunning(false)}
              onReset={() => setExecutionState({
                steps: [],
                currentStep: -1,
                variables: {},
                callStack: ['global'],
                output: [],
                breakpoints: []
              })}
              speed={speed}
              onSpeedChange={setSpeed}
              isRunning={isRunning}
            />
            
            <ExecutionTimeline 
              steps={executionState.steps}
              currentStep={executionState.currentStep}
              onStepSelect={(step) => setExecutionState(prev => ({
                ...prev,
                currentStep: step
              }))}
            />
            
            <div className="inspector-grid">
              <VariableInspector variables={executionState.variables} />
              <CallStack stack={executionState.callStack} />
            </div>
            
            <OutputPanel output={executionState.output} />
            
            <BreakpointManager 
              breakpoints={executionState.breakpoints}
              onToggle={toggleBreakpoint}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;