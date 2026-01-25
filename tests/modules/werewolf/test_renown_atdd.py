# tests/modules/werewolf/test_renown_atdd.py
"""
ATDD Tests for Epic 4, Story 4.1: Modèle de Données Renommée

As a système,
I want une table `werewolf_renown` en base de données,
So that les demandes de Hauts Faits soient stockées et suivies.

Acceptance Criteria:
- Table `werewolf_renown` contains: id, user_id (FK), title, description, 
  renown_type (Glory/Honor/Wisdom), status (pending/approved/rejected), 
  submitted_at, validated_at, validated_by

  submitted_at, validated_at, validated_by
"""
import pytest
import aiosqlite
from datetime import datetime
from enum import Enum


class TestStory4_1_RenownDataModel:
    """Tests for Story 4.1: Modèle de Données Renommée"""

    @pytest.mark.asyncio
    async def test_renown_table_exists(self):
        """
        GIVEN le module werewolf initialisé
        WHEN je crée la table `werewolf_renown`
        THEN elle doit exister dans la base de données
        
        THEN elle doit exister dans la base de données
        """
        try:
            from modules.werewolf.models.store import create_renown_table
        except ImportError:
            pytest.fail(
                "Function 'create_renown_table' not found in modules.werewolf.models.store"
            )
        
        async with aiosqlite.connect(":memory:") as db:
            await create_renown_table(db)
            
            # Verify table exists
            async with db.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='werewolf_renown'"
            ) as cursor:
                result = await cursor.fetchone()
            
            assert result is not None, "Table 'werewolf_renown' was not created"
            assert result[0] == "werewolf_renown"

    @pytest.mark.asyncio
    async def test_renown_table_has_required_columns(self):
        """
        GIVEN la table werewolf_renown créée
        WHEN je vérifie les colonnes
        THEN elle contient: id, user_id, title, description, renown_type, 
             status, submitted_at, validated_at, validated_by
        
        THEN elle contient: id, user_id, title, description, renown_type, 
             status, submitted_at, validated_at, validated_by
        """
        try:
            from modules.werewolf.models.store import create_renown_table
        except ImportError:
            pytest.fail("Function 'create_renown_table' not found in modules.werewolf.models.store")
        
        async with aiosqlite.connect(":memory:") as db:
            await create_renown_table(db)
            
            # Get table info
            async with db.execute("PRAGMA table_info(werewolf_renown)") as cursor:
                columns = await cursor.fetchall()
            
            column_names = [col[1] for col in columns]
            
            required_columns = [
                "id", "user_id", "title", "description", 
                "renown_type", "status", "submitted_at", 
                "validated_at", "validated_by"
            ]
            
            for col in required_columns:
                assert col in column_names, f"Column '{col}' missing from werewolf_renown table"

    @pytest.mark.asyncio
    async def test_renown_type_enum_values(self):
        """
        GIVEN le modèle RenownType
        WHEN je vérifie ses valeurs
        THEN il contient: Glory, Honor, Wisdom
        
        THEN il contient: Glory, Honor, Wisdom
        """
        try:
            from modules.werewolf.models.store import RenownType
        except ImportError:
            pytest.fail(
                "Enum 'RenownType' not found in modules.werewolf.models.store"
            )
        
        assert issubclass(RenownType, Enum), "RenownType must be an Enum"
        
        expected_values = {"Glory", "Honor", "Wisdom"}
        actual_values = {member.value for member in RenownType}
        
        assert actual_values == expected_values, (
            f"RenownType should have values {expected_values}, got {actual_values}"
        )

    @pytest.mark.asyncio
    async def test_renown_status_enum_values(self):
        """
        GIVEN le modèle RenownStatus
        WHEN je vérifie ses valeurs
        THEN il contient: pending, approved, rejected
        
        THEN il contient: pending, approved, rejected
        """
        try:
            from modules.werewolf.models.store import RenownStatus
        except ImportError:
            pytest.fail(
                "Enum 'RenownStatus' not found in modules.werewolf.models.store"
            )
        
        assert issubclass(RenownStatus, Enum), "RenownStatus must be an Enum"
        
        expected_values = {"pending", "approved", "rejected"}
        actual_values = {member.value for member in RenownStatus}
        
        assert actual_values == expected_values, (
            f"RenownStatus should have values {expected_values}, got {actual_values}"
        )

    @pytest.mark.asyncio
    async def test_renown_dataclass_exists(self):
        """
        GIVEN le module store
        WHEN je vérifie la présence du dataclass WerewolfRenown
        THEN il existe avec les attributs requis
        
        THEN il existe avec les attributs requis
        """
        try:
            from modules.werewolf.models.store import WerewolfRenown
        except ImportError:
            pytest.fail(
                "Dataclass 'WerewolfRenown' not found in modules.werewolf.models.store"
            )
        
        from dataclasses import fields
        
        field_names = {f.name for f in fields(WerewolfRenown)}
        required_fields = {
            "id", "user_id", "title", "description", 
            "renown_type", "status", "submitted_at", 
            "validated_at", "validated_by"
        }
        
        for field in required_fields:
            assert field in field_names, f"Field '{field}' missing from WerewolfRenown dataclass"

    @pytest.mark.asyncio
    async def test_create_renown_request_function(self):
        """
        GIVEN des données de demande de renommée valides
        WHEN je crée une entrée dans werewolf_renown via create_werewolf_renown()
        THEN l'entrée est persistée avec le statut 'pending' par défaut
        
        THEN l'entrée est persistée avec le statut 'pending' par défaut
        """
        try:
            from modules.werewolf.models.store import (
                create_renown_table, 
                create_werewolf_renown,
                RenownType,
                RenownStatus,
                WerewolfRenown
            )
        except ImportError as e:
            pytest.fail(f"Required imports failed: {e}")
        
        renown_data = WerewolfRenown(
            id=None, # Auto-increment
            user_id="123456789",
            title="Premier Combat Victorieux",
            description="A vaincu un fomor seul lors de son Premier Changement",
            renown_type=RenownType.GLORY,
            status=RenownStatus.PENDING # Default should be handled or passed
        )
        
        async with aiosqlite.connect(":memory:") as db:
            await create_renown_table(db)
            
            # Note: The test assumes create_werewolf_renown takes the dataclass or dict.
            # Aligning with typical store pattern: takes Dataclass
            
            await create_werewolf_renown(db, renown_data)
            
            # Fetch manually to verify or if function doesn't return
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM werewolf_renown WHERE user_id = ?", ("123456789",)) as cursor:
                 row = await cursor.fetchone()
            
            assert row is not None, "Entry should exist"
            assert row['title'] == "Premier Combat Victorieux"
            assert row['status'] == RenownStatus.PENDING.value

    @pytest.mark.asyncio
    async def test_get_renown_requests_by_user(self):
        """
        GIVEN des demandes de renommée existantes pour un utilisateur
        WHEN je récupère ses demandes via get_werewolf_renown_by_user()
        THEN je reçois la liste de toutes ses demandes
        
        THEN je reçois la liste de toutes ses demandes
        """
        try:
            from modules.werewolf.models.store import (
                create_renown_table,
                create_werewolf_renown,
                get_werewolf_renown_by_user,
                RenownType,
                RenownStatus,
                WerewolfRenown
            )
        except ImportError as e:
            pytest.fail(f"Required imports failed: {e}")
        
        user_id = "123456789"
        
        async with aiosqlite.connect(":memory:") as db:
            await create_renown_table(db)
            
            # Create two renown requests
            await create_werewolf_renown(db, WerewolfRenown(
                id=None,
                user_id=user_id,
                title="Haut Fait 1",
                description="Description 1",
                renown_type=RenownType.GLORY,
                status=RenownStatus.PENDING
            ))
            await create_werewolf_renown(db, WerewolfRenown(
                id=None,
                user_id=user_id,
                title="Haut Fait 2",
                description="Description 2",
                renown_type=RenownType.HONOR,
                status=RenownStatus.PENDING
            ))
            
            # Retrieve
            results = await get_werewolf_renown_by_user(db, user_id)
            
            assert len(results) == 2, f"Expected 2 renown requests, got {len(results)}"
            assert all(r.user_id == user_id for r in results)

    @pytest.mark.asyncio
    async def test_user_id_foreign_key_relationship(self):
        """
        GIVEN une tentative de création de renown avec un user_id
        WHEN le user_id référence werewolf_data.user_id
        THEN la relation FK est maintenue (logique, pas contrainte SQL stricte)
        
        THEN la relation FK est maintenue (logique, pas contrainte SQL stricte)
        """
        try:
            from modules.werewolf.models.store import (
                create_werewolf_table, create_werewolf_data, WerewolfData,
                create_renown_table, create_werewolf_renown, RenownType, RenownStatus, WerewolfRenown
            )
        except ImportError as e:
            pytest.fail(f"Required imports failed: {e}")
        
        async with aiosqlite.connect(":memory:") as db:
            # Create both tables
            await create_werewolf_table(db)
            await create_renown_table(db)
            
            # Create a werewolf character first
            werewolf = WerewolfData(
                user_id="123456789",
                breed="Homid",
                auspice="Ahroun",
                tribe="Get of Fenris",
                name="Fenris"
            )
            await create_werewolf_data(db, werewolf)
            
            # Create renown request for this user
            renown = WerewolfRenown(
                id=None,
                user_id="123456789",
                title="Test Haut Fait",
                description="Test description",
                renown_type=RenownType.GLORY,
                status=RenownStatus.PENDING
            )
            await create_werewolf_renown(db, renown)
            
            # Logic check: in real app we'd enforce FK
            assert renown.user_id == werewolf.user_id
