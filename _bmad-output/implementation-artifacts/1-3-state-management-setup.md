# Story 1.3: State Management Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to set up the Zustand store for the Grimoire,
so that the application can manage global state like the ritual list and active filters efficiently.

## Acceptance Criteria

1. **Given** the configured Zustand library, **When** I create `useGrimoireStore.js`, **Then** the store initializes with the full list of rituals from the static data file `rituals_v20.js`.
2. **Given** the store structure, **When** I inspect the state, **Then** it exposes a `filters` object (initial state empty or null) and a `rituals` array.
3. **Given** the store is implemented, **When** I run a unit test, **Then** it confirms the store mounts correctly and returns the data from the source.

## Tasks / Subtasks

- [x] Task 1: Create Zustand Store
  - [x] Create `src/modules/vampire/features/rituals/stores/useGrimoireStore.js`
  - [x] Import `create` from `zustand` and `rituals` from `../data/rituals_v20.js`.
  - [x] Define initial state: `rituals` (loaded from import), `filters` (empty object), `searchQuery` (empty string).
- [x] Task 2: Implement Store Actions (Skeleton)
  - [x] Add `setFilters(filters)` action.
  - [x] Add `setSearchQuery(query)` action.
- [x] Task 3: Create Store Test
  - [x] Create `src/modules/vampire/features/rituals/stores/useGrimoireStore.test.js`
  - [x] Test 1: Verify store initializes with data.
  - [x] Test 2: Verify actions update state (mock update).
- [x] Task 4: Verify Test Execution
  - [x] Run `npm test` and confirm pass.

## Dev Notes

- **Architecture Compliance:**
  - **State Boundary:** `useGrimoireStore` must encapsulate 100% of the UI business logic. Components should not manipulate data directly.
  - **Data Source:** Do NOT duplicate data if possible, but mapping it to a `rituals` state property is acceptable for the initial load.
  - **Immutability:** Remember `rituals_v20.js` is frozen (Object.freeze). Do not attempt to mutate it in the store.

### Project Structure Notes

- **Path:** `web/src/modules/vampire/features/rituals/stores/`
- **Naming:** File `useGrimoireStore.js`.

### References

- [Architecture: State Management](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#84)
- [Architecture: Boundaries](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#142)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

- Fixed test environment: Installed `jsdom` and `@testing-library/react`.
- Configured `vite.config.js` to use `jsdom` environment for tests.

### Completion Notes List

- Implemented `useGrimoireStore` using Zustand.
- Initialized state with `rituals` data.
- Added actions `setFilters` and `setSearchQuery`.
- Created unit tests verifying initialization and state updates.
- All tests PASSED.
- [Code Review] Implemented `beforeEach` state reset in tests to ensure isolation.
- [Code Review] Added JSDoc documentation to `useGrimoireStore`.
- [Code Review] Removed dead code and comments.

### File List

- web/src/modules/vampire/features/rituals/stores/useGrimoireStore.js
- web/src/modules/vampire/features/rituals/stores/useGrimoireStore.test.js
- web/package.json
- web/vite.config.js
