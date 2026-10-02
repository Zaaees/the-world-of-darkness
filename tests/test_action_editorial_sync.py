"""Editorial changes reach server-side action messages without changing game rules."""
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import discord

from data.blood_actions import get_action_by_id
from modules.content.api import initialize, put_content
from modules.vampire.api import submit_action_handler
from tests.test_site_content import Request
from utils import database
from utils.site_content import CATALOG_KEYS, action_display
from views.blood_action_validation import send_validation_request, refresh_action_fields
from cogs.blood_actions import BloodActionsCog


def test_action_text_is_live_scoped_and_preserves_rules(tmp_path):
    async def run():
        app = {'content_db_path': str(tmp_path / 'content.db')}
        await initialize(app)
        original = get_action_by_id('vitae_first_beast')
        replacements = {
            original['name']: 'La Bête frappe à votre porte',
            original['description']: 'Une description révisée.',
            original['hints'][0]: 'Une piste révisée.',
        }
        for source, value in replacements.items():
            key = CATALOG_KEYS['vampire', source]
            assert (await put_content(Request(app, key=key, value=value))).status == 200
        edited = await action_display(original, 2, app['content_db_path'])
        assert edited['name'] == replacements[original['name']]
        assert edited['description'] == 'Une description révisée.'
        assert edited['hints'] == ['Une piste révisée.']
        for field in original.keys() - {'name', 'description', 'hints'}:
            assert edited[field] == original[field]
        assert await action_display(original, 3, app['content_db_path']) == original
        assert get_action_by_id(original['id'])['name'] == 'La Bête à votre porte'
        key = CATALOG_KEYS['vampire', original['description']]
        await put_content(Request(app, key=key, value='Encore modifiée.', revision=1))
        assert (await action_display(original, 2, app['content_db_path']))['description'] == 'Encore modifiée.'
    asyncio.run(run())


def test_discord_and_submission_use_saved_text(tmp_path, monkeypatch):
    async def run():
        app = {'content_db_path': str(tmp_path / 'content.db')}
        monkeypatch.setattr(database, 'DATABASE_PATH', app['content_db_path'])
        await initialize(app)
        original = get_action_by_id('vitae_first_beast')
        for source, value in ((original['name'], 'La Bête frappe à votre porte'),
                              (original['description'], 'Description modifiée'),
                              (original['hints'][0], 'Piste modifiée')):
            await put_content(Request(app, key=CATALOG_KEYS['vampire', source], value=value))
        channel = SimpleNamespace(send=AsyncMock(return_value=SimpleNamespace(id=99)))
        member = SimpleNamespace(mention='<@1>', display_name='Joueur', display_avatar=SimpleNamespace(url='https://example.com/avatar.png'))
        guild = SimpleNamespace(get_channel=lambda _: channel, get_member=lambda _: member)
        bot = SimpleNamespace(get_guild=lambda _: guild)
        with patch('views.blood_action_validation.get_player', AsyncMock(return_value={'clan': 'brujah'})), \
             patch('views.blood_action_validation.get_vampire_data', AsyncMock(return_value={'blood_potency': 1})), \
             patch('views.blood_action_validation.update_pending_action_message', AsyncMock()):
            assert await send_validation_request(bot, 2, 1, 'submission', original['id'],
                'Ancien nom', 'Ancienne description', 3, 'unique')
        embed = channel.send.call_args.kwargs['embed']
        assert 'La Bête frappe à votre porte' in embed.fields[3].value
        assert 'Description modifiée' in embed.fields[3].value
        assert embed.fields[4].value == '• Piste modifiée'
        assert embed.footer.text == 'ID: submission'
        old_embed = discord.Embed()
        old_embed.add_field(name='Action', value='Ancien nom')
        await refresh_action_fields(old_embed, original['id'], 2)
        assert 'Description modifiée' in old_embed.fields[0].value
        assert old_embed.fields[1].value == '• Piste modifiée'

        class Submission(dict):
            async def json(self):
                return {'actionId': original['id'], 'sceneLink': 'https://discord.com/channels/2/3/4'}
        request = Submission(verified_user_id=1, verified_guild_id=2)
        request.app = app
        remote = AsyncMock(side_effect=[{'character': {'clan': 'brujah', 'bloodPotency': 1}}, {'success': True}])
        with patch('modules.vampire.api.sheets_request', remote):
            assert (await submit_action_handler(request)).status == 202
        assert remote.call_args.kwargs['actionName'] == 'La Bête frappe à votre porte'
        assert remote.call_args.kwargs['points'] == 3
    asyncio.run(run())


def test_existing_pending_messages_refresh_once_per_change():
    async def run():
        embed = discord.Embed()
        embed.add_field(name='Action', value='Ancien texte')
        embed.set_footer(text='ID: submission')
        message = SimpleNamespace(embeds=[embed], edit=AsyncMock())
        channel = SimpleNamespace(fetch_message=AsyncMock(return_value=message))
        guild = SimpleNamespace(id=2, get_channel=lambda _: channel)
        cog = object.__new__(BloodActionsCog)
        cog.bot = SimpleNamespace(guilds=[guild])
        cog._content_values = {}
        pending = {'message_id': 99, 'submission_id': 'submission', 'action_id': 'vitae_first_beast'}
        async def refresh(embed, action_id, guild_id):
            embed.set_field_at(0, name='Action', value='Texte révisé')
        with patch('cogs.blood_actions.catalog_values', AsyncMock(return_value={'key': 'Texte révisé'})), \
             patch('cogs.blood_actions.get_all_pending_actions', AsyncMock(return_value=[pending])), \
             patch('cogs.blood_actions.get_pending_action', AsyncMock(return_value={'status': 'pending'})), \
             patch('cogs.blood_actions.refresh_action_fields', refresh):
            await cog._refresh_pending_action_texts()
            await cog._refresh_pending_action_texts()
        message.edit.assert_awaited_once()
        assert message.edit.call_args.kwargs['embed'].fields[0].value == 'Texte révisé'
        assert message.edit.call_args.kwargs['embed'].footer.text == 'ID: submission'
        assert set(message.edit.call_args.kwargs) == {'embed'}
        assert channel.fetch_message.await_count == 1
    asyncio.run(run())
