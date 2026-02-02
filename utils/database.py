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
import uuid
import random
from datetime import datetime

logger = logging.getLogger(__name__)

# URL de l'API Google Sheets
GOOGLE_SHEETS_API = "https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec"


async def get_from_google_sheets(user_id: int) -> Optional[dict]:
    """
    Récupère les données d'un joueur depuis Google Sheets.
    Retourne None si le joueur n'existe pas.
    """
    try:
        url = f"{GOOGLE_SHEETS_API}?action=get&userId={user_id}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response_text = await response.text()

                if response.status == 200:
                    try:
                        result = json.loads(response_text)
                        if result.get("success") and result.get("character"):
                            logger.info(f"Lecture Google Sheets OK pour user {user_id}")
                            return result["character"]
                        else:
                            logger.info(f"Pas de données Google Sheets pour user {user_id}")
                            return None
                    except json.JSONDecodeError:
                        logger.warning(f"Google Sheets réponse invalide: {response_text[:200]}")
                        return None
                else:
                    logger.warning(f"Google Sheets HTTP {response.status}: {response_text[:200]}")
                    return None
    except Exception as e:
        logger.error(f"Erreur lecture Google Sheets: {e}")
        return None


async def save_to_google_sheets(user_id: int, data: dict):
    """Sauvegarde les données d'un joueur vers Google Sheets."""
    try:
        # Encoder les données JSON pour l'URL
        data_json = json.dumps(data)
        encoded_data = urllib.parse.quote(data_json, safe='')

        url = f"{GOOGLE_SHEETS_API}?action=save&userId={user_id}&data={encoded_data}"

        logger.info(f"Sauvegarde Google Sheets: user={user_id}, data={data}")

        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response_text = await response.text()
                logger.info(f"Sauvegarde Google Sheets response: {response.status} - {response_text[:200]}")

                if response.status == 200:
                    try:
                        result = json.loads(response_text)
                        if result.get("success"):
                            logger.info(f"Sauvegarde Google Sheets OK pour user {user_id}")
                        else:
                            logger.warning(f"Sauvegarde Google Sheets échoué: {result}")
                    except json.JSONDecodeError:
                        logger.warning(f"Sauvegarde Google Sheets réponse invalide: {response_text[:200]}")
                else:
                    logger.warning(f"Sauvegarde Google Sheets HTTP {response.status}: {response_text[:200]}")
    except Exception as e:
        logger.warning(f"Erreur sauvegarde Google Sheets: {e}")


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

        # Table des goules (Vampires)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS vampire_ghouls (
                id TEXT PRIMARY KEY,
                vampire_user_id INTEGER NOT NULL,
                vampire_guild_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                role TEXT,
                discipline_id TEXT,
                discipline_name TEXT,
                discipline_power TEXT,
                status TEXT DEFAULT 'actif',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT,
                FOREIGN KEY (vampire_user_id, vampire_guild_id) REFERENCES players(user_id, guild_id)
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
        await db.execute(
            "CREATE INDEX IF NOT EXISTS idx_ghouls_vampire ON vampire_ghouls(vampire_user_id, vampire_guild_id)"
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

    # 2. Synchronisation Google Sheets (Best effort)
    character = await get_from_google_sheets(user_id) or {}

    if race is not None:
        character["race"] = race
    if clan is not None:
        character["clan"] = clan
    if auspice is not None:
        character["auspice"] = auspice
    if name is not None:
        character["name"] = name

    await save_to_google_sheets(user_id, character)


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
        # On ne supprime pas la ligne si keep_race=True, on met à jour.
        if keep_race:
            await db.execute(
                "UPDATE players SET clan=NULL, auspice=NULL WHERE user_id = ? AND guild_id = ?",
                (user_id, guild_id)
            )
        else:
            await db.execute(
                "DELETE FROM players WHERE user_id = ? AND guild_id = ?",
                (user_id, guild_id)
            )

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
        # Supprimer les goules
        await db.execute(
            "DELETE FROM vampire_ghouls WHERE vampire_user_id = ? AND vampire_guild_id = ?",
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

        # Après changement de BP, ajuster le niveau de soif si nécessaire
        cursor = await db.execute(
            "SELECT soif_level FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        if row:
            current_soif = row[0]
            # Initialiser au MAX de Vitae (puisque le système est inversé, on commence plein)
            max_vitae = get_max_vitae(blood_potency)
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

    current_bp = character.get("bloodPotency", 1)
    current_saturation = character.get("saturationPoints", 0)

    # Seuils par niveau de BP
    thresholds = {
        1: 30,
        2: 60,
        3: 120,
        4: 250,
    }

    new_saturation = current_saturation + points
    new_bp = current_bp
    mutated = False

    # Vérifier si on franchit un seuil
    if current_bp < 5 and new_saturation >= thresholds.get(current_bp, float("inf")):
        new_bp = current_bp + 1
        new_saturation = 0
        mutated = True

    # Mettre à jour les données
    character["bloodPotency"] = new_bp
    character["saturationPoints"] = new_saturation

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
) -> str:
    """Soumet une action de sang pour validation."""
    submission_id = str(uuid.uuid4())

    async with aiosqlite.connect(DATABASE_PATH) as db:
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
                category, points, description, status, submitted_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
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

        # Points à attribuer (utiliser points_awarded s'il est fourni, sinon les points de l'action)
        points = points_awarded if points_awarded is not None else action_dict["points"]

        # Ajouter les points de saturation
        mutation_info = await add_saturation_points(user_id, guild_id, points)

        # Marquer l'action comme validée
        await db.execute(
            """
            UPDATE pending_blood_actions
            SET status = 'validated', validated_by = ?, validated_at = CURRENT_TIMESTAMP
            WHERE submission_id = ?
            """,
            (validator_id, submission_id),
        )

        # Pour les actions uniques, les ajouter à la liste des actions complétées
        if category == "unique":
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

        # Pour les actions vampiriques, ajouter un cooldown
        if category == "vampire_blood":
            await db.execute(
                """
                INSERT OR REPLACE INTO action_cooldowns (user_id, guild_id, action_id, expires_at)
                VALUES (?, ?, ?, datetime('now', '+30 days'))
                """,
                (user_id, guild_id, action_id),
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
        # ... implementation continues ...

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

        action = await cursor.fetchone()

        if not action or action["status"] != "pending":
            return None

        action_dict = dict(action)

        await db.execute(
            """
            UPDATE pending_blood_actions
            SET status = 'refused', validated_by = ?, validated_at = CURRENT_TIMESTAMP, description = ?
            WHERE submission_id = ?
            """,
            (validator_id, reason, submission_id),
        )
        await db.commit()

        return {
            "user_id": action_dict["user_id"],
            "guild_id": action_dict["guild_id"],
            "action_name": action_dict["action_name"],
        }


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
# Fonctions pour les goules
# ============================================

# Limites de goules par Blood Potency
GHOUL_LIMITS = {
    1: 2,
    2: 3,
    3: 5,
    4: 10,
    5: 20,
}

# Mapping des disciplines par clan (doit correspondre à CLAN_DISCIPLINES dans disciplines.js)
CLAN_DISCIPLINES = {
    "brujah": ["celerity", "potence", "presence"],
    "gangrel": ["animalism", "fortitude", "protean"],
    "malkavian": ["auspex", "dementation", "obfuscate"],
    "nosferatu": ["animalism", "obfuscate", "potence"],
    "toreador": ["auspex", "celerity", "presence"],
    "tremere": ["auspex", "dominate", "thaumaturgy"],
    "ventrue": ["dominate", "fortitude", "presence"],
    "lasombra": ["dominate", "obtenebration", "potence"],
    "tzimisce": ["animalism", "auspex", "vicissitude"],
    "hecata": ["auspex", "fortitude", "necromancy"],
    "ministry": ["obfuscate", "presence", "serpentis"],
    "banu_haqim": ["celerity", "obfuscate", "quietus"],
    "ravnos": ["animalism", "chimerstry", "fortitude"]
}

# Noms des disciplines (doit correspondre à disciplines.js)
DISCIPLINE_NAMES = {
    "animalism": "Animalisme",
    "auspex": "Auspex",
    "celerity": "Célérité",
    "dominate": "Domination",
    "fortitude": "Force d'Âme",
    "obfuscate": "Occultation",
    "potence": "Puissance",
    "presence": "Présence",
    "protean": "Protéisme",
    "obtenebration": "Obténébration",
    "thaumaturgy": "Thaumaturgie",
    "vicissitude": "Vicissitude",
    "necromancy": "Nécromancie",
    "quietus": "Quietus",
    "serpentis": "Serpentis",
    "dementation": "Aliénation",
    "chimerstry": "Chimérie"
}

# Pouvoirs niveau 1 des disciplines (doit correspondre à disciplines.js)
DISCIPLINE_POWERS = {
    "animalism": "Murmures Fauves",
    "auspex": "Sens Accrus",
    "celerity": "Grâce Féline",
    "dominate": "Commandement",
    "fortitude": "Résilience",
    "obfuscate": "Cape d'Ombre",
    "potence": "Vigueur",
    "presence": "Crainte Révérencielle",
    "protean": "Yeux de la Bête",
    "obtenebration": "Jeu d'Ombres",
    "thaumaturgy": "Goût du Sang",
    "vicissitude": "Modelage Mineur",
    "necromancy": "Insight",
    "quietus": "Silence de la Mort",
    "serpentis": "Regard Hypnotique",
    "dementation": "Passion",
    "chimerstry": "Ignis Fatuus"
}


def get_random_discipline_for_clan(clan: str) -> tuple[str, str, str]:
    """
    Retourne une discipline aléatoire parmi les 3 du clan.
    Returns: (discipline_id, discipline_name, discipline_power)
    """
    clan_lower = clan.lower()
    disciplines = CLAN_DISCIPLINES.get(clan_lower, [])

    if not disciplines:
        return ("", "", "")

    discipline_id = random.choice(disciplines)
    discipline_name = DISCIPLINE_NAMES.get(discipline_id, "")
    discipline_power = DISCIPLINE_POWERS.get(discipline_id, "")

    return (discipline_id, discipline_name, discipline_power)


async def create_ghoul(
    vampire_user_id: int,
    vampire_guild_id: int,
    name: str,
    description: str = "",
    role: str = "",
    notes: str = ""
) -> dict:
    """Crée une nouvelle goule pour un vampire."""
    # Récupérer le clan du vampire et sa BP
    vampire_data = await get_vampire_data(vampire_user_id, vampire_guild_id)
    clan = vampire_data.get("clan", "").lower()
    blood_potency = vampire_data.get("blood_potency", 1)

    # Vérifier la limite de goules
    ghoul_count = await get_ghoul_count(vampire_user_id, vampire_guild_id)
    max_ghouls = GHOUL_LIMITS.get(blood_potency, 2)

    if ghoul_count >= max_ghouls:
        return {
            "success": False,
            "reason": f"Limite de goules atteinte ({ghoul_count}/{max_ghouls} pour BP {blood_potency})"
        }

    # Assigner une discipline aléatoire parmi celles du clan
    discipline_id, discipline_name, discipline_power = get_random_discipline_for_clan(clan)

    ghoul_id = str(uuid.uuid4())

    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            """
            INSERT INTO vampire_ghouls (
                id, vampire_user_id, vampire_guild_id, name, description,
                role, discipline_id, discipline_name, discipline_power,
                status, created_at, notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'actif', CURRENT_TIMESTAMP, ?)
            """,
            (
                ghoul_id,
                vampire_user_id,
                vampire_guild_id,
                name,
                description,
                role,
                discipline_id,
                discipline_name,
                discipline_power,
                notes
            ),
        )
        await db.commit()

    return {
        "success": True,
        "ghoul_id": ghoul_id,
        "discipline_id": discipline_id,
        "discipline_name": discipline_name,
        "discipline_power": discipline_power
    }


async def get_ghouls(vampire_user_id: int, vampire_guild_id: int) -> list[dict]:
    """Récupère toutes les goules d'un vampire."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM vampire_ghouls
            WHERE vampire_user_id = ? AND vampire_guild_id = ?
            ORDER BY created_at DESC
            """,
            (vampire_user_id, vampire_guild_id),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def get_ghoul_count(vampire_user_id: int, vampire_guild_id: int) -> int:
    """Récupère le nombre de goules actives d'un vampire."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            SELECT COUNT(*) FROM vampire_ghouls
            WHERE vampire_user_id = ? AND vampire_guild_id = ? AND status = 'actif'
            """,
            (vampire_user_id, vampire_guild_id),
        )
        row = await cursor.fetchone()
        return row[0] if row else 0


async def update_ghoul(
    ghoul_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None,
    role: Optional[str] = None,
    notes: Optional[str] = None,
    status: Optional[str] = None
) -> bool:
    """Met à jour les informations d'une goule."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        updates = []
        params = []

        if name is not None:
            updates.append("name = ?")
            params.append(name)
        if description is not None:
            updates.append("description = ?")
            params.append(description)
        if role is not None:
            updates.append("role = ?")
            params.append(role)
        if notes is not None:
            updates.append("notes = ?")
            params.append(notes)
        if status is not None:
            updates.append("status = ?")
            params.append(status)

        if not updates:
            return False

        params.append(ghoul_id)

        await db.execute(
            f"UPDATE vampire_ghouls SET {', '.join(updates)} WHERE id = ?",
            params,
        )
        await db.commit()

        return True


async def delete_ghoul(ghoul_id: str) -> bool:
    """Supprime une goule."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "DELETE FROM vampire_ghouls WHERE id = ?",
            (ghoul_id,),
        )
        await db.commit()
        return cursor.rowcount > 0


async def get_max_ghouls(vampire_user_id: int, vampire_guild_id: int) -> int:
    """Récupère le nombre maximum de goules autorisées selon la BP."""
    blood_potency = await get_blood_potency(vampire_user_id, vampire_guild_id)
    return GHOUL_LIMITS.get(blood_potency, 2)


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
        return dict(row) if row else None


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

        await db.execute(
            """
            INSERT INTO character_sheets (
                user_id, guild_id, name, age, sex,
                physical_desc, mental_desc_pre, mental_desc_post, history,
                image_url, forum_post_id, last_updated
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
    """
    Modifie la quantité de Vitae d'un vampire.
    amount: positif pour ajouter (se nourrir), négatif pour dépenser.
    Retourne la nouvelle valeur.
    Si la valeur tombe à 0 ou moins, retourne 0 (et potentiellement signale une frénésie via l'interface).
    """
    current_vitae = await get_vampire_soif(user_id, guild_id) # On garde le nom de fonction sous-jacent pour l'instant
    blood_potency = await get_blood_potency(user_id, guild_id)
    max_vitae = get_max_vitae(blood_potency)
    
    new_vitae = current_vitae + amount
    
    # Bornes : 0 à Max
    new_vitae = max(0, min(new_vitae, max_vitae))
    
    await set_vampire_soif(user_id, guild_id, new_vitae)
    return new_vitae

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

    Progression linéaire (équilibrée):
    - BP 1: 5 points (Nouveau-né)
    - BP 2: 8 points (Néonate)
    - BP 3: 12 points (Ancilla)
    - BP 4: 18 points (Ancien)
    - BP 5: 25 points (Mathusalem)
    """
    max_vitae_by_bp = {1: 5, 2: 8, 3: 12, 4: 18, 5: 25}
    return max_vitae_by_bp.get(blood_potency, 5)







def get_saturation_threshold(blood_potency: int) -> int:
    """Calcule le seuil de saturation pour passer au niveau suivant."""
    # Seuils ajustés à la nouvelle progression linéaire
    thresholds = {1: 25, 2: 50, 3: 80, 4: 120, 5: float("inf")}
    return thresholds.get(blood_potency, 25)


async def reset_vampire_data(user_id: int, guild_id: int):
    """Réinitialise toutes les données vampire dans Google Sheets."""
    await save_to_google_sheets(user_id, {})


# Constante pour views.vampire_panel
SATURATION_THRESHOLDS = {1: 30, 2: 60, 3: 120, 4: 250, 5: float("inf")}


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
) -> str:
    """Alias de submit_blood_action pour compatibilité."""
    return await submit_blood_action(
        user_id, guild_id, action_id, action_name, category, points, description
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
