
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from aiohttp import web
import json
from modules.werewolf.models.store import WerewolfData

@pytest.mark.asyncio
async def test_update_character_calls_sync():
    """
    Test que la mise à jour du personnage déclenche la synchronisation Discord.
    """
    # Import inside test to avoid early import errors affecting other tests if module is broken
    from modules.werewolf.routes import update_character_handler

    # Mock Request
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "111",
        "X-Discord-Guild-ID": "98765"
    }
    mock_request.json = AsyncMock(return_value={"story": "Updated story"})
    mock_request.app = MagicMock()
    mock_bot = AsyncMock() 
    mock_request.app.get = MagicMock(return_value=mock_bot) 

    # Mock Services
    mock_char = WerewolfData(
        user_id="111", 
        name="Test", 
        breed="X", 
        auspice="Y", 
        tribe="Z", 
        story="Updated story", 
        discord_thread_id="123"
    )
    
    # Old character for audit diff
    old_char = WerewolfData(
        user_id="111", 
        name="Test", 
        breed="X", 
        auspice="Y", 
        tribe="Z", 
        story="Old story", 
        discord_thread_id="123"
    )
    
    with patch('modules.werewolf.routes.get_character', new_callable=AsyncMock) as mock_get_char, \
         patch('modules.werewolf.routes.update_character', new_callable=AsyncMock) as mock_update, \
         patch('modules.werewolf.routes.sync_sheet_to_discord', new_callable=AsyncMock) as mock_sync, \
         patch('modules.werewolf.routes.calculate_diff', return_value=["story: Old -> New"]), \
         patch('modules.werewolf.routes.log_character_update', new_callable=AsyncMock), \
         patch('modules.werewolf.middleware.has_werewolf_role', return_value=True):
        
        mock_get_char.return_value = old_char
        mock_update.return_value = mock_char
        mock_sync.return_value = True

        response = await update_character_handler(mock_request)
        
        assert response.status == 200
        body = json.loads(response.body)
        
        # Verification
        assert body['success'] is True
        assert body.get('synced') is True
        
        mock_sync.assert_called_once_with(mock_bot, mock_char)

