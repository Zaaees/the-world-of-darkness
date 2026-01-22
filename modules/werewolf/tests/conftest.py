
import pytest
import pytest_asyncio
import aiosqlite
import os

@pytest.fixture(scope="session")
def database_path(tmp_path_factory):
    """Create a temporary database for testing."""
    db_file = tmp_path_factory.mktemp("data") / "test.db"
    return str(db_file)

@pytest_asyncio.fixture
async def db_connection(database_path):
    """Provide an aiosqlite connection to the test database."""
    async with aiosqlite.connect(database_path) as db:
        yield db

@pytest_asyncio.fixture(autouse=True)
async def cleanup_tables(db_connection):
    """Clean up tables after each test to ensure isolation."""
    yield
    # In a real scenario, we might truncate tables here
    # For now, we assume tests are isolated enough or we drop tables
    await db_connection.execute("DROP TABLE IF EXISTS werewolf_data")
    await db_connection.commit()
