(function registerTemplate(global) {
  const vendor = global.Square.vendor || {};
  const jsep = vendor.jsep;
  function evaluateExpression(expression, scope) {
    const ast = jsep(expression);

    function evaluate(node) {
      switch (node.type) {
        case "Literal":
          return node.value;
        case "Identifier":
          return scope[node.name];
        case "MemberExpression": {
          const target = evaluate(node.object);
          const key = node.computed ? evaluate(node.property) : node.property.name;
          return target == null ? undefined : target[key];
        }
        case "BinaryExpression": {
          const left = evaluate(node.left);
          const right = evaluate(node.right);
          switch (node.operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
            default: throw new Error("Unsupported operator: " + node.operator);
          }
        }
        default:
          throw new Error("Unsupported expression node: " + node.type);
      }
    }

    return evaluate(ast);
  }

  function interpolate(template, scope) {
    return String(template).replace(/\{([^{}]+)\}/g, function replace(match, expression) {
      const value = evaluateExpression(expression.trim(), scope);
      return value == null ? "" : String(value);
    });
  }

  global.Square.core.template = { evaluateExpression, interpolate };
})(window);
