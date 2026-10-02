"""Read-only server diagnostic. Never print identities, progression or secrets."""
import asyncio
import json
import sqlite3
from pathlib import Path

from utils.sheets_client import sheets_request


async def diagnose():
    path = Path('/app/storage/world_of_darkness.db')
    with sqlite3.connect(path.as_uri() + '?mode=ro', uri=True) as db:
        players = db.execute(
            "SELECT user_id, clan FROM players ORDER BY updated_at DESC LIMIT 10"
        ).fetchall()
    results = []
    for user_id, clan in players:
        try:
            data = await sheets_request('get', userId=str(user_id))
            character = data.get('character')
            results.append({
                'success': data.get('success'),
                'cache_clan_present': bool(clan),
                'character_present': bool(character),
                'response_keys': sorted(data.keys()),
                'character_keys': sorted(character.keys()) if isinstance(character, dict) else [],
                'clan_present': bool(character and character.get('clan')),
                'clan_matches_cache': bool(character and character.get('clan') == clan),
                'vampire_race': bool(character and character.get('race') == 'vampire'),
            })
        except Exception as exc:
            results.append({'error_type': type(exc).__name__})
    print(json.dumps({'checked_players': len(players), 'results': results}))


asyncio.run(diagnose())
