# Story 3.2: Restricted Player View

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Player,
I want to see ONLY the rituals I have learned in my list,
so that I am not spoiled by unknown content and can focus on my character's actual capabilities.

## Acceptance Criteria

1. **Given** I am in "Player Mode" (Simulated Role), **When** I view the ritual list, **Then** I see only rituals whose IDs are in `activeCharacter.rituals`.
2. **Given** I am in "Player Mode", **When** I search for a ritual I do not possess (e.g. by name), **Then** it does NOT appear in the results (Hidden/Ghosted).
3. **Given** I switch to "GM Mode", **When** I view the list, **Then** I see ALL rituals (subject to standard filters).
4. **Given** I am in Player Mode, **When** I define filters (Level/Discipline), **Then** they only apply to my owned rituals.

## Tasks / Subtasks

- [x] Task 1: Store Logic Implementation
  - [x] Update `useGrimoireStore.js`:
    - [x] Add `viewMode` state (default: 'GM', enum: ['GM', 'PLAYER']).
    - [x] Add `toggleViewMode` or `setViewMode` action.
    - [x] Update `selectFilteredRituals` selector:
      - [x] Logic: If `viewMode === 'PLAYER'`, pre-filter `state.rituals` to keep only items where `id` is in `activeCharacter.rituals`.
      - [x] Logic: Ensure this pre-filter happens *before* or *integrated with* the criteria filters/search.
  - [x] Add `learnRitual` usage in test/init (or ensure mock character has some rituals) to verify the feature. Update `MOCK_CHARACTER` to have 1-2 rituals initially for testing.

- [x] Task 2: UI Implementation (View Toggle)
  - [x] Add a "Mode Switch" (Toggle/Button) to the interface (Header or Sidebar).
    - [x] Label: "Vue MJ" vs "Vue Joueur".
  - [x] Connect to `toggleViewMode`.
  - [x] Ensure the Ritual List re-renders correctly when toggled.

- [x] Task 3: Testing
  - [x] Unit Test `selectFilteredRituals`:
    - [x] Case: GM Mode returns full list.
    - [x] Case: Player Mode returns subset.
    - [x] Case: Player Mode + Search doesn't find unowned ritual.
  - [x] Component Test (or Manual): Verify toggle interaction.

## Dev Notes

### Architecture Compliance

- **State Management**: Logic MUST reside in `useGrimoireStore` selectors. Do NOT filter in the React Component.
- **Mocking**: Continue using `activeCharacter` context. The `viewMode` simulates the auth/role state for now.
- **Performance**: `selectFilteredRituals` runs on every render/search. Ensure the `includes` check is efficient (e.g., using a Set if the list is huge, but for <1000 items, `Array.includes` is fine). **Optimization**: `useGrimoireStore` mock character rituals is an array.

### Technical Requirements

- **Filtering Hierarchy**:
  1. **Security/Role Filter** (GM vs Player) -> Base Dataset.
  2. **Criteria Filter** (Discipline/Level).
  3. **Search** (Fuzzy).
  - *Note*: Apply strict filters first for performance.

### Previous Story Intelligence (3.1 & 2.x)

- **3.1**: Added `MOCK_CHARACTER` and `learnRitual`. You can use `learnRitual` in the browser console or a temp button to add rituals to test the "Player View".
- **State**: The store uses a "selector pattern" (`selectFilteredRituals`). Modify this specific function.

### References

- [Epics: Story 3.2](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/epics.md)
- [Architecture](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md)
- [Store Implementation](file:///c:/Users/freed/Desktop/the-world-of-darkness/web/src/modules/vampire/features/rituals/stores/useGrimoireStore.js)

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Test failures in Red Phase confirmed logic gaps.
- UI Test environment issues resolved by running in correct directory.

### Completion Notes List

- Implemented `viewMode` in `useGrimoireStore`.
- Added logic to filter rituals by `activeCharacter.rituals` when in PLAYER mode.
- Added UI Toggle in `RitualFilter` sidebar.
- Verified with comprehensive unit and component tests.
- [Code Review Fix] Updated `RitualsTab.jsx` to separate Master List from User Permissions (AC3 Fix).
- [Code Review Fix] Added `updateCharacterRituals` to store.

### File List

web/src/modules/vampire/features/rituals/stores/useGrimoireStore.js
web/src/modules/vampire/features/rituals/stores/useGrimoireStore.test.js
web/src/modules/vampire/features/rituals/components/RitualFilter.jsx
web/src/modules/vampire/features/rituals/components/RitualFilter.test.jsx
web/src/modules/vampire/components/RitualsTab.jsx
