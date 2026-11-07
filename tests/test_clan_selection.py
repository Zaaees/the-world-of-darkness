"""Clan choice from the website: aliases, GM-only clans, and the retired /api/ghouls route. Offline."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

import api_server
from data.clans import canonical_clan_key, get_clan
from data.config import ROLE_FONDATEUR, ROLE_MJ_VAMPIRE, ROLE_VAMPIRE
from utils import database


class Request(dict):
    def __init__(self, clan, roles=(ROLE_VAMPIRE,)):
        super().__init__(verified_user_id=1, verified_guild_id=2)
        member = SimpleNamespace(roles=[SimpleNamespace(id=r) for r in roles])
        guild = SimpleNamespace(get_member=lambda _: member)
        self.app = {'bot': SimpleNamespace(get_guild=lambda ident: guild if ident == 2 else None)}
        self.payload = {'clan': clan}

    async def json(self):
        return self.payload


def choose(clan, roles=(ROLE_VAMPIRE,), player=None):
    store = AsyncMock()
    with patch('api_server.get_player', AsyncMock(return_value=player)), \
            patch('api_server.set_player', store), \
            patch('api_server.get_character_sheet', AsyncMock(return_value={})):
        response = asyncio.run(api_server.set_vampire_clan_handler(Request(clan, roles)))
    return response, store


@pytest.mark.parametrize('sent,stored', [
    ('setites', 'setite'), ('assamites', 'banu_haqim'), ('Assamite', 'banu_haqim'),
    ('hecata', 'giovanni'), ('setite', 'setite'), ('brujah', 'brujah'),
])
def test_site_clan_ids_are_stored_under_the_canonical_key(sent, stored):
    response, store = choose(sent)
    assert response.status == 200
    assert store.await_args.kwargs['clan'] == stored
    assert canonical_clan_key(sent) == stored and get_clan(sent) is not None


def test_unknown_clan_is_rejected():
    response, store = choose('lamia')
    assert response.status == 400
    store.assert_not_awaited()


def test_existing_clan_alias_is_not_a_conflict():
    response, _ = choose('setites', player={'clan': 'setite'})
    assert response.status == 200
    response, store = choose('setites', player={'clan': 'brujah'})
    assert response.status == 400
    store.assert_not_awaited()


def test_cain_is_refused_to_players():
    response, store = choose('cain')
    assert response.status == 403
    store.assert_not_awaited()


@pytest.mark.parametrize('gm_role', [ROLE_MJ_VAMPIRE, ROLE_FONDATEUR])
def test_cain_is_allowed_to_gms(gm_role):
    response, store = choose('cain', roles=(ROLE_VAMPIRE, gm_role))
    assert response.status == 200
    assert store.await_args.kwargs['clan'] == 'cain'


def test_legacy_ghoul_route_is_gone():
    paths = {route.resource.canonical for route in api_server.create_app().router.routes()}
    assert not any(path.startswith('/api/ghouls') for path in paths)
    assert '/api/vampire/character' in paths
    for name in ('create_ghoul', 'get_ghouls', 'update_ghoul', 'delete_ghoul', 'get_max_ghouls'):
        assert not hasattr(database, name)
