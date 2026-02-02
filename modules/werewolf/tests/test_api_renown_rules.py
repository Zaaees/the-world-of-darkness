import pytest
from aiohttp import web
from modules.werewolf.routes import get_renown_rules_handler
from modules.werewolf.models.store import WerewolfAuspice
from unittest.mock import MagicMock, AsyncMock, patch

@pytest.mark.asyncio
async def test_get_renown_rules_handler_success():
    # Setup
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "12345",
        "X-Discord-Guild-ID": "987654321" 
    }
    
    # Mock DB Context Manager
    mock_db = AsyncMock()
    mock_conn = AsyncMock()
    mock_conn.__aenter__.return_value = mock_db
    mock_conn.__aexit__.return_value = None
    
    # Mock data
    mock_character = MagicMock()
    mock_character.auspice = WerewolfAuspice.AHROUN
    mock_character.rank = 2
    
    # Mock RenownService
    mock_totals = {"glory": 5, "honor": 2, "wisdom": 1}
    
    with patch("modules.werewolf.routes.aiosqlite.connect", return_value=mock_conn):
        with patch("modules.werewolf.routes.get_character", new_callable=AsyncMock) as mock_get_char:
            mock_get_char.return_value = mock_character
            
            with patch("modules.werewolf.routes.RenownService") as MockServiceClass:
                mock_service_instance = MockServiceClass.return_value
                mock_service_instance.get_player_renown_totals = AsyncMock(return_value=mock_totals)
                
                # Mock Auth Middleware Check
                with patch("modules.werewolf.middleware.has_werewolf_role", new_callable=AsyncMock) as mock_auth:
                    mock_auth.return_value = True

                    # Execute
                    response = await get_renown_rules_handler(mock_request)
                    
                    # Verify
                    assert response.status == 200
                    import json
                    data = json.loads(response.text)
                    
                    assert data["success"] is True
                    assert data["my_auspice"] == "Ahroun"
                    assert data["my_rank"] == 2
                    assert data["my_stats"] == mock_totals
                    
                    # Check rules presence
                    assert "rules" in data
                    assert "Ahroun" in data["rules"]
                    assert data["rules"]["Ahroun"]["1"] == {"glory": 2, "honor": 1, "wisdom": 0}

@pytest.mark.asyncio
async def test_get_renown_rules_handler_missing_character():
    # Setup
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "999",
        "X-Discord-Guild-ID": "987654321"
    }
    
    mock_db = AsyncMock()
    mock_conn = AsyncMock()
    mock_conn.__aenter__.return_value = mock_db
    mock_conn.__aexit__.return_value = None
    
    with patch("modules.werewolf.routes.aiosqlite.connect", return_value=mock_conn):
        with patch("modules.werewolf.routes.get_character", new_callable=AsyncMock) as mock_get_char:
            mock_get_char.return_value = None # No character found
            
            with patch("modules.werewolf.middleware.has_werewolf_role", new_callable=AsyncMock) as mock_auth:
                mock_auth.return_value = True
                
                response = await get_renown_rules_handler(mock_request)
                assert response.status == 404
