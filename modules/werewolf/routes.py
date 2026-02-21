"""
Routes API pour le module Werewolf.
Toutes les routes sont protégées par le middleware de vérification de rôle Discord.
"""

import logging
from aiohttp import web

from .middleware import require_werewolf_role, require_mj_role
import aiosqlite
from utils.database import DATABASE_PATH
from .services.character_service import create_character, get_character, update_character
from .services.sheet import sync_sheet_to_discord
from .services.audit import log_character_update, calculate_diff
from .services.gifts import load_gift_catalogue, get_player_gifts, unlock_gift
from modules.werewolf.models.store import get_all_werewolves
from modules.werewolf.models.renown import RenownStatus
from .services.renown import RenownService, RANK_RULES
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
    guild_id_raw = request.headers.get("X-Discord-Guild-ID")
    
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    # Store as string to match DB model (TEXT)
    user_id = str(user_id_raw)
    guild_id = int(guild_id_raw) if guild_id_raw else 0
    
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "JSON invalide"}, status=400)
    
    # Inject user_id and guild_id
    data['user_id'] = user_id
    data['guild_id'] = guild_id

    
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
        return web.json_response({"error": "Échec de la création du personnage"}, status=500)


@require_werewolf_role
async def get_character_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/character - Récupérer la fiche du personnage.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    user_id = str(user_id_raw)
    logger.info(f"[GET_CHARACTER] user_id={user_id}, DATABASE_PATH={DATABASE_PATH}")
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            character = await get_character(db, user_id)
            logger.info(f"[GET_CHARACTER] get_character returned: exists={character is not None}, rank={character.rank if character else 'N/A'}")
            
            if not character:
                return web.json_response({
                    "success": False,
                    "error": "Personnage introuvable",
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
                    "discord_thread_id": character.discord_thread_id,
                    "age": character.age,
                    "sex": character.sex,
                    "physical_desc": character.physical_desc,
                    "mental_desc_pre": character.mental_desc_pre,
                    "first_change": character.first_change,
                    "image_url": character.image_url
                }
            }, headers={"Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache"})
            
    except Exception as e:
        logger.exception(f"Error retrieving character for user {user_id}")
        return web.json_response({"error": "Échec de la récupération du personnage"}, status=500)


@require_werewolf_role
async def update_character_handler(request: web.Request) -> web.Response:
    """
    PUT /api/modules/werewolf/character - Mettre à jour la fiche du personnage.
    Pour l'instant, seul le champ 'story' est autorisé à la modification.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    user_id = str(user_id_raw)
    
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "JSON invalide"}, status=400)
    
    # Validation basique
    allowed_fields = {'name', 'story', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'image_url'}
    updates = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not updates:
         return web.json_response({"error": "Aucun champ valide à mettre à jour"}, status=400)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            # Récupérer l'état AVANT modification pour le diff
            old_character = await get_character(db, user_id)
            if not old_character:
                return web.json_response({"error": "Personnage introuvable"}, status=404)

            # Unicité du nom
            if 'name' in updates and updates['name'] != "Jeune Garou inconnu" and updates['name'].lower() != old_character.name.lower():
                cursor = await db.execute("SELECT user_id FROM werewolf_data WHERE LOWER(name) = ?", (updates['name'].lower(),))
                existing = await cursor.fetchone()
                if existing:
                    return web.json_response({"error": "Ce nom est déjà pris par un autre personnage."}, status=400)
            
            character = await update_character(db, user_id, updates)
            
            # Trigger Discord Post if first complete submit
            if old_character and not old_character.discord_thread_id:
                # Check if all required fields are filled
                req = ['name', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'story']
                is_complete = True
                for field in req:
                    val = getattr(character, field, None)
                    if not val or val == "Jeune Garou inconnu":
                        is_complete = False
                        break
                
                if is_complete:
                    bot = request.app.get("bot")
                    if bot:
                        try:
                            from modules.werewolf.services.discord.forum_service import create_character_thread
                            thread_id = await create_character_thread(bot, character)
                            if thread_id:
                                await update_character(db, user_id, {"discord_thread_id": thread_id})
                                character.discord_thread_id = thread_id
                                logger.info(f"Saved discord thread ID {thread_id} for user {user_id}")
                        except Exception as e:
                            logger.error(f"Failed to publish to Discord for user {user_id}: {e}")

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
                    "rank": character.rank,
                    "age": character.age,
                    "sex": character.sex,
                    "physical_desc": character.physical_desc,
                    "mental_desc_pre": character.mental_desc_pre,
                    "first_change": character.first_change,
                    "image_url": character.image_url
                },
                "synced": synced
            })
            
    except Exception as e:
        logger.exception(f"Error updating character for user {user_id}")
        return web.json_response({"error": "Échec de la mise à jour du personnage"}, status=500)


@require_werewolf_role
async def get_gifts_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/gifts - Récupérer le catalogue des dons et les déblocages.
    Filtre automatiquement par la tribu du joueur.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    user_id = str(user_id_raw)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            # 1. Récupérer le personnage pour connaître sa tribu
            character = await get_character(db, user_id)
            if not character:
                return web.json_response({"error": "Personnage introuvable"}, status=404)
            
            # 2. Charger le catalogue et filtrer
            full_catalogue = load_gift_catalogue()
            
            player_breed = character.breed.value if hasattr(character.breed, 'value') else character.breed
            player_auspice = character.auspice.value if hasattr(character.auspice, 'value') else character.auspice
            player_tribe = character.tribe.value if hasattr(character.tribe, 'value') else character.tribe

            # AC: "Affiche tous les Dons de la Tribu du joueur (plus les dons génériques/races si applicable)"
            # On inclut:
            # - Dons de la Tribu
            # - Dons de la Race (Breed)
            # - Dons de l'Auspice
            # - Dons "Universel" / "Garou"
            
            tribe_gifts = []
            for g in full_catalogue:
                g_tribe = g.get('tribe')
                g_breed = g.get('breed')
                g_auspice = g.get('auspice')
                
                # Si le don a une restriction explicite, on vérifie si ça match
                is_match = False
                
                if g_tribe and g_tribe == player_tribe:
                    is_match = True
                elif g_breed and g_breed == player_breed:
                    is_match = True
                elif g_auspice and g_auspice == player_auspice:
                    is_match = True
                elif g_tribe == "Universel" or (not g_tribe and not g_breed and not g_auspice):
                    # Don sans restriction ou marqué Universel
                    is_match = True
                    
                if is_match:
                    tribe_gifts.append(g)
            
            # 3. Récupérer les dons débloqués
            # get_player_gifts retourne les objets enrichis, mais on veut peut-être juste les IDs 
            # pour le frontend qui a déjà le catalogue ?
            # Le frontend demande: "Les Dons débloqués apparaissent en premier."
            # On va renvoyer la liste des IDs débloqués pour simplifier le frontend
            
            # Note: get_player_gifts retourne une liste de dicts avec 'id', 'unlocked_at', etc.
            player_gifts_enriched = await get_player_gifts(db, user_id)
            unlocked_ids = [g['id'] for g in player_gifts_enriched]
            
            return web.json_response({
                "success": True,
                "profile": {
                    "tribe": character.tribe.value if hasattr(character.tribe, 'value') else character.tribe,
                    "breed": character.breed.value if hasattr(character.breed, 'value') else character.breed,
                    "auspice": character.auspice.value if hasattr(character.auspice, 'value') else character.auspice
                },
                "catalogue": tribe_gifts,
                "unlocked_ids": unlocked_ids
            })
            
    except Exception as e:
        logger.exception(f"Error retrieving gifts for user {user_id}")
        return web.json_response({"error": "Échec de la récupération des dons"}, status=500)


@require_mj_role
async def get_admin_players_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/admin/players - Récupérer la liste des joueurs (Pour MJ).
    """
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            players = await get_all_werewolves(db)
            
            return web.json_response({
                "success": True,
                "players": [{
                    "id": p.user_id,
                    "name": p.name,
                    "tribe": p.tribe.value if hasattr(p.tribe, 'value') else p.tribe,
                    "rank": p.rank
                } for p in players]
            })
    except Exception as e:
        logger.exception("Error listing players")
        return web.json_response({"error": "Échec de la récupération de la liste des joueurs"}, status=500)


@require_mj_role
async def get_admin_player_gifts_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/admin/players/{user_id}/gifts - Récupérer les dons d'un joueur pour admin.
    """
    target_user_id = request.match_info['user_id']
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            character = await get_character(db, target_user_id)
            if not character:
                return web.json_response({"error": "Personnage introuvable"}, status=404)
            
            # Logic similar to get_gifts_handler but for target user
            full_catalogue = load_gift_catalogue()
            
            player_breed = character.breed.value if hasattr(character.breed, 'value') else character.breed
            player_auspice = character.auspice.value if hasattr(character.auspice, 'value') else character.auspice
            player_tribe = character.tribe.value if hasattr(character.tribe, 'value') else character.tribe
            
            available_gifts = []
            for g in full_catalogue:
                g_tribe = g.get('tribe')
                g_breed = g.get('breed')
                g_auspice = g.get('auspice')
                
                is_match = False
                if g_tribe and g_tribe == player_tribe: is_match = True
                elif g_breed and g_breed == player_breed: is_match = True
                elif g_auspice and g_auspice == player_auspice: is_match = True
                elif g_tribe == "Universel" or (not g_tribe and not g_breed and not g_auspice): is_match = True
                    
                if is_match:
                    available_gifts.append(g)
                    
            player_gifts_enriched = await get_player_gifts(db, target_user_id)
            unlocked_ids = [g['id'] for g in player_gifts_enriched]
            
            # Return enriched list for admin (merged state)
            final_list = []
            for g in available_gifts:
                final_list.append({
                    **g,
                    "unlocked": g['id'] in unlocked_ids
                })
                
            return web.json_response({
                "success": True,
                "gifts": final_list,
                "character": {"name": character.name, "tribe": player_tribe}
            })
            
    except Exception as e:
        logger.exception(f"Error fetching admin gifts for {target_user_id}")
        return web.json_response({"error": "Échec de la récupération des dons"}, status=500)


@require_mj_role
async def unlock_gift_handler(request: web.Request) -> web.Response:
    """
    POST /api/modules/werewolf/gifts/unlock - Débloquer/Verrouiller un don (MJ).
    """
    editor_id = request.headers.get("X-Discord-User-ID")
    
    try:
        data = await request.json()
        target_user_id = data.get('playerId')
        gift_id = data.get('giftId')
        should_unlock = data.get('unlock', True)
        
        if not target_user_id or not gift_id:
            return web.json_response({"error": "playerId ou giftId manquant"}, status=400)
            
        async with aiosqlite.connect(DATABASE_PATH) as db:
            if should_unlock:
                from .services.gifts import unlock_gift
                success = await unlock_gift(db, target_user_id, gift_id, editor_id)
                if not success: 
                     # Already unlocked is fine
                     pass
            else:
                from .services.gifts import lock_gift
                await lock_gift(db, target_user_id, gift_id)
                
            return web.json_response({"success": True, "new_state": "unlocked" if should_unlock else "locked"})
            
    except Exception as e:
        logger.exception("Error unlocking gift")
        return web.json_response({"error": "Échec de la mise à jour du don"}, status=500)



@require_werewolf_role
async def get_werewolf_profile_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/profile - Récupérer le profil de base du loup-garou.
    Utilisé par le frontend pour vérifier l'accès et afficher les infos de base.
    
    Utilise Google Sheets comme source de vérité (comme vampire) pour permettre
    le reset instantané via la commande !reset.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    guild_id_raw = request.headers.get("X-Discord-Guild-ID")
    
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    user_id = str(user_id_raw)
    guild_id = int(guild_id_raw) if guild_id_raw else 0
    
    try:
        # NOTE: On désactive la vérification Google Sheets car elle crée une incohérence avec get_character_handler.
        # Si le personnage existe en SQLite, il doit être accessible.
        # Le reset doit gérer la suppression SQLite.
        
        # Si Google Sheets OK, récupérer les détails depuis SQLite
        async with aiosqlite.connect(DATABASE_PATH) as db:
            character = await get_character(db, user_id)
            
            return web.json_response({
                "success": True,
                "has_werewolf_role": True,
                "character_created": character is not None,
                "tribe": character.tribe.value if character and hasattr(character.tribe, 'value') else (character.tribe if character else None),
                "display_name": character.name if character else None,
                "rank": character.rank if character else 1
            }, headers={"Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache"})
    except Exception as e:
        logger.exception(f"Error fetching werewolf profile for {user_id}")
        return web.json_response({"error": "Échec de la récupération du profil"}, status=500)





@require_werewolf_role
async def get_renown_rules_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/renown/rules
    Retourne les règles de renommée, les stats du joueur et son rang.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    user_id = str(user_id_raw)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            # 1. Get Character (for Auspice/Rank)
            character = await get_character(db, user_id)
            if not character:
                return web.json_response({"error": "Personnage introuvable"}, status=404)
            
            # 2. Get Renown Totals
            renown_service = RenownService(db)
            totals = await renown_service.get_player_renown_totals(user_id)
            
            # 3. Serialize Rules (Enum keys to string)
            rules_serialized = {}
            for auspice, ranks in RANK_RULES.items():
                auspice_key = auspice.value if hasattr(auspice, 'value') else str(auspice)
                rules_serialized[auspice_key] = ranks

            return web.json_response({
                "success": True,
                "rules": rules_serialized,
                "my_stats": totals,
                "my_auspice": character.auspice.value if hasattr(character.auspice, 'value') else character.auspice,
                "my_rank": character.rank
            })
            
    except Exception as e:
        logger.exception(f"Error fetching renown rules for {user_id}")
        return web.json_response({"error": "Échec de la récupération des règles"}, status=500)


@require_werewolf_role
async def get_my_renown_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/renown - Récupérer les hauts faits validés.
    """
    user_id_raw = request.headers.get("X-Discord-User-ID")
    if not user_id_raw:
        return web.json_response({"error": "En-tête X-Discord-User-ID manquant"}, status=400)
    
    user_id = str(user_id_raw)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = aiosqlite.Row
            # Fix F1, F2: Select from werewolf_renown_requests, filter by user and approved status
            # Fix F4: Explicitly exclude validated_by (reviewer_id)
            # Schema difference: using submitted_at as validated_at since the latter doesn't exist in requests table
            query = """
                SELECT id, title, description, renown_type, submitted_at, xp_awarded 
                FROM werewolf_renown_requests 
                WHERE user_id = ? AND status = ? 
                ORDER BY submitted_at DESC 
                LIMIT 50
            """
            
            async with db.execute(query, (user_id, RenownStatus.APPROVED.value)) as cursor:
                rows = await cursor.fetchall()
                
                results = []
                for row in rows:
                    # Fix F7: Dates ISO 8601
                    submitted_at = row['submitted_at']
                    # Ensure datetime string
                    if not isinstance(submitted_at, str):
                        submitted_at = str(submitted_at)
                    
                    results.append({
                        "id": row['id'],
                        "title": row['title'],
                        "description": row['description'],
                        "renown_type": row['renown_type'],
                        "validated_at": submitted_at, # Mapping submitted_at to validated_at as per spec contract
                        "xp_awarded": row['xp_awarded']
                    })
                
                return web.json_response({"results": results})
                
    except Exception as e:
        logger.exception(f"Error retrieving renown for user {user_id}")
        return web.json_response({"error": "Échec de la récupération de la renommée"}, status=500)


async def debug_character_handler(request: web.Request) -> web.Response:
    """
    GET /api/modules/werewolf/debug/character?user_id=XXX
    Debug endpoint - shows raw database state. TEMPORARY.
    """
    user_id = request.query.get('user_id', request.headers.get('X-Discord-User-ID', ''))
    if not user_id:
        return web.json_response({"error": "user_id required (query param or header)"}, status=400)
    
    user_id = str(user_id)
    result = {
        "database_path": str(DATABASE_PATH),
        "database_exists": DATABASE_PATH.exists() if hasattr(DATABASE_PATH, 'exists') else 'unknown',
        "user_id_queried": user_id,
    }
    
    try:
        import os
        result["database_size_bytes"] = os.path.getsize(str(DATABASE_PATH))
    except Exception as e:
        result["database_size_error"] = str(e)
    
    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            # Raw SQL check
            cursor = await db.execute("SELECT user_id, name, rank, auspice, tribe, breed FROM werewolf_data WHERE user_id = ?", (user_id,))
            row = await cursor.fetchone()
            result["werewolf_data_raw"] = {
                "exists": row is not None,
                "row": list(row) if row else None
            }
            
            # Count all rows
            cursor2 = await db.execute("SELECT COUNT(*) FROM werewolf_data")
            count = await cursor2.fetchone()
            result["werewolf_data_total_rows"] = count[0] if count else 0
            
            # List ALL rows (user_id, name, rank) to identify what's in the table
            cursor3 = await db.execute("SELECT user_id, name, rank, auspice, tribe FROM werewolf_data")
            all_rows = await cursor3.fetchall()
            result["all_werewolf_rows"] = [
                {"user_id": r[0], "name": r[1], "rank": r[2], "auspice": r[3], "tribe": r[4]}
                for r in all_rows
            ]
            
            # Check via ORM
            character = await get_character(db, user_id)
            result["get_character_result"] = {
                "exists": character is not None,
                "rank": character.rank if character else None,
                "name": character.name if character else None
            }
            
    except Exception as e:
        result["error"] = str(e)
    
    return web.json_response(result, headers={"Cache-Control": "no-store"})


def register_werewolf_routes(app: web.Application) -> None:
    """
    Enregistre toutes les routes du module Werewolf sur l'application.
    Les routes sont montées sur /api/modules/werewolf/*.
    
    Args:
        app: L'application aiohttp
    """
    # Route de santé pour vérifier l'accès au module
    app.router.add_get("/api/modules/werewolf/health", werewolf_health_handler)
    
    # Debug endpoint (TEMPORARY)
    app.router.add_get("/api/modules/werewolf/debug/character", debug_character_handler)
    
    # Profil (pour vérification de rôle frontend)
    app.router.add_get("/api/modules/werewolf/profile", get_werewolf_profile_handler)

    # Création de personnage
    app.router.add_post("/api/modules/werewolf/character", create_character_handler)
    
    # Consultation de personnage
    app.router.add_get("/api/modules/werewolf/character", get_character_handler)
    
    # Mise à jour de personnage
    # Calcul du diff
    app.router.add_put("/api/modules/werewolf/character", update_character_handler)

    # Gestion des Dons
    app.router.add_get("/api/modules/werewolf/gifts", get_gifts_handler)
    
    # Administration (MJ)
    app.router.add_get("/api/modules/werewolf/admin/players", get_admin_players_handler)
    app.router.add_get("/api/modules/werewolf/admin/players/{user_id}/gifts", get_admin_player_gifts_handler)
    app.router.add_post("/api/modules/werewolf/gifts/unlock", unlock_gift_handler)
    
    # Hauts Faits (Renommée)
    app.router.add_get("/api/modules/werewolf/renown", get_my_renown_handler)
    app.router.add_get("/api/modules/werewolf/renown/rules", get_renown_rules_handler)
    
    
    logger.info("Routes Werewolf enregistrées sur /api/modules/werewolf/*")

    # Initialisation de la BDD au démarrage
    async def on_startup(app):
        from .database.init_db import init_werewolf_gifts_table
        await init_werewolf_gifts_table()
        
    app.on_startup.append(on_startup)
