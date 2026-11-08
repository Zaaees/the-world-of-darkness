"""Lien de sang entre vampires : constantes et textes (règles dans utils/blood_bonds.py)."""

DRAUGHT_COST = 1  # Vitae prélevée au régnant à chaque gorgée
TREMERE_FIRST_STAGE = 2  # la première gorgée d'un régnant Tremere lie directement à ce stade
MAX_STAGE = 3

STAGE_TEXT = {
    1: "{name} occupe tes pensées plus que de raison.",
    2: "{name} compte plus que quiconque ; tu le protèges sans y penser.",
    3: "{name} passe avant tout, même avant toi.",
}

DIRECTIVE = (
    "Tu ne peux pas agir contre {name}. Chaque action contre lui te coûte {cost} Vitae : "
    "déclare-la avec « Défier le lien »."
)

CARD_TEXT = {
    1: "🩸 {thrall} boit le sang de {regnant}. Le lien se noue.",
    2: "🩸 {thrall} boit le sang de {regnant}. Le lien se resserre.",
    3: "🩸 {thrall} est désormais lié à {regnant}.",
}
