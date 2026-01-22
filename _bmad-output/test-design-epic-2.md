# Test Design: Epic 2 - Onboarding - Premier Changement

**Date:** 2026-01-22
**Author:** Antigravity
**Status:** Draft

---

## Executive Summary

**Scope:** Epic-Level test design for Epic 2, specifically focusing on **Story 2.1: Modèle de Données Werewolf**.

**Risk Summary:**

- Total risks identified: 3
- High-priority risks (≥6): 1
- Critical categories: TECH, DATA

**Coverage Summary:**

- P0 scenarios: 2 (4 hours)
- P1 scenarios: 3 (3 hours)
- P2/P3 scenarios: 1 (0.5 hours)
- **Total effort**: 7.5 hours (~1 day)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-201 | TECH | Perte de précision des IDs Discord (JS Integer Limit) | 3 (Likely) | 2 (Degraded) | 6 | Utiliser `String` ou `BigInt` (SQLite) et `String` (JSON/API) pour tous les IDs Discord | Dev | Sprint Current |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-202 | DATA | Modification non autorisée de champs immuables (Breed, Auspice, Tribe) | 2 (Possible) | 2 (Degraded) | 4 | Validation stricte dans le Service Layer + Tests d'intégration | Dev |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R-203 | OPS | Échec de création de la table au démarrage | 1 (Unlikely) | 3 (Critical) | 3 | Log d'erreur critique + Arrêt du module (Monitor) | Monitor |

### Risk Category Legend

- **TECH**: Technical/Architecture
- **DATA**: Data Integrity
- **OPS**: Operations

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Core Data Integrity + Helper for High Risk Tech

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Stockage persistant User/Character | Integration | - | 1 | Dev | CRUD de base |
| Précision ID Discord | Integration | R-201 | 1 | Dev | Test avec ID Discord réel (18 chars) |

**Total P0**: 2 tests, 4 hours

### P1 (High) - Run on PR to main

**Criteria**: Business Rules (Immutability)

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Immuabilité (Breed, Auspice, Tribe) | Integration | R-202 | 1 | Dev | Tentative update doit être ignorée/rejetée |
| Unicité User ID | Integration | - | 1 | Dev | FK unique contrainte |
| Création Table (Init) | Unit | R-203 | 1 | Dev | Vérifier DDL SQL |

**Total P1**: 3 tests, 3 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Edge Cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Gestion erreurs DB (Connection) | Integration | - | 1 | Dev | Mock DB failure |

**Total P2**: 1 tests, 0.5 hours

---

## Execution Order

### Smoke Tests (<5 min)

- [ ] `test_create_table_sql_validity` (Unit)
- [ ] `test_store_create_character_success` (Integration)

**Total**: 2 scenarios

### P0 Tests (<10 min)

- [ ] `test_store_discord_id_precision` (Integration)

**Total**: 1 scenarios

### P1 Tests (<30 min)

- [ ] `test_store_immutability_enforcement` (Integration)
- [ ] `test_store_unique_constraint` (Integration)

**Total**: 2 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| --------- | ----------------- | ---------- | ----------------- | ----------------------- |
| P0 | 2 | 2.0 | 4.0 | Setup DB fixtures |
| P1 | 3 | 1.0 | 3.0 | Logic validation |
| P2 | 1 | 0.5 | 0.5 | Error mocking |
| **Total** | **6** | **-** | **7.5** | **~1 day** |

### Prerequisites

**Test Data:**

- `WerewolfFactory` (Fixture pour générer des attributs valides: Homid, Ragabash, etc.)
- SQLite In-Memory Database fixture

**Tooling:**

- `pytest`
- `aiosqlite`
- `pytest-asyncio`

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100%
- **P1 pass rate**: 100% (Backend logic strict)
- **High-risk mitigations**: R-201 (BigInt) Verified

### Non-Negotiable Requirements

- [ ] `discord_thread_id` doit supporter des valeurs > 2^53 (String ou BigInt)
- [ ] Champs immuables ne doivent JAMAIS changer après création

---

## Mitigation Plans

### R-201: Perte de précision des IDs Discord (Score: 6)

**Mitigation Strategy:** Utiliser le type `TEXT` ou `INTEGER` (BigInt) côté SQLite, et s'assurer que les DTOs Python typent ces champs en `str` ou `int` (Python gère les grands entiers, JS non). Pour l'API JSON vers le front, TOUJOURS convertir en `str`.
**Owner:** Dev
**Timeline:** Sprint Current
**Status:** Planned
**Verification:** Test d'intégration sauvegardant `1453870972376584192` et vérifiant qu'on ne récupère pas une valeur arrondie.

---

## Approval

**Test Design Approved By:**

- [ ] Tech Lead: Zaès Date: 2026-01-22

---

## Appendix

### Related Documents

- Epic: [Epic 2](../planning-artifacts/epics.md#epic-2-onboarding---premier-changement-%F0%9F%90%BA)
- Story: [Story 2.1](../implementation-artifacts/2-1-modele-de-donnees-werewolf.md)
