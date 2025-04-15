// src/engine/utils.js
export function getNodeDescription(node) {
    if (!node) return 'Unknown step';
    
    switch (node.type) {
      case 'VariableDeclaration':
        return `Declaring variable: ${node.declarations[0].id.name}`;
      case 'FunctionDeclaration':
        return `Defining function: ${node.id.name}`;
      case 'CallExpression':
        return `Calling function: ${node.callee.name}`;
      case 'ReturnStatement':
        return 'Returning value';
      default:
        return `Executing ${node.type}`;
    }
  }
  
  export function evaluateExpression(node, variables) {
    if (!node) return undefined;
    
    // Handle literals
    if (node.type === 'Literal') {
      return node.value;
    }
    
    // Handle identifiers
    if (node.type === 'Identifier') {
      return variables[node.name];
    }
    
    // Handle binary expressions
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