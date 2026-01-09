# Story 1.2: Static Data Integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to integrated the validated static data file and set up build-time validation,
so that the application has reliable source data without needing a database.

## Acceptance Criteria

1. **Given** the source file `rituals_v20.js` provided by the Content Team (Mocked for now), **When** I place it in `src/modules/vampire/features/rituals/data/`, **Then** it exports a valid Javascript Array of objects.
2. **Given** the data structure, **When** I examine the objects, **Then** they contain `id` (unique), `name`, `level`, `discipline`, `description_md`.
3. **Given** the integration, **When** I run `npm test`, **Then** a specific Vitest unit test confirms data integrity (Unique IDs, Required Fields).

## Tasks / Subtasks

- [x] Task 1: Create Static Data File
  - [x] Create `src/modules/vampire/features/rituals/data/rituals_v20.js`
  - [x] Populate with ~5 sample rituals covering different cases (Level 1, Level 5, Long Desc, Special Reqs) to verify structure.
- [x] Task 2: Implement Data Integrity Test
  - [x] Create `src/modules/vampire/features/rituals/data/rituals_v20.test.js`
  - [x] Test 1: Validate keys (id, name, level, discipline, description_md)
  - [x] Test 2: Validate ID uniqueness
  - [x] Test 3: Validate Level is number 1-5
- [x] Task 3: Verify Test Execution
  - [x] Run `npm test` and confirm pass.

## Dev Notes

- **Architecture Compliance:**
  - **Data Source:** `rituals_v20.js` is the Single Source of Truth.
  - **Immutability:** Data should be treated as read-only at runtime.
  - **Testing:** Use Vitest. Fast execution is priority.

### Project Structure Notes

- **Path:** `web/src/modules/vampire/features/rituals/data/` (as defined in Story 1.1).
- **Naming:** File `rituals_v20.js`.

### References

- [Architecture: Data Source](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#78)
- [Story 1.1: Project Structure](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/1-1-project-structure-and-dependencies.md)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

- Created `rituals_v20.js` with 6 sample rituals.
- Installed `vitest` as dev dependency (missing from Story 1.1).
- Created `rituals_v20.test.js` covering verifying Array, Unique IDs, Required Field types/presence, and Level Range (1-5).
- All 4 tests PASSED.
- [Code Review] Fixed mutability issue by applying `Object.freeze`.
- [Code Review] Added JSDoc types for better DX.
- [Code Review] Tightened tests to ensure Level is an integer and data is frozen.

### File List

- web/package.json
- web/package-lock.json
- web/src/modules/vampire/features/rituals/data/rituals_v20.js
- web/src/modules/vampire/features/rituals/data/rituals_v20.test.js
