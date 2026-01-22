import pytest
import os
import json
from pathlib import Path

# Story 2.2: Assets de Données Garou
# AS A développeur
# I WANT les données statiques des Races, Auspices et Tribus disponibles en JSON
# SO THAT le formulaire d'onboarding puisse les afficher dynamiquement

ASSETS_PATH = Path("modules/werewolf/assets/werewolf_data.json")

class TestStory2_2_WerewolfAssets:
    
    def test_assets_file_exists(self):
        """
        GIVEN the werewolf module is initialized
        WHEN checking for the assets file
        THEN it should exist at modules/werewolf/assets/werewolf_data.json
        """
        assert ASSETS_PATH.exists(), f"Assets file not found at {ASSETS_PATH}"

    def test_assets_structure_breeds(self):
        """
        GIVEN the assets file
        WHEN loading the content
        THEN it should contain a list of 'breeds' with correct keys
        """
        # Skip if file doesn't exist (dependent on previous test, but we want fail message)
        if not ASSETS_PATH.exists():
            pytest.fail("Assets file missing")
            
        with open(ASSETS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        assert "breeds" in data
        assert isinstance(data["breeds"], list)
        assert len(data["breeds"]) > 0
        
        required_keys = {"id", "name_fr"}
        for item in data["breeds"]:
            assert required_keys.issubset(item.keys())
            
    def test_assets_structure_auspices(self):
        """
        GIVEN the assets file
        WHEN loading the content
        THEN it should contain a list of 'auspices' with correct keys
        """
        if not ASSETS_PATH.exists():
            pytest.fail("Assets file missing")
            
        with open(ASSETS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        assert "auspices" in data
        assert isinstance(data["auspices"], list)
        assert len(data["auspices"]) == 5 # Ragabash, Theurge, Philodox, Galliard, Ahroun

    def test_assets_structure_tribes(self):
        """
        GIVEN the assets file
        WHEN loading the content
        THEN it should contain a list of 'tribes' with 13 entries
        """
        if not ASSETS_PATH.exists():
            pytest.fail("Assets file missing")
            
        with open(ASSETS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        assert "tribes" in data
        assert isinstance(data["tribes"], list)
        # Assuming 13 official tribes
        assert len(data["tribes"]) >= 13
