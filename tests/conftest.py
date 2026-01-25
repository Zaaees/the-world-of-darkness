# tests/conftest.py
"""
Root conftest.py to configure Python path for pytest.

This file ensures that the project root is added to sys.path
so that imports like `from modules.werewolf...` work correctly
during test collection and execution.
"""
import sys
from pathlib import Path

# Add project root to sys.path for module imports
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
