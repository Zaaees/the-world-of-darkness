from dataclasses import dataclass, field
from enum import Enum, auto
from datetime import datetime
from typing import Optional, List
import json
import logging

logger = logging.getLogger(__name__)

class RenownType(Enum):
    GLORY = "glory"
    HONOR = "honor"
    WISDOM = "wisdom"

class RenownStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

from datetime import datetime, timezone

@dataclass
class RenownRequest:
    user_id: str
    title: str
    description: str
    renown_type: RenownType
    status: RenownStatus = RenownStatus.PENDING
    submitted_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    id: Optional[int] = None
    reviewer_id: Optional[str] = None
    review_func: Optional[str] = None
    rejection_reason: Optional[str] = None
    xp_awarded: int = 0

    @classmethod
    def from_row(cls, row):
        # Handle aiosqlite Row or tuple
        # Columns: id, user_id, title, description, renown_type, status, submitted_at, ...
        # Based on create_renown_request insert order and table definition
        try:
            # Check if row is dict-like (Row) or tuple
            if hasattr(row, 'keys'):
                d = dict(row)
                r_id = d['id']
                u_id = d['user_id']
                tit = d['title']
                desc = d['description']
                r_type = d['renown_type']
                stat = d['status']
                sub_at = d['submitted_at']
                rev_id = d.get('reviewer_id')
                rev_func = d.get('review_func')
                rej = d.get('rejection_reason')
                xp = d.get('xp_awarded', 0)
            else:
                # Fallback to index based on table schema in create_renown_table
                r_id = row[0]
                u_id = row[1]
                tit = row[2]
                desc = row[3]
                r_type = row[4]
                stat = row[5]
                sub_at = row[6]
                rev_id = row[7] if len(row) > 7 else None
                rev_func = row[8] if len(row) > 8 else None
                rej = row[9] if len(row) > 9 else None
                xp = row[10] if len(row) > 10 else 0

            # Convert Enums
            try:
                type_enum = RenownType(r_type)
            except ValueError:
                type_enum = RenownType.GLORY # Fallback or error

            try:
                status_enum = RenownStatus(stat)
            except ValueError:
                status_enum = RenownStatus.PENDING

            # Convert Date
            if isinstance(sub_at, str):
                try:
                    dt = datetime.fromisoformat(sub_at)
                except ValueError:
                    # Try other formats if needed
                    dt = datetime.now(timezone.utc)
            else:
                dt = sub_at

            return cls(
                id=r_id,
                user_id=u_id,
                title=tit,
                description=desc,
                renown_type=type_enum,
                status=status_enum,
                submitted_at=dt,
                reviewer_id=rev_id,
                review_func=rev_func,
                rejection_reason=rej,
                xp_awarded=xp
            )
        except Exception as e:
            logger.error(f"Failed to map row to RenownRequest: {e}")
            raise
async def create_renown_table(db):
    """Crée la table pour les demandes de renommée."""
    await db.execute("""
        CREATE TABLE IF NOT EXISTS werewolf_renown_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            renown_type TEXT NOT NULL,
            status TEXT NOT NULL,
            submitted_at TIMESTAMP NOT NULL,
            reviewer_id TEXT,
            review_func TEXT,
            rejection_reason TEXT,
            xp_awarded INTEGER DEFAULT 0
        )
    """)
    await db.commit()

async def create_renown_request(db, request: RenownRequest) -> RenownRequest:
    """Crée une nouvelle demande de renommée."""
    cursor = await db.execute("""
        INSERT INTO werewolf_renown_requests 
        (user_id, title, description, renown_type, status, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        request.user_id,
        request.title,
        request.description,
        request.renown_type.value,
        request.status.value,
        request.submitted_at
    ))
    
    request.id = cursor.lastrowid
    await db.commit()
    return request

async def get_renown_requests_by_user(db, user_id: str) -> List[RenownRequest]:
    """Récupère les demandes de renommée d'un utilisateur."""
    db.row_factory =  lambda cursor, row: row # Raw tuple access
    # Note: caller typically handles row_factory or we set it globally. 
    # For now let's assume we get rows and map them.
    
    async with db.execute(
        "SELECT * FROM werewolf_renown_requests WHERE user_id = ? ORDER BY submitted_at DESC", 
        (user_id,)
    ) as cursor:
        rows = await cursor.fetchall()
        
        requests = []
        for row in rows:
            # Assuming row is accessible by index if no factory, or name if factory.
            # To be safe with aiosqlite default which returns tuples:
            # id, user_id, title, description, renown_type, status, submitted_at, ...
            
            # Map valid renown types/status strings back to Enums safely
            try:
                r_type = RenownType(row[4])
                r_status = RenownStatus(row[5])
                
                # Parse timestamp - aiosqlite might return string or datetime depending on converters
                # usually string 'YYYY-MM-DD HH:MM:SS.ssssss'
                submitted_val = row[6]
                if isinstance(submitted_val, str):
                    try:
                        submitted_at = datetime.fromisoformat(submitted_val)
                    except ValueError:
                         # Fallback for simple SQLite dates
                         submitted_at = datetime.strptime(submitted_val, "%Y-%m-%d %H:%M:%S.%f")
                else:
                    submitted_at = submitted_val

                req = RenownRequest(
                    id=row[0],
                    user_id=row[1],
                    title=row[2],
                    description=row[3],
                    renown_type=r_type,
                    status=r_status,
                    submitted_at=submitted_at,
                    reviewer_id=row[7],
                    review_func=row[8],
                    rejection_reason=row[9],
                    xp_awarded=row[10]
                )
                requests.append(req)
            except Exception as e:
                logger.error(f"Error parsing renown request row {row}: {e}")
                continue
                
        return requests
