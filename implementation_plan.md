# Implementation Plan: Vitae System & Flexible Spending

This plan outlines the changes required to transition from a "Thirst Gauge" (0 = Good, Max = Frenzy) to a "Vitae Pool" (Max = Good, 0 = Frenzy) and implement a flexible spending mechanism.

## Goal Description
1.  **Invert Mechanics**: Change the core mechanic from accumulating "Soif" (Thirst) to spending "Vitae" (Blood).
    *   **Current**: Players start at 0. Using powers adds points. Reaching Max triggers Frenzy.
    *   **New**: Players start at Max. Using powers removes points. Reaching 0 triggers Frenzy.
2.  **Flexible Spending**: Replace the fixed +1/+3/+9 buttons with a "Dépenser" button that opens a modal for custom input.

## User Review Required
> [!IMPORTANT]
> **Database Migration**: Since we are inverting the logic, existing values in the database (if any) will need to be reset or converted. I recommend a **Reset to Max** for all vampires to start fresh with the new system.

## Proposed Changes

### 1. Database Logic (`utils/database.py`)

#### [MODIFY] `utils/database.py`
We will keep the existing table `vampire_soif` to avoid complex SQL migrations, but we will rename the conceptual use of the column `soif_level` to `vitae_amount` in the code logic.

*   **`get_max_vitae(bp)`**: Same values as old `max_soif` (5, 8, 12, 18, 25).
*   **`set_vitae(user_id, amount)`**: Updates the value.
*   **`modify_vitae(user_id, amount)`**:
    *   If valid (new_val >= 0), updates and returns new value.
    *   If new_val <= 0, returns 0 and signals Frenzy.

### 2. UI Updates (`views/vampire_panel.py`)

#### [MODIFY] `views/vampire_panel.py`

*   **Visual Gauge**:
    *   Invert rendering. `🩸` now represents **Available Blood**. `⚫` represents **Empty/Thirst**.
    *   Full Bar = Good. Empty Bar = Frenzy.
*   **Buttons**:
    *   **Remove**: `soif_button_1`, `soif_button_3`, `soif_button_9`.
    *   **Add**: `spend_button` (Label: "Dépenser / Verser").
        *   Opens a `VitaeSpendModal`.
    *   **Update**: `feed_button` (Label: "Se nourrir").
        *   Sets Vitae to `get_feeding_cap(bp)`.

### 3. Modal Interaction (`views/vampire_panel.py`)

#### [NEW] `class VitaeSpendModal(ui.Modal)`
*   **Input**: Text field "Quantité de sang" (Number).
*   **Logic**:
    *   Validates input is a number.
    *   Calls `modify_vitae(-amount)`.
    *   Updates the panel.

## Verification Plan

### Manual Verification
1.  **Feeding**:
    *   Click "Se nourrir".
    *   Verify bar fills up (to Max or Cap).
2.  **Spending**:
    *   Click "Dépenser".
    *   Enter "1". Verify bar drops by 1.
    *   Enter a large number (e.g., 50). Verify it drops to 0 and triggers Frenzy message.
3.  **Persistency**:
    *   Restart bot. Verify values remain.

### Automated Tests
*   None planned (UI interaction requires manual testing).
