import asyncio
import logging
import sys
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG)

sys.path.append(os.getcwd())

from modules.werewolf.services.character_service import create_character
from modules.werewolf.models.store import create_werewolf_table
import aiosqlite

async def main():
    character_data = {
        "user_id": 123456789,
        "name": "Fenris",
        "breed": "Homid",
        "auspice": "Ahroun",
        "tribe": "Get of Fenris"
    }

    try:
        async with aiosqlite.connect(":memory:") as db:
            print("Creating table...")
            await create_werewolf_table(db)
            
            print("Calling create_character...")
            result = await create_character(db, character_data)
            
            print(f"Result: {result}")
            
            if result and str(result.user_id) == str(character_data["user_id"]):
                print("TEST PASSED")
            else:
                print("TEST FAILED: Result mismatch")

    except Exception as e:
        print(f"TEST FAILED with exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
