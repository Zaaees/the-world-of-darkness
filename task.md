# Task: Vitae System Overhaul

## Status
- [x] Create Implementation Plan <!-- id: 0 -->
- [x] **USER REVIEW**: Wait for approval of the plan <!-- id: 1 -->
- [x] Refactor `utils/database.py` <!-- id: 2 -->
    - [x] Rename/Adapt `vampire_soif` table logic (or add migration)
    - [x] Implement `get_max_vitae` (same as old max_soif)
    - [x] Implement `get_min_vitae_cap` (for elders)
    - [x] Create `modify_vitae` function (flexible +/-)
- [x] Update `views/vampire_panel.py` <!-- id: 3 -->
    - [x] Visual update: Bar fills from Left (0) to Right (Max)? Or starts Full (Green) and depletes?
    - [x] Implement `VitaeSpendModal`
    - [x] Update Buttons (Spend, Feed)
- [x] Verify functionality <!-- id: 4 -->
- [x] Update Rules Document (`proposition_reglement_vampire.md`) to reflect the changes <!-- id: 5 -->
- [x] Integrate Rules into Website (`VampireSheet.jsx`, `RulesTab.jsx`) <!-- id: 6 -->
