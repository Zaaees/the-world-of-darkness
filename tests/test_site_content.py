"""Offline tests with temporary databases; never modify the game database."""
import asyncio
import json
from types import SimpleNamespace

import aiosqlite
from aiohttp import web
from aiohttp.test_utils import make_mocked_request
from unittest.mock import AsyncMock, patch

from data.config import ROLE_FONDATEUR, ROLE_MJ_VAMPIRE, ROLE_MJ_WEREWOLF, ROLE_VAMPIRE
from modules.content.api import REGISTRY, initialize, put_content, read_values, can_edit, get_public, validate_value
from utils.api_auth import identity_middleware

VAMPIRE = next(key for key, entry in REGISTRY.items() if entry['scope'] == 'vampire' and not entry['variables'])
PUBLIC = next(key for key, entry in REGISTRY.items() if entry['public'] and not entry['variables'])
TEMPLATE = next(key for key, entry in REGISTRY.items() if entry['variables'])


class Request(dict):
    content_length = 200
    query = {}

    def __init__(self, app, key=VAMPIRE, value='Une nouvelle règle.', revision=0, role=ROLE_MJ_VAMPIRE, guild=2):
        super().__init__(verified_user_id=1, verified_guild_id=guild,
                         verified_member=SimpleNamespace(roles=[SimpleNamespace(id=role)]))
        self.app = app
        self.match_info = {'key': key}
        self.payload = {'value': value, 'revision': revision}

    async def json(self):
        return self.payload


def test_direct_write_persists_isolated_and_has_no_history(tmp_path):
    async def run():
        app = {'content_db_path': str(tmp_path / 'content.db')}
        await initialize(app)
        assert (await put_content(Request(app))).status == 200
        assert (await read_values(app, 2))['values'][VAMPIRE]['value'] == 'Une nouvelle règle.'
        assert await read_values(app, 2, known_revision='1') == {'revision': 1, 'unchanged': True}
        assert (await read_values(app, 3))['values'] == {}
        await initialize(app)  # restart/migration is idempotent
        assert (await put_content(Request(app, value='Nouvelle valeur', revision=1))).status == 200
        async with aiosqlite.connect(app['content_db_path']) as db:
            async with db.execute('SELECT value, revision FROM site_content') as cursor:
                assert await cursor.fetchall() == [('Nouvelle valeur', 2)]
            async with db.execute("SELECT name FROM sqlite_master WHERE type='table'") as cursor:
                assert {row[0] for row in await cursor.fetchall()} == {'site_content', 'site_content_revision'}
    asyncio.run(run())


def test_concurrent_mjs_cannot_overwrite_each_other(tmp_path):
    async def run():
        app = {'content_db_path': str(tmp_path / 'content.db')}
        await initialize(app)
        responses = await asyncio.gather(put_content(Request(app, value='A')), put_content(Request(app, value='B')))
        assert sorted(response.status for response in responses) == [200, 409]
        assert (await read_values(app, 2))['values'][VAMPIRE]['revision'] == 1
    asyncio.run(run())


def test_roles_validation_and_variables(tmp_path):
    async def run():
        app = {'content_db_path': str(tmp_path / 'content.db')}
        await initialize(app)
        for role in (ROLE_VAMPIRE, ROLE_MJ_WEREWOLF):
            assert (await put_content(Request(app, role=role))).status == 403
        assert (await put_content(Request(app, key='bloodPotency'))).status == 404
        stale = await put_content(Request(app, revision=9))
        assert stale.status == 409
        assert json.loads(stale.text)['revision'] == 0
        for value in ('', 'x' * 12001, '<script>alert(1)</script>', '[x](javascript:alert(1))'):
            assert (await put_content(Request(app, value=value))).status == 400
        assert (await put_content(Request(app, key=TEMPLATE, value='Sans variables', role=ROLE_FONDATEUR))).status == 400
        assert (await put_content(Request(app, value='Variable inconnue : {triche}'))).status == 400
        template = REGISTRY[TEMPLATE]['default']
        assert (await put_content(Request(app, key=TEMPLATE, value=template, role=ROLE_FONDATEUR))).status == 200
        request = Request(app)
        request.payload['bloodPotency'] = 10
        assert (await put_content(request)).status == 400
    asyncio.run(run())


def test_public_reads_never_return_other_fields(tmp_path, monkeypatch):
    async def run():
        app = {'content_db_path': str(tmp_path / 'content.db')}
        await initialize(app)
        private = next(key for key, entry in REGISTRY.items() if not entry['public'] and not entry['variables'])
        await put_content(Request(app, key=PUBLIC, value='Accueil personnalisé', role=ROLE_FONDATEUR))
        await put_content(Request(app, key=private, value='Texte réservé', role=ROLE_FONDATEUR))
        monkeypatch.setenv('CONTENT_SITE_GUILD_ID', '2')
        response = await get_public(Request(app))
        assert set(json.loads(response.text)['values']) == {PUBLIC}
        monkeypatch.setenv('CONTENT_SITE_GUILD_ID', '3')
        assert json.loads((await get_public(Request(app))).text)['values'] == {}
    asyncio.run(run())


def test_identity_middleware_protects_content_routes():
    async def run():
        app = web.Application()
        member = SimpleNamespace(roles=[SimpleNamespace(id=ROLE_MJ_VAMPIRE)])
        app['bot'] = SimpleNamespace(get_guild=lambda guild: SimpleNamespace(get_member=lambda user: member))
        for headers in ({}, {'Authorization': 'Bearer token', 'X-Discord-User-ID': '99', 'X-Discord-Guild-ID': '2'}):
            request = make_mocked_request('PUT', f'/api/gm/content/entries/{VAMPIRE}', headers=headers, app=app)
            handler = AsyncMock()
            with patch('utils.api_auth.discord_identity', AsyncMock(return_value=1)):
                assert (await identity_middleware(request, handler)).status in (401, 403)
            handler.assert_not_awaited()
    asyncio.run(run())


def test_founder_and_module_permissions():
    member = lambda role: SimpleNamespace(roles=[SimpleNamespace(id=role)])
    assert can_edit(member(ROLE_FONDATEUR), {'scope': 'common'})
    assert not can_edit(member(ROLE_MJ_VAMPIRE), {'scope': 'common'})
    assert can_edit(member(ROLE_MJ_WEREWOLF), {'scope': 'werewolf'})


def test_existing_rules_and_templates_can_be_saved_without_alteration():
    # In particular, comparisons such as "Défenseur < Attaquant" are not HTML.
    invalid = {key: validate_value(entry, entry['default']) for key, entry in REGISTRY.items()
               if validate_value(entry, entry['default']) is not None}
    assert invalid == {}
