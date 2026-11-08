"""
Panneau interactif pour les Vampires.
Affiche un embed avec des boutons pour gérer la Soif.
"""

from typing import Optional

import discord
from discord import ui

from data.blood_potency import BLOOD_POTENCY_INFO, STANDARD_VITAE_COSTS
from data.clans import get_clan, get_compulsion, CLANS
from data.disciplines import get_usable_powers
from data.frenzy import DRAWING_OUT_THE_BEAST, leaves_beast_mark
from modules.vampire.views.bonds import DEFY_OPTION, OfferBloodView, bond_fields, defy_option, defy_option_bond, offer_embed
from modules.vampire.views.frenzy import (
    CalmView,
    TriggerView,
    awaken_embed,
    beast_mark_input,
    calm_beast,
    calm_embed,
    frenzy_panel_field,
    handle_empty_reserve,
    parse_scene_link,
)
from utils.blood_bonds import clear_blood_bonds, defy_bond, get_bonds
from utils.database import (
    clear_frenzy_data,
    get_player,
    set_player,
    modify_vitae,
    get_max_vitae,
    get_saturation_threshold,
    reset_vampire_data,
    feed_vampire,
    quick_feed_amount,
    quick_feed_floor,
    requires_scene_feeding,
    spend_vitae_for_power,
)

BEAST_MARKS_SHOWN = 5

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
            await reset_vampire_data(interaction.user.id, interaction.guild.id)
            await clear_frenzy_data(interaction.user.id, interaction.guild.id)
            await clear_blood_bonds(interaction.guild.id, interaction.user.id)

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
        placeholder="Résistance mentale, coût exceptionnel… (ex : 3, 6, 9)",
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
        self.panel_view.note = f"🩸 {value} Vitae versés."
        # À sec en pleine scène : la Faim l'emporte aussitôt.
        if new_vitae == 0:
            self.panel_view.note = await handle_empty_reserve(interaction, self.panel_view) or self.panel_view.note

        # Mettre à jour le panneau
        await interaction.response.edit_message(
            embed=self.panel_view.create_embed(), view=self.panel_view
        )


class HuntSceneModal(ui.Modal, title="Scène de chasse"):
    """Alimentation jouée en scène : le lien Discord de la scène remplit la réserve."""

    scene_link = ui.TextInput(
        label="Lien de la scène de chasse",
        placeholder="https://discord.com/channels/…/…/…",
        min_length=20,
        max_length=200,
        required=True,
    )

    def __init__(self, panel_view: "VampirePanel"):
        super().__init__()
        self.panel_view = panel_view
        # Une frénésie de Faim s'achève avec ce repas ; chez les Gangrel, elle laisse sa marque.
        self.ends_hunger = bool(panel_view.frenzy) and panel_view.frenzy["frenzy_type"] == "faim"
        self.mark = None
        if self.ends_hunger and leaves_beast_mark(panel_view.clan):
            self.mark = beast_mark_input()
            self.add_item(self.mark)

    async def on_submit(self, interaction: discord.Interaction):
        if parse_scene_link(self.scene_link.value, interaction.guild.id) is None:
            await interaction.response.send_message(
                "Indique un lien de scène Discord de ce serveur.", ephemeral=True
            )
            return
        try:
            result = await feed_vampire(interaction.user.id, interaction.guild.id, "scene")
        except ValueError as exc:
            await interaction.response.send_message(str(exc), ephemeral=True)
            return
        self.panel_view.soif_level = result["vitae"]
        prey = "Sang de vampire bu" if requires_scene_feeding(self.panel_view.blood_potency) else "Scène de chasse jouée"
        note = f"🍷 {prey} : réserve pleine ({result['vitae']}/{result['max_vitae']})."
        if self.ends_hunger:
            calmed = await calm_beast(interaction, self.panel_view, "rassasie", self.mark.value if self.mark else None)
            note = f"{note} {calmed or ''}".strip()
        fresh = self.panel_view.clone(note)
        await interaction.response.edit_message(embed=fresh.create_embed(), view=fresh)


class PowerSelect(ui.Select):
    """Active un pouvoir de discipline (ou une dépense standard) en prélevant son coût."""

    def __init__(self, panel_view: "VampirePanel"):
        self.panel_view = panel_view
        options = []
        defy = defy_option(panel_view.bonds)
        if defy:
            options.append(defy)
        for power in get_usable_powers(panel_view.clan, panel_view.blood_potency):
            cost = power["bloodCost"]
            options.append(discord.SelectOption(
                label=f"{power['name']} ({'gratuit' if cost == 0 else f'{cost} Vitae'})"[:100],
                value=power["id"],
                description=f"{power['discipline_name']} · niveau {power['level']}"[:100],
            ))
        for key, item in STANDARD_VITAE_COSTS.items():
            if len(options) >= 25:
                break
            options.append(discord.SelectOption(
                label=f"{item['label']} ({item['cost']} Vitae)"[:100], value=key))
        super().__init__(placeholder="Utiliser un pouvoir…", min_values=1, max_values=1,
                         options=options[:25], row=0)

    async def callback(self, interaction: discord.Interaction):
        if interaction.user.id != self.panel_view.user_id:
            await interaction.response.send_message("Ce panneau ne t'appartient pas.", ephemeral=True)
            return
        choice = self.values[0]
        before = self.panel_view.soif_level
        try:
            note = None
            if choice == DEFY_OPTION:
                result = await defy_bond(interaction.guild.id, interaction.user.id)
                new_vitae, cost = result["vitae"], result["cost"]
                note = f"⛓️ Tu défies ton lien envers {result['regnant_name']} : {cost} Vitae versés."
            elif choice in STANDARD_VITAE_COSTS:
                item = STANDARD_VITAE_COSTS[choice]
                new_vitae = await modify_vitae(interaction.user.id, interaction.guild.id, -item["cost"])
                label, cost = item["label"], item["cost"]
            else:
                result = await spend_vitae_for_power(
                    interaction.user.id, interaction.guild.id, self.panel_view.clan,
                    self.panel_view.blood_potency, choice)
                new_vitae, label, cost = result["vitae"], result["power"]["name"], result["cost"]
        except ValueError as exc:
            message = str(exc)
            if choice == DEFY_OPTION and "insuffisante" in message:
                full = defy_option_bond(self.panel_view.bonds)
                if full:
                    message = (f"Ta réserve ne suffit pas : tu ne peux pas agir contre "
                               f"{full['regnant_name']} ({full['defy_cost']} Vitae).")
            await interaction.response.send_message(message, ephemeral=True)
            return
        self.panel_view.soif_level = new_vitae
        if note is None:
            note = f"🩸 {label} : {cost} Vitae versés." if cost else f"✨ {label} : pouvoir passif, rien à verser."
        self.panel_view.note = note
        # Libérer la Bête : la frénésie passe sur une autre victime.
        if choice == DRAWING_OUT_THE_BEAST and self.panel_view.frenzy:
            calmed = await calm_beast(interaction, self.panel_view, "transferee")
            self.panel_view.note = f"{self.panel_view.note} {calmed or ''}".strip()
        # À sec en pleine scène : la Faim l'emporte aussitôt.
        if new_vitae == 0 and before > 0:
            self.panel_view.note = await handle_empty_reserve(interaction, self.panel_view) or self.panel_view.note
        await interaction.response.edit_message(embed=self.panel_view.create_embed(), view=self.panel_view)


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
        upkeep_lost: int = 0,
        frenzy: Optional[dict] = None,
        beast_marks: Optional[list] = None,
        bonds: Optional[dict] = None,
    ):
        super().__init__(timeout=300)
        self.user_id = user_id
        self.guild_id = guild_id
        self.channel_id = channel_id
        self.clan = clan
        self.soif_level = soif_level # Note: soif_level stocke maintenant la Vitae (de 0 à Max)
        self.blood_potency = blood_potency
        self.saturation_points = saturation_points
        # Frénésie en cours (rattachée à sa scène) et marques laissées par la Bête (Gangrel).
        self.frenzy = frenzy
        self.beast_marks = list(beast_marks or [])
        # Liens de sang : ceux que le personnage subit et ceux qu'il a noués.
        self.bonds = bonds
        # Dernière opération affichée sous la jauge (dépense, chasse, entretien).
        self.note = (f"🌙 Les nuits ont passé : −{upkeep_lost} Vitae d'entretien." if upkeep_lost else None)
        self.add_item(PowerSelect(self))
        # Initialiser l'état des boutons (s'il y a besoin de disabling logic)
        self._update_buttons()

    def clone(self, note: Optional[str] = None) -> "VampirePanel":
        """Panneau neuf au même état, pour revenir des écrans de la Frénésie (l'ancien peut avoir expiré)."""
        fresh = VampirePanel(
            self.user_id, self.guild_id, self.channel_id, self.clan, self.soif_level,
            self.blood_potency, self.saturation_points, frenzy=self.frenzy, beast_marks=self.beast_marks,
            bonds=self.bonds,
        )
        fresh.note = note if note is not None else self.note
        self.stop()
        return fresh

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
            5: "**À SEC** — Ton corps est vide, la Faim n'attend qu'une occasion.",
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
            color=(discord.Color.dark_purple() if self.frenzy
                   else colors.get(state_level, discord.Color.dark_red())),
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

        max_vitae = get_max_vitae(self.blood_potency)
        floor = quick_feed_floor(self.blood_potency)
        if requires_scene_feeding(self.blood_potency):
            feeding = ("Seul le **sang de vampire** te rassasie : **alimentation en scène obligatoire**. "
                       "Joue la scène où tu bois un autre vampire, puis donne son lien : la réserve se remplit.")
        elif self.soif_level >= floor:
            feeding = (f"Chasse en off possible : +{quick_feed_amount(self.blood_potency)} Vitae, une fois par nuit. "
                       f"Une scène de chasse (lien) remplit la réserve.")
        else:
            feeding = (f"Réserve sous {floor}/{max_vitae} : **alimentation en scène obligatoire**. "
                       f"Joue ta chasse, puis donne son lien.")
        if self.blood_potency >= 5:
            feeding += " (cette chasse ne te lie pas)"
        embed.add_field(name="🍷 Alimentation", value=feeding, inline=False)
        if self.note:
            embed.set_footer(text=self.note)

        # La frénésie prime sur la compulsion ; à sec, la Faim attend la scène où elle éclatera.
        # Le niveau 5 des compulsions n'est que la manière du clan, montrée avec la frénésie.
        if self.frenzy:
            name, value = frenzy_panel_field(self.clan, self.frenzy)
            embed.add_field(name=name, value=value, inline=False)
        elif state_level == 5:
            embed.add_field(
                name="🩸 À sec",
                value=("La Faim prendra le contrôle dans la scène où ton personnage se trouve à sec. "
                       "Déclare-la avec « La Bête s'éveille »."),
                inline=False,
            )
        elif state_level > 0:
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

        for name, value in bond_fields(self.bonds):
            embed.add_field(name=name, value=value, inline=False)

        if self.beast_marks and leaves_beast_mark(self.clan):
            shown = self.beast_marks[-BEAST_MARKS_SHOWN:]
            hidden = len(self.beast_marks) - len(shown)
            value = "\n".join(f"• {mark}" for mark in shown)
            if hidden:
                value = f"*…et {hidden} plus ancienne(s).*\n{value}"
            embed.add_field(name="🐾 Marques de la Bête", value=value[:1024], inline=False)

        return embed

    def _update_buttons(self):
        """Met à jour l'état des boutons."""
        # Au rang où seul le sang de vampire rassasie, la chasse en off n'existe plus.
        self.quick_feed_button.disabled = requires_scene_feeding(self.blood_potency)
        # Un seul bouton pour la Bête : la déclarer, ou la congédier quand elle tient les rênes.
        self.offer_button.disabled = self.soif_level == 0
        if self.frenzy:
            self.beast_button.label, self.beast_button.emoji = "La Bête se retire", "🌒"
            self.beast_button.style = discord.ButtonStyle.success
        else:
            self.beast_button.label, self.beast_button.emoji = "La Bête s'éveille", "🐺"
            self.beast_button.style = discord.ButtonStyle.secondary

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


    @ui.button(label="Chasse en off", style=discord.ButtonStyle.success, emoji="🍷", row=1)
    async def quick_feed_button(self, interaction: discord.Interaction, button: ui.Button):
        """Alimentation hors scène : part fixe de la réserve, une fois par nuit, jamais sous le seuil critique."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return
        try:
            result = await feed_vampire(self.user_id, self.guild_id, "quick")
        except ValueError as exc:
            await interaction.response.send_message(str(exc), ephemeral=True)
            return
        self.soif_level = result["vitae"]
        self.note = f"🍷 Chasse en off : +{result['gained']} Vitae ({result['vitae']}/{result['max_vitae']})."
        await interaction.response.edit_message(embed=self.create_embed(), view=self)

    @ui.button(label="Scène de chasse", style=discord.ButtonStyle.primary, emoji="🔗", row=1)
    async def scene_feed_button(self, interaction: discord.Interaction, button: ui.Button):
        """Alimentation jouée : demande le lien de la scène et remplit la réserve."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return
        await interaction.response.send_modal(HuntSceneModal(self))

    @ui.button(label="La Bête s'éveille", style=discord.ButtonStyle.secondary, emoji="🐺", row=2)
    async def beast_button(self, interaction: discord.Interaction, button: ui.Button):
        """Déclarer ce qui réveille la Bête (ravaler ou céder), ou la congédier pendant une frénésie."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return
        if self.frenzy:
            await interaction.response.edit_message(embed=calm_embed(self), view=CalmView(self))
        else:
            await interaction.response.edit_message(embed=awaken_embed(), view=TriggerView(self))

    @ui.button(label="Offrir mon sang", style=discord.ButtonStyle.secondary, emoji="🩸", row=2)
    async def offer_button(self, interaction: discord.Interaction, button: ui.Button):
        """Offrir une gorgée de son sang à un autre vampire : le lien de sang se noue."""
        if interaction.user.id != self.user_id:
            await interaction.response.send_message(
                "Ce panneau ne t'appartient pas.", ephemeral=True
            )
            return
        await interaction.response.edit_message(embed=offer_embed(), view=OfferBloodView(self))
