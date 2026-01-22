
from faker import Faker
import random

faker = Faker('fr_FR')

def create_werewolf_data(overrides=None):
    """
    Factory to generate valid Werewolf character data.
    """
    if overrides is None:
        overrides = {}

    breeds = ['Homid', 'Metis', 'Lupus']
    auspices = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun']
    tribes = ['Black Furies', 'Bone Gnawers', 'Children of Gaia', 'Fianna', 'Get of Fenris', 
              'Glass Walkers', 'Red Talons', 'Shadow Lords', 'Silent Striders', 'Silver Fangs', 
              'Stargazers', 'Uktena', 'Wendigo']

    default_data = {
        'user_id': str(faker.random_number(digits=18, fix_len=True)), # Discord ID as string
        'name': faker.name(),
        'breed': random.choice(breeds),
        'auspice': random.choice(auspices),
        'tribe': random.choice(tribes),
        'story': faker.text(),
        'rank': 1,
        'discord_thread_id': str(faker.random_number(digits=19, fix_len=True)),
        'created_at': faker.iso8601(),
        'updated_at': faker.iso8601()
    }

    return {**default_data, **overrides}
