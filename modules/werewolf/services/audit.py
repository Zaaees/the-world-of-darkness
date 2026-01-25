
from typing import List, Any
import logging
from dataclasses import fields
from modules.werewolf.models.store import WerewolfData
from datetime import datetime

logger = logging.getLogger(__name__)

AUDIT_CHANNEL_ID = 1457856977660022844

def calculate_diff(old_data: WerewolfData, new_data: WerewolfData) -> List[str]:
    """
    Calcule la liste des différences entre deux instances de WerewolfData.
    Retourne une liste de chaînes formatées "champ: ancien -> nouveau".
    """
    changes = []
    
    # Liste des champs à ignorer pour le diff utilisateur (surtout technique)
    ignored_fields = {'updated_at', 'created_at', 'user_id'}
    
    for field in fields(WerewolfData):
        field_name = field.name
        if field_name in ignored_fields:
            continue
            
        old_val = getattr(old_data, field_name)
        new_val = getattr(new_data, field_name)
        
        # Gestion des Enums qui peuvent être comparés directement, 
        # mais on veut afficher leur valeur string proprement.
        old_str = old_val.value if hasattr(old_val, 'value') else str(old_val)
        new_str = new_val.value if hasattr(new_val, 'value') else str(new_val)
        
        if old_val != new_val:
            # Pour les changements longs (story), on peut tronquer ou indiquer juste "modifié"
            # Mais AC demande un diff simplifié.
            
            if field_name == 'story':
                changes.append(f"{field_name}: (Histoire modifiée)")
            else:
                changes.append(f"{field_name}: {old_str} -> {new_str}")
                
    return changes

async def log_character_update(bot, user, character_data, changes: List[str]):
    """
    Envoie un log des modifications dans le canal d'audit.
    Best effort : ne lève pas d'exception si échec.
    """
    if not changes:
        return

    try:
        channel = bot.get_channel(AUDIT_CHANNEL_ID)
        if not channel:
            logger.error(f"Audit channel {AUDIT_CHANNEL_ID} not found.")
            return

        timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
        
        # Construction du message
        # AC 4: Nom du joueur, Nom du Personnage, Date/Heure, et un Résumé des changements
        # AC 5: Tout changement est loggé, même mineur.
        
        embed_description = "\n".join(f"- {change}" for change in changes)
        
        message = (
            f"📝 **Modification de Fiche**\n"
            f"**Joueur :** {user.display_name} (ID: {user.id})\n"
            f"**Personnage :** {character_data.name}\n"
            f"**Date :** {timestamp}\n\n"
            f"**Changements :**\n"
            f"{embed_description}"
        )
        
        await channel.send(message)
        logger.info(f"Audit log sent for character {character_data.name} by {user.display_name}")

    except Exception as e:
        logger.error(f"Failed to send audit log: {e}")
