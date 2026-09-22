"""
Cog Vampire : Gestion de la Soif et des Compulsions via slash command.

La commande /vampire ouvre un panneau interactif avec des boutons.
Accessible uniquement aux membres avec le rôle "Vampire".
"""

import logging
import os

import discord
from discord import app_commands
from discord.ext import commands

from data.clans import get_clan, list_clans
from data.config import ROLE_VAMPIRE
from utils.database import get_player, get_soif, get_vampire_data
from utils.rp_check import is_rp_channel

# Import from the specific module view
from modules.vampire.views.panel import VampirePanel, ClanSelectView

logger = logging.getLogger(__name__)

# URL du site web pour la sélection de clan
WEB_URL = os.getenv("WEB_URL", "https://zaaees.github.io/the-world-of-darkness")


def has_vampire_role(member: discord.Member) -> bool:
    """Vérifie si le membre a le rôle Vampire."""
    return any(role.id == ROLE_VAMPIRE for role in member.roles)


class VampireCog(commands.Cog, name="Vampire"):
    """Système de Soif et Compulsions pour les Vampires."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="vampire", description="Ouvre le panneau de contrôle Vampire")
    async def vampire_command(self, interaction: discord.Interaction):
        """
        Ouvre le panneau Vampire avec les boutons de contrôle de la Soif.

        Accessible uniquement aux membres avec le rôle "Vampire" dans un salon RP.
        """
        # Defer la réponse pour éviter le timeout Discord lors des appels à Google Sheets
        await interaction.response.defer(ephemeral=True)

        # Vérifier si on est sur un serveur
        if not interaction.guild:
            await interaction.followup.send(
                "❌ Cette commande ne peut être utilisée que sur un serveur Discord.",
                ephemeral=True,
            )
            return

        # Vérifier le rôle
        if not has_vampire_role(interaction.user):
            await interaction.followup.send(
                "❌ Tu dois avoir le rôle **Vampire** pour utiliser cette commande.",
                ephemeral=True,
            )
            return

        # Vérifier si on est dans un canal RP
        if not is_rp_channel(interaction.channel):
            await interaction.followup.send(
                "❌ Cette commande ne fonctionne que dans les catégories **[RP]**.",
                ephemeral=True,
            )
            return



        # Récupérer le profil du joueur
        player = await get_player(interaction.user.id, interaction.guild.id)

        # Si pas de clan défini, rediriger vers le site web
        if not player or not player.get("clan"):
            # Créer l'URL avec les paramètres d'authentification
            auth_url = f"{WEB_URL}?userId={interaction.user.id}&guildId={interaction.guild.id}"

            embed = discord.Embed(
                title="🧛 Bienvenue parmi les Damnés",
                description=(
                    "Tu viens de rejoindre les rangs des vampires, mais ton lignage reste encore à définir.\n\n"
                    "**Chaque clan porte un héritage millénaire, une malédiction unique, et des disciplines qui te définiront pour l'éternité.**\n\n"
                    "Clique sur le bouton ci-dessous pour accéder au **Codex des Clans** et choisir ta lignée de sang."
                ),
                color=discord.Color.dark_red(),
            )

            embed.set_footer(text="🩸 Une fois choisi, ton clan façonnera ton destin pour toujours")

            # Créer un bouton pour accéder au site
            view = discord.ui.View()
            view.add_item(
                discord.ui.Button(
                    label="📖 Consulter le Codex des Clans",
                    url=auth_url,
                    style=discord.ButtonStyle.link
                )
            )

            await interaction.followup.send(
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
            await interaction.followup.send(
                embed=embed,
                view=view,
                ephemeral=True,
            )
            return

        # Récupérer les données vampiriques complètes
        vampire_data = await get_vampire_data(interaction.user.id, interaction.guild.id)
        soif_level = vampire_data.get("soif_level", 0)
        blood_potency = vampire_data.get("blood_potency", 1)
        saturation_points = vampire_data.get("saturation_points", 0)

        # Créer et afficher le panneau
        panel = VampirePanel(
            user_id=interaction.user.id,
            guild_id=interaction.guild.id,
            channel_id=interaction.channel.id,
            clan=clan,
            soif_level=soif_level,
            blood_potency=blood_potency,
            saturation_points=saturation_points,
        )

        await interaction.followup.send(
            embed=panel.create_embed(),
            view=panel,
            ephemeral=True,
        )


async def setup(bot: commands.Bot):
    """Charge le Cog Vampire."""
    await bot.add_cog(VampireCog(bot))
    logger.info("Cog Vampire chargé depuis le module")
