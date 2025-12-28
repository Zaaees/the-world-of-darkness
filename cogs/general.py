"""
Cog Général : Commandes utilitaires pour tous les joueurs.
"""

import logging

import discord
from discord.ext import commands

from data.clans import CLANS
from data.auspices import AUSPICES
from data.config import ROLE_VAMPIRE, ROLE_LOUP_GAROU
from utils.database import get_player, delete_player, get_vampire_data, get_rage_data

logger = logging.getLogger(__name__)


class GeneralCog(commands.Cog, name="Général"):
    """Commandes utilitaires pour le Monde des Ténèbres."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command(name="reset")
    @commands.has_permissions(administrator=True)
    async def reset_command(self, ctx: commands.Context, member: discord.Member):
        """
        [Admin] Réinitialise complètement le personnage d'un joueur.
        Supprime le clan/augure, la soif et la rage.
        Retire également les rôles de clan/augure.

        Usage: !reset @membre
        """
        # Récupérer les données du joueur
        player = await get_player(member.id, ctx.guild.id)

        # Vérifier si le joueur a le rôle Vampire ou Loup-garou
        has_vampire_role = any(role.id == ROLE_VAMPIRE for role in member.roles)
        has_werewolf_role = any(role.id == ROLE_LOUP_GAROU for role in member.roles)

        # Vérifier s'il y a des données à supprimer
        vampire_data = await get_vampire_data(member.id, ctx.guild.id) if has_vampire_role else None

        if not player and not vampire_data and not has_vampire_role and not has_werewolf_role:
            await ctx.send(
                f"❌ {member.display_name} n'a pas de personnage à réinitialiser.",
            )
            return

        # Récupérer les infos avant suppression
        clan = player.get("clan") if player else None
        auspice = player.get("auspice") if player else None
        race = player.get("race") if player else None

        # Supprimer les données (mais garder la race si l'utilisateur a encore le rôle)
        await delete_player(member.id, ctx.guild.id, keep_race=has_vampire_role or has_werewolf_role)

        # Retirer les rôles de clan/augure
        roles_removed = []

        if clan:
            clan_data = CLANS.get(clan)
            if clan_data:
                role = discord.utils.get(ctx.guild.roles, name=clan_data["nom"])
                if role and role in member.roles:
                    try:
                        await member.remove_roles(role, reason="Réinitialisation du personnage par admin")
                        roles_removed.append(clan_data["nom"])
                    except discord.Forbidden:
                        pass

        if auspice:
            auspice_data = AUSPICES.get(auspice)
            if auspice_data:
                role = discord.utils.get(ctx.guild.roles, name=auspice_data["nom"])
                if role and role in member.roles:
                    try:
                        await member.remove_roles(role, reason="Réinitialisation du personnage par admin")
                        roles_removed.append(auspice_data["nom"])
                    except discord.Forbidden:
                        pass

        # Message de confirmation
        description = f"Le personnage de {member.display_name} a été réinitialisé.\n\n"
        description += "**Données supprimées :**\n"

        if race == "vampire" or has_vampire_role or vampire_data:
            description += "• Clan et niveau de Soif\n"
        elif race == "loup-garou" or has_werewolf_role:
            description += "• Augure et Rage (toutes les scènes)\n"
        else:
            description += "• Toutes les données de personnage\n"

        if roles_removed:
            description += f"\n**Rôles retirés :** {', '.join(roles_removed)}"

        description += "\n\n*Le joueur peut maintenant utiliser `/vampire` ou `/lycan` pour créer un nouveau personnage.*"

        embed = discord.Embed(
            title="🔄 Personnage Réinitialisé",
            description=description,
            color=discord.Color.blue(),
        )

        await ctx.send(embed=embed)
        logger.info(f"Personnage réinitialisé pour {member.id} sur {ctx.guild.id} par {ctx.author.id}")


async def setup(bot: commands.Bot):
    """Charge le Cog Général."""
    await bot.add_cog(GeneralCog(bot))
    logger.info("Cog Général chargé")
