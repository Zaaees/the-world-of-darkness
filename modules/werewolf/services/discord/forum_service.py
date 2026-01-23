import logging
import discord
from typing import Optional
from modules.werewolf.models.store import WerewolfData

logger = logging.getLogger(__name__)

# Forum ID defined in story
FORUM_CHANNEL_ID = 1462941781761986732

async def create_character_thread(bot: discord.Client, character_data: WerewolfData) -> str:
    """
    Crée un thread pour le personnage dans le Forum dédié.
    
    Args:
        bot: L'instance discord.Client ou Bot.
        character_data: L'objet données du personnage.
        
    Returns:
        L'ID du thread créé sous forme de chaîne.
        
    Raises:
        ValueError: Si le channel forum principal n'est pas trouvé.
    """
    logger.info(f"Attempting to publish character {character_data.name} to Discord Forum {FORUM_CHANNEL_ID}")
    
    channel = await bot.fetch_channel(FORUM_CHANNEL_ID)
    if not channel:
        logger.error(f"Forum channel {FORUM_CHANNEL_ID} not found.")
        raise ValueError(f"Forum channel {FORUM_CHANNEL_ID} not found")
        
    # Create Embed
    embed = discord.Embed(
        title=character_data.name,
        description=character_data.story or "Pas d'histoire pour le moment.",
        color=0x7289da # Discord Blurple or any theme color
    )
    
    # Add fields
    # Handle Enums or Strings safely
    breed = character_data.breed.value if hasattr(character_data.breed, 'value') else str(character_data.breed)
    auspice = character_data.auspice.value if hasattr(character_data.auspice, 'value') else str(character_data.auspice)
    tribe = character_data.tribe.value if hasattr(character_data.tribe, 'value') else str(character_data.tribe)
    
    embed.add_field(name="Race", value=breed, inline=True)
    embed.add_field(name="Auspice", value=auspice, inline=True)
    embed.add_field(name="Tribu", value=tribe, inline=True)
    
    if character_data.rank:
        embed.add_field(name="Rang", value=str(character_data.rank), inline=True)
        
    # Create Thread
    # Note: create_thread signature varies between ForumChannel and TextChannel.
    # For ForumChannel: create_thread(name=..., embed=..., ...) or create_thread(name=..., content=...)
    # We assume 'channel' is a ForumChannel based on ID context.
    
    try:
        # discord.py ForumChannel.create_thread(name=..., embed=...) method
        # Note: In newer discord.py versions (2.0+), it might be `create_thread(name=..., content=..., embed=...)`
        # But for Forum channels specifically, it's often strict.
        
        thread_with_message = await channel.create_thread(name=character_data.name, embed=embed)
        
        # In discord.py 2.0+, create_thread on Forum returns a Thread with Message?
        # Actually it typically returns the Thread object (which has an ID).
        # We need to being careful with the return type.
        # But 'thread.id' is what we want.
        
        # Risk 201: Ensure we cast to string immediately
        thread_id = str(thread_with_message.id) # thread.id is int
        
        logger.info(f"Successfully created thread {thread_id} for character {character_data.name}")
        return thread_id
        
    except Exception as e:
        logger.error(f"Failed to create Discord thread: {e}")
        raise
