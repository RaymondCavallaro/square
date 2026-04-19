(function registerStore(global) {
  const STORAGE_KEY = "square-mini-system-state";
  const bus = global.Square.bus;
  let state = null;
  let resetSource = {
    type: "json",
    path: "./app/mock-state.json"
  };

  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  }

  async function loadStateFromJson(path) {
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load JSON state from " + path);
    }

    return response.json();
  }

  function loadStateFromEmbedded(embeddedState) {
    if (!embeddedState) {
      return null;
    }

    return clone(embeddedState);
  }

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
      nextState.locale = "pt-BR";
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
    const source = settings.source || "localStorage";
    const jsonPath = settings.jsonPath || "./app/mock-state.json";
    const embeddedState = settings.embeddedState || null;

    resetSource = {
      type: source === "localStorage" ? "localStorage-or-json" : "json",
      path: jsonPath,
      embeddedState: embeddedState
    };

    if (source === "localStorage") {
      const localState = loadStateFromLocalStorage();

      if (localState) {
        state = normalizeStateShape(localState);
      } else {
        try {
          state = normalizeStateShape(await loadStateFromJson(jsonPath));
        } catch (error) {
          const fallbackState = loadStateFromEmbedded(embeddedState);

          if (!fallbackState) {
            throw error;
          }

          state = normalizeStateShape(fallbackState);
        }
      }
    } else {
      try {
        state = normalizeStateShape(await loadStateFromJson(jsonPath));
      } catch (error) {
        const fallbackState = loadStateFromEmbedded(embeddedState);

        if (!fallbackState) {
          throw error;
        }

        state = normalizeStateShape(fallbackState);
      }
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
    if (resetSource.type === "localStorage-or-json") {
      state = normalizeStateShape(loadStateFromLocalStorage());

      if (!state) {
        try {
          state = normalizeStateShape(await loadStateFromJson(resetSource.path));
        } catch (error) {
          const fallbackState = loadStateFromEmbedded(resetSource.embeddedState);

          if (!fallbackState) {
            throw error;
          }

          state = normalizeStateShape(fallbackState);
        }
      }
    } else {
      try {
        state = normalizeStateShape(await loadStateFromJson(resetSource.path));
      } catch (error) {
        const fallbackState = loadStateFromEmbedded(resetSource.embeddedState);

        if (!fallbackState) {
          throw error;
        }

        state = normalizeStateShape(fallbackState);
      }
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
