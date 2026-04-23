(function registerI18n(global) {
  const clone = global.Square.core.clone;
  const vendor = global.Square.vendor || {};
  const propertiesFile = vendor.propertiesFile || {};
  const getProperties = propertiesFile.getProperties;

  let defaultLocale = "pt-BR";
  let supportedLocales = [];
  let localeMeta = {};
  let translations = {};
  let appConfig = {};

  function parseProperties(text) {
    if (typeof getProperties === "function") {
      return getProperties(String(text || ""));
    }

    const result = {};
    String(text || "").split(/\r?\n/).forEach(function eachLine(line) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) {
        return;
      }
      const separatorIndex = trimmed.search(/[:=]/);
      if (separatorIndex < 0) {
        result[trimmed] = "";
        return;
      }
      result[trimmed.slice(0, separatorIndex).trim()] = trimmed.slice(separatorIndex + 1).trim();
    });
    return result;
  }

  function normalizeLocale(locale) {
    return supportedLocales.includes(locale) ? locale : defaultLocale;
  }

  function applyManifest(properties) {
    const rawMeta = properties["locale.meta"] || {};
    defaultLocale = rawMeta.default || "pt-BR";
    const locales = Object.keys(rawMeta).filter(function each(key) {
      return key !== "default";
    });
    localeMeta = {};
    locales.forEach(function each(locale) {
      localeMeta[locale] = clone(rawMeta[locale]);
    });
    supportedLocales = locales.length ? locales : [defaultLocale];
  }

  async function loadManifest(options) {
    const settings = options || {};
    const properties = clone(settings.manifest || {});
    appConfig = clone(settings.appConfig || {});

    applyManifest(properties);
  }

  async function loadLocaleFile(locale) {
    const path = localeMeta[locale] && localeMeta[locale].path;

    if (!path) {
      return;
    }

    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load locale file: " + path);
    }

    const content = await response.text();
    translations[locale] = {
      ...parseProperties(content)
    };
  }

  async function loadTranslations(options) {
    translations = {};
    await loadManifest(options);

    try {
      await Promise.all(supportedLocales.map(loadLocaleFile));
    } catch (error) {
      console.warn("Using partial translation data after locale load failure.", error);
    }
  }

  function getLocale(state) {
    return normalizeLocale(state && state.locale);
  }

  function interpolate(template, params) {
    if (!params) {
      return template;
    }
    return global.Square.core.template.interpolate(String(template), params);
  }

  function translate(key, options) {
    const settings = options || {};
    const locale = normalizeLocale(settings.locale);
    const dictionary = translations[locale] || translations[defaultLocale];
    const template = dictionary[key] || key;
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

  function parseReadmeSummary(markdown) {
    const lines = markdown.split(/\r?\n/);
    return lines.filter(function keep(line) {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("#");
    }).slice(0, 3).join(" ");
  }

  async function loadHeroFromReadme(locale) {
    const summary = document.querySelector("#square-summary");
    if (!summary || !appConfig.readme || !appConfig.readme[locale]) {
      return;
    }

    try {
      const response = await fetch(appConfig.readme[locale], { cache: "no-store" });
      if (!response.ok) {
        throw new Error("README request failed");
      }
      const markdown = await response.text();
      summary.textContent = parseReadmeSummary(markdown);
    } catch (error) {
      // Keep inline fallback summary already present in HTML.
    }
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
    loadHeroFromReadme(normalized);
  }

  global.Square.ui = global.Square.ui || {};
  global.Square.core.bus.on("locale:changed", function onLocaleChanged(payload) {
    applyStaticText(payload.locale);
  });
  global.Square.ui.i18n = {
    loadTranslations,
    getLocale,
    getSupportedLocales: function getSupportedLocales() {
      return supportedLocales.slice();
    },
    getLocaleLabel: function getLocaleLabel(locale) {
      const normalized = normalizeLocale(locale);
      return (localeMeta[normalized] && localeMeta[normalized].label) || normalized;
    },
    t: translate,
    tStatus: translateStatus,
    tMode: translateMode,
    tCount: translateCount,
    tLog: translateLog,
    formatDate,
    applyStaticText
  };
})(window);
