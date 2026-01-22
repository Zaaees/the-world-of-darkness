import aiosqlite
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any, Union
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class WerewolfBreed(str, Enum):
    HOMID = "Homid"
    METIS = "Metis"
    LUPUS = "Lupus"

class WerewolfAuspice(str, Enum):
    RAGABASH = "Ragabash"
    THEURGE = "Theurge"
    PHILODOX = "Philodox"
    GALLIARD = "Galliard"
    AHROUN = "Ahroun"

class WerewolfTribe(str, Enum):
    BLACK_FURIES = "Black Furies"
    BONE_GNAWERS = "Bone Gnawers"
    CHILDREN_OF_GAIA = "Children of Gaia"
    FIANNA = "Fianna"
    GET_OF_FENRIS = "Get of Fenris"
    GLASS_WALKERS = "Glass Walkers"
    RED_TALONS = "Red Talons"
    SHADOW_LORDS = "Shadow Lords"
    SILENT_STRIDERS = "Silent Striders"
    SILVER_FANGS = "Silver Fangs"
    STARGAZERS = "Stargazers"
    UKTENA = "Uktena"
    WENDIGO = "Wendigo"
    # Adding generic/unknown for fallback if needed, or stick to strict canonical list
    RONIN = "Ronin" 

@dataclass
class WerewolfData:
    user_id: str
    breed: Union[WerewolfBreed, str]
    auspice: Union[WerewolfAuspice, str]
    tribe: Union[WerewolfTribe, str]
    name: str
    story: Optional[str] = None
    rank: int = 1
    discord_thread_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        # Validate Enums if passed as strings
        if isinstance(self.breed, str):
            try:
                self.breed = WerewolfBreed(self.breed)
            except ValueError:
                pass # Keep as string if it violates enum? Or raise error? Sticking to loose for now but preferring Enum
        if isinstance(self.auspice, str):
            try:
                self.auspice = WerewolfAuspice(self.auspice)
            except ValueError:
                pass
        if isinstance(self.tribe, str):
            try:
                self.tribe = WerewolfTribe(self.tribe)
            except ValueError:
                pass

async def create_werewolf_table(db: aiosqlite.Connection) -> None:
    """Creates the werewolf_data table if it doesn't exist."""
    await db.execute("""
        CREATE TABLE IF NOT EXISTS werewolf_data (
            user_id TEXT PRIMARY KEY,
            breed TEXT NOT NULL,
            auspice TEXT NOT NULL,
            tribe TEXT NOT NULL,
            name TEXT NOT NULL,
            story TEXT,
            rank INTEGER DEFAULT 1,
            discord_thread_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    await db.commit()

async def create_werewolf_data(db: aiosqlite.Connection, data: WerewolfData) -> None:
    """Inserts a new werewolf character data."""
    now = datetime.now()
    
    # Ensure values are strings for DB storage
    breed_val = data.breed.value if isinstance(data.breed, Enum) else data.breed
    auspice_val = data.auspice.value if isinstance(data.auspice, Enum) else data.auspice
    tribe_val = data.tribe.value if isinstance(data.tribe, Enum) else data.tribe

    await db.execute("""
        INSERT INTO werewolf_data (
            user_id, breed, auspice, tribe, name, story, rank, discord_thread_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.user_id,
        breed_val,
        auspice_val,
        tribe_val,
        data.name,
        data.story,
        data.rank,
        data.discord_thread_id,
        now,
        now
    ))
    await db.commit()

async def get_werewolf_data(db: aiosqlite.Connection, user_id: str) -> Optional[WerewolfData]:
    """Retrieves werewolf data by user_id."""
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM werewolf_data WHERE user_id = ?", (user_id,)) as cursor:
        row = await cursor.fetchone()
        if not row:
            return None
        
        # Handle datetime conversion (sqlite returns string usually unless adapter is registered)
        created_at = row['created_at']
        if isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at)
            except ValueError:
                pass # Keep as original if parse fails
        
        updated_at = row['updated_at']
        if isinstance(updated_at, str):
            try:
                updated_at = datetime.fromisoformat(updated_at)
            except ValueError:
                pass

        return WerewolfData(
            user_id=row['user_id'],
            breed=WerewolfBreed(row['breed']) if row['breed'] in [b.value for b in WerewolfBreed] else row['breed'],
            auspice=WerewolfAuspice(row['auspice']) if row['auspice'] in [a.value for a in WerewolfAuspice] else row['auspice'],
            tribe=WerewolfTribe(row['tribe']) if row['tribe'] in [t.value for t in WerewolfTribe] else row['tribe'],
            name=row['name'],
            story=row['story'],
            rank=row['rank'],
            discord_thread_id=row['discord_thread_id'],
            created_at=created_at,
            updated_at=updated_at
        )

async def update_werewolf_data(db: aiosqlite.Connection, user_id: str, updates: Dict[str, Any]) -> None:
    """
    Updates werewolf data, ignoring immutable fields and preventing SQL injection.
    Immutable fields: breed, auspice, tribe, user_id.
    """
    
    # Whitelist of allowed columns to update
    ALLOWED_UPDATE_COLUMNS = {'name', 'story', 'rank', 'discord_thread_id'}
    
    valid_updates = {k: v for k, v in updates.items() if k in ALLOWED_UPDATE_COLUMNS}
    
    if not valid_updates:
        logger.warning(f"Update attempt for {user_id} contained no valid fields. Original updates: {updates.keys()}")
        return

    valid_updates['updated_at'] = datetime.now()
    
    # Construire la requête de manière sûre car les clés sont validées par la whitelist
    set_clause = ", ".join([f"{k} = ?" for k in valid_updates.keys()])
    values = list(valid_updates.values())
    values.append(user_id)
    
    await db.execute(f"UPDATE werewolf_data SET {set_clause} WHERE user_id = ?", values)
    await db.commit()
