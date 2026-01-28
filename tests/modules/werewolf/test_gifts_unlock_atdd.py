# tests/modules/werewolf/test_gifts_unlock_atdd.py
"""
ATDD Tests for Story 5.4: Dashboard MJ - Déblocage des Dons

As a MJ,
I want débloquer des Dons spécifiques pour un joueur,
so that je puisse récompenser sa progression narrative.

Acceptance Criteria:
- MJ Success: MJ can list players, list gifts for a player, and toggle gift state.
- Security: Non-MJ users receive 403 Forbidden.
- Input Validation: Handle missing playerId or giftId in unlock request (400).
"""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from modules.werewolf.models.store import WerewolfData, WerewolfBreed, WerewolfAuspice, WerewolfTribe

MJ_ROLE_ID = 1462941982161764556

class TestStory5_4_MJGiftsAPI:
    """Tests for Story 5.4: MJ Gifts Dashboard"""

    @pytest.fixture
    def mock_player(self):
        return WerewolfData(
            user_id="101",
            breed=WerewolfBreed.HOMID,
            auspice=WerewolfAuspice.AHROUN,
            tribe=WerewolfTribe.FIANNA,
            name="Test Garou",
            rank=1
        )

    @pytest.mark.asyncio
    async def test_get_admin_players_mj_only(self):
        from modules.werewolf.routes import get_admin_players_handler
        
        # Scenario 1: Non-MJ User
        mock_request_user = MagicMock()
        mock_request_user.headers = {"X-Discord-User-ID": "123", "X-Discord-Guild-ID": "111"}
        mock_request_user.app = {"bot": MagicMock()}
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=99999)]
        mock_guild.get_member.return_value = mock_member
        mock_request_user.app["bot"].get_guild.return_value = mock_guild

        response = await get_admin_players_handler(mock_request_user)
        assert response.status == 403

        # Scenario 2: MJ User
        mock_request_mj = MagicMock()
        mock_request_mj.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request_mj.app = {"bot": MagicMock(), "db": MagicMock()}
        
        mock_guild_mj = MagicMock()
        mock_member_mj = MagicMock()
        mock_member_mj.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild_mj.get_member.return_value = mock_member_mj
        mock_request_mj.app["bot"].get_guild.return_value = mock_guild_mj
        
        with patch('modules.werewolf.routes.get_all_werewolves', new_callable=AsyncMock) as mock_get_all:
            mock_get_all.return_value = []
            response = await get_admin_players_handler(mock_request_mj)
            assert response.status == 200

    @pytest.mark.asyncio
    async def test_get_admin_player_gifts_mj_success(self, mock_player):
        from modules.werewolf.routes import get_admin_player_gifts_handler
        
        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request.match_info = {'user_id': '101'}
        mock_request.app = {"bot": MagicMock(), "db": MagicMock()}
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild

        with patch('modules.werewolf.routes.get_character', new_callable=AsyncMock) as mock_get_char, \
             patch('modules.werewolf.routes.load_gift_catalogue') as mock_load_cat, \
             patch('modules.werewolf.routes.get_player_gifts', new_callable=AsyncMock) as mock_get_gifts:
            
            mock_get_char.return_value = mock_player
            mock_load_cat.return_value = [
                {"id": "gift1", "name": "Vision Nocturne", "tribe": "Fianna"},
                {"id": "gift2", "name": "Griffes", "tribe": "Get of Fenris"}
            ]
            mock_get_gifts.return_value = [{"id": "gift1"}] # Already unlocked
            
            response = await get_admin_player_gifts_handler(mock_request)
            assert response.status == 200
            
            data = json.loads(response.text)
            assert data['success'] is True
            # Only Fianna gift should be in the list for a Fianna player (simplified logic check)
            assert len(data['gifts']) == 1
            assert data['gifts'][0]['id'] == 'gift1'
            assert data['gifts'][0]['unlocked'] is True

    @pytest.mark.asyncio
    async def test_unlock_gift_mj_success(self):
        from modules.werewolf.routes import unlock_gift_handler
        
        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request.app = {"bot": MagicMock(), "db": MagicMock()}
        mock_request.json = AsyncMock(return_value={
            "playerId": "101",
            "giftId": "gift1",
            "unlock": True
        })
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild

        with patch('modules.werewolf.routes.unlock_gift', new_callable=AsyncMock) as mock_unlock:
            mock_unlock.return_value = True
            
            response = await unlock_gift_handler(mock_request)
            assert response.status == 200
            
            data = json.loads(response.text)
            assert data['success'] is True
            assert data['new_state'] == 'unlocked'
            from unittest.mock import ANY
            mock_unlock.assert_called_once_with(ANY, "101", "gift1", "456")

    @pytest.mark.asyncio
    async def test_unlock_gift_missing_params(self):
        from modules.werewolf.routes import unlock_gift_handler
        
        mock_request = MagicMock()
        mock_request.headers = {"X-Discord-User-ID": "456", "X-Discord-Guild-ID": "111"}
        mock_request.app = {"bot": MagicMock(), "db": MagicMock()}
        mock_request.json = AsyncMock(return_value={
            "playerId": "101"
            # giftId missing
        })
        
        mock_guild = MagicMock()
        mock_member = MagicMock()
        mock_member.roles = [MagicMock(id=MJ_ROLE_ID)]
        mock_guild.get_member.return_value = mock_member
        mock_request.app["bot"].get_guild.return_value = mock_guild

        response = await unlock_gift_handler(mock_request)
        assert response.status == 400
        data = json.loads(response.text)
        assert "error" in data
