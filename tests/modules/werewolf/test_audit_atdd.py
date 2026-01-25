
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

# Story 3.4: Audit Log des Modifications
# As a MJ, I want un historique des modifications... so that je puisse suivre l'évolution.

AUDIT_CHANNEL_ID = 1457856977660022844

class TestStory3_4_AuditLog:

    @pytest.mark.asyncio
    async def test_calculate_diff_changes(self):
        """
        GIVEN old and new character data with changes
        WHEN calculate_diff is called
        THEN it returns a list of formatted change strings
        """
        # Attempt import
        try:
            from modules.werewolf.services.audit import calculate_diff
            from modules.werewolf.models.store import WerewolfData
        except ImportError:
            pytest.fail("Module 'modules.werewolf.services.audit' or 'models.store' not found. Implementation missing.")

        # Setup Data
        old_data = WerewolfData(
            user_id="123", name="Garou", breed="Homid", auspice="Ahroun", tribe="Black Furies"
        )
        new_data = WerewolfData(
            user_id="123", name="Garou Changed", breed="Homid", auspice="Ahroun", tribe="Black Furies"
        )
        
        # Action
        diff = calculate_diff(old_data, new_data)
        
        # Assertions
        assert isinstance(diff, list)
        assert len(diff) > 0
        assert "name: Garou -> Garou Changed" in diff[0] or "name" in diff[0]

    @pytest.mark.asyncio
    async def test_calculate_diff_no_changes(self):
        """
        GIVEN identical old and new data
        WHEN calculate_diff is called
        THEN it returns an empty list
        """
        try:
            from modules.werewolf.services.audit import calculate_diff
            from modules.werewolf.models.store import WerewolfData
        except ImportError:
            pytest.fail("Implementation missing.")

        old_data = WerewolfData(user_id="123", name="Same", breed="Homid", auspice="Ahroun", tribe="Black Furies")
        new_data = WerewolfData(user_id="123", name="Same", breed="Homid", auspice="Ahroun", tribe="Black Furies")

        diff = calculate_diff(old_data, new_data)
        assert diff == []

    @pytest.mark.asyncio
    async def test_log_character_update_sends_discord_message(self):
        """
        GIVEN a valid update with changes
        WHEN log_character_update is called
        THEN a message is sent to the audit channel
        """
        try:
            from modules.werewolf.services.audit import log_character_update
        except ImportError:
            pytest.fail("Implementation missing.")

        # Mocks
        mock_bot = MagicMock()
        mock_channel = AsyncMock()
        mock_bot.get_channel.return_value = mock_channel
        
        user_mock = MagicMock()
        user_mock.display_name = "TestUser"
        
        character_data = MagicMock()
        character_data.name = "TestChar"
        
        changes = ["name: Old -> New"]
        
        # Action
        await log_character_update(mock_bot, user_mock, character_data, changes)
        
        # Assertions
        mock_bot.get_channel.assert_called_with(AUDIT_CHANNEL_ID)
        mock_channel.send.assert_called_once()
        
        # Check content
        args, _ = mock_channel.send.call_args
        content = args[0] if args else _.get('content', '')
        assert "TestUser" in content
        assert "TestChar" in content
        assert "name: Old -> New" in content

    @pytest.mark.asyncio
    async def test_log_character_update_minor_modification(self):
        """
        GIVEN a minor modification (simulated by small diff)
        WHEN log_character_update is called
        THEN it is still logged (as per AC 5)
        """
        try:
            from modules.werewolf.services.audit import log_character_update
        except ImportError:
            pytest.fail("Implementation missing.")

        mock_bot = MagicMock()
        mock_channel = AsyncMock()
        mock_bot.get_channel.return_value = mock_channel
        
        changes = ["bio: a -> b"] # Minor change
        
        await log_character_update(mock_bot, MagicMock(), MagicMock(), changes)
        
        mock_channel.send.assert_called_once()

    @pytest.mark.asyncio
    async def test_audit_constant_exists(self):
        """
        GIVEN the audit service definition
        THEN the AUDIT_CHANNEL_ID constant is defined correctly
        """
        try:
            from modules.werewolf.services import audit
        except ImportError:
            pytest.fail("Implementation missing.")
            
        assert hasattr(audit, 'AUDIT_CHANNEL_ID')
        assert audit.AUDIT_CHANNEL_ID == 1457856977660022844
