"""
Cog Vampire : Gestion de la Soif et des Compulsions

Ce système simule l'addiction au sang et l'influence du clan ancestral.
La Soif est une jauge de 0 à 5 qui détermine l'intensité des compulsions.
"""

import logging

import discord
from discord.ext import commands

from data.clans import get_clan, get_compulsion, list_clans
from utils.database import (
    get_player,
    get_soif,
    increment_soif,
    decrement_soif,
    set_soif,
)
from utils.rp_check import is_rp_channel, delete_command_message

logger = logging.getLogger(__name__)


class VampireCog(commands.Cog, name="Vampire"):
    """Système de Soif et Compulsions pour les Vampires."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    def _create_compulsion_embed(
        self,
        clan_name: str,
        soif_level: int,
        compulsion: dict,
    ) -> discord.Embed:
        """Crée un embed pour afficher une compulsion."""
        # Couleurs selon le niveau de soif
        colors = {
            1: discord.Color.from_rgb(139, 0, 0),     # Rouge sombre
            2: discord.Color.from_rgb(178, 34, 34),   # Rouge brique
            3: discord.Color.from_rgb(220, 20, 60),   # Cramoisi
            4: discord.Color.from_rgb(255, 0, 0),     # Rouge vif
            5: discord.Color.from_rgb(128, 0, 128),   # Violet (Frénésie)
        }

        embed = discord.Embed(
            title=f"🩸 Soif Niveau {soif_level} — {compulsion['nom']}",
            description=compulsion["description"],
            color=colors.get(soif_level, discord.Color.dark_red()),
        )

        embed.add_field(
            name="📜 Directive de Jeu",
            value=compulsion["directive"],
            inline=False,
        )

        embed.set_footer(text=f"Clan {clan_name} • La Bête murmure...")

        return embed

    def _create_status_embed(
        self,
        member: discord.Member,
        clan_name: str,
        soif_level: int,
    ) -> discord.Embed:
        """Crée un embed de statut de Soif."""
        # Représentation visuelle de la jauge
        filled = "🩸" * soif_level
        empty = "⚫" * (5 - soif_level)
        gauge = filled + empty

        embed = discord.Embed(
            title="État du Sang",
            color=discord.Color.dark_red(),
        )

        embed.add_field(
            name="Clan",
            value=clan_name.capitalize(),
            inline=True,
        )

        embed.add_field(
            name="Soif",
            value=f"{gauge} ({soif_level}/5)",
            inline=True,
        )

        # Description de l'état
        states = {
            0: "Ton sang est calme. La Bête sommeille.",
            1: "Une légère irritation. Rien d'inquiétant... pour l'instant.",
            2: "La faim commence à se faire sentir. La Bête s'agite.",
            3: "Le sang appelle le sang. Ta nature vampirique s'affirme.",
            4: "Tu es au bord du gouffre. La Bête griffe les murs de ta conscience.",
            5: "🔥 FRÉNÉSIE 🔥 La Bête a pris le contrôle !",
        }

        embed.add_field(
            name="État",
            value=states.get(soif_level, "Inconnu"),
            inline=False,
        )

        embed.set_author(
            name=member.display_name,
            icon_url=member.display_avatar.url,
        )

        return embed

    async def _send_compulsion(
        self,
        user: discord.User,
        clan_name: str,
        soif_level: int,
    ) -> bool:
        """
        Envoie une compulsion en message privé au joueur.

        Returns:
            True si le message a été envoyé, False sinon
        """
        if soif_level < 1:
            return False

        compulsion = get_compulsion(clan_name, soif_level)
        if not compulsion:
            logger.warning(f"Compulsion non trouvée pour {clan_name} niveau {soif_level}")
            return False

        embed = self._create_compulsion_embed(clan_name, soif_level, compulsion)

        try:
            await user.send(embed=embed)
            logger.info(f"Compulsion envoyée à {user} (Clan: {clan_name}, Soif: {soif_level})")
            return True
        except discord.Forbidden:
            logger.warning(f"Impossible d'envoyer un MP à {user}")
            return False
        except discord.HTTPException as e:
            logger.error(f"Erreur lors de l'envoi du MP à {user}: {e}")
            return False

    @commands.command(name="sang")
    async def sang_command(self, ctx: commands.Context):
        """
        Augmente ta Soif d'un niveau et reçois une compulsion en MP.

        Cette commande sera supprimée automatiquement pour rester invisible
        aux autres joueurs.
        """
        # Supprimer le message immédiatement
        await delete_command_message(ctx.message)

        # Vérifier si on est dans un canal RP
        if not is_rp_channel(ctx.channel):
            try:
                await ctx.author.send(
                    "❌ Cette commande ne fonctionne que dans les catégories **[RP]**."
                )
            except discord.Forbidden:
                pass
            return

        # Vérifier que le joueur est configuré comme Vampire
        player = await get_player(ctx.author.id, ctx.guild.id)
        if not player or player.get("race", "").lower() != "vampire":
            try:
                await ctx.author.send(
                    "❌ Tu n'es pas configuré comme Vampire. "
                    "Utilise `!config vampire <clan>` pour te configurer."
                )
            except discord.Forbidden:
                pass
            return

        clan = player.get("clan")
        if not clan:
            try:
                await ctx.author.send(
                    "❌ Tu n'as pas de clan défini. "
                    "Utilise `!config vampire <clan>` pour définir ton clan."
                )
            except discord.Forbidden:
                pass
            return

        # Vérifier que le clan existe
        clan_data = get_clan(clan)
        if not clan_data:
            try:
                await ctx.author.send(
                    f"❌ Clan `{clan}` non reconnu. "
                    f"Clans disponibles: {', '.join(list_clans())}"
                )
            except discord.Forbidden:
                pass
            return

        # Incrémenter la Soif
        new_soif = await increment_soif(ctx.author.id, ctx.guild.id)

        # Envoyer la compulsion
        await self._send_compulsion(ctx.author, clan, new_soif)

    @commands.command(name="boire")
    async def boire_command(self, ctx: commands.Context, amount: int = 1):
        """
        Diminue ta Soif en te nourrissant.

        Arguments:
            amount: Nombre de niveaux de Soif à réduire (1 par défaut)
        """
        # Supprimer le message immédiatement
        await delete_command_message(ctx.message)

        # Vérifier si on est dans un canal RP
        if not is_rp_channel(ctx.channel):
            try:
                await ctx.author.send(
                    "❌ Cette commande ne fonctionne que dans les catégories **[RP]**."
                )
            except discord.Forbidden:
                pass
            return

        # Vérifier que le joueur est un Vampire
        player = await get_player(ctx.author.id, ctx.guild.id)
        if not player or player.get("race", "").lower() != "vampire":
            try:
                await ctx.author.send(
                    "❌ Tu n'es pas configuré comme Vampire."
                )
            except discord.Forbidden:
                pass
            return

        clan = player.get("clan", "Inconnu")
        current_soif = await get_soif(ctx.author.id, ctx.guild.id)

        # Réduire la Soif
        for _ in range(min(amount, current_soif)):
            await decrement_soif(ctx.author.id, ctx.guild.id)

        new_soif = await get_soif(ctx.author.id, ctx.guild.id)

        # Créer un message de confirmation
        embed = discord.Embed(
            title="🍷 Tu t'es nourri",
            description=f"Ta Soif passe de **{current_soif}** à **{new_soif}**.",
            color=discord.Color.dark_red(),
        )

        if new_soif == 0:
            embed.add_field(
                name="État",
                value="La Bête est satisfaite... pour l'instant.",
                inline=False,
            )
        else:
            embed.add_field(
                name="État",
                value=f"Soif restante: {'🩸' * new_soif}{'⚫' * (5 - new_soif)}",
                inline=False,
            )

        embed.set_footer(text=f"Clan {clan.capitalize()}")

        try:
            await ctx.author.send(embed=embed)
        except discord.Forbidden:
            pass

    @commands.command(name="soif")
    async def soif_status_command(self, ctx: commands.Context):
        """Affiche ton niveau de Soif actuel (en MP)."""
        # Supprimer le message si dans un canal RP
        if is_rp_channel(ctx.channel):
            await delete_command_message(ctx.message)

        # Vérifier que le joueur est un Vampire
        player = await get_player(ctx.author.id, ctx.guild.id)
        if not player or player.get("race", "").lower() != "vampire":
            try:
                await ctx.author.send(
                    "❌ Tu n'es pas configuré comme Vampire. "
                    "Utilise `!config vampire <clan>` pour te configurer."
                )
            except discord.Forbidden:
                pass
            return

        clan = player.get("clan", "Inconnu")
        soif_level = await get_soif(ctx.author.id, ctx.guild.id)

        embed = self._create_status_embed(ctx.author, clan, soif_level)

        try:
            await ctx.author.send(embed=embed)
        except discord.Forbidden:
            await ctx.send(
                "❌ Je ne peux pas t'envoyer de message privé. "
                "Vérifie tes paramètres de confidentialité.",
                delete_after=10,
            )

    @commands.command(name="setsoif")
    @commands.has_permissions(administrator=True)
    async def set_soif_command(
        self,
        ctx: commands.Context,
        member: discord.Member,
        level: int,
    ):
        """
        [ADMIN] Définit le niveau de Soif d'un joueur.

        Arguments:
            member: Le joueur ciblé
            level: Le niveau de Soif (0-5)
        """
        if not 0 <= level <= 5:
            await ctx.send("❌ Le niveau de Soif doit être entre 0 et 5.", delete_after=10)
            return

        player = await get_player(member.id, ctx.guild.id)
        if not player or player.get("race", "").lower() != "vampire":
            await ctx.send(
                f"❌ {member.display_name} n'est pas configuré comme Vampire.",
                delete_after=10,
            )
            return

        await set_soif(member.id, ctx.guild.id, level)

        # Si le nouveau niveau > 0, envoyer la compulsion
        if level > 0 and player.get("clan"):
            await self._send_compulsion(member, player["clan"], level)

        await ctx.send(
            f"✅ Soif de {member.display_name} définie à **{level}**.",
            delete_after=10,
        )

        # Supprimer la commande admin aussi
        await delete_command_message(ctx.message)


async def setup(bot: commands.Bot):
    """Charge le Cog Vampire."""
    await bot.add_cog(VampireCog(bot))
    logger.info("Cog Vampire chargé")
