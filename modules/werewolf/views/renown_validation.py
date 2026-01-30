"""
Vue de validation des demandes de renommée (Hauts faits).

Envoie les demandes dans le salon de logs avec des boutons
Valider/Refuser pour les MJ.
"""

import discord
from discord import ui
import logging

from data.config import ROLE_MJ_WEREWOLF
from modules.werewolf.models.renown import RenownStatus
from modules.werewolf.services.renown import RenownService
from modules.werewolf.services.notifications import NotificationService
from utils.database import DATABASE_PATH
import aiosqlite

logger = logging.getLogger(__name__)


def has_validation_permission(member: discord.Member) -> bool:
    """Vérifie si le membre peut valider/refuser des demandes de renommée."""
    # Permettre aux administrateurs de valider aussi
    if member.guild_permissions.administrator:
        return True
    return any(role.id == ROLE_MJ_WEREWOLF for role in member.roles)


class RenownValidationView(ui.View):
    """Vue persistante pour valider/refuser les demandes de renommée."""

    def __init__(self, request_id: int):
        # Timeout None pour persistance (si on enregistre la vue)
        # Mais pour l'instant on va utiliser un timeout long ou infini
        super().__init__(timeout=None)
        self.request_id = request_id
        # On ajoute l'ID aux custom_id pour pouvoir reconstruire si besoin
        # Mais ici on passe l'ID dans le constructeur
        self.validate_button.custom_id = f"renown_validate_{request_id}"
        self.refuse_button.custom_id = f"renown_refuse_{request_id}"

    @ui.button(label="Valider", style=discord.ButtonStyle.success, emoji="✅")
    async def validate_button(self, interaction: discord.Interaction, button: ui.Button):
        """Valide la demande."""
        await self._handle_action(interaction, RenownStatus.APPROVED)

    @ui.button(label="Refuser", style=discord.ButtonStyle.danger, emoji="❌")
    async def refuse_button(self, interaction: discord.Interaction, button: ui.Button):
        """Refuse la demande."""
        await self._handle_action(interaction, RenownStatus.REJECTED)

    async def _handle_action(self, interaction: discord.Interaction, status: RenownStatus):
        """Traite l'action de validation ou refus."""
        await interaction.response.defer()

        if not has_validation_permission(interaction.user):
            await interaction.followup.send(
                "❌ Seuls les **Conteurs (MJ)** peuvent traiter ces demandes.",
                ephemeral=True,
            )
            return

        # Connexion DB via aiosqlite direct car on est dans une vue Discord
        # (pas d'accès facile à request.app['db'] ici)
        try:
            async with aiosqlite.connect(DATABASE_PATH) as db:
                service = RenownService(db)
                
                # Update status
                req = await service.update_request_status(
                    self.request_id, 
                    status, 
                    str(interaction.user.id)
                )
                
                if not req:
                    await interaction.followup.send(
                        "❌ Demande introuvable ou erreur de mise à jour.",
                        ephemeral=True
                    )
                    return

                # If Approved, recalculate rank
                new_rank = None
                if status == RenownStatus.APPROVED:
                    new_rank = await service.recalculate_player_rank(req.user_id)
                    
                    # Notify User (fire and forget)
                    await NotificationService.send_renown_approval_notification(
                        interaction.client, 
                        str(req.user_id), 
                        req.title, 
                        new_rank
                    )
                
                # Update Embed visually
                embed = interaction.message.embeds[0]
                
                if status == RenownStatus.APPROVED:
                    embed.color = discord.Color.green()
                    embed.set_footer(text=f"✅ Validé par {interaction.user.display_name} | ID: {self.request_id}")
                    if new_rank:
                         embed.add_field(
                            name="Note",
                            value=f"Le joueur est maintenant **Rang {new_rank}**",
                            inline=False
                        )
                else:
                    embed.color = discord.Color.red()
                    embed.set_footer(text=f"❌ Refusé par {interaction.user.display_name} | ID: {self.request_id}")

                # Disable buttons
                for child in self.children:
                    child.disabled = True
                
                await interaction.message.edit(embed=embed, view=self)

        except Exception as e:
            logger.exception(f"Error handling renown action for request {self.request_id}")
            await interaction.followup.send(
                "❌ Erreur interne lors du traitement.",
                ephemeral=True
            )
