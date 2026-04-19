(function registerSelectors(global) {
  function byPriority(a, b) {
    return a.priority - b.priority;
  }

  function getUser(state, userId) {
    return state.users.find(function findUser(user) {
      return user.id === userId;
    });
  }

  function getCurrentUser(state) {
    return getUser(state, state.currentUserId);
  }

  function getDeclaration(state, declarationId) {
    return state.declarations.find(function findDeclaration(declaration) {
      return declaration.id === declarationId;
    });
  }

  function getIntentsForDeclaration(state, declarationId) {
    return state.resolutionIntents.filter(function matches(intent) {
      return intent.declarationId === declarationId;
    });
  }

  function getAcceptedIntent(state, declaration) {
    if (!declaration.acceptedIntentId) {
      return null;
    }

    return state.resolutionIntents.find(function findIntent(intent) {
      return intent.id === declaration.acceptedIntentId;
    }) || null;
  }

  function getBoardDeclarations(state) {
    return state.declarations
      .filter(function visible(declaration) {
        return declaration.status === "committed" || declaration.status === "locked";
      })
      .sort(function sortDeclarations(left, right) {
        if (right.committedWeight !== left.committedWeight) {
          return right.committedWeight - left.committedWeight;
        }

        const leftOwner = getUser(state, left.ownerId);
        const rightOwner = getUser(state, right.ownerId);
        return (rightOwner?.reputation || 0) - (leftOwner?.reputation || 0);
      });
  }

  function getCurrentUserDeclarations(state) {
    return state.declarations.filter(function owned(declaration) {
      return declaration.ownerId === state.currentUserId;
    });
  }

  function getCurrentUserPlans(state) {
    return state.acquisitionPlans
      .filter(function owned(plan) {
        return plan.userId === state.currentUserId;
      })
      .sort(byPriority)
      .map(function enrich(plan) {
        return {
          ...plan,
          declaration: getDeclaration(state, plan.declarationId)
        };
      })
      .filter(function keep(plan) {
        return Boolean(plan.declaration);
      });
  }

  function getActiveResolutions(state) {
    return state.resolutionIntents.filter(function active(intent) {
      return intent.resolverId === state.currentUserId && intent.status !== "rejected" && intent.status !== "completed";
    });
  }

  function getDashboardSummary(state) {
    const currentUser = getCurrentUser(state);
    const myDeclarations = getCurrentUserDeclarations(state);
    const activeResolutions = getActiveResolutions(state);

    return {
      currentUser,
      myDeclarations,
      activeResolutions,
      committedCount: myDeclarations.filter(function committed(item) {
        return item.status === "committed" || item.status === "locked";
      }).length
    };
  }

  global.Square.system.selectors = {
    getUser,
    getCurrentUser,
    getDeclaration,
    getIntentsForDeclaration,
    getAcceptedIntent,
    getBoardDeclarations,
    getCurrentUserDeclarations,
    getCurrentUserPlans,
    getActiveResolutions,
    getDashboardSummary
  };
})(window);
