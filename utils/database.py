"""
Système de persistance pour le bot Monde des Ténèbres.
Utilise SQLite avec aiosqlite pour les opérations asynchrones.
Synchronise avec Google Sheets pour le site web.
"""

import aiosqlite
import aiohttp
import json
import urllib.parse
from pathlib import Path
from typing import Optional
import logging
import math
import uuid
from data.blood_actions import SATURATION_THRESHOLDS, advance_saturation
from data.config import (
    VITAE_QUICK_FEED_RATIO,
    VITAE_QUICK_FEED_COOLDOWN_HOURS,
    VITAE_SCENE_ONLY_POTENCY,
    VITAE_UPKEEP_INTERVAL_DAYS,
    VITAE_UPKEEP_MAX_PER_CHECK,
)
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)

from utils.sheets_client import sheets_request


async def get_from_google_sheets(user_id: int) -> Optional[dict]:
    result = await sheets_request("get", userId=str(user_id))
    return result.get("character")


async def save_to_google_sheets(user_id: int, data: dict):
    await sheets_request("save", userId=str(user_id), data=data)


async def sync_to_google_sheets(user_id: int, data: dict):
    """Alias de save_to_google_sheets pour compatibilité."""
    await save_to_google_sheets(user_id, data)

# Gestion du stockage persistant (Fly.io vs Local)
STORAGE_PATH = Path("/app/storage")
if STORAGE_PATH.exists():
    DATABASE_PATH = STORAGE_PATH / "world_of_darkness.db"
    logger.info(f"Utilisation du stockage persistant : {DATABASE_PATH}")
else:
    DATABASE_PATH = Path(__file__).parent.parent / "data" / "world_of_darkness.db"
    logger.info(f"Utilisation du stockage local : {DATABASE_PATH}")


async def init_database():
    """Initialise la base de données avec les tables nécessaires."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Table des joueurs
        await db.execute("""
            CREATE TABLE IF NOT EXISTS players (
                user_id INTEGER,
                guild_id INTEGER NOT NULL,
                race TEXT,
                clan TEXT,
                auspice TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id)
            )
        """)

        # Table de la Soif (Vampires) - persistante entre les scènes
        await db.execute("""
            CREATE TABLE IF NOT EXISTS vampire_soif (
                user_id INTEGER,
                guild_id INTEGER NOT NULL,
                soif_level INTEGER DEFAULT 0,
                blood_potency INTEGER DEFAULT 1,
                saturation_points INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id)
            )
        """)

        # Migration : ajouter les colonnes si elles n'existent pas
        try:
            await db.execute("ALTER TABLE vampire_soif ADD COLUMN blood_potency INTEGER DEFAULT 1")
        except Exception:
            pass  # Colonne existe déjà
        try:
            await db.execute("ALTER TABLE vampire_soif ADD COLUMN saturation_points INTEGER DEFAULT 0")
        except Exception:
            pass  # Colonne existe déjà
        for column in ("last_fed TIMESTAMP", "last_upkeep TIMESTAMP"):
            try:
                await db.execute(f"ALTER TABLE vampire_soif ADD COLUMN {column}")
            except Exception:
                pass  # Colonne existe déjà

        # Table de la Rage (Loups-Garous) - liée à une scène (salon)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS werewolf_rage (
                user_id INTEGER,
                guild_id INTEGER NOT NULL,
                channel_id INTEGER NOT NULL,
                rage_level INTEGER DEFAULT 0,
                is_enraged BOOLEAN DEFAULT FALSE,
                maintien_counter INTEGER DEFAULT 0,
                last_message_id INTEGER,
                others_spoke_since BOOLEAN DEFAULT FALSE,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id, channel_id)
            )
        """)

        # Index pour les performances
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_players_guild ON players(guild_id)"
        )
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_vampire_guild ON vampire_soif(guild_id)"
        )
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_werewolf_channel ON werewolf_rage(channel_id)"
        )
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_werewolf_guild ON werewolf_rage(guild_id)"
        )

        # Table des fiches de personnage
        await db.execute("""
            CREATE TABLE IF NOT EXISTS character_sheets (
                user_id INTEGER,
                guild_id INTEGER,
                name TEXT,
                age TEXT,
                sex TEXT,
                physical_desc TEXT,
                mental_desc_pre TEXT,
                mental_desc_post TEXT,
                history TEXT,
                image_url TEXT,
                forum_post_id INTEGER,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id)
            )
        """)

        # Table des rituels appris
        await db.execute("""
            CREATE TABLE IF NOT EXISTS player_rituals (
                user_id INTEGER,
                guild_id INTEGER,
                ritual_id TEXT,
                learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id, ritual_id)
            )
        """)

        # Table des PNJ (NPCs)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS npcs (
                id TEXT PRIMARY KEY,
                guild_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                clan TEXT,
                blood_potency INTEGER DEFAULT 1,
                image_url TEXT,
                description TEXT,
                disciplines TEXT, -- JSON
                rituals TEXT, -- JSON
                sheet_data TEXT, -- JSON (Données complètes de la fiche: histoire, bio, etc.)
                status TEXT DEFAULT 'private', -- 'private', 'public'
                forum_post_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Migration : ajouter la colonne image_url si elle n'existe pas
        try:
            await db.execute("ALTER TABLE character_sheets ADD COLUMN image_url TEXT")
        except Exception:
            pass
            
        try:
            await db.execute("ALTER TABLE character_sheets ADD COLUMN starter_pack_answers TEXT")
        except Exception:
            pass
            
        # Migration : ajouter sheet_data à npcs
        try:
            await db.execute("ALTER TABLE npcs ADD COLUMN sheet_data TEXT")
        except Exception:
            pass

        await db.commit()
        logger.info("Base de données initialisée avec succès")

    # Initialiser les tables des actions de sang
    await init_blood_actions_tables()


# ============================================
# Fonctions pour les joueurs
# ============================================


async def get_player(user_id: int, guild_id: int) -> Optional[dict]:
    """
    Récupère les informations d'un joueur. 
    Priorité: SQLite Local > Google Sheets
    """
    # 1. Essai Local SQLite
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute("SELECT race, clan, auspice FROM players WHERE user_id = ? AND guild_id = ?", (user_id, guild_id))
        row = await cursor.fetchone()
        if row:
            # Found in local cache!
            return {
                "user_id": user_id,
                "guild_id": guild_id,
                "race": row[0],
                "clan": row[1],
                "auspice": row[2]
            }

    # 2. Fallback Google Sheets
    character = await get_from_google_sheets(user_id)
    if not character:
        return None

    # Adapt & Cache formatted dict
    player_data = {
        "user_id": user_id,
        "guild_id": guild_id,
        "race": character.get("race"),
        "clan": character.get("clan"),
        "auspice": character.get("auspice"),
    }
    
    # Cache it for next time!
    try:
        await set_player(user_id, guild_id, race=player_data["race"], clan=player_data["clan"], auspice=player_data["auspice"])
    except Exception as e:
        logger.warning(f"Failed to cache player to SQLite: {e}")

    return player_data


async def set_player(
    user_id: int,
    guild_id: int,
    race: Optional[str] = None,
    clan: Optional[str] = None,
    auspice: Optional[str] = None,
    name: Optional[str] = None,
):
    """Crée ou met à jour un joueur dans Google Sheets ET en local."""
    # 1. Mise à jour Locale (Source de vérité immédiate)
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Lire l'existant pour préserver les champs non modifiés
        cursor = await db.execute("SELECT * FROM players WHERE user_id = ? AND guild_id = ?", (user_id, guild_id))
        row = await cursor.fetchone()
        
        current_race = row[2] if row else None
        current_clan = row[3] if row else None
        current_auspice = row[4] if row else None
        
        new_race = race if race is not None else current_race
        new_clan = clan if clan is not None else current_clan
        new_auspice = auspice if auspice is not None else current_auspice
        
        await db.execute("""
            INSERT INTO players (user_id, guild_id, race, clan, auspice, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                race = excluded.race,
                clan = excluded.clan,
                auspice = excluded.auspice,
                updated_at = CURRENT_TIMESTAMP
        """, (user_id, guild_id, new_race, new_clan, new_auspice))
        await db.commit()

    # Send only changed fields; never overwrite progression from an earlier read.
    changes = {key: value for key, value in {'race': race, 'clan': clan, 'auspice': auspice, 'name': name}.items() if value is not None}
    if changes:
        await save_to_google_sheets(user_id, changes)


async def delete_player(user_id: int, guild_id: int, keep_race: bool = False):
    """
    Supprime un joueur et toutes ses données associées depuis Google Sheets.

    Args:
        keep_race: Si True, garde le champ 'race' pour permettre l'accès au site web
    """
    # Récupérer la race actuelle si on doit la garder
    current_race = ""
    if keep_race:
        character = await get_from_google_sheets(user_id)
        if character:
            current_race = character.get("race", "")

    # Sauvegarder un objet avec tous les champs explicitement vides pour réinitialiser
    cleared_data = {
        "race": current_race,  # Garde la race si keep_race=True
        "clan": "",
        "auspice": "",
        "tribe": "",
        "breed": "",
        "name": "",
        "rank": 0,
        "bloodPotency": 0,
        "saturationPoints": 0,
        "soif": 0,
        "completedActions": [],
        "pendingActions": [],
        "cooldowns": {},
        "ghouls": [],
        "history": "",
        "notes": "",
    }
    await save_to_google_sheets(user_id, cleared_data)

    # Réinitialiser aussi les données de session SQLite
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Réinitialiser la table players (locale cache)
        # AU LIEU DE SUPPRIMER, on remplace par des valeurs vides.
        # Cela force get_player à lire ces valeurs vides (rapide) au lieu de fallback sur Google Sheets (lent/stale).
        # C'est la clé pour empêcher la résurrection zombie.
        
        new_race = current_race if keep_race else None
        
        # On utilise INSERT OR REPLACE pour s'assurer que l'enregistrement existe en état "vide"
        await db.execute("""
            INSERT INTO players (user_id, guild_id, race, clan, auspice, updated_at)
            VALUES (?, ?, ?, NULL, NULL, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                race = excluded.race,
                clan = NULL,
                auspice = NULL,
                updated_at = CURRENT_TIMESTAMP
        """, (user_id, guild_id, new_race))

        # Réinitialiser vampire_soif
        await db.execute(
            "DELETE FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        # Réinitialiser werewolf_rage pour tous les canaux
        await db.execute(
            "DELETE FROM werewolf_rage WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        # Supprimer la fiche de personnage locale
        await db.execute(
            "DELETE FROM character_sheets WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        # Supprimer l'historique des actions de sang
        await db.execute(
            "DELETE FROM blood_action_history WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        # Supprimer les actions complétées
        await db.execute(
            "DELETE FROM completed_unique_actions WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        await db.commit()


# ============================================
# Fonctions pour les vampires
# ============================================


async def get_vampire_data(user_id: int, guild_id: int) -> dict:
    """
    Récupère toutes les données vampire d'un joueur.
    - Données persistantes (clan, race, bloodPotency) depuis Google Sheets
    - Données de session (soif) depuis SQLite (rapide)
    - Synchronise la BP de Google Sheets vers SQLite si différente
    """
    # Récupérer les données persistantes depuis Google Sheets
    character = await get_from_google_sheets(user_id)
    if not character:
        return {}

    # Vérifier si c'est un vampire: soit race == "vampire", soit présence d'un clan
    # (le champ race peut être perdu lors de certaines sauvegardes Google Sheets)
    is_vampire = character.get("race") == "vampire" or character.get("clan") is not None
    if not is_vampire:
        return {}

    # BP de référence depuis Google Sheets (source de vérité)
    raw_bp = character.get("bloodPotency")
    logger.info(f"[get_vampire_data] user={user_id} raw bloodPotency from GS: {raw_bp} (type: {type(raw_bp).__name__})")
    gs_blood_potency = int(raw_bp) if raw_bp is not None else 1
    gs_saturation = int(character.get("saturationPoints", 0))

    # Récupérer les données de session depuis SQLite (rapide)
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT soif_level, blood_potency, saturation_points FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        if row:
            soif_level, sqlite_blood_potency, sqlite_saturation = row
            sqlite_blood_potency = int(sqlite_blood_potency) if sqlite_blood_potency else 1
            logger.info(f"[get_vampire_data] user={user_id} SQLite BP={sqlite_blood_potency}, GS BP={gs_blood_potency}")
            # Synchroniser si Google Sheets a une BP différente (source de vérité)
            if sqlite_blood_potency != gs_blood_potency:
                logger.info(f"[get_vampire_data] user={user_id} BP mismatch! Syncing GS -> SQLite: {gs_blood_potency}")
                await set_blood_potency(user_id, guild_id, gs_blood_potency)
        else:
            # Initialiser SQLite avec les valeurs de Google Sheets
            logger.info(f"[get_vampire_data] user={user_id} No SQLite row, initializing with GS BP={gs_blood_potency}")
            
            # Initialiser au MAX de Vitae par défaut (nouveau système)
            initial_vitae = get_max_vitae(gs_blood_potency)
            soif_level = initial_vitae
            
            await set_blood_potency(user_id, guild_id, gs_blood_potency)
            await set_vampire_soif(user_id, guild_id, initial_vitae)

    logger.info(f"[get_vampire_data] user={user_id} Returning BP={gs_blood_potency}")
    return {
        "user_id": user_id,
        "guild_id": guild_id,
        "race": "vampire",
        "clan": character.get("clan"),
        "soif_level": soif_level,
        "blood_potency": gs_blood_potency,
        "saturation_points": gs_saturation,
    }


async def set_vampire_soif(user_id: int, guild_id: int, soif_level: int):
    """Définit le niveau de soif d'un vampire dans SQLite (rapide, pour interactions temps réel)."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Récupérer la blood potency actuelle
        cursor = await db.execute(
            "SELECT blood_potency FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        blood_potency = row[0] if row else 1

        # Déterminer le maximum selon la BP
        max_vitae = get_max_vitae(blood_potency)

        # S'assurer que le niveau n'est pas en dessous de 0 et pas au-dessus du max
        soif_level = max(0, min(soif_level, max_vitae))

        # Mettre à jour ou insérer dans SQLite
        await db.execute(
            """
            INSERT INTO vampire_soif (user_id, guild_id, soif_level, blood_potency, saturation_points, last_updated)
            VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                soif_level = excluded.soif_level,
                last_updated = CURRENT_TIMESTAMP
            """,
            (user_id, guild_id, soif_level, blood_potency),
        )
        await db.commit()


async def get_vampire_soif(user_id: int, guild_id: int) -> int:
    """Récupère le niveau de soif actuel depuis SQLite (rapide, pour interactions temps réel)."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT soif_level FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        return row[0] if row else 0


async def set_blood_potency(user_id: int, guild_id: int, blood_potency: int):
    """Définit la puissance du sang d'un vampire dans SQLite (rapide)."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        blood_potency = max(1, min(blood_potency, 5))

        # Mettre à jour ou insérer
        await db.execute(
            """
            INSERT INTO vampire_soif (user_id, guild_id, blood_potency, soif_level, saturation_points, last_updated)
            VALUES (?, ?, ?, 0, 0, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                blood_potency = excluded.blood_potency,
                last_updated = CURRENT_TIMESTAMP
            """,
            (user_id, guild_id, blood_potency),
        )
        await db.commit()

        # Un changement de rang agrandit (ou réduit) la réserve, il ne la remplit jamais :
        # la Vitae en réserve est conservée et seulement plafonnée au nouveau maximum.
        cursor = await db.execute(
            "SELECT soif_level FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        if row and row[0] is not None:
            max_vitae = get_max_vitae(blood_potency)
            if row[0] > max_vitae:
                await set_vampire_soif(user_id, guild_id, max_vitae)


async def get_blood_potency(user_id: int, guild_id: int) -> int:
    """Récupère la puissance du sang depuis SQLite (rapide)."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT blood_potency FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        return row[0] if row else 1


async def add_saturation_points(user_id: int, guild_id: int, points: int) -> dict:
    """
    Ajoute des points de saturation et gère l'épaississement du sang.
    Retourne les informations sur la mutation si elle a lieu.
    """
    # Récupérer les données existantes
    character = await get_from_google_sheets(user_id) or {}

    current_bp = int(character.get("bloodPotency", 1))
    current_saturation = int(character.get("saturationPoints", 0))

    # Seuils par niveau de BP
    thresholds = SATURATION_THRESHOLDS
    new_bp, new_saturation = advance_saturation(current_bp, current_saturation, points)
    mutated = new_bp != current_bp

    # Mettre à jour les données
    character["bloodPotency"] = new_bp
    character["saturationPoints"] = new_saturation
    character["isMutating"] = False
    character["mutationEndsAt"] = None

    # Sauvegarder dans Google Sheets
    await save_to_google_sheets(user_id, character)

    # Synchroniser la BP dans SQLite si elle a changé
    if mutated:
        await set_blood_potency(user_id, guild_id, new_bp)

    return {
        "mutated": mutated,
        "new_bp": new_bp,
        "new_saturation": new_saturation,
        "threshold": thresholds.get(new_bp - 1) if mutated else thresholds.get(new_bp),
    }


async def get_saturation_points(user_id: int, guild_id: int) -> int:
    """Récupère les points de saturation depuis Google Sheets."""
    character = await get_from_google_sheets(user_id)
    return character.get("saturationPoints", 0) if character else 0


# ============================================
# Fonctions pour les PNJ (NPCs)
# ============================================


async def create_npc(
    guild_id: int,
    name: str,
    clan: Optional[str] = None,
    blood_potency: int = 1,
    image_url: Optional[str] = None,
    description: Optional[str] = None,
    disciplines: dict = None,
    rituals: list = None,
    sheet_data: dict = None,
    status: str = "private",
) -> dict:
    """Crée un nouveau PNJ."""
    npc_id = f"npc_{int(datetime.now().timestamp())}"
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            """
            INSERT INTO npcs (id, guild_id, name, clan, blood_potency, disciplines, rituals, sheet_data, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                npc_id,
                guild_id,
                name,
                clan,
                blood_potency,
                json.dumps(disciplines or {}),
                json.dumps(rituals or []),
                json.dumps(sheet_data or {}),
                status
            )
        )
        await db.commit()
        
    return {"success": True, "npc_id": npc_id}


async def get_npcs(guild_id: int) -> list[dict]:
    """Récupère tous les PNJ d'un serveur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM npcs WHERE guild_id = ? ORDER BY name ASC", (guild_id,)
        )
        rows = await cursor.fetchall()
        
        npcs = []
        for row in rows:
            npc = dict(row)
            # Decoder le JSON
            try:
                npc["disciplines"] = json.loads(npc["disciplines"] or "{}")
                npc["rituals"] = json.loads(npc["rituals"] or "[]")
            except Exception:
                npc["disciplines"] = {}
                npc["rituals"] = []
            npcs.append(npc)
            
        return npcs


async def get_npc(npc_id: str) -> Optional[dict]:
    """Récupère un PNJ par son ID."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM npcs WHERE id = ?", (npc_id,))
        row = await cursor.fetchone()
        
        if not row:
            return None
            
        npc = dict(row)
        try:
            npc["disciplines"] = json.loads(npc["disciplines"] or "{}")
            npc["rituals"] = json.loads(npc["rituals"] or "[]")
        except Exception:
            npc["disciplines"] = {}
            npc["disciplines"] = {}
            npc["rituals"] = []
            
        try:
            npc["sheet_data"] = json.loads(npc.get("sheet_data") or "{}")
        except Exception:
            npc["sheet_data"] = {}
            
        return npc


async def update_npc(npc_id: str, **kwargs) -> dict:
    """Met à jour un PNJ."""
    allowed_fields = [
        "name", "clan", "blood_potency", "image_url", "description",
        "name", "clan", "blood_potency", "image_url", "description",
        "disciplines", "rituals", "sheet_data", "status", "forum_post_id"
    ]
    
    updates = []
    values = []
    
    for field, value in kwargs.items():
        if field in allowed_fields:
            if field in ["disciplines", "rituals", "sheet_data"] and isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            updates.append(f"{field} = ?")
            values.append(value)
            
    if not updates:
        return {"success": False, "error": "Aucun champ à mettre à jour"}
        
    updates.append("updated_at = CURRENT_TIMESTAMP")
    values.append(npc_id)
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Vérifier si le PNJ existe
        cursor = await db.execute("SELECT id FROM npcs WHERE id = ?", (npc_id,))
        if not await cursor.fetchone():
            return {"success": False, "error": "PNJ non trouvé"}
            
        await db.execute(
            f"UPDATE npcs SET {', '.join(updates)} WHERE id = ?",
            tuple(values)
        )
        await db.commit()
        
        return {"success": True}


async def delete_npc(npc_id: str):
    """Supprime un PNJ."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("DELETE FROM npcs WHERE id = ?", (npc_id,))
        await db.commit()
        return {"success": True}


# ============================================
# Fonctions pour les loups-garous
# ============================================


async def get_werewolf_rage(user_id: int, guild_id: int, channel_id: int) -> dict:
    """Récupère l'état de rage d'un loup-garou dans un salon."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM werewolf_rage WHERE user_id = ? AND guild_id = ? AND channel_id = ?",
            (user_id, guild_id, channel_id),
        )
        row = await cursor.fetchone()
        return dict(row) if row else None


async def set_werewolf_rage(
    user_id: int,
    guild_id: int,
    channel_id: int,
    rage_level: int,
    is_enraged: bool = False,
    maintien_counter: int = 0,
    last_message_id: Optional[int] = None,
    others_spoke_since: bool = False,
):
    """Met à jour l'état de rage d'un loup-garou."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        rage_level = max(0, min(rage_level, 5))

        await db.execute(
            """
            INSERT INTO werewolf_rage (
                user_id, guild_id, channel_id, rage_level, is_enraged,
                maintien_counter, last_message_id, others_spoke_since, last_updated
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id, channel_id) DO UPDATE SET
                rage_level = excluded.rage_level,
                is_enraged = excluded.is_enraged,
                maintien_counter = excluded.maintien_counter,
                last_message_id = excluded.last_message_id,
                others_spoke_since = excluded.others_spoke_since,
                last_updated = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                guild_id,
                channel_id,
                rage_level,
                is_enraged,
                maintien_counter,
                last_message_id,
                others_spoke_since,
            ),
        )
        await db.commit()


async def reset_werewolf_rage(user_id: int, guild_id: int, channel_id: int):
    """Réinitialise la rage à 0 dans un salon."""
    await set_werewolf_rage(user_id, guild_id, channel_id, 0, False, 0, None, False)


async def delete_werewolf_rage(user_id: int, guild_id: int, channel_id: int):
    """Supprime les données de rage pour un salon."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            "DELETE FROM werewolf_rage WHERE user_id = ? AND guild_id = ? AND channel_id = ?",
            (user_id, guild_id, channel_id),
        )
        await db.commit()


# ============================================
# Fonctions pour les actions de sang
# ============================================


async def submit_blood_action(
    user_id: int,
    guild_id: int,
    action_id: str,
    action_name: str,
    category: str,
    points: int,
    description: Optional[str] = None,
    submission_id: Optional[str] = None,
    base_points: Optional[int] = None,
) -> str:
    """Soumet une action de sang pour validation (points figés, base du catalogue conservée)."""
    submission_id = submission_id or str(uuid.uuid4())

    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        # Vérifier s'il existe déjà une action en attente pour cet action_id
        cursor = await db.execute(
            """
            SELECT submission_id FROM pending_blood_actions
            WHERE user_id = ? AND guild_id = ? AND action_id = ? AND status = 'pending'
            """,
            (user_id, guild_id, action_id),
        )
        existing = await cursor.fetchone()

        if existing:
            # Retourner l'ID existant au lieu de créer un doublon
            return existing[0]

        # Créer la nouvelle soumission
        await db.execute(
            """
            INSERT INTO pending_blood_actions (
                submission_id, user_id, guild_id, action_id, action_name,
                category, points, description, status, submitted_at, base_points
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, ?)
            """,
            (
                submission_id,
                user_id,
                guild_id,
                action_id,
                action_name,
                category,
                points,
                description,
                base_points,
            ),
        )
        await db.commit()

    return submission_id


async def get_pending_actions(user_id: int, guild_id: int) -> list[dict]:
    """Récupère toutes les actions en attente pour un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM pending_blood_actions
            WHERE user_id = ? AND guild_id = ? AND status = 'pending'
            ORDER BY submitted_at DESC
            """,
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def delete_pending_actions(user_id: int, guild_id: int) -> list[dict]:
    """Supprime les demandes d'action de Vitae encore en attente d'un joueur (reset).

    Retourne les demandes supprimées, pour que l'appelant puisse retirer
    leurs messages de validation sur Discord.
    """
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE user_id = ? AND guild_id = ? AND status = 'pending'",
            (user_id, guild_id),
        )
        removed = [dict(row) for row in await cursor.fetchall()]
        await db.execute(
            "DELETE FROM pending_blood_actions WHERE user_id = ? AND guild_id = ? AND status = 'pending'",
            (user_id, guild_id),
        )
        await db.commit()
        return removed


async def get_all_pending_actions(guild_id: int) -> list[dict]:
    """Récupère toutes les actions en attente pour une guilde."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM pending_blood_actions
            WHERE guild_id = ? AND status = 'pending'
            ORDER BY submitted_at ASC
            """,
            (guild_id,),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def validate_blood_action(
    submission_id: str, validator_id: int, points_awarded: Optional[int] = None
) -> dict:
    """Valide une action de sang et attribue les points."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row

        # Récupérer l'action en attente
        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE submission_id = ?",
            (submission_id,),
        )
        action = await cursor.fetchone()

        if not action or action["status"] != "pending":
            return {"success": False, "reason": "Action introuvable ou déjà traitée"}

        action_dict = dict(action)
        user_id = action_dict["user_id"]
        guild_id = action_dict["guild_id"]
        action_id = action_dict["action_id"]
        category = action_dict["category"]

        from data.blood_actions import get_action_by_id, is_once
        catalog_action = get_action_by_id(action_id)
        if not catalog_action:
            return {"success": False, "reason": "Ancienne action retirée du catalogue : refusez cette demande et soumettez un accomplissement actuel."}
        from utils.site_content import action_display
        action_dict['action_name'] = (await action_display(catalog_action, guild_id))['name']
        once = is_once(catalog_action)
        if once:
            completed_cursor = await db.execute(
                "SELECT action_id FROM completed_unique_actions WHERE user_id = ? AND guild_id = ?",
                (user_id, guild_id),
            )
            completed = {row[0] for row in await completed_cursor.fetchall()}
            if any(key in completed for key in [action_id, *catalog_action.get("legacyCompletedIds", [])]):
                return {"success": False, "reason": "Cette expérience unique a déjà été accomplie."}

        # Points à attribuer : montant ajusté par le MJ, sinon le montant figé ; dans ce dernier cas le
        # script recalcule le rendement décroissant à partir de la base du catalogue et de son historique.
        points = points_awarded if points_awarded is not None else action_dict["points"]
        base_points = None if points_awarded is not None else action_dict.get("base_points")

        # Ajouter les points de saturation
        mutation_info = await sheets_request("award_action", userId=str(user_id), submissionId=submission_id,
            points=points, basePoints=base_points, actionId=action_id, actionName=action_dict["action_name"],
            isUnique=once)
        points = int(mutation_info.get("points_added", points))

        # Marquer l'action comme validée
        changed = await db.execute(
            """
            UPDATE pending_blood_actions
            SET status = 'validated', validated_by = ?, validated_at = CURRENT_TIMESTAMP
            WHERE submission_id = ? AND status = 'pending'
            """,
            (validator_id, submission_id),
        )

        if changed.rowcount != 1:
            return {"success": False, "reason": "Action déjà traitée"}

        # Pour les actions uniques, les ajouter à la liste des actions complétées
        if once:
            await db.execute(
                """
                INSERT OR IGNORE INTO completed_unique_actions (user_id, guild_id, action_id, completed_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (user_id, guild_id, action_id),
            )

        # Ajouter à l'historique
        await db.execute(
            """
            INSERT INTO blood_action_history (
                user_id, guild_id, action_id, action_name, category,
                points, description, validated_by, validated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """,
            (
                user_id,
                guild_id,
                action_id,
                action_dict["action_name"],
                category,
                points,
                action_dict.get("description"),
                validator_id,
            ),
        )

        await db.commit()

        return {
            "success": True,
            "points_awarded": points,
            "mutation": mutation_info,
            "user_id": user_id,
            "guild_id": guild_id,
            "action_name": action_dict["action_name"],
            "description": action_dict.get("description"),
            "category": category,
        }


async def refuse_blood_action(submission_id: str, validator_id: int, reason: Optional[str] = None) -> Optional[dict]:
    """Refuse une action de sang."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row

        # Récupérer l'action en attente
        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE submission_id = ?",
            (submission_id,),
        )
        action = await cursor.fetchone()

        if not action or action["status"] != "pending":
            return None

        action_dict = dict(action)

        from data.blood_actions import get_action_by_id
        from utils.site_content import action_display
        catalog_action = get_action_by_id(action_dict['action_id'])
        if catalog_action:
            action_dict['action_name'] = (await action_display(catalog_action, action_dict['guild_id']))['name']

        await sheets_request("refuse_action", userId=str(action_dict["user_id"]), actionId=action_dict["action_id"], submissionId=submission_id)
        changed = await db.execute(
            """
            UPDATE pending_blood_actions
            SET status = 'refused', validated_by = ?, validated_at = CURRENT_TIMESTAMP
            WHERE submission_id = ? AND status = 'pending'
            """,
            (validator_id, submission_id),
        )
        await db.commit()
        if changed.rowcount != 1:
            return None

        return {
            "user_id": action_dict["user_id"],
            "guild_id": action_dict["guild_id"],
            "action_name": action_dict["action_name"],
        }


# ============================================
# Fonctions pour les rituels
# ============================================


async def add_player_ritual(user_id: int, guild_id: int, ritual_id: str) -> bool:
    """
    Ajoute un rituel à la liste des rituels connus d'un joueur.
    Retourne True si ajouté, False si déjà connu.
    """
    async with aiosqlite.connect(DATABASE_PATH) as db:
        try:
            await db.execute(
                """
                INSERT INTO player_rituals (user_id, guild_id, ritual_id, learned_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (user_id, guild_id, ritual_id),
            )
            await db.commit()
            return True
        except aiosqlite.IntegrityError:
            return False  # Déjà connu


async def delete_player_rituals(user_id: int, guild_id: int) -> int:
    """
    Supprime TOUS les rituels connus par un joueur.
    Retourne le nombre de rituels supprimés.
    """
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "DELETE FROM player_rituals WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        await db.commit()
        return cursor.rowcount



async def get_player_rituals(user_id: int, guild_id: int) -> list[str]:
    """Récupère la liste des IDs de rituels connus par un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT ritual_id FROM player_rituals WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return [row[0] for row in rows]



async def is_action_completed(user_id: int, guild_id: int, action_id: str) -> bool:
    """Vérifie si une action unique a déjà été complétée."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT action_id FROM completed_unique_actions WHERE user_id = ? AND guild_id = ? AND action_id = ?",
            (user_id, guild_id, action_id),
        )
        return await cursor.fetchone() is not None


async def is_action_on_cooldown(user_id: int, guild_id: int, action_id: str) -> Optional[str]:
    """Vérifie si une action est en cooldown. Retourne la date d'expiration si oui."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            SELECT expires_at FROM action_cooldowns
            WHERE user_id = ? AND guild_id = ? AND action_id = ? AND expires_at > datetime('now')
            """,
            (user_id, guild_id, action_id),
        )
        row = await cursor.fetchone()
        return row[0] if row else None


async def get_pending_action_ids(user_id: int, guild_id: int) -> list[str]:
    """Récupère les IDs des actions en attente pour un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT action_id FROM pending_blood_actions WHERE user_id = ? AND guild_id = ? AND status = 'pending'",
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return [row[0] for row in rows]


async def get_blood_action_history(user_id: int, guild_id: int, limit: int = 20) -> list[dict]:
    """Récupère l'historique des actions validées pour un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM blood_action_history
            WHERE user_id = ? AND guild_id = ?
            ORDER BY validated_at DESC
            LIMIT ?
            """,
            (user_id, guild_id, limit),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


# ============================================
# Fonctions pour les fiches de personnage
# ============================================


async def get_character_sheet(user_id: int, guild_id: int) -> Optional[dict]:
    """Récupère la fiche de personnage d'un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM character_sheets WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        if not row:
            return None
            
        sheet = dict(row)
        if sheet.get("starter_pack_answers"):
            try:
                sheet["starter_pack_answers"] = json.loads(sheet["starter_pack_answers"])
            except Exception:
                sheet["starter_pack_answers"] = None
        return sheet


async def save_character_sheet(user_id: int, guild_id: int, data: dict):
    """Sauvegarde ou met à jour une fiche de personnage."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Vérifier si la fiche existe déjà pour récupérer le forum_post_id existant si non fourni
        cursor = await db.execute(
            "SELECT forum_post_id FROM character_sheets WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        existing = await cursor.fetchone()
        current_post_id = existing[0] if existing else None

        # Utiliser le post_id fourni ou conserver l'existant
        forum_post_id = data.get("forum_post_id", current_post_id)
        
        starter_pack_answers = data.get("starter_pack_answers")
        if isinstance(starter_pack_answers, (dict, list)):
            starter_pack_answers_str = json.dumps(starter_pack_answers)
        else:
            starter_pack_answers_str = starter_pack_answers

        await db.execute(
            """
            INSERT INTO character_sheets (
                user_id, guild_id, name, age, sex,
                physical_desc, mental_desc_pre, mental_desc_post, history,
                image_url, forum_post_id, last_updated, starter_pack_answers
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                name = excluded.name,
                age = excluded.age,
                sex = excluded.sex,
                physical_desc = excluded.physical_desc,
                mental_desc_pre = excluded.mental_desc_pre,
                mental_desc_post = excluded.mental_desc_post,
                history = excluded.history,
                image_url = excluded.image_url,
                forum_post_id = excluded.forum_post_id,
                starter_pack_answers = COALESCE(excluded.starter_pack_answers, character_sheets.starter_pack_answers),
                last_updated = CURRENT_TIMESTAMP
            """,
            (
                user_id,
                guild_id,
                data.get("name"),
                data.get("age"),
                data.get("sex"),
                data.get("physical_desc"),
                data.get("mental_desc_pre"),
                data.get("mental_desc_post"),
                data.get("history"),
                data.get("image_url"),
                forum_post_id,
                starter_pack_answers_str,
            ),
        )
        await db.commit()


# ============================================
# Alias et fonctions de compatibilité
# ============================================


# Alias pour cogs.vampire et views.vampire_panel
async def get_soif(user_id: int, guild_id: int) -> int:
    """Alias de get_vampire_soif pour compatibilité."""
    return await get_vampire_soif(user_id, guild_id)


async def set_soif(user_id: int, guild_id: int, soif_level: int):
    """Alias de set_vampire_soif pour compatibilité."""
    return await set_vampire_soif(user_id, guild_id, soif_level)


async def modify_vitae(user_id: int, guild_id: int, amount: int):
    """Read and spend in one transaction; an unaffordable action spends nothing."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        cursor = await db.execute("SELECT soif_level, blood_potency FROM vampire_soif WHERE user_id=? AND guild_id=?", (user_id, guild_id))
        row = await cursor.fetchone()
        current, bp = (row[0], row[1]) if row else (0, 1)
        if current + amount < 0:
            raise ValueError("Réserve de Vitae insuffisante. Aucune dépense effectuée.")
        value = min(current + amount, get_max_vitae(bp))
        await db.execute("""INSERT INTO vampire_soif (user_id, guild_id, soif_level, blood_potency, saturation_points, last_updated)
            VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET soif_level=excluded.soif_level, last_updated=CURRENT_TIMESTAMP""", (user_id, guild_id, value, bp))
        await db.commit()
        return value


def _parse_timestamp(value) -> Optional[datetime]:
    """SQLite stores naive UTC text; our own writes use ISO format."""
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value))
    except ValueError:
        return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


def quick_feed_amount(blood_potency: int) -> int:
    """Vitae gained by an off-screen hunt: a fixed share of the reserve (2/4/5/8/10)."""
    return math.ceil(get_max_vitae(blood_potency) * VITAE_QUICK_FEED_RATIO)


def quick_feed_floor(blood_potency: int) -> int:
    """Below this reserve, feeding must be played in a scene."""
    return math.ceil(get_max_vitae(blood_potency) * VITAE_QUICK_FEED_RATIO)


def requires_scene_feeding(blood_potency: int) -> bool:
    """At the top rank only vampire blood sates: every feed is a played scene."""
    return blood_potency >= VITAE_SCENE_ONLY_POTENCY


async def feed_vampire(user_id: int, guild_id: int, mode: str, now: Optional[datetime] = None) -> dict:
    """Feed in one transaction.

    - 'quick': off-screen hunt, only while the reserve is still at least the floor, once per window,
      and never at the scene-only rank (vampire blood is needed);
    - 'scene': a played hunting scene (link checked by the caller), fills the reserve.
    An impossible feed changes nothing and raises ValueError with the reason.
    """
    now = now or datetime.now(timezone.utc)
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        cursor = await db.execute(
            "SELECT soif_level, blood_potency, last_fed FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id))
        row = await cursor.fetchone()
        if not row:
            raise ValueError("Aucune réserve de Vitae : ouvre d'abord /vampire.")
        current, bp, last_fed = row[0] or 0, row[1] or 1, _parse_timestamp(row[2])
        max_vitae = get_max_vitae(bp)
        if mode == "quick":
            if requires_scene_feeding(bp):
                raise ValueError(
                    "À ton rang, seul le sang de vampire te rassasie : la chasse se joue en scène.")
            floor = quick_feed_floor(bp)
            if current < floor:
                raise ValueError(
                    f"Ta réserve est sous {floor}/{max_vitae} : la Bête exige une scène de chasse.")
            if last_fed and now - last_fed < timedelta(hours=VITAE_QUICK_FEED_COOLDOWN_HOURS):
                raise ValueError("Tu as déjà chassé en off cette nuit. Joue une scène de chasse pour boire davantage.")
            value = min(current + quick_feed_amount(bp), max_vitae)
        elif mode == "scene":
            value = max_vitae
        else:
            raise ValueError("Mode d'alimentation inconnu.")
        await db.execute(
            """UPDATE vampire_soif SET soif_level = ?, last_fed = ?, last_upkeep = ?, last_updated = CURRENT_TIMESTAMP
               WHERE user_id = ? AND guild_id = ?""",
            (value, now.isoformat(), now.isoformat(), user_id, guild_id))
        await db.commit()
        return {"vitae": value, "max_vitae": max_vitae, "gained": value - current, "mode": mode}


async def apply_vitae_upkeep(user_id: int, guild_id: int, now: Optional[datetime] = None) -> dict:
    """Lazy upkeep: the dead body burns blood as real nights pass, checked when the panel opens.

    Loses 1 Vitae per VITAE_UPKEEP_INTERVAL_DAYS since the last check, at most
    VITAE_UPKEEP_MAX_PER_CHECK per check, never below 0. The first check only starts the clock.
    """
    now = now or datetime.now(timezone.utc)
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("BEGIN IMMEDIATE")
        cursor = await db.execute(
            "SELECT soif_level, last_upkeep FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id))
        row = await cursor.fetchone()
        if not row:
            await db.commit()
            return {"lost": 0, "vitae": 0}
        current, last_upkeep = row[0] or 0, _parse_timestamp(row[1])
        lost = 0
        next_check = now
        if last_upkeep is not None:
            intervals = max(0, (now - last_upkeep).days) // VITAE_UPKEEP_INTERVAL_DAYS
            lost = min(intervals, VITAE_UPKEEP_MAX_PER_CHECK, current)
            # Keep the remainder of the current interval so short visits do not reset the clock.
            if intervals <= VITAE_UPKEEP_MAX_PER_CHECK:
                next_check = last_upkeep + timedelta(days=intervals * VITAE_UPKEEP_INTERVAL_DAYS)
        value = current - lost
        await db.execute(
            "UPDATE vampire_soif SET soif_level = ?, last_upkeep = ? WHERE user_id = ? AND guild_id = ?",
            (value, next_check.isoformat(), user_id, guild_id))
        await db.commit()
        return {"lost": lost, "vitae": value}


async def spend_vitae_for_power(user_id: int, guild_id: int, clan: str, blood_potency: int, power_id: str) -> dict:
    """Pay a discipline power's blood cost from the reserve; a free power spends nothing."""
    from data.disciplines import check_power_usable
    power = check_power_usable(clan, blood_potency, power_id)
    cost = int(power["bloodCost"])
    vitae = await modify_vitae(user_id, guild_id, -cost) if cost else await get_vampire_soif(user_id, guild_id)
    return {"vitae": vitae, "max_vitae": get_max_vitae(blood_potency), "cost": cost, "power": power}


# Alias pour la compatibilité (mais déprécié logiquement)
async def increment_soif(user_id: int, guild_id: int, amount: int = 1):
    """Désactivé ou redirigé vers modify_vitae(-amount) car "soif" augmentait quand on dépensait."""
    # Dans l'ancien système : soif augmente = mauvais. 
    # Nouveau système : vitae diminue = mauvais.
    # Donc increment_soif (mauvais) ~ dépenser vitae.
    return await modify_vitae(user_id, guild_id, -amount)



async def set_vampire_data(
    user_id: int,
    guild_id: int,
    soif_level: Optional[int] = None,
    blood_potency: Optional[int] = None,
    saturation_points: Optional[int] = None,
):
    """Met à jour les données vampire dans Google Sheets."""
    # Récupérer les données existantes
    character = await get_from_google_sheets(user_id) or {}

    # Mettre à jour les champs fournis
    if soif_level is not None:
        character["soif"] = soif_level
    if blood_potency is not None:
        character["bloodPotency"] = blood_potency
    if saturation_points is not None:
        character["saturationPoints"] = saturation_points

    # Sauvegarder dans Google Sheets
    await save_to_google_sheets(user_id, character)



def get_max_vitae(blood_potency: int) -> int:
    """Calcule la capacité maximale de Vitae selon la Blood Potency.

    Réserve par rang (noms : data/blood_potency.py) :
    - BP 1 : 5 (Sang Fluide)
    - BP 2 : 8 (Sang Vif)
    - BP 3 : 12 (Sang Fort)
    - BP 4 : 18 (Sang Puissant)
    - BP 5 : 25 (Zénith Sanguin)
    """
    max_vitae_by_bp = {1: 5, 2: 8, 3: 12, 4: 18, 5: 25}
    return max_vitae_by_bp.get(blood_potency, 5)







def get_saturation_threshold(blood_potency: int) -> Optional[int]:
    """Seuil de saturation pour passer au niveau suivant ; None au rang 5 (plafond)."""
    threshold = SATURATION_THRESHOLDS.get(blood_potency, SATURATION_THRESHOLDS[1])
    return None if threshold == float("inf") else threshold


async def reset_vampire_data(user_id: int, guild_id: int):
    """Réinitialise toutes les données vampire dans Google Sheets."""
    await save_to_google_sheets(user_id, {})


# Constante pour views.vampire_panel


# Alias pour cogs.werewolf et cogs.general
async def get_rage_data(user_id: int, guild_id: int, channel_id: int) -> dict:
    """Alias de get_werewolf_rage pour compatibilité."""
    return await get_werewolf_rage(user_id, guild_id, channel_id)


async def set_rage_data(
    user_id: int,
    guild_id: int,
    channel_id: int,
    rage_level: int,
    is_enraged: bool = False,
    maintien_counter: int = 0,
    last_message_id: Optional[int] = None,
    others_spoke_since: bool = False,
):
    """Alias de set_werewolf_rage pour compatibilité."""
    return await set_werewolf_rage(
        user_id,
        guild_id,
        channel_id,
        rage_level,
        is_enraged,
        maintien_counter,
        last_message_id,
        others_spoke_since,
    )


async def increment_rage(user_id: int, guild_id: int, channel_id: int, amount: int = 1):
    """Incrémente la rage d'un loup-garou dans un salon."""
    rage_data = await get_werewolf_rage(user_id, guild_id, channel_id)
    if rage_data:
        new_rage = min(5, rage_data["rage_level"] + amount)
        await set_werewolf_rage(
            user_id,
            guild_id,
            channel_id,
            new_rage,
            rage_data["is_enraged"],
            rage_data["maintien_counter"],
            rage_data["last_message_id"],
            rage_data["others_spoke_since"],
        )
    else:
        # Initialiser si n'existe pas
        await set_werewolf_rage(user_id, guild_id, channel_id, amount, False, 0, None, False)


async def decrement_rage(user_id: int, guild_id: int, channel_id: int, amount: int = 2):
    """Décremente la rage d'un loup-garou dans un salon."""
    rage_data = await get_werewolf_rage(user_id, guild_id, channel_id)
    if rage_data:
        new_rage = max(0, rage_data["rage_level"] - amount)
        await set_werewolf_rage(
            user_id,
            guild_id,
            channel_id,
            new_rage,
            rage_data["is_enraged"],
            rage_data["maintien_counter"],
            rage_data["last_message_id"],
            rage_data["others_spoke_since"],
        )


async def clear_rage(user_id: int, guild_id: int, channel_id: int):
    """Réinitialise la rage dans un salon."""
    await reset_werewolf_rage(user_id, guild_id, channel_id)


async def get_all_enraged_werewolves_in_channel(guild_id: int, channel_id: int) -> list[dict]:
    """Récupère tous les loups-garous enragés dans un salon."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM werewolf_rage
            WHERE guild_id = ? AND channel_id = ? AND is_enraged = TRUE
            """,
            (guild_id, channel_id),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


# Fonctions pour cogs.blood_actions
async def init_blood_actions_tables():
    """Initialise les tables pour les actions de sang."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Table des actions en attente
        await db.execute("""
            CREATE TABLE IF NOT EXISTS pending_blood_actions (
                submission_id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                action_id TEXT NOT NULL,
                action_name TEXT NOT NULL,
                category TEXT NOT NULL,
                points INTEGER NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                validated_by INTEGER,
                validated_at TIMESTAMP
            )
        """)

        # Table des actions uniques complétées
        await db.execute("""
            CREATE TABLE IF NOT EXISTS completed_unique_actions (
                user_id INTEGER,
                guild_id INTEGER,
                action_id TEXT,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id, action_id)
            )
        """)

        # Table des cooldowns
        await db.execute("""
            CREATE TABLE IF NOT EXISTS action_cooldowns (
                user_id INTEGER,
                guild_id INTEGER,
                action_id TEXT,
                expires_at TIMESTAMP,
                PRIMARY KEY (user_id, guild_id, action_id)
            )
        """)

        # Table de l'historique
        await db.execute("""
            CREATE TABLE IF NOT EXISTS blood_action_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                action_id TEXT NOT NULL,
                action_name TEXT NOT NULL,
                category TEXT NOT NULL,
                points INTEGER NOT NULL,
                description TEXT,
                validated_by INTEGER,
                validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        try:
            await db.execute("ALTER TABLE pending_blood_actions ADD COLUMN base_points INTEGER")
        except Exception:
            pass  # Colonne existe déjà

        # Index
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_pending_actions_user ON pending_blood_actions(user_id, guild_id)"
        )
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_pending_actions_status ON pending_blood_actions(status)"
        )

        await db.commit()
        logger.info("Tables blood_actions initialisées")


async def create_pending_action(
    user_id: int,
    guild_id: int,
    action_id: str,
    action_name: str,
    category: str,
    points: int,
    description: Optional[str] = None,
    submission_id: Optional[str] = None,
    base_points: Optional[int] = None,
) -> str:
    """Alias de submit_blood_action pour compatibilité."""
    return await submit_blood_action(
        user_id, guild_id, action_id, action_name, category, points, description, submission_id, base_points
    )


async def has_pending_action(user_id: int, guild_id: int, action_id: str) -> bool:
    """Vérifie si une action est déjà en attente."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            SELECT submission_id FROM pending_blood_actions
            WHERE user_id = ? AND guild_id = ? AND action_id = ? AND status = 'pending'
            """,
            (user_id, guild_id, action_id),
        )
        return await cursor.fetchone() is not None


# Alias pour views.blood_action_validation
async def validate_action(submission_id: str, validator_id: int, points_awarded: Optional[int] = None) -> dict:
    """Alias de validate_blood_action pour compatibilité."""
    return await validate_blood_action(submission_id, validator_id, points_awarded)


async def refuse_action(submission_id: str, validator_id: int, reason: Optional[str] = None):
    """Alias de refuse_blood_action pour compatibilité."""
    return await refuse_blood_action(submission_id, validator_id, reason)


async def get_pending_action(submission_id: str) -> Optional[dict]:
    """Récupère une action en attente par son ID."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE submission_id = ?",
            (submission_id,),
        )
        row = await cursor.fetchone()
        return dict(row) if row else None


async def update_pending_action_message(submission_id: str, message_id: int):
    """Met à jour l'ID du message Discord pour une action en attente."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        try:
            await db.execute(
                "ALTER TABLE pending_blood_actions ADD COLUMN message_id INTEGER DEFAULT NULL"
            )
        except Exception:
            # La colonne existe probablement déjà
            pass
            
        await db.execute(
            "UPDATE pending_blood_actions SET message_id = ? WHERE submission_id = ?",
            (message_id, submission_id),
        )
        await db.commit()


async def get_user_pending_actions(user_id: int, guild_id: int) -> list[dict]:
    """Alias de get_pending_actions pour compatibilité."""
    return await get_pending_actions(user_id, guild_id)


async def get_user_completed_unique_actions(user_id: int, guild_id: int) -> list[str]:
    """Récupère les IDs des actions uniques complétées par un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT action_id FROM completed_unique_actions WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return [row[0] for row in rows]


async def get_user_action_cooldowns(user_id: int, guild_id: int) -> dict:
    """Récupère les cooldowns actifs pour un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT action_id, expires_at FROM action_cooldowns
            WHERE user_id = ? AND guild_id = ? AND expires_at > datetime('now')
            """,
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return {row["action_id"]: row["expires_at"] for row in rows}
