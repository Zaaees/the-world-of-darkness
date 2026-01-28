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

class RenownType(str, Enum):
    GLORY = "Glory"
    HONOR = "Honor"
    WISDOM = "Wisdom"

class RenownStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

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

    def _fuzzy_match(self, enum_cls, value):
        if not isinstance(value, str):
            return value
        
        # Try direct
        try:
            return enum_cls(value)
        except ValueError:
            pass
            
        # Try normalized
        norm_val = value.lower().replace("_", "").replace(" ", "")
        for member in enum_cls:
            if member.value.lower().replace("_", "").replace(" ", "") == norm_val:
                return member
        
        # Return original if no match (will strict fail later or be stored as is)
        return value

    def __post_init__(self):
        self.breed = self._fuzzy_match(WerewolfBreed, self.breed)
        self.auspice = self._fuzzy_match(WerewolfAuspice, self.auspice)
        self.tribe = self._fuzzy_match(WerewolfTribe, self.tribe)

@dataclass
class WerewolfRenown:
    user_id: str
    title: str
    description: str
    renown_type: Union[RenownType, str]
    id: Optional[int] = None
    status: Union[RenownStatus, str] = RenownStatus.PENDING
    submitted_at: Optional[datetime] = None
    validated_at: Optional[datetime] = None
    validated_by: Optional[str] = None

    def __post_init__(self):
        if isinstance(self.renown_type, str):
            try:
                self.renown_type = RenownType(self.renown_type)
            except ValueError:
                pass
        if isinstance(self.status, str):
            try:
                self.status = RenownStatus(self.status)
            except ValueError:
                pass

async def create_werewolf_table(db: aiosqlite.Connection) -> None:
    """Crée la table werewolf_data si elle n'existe pas."""
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

async def create_renown_table(db: aiosqlite.Connection) -> None:
    """Crée la table werewolf_renown si elle n'existe pas."""
    await db.execute("""
        CREATE TABLE IF NOT EXISTS werewolf_renown (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            renown_type TEXT NOT NULL,
            status TEXT NOT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            validated_at TIMESTAMP,
            validated_by TEXT,
            FOREIGN KEY (user_id) REFERENCES werewolf_data(user_id)
        )
    """)
    await db.execute("CREATE INDEX IF NOT EXISTS idx_werewolf_renown_user_id ON werewolf_renown(user_id)")
    await db.commit()

async def create_werewolf_data(db: aiosqlite.Connection, data: WerewolfData) -> None:
    """Insère les données d'un nouveau personnage loup-garou."""
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
    """Récupère les données loup-garou par user_id."""
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
    Met à jour les données loup-garou, en ignorant les champs immuables et en prévenant l'injection SQL.
    Champs immuables : breed, auspice, tribe, user_id.
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

async def create_werewolf_renown(db: aiosqlite.Connection, data: WerewolfRenown) -> WerewolfRenown:
    """Insère une nouvelle demande de renommée."""
    now = datetime.now()
    if data.submitted_at is None:
        data.submitted_at = now
    
    renown_type_val = data.renown_type.value if isinstance(data.renown_type, Enum) else data.renown_type
    status_val = data.status.value if isinstance(data.status, Enum) else data.status

    cursor = await db.execute("""
        INSERT INTO werewolf_renown (
            user_id, title, description, renown_type, status, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data.user_id,
        data.title,
        data.description,
        renown_type_val,
        status_val,
        data.submitted_at
    ))
    await db.commit()
    data.id = cursor.lastrowid
    return data

async def get_werewolf_renown_by_user(db: aiosqlite.Connection, user_id: str) -> list[WerewolfRenown]:
    """Récupère toutes les demandes de renommée d'un utilisateur."""
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM werewolf_renown WHERE user_id = ?", (user_id,)) as cursor:
        rows = await cursor.fetchall()
        
        results = []
        for row in rows:
            submitted_at = row['submitted_at']
            if isinstance(submitted_at, str):
                try:
                    submitted_at = datetime.fromisoformat(submitted_at)
                except ValueError:
                    pass
            
            validated_at = row['validated_at']
            if isinstance(validated_at, str):
                try:
                    validated_at = datetime.fromisoformat(validated_at)
                except ValueError:
                    pass

            results.append(WerewolfRenown(
                id=row['id'],
                user_id=row['user_id'],
                title=row['title'],
                description=row['description'],
                renown_type=RenownType(row['renown_type']) if row['renown_type'] in [t.value for t in RenownType] else row['renown_type'],
                status=RenownStatus(row['status']) if row['status'] in [s.value for s in RenownStatus] else row['status'],
                submitted_at=submitted_at,
                validated_at=validated_at,
                validated_by=row['validated_by']
            ))
        return results

async def update_werewolf_renown(db: aiosqlite.Connection, renown_id: int, updates: Dict[str, Any]) -> None:
    """
    Met à jour une demande de renommée.
    Champs autorisés : title, description, renown_type, status, validated_at, validated_by.
    """
    ALLOWED_COLUMNS = {'title', 'description', 'renown_type', 'status', 'validated_at', 'validated_by'}
    
    valid_updates = {k: v for k, v in updates.items() if k in ALLOWED_COLUMNS}
    
    if not valid_updates:
         logger.warning(f"Update attempt for renown {renown_id} contained no valid fields.")
         return

    # Enum handling
    if 'renown_type' in valid_updates and isinstance(valid_updates['renown_type'], Enum):
        valid_updates['renown_type'] = valid_updates['renown_type'].value
    if 'status' in valid_updates and isinstance(valid_updates['status'], Enum):
        valid_updates['status'] = valid_updates['status'].value

    set_clause = ", ".join([f"{k} = ?" for k in valid_updates.keys()])
    values = list(valid_updates.values())
    values.append(renown_id)
    

@dataclass
class WerewolfPlayerGift:
    user_id: str
    gift_id: str
    unlocked_by: str
    unlocked_at: Optional[datetime] = None

async def create_player_gifts_table(db: aiosqlite.Connection) -> None:
    """Crée la table werewolf_player_gifts si elle n'existe pas."""
    await db.execute("""
        CREATE TABLE IF NOT EXISTS werewolf_player_gifts (
            user_id TEXT NOT NULL,
            gift_id TEXT NOT NULL,
            unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            unlocked_by TEXT NOT NULL,
            PRIMARY KEY (user_id, gift_id),
            FOREIGN KEY (user_id) REFERENCES werewolf_data(user_id)
        )
    """)
    await db.execute("CREATE INDEX IF NOT EXISTS idx_werewolf_player_gifts_user_id ON werewolf_player_gifts(user_id)")
    await db.commit()

async def get_all_werewolves(db: aiosqlite.Connection) -> list[WerewolfData]:
    """Récupère tous les personnages loup-garou."""
    db.row_factory = aiosqlite.Row
    async with db.execute("SELECT * FROM werewolf_data") as cursor:
        rows = await cursor.fetchall()
        
        results = []
        for row in rows:
            # Handle datetime conversion
            created_at = row['created_at']
            if isinstance(created_at, str):
                try:
                    created_at = datetime.fromisoformat(created_at)
                except ValueError:
                    pass
            
            updated_at = row['updated_at']
            if isinstance(updated_at, str):
                try:
                    updated_at = datetime.fromisoformat(updated_at)
                except ValueError:
                    pass

            results.append(WerewolfData(
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
            ))
        return results
