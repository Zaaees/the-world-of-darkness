"""
La Bête et la Frénésie (Règlement, section VII).

Seules les situations listées ici réveillent la Bête. Le joueur concerné les déclare
dans la scène depuis son panneau, puis ravale la Bête (prix en Vitae) ou lui cède.
Une frénésie se rattache à une scène, jamais à une durée : elle prend fin quand sa
cause disparaît, quand on apaise ou maîtrise le vampire, ou, pour la Faim, quand une
scène de chasse le rassasie.
"""

from data.clans import canonical_clan_key

# Sous ce ratio de réserve (et au-dessus de zéro), le vampire est « Affamé ».
HUNGRY_RATIO = 0.2

FRENZY_TYPES = {
    "faim": {
        "nom": "Faim",
        "emoji": "🩸",
        "but": "La Bête veut du sang, tout de suite, sur la proie la plus proche.",
        "directive": (
            "Tu te jettes sur la proie la plus proche et tu bois jusqu'à la vider. "
            "Tu ne négocies plus, tu ne te caches plus."
        ),
        "fin": "Elle s'apaise quand tu es rassasié : donne le lien de ta scène de chasse.",
        "fin_publique": "Elle ne se retirera qu'une fois rassasiée.",
    },
    "rage": {
        "nom": "Rage",
        "emoji": "💢",
        "but": "La Bête veut détruire ce qui l'a blessée ou humiliée.",
        "directive": (
            "Tu frappes la cause de ta colère, et quiconque se met en travers. "
            "Tu ne raisonnes plus, tu ne recules plus."
        ),
        "fin": "Elle s'apaise quand sa cause est détruite, en fuite ou hors d'atteinte.",
        "fin_publique": "Elle ne se retirera qu'une fois sa cause détruite, en fuite ou hors d'atteinte.",
    },
    "terreur": {
        "nom": "Terreur",
        "emoji": "🔥",
        "but": "La Bête veut fuir le feu et le soleil, et mord ce qui lui barre la route.",
        "directive": (
            "Tu fuis la flamme ou la lumière par le plus court chemin et tu mords ce qui t'en empêche. "
            "Tu ne penses plus qu'à survivre."
        ),
        "fin": "Elle s'apaise quand tu es à l'abri.",
        "fin_publique": "Elle ne se retirera qu'une fois à l'abri.",
    },
}

# label : ce que lit le joueur dans le panneau ; cause : ce qu'affiche l'annonce publique.
# resist : "rank" (prix selon le rang), "power" (prix de résistance du pouvoir), None (impossible).
TRIGGERS = {
    "faim_zero": {
        "type": "faim", "resist": None,
        "label": "Ma réserve est à sec",
        "cause": "Une réserve vide.",
    },
    "faim_sang": {
        "type": "faim", "resist": "rank",
        "label": "Du sang coule sous mes yeux alors que je suis Affamé",
        "cause": "Du sang versé sous ses yeux, en pleine famine.",
    },
    "faim_cainite": {
        "type": "faim", "resist": "rank", "clans": ("banu_haqim",),
        "label": "J'ai goûté le sang d'un Caïnite",
        "cause": "Le goût du sang d'un Caïnite.",
    },
    "rage_blessure": {
        "type": "rage", "resist": "rank",
        "label": "Je subis une blessure grave",
        "cause": "Une blessure grave.",
    },
    "rage_humiliation": {
        "type": "rage", "resist": "rank",
        "label": "On m'humilie publiquement ou on me trahit",
        "cause": "Une humiliation publique ou une trahison.",
    },
    "rage_menace": {
        "type": "rage", "resist": "rank",
        "label": "On menace ce que je protège (goule, domaine, être cher)",
        "cause": "Une menace contre ce qui lui est cher.",
    },
    "terreur_feu": {
        "type": "terreur", "resist": "rank",
        "label": "Le feu me brûle ou s'approche (plus grand qu'une torche)",
        "cause": "Le feu.",
    },
    "terreur_soleil": {
        "type": "terreur", "resist": "rank",
        "label": "Je suis exposé au soleil",
        "cause": "Le soleil.",
    },
    "pouvoir_faim": {
        "type": "faim", "resist": "power",
        "label": "Un pouvoir réveille ma Faim",
        "cause": "Un pouvoir surnaturel.",
    },
    "pouvoir_rage": {
        "type": "rage", "resist": "power",
        "label": "Un pouvoir réveille ma Rage",
        "cause": "Un pouvoir surnaturel.",
    },
    "pouvoir_terreur": {
        "type": "terreur", "resist": "power",
        "label": "Un pouvoir réveille ma Terreur",
        "cause": "Un pouvoir surnaturel.",
    },
}

# annonce : complète « La Bête s'est retirée : … » (accordé avec la Bête).
EXITS = {
    "rassasie": {"types": ("faim",), "label": "Je suis rassasié (lien de la scène de chasse)", "annonce": "rassasiée"},
    "cause_disparue": {"types": ("rage",), "label": "Sa cause est détruite, en fuite ou hors d'atteinte",
                       "annonce": "sa cause a disparu"},
    "abri": {"types": ("terreur",), "label": "Je suis à l'abri du feu et du soleil", "annonce": "à l'abri"},
    "apaise": {"types": ("faim", "rage", "terreur"), "label": "Quelqu'un m'apaise (Apaiser la Bête…)",
               "annonce": "apaisée"},
    "maitrise": {"types": ("faim", "rage", "terreur"), "label": "On me maîtrise (immobilisé, assommé, pieu)",
                 "annonce": "maîtrisée"},
}

# Raisons de fin posées par le bot lui-même, absentes du menu.
SYSTEM_EXITS = {
    "transferee": "transférée à une autre victime (Libérer la Bête)",
}

# Pouvoir qui fait passer la frénésie du vampire sur une autre victime.
DRAWING_OUT_THE_BEAST = "animalism-5-drawing-out-the-beast"

# Clans dont chaque frénésie laisse une marque animale définitive.
BEAST_MARK_CLANS = ("gangrel",)


def is_hungry(vitae: int, max_vitae: int) -> bool:
    """Affamé : sous 20 % de la réserve, sans être à sec."""
    return 0 < vitae < max_vitae * HUNGRY_RATIO


def available_triggers(clan: str, vitae: int, max_vitae: int) -> list[str]:
    """Déclencheurs que le joueur peut déclarer selon sa réserve et son clan."""
    if vitae <= 0:
        return ["faim_zero"]  # À zéro, la Faim l'emporte d'office.
    key = canonical_clan_key(clan)
    result = []
    for trigger_id, trigger in TRIGGERS.items():
        if trigger_id == "faim_zero":
            continue
        if trigger_id == "faim_sang" and not is_hungry(vitae, max_vitae):
            continue
        if "clans" in trigger and key not in trigger["clans"]:
            continue
        result.append(trigger_id)
    return result


def resist_cost(trigger_id: str, blood_potency: int, clan: str) -> int | None:
    """Prix pour ravaler la Bête : le rang (doublé pour un Brujah face à la Rage).

    None quand la Bête ne se ravale pas, ou quand le prix est celui du pouvoir (saisi par le joueur).
    """
    trigger = TRIGGERS[trigger_id]
    if trigger["resist"] != "rank":
        return None
    cost = max(1, int(blood_potency))
    if trigger["type"] == "rage" and canonical_clan_key(clan) == "brujah":
        cost *= 2
    return cost


def can_resist(cost: int, vitae: int) -> bool:
    """Il faut pouvoir payer le prix entier sans verser sa dernière goutte."""
    return cost >= 1 and vitae - cost >= 1


def exits_for(frenzy_type: str) -> list[str]:
    """Raisons de fin proposées dans le panneau pour ce type de frénésie."""
    return [exit_id for exit_id, data in EXITS.items() if frenzy_type in data["types"]]


def exit_announcement(reason: str) -> str:
    if reason in EXITS:
        return EXITS[reason]["annonce"]
    return SYSTEM_EXITS.get(reason, "elle s'est éteinte")


def leaves_beast_mark(clan: str) -> bool:
    return canonical_clan_key(clan) in BEAST_MARK_CLANS
