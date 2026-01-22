
import pytest
import pytest_asyncio
from modules.werewolf.tests.fixtures.factories import create_werewolf_data
# The module below does not exist yet - RED Phase
try:
    from modules.werewolf.models.store import create_werewolf_table, create_werewolf_data as insert_werewolf_data, get_werewolf_data, update_werewolf_data, WerewolfData
except ImportError:
    pass # Expected in Red phase, tests will fail on NameError or calls

@pytest.mark.asyncio
async def test_create_table_sql_validity(db_connection):
    """
    Smoke Test: Verify table creation SQL is valid and executes.
    """
    # GIVEN the module is initialized (we run creation manually for test)
    # WHEN creating the table
    await create_werewolf_table(db_connection)

    # THEN the table should exist in sqlite_master
    cursor = await db_connection.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='werewolf_data'")
    row = await cursor.fetchone()
    assert row is not None, "Table werewolf_data should be created"

@pytest.mark.asyncio
async def test_store_create_character_success(db_connection):
    """
    Test P0: Persist user/character data successfully.
    """
    await create_werewolf_table(db_connection)
    
    # GIVEN valid character data
    data = create_werewolf_data()
    
    # WHEN inserting into the store
    dto = WerewolfData(**data) # Should exist
    await insert_werewolf_data(db_connection, dto)

    # THEN we can retrieve it
    stored = await get_werewolf_data(db_connection, data['user_id'])
    assert stored is not None
    assert stored.name == data['name']
    assert stored.tribe == data['tribe']

@pytest.mark.asyncio
async def test_store_discord_id_precision(db_connection):
    """
    Test P0: Verify Discord IDs are stored with full precision (String or BigInt).
    Risk R-201: JS Integer limit.
    """
    await create_werewolf_table(db_connection)

    # GIVEN a specific large Discord ID (19 digits)
    large_id = "1453870972376584192" # Known ID from requirements
    thread_id = "1462941781761986732"
    
    data = create_werewolf_data({
        'user_id': large_id,
        'discord_thread_id': thread_id
    })

    # WHEN inserting
    dto = WerewolfData(**data)
    await insert_werewolf_data(db_connection, dto)

    # THEN the retrieved ID matches exactly as string
    stored = await get_werewolf_data(db_connection, large_id)
    
    # Verify type and value
    assert stored.user_id == large_id, f"Expected {large_id}, got {stored.user_id}"
    assert isinstance(stored.user_id, str), "user_id should be returned as string for safety"
    assert stored.discord_thread_id == thread_id

@pytest.mark.asyncio
async def test_store_immutability_enforcement(db_connection):
    """
    Test P1: Immutability of Breed, Auspice, Tribe.
    """
    await create_werewolf_table(db_connection)
    
    # GIVEN an existing character
    data = create_werewolf_data({'breed': 'Homid', 'tribe': 'Fianna'})
    dto = WerewolfData(**data)
    await insert_werewolf_data(db_connection, dto)

    # WHEN attempting to update immutable fields
    update_pkg = {
        'breed': 'Lupus', # Should be ignored
        'tribe': 'Get of Fenris', # Should be ignored
        'story': 'New Story Content' # Should be accepted
    }
    
    await update_werewolf_data(db_connection, data['user_id'], update_pkg)

    # THEN the immutable fields remain unchanged
    stored = await get_werewolf_data(db_connection, data['user_id'])
    assert stored.breed == 'Homid'
    assert stored.tribe == 'Fianna'
    
    # AND mutable fields are updated
    assert stored.story == 'New Story Content'

@pytest.mark.asyncio
async def test_store_unique_constraint(db_connection):
    """
    Test P1: Unicity of User ID.
    """
    await create_werewolf_table(db_connection)
    
    # GIVEN an existing character
    data = create_werewolf_data()
    dto = WerewolfData(**data)
    await insert_werewolf_data(db_connection, dto)

    # WHEN attempting to insert another character with SAME user_id
    # THEN it should raise an IntegrityError (or custom error)
    with pytest.raises(Exception) as excinfo: # Catch generic exception as we don't know specific sqlite error wrapper yet
        await insert_werewolf_data(db_connection, dto)
    
    # We expect some form of constraint violation
    assert "constraint" in str(excinfo.value).lower() or "unique" in str(excinfo.value).lower()
