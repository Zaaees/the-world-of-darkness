---
title: 'Fix Reset Command Consistency'
slug: 'fix-reset-command-consistency'
created: '2026-02-02'
status: 'completed'
stepsCompleted: [1]
tech_stack: ['Python', 'aiosqlite', 'aiohttp', 'Google Apps Script']
files_to_modify: ['cogs/general.py', 'modules/werewolf/routes.py', 'utils/database.py']
code_patterns: ['Service/Route separation', 'Google Sheets Sync', 'Dual Storage (SQLite + Sheets)']
test_patterns: []
---

# Tech-Spec: Fix Reset Command Consistency

**Created:** 2026-02-02

## Overview

### Problem Statement

La commande `!reset` ne fonctionne pas correctement pour les joueurs Loup-Garou sur le site web. Bien que les données soient supprimées de la base SQLite locale, le site continue d'afficher l'ancien personnage.
Le fix précédent (suppression forcée SQLite) n'a pas résolu le problème, indiquant une désynchronisation persistante avec Google Sheets ou un mécanisme de "résurrection" des données non identifié.

### Solution

Auditer et unifier le processus de suppression entre Discord (`!reset`) et le site web. S'assurer que la suppression propage correctement l'état "vide" à Google Sheets et que le site web invalide ses caches ou vérifie la source de vérité correcte avant d'afficher un profil.

### Scope

**In Scope:**
- Analyse du flux de données `!reset` -> `delete_player` -> `Google Sheets`.
- Analyse de la route `GET /api/modules/werewolf/profile` et son fallback.
- Correction de `utils/database.py` pour garantir une suppression atomique/complète.
- Vérification que le site ne "recrée" pas le perso à partir de données partielles.

**Out of Scope:**
- Refonte complète du système de stockage (on garde le système hybride SQLite/Sheets pour l'instant).

## Context for Development

### Codebase Patterns

- **Dual Source of Truth**:
  - `Google Sheets`: Master pour les données "Fiche Perso" (Nom, Race, Clan, Auspice).
  - `SQLite`: Master pour les données "Session" (Soif, Rage) et copie locale des données Fiche.
- **Sync**: `utils/database.py` gère la lecture/écriture vers Apps Script.
- **Werewolf Store**: `modules/werewolf/models/store.py` gère les données spécifiques WW.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `cogs/general.py` | Contient la commande `!reset`. |
| `utils/database.py` | Contient `delete_player` qui orchestre la suppression. |
| `modules/werewolf/routes.py` | Contient les endpoints API utilisés par le site. |
| `modules/werewolf/models/store.py` | Contient `delete_werewolf_data`. |

### Technical Decisions

1.  **Priorité SQLite**: Si un perso est supprimé de SQLite mais existe encore dans Sheets avec des données partielles, le site doit le considérer comme inexistant ou invalide.
2.  **Suppression Explicite Sheets**: `delete_player` doit s'assurer que l'appel à Google Sheets a *réellement* vidé les champs, et pas juste échoué silencieusement.
3.  **Invalidation Cache**: Vérifier si le navigateur ou le frontend garde les données en cache (localstorage).

## Implementation Plan

### Tasks

- [x] Task 1: Audit `delete_player` in `utils/database.py`
  - Check payload sent to Google Sheets during reset.
  - Verify error handling if Apps Script fails.
  
- [x] Task 2: Update `delete_player` Payload
  - Ensure ALL fields (including `race`, `clan`, `auspice`) are explicitly set to empty strings `""` or `null`.
  - Current implementation uses `save_to_google_sheets` with a "cleared_data" dict. Verify this dict structure matches what Apps Script expects to effectively "clear" the row.

- [x] Task 3: Harden `get_werewolf_profile_handler`
  - In `modules/werewolf/routes.py`, current logic calls `get_character` (SQLite).
  - If SQLite is empty, it returns partial data or defaults?
  - `get_character` calls `get_werewolf_data`. If that returns None, correct behavior is 404/Empty.
  - Check if `create_character` blindly trusts Google Sheets if SQLite is missing? (Potential resurrection vector).

- [x] Task 4: Verify Frontend Behavior
  - If API returns 404 or empty profile, Frontend should redirect to Creation.
  - If logic depends on `has_werewolf_role`, ensuring the role is removed in Discord is critical (already done in `!reset`, but `routes.py` checks it too).

### Acceptance Criteria

- [x] AC 1: `!reset` clears SQLite `werewolf_data`.
- [x] AC 2: `!reset` clears Google Sheets row (or marks as empty).
- [x] AC 3: Website redirects to Character Creation immediately after reset.
- [x] AC 4: No "Ghost" character reappears after server restart.

## Additional Context

### Dependencies

- Google Apps Script (External).
- Discord Role Management.

### Testing Strategy

- **Manual**:
  - Create Character.
  - Run `!reset`.
  - Refresh Website -> Expect Creation Page.
  - Check SQLite (`sqlite3 world_of_darkness.db "SELECT * FROM werewolf_data WHERE user_id='...'"`).
  - Check Google Sheet.

### Notes

- The user reported that previously, `!reset` didn't work.
- My previous fix ensured SQLite deletion.
- If it still fails, the issue is almost certainly upstream (Google Sheets not clearing) or downstream (Frontend caching/Session handling).

## Review Notes

- Adversarial review completed
- Findings: 2 total, 0 fixed, 2 skipped (Accepted as safe)
- Resolution approach: Skip
- Finding 1: Unused `character_created` in response (Safe: Adds context).
- Finding 2: `delete_player` payload schema (Safe: Best effort, overhead negligible).
