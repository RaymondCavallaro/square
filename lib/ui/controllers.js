(function registerControllers(global) {
  const bus = global.Square.core.bus;

  function closestActionTarget(event, actionName) {
    return event.target.closest('[data-action="' + actionName + '"]');
  }

  document.addEventListener("change", function handleChange(event) {
    const select = event.target.closest('[data-action="select-user"]');
    const localeSelect = event.target.closest('[data-action="select-locale"]');

    if (select) {
      bus.emit("user:selected", { userId: select.value });
      return;
    }

    if (localeSelect) {
      bus.emit("locale:selected", { locale: localeSelect.value });
    }
  });

  document.addEventListener("click", function handleClick(event) {
    const resetButton = closestActionTarget(event, "reset-system");
    const commitButton = closestActionTarget(event, "commit-declaration");
    const cancelButton = closestActionTarget(event, "cancel-declaration");
    const acceptButton = closestActionTarget(event, "accept-intent");
    const completeButton = closestActionTarget(event, "complete-intent");
    const moveUpButton = closestActionTarget(event, "move-plan-up");
    const moveDownButton = closestActionTarget(event, "move-plan-down");

    if (resetButton) {
      bus.emit("system:reset");
      return;
    }

    if (commitButton) {
      bus.emit("declaration:commit", { declarationId: commitButton.dataset.id });
      return;
    }

    if (cancelButton) {
      bus.emit("declaration:cancel", { declarationId: cancelButton.dataset.id });
      return;
    }

    if (acceptButton) {
      bus.emit("intent:accept", {
        declarationId: acceptButton.dataset.declarationId,
        intentId: acceptButton.dataset.intentId
      });
      return;
    }

    if (completeButton) {
      bus.emit("intent:complete", { declarationId: completeButton.dataset.id });
      return;
    }

    if (moveUpButton) {
      bus.emit("plan:move", { planId: moveUpButton.dataset.id, direction: "up" });
      return;
    }

    if (moveDownButton) {
      bus.emit("plan:move", { planId: moveDownButton.dataset.id, direction: "down" });
    }
  });

  document.addEventListener("submit", function handleSubmit(event) {
    const declarationForm = event.target.closest("#create-declaration-form");
    const intentForm = event.target.closest('[data-action-form="submit-intent"]');

    if (declarationForm) {
      event.preventDefault();
      const formData = new FormData(declarationForm);
      const submitter = event.submitter;
      bus.emit("declaration:create", {
        title: formData.get("title"),
        description: formData.get("description"),
        requestedWeight: formData.get("requestedWeight"),
        contextScope: formData.get("contextScope"),
        contextNotes: formData.get("contextNotes"),
        evaluationCheck: formData.get("evaluationCheck"),
        evaluationConfirmer: formData.get("evaluationConfirmer"),
        evaluationEvidence: formData.get("evaluationEvidence"),
        mode: submitter && submitter.value ? submitter.value : "draft"
      });
      declarationForm.reset();
      return;
    }

    const declarationUpdateForm = event.target.closest('[data-action-form="update-declaration"]');

    if (declarationUpdateForm) {
      event.preventDefault();
      const formData = new FormData(declarationUpdateForm);
      const submitter = event.submitter;
      bus.emit("declaration:update", {
        declarationId: declarationUpdateForm.dataset.id,
        title: formData.get("title"),
        description: formData.get("description"),
        requestedWeight: formData.get("requestedWeight"),
        contextScope: formData.get("contextScope"),
        contextNotes: formData.get("contextNotes"),
        evaluationCheck: formData.get("evaluationCheck"),
        evaluationConfirmer: formData.get("evaluationConfirmer"),
        evaluationEvidence: formData.get("evaluationEvidence"),
        mode: submitter && submitter.value ? submitter.value : "draft"
      });
      return;
    }

    if (intentForm) {
      event.preventDefault();
      const formData = new FormData(intentForm);
      bus.emit("intent:create", {
        declarationId: intentForm.dataset.id,
        note: formData.get("note")
      });
      intentForm.reset();
    }
  });
})(window);
