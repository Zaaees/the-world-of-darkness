---
title: 'Module Disciplines Methuselah'
slug: 'module-disciplines-methuselah'
created: '2026-01-11'
status: 'in-progress'
stepsCompleted: [1, 2]
tech_stack: ['React', 'Tailwind CSS']
files_to_modify: ['web/src/data/disciplines.js', 'web/src/modules/vampire/components/DisciplinesTab.jsx']
code_patterns: ['Data-driven UI', 'Constant-based configuration']
test_patterns: ['Manual verification']
---

# Overview

## Problem Statement
The current system handles Vampire Disciplines only up to level 5, which is insufficient for Elder and Methuselah play (levels 6-10). The data model lacks high-level powers, and the UI is hardcoded to display a maximum of 5 dots, making it impossible to visualize or use advanced powers even if the data existed.

## Solution
Implement a comprehensive update to support Discipline levels 6-10. This includes populating the `disciplines.js` data file with missing power descriptions and refactoring the UI components (`DisciplinesTab`, `DisciplineCard`) to dynamically render up to 10 dots based on the character's Blood Potency and generation limits.

## Scope

### In Scope
-   **Data**: Complete population of `DISCIPLINES` in `web/src/data/disciplines.js` with powers for levels 6-10.
-   **Logic**: Update `getAvailableDisciplines` to correctly calculate `maxAccessibleLevel` based on Blood Potency for levels > 5.
-   **UI**: Refactor `DisciplinesTab.jsx` and related components to support a 10-dot display system.
-   **UI**: Ensure `DisciplineCard` and modal layouts handle longer text and expanded dot arrays gracefully.

### Out of Scope
-   New game mechanics engines (dice rolling for these specific powers, etc.) - purely narrative/display for now.
-   Changes to non-vampire splats.
-   Creation of new Disciplines not listed in the V20 core/lore (using provided lists).

# Context for Development
-   **Existing Data**: `DISCIPLINES` object in `disciplines.js` contains the structure. `MAX_DISCIPLINE_LEVEL` is already defined up to 10.
-   **UI Constraints**:
    -   `DisciplinesTab.jsx`: Hardcodes `isCainMode` to max level 5. Needs update to 10.
    -   `PowerCard`: Renders based on `power.level`, currently up to 5. Will naturally expand if data is present.
    -   `RitualReader`: Flexible layout, no hardcoded limits found.
-   **Generational Limits**: Controlled by `bloodPotency` passing into `getAvailableDisciplines`.
-   **Files to Modify**:
    | File | Purpose | Changes |
    |------|---------|---------|
    | `web/src/data/disciplines.js` | Data Source | Add powers 6-10 for all disciplines. |
    | `web/src/modules/vampire/components/DisciplinesTab.jsx` | UI Display | Update `maxLevel` logic for Caine; ensure grid/layout handles 10 items. |
