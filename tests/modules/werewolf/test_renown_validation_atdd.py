
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from modules.werewolf.models.store import WerewolfData, WerewolfRenown, RenownStatus, RenownType
from modules.werewolf.services.renown import RenownService

# These imports will fail initially (Red Phase)
try:
    from modules.werewolf.services.renown import RankCalculator
except ImportError:
    RankCalculator = None

try:
    from modules.werewolf.services.notifications import NotificationService
except ImportError:
    NotificationService = None

class TestStory4_4_RenownValidation:
    
    @pytest.mark.asyncio
    async def test_rank_calculation_logic_unit(self):
        """
        Test unit de la logique de calcul de rang.
        Vérifie que calculate_rank convertit correctement total renown -> Rank ID.
        """
        if not RankCalculator:
            pytest.fail("Module RankCalculator not implemented")

        # Test limits logic
        # 0-2 -> Rank 1
        assert RankCalculator.calculate_rank(2) == 1
        # 3-9 -> Rank 2
        assert RankCalculator.calculate_rank(3) == 2
        assert RankCalculator.calculate_rank(9) == 2
        # 10-19 -> Rank 3
        assert RankCalculator.calculate_rank(10) == 3
        # 20-29 -> Rank 4
        assert RankCalculator.calculate_rank(20) == 4
        # 30+ -> Rank 5
        assert RankCalculator.calculate_rank(30) == 5
        assert RankCalculator.calculate_rank(100) == 5

    @pytest.mark.asyncio
    async def test_rank_update_persisted(self):
        """
        Vérifie que la mise à jour du rang est persistée en DB.
        """
        if not hasattr(RenownService, 'update_player_rank'):
             pytest.fail("Method update_player_rank not implemented in RenownService")
             
        db = AsyncMock()
        service = RenownService(db)
        user_id = "test_user_123"
        new_rank = 3
        
        await service.update_player_rank(user_id, new_rank)
        
        # Verify DB update call
        # Expected UPDATE query
        db.execute.assert_called()
        call_args = db.execute.call_args
        query, params = call_args[0]
        
        assert "UPDATE werewolf_data" in query
        assert "SET rank = ?" in query
        assert params[0] == new_rank
        assert params[-1] == user_id

    @pytest.mark.asyncio
    async def test_discord_notification_content(self):
        """
        Vérifie que le service de notification contruit le bon message.
        """
        if not NotificationService:
             pytest.fail("NotificationService module not implemented")
             
        discord_client = AsyncMock()
        user_id = "123456789" # Needs to be numeric string
        user_mock = AsyncMock()
        
        # get_user is synchronous in discord.py, so we must use MagicMock, not AsyncMock default
        discord_client.get_user = MagicMock(return_value=user_mock)
        # fetch_user is async, so default AsyncMock behavior is fine (but we set return value)
        discord_client.fetch_user.return_value = user_mock
        
        req_title = "Kill Spiral Dancer"
        new_rank = 3
        
        await NotificationService.send_renown_approval_notification(discord_client, user_id, req_title, new_rank)
        
        user_mock.send.assert_called_once()
        sent_message = user_mock.send.call_args[0][0]
        
        assert req_title in sent_message
        assert "Rang" in sent_message
        assert str(new_rank) in sent_message

    @pytest.mark.asyncio
    @patch('modules.werewolf.views.api_routes.check_mj_role', return_value=True)
    async def test_validate_request_triggers_rank_update(self, mock_auth):
        """
        Vérifie que l'appel API 'validate' déclenche toute la chaîne :
        - Update Status
        - Recalculate Rank
        - Update Rank (if changed)
        - Notify
        """
        from modules.werewolf.views.api_routes import validate_renown_request
        
        # Setup Request Mock
        request = MagicMock()
        request.match_info = {'id': '1'}
        request.headers = {'X-Discord-User-ID': '9999'} # Maintainer
        
        # Mock DB
        db = AsyncMock()
        request.app = {'db': db, 'bot': AsyncMock()}
        
        # Mock RenownService methods
        with patch('modules.werewolf.views.api_routes.RenownService') as MockServiceClass:
            mock_service = MockServiceClass.return_value
            
            # Mock update_request_status success
            mock_req = MagicMock()
            mock_req.user_id = "12345"
            mock_req.title = "Epic Feat"
            mock_service.update_request_status = AsyncMock(return_value=mock_req)
            
            # Mock recalculate (which we want to be called)
            mock_service.recalculate_player_rank = AsyncMock(return_value=3) # Returns rank 3
            
            # Mock NotificationService
            with patch('modules.werewolf.views.api_routes.NotificationService') as MockNotify:
                # Configure send_renown_approval_notification to be awaitable
                MockNotify.send_renown_approval_notification = AsyncMock()
                 
                response = await validate_renown_request(request)
                
                assert response.status == 200
                
                # Check Chain
                mock_service.update_request_status.assert_called_once()
                mock_service.recalculate_player_rank.assert_called_once_with("12345")
                
                MockNotify.send_renown_approval_notification.assert_called()

