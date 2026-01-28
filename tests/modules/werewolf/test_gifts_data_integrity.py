import pytest
import json
import os
from pathlib import Path

# This test is designed to FAIL if the assets file does not exist or matches schema
# R-502 Mitigation Verification

class TestGiftsDataIntegrity:
    
    @pytest.fixture
    def assets_path(self):
        # We look for the file in the expected production location
        # This path might need adjustment based on where pytest is run from, 
        # but usually it's relative to project root.
        return Path("modules/werewolf/assets/gifts_data.json")

    def test_gifts_data_file_exists(self, assets_path):
        """
        Verify that the gifts_data.json file exists in the module assets.
        Target Risk: R-502 (Deployment without valid data)
        """
        assert assets_path.exists(), f"Gift data file not found at {assets_path}"

    def test_gifts_data_valid_json(self, assets_path):
        """
        Verify that the file contains valid JSON.
        """
        if not assets_path.exists():
            pytest.skip("Assets file missing, cannot validate JSON")
            
        with open(assets_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError as e:
                pytest.fail(f"Invalid JSON in gifts_data.json: {e}")
                
        assert isinstance(data, list), "Root element must be a list of gifts"
        assert len(data) > 0, "Gift list cannot be empty"

    def test_gifts_schema_compliance(self, assets_path):
        """
        Verify that every gift entry has the required fields.
        """
        if not assets_path.exists():
            pytest.skip("Assets file missing, cannot validate schema")

        with open(assets_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        required_fields = ["id", "name_fr", "tribe", "level", "description", "gnosis_cost"]
        
        for index, gift in enumerate(data):
            for field in required_fields:
                assert field in gift, f"Gift at index {index} (ID: {gift.get('id', 'unknown')}) missing required field: {field}"
            
            # Additional validation
            assert isinstance(gift['level'], int), f"Gift {gift['id']} level must be an integer"
            assert 1 <= gift['level'] <= 5, f"Gift {gift['id']} level must be between 1 and 5"
            assert isinstance(gift['name_fr'], str) and len(gift['name_fr']) > 0, f"Gift {gift['id']} have a valid name"
            
    def test_gift_ids_unique(self, assets_path):
        """
        Verify that all Gift IDs are unique.
        """
        if not assets_path.exists():
            pytest.skip("Assets file missing, cannot validate uniqueness")

        with open(assets_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        ids = [g['id'] for g in data if 'id' in g]
        assert len(ids) == len(set(ids)), "Duplicate Gift IDs found in catalog"
