# Project Overview - World of Darkness

## Introduction
The **World of Darkness** project is a hybrid roleplay platform combining a **Discord Bot** for real-time interaction and a **Web Frontend** for rich content management (character sheets, rules).

## System Architecture

### Components
1. **Discord Bot (Backend)**: The core game engine.
   - Manages game state (Thirst, Rage, Blood Potency).
   - Enforces rules via commands and automated checks.
   - Persists data to SQLite.
   - Serves an internal API for the frontend.
2. **Web Frontend**: The player interface.
   - Provides a visual character sheet editor.
   - Displays reference materials (Clans, Disciplines).
   - Communicates with the Bot API.

### Integration Points
- **Shared Data**: Use of Google Sheets as a common data exchange format for some player data.
- **API**: The Bot runs an HTTP server (`api_server.py`) which the Web Client connects to.

## Project Structure
```
the-world-of-darkness/
├── cogs/                 # Bot Commands & Features
├── docs/                 # Project Documentation
├── utils/                # Database & Helpers
├── views/                # Discord UI Components
├── web/                  # React Frontend Source
│   ├── src/
│   │   ├── components/   # React Components
│   │   └── data/         # Static Game Data
│   └── package.json
├── main.py               # Bot Entry Point
└── requirements.txt      # Python Dependencies
```

## Documentation Map
- [Bot Architecture](architecture-bot.md)
- [Bot Data Models](data-models-bot.md)
- [Web Architecture](architecture-web.md)
- [Existing Guide](La_Peripherie_WoD_Guide.md)
