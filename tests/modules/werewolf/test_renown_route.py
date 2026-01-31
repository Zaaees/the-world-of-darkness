import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from aiohttp import web

@pytest.mark.asyncio
async def test_get_my_renown_success():
    """
    Test que l'endpoint renvoie les hauts faits validés.
    """
    from modules.werewolf.routes import get_my_renown_handler
    
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
    
    # Mock DB Rows
    mock_rows = [
        {
            'title': "Validé 1", 
            'description': "Desc 1", 
            'renown_type': 'glory',
            'submitted_at': "2026-01-01T12:00:00",
            'xp_awarded': 1
        },
        {
            'title': "Validé 2", 
            'description': "Desc 2", 
            'renown_type': 'honor',
            'submitted_at': "2026-01-02T12:00:00",
            'xp_awarded': 2
        }
    ]
    
    # Patch dependencies
    # Note: We need to patch where they are imported/used in routes.py
    with patch('modules.werewolf.routes.aiosqlite.connect', new_callable=MagicMock) as mock_connect, \
         patch('modules.werewolf.middleware.has_werewolf_role', return_value=True):
         
        mock_db = MagicMock()
        mock_connect.return_value.__aenter__.return_value = mock_db
        
        mock_cursor = AsyncMock()
        mock_db.execute.return_value.__aenter__.return_value = mock_cursor
        
        # Need to handle row factory logic or return objects that support indexing/dict access
        # The route sets db.row_factory = aiosqlite.Row
        # The fetchall returns the rows.
        # We can simulate Row behavior by using dicts if the code accesses them as dicts (row['key'])
        # The code does row['key'].
        mock_cursor.fetchall.return_value = mock_rows
        
        # Execute
        response = await get_my_renown_handler(mock_request)
        
        assert response.status == 200
        import json
        data = json.loads(response.text)
        
        assert "results" in data
        assert len(data["results"]) == 2
        assert data["results"][0]["title"] == "Validé 1"
        assert data["results"][0]["validated_at"] == "2026-01-01T12:00:00"
        assert data["results"][0]["renown_type"] == "glory"

@pytest.mark.asyncio
async def test_get_my_renown_empty():
    """
    Test que l'endpoint renvoie une liste vide si aucun haut fait.
    """
    from modules.werewolf.routes import get_my_renown_handler
    
    mock_request = MagicMock(spec=web.Request)
    mock_request.headers = {
        "X-Discord-User-ID": "222",
        "X-Discord-Guild-ID": "98765"
    }
    
    with patch('modules.werewolf.routes.aiosqlite.connect', new_callable=MagicMock) as mock_connect, \
         patch('modules.werewolf.middleware.has_werewolf_role', return_value=True):
         
        mock_db = MagicMock()
        mock_connect.return_value.__aenter__.return_value = mock_db
        mock_cursor = AsyncMock()
        mock_db.execute.return_value.__aenter__.return_value = mock_cursor
        
        mock_cursor.fetchall.return_value = []
        
        response = await get_my_renown_handler(mock_request)
        
        assert response.status == 200
        import json
        data = json.loads(response.text)
        assert data["results"] == []
