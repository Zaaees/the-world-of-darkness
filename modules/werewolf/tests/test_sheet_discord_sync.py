
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

# Attempt to import assuming the file will be created
try:
    from modules.werewolf.services.sheet import SheetService
except ImportError:
    SheetService = None

@pytest.mark.asyncio
async def test_sync_sheet_to_discord_success():
    """
    Test that sync_sheet_to_discord correctly updates the Discord thread.
    Scenario:
    - Given a sheet with a discord_thread_id
    - When sync_sheet_to_discord is called
    - Then it should fetch the thread and edit the message
    """
    if SheetService is None:
        pytest.fail("SheetService module not found - Implementation missing")

    # Arrange
    sheet_data = {
        "id": 1,
        "discord_thread_id": "123456789", 
        "story": "New Narrative Content"
    }
    
    mock_thread = AsyncMock()
    mock_message = AsyncMock()
    
    # Mock chain: get_thread -> thread -> fetch_message -> message -> edit
    # Adjust based on likely implementation (using a discord client wrapper?)
    # For now, we assume a helper function 'get_discord_thread' or similar is used/mocked
    
    with patch("modules.werewolf.services.sheet.get_discord_thread", return_value=mock_thread) as mock_get_thread:
        mock_thread.fetch_message.return_value = mock_message
        
        # Act
        await SheetService.sync_sheet_to_discord(sheet_data)
        
        # Assert
        mock_get_thread.assert_called_with("123456789")
        # Ensure we fetch the first message or specific message? Story says "message initial".
        # We might need to know WHICH message. Usually the first one. 
        # For this test, we assume implementation finds the right message.
        mock_message.edit.assert_called_with(content="New Narrative Content")

@pytest.mark.asyncio
async def test_sync_sheet_to_discord_failure_silent():
    """
    Test fail-safe behavior: Discord errors should be logged but not raise exceptions.
    """
    if SheetService is None:
        pytest.fail("SheetService module not found")

    # Arrange
    sheet_data = {"id": 1, "discord_thread_id": "123456789", "story": "Fail Content"}
    mock_thread = AsyncMock()
    mock_thread.fetch_message.side_effect = Exception("Discord API 429")
    
    with patch("modules.werewolf.services.sheet.get_discord_thread", return_value=mock_thread):
        with patch("modules.werewolf.services.sheet.logger") as mock_logger: # Assume logger usage
            # Act
            await SheetService.sync_sheet_to_discord(sheet_data)
            
            # Assert
            # No exception raised
            mock_logger.error.assert_called()
