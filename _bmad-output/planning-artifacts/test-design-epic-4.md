# Test Design: Epic 4 - Hauts Faits - La Gloire 🏆

**Date:** 2026-01-25
**Author:** Zaès (via Antigravity)
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 4, covering Stories 4.1-4.4 (Renommée model, submission form, MJ dashboard, validation workflow).

**Risk Summary:**

- Total risks identified: 6
- High-priority risks (≥6): 2
- Critical categories: SEC, BUS, DATA

**Coverage Summary:**

- P0 scenarios: 4 (8 hours)
- P1 scenarios: 5 (5 hours)
- P2/P3 scenarios: 3 (1.5 hours)
- **Total effort**: 14.5 hours (~2 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-401   | SEC      | Joueur non-MJ accède au dashboard MJ `/werewolf/admin/renown` | 2 (Possible) | 3 (Critical) | 6 | Middleware RBAC vérifiant rôle MJ `1462941982161764556` côté serveur | Dev | Sprint 4 |
| R-402   | BUS      | Validation d'un Haut Fait sans recalcul correct du Rang | 2 (Possible) | 3 (Critical) | 6 | Tests unitaires exhaustifs sur la logique de calcul de rang dans `renown.py` | Dev | Sprint 4 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-403   | DATA     | Haut Fait doublon (soumission multiple d'un même accomplissement) | 2 (Possible) | 2 (Degrad) | 4 | Debounce sur le bouton submit + validation unicité côté API | Dev |
| R-404   | OPS      | Notification Discord échoue après validation MJ | 2 (Possible) | 2 (Degrad) | 4 | File d'attente async + retry + log d'erreur visible | Dev |
| R-405   | TECH     | Perte de données formulaire avant soumission (refresh/navigation) | 2 (Possible) | 2 (Degrad) | 4 | Auto-save local (localStorage) du brouillon | Dev |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------- |
| R-406   | BUS      | Confusion joueur sur le type de Renommée (Glory/Honor/Wisdom) | 2 (Possible) | 1 (Minor) | 2 | Tooltips explicatifs sur le formulaire | Monitor |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Accès MJ Dashboard (RBAC) | API | R-401 | 1 | Dev | 403 si non-MJ |
| Calcul Rang après validation | Unit | R-402 | 2 | Dev | Glory/Honor/Wisdom |
| Création entrée `werewolf_renown` | API | - | 1 | Dev | Persistance DB OK |

**Total P0**: 4 tests, 8 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Formulaire soumission (UI) | Component | R-405 | 1 | Dev | Validation champs |
| Liste demandes en attente (MJ) | API | - | 1 | Dev | Filtrage par status |
| Notification Discord joueur | Integration | R-404 | 1 | Dev | Mock Discord |
| Anti-doublon soumission | API | R-403 | 1 | Dev | Rate limit |
| Mise à jour RenownBadge | Component | - | 1 | Dev | Reflect new rank |

**Total P1**: 5 tests, 5 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Rejet Haut Fait par MJ | API | - | 1 | Dev | Status change |
| Historique Hauts Faits joueur | API | - | 1 | Dev | Liste approved |
| Tooltips types renommée | E2E | R-406 | 1 | QA | UX clarity |

**Total P2**: 3 tests, 1.5 hours

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] `test_renown_table_exists` - Verify Story 4.1 (30s)
- [ ] `test_renown_submission_form_renders` - Verify Story 4.2 (45s)
- [ ] `test_mj_dashboard_route_protected` - Verify Story 4.3 (30s)

**Total**: 3 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [ ] `test_renown_creation_api` (API)
- [ ] `test_rank_calculation_glory` (Unit)
- [ ] `test_rank_calculation_mixed` (Unit)
- [ ] `test_rbac_mj_route_403_non_mj` (API)

**Total**: 4 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [ ] `test_renown_form_validation` (Component)
- [ ] `test_mj_pending_list_filter` (API)
- [ ] `test_discord_notification_on_approval` (Integration)
- [ ] `test_duplicate_submission_prevention` (API)
- [ ] `test_renown_badge_update_on_rank_change` (Component)

**Total**: 5 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [ ] `test_renown_rejection_flow` (API)
- [ ] `test_player_renown_history` (API)
- [ ] `test_renown_type_tooltips` (E2E)

**Total**: 3 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority  | Count | Hours/Test | Total Hours | Notes                   |
| --------- | ----- | ---------- | ----------- | ----------------------- |
| P0        | 4     | 2.0        | 8.0         | RBAC + Business logic   |
| P1        | 5     | 1.0        | 5.0         | Forms + Notifications   |
| P2        | 3     | 0.5        | 1.5         | Edge cases              |
| **Total** | **12**| **-**      | **14.5**    | **~2 days**             |

### Prerequisites

**Test Data:**

- `RenownRequestFactory` factory (faker-based, auto-cleanup)
- `WerewolfUserFixture` fixture (user with werewolf_data entry)
- `MJUserFixture` fixture (user with MJ role `1462941982161764556`)

**Tooling:**

- `pytest-mock` for Discord API isolation
- `Playwright` for E2E flows (dashboard validation)
- `Vitest` for Component tests (RenownBadge, SubmissionForm)

**Environment:**

- Test database with `werewolf_renown` table seeded
- Mock Discord API responses for notification tests

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **P2/P3 pass rate**: ≥90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths (Submission→Validation→Rank)**: ≥85%
- **Security scenarios (RBAC)**: 100%
- **Business logic (Rank calculation)**: ≥90%
- **Edge cases**: ≥50%

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated
- [ ] Security tests (SEC category R-401) pass 100%
- [ ] Rank calculation tests pass 100%

---

## Mitigation Plans

### R-401: Accès MJ Dashboard par non-MJ (Score: 6)

**Mitigation Strategy:** Implémenter un middleware `require_mj_role` dans `api_server.py` vérifiant le rôle Discord `1462941982161764556` à chaque requête sur `/api/modules/werewolf/admin/*`. Retourner 403 avec message thématique si non-MJ.
**Owner:** Dev
**Timeline:** Story 4.3
**Status:** Planned
**Verification:** Test API `test_rbac_mj_route_403_non_mj` + test manuel

### R-402: Erreur calcul de Rang (Score: 6)

**Mitigation Strategy:** Créer des tests unitaires exhaustifs dans `test_renown.py` couvrant tous les scénarios de calcul de rang (Glory only, Honor only, Wisdom only, mixed types, cumulative points). Valider les règles métier avec le MJ avant implémentation.
**Owner:** Dev
**Timeline:** Story 4.4
**Status:** Planned
**Verification:** Suite de tests unitaires avec assertions claires sur les valeurs de rang attendues

---

## Assumptions and Dependencies

### Assumptions

1. La table `werewolf_data` existe déjà et contient le champ `rank`
2. Le composant `RenownBadge` est déjà implémenté (confirmé: existe dans le repo)
3. Les règles de calcul de rang suivent les règles standard de Werewolf: The Apocalypse

### Dependencies

1. Epic 2 (Onboarding) complété - Required for user with werewolf_data
2. Discord Bot fonctionnel - Required for notification tests
3. Middleware RBAC existant - Required for extending to MJ role

### Risks to Plan

- **Risk**: Règles de calcul de rang non documentées
  - **Impact**: Tests unitaires bloqués ou incorrects
  - **Contingency**: Demander validation des règles au MJ avant implémentation

---

## Story Coverage Map

| Story | FR Covered | Key Tests |
|-------|------------|-----------|
| 4.1 Modèle de Données Renommée | - | `test_renown_table_exists`, `test_renown_creation_api` |
| 4.2 Formulaire de Soumission | FR8 | `test_renown_form_validation`, `test_duplicate_submission_prevention` |
| 4.3 Dashboard MJ | FR9 | `test_mj_dashboard_route_protected`, `test_mj_pending_list_filter` |
| 4.4 Validation et Mise à Jour Rang | FR9 | `test_rank_calculation_*`, `test_discord_notification_on_approval`, `test_renown_badge_update_on_rank_change` |

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests (separate workflow; not auto-run).
- Run `*automate` for broader coverage once implementation exists.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: Zaès Date: ____
- [ ] Tech Lead: ____ Date: ____
- [ ] QA Lead: ____ Date: ____

**Comments:**

---

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

### Related Documents

- PRD: [prd.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/prd.md)
- Epic: [epics.md#epic-4](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md)
- Architecture: [architecture.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md)

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
