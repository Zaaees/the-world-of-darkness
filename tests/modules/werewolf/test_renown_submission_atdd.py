# tests/modules/werewolf/test_renown_submission_atdd.py
"""
ATDD Tests for Epic 4, Story 4.2: Formulaire de Soumission de Haut Fait

As a joueur,
I want soumettre un Haut Fait pour validation,
So that mes accomplissements narratifs soient reconnus.

Acceptance Criteria:
- Given un joueur sur sa fiche
- When il clique sur "Ajouter un Haut Fait"
- Then un modal s'ouvre avec: Champ Titre, Champ Description, Sélecteur Type (Gloire/Honneur/Sagesse)
- And à la soumission, le statut est "En attente"
- And un toast confirme "Envoyé aux Esprits (MJ)"

These tests are in RED phase - they will FAIL until the API route is implemented.
"""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch


class TestStory4_2_RenownSubmissionAPI:
    """Tests for Story 4.2: API de Soumission de Haut Fait"""

    @pytest.mark.asyncio
    async def test_submit_renown_request_api_creates_pending_entry(self):
        """
        GIVEN un joueur authentifié avec une fiche Werewolf
        WHEN il soumet un Haut Fait via POST /api/modules/werewolf/renown/submit
        THEN une entrée est créée dans werewolf_renown avec status='pending'
        AND la réponse contient l'entrée créée avec id
        
        RED PHASE: Will fail until API route is implemented
        """
        try:
            from modules.werewolf.views.api_routes import submit_renown_request
        except ImportError:
            pytest.fail(
                "Function 'submit_renown_request' not found in modules.werewolf.views.api_routes. "
                "Create the API route handler for POST /api/modules/werewolf/renown/submit"
            )
        
        # Mock request data
        request_data = {
            "title": "Premier Combat Victorieux",
            "description": "A vaincu un fomor seul lors de son Premier Changement",
            "renown_type": "Glory"
        }
        
        # Mock authenticated user
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value=request_data)
        mock_request.user_id = None # Not authenticated by default? Wait, test says authenticated.
        # But this test checks creation, so verify_vampire_auth will run.
        # The route uses request.get('user') for user object.
        mock_request.get.return_value = {"id": "123456789"} # Mock user object
        
        # Mock valid headers for auth middleware if it was running, 
        # but here we are calling handler directly, we mock what handler expects.
        # The handler does: user = request.get('user')
        # So we mock request.get to return user dict.
        
        # Fix: handler signature is submit_renown_request(request).
        # It calls `db = request.app['db']`.
        
        async def async_execute(*args, **kwargs):
             cursor_mock = MagicMock()
             cursor_mock.lastrowid = 1
             return cursor_mock
             
        mock_request.app = {'db': MagicMock()}
        mock_request.app['db'].execute = AsyncMock(side_effect=async_execute)
        mock_request.app['db'].commit = AsyncMock()
        
        # Call the handler with patched create_renown_table
        with patch('modules.werewolf.views.api_routes.create_renown_table', new_callable=AsyncMock):
            response = await submit_renown_request(mock_request)
        
        # Assertions
        assert response.status == 201, (
            f"Expected 201 Created, got {response.status}"
        )
        
        response_data = json.loads(response.body)
        assert "id" in response_data, "Response should contain created entry ID"
        assert response_data["status"] == "pending", (
            f"Status should be 'pending', got '{response_data.get('status')}'"
        )
        assert response_data["title"] == request_data["title"]
        assert response_data["renown_type"] == request_data["renown_type"].lower()

    @pytest.mark.asyncio
    async def test_submit_renown_request_requires_title_and_description(self):
        """
        GIVEN une requête sans titre ou description
        WHEN je soumets via POST /api/modules/werewolf/renown/submit
        THEN l'API retourne 400 Bad Request avec message d'erreur clair
        
        RED PHASE: Will fail until validation is implemented
        """
        try:
            from modules.werewolf.views.api_routes import submit_renown_request
        except ImportError:
            pytest.fail("API route handler not found")
        
        # Test missing title
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value={
            "description": "Test description",
            "renown_type": "Glory"
        })
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value={
            "description": "Test description",
            "renown_type": "Glory"
        })
        mock_request.get.return_value = {"id": "123456789"} # Authenticated
        mock_request.app = {'db': MagicMock()}

        
        with patch('modules.werewolf.views.api_routes.create_renown_table', new_callable=AsyncMock):
            response = await submit_renown_request(mock_request)
        
        assert response.status == 400, (
            "Should return 400 when title is missing"
        )
        
        error_data = json.loads(response.body)
        assert "titre" in str(error_data).lower(), (
            f"Error message should mention missing 'title' field, got: {error_data}"
        )

    @pytest.mark.asyncio
    async def test_submit_renown_request_requires_valid_renown_type(self):
        """
        GIVEN une requête avec un renown_type invalide
        WHEN je soumets via POST /api/modules/werewolf/renown/submit
        THEN l'API retourne 400 Bad Request
        
        RED PHASE: Will fail until type validation is implemented
        """
        try:
            from modules.werewolf.views.api_routes import submit_renown_request
        except ImportError:
            pytest.fail("API route handler not found")
        
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value={
            "title": "Test Title",
            "description": "Test Description",
            "renown_type": "InvalidType"  # Not Glory/Honor/Wisdom
        })
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value={
            "title": "Test Title",
            "description": "Test Description",
            "renown_type": "InvalidType"  # Not Glory/Honor/Wisdom
        })
        mock_request.get.return_value = {"id": "123456789"} # Authenticated
        mock_request.app = {'db': MagicMock()}
        
        with patch('modules.werewolf.views.api_routes.create_renown_table', new_callable=AsyncMock):
            response = await submit_renown_request(mock_request)
        
        assert response.status == 400, (
            "Should return 400 for invalid renown_type"
        )
        
        error_data = json.loads(response.body)
        assert "renown_type" in str(error_data).lower() or "type" in str(error_data).lower(), (
            "Error message should mention invalid renown type"
        )

    @pytest.mark.asyncio
    async def test_submit_renown_request_requires_authentication(self):
        """
        GIVEN un utilisateur non authentifié
        WHEN il tente de soumettre un Haut Fait
        THEN l'API retourne 401 Unauthorized
        
        RED PHASE: Will fail until auth check is implemented
        """
        try:
            from modules.werewolf.views.api_routes import submit_renown_request
        except ImportError:
            pytest.fail("API route handler not found")
        
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value={
            "title": "Test",
            "description": "Test",
            "renown_type": "Glory"
        })
        mock_request = MagicMock()
        mock_request.json = AsyncMock(return_value={
            "title": "Test",
            "description": "Test",
            "renown_type": "Glory"
        })
        mock_request.get.return_value = None # Not authenticated
        mock_request.app = {'db': MagicMock()}
        
        with patch('modules.werewolf.views.api_routes.create_renown_table', new_callable=AsyncMock):
            response = await submit_renown_request(mock_request)
        
        assert response.status == 401, (
            "Should return 401 for unauthenticated requests"
        )

    @pytest.mark.asyncio
    async def test_submit_renown_persists_to_database(self):
        """
        GIVEN des données de soumission valides
        WHEN je soumets via l'API
        THEN l'entrée est persistée dans la base de données
        AND je peux la récupérer via get_renown_requests_by_user
        
        RED PHASE: Will fail until persistence is implemented
        """
        try:
            from modules.werewolf.models.renown import (
                create_renown_table,
                get_renown_requests_by_user,
                RenownType,
                RenownStatus
            )
            from modules.werewolf.views.api_routes import submit_renown_request
        except ImportError as e:
            pytest.fail(f"Required imports failed: {e}")
        
        import aiosqlite
        
        async with aiosqlite.connect(":memory:") as db:
            await create_renown_table(db)
            
            # Mock request
            mock_request = MagicMock()
            mock_request.json = AsyncMock(return_value={
                "title": "Bataille de la Forêt Noire",
                "description": "A mené la meute à la victoire contre une incursion de Danseurs de la Spirale Noire",
                "renown_type": "Glory"
            })
            mock_request = MagicMock()
            mock_request.json = AsyncMock(return_value={
                "title": "Bataille de la Forêt Noire",
                "description": "A mené la meute à la victoire contre une incursion de Danseurs de la Spirale Noire",
                "renown_type": "Glory"
            })
            mock_request.get.return_value = {"id": "987654321"} # Authenticated
            mock_request.app = {'db': db}
            
            # Submit
            # For this integration test with in-memory DB, we do NOT patch create_renown_table as we want it to run on the memory DB
            # BUT we need to make sure the service uses the correct DB connection from request.app['db']
            
            # The issue earlier was MagicMock not being awaitable. 
            # In this test, db is aiosqlite connection which IS awaitable/async compatible.
            # So create_renown_table(db) should work fine if db is the real aiosqlite connection.
            
            # We need to ensure request.app['db'] IS the aiosqlite db
            
            response = await submit_renown_request(mock_request)
            
            if response.status != 201:
                 print(f"DEBUG: Response body: {response.body}")
            
            assert response.status == 201
            
            # Verify persistence
            requests = await get_renown_requests_by_user(db, "987654321")
            
            assert len(requests) == 1, (
                f"Expected 1 renown request in DB, found {len(requests)}"
            )
            assert requests[0].title == "Bataille de la Forêt Noire"
            assert requests[0].status == RenownStatus.PENDING

    @pytest.mark.asyncio
    async def test_submitted_at_timestamp_is_set_automatically(self):
        """
        GIVEN une soumission de Haut Fait valide
        WHEN je crée l'entrée
        THEN submitted_at est automatiquement défini à la date/heure actuelle
        
        RED PHASE: Will fail until timestamp auto-set is implemented
        """
        try:
            from modules.werewolf.models.renown import (
                create_renown_table,
                create_renown_request,
                RenownType,
                RenownRequest
            )
        except ImportError as e:
            pytest.fail(f"Required imports failed: {e}")
        
        import aiosqlite
        from datetime import datetime, timezone
        
        async with aiosqlite.connect(":memory:") as db:
            await create_renown_table(db)
            
            before = datetime.now(timezone.utc)
            
            req = RenownRequest(
                user_id="123456789",
                title="Test",
                description="Test",
                renown_type=RenownType.GLORY
            )
            result = await create_renown_request(db, req)
            
            after = datetime.now(timezone.utc)
            
            assert result.submitted_at is not None, (
                "submitted_at should be automatically set"
            )
            
            # Check timestamp is within expected range
            submitted = result.submitted_at
            if isinstance(submitted, str):
                submitted = datetime.fromisoformat(submitted.replace('Z', '+00:00'))
            
            assert before <= submitted <= after, (
                f"submitted_at ({submitted}) should be between {before} and {after}"
            )
