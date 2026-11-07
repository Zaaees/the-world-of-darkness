"""La Bête et la Frénésie : déclencheurs, prix pour la ravaler, état rattaché à la scène. Hors ligne."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from data.clans import CLANS, get_frenzy_colouring
from data.frenzy import (
    EXITS, FRENZY_TYPES, TRIGGERS, available_triggers, can_resist, exits_for, is_hungry, resist_cost,
)
from modules.vampire.views import frenzy as views
from utils import database


@pytest.fixture
def db(tmp_path, monkeypatch):
    path = tmp_path / 'game.db'
    monkeypatch.setattr(database, 'DATABASE_PATH', path)
    asyncio.run(database.init_database())
    return path


async def seed(bp=3, vitae=None):
    await database.set_blood_potency(1, 2, bp)
    await database.set_vampire_soif(1, 2, database.get_max_vitae(bp) if vitae is None else vitae)


def test_resisting_costs_the_rank_and_double_for_a_brujah_against_rage():
    assert [resist_cost('rage_blessure', bp, 'ventrue') for bp in range(1, 6)] == [1, 2, 3, 4, 5]
    assert resist_cost('rage_humiliation', 3, 'Brujah') == 6
    assert resist_cost('terreur_feu', 3, 'brujah') == 3  # la faiblesse ne joue que contre la Rage
    assert resist_cost('faim_zero', 3, 'ventrue') is None  # à zéro, la Faim l'emporte d'office
    assert resist_cost('pouvoir_rage', 3, 'brujah') is None  # prix du pouvoir, saisi par le joueur


def test_the_last_drop_never_holds_the_beast():
    assert can_resist(3, 4) and not can_resist(3, 3) and not can_resist(1, 1) and not can_resist(0, 5)


def test_triggers_follow_the_reserve_and_the_clan():
    assert available_triggers('ventrue', 0, 12) == ['faim_zero']
    healthy = available_triggers('ventrue', 12, 12)
    assert 'faim_sang' not in healthy and 'faim_cainite' not in healthy and 'faim_zero' not in healthy
    assert 'faim_sang' in available_triggers('ventrue', 2, 12)  # Affamé : sous 20 %
    assert 'faim_cainite' in available_triggers('assamites', 12, 12)
    assert is_hungry(2, 12) and not is_hungry(3, 12) and not is_hungry(0, 12)
    assert len(available_triggers('banu_haqim', 2, 12)) <= 25  # un menu Discord


def test_every_frenzy_can_end_and_every_clan_colours_it():
    assert {TRIGGERS[t]['type'] for t in TRIGGERS} == set(FRENZY_TYPES)
    for kind in FRENZY_TYPES:
        reasons = exits_for(kind)
        assert {'apaise', 'maitrise'} <= set(reasons) and len(reasons) == 3
    assert set(EXITS['rassasie']['types']) == {'faim'}
    for key, clan in CLANS.items():
        if key == 'cain':
            continue
        colouring = get_frenzy_colouring(key)
        assert colouring['directive'].startswith('Ta Bête'), key
        assert 'FRÉNÉSIE' not in colouring['nom'], key  # le type de frénésie ne se contredit pas


def test_scene_link_names_a_channel_of_this_server():
    assert views.parse_scene_link('https://discord.com/channels/2/42/99', 2) == 42
    assert views.parse_scene_link(' https://ptb.discord.com/channels/2/42 ', 2) == 42
    assert views.parse_scene_link('https://discord.com/channels/3/42/99', 2) is None
    assert views.parse_scene_link('pas un lien', 2) is None


def test_frenzy_is_tied_to_its_scene_and_goes_to_the_history(db):
    async def run():
        await seed(bp=3)
        frenzy = await database.start_frenzy(1, 2, 'rage', 'rage_blessure', 42)
        assert (frenzy['frenzy_type'], frenzy['channel_id'], frenzy['message_id']) == ('rage', 42, None)
        with pytest.raises(ValueError, match='déjà'):
            await database.start_frenzy(1, 2, 'terreur', 'terreur_feu', 43)
        assert (await database.update_frenzy(1, 2, message_id=7, started_at='ignored'))['message_id'] == 7
        assert await database.get_frenzy(1, 3) is None  # autre serveur
        ended = await database.end_frenzy(1, 2, 'cause_disparue', '  Des yeux de loup  ')
        assert (ended['exit_reason'], ended['mark'], ended['message_id']) == ('cause_disparue', 'Des yeux de loup', 7)
        assert await database.get_frenzy(1, 2) is None
        assert await database.end_frenzy(1, 2, 'apaise') is None
        assert await database.get_beast_marks(1, 2) == ['Des yeux de loup']
        await database.start_frenzy(1, 2, 'faim', 'faim_zero', 42)
        await database.end_frenzy(1, 2, 'rassasie', '')
        assert await database.get_beast_marks(1, 2) == ['Des yeux de loup']  # pas de marque vide
        await database.clear_frenzy_data(1, 2)
        assert await database.get_beast_marks(1, 2) == []
    asyncio.run(run())


def test_resisting_spends_the_price_but_never_the_last_drop(db):
    async def run():
        await seed(bp=3, vitae=4)
        assert await database.resist_frenzy(1, 2, 'rage', 'rage_blessure', 3, 42) == 1
        with pytest.raises(ValueError, match='dernière goutte'):
            await database.resist_frenzy(1, 2, 'rage', 'rage_blessure', 1, 42)
        assert await database.get_vampire_soif(1, 2) == 1  # rien n'a été prélevé
        with pytest.raises(ValueError):
            await database.resist_frenzy(1, 2, 'rage', 'rage_blessure', 0, 42)
        assert await database.get_frenzy(1, 2) is None  # ravaler n'ouvre aucune frénésie
    asyncio.run(run())


class Panel(SimpleNamespace):
    pass


def interaction(channel_id=42):
    channel = SimpleNamespace(id=channel_id, send=AsyncMock(return_value=SimpleNamespace(id=99)))
    guild = SimpleNamespace(id=2, get_channel_or_thread=MagicMock(return_value=channel), fetch_channel=AsyncMock())
    user = SimpleNamespace(id=1, display_name='Lucrezia', display_avatar=SimpleNamespace(url='https://x/a.png'))
    return SimpleNamespace(guild=guild, user=user, channel=channel), channel


def test_an_empty_reserve_in_a_scene_unleashes_hunger_and_announces_it_there(db):
    async def run():
        await seed(bp=3, vitae=0)
        panel = Panel(user_id=1, guild_id=2, clan='gangrel', frenzy=None, beast_marks=[])
        inter, channel = interaction()
        note = await views.handle_empty_reserve(inter, panel)
        assert 'Faim' in note and panel.frenzy['frenzy_type'] == 'faim'
        assert (await database.get_frenzy(1, 2))['message_id'] == 99
        card = channel.send.await_args.kwargs['embed']
        assert 'FAIM' in card.title and 'Lucrezia' in card.description
        assert await views.handle_empty_reserve(inter, panel) is None  # déjà en frénésie de Faim
        assert channel.send.await_count == 1
    asyncio.run(run())


def test_rage_turns_to_hunger_at_zero_and_the_card_is_edited_not_reposted(db):
    async def run():
        await seed(bp=3, vitae=0)
        await database.start_frenzy(1, 2, 'rage', 'rage_blessure', 42)
        await database.update_frenzy(1, 2, message_id=55)
        panel = Panel(user_id=1, guild_id=2, clan='brujah', frenzy=None, beast_marks=[])
        inter, channel = interaction()
        message = SimpleNamespace(edit=AsyncMock())
        channel.get_partial_message = MagicMock(return_value=message)
        assert 'Faim' in await views.handle_empty_reserve(inter, panel)
        assert (await database.get_frenzy(1, 2))['frenzy_type'] == 'faim'
        channel.get_partial_message.assert_called_with(55)
        channel.send.assert_not_awaited()
        # La Bête se retire : l'annonce est modifiée et la marque Gangrel n'est demandée qu'aux Gangrel.
        note = await views.calm_beast(inter, panel, 'apaise')
        assert 'apaisée' in note and panel.frenzy is None
        assert 'retirée' in message.edit.await_args.kwargs['embed'].title
    asyncio.run(run())


def test_an_unreachable_scene_still_starts_the_frenzy(db):
    async def run():
        await seed(bp=3)
        panel = Panel(user_id=1, guild_id=2, clan='ventrue', frenzy=None, beast_marks=[])
        inter, _ = interaction()
        inter.guild.get_channel_or_thread = MagicMock(return_value=None)
        inter.guild.fetch_channel = AsyncMock(side_effect=views.discord.NotFound(MagicMock(status=404), 'x'))
        note = await views.unleash(inter, panel, 'terreur_feu', 77)
        assert 'annonce impossible' in note
        assert (await database.get_frenzy(1, 2))['channel_id'] == 77
    asyncio.run(run())


def test_declaring_the_beast_uses_the_panel_channel_without_any_link(db):
    async def run():
        from modules.vampire.views.panel import VampirePanel
        await seed(bp=3)
        inter, channel = interaction(channel_id=42)
        inter.response = SimpleNamespace(edit_message=AsyncMock(), send_modal=AsyncMock(), send_message=AsyncMock())

        async def pick(panel, trigger_id):
            select = views.TriggerSelect(panel)
            select._values = [trigger_id]
            await select.callback(inter)

        # Une cause ordinaire : le choix ravaler / céder s'affiche aussitôt, pour le salon du panneau.
        await pick(VampirePanel(1, 2, 42, 'ventrue', 12, 3), 'rage_blessure')
        choice = inter.response.edit_message.await_args.kwargs['view']
        assert isinstance(choice, views.ChoiceView) and (choice.channel_id, choice.cost) == (42, 3)
        inter.response.send_modal.assert_not_awaited()
        # Un pouvoir : seule la fenêtre du prix s'ouvre, sans lien à saisir.
        await pick(VampirePanel(1, 2, 42, 'ventrue', 12, 3), 'pouvoir_rage')
        modal = inter.response.send_modal.await_args.args[0]
        assert isinstance(modal, views.PowerPriceModal) and len(modal.children) == 1
        # À sec : la Faim éclate et s'annonce dans le salon du panneau.
        await database.set_vampire_soif(1, 2, 0)
        await pick(VampirePanel(1, 2, 42, 'ventrue', 0, 3), 'faim_zero')
        assert (await database.get_frenzy(1, 2))['channel_id'] == 42
        channel.send.assert_awaited_once()
    asyncio.run(run())


def test_panel_shows_the_frenzy_instead_of_the_compulsion(db):
    async def run():
        from modules.vampire.views.panel import VampirePanel
        dry = VampirePanel(1, 2, 3, 'gangrel', 0, 3, beast_marks=['Crocs trop longs'])
        names = [field.name for field in dry.create_embed().fields]
        assert '🩸 À sec' in names and '🐾 Marques de la Bête' in names
        assert dry.beast_button.label == "La Bête s'éveille"
        frenzy = {'frenzy_type': 'terreur', 'trigger_id': 'terreur_feu', 'channel_id': 42, 'message_id': None}
        raging = VampirePanel(1, 2, 3, 'ventrue', 3, 3, frenzy=frenzy)
        embed = raging.create_embed()
        assert any(field.name == '🔥 Frénésie — Terreur' for field in embed.fields)
        assert not any(field.name.startswith('📜 Compulsion') for field in embed.fields)
        assert raging.beast_button.label == 'La Bête se retire'
        fresh = raging.clone('note')
        assert (fresh.frenzy, fresh.note, raging.is_finished()) == (frenzy, 'note', True)
    asyncio.run(run())
