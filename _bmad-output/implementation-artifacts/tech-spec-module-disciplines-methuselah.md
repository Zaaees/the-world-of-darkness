---
title: 'Module Disciplines Methuselah'
slug: 'module-disciplines-methuselah'
created: '2026-01-11'
status: 'review'
stepsCompleted: [1, 2, 3]
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

Crucially, **we will rely on default data rendering**. `DisciplineCard` interprets `power.level` directly, so providing levels 6-10 in the data should automatically render them if we unblock the `maxLevel` constraint in `DisciplinesTab`.

## Scope

### In Scope
-   **Data**: Complete population of `DISCIPLINES` in `web/src/data/disciplines.js` with powers for levels 6-10.
-   **Logic**: Update `getAvailableDisciplines` to correctly calculate `maxAccessibleLevel` based on Blood Potency for levels > 5.
-   **UI**: Refactor `DisciplinesTab.jsx` to correctly supply the `maxAccessibleLevel` for Caine (God Mode) and high-level Elders.
-   **UI**: Ensure the layout in `DisciplinesTab.jsx` can handle the increased vertical height of 10 powers per card.

### Out of Scope
-   New game mechanics (dice rolling/automation for these specific powers).
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

# Implementation Plan

## Task 1: Update Discipline Data
Complete the `DISCIPLINES` constant in `disciplines.js` with the full text for levels 6-10.
-   **File**: `web/src/data/disciplines.js`
-   **Action**: Append objects to `powers` array for each discipline.
-   **Detail**: Ensure fields: `level`, `name`, `bloodCost`, `duration`, `description` are present for all new powers.
-   **Source**: Interpret provided "V20 Elder Disciplines" JSON/list into this format.

## Task 2: Unlock Max Level Logic
Enable the application to acknowledge levels > 5.
-   **File**: `web/src/modules/vampire/components/DisciplinesTab.jsx`
-   **Action**:  Update the `maxLevel` calculation.
    ```javascript
    // Current
    const maxLevel = isCainMode ? 5 : (MAX_DISCIPLINE_LEVEL[bloodPotency] || 2);
    // Target
    const maxLevel = isCainMode ? 10 : (MAX_DISCIPLINE_LEVEL[bloodPotency] || 2);
    ```
-   **Note**: `MAX_DISCIPLINE_LEVEL` in `disciplines.js` already goes to 10, so normal characters with BP 6+ should work automatically once the logic flows through.

## Acceptance Criteria
-   [ ] AC 1: Given a User in Caine Mode (God Mode), when they view the Disciplines tab, then they see all disciplines populated with powers from level 1 to 10.
-   [ ] AC 2: Given a Character with Blood Potency 1, when they view the Disciplines tab, then they see only levels 1-2 (unchanged regression test).
-   [ ] AC 3: Given a Character with Blood Potency 6+, when they view their Clan Disciplines, then they see levels up to their BP (e.g., BP 6 = Level 6).
-   [ ] AC 4: Inspecting `DisciplinesTab` UI shows no layout breakage with 10 powers stacked vertically (scroll or layout adapts).

# Testing Strategy

## Manual Verification
1.  **Load Caine Mode**: Login as admin/Caine.
2.  **Open Grimoire/Disciplines**: Navigate to the Vampire sheet -> Disciplines tab.
3.  **Verify Max Level**: Check "Animalism" (or first list item). Verify it shows 10 powers.
4.  **Verify Content**: Check Level 10 power description matches provided text.
5.  **Load Player Mode**: Load a low-level character (BP 1).
6.  **Verify Restriction**: Confirm only levels 1-2 are visible/unlocked.

## Dependencies
-   None. Pure frontend data/logic update.
