import faker
from typing import Dict, Any, Optional

fake = faker.Faker(['fr_FR'])

def create_gift(overrides: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Creates a valid Gift dictionary structure as expected in assets/gifts_data.json.
    """
    if overrides is None:
        overrides = {}
        
    tribe = overrides.get('tribe', fake.word())
    
    defaults = {
        "id": f"gift_{fake.uuid4()}",
        "name_fr": f"Don de {fake.word().capitalize()}",
        "tribe": tribe,
        "level": fake.random_int(min=1, max=5),
        "description": fake.sentence(),
        "gnosis_cost": fake.random_int(min=1, max=10),
        "system": fake.paragraph(),  # System mechanics description
    }
    
    return {**defaults, **overrides}

def create_player_gift_entry(user_id: int, gift_id: str, overrides: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Creates a database entry structure for the werewolf_player_gifts table.
    """
    if overrides is None:
        overrides = {}

    defaults = {
        "user_id": user_id,
        "gift_id": gift_id,
        "unlocked_at": fake.iso8601(),
        "unlocked_by": fake.random_int(min=1000, max=9999) # Admin ID
    }
    
    return {**defaults, **overrides}
