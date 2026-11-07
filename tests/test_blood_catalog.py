import unittest
from data.blood_actions import (
    ACTIONS, SATURATION_THRESHOLDS, advance_saturation, count_previous_awards, diminished_points,
    CATEGORIES, get_all_actions, get_action_points, get_clan_actions, is_action_available, is_once,
    rank_key_action_id, unlocked_ranks,
)


class VitaeCatalogTests(unittest.TestCase):
    def test_revised_categories_and_awards_are_available_to_discord(self):
        grouped = get_all_actions()
        self.assertEqual(set(grouped), set(CATEGORIES))
        self.assertEqual(len(grouped['social']), 5)
        self.assertEqual(len(grouped['irreversible']), 2)
        self.assertIn('Sous validation stricte du MJ', CATEGORIES['irreversible']['warning'])
        # Social outcomes are the natural product of any scene: paid, but below real threats.
        expected = {
            'vitae_mortal_link': 4, 'vitae_mortal_influence': 4, 'vitae_haven': 3,
            'vitae_mortal_hunter': 6, 'vitae_embrace': 8, 'vitae_diablerie': 8,
            'vitae_favor': 3, 'vitae_secret': 3, 'vitae_negotiation': 3,
            'vitae_recognition': 3, 'vitae_coterie': 3,
        }
        for action_id, points in expected.items():
            action = ACTIONS[action_id]
            self.assertEqual(get_action_points(action, 1), points)
            self.assertTrue(is_action_available(action, 1))
            self.assertTrue(is_action_available(action, 4))
            self.assertFalse(is_action_available(action, 5))
        # Embrace and diablerie are once-in-an-existence rewards, never a farmable path.
        for action_id in ('vitae_embrace', 'vitae_diablerie'):
            self.assertTrue(is_once(ACTIONS[action_id]))
        self.assertTrue(is_once(ACTIONS['vitae_first_beast']))
        self.assertFalse(is_once(ACTIONS['vitae_defense']))
        # At rank 4 the hard general feats compete with the 12-point clan path.
        self.assertEqual([get_action_points(ACTIONS[k], 4) for k in
                          ('vitae_masquerade', 'vitae_crisis', 'vitae_extraction', 'vitae_defense')], [5, 5, 6, 8])
        self.assertNotIn('vitae_restore_source', ACTIONS)
        self.assertNotIn('vitae_learning', ACTIONS)
        self.assertIn('Ouvrez ou rétablissez', ACTIONS['vitae_hunting_source']['description'])

    def test_all_clans_have_five_guided_levels(self):
        clans = {a['clan'] for a in ACTIONS.values() if a.get('clan')}
        self.assertEqual(len(clans), 18)
        for clan in clans:
            self.assertEqual([a['min_bp'] for a in get_clan_actions(clan)], [1, 2, 3, 4, 5])
        for action in ACTIONS.values():
            self.assertTrue(action['hints'])
            self.assertNotIn('cooldown_days', action)
            self.assertEqual(get_action_points(action, 5), 0)

    def test_aliases_and_scaling(self):
        self.assertEqual(get_clan_actions('Hecata'), get_clan_actions('giovanni'))
        self.assertEqual(get_clan_actions('Ministry'), get_clan_actions('setites'))
        self.assertEqual(get_clan_actions('Banu Haqim'), get_clan_actions('assamites'))
        action = get_clan_actions('nosferatu')[1]
        self.assertFalse(is_action_available(action, 1))
        self.assertEqual([get_action_points(action, n) for n in (2, 3, 4)], [5, 4, 2])

    def test_progression_preserves_overflow_and_combined_awards(self):
        self.assertEqual(advance_saturation(1, 29, 8), (2, 7))
        self.assertEqual(advance_saturation(1, 29, 70), (3, 9))
        self.assertEqual(advance_saturation(3, 0, 4 + 6), (3, 10))
        self.assertEqual(advance_saturation(4, 199, 12), (5, 0))
        self.assertEqual(advance_saturation(5, 0, 12), (5, 0))
        self.assertEqual([SATURATION_THRESHOLDS[n] for n in range(1, 5)], [30, 60, 120, 200])
        with self.assertRaises(ValueError):
            advance_saturation(1, 0, -5)

    def test_repeating_the_same_feat_pays_less_without_any_calendar(self):
        self.assertEqual([diminished_points(12, n) for n in range(5)], [12, 9, 6, 6, 6])
        self.assertEqual([diminished_points(3, n) for n in range(3)], [3, 3, 2])
        self.assertEqual(diminished_points(0, 0), 0)
        history = [
            {'actionId': 'vitae_brujah_4', 'bp': 4, 'reward': {'points_added': 12}},
            {'actionId': 'vitae_brujah_4', 'bp': 3, 'reward': {'points_added': 6}},
            {'actionId': 'vitae_brujah_4', 'bp': 4, 'refused': True},
            {'text': 'ancienne entrée sans identifiant', 'reward': {}},
        ]
        self.assertEqual(count_previous_awards(history, 'vitae_brujah_4', 4), 1)
        self.assertEqual(count_previous_awards(history, 'vitae_defense', 4), 0)

    def test_each_threshold_needs_the_clan_path_of_that_rank(self):
        self.assertEqual(rank_key_action_id('Banu Haqim', 2), 'vitae_banu_haqim_2')
        history = [{'actionId': 'vitae_brujah_1', 'reward': {}}, {'actionId': 'vitae_brujah_3', 'reward': {}},
                   {'actionId': 'vitae_brujah_2', 'refused': True}]
        self.assertEqual(unlocked_ranks(history, 'brujah'), {1, 3})
        # Rank 1 is unlocked: the threshold opens and the overflow carries. Rank 2 is not: points wait.
        self.assertEqual(advance_saturation(1, 29, 8, {1, 3}), (2, 7))
        self.assertEqual(advance_saturation(2, 59, 8, {1, 3}), (2, 67))
        # The key itself, validated later, releases the stored points.
        self.assertEqual(advance_saturation(2, 67, 5, {1, 2, 3}), (3, 12))

    def test_retired_farming_actions_are_not_available(self):
        for key in ('diablerie', 'torpor_enter', 'vampire_kiss', 'first_kill', 'ghoul_pack'):
            self.assertNotIn(key, ACTIONS)


if __name__ == '__main__':
    unittest.main()
