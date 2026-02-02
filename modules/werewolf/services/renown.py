from typing import Dict, Any, Optional
from datetime import datetime
import logging

from modules.werewolf.models.renown import (
    RenownRequest, 
    RenownType, 
    RenownStatus, 
    create_renown_request
)
from modules.werewolf.models.store import (
    get_werewolf_data,
    update_werewolf_data,
    WerewolfData,
    WerewolfAuspice
)

# W20 Rank Requirements
# For Ragabash, requirements are TOTAL renown (any combination).
# For others, requirements are specific (Glory, Honor, Wisdom).
RANK_RULES = {
    WerewolfAuspice.RAGABASH: {
        1: {"total": 3},
        2: {"total": 7},
        3: {"total": 13},
        4: {"total": 19},
        5: {"total": 25}
    },
    WerewolfAuspice.THEURGE: {
        1: {"glory": 0, "honor": 0, "wisdom": 3},
        2: {"glory": 1, "honor": 0, "wisdom": 5},
        3: {"glory": 2, "honor": 1, "wisdom": 7},
        4: {"glory": 4, "honor": 2, "wisdom": 9},
        5: {"glory": 4, "honor": 9, "wisdom": 10}
    },
    WerewolfAuspice.PHILODOX: {
        1: {"glory": 0, "honor": 3, "wisdom": 0},
        2: {"glory": 1, "honor": 4, "wisdom": 1},
        3: {"glory": 2, "honor": 6, "wisdom": 2},
        4: {"glory": 3, "honor": 8, "wisdom": 4},
        5: {"glory": 4, "honor": 10, "wisdom": 9}
    },
    WerewolfAuspice.GALLIARD: {
        1: {"glory": 2, "honor": 0, "wisdom": 1},
        2: {"glory": 4, "honor": 0, "wisdom": 2},
        3: {"glory": 4, "honor": 2, "wisdom": 4},
        4: {"glory": 7, "honor": 2, "wisdom": 6},
        5: {"glory": 9, "honor": 5, "wisdom": 9}
    },
    WerewolfAuspice.AHROUN: {
        1: {"glory": 2, "honor": 1, "wisdom": 0},
        2: {"glory": 4, "honor": 1, "wisdom": 1},
        3: {"glory": 6, "honor": 3, "wisdom": 1},
        4: {"glory": 9, "honor": 5, "wisdom": 2},
        5: {"glory": 10, "honor": 9, "wisdom": 4}
    }
}

class RankCalculator:
    @staticmethod
    def calculate_rank(auspice: WerewolfAuspice, glory: int, honor: int, wisdom: int) -> int:
        """
        Calcule le rang basé sur l'Auspice et les types de renommée.
        Retourne le rang le plus élevé atteint (1 à 5).
        Retourne 0 si les prérequis de Rang 1 ne sont pas atteints (ex: Cub).
        """
        # Ensure auspice is Enum (it currently comes as string from DB sometimes if not parsed, 
        # but our tests pass Enum. Safety check handled by type hinting but runtime might need check if called directly)
        
        # We check ranks from 5 down to 1
        for rank in range(5, 0, -1):
            reqs = RANK_RULES.get(auspice, {}).get(rank)
            if not reqs:
                continue
                
            if auspice == WerewolfAuspice.RAGABASH:
                # Ragabash rule: "Any combination" summing to total
                total_renown = glory + honor + wisdom
                if total_renown >= reqs["total"]:
                    return rank
            else:
                # Proper strict rule
                if (glory >= reqs["glory"] and 
                    honor >= reqs["honor"] and 
                    wisdom >= reqs["wisdom"]):
                    return rank
                    
        return 0 # Less than Rank 1 (Cub)


logger = logging.getLogger(__name__)

class RenownService:
    def __init__(self, db):
        self.db = db

    async def submit_request(self, user_id: str, data: Dict[str, Any]) -> RenownRequest:
        """
        Soumet une demande de renommée.
        
        Args:
            user_id: ID Discord de l'utilisateur
            data: Dictionnaire contenant 'title', 'description', 'type'
            
        Returns:
            La requête créée
            
        Raises:
            ValueError: Si les données sont invalides
        """
        title = data.get('title')
        description = data.get('description')
        renown_type_str = data.get('renown_type') or data.get('type')

        if not title:
            raise ValueError("Le titre est requis")
        if not description:
            raise ValueError("La description est requise")
        if not renown_type_str:
            raise ValueError("Le type de renommée est requis")

        try:
            renown_type = RenownType(renown_type_str.lower())
        except ValueError:
            raise ValueError(f"Type de renommée invalide: {renown_type_str}")

        request = RenownRequest(
            user_id=user_id,
            title=title,
            description=description,
            renown_type=renown_type,
            status=RenownStatus.PENDING,
            submitted_at=datetime.now()
        )

        created_request = await create_renown_request(self.db, request)
        logger.info(f"Renown request created for user {user_id}: {title} ({renown_type.value})")
        
        return created_request

    async def get_all_requests(self, status: Optional[RenownStatus] = None) -> list[RenownRequest]:
        """
        Récupère toutes les demandes de renommée, triées par date (plus anciennes en premier).
        
        Args:
            status: Filtrer par statut (optionnel)
            
        Returns:
            Liste des RenownRequest
        """
        query = "SELECT * FROM werewolf_renown_requests"
        params = []
        
        if status:
            query += " WHERE status = ?"
            params.append(status.value)
            
        query += " ORDER BY submitted_at ASC"
        
        async with self.db.execute(query, params) as cursor:
            rows = await cursor.fetchall()
            return [RenownRequest.from_row(row) for row in rows]

    async def update_request_status(self, request_id: int, status: RenownStatus, validator_id: str) -> Optional[RenownRequest]:
        """
        Met à jour le statut d'une demande.
        
        Args:
            request_id: ID de la demande
            status: Nouveau statut (APPROVED ou REJECTED)
            validator_id: ID Discord du validateur (MJ)
            
        Returns:
            La demande mise à jour ou None si non trouvée
        """
        # Vérifier si la demande existe
        async with self.db.execute("SELECT * FROM werewolf_renown_requests WHERE id = ?", (request_id,)) as cursor:
            row = await cursor.fetchone()
            if not row:
                return None
                
        # Update db
        query = """
            UPDATE werewolf_renown_requests 
            SET status = ?, reviewer_id = ?
            WHERE id = ?
        """
        await self.db.execute(query, (status.value, validator_id, request_id))
        await self.db.commit()
        
        # Return updated object
        async with self.db.execute("SELECT * FROM werewolf_renown_requests WHERE id = ?", (request_id,)) as cursor:
            row = await cursor.fetchone()
            updated_request = RenownRequest.from_row(row)
            
            logger.info(f"Renown request {request_id} updated to {status.value} by {validator_id}")
            return updated_request

    async def update_player_rank(self, user_id: str, new_rank: int) -> None:
        """Met à jour le rang du joueur dans la DB."""
        await update_werewolf_data(self.db, user_id, {"rank": new_rank})
        logger.info(f"Updated user {user_id} rank to {new_rank}")


    async def get_player_renown_totals(self, user_id: str) -> Dict[str, int]:
        """
        Récupère les totaux de renommée (Gloire, Honneur, Sagesse) pour un joueur.
        Basé sur les demandes APPROUVÉES.
        """
        query = """
            SELECT renown_type, COUNT(*) 
            FROM werewolf_renown_requests 
            WHERE user_id = ? AND status = ?
            GROUP BY renown_type
        """
        
        totals = {"glory": 0, "honor": 0, "wisdom": 0}
        
        async with self.db.execute(query, (user_id, RenownStatus.APPROVED.value)) as cursor:
            rows = await cursor.fetchall()
            for row in rows:
                r_type = row[0]
                count = row[1]
                
                # Normalize type string just in case
                if r_type == RenownType.GLORY.value:
                    totals["glory"] = count
                elif r_type == RenownType.HONOR.value:
                    totals["honor"] = count
                elif r_type == RenownType.WISDOM.value:
                    totals["wisdom"] = count
                    
        return totals

    async def recalculate_player_rank(self, user_id: str) -> int:
        """
        Recalcule le rang du joueur basé sur ses demandes validées et son Auspice.
        Met à jour la DB si le rang change.
        Retourne le rang final (nouveau ou actuel).
        """
        # 1. Get user data for Auspice
        user_data = await get_werewolf_data(self.db, user_id)
        if not user_data:
            logger.warning(f"Could not find werewolf data for user {user_id} during rank recalc")
            return 1
            
        auspice = user_data.auspice
        
        # 2. Get approved renown counts
        totals = await self.get_player_renown_totals(user_id)
        glory = totals["glory"]
        honor = totals["honor"]
        wisdom = totals["wisdom"]
                    
        # 3. Calculate rank
        new_rank = RankCalculator.calculate_rank(auspice, glory, honor, wisdom)
        
        # 4. Update if different
        if user_data.rank != new_rank:
            await self.update_player_rank(user_id, new_rank)
            
        return new_rank

