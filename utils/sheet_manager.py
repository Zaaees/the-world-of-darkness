
import logging
import discord
from typing import Optional, List, Union
import io

logger = logging.getLogger(__name__)

FORUM_CHANNEL_ID = 1455197317387911343
LOG_CHANNEL_ID = 1454182154270670848
STORAGE_CHANNEL_ID = 1455206147534491810
NOTIFICATION_ROLE_ID = 1454188335957282897


async def upload_image_to_discord(bot, file_data: bytes, filename: str) -> Optional[str]:
    """
    Upload une image dans le salon de stockage Discord et retourne son URL.
    """
    try:
        channel = bot.get_channel(STORAGE_CHANNEL_ID)
        if not channel:
            # Fallback: essayer de fetch le channel
            try:
                channel = await bot.fetch_channel(STORAGE_CHANNEL_ID)
            except Exception:
                logger.error(f"Salon de stockage {STORAGE_CHANNEL_ID} introuvable.")
                return None
        
        if not channel:
            return None

        file = discord.File(io.BytesIO(file_data), filename=filename)
        message = await channel.send(file=file)
        
        if message.attachments:
            return message.attachments[0].url
            
        return None
    except Exception as e:
        logger.error(f"Erreur upload image Discord: {e}")
        return None


async def process_discord_sheet_update(bot, user_id: int, guild_id: int, data: dict) -> Optional[int]:
    """
    Gère la création ou la mise à jour du post Discord pour une fiche de personnage.
    Retourne l'ID du post (thread) créé ou mis à jour.
    """
    try:
        guild = bot.get_guild(guild_id)
        if not guild:
            logger.error(f"Serveur {guild_id} introuvable pour la fiche de {user_id}")
            return None

        forum_channel = guild.get_channel(FORUM_CHANNEL_ID)
        if not isinstance(forum_channel, discord.ForumChannel):
            logger.error(f"Le salon {FORUM_CHANNEL_ID} n'est pas un salon Forum ou est introuvable.")
            return None

        # Récupérer le membre pour avoir son nom si le nom du perso est manquant (fallback)
        member = guild.get_member(user_id)
        if not member:
            try:
                member = await guild.fetch_member(user_id)
            except Exception:
                pass
        
        author_name = member.display_name if member else f"Utilisateur {user_id}"
        char_name = data.get("name", author_name)
        clan_name = data.get("clan", "Sans Clan").capitalize()
        image_url = data.get("image_url")

        # Gestion du Tag (Clan)
        tag = await get_or_create_tag(forum_channel, clan_name)
        applied_tags = [tag] if tag else []

        # Préparation du contenu (texte uniquement pour les réponses)
        content_parts = format_sheet_content(data, author_name)

        # Vérifier si un post existe déjà
        forum_post_id = data.get("forum_post_id")
        thread = None

        if forum_post_id:
            try:
                thread = await forum_channel.fetch_thread(forum_post_id)
            except discord.NotFound:
                logger.warning(f"Thread {forum_post_id} introuvable, création d'un nouveau.")
                forum_post_id = None  # On recrée

        if thread:
            # MISE À JOUR
            await update_existing_thread(thread, char_name, applied_tags, image_url, content_parts)
            logger.info(f"Fiche mise à jour pour {char_name} (Thread {thread.id})")
        else:
            # CRÉATION
            thread = await create_new_thread(forum_channel, char_name, applied_tags, image_url, content_parts)
            forum_post_id = thread.id
            logger.info(f"Fiche créée pour {char_name} (Thread {thread.id})")

        # Notification
        await send_notification(guild, author_name, char_name, thread.jump_url, is_update=(thread is not None))

        return forum_post_id

    except Exception as e:
        logger.error(f"Erreur lors du traitement de la fiche Discord pour {user_id}: {e}", exc_info=True)
        return None


async def get_or_create_tag(forum_channel: discord.ForumChannel, tag_name: str) -> Optional[discord.ForumTag]:
    """Récupère un tag existant ou le crée s'il n'existe pas."""
    # Chercher dans les tags existants
    for tag in forum_channel.available_tags:
        if tag.name.lower() == tag_name.lower():
            return tag
    
    # Créer le tag s'il n'existe pas
    try:
        new_tag = discord.ForumTag(name=tag_name, emoji=None)
        updated_tags = forum_channel.available_tags + [new_tag]
        await forum_channel.edit(available_tags=updated_tags)
        
        updated_channel = forum_channel.guild.get_channel(forum_channel.id) 
        if not updated_channel:
             return None

        for tag in updated_channel.available_tags:
            if tag.name.lower() == tag_name.lower():
                return tag
                
        return None
    except Exception as e:
        logger.error(f"Impossible de créer le tag {tag_name}: {e}")
        return None


def format_paragraph(text: str) -> str:
    """Formate un texte en mettant chaque paragraphe en italique."""
    if not text:
        return "*Non renseigné*"
    
    # Découper par ligne, nettoyer, et envelopper chaque ligne non vide dans des *
    paragraphs = []
    for line in text.split('\n'):
        clean_line = line.strip()
        if clean_line:
            paragraphs.append(f"*{clean_line}*")
    
    return "\n".join(paragraphs)

def format_sheet_content(data: dict, author_name: str) -> List[str]:
    """Formate la fiche et la découpe en morceaux de < 2000 caractères."""
    
    lines = []
    
    # En-tête (Gras/Italique via le formatage global ou spécifique)
    # On garde l'italique pour la cohérence
    lines.append(f"*{'='*20}*")
    lines.append(f"*Nom et Prénom : {data.get('name', '-')}*")
    lines.append(f"*Âge : {data.get('age', '-')}*")
    lines.append(f"*Sexe : {data.get('sex', '-')}*")
    lines.append(f"*{'='*20}*")
    lines.append("")
    
    # Sections
    lines.append("**__Description Physique__**") # Titre en Gras Souligné
    lines.append(format_paragraph(data.get('physical_desc', '-')))
    lines.append("")
    
    lines.append("**__Description Mentale (Avant l'Etreinte)__**")
    lines.append(format_paragraph(data.get('mental_desc_pre', '-')))
    lines.append("")
    
    lines.append("**__Description Mentale (Corrompue)__**")
    lines.append(format_paragraph(data.get('mental_desc_post', '-')))
    lines.append("")
    
    lines.append("**__Histoire__**")
    lines.append(format_paragraph(data.get('history', '-')))

    full_text = "\n".join(lines)
    
    # Découpage intelligent
    parts = []
    current_part = ""
    
    for line in full_text.split('\n'):
        if len(current_part) + len(line) + 1 > 1900: # Marge de sécurité
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


async def create_new_thread(channel: discord.ForumChannel, title: str, tags: List[discord.ForumTag], image_url: Optional[str], content_parts: List[str]):
    """Crée un nouveau thread avec l'image en entête et le texte en réponses."""
    
    # Le message initial contient l'image ou juste le titre
    starter_content = image_url if image_url else f"Fiche de {title}"
    
    thread_with_message = await channel.create_thread(
        name=title,
        content=starter_content,
        applied_tags=tags
    )
    thread = thread_with_message.thread
    
    # Poster le texte dans les messages suivants
    for part in content_parts:
        await thread.send(content=part)
            
    return thread


async def update_existing_thread(thread: discord.Thread, title: str, tags: List[discord.ForumTag], image_url: Optional[str], content_parts: List[str]):
    """Met à jour un thread existant."""
    
    # Mettre à jour le titre et les tags
    await thread.edit(name=title, applied_tags=tags)
    
    # Récupérer et mettre à jour le message initial (image)
    try:
        starter_message = await thread.fetch_message(thread.id)
        starter_content = image_url if image_url else f"Fiche de {title}"
        
        # Uniquement éditer si le contenu a changé pour éviter rate limits
        if starter_message.content != starter_content:
            await starter_message.edit(content=starter_content)
    except discord.NotFound:
        # Si message initial introuvable, on continue (ne devrait pas arriver sur un thread)
        pass

    # Supprimer les anciens messages du bot (les parties de texte précédentes)
    # On garde le starter_message (id == thread.id)
    bot_id = thread.guild.me.id
    messages_to_delete = []
    
    async for message in thread.history(limit=50, after=discord.Object(id=thread.id)):
        if message.author.id == bot_id:
            messages_to_delete.append(message)
            
    # Bulk delete
    if messages_to_delete:
        try:
            if len(messages_to_delete) > 1:
                 # Bulk delete (messages < 14 jours)
                 try:
                    await thread.delete_messages(messages_to_delete)
                 except discord.HTTPException:
                    # Fallback si messages trop vieux
                    for msg in messages_to_delete:
                        await msg.delete()
            else:
                await messages_to_delete[0].delete()
        except Exception as e:
             logger.warning(f"Erreur suppression messages précédents: {e}")

    # Poster les nouvelles parties de texte
    for part in content_parts:
        await thread.send(content=part)


async def send_notification(guild: discord.Guild, author_name: str, char_name: str, url: str, is_update: bool):
    """Envoie une notification dans le salon dédié."""
    log_channel = guild.get_channel(LOG_CHANNEL_ID)
    if not log_channel:
        return

    action = "modifiée" if is_update else "créée"
    role_mention = f"<@&{NOTIFICATION_ROLE_ID}>"
    
    embed = discord.Embed(
        title=f"Fiche de personnage {action}",
        description=f"La fiche de **{char_name}** (joué par {author_name}) a été {action}.",
        color=0x00FF00 if not is_update else 0xFFA500
    )
    embed.add_field(name="Lien vers la fiche", value=f"[Cliquez ici pour voir la fiche]({url})")
    
    await log_channel.send(content=role_mention, embed=embed)
