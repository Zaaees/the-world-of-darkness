"""Offline regression checks; never use the live database or Discord account."""
import asyncio
import json
import sqlite3
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from aiohttp import web
from aiohttp.test_utils import make_mocked_request

from utils.api_auth import identity_middleware
from utils import database
from utils.sheets_client import SheetsUnavailable
from modules.vampire.api import character_handler, validate_ghouls, GHOULS
from data.config import ROLE_VAMPIRE


def request(path='/api/vampire/character', roles=(ROLE_VAMPIRE,), headers=None):
    member = SimpleNamespace(roles=[SimpleNamespace(id=r) for r in roles])
    guild = SimpleNamespace(get_member=lambda _: member)
    app = web.Application()
    app['identity_cache'] = {}
    app['bot'] = SimpleNamespace(get_guild=lambda ident: guild if ident == 2 else None)
    return make_mocked_request('GET', path, headers=headers or {
        'Authorization': 'Bearer test-token', 'X-Discord-User-ID': '1', 'X-Discord-Guild-ID': '2'
    }, app=app)


@pytest.mark.parametrize('headers,status', [
    ({'X-Discord-User-ID': '1', 'X-Discord-Guild-ID': '2'}, 401),
    ({'Authorization': 'Bearer token', 'X-Discord-User-ID': '9', 'X-Discord-Guild-ID': '2'}, 403),
    ({'Authorization': 'Bearer token', 'X-Discord-User-ID': '1', 'X-Discord-Guild-ID': '9'}, 403),
])
def test_identity_cannot_be_forged(headers, status):
    handler = AsyncMock(return_value=web.Response())
    with patch('utils.api_auth.discord_identity', AsyncMock(return_value=1)):
        response = asyncio.run(identity_middleware(request(headers=headers), handler))
    assert response.status == status
    handler.assert_not_awaited()


def test_role_and_verified_identity():
    async def run():
        handler = AsyncMock(return_value=web.Response())
        with patch('utils.api_auth.discord_identity', AsyncMock(return_value=1)):
            assert (await identity_middleware(request(roles=()), handler)).status == 403
            req = request()
            assert (await identity_middleware(req, handler)).status == 200
            assert req['verified_user_id'] == 1
            assert req['verified_guild_id'] == 2
    asyncio.run(run())


def test_discord_outage_is_not_no_role():
    with patch('utils.api_auth.discord_identity', AsyncMock(side_effect=TimeoutError)):
        result = asyncio.run(identity_middleware(request(), AsyncMock()))
    assert result.status == 503


def test_browser_cannot_write_progression():
    req = {'verified_user_id': 1}
    class Request(dict):
        method = 'POST'
        async def json(self):
            return {'bloodPotency': 5, 'saturationPoints': 999}
    remote = AsyncMock(return_value={'character': {'bloodPotency': 1}})
    with patch('modules.vampire.api.sheets_request', remote):
        response = asyncio.run(character_handler(Request(req)))
    assert response.status == 400
    assert remote.await_count == 1  # read only, never save


def test_all_clans_have_server_assigned_ghoul_powers():
    for clan, disciplines in GHOULS['clans'].items():
        result = validate_ghouls([{'id': 'new', 'name': 'Guide', 'discipline_name': 'Triche'}],
                                 {'clan': clan, 'bloodPotency': 1})
        assert result[0]['discipline_name'] in disciplines
        assert result[0]['discipline_power']


@pytest.mark.parametrize('ghouls', [[None], [{'id':'x', 'name':''}],
    [{'id': str(n), 'name':'Guide'} for n in range(3)],
    [{'id':'x', 'name':'Guide', 'type':'mind'}]])
def test_invalid_ghouls_rejected(ghouls):
    with pytest.raises(ValueError):
        validate_ghouls(ghouls, {'clan':'salubri', 'bloodPotency':1})


def test_refusal_persists_and_can_retry_after_outage(tmp_path, monkeypatch):
    monkeypatch.setattr(database, 'DATABASE_PATH', str(tmp_path / 'game.db'))
    async def run():
        await database.init_blood_actions_tables()
        ident = await database.create_pending_action(1, 2, 'test', 'Scène', 1, 'general', description='Contexte')
        with patch.object(database, 'sheets_request', AsyncMock(side_effect=SheetsUnavailable('offline'))):
            with pytest.raises(SheetsUnavailable):
                await database.refuse_action(ident, 3)
        assert (await database.get_pending_action(ident))['status'] == 'pending'
        with patch.object(database, 'sheets_request', AsyncMock(return_value={'refused': True})) as remote:
            result = await database.refuse_action(ident, 3)
            assert result['user_id'] == 1
            assert await database.refuse_action(ident, 3) is None
            assert remote.await_count == 1
        saved = await database.get_pending_action(ident)
        assert saved['status'] == 'refused'
        assert saved['description'] == 'Contexte'
        assert saved['validated_by'] == 3
    asyncio.run(run())


def test_simultaneous_spending_never_overdraws(tmp_path, monkeypatch):
    path = tmp_path / 'vitae.db'
    monkeypatch.setattr(database, 'DATABASE_PATH', str(path))
    with sqlite3.connect(path) as db:
        db.execute('CREATE TABLE vampire_soif (user_id INTEGER, guild_id INTEGER, soif_level INTEGER, blood_potency INTEGER, saturation_points INTEGER, last_updated TEXT, PRIMARY KEY(user_id,guild_id))')
        db.execute('INSERT INTO vampire_soif VALUES (1,2,5,1,0,NULL)')
    async def run():
        results = await asyncio.gather(database.modify_vitae(1,2,-3), database.modify_vitae(1,2,-3), return_exceptions=True)
        assert sum(isinstance(r, ValueError) for r in results) == 1
        assert await database.get_vampire_soif(1,2) == 2
    asyncio.run(run())


def test_discord_chunks_respect_limit():
    from utils.sheet_manager import format_sheet_content
    parts = format_sheet_content({'history': 'x' * 6000, 'starter_pack_answers': {'hooks': {'attachment': 'Mon frère'}}}, 'Joueur')
    assert all(0 < len(p) <= 1900 for p in parts)
    assert 'Mon frère' in ''.join(parts)


def test_backup_restores_an_isolated_copy(tmp_path):
    from tools.backup_game import backup, verify
    source, copied, restored = [tmp_path / name for name in ('source.db', 'copy.db', 'restored.db')]
    with sqlite3.connect(source) as db:
        db.execute('CREATE TABLE characters (name TEXT)')
        db.execute("INSERT INTO characters VALUES ('Alice')")
    backup(source, copied)
    backup(copied, restored)
    assert 'characters' in verify(restored)
    with sqlite3.connect(restored) as db:
        assert db.execute('SELECT name FROM characters').fetchone()[0] == 'Alice'
    with pytest.raises(FileExistsError):
        backup(source, restored)


def test_sheet_saved_even_when_publication_fails():
    import api_server
    class Request(dict):
        app = {'bot': SimpleNamespace(get_guild=lambda _: None)}
        async def json(self):
            return {'name':'Alice', 'forum_post_id':'forged-thread'}
    save = AsyncMock()
    with patch.object(api_server, 'get_player', AsyncMock(return_value={'clan':'brujah'})), \
         patch.object(api_server, 'get_character_sheet', AsyncMock(return_value={'forum_post_id':123})), \
         patch.object(api_server, 'save_character_sheet', save), \
         patch.object(api_server, 'set_player', AsyncMock(side_effect=SheetsUnavailable('offline'))), \
         patch.object(api_server, 'process_discord_sheet_update', AsyncMock(side_effect=RuntimeError('offline'))):
        result = asyncio.run(api_server.save_character_sheet_handler(Request(verified_user_id=1, verified_guild_id=2)))
    payload = json.loads(result.text)
    assert payload == {'success':True, 'saved':True, 'published':False, 'name_synced':False}
    assert save.await_args.args[2]['forum_post_id'] == 123


@pytest.mark.parametrize('handler_name', ['get_npc_handler', 'update_npc_handler', 'delete_npc_handler', 'publish_npc_handler'])
def test_npc_from_another_guild_is_never_accessible(handler_name):
    import api_server
    class Request(dict):
        match_info = {'npc_id':'foreign-npc'}
        app = {'bot': SimpleNamespace(get_guild=lambda _: SimpleNamespace())}
        async def json(self):
            return {'name':'forged'}
    with patch.object(api_server, 'verify_gm_auth', AsyncMock(return_value=(1,2,True))), \
         patch.object(api_server, 'get_npc', AsyncMock(return_value={'id':'foreign-npc','guild_id':3})):
        response = asyncio.run(getattr(api_server, handler_name)(Request()))
    assert response.status == 404


def test_deployment_preflight_checks_auth_and_backup(tmp_path, monkeypatch, capsys):
    import io
    from tools.preflight_vampire_deploy import preflight
    monkeypatch.setenv('SHEETS_API_SECRET', 'only-a-test-secret')
    monkeypatch.setenv('GOOGLE_SHEETS_API_URL', 'https://script.google.com/macros/s/test/exec')
    source = tmp_path / 'game.db'
    with sqlite3.connect(source) as db:
        db.execute('CREATE TABLE players (id INTEGER)')
    with patch('urllib.request.urlopen', return_value=io.BytesIO(b'{"success":true,"character":null}')):
        preflight(source)
    assert len(list((tmp_path / 'backups').glob('*.db'))) == 1
    assert 'only-a-test-secret' not in capsys.readouterr().out


def test_deployment_preflight_stops_when_secret_is_wrong(tmp_path, monkeypatch):
    import io
    from tools.preflight_vampire_deploy import preflight
    monkeypatch.setenv('SHEETS_API_SECRET', 'only-a-test-secret')
    monkeypatch.setenv('GOOGLE_SHEETS_API_URL', 'https://script.google.com/macros/s/test/exec')
    with patch('urllib.request.urlopen', return_value=io.BytesIO(b'{"success":false,"error":"Unauthorized"}')):
        with pytest.raises(RuntimeError, match='authentication'):
            preflight(tmp_path / 'missing.db')
    assert not (tmp_path / 'backups').exists()
