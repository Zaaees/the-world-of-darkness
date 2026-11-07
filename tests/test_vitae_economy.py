"""Blood economy on a temporary database: feeding modes, upkeep, power costs, rank changes, ghouls."""
import asyncio
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch

import pytest

from data.config import GHOUL_BLOOD_COST
from data.disciplines import check_power_usable, get_usable_powers, POWERS
from modules.vampire.api import character_handler, validate_ghouls, vitae_handler
from utils import database

NOW = datetime(2026, 11, 7, 22, 0, tzinfo=timezone.utc)


@pytest.fixture
def db(tmp_path, monkeypatch):
    path = tmp_path / 'game.db'
    monkeypatch.setattr(database, 'DATABASE_PATH', path)
    asyncio.run(database.init_database())
    return path


async def seed(bp=3, vitae=None):
    await database.set_blood_potency(1, 2, bp)
    await database.set_vampire_soif(1, 2, database.get_max_vitae(bp) if vitae is None else vitae)


def test_quick_feed_is_partial_once_per_night_and_needs_a_healthy_reserve(db):
    async def run():
        await seed(bp=3, vitae=6)  # 12 max, floor 5
        first = await database.feed_vampire(1, 2, 'quick', now=NOW)
        assert (first['gained'], first['vitae']) == (5, 11)
        with pytest.raises(ValueError, match='déjà chassé'):
            await database.feed_vampire(1, 2, 'quick', now=NOW + timedelta(hours=19))
        assert (await database.feed_vampire(1, 2, 'quick', now=NOW + timedelta(hours=21)))['vitae'] == 12
        await database.set_vampire_soif(1, 2, 4)
        with pytest.raises(ValueError, match='scène de chasse'):
            await database.feed_vampire(1, 2, 'quick', now=NOW + timedelta(days=3))
        assert await database.get_vampire_soif(1, 2) == 4  # nothing changed
        assert (await database.feed_vampire(1, 2, 'scene', now=NOW + timedelta(days=3)))['vitae'] == 12
    asyncio.run(run())


def test_rank_five_only_feeds_on_vampire_blood_in_a_scene(db):
    async def run():
        await seed(bp=5, vitae=24)  # healthy reserve, never fed: still no off-screen hunt
        with pytest.raises(ValueError, match='sang de vampire'):
            await database.feed_vampire(1, 2, 'quick', now=NOW)
        assert await database.get_vampire_soif(1, 2) == 24  # nothing changed
        await database.set_vampire_soif(1, 2, 3)
        scene = await database.feed_vampire(1, 2, 'scene', now=NOW)
        assert (scene['gained'], scene['vitae']) == (22, 25)  # the whole reserve, not +10
        assert database.requires_scene_feeding(5) and not database.requires_scene_feeding(4)
    asyncio.run(run())


def test_quick_feed_amounts_follow_the_reserve():
    assert [database.quick_feed_amount(n) for n in range(1, 6)] == [2, 4, 5, 8, 10]
    assert [database.quick_feed_floor(n) for n in range(1, 6)] == [2, 4, 5, 8, 10]


def test_upkeep_is_lazy_capped_and_keeps_the_remainder(db):
    async def run():
        await seed(bp=5)
        assert await database.apply_vitae_upkeep(1, 2, now=NOW) == {'lost': 0, 'vitae': 25}  # starts the clock
        assert (await database.apply_vitae_upkeep(1, 2, now=NOW + timedelta(days=1)))['lost'] == 0
        assert (await database.apply_vitae_upkeep(1, 2, now=NOW + timedelta(days=5)))['lost'] == 2
        # 5 days = 2 intervals + 1 day: the extra day still counts toward the next interval.
        assert (await database.apply_vitae_upkeep(1, 2, now=NOW + timedelta(days=6)))['lost'] == 1
        assert (await database.apply_vitae_upkeep(1, 2, now=NOW + timedelta(days=40)))['lost'] == 3
        assert await database.get_vampire_soif(1, 2) == 19
        await database.set_vampire_soif(1, 2, 1)
        assert (await database.apply_vitae_upkeep(1, 2, now=NOW + timedelta(days=80)))['vitae'] == 0
        assert (await database.feed_vampire(1, 2, 'scene', now=NOW + timedelta(days=80)))['vitae'] == 25
        assert (await database.apply_vitae_upkeep(1, 2, now=NOW + timedelta(days=81)))['lost'] == 0  # feeding resets
    asyncio.run(run())


def test_rank_change_caps_the_reserve_but_never_refills_it(db):
    async def run():
        await seed(bp=3, vitae=4)
        await database.set_blood_potency(1, 2, 4)
        assert await database.get_vampire_soif(1, 2) == 4
        await database.set_vampire_soif(1, 2, 18)
        await database.set_blood_potency(1, 2, 1)
        assert await database.get_vampire_soif(1, 2) == 5
    asyncio.run(run())


def test_power_costs_are_charged_from_the_catalog(db):
    async def run():
        await seed(bp=5)
        majesty = next(p for p in get_usable_powers('brujah', 5) if p['name'] == 'Majesté')
        result = await database.spend_vitae_for_power(1, 2, 'brujah', 5, majesty['id'])
        assert (result['cost'], result['vitae']) == (9, 16)
        free = next(p for p in get_usable_powers('brujah', 5) if p['bloodCost'] == 0)
        assert (await database.spend_vitae_for_power(1, 2, 'brujah', 5, free['id']))['vitae'] == 16
        await database.set_vampire_soif(1, 2, 8)
        with pytest.raises(ValueError, match='insuffisante'):
            await database.spend_vitae_for_power(1, 2, 'brujah', 5, majesty['id'])
        assert await database.get_vampire_soif(1, 2) == 8
    asyncio.run(run())


def test_power_access_follows_clan_and_rank():
    with pytest.raises(ValueError, match="n'appartient pas"):
        check_power_usable('brujah', 5, 'dominate-1-command')
    with pytest.raises(ValueError, match='Puissance du Sang'):
        check_power_usable('Banu Haqim', 2, 'quietus-3-dagons-call')
    assert check_power_usable('daughters_cacophony', 1, 'melpominee-1-the-missing-voice')['bloodCost'] == 0
    assert [p['level'] for p in get_usable_powers('salubri', 2)] == [1, 2, 1, 2, 1, 2]
    assert all(p['bloodCost'] == 9 for p in POWERS.values() if p['level'] == 5)


def test_vitae_api_charges_and_reports(db):
    class Request(dict):
        def __init__(self, method, payload=None):
            super().__init__(verified_user_id=1, verified_guild_id=2)
            self.method, self.payload = method, payload

        async def json(self):
            return self.payload

    async def run():
        await seed(bp=3)
        vampire = {'clan': 'tremere', 'blood_potency': 3, 'soif_level': 12}
        with patch('modules.vampire.api.get_vampire_data', AsyncMock(return_value=vampire)):
            state = await vitae_handler(Request('GET'))
            assert state.status == 200 and b'"max_vitae": 12' in state.body
            paid = await vitae_handler(Request('POST', {'powerId': 'thaumaturgy-3-blood-of-potency'}))
            assert paid.status == 200 and b'"vitae": 9' in paid.body
            assert (await vitae_handler(Request('POST', {'powerId': 'potence-1-vigor'}))).status == 400
            assert (await vitae_handler(Request('POST', {'powerId': 'thaumaturgy-4-theft-of-vitae'}))).status == 400
        assert await database.get_vampire_soif(1, 2) == 9
    asyncio.run(run())


def test_binding_a_blood_ghoul_costs_vitae(db):
    class Request(dict):
        method = 'POST'

        def __init__(self, ghouls):
            super().__init__(verified_user_id=1, verified_guild_id=2)
            self.ghouls = ghouls

        async def json(self):
            return {'ghouls': self.ghouls}

    async def run():
        await seed(bp=2, vitae=4)
        character = {'clan': 'brujah', 'bloodPotency': 2, 'ghouls': []}
        remote = AsyncMock(return_value={'character': character})
        with patch('modules.vampire.api.sheets_request', remote), \
             patch('modules.vampire.api.get_vampire_data', AsyncMock(return_value={'clan': 'brujah'})):
            saved = await character_handler(Request([{'id': 'g1', 'name': 'Marc'}]))
            assert saved.status == 200 and await database.get_vampire_soif(1, 2) == 4 - GHOUL_BLOOD_COST
            character['ghouls'] = [{'id': 'g1', 'name': 'Marc', 'type': 'blood', 'discipline_name': 'Présence'}]
            edited = await character_handler(Request([{'id': 'g1', 'name': 'Marc renommé'}]))
            assert edited.status == 200 and await database.get_vampire_soif(1, 2) == 1  # no new ghoul, no cost
            refused = await character_handler(Request([{'id': 'g1', 'name': 'Marc'}, {'id': 'g2', 'name': 'Léa'}]))
            assert refused.status == 400 and b'Vitae' in refused.body
            assert await database.get_vampire_soif(1, 2) == 1
        assert remote.await_count == 5  # 3 reads + 2 saves: the refused register was never saved
    asyncio.run(run())


def test_ghoul_limits_and_lineage_keys():
    assert validate_ghouls([{'id': 'a', 'name': 'A'}], {'clan': 'daughters_cacophony', 'bloodPotency': 1})[0]['discipline_name']
    assert validate_ghouls([{'id': 'a', 'name': 'A'}], {'clan': 'salubri', 'bloodPotency': 1})[0]['discipline_power']
    with pytest.raises(ValueError, match='goules de sang'):
        validate_ghouls([{'id': 'a', 'name': 'A'}, {'id': 'b', 'name': 'B'}], {'clan': 'brujah', 'bloodPotency': 1})
    mind = [{'id': 'm1', 'name': 'M', 'type': 'mind'}, {'id': 'm2', 'name': 'N', 'type': 'mind'}]
    with pytest.raises(ValueError, match="goules de l'esprit"):
        validate_ghouls(mind, {'clan': 'ventrue', 'bloodPotency': 4})
    assert len(validate_ghouls(mind, {'clan': 'ventrue', 'bloodPotency': 5})) == 2
