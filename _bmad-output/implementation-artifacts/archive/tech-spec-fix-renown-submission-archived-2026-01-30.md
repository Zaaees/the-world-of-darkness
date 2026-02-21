---
title: 'Fix Renown Submission 500 Error'
slug: 'fix-renown-submission'
created: '2026-01-28'
status: 'in-progress'
stepsCompleted: [1]
tech_stack: ['Python', 'aiohttp', 'aiosqlite']
files_to_modify: 
  - 'api_server.py'
  - 'modules/werewolf/services/renown.py'
code_patterns: []
test_patterns: []
---

# Overview

## Problem Statement
Submitting a "Haut Fait" (Renown) triggers a 500 Internal Server Error.
Investigation reveals two critical issues:
1. **Critical Crash**: The API Server expects a database connection at `request.app['db']`, but it is never initialized or attached to the application, causing a `KeyError`.
2. **Logic Bug**: The `RenownService` attempts to query a table named `renown_requests`, but the actual table created is `werewolf_renown_requests`, which would cause SQL errors for other operations.

## Solution
1. **Initialize DB Pool**: Modify `api_server.py` to create a persistent `aiosqlite` connection pool on startup and attach it to `app['db']`.
2. **Fix Table Names**: Correct the SQL queries in `modules/werewolf/services/renown.py` to use the correct table name `werewolf_renown_requests`.

## Scope
### In Scope
- `api_server.py`: Add DB init/cleanup logic.
- `modules/werewolf/services/renown.py`: Fix SQL table names.

### Out of Scope
- Changing how `utils.database` works (it uses per-call connections, which is inefficient but out of scope to refactor globally right now). We will just import the `DATABASE_PATH` from it.

# Context for Development
- The API server uses `aiohttp`.
- The `RenownService` is designed to take an injected `db` connection.
- `utils.database.DATABASE_PATH` defines the DB location.
