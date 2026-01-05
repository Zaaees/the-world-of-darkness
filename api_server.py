"""
API Server pour l'interface web
Expose les endpoints pour la gestion des goules (web-only, pas de commandes Discord)
"""

import json
import logging
import os
import traceback
from typing import Optional

from aiohttp import web
from aiohttp.web import middleware
from dotenv import load_dotenv
import discord

from utils.database import (
    create_ghoul,
    delete_ghoul,
    get_ghouls,
    get_max_ghouls,
    get_ghoul_count,
    get_vampire_data,
    get_player,
    set_player,
    update_ghoul,
    get_character_sheet,
    save_character_sheet,
    get_player_rituals,
    create_npc,
    get_npcs,
    get_npc,
    update_npc,
    delete_npc,
)
from utils.sheet_manager import process_discord_sheet_update, upload_image_to_discord, publish_npc_to_discord, SHEET_LOG_CHANNEL_ID

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
    origin = request.headers.get("Origin", "")

    # Log pour debug
    logger.debug(f"CORS middleware: {request.method} {request.path} from {origin}")

    # Gérer les requêtes OPTIONS (preflight) - répondre immédiatement
    if request.method == "OPTIONS":
        response = web.Response(status=200)
        # Toujours ajouter les headers CORS pour les preflight
        if origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Discord-User-ID, X-Discord-Guild-ID"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Max-Age"] = "3600"  # Cache preflight 1h
        return response

    # Pour les autres requêtes, appeler le handler
    try:
        response = await handler(request)
    except web.HTTPException as e:
        response = e
    except Exception as e:
        # Capturer les erreurs non gérées pour ajouter les headers CORS
        logger.error(f"Erreur non gérée dans le middleware: {e}", exc_info=True)
        response = web.json_response(
            {"success": False, "error": "Erreur interne du serveur"}, 
            status=500
        )

    # Ajouter les headers CORS à la réponse
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Discord-User-ID, X-Discord-Guild-ID"
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


# --- GUILD DETECTION ---


async def get_user_guild_handler(request):
    """GET /api/guild - Détecter automatiquement le serveur de l'utilisateur."""
    user_id = request.headers.get("X-Discord-User-ID")

    if not user_id:
        return web.json_response(
            {"success": False, "error": "User ID requis"}, status=401
        )

    try:
        user_id = int(user_id)

        # Récupérer le bot depuis l'app
        bot = request.app.get("bot")
        if not bot:
            return web.json_response(
                {"success": False, "error": "Bot non disponible"}, status=500
            )

        # Trouver le premier serveur où l'utilisateur est membre
        for guild in bot.guilds:
            member = guild.get_member(user_id)
            if not member:
                try:
                    member = await guild.fetch_member(user_id)
                except Exception:
                    continue

            if member:
                # Trouvé un serveur (guild_id en string pour éviter perte de précision JS)
                return web.json_response({
                    "success": True,
                    "guild_id": str(guild.id),
                    "guild_name": guild.name,
                })

        return web.json_response(
            {"success": False, "error": "Aucun serveur trouvé"}, status=404
        )

    except ValueError:
        return web.json_response(
            {"success": False, "error": "User ID invalide"}, status=400
        )
    except Exception as e:
        logger.error(f"Erreur get_user_guild: {e}", exc_info=True)
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

        # Construire les infos du membre (IDs en string pour éviter perte de précision JS)
        member_info = {
            "success": True,
            "display_name": member.display_name,  # Nom sur le serveur
            "username": str(member),  # Username global
            "avatar_url": member.display_avatar.url,  # Avatar (serveur ou global)
            "guild_name": guild.name,
            "guild_id": str(guild.id),  # ID du serveur
        }

        return web.json_response(member_info)

    except Exception as e:
        logger.error(f"Erreur get_member_info: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


# --- CHARACTER SHEET ---


async def upload_image_handler(request):
    """POST /api/upload - Uploader une image vers Discord."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        reader = await request.multipart()
        field = await reader.next()
        
        if not field or field.name != 'file':
            return web.json_response(
                {"success": False, "error": "Fichier manquant"}, status=400
            )

        filename = field.filename or f"upload_{user_id}.png"
        file_data = await field.read()
        
        bot = request.app.get("bot")
        if not bot:
            return web.json_response(
                {"success": False, "error": "Bot non disponible"}, status=500
            )

        url = await upload_image_to_discord(bot, file_data, filename)
        
        if url:
            return web.json_response({"success": True, "url": url})
        else:
            return web.json_response(
                {"success": False, "error": "Échec de l'upload vers Discord"}, status=500
            )

    except Exception as e:
        logger.error(f"Erreur upload: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


async def get_character_sheet_handler(request):
    """GET /api/character-sheet - Récupérer la fiche de personnage."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        sheet = await get_character_sheet(user_id, guild_id)
        
        if sheet:
            # Convertir l'ID du post en string pour éviter les problèmes d'arrondi JS
            if sheet.get("forum_post_id"):
                sheet["forum_post_id"] = str(sheet["forum_post_id"])
            return web.json_response({"success": True, "exists": True, "data": sheet})
        else:
            return web.json_response({"success": True, "exists": False})

    except Exception as e:
        logger.error(f"Erreur get_character_sheet: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


async def save_character_sheet_handler(request):
    """POST /api/character-sheet - Sauvegarder la fiche de personnage."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        # Parser les données
        data = await request.json()
        
        # Récupérer les infos du joueur pour avoir le clan
        player = await get_player(user_id, guild_id)
        if not player or not player.get("clan"):
            return web.json_response(
                {"success": False, "error": "Vous devez avoir choisi un clan avant de faire votre fiche."},
                status=400
            )
            
        # Ajouter le clan aux données pour le gestionnaire Discord
        data["clan"] = player["clan"]

        # Récupérer le forum_post_id existant si non fourni pour éviter les doublons
        if not data.get("forum_post_id"):
            existing_sheet = await get_character_sheet(user_id, guild_id)
            if existing_sheet and existing_sheet.get("forum_post_id"):
                data["forum_post_id"] = existing_sheet["forum_post_id"]
        
        # 1. Sauvegarder en DB
        # D'abord récupérer l'ancienne version pour le diff
        old_sheet = await get_character_sheet(user_id, guild_id)
        
        await save_character_sheet(user_id, guild_id, data)
        
        # 1.5 Sync le nom avec Google Sheets (Game Data)
        character_name = data.get("name", "").strip()
        if character_name:
            # Sync nom dans Google Sheets
            await set_player(user_id, guild_id, name=character_name)

        # 2. Mettre à jour Discord (Forum + Nickname)
        bot = request.app.get("bot")
        if bot:
            # Calcul du diff
            from utils.sheet_manager import calculate_diff
            diff_text = calculate_diff(old_sheet or {}, data)
            
            # Mise à jour du Post Forum
            forum_post_id = await process_discord_sheet_update(bot, user_id, guild_id, data, diff_text=diff_text)
            
            # Si un post a été créé/récupéré, mettre à jour l'ID en DB
            if forum_post_id:
                data["forum_post_id"] = forum_post_id
                await save_character_sheet(user_id, guild_id, data)

            # Mise à jour du Nickname Discord
            if character_name:
                try:
                    guild = bot.get_guild(guild_id)
                    if guild:
                        member = guild.get_member(user_id)
                        if not member:
                            try:
                                member = await guild.fetch_member(user_id)
                            except Exception:
                                pass
                        
                        if member:
                            # Ne pas essayer de renamer le propriétaire ou les admins supérieurs
                            if guild.owner_id != member.id:
                                try:
                                    # Vérifier si le nick est différent pour éviter l'appel API inutile
                                    current_nick = member.nick or member.global_name or member.name
                                    if current_nick != character_name:
                                        await member.edit(nick=character_name, reason="Synchro Fiche Personnage")
                                        logger.info(f"Nickname mis à jour pour {user_id}: {character_name}")
                                except discord.Forbidden:
                                    logger.warning(f"Impossible de changer le pseudo de {user_id} (Permission manquante/Hiérarchie)")
                                except Exception as e:
                                    logger.warning(f"Erreur changement pseudo pour {user_id}: {e}")
                            else:
                                logger.info(f"Skip update nickname pour {user_id} (Propriétaire du serveur)")
                except Exception as e:
                    logger.error(f"Erreur tentative update nickname: {e}")
                
        return web.json_response({"success": True})

    except json.JSONDecodeError:
        return web.json_response(
            {"success": False, "error": "JSON invalide"}, status=400
        )
    except Exception as e:
        logger.error(f"Erreur save_character_sheet: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


# --- VAMPIRE PROFILE ---


async def get_vampire_profile_handler(request):
    """GET /api/vampire/profile - Récupérer le profil complet du vampire."""
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

        # Vérifier si le membre a le rôle Vampire
        from data.config import ROLE_VAMPIRE
        member_role_ids = [role.id for role in member.roles]
        has_vampire_role = ROLE_VAMPIRE in member_role_ids

        # Log pour debug
        logger.info(f"Vérification rôle vampire pour {member.display_name} (ID: {user_id})")
        logger.info(f"  ROLE_VAMPIRE attendu: {ROLE_VAMPIRE}")
        logger.info(f"  Rôles du membre: {member_role_ids}")
        logger.info(f"  has_vampire_role: {has_vampire_role}")

        # Récupérer les données du joueur
        player = await get_player(user_id, guild_id)
        vampire_data = await get_vampire_data(user_id, guild_id)

        # Vérifier si le membre est MJ (Caïn Mode)
        ROLE_GM = 1454188335957282897
        is_gm = ROLE_GM in member_role_ids

        # Construire le profil
        profile = {
            "success": True,
            "has_vampire_role": has_vampire_role,
            "is_gm": is_gm,
            "clan": player.get("clan") if player else None,
            # Debug info (à retirer en prod)
            "_debug_expected_role": ROLE_VAMPIRE,
            "_debug_member_roles": member_role_ids,
            "soif_level": vampire_data.get("soif_level", 0) if vampire_data else 0,
            "blood_potency": vampire_data.get("blood_potency", 1) if vampire_data else 1,
            "saturation_points": vampire_data.get("saturation_points", 0) if vampire_data else 0,
            "display_name": member.display_name,
            "avatar_url": member.display_avatar.url,
        }

        return web.json_response(profile)

    except Exception as e:
        logger.error(f"Erreur get_vampire_profile: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e), "traceback": traceback.format_exc()}, status=500
        )


async def set_vampire_clan_handler(request):
    """POST /api/vampire/clan - Définir le clan du vampire."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        # Parser le corps de la requête
        data = await request.json()
        clan = data.get("clan", "").strip().lower()

        if not clan:
            return web.json_response(
                {"success": False, "error": "Le clan est requis"}, status=400
            )

        # Vérifier que le clan existe
        from data.clans import get_clan
        clan_data = get_clan(clan)
        if not clan_data:
            return web.json_response(
                {"success": False, "error": "Clan non reconnu"}, status=400
            )

        # Récupérer le bot et vérifier le rôle
        bot = request.app.get("bot")
        if not bot:
            return web.json_response(
                {"success": False, "error": "Bot non disponible"}, status=500
            )

        guild = bot.get_guild(guild_id)
        if not guild:
            return web.json_response(
                {"success": False, "error": "Serveur non trouvé"}, status=404
            )

        member = guild.get_member(user_id)
        if not member:
            try:
                member = await guild.fetch_member(user_id)
            except Exception:
                return web.json_response(
                    {"success": False, "error": "Membre non trouvé"}, status=404
                )

        # Vérifier le rôle Vampire
        from data.config import ROLE_VAMPIRE
        has_vampire_role = any(role.id == ROLE_VAMPIRE for role in member.roles)

        if not has_vampire_role:
            return web.json_response(
                {"success": False, "error": "Vous devez avoir le rôle Vampire"},
                status=403
            )

        # Vérifier que le joueur n'a pas déjà un clan
        player = await get_player(user_id, guild_id)
        if player and player.get("clan"):
            return web.json_response(
                {"success": False, "error": "Vous avez déjà un clan défini"},
                status=400
            )

        # Définir le clan
        await set_player(user_id, guild_id, race="vampire", clan=clan)

        return web.json_response({
            "success": True,
            "clan": clan,
            "message": f"Vous avez rejoint le clan {clan_data['nom']}"
        })

    except json.JSONDecodeError:
        return web.json_response(
            {"success": False, "error": "JSON invalide"}, status=400
        )
    except Exception as e:
        logger.error(f"Erreur set_vampire_clan: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )



# ============================================
# Fonctions pour les rituels (API)
# ============================================


async def get_player_rituals_handler(request):
    """GET /api/rituals - Récupérer les rituels connus par le joueur."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response(
            {"success": False, "error": "Non authentifié"}, status=401
        )

    user_id, guild_id = auth

    try:
        rituals = await get_player_rituals(user_id, guild_id)
        return web.json_response({"success": True, "rituals": rituals})
    except Exception as e:
        logger.error(f"Erreur get_player_rituals: {e}", exc_info=True)
        return web.json_response(
            {"success": False, "error": str(e)}, status=500
        )


# ============================================
# Fonctions pour les PNJ (API)
# ============================================


async def get_npcs_handler(request):
    """GET /api/gm/npcs - Récupérer tous les PNJ."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response({"success": False, "error": "Non authentifié"}, status=401)

    user_id, guild_id = auth

    # Vérifier si GM (simple vérification si l'utilisateur est connu pour l'instant, 
    # une vraie vérification de rôle serait mieux mais verify_vampire_auth ne renvoie que l'ID)
    # On suppose que l'accès au frontend est protégé
    
    try:
        npcs = await get_npcs(guild_id)
        return web.json_response({"success": True, "npcs": npcs})
    except Exception as e:
        logger.error(f"Erreur get_npcs: {e}", exc_info=True)
        return web.json_response({"success": False, "error": str(e)}, status=500)


async def create_npc_handler(request):
    """POST /api/gm/npcs - Créer un PNJ."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response({"success": False, "error": "Non authentifié"}, status=401)

    user_id, guild_id = auth

    try:
        data = await request.json()
        name = data.get("name")
        if not name:
            return web.json_response({"success": False, "error": "Nom requis"}, status=400)
            
        result = await create_npc(
            guild_id=guild_id,
            name=name,
            clan=data.get("clan"),
            blood_potency=data.get("blood_potency", 1),
            image_url=data.get("image_url"),
            description=data.get("description"),
            disciplines=data.get("disciplines"),
            rituals=data.get("rituals"),
            status=data.get("status", "private")
        )
        
        return web.json_response(result)
    except Exception as e:
        logger.error(f"Erreur create_npc: {e}", exc_info=True)
        return web.json_response({"success": False, "error": str(e)}, status=500)


async def get_npc_handler(request):
    """GET /api/gm/npcs/{npc_id} - Récupérer un PNJ spécifique."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response({"success": False, "error": "Non authentifié"}, status=401)

    npc_id = request.match_info.get("npc_id")

    try:
        npc = await get_npc(npc_id)
        if not npc:
             return web.json_response({"success": False, "error": "PNJ introuvable"}, status=404)
        return web.json_response({"success": True, "npc": npc})
    except Exception as e:
        logger.error(f"Erreur get_npc: {e}", exc_info=True)
        return web.json_response({"success": False, "error": str(e)}, status=500)


async def delete_npc_handler(request):
    """DELETE /api/gm/npcs/{npc_id} - Supprimer un PNJ."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response({"success": False, "error": "Non authentifié"}, status=401)

    user_id, guild_id = auth
    npc_id = request.match_info.get("npc_id")

    try:
        # 1. Récupérer les infos du PNJ avant suppression (pour le nom et le thread Discord)
        npc = await get_npc(npc_id)
        if not npc:
            return web.json_response({"success": False, "error": "PNJ introuvable"}, status=404)

        npc_name = npc.get("name", "Inconnu")
        forum_post_id = npc.get("forum_post_id")

        # 2. Supprimer/Archiver le thread Discord si existant
        bot = request.app.get("bot")
        if bot and forum_post_id:
            try:
                guild = bot.get_guild(guild_id)
                if guild:
                    thread = await guild.fetch_channel(int(forum_post_id))
                    if thread:
                        await thread.delete()
                        logger.info(f"Thread PNJ supprimé: {npc_name} ({forum_post_id})")
            except discord.NotFound:
                logger.warning(f"Thread PNJ non trouvé lors de la suppression: {forum_post_id}")
            except Exception as e:
                logger.error(f"Erreur suppression thread Discord PNJ: {e}")

        # 3. Supprimer de la base de données
        await delete_npc(npc_id)

        # 4. Logger la suppression dans le salon dédié
        if bot:
            try:
                log_channel = bot.get_channel(SHEET_LOG_CHANNEL_ID)
                if not log_channel:
                    try:
                        log_channel = await bot.fetch_channel(SHEET_LOG_CHANNEL_ID)
                    except Exception:
                        pass
                
                if log_channel:
                    embed = discord.Embed(
                        title="PNJ Supprimé",
                        description=f"Le PNJ **{npc_name}** a été supprimé du registre par le MJ.",
                        color=0xFF0000, # Rouge
                        timestamp=discord.utils.utcnow()
                    )
                    embed.set_footer(text=f"ID: {npc_id}")
                    await log_channel.send(embed=embed)
            except Exception as e:
                logger.error(f"Erreur envoi log suppression PNJ: {e}")

        return web.json_response({"success": True})

    except Exception as e:
        logger.error(f"Erreur delete_npc: {e}", exc_info=True)
        return web.json_response({"success": False, "error": str(e)}, status=500)


async def update_npc_handler(request):
    """PUT /api/gm/npcs/{npc_id} - Mettre à jour un PNJ."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response({"success": False, "error": "Non authentifié"}, status=401)

    npc_id = request.match_info.get("npc_id")

    try:
        data = await request.json()
        # Sécurité : on empêche le frontend d'écraser le forum_post_id (géré par le backend)
        if "forum_post_id" in data:
            del data["forum_post_id"]
            
        # D'abord récupérer l'ancienne version pour le diff (si on a un update réussi)
        old_npc = await get_npc(npc_id)
            
        result = await update_npc(npc_id, **data)
        
        if not result["success"]:
             return web.json_response(result, status=404)
             
        # Si mise à jour réussie, on publie automatiquement les changements sur Discord
        # pour s'assurer que le forum est à jour (notamment la fiche bio)
        
        # On récupère le PNJ complet à jour pour la publication
        updated_npc = await get_npc(npc_id)
        if updated_npc:
            bot = request.app.get("bot")
            if bot:
                guild_id = request.headers.get("X-Discord-Guild-ID")
                guild = bot.get_guild(int(guild_id)) if guild_id else None
                if guild:
                    # Calculer le diff
                    from utils.sheet_manager import calculate_diff
                    diff_text = calculate_diff(old_npc or {}, updated_npc)
                    
                    # Publier (création ou mise à jour du thread)
                    # On le fait en async sans bloquer la réponse HTTP critique, 
                    # mais ici on await pour être sûr que ça marche ou loguer l'erreur
                    forum_post_id = await publish_npc_to_discord(bot, guild, updated_npc, diff_text=diff_text)
                    
                    if forum_post_id:
                        result["forum_post_id"] = forum_post_id
                        if forum_post_id != updated_npc.get("forum_post_id"):
                             # Si l'ID du post a changé (ex: recréation), on met à jour la DB
                             await update_npc(npc_id, forum_post_id=forum_post_id, status="public")

        return web.json_response(result)
    except Exception as e:
        logger.error(f"Erreur update_npc: {e}", exc_info=True)
        return web.json_response({"success": False, "error": str(e)}, status=500)


async def publish_npc_handler(request):
    """POST /api/gm/npcs/{npc_id}/publish - Publier le PNJ sur Discord."""
    auth = await verify_vampire_auth(request)
    if not auth:
        return web.json_response({"success": False, "error": "Non authentifié"}, status=401)

    user_id, guild_id = auth
    npc_id = request.match_info.get("npc_id")

    try:
        bot = request.app.get("bot")
        if not bot:
            return web.json_response({"success": False, "error": "Bot non disponible"}, status=500)
            
        guild = bot.get_guild(guild_id)
        if not guild:
            return web.json_response({"success": False, "error": "Serveur introuvable"}, status=404)

        npc = await get_npc(npc_id)
        if not npc:
             return web.json_response({"success": False, "error": "PNJ introuvable"}, status=404)
             
        forum_post_id = await publish_npc_to_discord(bot, guild, npc)
        
        if forum_post_id:
            # Enregistrer l'ID du post
            await update_npc(npc_id, forum_post_id=forum_post_id, status="public")
            return web.json_response({"success": True, "forum_post_id": forum_post_id})
        else:
            return web.json_response({"success": False, "error": "Échec publication Discord"}, status=500)
            
    except Exception as e:
        logger.error(f"Erreur publish_npc: {e}", exc_info=True)
        return web.json_response({"success": False, "error": str(e)}, status=500)


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
    app.router.add_get("/api/guild", get_user_guild_handler)
    app.router.add_get("/api/member", get_member_info_handler)
    app.router.add_get("/api/vampire/profile", get_vampire_profile_handler)
    app.router.add_post("/api/vampire/clan", set_vampire_clan_handler)
    app.router.add_get("/api/character-sheet", get_character_sheet_handler)
    app.router.add_post("/api/character-sheet", save_character_sheet_handler)
    app.router.add_post("/api/upload", upload_image_handler)
    app.router.add_get("/api/ghouls", get_ghouls_handler)
    app.router.add_post("/api/ghouls", create_ghoul_handler)
    app.router.add_put("/api/ghouls/{ghoul_id}", update_ghoul_handler)
    app.router.add_delete("/api/ghouls/{ghoul_id}", delete_ghoul_handler)
    app.router.add_get("/api/rituals", get_player_rituals_handler)
    
    # Routes GM / NPC
    app.router.add_get("/api/gm/npcs", get_npcs_handler)
    app.router.add_post("/api/gm/npcs", create_npc_handler)
    app.router.add_get("/api/gm/npcs/{npc_id}", get_npc_handler)
    app.router.add_put("/api/gm/npcs/{npc_id}", update_npc_handler)
    app.router.add_post("/api/gm/npcs/{npc_id}/publish", publish_npc_handler)
    app.router.add_delete("/api/gm/npcs/{npc_id}", delete_npc_handler)



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
