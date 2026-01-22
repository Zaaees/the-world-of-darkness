"""
Routes API pour le module Werewolf.
Toutes les routes sont protégées par le middleware de vérification de rôle Discord.
"""

import logging
from aiohttp import web

from .middleware import require_werewolf_role
import aiosqlite
from utils.database import DATABASE_PATH
from .services.character_service import create_character

logger = logging.getLogger(__name__)


@require_werewolf_role
async def werewolf_health_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/health - Vérifier l'accès au module Werewolf.
    Cette route est protégée et ne fonctionne que pour les utilisateurs avec le rôle Werewolf.
    """
    return web.json_response({
        "success": True,
        "message": "Bienvenue, Garou. L'appel de Gaïa résonne en vous.",
        "module": "werewolf"
    })


@require_werewolf_role
async def create_character_handler(request: web.Request) -> web.Response:
    """
    POST /api/modules/werewolf/character - Créer une fiche de personnage.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "Missing X-Discord-User-ID header"}, status=400)
    
    # Store as string to match DB model (TEXT)
    user_id = str(user_id_raw)
    
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON"}, status=400)
    
    # Inject user_id
    data['user_id'] = user_id
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            bot = request.app.get("bot")
            character = await create_character(db, data, bot=bot)
            
            return web.json_response({
                "success": True,
                "message": f"Bienvenue dans la Meute, {character.name} !",
                "redirect": "/werewolf/sheet",
                "character": {
                    "name": character.name,
                    "breed": character.breed.value if hasattr(character.breed, 'value') else character.breed,
                    "auspice": character.auspice.value if hasattr(character.auspice, 'value') else character.auspice,
                    "tribe": character.tribe.value if hasattr(character.tribe, 'value') else character.tribe,
                }
            }, status=201)
            
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)
    except Exception as e:
        logger.exception(f"Error creating character for user {user_id}")
        return web.json_response({"error": "Failed to create character"}, status=500)


def register_werewolf_routes(app: web.Application) -> None:
    """
    Enregistre toutes les routes du module Werewolf sur l'application.
    Les routes sont montées sur /api/modules/werewolf/*.
    
    Args:
        app: L'application aiohttp
    """
    # Route de santé pour vérifier l'accès au module
    app.router.add_get("/api/modules/werewolf/health", werewolf_health_handler)
    
    # Création de personnage
    app.router.add_post("/api/modules/werewolf/character", create_character_handler)
    
    logger.info("Routes Werewolf enregistrées sur /api/modules/werewolf/*")
