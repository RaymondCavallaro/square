(function registerStore(global) {
  const STORAGE_KEY = "square-mini-system-state";
  const bus = global.Square.core.bus;
  const clone = global.Square.core.clone;
  let state = null;
  let initialState = {};

  function loadStateFromLocalStorage() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        return JSON.parse(raw);
      }
    } catch (error) {
      console.warn("Unable to load saved state.", error);
    }

    return null;
  }

  function normalizeStateShape(inputState) {
    const nextState = inputState || {};

    if (!nextState.locale) {
      nextState.locale = initialState.locale;
    }

    return nextState;
  }

  function saveState() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function reconcileUserWeight() {
    if (!state) {
      return;
    }

    state.users = state.users.map(function reconcile(user) {
      const lockedWeight = state.declarations
        .filter(function owned(declaration) {
          return (
            declaration.ownerId === user.id &&
            declaration.status !== "canceled" &&
            declaration.status !== "completed"
          );
        })
        .reduce(function sum(total, declaration) {
          return total + declaration.committedWeight;
        }, 0);

      return {
        ...user,
        lockedWeight
      };
    });
  }

  function getState() {
    return clone(state);
  }

  async function initialize(options) {
    const settings = options || {};
    initialState = clone(settings.initial || {});

    const localState = loadStateFromLocalStorage();

    if (!localState) {
      state = initialState;
    } else {
      state = normalizeStateShape(localState);
    }

    reconcileUserWeight();
    saveState();
    return getState();
  }

  function setState(updater, meta) {
    const nextState = typeof updater === "function" ? updater(clone(state)) : updater;
    state = normalizeStateShape(nextState);
    reconcileUserWeight();
    saveState();
    bus.emit("state:changed", {
      state: getState(),
      meta: meta || null
    });
  }

  async function reset() {
    const localState = loadStateFromLocalStorage();

    if (!localState) {
      state = initialState;
    } else {
      state = normalizeStateShape(localState);
    }

    reconcileUserWeight();
    saveState();
    bus.emit("state:changed", {
      state: getState(),
      meta: { type: "system-reset" }
    });
  }

  global.Square.system.store = {
    initialize,
    getState,
    setState,
    reset
  };
})(window);
