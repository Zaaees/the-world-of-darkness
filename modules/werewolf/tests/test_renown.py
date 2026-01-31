import pytest
from modules.werewolf.services.renown import RankCalculator
from modules.werewolf.models.store import WerewolfAuspice

# W20 Rank Requirements Table for Reference:
# Ragabash: Any combination sum. 3, 7, 13, 19, 25
# Theurge:  3/0/0, 5/0/1, 7/1/2, 9/2/4, 10/9/4 (Wisdom/Honor/Glory order varies? No, usually G/H/W)
# Let's double check the order from doc: 
# Theurge: G:0, H:0, W:3 | G:1, H:0, W:5 | G:2, H:1, W:7 | G:4, H:2, W:9 | G:4, H:9, W:10
# Philodox: G:0, H:3, W:0 | G:1, H:4, W:1 | G:2, H:6, W:2 | G:3, H:8, W:4 | G:4, H:10, W:9
# Galliard: G:2, H:0, W:1 | G:4, H:0, W:2 | G:4, H:2, W:4 | G:7, H:2, W:6 | G:9, H:5, W:9
# Ahroun:   G:2, H:1, W:0 | G:4, H:1, W:1 | G:6, H:3, W:1 | G:9, H:5, W:2 | G:10, H:9, W:4

@pytest.mark.parametrize("auspice, glory, honor, wisdom, expected_rank", [
    # --- Ragabash (Sum: 3, 7, 13, 19, 25) ---
    (WerewolfAuspice.RAGABASH, 3, 0, 0, 1),    # Total 3 -> Rank 1
    # Usually "Rank 1" is starting rank (Cliath). Players start at Rank 1.
    # The table says "Rank 1 | Cliath | 3". This typically means "To BE Rank 1".
    # But newly created characters are usually Rank 1 (Cliath).
    # If requirements means "To Advance TO", then these are reqs for Rank 2?
    # Actually, standard Werewolf: Cliath (Rank 1) is the post-Rite of Passage rank.
    # Cubs are Rank 0.
    # So if you have 3 renown, you are Rank 1.
    # To get to Rank 2 (Fostern), you need 7.
    # Let's assume calculate_rank returns the HIGHEST rank for which requirements are met.
    
    # Ragabash
    (WerewolfAuspice.RAGABASH, 0, 0, 0, 0),    # Cub
    (WerewolfAuspice.RAGABASH, 1, 1, 1, 1),    # Total 3 -> Rank 1
    (WerewolfAuspice.RAGABASH, 3, 0, 0, 1),    # Total 3 -> Rank 1
    (WerewolfAuspice.RAGABASH, 7, 0, 0, 2),    # Total 7 -> Rank 2
    (WerewolfAuspice.RAGABASH, 2, 2, 3, 2),    # Total 7 -> Rank 2
    (WerewolfAuspice.RAGABASH, 12, 0, 0, 2),   # Total 12 -> Rank 2 (Just short of 13)
    (WerewolfAuspice.RAGABASH, 5, 4, 4, 3),    # Total 13 -> Rank 3
    (WerewolfAuspice.RAGABASH, 19, 0, 0, 4),   # Total 19 -> Rank 4
    (WerewolfAuspice.RAGABASH, 25, 0, 0, 5),   # Total 25 -> Rank 5
    
    # --- Theurge (G, H, W) ---
    # Rank 1: 0, 0, 3
    (WerewolfAuspice.THEURGE, 0, 0, 2, 0),     # Not enough Wisdom
    (WerewolfAuspice.THEURGE, 0, 0, 3, 1),     # Exact
    (WerewolfAuspice.THEURGE, 10, 10, 2, 0),   # Lots of G/H but not enough W for Rank 1? (Strict rules say yes)

    # Rank 2: 1, 0, 5
    (WerewolfAuspice.THEURGE, 1, 0, 5, 2),
    (WerewolfAuspice.THEURGE, 0, 0, 5, 1),     # Missing Glory for Rank 2 -> Rank 1 (if W >= 3)

    # Rank 3: 2, 1, 7
    (WerewolfAuspice.THEURGE, 2, 1, 7, 3),
    (WerewolfAuspice.THEURGE, 2, 0, 7, 2),     # Missing Honor -> Rank 2

    # Rank 4: 4, 2, 9
    (WerewolfAuspice.THEURGE, 4, 2, 9, 4),

    # Rank 5: 4, 9, 10
    (WerewolfAuspice.THEURGE, 4, 9, 10, 5),
    (WerewolfAuspice.THEURGE, 4, 8, 10, 4),    # Missing Honor for Rank 5 -> Rank 4

    # --- Philodox (G, H, W) ---
    # Rank 1: 0, 3, 0
    (WerewolfAuspice.PHILODOX, 0, 3, 0, 1),
    # Rank 2: 1, 4, 1
    (WerewolfAuspice.PHILODOX, 1, 4, 1, 2),
    # Rank 3: 2, 6, 2
    (WerewolfAuspice.PHILODOX, 2, 6, 2, 3),
    # Rank 4: 3, 8, 4
    (WerewolfAuspice.PHILODOX, 3, 8, 4, 4),
    # Rank 5: 4, 10, 9
    (WerewolfAuspice.PHILODOX, 4, 10, 9, 5),

    # --- Galliard (G, H, W) ---
    # Rank 1: 2, 0, 1
    (WerewolfAuspice.GALLIARD, 2, 0, 1, 1),
    # Rank 2: 4, 0, 2
    (WerewolfAuspice.GALLIARD, 4, 0, 2, 2),
    # Rank 3: 4, 2, 4
    (WerewolfAuspice.GALLIARD, 4, 2, 4, 3),
    # Rank 4: 7, 2, 6
    (WerewolfAuspice.GALLIARD, 7, 2, 6, 4),
    # Rank 5: 9, 5, 9
    (WerewolfAuspice.GALLIARD, 9, 5, 9, 5),

    # --- Ahroun (G, H, W) ---
    # Rank 1: 2, 1, 0
    (WerewolfAuspice.AHROUN, 2, 1, 0, 1),
    # Rank 2: 4, 1, 1
    (WerewolfAuspice.AHROUN, 4, 1, 1, 2),
    # Rank 3: 6, 3, 1
    (WerewolfAuspice.AHROUN, 6, 3, 1, 3),
    # Rank 4: 9, 5, 2
    (WerewolfAuspice.AHROUN, 9, 5, 2, 4),
    # Rank 5: 10, 9, 4
    (WerewolfAuspice.AHROUN, 10, 9, 4, 5),
    (WerewolfAuspice.AHROUN, 10, 9, 3, 4),      # Missing Wisdom for Rank 5 -> Rank 4 (since 3 >= 2)

])
def test_rank_calculation(auspice, glory, honor, wisdom, expected_rank):
    """
    Test strict rank calculation for all auspices.
    Assumes calculate_rank signature: calculate_rank(auspice, glory, honor, wisdom)
    """
    # Note: We need to instantiate or call static method. If static:
    rank = RankCalculator.calculate_rank(auspice, glory, honor, wisdom)
    assert rank == expected_rank, f"Failed for {auspice} with G:{glory} H:{honor} W:{wisdom}. Expected {expected_rank}, got {rank}"
