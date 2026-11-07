"""
Configuration des rôles et salons pour le bot World of Darkness.
"""

# === RÔLES DE RACE ===

# Rôle Vampire - pour la commande /vampire
ROLE_VAMPIRE = 1453870404535058573

# Rôle Loup-garou - pour la commande /lycan
ROLE_LOUP_GAROU = 1453870972376584192


# === RÔLES D'ADMINISTRATION ===

# Fondateur - Tous les droits
ROLE_FONDATEUR = 1454188379519320196

# MJ Vampire - Droits sur les vampires
ROLE_MJ_VAMPIRE = 1454188335957282897

# MJ Loup-Garou - Droits sur les garous (Story 4.4 review fix)
ROLE_MJ_WEREWOLF = 1462941982161764556

# Rôles qui peuvent valider les actions de sang
VALIDATION_ROLES = [ROLE_FONDATEUR, ROLE_MJ_VAMPIRE]

# Rôle à mentionner pour les nouvelles demandes de validation
MENTION_ROLE_VALIDATION = ROLE_MJ_VAMPIRE


# === ÉCONOMIE DE SANG (Vitae) ===

# Chasse en off : autorisée seulement si la réserve est au moins à cette part du maximum,
# rend cette même part (arrondie au supérieur), au plus une fois par fenêtre.
VITAE_QUICK_FEED_RATIO = 0.4
VITAE_QUICK_FEED_COOLDOWN_HOURS = 20

# Entretien paresseux : à l'ouverture du panneau, perte de 1 Vitae par tranche de jours
# réels écoulés depuis la dernière vérification, plafonnée par ouverture.
VITAE_UPKEEP_INTERVAL_DAYS = 2
VITAE_UPKEEP_MAX_PER_CHECK = 3

# Coût en Vitae pour lier une goule de sang (trois nuits de sang en règle).
GHOUL_BLOOD_COST = 3


# === SALONS ===

# Salon de validation des actions de Puissance du Sang
VALIDATION_CHANNEL_ID = 1454182154270670848


# === GOOGLE SHEETS API ===

# URL de l'API Google Apps Script (doit correspondre à celle du site web)
GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec"
