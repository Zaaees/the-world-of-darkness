
import logging
import discord
import aiohttp
from typing import Optional, List, Union
import io

from data.config import GOOGLE_SHEETS_API_URL

logger = logging.getLogger(__name__)

FORUM_CHANNEL_ID = 1455197317387911343
NPC_FORUM_CHANNEL_ID = 1457475638398025892
LOG_CHANNEL_ID = 1454182154270670848
STORAGE_CHANNEL_ID = 1455206147534491810
SHEET_LOG_CHANNEL_ID = 1457856977660022844
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


async def process_discord_sheet_update(bot, user_id: int, guild_id: int, data: dict, diff_text: str = None) -> Optional[int]:
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
                # Les threads sont des channels, on les récupère via la guild
                thread = await guild.fetch_channel(int(forum_post_id))
                if thread:
                    logger.info(f"Thread existant trouvé: {thread.id}")
                else:
                    logger.warning(f"Thread {forum_post_id} introuvable, création d'un nouveau.")
                    forum_post_id = None  # On recrée
            except (discord.NotFound, ValueError, TypeError) as e:
                logger.warning(f"Thread {forum_post_id} introuvable ({e}), création d'un nouveau.")
                forum_post_id = None  # On recrée
            except Exception as e:
                logger.error(f"Erreur inattendue lors de la récupération du thread {forum_post_id}: {e}")
                forum_post_id = None  # On recrée par sécurité

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
        await send_notification(guild, author_name, char_name, thread.jump_url, is_update=(thread is not None), notify_gm=True, diff_text=diff_text)

        return forum_post_id

    except Exception as e:
        logger.error(f"Erreur lors du traitement de la fiche Discord pour {user_id}: {e}", exc_info=True)
        return None


async def publish_npc_to_discord(bot, guild, npc_data: dict, diff_text: str = None) -> Optional[int]:
    """
    Publie ou met à jour une fiche PNJ sur Discord (Channel Forum dédié).
    """
    try:
        forum_channel = guild.get_channel(NPC_FORUM_CHANNEL_ID)
        if not isinstance(forum_channel, discord.ForumChannel):
            logger.error(f"Le salon NPC {NPC_FORUM_CHANNEL_ID} n'est pas un salon Forum ou est introuvable.")
            try:
                forum_channel = await guild.fetch_channel(NPC_FORUM_CHANNEL_ID)
                if not isinstance(forum_channel, discord.ForumChannel):
                    logger.error(f"Le salon {NPC_FORUM_CHANNEL_ID} récupéré via fetch n'est pas un ForumChannel.")
                    return None
            except Exception as ex:
                logger.error(f"Impossible de fetch le salon NPC {NPC_FORUM_CHANNEL_ID}: {ex}")
                return None
        
        logger.info(f"Salon NPC trouvé: {forum_channel.name} ({forum_channel.id})")

        npc_name = npc_data.get("name", "PNJ Inconnu")
        clan_name = npc_data.get("clan", "")
        if clan_name:
             clan_name = clan_name.capitalize()
        
        image_url = npc_data.get("image_url")

        # Gestion du Tag (Clan)
        tag = None
        if clan_name:
            tag = await get_or_create_tag(forum_channel, clan_name)
        
        applied_tags = [tag] if tag else []

        # Construction du contenu
        # Pour les PNJ, on fait simple : Embed dans le premier message (si possible) ou texte formaté
        # Comme create_new_thread prend content_parts (list[str]), on va formater de la même façon
        
        content_parts = []
        
        # En-tête
        header = f"**{npc_name}**"
        if clan_name:
            header += f"\n*Clan {clan_name}*"
        if npc_data.get("blood_potency"):
            header += f" • *Puissance du Sang {npc_data['blood_potency']}*"
        
        content_parts.append(header)
        
        # Disciplines (si présentes)
        disciplines = npc_data.get("disciplines", {})
        if disciplines:
            disc_text = "**Disciplines**\n"
            for disc, level in disciplines.items():
                disc_text += f"- {disc.capitalize()}: {level}\n"
            content_parts.append(disc_text)

        # Contenu de la fiche (Bio/Histoire) si présent
        sheet_data = npc_data.get("sheet_data")
        if sheet_data:
            # Formater comme une fiche joueur
            # On passe le nom du PNJ comme auteur par défaut
            sheet_parts = format_sheet_content(sheet_data, npc_name)
            content_parts.extend(sheet_parts)
        elif npc_data.get("description"):
            # Fallback simple
            content_parts.append(f"**Description**\n{format_paragraph(npc_data['description'])}")

        # Vérifier si un post existe déjà
        forum_post_id = npc_data.get("forum_post_id")
        thread = None

        if forum_post_id:
            try:
                thread = await guild.fetch_channel(int(forum_post_id))
            except Exception:
                forum_post_id = None

        if thread:
            # MISE À JOUR
            await update_existing_thread(thread, npc_name, applied_tags, image_url, content_parts)
            logger.info(f"Fiche PNJ mise à jour pour {npc_name} (Thread {thread.id})")
        else:
            # CRÉATION
            thread = await create_new_thread(forum_channel, npc_name, applied_tags, image_url, content_parts)
            forum_post_id = thread.id
            logger.info(f"Fiche PNJ créée pour {npc_name} (Thread {thread.id})")

        # Notification (SANS PING MJ pour les PNJ)
        await send_notification(guild, "MJ", npc_name, thread.jump_url, is_update=(thread is not None), notify_gm=False, diff_text=diff_text)

        return forum_post_id

    except Exception as e:
        logger.error(f"Erreur publication PNJ Discord: {e}", exc_info=True)
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
        # Convertir SequenceProxy en list pour l'addition
        updated_tags = list(forum_channel.available_tags) + [new_tag]
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
    
    # Découper par ligne
    paragraphs = []
    for line in text.split('\n'):
        clean_line = line.strip()
        if clean_line:
            paragraphs.append(f"*{clean_line}*")
        else:
            # Garder les sauts de ligne (Discord les affiche)
            paragraphs.append("")
    
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
    logger.info(f"Mise à jour du thread {thread.id} pour {title}")
    
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
        logger.warning(f"Message initial introuvable pour le thread {thread.id}, création d'un nouveau message image")
        # Si le message initial est introuvable, on en crée un nouveau avec l'image
        new_starter_content = image_url if image_url else f"Fiche de {title}"
        await thread.send(content=new_starter_content)
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour du message initial: {e}")

    # Supprimer les anciens messages du bot
    # Note: On utilise un after=thread.id pour ne pas toucher au message initial (image)
    # STRATÉGIE AMÉLIORÉE : On récupère tous les messages et on supprime tout sauf le premier
    bot_id = thread.guild.me.id
    messages_to_delete = []
    
    try:
        # On récupère l'historique (limit=100 devrait suffire pour une fiche, sinon on augmentera)
        # On ne filtre pas par 'after' ici pour être sûr de tout voir, mais on protégera le premier message
        all_messages = [msg async for msg in thread.history(limit=100, oldest_first=True)]
        
        if all_messages:
            starter_message = all_messages[0]
            
            for message in all_messages:
                # On ne touche pas au premier message (l'image/titre)
                if message.id == starter_message.id:
                    continue
                    
                # On supprime seulement les messages du bot
                if message.author.id == bot_id:
                    messages_to_delete.append(message)
        
        # Supprimer les messages
        if messages_to_delete:
            logger.info(f"Suppression de {len(messages_to_delete)} anciens messages")
            # Batch delete si possible (moins de 14 jours)
            # Sinon suppression un par un
            try:
                # delete_messages ne marche qu'avec des messages < 14 jours
                # On tente, et si ça fail on fallback sur un par un
                await thread.delete_messages(messages_to_delete)
            except (discord.HTTPException, discord.Forbidden):
                for msg in messages_to_delete:
                    try:
                        await msg.delete()
                    except Exception as e:
                        logger.warning(f"Impossible de supprimer le message {msg.id}: {e}")
            
    except Exception as e:
        logger.error(f"Erreur lors du nettoyage du thread: {e}")

    # Poster les nouvelles parties de texte
    logger.info(f"Envoi de {len(content_parts)} nouveaux messages")
    for part in content_parts:
        await thread.send(content=part)


def calculate_diff(old_data: dict, new_data: dict) -> str:
    """
    Compare deux dictionnaires et retourne un texte au format diff Markdown.
    Ignore les champs techniques non pertinents pour l'utilisateur.
    """
    if not old_data:
        old_data = {}
    if not new_data:
        new_data = {}

    # Champs à surveiller
    fields_to_check = {
        "name": "Nom",
        "age": "Âge",
        "sex": "Sexe",
        "clan": "Clan",
        "physical_desc": "Description Physique",
        "mental_desc_pre": "Mental (Avant)",
        "mental_desc_post": "Mental (Après)",
        "history": "Histoire",
        "image_url": "Image",
        "status": "Statut",
        "disciplines": "Disciplines",
        "rituals": "Rituels"
    }

    diff_lines = []

    # Comparaison champ par champ
    for key, label in fields_to_check.items():
        old_val = old_data.get(key)
        new_val = new_data.get(key)
        
        # Normalisation pour comparaison (strip les strings)
        if isinstance(old_val, str): old_val = old_val.strip()
        if isinstance(new_val, str): new_val = new_val.strip()
        
        # Cas spéciaux pour JSON/Dicts (Disciplines, Rituels)
        if key in ["disciplines", "rituals"]:
            # On pourrait faire une comparaison plus fine ici, mais str() suffit pour l'instant
            if str(old_val) != str(new_val):
                diff_lines.append(f"# Modification : {label}")
                diff_lines.append(f"- Ancien : {old_val}")
                diff_lines.append(f"+ Nouveau : {new_val}")
                diff_lines.append("")
            continue
            
        if old_val != new_val:
            # Si c'était vide avant
            if not old_val and new_val:
                diff_lines.append(f"# Ajout : {label}")
                diff_lines.append(f"+ {new_val}")
            # Si c'est vidé
            elif old_val and not new_val:
                diff_lines.append(f"# Suppression : {label}")
                diff_lines.append(f"- {old_val}")
            # Si modifié
            else:
                diff_lines.append(f"# Modification : {label}")
                diff_lines.append(f"- {old_val}")
                diff_lines.append(f"+ {new_val}")
            
            diff_lines.append("") # Ligne vide pour aérer

    return "\n".join(diff_lines)

async def send_notification(guild: discord.Guild, author_name: str, char_name: str, url: str, is_update: bool, notify_gm: bool = True, diff_text: str = None):
    """
    Envoie une notification dans le salon dédié.
    Si diff_text est présent, utilise le nouveau salon SHEET_LOG_CHANNEL_ID.
    Sinon (ou pour RP), utilise LOG_CHANNEL_ID (si défini ailleurs) ou fallback.
    """
    
    # Choix du salon
    # Si c'est une mise à jour de fiche (indiqué par la présence de diff_text ou le contexte), on va dans le channel dédié
    # Note: L'appelant doit décider, mais ici on va assumer que si on a un diff, c'est une fiche.
    
    target_channel_id = SHEET_LOG_CHANNEL_ID if (is_update or diff_text) else LOG_CHANNEL_ID
    
    # Si c'est une création (pas de diff), on met aussi dans le nouveau salon si c'est une fiche
    # Mais attend, le prompt dit : "Garder la fonctionnalité RP dans l'ancien, et Sheet Updates (et création j'imagine) dans le nouveau"
    # Pour l'instant on se base sur le target_channel_id défini ci-dessus.
    
    log_channel = guild.get_channel(target_channel_id)
    if not log_channel:
        # Fallback sur l'ancien si le nouveau n'est pas trouvé
        log_channel = guild.get_channel(LOG_CHANNEL_ID)
        if not log_channel:
            return

    action = "modifiée" if is_update else "créée"
    role_mention = f"<@&{NOTIFICATION_ROLE_ID}>" if notify_gm else ""
    
    base_embed = discord.Embed(
        title=f"Fiche de personnage {action}",
        description=f"La fiche de **{char_name}** (joué par {author_name}) a été {action}.",
        color=0x00FF00 if not is_update else 0xFFA500
    )
    base_embed.add_field(name="Lien vers la fiche", value=f"[Cliquez ici pour voir la fiche]({url})", inline=False)
    
    # Si pas de diff (création ou pas de changement détecté), on envoie simple
    if not diff_text:
        await log_channel.send(content=role_mention, embed=base_embed)
        return

    # Si on a un diff, on doit le paginer
    # Stratégie :
    # 1. Envoyer l'embed principal avec le lien
    # 2. Envoyer les détails des changements (potentiellement multi-messages)
    
    # On ajoute un titre pour les changements
    base_embed.add_field(name="Résumé", value="Des modifications ont été détectées. Voir ci-dessous pour le détail.", inline=False)
    await log_channel.send(content=role_mention, embed=base_embed)
    
    # Préparer les chunks de diff pour les messages suivants
    # Discord limite : 2000 chars par message content, 4096 par embed description.
    # On va utiliser des Embeds pour le style "diff" (bloc de code)
    
    # Découpage par blocs de ~4000 caractères (marge de sécurité pour Embed Description)
    # Le format diff ```diff ... ``` prend de la place.
    
    max_chunk_size = 4000
    chunks = []
    current_chunk = ""
    
    lines = diff_text.split('\n')
    for line in lines:
        if len(current_chunk) + len(line) + 1 > max_chunk_size:
            chunks.append(current_chunk)
            current_chunk = line
        else:
            if current_chunk:
                current_chunk += "\n" + line
            else:
                current_chunk = line
    if current_chunk:
        chunks.append(current_chunk)
        
    # Envoyer les chunks
    for i, chunk in enumerate(chunks):
        diff_embed = discord.Embed(
            title=f"Détails des modifications ({i+1}/{len(chunks)})",
            description=f"```diff\n{chunk}\n```",
            color=0xFFA500
        )
        await log_channel.send(embed=diff_embed)


async def delete_discord_sheet(bot, user_id: int, guild_id: int):
    """
    Supprime la fiche de personnage Discord d'un joueur.
    Supprime le thread et met à jour la base de données.
    """
    try:
        guild = bot.get_guild(guild_id)
        if not guild:
            logger.error(f"Serveur {guild_id} introuvable pour la suppression de la fiche de {user_id}")
            return

        # Récupérer la fiche depuis la base de données
        from utils.database import get_character_sheet
        sheet = await get_character_sheet(user_id, guild_id)
        
        if not sheet or not sheet.get("forum_post_id"):
            logger.info(f"Pas de fiche Discord à supprimer pour {user_id}")
            return

        forum_post_id = sheet["forum_post_id"]
        
        # Supprimer le thread
        try:
            thread = await guild.fetch_channel(int(forum_post_id))
            if thread:
                await thread.delete(reason="Suppression de la fiche suite à reset")
                logger.info(f"Fiche Discord supprimée pour {user_id} (Thread {thread.id})")
        except discord.NotFound:
            logger.warning(f"Thread {forum_post_id} introuvable lors de la suppression")
        except Exception as e:
            logger.error(f"Erreur suppression thread Discord pour {user_id}: {e}")

        # Nettoyer la base de données (supprimer forum_post_id)
        from utils.database import save_character_sheet
        sheet["forum_post_id"] = None
        await save_character_sheet(user_id, guild_id, sheet)
        
    except Exception as e:
        logger.error(f"Erreur suppression fiche Discord complète pour {user_id}: {e}", exc_info=True)


async def delete_google_sheet_character(user_id: int) -> bool:
    """
    Supprime le personnage du Google Sheet via l'API Apps Script.
    Retourne True si succès.
    """
    try:
        url = f"{GOOGLE_SHEETS_API_URL}?action=delete&userId={user_id}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("deleted"):
                        logger.info(f"Personnage supprimé du Google Sheet pour {user_id}")
                        return True
                    elif data.get("error") == "Personnage non trouvé":
                         logger.info(f"Aucun personnage trouvé dans Google Sheet pour {user_id} (déjà supprimé ?)")
                         return True
                    else:
                        logger.warning(f"Échec suppression Google Sheet pour {user_id}: {data.get('error', 'Inconnu')}")
                else:
                    logger.error(f"Erreur HTTP {response.status} lors de la suppression Google Sheet pour {user_id}")
    except Exception as e:
        logger.error(f"Erreur exception suppression Google Sheet pour {user_id}: {e}")
    
    return False
