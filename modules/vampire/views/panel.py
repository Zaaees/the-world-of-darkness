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
    modify_vitae,
    get_vampire_data,
    set_vampire_data,
    get_max_vitae,
    get_saturation_threshold,
    reset_vampire_data,
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

        # Vérifier si le joueur a déjà un clan (cas de reset/mort)
        existing_player = await get_player(interaction.user.id, interaction.guild.id)
        old_clan = existing_player.get("clan") if existing_player else None

        # Si le joueur avait un ancien clan, retirer le rôle et reset les données
        if old_clan and old_clan != clan_key:
            old_clan_data = get_clan(old_clan)
            if old_clan_data:
                old_role = discord.utils.get(interaction.guild.roles, name=old_clan_data["nom"])
                if old_role:
                    try:
                        await interaction.user.remove_roles(old_role, reason="Changement de clan")
                    except discord.Forbidden:
                        pass

            # Réinitialiser toutes les données vampire (mort/nouveau personnage)
            await reset_vampire_data(interaction.user.id, interaction.guild.id, clan_key)

        # Sauvegarder le nouveau clan
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

        # Message de bienvenue
        if old_clan and old_clan != clan_key:
            embed = discord.Embed(
                title=f"🧛 Renaissance parmi les {clan_data['nom']}",
                description=(
                    f"{clan_data['description']}\n\n"
                    f"*Ton ancien personnage a été effacé. Tu repars à zéro avec ce nouveau lignage.*"
                ),
                color=discord.Color.dark_red(),
            )
        else:
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


class VitaeSpendModal(ui.Modal, title="Dépenser de la Vitae"):
    """Fenêtre modale pour dépenser une quantité précise de Vitae."""

    amount = ui.TextInput(
        label="Quantité de sang à verser",
        placeholder="Entrez un nombre (ex: 1, 3, 5...)",
        min_length=1,
        max_length=2,
        required=True,
    )

    def __init__(self, panel_view: "VampirePanel"):
        super().__init__()
        self.panel_view = panel_view

    async def on_submit(self, interaction: discord.Interaction):
        try:
            value = int(self.amount.value)
            if value <= 0:
                raise ValueError
        except ValueError:
            await interaction.response.send_message(
                "Tu dois entrer un nombre positif valide.", ephemeral=True
            )
            return

        # Dépenser la vitae (via un nombre négatif)
        # modify_vitae retourne la nouvelle valeur
        try:
            new_vitae = await modify_vitae(interaction.user.id, interaction.guild.id, -value)
        except ValueError as exc:
            await interaction.response.send_message(str(exc), ephemeral=True)
            return
        
        self.panel_view.soif_level = new_vitae
        
        # Vérifier la frénésie (si on est tombé à 0)
        old_state_level = self.panel_view._get_soif_state_level(self.panel_view.soif_level + value) # Etat avant dépense
        new_state_level = self.panel_view._get_soif_state_level()

        # Si on atteint le stade critique (0 vitae), on annonce potentiellement la frénésie
        # Dans le nouveau système inversé : 0% de vitae = Danger Max
        if new_state_level == 5 and old_state_level < 5:
            await self.panel_view._announce_frenzy(interaction)

        # Mettre à jour le panneau
        await interaction.response.edit_message(
            embed=self.panel_view.create_embed(), view=self.panel_view
        )


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
        self.soif_level = soif_level # Note: soif_level stocke maintenant la Vitae (de 0 à Max)
        self.blood_potency = blood_potency
        self.saturation_points = saturation_points
        # Initialiser l'état des boutons (s'il y a besoin de disabling logic)
        self._update_buttons()

    def _create_soif_bar(self) -> str:
        """Crée une barre visuelle de Vitae (Jauge inversée).

        Chaque emoji représente 1/5 du pool maximum.
        - 🩸 = Vitae disponible (Bon)
        - ⚫ = Vide / Soif (Mauvais)
        """
        max_vitae = get_max_vitae(self.blood_potency)
        segment_size = max_vitae / 5

        bar = ""
        # On remplit de gauche à droite avec du sang
        for i in range(5):
             # Logique inversée : Si j'ai assez de sang pour remplir ce segment
            segment_threshold = (i + 1) * segment_size
            
            if self.soif_level >= segment_threshold:
                 bar += "🩸"
            elif self.soif_level > i * segment_size:
                 bar += "💧" # Partiellement plein
            else:
                 bar += "⚫" # Vide

        return f"{bar} ({self.soif_level}/{max_vitae})"

    def _create_saturation_bar(self) -> str:
        """Crée une barre visuelle de progression de saturation."""
        threshold = get_saturation_threshold(self.blood_potency)
        if threshold is None:
            return "✨ Maximum atteint"

        progress = min(self.saturation_points / threshold, 1.0)
        filled_segments = int(progress * 10)
        empty_segments = 10 - filled_segments

        return "▰" * filled_segments + "▱" * empty_segments + f" ({self.saturation_points}/{threshold})"

    def _get_soif_state_level(self, current_val=None) -> int:
        """Calcule le niveau d'état narratif (0-5) basé sur le manque de sang.
        
        Sytème inversé :
        - 100-80% Vitae : État 0 (Rassasié)
        - 79-60% Vitae : État 1
        - 59-40% Vitae : État 2
        - 39-20% Vitae : État 3
        - 19-1% Vitae : État 4
        - 0% Vitae : État 5 (Frénésie)
        """
        level_to_check = current_val if current_val is not None else self.soif_level
        max_vitae = get_max_vitae(self.blood_potency)
        if max_vitae == 0:
            return 5 # Pas de conteneur = frénésie permanente ? (Devrait pas arriver)

        percentage = level_to_check / max_vitae
        
        if percentage >= 0.8:
            return 0 # Tout va bien
        elif percentage >= 0.6:
            return 1
        elif percentage >= 0.4:
            return 2
        elif percentage >= 0.2:
            return 3
        elif percentage > 0:
            return 4
        else:
            return 5 # Vide

    def _get_state_description(self) -> str:
        """Retourne la description de l'état actuel."""
        state_level = self._get_soif_state_level()
        states = {
            0: "Tu es rassasié. La Bête est calme.",
            1: "Une légère faim tiraille ton esprit.",
            2: "La Soif grandit. Tes sens s'aiguisent.",
            3: "Le sang t'appelle. La Bête gratte à la porte.",
            4: "Tu es affamé. La perte de contrôle est proche.",
            5: "**FRÉNÉSIE IMMINENTE** — Ton corps est vide !",
        }
        return states.get(state_level, "État inconnu")

    def create_embed(self) -> discord.Embed:
        """Crée l'embed du panneau."""
        clan_data = get_clan(self.clan)
        clan_name = clan_data["nom"] if clan_data else self.clan.capitalize()

        # Infos de Puissance du Sang
        bp_info = BLOOD_POTENCY_INFO.get(self.blood_potency, BLOOD_POTENCY_INFO[1])
        state_level = self._get_soif_state_level()

        # Couleur : Vert (Bon) -> Rouge (Mauvais) -> Violet (Frénésie)
        colors = {
            0: discord.Color.dark_green(),
            1: discord.Color.green(),
            2: discord.Color.yellow(),
            3: discord.Color.orange(),
            4: discord.Color.red(),
            5: discord.Color.dark_purple(),
        }

        embed = discord.Embed(
            title=f"🧛 Panneau Vampire — {clan_name}",
            description=f"*{bp_info['rang']}*",
            color=colors.get(state_level, discord.Color.dark_red()),
        )

        # Puissance du Sang
        embed.add_field(
            name=f"🩸 Puissance du Sang — {bp_info['titre']}",
            value=f"**Niveau {self.blood_potency}/5**\n{bp_info['description']}",
            inline=False,
        )

        # Progression de l'épaississement du sang
        embed.add_field(
            name="📈 Épaississement du Sang",
            value=self._create_saturation_bar(),
            inline=False,
        )

        # Jauge de Vitae (Ex-Soif)
        embed.add_field(
            name="Réserve de Vitae",
            value=self._create_soif_bar(),
            inline=False,
        )

        # État
        embed.add_field(
            name="État de la Soif",
            value=self._get_state_description(),
            inline=False,
        )

        # Compulsion actuelle (si état > 0)
        # Note : Les compulsions sont basées sur le "State Level" (0-5), qui a été adapté.
        # Donc la logique reste valide : plus le state_level est haut, plus on a de problèmes.
        if state_level > 0:
            compulsion = get_compulsion(self.clan, state_level)
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

    def _update_buttons(self):
        """Met à jour l'état des boutons."""
        # On pourrait désactiver le bouton dépenser si Vitae = 0, mais on laisse le joueur essayer pour voir le message d'erreur ou juste rien faire.
        pass

    @ui.button(label="Soif", style=discord.ButtonStyle.danger, emoji="🩸", row=1)
    async def spend_button(
        self, interaction: discord.Interaction, button: ui.Button
    ):
        """Ouvre la modale pour dépenser de la Vitae."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return
        
        await interaction.response.send_modal(VitaeSpendModal(self))


    @ui.button(label="Se nourrir", style=discord.ButtonStyle.success, emoji="🍷", row=1)
    async def feed_button(self, interaction: discord.Interaction, button: ui.Button):
        """Restaure la Vitae au maximum."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return

        max_vitae = get_max_vitae(self.blood_potency)
        
        # On remplit à fond (plus de limite Elder Curse)
        target_vitae = max_vitae

        if self.soif_level < target_vitae:
            await set_soif(self.user_id, self.guild_id, target_vitae) # set_soif est un alias de set_vampire_soif qui écrit dans la colonne "soif_level"
            self.soif_level = target_vitae

        # Mettre à jour l'embed
        await interaction.response.edit_message(embed=self.create_embed(), view=self)
