"""Shared Vitae action catalog used by Discord and the website."""
import json
from pathlib import Path

_CATALOG = json.loads(Path(__file__).with_suffix('.json').read_text(encoding='utf-8'))
SATURATION_THRESHOLDS = {int(k): v for k, v in _CATALOG['thresholds'].items()}
SATURATION_THRESHOLDS[5] = float('inf')
ACTIONS = {
    row['id']: {**row, 'min_bp': row['minBp'], 'max_bp': row['maxBp'],
                'scaling': {int(k): v for k, v in row['scaling'].items()}}
    for row in _CATALOG['actions']
}

def normalize_clan(clan: str) -> str:
    key = (clan or '').strip().lower().replace(' ', '_').replace('-', '_')
    return _CATALOG['aliases'].get(key, key)

def get_action_points(action: dict, blood_potency: int) -> int:
    return 0 if blood_potency >= 5 else action['scaling'].get(blood_potency, 0)

def is_action_available(action: dict, blood_potency: int) -> bool:
    return action['min_bp'] <= blood_potency <= action['max_bp']

def get_action_by_id(action_id: str) -> dict | None:
    return ACTIONS.get(action_id)

def get_clan_actions(clan: str) -> list[dict]:
    return [a for a in ACTIONS.values() if a.get('clan') == normalize_clan(clan)]

def get_clan_action(clan: str) -> dict | None:
    return next(iter(get_clan_actions(clan)), None)

def get_all_actions() -> dict:
    return {key: {a['id']: a for a in ACTIONS.values() if a['category'] == key}
            for key in ('unique', 'clan', 'general', 'resonance')}

UNIQUE_ACTIONS = get_all_actions()['unique']
CLAN_ACTIONS = get_all_actions()['clan']
RESONANCE_ACTIONS = get_all_actions()['resonance']
CATEGORIES = {
    'unique': {'name': 'Les premières cicatrices', 'description': 'Une fois dans votre existence', 'icon': '⭐'},
    'clan': {'name': 'L’héritage de votre sang', 'description': 'Les voies de votre lignée', 'icon': '🧛'},
    'general': {'name': 'Les épreuves de la nuit', 'description': 'Des accomplissements qui laissent une trace', 'icon': '⚔️'},
    'resonance': {'name': 'Les saveurs du sang', 'description': 'Des sources singulières', 'icon': '🩸'},
}

def advance_saturation(level: int, current: int, points: int) -> tuple[int, int]:
    if not 1 <= level <= 5 or current < 0 or points < 0:
        raise ValueError('Invalid progression values')
    if level == 5:
        return 5, 0
    total = current + points
    while level < 5 and total >= SATURATION_THRESHOLDS[level]:
        total -= SATURATION_THRESHOLDS[level]
        level += 1
    return level, total if level < 5 else 0
