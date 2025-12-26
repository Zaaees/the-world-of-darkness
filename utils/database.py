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

logger = logging.getLogger(__name__)

# URL de l'API Google Sheets
GOOGLE_SHEETS_API = "https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec"


async def sync_to_google_sheets(user_id: int, data: dict):
    """Synchronise les données d'un joueur vers Google Sheets."""
    try:
        # Encoder les données JSON pour l'URL
        data_json = json.dumps(data)
        encoded_data = urllib.parse.quote(data_json, safe='')

        url = f"{GOOGLE_SHEETS_API}?action=save&userId={user_id}&data={encoded_data}"

        logger.info(f"Sync Google Sheets: user={user_id}, data={data}")

        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response_text = await response.text()
                logger.info(f"Sync Google Sheets response: {response.status} - {response_text[:200]}")

                if response.status == 200:
                    try:
                        result = json.loads(response_text)
                        if result.get("success"):
                            logger.info(f"Sync Google Sheets OK pour user {user_id}")
                        else:
                            logger.warning(f"Sync Google Sheets échoué: {result}")
                    except json.JSONDecodeError:
                        logger.warning(f"Sync Google Sheets réponse invalide: {response_text[:200]}")
                else:
                    logger.warning(f"Sync Google Sheets HTTP {response.status}: {response_text[:200]}")
    except Exception as e:
        logger.warning(f"Erreur sync Google Sheets: {e}")

DATABASE_PATH = Path(__file__).parent.parent / "data" / "world_of_darkness.db"


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

        await db.commit()
        logger.info("Base de données initialisée avec succès")


# ============================================
# Fonctions pour les joueurs
# ============================================


async def get_player(user_id: int, guild_id: int) -> Optional[dict]:
    """Récupère les informations d'un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM players WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        return dict(row) if row else None


async def set_player(
    user_id: int,
    guild_id: int,
    race: Optional[str] = None,
    clan: Optional[str] = None,
    auspice: Optional[str] = None,
):
    """Crée ou met à jour un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Vérifier si le joueur existe
        cursor = await db.execute(
            "SELECT user_id FROM players WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        exists = await cursor.fetchone()

        if exists:
            # Mise à jour sélective
            updates = []
            params = []
            if race is not None:
                updates.append("race = ?")
                params.append(race)
            if clan is not None:
                updates.append("clan = ?")
                params.append(clan)
            if auspice is not None:
                updates.append("auspice = ?")
                params.append(auspice)

            if updates:
                updates.append("updated_at = CURRENT_TIMESTAMP")
                params.extend([user_id, guild_id])
                await db.execute(
                    f"UPDATE players SET {', '.join(updates)} WHERE user_id = ? AND guild_id = ?",
                    params,
                )
        else:
            # Création
            await db.execute(
                """
                INSERT INTO players (user_id, guild_id, race, clan, auspice)
                VALUES (?, ?, ?, ?, ?)
            """,
                (user_id, guild_id, race, clan, auspice),
            )

        await db.commit()

    # Synchroniser vers Google Sheets si c'est un vampire avec un clan
    if race == "vampire" and clan:
        vampire_data = await get_vampire_data(user_id, guild_id)
        await sync_to_google_sheets(user_id, {
            "clan": clan,
            "bloodPotency": vampire_data.get("blood_potency", 1),
            "saturationPoints": vampire_data.get("saturation_points", 0),
            "soifLevel": vampire_data.get("soif_level", 0),
        })


async def delete_player(user_id: int, guild_id: int):
    """Supprime un joueur et ses données associées."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            "DELETE FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        await db.execute(
            "DELETE FROM werewolf_rage WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        await db.execute(
            "DELETE FROM players WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        await db.commit()


# ============================================
# Fonctions pour la Soif (Vampires)
# ============================================


async def get_soif(user_id: int, guild_id: int) -> int:
    """Récupère le niveau de Soif d'un vampire."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT soif_level FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        return row[0] if row else 0


async def set_soif(user_id: int, guild_id: int, level: int):
    """Définit le niveau de Soif d'un vampire."""
    level = max(0, min(5, level))  # Clamp entre 0 et 5

    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            """
            INSERT INTO vampire_soif (user_id, guild_id, soif_level, last_updated)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                soif_level = excluded.soif_level,
                last_updated = CURRENT_TIMESTAMP
        """,
            (user_id, guild_id, level),
        )
        await db.commit()

    # Synchroniser vers Google Sheets
    player = await get_player(user_id, guild_id)
    if player and player.get("race") == "vampire":
        vampire_data = await get_vampire_data(user_id, guild_id)
        await sync_to_google_sheets(user_id, {
            "clan": player.get("clan", ""),
            "bloodPotency": vampire_data.get("blood_potency", 1),
            "saturationPoints": vampire_data.get("saturation_points", 0),
            "soifLevel": level,
        })


async def increment_soif(user_id: int, guild_id: int) -> int:
    """Incrémente la Soif d'un vampire et retourne le nouveau niveau."""
    current = await get_soif(user_id, guild_id)
    new_level = min(5, current + 1)
    await set_soif(user_id, guild_id, new_level)
    return new_level


async def decrement_soif(user_id: int, guild_id: int, amount: int = 1) -> int:
    """Décrémente la Soif d'un vampire et retourne le nouveau niveau."""
    current = await get_soif(user_id, guild_id)
    new_level = max(0, current - amount)
    await set_soif(user_id, guild_id, new_level)
    return new_level


# ============================================
# Fonctions pour la Puissance du Sang (Vampires)
# ============================================

# Seuils de saturation pour monter en Puissance du Sang
SATURATION_THRESHOLDS = {
    1: 30,   # Vers BP 2
    2: 60,   # Vers BP 3
    3: 120,  # Vers BP 4
    4: 250,  # Vers BP 5
    5: None  # Max atteint
}

# Seuil minimum de Soif selon la Puissance du Sang
# Plus le sang est puissant, plus il est difficile de se rassasier
MIN_SOIF_BY_BP = {
    1: 0,  # Néonate - peut se rassasier complètement
    2: 0,  # Ancilla Mineur - peut se rassasier complètement
    3: 1,  # Ancilla Majeur - soif minimum 1
    4: 2,  # Ancien - soif minimum 2
    5: 3,  # Sommité - soif minimum 3
}


def get_min_soif(blood_potency: int) -> int:
    """Retourne le seuil minimum de Soif selon la Puissance du Sang."""
    return MIN_SOIF_BY_BP.get(blood_potency, 0)


def get_saturation_threshold(blood_potency: int) -> int | None:
    """Retourne le seuil de saturation pour le niveau de BP actuel."""
    return SATURATION_THRESHOLDS.get(blood_potency)


async def get_vampire_data(user_id: int, guild_id: int) -> dict:
    """Récupère toutes les données vampire (soif, BP, saturation)."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        if row:
            return dict(row)
        return {
            "user_id": user_id,
            "guild_id": guild_id,
            "soif_level": 0,
            "blood_potency": 1,
            "saturation_points": 0,
        }


async def set_vampire_data(
    user_id: int,
    guild_id: int,
    soif_level: Optional[int] = None,
    blood_potency: Optional[int] = None,
    saturation_points: Optional[int] = None,
):
    """Met à jour les données vampire."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT user_id FROM vampire_soif WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        exists = await cursor.fetchone()

        if exists:
            updates = []
            params = []
            if soif_level is not None:
                updates.append("soif_level = ?")
                params.append(max(0, min(5, soif_level)))
            if blood_potency is not None:
                updates.append("blood_potency = ?")
                params.append(max(1, min(5, blood_potency)))
            if saturation_points is not None:
                updates.append("saturation_points = ?")
                params.append(max(0, saturation_points))

            if updates:
                updates.append("last_updated = CURRENT_TIMESTAMP")
                params.extend([user_id, guild_id])
                await db.execute(
                    f"UPDATE vampire_soif SET {', '.join(updates)} WHERE user_id = ? AND guild_id = ?",
                    params,
                )
        else:
            await db.execute(
                """
                INSERT INTO vampire_soif (user_id, guild_id, soif_level, blood_potency, saturation_points, last_updated)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (
                    user_id,
                    guild_id,
                    soif_level or 0,
                    blood_potency or 1,
                    saturation_points or 0,
                ),
            )

        await db.commit()


async def reset_vampire_data(user_id: int, guild_id: int, new_clan: str = None):
    """
    Réinitialise toutes les données vampiriques d'un joueur.
    Utilisé quand un personnage meurt et recommence avec un nouveau vampire.
    """
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Réinitialiser les données de soif/puissance
        await db.execute(
            """
            DELETE FROM vampire_soif WHERE user_id = ? AND guild_id = ?
            """,
            (user_id, guild_id),
        )

        # Supprimer les actions complétées
        await db.execute(
            """
            DELETE FROM completed_unique_actions WHERE user_id = ? AND guild_id = ?
            """,
            (user_id, guild_id),
        )

        # Supprimer les cooldowns
        await db.execute(
            """
            DELETE FROM action_cooldowns WHERE user_id = ? AND guild_id = ?
            """,
            (user_id, guild_id),
        )

        # Supprimer les actions en attente
        await db.execute(
            """
            DELETE FROM pending_blood_actions WHERE user_id = ? AND guild_id = ?
            """,
            (user_id, guild_id),
        )

        await db.commit()
        logger.info(f"Données vampire réinitialisées pour user {user_id}")

    # Synchroniser les données réinitialisées vers Google Sheets
    await sync_to_google_sheets(user_id, {
        "clan": new_clan or "",
        "bloodPotency": 1,
        "saturationPoints": 0,
        "soifLevel": 0,
        "pendingActions": [],
        "completedActions": [],
        "cooldowns": {},
    })


async def add_saturation_points(user_id: int, guild_id: int, points: int) -> dict:
    """
    Ajoute des points de saturation et gère la montée en Puissance du Sang.
    Retourne un dict avec les nouvelles valeurs et si une mutation a eu lieu.
    """
    data = await get_vampire_data(user_id, guild_id)
    bp = data.get("blood_potency", 1)
    current_sat = data.get("saturation_points", 0)
    threshold = get_saturation_threshold(bp)

    # Si déjà au max, pas d'évolution possible
    if threshold is None:
        return {"blood_potency": bp, "saturation_points": current_sat, "mutated": False}

    new_sat = current_sat + points
    mutated = False

    # Vérifier si on atteint le seuil
    if new_sat >= threshold:
        bp = min(bp + 1, 5)
        new_sat = 0
        mutated = True

    await set_vampire_data(user_id, guild_id, blood_potency=bp, saturation_points=new_sat)

    return {"blood_potency": bp, "saturation_points": new_sat, "mutated": mutated}


# ============================================
# Fonctions pour la Rage (Loups-Garous)
# Liée à une scène (channel_id)
# ============================================


async def get_rage_data(user_id: int, guild_id: int, channel_id: int) -> dict:
    """Récupère les données de Rage d'un loup-garou pour une scène spécifique."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM werewolf_rage WHERE user_id = ? AND guild_id = ? AND channel_id = ?",
            (user_id, guild_id, channel_id),
        )
        row = await cursor.fetchone()
        if row:
            return dict(row)
        return {
            "user_id": user_id,
            "guild_id": guild_id,
            "channel_id": channel_id,
            "rage_level": 0,
            "is_enraged": False,
            "maintien_counter": 0,
            "last_message_id": None,
            "others_spoke_since": False,
        }


async def set_rage_data(
    user_id: int,
    guild_id: int,
    channel_id: int,
    rage_level: Optional[int] = None,
    is_enraged: Optional[bool] = None,
    maintien_counter: Optional[int] = None,
    last_message_id: Optional[int] = None,
    others_spoke_since: Optional[bool] = None,
):
    """Met à jour les données de Rage d'un loup-garou pour une scène."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Récupérer les données actuelles
        cursor = await db.execute(
            "SELECT * FROM werewolf_rage WHERE user_id = ? AND guild_id = ? AND channel_id = ?",
            (user_id, guild_id, channel_id),
        )
        exists = await cursor.fetchone()

        if exists:
            # Mise à jour sélective
            updates = []
            params = []
            if rage_level is not None:
                updates.append("rage_level = ?")
                params.append(rage_level)
            if is_enraged is not None:
                updates.append("is_enraged = ?")
                params.append(is_enraged)
            if maintien_counter is not None:
                updates.append("maintien_counter = ?")
                params.append(maintien_counter)
            if last_message_id is not None:
                updates.append("last_message_id = ?")
                params.append(last_message_id)
            if others_spoke_since is not None:
                updates.append("others_spoke_since = ?")
                params.append(others_spoke_since)

            if updates:
                updates.append("last_updated = CURRENT_TIMESTAMP")
                params.extend([user_id, guild_id, channel_id])
                await db.execute(
                    f"UPDATE werewolf_rage SET {', '.join(updates)} WHERE user_id = ? AND guild_id = ? AND channel_id = ?",
                    params,
                )
        else:
            # Création avec valeurs par défaut
            await db.execute(
                """
                INSERT INTO werewolf_rage
                (user_id, guild_id, channel_id, rage_level, is_enraged, maintien_counter, last_message_id, others_spoke_since)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    user_id,
                    guild_id,
                    channel_id,
                    rage_level or 0,
                    is_enraged or False,
                    maintien_counter or 0,
                    last_message_id,
                    others_spoke_since or False,
                ),
            )

        await db.commit()


async def increment_rage(user_id: int, guild_id: int, channel_id: int, amount: int = 1) -> int:
    """Incrémente la Rage d'un loup-garou et retourne le nouveau niveau."""
    data = await get_rage_data(user_id, guild_id, channel_id)
    new_level = data["rage_level"] + amount
    await set_rage_data(user_id, guild_id, channel_id, rage_level=new_level)
    return new_level


async def decrement_rage(user_id: int, guild_id: int, channel_id: int, amount: int = 1) -> int:
    """Décrémente la Rage d'un loup-garou et retourne le nouveau niveau."""
    data = await get_rage_data(user_id, guild_id, channel_id)
    new_level = max(0, data["rage_level"] - amount)
    await set_rage_data(user_id, guild_id, channel_id, rage_level=new_level)
    return new_level


async def clear_rage(user_id: int, guild_id: int, channel_id: int):
    """Efface complètement la rage d'un loup-garou pour une scène (fin de scène)."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            "DELETE FROM werewolf_rage WHERE user_id = ? AND guild_id = ? AND channel_id = ?",
            (user_id, guild_id, channel_id),
        )
        await db.commit()


async def clear_all_rage_for_user(user_id: int, guild_id: int):
    """Efface toute la rage d'un loup-garou sur toutes les scènes."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            "DELETE FROM werewolf_rage WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        await db.commit()


async def get_all_enraged_werewolves_in_channel(guild_id: int, channel_id: int) -> list[dict]:
    """Récupère tous les loups-garous enragés dans un salon spécifique."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM werewolf_rage
            WHERE guild_id = ? AND channel_id = ? AND rage_level > 0
        """,
            (guild_id, channel_id),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def get_active_rage_scenes(user_id: int, guild_id: int) -> list[dict]:
    """Récupère toutes les scènes actives avec rage pour un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM werewolf_rage
            WHERE user_id = ? AND guild_id = ? AND rage_level > 0
        """,
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


# ============================================
# Fonctions pour les Actions de Puissance du Sang
# ============================================


async def init_blood_actions_tables():
    """Initialise les tables pour le système d'actions de Puissance du Sang."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Table des actions en attente de validation
        await db.execute("""
            CREATE TABLE IF NOT EXISTS pending_blood_actions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                action_id TEXT NOT NULL,
                action_name TEXT NOT NULL,
                points INTEGER NOT NULL,
                category TEXT NOT NULL,
                message_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'pending'
            )
        """)

        # Table des actions uniques accomplies
        await db.execute("""
            CREATE TABLE IF NOT EXISTS completed_unique_actions (
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                action_id TEXT NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id, action_id)
            )
        """)

        # Table des cooldowns d'actions
        await db.execute("""
            CREATE TABLE IF NOT EXISTS action_cooldowns (
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                action_id TEXT NOT NULL,
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, guild_id, action_id)
            )
        """)

        # Table de l'historique des actions validées
        await db.execute("""
            CREATE TABLE IF NOT EXISTS blood_action_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                action_id TEXT NOT NULL,
                action_name TEXT NOT NULL,
                points INTEGER NOT NULL,
                validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                validated_by INTEGER
            )
        """)

        await db.commit()
        logger.info("Tables des actions de sang initialisées")


async def create_pending_action(
    user_id: int,
    guild_id: int,
    action_id: str,
    action_name: str,
    points: int,
    category: str,
) -> int:
    """Crée une action en attente de validation. Retourne l'ID de l'action."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            INSERT INTO pending_blood_actions (user_id, guild_id, action_id, action_name, points, category)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (user_id, guild_id, action_id, action_name, points, category),
        )
        await db.commit()
        return cursor.lastrowid


async def get_pending_action(action_db_id: int) -> Optional[dict]:
    """Récupère une action en attente par son ID."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE id = ?",
            (action_db_id,),
        )
        row = await cursor.fetchone()
        return dict(row) if row else None


async def update_pending_action_message(action_db_id: int, message_id: int):
    """Met à jour l'ID du message Discord associé à l'action."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute(
            "UPDATE pending_blood_actions SET message_id = ? WHERE id = ?",
            (message_id, action_db_id),
        )
        await db.commit()


async def validate_action(action_db_id: int, validated_by: int) -> Optional[dict]:
    """
    Valide une action en attente.
    Retourne les détails de l'action si validée avec succès.
    """
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row

        # Récupérer l'action
        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE id = ? AND status = 'pending'",
            (action_db_id,),
        )
        action = await cursor.fetchone()

        if not action:
            return None

        action_dict = dict(action)

        # Marquer comme validée
        await db.execute(
            "UPDATE pending_blood_actions SET status = 'validated' WHERE id = ?",
            (action_db_id,),
        )

        # Ajouter à l'historique
        await db.execute(
            """
            INSERT INTO blood_action_history (user_id, guild_id, action_id, action_name, points, validated_by)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                action_dict["user_id"],
                action_dict["guild_id"],
                action_dict["action_id"],
                action_dict["action_name"],
                action_dict["points"],
                validated_by,
            ),
        )

        # Si c'est une action unique, la marquer comme complétée
        if action_dict["category"] == "unique":
            await db.execute(
                """
                INSERT OR IGNORE INTO completed_unique_actions (user_id, guild_id, action_id)
                VALUES (?, ?, ?)
                """,
                (action_dict["user_id"], action_dict["guild_id"], action_dict["action_id"]),
            )

        # Si l'action a un cooldown, le mettre à jour
        if action_dict["category"] == "vampire_blood":
            await db.execute(
                """
                INSERT OR REPLACE INTO action_cooldowns (user_id, guild_id, action_id, last_used)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (action_dict["user_id"], action_dict["guild_id"], action_dict["action_id"]),
            )

        await db.commit()
        return action_dict


async def refuse_action(action_db_id: int) -> Optional[dict]:
    """Refuse une action en attente."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row

        cursor = await db.execute(
            "SELECT * FROM pending_blood_actions WHERE id = ? AND status = 'pending'",
            (action_db_id,),
        )
        action = await cursor.fetchone()

        if not action:
            return None

        await db.execute(
            "UPDATE pending_blood_actions SET status = 'refused' WHERE id = ?",
            (action_db_id,),
        )
        await db.commit()

        return dict(action)


async def is_unique_action_completed(user_id: int, guild_id: int, action_id: str) -> bool:
    """Vérifie si une action unique a déjà été accomplie."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT 1 FROM completed_unique_actions WHERE user_id = ? AND guild_id = ? AND action_id = ?",
            (user_id, guild_id, action_id),
        )
        return await cursor.fetchone() is not None


async def is_action_on_cooldown(user_id: int, guild_id: int, action_id: str, cooldown_days: int) -> tuple[bool, Optional[str]]:
    """
    Vérifie si une action est en cooldown.
    Retourne (is_on_cooldown, date_disponible).
    """
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            SELECT last_used,
                   datetime(last_used, '+' || ? || ' days') as available_at
            FROM action_cooldowns
            WHERE user_id = ? AND guild_id = ? AND action_id = ?
            """,
            (cooldown_days, user_id, guild_id, action_id),
        )
        row = await cursor.fetchone()

        if not row:
            return False, None

        # Vérifier si le cooldown est passé
        cursor = await db.execute(
            """
            SELECT datetime(last_used, '+' || ? || ' days') > datetime('now') as is_on_cooldown,
                   datetime(last_used, '+' || ? || ' days') as available_at
            FROM action_cooldowns
            WHERE user_id = ? AND guild_id = ? AND action_id = ?
            """,
            (cooldown_days, cooldown_days, user_id, guild_id, action_id),
        )
        row = await cursor.fetchone()

        if row and row[0]:
            return True, row[1]

        return False, None


async def has_pending_action(user_id: int, guild_id: int, action_id: str) -> bool:
    """Vérifie si une action est déjà en attente de validation."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            SELECT 1 FROM pending_blood_actions
            WHERE user_id = ? AND guild_id = ? AND action_id = ? AND status = 'pending'
            """,
            (user_id, guild_id, action_id),
        )
        return await cursor.fetchone() is not None


async def get_user_completed_unique_actions(user_id: int, guild_id: int) -> list[str]:
    """Récupère la liste des IDs d'actions uniques accomplies par un joueur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            "SELECT action_id FROM completed_unique_actions WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return [row[0] for row in rows]


async def get_user_action_cooldowns(user_id: int, guild_id: int) -> dict[str, str]:
    """Récupère les cooldowns actifs pour un joueur. Retourne {action_id: available_at}."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute(
            """
            SELECT action_id, datetime(last_used, '+30 days') as available_at
            FROM action_cooldowns
            WHERE user_id = ? AND guild_id = ?
            AND datetime(last_used, '+30 days') > datetime('now')
            """,
            (user_id, guild_id),
        )
        rows = await cursor.fetchall()
        return {row[0]: row[1] for row in rows}


async def get_user_pending_actions(user_id: int, guild_id: int) -> list[str]:
    """Récupère la liste des IDs d'actions en attente pour un joueur."""
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
