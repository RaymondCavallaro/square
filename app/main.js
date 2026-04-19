(async function boot(global) {
  const LIBRARY_PATHS = [
    "./lib/core/namespace.js",
    "./lib/core/event-bus.js",
    "./lib/system/store.js",
    "./lib/system/selectors.js",
    "./lib/system/actions.js",
    "./lib/ui/i18n.js",
    "./lib/ui/render.js",
    "./lib/ui/controllers.js"
  ];

  const APP_CONFIG = {
    stateSource: "localStorage",
    fallbackStatePath: "./app/mock-state.json",
    embeddedStateScriptId: "embedded-mock-state",
    embeddedReadmeScriptId: "embedded-readme-meta"
  };

  function loadScript(path) {
    return new Promise(function resolveWhenLoaded(resolve, reject) {
      const script = document.createElement("script");
      script.src = path;
      script.async = false;
      script.onload = function handleLoad() {
        resolve();
      };
      script.onerror = function handleError() {
        reject(new Error("Unable to load script: " + path));
      };
      document.head.appendChild(script);
    });
  }

  function isDirectFileMode() {
    return window.location.protocol === "file:";
  }

  function readEmbeddedJson(scriptId) {
    const node = document.getElementById(scriptId);

    if (!node) {
      return null;
    }

    try {
      return JSON.parse(node.textContent);
    } catch (error) {
      console.warn("Unable to parse embedded JSON from #" + scriptId, error);
      return null;
    }
  }

  function parseReadmeTitle(markdown) {
    const heading = markdown.match(/^#\s+(.+)$/m);
    return heading ? heading[1].trim() : "The Square";
  }

  function parseReadmeSummary(markdown) {
    const lines = markdown.split(/\r?\n/);
    const summaryLine = lines.find(function findLine(line) {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("#");
    });

    return summaryLine || "This mini system keeps the rules and GUI separate. The system layer manages declarations, intents, weight, and planning.";
  }

  function getEmbeddedHero(locale) {
    const embedded = readEmbeddedJson(APP_CONFIG.embeddedReadmeScriptId);
    const entry = embedded && (embedded[locale] || embedded["pt-BR"] || embedded["en-US"]);

    if (!entry) {
      return null;
    }

    return {
      title: entry.title || "The Square",
      summary: entry.summary || global.Square.ui.i18n.t("heroFallbackSummary", { locale: locale })
    };
  }

  async function loadHeroFromReadme(locale) {
    const title = document.querySelector("#hero-title");
    const summary = document.querySelector("#hero-summary");
    const i18n = global.Square.ui.i18n;

    if (!title || !summary) {
      return;
    }

    if (isDirectFileMode()) {
      const embeddedHero = getEmbeddedHero(locale);

      if (embeddedHero) {
        title.textContent = embeddedHero.title;
        summary.textContent = embeddedHero.summary;
        return;
      }
    }

    try {
      const response = await fetch(i18n.getReadmePath(locale), { cache: "no-store" });

      if (!response.ok) {
        throw new Error("README request failed");
      }

      const markdown = await response.text();
      title.textContent = parseReadmeTitle(markdown);
      summary.textContent = parseReadmeSummary(markdown);
    } catch (error) {
      title.textContent = "The Square";
      summary.textContent = i18n.t("heroFallbackSummary", { locale: locale });
    }
  }

  async function loadLibraries() {
    for (const path of LIBRARY_PATHS) {
      await loadScript(path);
    }
  }

  async function initializeStore() {
    await global.Square.system.store.initialize({
      source: APP_CONFIG.stateSource,
      jsonPath: APP_CONFIG.fallbackStatePath,
      embeddedState: readEmbeddedJson(APP_CONFIG.embeddedStateScriptId)
    });
  }

  await loadLibraries();
  await initializeStore();
  const locale = global.Square.ui.i18n.getLocale(global.Square.system.store.getState());
  global.Square.ui.i18n.applyStaticText(locale);
  loadHeroFromReadme(locale);
  global.Square.bus.on("locale:changed", function onLocaleChanged(payload) {
    global.Square.ui.i18n.applyStaticText(payload.locale);
    loadHeroFromReadme(payload.locale);
  });
  global.Square.bus.emit("app:initialize");
})(window);
