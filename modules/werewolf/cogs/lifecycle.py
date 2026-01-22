import logging
import aiosqlite
from discord.ext import commands
from utils.database import DATABASE_PATH
from modules.werewolf.models.store import create_werewolf_table

logger = logging.getLogger(__name__)

class WerewolfLifecycle(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    async def cog_load(self):
        """Called when the cog is loaded."""
        try:
            async with aiosqlite.connect(DATABASE_PATH) as db:
                await create_werewolf_table(db)
            logger.info("Werewolf database tables initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Werewolf tables: {e}")

async def setup(bot):
    await bot.add_cog(WerewolfLifecycle(bot))
