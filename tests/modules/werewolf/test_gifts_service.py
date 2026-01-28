import pytest
import aiosqlite
import os
import json
from modules.werewolf.services.gifts import load_gift_catalogue, get_player_gifts, unlock_gift
from modules.werewolf.models.store import create_player_gifts_table, create_werewolf_table

@pytest.mark.asyncio
async def test_load_gift_catalogue():
    """Teste le chargement du catalogue."""
    catalogue = load_gift_catalogue()
    assert isinstance(catalogue, list)
    assert len(catalogue) > 0
    assert "id" in catalogue[0]
    assert "name_fr" in catalogue[0]

@pytest.mark.asyncio
async def test_get_player_gifts_empty(tmp_path):
    """Teste la récupération des dons pour un joueur sans dons."""
    async with aiosqlite.connect(':memory:') as db:
        await create_werewolf_table(db)
        await create_player_gifts_table(db)
        
        gifts = await get_player_gifts(db, "123")
        assert len(gifts) == 0

@pytest.mark.asyncio
async def test_unlock_and_get_player_gifts():
    """Teste le déblocage et la récupération des dons."""
    async with aiosqlite.connect(':memory:') as db:
        await create_werewolf_table(db)
        await create_player_gifts_table(db)
        
        # Créer le loup-garou
        await db.execute(
            "INSERT INTO werewolf_data (user_id, breed, auspice, tribe, name) VALUES (?, ?, ?, ?, ?)",
            ("123", "Homid", "Ragabash", "Black Furies", "Test")
        )
        await db.commit()
        
        # Débloquer un don (qui existe dans le catalogue)
        catalogue = load_gift_catalogue()
        gift_id = catalogue[0]['id']
        
        success = await unlock_gift(db, "123", gift_id, "admin_mj")
        assert success is True
        
        # Récupérer
        player_gifts = await get_player_gifts(db, "123")
        assert len(player_gifts) == 1
        assert player_gifts[0]['id'] == gift_id
        assert player_gifts[0]['unlocked_by'] == "admin_mj"
        assert "name_fr" in player_gifts[0]
