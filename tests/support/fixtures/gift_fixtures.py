import pytest
import json
import os
from pathlib import Path
from tests.support.factories.gift_factory import create_gift

@pytest.fixture
def mock_gifts_data_file(tmp_path):
    """
    Creates a temporary valid gifts_data.json for testing loaders.
    """
    file_path = tmp_path / "gifts_data.json"
    gifts = [create_gift() for _ in range(3)]
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(gifts, f)
        
    return file_path, gifts

@pytest.fixture
def real_assets_path():
    """
    Returns the expected absolute path to the real assets directory.
    """
    # Assuming the standard structure rooted at project root
    project_root = Path(__file__).parents[3] # tests/support/fixtures -> tests/support -> tests -> root
    # Adjust if tested from different location, but usually reliable relative to this file
    return project_root / "modules" / "werewolf" / "assets"
