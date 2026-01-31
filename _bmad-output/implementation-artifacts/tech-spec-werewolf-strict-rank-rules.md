---
title: 'Module Werewolf: Règles Strictes de Rang'
slug: 'werewolf-strict-rank-rules'
created: '2026-01-31'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Python', 'pytest', 'SQLite']
files_to_modify: ['modules/werewolf/services/renown.py']
code_patterns: ['Service/Model separation', 'Static config dictionary', 'Type hinting']
test_patterns: ['pytest-asyncio', 'Table-driven tests']
---

# Tech-Spec: Module Werewolf: Règles Strictes de Rang

**Created:** 2026-01-31

## Overview

### Problem Statement

Le système actuel de calcul de rang (`RankCalculator`) est simpliste et basé uniquement sur le total de renommée accumulée. Or, les règles du jeu Werewolf exigent que l'avancement en rang soit conditionné par l'Auspice du personnage et des seuils spécifiques dans chaque type de renommée (Gloire, Honneur, Sagesse), et non simplement un total global.

### Solution

Refondre le `RankCalculator` pour implémenter une logique de validation stricte basée sur :
1. L'Auspice du personnage (récupéré via `WerewolfData`).
2. Les totaux distincts de Gloire, Honneur et Sagesse (récupérés via `RenownService`).
3. Une table de configuration statique définissant les prérequis pour chaque Rang.

### Scope

**In Scope:**
- Configurer la table des règles de Renommée (W20) pour chaque Auspice.
- Mettre à jour `RankCalculator` pour vérifier `Gloire`, `Honneur`, `Sagesse` vs les seuils.
- Mettre à jour `RenownService.recalculate_player_rank` pour agréger les totaux par type.
- Créer `modules/werewolf/tests/test_renown.py` avec des tests complets.

**Out of Scope:**
- UI changes.
- DB schema changes.

## Context for Development

### Codebase Patterns

- **Configuration :** Utiliser un dictionnaire statique `RANK_REQUIREMENTS` configuré au début de `modules/werewolf/services/renown.py`.
- **Service Layer :** `RenownService` orchestre la récupération des données (Store + Renown Requests) et délègue la logique pure à `RankCalculator`.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `modules/werewolf/services/renown.py` | Cible principale : calcul et orchestration |
| `modules/werewolf/models/store.py` | Source de l'Auspice (`WerewolfData.auspice`) |
| `modules/werewolf/tests/test_renown.py` | **Nouveau fichier** pour les tests unitaires |

### Technical Decisions

- **Rule Structure:** `RANK_RULES[Auspice][Rank]`.
- **Aggregation:** `RenownService` agrègera les demandes approuvées pour obtenir 3 totaux distincts au lieu d'un seul `COUNT(*)`.

## Implementation Plan

### Tasks

- [ ] Task 1: Create Unit Tests (TDD)
  - File: `modules/werewolf/tests/test_renown.py` (New)
  - Action: Create test file with `pytest` fixtures. Implement `test_rank_calculation` using `@pytest.mark.parametrize` to cover every line of the W20 table (approx 25 cases). Ensure tests fail initially (Red).

- [ ] Task 2: Implement Rank Rules Configuration
  - File: `modules/werewolf/services/renown.py`
  - Action: Define the `RANK_RULES` constant dictionary populated with W20 values at the module level.
  - Notes: Include specific handling for Ragabash 'any combination' rule in the structure (e.g., set specific requirements to 0 and use a special flag or check).

- [ ] Task 3: Update RankCalculator Logic
  - File: `modules/werewolf/services/renown.py`
  - Action: Modify `calculate_rank` signature to `calculate_rank(auspice, glory, honor, wisdom)`. Implement the logic to check requirements from Rank 5 down to 1 based on the Auspice. Handle Ragabash explicitly (sum check).

- [ ] Task 4: Update RenownService Aggregation
  - File: `modules/werewolf/services/renown.py`
  - Action: Update `recalculate_player_rank` to execute a SQL query that sums renown by type (GROUP BY renown_type) instead of a simple count. Fetch the user's Auspice from `WerewolfData`. Pass all values to `RankCalculator`.

- [ ] Task 5: Verify & Pass Tests
  - File: `modules/werewolf/tests/test_renown.py`
  - Action: Run tests and ensure all pass (Green). Fix any logic errors in `RankCalculator`.

### Acceptance Criteria

- [ ] AC 1: Ragabash Advancement
  - Given a Ragabash character, when they have sufficient total renown (regardless of type), then they advance to the correct rank.
- [ ] AC 2: Non-Ragabash Advancement (Success)
  - Given a non-Ragabash character (e.g., Ahroun), when they meet specific Glory/Honor/Wisdom thresholds for Rank X, then `calculate_rank` returns X.
- [ ] AC 3: Non-Ragabash Advancement (Failure)
  - Given a character with sufficient *total* renown but missing specific type requirements (e.g., Ahroun missing Glory), then they do **not** advance to the higher rank.
- [ ] AC 4: Renown Aggregation
  - Given a user with multiple approved requests of different types, when `recalculate_player_rank` is called, then it correctly aggregates sums for Glory, Honor, and Wisdom distinctively.

## Additional Context

### Dependencies

- None.

### Testing Strategy

- **Unit Tests:** `pytest modules/werewolf/tests/test_renown.py`
- **Manual Verification:** Create a character, grant specific renown via SQL or commands (if available), trigger recalculation, observe rank update in DB.

### Notes

- Ragabash rule: "Any combination" means `Sum(Glo, Hon, Wis) >= Threshold`.
- Other Auspices: `Glo >= ReqGlo AND Hon >= ReqHon AND Wis >= ReqWis`.
