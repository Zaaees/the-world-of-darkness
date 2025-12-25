"""
Utilitaires pour vérifier si un canal est dans une catégorie RP.
"""

import discord


def is_rp_channel(channel: discord.TextChannel) -> bool:
    """
    Vérifie si un canal est dans une catégorie RP.

    Un canal est considéré comme RP si sa catégorie contient "[RP]" dans son nom.

    Args:
        channel: Le canal à vérifier

    Returns:
        True si le canal est dans une catégorie RP, False sinon
    """
    if not isinstance(channel, discord.TextChannel):
        return False

    if channel.category is None:
        return False

    return "[RP]" in channel.category.name.upper()


async def delete_command_message(message: discord.Message) -> bool:
    """
    Supprime un message de commande de manière sécurisée.

    Args:
        message: Le message à supprimer

    Returns:
        True si la suppression a réussi, False sinon
    """
    try:
        await message.delete()
        return True
    except discord.Forbidden:
        # Le bot n'a pas la permission de supprimer
        return False
    except discord.NotFound:
        # Le message a déjà été supprimé
        return True
    except discord.HTTPException:
        # Erreur réseau
        return False
