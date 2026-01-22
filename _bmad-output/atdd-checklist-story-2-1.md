# ATDD Checklist - Story 2.1: Modèle de Données Werewolf

## Overview

**Story ID**: 2.1
**Primary Test Level**: Integration (Backend/DB)
**Status**: 🔴 RED (Tests Created, Pending Implementation)

This document outlines the acceptance tests created before implementation. These tests define the expected behavior of the Werewolf data model and MUST pass for the story to be considered complete.

---

## Acceptance Criteria Breakdown

| AC ID | Requirement | Test File | Test Name |
| ----- | ----------- | --------- | --------- |
| 1 | Table columns & storage | `modules/werewolf/tests/test_store.py` | `test_store_create_character_success` |
| 1 | Discord ID precision | `modules/werewolf/tests/test_store.py` | `test_store_discord_id_precision` |
| 2 | Field Immutability | `modules/werewolf/tests/test_store.py` | `test_store_immutability_enforcement` |
| 2 | Unique User ID | `modules/werewolf/tests/test_store.py` | `test_store_unique_constraint` |

---

## Created Assets

### Test Files

- **[NEW]** `modules/werewolf/tests/test_store.py` (4 tests)
  - `test_create_table_sql_validity`: Smoke test for SQL syntax.
  - `test_store_create_character_success`: Verifies full CRUD (Create/Read).
  - `test_store_discord_id_precision`: **P0** Validates 19-digit ID storage.
  - `test_store_immutability_enforcement`: **P1** Validates business logic for updates.
  - `test_store_unique_constraint`: **P1** Validates DB constraints.

### Infrastructure

- **[NEW]** `modules/werewolf/tests/fixtures/factories.py`
  - `create_werewolf_data(overrides)`: Faker-based factory for valid character data.
  - Generates valid Breeds, Auspices, Tribes randomly.
  - Handles Discord ID generation (18-19 digits).

- **[NEW]** `modules/werewolf/tests/conftest.py`
  - `db_connection`: Async fixture for `aiosqlite` in-memory database.
  - `cleanup_tables`: Auto-cleanup fixture (DROP TABLE) for isolation.

---

## Implementation Checklist (Dev Team)

Complete these tasks to reach GREEN phase:

- [ ] **Infrastructure**
    - [ ] Create `modules/werewolf/models/` directory.
    - [ ] verified `aiosqlite` is installed/available.

- [ ] **Model Implementation** (`modules/werewolf/models/store.py`)
    - [ ] Define `WerewolfData` DTO (dataclass/pydantic).
    - [ ] Implement `create_werewolf_table(db)` DDL.
        - [ ] Ensure `user_id` is PRIMARY KEY.
        - [ ] Ensure `discord_thread_id` is TEXT or BIGINT (for ID precision).
    - [ ] Implement `create_werewolf_data(db, dto)`.
    - [ ] Implement `get_werewolf_data(db, user_id)`.
    - [ ] Implement `update_werewolf_data(db, user_id, updates)`.
        - [ ] Filter out `breed`, `auspice`, `tribe` from updates (Immutability).

- [ ] **Verification**
    - [ ] Run tests: `pytest modules/werewolf/tests/test_store.py`
    - [ ] Fix any failures until all 4 tests pass.

---

## Execution Commands

```bash
# Run all specific tests for this story
python -m pytest modules/werewolf/tests/test_store.py

# Run only P0 critical tests
python -m pytest modules/werewolf/tests/test_store.py -k "precision"
```

## Mock & Data Requirements

- **Discord IDs**: Must be handled as `str` in Python and `TEXT` or `INTEGER` (BigInt) in SQLite to preserve 64-bit precision.
- **Immutability**: The backend store MUST silently ignore or reject attempts to change Breed/Auspice/Tribe.

---

## Red-Green-Refactor Log

- **RED**: Tests created on 2026-01-22. Verified failure (ImportError/ModuleNotFound).
- **GREEN**: [Pending Dev]
- **REFACTOR**: [Pending Dev]
