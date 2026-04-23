(function registerRenderer(global) {
  const bus = global.Square.core.bus;
  const selectors = global.Square.system.selectors;
  const i18n = global.Square.ui.i18n;
  let lastLocale = null;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderDashboard(state) {
    const summary = selectors.getDashboardSummary(state);
    const currentUser = summary.currentUser;
    const locale = i18n.getLocale(state);
    const userOptions = state.users.map(function option(user) {
      return '<option value="' + user.id + '"' + (user.id === currentUser.id ? " selected" : "") + ">" + escapeHtml(user.name) + "</option>";
    }).join("");
    const localeOptions = i18n.getSupportedLocales().map(function option(localeCode) {
      return '<option value="' + localeCode + '"' + (localeCode === locale ? " selected" : "") + ">" + escapeHtml(i18n.getLocaleLabel(localeCode)) + "</option>";
    }).join("");
    return '' +
      '<div class="stack">' +
        '<label>' +
          escapeHtml(i18n.t("languageLabel", { locale: locale })) +
          '<select data-action="select-locale">' + localeOptions + '</select>' +
        '</label>' +
        '<label>' +
          escapeHtml(i18n.t("activeUser", { locale: locale })) +
          '<select data-action="select-user">' + userOptions + '</select>' +
        '</label>' +
        '<div class="metrics">' +
          '<div class="metric"><span class="small">' + escapeHtml(i18n.t("availableWeight", { locale: locale })) + '</span><strong>' + currentUser.availableWeight + '</strong></div>' +
          '<div class="metric"><span class="small">' + escapeHtml(i18n.t("lockedWeight", { locale: locale })) + '</span><strong>' + currentUser.lockedWeight + '</strong></div>' +
          '<div class="metric"><span class="small">' + escapeHtml(i18n.t("reputation", { locale: locale })) + '</span><strong>' + currentUser.reputation + '</strong></div>' +
          '<div class="metric"><span class="small">' + escapeHtml(i18n.t("activeResolutions", { locale: locale })) + '</span><strong>' + summary.activeResolutions.length + '</strong></div>' +
        '</div>' +
        '<div class="actions">' +
          '<button type="button" class="secondary" data-action="reset-system">' + escapeHtml(i18n.t("resetDemoState", { locale: locale })) + '</button>' +
        '</div>' +
        '</div>';
  }

  function syncHeroLocaleOptions(locale) {
    const select = document.querySelector("#locale-select");

    if (!select) {
      return;
    }

    select.innerHTML = i18n.getSupportedLocales().map(function option(localeCode) {
      return '<option value="' + localeCode + '"' + (localeCode === locale ? " selected" : "") + ">" + escapeHtml(i18n.getLocaleLabel(localeCode)) + "</option>";
    }).join("");
  }

  function renderDeclarationForm(state) {
    const locale = i18n.getLocale(state);
    return '' +
      '<form id="create-declaration-form">' +
        '<label>' + escapeHtml(i18n.t("formTitle", { locale: locale })) + '<input name="title" maxlength="80" required /></label>' +
        '<label>' + escapeHtml(i18n.t("formDescription", { locale: locale })) + '<textarea name="description" maxlength="240" required></textarea></label>' +
        '<label>' + escapeHtml(i18n.t("formRequestedWeight", { locale: locale })) + '<input name="requestedWeight" type="number" min="1" max="99" required value="3" /></label>' +
        '<button type="submit">' + escapeHtml(i18n.t("createDraftDeclaration", { locale: locale })) + '</button>' +
      '</form>';
  }

  function renderMyDeclarations(state) {
    const myDeclarations = selectors.getCurrentUserDeclarations(state);
    const locale = i18n.getLocale(state);

    if (!myDeclarations.length) {
      return '<div class="empty">' + escapeHtml(i18n.t("noDeclarations", { locale: locale })) + '</div>';
    }

    return '<div class="list">' + myDeclarations.map(function card(declaration) {
      const intents = selectors.getIntentsForDeclaration(state, declaration.id);
      const acceptedIntent = selectors.getAcceptedIntent(state, declaration);
      const acceptedResolver = acceptedIntent ? selectors.getUser(state, acceptedIntent.resolverId) : null;
      const hasActiveIntent = intents.some(function active(intent) {
        return intent.status === "proposed" || intent.status === "accepted";
      });

      return '' +
        '<article class="card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>' + escapeHtml(declaration.title) + '</h3>' +
              '<p class="muted">' + escapeHtml(declaration.description) + '</p>' +
            '</div>' +
            '<span class="pill' + (declaration.status === "completed" ? " success" : "") + '">' + escapeHtml(i18n.tStatus(declaration.status, locale)) + '</span>' +
          '</div>' +
          '<div class="meta">' +
            '<span>' + escapeHtml(i18n.t("requestedLabel", { locale: locale })) + ' ' + declaration.requestedWeight + '</span>' +
            '<span>' + escapeHtml(i18n.t("committedLabel", { locale: locale })) + ' ' + declaration.committedWeight + '</span>' +
            '<span>' + intents.length + ' ' + escapeHtml(i18n.tCount("intentCount", intents.length, locale)) + '</span>' +
          '</div>' +
          '<div class="actions">' +
            (declaration.status === "draft"
              ? '<button type="button" data-action="commit-declaration" data-id="' + declaration.id + '">' + escapeHtml(i18n.t("commitWeight", { locale: locale })) + '</button>'
              : "") +
            ((declaration.status === "draft" || declaration.status === "committed") && !hasActiveIntent
              ? '<button type="button" class="ghost" data-action="cancel-declaration" data-id="' + declaration.id + '">' + escapeHtml(i18n.t("cancel", { locale: locale })) + '</button>'
              : "") +
            (acceptedIntent && acceptedIntent.status === "accepted"
              ? '<button type="button" class="secondary" data-action="complete-intent" data-id="' + declaration.id + '">' + escapeHtml(i18n.t("markComplete", { locale: locale })) + '</button>'
              : "") +
          '</div>' +
          (intents.length
            ? '<div class="list">' + intents.map(function intentRow(intent) {
              const resolver = selectors.getUser(state, intent.resolverId);
              return '' +
                '<div class="card">' +
                  '<div class="card-top">' +
                    '<div>' +
                      '<strong>' + escapeHtml(resolver.name) + '</strong>' +
                      '<p class="muted">' + escapeHtml(intent.note) + '</p>' +
                    '</div>' +
                    '<span class="pill' + (intent.status === "completed" ? " success" : "") + '">' + escapeHtml(i18n.tStatus(intent.status, locale)) + '</span>' +
                  '</div>' +
                  '<div class="actions">' +
                    (intent.status === "proposed"
                      ? '<button type="button" data-action="accept-intent" data-declaration-id="' + declaration.id + '" data-intent-id="' + intent.id + '">' + escapeHtml(i18n.t("accept", { locale: locale })) + '</button>'
                      : "") +
                    (intent.status === "accepted" && acceptedResolver
                      ? '<span class="small">' + escapeHtml(i18n.t("acceptedResolver", { locale: locale, params: { name: acceptedResolver.name } })) + '</span>'
                      : "") +
                  '</div>' +
                '</div>';
            }).join("") + '</div>'
            : "") +
        '</article>';
    }).join("") + '</div>';
  }

  function renderBoard(state) {
    const currentUser = selectors.getCurrentUser(state);
    const locale = i18n.getLocale(state);
    const declarations = selectors.getBoardDeclarations(state).filter(function notMine(declaration) {
      return declaration.ownerId !== currentUser.id;
    });

    if (!declarations.length) {
      return '<div class="empty">' + escapeHtml(i18n.t("noOpenDeclarations", { locale: locale })) + '</div>';
    }

    return '<div class="list">' + declarations.map(function card(declaration) {
      const owner = selectors.getUser(state, declaration.ownerId);
      const intents = selectors.getIntentsForDeclaration(state, declaration.id);
      const alreadyApplied = intents.some(function mine(intent) {
        return intent.resolverId === currentUser.id && intent.status !== "rejected";
      });

      return '' +
        '<article class="card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>' + escapeHtml(declaration.title) + '</h3>' +
              '<p class="muted">' + escapeHtml(declaration.description) + '</p>' +
            '</div>' +
            '<span class="pill">' + declaration.committedWeight + ' ' + escapeHtml(i18n.t("formRequestedWeight", { locale: locale }).toLowerCase()) + '</span>' +
          '</div>' +
          '<div class="meta">' +
            '<span>' + escapeHtml(i18n.t("ownerLabel", { locale: locale })) + ' ' + escapeHtml(owner.name) + '</span>' +
            '<span>' + escapeHtml(i18n.t("reputation", { locale: locale }).toLowerCase()) + ' ' + owner.reputation + '</span>' +
            '<span>' + escapeHtml(i18n.t("statusLabel", { locale: locale })) + ' ' + escapeHtml(i18n.tStatus(declaration.status, locale)) + '</span>' +
          '</div>' +
          '<form data-action-form="submit-intent" data-id="' + declaration.id + '">' +
            '<label>' + escapeHtml(i18n.t("yourResolutionNote", { locale: locale })) + '<textarea name="note" maxlength="180" required placeholder="' + escapeHtml(i18n.t("resolutionPlaceholder", { locale: locale })) + '"></textarea></label>' +
            '<button type="submit"' + (alreadyApplied ? " disabled" : "") + '>' + escapeHtml(i18n.t(alreadyApplied ? "intentAlreadySubmitted" : "submitResolutionIntent", { locale: locale })) + '</button>' +
          '</form>' +
        '</article>';
    }).join("") + '</div>';
  }

  function renderPlan(state) {
    const plans = selectors.getCurrentUserPlans(state);
    const locale = i18n.getLocale(state);

    if (!plans.length) {
      return '<div class="empty">' + escapeHtml(i18n.t("noPlan", { locale: locale })) + '</div>';
    }

    return '<div class="list">' + plans.map(function row(plan, index) {
      return '' +
        '<article class="card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>#' + plan.priority + " " + escapeHtml(plan.declaration.title) + '</h3>' +
              '<p class="muted">' + escapeHtml(plan.declaration.description) + '</p>' +
            '</div>' +
            '<span class="pill' + (plan.declaration.status === "completed" ? " success" : "") + '">' + escapeHtml(i18n.tStatus(plan.declaration.status, locale)) + '</span>' +
          '</div>' +
          '<div class="meta">' +
            '<span>' + escapeHtml(i18n.t("modeLabel", { locale: locale })) + ' ' + escapeHtml(i18n.tMode(plan.mode, locale)) + '</span>' +
            '<span>' + escapeHtml(i18n.t("requestLabel", { locale: locale })) + ' ' + plan.declaration.requestedWeight + '</span>' +
          '</div>' +
          '<div class="actions">' +
            '<button type="button" class="ghost" data-action="move-plan-up" data-id="' + plan.id + '"' + (index === 0 ? " disabled" : "") + '>' + escapeHtml(i18n.t("moveUp", { locale: locale })) + '</button>' +
            '<button type="button" class="ghost" data-action="move-plan-down" data-id="' + plan.id + '"' + (index === plans.length - 1 ? " disabled" : "") + '>' + escapeHtml(i18n.t("moveDown", { locale: locale })) + '</button>' +
          '</div>' +
        '</article>';
    }).join("") + '</div>';
  }

  function renderActivity(state) {
    const items = state.activityLog.slice(0, 20);
    const locale = i18n.getLocale(state);

    if (!items.length) {
      return '<div class="empty">' + escapeHtml(i18n.t("noActivity", { locale: locale })) + '</div>';
    }

    return '<div class="log-list">' + items.map(function item(entry) {
      return '' +
        '<div class="log-item">' +
          '<strong>' + escapeHtml(i18n.tLog(entry, locale)) + '</strong>' +
          '<div class="small">' + escapeHtml(entry.type) + " | " + escapeHtml(i18n.formatDate(entry.createdAt, locale)) + '</div>' +
        '</div>';
    }).join("") + '</div>';
  }

  function renderApp(state) {
    const locale = i18n.getLocale(state);

    i18n.applyStaticText(locale);
    syncHeroLocaleOptions(locale);

    if (lastLocale !== locale) {
      lastLocale = locale;
      bus.emit("locale:changed", { locale: locale });
    }

    document.querySelector("#dashboard").innerHTML = renderDashboard(state);
    document.querySelector("#declaration-form").innerHTML = renderDeclarationForm(state);
    document.querySelector("#my-declarations").innerHTML = renderMyDeclarations(state);
    document.querySelector("#board").innerHTML = renderBoard(state);
    document.querySelector("#plan").innerHTML = renderPlan(state);
    document.querySelector("#activity").innerHTML = renderActivity(state);
  }

  bus.on("state:changed", function onStateChanged(payload) {
    renderApp(payload.state);
  });

  global.Square.ui = global.Square.ui || {};
  global.Square.ui.renderApp = renderApp;
})(window);
