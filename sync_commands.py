#!/usr/bin/env python3
"""
Script pour forcer la synchronisation des commandes Discord.
Utilise ce script si les commandes n'apparaissent pas après redémarrage.

Usage: python sync_commands.py
"""

import asyncio
import logging
import os

import discord
from discord.ext import commands
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
COMMAND_PREFIX = os.getenv("COMMAND_PREFIX", "!")

if not TOKEN:
    raise ValueError("DISCORD_TOKEN manquant dans .env")


intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True


class SyncBot(commands.Bot):
    def __init__(self):
        super().__init__(
            command_prefix=COMMAND_PREFIX,
            intents=intents,
        )

    async def setup_hook(self):
        """Charge les cogs et synchronise."""
        # Charger les cogs
        cogs = ["cogs.vampire", "cogs.werewolf", "cogs.general"]

        for cog in cogs:
            try:
                await self.load_extension(cog)
                logger.info(f"✅ Cog chargé: {cog}")
            except Exception as e:
                logger.error(f"❌ Erreur chargement {cog}: {e}")

        # Vider les commandes existantes
        logger.info("🗑️  Suppression des anciennes commandes...")
        self.tree.clear_commands(guild=None)

        # Synchroniser les nouvelles commandes
        logger.info("🔄 Synchronisation des commandes...")
        try:
            synced = await self.tree.sync()
            logger.info(f"✅ {len(synced)} commande(s) synchronisée(s)")

            # Afficher les commandes synchronisées
            for cmd in synced:
                logger.info(f"   - /{cmd.name}: {cmd.description}")

        except Exception as e:
            logger.error(f"❌ Erreur synchronisation: {e}")

    async def on_ready(self):
        logger.info(f"✅ Bot connecté: {self.user}")
        logger.info(f"✅ Connecté à {len(self.guilds)} serveur(s)")

        # Afficher les guilds
        for guild in self.guilds:
            logger.info(f"   - {guild.name} (ID: {guild.id})")

        logger.info("\n✅ Synchronisation terminée! Tu peux fermer ce script.")
        logger.info("Les commandes devraient apparaître dans Discord dans 1-5 minutes.")

        # Arrêter le bot
        await asyncio.sleep(3)
        await self.close()


async def main():
    bot = SyncBot()
    async with bot:
        await bot.start(TOKEN)


if __name__ == "__main__":
    asyncio.run(main())
