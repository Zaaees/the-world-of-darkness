from aiohttp import web
import logging
from modules.werewolf.services.renown import RenownService
from modules.werewolf.services.notifications import NotificationService

logger = logging.getLogger(__name__)

async def submit_renown_request(request):
    """
    Endpoint pour soumettre une demande de renommée.
    POST /api/modules/werewolf/renown/submit
    """
    db = request.app['db']
    
    # Authentication check via headers (consistent with other werewolf routes)
    user_id = request.headers.get("X-Discord-User-ID")
    guild_id = request.headers.get("X-Discord-Guild-ID")
    
    if not user_id or not guild_id:
        return web.json_response({"error": "Unauthorized", "message": "Missing authentication headers"}, status=401)

    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    service = RenownService(db)
    
    try:
        renown_request = await service.submit_request(user_id, data)
        
        # Trigger Notification (Async)
        bot = request.app.get("bot")
        if bot:
            import asyncio
            asyncio.create_task(NotificationService.send_renown_submission_notification(
                bot, 
                str(user_id), 
                renown_request.title,
                renown_request.renown_type.value,
                renown_request.id
            ))

        return web.json_response({
            "id": renown_request.id,
            "status": renown_request.status.value,
            "title": renown_request.title,
            "renown_type": renown_request.renown_type.value,
            "message": "Demande soumise aux Esprits"
        }, status=201)
            
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)
    except Exception as e:
        logger.exception("Error processing renown request")
        return web.json_response({"error": "Erreur interne du serveur"}, status=500)

from modules.werewolf.models.renown import RenownStatus

from modules.werewolf.models.renown import RenownStatus
from data.config import ROLE_MJ_WEREWOLF


async def check_mj_role(request) -> bool:
    """Vérifie si l'utilisateur a le rôle MJ via les headers ou l'objet user."""
    # Option 1: Via header X-Discord-User-ID et appel DB/Bot (si user non injecté)
    # Option 2: Via objet 'user' injecté par middleware global (s'il existe)
    # Ici on suppose que le middleware 'require_werewolf_role' ou similaire peuple request'
    # Mais 'api_routes.py' semble standalone.
    
    # Check headers directly as fallback logic from verify_werewolf_auth
    user_id = request.headers.get("X-Discord-User-ID")
    guild_id = request.headers.get("X-Discord-Guild-ID")
    
    if not user_id or not guild_id:
        return False
        
    try:
        user_id_int = int(user_id)
        guild_id_int = int(guild_id)
    except ValueError:
        return False
        
    # We need to fetch the member from the bot instance attached to app
    bot = request.app.get("bot")
    if not bot:
        logger.warning("Bot instance not found in request.app")
        return False
        
    guild = bot.get_guild(guild_id_int)
    if not guild:
         return False
         
    member = guild.get_member(user_id_int)
    if not member:
        # Fallback: Fetch from API if not in cache
        try:
            member = await guild.fetch_member(user_id_int)
        except Exception:
            logger.warning(f"Could not fetch member {user_id_int} from guild {guild_id_int}")
            return False
            
    role_ids = [r.id for r in member.roles]
    return ROLE_MJ_WEREWOLF in role_ids

async def get_all_renown_requests(request):
    """
    GET /api/modules/werewolf/admin/renown
    Récupère toutes les demandes. MJ UNIQUEMENT.
    """
    if not await check_mj_role(request):
        return web.json_response({"error": "Forbidden", "message": "Réservé aux Conteurs"}, status=403)
        
    db = request.app['db']
    service = RenownService(db)
    
    try:
        requests = await service.get_all_requests()
        
        # Serialization
        data = []
        for req in requests:
            data.append({
                "id": req.id,
                "user_id": req.user_id,
                "title": req.title,
                "description": req.description,
                "renown_type": req.renown_type.value,
                "status": req.status.value,
                "submitted_at": req.submitted_at.isoformat(),
            })
            
        return web.json_response({"requests": data})
    except Exception as e:
        logger.exception("Error fetching renown requests")
        return web.json_response({"error": "Internal Error"}, status=500)

async def validate_renown_request(request):
    """
    POST /api/modules/werewolf/admin/renown/{id}/validate
    Valide une demande. MJ UNIQUEMENT.
    """
    if not await check_mj_role(request):
        return web.json_response({"error": "Forbidden"}, status=403)
        
    request_id = request.match_info.get('id')
    user_id = request.headers.get("X-Discord-User-ID") # Validator ID
    
    db = request.app['db']
    service = RenownService(db)
    
    try:
        req = await service.update_request_status(request_id, RenownStatus.APPROVED, user_id)
        if not req:
             return web.json_response({"error": "Not Found"}, status=404)

        # Trigger Rank Recalculation
        new_rank = await service.recalculate_player_rank(req.user_id)
        
        # Trigger Notification
        bot = request.app.get("bot")
        if bot:
            # Async notification (fire and forget)
            import asyncio
            asyncio.create_task(NotificationService.send_renown_approval_notification(
                bot, 
                str(req.user_id), 
                req.title, 
                new_rank
            ))
             
        return web.json_response({
            "success": True, 
            "status": "approved",
            "new_rank": new_rank
        })
    except Exception as e:
         logger.exception(f"Error validating request {request_id}")
         return web.json_response({"error": "Internal Error"}, status=500)

async def reject_renown_request(request):
    """
    POST /api/modules/werewolf/admin/renown/{id}/reject
    Rejette une demande. MJ UNIQUEMENT.
    """
    if not await check_mj_role(request):
        return web.json_response({"error": "Forbidden"}, status=403)
        
    request_id = request.match_info.get('id')
    user_id = request.headers.get("X-Discord-User-ID") # Validator ID
    
    db = request.app['db']
    service = RenownService(db)
    
    try:
        req = await service.update_request_status(request_id, RenownStatus.REJECTED, user_id)
        if not req:
             return web.json_response({"error": "Not Found"}, status=404)
             
        return web.json_response({"success": True, "status": "rejected"})
    except Exception as e:
         logger.exception(f"Error rejecting request {request_id}")
         return web.json_response({"error": "Internal Error"}, status=500)

def setup_routes(app):
    app.router.add_post('/api/modules/werewolf/renown/submit', submit_renown_request)
    
    # Admin Routes
    app.router.add_get('/api/modules/werewolf/admin/renown', get_all_renown_requests)
    app.router.add_post('/api/modules/werewolf/admin/renown/{id}/validate', validate_renown_request)
    app.router.add_post('/api/modules/werewolf/admin/renown/{id}/reject', reject_renown_request)

