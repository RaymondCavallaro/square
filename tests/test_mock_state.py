import json
import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
MOCK_PATH = ROOT / "app" / "mock.json"

ALLOWED_DECLARATION_STATUSES = {
    "draft",
    "projected",
    "committed",
    "in_progress",
    "resolved",
    "canceled",
}

ALLOWED_INTENT_STATUSES = {"proposed", "accepted", "completed", "rejected"}


def load_mock_state() -> dict:
    return json.loads(MOCK_PATH.read_text(encoding="utf-8"))


class MockStateTest(unittest.TestCase):
    def test_mock_json_is_valid(self) -> None:
        state = load_mock_state()
        self.assertIsInstance(state, dict)

    def test_declarations_have_phase_two_structure(self) -> None:
        state = load_mock_state()

        for declaration in state["declarations"]:
            with self.subTest(declaration=declaration["id"]):
                self.assertIn(declaration["status"], ALLOWED_DECLARATION_STATUSES)
                self.assertIn("intent", declaration)
                self.assertIn("context", declaration)
                self.assertIn("evaluation", declaration)
                self.assertEqual(declaration["title"], declaration["intent"]["summary"])
                self.assertEqual(declaration["description"], declaration["intent"]["details"])
                self.assertGreaterEqual(declaration["requestedWeight"], 1)
                self.assertGreaterEqual(declaration["committedWeight"], 0)

    def test_projected_and_committed_claims_are_structured(self) -> None:
        state = load_mock_state()

        for declaration in state["declarations"]:
            if declaration["status"] not in {"projected", "committed", "in_progress", "resolved"}:
                continue

            with self.subTest(declaration=declaration["id"]):
                self.assertTrue(declaration["intent"]["summary"].strip())
                self.assertTrue(declaration["intent"]["details"].strip())
                self.assertTrue(declaration["context"]["scope"].strip())
                self.assertTrue(declaration["evaluation"]["check"].strip())
                self.assertTrue(declaration["evaluation"]["confirmer"].strip())

    def test_intents_reference_known_declarations_and_users(self) -> None:
        state = load_mock_state()
        declaration_ids = {item["id"] for item in state["declarations"]}
        user_ids = {item["id"] for item in state["users"]}

        for intent in state["resolutionIntents"]:
            with self.subTest(intent=intent["id"]):
                self.assertIn(intent["status"], ALLOWED_INTENT_STATUSES)
                self.assertIn(intent["declarationId"], declaration_ids)
                self.assertIn(intent["resolverId"], user_ids)
                self.assertTrue(str(intent["note"]).strip())

    def test_plans_reference_known_declarations(self) -> None:
        state = load_mock_state()
        declaration_ids = {item["id"] for item in state["declarations"]}

        for plan in state["acquisitionPlans"]:
            with self.subTest(plan=plan["id"]):
                self.assertIn(plan["declarationId"], declaration_ids)
                self.assertGreaterEqual(plan["priority"], 1)


if __name__ == "__main__":
    unittest.main()
