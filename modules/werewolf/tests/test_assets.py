import pytest
import pytest_asyncio
from modules.werewolf.services.assets_service import WerewolfAssetsService

@pytest.mark.asyncio
async def test_assets_loading_success():
    """
    Test that assets are loaded successfully and contain required keys.
    """
    data = await WerewolfAssetsService.load_assets()
    assert "breeds" in data
    assert "auspices" in data
    assert "tribes" in data
    assert len(data["breeds"]) > 0
    assert len(data["auspices"]) > 0
    assert len(data["tribes"]) > 0

@pytest.mark.asyncio
async def test_assets_structure_integrity():
    """
    Test that individual asset entries have the required structure.
    """
    entries = await WerewolfAssetsService.get_breeds()
    for entry in entries:
        assert "id" in entry
        assert "name_fr" in entry
        assert isinstance(entry["id"], str)
        assert isinstance(entry["name_fr"], str)

    tribes = await WerewolfAssetsService.get_tribes()
    assert len(tribes) == 13 # Canonical number of tribes
    for tribe in tribes:
         assert "id" in tribe
         assert "name_fr" in tribe

@pytest.mark.asyncio
async def test_specific_data_check():
    """
    Spot check specific data points to ensure JSON validity.
    """
    auspices = await WerewolfAssetsService.get_auspices()
    ragabash = next((a for a in auspices if a["id"] == "ragabash"), None)
    assert ragabash is not None
    assert ragabash["name_fr"] == "Ragabash"

    tribes = await WerewolfAssetsService.get_tribes()
    furies = next((t for t in tribes if t["id"] == "black_furies"), None)
    assert furies is not None
    assert furies["name_fr"] == "Furies Noires"
