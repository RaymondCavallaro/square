(function registerActions(global) {
  const bus = global.Square.core.bus;
  const store = global.Square.system.store;
  const selectors = global.Square.system.selectors;

  function now() {
    return new Date().toISOString();
  }

  function createId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  function normalizeText(value) {
    return String(value || "").trim();
  }

  function normalizeClaimFields(payload) {
    return {
      title: normalizeText(payload.title),
      description: normalizeText(payload.description),
      requestedWeight: Math.max(1, Number(payload.requestedWeight || 0)),
      intent: {
        summary: normalizeText(payload.title),
        details: normalizeText(payload.description)
      },
      context: {
        scope: normalizeText(payload.contextScope),
        notes: normalizeText(payload.contextNotes)
      },
      evaluation: {
        check: normalizeText(payload.evaluationCheck),
        confirmer: normalizeText(payload.evaluationConfirmer),
        evidence: normalizeText(payload.evaluationEvidence)
      }
    };
  }

  function applyClaimFields(target, fields) {
    target.title = fields.title;
    target.description = fields.description;
    target.requestedWeight = fields.requestedWeight;
    target.intent = fields.intent;
    target.context = fields.context;
    target.evaluation = fields.evaluation;
  }

  function deriveDraftStatus(declaration, requestedMode) {
    const structure = selectors.getStructuredFieldState({ 
      intent: declaration.intent,
      context: declaration.context,
      evaluation: declaration.evaluation
    });

    if (requestedMode === "projected" && structure.isStructured) {
      return "projected";
    }

    if (declaration.status === "projected" && structure.isStructured && requestedMode !== "draft") {
      return "projected";
    }

    return "draft";
  }

  function pushLog(state, payload, type) {
    const entry = typeof payload === "string"
      ? { message: payload }
      : payload;

    state.activityLog.unshift({
      id: createId("log"),
      type: type || "event",
      message: entry.message,
      messageKey: entry.messageKey,
      messageParams: entry.messageParams || null,
      createdAt: now()
    });
  }

  function reorderPlans(state, userId) {
    const plans = state.acquisitionPlans
      .filter(function owned(plan) {
        return plan.userId === userId;
      })
      .sort(function sortPlans(left, right) {
        return left.priority - right.priority;
      });

    plans.forEach(function rewrite(plan, index) {
      plan.priority = index + 1;
    });
  }

  function clearByPlan(state, userId) {
    const user = selectors.getUser(state, userId);

    if (!user) {
      return;
    }

    const plans = state.acquisitionPlans
      .filter(function owned(plan) {
        return plan.userId === userId;
      })
      .sort(function sortPlans(left, right) {
        return left.priority - right.priority;
      });

    plans.forEach(function applyPlan(plan) {
      const declaration = selectors.getDeclaration(state, plan.declarationId);

      if (!declaration || declaration.status === "resolved" || declaration.status === "canceled") {
        return;
      }

      if (user.availableWeight >= declaration.requestedWeight && declaration.status === "projected") {
        user.availableWeight -= declaration.requestedWeight;
        declaration.committedWeight = declaration.requestedWeight;
        declaration.status = "committed";
        pushLog(state, {
          messageKey: "logAutoCommit",
          messageParams: { user: user.name, title: declaration.title }
        }, "auto-commit");
      }
    });
  }

  function initialize() {
    bus.emit("state:changed", {
      state: store.getState(),
      meta: { type: "initialize" }
    });
  }

  bus.on("app:initialize", initialize);

  bus.on("user:selected", function handleUserSelected(payload) {
    store.setState(function update(state) {
      state.currentUserId = payload.userId;
      return state;
    }, { type: "user-selected" });
  });

  bus.on("locale:selected", function handleLocaleSelected(payload) {
    store.setState(function update(state) {
      state.locale = payload.locale;
      return state;
    }, { type: "locale-selected" });
  });

  bus.on("system:reset", async function handleReset() {
    await store.reset();
  });

  bus.on("declaration:create", function handleDeclarationCreate(payload) {
    store.setState(function update(state) {
      const fields = normalizeClaimFields(payload);

      if (!fields.title) {
        return state;
      }

      const declaration = {
        id: createId("dec"),
        ownerId: state.currentUserId,
        title: fields.title,
        description: fields.description,
        intent: fields.intent,
        context: fields.context,
        evaluation: fields.evaluation,
        requestedWeight: fields.requestedWeight,
        committedWeight: 0,
        status: "draft",
        acceptedIntentId: null,
        createdAt: now()
      };
      declaration.status = deriveDraftStatus(declaration, payload.mode);

      state.declarations.unshift(declaration);
      state.acquisitionPlans.push({
        id: createId("plan"),
        userId: state.currentUserId,
        declarationId: declaration.id,
        priority: state.acquisitionPlans.filter(function owned(plan) {
          return plan.userId === state.currentUserId;
        }).length + 1,
        mode: "series"
      });

      const user = selectors.getCurrentUser(state);
      pushLog(state, {
        messageKey: "logDeclarationCreated",
        messageParams: { user: user.name, title: declaration.title }
      }, "declaration-created");
      if (declaration.status === "projected") {
        pushLog(state, {
          messageKey: "logDeclarationProjected",
          messageParams: { user: user.name, title: declaration.title }
        }, "declaration-projected");
      }
      return state;
    }, { type: "declaration-created" });
  });

  bus.on("declaration:update", function handleDeclarationUpdate(payload) {
    store.setState(function update(state) {
      const declaration = selectors.getDeclaration(state, payload.declarationId);
      const user = selectors.getCurrentUser(state);
      const fields = normalizeClaimFields(payload);

      if (!declaration || declaration.ownerId !== user.id) {
        return state;
      }

      if (!(declaration.status === "draft" || declaration.status === "projected")) {
        return state;
      }

      if (!fields.title) {
        return state;
      }

      applyClaimFields(declaration, fields);
      declaration.status = deriveDraftStatus(declaration, payload.mode);

      pushLog(state, {
        messageKey: declaration.status === "projected" ? "logDeclarationProjected" : "logDeclarationUpdated",
        messageParams: { user: user.name, title: declaration.title }
      }, declaration.status === "projected" ? "declaration-projected" : "declaration-updated");
      return state;
    }, { type: "declaration-updated" });
  });

  bus.on("declaration:commit", function handleDeclarationCommit(payload) {
    store.setState(function update(state) {
      const declaration = selectors.getDeclaration(state, payload.declarationId);
      const user = selectors.getCurrentUser(state);

      if (!declaration || declaration.ownerId !== user.id || declaration.status !== "projected") {
        return state;
      }

      if (user.availableWeight < declaration.requestedWeight) {
        pushLog(state, {
          messageKey: "logCommitBlocked",
          messageParams: { user: user.name, title: declaration.title }
        }, "commit-blocked");
        return state;
      }

      user.availableWeight -= declaration.requestedWeight;
      declaration.committedWeight = declaration.requestedWeight;
      declaration.status = "committed";
      pushLog(state, {
        messageKey: "logDeclarationCommitted",
        messageParams: { user: user.name, title: declaration.title, weight: declaration.committedWeight }
      }, "declaration-committed");
      return state;
    }, { type: "declaration-committed" });
  });

  bus.on("declaration:cancel", function handleDeclarationCancel(payload) {
    store.setState(function update(state) {
      const declaration = selectors.getDeclaration(state, payload.declarationId);
      const user = selectors.getCurrentUser(state);

      if (!declaration || declaration.ownerId !== user.id) {
        return state;
      }

      const hasActiveIntent = selectors.getIntentsForDeclaration(state, declaration.id).some(function active(intent) {
        return intent.status === "proposed" || intent.status === "accepted";
      });

      if (hasActiveIntent) {
        pushLog(state, {
          messageKey: "logCancelBlocked",
          messageParams: { title: declaration.title }
        }, "cancel-blocked");
        return state;
      }

      user.availableWeight += declaration.committedWeight;
      declaration.committedWeight = 0;
      declaration.status = "canceled";
      pushLog(state, {
        messageKey: "logDeclarationCanceled",
        messageParams: { user: user.name, title: declaration.title }
      }, "declaration-canceled");
      return state;
    }, { type: "declaration-canceled" });
  });

  bus.on("intent:create", function handleIntentCreate(payload) {
    store.setState(function update(state) {
      const declaration = selectors.getDeclaration(state, payload.declarationId);
      const resolver = selectors.getCurrentUser(state);

      if (!declaration || declaration.ownerId === resolver.id) {
        return state;
      }

      if (declaration.status !== "committed") {
        return state;
      }

      const duplicate = state.resolutionIntents.find(function existing(intent) {
        return intent.declarationId === declaration.id && intent.resolverId === resolver.id && intent.status !== "rejected";
      });

      if (duplicate) {
        return state;
      }

      state.resolutionIntents.unshift({
        id: createId("intent"),
        declarationId: declaration.id,
        resolverId: resolver.id,
        note: normalizeText(payload.note),
        status: "proposed",
        createdAt: now()
      });

      pushLog(state, {
        messageKey: "logIntentCreated",
        messageParams: { user: resolver.name, title: declaration.title }
      }, "intent-created");
      return state;
    }, { type: "intent-created" });
  });

  bus.on("intent:accept", function handleIntentAccept(payload) {
    store.setState(function update(state) {
      const declaration = selectors.getDeclaration(state, payload.declarationId);
      const owner = selectors.getCurrentUser(state);
      const intent = state.resolutionIntents.find(function findIntent(item) {
        return item.id === payload.intentId;
      });

      if (!declaration || !intent || declaration.ownerId !== owner.id) {
        return state;
      }

      state.resolutionIntents.forEach(function updateIntent(item) {
        if (item.declarationId === declaration.id && item.status === "proposed") {
          item.status = item.id === intent.id ? "accepted" : "rejected";
        }
      });

      declaration.acceptedIntentId = intent.id;
      declaration.status = "in_progress";
      intent.acceptedAt = now();
      const resolver = selectors.getUser(state, intent.resolverId);
      pushLog(state, {
        messageKey: "logIntentAccepted",
        messageParams: { owner: owner.name, resolver: resolver.name, title: declaration.title }
      }, "intent-accepted");
      return state;
    }, { type: "intent-accepted" });
  });

  bus.on("intent:complete", function handleIntentComplete(payload) {
    store.setState(function update(state) {
      const declaration = selectors.getDeclaration(state, payload.declarationId);
      const owner = selectors.getCurrentUser(state);

      if (!declaration || declaration.ownerId !== owner.id || !declaration.acceptedIntentId) {
        return state;
      }

      const intent = state.resolutionIntents.find(function findIntent(item) {
        return item.id === declaration.acceptedIntentId;
      });

      if (!intent || intent.status !== "accepted" || declaration.status !== "in_progress") {
        return state;
      }

      const resolver = selectors.getUser(state, intent.resolverId);
      intent.status = "completed";
      intent.completedAt = now();
      declaration.status = "resolved";
      resolver.availableWeight += declaration.committedWeight;
      resolver.reputation += 1;

      pushLog(state, {
        messageKey: "logIntentCompleted",
        messageParams: { resolver: resolver.name, title: declaration.title, weight: declaration.committedWeight }
      }, "intent-completed");

      clearByPlan(state, resolver.id);
      return state;
    }, { type: "intent-completed" });
  });

  bus.on("plan:move", function handlePlanMove(payload) {
    store.setState(function update(state) {
      const myPlans = state.acquisitionPlans
        .filter(function owned(plan) {
          return plan.userId === state.currentUserId;
        })
        .sort(function sortPlans(left, right) {
          return left.priority - right.priority;
        });

      const index = myPlans.findIndex(function findPlan(plan) {
        return plan.id === payload.planId;
      });

      if (index < 0) {
        return state;
      }

      const targetIndex = payload.direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= myPlans.length) {
        return state;
      }

      const currentPriority = myPlans[index].priority;
      myPlans[index].priority = myPlans[targetIndex].priority;
      myPlans[targetIndex].priority = currentPriority;
      reorderPlans(state, state.currentUserId);

      return state;
    }, { type: "plan-moved" });
  });
})(window);
