"""Le Lien de sang entre vampires : gorgées, stades, exclusivité, défi, opérations MJ. Hors ligne."""
import asyncio

import aiosqlite
import pytest

from utils import blood_bonds as bonds
from utils import database

G = 1
REGNANT, THRALL, OTHER = 10, 20, 30


@pytest.fixture
def db(tmp_path, monkeypatch):
    path = tmp_path / 'game.db'
    monkeypatch.setattr(database, 'DATABASE_PATH', path)
    asyncio.run(database.init_database())
    return path


def run(coro):
    return asyncio.run(coro)


def seed(user_id, bp=3, vitae=12, guild_id=G):
    async def go():
        await database.set_blood_potency(user_id, guild_id, bp)
        await database.set_vampire_soif(user_id, guild_id, vitae)
    run(go())


def offer(regnant=REGNANT, thrall=THRALL, clan='Ventrue', guild_id=G):
    return run(bonds.offer_blood(guild_id, regnant, f'R{regnant}', clan, thrall, f'T{thrall}'))


def vitae(user_id, guild_id=G):
    return run(database.get_vampire_soif(user_id, guild_id))


def test_three_draughts_bind_and_each_costs_one_vitae(db):
    seed(REGNANT, bp=3, vitae=12)
    results = [offer() for _ in range(3)]
    assert [r['stage'] for r in results] == [1, 2, 3]
    assert [r['vitae'] for r in results] == [11, 10, 9]
    assert [r['first'] for r in results] == [True, False, False]
    assert vitae(REGNANT) == 9


def test_first_tremere_draught_binds_at_stage_two(db):
    seed(REGNANT)
    assert offer(clan='Tremere')['stage'] == 2
    assert offer(clan='Tremere')['stage'] == 3


@pytest.mark.parametrize('case, message', [
    ('self', 'Tu ne peux pas te lier à toi-même.'),
    ('empty', 'Réserve de Vitae insuffisante'),
    ('other', 'Son cœur appartient déjà à un autre.'),
    ('complete', 'Le lien est déjà complet.'),
])
def test_refusals_spend_nothing(db, case, message):
    seed(REGNANT, vitae=0 if case == 'empty' else 12)
    kwargs = {}
    if case == 'self':
        kwargs['thrall'] = REGNANT
    elif case == 'other':
        seed(OTHER)
        for _ in range(3):
            offer(regnant=OTHER)
    elif case == 'complete':
        for _ in range(3):
            offer()
    before = vitae(REGNANT)
    with pytest.raises(ValueError, match=message):
        offer(**kwargs)
    assert vitae(REGNANT) == before
    state = run(bonds.get_bonds(G, THRALL))['bound_to']
    stages = {b['regnant_ref']: b['stage'] for b in state}
    assert stages.get(str(REGNANT)) == (3 if case == 'complete' else None)


def test_partial_bonds_to_others_survive_a_full_bond(db):
    seed(REGNANT)
    seed(OTHER)
    offer(regnant=REGNANT)
    for _ in range(3):
        offer(regnant=OTHER)
    held = {b['regnant_ref']: b['stage'] for b in run(bonds.get_bonds(G, THRALL))['bound_to']}
    assert held == {str(OTHER): 3, str(REGNANT): 1}


def test_names_follow_the_latest_draught(db):
    seed(REGNANT)
    run(bonds.offer_blood(G, REGNANT, 'Ancien', 'Ventrue', THRALL, 'Vieux'))
    run(bonds.offer_blood(G, REGNANT, 'Nouveau', 'Ventrue', THRALL, 'Jeune'))
    bond = run(bonds.get_bonds(G, THRALL))['bound_to'][0]
    assert (bond['regnant_name'], bond['thrall_name'], bond['stage']) == ('Nouveau', 'Jeune', 2)


def test_defy_costs_the_regnant_rank(db):
    # régnant joueur de rang 4
    seed(REGNANT, bp=4)
    seed(THRALL, bp=3, vitae=12)
    for _ in range(3):
        offer()
    result = run(bonds.defy_bond(G, THRALL))
    assert (result['cost'], result['vitae'], result['regnant_name']) == (4, 8, f'R{REGNANT}')
    # le rang se lit à l'appel : il suit la Puissance de Sang du régnant
    run(database.set_blood_potency(REGNANT, G, 2))
    assert run(bonds.defy_bond(G, THRALL))['cost'] == 2


def test_defy_npc_rank_and_poor_reserve(db):
    seed(THRALL, bp=3, vitae=12)
    run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'Le Prince', 5, 3))
    assert run(bonds.defy_bond(G, THRALL))['cost'] == 5
    run(database.set_vampire_soif(THRALL, G, 3))
    with pytest.raises(ValueError, match='Réserve de Vitae insuffisante'):
        run(bonds.defy_bond(G, THRALL))
    assert vitae(THRALL) == 3


def test_defy_needs_a_full_bond(db):
    seed(REGNANT)
    seed(THRALL)
    offer()
    with pytest.raises(ValueError, match='Aucun lien complet à défier.'):
        run(bonds.defy_bond(G, THRALL))


def test_clan_change_clears_both_directions(db):
    seed(REGNANT)
    seed(OTHER)
    offer(regnant=REGNANT, thrall=THRALL)   # THRALL lié à REGNANT
    seed(THRALL)
    offer(regnant=THRALL, thrall=OTHER)     # THRALL régnant sur OTHER
    seed(REGNANT, guild_id=2)
    offer(regnant=REGNANT, thrall=THRALL, guild_id=2)
    assert run(bonds.clear_blood_bonds(G, THRALL)) == 2
    assert run(bonds.get_bonds(G, THRALL)) == {'bound_to': [], 'drank_from_me': []}
    assert len(run(bonds.list_guild_bonds(2))) == 1


def test_gm_npc_bonds_are_exclusive_and_normalised(db):
    seed(REGNANT)
    first = run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, '  Le Prince ', 4, 1))
    assert first['regnant_ref'] == 'name:le prince' and first['regnant_name'] == 'Le Prince'
    assert first['defy_cost'] == 4 and first['regnant_potency'] == 4
    with pytest.raises(ValueError, match='Ce lien existe déjà'):
        run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'le prince', 4, 2))
    for _ in range(3):
        offer()
    with pytest.raises(ValueError, match="Efface d'abord l'autre lien au stade 3."):
        run(bonds.gm_create_npc_bond(G, THRALL, 'T', 'npc-9', 'Sire', 3, 3))
    with pytest.raises(ValueError, match="Efface d'abord"):
        run(bonds.gm_set_stage(G, first['id'], 3))
    assert run(bonds.gm_set_stage(G, first['id'], 2))['stage'] == 2
    assert run(bonds.gm_set_stage(2, first['id'], 1)) is None
    assert run(bonds.gm_delete_bond(2, first['id'])) is False
    assert run(bonds.gm_delete_bond(G, first['id'])) is True


def test_gm_validates_stage_and_rank(db):
    with pytest.raises(ValueError, match=r'Stade invalide \(1 à 3\)\.'):
        run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'X', 3, 4))
    with pytest.raises(ValueError, match=r'Rang invalide \(1 à 5\)\.'):
        run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'X', 6, 1))
    with pytest.raises(ValueError, match=r'Stade invalide'):
        run(bonds.gm_set_stage(G, 1, 0))


def test_bonds_are_sorted_by_stage_then_name(db):
    seed(REGNANT)
    offer()
    run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'Zoé', 2, 2))
    run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'Alice', 2, 2))
    run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'Max', 2, 3))
    names = [b['regnant_name'] for b in run(bonds.get_bonds(G, THRALL))['bound_to']]
    assert names == ['Max', 'Alice', 'Zoé', f'R{REGNANT}']


def test_guild_vampires_list_names(db):
    async def go():
        async with aiosqlite.connect(database.DATABASE_PATH) as conn:
            await conn.executemany(
                "INSERT INTO players (user_id, guild_id, race, clan) VALUES (?, ?, ?, ?)",
                [(1, G, 'vampire', 'ventrue'), (2, G, 'vampire', 'tremere'),
                 (3, G, 'werewolf', None), (4, G, 'vampire', None), (5, 2, 'vampire', 'brujah')])
            await conn.execute("INSERT INTO character_sheets (user_id, guild_id, name) VALUES (1, ?, 'Aurore')", (G,))
            await conn.commit()
        return await bonds.list_guild_vampires(G)
    assert run(go()) == [{'id': 1, 'name': 'Aurore'}, {'id': 2, 'name': 'Vampire inconnu'}]


def test_a_full_npc_bond_blocks_a_players_draught(db):
    seed(REGNANT)
    run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'Le Prince', 5, 3))
    with pytest.raises(ValueError, match='Son cœur appartient déjà à un autre.'):
        offer()
    assert vitae(REGNANT) == 12


def test_concurrent_draughts_charge_once_per_stage_gained(db):
    seed(REGNANT, vitae=12)

    async def race():
        return await asyncio.gather(*[
            bonds.offer_blood(G, REGNANT, 'R', 'Ventrue', THRALL, 'T') for _ in range(5)], return_exceptions=True)
    results = run(race())
    won = [r for r in results if isinstance(r, dict)]
    assert len(won) == 3 and sorted(r['stage'] for r in won) == [1, 2, 3]
    assert all(isinstance(r, ValueError) for r in results if not isinstance(r, dict))
    assert vitae(REGNANT) == 12 - 3
    assert run(bonds.get_bonds(G, THRALL))['bound_to'][0]['stage'] == 3


def test_two_regnants_racing_cannot_both_reach_stage_three(db):
    seed(REGNANT)
    seed(OTHER)

    async def race():
        calls = [bonds.offer_blood(G, r, f'R{r}', 'Ventrue', THRALL, 'T') for r in (REGNANT, OTHER) for _ in range(3)]
        return await asyncio.gather(*calls, return_exceptions=True)
    run(race())
    held = run(bonds.get_bonds(G, THRALL))['bound_to']
    assert sum(1 for b in held if b['stage'] == 3) <= 1
    spent = (12 - vitae(REGNANT)) + (12 - vitae(OTHER))
    assert spent == sum(b['stage'] for b in held)


# ---------------------------------------------------------------------------
# Panneau /vampire
# ---------------------------------------------------------------------------

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

from modules.vampire.views import bonds as bond_views
from modules.vampire.views.panel import PowerSelect, VampirePanel


def bond(name='Lucrezia', stage=1, cost=3, kind='player', ref='10'):
    return {'id': 1, 'guild_id': G, 'thrall_id': THRALL, 'thrall_name': name, 'regnant_kind': kind,
            'regnant_ref': ref, 'regnant_name': name, 'regnant_potency': None, 'stage': stage,
            'defy_cost': cost}


def test_bond_fields_show_stage_directive_and_regnant_list():
    assert bond_views.bond_fields({'bound_to': [], 'drank_from_me': []}) == []
    fields = dict(bond_views.bond_fields({'bound_to': [bond(stage=3, cost=4)], 'drank_from_me': []}))
    assert 'stade 3' in fields['⛓️ Liens de sang'] and '**Lucrezia**' in fields['⛓️ Liens de sang']
    assert 'Directive de Jeu' in fields and '4 Vitae' in fields['Directive de Jeu']
    assert 'Directive de Jeu' not in dict(bond_views.bond_fields({'bound_to': [bond(stage=2)], 'drank_from_me': []}))

    drank = [bond(name=f'Vassal{i}') for i in range(7)]
    value = dict(bond_views.bond_fields({'bound_to': [], 'drank_from_me': drank}))['🩸 Ont bu ton sang']
    assert value.count('Vassal') == 5 and '…et 2 autres' in value

    huge = bond(name='X' * 2000, stage=3)
    for _, text in bond_views.bond_fields({'bound_to': [huge], 'drank_from_me': [huge]}):
        assert len(text) <= 1024


def test_defy_option_comes_first_even_with_many_powers():
    assert bond_views.defy_option({'bound_to': [bond(stage=2)], 'drank_from_me': []}) is None
    panel = VampirePanel(THRALL, G, 5, 'tremere', 12, 5,
                         bonds={'bound_to': [bond(stage=3, cost=4)], 'drank_from_me': []})
    select = next(item for item in panel.children if isinstance(item, PowerSelect))
    assert select.options[0].value == bond_views.DEFY_OPTION
    assert select.options[0].label == 'Défier le lien envers Lucrezia (4 Vitae)'
    assert len(select.options) <= 25


def discord_interaction(user_id=THRALL):
    channel = SimpleNamespace(id=5, send=AsyncMock(return_value=SimpleNamespace(id=99)))
    guild = SimpleNamespace(id=G, get_channel_or_thread=MagicMock(return_value=channel), fetch_channel=AsyncMock())
    user = SimpleNamespace(id=user_id, display_name='Moi', mention=f'<@{user_id}>')
    response = SimpleNamespace(edit_message=AsyncMock(), send_message=AsyncMock())
    return SimpleNamespace(guild=guild, user=user, channel=channel, response=response), channel


def test_offer_refuses_a_member_without_vampire(db, monkeypatch):
    spend = AsyncMock()
    monkeypatch.setattr(database, 'modify_vitae', spend)
    monkeypatch.setattr(bond_views, 'get_player', AsyncMock(return_value={'race': 'humain', 'clan': None}))
    seed(REGNANT)

    async def go():
        panel = VampirePanel(REGNANT, G, 5, 'ventrue', 12, 3, bonds={'bound_to': [], 'drank_from_me': []})
        view = bond_views.OfferBloodView(panel)
        select = next(item for item in view.children if isinstance(item, bond_views.OfferUserSelect))
        inter, channel = discord_interaction(REGNANT)
        for target in (SimpleNamespace(id=77, bot=True, display_name='Bot', mention='<@77>'),
                       SimpleNamespace(id=78, bot=False, display_name='Mortel', mention='<@78>')):
            monkeypatch.setattr(type(select), 'values', [target], raising=False)
            await select.callback(inter)
        return inter, channel
    inter, channel = run(go())
    assert inter.response.send_message.await_count == 2
    for call in inter.response.send_message.await_args_list:
        assert call.args[0] == "Ce membre n'a pas de personnage vampire."
        assert call.kwargs['ephemeral'] is True
    spend.assert_not_awaited()
    channel.send.assert_not_awaited()
    assert vitae(REGNANT) == 12


def test_offer_binds_posts_the_card_and_returns_to_the_panel(db, monkeypatch):
    seed(REGNANT)
    seed(THRALL)
    monkeypatch.setattr(bond_views, 'get_player', AsyncMock(return_value={'race': 'vampire', 'clan': 'ventrue'}))

    async def go():
        panel = VampirePanel(REGNANT, G, 5, 'ventrue', 12, 3, bonds={'bound_to': [], 'drank_from_me': []})
        select = bond_views.OfferUserSelect(panel)
        inter, channel = discord_interaction(REGNANT)
        target = SimpleNamespace(id=THRALL, bot=False, display_name='Cadet', mention='<@20>')
        monkeypatch.setattr(type(select), 'values', [target], raising=False)
        await select.callback(inter)
        return inter, channel
    inter, channel = run(go())
    assert channel.send.await_args.kwargs['content'] == '<@20>'
    assert 'noue' in channel.send.await_args.kwargs['embed'].description
    kwargs = inter.response.edit_message.await_args.kwargs
    assert 'lien au stade 1' in kwargs['embed'].footer.text
    assert kwargs['view'].bonds['drank_from_me'][0]['stage'] == 1
    assert vitae(REGNANT) == 11


def test_zenith_feeding_text_says_it_does_not_bind():
    def feeding(bp):
        embed = VampirePanel(THRALL, G, 5, 'ventrue', 12, bp).create_embed()
        return next(f.value for f in embed.fields if f.name == '🍷 Alimentation')
    assert '(cette chasse ne te lie pas)' in feeding(5)
    assert 'ne te lie pas' not in feeding(3)


def test_defying_from_the_panel_spends_the_regnants_rank(db):
    seed(REGNANT, bp=3, vitae=12)
    seed(THRALL, bp=2, vitae=12)
    for _ in range(3):
        offer()
    before = vitae(THRALL)

    async def go():
        panel = VampirePanel(THRALL, G, 5, 'ventrue', before, 2, bonds=await bonds.get_bonds(G, THRALL))
        select = next(item for item in panel.children if isinstance(item, PowerSelect))
        inter, _ = discord_interaction(THRALL)
        select._values = [bond_views.DEFY_OPTION]
        await select.callback(inter)
        return inter
    inter = run(go())
    assert vitae(THRALL) == before - 3  # rang 3 du régnant
    assert '⛓️ Tu défies ton lien envers R10 : 3 Vitae versés.' == inter.response.edit_message.await_args.kwargs['embed'].footer.text


def test_offer_that_empties_the_reserve_triggers_the_hunger(db, monkeypatch):
    seed(REGNANT, bp=3, vitae=1)
    seed(THRALL)
    monkeypatch.setattr(bond_views, 'get_player', AsyncMock(return_value={'race': 'vampire', 'clan': 'ventrue'}))
    empty = AsyncMock(return_value='🩸 À sec : la Faim.')
    monkeypatch.setattr(bond_views, 'handle_empty_reserve', empty)

    async def go():
        panel = VampirePanel(REGNANT, G, 5, 'ventrue', 1, 3, bonds={'bound_to': [], 'drank_from_me': []})
        select = bond_views.OfferUserSelect(panel)
        inter, _ = discord_interaction(REGNANT)
        target = SimpleNamespace(id=THRALL, bot=False, display_name='Cadet', mention='<@20>')
        monkeypatch.setattr(type(select), 'values', [target], raising=False)
        await select.callback(inter)
        return inter
    inter = run(go())
    empty.assert_awaited_once()
    footer = inter.response.edit_message.await_args.kwargs['embed'].footer.text
    assert 'lien au stade 1' in footer and 'À sec : la Faim.' in footer
    assert vitae(REGNANT) == 0


# --- API joueur et MJ ---------------------------------------------------------------------------
import json as _json
from types import SimpleNamespace

from data.config import ROLE_MJ_VAMPIRE, ROLE_VAMPIRE
from modules.vampire import api as bonds_api

BIG_ID = 123456789012345678


class FakeRequest(dict):
    def __init__(self, user_id=1, guild_id=G, roles=(ROLE_MJ_VAMPIRE,), body=None, match_info=None):
        super().__init__(verified_user_id=user_id, verified_guild_id=guild_id,
                         verified_member=SimpleNamespace(roles=[SimpleNamespace(id=r) for r in roles]))
        self.match_info = match_info or {}
        self._body = body
        self.app = {}

    async def json(self):
        return self._body


def call(handler, **kwargs):
    response = run(handler(FakeRequest(**kwargs)))
    return response.status, _json.loads(response.text)


def add_vampire(user_id, name, guild_id=G):
    async def go():
        async with aiosqlite.connect(database.DATABASE_PATH) as conn:
            await conn.execute("INSERT INTO players (user_id, guild_id, race, clan) VALUES (?, ?, 'vampire', 'ventrue')",
                               (user_id, guild_id))
            await conn.execute("INSERT INTO character_sheets (user_id, guild_id, name) VALUES (?, ?, ?)",
                               (user_id, guild_id, name))
            await conn.commit()
    run(go())


def add_npc(npc_id, name, potency, guild_id=G):
    async def go():
        async with aiosqlite.connect(database.DATABASE_PATH) as conn:
            await conn.execute("INSERT INTO npcs (id, guild_id, name, blood_potency) VALUES (?, ?, ?, ?)",
                               (npc_id, guild_id, name, potency))
            await conn.commit()
    run(go())
    return {'id': npc_id}


def test_player_route_returns_string_ids(db):
    run(bonds.gm_create_npc_bond(G, BIG_ID, 'T', 'npc_1', 'Le Prince', 5, 2))
    status, body = call(bonds_api.player_bonds_handler, user_id=BIG_ID, roles=(ROLE_VAMPIRE,))
    assert status == 200 and body['success'] is True
    bond = body['bound_to'][0]
    assert bond['thrall_id'] == str(BIG_ID) and isinstance(bond['thrall_id'], str)
    assert isinstance(bond['regnant_ref'], str) and isinstance(bond['id'], int)
    assert body['drank_from_me'] == []


def test_gm_routes_refuse_players(db):
    bond = run(bonds.gm_create_npc_bond(G, THRALL, 'T', None, 'Le Prince', 5, 1))
    info = {'bond_id': str(bond['id'])}
    kwargs = dict(roles=(ROLE_VAMPIRE,), body={'stage': 2, 'thrallId': str(THRALL)}, match_info=info)
    for handler in (bonds_api.gm_bonds_list_handler, bonds_api.gm_bonds_create_handler,
                    bonds_api.gm_bond_update_handler, bonds_api.gm_bond_delete_handler):
        assert call(handler, **kwargs)[0] == 403
    assert len(run(bonds.list_guild_bonds(G))) == 1


def test_gm_lists_bonds_vampires_and_npcs(db):
    add_vampire(BIG_ID, 'Aurore')
    add_npc('npc_a', 'Le Prince', 4)
    run(bonds.gm_create_npc_bond(G, BIG_ID, 'Aurore', None, 'Le Prince', 4, 1))
    status, body = call(bonds_api.gm_bonds_list_handler)
    assert status == 200
    assert body['vampires'] == [{'id': str(BIG_ID), 'name': 'Aurore'}]
    assert body['npcs'][0]['name'] == 'Le Prince' and body['npcs'][0]['blood_potency'] == 4
    assert body['bonds'][0]['thrall_id'] == str(BIG_ID)


def test_gm_creates_npc_bond_from_registry_with_its_rank(db):
    add_vampire(THRALL, 'Aurore')
    npc = add_npc('npc_a', 'Le Prince', 4)
    status, body = call(bonds_api.gm_bonds_create_handler,
                        body={'thrallId': str(THRALL), 'npcId': npc['id'], 'stage': 2, 'potency': 1, 'npcName': 'Autre'})
    assert status == 201
    assert body['bond']['defy_cost'] == 4 and body['bond']['regnant_name'] == 'Le Prince'
    assert body['bond']['regnant_ref'] == npc['id']
    other = add_npc('npc_b', 'Étranger', 2, guild_id=2)
    status, _ = call(bonds_api.gm_bonds_create_handler, body={'thrallId': str(THRALL), 'npcId': other['id'], 'stage': 1})
    assert status == 404


def test_gm_creates_free_name_bond_and_validates(db):
    add_vampire(THRALL, 'Aurore')
    ok = {'thrallId': str(THRALL), 'npcName': 'Un Ancien', 'potency': 3, 'stage': 1}
    status, body = call(bonds_api.gm_bonds_create_handler, body=ok)
    assert status == 201 and body['bond']['defy_cost'] == 3
    cases = [({**ok, 'npcName': '  '}, "Le nom du PNJ est requis."),
             ({**ok, 'npcName': 'X', 'potency': 9}, 'Rang invalide'),
             ({**ok, 'npcName': 'Y', 'stage': 7}, 'Stade invalide'),
             ({**ok, 'thrallId': '999'}, "Ce membre n'a pas de personnage vampire."),
             ({**ok, 'thrallId': 'abc'}, "Ce membre n'a pas de personnage vampire."),
             ({**ok, 'npcName': 'Z', 'potency': None}, 'Rang invalide')]
    for body_in, message in cases:
        status, body = call(bonds_api.gm_bonds_create_handler, body=body_in)
        assert status == 400 and message in body['error'], (body_in, body)


def test_gm_update_and_delete_are_guild_scoped(db):
    bond = run(bonds.gm_create_npc_bond(3, THRALL, 'T', None, 'Le Prince', 5, 1))
    info = {'bond_id': str(bond['id'])}
    assert call(bonds_api.gm_bond_update_handler, guild_id=2, body={'stage': 2}, match_info=info)[0] == 404
    assert call(bonds_api.gm_bond_delete_handler, guild_id=2, match_info=info)[0] == 404
    assert run(bonds.list_guild_bonds(3))[0]['stage'] == 1
    status, body = call(bonds_api.gm_bond_update_handler, guild_id=3, body={'stage': 2}, match_info=info)
    assert status == 200 and body['bond']['stage'] == 2
    assert call(bonds_api.gm_bond_update_handler, guild_id=3, body={'stage': 9}, match_info=info)[0] == 400
    assert call(bonds_api.gm_bond_delete_handler, guild_id=3, match_info=info)[0] == 200
    assert run(bonds.list_guild_bonds(3)) == []
    assert call(bonds_api.gm_bond_delete_handler, guild_id=3, match_info={'bond_id': 'abc'})[0] == 404
