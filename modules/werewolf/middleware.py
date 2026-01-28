"""
Middleware de vérification de rôle Discord pour le module Werewolf.
Vérifie que l'utilisateur possède le rôle Werewolf avant d'accéder aux routes protégées.
"""

import logging
from functools import wraps
from typing import Callable, Optional, Tuple

from aiohttp import web

from data.config import ROLE_LOUP_GAROU, ROLE_MJ_WEREWOLF

logger = logging.getLogger(__name__)

# Alias pour clarté dans le contexte Werewolf
WEREWOLF_ROLE_ID = ROLE_LOUP_GAROU


async def verify_werewolf_auth(request: web.Request) -> Optional[Tuple[int, int]]:
    """
    Vérifie l'authentification de l'utilisateur via les headers Discord.
    Retourne (user_id, guild_id) ou None si non authentifié.
    """
    user_id = request.headers.get("X-Discord-User-ID")
    guild_id = request.headers.get("X-Discord-Guild-ID")

    if not user_id or not guild_id:
        return None

    try:
        user_id = int(user_id)
        guild_id = int(guild_id)
        return (user_id, guild_id)
    except ValueError:
        return None


async def has_werewolf_role(request: web.Request, user_id: int, guild_id: int) -> bool:
    """
    Vérifie si l'utilisateur possède le rôle Werewolf sur le serveur Discord.
    
    Args:
        request: La requête aiohttp (contient le bot via request.app)
        user_id: L'ID Discord de l'utilisateur
        guild_id: L'ID du serveur Discord
        
    Returns:
        True si l'utilisateur a le rôle Werewolf, False sinon
    """
    bot = request.app.get("bot")
    if not bot:
        logger.error("Bot non disponible pour la vérification de rôle")
        return False

    guild = bot.get_guild(guild_id)
    if not guild:
        logger.warning(f"Serveur {guild_id} non trouvé")
        return False

    member = guild.get_member(user_id)
    if not member:
        # Tenter de fetch si pas en cache
        try:
            member = await guild.fetch_member(user_id)
        except Exception as e:
            logger.warning(f"Membre {user_id} non trouvé: {e}")
            return False

    # Vérifier si le membre a le rôle Werewolf
    role_ids = [role.id for role in member.roles]
    has_role = WEREWOLF_ROLE_ID in role_ids
    
    if has_role:
        logger.debug(f"Utilisateur {user_id} a le rôle Werewolf")
    else:
        logger.debug(f"Utilisateur {user_id} n'a PAS le rôle Werewolf")
    
    return has_role


def require_werewolf_role(handler: Callable) -> Callable:
    """
    Décorateur pour protéger les routes du module Werewolf.
    Vérifie que l'utilisateur est authentifié ET possède le rôle Werewolf.
    
    Retourne une erreur 401 si non authentifié.
    Retourne une erreur 403 avec le message "Vous n'entendez pas l'appel de Gaïa" si le rôle est absent.
    
    Usage:
        @require_werewolf_role
        async def my_handler(request):
            # L'utilisateur a le rôle Werewolf, traiter la requête
            ...
    """
    @wraps(handler)
    async def wrapper(request: web.Request) -> web.Response:
        # Étape 1: Vérifier l'authentification
        auth = await verify_werewolf_auth(request)
        if not auth:
            return web.json_response(
                {"error": "Non authentifié", "code": 401},
                status=401
            )
        
        user_id, guild_id = auth
        
        # Étape 2: Vérifier le rôle Werewolf
        if not await has_werewolf_role(request, user_id, guild_id):
            logger.info(f"Accès refusé à {user_id}: rôle Werewolf manquant")
            return web.json_response(
                {"error": "Vous n'entendez pas l'appel de Gaïa", "code": 403},
                status=403
            )
        
        # L'utilisateur est autorisé, continuer vers le handler
        return await handler(request)
    
    return wrapper


async def has_mj_role(request: web.Request, user_id: int, guild_id: int) -> bool:
    """
    Vérifie si l'utilisateur possède le rôle MJ Werewolf sur le serveur Discord.
    """
    bot = request.app.get("bot")
    if not bot:
        return False

    guild = bot.get_guild(guild_id)
    if not guild:
        return False

    member = guild.get_member(user_id)
    if not member:
        try:
            member = await guild.fetch_member(user_id)
        except Exception:
            return False

    role_ids = [role.id for role in member.roles]
    return ROLE_MJ_WEREWOLF in role_ids


def require_mj_role(handler: Callable) -> Callable:
    """
    Décorateur pour protéger les routes d'administration du module Werewolf.
    """
    @wraps(handler)
    async def wrapper(request: web.Request) -> web.Response:
        auth = await verify_werewolf_auth(request)
        if not auth:
            return web.json_response(
                {"error": "Non authentifié", "code": 401},
                status=401
            )
        
        user_id, guild_id = auth
        
        if not await has_mj_role(request, user_id, guild_id):
            logger.info(f"Accès refusé à {user_id}: rôle MJ Werewolf manquant")
            return web.json_response(
                {"error": "Vous n'avez pas les droits de Conteur", "code": 403},
                status=403
            )
        
        return await handler(request)
    
    return wrapper
