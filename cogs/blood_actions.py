"""
Cog pour la gestion des actions de Puissance du Sang.

Gère:
- La validation des actions via Discord
- La synchronisation avec Google Sheets
- Les commandes de test/admin
"""

import logging
import aiohttp

import discord
from discord.ext import commands, tasks

from data.blood_actions import get_action_by_id
from utils.database import (
    init_blood_actions_tables,
    create_pending_action,
    has_pending_action,
    GOOGLE_SHEETS_API,
)
from views.blood_action_validation import (
    PersistentActionValidationView,
    send_validation_request,
)

logger = logging.getLogger(__name__)


class BloodActionsCog(commands.Cog, name="BloodActions"):
    """Système d'actions pour la Puissance du Sang."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.check_pending_actions.start()

    def cog_unload(self):
        self.check_pending_actions.cancel()

    async def cog_load(self):
        """Initialise les tables et enregistre les vues persistantes."""
        await init_blood_actions_tables()
        # Enregistrer la vue persistante pour les boutons de validation
        self.bot.add_view(PersistentActionValidationView())
        logger.info("Vues persistantes de validation enregistrées")

    @tasks.loop(seconds=15)
    async def check_pending_actions(self):
        """Vérifie les nouvelles actions en attente depuis Google Sheets (toutes les 15s)."""
        try:
            url = f"{GOOGLE_SHEETS_API}?action=get_pending_actions"

            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("success") and data.get("pendingActions"):
                            for action in data["pendingActions"]:
                                await self._process_pending_action_from_sheets(action)
        except Exception as e:
            logger.debug(f"Erreur check pending actions: {e}")

    @check_pending_actions.before_loop
    async def before_check_pending_actions(self):
        """Attend que le bot soit prêt."""
        await self.bot.wait_until_ready()

    async def _process_pending_action_from_sheets(self, action_data: dict):
        """Traite une action en attente depuis Google Sheets."""
        try:
            user_id = int(action_data.get("userId", 0))
            action_id = action_data.get("actionId", "")
            row_id = action_data.get("rowId", 0)

            if not user_id or not action_id:
                return

            # Trouver le guild (on prend le premier guild où le bot est présent)
            guild = None
            for g in self.bot.guilds:
                if g.get_member(user_id):
                    guild = g
                    break

            if not guild:
                logger.warning(f"Aucun guild trouvé pour l'utilisateur {user_id}")
                return

            # Récupérer les infos de l'action
            action_info = get_action_by_id(action_id)
            if not action_info:
                logger.warning(f"Action {action_id} non trouvée")
                return

            # Vérifier si l'action est déjà en attente localement
            if await has_pending_action(user_id, guild.id, action_id):
                return

            # Créer l'action en attente localement
            action_db_id = await create_pending_action(
                user_id=user_id,
                guild_id=guild.id,
                action_id=action_id,
                action_name=action_info["name"],
                points=action_info["points"],
                category=action_info.get("category", "unknown"),
            )

            # Envoyer la demande de validation sur Discord
            await send_validation_request(
                bot=self.bot,
                guild_id=guild.id,
                user_id=user_id,
                action_db_id=action_db_id,
                action_id=action_id,
                action_name=action_info["name"],
                action_description=action_info.get("description", ""),
                points=action_info["points"],
                category=action_info.get("category", "unknown"),
            )

            # Marquer l'action comme traitée dans Google Sheets
            mark_url = f"{GOOGLE_SHEETS_API}?action=mark_action_processed&rowId={row_id}"
            async with aiohttp.ClientSession() as session:
                await session.get(mark_url, timeout=aiohttp.ClientTimeout(total=5))

            logger.info(f"Action {action_id} de {user_id} envoyée pour validation")

        except Exception as e:
            logger.error(f"Erreur traitement action: {e}")


async def setup(bot: commands.Bot):
    """Charge le Cog BloodActions."""
    await bot.add_cog(BloodActionsCog(bot))
    logger.info("Cog BloodActions chargé")
