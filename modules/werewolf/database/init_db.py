
import aiosqlite
import logging
from utils.database import DATABASE_PATH

logger = logging.getLogger(__name__)

async def init_werewolf_gifts_table():
    """
    Initialise la table werewolf_player_gifts si elle n'existe pas.
    """
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS werewolf_player_gifts (
                    user_id TEXT NOT NULL,
                    gift_id TEXT NOT NULL,
                    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    unlocked_by TEXT,
                    PRIMARY KEY (user_id, gift_id)
                )
            """)
            await db.commit()
            logger.info("Table werewolf_player_gifts initialisée (ou déjà existante).")
            return True
    except Exception as e:
        logger.exception("Erreur lors de l'initialisation de la table werewolf_player_gifts")
        return False
