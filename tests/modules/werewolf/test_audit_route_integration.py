
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from aiohttp import web
import json
from modules.werewolf.models.store import WerewolfData

@pytest.mark.asyncio
async def test_update_character_calls_audit_log():
    """
    Test que la mise à jour du personnage déclenche le logging d'audit.
    """
    # Import inside test
    from modules.werewolf.routes import update_character_handler

    # Mock Request
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "111",
        "X-Discord-Guild-ID": "98765"
    }
    mock_request.json = AsyncMock(return_value={"story": "Updated story for audit"})
    mock_request.app = MagicMock()
    mock_bot = AsyncMock() 
    mock_request.app.get = MagicMock(return_value=mock_bot) 
    mock_bot.get_channel = MagicMock() # For audit log

    # Mock Data
    old_char = WerewolfData(
        user_id="111", name="Test", breed="Homid", auspice="Ahroun", tribe="Black Furies", story="Old story"
    )
    new_char = WerewolfData(
        user_id="111", name="Test", breed="Homid", auspice="Ahroun", tribe="Black Furies", story="Updated story for audit"
    )
    
    # Patch dependencies
    # We need to control the 'get_character' (before update) and 'update_character' (after update)
    # But routes.py calls update_character directly.
    # To properly test the DIFF, we need the route to fetch the OLD character first.
    # Current routes.py implementation:
    #   character = await update_character(db, user_id, updates)
    # It does NOT fetch the old character explicitely in the route, 
    # but the audit requirement says: "Récupérer l'état AVANT modification de la DB"
    
    # So we expect the route implementation to change to:
    # 1. Get old char
    # 2. Update char
    # 3. Calculate diff
    # 4. Log
    
    with patch('modules.werewolf.routes.aiosqlite.connect', new_callable=MagicMock) as mock_connect, \
         patch('modules.werewolf.routes.get_character', new_callable=AsyncMock) as mock_get_char, \
         patch('modules.werewolf.routes.update_character', new_callable=AsyncMock) as mock_update_char, \
         patch('modules.werewolf.routes.sync_sheet_to_discord', new_callable=AsyncMock) as mock_sync, \
         patch('modules.werewolf.routes.log_character_update', new_callable=AsyncMock) as mock_audit, \
         patch('modules.werewolf.routes.calculate_diff', side_effect=lambda o, n: ["story: Old -> New"]) as mock_diff, \
         patch('modules.werewolf.middleware.has_werewolf_role', return_value=True):
        
        # Setup mocks
        mock_db = AsyncMock()
        mock_connect.return_value.__aenter__.return_value = mock_db
        
        # Scenario:
        # First call to get_character (before update) -> returns old_char
        # Call to update_character -> returns new_char
        # (Optional: second call to get_character might happen inside update_character or after, but we mock the result of update_character)
        
        # We need to make sure the route calls get_character BEFORE update to pass it to diff.
        # But wait, `update_character` service returns the *updated* character. 
        # So the route needs to call `get_character` *before* calling `update_character`.
        
        mock_get_char.return_value = old_char
        mock_update_char.return_value = new_char
        
        # Fix AsyncMock serialization error: sync_sheet_to_discord needs to return a bool
        mock_sync.return_value = True

        # Execute
        response = await update_character_handler(mock_request)
        
        # Verify
        assert response.status == 200
        
        # Assert Audit called
        # calculate_diff should be called with (old_char, new_char)
        # log_character_update should be called with (bot, user, new_char, changes)
        
        mock_get_char.assert_called() # Should be called at least once to get 'old' state
        
        # Ensure log_character_update was scheduled/awaited
        # Note: Task says "Appeler log_character_update en tâche de fond (background_tasks ou asyncio.create_task)"
        # If it is a background task, we might need to wait or mock create_task?
        # For simplicity in testing async views, if we just await it in route for now (or fire and forget), 
        # we can check if it was called.
        # If the implementation uses asyncio.create_task, simple patch might miss it if we don't await the task?
        # Actually asyncio.create_task schedules it on the loop. The mock should register the call immediately.
        
        mock_audit.assert_called_once()
        args, _ = mock_audit.call_args
        # args: (bot, user_mock, character_data, changes)
        # We don't have a real user object in this mock request test easily accessible unless we mock the fetch of user?
        # The route gets user_id from header. It doesn't fetch a Discord User object currently?
        # Wait, the audit log requires a User object (name, id).
        # The route currently only has user_id string.
        # So the route MUST also fetch the User object from the bot to pass it to the logging service.
        
        assert args[2] == new_char # Character data
        assert args[3] == ["story: Old -> New"] # Changes
