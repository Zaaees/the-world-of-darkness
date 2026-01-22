import sys
import os
sys.path.append(os.getcwd())
try:
    from modules.werewolf.services.character_service import create_character
    print("Import SUCCESS")
except ImportError as e:
    print(f"Import FAILED: {e}")
except Exception as e:
    print(f"Error: {e}")
