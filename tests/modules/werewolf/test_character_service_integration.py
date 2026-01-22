import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import aiosqlite
from modules.werewolf.services.character_service import create_character
from modules.werewolf.models.store import create_werewolf_table, get_werewolf_data, WerewolfBreed, WerewolfAuspice, WerewolfTribe

@pytest.fixture
async def db_connection():
    async with aiosqlite.connect(":memory:") as db:
        await create_werewolf_table(db)
        yield db

@pytest.mark.asyncio
async def test_create_character_with_discord_integration(db_connection):
    """
    Test that create_character calls the discord service and updates the DB.
    """
    # Mock bot
    mock_bot = AsyncMock()
    
    # Mock character data
    character_data = {
        "name": "Integration Wolf",
        "breed": "Homid",
        "auspice": "Ahroun",
        "tribe": "Silver Fangs",
        "user_id": "999888777"
    }
    
    # Mock create_character_thread to return a fake thread ID
    # We patch correctly where it is imported in character_service
    # Note: imports inside function in character_service, so we patch module path
    with patch("modules.werewolf.services.discord.forum_service.create_character_thread", new_callable=AsyncMock) as mock_create_thread:
        fake_thread_id = "1453870972376584192" # Large ID test
        mock_create_thread.return_value = fake_thread_id
        
        # ACT
        created_char = await create_character(db_connection, character_data, bot=mock_bot)
        
        # ASSERT
        # 1. Verify character created
        assert created_char.name == "Integration Wolf"
        
        # 2. Verify discord service called
        mock_create_thread.assert_called_once()
        # Verify arguments passed to mock
        # args[0] is bot, args[1] is character object
        call_args = mock_create_thread.call_args
        assert call_args[0][0] == mock_bot
        assert call_args[0][1].name == "Integration Wolf"
        
        # 3. Verify DB updated with thread ID
        # The returned object should have it if it was fetched back
        assert created_char.discord_thread_id == fake_thread_id
        
        # Verify in DB directly
        stored_char = await get_werewolf_data(db_connection, character_data["user_id"])
        assert stored_char.discord_thread_id == fake_thread_id

@pytest.mark.asyncio
async def test_create_character_discord_failure_graceful(db_connection):
    """
    Test that if Discord fails, character is still created (graceful degradation).
    """
    mock_bot = AsyncMock()
    character_data = {
        "name": "Silent Wolf",
        "breed": "Lupus",
        "auspice": "Ragabash",
        "tribe": "Red Talons",
        "user_id": "111222333"
    }
    
    with patch("modules.werewolf.services.discord.forum_service.create_character_thread", new_callable=AsyncMock) as mock_create_thread:
        mock_create_thread.side_effect = Exception("Discord API Down")
        
        # ACT
        created_char = await create_character(db_connection, character_data, bot=mock_bot)
        
        # ASSERT
        # Character should still exist
        assert created_char.name == "Silent Wolf"
        # Thread ID should be None
        assert created_char.discord_thread_id is None
