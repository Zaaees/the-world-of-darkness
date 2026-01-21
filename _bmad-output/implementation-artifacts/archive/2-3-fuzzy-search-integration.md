# Story 2.3: Fuzzy Search Integration

Status: done

<!-- ... (existing content logic preserved) ... -->

## Code Review Notes (2026-01-09)
- **Fixes Applied**:
  - Removed dead `configureFuse` code from `search.js` and tests.
  - Added accessibility (`aria-label`) to SearchInput clear button.
- **Outcome**: All ACs verified, quality issues resolved. Story complete.

## Story

As a Game Master,
I want to search for rituals by name or keywords, even with typos,
so that I can find a specific ritual quickly during a game session.

## Acceptance Criteria

1. **Given** the Search Bar, **When** I type "tomaturgie" (misspelled), **Then** the result for "Thaumaturgy" appears (Fuzzy Logic).
2. **Given** filter criteria are active (e.g., Level 3), **When** I search for "Guard", **Then** the results only show Level 3 rituals that match "Guard" (Search within Filter).
3. **Given** a search query, **When** I clear the search input, **Then** the list restores to the previous filtered state.
4. **Given** the search input, **When** I type rapidly, **Then** the search execution is debounced (approx 300ms) to prevent performance lag.

## Tasks / Subtasks

- [x] Task 1: Fuse.js Configuration
  - [x] Create `src/modules/vampire/features/rituals/utils/search.js`.
  - [x] Configure Fuse options (keys: ['name', 'discipline', 'description_md'], threshold: 0.3 or 0.4 for fuzziness).
  - [x] Implement a pure search function `searchRituals(list, query)` that returns matching items.

- [x] Task 2: Store Integration
  - [x] Update `useGrimoireStore.js` to handle `searchQuery` updates.
  - [x] Update `selectFilteredRituals` usage: ensure Search logic is applied *in conjunction* with filters.
  - [x] Recommendation: Keep `selectFilteredRituals` logic centralized. Filter first (Filter Logic), then Search (if query exists), or vice-versa? usually Filter -> Search is smaller dataset. Actually Fuse needs the whole dataset for index usually, but for <500 items, searching filtered subset is fine or searching all then filtering.
  - [x] **Correction**: Fuse works best on a collection. Strategy: Apply filters first (Discipline/Level) then Search the result? Or Search then Filter?
    - If I search "Thaumaturgy", I expect all Thaumaturgy. If I then filter "Level 1", I expect Level 1 Thaumaturgy. Logic is AND.
    - `result = rituals.filter(filters).filter(searchMatch)`
    - Fuse instance might need to be re-created if the list changes? No, better to keep one Fuse index for the *entire* collection (static data) and filtering the *results* of the search?
    - **Performance decision**: Since data is static `rituals_v20.js`, create **one** global Fuse index on init. `search(query)` returns IDs or items. Then apply Filters (Level/Discipline) to that result set.
    - If query is empty, just apply Filters to full list.

- [x] Task 3: UI Implementation
  - [x] Add `SearchInput` component (or integrated in `RitualFilter` sidebar?).
  - [x] PRD Flow says "Focus Barre de Recherche" in "Le Combat" scenario. It should be prominent.
  - [x] Placement: Top of the Sidebar? Or Top of the Grid? Sidebar seems appropriate for "Control Panel".
  - [x] Implement Debounce on the input (300ms) before updating store state.

- [x] Task 4: Testing
  - [x] Unit Test `utils/search.js` with typos ("tomaturgie" -> matches "Thaumaturgy").
  - [x] Update Store tests to verify Search + Filter combination.

## Dev Notes

### Architecture Compliance

- **Decoupling**: `utils/search.js` must be pure JS (no React hooks).
- **State**: Store holds the `searchQuery`. Components dispatch `setSearchQuery`.
- **Performance**: Use debouncing on the input component to avoid thrashing the store/selector.

### Technical Requirements

- **Library**: `fuse.js` v7.1.0+ (already in requirements).
- **Index**: For < 500 items, no need to pre-generate index heavily. Runtime indexing on mount is fine.

### References

- [PRD: Search Engine](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/prd.md#81)
- [Architecture: Frontend Stack](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#67)

## Dev Agent Record

### Agent Model Used

Antigravity

### Completion Notes List

### File List

- src/modules/vampire/features/rituals/utils/search.js
- src/modules/vampire/features/rituals/utils/search.test.js
- src/modules/vampire/features/rituals/stores/useGrimoireStore.js
- src/modules/vampire/features/rituals/stores/useGrimoireStore.test.js
- src/modules/vampire/features/rituals/components/SearchInput.jsx
- src/modules/vampire/features/rituals/components/SearchInput.test.jsx
- src/modules/vampire/features/rituals/components/RitualFilter.jsx
- src/modules/vampire/features/rituals/components/RitualFilter.test.jsx
