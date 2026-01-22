import pytest
import aiosqlite
from modules.werewolf.models.store import (
    create_werewolf_table, 
    create_werewolf_data, 
    get_werewolf_data, 
    update_werewolf_data, 
    WerewolfData,
    WerewolfBreed,
    WerewolfAuspice,
    WerewolfTribe
)

@pytest.fixture
async def db():
    async with aiosqlite.connect(":memory:") as db:
        yield db

@pytest.mark.asyncio
async def test_create_table(db):
    await create_werewolf_table(db)
    async with db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='werewolf_data'") as cursor:
        table = await cursor.fetchone()
        assert table is not None

@pytest.mark.asyncio
async def test_create_and_get_data(db):
    await create_werewolf_table(db)
    
    data = WerewolfData(
        user_id="123456789",
        breed=WerewolfBreed.HOMID,
        auspice=WerewolfAuspice.AHROUN,
        tribe=WerewolfTribe.SILVER_FANGS,
        name="Test Wolf",
        story="A brave warrior",
        rank=1,
        discord_thread_id="987654321"
    )
    
    await create_werewolf_data(db, data)
    
    fetched = await get_werewolf_data(db, "123456789")
    assert fetched is not None
    assert fetched.user_id == data.user_id
    assert fetched.name == data.name
    assert fetched.breed == WerewolfBreed.HOMID
    assert fetched.auspice == WerewolfAuspice.AHROUN
    assert fetched.tribe == WerewolfTribe.SILVER_FANGS
    assert isinstance(fetched.breed, WerewolfBreed)

@pytest.mark.asyncio
async def test_create_data_with_strings(db):
    """Test compatibility when passing strings instead of Enums (API boundary)"""
    await create_werewolf_table(db)
    
    data = WerewolfData(
        user_id="999",
        breed="Lupus",
        auspice="Theurge",
        tribe="Black Furies",
        name="String Wolf"
    )
    
    await create_werewolf_data(db, data)
    
    fetched = await get_werewolf_data(db, "999")
    assert fetched.breed == WerewolfBreed.LUPUS
    assert fetched.tribe == WerewolfTribe.BLACK_FURIES

@pytest.mark.asyncio
async def test_update_data_mutability(db):
    await create_werewolf_table(db)
    
    data = WerewolfData(
        user_id="123456789",
        breed=WerewolfBreed.HOMID,
        auspice=WerewolfAuspice.AHROUN,
        tribe=WerewolfTribe.SILVER_FANGS,
        name="Test Wolf",
        story="A brave warrior",
        rank=1
    )
    await create_werewolf_data(db, data)
    
    # Update allowed fields
    updates = {
        "name": "New Name",
        "story": "New Story",
        "rank": 2
    }
    await update_werewolf_data(db, "123456789", updates)
    
    fetched = await get_werewolf_data(db, "123456789")
    assert fetched.name == "New Name"
    assert fetched.story == "New Story"
    assert fetched.rank == 2

@pytest.mark.asyncio
async def test_update_data_immutability_and_security(db):
    await create_werewolf_table(db)
    
    data = WerewolfData(
        user_id="123456789",
        breed=WerewolfBreed.HOMID,
        auspice=WerewolfAuspice.AHROUN,
        tribe=WerewolfTribe.SILVER_FANGS,
        name="Test Wolf"
    )
    await create_werewolf_data(db, data)
    
    # Try to update immutable fields AND inject invalid columns
    updates = {
        "breed": "Lupus", # Immutable, should be ignored
        "invalid_col": "hacked", # Invalid column, should be ignored (security fix)
        "name": "Updated Name" # Valid, should be updated
    }
    await update_werewolf_data(db, "123456789", updates)
    
    fetched = await get_werewolf_data(db, "123456789")
    assert fetched.breed == WerewolfBreed.HOMID # Should NOT change
    assert fetched.name == "Updated Name" # Should change
    
    # Verify no errors were raised (silent drop of invalid keys)

