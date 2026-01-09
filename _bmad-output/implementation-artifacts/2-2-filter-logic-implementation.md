# Story 2.2: Filter Logic Implementation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Game Master,
I want to filter the ritual list by Discipline and Level,
So that I can narrow down my search to specific criteria (e.g., "Level 3 Thaumaturgy").

## Acceptance Criteria

1. **Given** the Filter Panel is available, **When** I select "Thaumaturgy" from the Discipline list, **Then** only rituals belonging to Thaumaturgy are displayed.
2. **Given** I have "Thaumaturgy" selected, **When** I also select "Level 3", **Then** only rituals that are BOTH "Thaumaturgy" AND "Level 3" are shown (AND Logic).
3. **Given** active filters, **When** I click a "Clear Filters" or "Reset" button, **Then** the list reverts to showing all rituals.
4. **Given** no results match the filters, **Then** a friendly "No rituals found" message is displayed.

## Tasks / Subtasks

- [x] Task 1: Update State Management (Store)
  - [x] Update `src/modules/vampire/features/rituals/stores/useGrimoireStore.js`.
  - [x] Keep `filters` state object `{ disciplines: [], levels: [] }` (or similar structure).
  - [x] Implement `addFilter`, `removeFilter`, `clearFilters` actions.
  - [x] Implement a selector `selectFilteredRituals` that applies both Filters AND Search Query (from Story 2.3 preparation) to the `rituals` list.
  
- [x] Task 2: Create Filter UI Component
  - [x] Create `src/modules/vampire/features/rituals/components/RitualFilter.jsx`.
  - [x] Implement multi-select or single-select UI for Disciplines (Checbox or Buttons).
  - [x] Implement UI for Levels (1-5).
  - [x] Connect to `useGrimoireStore` to read selection and dispatch actions.
  - [x] Styling: Ensure it fits the "V5 Editorial" aesthetic (side panel or top bar).

- [x] Task 3: Integrate into Catalog Layout
  - [x] Update `src/modules/vampire/components/RitualsTab.jsx` or `RitualCatalog.jsx` to respond to the filtered list.
  - [x] Ensure the Virtualized List (`RitualCatalog`) receives the *filtered* list from the store, not the raw full list.
  - [x] Place `RitualFilter` in the layout (e.g., Sidebar on Desktop, maybe Collapsible on Mobile - see Story 4.2 for full mobile polish, but make it functional now).

- [x] Task 4: Unit Testing
  - [x] Test `useGrimoireStore` selectors to verify filtering logic (AND logic).
  - [x] Test `RitualFilter` component rendering and interactions.

### Completion Notes List

- Implemented `useGrimoireStore` updates: `addFilter`, `removeFilter`, `clearFilters`, `selectFilteredRituals`.
- Created `RitualFilter` component with Discipline (checkbox) and Level (button) filters.
- Integrated `RitualFilter` into `RitualsTab` layout (Sidebar + Main Content).
- Updated `RitualCatalog` to use filtered data.
- Added unit tests for Store logic and UI Component interactions (100% pass).
- Verified implementation against Acceptance Criteria (filtering works, cleared correctly, AND logic applied).
- ✅ Resolved Review Findings:
  - Added "No rituals found" empty state to `RitualCatalog` (Critical/AC4).
  - Updated `RitualFilter` to derive disciplines dynamically from store data (Medium/Maintainability).

### File List
- src/modules/vampire/features/rituals/stores/useGrimoireStore.js
- src/modules/vampire/features/rituals/stores/useGrimoireStore.test.js
- src/modules/vampire/features/rituals/components/RitualFilter.jsx
- src/modules/vampire/features/rituals/components/RitualFilter.test.jsx
- src/modules/vampire/features/rituals/components/RitualCatalog.jsx
- src/modules/vampire/components/RitualsTab.jsx

## Dev Notes

### Architecture Compliance
- **Store:** Logic MUST reside in `useGrimoireStore` selectors. Do not filter inside the React Component render body.
- **Performance:** Memoize the filtered list selector if necessary to avoid re-calculating on every unrelated render, although for <500 items standard array `filter` is fast enough.
- **Responsiveness:** For this story, focus on functionality. A simple side column or top bar is fine. Mobile polish comes in Story 4.2, but ensure it's usable.

### Technical Requirements
- **Discipline Data:** Import available disciplines from `src/data/disciplines.js` or derive dynamically from the ritual list if preferred, but referencing the source of truth is safer.
- **UI:** Use standard Tailwind form elements or custom styled buttons.

### References
- [Architecture: State Management](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#84)
- [Story 2.1: Virtualized Catalog](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/2-1-virtualized-catalog-ui.md) (Previous Story)
