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
        
    tribe_name = character_data.tribe.value if hasattr(character_data.tribe, 'value') else str(character_data.tribe)
    breed_name = character_data.breed.value if hasattr(character_data.breed, 'value') else str(character_data.breed)
    auspice_name = character_data.auspice.value if hasattr(character_data.auspice, 'value') else str(character_data.auspice)
    image_url = getattr(character_data, 'image_url', None)

    # Translations to French
    translations = {
        # Races
        "Homid": "Homidé",
        "Metis": "Métis",
        "Lupus": "Lupus",
        # Auspices
        "Ragabash": "Ragabash",
        "Theurge": "Théurge",
        "Philodox": "Philodox",
        "Galliard": "Galliard",
        "Ahroun": "Ahroun",
        # Tribus
        "Black Furies": "Furies Noires",
        "Bone Gnawers": "Rongeurs d'Os",
        "Children of Gaia": "Enfants de Gaïa",
        "Fianna": "Fianna",
        "Get of Fenris": "Fils de Fenris",
        "Glass Walkers": "Marcheurs sur Verre",
        "Red Talons": "Griffes Rouges",
        "Shadow Lords": "Seigneurs de l'Ombre",
        "Silent Striders": "Arpenteurs Silencieux",
        "Silver Fangs": "Crocs d'Argent",
        "Stargazers": "Astreants",
        "Uktena": "Uktena",
        "Wendigo": "Wendigo"
    }
    
    fr_tribe = translations.get(tribe_name, tribe_name)
    fr_breed = translations.get(breed_name, breed_name)
    fr_auspice = translations.get(auspice_name, auspice_name)

    # Breed in the title
    char_name = f"[{fr_breed}] {character_data.name}"

    # Determine Auspice Moon Emoji dynamically
    auspice_emojis = {
        "Ragabash": "🌑", # New Moon
        "Theurge": "🌒", # Crescent
        "Philodox": "🌓", # Half
        "Galliard": "🌔", # Gibbous
        "Ahroun": "🌕", # Full
    }
    a_emoji = auspice_emojis.get(auspice_name, "🌙")

    # Tribe and Auspice as tags
    tag_tribe = await get_or_create_tag(channel, fr_tribe, emoji="🐺")
    tag_auspice = await get_or_create_tag(channel, fr_auspice, emoji=a_emoji)
    
    applied_tags = [t for t in (tag_tribe, tag_auspice) if t]

    content_parts = format_werewolf_sheet_content(character_data, author_name)

    forum_post_id = character_data.discord_thread_id
    thread = None
    logger.info(f"DISCORD_DEBUG publish: forum_post_id from character={forum_post_id!r}")

    if forum_post_id:
        try:
            thread = await guild.fetch_channel(int(forum_post_id))
            logger.info(f"DISCORD_DEBUG publish: Found existing thread {thread.id}")
        except (discord.NotFound, ValueError, TypeError) as e:
            logger.warning(f"Thread {forum_post_id} introuvable ({e}), création d'un nouveau.")
            forum_post_id = None
        except Exception as e:
            logger.error(f"DISCORD_DEBUG publish: Unexpected error fetching thread {forum_post_id}: {e}")
            forum_post_id = None
    else:
        logger.info("DISCORD_DEBUG publish: No forum_post_id, will create new thread")

    if thread:
        await update_existing_thread(thread, char_name, applied_tags, image_url, content_parts)
        logger.info(f"Fiche mise à jour pour {char_name} (Thread {thread.id})")
    else:
        thread = await create_new_thread(channel, char_name, applied_tags, image_url, content_parts)
        forum_post_id = str(thread.id)
        logger.info(f"Fiche créée pour {char_name} (Thread {thread.id})")

    await send_notification(guild, author_name, char_name, thread.jump_url, is_update=(thread is not None), notify_gm=(thread is None), diff_text=diff_text)

    return forum_post_id
