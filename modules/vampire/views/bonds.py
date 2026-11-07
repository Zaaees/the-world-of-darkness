"""
Lien de sang dans le panneau Vampire : lecture des liens, défi du lien, offrir son sang.

Comme pour la Frénésie, tout se joue dans le message (éphémère) du panneau : l'écran
« Offrir mon sang » le remplace, puis on revient sur un panneau neuf.
"""

from typing import Optional

import discord
from discord import ui

from data.blood_bonds import CARD_TEXT, DIRECTIVE, MAX_STAGE, STAGE_TEXT
from modules.vampire.views.frenzy import (
    BackButton, _owner_only, _refuse, back_to_panel, handle_empty_reserve, post_card,
)
from utils.blood_bonds import get_bonds, offer_blood
from utils.database import get_character_sheet, get_player

DEFY_OPTION = "bond:defy"
FIELD_MAX = 1024
DRANK_SHOWN = 5
NO_VAMPIRE = "Ce membre n'a pas de personnage vampire."


async def character_name(guild_id: int, member: discord.abc.User) -> str:
    """Nom de la fiche du personnage, sinon le pseudo Discord."""
    sheet = await get_character_sheet(member.id, guild_id)
    return ((sheet or {}).get("name") or "").strip() or member.display_name


def _full_bond(bonds: Optional[dict]) -> Optional[dict]:
    if not bonds:
        return None
    return next((b for b in bonds["bound_to"] if b["stage"] >= MAX_STAGE), None)


def bond_fields(bonds: Optional[dict]) -> list[tuple[str, str]]:
    """Champs du panneau : liens subis, directive du stade 3, personnes ayant bu ton sang."""
    if not bonds:
        return []
    fields = []
    if bonds["bound_to"]:
        lines = [f"**{b['regnant_name']}** — stade {b['stage']} : {STAGE_TEXT[b['stage']].format(name=b['regnant_name'])}"
                 for b in bonds["bound_to"]]
        fields.append(("⛓️ Liens de sang", "\n".join(lines)[:FIELD_MAX]))
        full = _full_bond(bonds)
        if full:
            fields.append(("Directive de Jeu",
                           f"*{DIRECTIVE.format(name=full['regnant_name'], cost=full['defy_cost'])}*"[:FIELD_MAX]))
    if bonds["drank_from_me"]:
        shown = bonds["drank_from_me"][:DRANK_SHOWN]
        lines = [f"• **{b['thrall_name']}** — stade {b['stage']}" for b in shown]
        hidden = len(bonds["drank_from_me"]) - len(shown)
        if hidden:
            lines.append(f"…et {hidden} autres")
        fields.append(("🩸 Ont bu ton sang", "\n".join(lines)[:FIELD_MAX]))
    return fields


def defy_option(bonds: Optional[dict]) -> Optional[discord.SelectOption]:
    """Entrée « Défier le lien » du menu des pouvoirs, seulement au stade 3."""
    full = _full_bond(bonds)
    if full is None:
        return None
    return discord.SelectOption(
        label=f"Défier le lien envers {full['regnant_name']} ({full['defy_cost']} Vitae)"[:100],
        value=DEFY_OPTION,
    )


class OfferUserSelect(ui.UserSelect):
    def __init__(self, panel):
        super().__init__(placeholder="À qui offres-tu ton sang ?", min_values=1, max_values=1, row=0)
        self.panel = panel

    async def callback(self, interaction: discord.Interaction):
        if not _owner_only(self.panel, interaction):
            return await _refuse(interaction)
        member = self.values[0]
        guild_id = interaction.guild.id
        target = None if member.bot else await get_player(member.id, guild_id)
        if not target or target.get("race") != "vampire" or not target.get("clan"):
            await interaction.response.send_message(NO_VAMPIRE, ephemeral=True)
            return
        regnant_name = await character_name(guild_id, interaction.user)
        thrall_name = await character_name(guild_id, member)
        try:
            result = await offer_blood(guild_id, interaction.user.id, regnant_name, self.panel.clan,
                                       member.id, thrall_name)
        except ValueError as exc:
            await interaction.response.send_message(str(exc), ephemeral=True)
            return
        card = discord.Embed(
            description=CARD_TEXT[result["stage"]].format(thrall=thrall_name, regnant=regnant_name),
            color=discord.Color.dark_red(),
        )
        message_id = await post_card(interaction.guild, self.panel.channel_id, card, content=member.mention)
        before = self.panel.soif_level
        self.panel.soif_level = result["vitae"]
        self.panel.bonds = await get_bonds(guild_id, interaction.user.id)
        note = f"🩸 Tu offres ton sang à {thrall_name} : lien au stade {result['stage']}."
        if not message_id:
            note += " (annonce impossible dans ce salon : préviens la scène toi-même)"
        # À sec en pleine scène : la Faim l'emporte aussitôt, comme pour toute autre dépense.
        if result["vitae"] == 0 and before > 0:
            empty = await handle_empty_reserve(interaction, self.panel)
            note = f"{note} {empty}" if empty else note
        await back_to_panel(interaction, self.panel, note)


class OfferBloodView(ui.View):
    def __init__(self, panel):
        super().__init__(timeout=300)
        self.add_item(OfferUserSelect(panel))
        self.add_item(BackButton(panel))


def offer_embed() -> discord.Embed:
    return discord.Embed(
        title="🩸 Offrir mon sang",
        description=("Choisis le vampire qui boit ton sang. Chaque gorgée te coûte **1 Vitae** et resserre son lien "
                     "envers toi ; au troisième stade, il ne peut plus agir contre toi sans en payer le prix."),
        color=discord.Color.dark_red(),
    )
