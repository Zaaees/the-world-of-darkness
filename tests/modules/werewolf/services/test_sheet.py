
import pytest
import discord
from unittest.mock import AsyncMock, MagicMock, PropertyMock
from modules.werewolf.services.sheet import sync_sheet_to_discord
from modules.werewolf.models.store import WerewolfData

@pytest.mark.asyncio
async def test_sync_sheet_to_discord_updates_thread_starter_message():
    """
    Test que la synchronisation met à jour le message initial du thread Discord.
    """
    # GIVEN
    mock_bot = AsyncMock()
    mock_thread = AsyncMock()
    mock_starter_message = AsyncMock()
    
    # Configuration du bot pour retourner le thread
    # Utilisation de spec pour passer le check isinstance
    mock_thread = AsyncMock(spec=discord.Thread)
    # mock_starter_message is already defined above? No, I defined it in previous tool call but let's be clean.
    # The previous tool call output showed I added a duplicate line.
    
    mock_bot.fetch_channel.return_value = mock_thread
    mock_thread.fetch_message.return_value = mock_starter_message
    # Mock starter_message property separately as it is not async?
    # discord.Thread.starter_message is a property, usually None if not cached.
    # In the code we access it as attribute.
    type(mock_thread).starter_message = PropertyMock(return_value=mock_starter_message)
    
    # Données de test
    character_data = WerewolfData(
        user_id="123456789",
        name="TestWolf",
        breed="lupus",
        auspice="ahroun",
        tribe="black_furies",
        story="Une nouvelle histoire mise à jour",
        discord_thread_id="999999999"
    )

    # Simulation d'un thread qui a un starter_message
    # Note: fetch_channel renvoie un Thread (si c'est un thread) ou un Channel.
    # Ici on assume que le bot fetch le THREAD directement via fetch_channel ou fetch_channel(forum).get_thread...
    # L'implémentation dira comment on récupère le thread. 
    # Souvent bot.fetch_channel(thread_id) renvoie le thread object.
    
    # WHEN
    await sync_sheet_to_discord(bot=mock_bot, character_data=character_data)

    # THEN
    # Verify we fetched the channel (thread)
    mock_bot.fetch_channel.assert_called_with(999999999)
    
    # Verify we fetched the starter message
    # En réalité c'est souvent mock_thread.starter_message ou fetch_message(id)
    # L'implementation devra gérer comment trouver le message à éditer.
    # Pour le test, on assume qu'on fetch le message initial. 
    # Mais le thread object a souvent une ref 'starter_message' si en cache, sinon faut le fetch.
    # Disons que l'implémentation doit trouver le message. 
    
    # Verifier que l'édition a eu lieu
    assert mock_starter_message.edit.called
    # Check content update - maybe strictly check arguments
    call_args = mock_starter_message.edit.call_args
    embed_arg = call_args.kwargs.get('embed')
    assert embed_arg is not None
    assert embed_arg.description == "Une nouvelle histoire mise à jour"
