"""
Frénésie dans le panneau Vampire : déclarer la Bête, la ravaler ou lui céder, la congédier.

Tout se joue dans le message du panneau : chaque étape remplace son contenu, puis rend
un panneau neuf. L'annonce publique part dans la scène liée et est modifiée à la fin
de la frénésie, au lieu d'un second message.
"""

import logging
import re
from typing import Optional

import discord
from discord import ui

from data.clans import get_frenzy_colouring
from data.frenzy import (
    FRENZY_TYPES,
    TRIGGERS,
    EXITS,
    available_triggers,
    can_resist,
    exit_announcement,
    exits_for,
    leaves_beast_mark,
    resist_cost,
)
from utils.database import (
    end_frenzy,
    get_beast_marks,
    get_frenzy,
    get_max_vitae,
    resist_frenzy,
    start_frenzy,
    update_frenzy,
)

logger = logging.getLogger(__name__)

SCENE_LINK = re.compile(r"https://(?:canary\.|ptb\.)?discord\.com/channels/(\d+)/(\d+)(?:/\d+)?")
MARK_MAX_LENGTH = 200


def parse_scene_link(value: str, guild_id: int) -> Optional[int]:
    """Salon d'une scène de ce serveur désigné par un lien Discord, sinon None."""
    match = SCENE_LINK.fullmatch((value or "").strip())
    if not match or int(match.group(1)) != guild_id:
        return None
    return int(match.group(2))


# ---------------------------------------------------------------------------
# Textes affichés
# ---------------------------------------------------------------------------

def frenzy_panel_field(clan: str, frenzy: dict) -> tuple[str, str]:
    """Champ du panneau pendant une frénésie : ce que veut la Bête et ce qui l'arrête."""
    kind = FRENZY_TYPES[frenzy["frenzy_type"]]
    trigger = TRIGGERS.get(frenzy["trigger_id"])
    lines = []
    if trigger:
        lines.append(f"**Cause :** {trigger['cause']}")
    if frenzy.get("channel_id"):
        lines.append(f"**Scène :** <#{frenzy['channel_id']}>")
    lines.append(f"*{kind['directive']}*")
    colouring = get_frenzy_colouring(clan)
    if colouring:
        lines.append(f"**{colouring['nom']}** — {colouring['directive']}")
    lines.append(f"{kind['fin']} On peut aussi t'apaiser ou te maîtriser : clique alors sur « La Bête se retire ».")
    return f"{kind['emoji']} Frénésie — {kind['nom']}", "\n".join(lines)


def frenzy_card(member: discord.abc.User, clan: str, frenzy: dict) -> discord.Embed:
    """Annonce publique postée dans la scène."""
    kind = FRENZY_TYPES[frenzy["frenzy_type"]]
    embed = discord.Embed(
        title=f"{kind['emoji']} LA BÊTE SE DÉCHAÎNE — {kind['nom'].upper()}",
        description=f"**{member.display_name}** cède à sa Bête.\n\n*{kind['but']}*",
        color=discord.Color.dark_purple(),
    )
    trigger = TRIGGERS.get(frenzy["trigger_id"])
    if trigger:
        embed.add_field(name="Cause", value=trigger["cause"], inline=True)
    colouring = get_frenzy_colouring(clan)
    if colouring:
        embed.add_field(name="Sang du clan", value=colouring["nom"], inline=True)
    embed.add_field(name="Jusqu'à quand ?", value=kind["fin_publique"], inline=False)
    embed.set_thumbnail(url=member.display_avatar.url)
    embed.set_footer(text="Que Dieu ait pitié de vos âmes...")
    return embed


def ended_card(member: discord.abc.User, ended: dict) -> discord.Embed:
    """L'annonce, modifiée quand la Bête se retire."""
    kind = FRENZY_TYPES[ended["frenzy_type"]]
    embed = discord.Embed(
        title="🌒 La Bête s'est retirée",
        description=(
            f"**{member.display_name}** reprend le contrôle.\n"
            f"Frénésie de {kind['nom']} — la Bête s'est retirée : {exit_announcement(ended['exit_reason'])}."
        ),
        color=discord.Color.dark_grey(),
    )
    if ended.get("mark"):
        embed.add_field(name="🐾 La Bête laisse sa marque", value=ended["mark"], inline=False)
    embed.set_thumbnail(url=member.display_avatar.url)
    return embed


# ---------------------------------------------------------------------------
# Annonce dans la scène
# ---------------------------------------------------------------------------

async def _scene_channel(guild: discord.Guild, channel_id: Optional[int]):
    if not channel_id:
        return None
    channel = guild.get_channel_or_thread(channel_id)
    if channel is None:
        try:
            channel = await guild.fetch_channel(channel_id)
        except discord.HTTPException:
            return None
    return channel if hasattr(channel, "send") else None


async def post_card(guild: discord.Guild, channel_id: int, embed: discord.Embed) -> Optional[int]:
    """Poste l'annonce ; renvoie l'id du message, ou None si le salon est inaccessible."""
    channel = await _scene_channel(guild, channel_id)
    if channel is None:
        return None
    try:
        message = await channel.send(embed=embed)
    except discord.HTTPException:
        logger.warning("Annonce de frénésie impossible dans le salon %s", channel_id)
        return None
    return message.id


async def edit_card(guild: discord.Guild, frenzy: dict, embed: discord.Embed):
    """Met à jour l'annonce de la frénésie, si elle a pu être postée."""
    if not frenzy.get("message_id"):
        return
    channel = await _scene_channel(guild, frenzy.get("channel_id"))
    if channel is None or not hasattr(channel, "get_partial_message"):
        return
    try:
        await channel.get_partial_message(frenzy["message_id"]).edit(embed=embed)
    except discord.HTTPException:
        logger.warning("Annonce de frénésie introuvable (message %s)", frenzy["message_id"])


async def unleash(interaction: discord.Interaction, panel, trigger_id: str, channel_id: int) -> str:
    """Céder : la frénésie commence dans la scène et y est annoncée. Renvoie la note du panneau."""
    trigger = TRIGGERS[trigger_id]
    frenzy = await start_frenzy(panel.user_id, panel.guild_id, trigger["type"], trigger_id, channel_id)
    message_id = await post_card(interaction.guild, channel_id, frenzy_card(interaction.user, panel.clan, frenzy))
    if message_id:
        frenzy = await update_frenzy(panel.user_id, panel.guild_id, message_id=message_id)
    panel.frenzy = frenzy
    kind = FRENZY_TYPES[trigger["type"]]
    if message_id:
        return f"{kind['emoji']} Tu cèdes à ta Bête : frénésie de {kind['nom']} annoncée dans la scène."
    return f"{kind['emoji']} Tu cèdes à ta Bête (annonce impossible dans ce salon : préviens la scène toi-même)."


async def handle_empty_reserve(interaction: discord.Interaction, panel) -> Optional[str]:
    """Réserve vidée depuis Discord, en scène : la Faim l'emporte aussitôt, dans ce salon."""
    frenzy = await get_frenzy(panel.user_id, panel.guild_id)
    if frenzy is None:
        return await unleash(interaction, panel, "faim_zero", interaction.channel.id)
    if frenzy["frenzy_type"] == "faim":
        panel.frenzy = frenzy
        return None
    frenzy = await update_frenzy(panel.user_id, panel.guild_id, frenzy_type="faim", trigger_id="faim_zero")
    await edit_card(interaction.guild, frenzy, frenzy_card(interaction.user, panel.clan, frenzy))
    panel.frenzy = frenzy
    return "🩸 À sec : ta frénésie tourne à la Faim."


async def calm_beast(interaction: discord.Interaction, panel, reason: str, mark: Optional[str] = None) -> Optional[str]:
    """La Bête se retire : historique, annonce modifiée. Renvoie la note du panneau."""
    ended = await end_frenzy(panel.user_id, panel.guild_id, reason, mark)
    panel.frenzy = None
    if ended is None:
        return None
    await edit_card(interaction.guild, ended, ended_card(interaction.user, ended))
    if ended.get("mark"):
        panel.beast_marks = await get_beast_marks(panel.user_id, panel.guild_id)
    return f"🌒 La Bête se retire : {exit_announcement(reason)}."


def needs_beast_mark(panel) -> bool:
    return bool(panel.frenzy) and leaves_beast_mark(panel.clan)


def beast_mark_input() -> ui.TextInput:
    return ui.TextInput(
        label="Marque laissée par la Bête",
        placeholder="Des yeux qui reflètent la lumière, une fourrure par plaques…",
        style=discord.TextStyle.paragraph,
        max_length=MARK_MAX_LENGTH,
        required=True,
    )


# ---------------------------------------------------------------------------
# La Bête s'éveille : choix de la cause, lien de scène, ravaler ou céder
# ---------------------------------------------------------------------------

def _owner_only(panel, interaction: discord.Interaction) -> bool:
    return interaction.user.id == panel.user_id


async def _refuse(interaction: discord.Interaction):
    await interaction.response.send_message("Ce panneau ne t'appartient pas.", ephemeral=True)


async def back_to_panel(interaction: discord.Interaction, panel, note: Optional[str] = None):
    fresh = panel.clone(note)
    await interaction.response.edit_message(embed=fresh.create_embed(), view=fresh)


class BackButton(ui.Button):
    def __init__(self, panel, row: int = 1):
        super().__init__(label="Retour", style=discord.ButtonStyle.secondary, emoji="↩️", row=row)
        self.panel = panel

    async def callback(self, interaction: discord.Interaction):
        if not _owner_only(self.panel, interaction):
            return await _refuse(interaction)
        await back_to_panel(interaction, self.panel)


def awaken_embed() -> discord.Embed:
    embed = discord.Embed(
        title="🐺 La Bête s'éveille",
        description=(
            "Choisis ce qui réveille ta Bête dans la scène. Seules ces situations comptent : "
            "une contrariété, une bougie ou une goutte de sang ne suffisent pas.\n"
            "Une même cause ne réveille la Bête qu'une fois par scène."
        ),
        color=discord.Color.dark_red(),
    )
    for kind in FRENZY_TYPES.values():
        embed.add_field(name=f"{kind['emoji']} {kind['nom']}", value=kind["but"], inline=False)
    return embed


class TriggerSelect(ui.Select):
    def __init__(self, panel):
        self.panel = panel
        max_vitae = get_max_vitae(panel.blood_potency)
        options = []
        for trigger_id in available_triggers(panel.clan, panel.soif_level, max_vitae):
            trigger = TRIGGERS[trigger_id]
            kind = FRENZY_TYPES[trigger["type"]]
            cost = resist_cost(trigger_id, panel.blood_potency, panel.clan)
            if trigger["resist"] == "power":
                price = "ravaler : prix de résistance du pouvoir"
            elif cost is None:
                price = "impossible à ravaler"
            else:
                price = f"ravaler : {cost} Vitae"
            options.append(discord.SelectOption(
                label=trigger["label"][:100], value=trigger_id, emoji=kind["emoji"],
                description=f"{kind['nom']} · {price}"[:100]))
        super().__init__(placeholder="Ce qui réveille ta Bête…", min_values=1, max_values=1, options=options, row=0)

    async def callback(self, interaction: discord.Interaction):
        if not _owner_only(self.panel, interaction):
            return await _refuse(interaction)
        await interaction.response.send_modal(SceneModal(self.panel, self.values[0]))


class TriggerView(ui.View):
    def __init__(self, panel):
        super().__init__(timeout=300)
        self.add_item(TriggerSelect(panel))
        self.add_item(BackButton(panel))


class SceneModal(ui.Modal, title="La Bête s'éveille"):
    """Lien de la scène (et prix du pouvoir si un pouvoir réveille la Bête)."""

    def __init__(self, panel, trigger_id: str):
        super().__init__()
        self.panel = panel
        self.trigger_id = trigger_id
        self.scene_link = ui.TextInput(
            label="Lien de la scène", placeholder="https://discord.com/channels/…/…/…",
            min_length=20, max_length=200, required=True)
        self.add_item(self.scene_link)
        self.power_price = None
        if TRIGGERS[trigger_id]["resist"] == "power":
            self.power_price = ui.TextInput(
                label="Prix de résistance du pouvoir (Vitae)", placeholder="Ex : 3, 6, 9",
                min_length=1, max_length=2, required=True)
            self.add_item(self.power_price)

    async def on_submit(self, interaction: discord.Interaction):
        channel_id = parse_scene_link(self.scene_link.value, interaction.guild.id)
        if channel_id is None:
            await interaction.response.send_message("Indique un lien de scène Discord de ce serveur.", ephemeral=True)
            return
        trigger = TRIGGERS[self.trigger_id]
        if trigger["resist"] is None:
            try:
                note = await unleash(interaction, self.panel, self.trigger_id, channel_id)
            except ValueError as exc:
                await interaction.response.send_message(str(exc), ephemeral=True)
                return
            await back_to_panel(interaction, self.panel, note)
            return
        if self.power_price is not None:
            try:
                cost = int(self.power_price.value)
                if cost < 1:
                    raise ValueError
            except ValueError:
                await interaction.response.send_message("Le prix du pouvoir doit être un nombre positif.", ephemeral=True)
                return
        else:
            cost = resist_cost(self.trigger_id, self.panel.blood_potency, self.panel.clan)
        view = ChoiceView(self.panel, self.trigger_id, channel_id, cost)
        await interaction.response.edit_message(embed=view.embed(), view=view)


class ChoiceView(ui.View):
    """Ravaler (prix en Vitae) ou céder (la Bête prend les rênes)."""

    def __init__(self, panel, trigger_id: str, channel_id: int, cost: int):
        super().__init__(timeout=300)
        self.panel = panel
        self.trigger_id = trigger_id
        self.channel_id = channel_id
        self.cost = cost
        self.resist_button.label = f"Ravaler ({cost} Vitae)"
        self.resist_button.disabled = not can_resist(cost, panel.soif_level)
        self.add_item(BackButton(panel))

    def embed(self) -> discord.Embed:
        trigger = TRIGGERS[self.trigger_id]
        kind = FRENZY_TYPES[trigger["type"]]
        max_vitae = get_max_vitae(self.panel.blood_potency)
        if can_resist(self.cost, self.panel.soif_level):
            resist = (f"Tu gardes le contrôle pour **{self.cost} Vitae** "
                      f"(il te resterait {self.panel.soif_level - self.cost}/{max_vitae}).")
        else:
            resist = (f"Il t'en faudrait **{self.cost}** sans verser ta dernière goutte "
                      f"(réserve : {self.panel.soif_level}/{max_vitae}). La Bête l'emporte.")
        embed = discord.Embed(
            title=f"{kind['emoji']} {kind['nom']} — {trigger['label']}",
            description=f"*{kind['but']}*",
            color=discord.Color.dark_red(),
        )
        embed.add_field(name="Ravaler la Bête", value=resist, inline=False)
        embed.add_field(name="Céder", value=f"Gratuit, mais la Bête prend les rênes.\n*{kind['directive']}*\n{kind['fin']}",
                        inline=False)
        embed.set_footer(text="Ravale quand tu as besoin de ta tête ; cède quand le combat est déjà là, "
                              "quand le sang te manque, ou quand le drame en vaut la peine.")
        return embed

    @ui.button(label="Ravaler", style=discord.ButtonStyle.primary, emoji="🩸", row=0)
    async def resist_button(self, interaction: discord.Interaction, button: ui.Button):
        if not _owner_only(self.panel, interaction):
            return await _refuse(interaction)
        trigger = TRIGGERS[self.trigger_id]
        try:
            vitae = await resist_frenzy(self.panel.user_id, self.panel.guild_id, trigger["type"],
                                        self.trigger_id, self.cost, self.channel_id)
        except ValueError as exc:
            await interaction.response.send_message(str(exc), ephemeral=True)
            return
        self.panel.soif_level = vitae
        kind = FRENZY_TYPES[trigger["type"]]
        await back_to_panel(interaction, self.panel, f"🩸 Tu ravales ta {kind['nom']} : −{self.cost} Vitae.")

    @ui.button(label="Céder", style=discord.ButtonStyle.danger, emoji="🐺", row=0)
    async def yield_button(self, interaction: discord.Interaction, button: ui.Button):
        if not _owner_only(self.panel, interaction):
            return await _refuse(interaction)
        try:
            note = await unleash(interaction, self.panel, self.trigger_id, self.channel_id)
        except ValueError as exc:
            await interaction.response.send_message(str(exc), ephemeral=True)
            return
        await back_to_panel(interaction, self.panel, note)


# ---------------------------------------------------------------------------
# La Bête se retire
# ---------------------------------------------------------------------------

def calm_embed(panel) -> discord.Embed:
    name, value = frenzy_panel_field(panel.clan, panel.frenzy)
    embed = discord.Embed(
        title="🌒 La Bête se retire",
        description="Pourquoi la Bête lâche-t-elle prise ?",
        color=discord.Color.dark_purple(),
    )
    embed.add_field(name=name, value=value, inline=False)
    if needs_beast_mark(panel):
        embed.add_field(name="🐾 Sang Gangrel", value="Ta Bête laisse une marque définitive : tu la décriras.",
                        inline=False)
    return embed


class ExitSelect(ui.Select):
    def __init__(self, panel):
        self.panel = panel
        options = [discord.SelectOption(label=EXITS[exit_id]["label"][:100], value=exit_id)
                   for exit_id in exits_for(panel.frenzy["frenzy_type"])]
        super().__init__(placeholder="La Bête se retire, car…", min_values=1, max_values=1, options=options, row=0)

    async def callback(self, interaction: discord.Interaction):
        if not _owner_only(self.panel, interaction):
            return await _refuse(interaction)
        reason = self.values[0]
        if reason == "rassasie":
            # Le lien de la scène de chasse remplit la réserve et rassasie la Bête.
            from modules.vampire.views.panel import HuntSceneModal
            await interaction.response.send_modal(HuntSceneModal(self.panel))
            return
        if needs_beast_mark(self.panel):
            await interaction.response.send_modal(BeastMarkModal(self.panel, reason))
            return
        note = await calm_beast(interaction, self.panel, reason)
        await back_to_panel(interaction, self.panel, note)


class CalmView(ui.View):
    def __init__(self, panel):
        super().__init__(timeout=300)
        self.add_item(ExitSelect(panel))
        self.add_item(BackButton(panel))


class BeastMarkModal(ui.Modal, title="La marque de la Bête"):
    def __init__(self, panel, reason: str):
        super().__init__()
        self.panel = panel
        self.reason = reason
        self.mark = beast_mark_input()
        self.add_item(self.mark)

    async def on_submit(self, interaction: discord.Interaction):
        note = await calm_beast(interaction, self.panel, self.reason, self.mark.value)
        await back_to_panel(interaction, self.panel, note)
