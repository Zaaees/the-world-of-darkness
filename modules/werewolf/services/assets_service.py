import json
from pathlib import Path
from typing import Dict, List, Any
import aiofiles

class WerewolfAssetsService:
    """Service responsable du chargement des assets statiques Werewolf."""

    ASSETS_PATH = Path(__file__).parent.parent / "assets" / "werewolf_data.json"

    @classmethod
    async def load_assets(cls) -> Dict[str, List[Dict[str, Any]]]:
        """
        Charge les assets statiques depuis le fichier JSON.
        
        Returns:
            Dict contenant les listes de races, auspices et tribus.
        
        Raises:
            FileNotFoundError: Si le fichier d'assets est manquant.
            json.JSONDecodeError: Si le contenu du fichier n'est pas du JSON valide.
        """
        if not cls.ASSETS_PATH.exists():
            raise FileNotFoundError(f"Werewolf assets file not found at {cls.ASSETS_PATH}")

        async with aiofiles.open(cls.ASSETS_PATH, mode="r", encoding="utf-8") as f:
            content = await f.read()
            return json.loads(content)

    @classmethod
    async def get_breeds(cls) -> List[Dict[str, Any]]:
        """Retourne la liste des races."""
        data = await cls.load_assets()
        return data.get("breeds", [])

    @classmethod
    async def get_auspices(cls) -> List[Dict[str, Any]]:
        """Retourne la liste des auspices."""
        data = await cls.load_assets()
        return data.get("auspices", [])

    @classmethod
    async def get_tribes(cls) -> List[Dict[str, Any]]:
        """Retourne la liste des tribus."""
        data = await cls.load_assets()
        return data.get("tribes", [])
