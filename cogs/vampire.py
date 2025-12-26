"""
Cog Vampire : Gestion de la Soif et des Compulsions via slash command.

La commande /vampire ouvre un panneau interactif avec des boutons.
Accessible uniquement aux membres avec le rôle "Vampire".
"""

import logging

import discord
from discord import app_commands
from discord.ext import commands

from data.clans import get_clan, list_clans
from utils.database import get_player, get_soif
from utils.rp_check import is_rp_channel
from views.vampire_panel import VampirePanel, ClanSelectView

logger = logging.getLogger(__name__)

# Nom du rôle requis (insensible à la casse)
VAMPIRE_ROLE_NAME = "vampire"


def has_vampire_role(member: discord.Member) -> bool:
    """Vérifie si le membre a le rôle Vampire."""
    return any(role.name.lower() == VAMPIRE_ROLE_NAME for role in member.roles)


class VampireCog(commands.Cog, name="Vampire"):
    """Système de Soif et Compulsions pour les Vampires."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="vampire", description="Ouvre le panneau de contrôle Vampire")
    async def vampire_command(self, interaction: discord.Interaction):
        """
        Ouvre le panneau Vampire avec les boutons de contrôle de la Soif.

        Accessible uniquement aux membres avec le rôle "Vampire".
        """
        # Vérifier le rôle
        if not has_vampire_role(interaction.user):
            await interaction.response.send_message(
                "❌ Tu dois avoir le rôle **Vampire** pour utiliser cette commande.",
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

        # Si pas de clan défini, demander de choisir
        if not player or not player.get("clan"):
            embed = discord.Embed(
                title="🧛 Configuration Vampire",
                description=(
                    "Tu n'as pas encore choisi ton Clan.\n\n"
                    "Choisis ton lignage parmi les Damnés..."
                ),
                color=discord.Color.dark_red(),
            )

            view = ClanSelectView()
            await interaction.response.send_message(
                embed=embed,
                view=view,
                ephemeral=True,
            )
            return

        clan = player.get("clan")

        # Vérifier que le clan existe
        clan_data = get_clan(clan)
        if not clan_data:
            embed = discord.Embed(
                title="🧛 Configuration Vampire",
                description=(
                    f"Ton clan `{clan}` n'est plus reconnu.\n\n"
                    "Choisis un nouveau clan..."
                ),
                color=discord.Color.dark_red(),
            )

            view = ClanSelectView()
            await interaction.response.send_message(
                embed=embed,
                view=view,
                ephemeral=True,
            )
            return

        # Récupérer le niveau de Soif
        soif_level = await get_soif(interaction.user.id, interaction.guild.id)

        # Créer et afficher le panneau
        panel = VampirePanel(
            user_id=interaction.user.id,
            guild_id=interaction.guild.id,
            channel_id=interaction.channel.id,
            clan=clan,
            soif_level=soif_level,
        )

        await interaction.response.send_message(
            embed=panel.create_embed(),
            view=panel,
            ephemeral=True,
        )

    @app_commands.command(
        name="vampire_config",
        description="[Admin] Configure un joueur comme Vampire"
    )
    @app_commands.describe(
        member="Le joueur à configurer",
        clan="Le clan du vampire",
        soif="Le niveau de Soif (0-5)"
    )
    @app_commands.default_permissions(administrator=True)
    async def vampire_config_command(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        clan: str = None,
        soif: int = None,
    ):
        """Configure un joueur comme Vampire (commande admin)."""
        from utils.database import set_player, set_soif

        if clan:
            clan_lower = clan.lower().strip()
            clan_data = get_clan(clan_lower)
            if not clan_data:
                available = ", ".join(list_clans())
                await interaction.response.send_message(
                    f"❌ Clan `{clan}` non reconnu.\nClans disponibles: {available}",
                    ephemeral=True,
                )
                return

            await set_player(member.id, interaction.guild.id, race="vampire", clan=clan_lower)

        if soif is not None:
            if not 0 <= soif <= 5:
                await interaction.response.send_message(
                    "❌ Le niveau de Soif doit être entre 0 et 5.",
                    ephemeral=True,
                )
                return
            await set_soif(member.id, interaction.guild.id, soif)

        await interaction.response.send_message(
            f"✅ Configuration de {member.display_name} mise à jour.",
            ephemeral=True,
        )


async def setup(bot: commands.Bot):
    """Charge le Cog Vampire."""
    await bot.add_cog(VampireCog(bot))
    logger.info("Cog Vampire chargé")
