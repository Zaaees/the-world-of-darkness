import json
from pathlib import Path
from typing import Dict, List, Any
import aiofiles

class WerewolfAssetsService:
    """Service responsible for loading static Werewolf assets."""

    ASSETS_PATH = Path(__file__).parent.parent / "assets" / "werewolf_data.json"

    @classmethod
    async def load_assets(cls) -> Dict[str, List[Dict[str, Any]]]:
        """
        Loads the static assets from the JSON file.
        
        Returns:
            Dict containing lists of breeds, auspices, and tribes.
        
        Raises:
            FileNotFoundError: If the assets file is missing.
            json.JSONDecodeError: If the file content is invalid JSON.
        """
        if not cls.ASSETS_PATH.exists():
            raise FileNotFoundError(f"Werewolf assets file not found at {cls.ASSETS_PATH}")

        async with aiofiles.open(cls.ASSETS_PATH, mode="r", encoding="utf-8") as f:
            content = await f.read()
            return json.loads(content)

    @classmethod
    async def get_breeds(cls) -> List[Dict[str, Any]]:
        """Returns the list of breeds."""
        data = await cls.load_assets()
        return data.get("breeds", [])

    @classmethod
    async def get_auspices(cls) -> List[Dict[str, Any]]:
        """Returns the list of auspices."""
        data = await cls.load_assets()
        return data.get("auspices", [])

    @classmethod
    async def get_tribes(cls) -> List[Dict[str, Any]]:
        """Returns the list of tribes."""
        data = await cls.load_assets()
        return data.get("tribes", [])
