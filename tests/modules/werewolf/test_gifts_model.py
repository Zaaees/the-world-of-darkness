import pytest
import aiosqlite
import os
from modules.werewolf.models.store import create_player_gifts_table, create_werewolf_table

# On utilise pytest-asyncio pour les tests asynchrones
pytestmark = pytest.mark.asyncio

class TestGiftsModelIntegration:
    
    @pytest.fixture
    async def db_conn(self):
        # Utilisation d'une base en mémoire pour les tests
        async with aiosqlite.connect(':memory:') as conn:
            # Créer la table werewolf_data car elle est référencée par une FK
            await create_werewolf_table(conn)
            # Créer la table des dons
            await create_player_gifts_table(conn)
            yield conn

    @pytest.mark.asyncio
    async def test_player_gifts_table_exists(self, db_conn):
        """
        Vérifie que la table 'werewolf_player_gifts' existe dans le schéma.
        """
        async with db_conn.execute("SELECT count(*) FROM werewolf_player_gifts") as cursor:
            count = await cursor.fetchone()
            assert count[0] == 0

    @pytest.mark.asyncio
    async def test_insert_unlocked_gift(self, db_conn):
        """
        Teste l'insertion d'un don débloqué dans la table.
        """
        # On doit d'abord insérer un utilisateur dans werewolf_data à cause de la FK
        await db_conn.execute(
            "INSERT INTO werewolf_data (user_id, breed, auspice, tribe, name) VALUES (?, ?, ?, ?, ?)",
            ("12345", "Homid", "Ragabash", "Black Furies", "Test Garou")
        )
        await db_conn.commit()

        user_id = "12345"
        gift_id = "gift_persuasion_1"
        admin_id = "999"
        
        await db_conn.execute(
            "INSERT INTO werewolf_player_gifts (user_id, gift_id, unlocked_by) VALUES (?, ?, ?)",
            (user_id, gift_id, admin_id)
        )
        await db_conn.commit()
             
        async with db_conn.execute("SELECT count(*) FROM werewolf_player_gifts WHERE user_id = ?", (user_id,)) as cursor:
            count = await cursor.fetchone()
            assert count[0] == 1

    @pytest.mark.asyncio
    async def test_fetch_player_gifts(self, db_conn):
        """
        Teste la récupération des dons pour un joueur spécifique.
        """
        await db_conn.execute(
            "INSERT INTO werewolf_data (user_id, breed, auspice, tribe, name) VALUES (?, ?, ?, ?, ?)",
            ("12345", "Homid", "Ragabash", "Black Furies", "Test Garou")
        )
        await db_conn.commit()

        user_id = "12345"
        await db_conn.execute(
            "INSERT INTO werewolf_player_gifts (user_id, gift_id, unlocked_by) VALUES (?, ?, ?)",
            (user_id, "gift_1", "admin")
        )
        await db_conn.commit()

        db_conn.row_factory = aiosqlite.Row
        async with db_conn.execute("SELECT * FROM werewolf_player_gifts WHERE user_id = ?", (user_id,)) as cursor:
             results = await cursor.fetchall()
             assert len(results) == 1
             assert results[0]['gift_id'] == "gift_1"
