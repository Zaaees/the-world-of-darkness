"""
Cog Loup-Garou : Gestion de la Rage et du Maintien

Ce système simule la colère sacrée et la tension de combat des Garous.
La Rage peut monter très haut avec des seuils critiques à 10 (Enragé) et 20 (Primal).
"""

import logging
from typing import Optional

import discord
from discord.ext import commands

from data.auspices import get_auspice, get_rage_message, list_auspices
from utils.database import (
    get_player,
    get_rage_data,
    set_rage_data,
    increment_rage,
    set_rage_calm,
    get_all_enraged_werewolves,
)
from utils.rp_check import is_rp_channel, delete_command_message

logger = logging.getLogger(__name__)

# Seuils de Rage
SEUIL_ENRAGE = 10
SEUIL_PRIMAL = 20
TOURS_MAINTIEN = 2


class WerewolfCog(commands.Cog, name="Loup-Garou"):
    """Système de Rage et Maintien pour les Loups-Garous."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    def _create_rage_embed(
        self,
        auspice_name: str,
        rage_level: int,
        is_primal: bool = False,
    ) -> discord.Embed:
        """Crée un embed pour afficher l'état de rage."""
        rage_data = get_rage_message(auspice_name, "primal" if is_primal else "enrage")

        if not rage_data:
            # Fallback si l'augure n'est pas trouvé
            title = "🌕 RAGE PRIMALE" if is_primal else "🌙 RAGE"
            message = (
                "La Bête en toi se déchaîne. Tu n'es plus humain."
                if is_primal
                else "La Rage monte. Le Garou en toi s'éveille."
            )
        else:
            title = rage_data["titre"]
            message = rage_data["message"]

        color = discord.Color.gold() if is_primal else discord.Color.orange()

        embed = discord.Embed(
            title=title,
            description=message,
            color=color,
        )

        # Barre de rage
        rage_bar = self._create_rage_bar(rage_level)
        embed.add_field(
            name="Niveau de Rage",
            value=f"{rage_bar}\n**{rage_level}** / {SEUIL_PRIMAL}",
            inline=False,
        )

        if not is_primal and rage_level >= SEUIL_ENRAGE:
            embed.add_field(
                name="⏱️ Compteur de Maintien",
                value=f"Tu as **{TOURS_MAINTIEN} tours de parole** pour te calmer ou nourrir ta Rage.",
                inline=False,
            )

        auspice_data = get_auspice(auspice_name)
        if auspice_data:
            embed.set_footer(text=f"{auspice_data['nom']} • {auspice_data['phase']}")

        return embed

    def _create_rage_bar(self, rage_level: int) -> str:
        """Crée une barre visuelle de rage."""
        total_segments = 20
        filled = min(rage_level, total_segments)
        empty = total_segments - filled

        # Couleurs différentes selon le seuil
        if rage_level >= SEUIL_PRIMAL:
            filled_char = "🔴"
        elif rage_level >= SEUIL_ENRAGE:
            filled_char = "🟠"
        else:
            filled_char = "🟡"

        bar = filled_char * filled + "⚫" * empty
        return bar

    def _create_status_embed(
        self,
        member: discord.Member,
        auspice_name: str,
        rage_data: dict,
    ) -> discord.Embed:
        """Crée un embed de statut de Rage."""
        rage_level = rage_data.get("rage_level", 0)
        is_enraged = rage_data.get("is_enraged", False)
        maintien = rage_data.get("maintien_counter", 0)

        embed = discord.Embed(
            title="État de la Rage",
            color=discord.Color.orange() if is_enraged else discord.Color.dark_gray(),
        )

        auspice_data = get_auspice(auspice_name)
        if auspice_data:
            embed.add_field(
                name="Augure",
                value=f"{auspice_data['nom']} ({auspice_data['phase']})",
                inline=True,
            )

        rage_bar = self._create_rage_bar(rage_level)
        embed.add_field(
            name="Rage",
            value=f"{rage_bar}\n**{rage_level}** / {SEUIL_PRIMAL}",
            inline=False,
        )

        # État actuel
        if rage_level >= SEUIL_PRIMAL:
            state = "🔴 **RAGE PRIMALE** — Tu n'es plus humain !"
        elif is_enraged:
            state = f"🟠 **ENRAGÉ** — Tours restants: {TOURS_MAINTIEN - maintien}"
        elif rage_level >= SEUIL_ENRAGE - 2:
            state = "🟡 Au bord de la Rage — Attention !"
        else:
            state = "🟢 Maîtrise — La Bête est sous contrôle."

        embed.add_field(
            name="État",
            value=state,
            inline=False,
        )

        embed.set_author(
            name=member.display_name,
            icon_url=member.display_avatar.url,
        )

        return embed

    async def _send_rage_notification(
        self,
        user: discord.User,
        auspice_name: str,
        rage_level: int,
        is_primal: bool = False,
    ) -> bool:
        """Envoie une notification de rage en MP."""
        embed = self._create_rage_embed(auspice_name, rage_level, is_primal)

        try:
            await user.send(embed=embed)
            return True
        except discord.Forbidden:
            logger.warning(f"Impossible d'envoyer un MP à {user}")
            return False
        except discord.HTTPException as e:
            logger.error(f"Erreur lors de l'envoi du MP à {user}: {e}")
            return False

    async def _announce_primal_state(
        self,
        channel: discord.TextChannel,
        member: discord.Member,
        auspice_name: str,
    ):
        """Annonce publiquement l'état Primal d'un Garou."""
        auspice_data = get_auspice(auspice_name)
        auspice_display = auspice_data["nom"] if auspice_data else "Garou"

        embed = discord.Embed(
            title="🐺 LA BÊTE SE DÉCHAÎNE 🐺",
            description=(
                f"**{member.display_name}** n'est plus humain.\n\n"
                f"Le {auspice_display} a atteint la **RAGE PRIMALE**. "
                f"La créature devant vous n'est plus qu'instinct et fureur."
            ),
            color=discord.Color.red(),
        )

        embed.set_thumbnail(url=member.display_avatar.url)
        embed.set_footer(text="Que Gaïa ait pitié de vos âmes...")

        try:
            await channel.send(embed=embed)
        except discord.Forbidden:
            logger.warning(f"Impossible d'annoncer l'état Primal dans {channel}")

        # Changer le surnom si possible
        try:
            old_nick = member.display_name
            new_nick = f"🐺 {old_nick} [PRIMAL]"
            if len(new_nick) <= 32:  # Limite Discord
                await member.edit(nick=new_nick)
        except discord.Forbidden:
            logger.warning(f"Impossible de changer le surnom de {member}")

    async def _check_and_process_maintien(
        self,
        user_id: int,
        guild_id: int,
        channel: Optional[discord.TextChannel] = None,
    ):
        """
        Vérifie et traite le compteur de maintien.
        Appelé quand un tour de parole se termine.
        """
        rage_data = await get_rage_data(user_id, guild_id)

        if not rage_data.get("is_enraged"):
            return

        maintien = rage_data.get("maintien_counter", 0) + 1

        if maintien >= TOURS_MAINTIEN:
            # Le calme revient
            await set_rage_calm(user_id, guild_id)

            # Notifier le joueur
            try:
                guild = self.bot.get_guild(guild_id)
                if guild:
                    member = guild.get_member(user_id)
                    if member:
                        embed = discord.Embed(
                            title="🌙 Le Calme Revient",
                            description=(
                                "Ta Rage s'apaise. Le Garou en toi reprend sa place "
                                "au fond de ton âme.\n\n"
                                f"Ta Rage est redescendue à **{SEUIL_ENRAGE - 1}**."
                            ),
                            color=discord.Color.blue(),
                        )
                        await member.send(embed=embed)

                        # Restaurer le surnom si modifié
                        if member.nick and "[PRIMAL]" in member.nick:
                            try:
                                new_nick = member.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                                await member.edit(nick=new_nick if new_nick else None)
                            except discord.Forbidden:
                                pass
            except Exception as e:
                logger.error(f"Erreur lors de la notification de calme: {e}")
        else:
            # Incrémenter le compteur
            await set_rage_data(user_id, guild_id, maintien_counter=maintien)

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        """
        Écoute les messages pour détecter les tours de parole.

        Un tour se termine quand:
        1. Le loup-garou a envoyé un/des message(s)
        2. D'autres personnes ont répondu
        3. Le loup-garou envoie à nouveau un message
        """
        # Ignorer les bots et les messages hors RP
        if message.author.bot:
            return

        if not message.guild:
            return

        if not is_rp_channel(message.channel):
            return

        # Récupérer tous les loups-garous enragés du serveur
        enraged_wolves = await get_all_enraged_werewolves(message.guild.id)

        for wolf_data in enraged_wolves:
            wolf_id = wolf_data["user_id"]

            # Si c'est le loup-garou qui parle
            if message.author.id == wolf_id:
                # Si d'autres ont parlé depuis son dernier message, c'est un nouveau tour
                if wolf_data.get("others_spoke_since"):
                    await self._check_and_process_maintien(
                        wolf_id,
                        message.guild.id,
                        message.channel,
                    )

                # Mettre à jour : d'autres n'ont pas encore parlé depuis ce message
                await set_rage_data(
                    wolf_id,
                    message.guild.id,
                    last_message_id=message.id,
                    others_spoke_since=False,
                )

            else:
                # Quelqu'un d'autre parle, marquer que d'autres ont parlé
                if wolf_data.get("last_message_id"):
                    await set_rage_data(
                        wolf_id,
                        message.guild.id,
                        others_spoke_since=True,
                    )

    @commands.command(name="rage")
    async def rage_command(self, ctx: commands.Context, amount: int = 1):
        """
        Augmente ta Rage suite à un affront.

        Cette commande sera supprimée automatiquement.

        Arguments:
            amount: Points de rage à ajouter (1 par défaut)
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

        # Vérifier que le joueur est un Loup-Garou
        player = await get_player(ctx.author.id, ctx.guild.id)
        if not player or player.get("race", "").lower() not in ("loup-garou", "garou", "werewolf"):
            try:
                await ctx.author.send(
                    "❌ Tu n'es pas configuré comme Loup-Garou. "
                    "Utilise `!config garou <augure>` pour te configurer."
                )
            except discord.Forbidden:
                pass
            return

        auspice = player.get("auspice")
        if not auspice:
            try:
                await ctx.author.send(
                    "❌ Tu n'as pas d'Augure défini. "
                    "Utilise `!config garou <augure>` pour définir ton augure."
                )
            except discord.Forbidden:
                pass
            return

        # Récupérer l'état actuel
        rage_data = await get_rage_data(ctx.author.id, ctx.guild.id)
        old_rage = rage_data.get("rage_level", 0)
        was_enraged = rage_data.get("is_enraged", False)

        # Incrémenter la rage
        new_rage = await increment_rage(ctx.author.id, ctx.guild.id, amount)

        # Vérifier les seuils
        just_became_enraged = not was_enraged and new_rage >= SEUIL_ENRAGE
        just_became_primal = old_rage < SEUIL_PRIMAL and new_rage >= SEUIL_PRIMAL

        if just_became_primal:
            # État Primal atteint
            await set_rage_data(
                ctx.author.id,
                ctx.guild.id,
                is_enraged=True,
                maintien_counter=0,
            )
            await self._send_rage_notification(ctx.author, auspice, new_rage, is_primal=True)
            await self._announce_primal_state(ctx.channel, ctx.author, auspice)

        elif just_became_enraged:
            # Passage en état Enragé
            await set_rage_data(
                ctx.author.id,
                ctx.guild.id,
                is_enraged=True,
                maintien_counter=0,
                last_message_id=ctx.message.id,
                others_spoke_since=False,
            )
            await self._send_rage_notification(ctx.author, auspice, new_rage, is_primal=False)

        elif was_enraged and new_rage < SEUIL_PRIMAL:
            # Déjà enragé, réinitialiser le compteur de maintien
            await set_rage_data(
                ctx.author.id,
                ctx.guild.id,
                maintien_counter=0,
                last_message_id=ctx.message.id,
                others_spoke_since=False,
            )

            # Notification de maintien
            embed = discord.Embed(
                title="🔥 La Rage Persiste",
                description=(
                    f"Tu nourris ta colère. Ta Rage monte à **{new_rage}**.\n\n"
                    f"Le compteur de maintien est réinitialisé. "
                    f"Tu as **{TOURS_MAINTIEN} tours** avant que le calme ne revienne."
                ),
                color=discord.Color.orange(),
            )
            embed.add_field(
                name="Rage",
                value=self._create_rage_bar(new_rage),
                inline=False,
            )

            try:
                await ctx.author.send(embed=embed)
            except discord.Forbidden:
                pass

        else:
            # Rage normale (sous le seuil)
            embed = discord.Embed(
                title="💢 La Rage Monte",
                description=f"Ta Rage passe de **{old_rage}** à **{new_rage}**.",
                color=discord.Color.gold(),
            )
            embed.add_field(
                name="Rage",
                value=self._create_rage_bar(new_rage),
                inline=False,
            )

            if new_rage >= SEUIL_ENRAGE - 2:
                embed.add_field(
                    name="⚠️ Attention",
                    value=f"Tu approches du seuil critique ({SEUIL_ENRAGE})...",
                    inline=False,
                )

            try:
                await ctx.author.send(embed=embed)
            except discord.Forbidden:
                pass

    @commands.command(name="calme", aliases=["calm"])
    async def calme_command(self, ctx: commands.Context, amount: int = 1):
        """
        Réduit ta Rage volontairement.

        Arguments:
            amount: Points de rage à réduire (1 par défaut)
        """
        # Supprimer le message si dans un canal RP
        if is_rp_channel(ctx.channel):
            await delete_command_message(ctx.message)

        # Vérifier que le joueur est un Loup-Garou
        player = await get_player(ctx.author.id, ctx.guild.id)
        if not player or player.get("race", "").lower() not in ("loup-garou", "garou", "werewolf"):
            try:
                await ctx.author.send("❌ Tu n'es pas configuré comme Loup-Garou.")
            except discord.Forbidden:
                pass
            return

        rage_data = await get_rage_data(ctx.author.id, ctx.guild.id)
        old_rage = rage_data.get("rage_level", 0)

        new_rage = max(0, old_rage - amount)
        is_enraged = new_rage >= SEUIL_ENRAGE

        await set_rage_data(
            ctx.author.id,
            ctx.guild.id,
            rage_level=new_rage,
            is_enraged=is_enraged,
            maintien_counter=0 if not is_enraged else rage_data.get("maintien_counter", 0),
        )

        # Restaurer le surnom si on quitte l'état Primal
        if old_rage >= SEUIL_PRIMAL and new_rage < SEUIL_PRIMAL:
            if ctx.author.nick and "[PRIMAL]" in ctx.author.nick:
                try:
                    new_nick = ctx.author.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                    await ctx.author.edit(nick=new_nick if new_nick else None)
                except discord.Forbidden:
                    pass

        embed = discord.Embed(
            title="🌿 Apaisement",
            description=f"Ta Rage passe de **{old_rage}** à **{new_rage}**.",
            color=discord.Color.green(),
        )
        embed.add_field(
            name="Rage",
            value=self._create_rage_bar(new_rage),
            inline=False,
        )

        try:
            await ctx.author.send(embed=embed)
        except discord.Forbidden:
            pass

    @commands.command(name="ragestat", aliases=["ragestatus"])
    async def rage_status_command(self, ctx: commands.Context):
        """Affiche ton niveau de Rage actuel (en MP)."""
        # Supprimer le message si dans un canal RP
        if is_rp_channel(ctx.channel):
            await delete_command_message(ctx.message)

        # Vérifier que le joueur est un Loup-Garou
        player = await get_player(ctx.author.id, ctx.guild.id)
        if not player or player.get("race", "").lower() not in ("loup-garou", "garou", "werewolf"):
            try:
                await ctx.author.send(
                    "❌ Tu n'es pas configuré comme Loup-Garou. "
                    "Utilise `!config garou <augure>` pour te configurer."
                )
            except discord.Forbidden:
                pass
            return

        auspice = player.get("auspice", "Inconnu")
        rage_data = await get_rage_data(ctx.author.id, ctx.guild.id)

        embed = self._create_status_embed(ctx.author, auspice, rage_data)

        try:
            await ctx.author.send(embed=embed)
        except discord.Forbidden:
            await ctx.send(
                "❌ Je ne peux pas t'envoyer de message privé. "
                "Vérifie tes paramètres de confidentialité.",
                delete_after=10,
            )

    @commands.command(name="setrage")
    @commands.has_permissions(administrator=True)
    async def set_rage_command(
        self,
        ctx: commands.Context,
        member: discord.Member,
        level: int,
    ):
        """
        [ADMIN] Définit le niveau de Rage d'un joueur.

        Arguments:
            member: Le joueur ciblé
            level: Le niveau de Rage
        """
        if level < 0:
            await ctx.send("❌ Le niveau de Rage ne peut pas être négatif.", delete_after=10)
            return

        player = await get_player(member.id, ctx.guild.id)
        if not player or player.get("race", "").lower() not in ("loup-garou", "garou", "werewolf"):
            await ctx.send(
                f"❌ {member.display_name} n'est pas configuré comme Loup-Garou.",
                delete_after=10,
            )
            return

        is_enraged = level >= SEUIL_ENRAGE
        await set_rage_data(
            member.id,
            ctx.guild.id,
            rage_level=level,
            is_enraged=is_enraged,
            maintien_counter=0,
        )

        # Gérer le surnom
        if level >= SEUIL_PRIMAL:
            try:
                old_nick = member.display_name
                new_nick = f"🐺 {old_nick} [PRIMAL]"
                if len(new_nick) <= 32:
                    await member.edit(nick=new_nick)
            except discord.Forbidden:
                pass
        elif member.nick and "[PRIMAL]" in member.nick:
            try:
                new_nick = member.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                await member.edit(nick=new_nick if new_nick else None)
            except discord.Forbidden:
                pass

        await ctx.send(
            f"✅ Rage de {member.display_name} définie à **{level}**.",
            delete_after=10,
        )

        await delete_command_message(ctx.message)


async def setup(bot: commands.Bot):
    """Charge le Cog Loup-Garou."""
    await bot.add_cog(WerewolfCog(bot))
    logger.info("Cog Loup-Garou chargé")
