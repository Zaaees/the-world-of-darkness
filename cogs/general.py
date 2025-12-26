"""
Cog Général : Commandes utilitaires pour tous les joueurs.
"""

import logging

import discord
from discord import app_commands
from discord.ext import commands

from data.clans import CLANS
from data.auspices import AUSPICES
from utils.database import get_player, delete_player
from utils.rp_check import is_rp_channel

logger = logging.getLogger(__name__)


class GeneralCog(commands.Cog, name="Général"):
    """Commandes utilitaires pour le Monde des Ténèbres."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="reset",
        description="Réinitialise ton personnage (supprime clan/augure, soif, rage)"
    )
    async def reset_command(self, interaction: discord.Interaction):
        """
        Réinitialise complètement le personnage du joueur.
        Supprime le clan/augure, la soif et la rage.
        Retire également les rôles de clan/augure.
        """
        player = await get_player(interaction.user.id, interaction.guild.id)

        if not player:
            await interaction.response.send_message(
                "❌ Tu n'as pas encore de personnage à réinitialiser.",
                ephemeral=True,
            )
            return

        # Récupérer les infos avant suppression
        clan = player.get("clan")
        auspice = player.get("auspice")
        race = player.get("race")

        # Supprimer les données
        await delete_player(interaction.user.id, interaction.guild.id)

        # Retirer les rôles de clan/augure
        roles_removed = []

        if clan:
            clan_data = CLANS.get(clan)
            if clan_data:
                role = discord.utils.get(interaction.guild.roles, name=clan_data["nom"])
                if role and role in interaction.user.roles:
                    try:
                        await interaction.user.remove_roles(role, reason="Réinitialisation du personnage")
                        roles_removed.append(clan_data["nom"])
                    except discord.Forbidden:
                        pass

        if auspice:
            auspice_data = AUSPICES.get(auspice)
            if auspice_data:
                role = discord.utils.get(interaction.guild.roles, name=auspice_data["nom"])
                if role and role in interaction.user.roles:
                    try:
                        await interaction.user.remove_roles(role, reason="Réinitialisation du personnage")
                        roles_removed.append(auspice_data["nom"])
                    except discord.Forbidden:
                        pass

        # Message de confirmation
        description = "Ton personnage a été réinitialisé.\n\n"
        description += "**Données supprimées :**\n"

        if race == "vampire":
            description += "• Clan et niveau de Soif\n"
        elif race == "loup-garou":
            description += "• Augure et Rage (toutes les scènes)\n"
        else:
            description += "• Toutes les données de personnage\n"

        if roles_removed:
            description += f"\n**Rôles retirés :** {', '.join(roles_removed)}"

        description += "\n\n*Tu peux maintenant utiliser `/vampire` ou `/lycan` pour créer un nouveau personnage.*"

        embed = discord.Embed(
            title="🔄 Personnage Réinitialisé",
            description=description,
            color=discord.Color.blue(),
        )

        await interaction.response.send_message(embed=embed, ephemeral=True)
        logger.info(f"Personnage réinitialisé pour {interaction.user.id} sur {interaction.guild.id}")


async def setup(bot: commands.Bot):
    """Charge le Cog Général."""
    await bot.add_cog(GeneralCog(bot))
    logger.info("Cog Général chargé")
