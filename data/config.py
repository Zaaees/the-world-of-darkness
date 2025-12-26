"""
Configuration des rôles et salons pour le bot World of Darkness.
"""

# === RÔLES ===

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
