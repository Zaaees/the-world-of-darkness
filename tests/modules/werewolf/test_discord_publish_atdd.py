import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

# Story 2.5: Publication Automatique sur le Forum Discord
# AS A joueur
# I WANT que ma fiche soit automatiquement postée sur Discord à sa création
# SO THAT les autres membres puissent la découvrir

# Mocking the Discord Interaction
# Assumption: A 'ForumService' or 'DiscordService' handles this

class TestStory2_5_DiscordPublication:
    
    @pytest.mark.asyncio
    async def test_publish_to_forum(self):
        """
        GIVEN character data and a configured Discord Forum Channel ID
        WHEN the publication service is called
        THEN a new thread should be created in the correct channel
        AND the thread ID should be returned
        """
        from modules.werewolf.models.store import WerewolfData
        
        character_data = WerewolfData(
            user_id="123", # Ensure string as per model likely
            name="Luna's Claw",
            breed="Homid",
            auspice="Theurge",
            tribe="Silver Fangs"
        )
        forum_channel_id = 1462941781761986732
        
        # Mocking the Bot/Client
        mock_bot = MagicMock()
        mock_channel = AsyncMock()
        mock_thread = AsyncMock()
        mock_thread.id = 999999999
        
        mock_bot.fetch_channel = AsyncMock(return_value=mock_channel)
        mock_channel.create_thread.return_value = mock_thread
        
        # We need to test the logic that uses this bot
        # Assuming we can inject the bot or path it
        
        try:
            from modules.werewolf.services.discord.forum_service import create_character_thread
        except ImportError:
            pytest.fail("Module 'modules.werewolf.services.discord.forum_service' not found")

        # Mock patch where the service gets the bot instance
        # For this test, we might pass the bot explicitly or patch the getter
        # Assuming the function signature: create_character_thread(bot, character_data)
        
        thread_id = await create_character_thread(mock_bot, character_data)
        
        # Verification
        mock_bot.fetch_channel.assert_called_with(forum_channel_id)
        mock_channel.create_thread.assert_called_once()
        
        # Check arguments (name=character_name, etc.)
        call_args = mock_channel.create_thread.call_args
        assert call_args is not None
        assert call_args.kwargs.get('name') == "Luna's Claw"
        # Content verification - check embed fields
        embed = call_args.kwargs.get('embed')
        assert embed is not None
        # Check that the tribe (Silver Fangs) appears in one of the embed fields
        field_values = [field.value for field in embed.fields]
        assert "Silver Fangs" in field_values, f"Expected 'Silver Fangs' in embed fields, got {field_values}"
        
        assert thread_id == "999999999"

    @pytest.mark.asyncio
    async def test_save_thread_id(self):
        """
        GIVEN a newly created thread ID
        WHEN the process completes
        THEN the thread ID should be updated in the database for that character
        """
        # Data setup
        character_data = {
            "name": "Luna's Claw",
            "breed": "Homid",
            "auspice": "Theurge",
            "tribe": "Silver Fangs",
            "user_id": 123
        }
        
        # Mock dependencies
        mock_db = AsyncMock()
        mock_bot = MagicMock()
        mock_channel = AsyncMock()
        mock_thread = AsyncMock()
        mock_thread.id = 1462941781761986732
        
        mock_bot.get_channel.return_value = mock_channel
        mock_channel.create_thread.return_value = mock_thread
        
        # We need to mock create_werewolf_data, update_werewolf_data AND get_werewolf_data
        # since create_character calls them all.
        
        # Note on Patching:
        # create_werewolf_data and get_werewolf_data are imported at TOP LEVEL in character_service.
        # So we must patch them WHERE THEY ARE USED (in character_service namespace).
        #
        # update_werewolf_data and create_character_thread are imported LOCALLY inside the function.
        # So we must patch them WHERE THEY ARE DEFINED (source modules).
        
        with patch('modules.werewolf.services.character_service.create_werewolf_data', new_callable=AsyncMock) as mock_create_db, \
             patch('modules.werewolf.models.store.update_werewolf_data', new_callable=AsyncMock) as mock_update_db, \
             patch('modules.werewolf.services.character_service.get_werewolf_data', new_callable=AsyncMock) as mock_get_db, \
             patch('modules.werewolf.services.discord.forum_service.create_character_thread', new_callable=AsyncMock) as mock_create_thread:
            
            # Setup returns
            mock_create_thread.return_value = "1462941781761986732"
            mock_get_db.return_value = MagicMock() # Return something not None so it doesn't raise RuntimeError
            
            from modules.werewolf.services.character_service import create_character
            
            # Execute
            await create_character(mock_db, character_data, bot=mock_bot)
            
            # Verify
            mock_create_thread.assert_called_once()
            mock_update_db.assert_called_once_with(mock_db, "123", {"discord_thread_id": "1462941781761986732"})
