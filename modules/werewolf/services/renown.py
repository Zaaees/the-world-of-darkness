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
    WerewolfData
)

class RankCalculator:
    @staticmethod
    def calculate_rank(total_renown: int) -> int:
        """
        Calcule le rang basé sur la renommée totale.
        0-2: Rank 1 (Cliath)
        3-9: Rank 2 (Fostern)
        10-19: Rank 3 (Adren)
        20-29: Rank 4 (Athro)
        30+: Rank 5 (Elder)
        """
        if total_renown >= 30:
            return 5
        elif total_renown >= 20:
            return 4
        elif total_renown >= 10:
            return 3
        elif total_renown >= 3:
            return 2
        else:
            return 1


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

    async def recalculate_player_rank(self, user_id: str) -> int:
        """
        Recalcule le rang du joueur basé sur ses demandes validées.
        Met à jour la DB si le rang change.
        Retourne le rang final (nouveau ou actuel).
        """
        # 1. Get all approved requests
        query = """
            SELECT COUNT(*) 
            FROM werewolf_renown 
            WHERE user_id = ? AND status = ?
        """
        async with self.db.execute(query, (user_id, RenownStatus.APPROVED.value)) as cursor:
            row = await cursor.fetchone()
            total_renown = row[0] if row else 0
            
        # 2. Calculate theoretical rank
        new_rank = RankCalculator.calculate_rank(total_renown)
        
        # 3. Check current rank
        current_data = await get_werewolf_data(self.db, user_id)
        if not current_data:
            logger.warning(f"Could not find werewolf data for user {user_id} during rank recalc")
            # Fallback or assume calculation is correct and we implicitly 'init' rank?
            # But we can't update if no user data.
            return 1 # Default
            
        if current_data.rank != new_rank:
            # 4. Update if different
            await self.update_player_rank(user_id, new_rank)
            
        return new_rank

