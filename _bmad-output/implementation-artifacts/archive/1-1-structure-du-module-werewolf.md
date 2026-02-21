# Story 1.1: Structure du Module Werewolf

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want la structure de dossiers du module Werewolf créée selon l'architecture définie,
so that je puisse développer les fonctionnalités frontend et backend de manière isolée.

## Acceptance Criteria

1. **Given** le monorepo existant
   **When** je crée la structure du module werewolf
   **Then** `modules/werewolf/` existe avec `__init__.py`, `manifest.json`, et les sous-dossiers `cogs/`, `models/`, `services/`, `views/`, `assets/`
   **And** `web/src/modules/werewolf/` existe avec `index.js`, `routes.jsx`, et les sous-dossiers `components/`, `pages/`, `hooks/`, `assets/`

## Tasks / Subtasks

- [x] Créer la structure Backend (AC: 1)
  - [x] `mkdir -p modules/werewolf/{cogs,models,services,views,assets}`
  - [x] Créer `modules/werewolf/__init__.py` (vide ou simple logger)
  - [x] Créer `modules/werewolf/manifest.json` avec ID "werewolf" version "1.0.0"
- [x] Créer la structure Frontend (AC: 1)
  - [x] `mkdir -p web/src/modules/werewolf/{components,pages,hooks,assets}`
  - [x] Créer `web/src/modules/werewolf/index.js` (Module entry point)
  - [x] Créer `web/src/modules/werewolf/routes.jsx` (Router placeholder)

## Dev Notes

- **Architecture Patterns**: Fractal Module API. Le module doit être autonome.
- **Source Tree**:
  - `modules/werewolf/` (Python Backend)
  - `web/src/modules/werewolf/` (React Frontend)
- **Manifest Constraint**: `manifest.json` doit contenir `id`, `name`, `version`, `entry_points`, `dependencies`.
- **Index.js Constraint**: `index.js` doit exporter `id`, `name`, `path`, `icon`, `RootComponent`.

### Project Structure Notes

- **Backend**: Python 3.11, snake_case.
- **Frontend**: React 19.2.0, camelCase.
- **Isolation**: AUCUN import de `modules/vampire`.

### References

- [Architecture Document](../planning-artifacts/architecture.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Création de la structure Backend (modules/werewolf) avec init et manifest.
- Création de la structure Frontend (web/src/modules/werewolf) avec index et routes.

### File List

- modules/werewolf/__init__.py
- modules/werewolf/manifest.json
- modules/werewolf/cogs/__init__.py
- modules/werewolf/models/__init__.py
- modules/werewolf/services/__init__.py
- modules/werewolf/views/__init__.py
- web/src/modules/werewolf/index.js
- web/src/modules/werewolf/routes.jsx

## Senior Developer Review (AI)

- **Date:** 2026-01-21
- **Outcome:** Approved (Auto-fixes applied)

### Action Items
- [x] Fix untracked files (git add)
- [x] Create missing __init__.py files in subdirectories
- [x] Fix unused logger in main init file
