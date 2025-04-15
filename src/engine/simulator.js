// src/engine/simulator.js
export function executeStep(currentState) {
  if (currentState.currentStep >= currentState.steps.length - 1) {
    return { ...currentState, isRunning: false };
  }

  const nextStep = currentState.currentStep + 1;
  const step = currentState.steps[nextStep];
  
  // Create new state
  const newState = {
    ...currentState,
    currentStep: nextStep,
    variables: { ...currentState.variables },
    callStack: [...currentState.callStack],
    output: [...currentState.output]
  };

  // Process the current step
  if (step.node.type === 'VariableDeclarator') {
    newState.variables[step.node.id.name] = evaluateExpression(step.node.init, newState.variables);
  }
  
  // Add more processing logic as needed...

  return newState;
}