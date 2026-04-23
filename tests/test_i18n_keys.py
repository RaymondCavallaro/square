import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
I18N_DIR = ROOT / "i18n"


def parse_properties(path: pathlib.Path) -> dict[str, str]:
    data: dict[str, str] = {}

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or line.startswith("!"):
            continue

        key, separator, value = line.partition("=")
        if not separator:
            key, separator, value = line.partition(":")

        data[key.strip()] = value.strip() if separator else ""

    return data


class I18nKeysTest(unittest.TestCase):
    def test_locale_files_have_matching_keys(self) -> None:
        pt_br = parse_properties(I18N_DIR / "pt-BR.properties")
        en_us = parse_properties(I18N_DIR / "en-US.properties")

        self.assertEqual(
            set(pt_br.keys()),
            set(en_us.keys()),
            "pt-BR and en-US translation files should expose the same keys",
        )

    def test_phase_two_keys_exist(self) -> None:
        en_us = parse_properties(I18N_DIR / "en-US.properties")
        required = {
            "formContextScope",
            "formEvaluationCheck",
            "createProjectedClaim",
            "saveAsProjected",
            "statusProjected",
            "statusIn_progress",
            "statusResolved",
            "logDeclarationProjected",
        }

        self.assertTrue(required.issubset(en_us.keys()))


if __name__ == "__main__":
    unittest.main()
