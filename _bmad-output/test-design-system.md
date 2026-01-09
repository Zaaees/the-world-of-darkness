# System-Level Test Design

**Project:** The World of Darkness - Grimoire
**Phase:** 3 (Solutioning)
**Date:** 2026-01-08

## Testability Assessment

### Controllability: ✅ PASS
- **State Management**: The use of `zustand` (`useGrimoireStore`) provides a single source of truth for UI state (filters, search), making it easy to seed state for tests.
- **Data Source**: The `rituals_v20.js` file is static and immutable. This removes the need for database seeding or complex API mocking. We can easily mock this module in tests to provide deterministic data sets (e.g., specific edge cases).
- **Environment**: No backend dependency ensures highly controllable test environments without network flakiness.

### Observability: ⚠️ CONCERNS
- **Virtualization**: The use of `react-window` means DOM elements for rituals outside the viewport will not be present. This poses a challenge for E2E testing (e.g., "Find Ritual X") as standard locators might fail if the item isn't scrolled into view.
    - *Mitigation*: E2E tests must implement "scroll to item" logic or focus on searching to isolate items rather than scrolling.
- **Client-Side Logic**: Logic is entirely client-side, making it easy to observe via browser devtools, but difficult to monitor in production (no server logs).
    - *Mitigation*: Rely on `console` or error boundaries for development debugging.

### Reliability: ✅ PASS
- **Deterministic**: The application is effectively a pure function of (Static Data + User Input). There are no race conditions from network calls (except minimal async for `fuse.js` worker if used).
- **Isolation**: The Modular Architecture (`src/modules/vampire`) ensures tests can be scoped strictly to the Grimoire feature without side effects from other system parts.

## Architecturally Significant Requirements (ASRs)

| ASR ID | Category | Requirement | Risk Score (PxI) | Test Impact |
| :--- | :--- | :--- | :--- | :--- |
| **ASR-01** | PERF | Rendering >100 items @ 60fps | 6 (3x2) | Requires validation of `react-window` implementation. Traditional component tests may not catch fps drops. |
| **ASR-02** | UX | Mobile-First Portrait Mode | 6 (2x3) | E2E tests **must** run on mobile viewports. Layout breaks are critical. |
| **ASR-03** | DATA | Build-time Data Integrity | 9 (3x3) | Malformed JSON crashes the app. Critical need for build-time unit tests. |
| **ASR-04** | TECH | Narrative "Soft Warning" Logic | 4 (2x2) | Logic must be verified at Unit level to ensure warnings trigger correctly without blocking. |

## Test Levels Strategy

Given the "Thick Client / Static Data" architecture, we recommend a heavy emphasis on Unit and Component testing.

### Unit Testing (60%)
- **Focus**: `useGrimoireStore` (State transitions), `utils/search.js` (Fuzzy logic configuration), `utils/transform.js` (Data helpers).
- **Rationale**: The heavy lifting is logic (filtering, searching) rather than I/O. Unit tests are fastest and sufficient here.
- **Tooling**: `Vitest` (Fast, native Vite support).

### Integration / Component Testing (30%)
- **Focus**: `RitualCatalog` (Virtualization behavior), `RitualReader` (Markdown rendering), `RitualFilter` (Interaction with Store).
- **Rationale**: We need to verify that components react correctly to Store changes. `react-markdown` integration needs verification to ensure styling is applied.
- **Tooling**: `Vitest` + `React Testing Library`.

### End-to-End (E2E) Testing (10%)
- **Focus**: Critical User Flows (GM Attribution, Player View), Mobile Responsiveness.
- **Rationale**: Only needed to verify the "glue" and visual layout. Expensive to maintain for virtualized lists.
- **Tooling**: `Playwright` (Mobile emulation).

## NFR Testing Approach

### Performance (Rendering)
- **Risk**: `react-window` conflict with `Framer Motion`.
- **Validation**: Manual "Scroll Test" during development. Automated: Limit number of DOM nodes in simple Component test provided to `RitualCatalog`.
- **Target**: No lag during fast scroll.

### Security (Data Access)
- **Risk**: "Fair Play" model allows users to read standard `rituals_v20.js`.
- **Validation**: None required for backend (static). Ensure "Hidden" rituals are filtered at the selector level in UI before rendering.
- **Test**: Unit test `selectVisibleRituals(state)` to ensure it excludes unlearned rituals for players.

### Maintainability (Data Integrity)
- **Risk**: Typographical errors or duplicate IDs in data file.
- **Validation**: **Blocking Build Script**. A dedicated test suite (`rituals.test.js`) runs validation against `rituals_v20.js` schema.
- **CI/CD**: `npm run build` must fail if data is invalid.

## Testability Concerns (Gate Check)

1.  **❌ Virtualization vs Animation**: The architecture notes potential conflict between `react-window` and `Framer Motion`.
    *   *Recommendation*: Prototype this interaction early (Sprint 0). If animations break scrolling, drop animations for the list view (keep for Detail view).
2.  **⚠️ Mobile Search UX**: On mobile, fuzzy search results might be hidden by keyboard or limited screen space.
    *   *Recommendation*: E2E tests must include interactions with the virtual keyboard on mobile view.

## Recommendations for Implementation

1.  **Setup Vitest** immediately for the "Data Validation" suite. This is the highest ROI test.
2.  **Mock Data for Tests**: Create a small `fixtures/rituals_mock.js` (5 items) for testing Filters/Search, rather than importing the full 100+ item production file.
3.  **Snapshot Testing**: Use Snapshots for `RitualReader` to ensure Markdown rendering doesn't regress (e.g., losing bold/italic styling).
