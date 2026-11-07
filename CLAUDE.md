# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status (as of 2026-11-07)

| Module | Status | Scope |
|--------|--------|-------|
| **Vampire** | ✅ Active — current focus | Bot `/vampire`, Vitae / blood actions, clans, disciplines, ghouls, Caïn editor, `web/src/modules/vampire/` |
| **Werewolf (Loup-Garou)** | ⏸️ **ON HOLD** | Bot `/lycan`, rage, renown, gifts, `web/src/modules/werewolf/` |

**The Werewolf work is paused.** Unless the user explicitly asks to resume it:
- Do not add features, refactor, restyle or "clean up" Werewolf code, data or docs.
- Do not delete it either: it is still loaded and running (`cogs.werewolf` in `main.py`, `modules/werewolf` routes and tables in `api_server.py`, `/werewolf/*` routes in `web/src/core/router/AppRouter.jsx`).
- Shared changes (core, auth, router, `utils/database.py`, content editor) must keep it working; fix only what a shared change breaks, minimally.
- Do not propose Werewolf-oriented tasks or follow-ups; prioritize Vampire.
- Werewolf files: `cogs/werewolf.py`, `views/lycan_panel.py`, `data/auspices.py`, `modules/werewolf/`, `web/src/modules/werewolf/`, `tests/modules/werewolf/`, `docs/werewolf_rank_requirements.md`.

## Build & Development Commands

```bash
# Web (run from /web directory)
cd web && npm run dev      # Start dev server (port 5173)
cd web && npm run build    # Production build
cd web && npm run lint     # ESLint

# Bot
python main.py             # Start Discord bot + API server (blocking)
python sync_commands.py    # Force resync slash commands (use after command changes)

# Verification before completing tasks
cd web && npm run lint     # Always run lint to verify changes
```

## Architecture

### Stack
- **Bot**: Python 3.11+, Discord.py 2.0+ (Cogs structure), aiohttp API server
- **Web**: React 19, Vite, TailwindCSS
- **Database**: SQLite (aiosqlite) for local persistence + Google Sheets for cloud sync

### Project Structure
```
├── main.py              # Bot entry point (WorldOfDarknessBot class)
├── api_server.py        # aiohttp REST API for web interface
├── cogs/                # Discord.py Cogs (vampire, werewolf, general, blood_actions)
├── views/               # Discord interactive panels (UI components)
├── data/                # Game data (clans, auspices, blood_actions, config)
│   └── config.py        # Discord role & channel IDs
├── utils/
│   └── database.py      # SQLite + Google Sheets sync (main data layer)
└── web/                 # React frontend (Vite)
    └── src/components/  # VampireSheet, ClanSelection, DisciplinesTab, GhoulsTab
```

### Key Patterns
- **Cogs Architecture**: Each feature is a Cog in `/cogs`. Main.py loads cogs in `setup_hook()`.
- **Database Sync**: SQLite for local state, Google Sheets for persistent character data via `utils/database.py`.
- **API Authentication**: Web uses headers `X-Discord-User-ID` and `X-Discord-Guild-ID`.
- **RP Channel Detection**: Commands only work in Discord categories containing `[RP]` in the name.
- **Role Gating**: `/vampire` requires `ROLE_VAMPIRE`, `/lycan` requires `ROLE_LOUP_GAROU` (IDs in `data/config.py`).

### Core Systems
- **Vampire**: Thirst (0-5 persistent), Blood Potency (1-5 progression), clan-specific compulsions
- **Werewolf** (⏸️ on hold, see Project Status): Rage (per-channel, 0-20+), turn-based auto-decrement, thresholds at 10 (Enragé) and 20 (Primal)
- **Blood Actions**: Point system for character progression via web, validated through Google Sheets

## Coding Rules

### Python (Bot)
- **Token**: Use `os.getenv("DISCORD_TOKEN")` only, never hardcode
- **Cogs**: New features go in `/cogs` as Cogs, not in main.py
- **Logging**: Use `logging` module, not `print()`
- **Imports**: Watch for circular imports
- **Async**: All I/O is async (aiosqlite, aiohttp, discord.py); never block the event loop (`time.sleep`, `requests`)
- **Isolation**: No cross-imports between game modules (`modules/vampire` ↔ `modules/werewolf`)
- **Tests**: pytest + pytest-asyncio (`asyncio_mode = auto`), in `tests/`

### React (Web)
- **Components**: One component per file
- **Styling**: TailwindCSS only, no inline CSS
- **Responsive**: Always verify mobile view
- **Function components**: Hooks only, `.jsx` extension (only exception: `ErrorBoundary`)
- **Discord IDs**: Always handle them as strings in JS (precision loss with numbers)
- **Tests**: Vitest + React Testing Library, co-located `*.test.jsx`

### Behavior
- Run lint before confirming task completion
- Read stacktraces and fix errors independently
- Do not modify Git config files

## Methodology

The BMAD Method is no longer used: its framework, agents, workflows and planning documents were removed on 2026-11-07 (still in git history if ever needed). Do not suggest BMAD workflows, stories or sprint tracking.
