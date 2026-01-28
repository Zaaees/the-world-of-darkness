# ATDD Checklist - Epic 5, Story 5.1: Modèle de Données et Assets Dons

**Date:** 2026-01-26
**Author:** Zaès (Retrospective)
**Primary Test Level:** API/Integration

---

## Story Summary

As a système, I want une structure de données pour les Dons, so that le catalogue et les déblocages soient gérés.

---

## Acceptance Criteria

1. **Fichier Asset (Catalogue):** `modules/werewolf/assets/gifts_data.json` existe et valide.
2. **Table de Données:** `werewolf_player_gifts` créée via migration.
3. **Service Access:** Chargement du catalogue et récupération des dons joueurs.
4. **Database Access:** Modèle `WerewolfPlayerGift`.

---

## Tests (GREEN Phase)

### Backend Tests (3 files)

**File:** `tests/modules/werewolf/`

- ✅ **Test:** `test_gifts_data_integrity.py` (4 tests)
  - **Status:** GREEN
  - **Verifies:** JSON validity, schema compliance, unique IDs.

- ✅ **Test:** `test_gifts_model.py` (3 tests)
  - **Status:** GREEN
  - **Verifies:** Table existence, insert/fetch logic (Integration).

- ✅ **Test:** `test_gifts_service.py` (3 tests)
  - **Status:** GREEN
  - **Verifies:** Service logic, data loading.

---

## Data Factories & Fixtures

- **DB Fixture:** `db_conn` in `test_gifts_model.py` (In-memory SQLite).
- **Assets:** `modules/werewolf/assets/gifts_data.json` used as source of truth.

---

## Deployment Checklist (Retrospective)

- [x] Create `gifts_data.json`
- [x] Create `WerewolfPlayerGift` model
- [x] Create `GiftsService`
- [x] Verify tests pass: `pytest tests/modules/werewolf/test_gifts_*`
