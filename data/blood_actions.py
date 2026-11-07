"""Shared Vitae action catalog used by Discord and the website."""
import json
import math
from pathlib import Path

_CATALOG = json.loads(Path(__file__).with_suffix('.json').read_text(encoding='utf-8'))
CATEGORIES = _CATALOG['categories']
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

def is_once(action: dict) -> bool:
    """Rewarded a single time in the character's existence (founding experiences, irreversible acts)."""
    return action.get('category') == 'unique' or bool(action.get('once'))

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
            for key in CATEGORIES}

UNIQUE_ACTIONS = get_all_actions()['unique']
CLAN_ACTIONS = get_all_actions()['clan']
RESONANCE_ACTIONS = get_all_actions()['resonance']

REPEAT_FACTORS = _CATALOG.get('repeat', {}).get('factors', [1])


def diminished_points(points: int, previous_awards: int) -> int:
    """Same action validated again at the same rank: 100 %, 75 %, then 50 % (rounded up)."""
    factor = REPEAT_FACTORS[min(max(previous_awards, 0), len(REPEAT_FACTORS) - 1)]
    return math.ceil(points * factor) if points > 0 else 0


def _is_award(item) -> bool:
    return isinstance(item, dict) and item.get('reward') is not None and not item.get('refused')


def count_previous_awards(history: list, action_id: str, blood_potency: int) -> int:
    """Awards of this action already granted while the character was at this rank."""
    return sum(1 for item in history or [] if _is_award(item)
               and item.get('actionId') == action_id and item.get('bp') == blood_potency)


def rank_key_action_id(clan: str, level: int) -> str:
    return f"vitae_{normalize_clan(clan)}_{level}"


def unlocked_ranks(history: list, clan: str) -> set[int]:
    """Ranks whose clan path was validated: the key that lets the next threshold open."""
    awarded = {item.get('actionId') for item in history or [] if _is_award(item)}
    return {level for level in range(1, 5) if rank_key_action_id(clan, level) in awarded}


def advance_saturation(level: int, current: int, points: int, unlocked: set | None = None) -> tuple[int, int]:
    """Carry points across thresholds. With `unlocked`, a threshold opens only once that rank's clan path is done;
    points still accumulate meanwhile and the level-up happens at the next award."""
    if not 1 <= level <= 5 or current < 0 or points < 0:
        raise ValueError('Invalid progression values')
    if level == 5:
        return 5, 0
    total = current + points
    while level < 5 and total >= SATURATION_THRESHOLDS[level] and (unlocked is None or level in unlocked):
        total -= SATURATION_THRESHOLDS[level]
        level += 1
    return level, total if level < 5 else 0
