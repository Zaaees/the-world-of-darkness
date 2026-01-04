import discord
from discord.ext import commands
import json
import os

# Role ID allowed to use admin commands
# Role ID allowed to use admin commands
MJ_ROLE_ID = 1454188335957282897
# Path to player data (adjust based on your actual data structure)
DATA_PATH = "data/players.json"

ALL_RITUALS = [
    # Niveau 1
    "blood_walk", "comm_sire", "def_havre", "deflect_doom", "detect_lineage", 
    "wake_fresheness", "shepherd_chant", "preserve_blood", "purity_flesh", 
    "blood_insight", "sense_garou", "seal_interdict", "touch_phenom",
    # Niveau 2
    "call_lustral", "blessing_trench", "bureaucratic_bull", "focus_blood", 
    "extinguish_flames", "burning_blade", "blood_lineage", "curse_failure", 
    "shadow_walk", "ward_ghoul", "reciprocal_bite", "blood_invis",
    # Niveau 3
    "friend_blood", "shield_presence", "incorporeal_passage", "dry_hands", 
    "mirror_narcissus", "pavan_chalice", "viper_skin", "ward_lupines", 
    "shaft_belated", "seal_ambrosia", "sign_dread", "transmute_water",
    # Niveau 4
    "clash_atom", "heart_stone", "infusion_water", "invis_bond", "cursed_bond", 
    "bone_lies", "ward_kindred", "recall_soul", "seal_passage", "leach_vitae",
    # Niveau 5
    "abandon_fetters", "change_blood", "blood_contract", "crown_thorns", 
    "escape_friend", "homunculus", "curse_clay", "ward_spirits", "ward_ghosts", 
    "blood_potence", "stone_victory",
    # Supérieur
    "armor_efficacy", "ward_demons", "divine_lineage", "chain_bloodline", "witch_transform",
    # Nécromancie
    "call_beacon", "eyes_grave", "hand_glory", "ritual_pneuma", "cadaver_touch", "lich_transcendence"
]

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

    @commands.command(name="caïn")
    async def cain(self, ctx, member: discord.Member):
        """
        Donne TOUS les rituels à un joueur (Mode Dieu).
        Usage: !caïn @Joueur
        """
        if not self.is_mj(ctx):
            await ctx.send("⛔ Vous n'avez pas la permission.")
            return

        from utils.database import add_player_ritual
        
        msg = await ctx.send(f"⏳ Don de l'omniscience à {member.display_name} en cours...")
        
        count = 0
        for r in ALL_RITUALS:
            if await add_player_ritual(member.id, ctx.guild.id, r):
                count += 1
                
        await msg.edit(content=f"🩸 **Fait.** {member.mention} connaît maintenant {count} nouveaux rituels (Total: {len(ALL_RITUALS)}).")

async def setup(bot):
    await bot.add_cog(Admin(bot))
