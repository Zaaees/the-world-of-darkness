# ATDD Checklist - Epic 4, Story 4.2: Formulaire de Soumission de Haut Fait

**Date:** 2026-01-24
**Author:** Zaès
**Primary Test Level:** API + Component

---

## Story Summary

Le joueur peut soumettre un Haut Fait (accomplissement narratif) pour validation par le MJ via un modal dédié.

**As a** joueur Loup-Garou
**I want** soumettre un Haut Fait pour validation
**So that** mes accomplissements narratifs soient reconnus

---

## Acceptance Criteria

1. **AC1:** Given un joueur sur sa fiche, When il clique sur "Ajouter un Haut Fait", Then un modal s'ouvre
2. **AC2:** Le modal contient: Champ Titre, Champ Description, Sélecteur Type (Gloire/Honneur/Sagesse)
3. **AC3:** À la soumission, le statut est "En attente" (pending)
4. **AC4:** Un toast confirme "Envoyé aux Esprits (MJ)"

---

## Failing Tests Created (RED Phase)

### API Tests (3 tests)

**File:** `tests/modules/werewolf/test_renown_submission_atdd.py`

- ✅ **Test:** `test_submit_renown_request_api_creates_pending_entry`
  - **Status:** RED - API route `/api/modules/werewolf/renown/submit` not implemented
  - **Verifies:** AC3 - Submission creates entry with status='pending'

- ✅ **Test:** `test_submit_renown_request_requires_title_and_description`
  - **Status:** RED - Form validation not implemented
  - **Verifies:** AC2 - Required fields validation

- ✅ **Test:** `test_submit_renown_request_requires_valid_renown_type`
  - **Status:** RED - RenownType validation not implemented
  - **Verifies:** AC2 - Type selector validation (Glory/Honor/Wisdom only)

### Component Tests (3 tests)

**File:** `web/src/modules/werewolf/components/__tests__/RenownSubmissionModal.test.jsx`

- ✅ **Test:** `RenownSubmissionModal opens when button clicked`
  - **Status:** RED - Component not created
  - **Verifies:** AC1 - Modal opens on button click

- ✅ **Test:** `RenownSubmissionModal contains title, description, and type fields`
  - **Status:** RED - Component not created
  - **Verifies:** AC2 - Form fields present

- ✅ **Test:** `RenownSubmissionModal shows success toast on submit`
  - **Status:** RED - Toast integration not implemented
  - **Verifies:** AC4 - Toast confirmation

---

## Required data-testid Attributes

### RenownSubmissionModal

- `renown-submit-button` - Bouton "Ajouter un Haut Fait" sur la fiche
- `renown-modal` - Container du modal de soumission
- `renown-title-input` - Champ Titre
- `renown-description-input` - Champ Description
- `renown-type-select` - Sélecteur Type (Glory/Honor/Wisdom)
- `renown-submit-confirm` - Bouton de confirmation dans le modal
- `renown-toast-success` - Toast de confirmation

---

## Implementation Checklist

### Test: `test_submit_renown_request_api_creates_pending_entry`

**Tasks to make this test pass:**

- [ ] Créer route `POST /api/modules/werewolf/renown/submit` dans `api_server.py`
- [ ] Implémenter handler qui appelle `create_renown_request()` du modèle
- [ ] Retourner 201 avec le renown request créé (status=pending)
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_submission_atdd.py -k test_submit_renown_request_api`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

### Test: `test_submit_renown_request_requires_title_and_description`

**Tasks to make this test pass:**

- [ ] Ajouter validation de schéma (title, description required)
- [ ] Retourner 400 si champs manquants avec message clair
- [ ] Run test
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: `RenownSubmissionModal opens when button clicked`

**Tasks to make this test pass:**

- [ ] Créer composant `RenownSubmissionModal.jsx`
- [ ] Ajouter bouton "Ajouter un Haut Fait" sur la page Sheet avec `data-testid="renown-submit-button"`
- [ ] Implémenter state `isOpen` et toggle du modal
- [ ] Run test: `npm test -- RenownSubmissionModal`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1.5 hours

---

### Test: `RenownSubmissionModal contains form fields`

**Tasks to make this test pass:**

- [ ] Ajouter input Titre avec `data-testid="renown-title-input"`
- [ ] Ajouter textarea Description avec `data-testid="renown-description-input"`
- [ ] Ajouter select Type avec `data-testid="renown-type-select"` (options: Gloire/Honneur/Sagesse)
- [ ] Ajouter bouton submit avec `data-testid="renown-submit-confirm"`
- [ ] Run test
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: `RenownSubmissionModal shows success toast`

**Tasks to make this test pass:**

- [ ] Connecter form submit à l'API `/werewolf/renown/submit`
- [ ] On success (201), afficher toast "Envoyé aux Esprits (MJ)"
- [ ] Fermer le modal après soumission réussie
- [ ] Run test
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

## Running Tests

```bash
# Run all failing tests for Story 4.2
pytest tests/modules/werewolf/test_renown_submission_atdd.py -v

# Run component tests
npm test -- RenownSubmissionModal

# Run all Epic 4 tests
pytest tests/modules/werewolf/test_renown*.py -v
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ 6 tests écrits et en échec
- ✅ Implementation checklist créée
- ✅ data-testid requirements listés

### GREEN Phase (Prochaine étape)

1. Commencer par les tests API (backend first)
2. Puis implémenter le composant React
3. Un test à la fois

### Total Estimated Effort: 5.5 hours

---

---

## Test Execution Evidence (RED Phase Verified)

**Command:** `pytest tests/modules/werewolf/test_renown_submission_atdd.py -v --tb=short`

**Results:**

```
6 items collected

test_submit_renown_request_api_creates_pending_entry FAILED
test_submit_renown_request_requires_title_and_description FAILED
test_submit_renown_request_requires_valid_renown_type FAILED
test_submit_renown_request_requires_authentication FAILED
test_submit_renown_persists_to_database FAILED
test_submitted_at_timestamp_is_set_automatically FAILED

============================== 6 failed in 0.09s ==============================
```

**Summary:**

- Total tests: 6
- Passing: 0 ✅ (expected)
- Failing: 6 ✅ (expected)
- Status: ✅ RED phase verified

**Expected Failure Messages:**

| Test | Expected Failure |
|------|------------------|
| `test_submit_renown_request_api_creates_pending_entry` | `submit_renown_request` not found in api_routes |
| `test_submit_renown_request_requires_title_and_description` | API route handler not found |
| `test_submit_renown_request_requires_valid_renown_type` | API route handler not found |
| `test_submit_renown_request_requires_authentication` | API route handler not found |
| `test_submit_renown_persists_to_database` | `modules.werewolf.models.renown` not found |
| `test_submitted_at_timestamp_is_set_automatically` | `modules.werewolf.models.renown` not found |

---

**Generated by BMad TEA Agent** - 2026-01-24
