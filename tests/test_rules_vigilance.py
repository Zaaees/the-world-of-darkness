"""Section II du Règlement : la Vigilance par quartier et la chasse sur le domaine d'autrui."""
from pathlib import Path

from utils.site_content import REGISTRY

RULES_TAB = Path(__file__).resolve().parents[1] / 'web/src/modules/vampire/components/RulesTab.jsx'
KEYS = ('vampire.rules.vigilance.label', 'vampire.rules.vigilance.body', 'vampire.rules.territory.huntingNews')


def test_territory_rule_texts_are_editable_vampire_entries():
    for key in KEYS:
        entry = REGISTRY[key]
        assert entry['scope'] == 'vampire'
        assert entry['source'] == 'modules/vampire/components/RulesTab.jsx'
        assert entry['variables'] == [] and not entry['public'] and not entry['catalog']


def test_vigilance_climbs_through_four_tiers_and_only_falls_through_acts():
    body = REGISTRY['vampire.rules.vigilance.body']['default']
    tiers = [body.index(tier) for tier in ('Calme', 'Rumeurs', 'Enquête', 'Traque')]
    assert tiers == sorted(tiers)
    for act in ('Recoudre le voile', 'Les yeux du jour', 'Le temps n'):
        assert act in body


def test_rules_tab_renders_the_new_texts_in_the_territory_section():
    source = RULES_TAB.read_text(encoding='utf-8')
    territory = source[source.index('<section id="territory"'):source.index('<section id="thirst"')]
    for key in KEYS:
        assert f'contentKey="{key}"' in territory
