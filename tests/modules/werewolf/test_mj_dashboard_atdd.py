# tests/modules/werewolf/test_mj_dashboard_atdd.py
"""
ATDD Tests for Epic 4, Story 4.3: Dashboard MJ - Liste des Demandes de Renommée

As a MJ,
I want voir toutes les demandes de Hauts Faits en attente,
So that je puisse les valider ou les rejeter.

Acceptance Criteria:
- Given un utilisateur avec le rôle MJ (`1462941982161764556`)
- When il accède à `/werewolf/admin/renown`
- Then il voit la liste des demandes avec: Nom joueur, Titre, Type, Date de soumission
- And chaque entrée a des boutons "Valider" et "Rejeter"
"""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from modules.werewolf.models.renown import RenownStatus, RenownRequest, RenownType

MJ_ROLE_ID = 1462941982161764556

class TestStory4_3_MJDashboardAPI:
    """Tests for Story 4.3: Dashboard MJ"""

    @pytest.mark.asyncio
    async def test_get_renown_requests_mj_only(self):
        try:
            from modules.werewolf.views.api_routes import get_all_renown_requests
        except ImportError:
            pytest.fail("Function 'get_all_renown_requests' not found.")

        # Scenario 1: Non-MJ User
        mock_request_user = MagicMock()
        mock_request_user.headers = {"X-Discord-User-ID": "123", "X-Discord-Guild-ID": "111"}
        mock_request_user.app = {"bot": MagicMock()} 
        # Mock bot behavior for non-MJ
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=99999)] # Random role
        mock_guild.get_member.return_value = mock_member
        mock_request_user.app["bot"].get_guild.return_value = mock_guild

        response = await get_all_renown_requests(mock_request_user)
        assert response.status == 403, "Non-MJ user should get 403"

        # Scenario 2: MJ User
        mock_request_mj = MagicMock()
        mock_request_mj.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request_mj.app = {"bot": MagicMock(), "db": MagicMock()}
        
        mock_guild_mj = MagicMock()
        mock_member_mj = MagicMock()
        mock_member_mj.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild_mj.get_member.return_value = mock_member_mj
        mock_request_mj.app["bot"].get_guild.return_value = mock_guild_mj
        
        # Mock Service
        with patch('modules.werewolf.views.api_routes.RenownService') as MockService:
            service_instance = MockService.return_value
            service_instance.get_all_requests = AsyncMock(return_value=[])
            
            response = await get_all_renown_requests(mock_request_mj)
            assert response.status == 200, "MJ user should get 200"

    @pytest.mark.asyncio
    async def test_get_pending_renown_requests_list(self):
        try:
            from modules.werewolf.views.api_routes import get_all_renown_requests
        except ImportError:
            pytest.fail("Function 'get_all_renown_requests' not found.")
            
        mock_db_requests = [
            RenownRequest(
                id=1, user_id="101", title="Haut Fait 1", 
                description="Desc1", renown_type=RenownType.GLORY, status=RenownStatus.PENDING
            ),
            RenownRequest(
                id=2, user_id="102", title="Haut Fait 2", 
                description="Desc2", renown_type=RenownType.HONOR, status=RenownStatus.PENDING
            )
        ]
        
        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request.app = {"bot": MagicMock(), "db": MagicMock()}
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild

        with patch('modules.werewolf.views.api_routes.RenownService') as MockService:
             service_instance = MockService.return_value
             service_instance.get_all_requests = AsyncMock(return_value=mock_db_requests)
             
             response = await get_all_renown_requests(mock_request)
             assert response.status == 200
             
             data = json.loads(response.text)
             assert "requests" in data
             assert len(data["requests"]) == 2
             assert data["requests"][0]['title'] == "Haut Fait 1"
             assert data["requests"][0]['status'] == "pending"

    @pytest.mark.asyncio
    async def test_validate_renown_request_mj_only(self):
        try:
            from modules.werewolf.views.api_routes import validate_renown_request
        except ImportError:
             pytest.fail("Function 'validate_renown_request' not found.")

        # Non-MJ
        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "123", "X-Discord-Guild-ID": "111"}
        mock_request.app = {"bot": MagicMock()}
        mock_request.match_info = {'id': '1'}
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = []
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild
        
        response = await validate_renown_request(mock_request)
        assert response.status == 403

    @pytest.mark.asyncio
    async def test_validate_updates_status(self):
        try:
            from modules.werewolf.views.api_routes import validate_renown_request
        except ImportError:
             pytest.fail("Function 'validate_renown_request' not found.")

        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request.app = {"bot": MagicMock(), "db": MagicMock()}
        mock_request.match_info = {'id': '1'}
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild

        with patch('modules.werewolf.views.api_routes.RenownService') as MockService, \
             patch('modules.werewolf.views.api_routes.NotificationService') as MockNotification:
             
            service_instance = MockService.return_value
            service_instance.update_request_status = AsyncMock(return_value=RenownRequest(
                id=1, user_id="101", title="T", description="D", renown_type=RenownType.GLORY, status=RenownStatus.APPROVED
            ))
            service_instance.recalculate_player_rank = AsyncMock(return_value=2)
            MockNotification.send_renown_approval_notification = AsyncMock()
            
            response = await validate_renown_request(mock_request)
            
            assert response.status == 200
            data = json.loads(response.text)
            assert data['status'] == 'approved'
            service_instance.update_request_status.assert_called_once()
            
            # Verify Status arg
            args, _ = service_instance.update_request_status.call_args
            assert args[0] == '1' # ID
            assert args[1] == RenownStatus.APPROVED

    @pytest.mark.asyncio
    async def test_reject_renown_request_mj_only(self):
        try:
            from modules.werewolf.views.api_routes import reject_renown_request
        except ImportError:
             pytest.fail("Function 'reject_renown_request' not found.")

        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request.app = {"bot": MagicMock(), "db": MagicMock()}
        mock_request.match_info = {'id': '1'}
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild
        
        with patch('modules.werewolf.views.api_routes.RenownService') as MockService:
            service_instance = MockService.return_value
            service_instance.update_request_status = AsyncMock(return_value=RenownRequest(
                id=1, user_id="101", title="T", description="D", renown_type=RenownType.GLORY, status=RenownStatus.REJECTED
            ))
            
            response = await reject_renown_request(mock_request)
            assert response.status == 200
            data = json.loads(response.text)
            assert data['status'] == 'rejected'
            
            args, _ = service_instance.update_request_status.call_args
            assert args[1] == RenownStatus.REJECTED
