import jsep from "https://cdn.jsdelivr.net/npm/jsep@1.4.0/+esm";
import * as propertiesFile from "https://esm.sh/properties-file@3.6.0";

(async function boot(global) {
  const EXTERNAL_PATHS = {
    appConfig: "./config/app.json",
    initialStore: "./app/mock.json",
    i18nManifest: "./i18n/locales.json"
  };
  let appConfig = {};
  global.Square = global.Square || {};
  global.Square.core = global.Square.core || {};
  global.Square.vendor = { jsep, propertiesFile };

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

  async function loadJson(externalPath) {
    const response = await fetch(externalPath, { cache: "no-store" });
    return (response.ok && response.json()) || {};
  }

  async function loadAppConfig() {
    appConfig = await loadJson(EXTERNAL_PATHS.appConfig);
  }

  async function loadLibraries() {
    for (const path of appConfig.libraryPaths.core) {
      await loadScript(path);
    }
    const template = global.Square.core.template || {};
    const interpolate = template.interpolate || function(path) {
      return path;
    };
    for (const path of appConfig.libraryPaths.app) {
      await loadScript(interpolate(path, appConfig));
    }
  }

  async function initializeStore() {
    await global.Square.system.store.initialize({
      initial: await loadJson(EXTERNAL_PATHS.initialStore)
    });
  }

  await loadAppConfig();
  await loadLibraries();
  await global.Square.ui.i18n.loadTranslations({
    manifest: await loadJson(EXTERNAL_PATHS.i18nManifest)
  });
  await initializeStore();
  const locale = global.Square.ui.i18n.getLocale(global.Square.system.store.getState());
  global.Square.ui.i18n.applyStaticText(locale);
  global.Square.core.bus.emit("app:initialize");
})(window);
