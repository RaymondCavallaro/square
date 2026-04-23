(function registerClone(global) {
  function clone(value) {
	if (!value) {
      return null;
	}
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
  
    return JSON.parse(JSON.stringify(value));
  }

  global.Square.core.clone = clone;
})(window);
