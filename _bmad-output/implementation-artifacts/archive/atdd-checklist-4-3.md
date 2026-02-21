# ATDD Checklist - Epic 4, Story 4.3: Dashboard MJ - Liste des Demandes de Renommée

**Date:** 2026-01-25
**Author:** Zaès (via Antigravity)
**Primary Test Level:** API + Component

---

## Story Summary

Le MJ peut voir toutes les demandes de Hauts Faits en attente pour les valider ou les rejeter.

**As a** MJ,
**I want** voir toutes les demandes de Hauts Faits en attente,
**So that** je puisse les valider ou les rejeter.

---

## Acceptance Criteria

1. **AC1:** MJ seul a accès à `/werewolf/admin/renown` (403 pour autres).
2. **AC2:** La liste affiche les demandes en attente avec : Nom joueur, Titre, Type, Date.
3. **AC3:** Chaque entrée a des boutons "Valider" et "Rejeter".
4. **AC4:** Valider change le statut à "approved".
5. **AC5:** Rejeter change le statut à "rejected".

---

## Failing Tests Created (RED Phase)

### API Tests (5 tests)

**File:** `tests/modules/werewolf/test_mj_dashboard_atdd.py`

- ✅ **Test:** `test_get_renown_requests_mj_only`
  - **Status:** RED - API route not implemented
  - **Verifies:** AC1 - RBAC MJ only

- ✅ **Test:** `test_get_pending_renown_requests_list`
  - **Status:** RED - API route/logic not implemented
  - **Verifies:** AC2 - List content and structure

- ✅ **Test:** `test_validate_renown_request_mj_only`
  - **Status:** RED - Validation route not implemented
  - **Verifies:** AC1 - RBAC for actions

- ✅ **Test:** `test_validate_updates_status`
  - **Status:** RED - Logic not implemented
  - **Verifies:** AC4 - Status transition to approved

- ✅ **Test:** `test_reject_renown_request_mj_only`
  - **Status:** RED - Logic not implemented
  - **Verifies:** AC5 - Status transition to rejected

### Component Tests (4 tests)

**File:** `web/src/modules/werewolf/components/__tests__/RenownRequestList.test.jsx`

- ✅ **Test:** `renders list of pending requests`
  - **Status:** RED - Component not created
  - **Verifies:** AC2 - UI rendering

- ✅ **Test:** `shows Validate and Reject buttons for each item`
  - **Status:** RED - Component not created
  - **Verifies:** AC3 - Actions presence

- ✅ **Test:** `calls onValidate when Validate button is clicked`
  - **Status:** RED - Component not created
  - **Verifies:** AC4 - Interaction wiring

- ✅ **Test:** `calls onReject when Reject button is clicked`
  - **Status:** RED - Component not created
  - **Verifies:** AC5 - Interaction wiring

---

## Required data-testid Attributes

### RenownRequestList Component

- `renown-request-list` - Container de la liste
- `renown-request-item-{id}` - Container d'une demande spécifique
- `val-btn-{id}` - Bouton Valider pour ID
- `rej-btn-{id}` - Bouton Rejeter pour ID
- `mj-dashboard-empty` - Message si vide

---

## Implementation Checklist

### Backend (API & Business Logic)

- [ ] **Model**: Ajouter `get_all_requests_by_status(status)`
- [ ] **Model**: Ajouter `update_request_status(id, status, validator_id)`
- [ ] **API**: Route `GET /api/modules/werewolf/admin/renown` (RBAC: MJ)
- [ ] **API**: Route `POST /api/modules/werewolf/admin/renown/{id}/validate`
- [ ] **API**: Route `POST /api/modules/werewolf/admin/renown/{id}/reject`
- [ ] **Verification**: `pytest tests/modules/werewolf/test_mj_dashboard_atdd.py`

### Frontend (React)

- [ ] **Component**: Créer `RenownRequestList.jsx`
- [ ] **Integration**: Mapper la liste aux données API
- [ ] **Actions**: Wiring des boutons Valider/Rejeter vers API
- [ ] **Verification**: `npm test -- RenownRequestList`

---

## Running Tests

```bash
# Run API Tests
pytest tests/modules/werewolf/test_mj_dashboard_atdd.py -v

# Run Component Tests
cd web
npm test -- RenownRequestList
```

---

## Test Execution Evidence (RED Phase Verified)

**API Results:**
```
tests/modules/werewolf/test_mj_dashboard_atdd.py::TestStory4_3_MJDashboardAPI::test_get_renown_requests_mj_only FAILED
tests/modules/werewolf/test_mj_dashboard_atdd.py::TestStory4_3_MJDashboardAPI::test_get_pending_renown_requests_list FAILED
tests/modules/werewolf/test_mj_dashboard_atdd.py::TestStory4_3_MJDashboardAPI::test_validate_renown_request_mj_only FAILED
tests/modules/werewolf/test_mj_dashboard_atdd.py::TestStory4_3_MJDashboardAPI::test_validate_updates_status FAILED
tests/modules/werewolf/test_mj_dashboard_atdd.py::TestStory4_3_MJDashboardAPI::test_reject_renown_request_mj_only FAILED
```

**Component Results:**
```
FAIL src/modules/werewolf/components/__tests__/RenownRequestList.test.jsx
Error: Failed to resolve import "../RenownRequestList"
```

**Status:** ✅ RED PHASE VERIFIED (All tests exist and fail as expected)
