"""
Vue de validation des actions de Puissance du Sang.

Envoie les demandes d'action dans un salon spécifique avec des boutons
Valider/Refuser pour les MJ Vampire et Fondateurs.
"""

import asyncio
import discord
from discord import ui
import logging
from data.blood_actions import SATURATION_THRESHOLDS, advance_saturation, get_action_by_id, rank_key_action_id
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


def pending_id_from(message) -> str:
    """The request id travels in the embed footer of the validation message."""
    embed = message.embeds[0] if message and message.embeds else None
    if not embed or not embed.footer or not embed.footer.text:
        return ""
    return embed.footer.text.replace("ID: ", "").strip()


class AdjustPointsModal(ui.Modal, title="Valider avec ajustement"):
    """Le MJ corrige le montant (double compte, réussite partielle) avant de valider."""

    points = ui.TextInput(label="Épaississement accordé", min_length=1, max_length=3, required=True)

    def __init__(self, view: "PersistentActionValidationView", message: discord.Message, default: int):
        super().__init__()
        self.view_ref, self.message = view, message
        self.points.default = str(default)

    async def on_submit(self, interaction: discord.Interaction):
        await interaction.response.defer()
        try:
            value = int(self.points.value)
            if value < 0:
                raise ValueError
        except ValueError:
            await interaction.followup.send("Indique un nombre de points positif ou nul.", ephemeral=True)
            return
        await self.view_ref.finish_validation(interaction, self.message, points_awarded=value)


class PersistentActionValidationView(ui.View):
    """Vue persistante pour valider/refuser les actions de sang."""

    def __init__(self):
        super().__init__(timeout=None)

    @ui.button(label="Valider", style=discord.ButtonStyle.success, emoji="✅", custom_id="blood_action_validate")
    async def validate_button(self, interaction: discord.Interaction, button: ui.Button):
        """Valide l'action au montant figé (rendement décroissant recalculé par le script)."""
        # Différer la réponse pour éviter le timeout (3s)
        await interaction.response.defer()

        if not has_validation_permission(interaction.user):
            await interaction.followup.send(
                "❌ Seuls les **MJ Vampire** et **Fondateurs** peuvent valider les actions.",
                ephemeral=True,
            )
            return
        await self.finish_validation(interaction, interaction.message)

    @ui.button(label="Ajuster", style=discord.ButtonStyle.secondary, emoji="✏️", custom_id="blood_action_adjust")
    async def adjust_button(self, interaction: discord.Interaction, button: ui.Button):
        """Valide avec un montant corrigé par le MJ."""
        if not has_validation_permission(interaction.user):
            await interaction.response.send_message(
                "❌ Seuls les **MJ Vampire** et **Fondateurs** peuvent valider les actions.", ephemeral=True)
            return
        action = await get_pending_action(pending_id_from(interaction.message))
        if not action or action['guild_id'] != interaction.guild_id or action['status'] != 'pending':
            await interaction.response.send_message("Action introuvable ou déjà traitée.", ephemeral=True)
            return
        await interaction.response.send_modal(AdjustPointsModal(self, interaction.message, action['points']))

    async def finish_validation(self, interaction: discord.Interaction, message: discord.Message, points_awarded=None):
        """Shared tail of both validation paths; the interaction is already deferred."""
        embed = message.embeds[0] if message.embeds else None
        action_db_id = pending_id_from(message)
        if not embed or not action_db_id:
            await interaction.followup.send(
                "❌ Impossible de trouver l'ID de l'action.",
                ephemeral=True,
            )
            return

        action = await get_pending_action(action_db_id)
        if not action or action['guild_id'] != interaction.guild_id:
            await interaction.followup.send("Action introuvable sur ce serveur.", ephemeral=True)
            return
        try:
            action_result = await validate_action(action_db_id, interaction.user.id, points_awarded)
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
                await message.edit(view=self)
            return

        # Récupérer les infos de mutation depuis le résultat de validation
        # (award_action a déjà été appelé dans validate_action)
        result = action_result["mutation"]

        # Progression and idempotency were saved together by award_action.

        # Mettre à jour l'embed
        await refresh_action_fields(embed, action['action_id'], interaction.guild_id)
        embed.color = discord.Color.green()
        awarded = action_result["points_awarded"]
        suffix = f" (+{awarded}" + (", ajusté" if points_awarded is not None else
                                   (f" sur {action['points']}" if awarded != action['points'] else "")) + ")"
        embed.set_footer(text=f"✅ Validé par {interaction.user.display_name}{suffix}")

        if result.get("mutated"):
            embed.add_field(
                name="🩸 MUTATION !",
                value=f"Le vampire a atteint la **Puissance du Sang {result['new_bp']}** !",
                inline=False,
            )
        elif result.get("blocked_by_key"):
            embed.add_field(
                name="🔑 Seuil atteint, clé manquante",
                value=f"Le seuil est franchi mais la voie de clan `{result['blocked_by_key']}` n'est pas encore accomplie : "
                      f"la mutation se produira à sa validation.",
                inline=False,
            )

        # Désactiver les boutons
        for child in self.children:
            child.disabled = True

        await message.edit(embed=embed, view=self)

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
                    elif result.get("blocked_by_key"):
                        notify_embed.add_field(
                            name="🔑 Le seuil attend sa clé",
                            value="Accomplissez la voie de votre clan au rang actuel pour que la mutation s'accomplisse.",
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
        action_db_id = pending_id_from(interaction.message)
        if not embed or not action_db_id:
            await interaction.followup.send(
                "❌ Impossible de trouver l'ID de l'action.",
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

    # Progression actuelle (seuils partagés avec le catalogue ; l'excédent est reporté)
    current_sat = vampire_data.get("saturation_points", 0)
    bp = vampire_data.get("blood_potency", 1)
    threshold = SATURATION_THRESHOLDS.get(bp)

    if bp < 5 and threshold:
        new_bp, new_sat = advance_saturation(bp, current_sat, points)
        if new_bp > bp:
            next_threshold = SATURATION_THRESHOLDS.get(new_bp)
            progress_text = (f"{current_sat}/{threshold} → ⚠️ **MUTATION vers {new_bp}**"
                             + (f" ({new_sat}/{next_threshold} reportés)" if new_bp < 5 else ""))
            clan_key = player.get("clan") if player else None
            if clan_key:
                progress_text += f"\n🔑 Requiert la voie de clan `{rank_key_action_id(clan_key, bp)}` déjà validée."
        else:
            progress_text = f"{current_sat}/{threshold} → {new_sat}/{threshold}"
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
