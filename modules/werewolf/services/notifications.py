
import logging
from typing import Optional

logger = logging.getLogger(__name__)

from utils.sheet_manager import SHEET_LOG_CHANNEL_ID
from data.config import ROLE_MJ_WEREWOLF

class NotificationService:
    @staticmethod
    async def send_renown_approval_notification(discord_client, user_id: str, request_title: str, new_rank: int):
        """
        Envoie une notification Discord (DM) lors de la validation d'un haut fait.
        
        Args:
            discord_client: Client bot Discord
            user_id: ID Discord de l'utilisateur (string)
            request_title: Titre du haut fait validé
            new_rank: Nouveau rang atteint (int)
        """
        try:
            user = None
            try:
                user = discord_client.get_user(int(user_id))
            except ValueError:
                logger.error(f"Invalid user_id format: {user_id}")
                return

            if not user:
                try:
                    user = await discord_client.fetch_user(int(user_id))
                except Exception:
                    logger.warning(f"Could not fetch user {user_id} for notification")
                    return
            
            # Rank names map
            ranks = {
                1: "Cliath",
                2: "Fostern",
                3: "Adren",
                4: "Athro",
                5: "Elder"
            }
            rank_name = ranks.get(new_rank, "Inconnu")
            
            message = (
                f"🐺 **Les Esprits ont entendu ton exploit !**\n\n"
                f"Ton haut fait **{request_title}** a été validé par les Anciens.\n"
                f"Ta Renommée grandit... Tu es désormais **Rang {new_rank} ({rank_name})**.\n\n"
                f"*Que Gaïa guide tes pas.*"
            )
            
            try:
                await user.send(message)
                logger.info(f"Notification sent to user {user_id} for renown approval")
            except Exception as e:
                 logger.warning(f"Could not send DM to user {user_id}: {e}")
                 # Fallback: maybe log to channel in future/feature request
                 
        except Exception as e:
            logger.exception(f"Error in send_renown_approval_notification for {user_id}")

    @staticmethod
    async def send_renown_submission_notification(bot, user_id: str, request_title: str, renown_type: str, request_id: int):
        """
        Notifie les MJs de la soumission d'un haut fait.
        """
        DEST_CHANNEL_ID = 1457856977660022844
        
        try:
            channel = bot.get_channel(DEST_CHANNEL_ID)
            if not channel:
                logger.warning(f"Channel {DEST_CHANNEL_ID} not in cache, fetching...")
                try:
                    channel = await bot.fetch_channel(DEST_CHANNEL_ID)
                except Exception as e:
                    logger.error(f"CRITICAL: Log channel {DEST_CHANNEL_ID} not found/accessible: {e}")
                    return

            # Récupérer le nom du joueur
            user_name = f"Utilisateur {user_id}"
            try:
                user = await bot.fetch_user(int(user_id))
                if user:
                    user_name = user.display_name
            except Exception:
                pass

            import discord
            embed = discord.Embed(
                title="📜 Nouveau Haut Fait Soumis",
                description=f"**Joueur :** {user_name} (<@{user_id}>)\n**Titre :** {request_title}\n**Type :** {renown_type.capitalize()}",
                color=0xFFFF00 # Jaune
            )
            embed.set_footer(text=f"ID Demande : {request_id}")
            embed.timestamp = discord.utils.utcnow()

            await channel.send(content=f"<@&{ROLE_MJ_WEREWOLF}>", embed=embed)
            logger.info(f"Renown submission notification sent to channel {DEST_CHANNEL_ID} for request {request_id}")

        except Exception as e:
            logger.exception(f"Error sending renown submission notification: {e}")

