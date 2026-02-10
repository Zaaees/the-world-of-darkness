import logging
from typing import Dict, Any, Optional
import discord

import aiosqlite

from modules.werewolf.models.store import WerewolfData, create_werewolf_data, get_werewolf_data

logger = logging.getLogger(__name__)

async def create_character(db: aiosqlite.Connection, character_data: Dict[str, Any], bot: Optional[discord.Client] = None) -> WerewolfData:
    """
    Crée un nouveau personnage loup-garou.
    
    Args:
        db: Connexion base de données.
        character_data: Dictionnaire contenant les données du personnage.
        
    Returns:
        L'objet WerewolfData créé.
    
    Raises:
        ValueError: Si les données sont invalides.
    """
    user_id = str(character_data.get('user_id'))
    logger.info(f"Creating character for user {user_id}")
    
    # Supprimer l'ancien personnage s'il existe (cas de re-création après reset)
    # Chaque DELETE dans son propre try pour éviter qu'une table manquante bloque les autres
    try:
        await db.execute("DELETE FROM werewolf_player_gifts WHERE user_id = ?", (user_id,))
    except Exception:
        pass  # Table peut ne pas exister
    
    try:
        await db.execute("DELETE FROM werewolf_renown WHERE user_id = ?", (user_id,))
    except Exception:
        pass  # Table peut ne pas exister
    
    try:
        await db.execute("DELETE FROM werewolf_data WHERE user_id = ?", (user_id,))
        await db.commit()
        logger.info(f"Ancien personnage werewolf supprimé pour user {user_id}")
    except Exception as e:
        logger.warning(f"Erreur suppression werewolf_data pour {user_id}: {e}")


    
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

    
    # Persist to SQLite
    try:
        await create_werewolf_data(db, new_character)
    except Exception as e:
        logger.error(f"Failed to persist character for user {user_id}: {e}")
        raise


    # Sync to Google Sheets (pour le reset instantané comme vampire)
    try:
        from utils.database import set_player
        # guild_id est passé dans character_data ou 0 par défaut
        guild_id = character_data.get('guild_id', 0)
        await set_player(
            int(user_id), 
            guild_id, 
            race="werewolf",
            auspice=character_data['auspice'],
            name=character_data['name']
        )
        logger.info(f"Werewolf character synced to Google Sheets for user {user_id}")
    except Exception as e:
        # Log but don't fail - SQLite is the primary store
        logger.warning(f"Failed to sync werewolf to Google Sheets for user {user_id}: {e}")


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


async def get_character(db: aiosqlite.Connection, user_id: str) -> Optional[WerewolfData]:
    """
    Récupère un personnage loup-garou par user_id.
    La table werewolf_data dans SQLite est la source de vérité.
    Si le personnage a été supprimé via !reset (delete_werewolf_data), 
    cette fonction retourne None directement.
    
    Args:
        db: Connexion base de données.
        user_id: L'ID Discord de l'utilisateur.
        
    Returns:
        L'objet WerewolfData si trouvé, None sinon.
    """
    logger.info(f"Retrieving character for user {user_id}")
    
    # Fetch from Local SQLite (authoritative store for werewolf data)
    character = await get_werewolf_data(db, user_id)
    if not character:
        return None

    return character

async def update_character(db: aiosqlite.Connection, user_id: str, updates: Dict[str, Any]) -> Optional[WerewolfData]:
    """
    Met à jour un personnage loup-garou existant.
    
    Args:
        db: Connexion base de données.
        user_id: L'ID Discord de l'utilisateur.
        updates: Dictionnaire des champs à mettre à jour.
        
    Returns:
        L'objet WerewolfData mis à jour si trouvé, None sinon.
    """
    logger.info(f"Updating character for user {user_id} with {updates}")
    from modules.werewolf.models.store import update_werewolf_data
    
    await update_werewolf_data(db, user_id, updates)
    return await get_werewolf_data(db, user_id)
