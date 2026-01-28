import asyncio
import logging
import sys
import os
from unittest.mock import AsyncMock, MagicMock

# Add project root to path
sys.path.append(os.getcwd())

from modules.werewolf.services.notifications import NotificationService
from utils.sheet_manager import SHEET_LOG_CHANNEL_ID
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VerifyNotification")

async def test_notification():
    logger.info("Starting Notification Service Verification...")
    
    # Mock Bot and Channel
    mock_bot = MagicMock()
    mock_channel = AsyncMock()
    mock_user = AsyncMock()
    mock_user.display_name = "Test User"
    
    # Configure Bot behavior
    mock_bot.get_channel.return_value = mock_channel
    mock_bot.fetch_user = AsyncMock(return_value=mock_user)
    
    # Test Data
    user_id = "123456789"
    title = "Epic Feat"
    type = "glory"
    req_id = 99
    
    # Run Service Method
    await NotificationService.send_renown_submission_notification(
        mock_bot, user_id, title, type, req_id
    )
    
    # Verification
    mock_bot.get_channel.assert_called_with(SHEET_LOG_CHANNEL_ID)
    mock_channel.send.assert_called_once()
    
    # Check arguments
    args, kwargs = mock_channel.send.call_args
    content = kwargs.get('content')
    embed = kwargs.get('embed')
    
    logger.info(f"Content sent: {content}")
    logger.info(f"Embed title: {embed.title}")
    logger.info(f"Embed description: {embed.description}")
    
    assert "<@&1462941982161764556>" in content  # ROLE_MJ_WEREWOLF
    assert "Epic Feat" in embed.description
    assert "Test User" in embed.description
    
    logger.info("✅ Verification SUCCESS: Notification sent correctly.")

if __name__ == "__main__":
    asyncio.run(test_notification())
