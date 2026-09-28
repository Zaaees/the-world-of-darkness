"""Allowlisted editorial fields, independent of character data and game rules."""
import json
import os
import re
from pathlib import Path

import aiosqlite
from aiohttp import web

from data.config import ROLE_FONDATEUR, ROLE_MJ_VAMPIRE, ROLE_MJ_WEREWOLF
from utils import database

REGISTRY = json.loads((Path(__file__).parents[2] / 'data/site_content.json').read_text(encoding='utf-8'))


async def initialize(app):
    # A separate connection per operation avoids interleaving transactions with game writes.
    app['content_db_path'] = app.get('content_db_path', str(database.DATABASE_PATH))
    async with aiosqlite.connect(app['content_db_path']) as db:
        await db.execute('''CREATE TABLE IF NOT EXISTS site_content (
            guild_id INTEGER NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,
            revision INTEGER NOT NULL, updated_by INTEGER NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (guild_id, key))''')
        await db.execute('''CREATE TABLE IF NOT EXISTS site_content_revision (
            guild_id INTEGER PRIMARY KEY, revision INTEGER NOT NULL DEFAULT 0)''')
        await db.commit()


def can_edit(member, definition):
    roles = {role.id for role in member.roles}
    return ROLE_FONDATEUR in roles or (
        definition['scope'] == 'vampire' and ROLE_MJ_VAMPIRE in roles
    ) or (definition['scope'] == 'werewolf' and ROLE_MJ_WEREWOLF in roles)


def public_guild(app):
    configured = os.getenv('CONTENT_SITE_GUILD_ID', '')
    if configured.isdigit():
        return int(configured)
    guilds = getattr(app.get('bot'), 'guilds', [])
    return guilds[0].id if len(guilds) == 1 else None


async def read_values(app, guild_id, public=False, known_revision=None):
    if guild_id is None:
        return {'values': {}, 'revision': 0}
    async with aiosqlite.connect(app['content_db_path']) as db:
        # Keep values and revision in the same SQLite read snapshot.
        await db.execute('BEGIN')
        async with db.execute('SELECT revision FROM site_content_revision WHERE guild_id=?', (guild_id,)) as cursor:
            row = await cursor.fetchone()
        revision = row[0] if row else 0
        if known_revision == str(revision):
            return {'revision': revision, 'unchanged': True}
        async with db.execute('SELECT key, value, revision FROM site_content WHERE guild_id=?', (guild_id,)) as cursor:
            values = {key: {'value': value, 'revision': revision} for key, value, revision in await cursor.fetchall()
                      if key in REGISTRY and (not public or REGISTRY[key].get('public', False))}
    return {'values': values, 'revision': revision}


async def get_public(request):
    result = await read_values(request.app, public_guild(request.app), public=True, known_revision=request.query.get('revision'))
    return web.json_response(result, headers={'Cache-Control': 'no-store'})


async def get_content(request):
    result = await read_values(request.app, request['verified_guild_id'], known_revision=request.query.get('revision'))
    member = request['verified_member']
    result['editableScopes'] = [scope for scope in ('common', 'vampire', 'werewolf')
                               if can_edit(member, {'scope': scope})]
    return web.json_response(result, headers={'Cache-Control': 'no-store'})


async def get_catalog(request):
    definitions = {key: entry for key, entry in REGISTRY.items() if can_edit(request['verified_member'], entry)}
    if not definitions:
        raise web.HTTPForbidden()
    return web.json_response({'entries': definitions}, headers={'Cache-Control': 'no-store'})


def validate_value(definition, value):
    if not isinstance(value, str) or len(value) > definition.get('maxLength', 12000):
        return 'Texte invalide ou trop long.'
    if not value.strip():
        return 'Le texte ne peut pas être vide.'
    expected = set(definition.get('variables', []))
    if set(re.findall(r'\{([A-Za-z_]\w*)\}', value)) != expected:
        return 'Conservez les variables du texte : ' + ', '.join(sorted(expected))
    # Text is escaped by React. Markdown also forbids HTML and unsafe URLs.
    if re.search(r'<\s*/?\s*[a-z!][^>]*>|(?:javascript|vbscript|data)\s*:', value, re.I):
        return 'Le HTML et les liens exécutables ne sont pas autorisés.'
    return None


async def put_content(request):
    key = request.match_info['key']
    definition = REGISTRY.get(key)
    if definition is None:
        return web.json_response({'error': 'Texte inconnu.'}, status=404)
    if not can_edit(request['verified_member'], definition):
        return web.json_response({'error': 'Droits MJ insuffisants.'}, status=403)
    if request.content_length and request.content_length > 64000:
        raise web.HTTPRequestEntityTooLarge(max_size=64000, actual_size=request.content_length)
    try:
        payload = await request.json()
    except (ValueError, UnicodeDecodeError):
        return web.json_response({'error': 'JSON invalide.'}, status=400)
    if not isinstance(payload, dict) or set(payload) != {'value', 'revision'}:
        return web.json_response({'error': 'Seuls le texte et sa révision sont acceptés.'}, status=400)
    error = validate_value(definition, payload['value'])
    if error or type(payload['revision']) is not int or payload['revision'] < 0:
        return web.json_response({'error': error or 'Révision invalide.'}, status=400)
    guild_id = request['verified_guild_id']
    async with aiosqlite.connect(request.app['content_db_path'], timeout=10) as db:
        await db.execute('BEGIN IMMEDIATE')
        async with db.execute('SELECT value, revision FROM site_content WHERE guild_id=? AND key=?', (guild_id, key)) as cursor:
            current = await cursor.fetchone()
        revision = current[1] if current else 0
        if revision != payload['revision']:
            return web.json_response({'error': 'Ce texte a été modifié par un autre MJ. Rechargez sa valeur.',
                                      'value': current[0] if current else definition['default'], 'revision': revision}, status=409)
        await db.execute('''INSERT INTO site_content (guild_id,key,value,revision,updated_by) VALUES (?,?,?,?,?)
            ON CONFLICT(guild_id,key) DO UPDATE SET value=excluded.value, revision=excluded.revision,
            updated_by=excluded.updated_by, updated_at=CURRENT_TIMESTAMP''',
                         (guild_id, key, payload['value'], revision + 1, request['verified_user_id']))
        await db.execute('''INSERT INTO site_content_revision (guild_id,revision) VALUES (?,1)
            ON CONFLICT(guild_id) DO UPDATE SET revision=revision+1''', (guild_id,))
        await db.commit()
    return web.json_response({'value': payload['value'], 'revision': revision + 1}, headers={'Cache-Control': 'no-store'})


def register_routes(app):
    app.on_startup.append(initialize)
    # This path is deliberately outside /api/: no identity middleware exemption.
    # Only entries explicitly marked public can ever be returned here.
    app.router.add_get('/content/public', get_public)
    app.router.add_get('/api/content', get_content)
    app.router.add_get('/api/gm/content/catalog', get_catalog)
    app.router.add_put('/api/gm/content/entries/{key}', put_content)
