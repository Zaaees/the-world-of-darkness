# Story 5.5: Caine Mode High-Level Display

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an Admin/Developer,
I want "Caine Mode" to reveal all 10 levels of every discipline,
So that I can verify the full dataset and UI behavior instantly without manually editing character stats.

## Acceptance Criteria

1. **Given** I am on the Character Sheet or Dashboard
2. **When** I activate "Caine Mode" (via GM toggles or debug action)
3. **Then** the Disciplines tab should render **all** configured disciplines
4. **And** every discipline should show levels 1 through 10 as viewable (dots 6-10 visible)
5. **And** I should be able to click and inspect any level 10 power (e.g., "Plot Device") without "Blood Potency" restrictions
6. **And** the UI should clearly indicate that "God Mode/Caine Mode" is active to distinguish from normal gameplay
7. **And** no crashes should occur when rendering undefined high-level powers (graceful fallback)

## Tasks / Subtasks

- [x] Analyze and Refactor `SheetPage.jsx` State
  - [x] Identify current `isCainMode` usages (GM Dashboard toggle vs Debug Flag).
  - [x] Implement a clear "Unlock All" boolean state (e.g., `isGodMode` or extend `isCainMode`).
  - [x] Ensure `DisciplinesTab` receives `isCainMode={true}` when this state is active (removing the hardcoded `npcCharacter?.id === 'cain_legendary'` restriction).
- [x] Update `DisciplinesTab.jsx` logic
  - [x] Verify `maxLevel` calculation allows 10 when `isCainMode` is true.
  - [x] Ensure `getAvailableDisciplines` bypass (or overlay logic) permits showing ALL disciplines, not just the character's clan disciplines.
- [x] Verify Level 6-10 Rendering
  - [x] Test layout with the full 10-dot grid.
  - [x] Verify `DisciplineDetailModal` opens for Level 10 powers.
- [x] Safety Checks
  - [x] Ensure normal users (Players) cannot accidentally trigger this mode.
  - [x] Verify that saving a character while in this mode does NOT persist the "Unlocked" state permanently (display only).

## Dev Notes

### Architecture & Tech Stack

- **Primary Logic:** `web/src/modules/vampire/pages/SheetPage.jsx` (State Container).
- **Display Component:** `web/src/modules/vampire/components/DisciplinesTab.jsx`.
- **Data Source:** `web/src/data/disciplines.js`.
- **State Pattern:** Pass explicit props (`isCainMode`) rather than relying on global store for this view-specific override.

### Critical Developer Context

- **Current Implementation Gap:**
  - `SheetPage.jsx` currently passes `isCainMode={npcCharacter?.id === 'cain_legendary'}` to `DisciplinesTab`. This is too restrictive.
  - The goal is to allow *any* character (or a generic view) to be inspected with full access for debugging.
  - **Correction:** You may need to add a "Toggle God Mode" button in the GM Dashboard or rules tab that sets a temporary state `showAllDisciplines`.

- **Caine Mode Logic:**
  - In `DisciplinesTab.jsx`: `const maxLevel = isCainMode ? 10 : (MAX_DISCIPLINE_LEVEL[bloodPotency] || 2);`
  - This logic is already correct, but the *trigger* (prop) is broken/limited.

### Previous Story Intelligence (Story 5.4, 5.3)

- **Crash Prevention:** Previous commits (e.g., `0e5d6a8`) capped Caine Mode to level 5 to prevent crashes. **You must remove/revert this safety cap** now that data is populated.
- **Data Completeness:** Level 6-10 data was populated in Story 5.1. Use `disciplines.js` as the source of truth.
- **UI Overflow:** Story 5.4 ensured the Modal handles long text. Verify this still holds for Level 10 descriptions.

### Git Intelligence

- **Commit `0e5d6a8`**: "fix(DisciplinesTab): force max level 5 for cain mode".
  - **Action:** Find this logic and remove it. The code is likely `const maxLevel = isCainMode ? 10 : ...` but was temporarily patched. Check `DisciplinesTab.jsx` lines ~173.

### Design System Compatibility

- **Visual Indicator:** When Caine Mode is active, maybe add a subtle glow or "DEV MODE" badge in the UI header to warn the user that what they are seeing is not standard gameplay rules.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- `web/src/modules/vampire/pages/SheetPage.jsx`
- `web/src/modules/vampire/components/DisciplinesTab.jsx`
- `web/src/modules/vampire/components/DisciplineDetailModal.jsx`
- `web/src/data/disciplines.js`
- `web/src/modules/vampire/components/DisciplinesTab.CaineMode.test.jsx`
