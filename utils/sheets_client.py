"""Private server-to-Apps-Script transport. No secret belongs in the web bundle."""
import json
import os

import aiohttp
from data.config import GOOGLE_SHEETS_API_URL


class SheetsUnavailable(RuntimeError):
    pass


async def sheets_request(action, **parameters):
    secret = os.getenv("SHEETS_API_SECRET")
    if not secret:
        raise SheetsUnavailable("Synchronisation non configurée sur le serveur.")
    payload = {"action": action, "secret": secret, **parameters}
    try:
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
            async with session.post(os.getenv("GOOGLE_SHEETS_API_URL", GOOGLE_SHEETS_API_URL), json=payload) as response:
                if response.status != 200:
                    raise SheetsUnavailable("Synchronisation indisponible.")
                data = json.loads(await response.text())
        if not data.get("success"):
            raise SheetsUnavailable("La synchronisation a refusé la demande.")
        return data
    except (aiohttp.ClientError, TimeoutError, ValueError) as exc:
        raise SheetsUnavailable("Synchronisation indisponible. Réessayez.") from exc
