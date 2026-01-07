# Data Models - Discord Bot

This document outlines the database schema used by the Discord Bot, implemented using `aiosqlite`.

## Players
Stores core player information and guild association.

| Column | Type | Description |
|---|---|---|
| `user_id` | INTEGER | Discord User ID (PK) |
| `guild_id` | INTEGER | Discord Guild ID (PK) |
| `race` | TEXT | 'vampire', 'loup-garou', etc. |
| `clan` | TEXT | Vampire Clan key |
| `auspice` | TEXT | Werewolf Auspice key |
| `created_at` | TIMESTAMP | Creation date |
| `updated_at` | TIMESTAMP | Last update |

## Vampire Soif (Vampire Thirst)
Tracks the dynamic state of Vampire characters.

| Column | Type | Description |
|---|---|---|
| `user_id` | INTEGER | Discord User ID (PK) |
| `guild_id` | INTEGER | Discord Guild ID (PK) |
| `soif_level` | INTEGER | Current Vitae level (Inverse of Thirst: 0 = Empty/Frenzy) |
| `blood_potency` | INTEGER | Blood Potency Level (1-5) |
| `saturation_points` | INTEGER | Points towards next Blood Potency level |
| `last_updated` | TIMESTAMP | Last change timestamp |

## Werewolf Rage
Tracks Rage state per channel (scene-based).

| Column | Type | Description |
|---|---|---|
| `user_id` | INTEGER | Discord User ID (PK) |
| `guild_id` | INTEGER | Discord Guild ID (PK) |
| `channel_id` | INTEGER | Discord Channel ID (PK) |
| `rage_level` | INTEGER | Current Rage level (0-5) |
| `is_enraged` | BOOLEAN | Whether character is in Frenzy |
| `maintien_counter` | INTEGER | Counter for maintaining rage |
| `others_spoke_since`| BOOLEAN | Trigger tracking |

## NPCs (Non-Player Characters)
Stores NPC data for the GM Dashboard.

| Column | Type | Description |
|---|---|---|
| `id` | TEXT | Unique NPC ID (PK) |
| `guild_id` | INTEGER | Discord Guild ID |
| `name` | TEXT | NPC Name |
| `clan` | TEXT | Vampire Clan |
| `blood_potency` | INTEGER | Blood Potency |
| `status` | TEXT | 'private' or 'public' |
| `disciplines` | TEXT | JSON string of disciplines |
| `rituals` | TEXT | JSON string of learned rituals |
| `sheet_data` | TEXT | JSON string of full sheet data (history, bio) |
| `image_url` | TEXT | URL to avatar image |

## Character Sheets
Stores rich character data (RP descriptions).

| Column | Type | Description |
|---|---|---|
| `user_id` | INTEGER | (PK) |
| `guild_id` | INTEGER | (PK) |
| `name` | TEXT | Character Name |
| `age` | TEXT | Age |
| `physical_desc` | TEXT | Physical description |
| `mental_desc_pre`| TEXT | Mental description (Pre-embrace/change) |
| `mental_desc_post`| TEXT | Mental description (Post-embrace/change) |
| `history` | TEXT | Character History |
| `image_url` | TEXT | Avatar URL |

## Usage Notes

- **Persistence:** SQLite is the primary source for real-time data (Soif, Rage).
- **Synchronization:** Some data (`race`, `clan`, `bloodPotency`) is synchronized with Google Sheets via `utils.database.save_to_google_sheets`.
- **JSON Fields:** `disciplines`, `rituals`, `sheet_data` in `npcs` table store complex data as JSON strings.
