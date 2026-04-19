(function registerEventBus(global) {
  const listeners = new Map();

  function on(eventName, handler) {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
    }

    listeners.get(eventName).add(handler);

    return function unsubscribe() {
      listeners.get(eventName)?.delete(handler);
    };
  }

  function emit(eventName, payload) {
    const handlers = listeners.get(eventName);

    if (!handlers) {
      return;
    }

    handlers.forEach(function invoke(handler) {
      handler(payload);
    });
  }

  global.Square.bus = { on, emit };
})(window);
