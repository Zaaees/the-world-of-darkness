import pytest
import asyncio
from aiohttp import web
from unittest.mock import MagicMock, patch
import json

# Story 3.1: Page de Consultation de la Fiche
# AS A joueur Loup-Garou
# I WANT consulter ma fiche personnage sur une page dédiée
# SO THAT je puisse voir toutes mes informations narratives en un coup d'œil

class TestStory3_1_CharacterSheetAPI:

    @pytest.mark.asyncio
    async def test_get_character_data_api(self):
        """
        GIVEN an authenticated user with a character
        WHEN a GET request is made to /api/modules/werewolf/character
        THEN it should return 200 OK
        AND the response body should contain the character's full narrative profile
        """
        from modules.werewolf.routes import get_character_handler
        from modules.werewolf.models.store import WerewolfData
        
        # Mock request
        mock_request = MagicMock(spec=web.Request)
        mock_request.headers = {
            "X-Discord-User-ID": "123456789",
            "X-Discord-Guild-ID": "987654321"
        }
        
        # Mock the service/store to return character data
        mock_character = WerewolfData(
            user_id="123456789",
            name="Fenris",
            breed="Homid",
            auspice="Ahroun",
            tribe="Get of Fenris",
            story="Une longue histoire dans les bois...",
            rank=1
        )
        
        with patch('modules.werewolf.routes.get_character') as mock_get_char, \
             patch('modules.werewolf.middleware.has_werewolf_role') as mock_has_role:
            
            mock_get_char.return_value = mock_character
            mock_has_role.return_value = True
            
            # Execute
            response = await get_character_handler(mock_request)
            
            # Verify
            assert response.status == 200
            body = json.loads(response.body.decode('utf-8'))
            assert body['character']['name'] == "Fenris"
            assert body['character']['breed'] == "Homid"
            assert body['character']['auspice'] == "Ahroun"
            assert body['character']['tribe'] == "Get of Fenris"
            assert body['character']['story'] == "Une longue histoire dans les bois..."
            assert body['character']['rank'] == 1

    @pytest.mark.asyncio
    async def test_get_character_not_found(self):
        """
        GIVEN a user without a character
        WHEN a GET request is made to /api/modules/werewolf/character
        THEN it should return 404 Not Found
        """
        from modules.werewolf.routes import get_character_handler
        
        mock_request = MagicMock(spec=web.Request)
        mock_request.headers = {
            "X-Discord-User-ID": "999",
            "X-Discord-Guild-ID": "987654321"
        }
        
        with patch('modules.werewolf.routes.get_character') as mock_get_char, \
             patch('modules.werewolf.middleware.has_werewolf_role') as mock_has_role:
            
            mock_get_char.return_value = None
            mock_has_role.return_value = True
            
            response = await get_character_handler(mock_request)
            
            assert response.status == 404
            body = json.loads(response.body.decode('utf-8'))
            assert "found" in body['error'].lower()
