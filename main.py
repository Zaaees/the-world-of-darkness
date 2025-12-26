#!/usr/bin/env python3
"""
Bot Discord - Monde des Ténèbres
Assistant Narratif pour jeu de rôle écrit

Ce bot agit comme un arbitre invisible qui impose des contraintes narratives
aux joueurs pour simuler leur perte d'humanité ou de contrôle.

Commandes:
- /vampire : Panneau de contrôle pour les Vampires (rôle "Vampire" requis)
- /lycan : Panneau de contrôle pour les Loups-Garous (rôle "Loup-garou" requis)
"""

import asyncio
import logging
import os
from pathlib import Path

import discord
from discord.ext import commands
from dotenv import load_dotenv

from utils.database import init_database

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("bot.log", encoding="utf-8")],
)
logger = logging.getLogger(__name__)

# Chargement des variables d'environnement
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
COMMAND_PREFIX = os.getenv("COMMAND_PREFIX", "!")

if not TOKEN:
    logger.error("DISCORD_TOKEN non défini dans le fichier .env")
    raise ValueError("DISCORD_TOKEN manquant")


# Configuration des intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True


class WorldOfDarknessBot(commands.Bot):
    """Bot principal pour le Monde des Ténèbres."""

    def __init__(self):
        super().__init__(
            command_prefix=COMMAND_PREFIX,
            intents=intents,
            help_command=commands.DefaultHelpCommand(
                no_category="Commandes Générales"
            ),
        )

    async def setup_hook(self):
        """Initialisation du bot avant la connexion."""
        # Initialiser la base de données
        await init_database()
        logger.info("Base de données initialisée")

        # Charger les Cogs
        cogs_to_load = ["cogs.vampire", "cogs.werewolf", "cogs.general", "cogs.blood_actions"]

        for cog_name in cogs_to_load:
            try:
                await self.load_extension(cog_name)
                logger.info(f"Cog chargé: {cog_name}")
            except Exception as e:
                logger.error(f"Erreur lors du chargement de {cog_name}: {e}")

        # Synchroniser les slash commands
        try:
            synced = await self.tree.sync()
            logger.info(f"{len(synced)} commande(s) synchronisée(s)")
        except Exception as e:
            logger.error(f"Erreur lors de la synchronisation des commandes: {e}")

    async def on_ready(self):
        """Appelé quand le bot est prêt."""
        logger.info(f"Bot connecté en tant que {self.user}")
        logger.info(f"Connecté à {len(self.guilds)} serveur(s)")

        # Définir le statut du bot
        activity = discord.Activity(
            type=discord.ActivityType.watching, name="les ténèbres s'étendre..."
        )
        await self.change_presence(activity=activity)

    async def on_command_error(self, ctx: commands.Context, error: commands.CommandError):
        """Gestion globale des erreurs de commandes préfixées."""
        if isinstance(error, commands.CommandNotFound):
            return  # Ignorer les commandes inconnues

        if isinstance(error, commands.MissingRequiredArgument):
            await ctx.send(
                f"❌ Argument manquant: `{error.param.name}`",
                delete_after=10,
            )
            return

        if isinstance(error, commands.BadArgument):
            await ctx.send(
                f"❌ Argument invalide: {error}",
                delete_after=10,
            )
            return

        if isinstance(error, commands.MissingPermissions):
            await ctx.send(
                "❌ Vous n'avez pas les permissions nécessaires.",
                delete_after=10,
            )
            return

        if isinstance(error, commands.BotMissingPermissions):
            await ctx.send(
                f"❌ Le bot manque de permissions: {', '.join(error.missing_permissions)}",
                delete_after=10,
            )
            return

        # Log des erreurs non gérées
        logger.error(f"Erreur non gérée: {error}", exc_info=error)


def main():
    """Point d'entrée principal."""
    bot = WorldOfDarknessBot()

    async def runner():
        async with bot:
            await bot.start(TOKEN)

    try:
        asyncio.run(runner())
    except KeyboardInterrupt:
        logger.info("Arrêt du bot demandé par l'utilisateur")


if __name__ == "__main__":
    main()
