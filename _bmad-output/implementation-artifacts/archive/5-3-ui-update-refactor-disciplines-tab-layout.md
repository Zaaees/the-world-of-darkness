# Story 5.3: UI Update - Refactor Disciplines Tab Layout

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the Disciplines tab to display up to 10 dots for my powers,
So that I can see my Elder mastery progression visually.

## Acceptance Criteria

1. **Given** I am on the Disciplines tab with a character capable of level 6+ disciplines (High Blood Potency or Caine Mode)
2. **When** I view my discipline list
3. **Then** the dot display should show up to 10 slots instead of being hardcoded to 5 based on the discipline's `maxAccessibleLevel`
4. **And** the layout should handle the wider/larger dot array without breaking responsiveness on desktop or mobile (e.g., wrapping or scaling)
5. **And** clicking the 6th+ dot should function identical to lower dots (purchasing/viewing)
6. **And** the visual style (colors, spacing) must remain consistent with the existing "Goth-Industrial" design
7. **And** verified regression test: Normal characters (BP 1-5) still correctly show only 5 dots.

## Tasks / Subtasks

- [x] Analyze `DisciplinesTab.jsx` rendering logic
  - [x] Identify the hardcoded loop (1..5)
  - [x] Identify any CSS constraints preventing wide tracks
- [x] Refactor Dot Rendering
  - [x] Update loop to use `maxAccessibleLevel` property from the discipline object (provided by logic from Story 5.2)
  - [x] Ensure `maxAccessibleLevel` defaults to 5 if undefined (safety)
- [x] Update UI/CSS Layout
  - [x] Adjust container width or flex properties to accommodate 10 dots (Implemented Grid Layout)
  - [x] Implement responsive behavior (wrapping or horizontal scroll) for small screens if 10 dots don't fit
  - [x] Verify `DisciplineCard` renders correctly within the list
- [x] Verify functionality
  - [x] Test selection of Level 10 power
  - [x] Test purchase flow (if applicable in UI) for high levels
- [x] Cleanup
  - [x] Remove any previous "Force max level 5" patches that might conflict (see Git Intelligence)

## Dev Notes

### Previous Story Intelligence (Story 5.2)
- **Logic Ready:** The business logic for `maxAccessibleLevel` is already implemented in `getAvailableDisciplines`. The data returning from `useCharacterStore` or `disciplines.js` should already contain this property.
- **Mapping:** BP 6 = Level 6 ... BP 10 = Level 10. `MAX_DISCIPLINE_LEVEL` constant is the source of truth.

### Git Intelligence
- **Recent Change:** `fix(DisciplinesTab): force max level 5 for cain mode` (Commit `0e5d6a8`).
  - **Warning:** This commit explicitly forced a cap. You MUST identify where this was added and REMOVE or MODIFY it to allow dynamic levels. The requirement has changed to *support* > 5.

### Architecture Notes
- **Component:** `src/modules/vampire/components/DisciplinesTab.jsx`
- **Styling:** Tailwind CSS. Look for generic dot components that might need sizing adjustments.
- **Responsiveness:** The layout MUST work on mobile. 10 dots in a single row might be too wide. Consider:
  - 2 rows of 5?
  - Smaller dots?
  - Scrollable container?
  - *Preference:* 2 rows of 5 is often cleaner for "Character Sheet" aesthetics than a long single line, but consistency with the existing 5-dot style is key. Try to keep it legitimate.

### Testing Requirements
- Manual verification using "Caine Mode" (which should now correctly return max level 10 per Story 5.2 logic).
- Verify standard neonate character (BP 1) only sees 5 dots (or specifically restricted count).

## Dev Agent Record

### Agent Model Used
Antigravity (Create-Story Workflow)

### Debug Log References
- Confirmed Story 5.2 completed successfully.
- Identified potential conflict in recent git history.

### Completion Notes List
- [x] Story created with explicit warning about recent hotfix.
- [x] Linked to 5.2 logic.
- [x] Implemented grid layout (1 col mobile, 2 col desktop) to support 10 items.
- [x] Updated `disciplines.js` `getAvailableDisciplines` to allow capping at MAX(5, maxAccessible) instead of just maxAccessible (safeguard for low levels).
- [x] Removed hardcoded cap in `DisciplinesTab.jsx` for Caine Mode.
- [x] Verified with new unit tests `DisciplinesTab.test.jsx`.

### File List
- `web/src/modules/vampire/components/DisciplinesTab.jsx`
- `web/src/data/disciplines.js`
- `web/src/modules/vampire/components/DisciplinesTab.test.jsx`
