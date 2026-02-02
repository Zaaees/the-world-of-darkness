import pytest
import aiosqlite
from modules.werewolf.models.store import create_werewolf_table, create_werewolf_data, delete_werewolf_data, WerewolfData, WerewolfBreed, WerewolfAuspice, WerewolfTribe, create_player_gifts_table, create_renown_table

@pytest.mark.asyncio
async def test_delete_werewolf_data_casts_id_to_string():
    async with aiosqlite.connect(":memory:") as db:
        await create_werewolf_table(db)
        await create_player_gifts_table(db)
        await create_renown_table(db)
        
        user_id = "123456789"
        
        # Create data
        data = WerewolfData(
            user_id=user_id,
            breed=WerewolfBreed.HOMID,
            auspice=WerewolfAuspice.AHROUN,
            tribe=WerewolfTribe.SILVER_FANGS,
            name="TestWolf"
        )
        await create_werewolf_data(db, data)
        
        # Verify it exists
        cursor = await db.execute("SELECT * FROM werewolf_data WHERE user_id = ?", (user_id,))
        assert await cursor.fetchone() is not None
        
        # Delete using INT (Testing the fix)
        deleted = await delete_werewolf_data(db, 123456789)
        assert deleted is True
        
        # Verify it's gone
        cursor = await db.execute("SELECT * FROM werewolf_data WHERE user_id = ?", (user_id,))
        assert await cursor.fetchone() is None

@pytest.mark.asyncio
async def test_delete_werewolf_data_idempotent():
    async with aiosqlite.connect(":memory:") as db:
        await create_werewolf_table(db)
        await create_player_gifts_table(db)
        await create_renown_table(db)
        
        deleted = await delete_werewolf_data(db, "99999")
        assert deleted is False
