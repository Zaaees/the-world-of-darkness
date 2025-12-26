"""
Vue de validation des actions de Puissance du Sang.

Envoie les demandes d'action dans un salon spécifique avec des boutons
Valider/Refuser pour les MJ Vampire et Fondateurs.
"""

import asyncio
import discord
from discord import ui
import logging

from data.config import (
    VALIDATION_CHANNEL_ID,
    VALIDATION_ROLES,
    MENTION_ROLE_VALIDATION,
)
from utils.database import (
    validate_action,
    refuse_action,
    add_saturation_points,
    get_pending_action,
    update_pending_action_message,
    get_player,
    get_vampire_data,
    sync_to_google_sheets,
    get_user_pending_actions,
    get_user_completed_unique_actions,
    get_user_action_cooldowns,
)

logger = logging.getLogger(__name__)


def has_validation_permission(member: discord.Member) -> bool:
    """Vérifie si le membre peut valider/refuser des actions."""
    return any(role.id in VALIDATION_ROLES for role in member.roles)


class PersistentActionValidationView(ui.View):
    """Vue persistante pour valider/refuser les actions de sang."""

    def __init__(self):
        super().__init__(timeout=None)

    @ui.button(label="Valider", style=discord.ButtonStyle.success, emoji="✅", custom_id="blood_action_validate")
    async def validate_button(self, interaction: discord.Interaction, button: ui.Button):
        """Valide l'action."""
        if not has_validation_permission(interaction.user):
            await interaction.response.send_message(
                "❌ Seuls les **MJ Vampire** et **Fondateurs** peuvent valider les actions.",
                ephemeral=True,
            )
            return

        # Récupérer l'ID de l'action depuis le footer de l'embed
        embed = interaction.message.embeds[0] if interaction.message.embeds else None
        if not embed or not embed.footer or not embed.footer.text:
            await interaction.response.send_message(
                "❌ Impossible de trouver l'ID de l'action.",
                ephemeral=True,
            )
            return

        try:
            action_db_id = int(embed.footer.text.replace("ID: ", ""))
        except ValueError:
            await interaction.response.send_message(
                "❌ ID d'action invalide.",
                ephemeral=True,
            )
            return

        # Valider l'action
        action = await validate_action(action_db_id, interaction.user.id)

        if not action:
            await interaction.response.send_message(
                "❌ Cette action a déjà été traitée.",
                ephemeral=True,
            )
            return

        # Ajouter les points de saturation
        result = await add_saturation_points(
            action["user_id"],
            action["guild_id"],
            action["points"],
        )

        # Synchroniser vers Google Sheets en arrière-plan (non-bloquant)
        async def background_sync():
            try:
                player = await get_player(action["user_id"], action["guild_id"])
                if player:
                    vampire_data = await get_vampire_data(action["user_id"], action["guild_id"])
                    # Récupérer les listes mises à jour
                    pending = await get_user_pending_actions(action["user_id"], action["guild_id"])
                    completed = await get_user_completed_unique_actions(action["user_id"], action["guild_id"])
                    cooldowns = await get_user_action_cooldowns(action["user_id"], action["guild_id"])

                    await sync_to_google_sheets(action["user_id"], {
                        "clan": player.get("clan", ""),
                        "bloodPotency": result["blood_potency"],
                        "saturationPoints": result["saturation_points"],
                        "soifLevel": vampire_data.get("soif_level", 0),
                        "pendingActions": pending,
                        "completedActions": completed,
                        "cooldowns": cooldowns,
                    })
            except Exception as e:
                logger.error(f"Erreur sync Google Sheets en arrière-plan: {e}")

        asyncio.create_task(background_sync())

        # Mettre à jour l'embed
        embed.color = discord.Color.green()
        embed.set_footer(text=f"✅ Validé par {interaction.user.display_name}")

        if result.get("mutated"):
            embed.add_field(
                name="🩸 MUTATION !",
                value=f"Le vampire a atteint la **Puissance du Sang {result['blood_potency']}** !",
                inline=False,
            )

        # Désactiver les boutons
        for child in self.children:
            child.disabled = True

        await interaction.response.edit_message(embed=embed, view=self)

        # Notifier le joueur par DM
        try:
            member = interaction.guild.get_member(action["user_id"])
            if member:
                notify_embed = discord.Embed(
                    title="✅ Action validée !",
                    description=f"**{action['action_name']}** a été validée.\n\n+{action['points']} points de saturation",
                    color=discord.Color.green(),
                )
                if result.get("mutated"):
                    notify_embed.add_field(
                        name="🩸 MUTATION !",
                        value=f"Votre sang a atteint la **Puissance {result['blood_potency']}** !",
                        inline=False,
                    )
                await member.send(embed=notify_embed)
        except discord.Forbidden:
            pass

    @ui.button(label="Refuser", style=discord.ButtonStyle.danger, emoji="❌", custom_id="blood_action_refuse")
    async def refuse_button(self, interaction: discord.Interaction, button: ui.Button):
        """Refuse l'action."""
        if not has_validation_permission(interaction.user):
            await interaction.response.send_message(
                "❌ Seuls les **MJ Vampire** et **Fondateurs** peuvent refuser les actions.",
                ephemeral=True,
            )
            return

        # Récupérer l'ID de l'action depuis le footer
        embed = interaction.message.embeds[0] if interaction.message.embeds else None
        if not embed or not embed.footer or not embed.footer.text:
            await interaction.response.send_message(
                "❌ Impossible de trouver l'ID de l'action.",
                ephemeral=True,
            )
            return

        try:
            action_db_id = int(embed.footer.text.replace("ID: ", ""))
        except ValueError:
            await interaction.response.send_message(
                "❌ ID d'action invalide.",
                ephemeral=True,
            )
            return

        # Refuser l'action
        action = await refuse_action(action_db_id)

        if not action:
            await interaction.response.send_message(
                "❌ Cette action a déjà été traitée.",
                ephemeral=True,
            )
            return

        # Mettre à jour l'embed
        embed.color = discord.Color.red()
        embed.set_footer(text=f"❌ Refusé par {interaction.user.display_name}")

        # Désactiver les boutons
        for child in self.children:
            child.disabled = True

        await interaction.response.edit_message(embed=embed, view=self)

        # Notifier le joueur par DM
        try:
            member = interaction.guild.get_member(action["user_id"])
            if member:
                notify_embed = discord.Embed(
                    title="❌ Action refusée",
                    description=f"**{action['action_name']}** a été refusée.",
                    color=discord.Color.red(),
                )
                await member.send(embed=notify_embed)
        except discord.Forbidden:
            pass


async def send_validation_request(
    bot,
    guild_id: int,
    user_id: int,
    action_db_id: int,
    action_id: str,
    action_name: str,
    action_description: str,
    points: int,
    category: str,
):
    """
    Envoie une demande de validation dans le salon de validation.
    Mentionne le rôle MJ Vampire pour notification.
    """
    guild = bot.get_guild(guild_id)
    if not guild:
        logger.warning(f"Guild {guild_id} non trouvée")
        return

    channel = guild.get_channel(VALIDATION_CHANNEL_ID)
    if not channel:
        logger.warning(f"Canal de validation {VALIDATION_CHANNEL_ID} non trouvé")
        return

    member = guild.get_member(user_id)
    if not member:
        logger.warning(f"Membre {user_id} non trouvé")
        return

    # Récupérer les infos du joueur
    player = await get_player(user_id, guild_id)
    vampire_data = await get_vampire_data(user_id, guild_id)

    # Créer l'embed
    embed = discord.Embed(
        title="🩸 Demande de validation d'action",
        color=discord.Color.gold(),
    )

    embed.add_field(
        name="Joueur",
        value=f"{member.mention} ({member.display_name})",
        inline=True,
    )

    if player and player.get("clan"):
        embed.add_field(
            name="Clan",
            value=player["clan"].capitalize(),
            inline=True,
        )

    embed.add_field(
        name="Puissance du Sang",
        value=f"{vampire_data.get('blood_potency', 1)}/5",
        inline=True,
    )

    embed.add_field(
        name="Action",
        value=f"**{action_name}**\n*{action_description}*",
        inline=False,
    )

    embed.add_field(
        name="Points",
        value=f"+{points} saturation",
        inline=True,
    )

    embed.add_field(
        name="Catégorie",
        value=category,
        inline=True,
    )

    # Progression actuelle
    current_sat = vampire_data.get("saturation_points", 0)
    bp = vampire_data.get("blood_potency", 1)
    thresholds = {1: 30, 2: 60, 3: 120, 4: 250, 5: None}
    threshold = thresholds.get(bp)

    if threshold:
        new_sat = current_sat + points
        will_mutate = new_sat >= threshold
        progress_text = f"{current_sat}/{threshold} → {min(new_sat, threshold)}/{threshold}"
        if will_mutate:
            progress_text += " ⚠️ **MUTATION**"
        embed.add_field(
            name="Progression",
            value=progress_text,
            inline=False,
        )

    embed.set_thumbnail(url=member.display_avatar.url)
    embed.set_footer(text=f"ID: {action_db_id}")

    # Envoyer avec les boutons et mentionner le rôle MJ Vampire
    view = PersistentActionValidationView()
    role_mention = f"<@&{MENTION_ROLE_VALIDATION}>"
    message = await channel.send(content=role_mention, embed=embed, view=view)

    # Sauvegarder l'ID du message
    await update_pending_action_message(action_db_id, message.id)
