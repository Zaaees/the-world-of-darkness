
import logging
import discord
from typing import Optional
from modules.werewolf.models.store import WerewolfData

logger = logging.getLogger(__name__)

async def sync_sheet_to_discord(bot: discord.Client, character_data: WerewolfData) -> bool:
    """
    Synchronise la fiche personnage avec le thread Discord existant.
    Met à jour le premier message (starter message) du thread avec les nouvelles données.

    Args:
        bot: Instance du bot Discord.
        character_data: Données du personnage.

    Returns:
        bool: True si succès, False sinon.
    """
    if not character_data.discord_thread_id:
        logger.warning(f"Character {character_data.name} has no discord_thread_id. Skipping sync.")
        return False

    try:
        thread_id = int(character_data.discord_thread_id)
        logger.info(f"Syncing character {character_data.name} to thread {thread_id}")

        # Fetch thread
        thread = await bot.fetch_channel(thread_id)
        
        if not isinstance(thread, (discord.Thread, discord.TextChannel)):
            # Fallback if it's not a thread/channel we expect
            logger.error(f"Channel {thread_id} is not a Thread or TextChannel (got {type(thread)})")
            return False

        # Get starter message
        # In forum threads, thread.starter_message ensures we have it, 
        # but it might require cache or fetch.
        message = thread.starter_message
        
        if not message:
            # Try fetching it using the thread ID (often same for forum posts)
            try:
                message = await thread.fetch_message(thread_id)
            except discord.NotFound:
                # If ID differs, we might need to search history
                # History fallback
                async for msg in thread.history(limit=1, oldest_first=True):
                    message = msg
                    break
        
        if not message:
            logger.error(f"Could not find starter message for thread {thread_id}")
            return False

        # Prepare content update
        # We assume we update the 'story' or description.
        # Story requirement: "contents du thread existant... est mis à jour avec le nouveau contenu narratif"
        
        # Rebuild embed using shared logic
        from modules.werewolf.services.discord.forum_service import create_character_embed
        embed = create_character_embed(character_data)

        await message.edit(embed=embed)
        logger.info("Successfully synced sheet to Discord.")
        return True

    except discord.Forbidden:
        logger.error(f"Permission denied syncing thread {character_data.discord_thread_id}")
        return False
    except discord.HTTPException as e:
        logger.error(f"HTTP error syncing thread {character_data.discord_thread_id}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error syncing thread: {e}")
        return False
