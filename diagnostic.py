#!/usr/bin/env python3
"""
Script de diagnostic pour vérifier la configuration du bot et des commandes.
"""

import asyncio
import logging
import os

import discord
from discord.ext import commands
from dotenv import load_dotenv

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Chargement des variables d'environnement
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")

if not TOKEN:
    logger.error("DISCORD_TOKEN non défini")
    exit(1)

# Configuration des intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True


class DiagnosticBot(commands.Bot):
    def __init__(self):
        super().__init__(
            command_prefix="!",
            intents=intents,
        )

    async def setup_hook(self):
        """Charge les cogs et affiche les infos."""
        logger.info("=== DIAGNOSTIC DU BOT ===\n")

        # Charger les cogs
        cogs_to_load = ["cogs.vampire", "cogs.werewolf", "cogs.general", "cogs.blood_actions"]

        for cog_name in cogs_to_load:
            try:
                await self.load_extension(cog_name)
                logger.info(f"✅ Cog chargé: {cog_name}")
            except Exception as e:
                logger.error(f"❌ Erreur lors du chargement de {cog_name}: {e}")

        # Lister toutes les commandes
        logger.info("\n=== COMMANDES SLASH ENREGISTRÉES ===")
        for command in self.tree.get_commands():
            logger.info(f"  - /{command.name}: {command.description}")

        # Lister toutes les commandes préfixées
        logger.info("\n=== COMMANDES PRÉFIXÉES ENREGISTRÉES ===")
        for command in self.commands:
            logger.info(f"  - !{command.name}: {command.help or 'Pas de description'}")

        # Synchroniser
        logger.info("\n=== SYNCHRONISATION DES COMMANDES ===")
        try:
            synced = await self.tree.sync()
            logger.info(f"✅ {len(synced)} commande(s) synchronisée(s) globalement")
            for cmd in synced:
                logger.info(f"  - /{cmd.name}")
        except Exception as e:
            logger.error(f"❌ Erreur lors de la synchronisation: {e}")

    async def on_ready(self):
        """Affiche les infos du bot."""
        logger.info("\n=== INFORMATIONS DU BOT ===")
        logger.info(f"Bot: {self.user.name} ({self.user.id})")
        logger.info(f"Serveurs: {len(self.guilds)}")

        for guild in self.guilds:
            logger.info(f"\n  Serveur: {guild.name} ({guild.id})")
            logger.info(f"  Membres: {guild.member_count}")

            # Vérifier les permissions du bot
            bot_member = guild.get_member(self.user.id)
            if bot_member:
                perms = bot_member.guild_permissions
                logger.info(f"  Permissions importantes:")
                logger.info(f"    - Administrator: {perms.administrator}")
                logger.info(f"    - Manage Roles: {perms.manage_roles}")
                logger.info(f"    - Send Messages: {perms.send_messages}")
                logger.info(f"    - Use Slash Commands: {perms.use_application_commands}")

        logger.info("\n=== LIEN DE RÉ-INVITATION ===")
        logger.info(f"Si les commandes n'apparaissent pas, ré-invite le bot avec ce lien:")
        logger.info(f"https://discord.com/api/oauth2/authorize?client_id={self.user.id}&permissions=8&scope=bot%20applications.commands")

        logger.info("\n=== DIAGNOSTIC TERMINÉ ===")
        logger.info("Le bot va maintenant s'arrêter...")
        await self.close()


async def main():
    bot = DiagnosticBot()
    async with bot:
        await bot.start(TOKEN)


if __name__ == "__main__":
    asyncio.run(main())
