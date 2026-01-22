# ATDD Checklist - Epic 2, Story 2.2: Assets de Données Garou (Races, Auspices, Tribus)

**Date:** 2026-01-22
**Author:** Antigravity
**Primary Test Level:** Integration (Data)

---

## Story Summary

**As a** développeur
**I want** les données statiques des Races, Auspices et Tribus disponibles en JSON
**So that** le formulaire d'onboarding puisse les afficher dynamiquement

---

## Acceptance Criteria

1. **Given** le fichier `assets/werewolf_data.json` créé
   **When** je le charge
   **Then** il contient les listes : `breeds` (Homid, Metis, Lupus), `auspices` (Ragabash, Theurge, Philodox, Galliard, Ahroun), `tribes` (liste complète des 13 tribus)
   **And** chaque entrée a un `id`, `name_fr`, et optionnellement `description`

---

## Failing Tests Created (RED Phase)

### Integration Tests

**File:** `tests/modules/werewolf/test_assets_atdd.py`

- ✅ **Test:** `test_assets_file_exists`
  - **Status:** RED - File not found
  - **Verifies:** Existence of `modules/werewolf/assets/werewolf_data.json`

- ✅ **Test:** `test_assets_structure_breeds`
  - **Status:** RED - File missing or Key Error
  - **Verifies:** `breeds` list presence and schema

- ✅ **Test:** `test_assets_structure_auspices`
  - **Status:** RED - File missing or Key Error
  - **Verifies:** `auspices` list presence (count 5)

- ✅ **Test:** `test_assets_structure_tribes`
  - **Status:** RED - File missing or Key Error
  - **Verifies:** `tribes` list presence (count >= 13)

---

## Implementation Checklist

### Test: test_assets_file_exists

**Tasks to make this test pass:**

- [ ] Créer le dossier `modules/werewolf/assets/`
- [ ] Créer le fichier `werewolf_data.json`
- [ ] Ajouter la structure JSON de base `{}`
- [ ] Run test: `pytest tests/modules/werewolf/test_assets_atdd.py`

### Test: test_assets_structure_*

**Tasks to make this test pass:**

- [ ] Peupler `breeds` (Homid, Metis, Lupus) avec `id` et `name_fr`
- [ ] Peupler `auspices` (Ragabash, Theurge, Philodox, Galliard, Ahroun)
- [ ] Peupler `tribes` (Les 13 tribus)
- [ ] Run test: `pytest tests/modules/werewolf/test_assets_atdd.py`

---

## Running Tests

```bash
# Run all failing tests for this story
pytest tests/modules/werewolf/test_assets_atdd.py
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ All tests written and failing
- ✅ Implementation checklist created

### GREEN Phase (DEV Team - Next Steps)

1. **Create JSON file**
2. **Populate Data**
3. **Run Tests**

---
