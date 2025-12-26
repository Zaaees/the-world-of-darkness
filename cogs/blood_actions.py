"""
Cog pour la gestion des actions de Puissance du Sang.

Gère:
- La validation des actions via Discord
- La synchronisation avec Google Sheets
- Les commandes de test/admin
"""

import logging
import aiohttp
import json
import urllib.parse
from datetime import datetime

import discord
from discord import app_commands
from discord.ext import commands, tasks

from data.blood_actions import (
    VALIDATION_CHANNEL_ID,
    UNIQUE_ACTIONS,
    CLAN_ACTIONS,
    RESONANCE_ACTIONS,
    VAMPIRE_BLOOD_ACTIONS,
    CRISIS_ACTIONS,
    TORPOR_ACTIONS,
    GHOUL_ACTIONS,
    get_action_by_id,
    get_clan_action,
)
from utils.database import (
    init_blood_actions_tables,
    create_pending_action,
    is_unique_action_completed,
    is_action_on_cooldown,
    has_pending_action,
    get_player,
    get_vampire_data,
    add_saturation_points,
    sync_to_google_sheets,
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

    @tasks.loop(minutes=1)
    async def check_pending_actions(self):
        """Vérifie les nouvelles actions en attente depuis Google Sheets."""
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

    @app_commands.command(
        name="action_sang",
        description="Soumettre une action pour gagner des points de Puissance du Sang"
    )
    @app_commands.describe(
        action="L'action à soumettre"
    )
    @app_commands.choices(action=[
        # Actions de crise
        app_commands.Choice(name="Frôler la Mort Finale", value="crisis_near_death"),
        app_commands.Choice(name="Dompter la Bête", value="crisis_resist_frenzy"),
        app_commands.Choice(name="La Bête déchaînée", value="crisis_unleash_beast"),
        # Résonances
        app_commands.Choice(name="Sang colérique", value="resonance_choleric"),
        app_commands.Choice(name="Sang mélancolique", value="resonance_melancholic"),
        app_commands.Choice(name="Sang sanguin", value="resonance_sanguine"),
        app_commands.Choice(name="Sang flegmatique", value="resonance_phlegmatic"),
        app_commands.Choice(name="Dyscrasie", value="resonance_dyscrasia"),
        # Sang vampirique
        app_commands.Choice(name="Le baiser du prédateur", value="vampire_kiss"),
        app_commands.Choice(name="Sang d'ancien", value="elder_blood"),
        app_commands.Choice(name="La Vaulderie", value="vaulderie"),
        # Actions uniques
        app_commands.Choice(name="Première danse avec la Bête", value="first_frenzy"),
        app_commands.Choice(name="Le goût des cendres", value="first_kill"),
        app_commands.Choice(name="Baiser du soleil", value="first_sun"),
        app_commands.Choice(name="Le Sang qui lie", value="first_blood_bond"),
        app_commands.Choice(name="Dernier souffle mortel", value="last_mortal"),
        app_commands.Choice(name="La première servitude", value="first_ghoul"),
    ])
    async def submit_action(self, interaction: discord.Interaction, action: str):
        """Soumet une action pour validation."""
        # Vérifier que c'est un vampire
        player = await get_player(interaction.user.id, interaction.guild.id)
        if not player or player.get("race") != "vampire":
            await interaction.response.send_message(
                "❌ Tu dois être un vampire pour utiliser cette commande.",
                ephemeral=True,
            )
            return

        # Récupérer les infos de l'action
        action_info = get_action_by_id(action)
        if not action_info:
            await interaction.response.send_message(
                "❌ Action non reconnue.",
                ephemeral=True,
            )
            return

        category = action_info.get("category", "unknown")

        # Vérifier si l'action est déjà en attente
        if await has_pending_action(interaction.user.id, interaction.guild.id, action):
            await interaction.response.send_message(
                "❌ Cette action est déjà en attente de validation.",
                ephemeral=True,
            )
            return

        # Vérifier si c'est une action unique déjà accomplie
        if category == "unique":
            if await is_unique_action_completed(interaction.user.id, interaction.guild.id, action):
                await interaction.response.send_message(
                    "❌ Tu as déjà accompli cette action unique.",
                    ephemeral=True,
                )
                return

        # Vérifier le cooldown pour les actions de sang vampirique
        if category == "vampire_blood":
            cooldown_days = action_info.get("cooldown_days", 30)
            is_on_cooldown, available_at = await is_action_on_cooldown(
                interaction.user.id, interaction.guild.id, action, cooldown_days
            )
            if is_on_cooldown:
                await interaction.response.send_message(
                    f"❌ Cette action est en cooldown jusqu'au {available_at}.",
                    ephemeral=True,
                )
                return

        # Créer l'action en attente
        action_db_id = await create_pending_action(
            user_id=interaction.user.id,
            guild_id=interaction.guild.id,
            action_id=action,
            action_name=action_info["name"],
            points=action_info["points"],
            category=category,
        )

        # Envoyer la demande de validation
        await send_validation_request(
            bot=self.bot,
            guild_id=interaction.guild.id,
            user_id=interaction.user.id,
            action_db_id=action_db_id,
            action_id=action,
            action_name=action_info["name"],
            action_description=action_info.get("description", ""),
            points=action_info["points"],
            category=category,
        )

        await interaction.response.send_message(
            f"✅ **{action_info['name']}** soumise pour validation.\n"
            f"Tu seras notifié quand un administrateur aura traité ta demande.",
            ephemeral=True,
        )

    @app_commands.command(
        name="action_clan",
        description="Soumettre l'action thématique de ton clan"
    )
    async def submit_clan_action(self, interaction: discord.Interaction):
        """Soumet l'action de clan pour validation."""
        # Vérifier que c'est un vampire avec un clan
        player = await get_player(interaction.user.id, interaction.guild.id)
        if not player or player.get("race") != "vampire":
            await interaction.response.send_message(
                "❌ Tu dois être un vampire pour utiliser cette commande.",
                ephemeral=True,
            )
            return

        clan = player.get("clan")
        if not clan:
            await interaction.response.send_message(
                "❌ Tu n'as pas de clan défini. Utilise /vampire pour en choisir un.",
                ephemeral=True,
            )
            return

        # Récupérer l'action du clan
        clan_action = get_clan_action(clan)
        if not clan_action:
            await interaction.response.send_message(
                f"❌ Aucune action définie pour le clan {clan}.",
                ephemeral=True,
            )
            return

        action_id = clan_action["id"]

        # Vérifier si l'action est déjà en attente
        if await has_pending_action(interaction.user.id, interaction.guild.id, action_id):
            await interaction.response.send_message(
                "❌ Cette action est déjà en attente de validation.",
                ephemeral=True,
            )
            return

        # Créer l'action en attente
        action_db_id = await create_pending_action(
            user_id=interaction.user.id,
            guild_id=interaction.guild.id,
            action_id=action_id,
            action_name=clan_action["name"],
            points=clan_action["points"],
            category="clan",
        )

        # Envoyer la demande de validation
        await send_validation_request(
            bot=self.bot,
            guild_id=interaction.guild.id,
            user_id=interaction.user.id,
            action_db_id=action_db_id,
            action_id=action_id,
            action_name=clan_action["name"],
            action_description=clan_action.get("description", ""),
            points=clan_action["points"],
            category="clan",
        )

        await interaction.response.send_message(
            f"✅ **{clan_action['name']}** soumise pour validation.\n"
            f"Tu seras notifié quand un administrateur aura traité ta demande.",
            ephemeral=True,
        )


async def setup(bot: commands.Bot):
    """Charge le Cog BloodActions."""
    await bot.add_cog(BloodActionsCog(bot))
    logger.info("Cog BloodActions chargé")
