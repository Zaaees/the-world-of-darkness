"""
Cog Loup-Garou : Gestion de la Rage et du Maintien via slash command.

La commande /lycan ouvre un panneau interactif avec des boutons.
Accessible uniquement aux membres avec le rôle "Loup-garou".

La Rage est liée à une scène (salon) et diminue de 1 à chaque tour de parole.
"""

import logging
from typing import Optional

import discord
from discord import app_commands
from discord.ext import commands

from data.auspices import get_auspice, get_rage_message, list_auspices
from utils.database import (
    get_player,
    get_rage_data,
    set_rage_data,
    decrement_rage,
    clear_rage,
    get_all_enraged_werewolves_in_channel,
)
from utils.rp_check import is_rp_channel
from views.lycan_panel import LycanPanel, AuspiceSelectView

logger = logging.getLogger(__name__)

# Nom du rôle requis (insensible à la casse)
LYCAN_ROLE_NAME = "loup-garou"

# Seuils de Rage
SEUIL_ENRAGE = 10
SEUIL_PRIMAL = 20
TOURS_MAINTIEN = 2


def has_lycan_role(member: discord.Member) -> bool:
    """Vérifie si le membre a le rôle Loup-garou."""
    return any(role.name.lower() == LYCAN_ROLE_NAME for role in member.roles)


class WerewolfCog(commands.Cog, name="Loup-Garou"):
    """Système de Rage et Maintien pour les Loups-Garous."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def _process_turn(
        self,
        user_id: int,
        guild_id: int,
        channel_id: int,
        channel: Optional[discord.TextChannel] = None,
    ):
        """
        Traite un tour de parole pour un loup-garou.
        - Décrémente la rage de 1
        - Incrémente le compteur de maintien si enragé
        - Calme le loup-garou si le maintien expire
        """
        rage_data = await get_rage_data(user_id, guild_id, channel_id)
        rage_level = rage_data.get("rage_level", 0)
        is_enraged = rage_data.get("is_enraged", False)
        maintien = rage_data.get("maintien_counter", 0)

        if rage_level <= 0:
            return

        # Décrémenter la rage de 1
        new_rage = await decrement_rage(user_id, guild_id, channel_id, 1)

        # Si enragé, gérer le maintien
        if is_enraged and rage_level >= SEUIL_ENRAGE:
            maintien += 1

            if maintien >= TOURS_MAINTIEN:
                # Le calme revient - ramener sous le seuil
                new_rage = min(new_rage, SEUIL_ENRAGE - 1)
                await set_rage_data(
                    user_id, guild_id, channel_id,
                    rage_level=new_rage,
                    is_enraged=False,
                    maintien_counter=0,
                    others_spoke_since=False,
                )

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
                                    f"Ta Rage est redescendue à **{new_rage}**."
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
                    logger.error(f"Erreur notification calme: {e}")
            else:
                # Incrémenter le compteur de maintien
                await set_rage_data(
                    user_id, guild_id, channel_id,
                    rage_level=new_rage,
                    maintien_counter=maintien,
                )
        else:
            # Pas enragé ou sous le seuil, juste mettre à jour la rage
            # Vérifier si on passe sous le seuil
            if new_rage < SEUIL_ENRAGE and is_enraged:
                await set_rage_data(
                    user_id, guild_id, channel_id,
                    rage_level=new_rage,
                    is_enraged=False,
                    maintien_counter=0,
                )
            else:
                await set_rage_data(
                    user_id, guild_id, channel_id,
                    rage_level=new_rage,
                )

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        """
        Écoute les messages pour détecter les tours de parole.

        Un tour se termine quand:
        1. Le loup-garou a envoyé un/des message(s)
        2. D'autres personnes ont répondu
        3. Le loup-garou envoie à nouveau un message

        À chaque tour, la rage diminue de 1.
        """
        # Ignorer les bots et les messages hors RP
        if message.author.bot:
            return

        if not message.guild:
            return

        if not is_rp_channel(message.channel):
            return

        # Récupérer tous les loups-garous avec de la rage dans ce salon
        wolves_in_scene = await get_all_enraged_werewolves_in_channel(
            message.guild.id,
            message.channel.id,
        )

        for wolf_data in wolves_in_scene:
            wolf_id = wolf_data["user_id"]

            # Si c'est le loup-garou qui parle
            if message.author.id == wolf_id:
                # Si d'autres ont parlé depuis son dernier message, c'est un nouveau tour
                if wolf_data.get("others_spoke_since"):
                    await self._process_turn(
                        wolf_id,
                        message.guild.id,
                        message.channel.id,
                        message.channel,
                    )

                # Mettre à jour : d'autres n'ont pas encore parlé depuis ce message
                await set_rage_data(
                    wolf_id,
                    message.guild.id,
                    message.channel.id,
                    last_message_id=message.id,
                    others_spoke_since=False,
                )

            else:
                # Quelqu'un d'autre parle, marquer que d'autres ont parlé
                if wolf_data.get("last_message_id"):
                    await set_rage_data(
                        wolf_id,
                        message.guild.id,
                        message.channel.id,
                        others_spoke_since=True,
                    )

    @app_commands.command(name="lycan", description="Ouvre le panneau de contrôle Loup-Garou")
    async def lycan_command(self, interaction: discord.Interaction):
        """
        Ouvre le panneau Lycan avec les boutons de contrôle de la Rage.

        Accessible uniquement aux membres avec le rôle "Loup-garou".
        """
        # Vérifier le rôle
        if not has_lycan_role(interaction.user):
            await interaction.response.send_message(
                "❌ Tu dois avoir le rôle **Loup-garou** pour utiliser cette commande.",
                ephemeral=True,
            )
            return

        # Vérifier si on est dans un canal RP
        if not is_rp_channel(interaction.channel):
            await interaction.response.send_message(
                "❌ Cette commande ne fonctionne que dans les catégories **[RP]**.",
                ephemeral=True,
            )
            return

        # Récupérer le profil du joueur
        player = await get_player(interaction.user.id, interaction.guild.id)

        # Si pas d'augure défini, demander de choisir
        if not player or not player.get("auspice"):
            embed = discord.Embed(
                title="🐺 Configuration Loup-Garou",
                description=(
                    "Tu n'as pas encore choisi ton Augure.\n\n"
                    "Sous quelle lune es-tu né ?"
                ),
                color=discord.Color.orange(),
            )

            view = AuspiceSelectView()
            await interaction.response.send_message(
                embed=embed,
                view=view,
                ephemeral=True,
            )
            return

        auspice = player.get("auspice")

        # Vérifier que l'augure existe
        auspice_data = get_auspice(auspice)
        if not auspice_data:
            embed = discord.Embed(
                title="🐺 Configuration Loup-Garou",
                description=(
                    f"Ton augure `{auspice}` n'est plus reconnu.\n\n"
                    "Choisis un nouvel augure..."
                ),
                color=discord.Color.orange(),
            )

            view = AuspiceSelectView()
            await interaction.response.send_message(
                embed=embed,
                view=view,
                ephemeral=True,
            )
            return

        # Récupérer les données de rage pour ce salon
        rage_data = await get_rage_data(
            interaction.user.id,
            interaction.guild.id,
            interaction.channel.id,
        )

        # Créer et afficher le panneau
        panel = LycanPanel(
            user_id=interaction.user.id,
            guild_id=interaction.guild.id,
            channel_id=interaction.channel.id,
            auspice=auspice,
            rage_data=rage_data,
        )

        await interaction.response.send_message(
            embed=panel.create_embed(),
            view=panel,
            ephemeral=True,
        )

    @app_commands.command(
        name="lycan_config",
        description="[Admin] Configure un joueur comme Loup-Garou"
    )
    @app_commands.describe(
        member="Le joueur à configurer",
        auspice="L'augure du loup-garou",
        rage="Le niveau de Rage dans ce salon"
    )
    @app_commands.default_permissions(administrator=True)
    async def lycan_config_command(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        auspice: str = None,
        rage: int = None,
    ):
        """Configure un joueur comme Loup-Garou (commande admin)."""
        from utils.database import set_player

        if auspice:
            auspice_lower = auspice.lower().strip()
            auspice_data = get_auspice(auspice_lower)
            if not auspice_data:
                available = ", ".join(list_auspices())
                await interaction.response.send_message(
                    f"❌ Augure `{auspice}` non reconnu.\nAugures disponibles: {available}",
                    ephemeral=True,
                )
                return

            await set_player(member.id, interaction.guild.id, race="loup-garou", auspice=auspice_lower)

        if rage is not None:
            if rage < 0:
                await interaction.response.send_message(
                    "❌ Le niveau de Rage ne peut pas être négatif.",
                    ephemeral=True,
                )
                return

            is_enraged = rage >= SEUIL_ENRAGE
            await set_rage_data(
                member.id,
                interaction.guild.id,
                interaction.channel.id,
                rage_level=rage,
                is_enraged=is_enraged,
                maintien_counter=0,
            )

            # Gérer le surnom
            if rage >= SEUIL_PRIMAL:
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

        await interaction.response.send_message(
            f"✅ Configuration de {member.display_name} mise à jour.",
            ephemeral=True,
        )

    @app_commands.command(
        name="rage_remove",
        description="[Admin] Retire de la rage à un joueur"
    )
    @app_commands.describe(
        member="Le joueur ciblé",
        amount="Quantité de rage à retirer"
    )
    @app_commands.default_permissions(administrator=True)
    async def rage_remove_command(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        amount: int,
    ):
        """Retire de la rage à un joueur (commande admin)."""
        if amount < 1:
            await interaction.response.send_message(
                "❌ La quantité doit être supérieure à 0.",
                ephemeral=True,
            )
            return

        if not is_rp_channel(interaction.channel):
            await interaction.response.send_message(
                "❌ Cette commande ne fonctionne que dans les catégories **[RP]**.",
                ephemeral=True,
            )
            return

        rage_data = await get_rage_data(member.id, interaction.guild.id, interaction.channel.id)
        old_rage = rage_data.get("rage_level", 0)

        if old_rage == 0:
            await interaction.response.send_message(
                f"❌ {member.display_name} n'a pas de rage dans cette scène.",
                ephemeral=True,
            )
            return

        new_rage = await decrement_rage(member.id, interaction.guild.id, interaction.channel.id, amount)

        # Gérer les changements d'état
        if old_rage >= SEUIL_ENRAGE > new_rage:
            await set_rage_data(
                member.id, interaction.guild.id, interaction.channel.id,
                is_enraged=False,
                maintien_counter=0,
            )

        # Restaurer le surnom si on quitte primal
        if old_rage >= SEUIL_PRIMAL > new_rage:
            try:
                if member.nick and "[PRIMAL]" in member.nick:
                    new_nick = member.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                    await member.edit(nick=new_nick if new_nick else None)
            except discord.Forbidden:
                pass

        await interaction.response.send_message(
            f"✅ Rage de {member.display_name} réduite de **{old_rage}** à **{new_rage}** (-{amount}).",
            ephemeral=True,
        )

    @app_commands.command(
        name="fin_scene",
        description="[Admin] Met fin à une scène et remet la rage de tous à 0"
    )
    @app_commands.default_permissions(administrator=True)
    async def end_scene_admin_command(self, interaction: discord.Interaction):
        """Met fin à la scène pour tous les loups-garous dans ce salon."""
        if not is_rp_channel(interaction.channel):
            await interaction.response.send_message(
                "❌ Cette commande ne fonctionne que dans les catégories **[RP]**.",
                ephemeral=True,
            )
            return

        wolves = await get_all_enraged_werewolves_in_channel(
            interaction.guild.id,
            interaction.channel.id,
        )

        count = 0
        for wolf_data in wolves:
            wolf_id = wolf_data["user_id"]

            # Restaurer le surnom si nécessaire
            if wolf_data.get("rage_level", 0) >= SEUIL_PRIMAL:
                try:
                    member = interaction.guild.get_member(wolf_id)
                    if member and member.nick and "[PRIMAL]" in member.nick:
                        new_nick = member.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                        await member.edit(nick=new_nick if new_nick else None)
                except discord.Forbidden:
                    pass

            await clear_rage(wolf_id, interaction.guild.id, interaction.channel.id)
            count += 1

        embed = discord.Embed(
            title="🏁 Scène Terminée",
            description=(
                f"La scène est clôturée.\n"
                f"**{count}** loup(s)-garou(s) ont vu leur rage remise à zéro."
            ),
            color=discord.Color.blue(),
        )

        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    """Charge le Cog Loup-Garou."""
    await bot.add_cog(WerewolfCog(bot))
    logger.info("Cog Loup-Garou chargé")
