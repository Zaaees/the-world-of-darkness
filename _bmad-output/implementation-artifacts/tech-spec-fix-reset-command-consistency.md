---
title: 'Fix Reset Command Consistency'
slug: 'fix-reset-command-consistency'
created: '2026-02-02'
status: 'completed'
stepsCompleted: [1]
tech_stack: ['Python', 'aiosqlite', 'aiohttp', 'Google Apps Script']
files_to_modify: ['cogs/general.py', 'modules/werewolf/models/store.py']
code_patterns: ['Robust Error Handling', 'Prioritize Local Deletion', 'Type Safety']
test_patterns: ['Manual Verification', 'Logging Checks']
---

# Tech-Spec: Fix Reset Command Consistency

**Created:** 2026-02-02

## Overview

### Problem Statement
The `!reset` command fails to consistently remove Werewolf character data (Rank/Grade, Gifts, etc.) from the system. Users report that despite running the command, their "Grade" (Rank) persists on the website. This suggests that the deletion of the `werewolf_data` table entry is either failing, being skipped due to upstream errors (in `delete_player`), or suffering from data type mismatches (Integer vs String user IDs).

### Solution
Refactor the `!reset` command execution flow to prioritize the deletion of module-specific data (Werewolf, Vampire) *before* attempting the generic `delete_player` routine (which involves potentially flaky external Google Sheets calls). Wrap each deletion step in independent `try/except` blocks to ensure that a failure in one system (e.g., Google Sheets) does not prevent cleanup in others (e.g., Local SQLite). Enforce strict type casting for `user_id` when calling module services.

### Scope

**In Scope:**
- Refactoring `reset_command` in `cogs/general.py`.
- Hardening `delete_werewolf_data` in `modules/werewolf/models/store.py`.
- Verifying `user_id` type consistency across calls.
- Improving logging for deletion operations.

**Out of Scope:**
- rewriting the entire Google Sheets sync mechanism.
- changing the `delete_player` signature (to avoid breaking other modules).

## Context for Development

### Codebase Patterns
- **Dual Store**: Data exists in both SQLite (Session/Cache/Some Persistent) and Google Sheets (Master for stats).
- **Module Separation**: Werewolf data is in a separate table `werewolf_data` managed by `modules/werewolf`.
- **Async/Await**: extensive use of `aiosqlite`.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `cogs/general.py` | Contains the `!reset` command logic. |
| `modules/werewolf/models/store.py` | Contains `delete_werewolf_data` (direct DB access). |
| `utils/database.py` | Generic `delete_player` function. |

### Technical Decisions
1.  **Delete Local First**: We will move `delete_werewolf_data` to run *before* `delete_player`. Local SQLite operations are fast and reliable. External APIs are not.
2.  **Independent Failures**: If Google Sheets fails to update, we still want the local bot/site to treat the user as "Reset". The "Zombie Check" in `character_service` might resurrect them if the Sheet isn't cleared, but if we delete the local `werewolf_data` row, `get_character` returns `None` immediately, bypassing the Zombie Check.
3.  **Strict String IDs**: Werewolf store uses `TEXT` primary keys. We will explicitly cast `str(member.id)` in all calls.

## Implementation Plan

### Tasks

- [x] **Task 1: Harden `delete_werewolf_data`** <!-- id: 0 -->
    - Modify `modules/werewolf/models/store.py`:
    - Ensure `delete_werewolf_data` accepts `str` or `int` but always converts to `str` for the query.
    - Add explicit logging of how many rows were deleted.

- [x] **Task 2: Refactor `reset_command` in `cogs/general.py`** <!-- id: 1 -->
    - Change execution order:
        1. **Detach Roles** (Visually important).
        2. **Delete Werewolf Data** (Module specific, local DB). Wrap in try/except.
        3. **Delete Vampire Data** (if applicable). Wrap in try/except.
        4. **Delete Generic Player Data** (`delete_player` - handle generic + Google Sheets). Wrap in try/except.
    - Ensure `delete_werewolf_data` is called *regardless* of whether the user has the Role, if they have data in the DB (try/except check).

- [x] **Task 3: Verify & logging** <!-- id: 2 -->
    - Add detailed implementation logs to trace exactly which step succeeds or fails.

### Acceptance Criteria

- [ ] `!reset` command removes the `werewolf_data` row from SQLite even if Google Sheets sync fails.
- [ ] `!reset` command removes `werewolf_renown` and `werewolf_player_gifts`.
- [ ] Website immediately redirects to creation page (because `get_character` returns None).
- [ ] No "Internal Server Error" if one part of the chain fails.
- [ ] Logs clearly show "Werewolf data deleted for X" or "No data found".

### Dependencies
- `aiosqlite`

### Testing Strategy
- **Manual Test**:
    1.  Create a Werewolf character (via command or checks, if not already existing).
    2.  Verify it exists in SQLite (`sqlite3 world_of_darkness.db "SELECT * FROM werewolf_data WHERE user_id='...'" `).
    3.  Run `!reset @User`.
    4.  Check logs for "Werewolf data deleted".
    5.  Check SQLite again -> Must be empty.
    6.  Check Website -> Must show creation page.

### Notes
- The previous likely failure mode: `delete_player` encountered an error (network/sheets), raising an Exception that aborted the function before `delete_werewolf_data` could run.

## Review Notes
- Adversarial review completed
- Findings: 3 total, 1 fixed, 2 skipped
- Resolution approach: Auto-fix

