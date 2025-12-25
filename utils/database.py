"""
Système de persistance pour le bot Monde des Ténèbres.
Utilise SQLite avec aiosqlite pour les opérations asynchrones.
"""

import aiosqlite
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)

DATABASE_PATH = Path(__file__).parent.parent / "data" / "world_of_darkness.db"


async def init_database():
    """Initialise la base de données avec les tables nécessaires."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Table des joueurs
        await db.execute("""
            CREATE TABLE IF NOT EXISTS players (
                user_id INTEGER PRIMARY KEY,
                guild_id INTEGER NOT NULL,
                race TEXT,
                clan TEXT,
                auspice TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Table de la Soif (Vampires)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS vampire_soif (
                user_id INTEGER PRIMARY KEY,
                guild_id INTEGER NOT NULL,
                soif_level INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES players(user_id)
            )
        """)

        # Table de la Rage (Loups-Garous)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS werewolf_rage (
                user_id INTEGER PRIMARY KEY,
                guild_id INTEGER NOT NULL,
                rage_level INTEGER DEFAULT 0,
                is_enraged BOOLEAN DEFAULT FALSE,
                maintien_counter INTEGER DEFAULT 0,
                last_message_id INTEGER,
                others_spoke_since BOOLEAN DEFAULT FALSE,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES players(user_id)
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
            ON CONFLICT(user_id) DO UPDATE SET
                soif_level = excluded.soif_level,
                last_updated = CURRENT_TIMESTAMP
        """,
            (user_id, guild_id, level),
        )
        await db.commit()


async def increment_soif(user_id: int, guild_id: int) -> int:
    """Incrémente la Soif d'un vampire et retourne le nouveau niveau."""
    current = await get_soif(user_id, guild_id)
    new_level = min(5, current + 1)
    await set_soif(user_id, guild_id, new_level)
    return new_level


async def decrement_soif(user_id: int, guild_id: int) -> int:
    """Décrémente la Soif d'un vampire et retourne le nouveau niveau."""
    current = await get_soif(user_id, guild_id)
    new_level = max(0, current - 1)
    await set_soif(user_id, guild_id, new_level)
    return new_level


# ============================================
# Fonctions pour la Rage (Loups-Garous)
# ============================================


async def get_rage_data(user_id: int, guild_id: int) -> dict:
    """Récupère toutes les données de Rage d'un loup-garou."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM werewolf_rage WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
        )
        row = await cursor.fetchone()
        if row:
            return dict(row)
        return {
            "user_id": user_id,
            "guild_id": guild_id,
            "rage_level": 0,
            "is_enraged": False,
            "maintien_counter": 0,
            "last_message_id": None,
            "others_spoke_since": False,
        }


async def set_rage_data(
    user_id: int,
    guild_id: int,
    rage_level: Optional[int] = None,
    is_enraged: Optional[bool] = None,
    maintien_counter: Optional[int] = None,
    last_message_id: Optional[int] = None,
    others_spoke_since: Optional[bool] = None,
):
    """Met à jour les données de Rage d'un loup-garou."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Récupérer les données actuelles
        cursor = await db.execute(
            "SELECT * FROM werewolf_rage WHERE user_id = ? AND guild_id = ?",
            (user_id, guild_id),
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
                params.extend([user_id, guild_id])
                await db.execute(
                    f"UPDATE werewolf_rage SET {', '.join(updates)} WHERE user_id = ? AND guild_id = ?",
                    params,
                )
        else:
            # Création avec valeurs par défaut
            await db.execute(
                """
                INSERT INTO werewolf_rage
                (user_id, guild_id, rage_level, is_enraged, maintien_counter, last_message_id, others_spoke_since)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    user_id,
                    guild_id,
                    rage_level or 0,
                    is_enraged or False,
                    maintien_counter or 0,
                    last_message_id,
                    others_spoke_since or False,
                ),
            )

        await db.commit()


async def increment_rage(user_id: int, guild_id: int, amount: int = 1) -> int:
    """Incrémente la Rage d'un loup-garou et retourne le nouveau niveau."""
    data = await get_rage_data(user_id, guild_id)
    new_level = data["rage_level"] + amount
    await set_rage_data(user_id, guild_id, rage_level=new_level)
    return new_level


async def set_rage_calm(user_id: int, guild_id: int):
    """Calme un loup-garou et remet sa rage sous le seuil critique."""
    await set_rage_data(
        user_id,
        guild_id,
        rage_level=9,
        is_enraged=False,
        maintien_counter=0,
        others_spoke_since=False,
    )


async def get_all_enraged_werewolves(guild_id: int) -> list[dict]:
    """Récupère tous les loups-garous enragés d'un serveur."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT * FROM werewolf_rage
            WHERE guild_id = ? AND is_enraged = TRUE
        """,
            (guild_id,),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
