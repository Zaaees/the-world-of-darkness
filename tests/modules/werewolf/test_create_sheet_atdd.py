import pytest
import asyncio
from datetime import datetime

# Story 2.4: Création de la Fiche en Base de Données
# AS A joueur
# I WANT que mes choix soient sauvegardés à la validation du formulaire
# SO THAT ma fiche soit créée et je puisse y accéder ultérieurement

# Mocking the service layer or expecting it to exist
# Since we don't have the full app running, we'll test the Service function signature and behavior
# assuming a 'WerewolfService' class will be created.

class TestStory2_4_CharacterCreation:

    @pytest.mark.asyncio
    async def test_create_character_persistence(self):
        """
        GIVEN valid character data (breed, auspice, tribe, name)
        WHEN the creation service is called
        THEN a new record should be inserted into the database
        AND the returned object should have an ID
        """
        # data = DTO
        character_data = {
            "user_id": 123456789,
            "name": "Fenris",
            "breed": "Homid",
            "auspice": "Ahroun",
            "tribe": "Get of Fenris"
        }
        
        # Expecting module to import
        try:
            from modules.werewolf.services.character_service import create_character
        except ImportError:
            pytest.fail("Module 'modules.werewolf.services.character_service' not found")

        # Setup DB
        import aiosqlite
        from modules.werewolf.models.store import create_werewolf_table
        
        async with aiosqlite.connect(":memory:") as db:
            await create_werewolf_table(db)
            
            # Calling service
            result = await create_character(db, character_data)

        
        # Verifications
        assert result is not None
        assert result.user_id == character_data["user_id"]
        assert result.name == character_data["name"]
        # Immutability Check implicit in Story 2.1, but here we check persistence
        assert hasattr(result, "created_at")

    @pytest.mark.asyncio
    async def test_create_character_api_handler(self):
        """
        GIVEN a valid POST request to /api/modules/werewolf/character
        WHEN the handler is invoked
        THEN it should return 201 Created
        AND the response should contain the redirect URL
        """
        from aiohttp import web
        from unittest.mock import MagicMock, patch
        from modules.werewolf.routes import create_character_handler
        
        # Mock request
        mock_request = MagicMock(spec=web.Request)
        mock_request.headers = {"X-Discord-User-ID": "123456789"}
        
        # Async mock for json()
        async def mock_json():
            return {
                "name": "Fenris",
                "breed": "Homid",
                "auspice": "Ahroun",
                "tribe": "Get of Fenris"
            }
        mock_request.json = mock_json
        
        # Mock the service to avoid DB dependency in this API test
        with patch('modules.werewolf.routes.create_character') as mock_service:
            # Mock return value of service
            mock_char = MagicMock()
            mock_char.name = "Fenris"
            # Enum handling mocks
            mock_char.breed.value = "Homid"
            mock_char.auspice.value = "Ahroun"
            mock_char.tribe.value = "Get of Fenris"
            
            mock_service.return_value = mock_char
            
            # Mock aiosqlite.connect to return a context manager
            # We need to mock the async context manager flow of aiosqlite.connect
            with patch('modules.werewolf.routes.aiosqlite.connect') as mock_connect:
                mock_db = MagicMock()
                mock_ctx = MagicMock()
                mock_ctx.__aenter__.return_value = mock_db
                mock_ctx.__aexit__.return_value = None
                mock_connect.return_value = mock_ctx
                
                # Execute
                response = await create_character_handler(mock_request)
                
                # Verify
                assert response.status == 201
                body = import_json().loads(response.body)
                assert body['success'] is True
                assert body['redirect'] == "/werewolf/sheet"
                assert "Bienvenue" in body['message']

def import_json():
    import json
    return json
