(function registerStore(global) {
  const STORAGE_KEY = "square-mini-system-state";
  const bus = global.Square.core.bus;
  const clone = global.Square.core.clone;
  let state = null;
  let initialState = {};

  function normalizeDeclarationStatus(declaration) {
    const status = declaration.status;

    if (status === "locked") {
      return declaration.acceptedIntentId ? "in_progress" : "committed";
    }

    if (status === "completed") {
      return "resolved";
    }

    return status || "draft";
  }

  function buildStructuredIntent(declaration) {
    const legacyTitle = String(declaration.title || "").trim();
    const legacyDescription = String(declaration.description || "").trim();

    return {
      summary: declaration.intent && declaration.intent.summary
        ? String(declaration.intent.summary).trim()
        : legacyTitle,
      details: declaration.intent && declaration.intent.details
        ? String(declaration.intent.details).trim()
        : legacyDescription
    };
  }

  function buildStructuredContext(declaration) {
    return {
      scope: declaration.context && declaration.context.scope
        ? String(declaration.context.scope).trim()
        : "",
      notes: declaration.context && declaration.context.notes
        ? String(declaration.context.notes).trim()
        : ""
    };
  }

  function buildStructuredEvaluation(declaration) {
    return {
      check: declaration.evaluation && declaration.evaluation.check
        ? String(declaration.evaluation.check).trim()
        : "",
      confirmer: declaration.evaluation && declaration.evaluation.confirmer
        ? String(declaration.evaluation.confirmer).trim()
        : "",
      evidence: declaration.evaluation && declaration.evaluation.evidence
        ? String(declaration.evaluation.evidence).trim()
        : ""
    };
  }

  function normalizeDeclaration(declaration) {
    const nextDeclaration = clone(declaration || {});

    nextDeclaration.intent = buildStructuredIntent(nextDeclaration);
    nextDeclaration.context = buildStructuredContext(nextDeclaration);
    nextDeclaration.evaluation = buildStructuredEvaluation(nextDeclaration);
    nextDeclaration.title = nextDeclaration.intent.summary;
    nextDeclaration.description = nextDeclaration.intent.details;
    nextDeclaration.requestedWeight = Number(nextDeclaration.requestedWeight || 0);
    nextDeclaration.committedWeight = Number(nextDeclaration.committedWeight || 0);
    nextDeclaration.acceptedIntentId = nextDeclaration.acceptedIntentId || null;
    nextDeclaration.status = normalizeDeclarationStatus(nextDeclaration);

    return nextDeclaration;
  }

  function normalizeIntent(intent) {
    const nextIntent = clone(intent || {});

    if (nextIntent.status === "accepted" && !nextIntent.acceptedAt) {
      nextIntent.acceptedAt = nextIntent.createdAt || null;
    }

    if (nextIntent.status === "completed" && !nextIntent.completedAt) {
      nextIntent.completedAt = nextIntent.acceptedAt || nextIntent.createdAt || null;
    }

    nextIntent.note = String(nextIntent.note || "").trim();
    return nextIntent;
  }

  function normalizePlan(plan) {
    const nextPlan = clone(plan || {});
    nextPlan.priority = Number(nextPlan.priority || 0);
    return nextPlan;
  }

  function normalizeActivity(entry) {
    return clone(entry || {});
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
      nextState.locale = initialState.locale;
    }

    nextState.currentUserId = nextState.currentUserId || initialState.currentUserId || null;
    nextState.users = Array.isArray(nextState.users) ? nextState.users : clone(initialState.users || []);
    nextState.declarations = Array.isArray(nextState.declarations)
      ? nextState.declarations.map(normalizeDeclaration)
      : [];
    nextState.resolutionIntents = Array.isArray(nextState.resolutionIntents)
      ? nextState.resolutionIntents.map(normalizeIntent)
      : [];
    nextState.acquisitionPlans = Array.isArray(nextState.acquisitionPlans)
      ? nextState.acquisitionPlans.map(normalizePlan)
      : [];
    nextState.activityLog = Array.isArray(nextState.activityLog)
      ? nextState.activityLog.map(normalizeActivity)
      : [];

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
            declaration.status !== "resolved"
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
      state = normalizeStateShape(clone(initialState));
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
    state = normalizeStateShape(clone(initialState));

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
