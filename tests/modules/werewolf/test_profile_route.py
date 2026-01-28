
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from aiohttp import web
from modules.werewolf.models.store import WerewolfData

@pytest.mark.asyncio
async def test_get_werewolf_profile_success():
    """
    Test que l'endpoint profile retourne les infos correctes quand l'utilisateur a le rôle.
    """
    from modules.werewolf.routes import get_werewolf_profile_handler
    
    # Mock Request
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "111",
        "X-Discord-Guild-ID": "98765"
    }
    
    mock_app = MagicMock()
    mock_bot = AsyncMock()
    mock_app.get = MagicMock(return_value=mock_bot)
    mock_request.app = mock_app
    
    # Mock Character Data
    mock_char = WerewolfData(
        user_id="111", 
        name="Test Wolf", 
        breed="Homid", 
        auspice="Ahroun", 
        tribe="Silver Fangs", 
        story=""
    )
    
    # Patch dependencies
    with patch('modules.werewolf.routes.aiosqlite.connect', new_callable=MagicMock) as mock_connect, \
         patch('modules.werewolf.routes.get_character', new_callable=AsyncMock) as mock_get_char, \
         patch('modules.werewolf.middleware.has_werewolf_role', return_value=True): # Mock middleware check
         
        mock_db = AsyncMock()
        mock_connect.return_value.__aenter__.return_value = mock_db
        mock_get_char.return_value = mock_char
        

        # Execute
        response = await get_werewolf_profile_handler(mock_request)
        
        # Verify
        assert response.status == 200
        import json
        data = json.loads(response.text)
        assert data["success"] is True
        assert data["has_werewolf_role"] is True
        assert data["display_name"] == "Test Wolf"
        assert data["tribe"] == "Silver Fangs"

@pytest.mark.asyncio
async def test_get_werewolf_profile_no_character():
    """
    Test que l'endpoint retourne success=True mais character info null si pas encore de fiche.
    """
    from modules.werewolf.routes import get_werewolf_profile_handler
    
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "222",
        "X-Discord-Guild-ID": "98765"
    }
    
    mock_app = MagicMock()
    mock_bot = AsyncMock()
    mock_app.get = MagicMock(return_value=mock_bot)
    mock_request.app = mock_app
    
    with patch('modules.werewolf.routes.aiosqlite.connect', new_callable=MagicMock) as mock_connect, \
         patch('modules.werewolf.routes.get_character', new_callable=AsyncMock) as mock_get_char, \
         patch('modules.werewolf.middleware.has_werewolf_role', return_value=True):
         
        mock_db = AsyncMock()
        mock_connect.return_value.__aenter__.return_value = mock_db
        mock_get_char.return_value = None # Pas de perso encore
        
        response = await get_werewolf_profile_handler(mock_request)
        
        assert response.status == 200
        import json
        data = json.loads(response.text)
        assert data["success"] is True
        assert data["has_werewolf_role"] is True
        assert data["display_name"] is None
