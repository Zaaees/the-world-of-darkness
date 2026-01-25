"""
Routes API pour le module Werewolf.
Toutes les routes sont protégées par le middleware de vérification de rôle Discord.
"""

import logging
from aiohttp import web

from .middleware import require_werewolf_role
import aiosqlite
from utils.database import DATABASE_PATH
from .services.character_service import create_character, get_character, update_character
from .services.sheet import sync_sheet_to_discord
from .services.audit import log_character_update, calculate_diff
import asyncio

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


@require_werewolf_role
async def get_character_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/character - Récupérer la fiche du personnage.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "Missing X-Discord-User-ID header"}, status=400)
    
    user_id = str(user_id_raw)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            character = await get_character(db, user_id)
            
            if not character:
                return web.json_response({
                    "success": False,
                    "error": "Character not found",
                    "code": "NO_CHARACTER"
                }, status=404)
            
            return web.json_response({
                "success": True,
                "character": {
                    "name": character.name,
                    "breed": character.breed.value if hasattr(character.breed, 'value') else character.breed,
                    "auspice": character.auspice.value if hasattr(character.auspice, 'value') else character.auspice,
                    "tribe": character.tribe.value if hasattr(character.tribe, 'value') else character.tribe,
                    "story": character.story or "",
                    "rank": character.rank,
                    "discord_thread_id": character.discord_thread_id
                }
            })
            
    except Exception as e:
        logger.exception(f"Error retrieving character for user {user_id}")
        return web.json_response({"error": "Failed to retrieve character"}, status=500)


@require_werewolf_role
async def update_character_handler(request: web.Request) -> web.Response:
    """
    PUT /api/modules/werewolf/character - Mettre à jour la fiche du personnage.
    Pour l'instant, seul le champ 'story' est autorisé à la modification.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "Missing X-Discord-User-ID header"}, status=400)
    
    user_id = str(user_id_raw)
    
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON"}, status=400)
    
    # Validation basique
    allowed_fields = {'story'}
    updates = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not updates:
         return web.json_response({"error": "No valid fields to update"}, status=400)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            # Récupérer l'état AVANT modification pour le diff
            old_character = await get_character(db, user_id)
            
            character = await update_character(db, user_id, updates)
            
            if not character:
                return web.json_response({"error": "Character not found"}, status=404)

            # Audit Logging (Async)
            if old_character:
                changes = calculate_diff(old_character, character)
                if changes:
                    bot = request.app.get("bot")
                    if bot:
                        # Fetch user info for logging (we use a fake user object wrapper or real fetch if needed, 
                        # but audit log expects user object with .display_name and .id)
                        # The route only has user_id. We try to fetch user from bot cache.
                        try:
                            # Discord IDs are int
                            d_user = bot.get_user(int(user_id))
                            if not d_user:
                                # Fallback object if user not in cache/found
                                class MockUser:
                                    def __init__(self, uid):
                                        self.id = uid
                                        self.display_name = f"User {uid}"
                                d_user = MockUser(user_id)
                            
                            asyncio.create_task(log_character_update(bot, d_user, character, changes))
                        except Exception as e:
                            logger.error(f"Failed to schedule audit log: {e}")

            # Trigger Discord Sync
            synced = False
            bot = request.app.get("bot")
            if bot:
                synced = await sync_sheet_to_discord(bot, character)

            return web.json_response({
                "success": True,
                "character": {
                    "name": character.name,
                    "story": character.story,
                    "rank": character.rank
                },
                "synced": synced
            })
            
    except Exception as e:
        logger.exception(f"Error updating character for user {user_id}")
        return web.json_response({"error": "Failed to update character"}, status=500)


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
    
    # Consultation de personnage
    app.router.add_get("/api/modules/werewolf/character", get_character_handler)
    
    # Mise à jour de personnage
    app.router.add_put("/api/modules/werewolf/character", update_character_handler)
    
    logger.info("Routes Werewolf enregistrées sur /api/modules/werewolf/*")
