
import asyncio
import aiosqlite
import os
from modules.werewolf.database.init_db import init_werewolf_gifts_table
from utils.database import DATABASE_PATH

async def verify_db_init():
    print(f"Checking database at {DATABASE_PATH}...")
    
    # Run init
    success = await init_werewolf_gifts_table()
    if not success:
        print("❌ Init function returned False")
        return

    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Check if table exists
        async with db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='werewolf_player_gifts'") as cursor:
            result = await cursor.fetchone()
            if result:
                print("✅ Table 'werewolf_player_gifts' exists.")
            else:
                print("❌ Table 'werewolf_player_gifts' NOT found.")

if __name__ == "__main__":
    if not os.path.exists(DATABASE_PATH):
        # Create dummy db for test if not exists (though it should)
        print("Database not found, creating dummy...")
        # open(DATABASE_PATH, 'a').close() 
        # utils.database might handle path, assuming it exists or is handled by aiosqlite
        pass

    asyncio.run(verify_db_init())
