"""
Panneau interactif pour les Vampires.
Affiche un embed avec des boutons pour gérer la Soif.
"""

import discord
from discord import ui
from typing import Optional

from data.clans import get_clan, get_compulsion, list_clans, CLANS
from utils.database import (
    get_player,
    set_player,
    get_soif,
    set_soif,
    increment_soif,
    decrement_soif,
)


class ClanSelectMenu(ui.Select):
    """Menu déroulant pour sélectionner un clan."""

    def __init__(self):
        options = [
            discord.SelectOption(
                label=clan_data["nom"],
                value=clan_key,
                description=clan_data["description"][:100],
            )
            for clan_key, clan_data in CLANS.items()
        ]
        super().__init__(
            placeholder="Choisis ton Clan...",
            min_values=1,
            max_values=1,
            options=options,
        )

    async def callback(self, interaction: discord.Interaction):
        clan_key = self.values[0]
        clan_data = get_clan(clan_key)

        # Sauvegarder le clan
        await set_player(
            interaction.user.id,
            interaction.guild.id,
            race="vampire",
            clan=clan_key,
        )

        embed = discord.Embed(
            title=f"🧛 Bienvenue parmi les {clan_data['nom']}",
            description=clan_data["description"],
            color=discord.Color.dark_red(),
        )
        embed.set_footer(text="Tu peux maintenant utiliser /vampire pour accéder à ton panneau.")

        await interaction.response.edit_message(embed=embed, view=None)


class ClanSelectView(ui.View):
    """Vue pour la sélection de clan."""

    def __init__(self):
        super().__init__(timeout=120)
        self.add_item(ClanSelectMenu())


class VampirePanel(ui.View):
    """Panneau principal pour les Vampires."""

    def __init__(self, user_id: int, guild_id: int, clan: str, soif_level: int):
        super().__init__(timeout=300)
        self.user_id = user_id
        self.guild_id = guild_id
        self.clan = clan
        self.soif_level = soif_level

    def _create_soif_bar(self) -> str:
        """Crée une barre visuelle de soif."""
        filled = "🩸" * self.soif_level
        empty = "⚫" * (5 - self.soif_level)
        return filled + empty

    def _get_state_description(self) -> str:
        """Retourne la description de l'état actuel."""
        states = {
            0: "Ton sang est calme. La Bête sommeille.",
            1: "Une légère irritation. Rien d'inquiétant... pour l'instant.",
            2: "La faim commence à se faire sentir. La Bête s'agite.",
            3: "Le sang appelle le sang. Ta nature vampirique s'affirme.",
            4: "Tu es au bord du gouffre. La Bête griffe les murs de ta conscience.",
            5: "**FRÉNÉSIE** — La Bête a pris le contrôle !",
        }
        return states.get(self.soif_level, "État inconnu")

    def create_embed(self) -> discord.Embed:
        """Crée l'embed du panneau."""
        clan_data = get_clan(self.clan)
        clan_name = clan_data["nom"] if clan_data else self.clan.capitalize()

        embed = discord.Embed(
            title=f"🧛 Panneau Vampire — {clan_name}",
            color=discord.Color.dark_red(),
        )

        # Jauge de Soif
        embed.add_field(
            name="Soif",
            value=f"{self._create_soif_bar()} ({self.soif_level}/5)",
            inline=False,
        )

        # État
        embed.add_field(
            name="État",
            value=self._get_state_description(),
            inline=False,
        )

        # Instructions
        embed.add_field(
            name="Actions",
            value=(
                "🩸 **Soif** — Ta Soif augmente (+1)\n"
                "🍷 **Se nourrir** — Tu t'es nourri (-1)\n"
                "📜 **Compulsion** — Voir ta compulsion actuelle"
            ),
            inline=False,
        )

        embed.set_footer(text="Ce panneau n'est visible que par toi.")

        return embed

    async def _send_compulsion_dm(self, interaction: discord.Interaction):
        """Envoie la compulsion en MP."""
        if self.soif_level < 1:
            return

        compulsion = get_compulsion(self.clan, self.soif_level)
        if not compulsion:
            return

        # Couleurs selon le niveau
        colors = {
            1: discord.Color.from_rgb(139, 0, 0),
            2: discord.Color.from_rgb(178, 34, 34),
            3: discord.Color.from_rgb(220, 20, 60),
            4: discord.Color.from_rgb(255, 0, 0),
            5: discord.Color.from_rgb(128, 0, 128),
        }

        embed = discord.Embed(
            title=f"🩸 Soif Niveau {self.soif_level} — {compulsion['nom']}",
            description=compulsion["description"],
            color=colors.get(self.soif_level, discord.Color.dark_red()),
        )

        embed.add_field(
            name="📜 Directive de Jeu",
            value=compulsion["directive"],
            inline=False,
        )

        clan_data = get_clan(self.clan)
        clan_name = clan_data["nom"] if clan_data else self.clan.capitalize()
        embed.set_footer(text=f"Clan {clan_name} • La Bête murmure...")

        try:
            await interaction.user.send(embed=embed)
        except discord.Forbidden:
            pass

    @ui.button(label="Soif", style=discord.ButtonStyle.danger, emoji="🩸", row=0)
    async def soif_button(self, interaction: discord.Interaction, button: ui.Button):
        """Augmente la Soif."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        if self.soif_level < 5:
            self.soif_level = await increment_soif(self.user_id, self.guild_id)

        # Envoyer la compulsion en MP
        await self._send_compulsion_dm(interaction)

        # Mettre à jour l'embed
        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="Se nourrir", style=discord.ButtonStyle.success, emoji="🍷", row=0)
    async def feed_button(self, interaction: discord.Interaction, button: ui.Button):
        """Réduit la Soif."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        if self.soif_level > 0:
            self.soif_level = await decrement_soif(self.user_id, self.guild_id)

        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="Compulsion", style=discord.ButtonStyle.secondary, emoji="📜", row=0)
    async def compulsion_button(self, interaction: discord.Interaction, button: ui.Button):
        """Affiche la compulsion actuelle."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        if self.soif_level < 1:
            await interaction.response.send_message(
                "Ta Soif est à 0. Tu n'as pas de compulsion active.",
                ephemeral=True,
            )
            return

        await self._send_compulsion_dm(interaction)
        await interaction.response.send_message(
            "📜 Compulsion envoyée en message privé.",
            ephemeral=True,
        )

    @ui.button(label="Rafraîchir", style=discord.ButtonStyle.primary, emoji="🔄", row=1)
    async def refresh_button(self, interaction: discord.Interaction, button: ui.Button):
        """Rafraîchit le panneau."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        # Recharger les données depuis la base
        self.soif_level = await get_soif(self.user_id, self.guild_id)
        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="Fermer", style=discord.ButtonStyle.secondary, emoji="❌", row=1)
    async def close_button(self, interaction: discord.Interaction, button: ui.Button):
        """Ferme le panneau."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        await interaction.response.edit_message(
            content="*Panneau fermé.*",
            embed=None,
            view=None,
        )
