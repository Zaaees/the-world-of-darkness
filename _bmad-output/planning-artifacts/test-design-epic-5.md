# Test Design: Epic 5 - Dons - Les Secrets de Gaïa 🎁

**Date:** 2026-01-25
**Author:** Zaès (via Antigravity)
**Status:** Draft

---

## Executive Summary

**Scope:** Test design for Epic 5 "Dons", covering Stories 5.1-5.4 (Gift data model, GiftCard UI, Gifts Page, MJ Unlock Dashboard).

**Risk Summary:**

- Total risks identified: 5
- High-priority risks (≥6): 2
- Critical categories: SEC, DATA

**Coverage Summary:**

- P0 scenarios: 4 (8 hours)
- P1 scenarios: 4 (4 hours)
- P2/P3 scenarios: 3 (1.5 hours)
- **Total effort**: 13.5 hours (~2 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-501   | SEC      | Joueur non-MJ accède à `/werewolf/admin/gifts` et débloque ses propres dons | 2 (Possible) | 3 (Critical) | 6 | Middleware `require_mj_role` strict sur les routes API admin de gifts | Dev | Sprint 5 |
| R-502   | DATA     | Déploiement avec `gifts_data.json` corrompu ou invalide (IDs dupliqués, champs manquants) | 2 (Possible) | 3 (Critical) | 6 | Test de validation JSON schema dans la CI | Dev | Sprint 5 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-503   | BUS      | "Don Mystère" révèle accidentellement son nom/desc dans le DOM (hidden attribute vs pas de rendu) | 2 (Possible) | 2 (Degrad) | 4 | Server-side filtering ou conditionnel strict dans le JSX (ne pas envoyer les données sensibles au client si locked) | Dev |
| R-504   | OPS      | Notification Discord de déblocage échoue ou spam (si unlock multiple) | 2 (Possible) | 2 (Degrad) | 4 | Batch notifications ou queue async avec retry | Dev |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------- |
| R-505   | BUS      | Tri des dons incorrect (Débloqués pas en premier) | 2 (Possible) | 1 (Minor) | 2 | Test unitaire sur la fonction de tri | Monitor |

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Security enforcement + Critical Data Integrity

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Accès MJ Dashboard Gifts (RBAC) | API | R-501 | 1 | Dev | 403 si non-MJ |
| Validation Structure `gifts_data.json` | Unit | R-502 | 1 | Dev | JSON Schema validation |
| Déblocage Don (Persistence) | API | - | 1 | Dev | Vérifier entrée DB |
| Masquage Don Verrouillé | API/Component | R-503 | 1 | Dev | Vérifier que name/desc ne sont PAS dans la payload JSON si locked |

**Total P0**: 4 tests, 8 hours

### P1 (High) - Run on PR to main

**Criteria**: Core Feature Correctness

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Affichage Liste Dons Joueur | Integration | - | 1 | Dev | Grid rendering, filtres |
| Notification Discord Unlock | Integration | R-504 | 1 | Dev | Mock Discord call |
| UI GiftCard (Locked state) | Component | R-503 | 1 | Dev | Visuel cadenas + gris |
| UI GiftCard (Unlocked state)| Component | - | 1 | Dev | Visuel or + détails |

**Total P1**: 4 tests, 4 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: UX Polish & Edge Cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Tri par défaut (Unlocked first) | Unit | R-505 | 1 | Dev | Logic test |
| Filtrage par Niveau | E2E | - | 1 | QA | UI filter interaction |
| Tentative déblocage Don déjà acquis | API | - | 1 | Dev | Idempotency |

**Total P2**: 3 tests, 1.5 hours

---

## Execution Order

### Smoke Tests (<5 min)

- [ ] `test_gifts_catalog_validity` (Unit - R-502)
- [ ] `test_gifts_admin_route_security` (API - R-501)
- [ ] `test_gifts_page_renders` (E2E)

### P0 Tests (<10 min)

- [ ] `test_api_unlock_gift_flow` (API)
- [ ] `test_api_gifts_list_sanitization` (API - R-503)
- [ ] `test_mj_unlock_ui_access` (E2E)

### P1 Tests (<30 min)

- [ ] `test_gift_card_variants` (Component)
- [ ] `test_discord_notification_gift_unlock` (Integration)
- [ ] `test_gifts_filtering_logic` (Unit/Integration)

### P2/P3 Tests (<60 min)

- [ ] `test_gifts_sorting` (Unit)
- [ ] `test_idempotency_gift_unlock` (API)

---

## Resource Estimates

### Test Development Effort

| Priority  | Count | Hours/Test | Total Hours | Notes                   |
| --------- | ----- | ---------- | ----------- | ----------------------- |
| P0        | 4     | 2.0        | 8.0         | Security + Persistence  |
| P1        | 4     | 1.0        | 4.0         | UI Components + Notifs  |
| P2        | 3     | 0.5        | 1.5         | Sorting/Filtering       |
| **Total** | **11**| **-**      | **13.5**    | **~2 days**             |

### Prerequisites

**Test Data:**

- `gifts_data.json` populated with dummy gifts (Level 1-5, diverse tribes)
- User fixtures: 1 Player (Role Player), 1 MJ (Role MJ), 1 Admin
- DB tables: `werewolf_player_gifts` created

**Tooling:**
- `ajv` or similar for JSON schema validation
- `pytest-mock` for Discord

---

## Quality Gate Criteria

- **P0 Pass Rate**: 100%
- **Critical Risk Mitigation**: R-501 and R-502 must have verified mitigations (Middleware + Schema Check).
- **Security Check**: No locked gift details leakage in API response payload.

---

## Mitigation Plans

### R-501: Access Control (Score: 6)

**Strategy**: Apply `require_mj_role` middleware to `POST /api/modules/werewolf/admin/gifts/unlock`.
**Owner**: Dev
**Verification**: `test_gifts_admin_route_security` (Returns 403 for non-MJ).

### R-502: Data Corruption (Score: 6)

**Strategy**: Add a pre-build step or unit test that validates `gifts_data.json` against a strict schema (required fields, unique IDs).
**Owner**: Dev
**Verification**: `test_gifts_catalog_validity`.

### R-503: Spoiler Leakage (Score: 4)

**Strategy**: API endpoint `GET /werewolf/gifts` should filter fields server-side. If `!(user_has_gift)`, return `{ id, name: "Don Mystère", description: "???" }` instead of full data.
**Owner**: Dev
**Verification**: `test_api_gifts_list_sanitization`.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: Zaès Date: ____
- [ ] Tech Lead: ____ Date: ____
- [ ] QA Lead: ____ Date: ____

---
