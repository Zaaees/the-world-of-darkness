import logging
import discord
from typing import Optional, List
from modules.werewolf.models.store import WerewolfData
from utils.sheet_manager import (
    create_new_thread, 
    update_existing_thread, 
    get_or_create_tag, 
    send_notification, 
    format_paragraph
)

logger = logging.getLogger(__name__)

# Forum ID defined in story
FORUM_CHANNEL_ID = 1462941781761986732

def format_werewolf_sheet_content(character_data: WerewolfData, author_name: str) -> List[str]:
    """Formate la fiche loup-garou et la découpe en morceaux de < 2000 caractères."""
    
    lines = []
    
    # ── En-tête identité ──
    lines.append("─── ─── ─── ─── ───")
    lines.append(f"**{character_data.name}**")
    lines.append(f"*Âge : {getattr(character_data, 'age', '-')}  ·  Sexe : {getattr(character_data, 'sex', '-')}*")
    lines.append("─── ─── ─── ─── ───")
    lines.append("")
    
    breed = character_data.breed.value if hasattr(character_data.breed, 'value') else str(character_data.breed)
    auspice = character_data.auspice.value if hasattr(character_data.auspice, 'value') else str(character_data.auspice)
    tribe = character_data.tribe.value if hasattr(character_data.tribe, 'value') else str(character_data.tribe)
    
    lines.append(f"**Race** : *{breed}*  ·  **Auspice** : *{auspice}*  ·  **Tribu** : *{tribe}*")
    if character_data.rank:
        lines.append(f"*Rang {character_data.rank}*")
    lines.append("")
    
    lines.append("**__Description Physique__**")
    lines.append(format_paragraph(getattr(character_data, 'physical_desc', '-')))
    lines.append("")
    
    lines.append("**__Mentalité (Avant le Premier Changement)__**")
    lines.append(format_paragraph(getattr(character_data, 'mental_desc_pre', '-')))
    lines.append("")
    
    lines.append("**__Le Premier Changement__**")
    lines.append(format_paragraph(getattr(character_data, 'first_change', '-')))
    lines.append("")
    
    lines.append("**__Histoire__**")
    lines.append(format_paragraph(character_data.story or "-"))

    full_text = "\n".join(lines)
    
    parts = []
    current_part = ""
    
    for line in full_text.split('\n'):
        if len(current_part) + len(line) + 1 > 1900:
            parts.append(current_part)
            current_part = line
        else:
            if current_part:
                current_part += "\n" + line
            else:
                current_part = line
                
    if current_part:
        parts.append(current_part)
        
    return parts

async def publish_werewolf_to_discord(bot: discord.Client, character_data: WerewolfData, diff_text: str = None) -> Optional[str]:
    """
    Crée ou met à jour le thread pour le personnage dans le Forum dédié.
    """
    logger.info(f"Publishing/Updating character {character_data.name} to Discord Forum {FORUM_CHANNEL_ID}")
    
    channel = await bot.fetch_channel(FORUM_CHANNEL_ID)
    if not channel:
        logger.error(f"Forum channel {FORUM_CHANNEL_ID} not found.")
        return None
        
    guild = channel.guild
    
    author_name = f"Utilisateur {character_data.user_id}"
    try:
        member = guild.get_member(int(character_data.user_id))
        if not member:
            member = await guild.fetch_member(int(character_data.user_id))
        if member:
            author_name = member.display_name
    except Exception:
        pass
        
    char_name = character_data.name
    tribe_name = character_data.tribe.value if hasattr(character_data.tribe, 'value') else str(character_data.tribe)
    image_url = getattr(character_data, 'image_url', None)

    tag = await get_or_create_tag(channel, tribe_name)
    applied_tags = [tag] if tag else []

    content_parts = format_werewolf_sheet_content(character_data, author_name)

    forum_post_id = character_data.discord_thread_id
    thread = None

    if forum_post_id:
        try:
            thread = await guild.fetch_channel(int(forum_post_id))
        except (discord.NotFound, ValueError, TypeError):
            logger.warning(f"Thread {forum_post_id} introuvable, création d'un nouveau.")
            forum_post_id = None

    if thread:
        await update_existing_thread(thread, char_name, applied_tags, image_url, content_parts)
        logger.info(f"Fiche mise à jour pour {char_name} (Thread {thread.id})")
    else:
        thread = await create_new_thread(channel, char_name, applied_tags, image_url, content_parts)
        forum_post_id = str(thread.id)
        logger.info(f"Fiche créée pour {char_name} (Thread {thread.id})")

    await send_notification(guild, author_name, char_name, thread.jump_url, is_update=(thread is not None), notify_gm=(thread is None), diff_text=diff_text)

    return forum_post_id
