---
title: 'Fix Grimoire Display & Access'
slug: 'fix-grimoire-issues'
created: '2026-01-10T22:48:42+01:00'
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: 'completed'
tech_stack: ['React', 'Zustand', 'Tailwind CSS', 'Framer Motion']
files_to_modify: 
  - 'web/src/modules/vampire/features/rituals/components/RitualReader.jsx'
  - 'web/src/modules/vampire/features/rituals/stores/useGrimoireStore.js'
  - 'web/src/modules/vampire/components/RitualsTab.jsx'
code_patterns: ['Zustand Store with useShallow', 'Tailwind Responsive Design', 'Container/Presenter Pattern']
test_patterns: ['Vitest Unit Tests', 'React Testing Library']
---

## Overview

### Problem Statement
The Grimoire feature has three critical usability issues:
1.  **Missing Descriptions**: Rituals display "Description manquante" because the UI expects a Markdown field (`description_md`) that doesn't exist in the data source (which uses `description`).
2.  **Data Leak**: Players can see all rituals (including those they don't own) because the visual restrictions are not correctly applied or the "GM Mode" is active by default.
3.  **UI Glitch**: The ritual reading pane overlaps or breaks the layout when selected, providing a poor user experience.

### Solution
We will patch the `RitualReader` to fallback to the legacy `description` field, enforce strict `PLAYER` view mode in `RitualsTab` for non-privileged users to filter the visible list, and refine the CSS/Layout strategy to ensure the reader pane sits correctly beside the list.

### Scope
**In Scope:**
- Update `RitualReader.jsx` logic to support legacy data fields.
- Update `RitualsTab.jsx` to correctly initialize `viewMode` based on user permissions.
- Validate and fix CSS layout for the master-detail view in `RitualsTab.jsx`.
- Regression testing of the Grimoire display.

**Out of Scope:**
- Migration of all data to Markdown.
- Refactoring the entire `useGrimoireStore` beyond fixing permissions.

## Context for Development

### Codebase Patterns
- **State Management**: Zustand store (`useGrimoireStore`) holds the "source of truth".
- **Data Source**: `rituals.js` contains a mix of fields; `description` is text, `description_md` is optional markdown.
- **Access Control**: `isCainMode` prop in `RitualsTab` determines GM status.

### Technical Constraints
- Must maintain `react-window` virtualization for the catalog.
- Must respect "Vampire V5" aesthetic.
- Must not break NPC view mode logic (which also depends on Store).

## Implementation Plan

- [x] Task 1: Update RitualReader Legacy Fallback
  - File: `web/src/modules/vampire/features/rituals/components/RitualReader.jsx`
  - Action: Update `ReactMarkdown` children prop to use `ritual.description_md || ritual.description`.
  - Notes: Ensure `description` (plain text) renders cleanly without markdown formatting artifacts if possible, or is wrapped in basic typography.

- [x] Task 2: Implement Store Permission Initialization
  - File: `web/src/modules/vampire/features/rituals/stores/useGrimoireStore.js`
  - Action: Add `setViewMode(mode)` action. Modify default state if needed, but primarily ensure action exists.
  - Notes: Default is currently 'GM'. This is unsafe. We should consider default 'PLAYER', but for this fix, we will rely on initialization.

- [x] Task 3: Enforce View Mode on Mount
  - File: `web/src/modules/vampire/components/RitualsTab.jsx`
  - Action: inside the `useEffect` trigger, after fetching rituals, dispatch `setViewMode(isCainMode ? 'GM' : 'PLAYER')`.
  - Notes: Ensure this happened *before* or *simultaneously* with data loading to prevent flash of content.

- [x] Task 4: Fix Layout Overlay Issue
  - File: `web/src/modules/vampire/components/RitualsTab.jsx`
  - Action: Review the Flexbox container. Ensure the parent `div` of Catalog and Reader handles overflow correctly.
## Review Notes
- Adversarial review completed
- Findings: 10 total, 2 fixed (Critical), 8 skipped (Low/Medium)
- Resolution approach: Auto-fix
- Fixed Critical Security Issue: Changed default `viewMode` to 'PLAYER' and reordered initialization to prevent data leaks.

## Acceptance Criteria

- [ ] AC 1: Ritual Description Display
  - Given a ritual with only a `description` field (no `description_md`)
  - When I select it in the Grimoire
  - Then the description text should be displayed legibly
  - And no "Description manquante" fallback should be shown.

- [ ] AC 2: Player Access Control
  - Given I am a Player (not GM, `isCainMode=false`)
  - And I do not own the 'Blood Walk' ritual
  - When I open the Grimoire
  - Then 'Blood Walk' should NOT appear in the list.

- [ ] AC 3: GM Access Control
  - Given I am a GM (`isCainMode=true`)
  - When I open the Grimoire
  - Then ALL rituals should be visible.

- [ ] AC 4: Layout Stability
  - Given I am on a Desktop view
  - When I select a ritual
  - Then the Reader pane should appear on the right (2/3 width)
  - And the Catalog should shrink to the left (1/3 width)
  - And the Reader should NOT overlap the Catalog content.

## Verification Plan

### Automated Tests
- Run `npm test web/src/modules/vampire/features/rituals/components/RitualReader.test.jsx` after changes.
- If no test exists for fallback, create one in `RitualReader.test.jsx`.

### Manual Verification
1.  **Login as Player**: Open Grimoire. Verify only owned rituals are seen.
2.  **Login as GM**: Open Grimoire. Verify all rituals are seen.
3.  **Check Descriptions**: Click on a Level 1 ritual (e.g., Blood Walk). Verify description text appears.
4.  **Resize Window**: Check layout transition between Mobile and Desktop while a ritual is selected.
