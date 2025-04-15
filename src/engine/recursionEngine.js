let callStack = [];

function pushToStack(functionName, args) {
  callStack.push({ functionName, args });
  console.log('Pushed to stack:', functionName, args);
}

function popFromStack() {
  const popped = callStack.pop();
  console.log('Popped from stack:', popped);
}

export { pushToStack, popFromStack };
