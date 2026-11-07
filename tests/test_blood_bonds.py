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
    with pytest.raises(ValueError):
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
