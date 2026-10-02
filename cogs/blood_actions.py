"""
Cog pour la gestion des actions de Puissance du Sang.

Gère:
- La validation des actions via Discord
- La synchronisation avec Google Sheets
- Les commandes de test/admin
"""

import logging
from copy import deepcopy
from utils.sheets_client import sheets_request
from utils.site_content import action_display, catalog_values
from data.config import VALIDATION_CHANNEL_ID

import discord
from discord.ext import commands, tasks

from data.blood_actions import get_action_by_id, get_action_points, is_action_available, normalize_clan
from utils.database import (
    init_blood_actions_tables,
    create_pending_action,
    has_pending_action,
    get_pending_action,
    get_all_pending_actions,
    get_from_google_sheets,
)
from views.blood_action_validation import (
    PersistentActionValidationView,
    send_validation_request,
    refresh_action_fields,
)

logger = logging.getLogger(__name__)


class BloodActionsCog(commands.Cog, name="BloodActions"):
    """Système d'actions pour la Puissance du Sang."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self._content_values = {}
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
        await self._refresh_pending_action_texts()
        try:
            data = await sheets_request("get_pending_actions")
            for action in data.get("pendingActions", []):
                await self._process_pending_action_from_sheets(action)
        except Exception as e:
            logger.debug(f"Erreur check pending actions: {e}")

    async def _refresh_pending_action_texts(self):
        """Refresh existing pending messages after editorial changes, without mentions."""
        for guild in self.bot.guilds:
            try:
                values = await catalog_values(guild.id)
                if self._content_values.get(guild.id) == values:
                    continue
                channel = guild.get_channel(VALIDATION_CHANNEL_ID)
                if not channel:
                    continue
                pending = await get_all_pending_actions(guild.id)
                for action in pending:
                    if not action.get('message_id'):
                        continue
                    try:
                        message = await channel.fetch_message(action['message_id'])
                    except discord.NotFound:
                        continue
                    if not message.embeds:
                        continue
                    embed = deepcopy(message.embeds[0])
                    if embed.footer.text != f"ID: {action['submission_id']}":
                        continue
                    before = deepcopy(embed.to_dict())
                    await refresh_action_fields(embed, action['action_id'], guild.id)
                    if embed.to_dict() != before:
                        current = await get_pending_action(action['submission_id'])
                        if current and current['status'] == 'pending':
                            await message.edit(embed=embed)
                self._content_values[guild.id] = values
            except Exception:
                # Leave the cache unchanged so a transient failure is retried.
                logger.exception("Actualisation des textes des demandes MJ interrompue (serveur %s)", guild.id)

    @check_pending_actions.before_loop
    async def before_check_pending_actions(self):
        """Attend que le bot soit prêt."""
        await self.bot.wait_until_ready()

    async def _process_pending_action_from_sheets(self, action_data: dict):
        """Traite une action en attente depuis Google Sheets."""
        try:
            user_id = int(action_data.get("userId", 0))
            action_id = action_data.get("actionId", "")
            row_id = str(action_data.get("rowId", ""))

            if not user_id or not action_id:
                return

            # New requests explicitly bind the scene to one Discord server.
            guild_id = action_data.get("guildId")
            guild = self.bot.get_guild(int(guild_id)) if guild_id else next(
                (g for g in self.bot.guilds if g.get_member(user_id)), None)
            existing = await get_pending_action(f"sheets:{row_id}")
            if existing and (existing.get("message_id") or existing["status"] != "pending"):
                await sheets_request("mark_action_processed", rowId=row_id)
                return
            if not guild:
                logger.warning(f"Aucun guild trouvé pour l'utilisateur {user_id}")
                return

            # Récupérer les infos de l'action
            action_info = get_action_by_id(action_id)
            if not action_info:
                logger.warning(f"Action {action_id} non trouvée")
                return

            action_info = await action_display(action_info, guild.id)

            character = await get_from_google_sheets(user_id)
            if not character:
                return
            potency = int(character.get("bloodPotency", 1))
            if (potency >= 5 or not is_action_available(action_info, potency)
                    or (action_info.get("clan") and action_info["clan"] != normalize_clan(character.get("clan", "")))):
                logger.warning("Action de Vitae indisponible pour ce personnage")
                return
            completed = character.get("completedActions", [])
            if action_info["category"] == "unique" and any(
                key in completed for key in [action_id, *action_info.get("legacyCompletedIds", [])]
            ):
                return
            # Freeze server-calculated points when the request is registered.
            points = get_action_points(action_info, potency)

            context = "\n".join(str(action_data.get(field, '')) for field in
                ('sceneLink', 'obstacle', 'outcome', 'participants'))
            # Créer l'action en attente localement
            action_db_id = await create_pending_action(
                user_id=user_id,
                guild_id=guild.id,
                action_id=action_id,
                action_name=action_info["name"],
                points=points,
                category=action_info.get("category", "unknown"),
                description=context, submission_id=f"sheets:{row_id}",
            )

            registered = await get_pending_action(action_db_id)
            if registered and registered.get('message_id'):
                await sheets_request("mark_action_processed", rowId=row_id)
                return
            # Envoyer la demande de validation sur Discord
            delivered = await send_validation_request(
                bot=self.bot,
                guild_id=guild.id,
                user_id=user_id,
                action_db_id=action_db_id,
                action_id=action_id,
                action_name=action_info["name"],
                action_description=action_info.get("description", ""),
                scene_context=action_data,
                points=points,
                category=action_info.get("category", "unknown"),
            )

            # Marquer l'action comme traitée dans Google Sheets
            if not delivered:
                return  # Keep the queue item for the next poll.
            await sheets_request("mark_action_processed", rowId=row_id)

            logger.info(f"Action {action_id} de {user_id} envoyée pour validation")

        except Exception as e:
            logger.error(f"Erreur traitement action: {e}")


async def setup(bot: commands.Bot):
    """Charge le Cog BloodActions."""
    await bot.add_cog(BloodActionsCog(bot))
    logger.info("Cog BloodActions chargé")
