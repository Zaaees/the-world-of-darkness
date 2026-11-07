"""!reset cancels the player's pending Vitae requests. Temporary database, no Discord."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

from utils import database


@pytest.fixture
def db(tmp_path, monkeypatch):
    monkeypatch.setattr(database, 'DATABASE_PATH', tmp_path / 'game.db')

    async def setup():
        await database.init_database()
        await database.init_blood_actions_tables()
    asyncio.run(setup())


async def submit(user_id, submission_id):
    return await database.create_pending_action(
        user_id=user_id, guild_id=2, action_id=f'action_{submission_id}', action_name='Premier meurtre',
        category='unique', points=3, submission_id=submission_id)


def test_delete_pending_actions_only_touches_that_player(db):
    async def run():
        await submit(1, 'a')
        await submit(1, 'b')
        await database.update_pending_action_message('b', 99)
        await submit(3, 'c')
        removed = await database.delete_pending_actions(1, 2)
        assert {row['submission_id'] for row in removed} == {'a', 'b'}
        assert next(row for row in removed if row['submission_id'] == 'b')['message_id'] == 99
        assert await database.get_pending_actions(1, 2) == []
        assert [row['submission_id'] for row in await database.get_pending_actions(3, 2)] == ['c']
        assert await database.get_pending_action('a') is None
    asyncio.run(run())


def test_reset_command_cancels_pending_requests_and_their_messages():
    from cogs.general import GeneralCog

    message = SimpleNamespace(edit=AsyncMock())
    channel = SimpleNamespace(fetch_message=AsyncMock(return_value=message))
    guild = SimpleNamespace(id=2, roles=[], get_role=lambda _: None, get_channel=lambda _: channel)
    ctx = SimpleNamespace(guild=guild, author=SimpleNamespace(id=7), send=AsyncMock())
    member = SimpleNamespace(id=1, roles=[], display_name='Theo')
    pending = AsyncMock(return_value=[{'submission_id': 'a', 'message_id': 99}, {'submission_id': 'b', 'message_id': None}])
    patches = [patch(f'cogs.general.{name}', AsyncMock()) for name in (
        'get_player', 'delete_discord_sheet', 'delete_player_rituals', 'delete_player', 'delete_google_sheet_character')]
    patches += [patch('cogs.general.delete_pending_actions', pending),
                patch('modules.werewolf.models.store.get_werewolf_data', AsyncMock(return_value=None)),
                patch('modules.werewolf.models.store.delete_werewolf_data', AsyncMock(return_value=False)),
                patch('aiosqlite.connect')]
    for p in patches:
        p.start()
    try:
        asyncio.run(GeneralCog.reset_command.callback(GeneralCog(SimpleNamespace()), ctx, member))
    finally:
        for p in patches:
            p.stop()
    pending.assert_awaited_once_with(1, 2)
    channel.fetch_message.assert_awaited_once_with(99)
    assert message.edit.await_args.kwargs['view'] is None
    assert 'annulées : 2' in ctx.send.await_args.kwargs['embed'].description
