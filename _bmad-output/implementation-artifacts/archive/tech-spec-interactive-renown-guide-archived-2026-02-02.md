---
title: 'Interactive Renown Guide'
slug: 'interactive-renown-guide'
created: '2026-02-02'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Python', 'aiohttp', 'React', 'Tailwind CSS']
files_to_modify: ['modules/werewolf/routes.py', 'web/src/modules/werewolf/components/RenownGuide.jsx', 'web/src/modules/werewolf/hooks/useRenown.js']
code_patterns: ['Service/Route separation', 'React Hooks for data fetching', 'Framer Motion for animations']
test_patterns: ['pytest-asyncio', 'React Testing Library (implied)']
---

# Tech-Spec: Interactive Renown Guide

**Created:** 2026-02-02

## Overview

### Problem Statement

Le guide de renommée actuel est trop simpliste et n'explique pas les règles de montée en rang ni les spécificités liées à l'Auspice, laissant les joueurs confus sur la progression.

### Solution

Implémenter un composant "Guide de Renommée" complet et interactif avec des onglets. Il récupérera les règles spécifiques à l'Auspice via une nouvelle route API et affichera les prérequis d'avancement directement à l'utilisateur.

### Scope

**In Scope:**
- Nouvelle route API `GET /api/werewolf/renown/rules` retournant `RANK_RULES`.
- Mise à jour du composant frontend `RenownGuide.jsx` avec des onglets (Général, Comment monter, Mes prérequis).
- Intégration des données `RANK_RULES` dans la vue frontend.
- Remplacement de l'ancien guide dans `WerewolfRenownPage.jsx`.

**Out of Scope:**
- Modifications de la logique de calcul de rang elle-même.
- Interface admin pour l'édition des règles.

## Context for Development

### Codebase Patterns

- **API Routes**: Located in `modules/werewolf/routes.py`, protected by `@require_werewolf_role`.
- **Data Access**: `RenownService` interacts with `aiosqlite`.
- **Frontend**: React components in `web/src/modules/werewolf`, using `useRenown` hook for API calls.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `modules/werewolf/services/renown.py` | Contains `RANK_RULES` constant. |
| `modules/werewolf/routes.py` | Need to register new endpoint `GET /api/modules/werewolf/renown/rules`. |
| `web/src/modules/werewolf/components/RenownGuide.jsx` | Component to be completely rewritten. |
| `web/src/modules/werewolf/hooks/useRenown.js` | Add `fetchRenownRules` function. |

### Technical Decisions

1.  **Combined API Response**: The new endpoint `/api/modules/werewolf/renown/rules` will return specific `RANK_RULES` AND the user's current `auspice` and `rank` to avoid multiple round-trips.
2.  **Frontend State**: `RenownGuide` will handle its own data fetching via `useRenown`, independent of the parent page's simple renown list.
3.  **Visuals**: Use `framer-motion` for smooth tab switching, consistent with existing UI.
4.  **Rank Calculation**: The frontend will receive the raw rules and current values, but will *also* receive the server-calculated rank to ensure consistency.

## Implementation Plan

### Tasks

- [x] Task 1: Create API Endpoint for Renown Rules
  - File: `modules/werewolf/routes.py`
  - Action: Add `get_renown_rules_handler` accessible via `GET /api/modules/werewolf/renown/rules`.
  - Details:
    - Decorator: `@require_werewolf_role`
    - Logic:
      - Fetch user character to get `auspice`, `rank`, `tribe`.
      - Fetch `RANK_RULES` from `services.renown`.
      - Fetch current renown totals (Glory, Honor, Wisdom) via `RenownService.get_renown_totals(user_id)` (Need to create/expose this method in service if not exists, or calculate in route). *Decision: Expose `get_renown_totals` in `RenownService`.*
    - Response: `{ rules: RANK_RULES, my_stats: { glory, honor, wisdom }, my_auspice: "AHROUN", my_rank: 2 }`

- [x] Task 2: Update RenownService
  - File: `modules/werewolf/services/renown.py`
  - Action: Add `get_player_renown_totals(user_id)` method.
  - Details: Move the aggregation logic from `recalculate_player_rank` into a reusable method so we can display stats without triggering a recalc/update.

- [x] Task 3: Update Frontend Hook
  - File: `web/src/modules/werewolf/hooks/useRenown.js`
  - Action: Add `fetchRenownRules` function.
  - Details: `GET /api/modules/werewolf/renown/rules`. Handle loading/error states.

- [x] Task 4: Implement Interactive RenownGuide Component
  - File: `web/src/modules/werewolf/components/RenownGuide.jsx`
  - Action: Complete rewrite.
  - Details:
    - Use `useRenown` to fetch rules on mount.
    - Create 3 Tabs: "Général", "Comment monter en rang", "Ma Progression".
    - Tab 1 "Général": Existing static content (flavor text).
    - Tab 2 "Comment monter en rang": Explanation of the system (Auspice dependency).
    - Tab 3 "Ma Progression":
      - Show current stats vs Next Rank requirements.
      - Highlight "Met" requirements in Green, "Unmet" in Red.
      - Show progress bar or simple ratio (e.g., "Gloire: 3/4").
    - Use `framer-motion` for transitions.
    - Keep the "Accordion" style wrapper if desired, OR make it a permanent section per user request (User said "Remplace le bloc déroulant", implying it should likely be always visible or a cleaner card). *Decision: Make it a standard Card component, always visible or collapsible but expanded by default.*

### Acceptance Criteria

- [ ] AC 1: API returns personalization data
  - Given a logged-in User (Ahroun), when `GET /api/modules/werewolf/renown/rules` is called, then the response contains `RANK_RULES`, `my_auspice="AHROUN"`, and their current renown totals.

- [ ] AC 2: Renown Service Reusability
  - Given `get_player_renown_totals` is implemented, when called, it returns a dictionary `{glory: X, honor: Y, wisdom: Z}` without side effects (no DB updates).

- [ ] AC 3: Guide shows dynamic requirements
  - Given the User is Rank 2 Ahroun, when viewing "Ma Progression", then they see the requirements for Rank 3 Ahroun.
  - Given they have 3/4 Glory, when viewing, then Glory shows as incomplete (Red/Yellow).
  - Given they have 5/4 Honor, when viewing, then Honor shows as complete (Green).

- [ ] AC 4: Tab Navigation
  - Given the component is loaded, when clicking tabs, then the content switches smoothly.

## Additional Context

### Dependencies

- None.

### Testing Strategy

- **Unit Tests**:
  - `modules/werewolf/tests/test_renown.py`: Add test for `get_player_renown_totals`.
  - `modules/werewolf/tests/test_api_renown.py` (if exists, else create): Test the new endpoint returns 200 and correct structure.
- **Manual Verification**:
  - Login as different Auspices (Ragabash vs Ahroun).
  - Check that the "Ma Progression" tab shows different requirements.
  - Grant renown via SQL/Command, refresh page, verify progress updates.

### Notes

- Ensure `RANK_RULES` (which uses Enum keys in Python) is serialized correctly to JSON (string keys) for the frontend.

## Review Notes

- Adversarial review completed
- Findings: 1 total, 1 fixed, 0 skipped
- Resolution approach: Auto-fix

