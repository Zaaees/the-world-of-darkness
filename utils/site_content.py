"""Resolve editorial catalog text identically for the website and Discord."""
import json
from pathlib import Path

import aiosqlite

REGISTRY = json.loads((Path(__file__).parents[1] / 'data/site_content.json').read_text(encoding='utf-8'))
CATALOG_KEYS = {
    (entry['scope'], entry['default']): key
    for key, entry in REGISTRY.items() if entry.get('catalog')
}


async def catalog_values(guild_id, db_path=None):
    if db_path is None:
        from utils.database import DATABASE_PATH
        db_path = DATABASE_PATH
    path = Path(db_path)
    if not path.exists():
        return {}
    async with aiosqlite.connect(path.resolve().as_uri() + '?mode=ro', uri=True) as db:
        # Older installations may not have initialized the content editor yet.
        async with db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='site_content'") as cursor:
            if not await cursor.fetchone():
                return {}
        async with db.execute('SELECT key, value FROM site_content WHERE guild_id=?', (guild_id,)) as cursor:
            return dict(await cursor.fetchall())


def display_text(scope, value, values):
    key = CATALOG_KEYS.get((scope, value)) or CATALOG_KEYS.get(('common', value))
    return values.get(key, REGISTRY[key]['default']) if key else value


async def action_display(action, guild_id, db_path=None):
    """Return a fresh display copy; never overwrite rules, IDs or the base catalog."""
    values = await catalog_values(guild_id, db_path)
    return {
        **action,
        'name': display_text('vampire', action['name'], values),
        'description': display_text('vampire', action.get('description', ''), values),
        'hints': [display_text('vampire', hint, values) for hint in action.get('hints', [])],
    }
