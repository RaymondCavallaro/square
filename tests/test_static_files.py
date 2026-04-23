import json
import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class StaticFilesTest(unittest.TestCase):
    def test_app_config_json_is_valid(self) -> None:
        config_path = ROOT / "config" / "app.json"
        config = json.loads(config_path.read_text(encoding="utf-8"))

        self.assertIn("persistence", config)
        self.assertIn("libraryPaths", config)
        self.assertIn("app", config["libraryPaths"])
        self.assertIn("core", config["libraryPaths"])

    def test_locale_manifest_json_is_valid(self) -> None:
        manifest_path = ROOT / "i18n" / "locales.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

        self.assertIn("locale.meta", manifest)
        self.assertIn("default", manifest["locale.meta"])

    def test_index_boots_module_entry(self) -> None:
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn('<script type="module" src="./app/main.js"></script>', html)


if __name__ == "__main__":
    unittest.main()
