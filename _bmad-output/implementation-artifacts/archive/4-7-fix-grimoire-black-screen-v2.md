# Story 4.7: Fix Grimoire Black Screen V2

Status: review

## Story
As a developer, I want to wrap the Vampire Module in an Error Boundary and harden the SheetPage loading logic, so that I can see the actual error causing the black screen and fix it permanently.

## Acceptance Criteria
1.  Vampire Module wrapped in an Error Boundary that displays a visible error message on crash.
2.  "Black Page" issue resolved; Grimoire loads correctly.
3.  If user is not logged in, Login Page displays correctly.
4.  If user is logged in but load fails, error message displays.

## Tasks
- [x] Implement `ErrorBoundary` component in core (if missing) or module.
- [x] Wrap `SheetPage` or `VampireRoutes` in ErrorBoundary.
- [x] Debug: Identify the actual crash cause from the Error Boundary output.
    - Confirmed `TypeError: Cannot convert undefined or null to object` related to `Object.values`.
    - Identified potential crash sites in `DisciplinesTab.jsx`, `disciplines.js` and `rituals.js`.
- [x] Fix: Apply the fix.
    - Implemented defensive checks in all identified components (`DISCIPLINES ? Object.values(...) : []`).
    - Verified with regression tests.

## Dev Agent Record
### Implementation Notes
- Implemented `ErrorBoundary` component to catch React rendering errors.
- Wrapped `VampireRoutes` with `ErrorBoundary` to isolate failures within the module.
- Modified `SheetPage.jsx` to explicitly handle error states where data loading fails but `loading` state becomes false (preventing infinite loading/blank screen).
- Verified fix with unit tests for `ErrorBoundary` and existing regression tests.

## File List
- web/src/components/ErrorBoundary.jsx [NEW]
- web/src/components/ErrorBoundary.test.jsx [NEW]
- web/src/modules/vampire/routes.jsx [MODIFIED]
- web/src/modules/vampire/pages/SheetPage.jsx [MODIFIED]
- web/src/modules/vampire/components/DisciplinesTab.jsx [MODIFIED]
- web/src/data/disciplines.js [MODIFIED]
- web/src/data/rituals.js [MODIFIED]

## Change Log
- **feat**: Added ErrorBoundary component for better crash handling.
- **fix**: Wrapped Vampire routes in ErrorBoundary.
- **fix**: Added explicit error UI in SheetPage to handle data loading failures gracefully.
- **fix**: Patched `DisciplinesTab`, `disciplines.js`, and `rituals.js` with defensive checks to prevent `Object.values(null/undefined)` crashes.
