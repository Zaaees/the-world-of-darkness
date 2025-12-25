"""
Cog Configuration : Gestion des profils de joueurs

Permet aux joueurs de définir leur race (Vampire/Loup-Garou),
leur clan ou augure, et de consulter leur profil.
"""

import logging

import discord
from discord.ext import commands

from data.clans import get_clan, list_clans
from data.auspices import get_auspice, list_auspices
from utils.database import (
    get_player,
    set_player,
    delete_player,
    get_soif,
    get_rage_data,
)

logger = logging.getLogger(__name__)


class ConfigCog(commands.Cog, name="Configuration"):
    """Gestion des profils de personnages."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    def _create_profile_embed(
        self,
        member: discord.Member,
        player: dict,
        soif_level: int = 0,
        rage_data: dict = None,
    ) -> discord.Embed:
        """Crée un embed de profil de personnage."""
        race = player.get("race", "Non définie")

        if race.lower() == "vampire":
            color = discord.Color.dark_red()
            emoji = "🧛"
            clan = player.get("clan", "Non défini")
            clan_data = get_clan(clan) if clan else None

            embed = discord.Embed(
                title=f"{emoji} Profil de {member.display_name}",
                color=color,
            )

            embed.add_field(name="Race", value="Vampire", inline=True)
            embed.add_field(
                name="Clan",
                value=clan_data["nom"] if clan_data else clan.capitalize(),
                inline=True,
            )

            # Jauge de Soif
            soif_bar = "🩸" * soif_level + "⚫" * (5 - soif_level)
            embed.add_field(
                name="Soif",
                value=f"{soif_bar} ({soif_level}/5)",
                inline=True,
            )

            if clan_data:
                embed.add_field(
                    name="Description du Clan",
                    value=clan_data["description"],
                    inline=False,
                )

        elif race.lower() in ("loup-garou", "garou", "werewolf"):
            color = discord.Color.orange()
            emoji = "🐺"
            auspice = player.get("auspice", "Non défini")
            auspice_data = get_auspice(auspice) if auspice else None

            embed = discord.Embed(
                title=f"{emoji} Profil de {member.display_name}",
                color=color,
            )

            embed.add_field(name="Race", value="Loup-Garou", inline=True)

            if auspice_data:
                embed.add_field(
                    name="Augure",
                    value=f"{auspice_data['nom']} ({auspice_data['phase']})",
                    inline=True,
                )
            else:
                embed.add_field(
                    name="Augure",
                    value=auspice.capitalize() if auspice else "Non défini",
                    inline=True,
                )

            # Jauge de Rage
            if rage_data:
                rage_level = rage_data.get("rage_level", 0)
                is_enraged = rage_data.get("is_enraged", False)

                rage_display = min(rage_level, 20)
                rage_bar = "🟠" * (rage_display // 2) + "⚫" * (10 - rage_display // 2)

                status = ""
                if rage_level >= 20:
                    status = " **[PRIMAL]**"
                elif is_enraged:
                    status = " **[ENRAGÉ]**"

                embed.add_field(
                    name="Rage",
                    value=f"{rage_bar} ({rage_level}){status}",
                    inline=True,
                )

            if auspice_data:
                embed.add_field(
                    name="Rôle",
                    value=f"**{auspice_data['role']}** — {auspice_data['description']}",
                    inline=False,
                )

        else:
            color = discord.Color.light_gray()
            emoji = "👤"

            embed = discord.Embed(
                title=f"{emoji} Profil de {member.display_name}",
                description="Personnage non configuré.",
                color=color,
            )

            embed.add_field(
                name="Configuration requise",
                value=(
                    "Utilise l'une des commandes suivantes :\n"
                    "• `!config vampire <clan>` — Pour jouer un Vampire\n"
                    "• `!config garou <augure>` — Pour jouer un Loup-Garou"
                ),
                inline=False,
            )

        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text="Monde des Ténèbres")

        return embed

    @commands.group(name="config", invoke_without_command=True)
    async def config_group(self, ctx: commands.Context):
        """
        Commandes de configuration de personnage.

        Utilise:
        • !config vampire <clan> — Pour jouer un Vampire
        • !config garou <augure> — Pour jouer un Loup-Garou
        • !config profil — Pour voir ton profil
        • !config reset — Pour réinitialiser ton personnage
        """
        embed = discord.Embed(
            title="🌙 Configuration de Personnage",
            description="Bienvenue dans le Monde des Ténèbres.",
            color=discord.Color.dark_purple(),
        )

        embed.add_field(
            name="🧛 Devenir Vampire",
            value=(
                f"`!config vampire <clan>`\n"
                f"Clans disponibles: {', '.join(list_clans())}"
            ),
            inline=False,
        )

        embed.add_field(
            name="🐺 Devenir Loup-Garou",
            value=(
                f"`!config garou <augure>`\n"
                f"Augures disponibles: {', '.join(list_auspices())}"
            ),
            inline=False,
        )

        embed.add_field(
            name="📋 Autres commandes",
            value=(
                "`!config profil` — Voir ton profil\n"
                "`!config reset` — Réinitialiser ton personnage"
            ),
            inline=False,
        )

        await ctx.send(embed=embed)

    @config_group.command(name="vampire")
    async def config_vampire(self, ctx: commands.Context, *, clan: str):
        """
        Configure ton personnage comme Vampire.

        Arguments:
            clan: Le nom de ton clan (ex: Brujah, Ventrue, Malkavian...)
        """
        # Normaliser le nom du clan
        clan_normalized = clan.lower().strip()
        clan_data = get_clan(clan_normalized)

        if not clan_data:
            available = ", ".join(list_clans())
            await ctx.send(
                f"❌ Clan `{clan}` non reconnu.\n"
                f"Clans disponibles: {available}",
                delete_after=15,
            )
            return

        # Sauvegarder le joueur
        await set_player(
            ctx.author.id,
            ctx.guild.id,
            race="vampire",
            clan=clan_normalized,
            auspice=None,  # Effacer l'augure si existant
        )

        embed = discord.Embed(
            title="🧛 Bienvenue parmi les Damnés",
            description=f"Tu es maintenant un **{clan_data['nom']}**.",
            color=discord.Color.dark_red(),
        )

        embed.add_field(
            name="Description",
            value=clan_data["description"],
            inline=False,
        )

        embed.add_field(
            name="Commandes disponibles",
            value=(
                "`!sang` — Augmenter ta Soif (reçois une Compulsion en MP)\n"
                "`!boire` — Réduire ta Soif après t'être nourri\n"
                "`!soif` — Voir ton niveau de Soif actuel"
            ),
            inline=False,
        )

        embed.set_footer(text="Que les ténèbres te protègent...")

        await ctx.send(embed=embed)
        logger.info(f"{ctx.author} configuré comme Vampire ({clan_data['nom']})")

    @config_group.command(name="garou", aliases=["loup", "werewolf", "loup-garou"])
    async def config_garou(self, ctx: commands.Context, *, auspice: str):
        """
        Configure ton personnage comme Loup-Garou.

        Arguments:
            auspice: Ton augure (Ragabash, Theurge, Philodox, Galliard, Ahroun)
        """
        # Normaliser le nom de l'augure
        auspice_normalized = auspice.lower().strip()
        auspice_data = get_auspice(auspice_normalized)

        if not auspice_data:
            available = ", ".join(list_auspices())
            await ctx.send(
                f"❌ Augure `{auspice}` non reconnu.\n"
                f"Augures disponibles: {available}",
                delete_after=15,
            )
            return

        # Sauvegarder le joueur
        await set_player(
            ctx.author.id,
            ctx.guild.id,
            race="loup-garou",
            clan=None,  # Effacer le clan si existant
            auspice=auspice_normalized,
        )

        embed = discord.Embed(
            title="🐺 Bienvenue parmi les Garous",
            description=(
                f"Tu es maintenant un **{auspice_data['nom']}**, "
                f"né sous la **{auspice_data['phase']}**."
            ),
            color=discord.Color.orange(),
        )

        embed.add_field(
            name="Rôle",
            value=f"**{auspice_data['role']}** — {auspice_data['description']}",
            inline=False,
        )

        embed.add_field(
            name="Commandes disponibles",
            value=(
                "`!rage [n]` — Augmenter ta Rage suite à un affront\n"
                "`!calme [n]` — Réduire ta Rage volontairement\n"
                "`!ragestat` — Voir ton niveau de Rage actuel"
            ),
            inline=False,
        )

        embed.set_footer(text="Que Gaïa guide tes pas...")

        await ctx.send(embed=embed)
        logger.info(f"{ctx.author} configuré comme Loup-Garou ({auspice_data['nom']})")

    @config_group.command(name="profil", aliases=["profile", "info"])
    async def config_profil(self, ctx: commands.Context, member: discord.Member = None):
        """
        Affiche le profil d'un personnage.

        Arguments:
            member: Le joueur à consulter (toi-même par défaut)
        """
        target = member or ctx.author

        player = await get_player(target.id, ctx.guild.id)

        if not player:
            if target == ctx.author:
                await ctx.send(
                    "❌ Tu n'as pas encore configuré ton personnage. "
                    "Utilise `!config vampire <clan>` ou `!config garou <augure>`.",
                    delete_after=15,
                )
            else:
                await ctx.send(
                    f"❌ {target.display_name} n'a pas encore configuré son personnage.",
                    delete_after=15,
                )
            return

        # Récupérer les données spécifiques
        soif_level = 0
        rage_data = None

        race = player.get("race", "").lower()
        if race == "vampire":
            soif_level = await get_soif(target.id, ctx.guild.id)
        elif race in ("loup-garou", "garou", "werewolf"):
            rage_data = await get_rage_data(target.id, ctx.guild.id)

        embed = self._create_profile_embed(target, player, soif_level, rage_data)
        await ctx.send(embed=embed)

    @config_group.command(name="reset", aliases=["delete", "clear"])
    async def config_reset(self, ctx: commands.Context):
        """Réinitialise ton personnage et supprime toutes tes données."""
        player = await get_player(ctx.author.id, ctx.guild.id)

        if not player:
            await ctx.send(
                "❌ Tu n'as pas de personnage configuré.",
                delete_after=10,
            )
            return

        # Confirmation
        embed = discord.Embed(
            title="⚠️ Confirmation requise",
            description=(
                "Es-tu sûr de vouloir supprimer ton personnage ?\n"
                "Cette action est **irréversible**.\n\n"
                "Réagis avec ✅ pour confirmer ou ❌ pour annuler."
            ),
            color=discord.Color.yellow(),
        )

        message = await ctx.send(embed=embed)
        await message.add_reaction("✅")
        await message.add_reaction("❌")

        def check(reaction, user):
            return (
                user == ctx.author
                and str(reaction.emoji) in ("✅", "❌")
                and reaction.message.id == message.id
            )

        try:
            reaction, _ = await self.bot.wait_for("reaction_add", timeout=30.0, check=check)

            if str(reaction.emoji) == "✅":
                await delete_player(ctx.author.id, ctx.guild.id)

                # Restaurer le surnom si modifié
                if ctx.author.nick and "[PRIMAL]" in ctx.author.nick:
                    try:
                        new_nick = ctx.author.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                        await ctx.author.edit(nick=new_nick if new_nick else None)
                    except discord.Forbidden:
                        pass

                await message.edit(
                    embed=discord.Embed(
                        title="✅ Personnage supprimé",
                        description="Ton personnage a été effacé du Monde des Ténèbres.",
                        color=discord.Color.green(),
                    )
                )
                logger.info(f"{ctx.author} a supprimé son personnage")
            else:
                await message.edit(
                    embed=discord.Embed(
                        title="❌ Annulé",
                        description="Ton personnage n'a pas été modifié.",
                        color=discord.Color.red(),
                    )
                )

            await message.clear_reactions()

        except TimeoutError:
            await message.edit(
                embed=discord.Embed(
                    title="⏱️ Temps écoulé",
                    description="La demande a expiré. Ton personnage n'a pas été modifié.",
                    color=discord.Color.gray(),
                )
            )
            await message.clear_reactions()

    @config_group.command(name="clans")
    async def list_clans_command(self, ctx: commands.Context):
        """Affiche la liste des clans vampiriques disponibles."""
        from data.clans import CLANS

        embed = discord.Embed(
            title="🧛 Clans Vampiriques",
            description="Les lignées des Damnés...",
            color=discord.Color.dark_red(),
        )

        for clan_key, clan_data in CLANS.items():
            embed.add_field(
                name=clan_data["nom"],
                value=clan_data["description"],
                inline=True,
            )

        embed.set_footer(text="Utilise: !config vampire <clan>")
        await ctx.send(embed=embed)

    @config_group.command(name="augures", aliases=["auspices"])
    async def list_auspices_command(self, ctx: commands.Context):
        """Affiche la liste des augures des Loups-Garous."""
        from data.auspices import AUSPICES

        embed = discord.Embed(
            title="🐺 Augures des Garous",
            description="Les enfants de la Lune...",
            color=discord.Color.orange(),
        )

        for auspice_key, auspice_data in AUSPICES.items():
            embed.add_field(
                name=f"{auspice_data['nom']} — {auspice_data['phase']}",
                value=f"*{auspice_data['role']}*\n{auspice_data['description']}",
                inline=False,
            )

        embed.set_footer(text="Utilise: !config garou <augure>")
        await ctx.send(embed=embed)


async def setup(bot: commands.Bot):
    """Charge le Cog Configuration."""
    await bot.add_cog(ConfigCog(bot))
    logger.info("Cog Configuration chargé")
