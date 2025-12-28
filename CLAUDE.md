# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Werewolf**: Rage (per-channel, 0-20+), turn-based auto-decrement, thresholds at 10 (Enragé) and 20 (Primal)
- **Blood Actions**: Point system for character progression via web, validated through Google Sheets

## Coding Rules

### Python (Bot)
- **Token**: Use `os.getenv("DISCORD_TOKEN")` only, never hardcode
- **Cogs**: New features go in `/cogs` as Cogs, not in main.py
- **Logging**: Use `logging` module, not `print()`
- **Imports**: Watch for circular imports

### React (Web)
- **Components**: One component per file
- **Styling**: TailwindCSS only, no inline CSS
- **Responsive**: Always verify mobile view

### Behavior
- Run lint before confirming task completion
- Read stacktraces and fix errors independently
- Do not modify Git config files
