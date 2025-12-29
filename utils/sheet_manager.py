
import logging
import discord
from typing import Optional, List

logger = logging.getLogger(__name__)

FORUM_CHANNEL_ID = 1455197317387911343
LOG_CHANNEL_ID = 1454182154270670848
NOTIFICATION_ROLE_ID = 1454188335957282897


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

        # Gestion du Tag (Clan)
        tag = await get_or_create_tag(forum_channel, clan_name)
        applied_tags = [tag] if tag else []

        # Préparation du contenu
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
            await update_existing_thread(thread, char_name, applied_tags, content_parts)
            logger.info(f"Fiche mise à jour pour {char_name} (Thread {thread.id})")
        else:
            # CRÉATION
            thread = await create_new_thread(forum_channel, char_name, applied_tags, content_parts)
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
        # Note: créer un tag nécessite d'éditer le salon
        new_tag = discord.ForumTag(name=tag_name, emoji=None)
        # On doit récupérer tous les tags existants, ajouter le nouveau, et sauvegarder
        updated_tags = forum_channel.available_tags + [new_tag]
        await forum_channel.edit(available_tags=updated_tags)
        
        # Re-récupérer le tag créé (il aura maintenant un ID)
        # On refait un fetch pour être sûr d'avoir les données à jour
        # Cependant, edit() ne retourne pas le channel mis à jour directement avec les nouveaux objets Tag complets immédiatement parfois.
        # On va chercher dans la liste locale updated_tags (mais ils n'ont pas d'ID encore si on utilise l'objet local)
        # Il faut re-récupérer le channel
        updated_channel = forum_channel.guild.get_channel(forum_channel.id) 
        if not updated_channel:
             # Fallback si cache pas à jour
             return None

        for tag in updated_channel.available_tags:
            if tag.name.lower() == tag_name.lower():
                return tag
                
        return None
    except Exception as e:
        logger.error(f"Impossible de créer le tag {tag_name}: {e}")
        return None


def format_sheet_content(data: dict, author_name: str) -> List[str]:
    """Formate la fiche et la découpe en morceaux de < 2000 caractères."""
    
    # Construction du texte complet
    lines = []
    lines.append(f"# Fiche de Personnage : {data.get('name', 'Inconnu')}")
    lines.append(f"**Joueur :** {author_name}")
    lines.append(f"**Clan :** {data.get('clan', 'Inconnu')}")
    lines.append("")
    lines.append("## Informations Générales")
    lines.append(f"**Nom et Prénom :** {data.get('name', '-')}")
    lines.append(f"**Âge :** {data.get('age', '-')}")
    lines.append(f"**Sexe :** {data.get('sex', '-')}")
    lines.append("")
    lines.append("## Description Physique")
    lines.append(data.get('physical_desc', '-'))
    lines.append("")
    lines.append("## Description Mentale (Avant l'Etreinte)")
    lines.append(data.get('mental_desc_pre', '-'))
    lines.append("")
    lines.append("## Description Mentale (Corrompue)")
    lines.append(data.get('mental_desc_post', '-'))
    lines.append("")
    lines.append("## Histoire")
    lines.append(data.get('history', '-'))

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


async def create_new_thread(channel: discord.ForumChannel, title: str, tags: List[discord.ForumTag], content_parts: List[str]):
    """Crée un nouveau thread avec le contenu potentiellement en plusieurs messages."""
    # Le premier message crée le thread
    first_content = content_parts[0]
    
    thread_with_message = await channel.create_thread(
        name=title,
        content=first_content,
        applied_tags=tags
    )
    thread = thread_with_message.thread
    
    # Poster les parties suivantes
    if len(content_parts) > 1:
        for part in content_parts[1:]:
            await thread.send(content=part)
            
    return thread


async def update_existing_thread(thread: discord.Thread, title: str, tags: List[discord.ForumTag], content_parts: List[str]):
    """Met à jour un thread existant."""
    # Mettre à jour le titre et les tags du thread
    # Note: On ne peut pas éditer les tags d'un thread archivé sans le désarchiver, mais edit() le fait généralement.
    await thread.edit(name=title, applied_tags=tags)
    
    # Récupérer le message initial (starter message)
    try:
        starter_message = await thread.fetch_message(thread.id) # L'ID du thread est souvent l'ID du premier message
    except discord.NotFound:
        # Fallback: récupérer l'historique et prendre le premier
        messages = [m async for m in thread.history(limit=1, oldest_first=True)]
        if messages:
            starter_message = messages[0]
        else:
            logger.error(f"Impossible de trouver le premier message du thread {thread.id}")
            return

    # Mettre à jour le premier message
    await starter_message.edit(content=content_parts[0])
    
    # Gérer les messages suivants
    # Stratégie : Supprimer les messages du bot qui suivent et reposter (plus simple que d'essayer de matcher)
    # Attention : ne pas supprimer les messages des autres utilisateurs (commentaires) ?
    # Pour l'instant, on assume que la fiche est "propre".
    # Une meilleure approche : Lister les messages du BOT dans le thread (après le premier) et les supprimer, puis poster le reste.
    
    bot_id = thread.guild.me.id
    messages_to_delete = []
    
    async for message in thread.history(limit=20, after=starter_message):
        if message.author.id == bot_id:
            messages_to_delete.append(message)
            
    # Bulk delete si possible, sinon un par un
    if messages_to_delete:
        try:
            if len(messages_to_delete) > 1: # Bulk delete ne marche pas sur les vieux messages (>14j)
                 # On tente le delete un par un pour être sûr
                 for msg in messages_to_delete:
                     await msg.delete()
            else:
                await messages_to_delete[0].delete()
        except Exception as e:
             logger.warning(f"Erreur suppression messages précédents: {e}")

    # Poster les nouvelles parties
    if len(content_parts) > 1:
        for part in content_parts[1:]:
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
