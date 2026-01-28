import json
import os
import aiosqlite
from typing import List, Optional, Dict, Any
from pathlib import Path
from modules.werewolf.models.store import WerewolfPlayerGift

# Chemin vers le catalogue de dons
GIFTS_CATALOGUE_PATH = Path("modules/werewolf/assets/gifts_data.json")

def load_gift_catalogue() -> List[Dict[str, Any]]:
    """
    Charge le catalogue des dons depuis le fichier JSON.
    """
    if not GIFTS_CATALOGUE_PATH.exists():
        return []
    
    with open(GIFTS_CATALOGUE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

async def get_player_gifts(db: aiosqlite.Connection, user_id: str) -> List[Dict[str, Any]]:
    """
    Récupère les dons débloqués par un joueur, enrichis avec les données du catalogue.
    """
    # Charger le catalogue
    catalogue = load_gift_catalogue()
    catalogue_dict = {gift['id']: gift for gift in catalogue}
    
    # Récupérer les déblocages en base
    db.row_factory = aiosqlite.Row
    async with db.execute(
        "SELECT * FROM werewolf_player_gifts WHERE user_id = ?", 
        (user_id,)
    ) as cursor:
        rows = await cursor.fetchall()
        
    player_gifts = []
    for row in rows:
        gift_id = row['gift_id']
        gift_info = catalogue_dict.get(gift_id, {"id": gift_id, "name_fr": "Inconnu"})
        
        # Fusionner les données
        player_gifts.append({
            **gift_info,
            "unlocked_at": row['unlocked_at'],
            "unlocked_by": row['unlocked_by']
        })
        
    return player_gifts

async def unlock_gift(db: aiosqlite.Connection, user_id: str, gift_id: str, unlocked_by: str) -> bool:
    """
    Débloque un don pour un joueur.
    """
    try:
        await db.execute(
            "INSERT INTO werewolf_player_gifts (user_id, gift_id, unlocked_by) VALUES (?, ?, ?)",
            (user_id, gift_id, unlocked_by)
        )
        await db.commit()
        return True
    except aiosqlite.IntegrityError:
        # Déjà débloqué
        return False
    except Exception:
        return False

async def lock_gift(db: aiosqlite.Connection, user_id: str, gift_id: str) -> bool:
    """
    Verrouille (retire) un don pour un joueur.
    """
    try:
        await db.execute(
            "DELETE FROM werewolf_player_gifts WHERE user_id = ? AND gift_id = ?",
            (user_id, gift_id)
        )
        await db.commit()
        return True
    except Exception:
        return False
