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

# Rôles qui peuvent valider les actions de sang
VALIDATION_ROLES = [ROLE_FONDATEUR, ROLE_MJ_VAMPIRE]

# Rôle à mentionner pour les nouvelles demandes de validation
MENTION_ROLE_VALIDATION = ROLE_MJ_VAMPIRE


# === SALONS ===

# Salon de validation des actions de Puissance du Sang
VALIDATION_CHANNEL_ID = 1454182154270670848


# === GOOGLE SHEETS API ===

# URL de l'API Google Apps Script (doit correspondre à celle du site web)
GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec"
