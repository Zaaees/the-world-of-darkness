import logging
from typing import Dict, Any, Optional
import discord

import aiosqlite

from modules.werewolf.models.store import WerewolfData, create_werewolf_data, get_werewolf_data

logger = logging.getLogger(__name__)

async def create_character(db: aiosqlite.Connection, character_data: Dict[str, Any], bot: Optional[discord.Client] = None) -> WerewolfData:
    """
    Creates a new werewolf character.
    
    Args:
        db: Database connection.
        character_data: Dictionary containing character data.
        
    Returns:
        The created WerewolfData object.
    
    Raises:
        ValueError: If data is invalid.
    """
    user_id = str(character_data.get('user_id'))
    logger.info(f"Creating character for user {user_id}")
    
    # Create DTO
    try:
        new_character = WerewolfData(
            user_id=user_id,
            name=character_data['name'],
            breed=character_data['breed'],
            auspice=character_data['auspice'],
            tribe=character_data['tribe']
        )
    except (TypeError, ValueError, KeyError) as e:
         logger.error(f"Invalid character data for user {user_id}: {e}")
         raise ValueError(f"Invalid character data: {e}")

    
    # Persist
    try:
        await create_werewolf_data(db, new_character)
    except Exception as e:
        logger.error(f"Failed to persist character for user {user_id}: {e}")
        raise

    # Discord Forum Publication
    if bot:
        try:
            from modules.werewolf.services.discord.forum_service import create_character_thread
            from modules.werewolf.models.store import update_werewolf_data
            
            thread_id = await create_character_thread(bot, new_character)
            
            # Update DB with thread ID
            if thread_id:
                await update_werewolf_data(db, user_id, {"discord_thread_id": thread_id})
                logger.info(f"Saved discord thread ID {thread_id} for user {user_id}")
                
        except Exception as e:
            # We log but do NOT fail the creation if discord fails
            # The character is created, just not posted.
            logger.error(f"Failed to publish to Discord for user {user_id}: {e}")

    # Fetch back to get complete object (verify persistence and updates)
    created_char = await get_werewolf_data(db, user_id)
    
    if not created_char:
         raise RuntimeError(f"Failed to retrieve created character for user {user_id} after insertion.")

    return created_char
