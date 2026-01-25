# Test Design: Epic 3 - Fiche Personnage - Le Bureau de l'Écrivain ✍️

**Date:** 2026-01-23
**Author:** Zaès (via Antigravity)
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 3, focusing on Story 3.1 to 3.4 (Edition, Sync Discord, Audit Logs).

**Risk Summary:**

- Total risks identified: 5
- High-priority risks (≥6): 2
- Critical categories: TECH, DATA

**Coverage Summary:**

- P0 scenarios: 3 (6 hours)
- P1 scenarios: 4 (4 hours)
- P2/P3 scenarios: 2 (1 hour)
- **Total effort**: 11 hours (~1.5 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-301   | TECH     | Dépassement limite Embed Discord (6000 chars) | 3 (Likely) | 2 (Degrad) | 6 | Tronquage intelligent ou lien vers le site si trop long | Dev | Sprint 3 |
| R-302   | DATA     | Perte de données / Conflits d'écriture Auto-save | 2 (Possible) | 3 (Critical) | 6 | Implémenter debounce strict + validation de version | Dev | Sprint 3 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-303   | OPS      | Discord API Unreachable (Live Sync failure) | 2 (Possible) | 2 (Degrad) | 4 | File d'attente asynchrone pour la synchronisation | Dev |
| R-304   | BUS      | Pollution des logs (Audit Log Noise) | 3 (Likely) | 1 (Minor) | 3 | Filtrage des modifications mineures/fréquentes | Dev |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------- |
| R-305   | SEC      | Accès non autorisé à l'édition d'une fiche tiers | 1 (Unlikely) | 3 (Critical) | 3 | Regression check sur le middleware RBAC | Monitor |

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Data persistence and Sync reliability (Core value)

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Sauvegarde Histoire (Auto-save) | API | R-302 | 1 | Dev | Vérifier persistence locale |
| Synchro Discord (Live Sync) | Integration| R-303 | 1 | Dev | Mock Discord Success |
| Gestion limite 6000 chars | Unit | R-301 | 1 | Dev | Vérifier logique de découpe |

**Total P0**: 3 tests, 6 hours

### P1 (High) - Run on PR to main

**Criteria**: UX and Traceability

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Génération Audit Log | Integration| R-304 | 1 | Dev | Vérifier format message log |
| Mode Focus (UI) | Component | - | 1 | Dev | Vérifier switch plein écran |
| Indicateur Sauvegarde | Component | - | 1 | Dev | State management UI |
| Erreur Sync (Mode Dégradé) | Integration| R-303 | 1 | Dev | Mock Discord Failure |

**Total P1**: 4 tests, 4 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| Multi-tab editing conflict | E2E | R-302 | 1 | QA | Concurrent browser sessions |
| Audit Log Permissions | API | R-305 | 1 | Dev | Seul MJ voit les logs |

**Total P2**: 2 tests, 1 hour

---

## Execution Order

### Smoke Tests (<5 min)

- [ ] `test_character_sheet_load` (Verify Story 3.1)
- [ ] `test_story_autosave_happy_path` (Verify Story 3.2)

### P0 Tests (<10 min)

- [ ] `test_discord_sync_payload_truncation` (Verify R-301)
- [ ] `test_discord_sync_service_call` (Verify Story 3.3)

### P1 Tests (<30 min)

- [ ] `test_audit_log_generation_on_save` (Verify Story 3.4)
- [ ] `test_focus_mode_rendering` (Verify Story 3.2 UI)

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| --------- | ----------------- | ---------- | ----------------- | ----------------------- |
| P0 | 3 | 2.0 | 6.0 | Discord Mocking is complex |
| P1 | 4 | 1.0 | 4.0 | UI/Log verification |
| P2 | 2 | 0.5 | 1.0 | Simple concurrency tests |
| **Total** | **9** | **-** | **11.0** | **~1.5 days** |

### Prerequisites

**Test Data:**
- `CharacterFactory` (Fiche existante avec `discord_thread_id`)
- `DiscordEmbedMock` (Helper pour valider les limites Discord)

**Tooling:**
- `Playwright` (for Focus mode/Auto-save UI)
- `pytest-mock` (for service isolation)

---

## Quality Gate Criteria

### Pass/Fail Thresholds
- **P0 pass rate**: 100%
- **P1 pass rate**: ≥95%
- **High-risk mitigations**: R-301 (Truncation) must be unit-tested 100%

### Coverage Targets
- **Critical paths (Edition/Sync)**: ≥90%
- **Audit Logs**: ≥70%

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests for Story 3.3.
- Run `*automate` once Epic 3 implementation is complete.

---

**Generated by**: BMad TEA Agent
**Workflow**: `_bmad/bmm/testarch/test-design`
