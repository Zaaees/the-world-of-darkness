import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
import sys
import os

# Add local directory to sys.path
sys.path.insert(0, os.getcwd())

async def bug_repro():
    print("Starting reproduction...")
    try:
        from modules.werewolf.services.character_service import create_character
        print("Imported create_character")
    except ImportError as e:
        print(f"ImportError: {e}")
        return

    character_data = {
        "name": "Luna's Claw",
        "breed": "Homid",
        "auspice": "Theurge",
        "tribe": "Silver Fangs",
        "user_id": 123
    }

    mock_db = AsyncMock()
    mock_bot = MagicMock()
    
    print("Setting up patches...")
    # Patch targets based on latest analysis
    with patch('modules.werewolf.services.character_service.create_werewolf_data', new_callable=AsyncMock) as mock_create_db, \
         patch('modules.werewolf.models.store.update_werewolf_data', new_callable=AsyncMock) as mock_update_db, \
         patch('modules.werewolf.services.character_service.get_werewolf_data', new_callable=AsyncMock) as mock_get_db, \
         patch('modules.werewolf.services.discord.forum_service.create_character_thread', new_callable=AsyncMock) as mock_create_thread:
        
        mock_create_thread.return_value = "1462941781761986732"
        mock_get_db.return_value = MagicMock()

        print("Calling create_character...")
        try:
            await create_character(mock_db, character_data, bot=mock_bot)
            print("create_character finished")
        except Exception as e:
            print(f"create_character raised: {e}")
            import traceback
            traceback.print_exc()

        print("Verifying calls...")
        try:
            mock_create_thread.assert_called_once()
            print("mock_create_thread called: OK")
        except AssertionError as e:
            print(f"mock_create_thread failed: {e}")
            print(f"Calls: {mock_create_thread.call_args_list}")

        try:
            mock_update_db.assert_called_once_with(mock_db, "123", {"discord_thread_id": "1462941781761986732"})
            print("mock_update_db called: OK")
        except AssertionError as e:
            print(f"mock_update_db failed: {e}")
            print(f"Calls: {mock_update_db.call_args_list}")

    print("\n--- Testing test_publish_to_forum logic ---")
    try:
        from modules.werewolf.services.discord.forum_service import create_character_thread
        from modules.werewolf.models.store import WerewolfData
        
        c_data = WerewolfData(
            user_id="123",
            name="Luna's Claw",
            breed="Homid",
            auspice="Theurge",
            tribe="Silver Fangs"
        )
        # Mock bot for this test
        m_bot = MagicMock()
        m_chan = AsyncMock()
        m_thread = AsyncMock()
        m_thread.id = 999999999 # Int ID from discord
        
        m_bot.fetch_channel = AsyncMock(return_value=m_chan)
        m_chan.create_thread.return_value = m_thread
        
        # Call
        tid = await create_character_thread(m_bot, c_data)
        
        if tid == "999999999":
             print("test_publish_to_forum: PASS (id is string '999999999')")
        else:
             print(f"test_publish_to_forum: FAIL. Got {tid} expected '999999999'")

    except Exception as e:
        print(f"test_publish_to_forum raised: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(bug_repro())
