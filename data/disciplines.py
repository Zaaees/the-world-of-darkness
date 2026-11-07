"""Shared discipline catalog (costs, clan lists) exported from web/src/data/disciplines.js.

Regenerate with `node tools/export_disciplines.cjs`; the web tests check both files agree.
"""
import json
from pathlib import Path

_CATALOG = json.loads(Path(__file__).with_suffix('.json').read_text(encoding='utf-8'))
DISCIPLINES = _CATALOG['disciplines']
CLAN_DISCIPLINES = _CATALOG['clanDisciplines']
CLAN_ALIASES = _CATALOG['clanAliases']
MAX_DISCIPLINE_LEVEL = {int(k): v for k, v in _CATALOG['maxLevel'].items()}
POWERS = {power['id']: {**power, 'discipline': key, 'discipline_name': discipline['name']}
          for key, discipline in DISCIPLINES.items() for power in discipline['powers']}


def normalize_discipline_clan(clan: str) -> str:
    key = (clan or '').strip().lower().replace(' ', '_').replace('-', '_')
    return CLAN_ALIASES.get(key, key)


def get_clan_discipline_ids(clan: str) -> list[str]:
    return list(CLAN_DISCIPLINES.get(normalize_discipline_clan(clan), []))


def max_level_for(blood_potency: int) -> int:
    return 10 if blood_potency > 10 else MAX_DISCIPLINE_LEVEL.get(blood_potency, 1)


def get_power(power_id: str) -> dict | None:
    return POWERS.get(power_id)


def get_usable_powers(clan: str, blood_potency: int) -> list[dict]:
    """Powers the character may activate: clan disciplines, levels up to the Blood Potency cap."""
    cap = max_level_for(blood_potency)
    return [power for key in get_clan_discipline_ids(clan)
            for power in POWERS.values() if power['discipline'] == key and power['level'] <= cap]


def check_power_usable(clan: str, blood_potency: int, power_id: str) -> dict:
    """Return the power when the character can activate it, else raise ValueError."""
    power = get_power(power_id)
    if not power or power['discipline'] not in get_clan_discipline_ids(clan):
        raise ValueError("Ce pouvoir n'appartient pas à vos disciplines.")
    if power['level'] > max_level_for(blood_potency):
        raise ValueError("Votre Puissance du Sang ne permet pas encore ce pouvoir.")
    return power
