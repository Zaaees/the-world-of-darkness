"""Verify OAuth identity before any game API handler can trust Discord headers."""
import hashlib
import os
import time

import aiohttp
from aiohttp import web

from data.config import ROLE_VAMPIRE, ROLE_MJ_VAMPIRE, ROLE_FONDATEUR


def failure(message, status):
    return web.json_response({"success": False, "error": message}, status=status)


async def discord_identity(token):
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
        async with session.get("https://discord.com/api/v10/oauth2/@me",
                               headers={"Authorization": f"Bearer {token}"}) as response:
            if response.status in (401, 403):
                raise web.HTTPUnauthorized()
            if response.status != 200:
                raise web.HTTPServiceUnavailable()
            data = await response.json()
    client_id = os.getenv("DISCORD_CLIENT_ID", "1453866706546987064")
    if str(data.get("application", {}).get("id")) != client_id or "identify" not in data.get("scopes", []):
        raise web.HTTPUnauthorized()
    try:
        return int(data["user"]["id"])
    except (KeyError, TypeError, ValueError):
        raise web.HTTPUnauthorized()


@web.middleware
async def identity_middleware(request, handler):
    if not request.path.startswith("/api/") or request.method == "OPTIONS":
        return await handler(request)
    scheme, _, token = request.headers.get("Authorization", "").partition(" ")
    if scheme.lower() != "bearer" or not token or len(token) > 2048:
        return failure("Session Discord requise. Reconnectez-vous.", 401)
    # Keep only a hash, never the bearer token. A short cache limits Discord rate pressure.
    cache = request.app.setdefault("identity_cache", {})
    key = hashlib.sha256(token.encode()).hexdigest()
    now = time.monotonic()
    try:
        cached = cache.get(key)
        if cached and cached[1] > now:
            user_id = cached[0]
        else:
            user_id = await discord_identity(token)
            if len(cache) >= 1024:
                cache.clear()
            cache[key] = (user_id, now + 30)
    except web.HTTPUnauthorized:
        return failure("Session Discord invalide ou expirée. Reconnectez-vous.", 401)
    except (web.HTTPServiceUnavailable, aiohttp.ClientError, TimeoutError, ValueError):
        return failure("Discord est indisponible. Réessayez dans un instant.", 503)

    # Old handlers still read these headers: reject a mismatch instead of trusting it.
    if request.headers.get("X-Discord-User-ID") != str(user_id):
        return failure("L'identité ne correspond pas à la session Discord.", 403)
    request["verified_user_id"] = user_id
    if request.path == "/api/guild":
        return await handler(request)
    try:
        guild_id = int(request.headers.get("X-Discord-Guild-ID", ""))
    except ValueError:
        return failure("Serveur Discord requis.", 400)
    bot = request.app.get("bot")
    if not bot:
        return failure("Le bot est indisponible.", 503)
    guild = bot.get_guild(guild_id)
    if not guild:
        return failure("Serveur inaccessible.", 403)
    member = guild.get_member(user_id)
    if not member:
        try:
            member = await guild.fetch_member(user_id)
        except Exception:
            return failure("Vous n'êtes pas membre de ce serveur.", 403)
    request["verified_member"] = member
    request["verified_guild_id"] = guild_id
    vampire_path = (request.path.startswith("/api/vampire/") and request.path != "/api/vampire/profile") or request.path.startswith(("/api/character-sheet", "/api/ghouls", "/api/rituals"))
    roles = {role.id for role in member.roles}
    if vampire_path and not roles.intersection({ROLE_VAMPIRE, ROLE_MJ_VAMPIRE, ROLE_FONDATEUR}):
        return failure("Le rôle Vampire est requis.", 403)
    return await handler(request)
