"""
Cog Général : Commandes utilitaires pour tous les joueurs.
"""

import logging

import discord
from discord.ext import commands

from data.blood_potency import get_blood_potency_info
from data.clans import CLANS
from data.auspices import AUSPICES
from data.config import ROLE_VAMPIRE, ROLE_LOUP_GAROU, VALIDATION_CHANNEL_ID
from utils.database import (
    get_player,
    delete_player,
    get_vampire_data,
    get_rage_data,
    set_blood_potency,
    get_from_google_sheets,
    save_to_google_sheets,
    add_player_ritual,
    delete_player_rituals,
    delete_pending_actions,
)
from utils.blood_bonds import clear_blood_bonds
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
        # Récupérer les données du joueur (juste pour infos avant delete, facultatif)
        player = await get_player(member.id, ctx.guild.id)

        # 1. RETIRER LES ROLES (Visuel immédiat)
        roles_removed = []
        
        # Retirer les rôles principaux (Loup-Garou / Vampire)
        for role_id, role_label in [(ROLE_LOUP_GAROU, "Loup-Garou"), (ROLE_VAMPIRE, "Vampire")]:
            role = ctx.guild.get_role(role_id)
            if role and role in member.roles:
                try:
                    await member.remove_roles(role, reason=f"Reset: Nettoyage rôle {role_label}")
                    roles_removed.append(role_label)
                except discord.Forbidden:
                    logger.warning(f"Impossible de retirer le rôle {role_label} à {member.display_name}")
        
        # Vérifier tous les clans possibles
        for clan_info in CLANS.values():
            role_name = clan_info["nom"]
            role = discord.utils.get(ctx.guild.roles, name=role_name)
            if role and role in member.roles:
                try:
                    await member.remove_roles(role, reason="Reset: Nettoyage Clan")
                    roles_removed.append(role_name)
                except discord.Forbidden:
                    logger.warning(f"Impossible de retirer le rôle {role_name} à {member.display_name}")

        # Vérifier tous les auspices possibles
        for auspice_info in AUSPICES.values():
            role_name = auspice_info["nom"]
            role = discord.utils.get(ctx.guild.roles, name=role_name)
            if role and role in member.roles:
                try:
                    await member.remove_roles(role, reason="Reset: Nettoyage Auspice")
                    roles_removed.append(role_name)
                except discord.Forbidden:
                    logger.warning(f"Impossible de retirer le rôle {role_name} à {member.display_name}")
                    
        # 2. SUPPRIMER DONNEES SPECIFIQUES (LOCAL FIRST)
        
        # Werewolf Data (Module spécifique)
        try:
            from modules.werewolf.models.store import delete_werewolf_data, get_werewolf_data
            from utils.database import DATABASE_PATH
            import aiosqlite
            
            async with aiosqlite.connect(str(DATABASE_PATH)) as db:
                # Check if data exists BEFORE delete
                pre_check = await get_werewolf_data(db, str(member.id))
                
                # Delete the Discord forum thread if it exists
                if pre_check and pre_check.discord_thread_id:
                    try:
                        thread = await self.bot.fetch_channel(int(pre_check.discord_thread_id))
                        if thread:
                            await thread.delete()
                            logger.info(f"RESET: Deleted Discord thread {pre_check.discord_thread_id} for {member.id}")
                    except discord.NotFound:
                        logger.info(f"RESET: Discord thread {pre_check.discord_thread_id} already deleted")
                    except Exception as e:
                        logger.warning(f"RESET: Failed to delete Discord thread {pre_check.discord_thread_id}: {e}")
                
                # Force delete regardless of role
                deleted = await delete_werewolf_data(db, str(member.id))
                
                if deleted:
                    logger.info(f"RESET: Werewolf data purged for {member.id}")
                else:
                    logger.warning(f"RESET: delete_werewolf_data returned False for {member.id} - data may not have existed")
        except Exception as e:
            logger.error(f"RESET ERROR (Werewolf): {e}", exc_info=True)

        # Vampire Data (implied by delete_player cleaning vampire_soif, but good to be explicit if we had a service)
        # Currently handled by delete_player's table cleanup.
        try:
            await clear_blood_bonds(ctx.guild.id, member.id)
        except Exception as e:
            logger.error(f"RESET ERROR (Blood bonds): {e}", exc_info=True)
        
        # 3. SUPPRIMER DONNEES GENERIQUES & GOOGLE SHEETS
        try:
            # Supprimer la fiche Discord
            await delete_discord_sheet(self.bot, member.id, ctx.guild.id)
        except Exception as e:
            logger.error(f"RESET ERROR (Discord Sheet): {e}")
            
        try:
            # Supprimer rituels
            await delete_player_rituals(member.id, ctx.guild.id)
        except Exception as e:
            logger.error(f"RESET ERROR (Rituals): {e}")

        # Demandes d'action de Vitae en attente : sans cela, un MJ pourrait encore
        # valider une scène et créditer le personnage réinitialisé.
        # Limite : la file « ActionsEnAttente » de Google Sheets n'a pas d'action
        # Apps Script pour être vidée par joueur. Une demande que le bot n'a pas
        # encore relevée (sondage toutes les 15 s) y reste en attente ; elle est
        # ignorée tant que le personnage est vide (Puissance du Sang 0).
        cancelled_actions = 0
        try:
            removed = await delete_pending_actions(member.id, ctx.guild.id)
            cancelled_actions = len(removed)
            channel = ctx.guild.get_channel(VALIDATION_CHANNEL_ID)
            for action in removed:
                if not channel or not action.get("message_id"):
                    continue
                try:
                    message = await channel.fetch_message(action["message_id"])
                    await message.edit(
                        content="❌ Demande annulée : personnage réinitialisé (`!reset`).", view=None
                    )
                except Exception as e:
                    logger.warning(f"RESET WARNING (Validation message {action['message_id']}): {e}")
        except Exception as e:
            logger.error(f"RESET ERROR (Pending actions): {e}")

        try:
            # Clean Google Sheet separately if possible? 
            # delete_player does both Local + Google Sheets.
            # We want to ensure Local is cleared even if Google Sheets fails.
            # delete_player implementation does `save_to_google_sheets` first.
            # We rely on delete_player's internal error handling or we accept it might log errors.
            await delete_player(member.id, ctx.guild.id, keep_race=False)
        except Exception as e:
             logger.error(f"RESET ERROR (Generic/Player): {e}")

        try:
            # Supprimer la fiche Google Sheet distincte (File deletion vs Data clearing)
            await delete_google_sheet_character(member.id)
        except Exception as e:
             # C'est souvent moins grave si ça échoue, tant que les données sont wipées
             logger.warning(f"RESET WARNING (Google Sheet File): {e}")


        # Message de confirmation
        description = f"Le personnage de {member.display_name} a été réinitialisé.\n\n"
        description += "**Actions effectuées :**\n"
        description += "• Suppression des données locales (Werewolf/Vampire)\n"
        description += "• Nettoyage de la base de données\n"
        description += "• Tentative de nettoyage Google Sheets\n"
        description += f"• Demandes d'action de Vitae annulées : {cancelled_actions}\n"

        if roles_removed:
            description += f"\n**Rôles retirés :** {', '.join(roles_removed)}"
        else:
            description += "\n*Aucun rôle de clan/augure trouvé à retirer.*"

        description += "\n\n*Le joueur peut maintenant utiliser `/vampire` ou `/lycan`.*"

        embed = discord.Embed(
            title="🔄 Réinitialisation Terminée",
            description=description,
            color=discord.Color.green(), # Green for success/clean slate
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

        embed = discord.Embed(
            title="🩸 Puissance du Sang Modifiée",
            description=(
                f"Le sang de **{member.display_name}** est désormais : "
                f"**{get_blood_potency_info(level)['titre']}**.\n\n"
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
