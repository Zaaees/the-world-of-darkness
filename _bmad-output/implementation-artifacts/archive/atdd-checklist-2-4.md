# ATDD Checklist - Epic 2, Story 2.4: Création de la Fiche en Base de Données

**Date:** 2026-01-22
**Author:** Antigravity
**Primary Test Level:** Integration (Service/API)

---

## Story Summary

**As a** joueur
**I want** que mes choix soient sauvegardés à la validation du formulaire
**So that** ma fiche soit créée et je puisse y accéder ultérieurement

---

## Acceptance Criteria

1. **Given** un formulaire d'onboarding rempli et validé
   **When** je soumets le formulaire
   **Then** une entrée est créée dans `werewolf_data` avec mes attributs
   **And** je suis redirigé vers ma fiche (`/werewolf/sheet`)
   **And** un toast confirme "Bienvenue dans la Meute, [Nom] !"

---

## Failing Tests Created (RED Phase)

### Integration Tests

**File:** `tests/modules/werewolf/test_create_sheet_atdd.py`

- ✅ **Test:** `test_create_character_persistence`
  - **Status:** RED - Import Error or implementation missing
  - **Verifies:** Service layer creation logic and DB persistence

---

## Implementation Checklist

### Test: test_create_character_persistence

**Tasks to make this test pass:**

- [ ] Créer `modules/werewolf/services/character_service.py`
- [ ] Implémenter `create_character(dto)`
- [ ] Connecter au `WerewolfStore` (Story 2.1)
- [ ] Run test: `pytest tests/modules/werewolf/test_create_sheet_atdd.py`

### API Endpoint (Not strictly tested by Integration unit, but required)

- [ ] Create `POST /api/modules/werewolf/character` in `web/api.py` or equivalent

---

## Running Tests

```bash
pytest tests/modules/werewolf/test_create_sheet_atdd.py
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ All tests written and failing
- ✅ Implementation checklist created

### GREEN Phase (DEV Team - Next Steps)
- [x] Implement Service
- [x] Setup API (routes.py)
- [x] Run Tests (debug_test.py passed)

---
