"""
Panneau interactif pour les Loups-Garous (Lycans).
Affiche un embed avec des boutons pour gérer la Rage.
"""

import discord
from discord import ui
from typing import Optional

from data.auspices import get_auspice, get_rage_message, AUSPICES
from utils.database import (
    get_player,
    set_player,
    get_rage_data,
    set_rage_data,
    increment_rage,
    decrement_rage,
    clear_rage,
    get_active_rage_scenes,
)
from utils.rp_check import is_rp_channel

# Seuils de Rage
SEUIL_ENRAGE = 10
SEUIL_PRIMAL = 20


class AuspiceSelectMenu(ui.Select):
    """Menu déroulant pour sélectionner un augure."""

    def __init__(self):
        options = [
            discord.SelectOption(
                label=f"{auspice_data['nom']} — {auspice_data['phase']}",
                value=auspice_key,
                description=f"{auspice_data['role']}: {auspice_data['description'][:80]}",
            )
            for auspice_key, auspice_data in AUSPICES.items()
        ]
        super().__init__(
            placeholder="Choisis ton Augure...",
            min_values=1,
            max_values=1,
            options=options,
        )

    async def callback(self, interaction: discord.Interaction):
        auspice_key = self.values[0]
        auspice_data = get_auspice(auspice_key)

        # Sauvegarder l'augure
        await set_player(
            interaction.user.id,
            interaction.guild.id,
            race="loup-garou",
            auspice=auspice_key,
        )

        embed = discord.Embed(
            title=f"🐺 Bienvenue parmi les {auspice_data['nom']}",
            description=(
                f"**{auspice_data['role']}** — Né sous la **{auspice_data['phase']}**\n\n"
                f"{auspice_data['description']}"
            ),
            color=discord.Color.orange(),
        )
        embed.set_footer(text="Tu peux maintenant utiliser /lycan pour accéder à ton panneau.")

        await interaction.response.edit_message(embed=embed, view=None)


class AuspiceSelectView(ui.View):
    """Vue pour la sélection d'augure."""

    def __init__(self):
        super().__init__(timeout=120)
        self.add_item(AuspiceSelectMenu())


class LycanPanel(ui.View):
    """Panneau principal pour les Loups-Garous."""

    def __init__(
        self,
        user_id: int,
        guild_id: int,
        channel_id: int,
        auspice: str,
        rage_data: dict,
    ):
        super().__init__(timeout=300)
        self.user_id = user_id
        self.guild_id = guild_id
        self.channel_id = channel_id
        self.auspice = auspice
        self.rage_level = rage_data.get("rage_level", 0)
        self.is_enraged = rage_data.get("is_enraged", False)
        self.maintien_counter = rage_data.get("maintien_counter", 0)

    def _create_rage_bar(self) -> str:
        """Crée une barre visuelle de rage."""
        total_segments = 20
        filled = min(self.rage_level, total_segments)

        if self.rage_level >= SEUIL_PRIMAL:
            filled_char = "🔴"
        elif self.rage_level >= SEUIL_ENRAGE:
            filled_char = "🟠"
        else:
            filled_char = "🟡"

        # Afficher seulement 10 segments pour la lisibilité
        display_filled = min(filled // 2, 10)
        display_empty = 10 - display_filled

        return filled_char * display_filled + "⚫" * display_empty

    def _get_state_description(self) -> str:
        """Retourne la description de l'état actuel."""
        if self.rage_level >= SEUIL_PRIMAL:
            return "🔴 **RAGE PRIMALE** — Tu n'es plus humain !"
        elif self.rage_level >= SEUIL_ENRAGE:
            remaining = 2 - self.maintien_counter
            return f"🟠 **ENRAGÉ** — Tours de maintien restants: {remaining}"
        elif self.rage_level >= SEUIL_ENRAGE - 2:
            return "🟡 **Tension** — Tu approches du seuil critique..."
        elif self.rage_level > 0:
            return "⚪ **Agité** — La Bête gronde mais tu gardes le contrôle."
        else:
            return "🟢 **Calme** — Le Garou en toi sommeille."

    def create_embed(self) -> discord.Embed:
        """Crée l'embed du panneau."""
        auspice_data = get_auspice(self.auspice)
        auspice_name = auspice_data["nom"] if auspice_data else self.auspice.capitalize()
        phase = auspice_data["phase"] if auspice_data else ""

        color = discord.Color.red() if self.rage_level >= SEUIL_PRIMAL else (
            discord.Color.orange() if self.rage_level >= SEUIL_ENRAGE else discord.Color.gold()
        )

        embed = discord.Embed(
            title=f"🐺 Panneau Lycan — {auspice_name}",
            description=f"*{phase}*" if phase else None,
            color=color,
        )

        # Jauge de Rage
        embed.add_field(
            name="Rage",
            value=f"{self._create_rage_bar()} ({self.rage_level}/{SEUIL_PRIMAL})",
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
                "💢 **+1 Rage** — Un affront mineur\n"
                "🔥 **+3 Rage** — Un affront majeur\n"
                "🧘 **-1 Rage** — Tu te calmes\n"
                "🏁 **Fin de scène** — Clôture cette scène (rage remise à 0)"
            ),
            inline=False,
        )

        embed.set_footer(text=f"Scène: #{self.channel_id} • Ce panneau n'est visible que par toi.")

        return embed

    async def _send_rage_notification(self, interaction: discord.Interaction, is_primal: bool = False):
        """Envoie une notification de rage en MP."""
        rage_msg = get_rage_message(self.auspice, "primal" if is_primal else "enrage")

        if not rage_msg:
            return

        color = discord.Color.red() if is_primal else discord.Color.orange()

        embed = discord.Embed(
            title=rage_msg["titre"],
            description=rage_msg["message"],
            color=color,
        )

        try:
            await interaction.user.send(embed=embed)
        except discord.Forbidden:
            pass

    async def _announce_primal(self, interaction: discord.Interaction):
        """Annonce publiquement l'état Primal."""
        auspice_data = get_auspice(self.auspice)
        auspice_display = auspice_data["nom"] if auspice_data else "Garou"

        embed = discord.Embed(
            title="🐺 LA BÊTE SE DÉCHAÎNE 🐺",
            description=(
                f"**{interaction.user.display_name}** n'est plus humain.\n\n"
                f"Le {auspice_display} a atteint la **RAGE PRIMALE**. "
                f"La créature devant vous n'est plus qu'instinct et fureur."
            ),
            color=discord.Color.red(),
        )
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        embed.set_footer(text="Que Gaïa ait pitié de vos âmes...")

        # Envoyer dans le salon actuel
        try:
            channel = interaction.guild.get_channel(self.channel_id)
            if channel:
                await channel.send(embed=embed)
        except discord.Forbidden:
            pass

        # Changer le surnom
        try:
            member = interaction.guild.get_member(interaction.user.id)
            if member:
                old_nick = member.display_name
                new_nick = f"🐺 {old_nick} [PRIMAL]"
                if len(new_nick) <= 32:
                    await member.edit(nick=new_nick)
        except discord.Forbidden:
            pass

    async def _update_rage_state(self, interaction: discord.Interaction, old_level: int):
        """Met à jour l'état de rage et envoie les notifications appropriées."""
        just_became_enraged = old_level < SEUIL_ENRAGE <= self.rage_level < SEUIL_PRIMAL
        just_became_primal = old_level < SEUIL_PRIMAL <= self.rage_level

        if just_became_primal:
            self.is_enraged = True
            self.maintien_counter = 0
            await set_rage_data(
                self.user_id, self.guild_id, self.channel_id,
                rage_level=self.rage_level,
                is_enraged=True,
                maintien_counter=0,
            )
            await self._send_rage_notification(interaction, is_primal=True)
            await self._announce_primal(interaction)

        elif just_became_enraged:
            self.is_enraged = True
            self.maintien_counter = 0
            await set_rage_data(
                self.user_id, self.guild_id, self.channel_id,
                rage_level=self.rage_level,
                is_enraged=True,
                maintien_counter=0,
            )
            await self._send_rage_notification(interaction, is_primal=False)

        elif self.rage_level >= SEUIL_ENRAGE:
            # Déjà enragé, réinitialiser le maintien
            self.maintien_counter = 0
            await set_rage_data(
                self.user_id, self.guild_id, self.channel_id,
                rage_level=self.rage_level,
                maintien_counter=0,
            )

        else:
            # Sous le seuil
            if self.is_enraged and self.rage_level < SEUIL_ENRAGE:
                self.is_enraged = False
                await set_rage_data(
                    self.user_id, self.guild_id, self.channel_id,
                    rage_level=self.rage_level,
                    is_enraged=False,
                    maintien_counter=0,
                )
            else:
                await set_rage_data(
                    self.user_id, self.guild_id, self.channel_id,
                    rage_level=self.rage_level,
                )

    @ui.button(label="+1 Rage", style=discord.ButtonStyle.secondary, emoji="💢", row=0)
    async def rage_small_button(self, interaction: discord.Interaction, button: ui.Button):
        """Augmente la Rage de 1."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        old_level = self.rage_level
        self.rage_level = await increment_rage(self.user_id, self.guild_id, self.channel_id, 1)
        await self._update_rage_state(interaction, old_level)
        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="+3 Rage", style=discord.ButtonStyle.danger, emoji="🔥", row=0)
    async def rage_big_button(self, interaction: discord.Interaction, button: ui.Button):
        """Augmente la Rage de 3."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        old_level = self.rage_level
        self.rage_level = await increment_rage(self.user_id, self.guild_id, self.channel_id, 3)
        await self._update_rage_state(interaction, old_level)
        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="-1 Rage", style=discord.ButtonStyle.success, emoji="🧘", row=0)
    async def calm_button(self, interaction: discord.Interaction, button: ui.Button):
        """Réduit la Rage de 1."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        if self.rage_level > 0:
            old_level = self.rage_level
            self.rage_level = await decrement_rage(self.user_id, self.guild_id, self.channel_id, 1)

            # Vérifier si on quitte l'état enragé
            if old_level >= SEUIL_ENRAGE > self.rage_level:
                self.is_enraged = False
                await set_rage_data(
                    self.user_id, self.guild_id, self.channel_id,
                    is_enraged=False,
                    maintien_counter=0,
                )

            # Restaurer le surnom si on quitte primal
            if old_level >= SEUIL_PRIMAL > self.rage_level:
                try:
                    member = interaction.guild.get_member(self.user_id)
                    if member and member.nick and "[PRIMAL]" in member.nick:
                        new_nick = member.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                        await member.edit(nick=new_nick if new_nick else None)
                except discord.Forbidden:
                    pass

        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="Fin de scène", style=discord.ButtonStyle.primary, emoji="🏁", row=1)
    async def end_scene_button(self, interaction: discord.Interaction, button: ui.Button):
        """Met fin à la scène et remet la rage à 0."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        # Restaurer le surnom si nécessaire
        if self.rage_level >= SEUIL_PRIMAL:
            try:
                member = interaction.guild.get_member(self.user_id)
                if member and member.nick and "[PRIMAL]" in member.nick:
                    new_nick = member.nick.replace(" [PRIMAL]", "").replace("🐺 ", "")
                    await member.edit(nick=new_nick if new_nick else None)
            except discord.Forbidden:
                pass

        # Effacer la rage pour cette scène
        await clear_rage(self.user_id, self.guild_id, self.channel_id)

        # Mettre à jour l'état local
        self.rage_level = 0
        self.is_enraged = False
        self.maintien_counter = 0

        embed = discord.Embed(
            title="🏁 Scène terminée",
            description=(
                "La scène est clôturée. Ta Rage a été remise à zéro.\n\n"
                "*Le calme revient. La Bête se rendort... pour l'instant.*"
            ),
            color=discord.Color.blue(),
        )

        await interaction.response.edit_message(embed=embed, view=None)

    @ui.button(label="Rafraîchir", style=discord.ButtonStyle.secondary, emoji="🔄", row=1)
    async def refresh_button(self, interaction: discord.Interaction, button: ui.Button):
        """Rafraîchit le panneau."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        # Recharger les données
        rage_data = await get_rage_data(self.user_id, self.guild_id, self.channel_id)
        self.rage_level = rage_data.get("rage_level", 0)
        self.is_enraged = rage_data.get("is_enraged", False)
        self.maintien_counter = rage_data.get("maintien_counter", 0)

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
