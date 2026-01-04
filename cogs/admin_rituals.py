import discord
from discord.ext import commands
import json
import os

# Role ID allowed to use admin commands
MJ_ROLE_ID = 1454188335957282897
# Path to player data (adjust based on your actual data structure)
DATA_PATH = "data/players.json"

class Admin(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    def is_mj(self, ctx):
        """Check if the user has the MJ role."""
        if not ctx.guild:
            return False
        role = ctx.guild.get_role(MJ_ROLE_ID)
        return role in ctx.author.roles

    @commands.command(name="grant_ritual")
    async def grant_ritual(self, ctx, member: discord.Member, ritual_id: str):
        """
        Donne un rituel à un joueur.
        Usage: !grant_ritual @Joueur ritual_id
        """
        # 1. Check permissions
        if not self.is_mj(ctx):
            await ctx.send("⛔ Vous n'avez pas la permission d'utiliser cette commande.")
            return
            
        # 2. Add to database
        from utils.database import add_player_ritual
        
        success = await add_player_ritual(member.id, ctx.guild.id, ritual_id)
        
        if success:
            await ctx.send(f"✅ Le rituel `{ritual_id}` a été ajouté au grimoire de {member.mention}.")
        else:
            await ctx.send(f"⚠️ {member.display_name} connaît déjà le rituel `{ritual_id}`.")

    # Commande pour lister les rituels d'un joueur (utile pour débug/check)
    @commands.command(name="list_rituals")
    async def list_rituals(self, ctx, member: discord.Member):
        """Affiche les rituels connus par un joueur."""
        if not self.is_mj(ctx):
            return

        from utils.database import get_player_rituals
        rituals = await get_player_rituals(member.id, ctx.guild.id)
        
        if not rituals:
             await ctx.send(f"{member.display_name} ne connaît aucun rituel.")
        else:
             await ctx.send(f"📜 **Grimoire de {member.display_name}** ({len(rituals)}):\n" + ", ".join(f"`{r}`" for r in rituals))

async def setup(bot):
    await bot.add_cog(Admin(bot))
