# Story 1.1: Project Structure & Dependencies

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to initialize the project structure and install necessary dependencies,
so that development can proceed with a stable and consistent environment.

## Acceptance Criteria

1. **Given** the project root, **When** I run `npm install fuse.js react-window react-markdown zustand`, **Then** the dependencies are added to `package.json`.
2. **Given** the project source, **When** I inspect the filesystem, **Then** the directory structure `src/modules/vampire/features/rituals/` exists with subfolders `components`, `stores`, `utils`, `data`.
3. **Given** the new directory structure, **When** I check file boundaries, **Then** `src/modules/vampire/features/rituals/index.js` exists as the public entry point.

## Tasks / Subtasks

- [x] Task 1: Install Dependencies
  - [x] Install `fuse.js` (Search)
  - [x] Install `react-window` (Virtualization)
  - [x] Install `react-markdown` (Rich Text)
  - [x] Install `zustand` (State Management)
  - [x] Verify `package.json` updates
- [x] Task 2: Create Module Structure
  - [x] Create `src/modules/vampire/features/rituals/` root
  - [x] Create `components/` subdir
  - [x] Create `stores/` subdir
  - [x] Create `utils/` subdir
  - [x] Create `data/` subdir
- [x] Task 3: Initialize Entry Point
  - [x] Create `src/modules/vampire/features/rituals/index.js`
  - [x] Export a placeholder/default object to verify import capability

## Dev Notes

- **Architecture Compliance:**
  - Strict adherence to `src/modules/vampire/features/rituals/` path.
  - Dependencies must match Architecture decisions (Fuse.js v7+, React-Window, etc.).
  - No new dependencies outside of those specified.

### Project Structure Notes

- **Module Pattern:** We are following the Feature-based folder structure defined in `architecture.md`.
- **Public API:** `index.js` serves as the barrier. Internal components should not be imported directly by consumers outside the `rituals` feature.

### References

- [Architecture: Technical Stack](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#58)
- [Architecture: Code Structure](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#109)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

- Verified all dependencies installed in `web/package.json`
- Confirmed directory structure exists
- Confirmed `rituals` entry point exports placeholder

### File List
- web/package.json
- web/package-lock.json
- web/src/modules/vampire/features/rituals/index.js
- web/src/modules/vampire/features/rituals/components/ (dir)
- web/src/modules/vampire/features/rituals/stores/ (dir)
- web/src/modules/vampire/features/rituals/utils/ (dir)
- web/src/modules/vampire/features/rituals/data/ (dir)

## Senior Developer Review (AI)

**Outcome:** Approve
**Date:** 2026-01-08

### Action Items
- [x] [Low] Empty directories missing `.gitkeep` (Fixed automatically)
- [ ] [Low] `web/package.json` name is "docs", consider renaming to "twd-web" later.
- [ ] [Low] `index.js` uses 4-space indentation, consistency check recommended.

### Review Notes
Solid foundation. Directory structure matches architecture exactly. Dependencies correctly installed. Added `.gitkeep` files to ensure structure is preserved in git. Ready for Static Data Integration.

