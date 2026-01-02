"""
Cog Général : Commandes utilitaires pour tous les joueurs.
"""

import logging

import discord
from discord.ext import commands

from data.clans import CLANS
from data.auspices import AUSPICES
from data.config import ROLE_VAMPIRE, ROLE_LOUP_GAROU
from utils.database import (
    get_player,
    delete_player,
    get_vampire_data,
    get_rage_data,
    set_blood_potency,
    get_from_google_sheets,
    save_to_google_sheets,
)
from utils.sheet_manager import delete_discord_sheet, delete_google_sheet_character

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

        # Supprimer la fiche Discord si elle existe
        try:
            await delete_discord_sheet(self.bot, member.id, ctx.guild.id)
        except Exception as e:
            logger.error(f"Erreur suppression fiche Discord pour {member.id}: {e}")

        # Supprimer la fiche Google Sheet si elle existe
        try:
            await delete_google_sheet_character(member.id)
        except Exception as e:
            logger.error(f"Erreur suppression fiche Google Sheet pour {member.id}: {e}")

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

    @commands.command(name="setvampire")
    @commands.has_permissions(administrator=True)
    async def setvampire_command(
        self, ctx: commands.Context, level: int, member: discord.Member
    ):
        """
        [Admin] Définit la Puissance du Sang d'un vampire.

        Usage: !setvampire <niveau 1-5> @membre
        Exemple: !setvampire 3 @Jean
        """
        # Valider le niveau
        if level < 1 or level > 5:
            await ctx.send("❌ Le niveau doit être entre 1 et 5.")
            return

        # Vérifier si le joueur a le rôle Vampire
        has_vampire_role = any(role.id == ROLE_VAMPIRE for role in member.roles)
        if not has_vampire_role:
            await ctx.send(f"❌ {member.display_name} n'a pas le rôle Vampire.")
            return

        # Récupérer les données depuis Google Sheets directement
        character = await get_from_google_sheets(member.id)
        if not character:
            await ctx.send(
                f"❌ {member.display_name} n'a pas de fiche personnage. "
                "Il doit d'abord utiliser `/vampire` pour en créer une."
            )
            return

        old_bp = character.get("bloodPotency", 1)

        # Mettre à jour dans SQLite
        await set_blood_potency(member.id, ctx.guild.id, level)

        # Mettre à jour dans Google Sheets pour synchroniser
        # S'assurer que race est préservé (peut être perdu lors de la lecture GS)
        if "race" not in character:
            character["race"] = "vampire"
        character["bloodPotency"] = level
        character["saturationPoints"] = 0  # Reset saturation on manual BP change
        await save_to_google_sheets(member.id, character)

        # Descriptions des niveaux
        bp_titles = {
            1: "Nouveau-né",
            2: "Néonate",
            3: "Ancilla",
            4: "Ancien",
            5: "Mathusalem",
        }

        embed = discord.Embed(
            title="🩸 Puissance du Sang Modifiée",
            description=(
                f"**{member.display_name}** est maintenant un **{bp_titles[level]}**.\n\n"
                f"• Niveau précédent : {old_bp}\n"
                f"• Nouveau niveau : **{level}**\n"
                f"• Points de saturation réinitialisés"
            ),
            color=discord.Color.dark_red(),
        )

        await ctx.send(embed=embed)
        logger.info(
            f"Blood Potency de {member.id} changée de {old_bp} à {level} "
            f"par {ctx.author.id} sur {ctx.guild.id}"
        )


async def setup(bot: commands.Bot):
    """Charge le Cog Général."""
    await bot.add_cog(GeneralCog(bot))
    logger.info("Cog Général chargé")
