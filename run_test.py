import pytest
import sys

# Run pytest on the specific file and capture output
if __name__ == "__main__":
    sys.exit(pytest.main(["tests/modules/werewolf/test_discord_publish_atdd.py", "-v"]))
