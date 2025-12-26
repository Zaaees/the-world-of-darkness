"""
Panneau interactif pour les Vampires.
Affiche un embed avec des boutons pour gérer la Soif.
"""

import discord
from discord import ui

from data.clans import get_clan, get_compulsion, CLANS
from utils.database import (
    get_player,
    set_player,
    get_soif,
    set_soif,
    increment_soif,
    get_vampire_data,
    set_vampire_data,
    get_min_soif,
    get_saturation_threshold,
    SATURATION_THRESHOLDS,
)

# Descriptions narratives des niveaux de Puissance du Sang
BLOOD_POTENCY_INFO = {
    1: {
        "titre": "Sang Fluide",
        "rang": "Néonate",
        "description": "Votre sang est encore proche de celui des mortels.",
    },
    2: {
        "titre": "Sang Vif",
        "rang": "Ancilla Mineur",
        "description": "Le sang s'épaissit. Seul le sang humain peut vous soutenir.",
    },
    3: {
        "titre": "Sang Fort",
        "rang": "Ancilla Majeur",
        "description": "Vous êtes un prédateur abouti. La Soif est plus pressante.",
    },
    4: {
        "titre": "Sang Puissant",
        "rang": "Ancien",
        "description": "Votre sang est sombre et visqueux. Il vous faut la chaleur de la vie.",
    },
    5: {
        "titre": "Zénith Sanguin",
        "rang": "Sommité",
        "description": "L'apogée. Pour être rassasié, vous devez tuer ou boire le sang de vampires.",
    },
}


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

        # Attribuer le rôle du clan (créer s'il n'existe pas)
        clan_name = clan_data["nom"]
        role = discord.utils.get(interaction.guild.roles, name=clan_name)

        if not role:
            # Créer le rôle s'il n'existe pas
            try:
                role = await interaction.guild.create_role(
                    name=clan_name,
                    color=discord.Color.dark_red(),
                    reason=f"Création automatique du rôle de clan {clan_name}",
                )
            except discord.Forbidden:
                pass  # Le bot n'a pas les permissions

        if role:
            try:
                await interaction.user.add_roles(role, reason="Choix du clan vampirique")
            except discord.Forbidden:
                pass  # Le bot n'a pas les permissions

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

    def __init__(
        self,
        user_id: int,
        guild_id: int,
        channel_id: int,
        clan: str,
        soif_level: int,
        blood_potency: int = 1,
        saturation_points: int = 0,
    ):
        super().__init__(timeout=300)
        self.user_id = user_id
        self.guild_id = guild_id
        self.channel_id = channel_id
        self.clan = clan
        self.soif_level = soif_level
        self.blood_potency = blood_potency
        self.saturation_points = saturation_points

    def _create_soif_bar(self) -> str:
        """Crée une barre visuelle de soif."""
        min_soif = get_min_soif(self.blood_potency)
        bar = ""
        for i in range(5):
            if i < self.soif_level:
                bar += "🩸"
            elif i < min_soif:
                bar += "🔒"  # Verrouillé par la Puissance du Sang
            else:
                bar += "⚫"
        return bar

    def _create_saturation_bar(self) -> str:
        """Crée une barre visuelle de progression de saturation."""
        threshold = get_saturation_threshold(self.blood_potency)
        if threshold is None:
            return "✨ Maximum atteint"

        progress = min(self.saturation_points / threshold, 1.0)
        filled_segments = int(progress * 10)
        empty_segments = 10 - filled_segments

        return "▰" * filled_segments + "▱" * empty_segments + f" ({self.saturation_points}/{threshold})"

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

        # Infos de Puissance du Sang
        bp_info = BLOOD_POTENCY_INFO.get(self.blood_potency, BLOOD_POTENCY_INFO[1])
        min_soif = get_min_soif(self.blood_potency)

        # Couleur selon le niveau de soif
        colors = {
            0: discord.Color.dark_gray(),
            1: discord.Color.from_rgb(139, 0, 0),
            2: discord.Color.from_rgb(178, 34, 34),
            3: discord.Color.from_rgb(220, 20, 60),
            4: discord.Color.from_rgb(255, 0, 0),
            5: discord.Color.from_rgb(128, 0, 128),
        }

        embed = discord.Embed(
            title=f"🧛 Panneau Vampire — {clan_name}",
            description=f"*{bp_info['rang']}*",
            color=colors.get(self.soif_level, discord.Color.dark_red()),
        )

        # Puissance du Sang
        embed.add_field(
            name=f"🩸 Puissance du Sang — {bp_info['titre']}",
            value=f"**Niveau {self.blood_potency}/5**\n{bp_info['description']}",
            inline=False,
        )

        # Progression de Saturation
        embed.add_field(
            name="📈 Saturation",
            value=self._create_saturation_bar(),
            inline=False,
        )

        # Jauge de Soif
        soif_label = f"Soif (min. {min_soif})" if min_soif > 0 else "Soif"
        embed.add_field(
            name=soif_label,
            value=f"{self._create_soif_bar()} ({self.soif_level}/5)",
            inline=False,
        )

        # État
        embed.add_field(
            name="État",
            value=self._get_state_description(),
            inline=False,
        )

        # Compulsion actuelle (si soif > 0)
        if self.soif_level > 0:
            compulsion = get_compulsion(self.clan, self.soif_level)
            if compulsion:
                embed.add_field(
                    name=f"📜 Compulsion — {compulsion['nom']}",
                    value=compulsion["description"],
                    inline=False,
                )
                embed.add_field(
                    name="Directive de Jeu",
                    value=f"*{compulsion['directive']}*",
                    inline=False,
                )

        return embed

    async def _announce_frenzy(self, interaction: discord.Interaction):
        """Annonce publiquement l'état de Frénésie."""
        clan_data = get_clan(self.clan)
        clan_name = clan_data["nom"] if clan_data else "Vampire"

        compulsion = get_compulsion(self.clan, 5)
        frenzy_name = compulsion["nom"] if compulsion else "FRÉNÉSIE"

        embed = discord.Embed(
            title=f"🩸 LA BÊTE SE DÉCHAÎNE 🩸",
            description=(
                f"**{interaction.user.display_name}** a perdu le contrôle.\n\n"
                f"Le sang du clan **{clan_name}** a pris le dessus. "
                f"La créature devant vous n'est plus qu'instinct et faim.\n\n"
                f"**{frenzy_name}**"
            ),
            color=discord.Color.dark_purple(),
        )
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        embed.set_footer(text="Que Dieu ait pitié de vos âmes...")

        # Envoyer dans le salon actuel
        try:
            channel = interaction.guild.get_channel(self.channel_id)
            if channel:
                await channel.send(embed=embed)
        except discord.Forbidden:
            pass

    @ui.button(label="Soif", style=discord.ButtonStyle.danger, emoji="🩸")
    async def soif_button(self, interaction: discord.Interaction, button: ui.Button):
        """Augmente la Soif."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        old_level = self.soif_level

        if self.soif_level < 5:
            self.soif_level = await increment_soif(self.user_id, self.guild_id)

        # Annoncer la frénésie si on vient d'atteindre le niveau 5
        if old_level < 5 and self.soif_level == 5:
            await self._announce_frenzy(interaction)

        # Mettre à jour l'embed
        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="Se nourrir", style=discord.ButtonStyle.success, emoji="🍷")
    async def feed_button(self, interaction: discord.Interaction, button: ui.Button):
        """Restaure la Soif au minimum permis par la Puissance du Sang."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        min_soif = get_min_soif(self.blood_potency)

        if self.soif_level > min_soif:
            await set_soif(self.user_id, self.guild_id, min_soif)
            self.soif_level = min_soif

        await interaction.response.edit_message(embed=self.create_embed(), view=self)
