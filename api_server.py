"""
API Server pour l'interface web
Expose les endpoints pour la gestion des goules (web-only, pas de commandes Discord)
"""

import json
import logging
import os
from typing import Optional

from aiohttp import web
from aiohttp.web import middleware
from dotenv import load_dotenv

from utils.database import (
    create_ghoul,
    delete_ghoul,
    get_ghouls,
    get_max_ghouls,
    get_ghoul_count,
    get_vampire_data,
    update_ghoul,
)

load_dotenv()
logger = logging.getLogger(__name__)

# Configuration CORS
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://zaaees.github.io",
]


@middleware
async def cors_middleware(request, handler):
    """Middleware CORS pour autoriser les requêtes depuis le frontend."""
    # Gérer les requêtes OPTIONS (preflight)
    if request.method == "OPTIONS":
        response = web.Response()
    else:
        response = await handler(request)

    # Ajouter les headers CORS
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"

    return response


async def verify_vampire_auth(request) -> Optional[tuple]:
    """
    Vérifie l'authentification du vampire via l'ID Discord.
    Retourne (user_id, guild_id) ou None si non authentifié.
    """
    # Récupérer l'ID utilisateur depuis les headers
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


# --- ENDPOINTS GOULES ---


async def get_ghouls_handler(request):
    """GET /api/ghouls - Récupérer les goules du vampire."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        # Vérifier que l'utilisateur est un vampire
        vampire_data = await get_vampire_data(user_id, guild_id)
        if not vampire_data or not vampire_data.get("clan"):
            return web.json_response(
                {"success": False, "error": "Vous devez être un vampire"},
                status=403,
            )

        # Récupérer les goules
        ghouls = await get_ghouls(user_id, guild_id)
        max_ghouls = await get_max_ghouls(user_id, guild_id)
        current_count = await get_ghoul_count(user_id, guild_id)

        return web.json_response(
            {
                "success": True,
                "ghouls": ghouls,
                "blood_potency": vampire_data.get("blood_potency", 1),
                "max_ghouls": max_ghouls,
                "current_count": current_count,
            }
        )

    except Exception as e:
        logger.error(f"Erreur get_ghouls: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


async def create_ghoul_handler(request):
    """POST /api/ghouls - Créer une nouvelle goule."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        # Parser le corps de la requête
        data = await request.json()
        name = data.get("name", "").strip()
        description = data.get("description", "").strip()
        role = data.get("role", "").strip()

        if not name:
            return web.json_response(
                {"success": False, "error": "Le nom est requis"}, status=400
            )

        # Vérifier que l'utilisateur est un vampire
        vampire_data = await get_vampire_data(user_id, guild_id)
        if not vampire_data or not vampire_data.get("clan"):
            return web.json_response(
                {"success": False, "error": "Vous devez être un vampire"},
                status=403,
            )

        clan = vampire_data.get("clan")

        # Créer la goule
        result = await create_ghoul(
            user_id, guild_id, name, description or None, role or None
        )

        if result["success"]:
            return web.json_response(result, status=201)
        else:
            return web.json_response(result, status=400)

    except json.JSONDecodeError:
        return web.json_response(
            {"success": False, "error": "JSON invalide"}, status=400
        )
    except Exception as e:
        logger.error(f"Erreur create_ghoul: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


async def update_ghoul_handler(request):
    """PUT /api/ghouls/{ghoul_id} - Mettre à jour une goule."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth
    ghoul_id = request.match_info.get("ghoul_id")

    try:
        # Parser le corps de la requête
        data = await request.json()

        # Mettre à jour la goule
        result = await update_ghoul(
            ghoul_id,
            user_id,
            guild_id,
            name=data.get("name"),
            description=data.get("description"),
            role=data.get("role"),
            notes=data.get("notes"),
            status=data.get("status"),
        )

        if result["success"]:
            return web.json_response(result)
        else:
            return web.json_response(result, status=404)

    except json.JSONDecodeError:
        return web.json_response(
            {"success": False, "error": "JSON invalide"}, status=400
        )
    except Exception as e:
        logger.error(f"Erreur update_ghoul: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


async def delete_ghoul_handler(request):
    """DELETE /api/ghouls/{ghoul_id} - Supprimer/libérer une goule."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth
    ghoul_id = request.match_info.get("ghoul_id")

    try:
        # Supprimer la goule
        result = await delete_ghoul(ghoul_id, user_id, guild_id)

        if result["success"]:
            return web.json_response(result)
        else:
            return web.json_response(result, status=404)

    except Exception as e:
        logger.error(f"Erreur delete_ghoul: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


# --- MEMBER INFO ---


async def get_member_info_handler(request):
    """GET /api/member - Récupérer les infos du membre sur le serveur."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        # Récupérer le bot depuis l'app
        bot = request.app.get("bot")
        if not bot:
            return web.json_response(
                {"success": False, "error": "Bot non disponible"}, status=500
            )

        # Récupérer la guild et le membre
        guild = bot.get_guild(guild_id)
        if not guild:
            return web.json_response(
                {"success": False, "error": "Serveur non trouvé"}, status=404
            )

        member = guild.get_member(user_id)
        if not member:
            # Tenter de fetch si pas en cache
            try:
                member = await guild.fetch_member(user_id)
            except Exception:
                return web.json_response(
                    {"success": False, "error": "Membre non trouvé"}, status=404
                )

        # Construire les infos du membre
        member_info = {
            "success": True,
            "display_name": member.display_name,  # Nom sur le serveur
            "username": str(member),  # Username global
            "avatar_url": member.display_avatar.url,  # Avatar (serveur ou global)
            "guild_name": guild.name,
        }

        return web.json_response(member_info)

    except Exception as e:
        logger.error(f"Erreur get_member_info: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


# --- HEALTH CHECK ---


async def health_check(request):
    """GET /health - Vérifier que l'API fonctionne."""
    return web.json_response({"status": "ok"})


# --- SETUP ---


def create_app(bot=None):
    """Créer l'application aiohttp."""
    app = web.Application(middlewares=[cors_middleware])

    # Stocker le bot pour y accéder dans les handlers
    if bot:
        app["bot"] = bot

    # Routes
    app.router.add_get("/health", health_check)
    app.router.add_get("/api/member", get_member_info_handler)
    app.router.add_get("/api/ghouls", get_ghouls_handler)
    app.router.add_post("/api/ghouls", create_ghoul_handler)
    app.router.add_put("/api/ghouls/{ghoul_id}", update_ghoul_handler)
    app.router.add_delete("/api/ghouls/{ghoul_id}", delete_ghoul_handler)

    return app


async def start_api_server(port: int = 8080, bot=None):
    """Démarrer le serveur API."""
    app = create_app(bot=bot)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
    logger.info(f"API Server démarré sur le port {port}")
    return runner
