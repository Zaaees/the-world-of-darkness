"""
Vue de validation des actions de Puissance du Sang.

Envoie les demandes d'action dans un salon spécifique avec des boutons
Valider/Refuser pour les MJ Vampire et Fondateurs.
"""

import asyncio
import discord
from discord import ui
import logging
from data.blood_actions import get_action_by_id
from utils.site_content import action_display

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


async def refresh_action_fields(embed, action_id, guild_id):
    """Use the latest editorial text, including requests registered before an edit."""
    action = get_action_by_id(action_id)
    if not action:
        return
    action = await action_display(action, guild_id)
    has_hints = False
    for index, field in enumerate(embed.fields):
        limit = min(1024, max(1, 5600 - len(embed) + len(field.value)))
        if field.name == 'Action':
            embed.set_field_at(index, name='Action',
                value=f"**{action['name']}**\n*{action['description']}*"[:limit], inline=False)
        elif field.name == 'Pistes de scène':
            has_hints = True
            embed.set_field_at(index, name=field.name,
                value='\n'.join(f'• {hint}' for hint in action['hints'])[:limit] or '—', inline=False)
    if not has_hints and action['hints'] and len(embed.fields) < 25:
        limit = min(1024, max(0, 5600 - len(embed) - len('Pistes de scène')))
        if limit:
            embed.add_field(name='Pistes de scène',
                value='\n'.join(f'• {hint}' for hint in action['hints'])[:limit], inline=False)


def has_validation_permission(member: discord.Member) -> bool:
    """Vérifie si le membre peut valider/refuser des actions."""
    # Permettre aux administrateurs de valider aussi
    if member.guild_permissions.administrator:
        return True
    return any(role.id in VALIDATION_ROLES for role in member.roles)


class PersistentActionValidationView(ui.View):
    """Vue persistante pour valider/refuser les actions de sang."""

    def __init__(self):
        super().__init__(timeout=None)

    @ui.button(label="Valider", style=discord.ButtonStyle.success, emoji="✅", custom_id="blood_action_validate")
    async def validate_button(self, interaction: discord.Interaction, button: ui.Button):
        """Valide l'action."""
        # Différer la réponse pour éviter le timeout (3s)
        await interaction.response.defer()

        if not has_validation_permission(interaction.user):
            await interaction.followup.send(
                "❌ Seuls les **MJ Vampire** et **Fondateurs** peuvent valider les actions.",
                ephemeral=True,
            )
            return

        # Récupérer l'ID de l'action depuis le footer de l'embed
        embed = interaction.message.embeds[0] if interaction.message.embeds else None
        if not embed or not embed.footer or not embed.footer.text:
            await interaction.followup.send(
                "❌ Impossible de trouver l'ID de l'action.",
                ephemeral=True,
            )
            return

        action_db_id = embed.footer.text.replace("ID: ", "").strip()
        if not action_db_id:
            await interaction.followup.send(
                "❌ ID d'action invalide.",
                ephemeral=True,
            )
            return

        action = await get_pending_action(action_db_id)
        if not action or action['guild_id'] != interaction.guild_id:
            await interaction.followup.send("Action introuvable sur ce serveur.", ephemeral=True)
            return
        try:
            action_result = await validate_action(action_db_id, interaction.user.id)
        except Exception:
            logger.exception("Validation interrompue; demande conservée")
            await interaction.followup.send("Service indisponible. La demande est conservée : réessayez la validation.", ephemeral=True)
            return

        if not action_result or not action_result.get("success"):
            reason = action_result.get("reason", "Action déjà traitée") if action_result else "Action introuvable"
            await interaction.followup.send(
                f"❌ Erreur : {reason}",
                ephemeral=True,
            )
            # Si l'action a échoué, on désactive quand même les boutons pour éviter le spam
            # si c'est parce qu'elle est déjà traitée
            if "déjà traitée" in reason:
                for child in self.children:
                    child.disabled = True
                await interaction.message.edit(view=self)
            return

        # Récupérer les infos de mutation depuis le résultat de validation
        # (add_saturation_points a déjà été appelé dans validate_action)
        result = action_result["mutation"]

        # Progression and idempotency were saved together by award_action.

        # Mettre à jour l'embed
        await refresh_action_fields(embed, action['action_id'], interaction.guild_id)
        embed.color = discord.Color.green()
        embed.set_footer(text=f"✅ Validé par {interaction.user.display_name}")

        if result.get("mutated"):
            embed.add_field(
                name="🩸 MUTATION !",
                value=f"Le vampire a atteint la **Puissance du Sang {result['new_bp']}** !",
                inline=False,
            )

        # Désactiver les boutons
        for child in self.children:
            child.disabled = True

        await interaction.message.edit(embed=embed, view=self)

        # Notifier le joueur par DM (non-bloquant)
        async def notify_player():
            try:
                member = interaction.guild.get_member(action_result["user_id"])
                if member:
                    notify_embed = discord.Embed(
                        title="✅ Action validée !",
                        description=f"**{action_result['action_name']}** a été validée.\n\nLe sang s'épaissit... (+{action_result['points_awarded']})",
                        color=discord.Color.green(),
                    )
                    if result.get("mutated"):
                        notify_embed.add_field(
                            name="🩸 MUTATION !",
                            value=f"Votre sang a atteint la **Puissance {result['new_bp']}** !",
                            inline=False,
                        )
                    await member.send(embed=notify_embed)
            except discord.Forbidden:
                pass
            except Exception as e:
                logger.debug(f"Erreur notification DM: {e}")

        asyncio.create_task(notify_player())

    @ui.button(label="Refuser", style=discord.ButtonStyle.danger, emoji="❌", custom_id="blood_action_refuse")
    async def refuse_button(self, interaction: discord.Interaction, button: ui.Button):
        """Refuse l'action."""
        # Différer la réponse
        await interaction.response.defer()

        if not has_validation_permission(interaction.user):
            await interaction.followup.send(
                "❌ Seuls les **MJ Vampire** et **Fondateurs** peuvent refuser les actions.",
                ephemeral=True,
            )
            return

        # Récupérer l'ID de l'action depuis le footer
        embed = interaction.message.embeds[0] if interaction.message.embeds else None
        if not embed or not embed.footer or not embed.footer.text:
            await interaction.followup.send(
                "❌ Impossible de trouver l'ID de l'action.",
                ephemeral=True,
            )
            return

        action_db_id = embed.footer.text.replace("ID: ", "").strip()
        if not action_db_id:
            await interaction.followup.send(
                "❌ ID d'action invalide.",
                ephemeral=True,
            )
            return

        pending = await get_pending_action(action_db_id)
        if not pending or pending['guild_id'] != interaction.guild_id:
            await interaction.followup.send("Action introuvable sur ce serveur.", ephemeral=True)
            return
        try:
            action = await refuse_action(action_db_id, interaction.user.id)
        except Exception:
            logger.exception("Refus interrompu; demande conservée")
            await interaction.followup.send("Service indisponible. Réessayez le refus : la demande est conservée.", ephemeral=True)
            return

        if not action:
            await interaction.followup.send(
                "❌ Cette action a déjà été traitée.",
                ephemeral=True,
            )
            # Désactiver si déjà traité
            for child in self.children:
                child.disabled = True
            await interaction.message.edit(view=self)
            return

        # Mettre à jour l'embed
        await refresh_action_fields(embed, pending['action_id'], interaction.guild_id)
        embed.color = discord.Color.red()
        embed.set_footer(text=f"❌ Refusé par {interaction.user.display_name}")

        # Désactiver les boutons
        for child in self.children:
            child.disabled = True

        await interaction.message.edit(embed=embed, view=self)

        # Notifier le joueur par DM (non-bloquant)
        async def notify_player():
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
            except Exception as e:
                logger.debug(f"Erreur notification DM: {e}")

        asyncio.create_task(notify_player())


async def send_validation_request(
    bot,
    guild_id: int,
    user_id: int,
    action_db_id: str,
    action_id: str,
    action_name: str,
    action_description: str,
    points: int,
    category: str,
    scene_context=None,
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

    catalog_action = get_action_by_id(action_id)
    action_hints = []
    if catalog_action:
        current_action = await action_display(catalog_action, guild_id)
        action_name = current_action['name']
        action_description = current_action['description']
        action_hints = current_action['hints']

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
        value=f"**{action_name}**\n*{action_description}*"[:1024],
        inline=False,
    )

    if action_hints:
        embed.add_field(name='Pistes de scène',
            value='\n'.join(f'• {hint}' for hint in action_hints)[:1024], inline=False)

    embed.add_field(
        name="Épaississement",
        value=f"+{points}",
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

    if scene_context:
        for key, label in (("sceneLink", "Scène"), ("obstacle", "Obstacle"), ("outcome", "Résultat"), ("participants", "Participants")):
            remaining = max(0, 5600 - len(embed) - len(label))
            value = str(scene_context.get(key, ""))[:min(1000, remaining)]
            if value:
                embed.add_field(name=label, value=value, inline=False)
    embed.set_thumbnail(url=member.display_avatar.url)
    embed.set_footer(text=f"ID: {action_db_id}")

    # Envoyer avec les boutons et mentionner le rôle MJ Vampire
    view = PersistentActionValidationView()
    role_mention = f"<@&{MENTION_ROLE_VALIDATION}>"
    message = await channel.send(content=role_mention, embed=embed, view=view)

    # Sauvegarder l'ID du message
    await update_pending_action_message(action_db_id, message.id)
    return True
