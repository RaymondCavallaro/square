(function registerI18n(global) {
  const DEFAULT_LOCALE = "pt-BR";
  const SUPPORTED_LOCALES = ["pt-BR", "en-US"];

  const translations = {
    "pt-BR": {
      appTitle: "The Square Mini System",
      heroEyebrow: "The Square",
      heroLoading: "Carregando conceito...",
      heroFallbackSummary: "Este mini sistema mantem regras e interface separadas. A camada de sistema gerencia declaracoes, intencoes, peso e planejamento. A interface apenas emite eventos e renderiza estado.",
      dashboardTitle: "Painel",
      dashboardDescription: "Escolha uma pessoa e acompanhe peso, reputacao e trabalho ativo.",
      createDeclarationTitle: "Criar Declaracao",
      createDeclarationDescription: "Rascunhe uma necessidade e comprometa peso quando estiver pronto.",
      myDeclarationsTitle: "Minhas Declaracoes",
      myDeclarationsDescription: "Gerencie suas prioridades, compromissos e resolucoes aceitas.",
      boardTitle: "Quadro De Declaracoes",
      boardDescription: "Declaracoes comprometidas disponiveis para resolucao.",
      planTitle: "Plano De Aquisicao",
      planDescription: "Ordene o que deve ser liberado primeiro conforme o peso volta para voce.",
      activityTitle: "Atividade",
      activityDescription: "Eventos, transferencias e mudancas do sistema ao longo do tempo.",
      languageLabel: "Idioma",
      activeUser: "Pessoa ativa",
      availableWeight: "Peso disponivel",
      lockedWeight: "Peso travado",
      reputation: "Reputacao",
      activeResolutions: "Resolucoes ativas",
      resetDemoState: "Reiniciar estado de demonstracao",
      formTitle: "Titulo",
      formDescription: "Descricao",
      formRequestedWeight: "Peso solicitado",
      createDraftDeclaration: "Criar declaracao em rascunho",
      noDeclarations: "Ainda nao existem declaracoes para esta pessoa.",
      requestedLabel: "solicitado",
      committedLabel: "comprometido",
      intentCount_one: "intencao",
      intentCount_other: "intencoes",
      commitWeight: "Comprometer peso",
      cancel: "Cancelar",
      markComplete: "Marcar como concluido",
      accept: "Aceitar",
      acceptedResolver: "Resolutor aceito: {name}",
      noOpenDeclarations: "Nao existem declaracoes abertas para esta pessoa agora.",
      ownerLabel: "responsavel",
      statusLabel: "estado",
      yourResolutionNote: "Sua nota de resolucao",
      resolutionPlaceholder: "O que voce vai fazer e em quanto tempo?",
      intentAlreadySubmitted: "Intencao ja enviada",
      submitResolutionIntent: "Enviar intencao de resolucao",
      noPlan: "Ainda nao existe plano de aquisicao. Crie uma declaracao e ela aparecera aqui.",
      modeLabel: "modo",
      requestLabel: "pedido",
      moveUp: "Mover para cima",
      moveDown: "Mover para baixo",
      noActivity: "Ainda nao existe atividade.",
      statusDraft: "rascunho",
      statusCommitted: "comprometida",
      statusLocked: "travada",
      statusCompleted: "concluida",
      statusCanceled: "cancelada",
      statusProposed: "proposta",
      statusAccepted: "aceita",
      statusRejected: "rejeitada",
      modeSeries: "serie",
      modeParallel: "paralelo",
      logSeed: "Sistema de exemplo carregado com tres pessoas e declaracoes iniciais.",
      logAutoCommit: "{user} comprometeu automaticamente \"{title}\" a partir do plano de aquisicao.",
      logDeclarationCreated: "{user} criou a declaracao \"{title}\".",
      logCommitBlocked: "{user} tentou comprometer \"{title}\" sem peso suficiente.",
      logDeclarationCommitted: "{user} comprometeu {weight} de peso em \"{title}\".",
      logCancelBlocked: "\"{title}\" nao pode ser cancelada porque tem uma intencao ativa de resolucao.",
      logDeclarationCanceled: "{user} cancelou a declaracao \"{title}\".",
      logIntentCreated: "{user} enviou uma intencao de resolucao para \"{title}\".",
      logIntentAccepted: "{owner} aceitou {resolver} para \"{title}\".",
      logIntentCompleted: "{resolver} concluiu \"{title}\" e ganhou {weight} de peso."
    },
    "en-US": {
      appTitle: "The Square Mini System",
      heroEyebrow: "The Square",
      heroLoading: "Loading concept...",
      heroFallbackSummary: "This mini system keeps the rules and GUI separate. The system layer manages declarations, intents, weight, and planning. The UI only emits events and renders state.",
      dashboardTitle: "Dashboard",
      dashboardDescription: "Choose a user and track their weight, reputation, and active work.",
      createDeclarationTitle: "Create Declaration",
      createDeclarationDescription: "Draft a need, then commit weight when you are ready.",
      myDeclarationsTitle: "My Declarations",
      myDeclarationsDescription: "Manage your own priorities, commitments, and accepted resolutions.",
      boardTitle: "Declaration Board",
      boardDescription: "Committed declarations available for resolution.",
      planTitle: "Acquisition Plan",
      planDescription: "Order what should clear first as weight comes back to you.",
      activityTitle: "Activity",
      activityDescription: "System events, transfers, and changes over time.",
      languageLabel: "Language",
      activeUser: "Active user",
      availableWeight: "Available weight",
      lockedWeight: "Locked weight",
      reputation: "Reputation",
      activeResolutions: "Active resolutions",
      resetDemoState: "Reset demo state",
      formTitle: "Title",
      formDescription: "Description",
      formRequestedWeight: "Requested weight",
      createDraftDeclaration: "Create draft declaration",
      noDeclarations: "No declarations yet for this user.",
      requestedLabel: "requested",
      committedLabel: "committed",
      intentCount_one: "intent",
      intentCount_other: "intents",
      commitWeight: "Commit weight",
      cancel: "Cancel",
      markComplete: "Mark complete",
      accept: "Accept",
      acceptedResolver: "Accepted resolver: {name}",
      noOpenDeclarations: "No open declarations for this user right now.",
      ownerLabel: "owner",
      statusLabel: "status",
      yourResolutionNote: "Your resolution note",
      resolutionPlaceholder: "What will you do and how soon?",
      intentAlreadySubmitted: "Intent already submitted",
      submitResolutionIntent: "Submit resolution intent",
      noPlan: "No acquisition plan yet. Create a declaration and it will appear here.",
      modeLabel: "mode",
      requestLabel: "request",
      moveUp: "Move up",
      moveDown: "Move down",
      noActivity: "No activity yet.",
      statusDraft: "draft",
      statusCommitted: "committed",
      statusLocked: "locked",
      statusCompleted: "completed",
      statusCanceled: "canceled",
      statusProposed: "proposed",
      statusAccepted: "accepted",
      statusRejected: "rejected",
      modeSeries: "series",
      modeParallel: "parallel",
      logSeed: "Mock system loaded with three users and starter declarations.",
      logAutoCommit: "{user} auto-committed \"{title}\" from the acquisition plan.",
      logDeclarationCreated: "{user} created declaration \"{title}\".",
      logCommitBlocked: "{user} tried to commit \"{title}\" without enough weight.",
      logDeclarationCommitted: "{user} committed {weight} weight to \"{title}\".",
      logCancelBlocked: "\"{title}\" could not be canceled because it has active resolution intent.",
      logDeclarationCanceled: "{user} canceled declaration \"{title}\".",
      logIntentCreated: "{user} submitted a resolution intent for \"{title}\".",
      logIntentAccepted: "{owner} accepted {resolver} for \"{title}\".",
      logIntentCompleted: "{resolver} completed \"{title}\" and earned {weight} weight."
    }
  };

  function normalizeLocale(locale) {
    return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  }

  function getLocale(state) {
    return normalizeLocale(state && state.locale);
  }

  function interpolate(template, params) {
    if (!params) {
      return template;
    }

    return String(template).replace(/\{(\w+)\}/g, function replaceToken(match, key) {
      return params[key] == null ? match : String(params[key]);
    });
  }

  function translate(key, options) {
    const settings = options || {};
    const locale = normalizeLocale(settings.locale);
    const dictionary = translations[locale] || translations[DEFAULT_LOCALE];
    const fallbackDictionary = translations[DEFAULT_LOCALE];
    const template = dictionary[key] || fallbackDictionary[key] || key;
    return interpolate(template, settings.params);
  }

  function translateStatus(status, locale) {
    return translate("status" + status.charAt(0).toUpperCase() + status.slice(1), { locale: locale });
  }

  function translateMode(mode, locale) {
    return translate("mode" + mode.charAt(0).toUpperCase() + mode.slice(1), { locale: locale });
  }

  function translateCount(baseKey, count, locale) {
    const suffix = count === 1 ? "_one" : "_other";
    return translate(baseKey + suffix, { locale: locale });
  }

  function translateLog(entry, locale) {
    if (entry.messageKey) {
      return translate(entry.messageKey, { locale: locale, params: entry.messageParams });
    }

    return entry.message || "";
  }

  function formatDate(value, locale) {
    try {
      return new Date(value).toLocaleString(normalizeLocale(locale));
    } catch (error) {
      return value;
    }
  }

  function getReadmePath(locale) {
    return normalizeLocale(locale) === "en-US" ? "./README.en.md" : "./README.md";
  }

  function applyStaticText(locale) {
    const normalized = normalizeLocale(locale);

    document.documentElement.lang = normalized;
    document.title = translate("appTitle", { locale: normalized });

    document.querySelectorAll("[data-i18n]").forEach(function update(node) {
      node.textContent = translate(node.dataset.i18n, { locale: normalized });
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function update(node) {
      node.setAttribute("placeholder", translate(node.dataset.i18nPlaceholder, { locale: normalized }));
    });

    const localeLabel = document.querySelector('[for="locale-select"]');
    if (localeLabel && localeLabel.dataset.i18n) {
      localeLabel.textContent = translate(localeLabel.dataset.i18n, { locale: normalized });
    }
  }

  global.Square.ui = global.Square.ui || {};
  global.Square.ui.i18n = {
    DEFAULT_LOCALE,
    SUPPORTED_LOCALES,
    getLocale,
    t: translate,
    tStatus: translateStatus,
    tMode: translateMode,
    tCount: translateCount,
    tLog: translateLog,
    formatDate,
    getReadmePath,
    applyStaticText
  };
})(window);
