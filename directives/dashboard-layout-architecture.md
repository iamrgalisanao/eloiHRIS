# Dashboard Layout & Interaction Architecture

This document serves as a comprehensive reference for the HRIS Dashboard's layout, styling standards, and the custom expansion logic implemented to match high-fidelity design specifications.

## 1. Core Layout Standards
The dashboard follows a strict grid-based rhythm with standardized dimensions to ensure a premium, balanced feel.

*   **Standard Card Height**: `320px`. This is the height benchmark for all secondary cards (Rows 3 and 4).
*   **Grid Gap**: `32px` (MUI `gap: 4`).
*   **Column Alignment**:
    *   **Row 1**: The left column contains two cards ("Time Off" and "My Stuff") with a total height of `672px` (320px * 2 + 32px gap).
    *   **"What's Happening" Card**: Explicitly set to `height: 100%` within its grid column to ensure its bottom edge perfectly aligns with the "My Stuff" card.

## 2. Custom Components & Logic

### `SmoothExpandableRow`
A utility component used in Rows 3 and 4 to handle complex "Expand-and-Stack" interactions.

*   **Logic**:
    *   **Collapsed State**: Cards sit in a standard 3-column `grid` template.
    *   **Expanded State**: The selected card expands to **50% width** and **100% height** (spanning 2 rows/672px). The remaining two cards stack vertically on the right side.
*   **Physics**: Uses absolute positioning with percentage-based frames and a `0.5s cubic-bezier(0.4, 0, 0.2, 1)` transition for organic movement.
*   **State Management**: controlled by `expandedCard` (string ID) in `App.jsx`. Setting this to `null` collapses all cards.

### `DashboardCard`
The foundational UI unit.
*   **Key Props**:
    *   `hideActions`: Boolean. When `true`, removes the Settings/Expand icons (used for primary Row 1 cards).
    *   `fullWidth`: Boolean. When `true`, forces the card to respect standardized CSS positioning and height.
    *   `style`: Used for layout overrides (e.g., `flex: 1`, `height: '100%'`).

## 3. Styling Token (app.css)
Legacy absolute positioning has been deprecated in favor of a modern grid+flex system.

*   `.dashboard-card`: Base style with `min-height: 320px`.
*   `.expandable-row`: Relative container providing the coordination space for expansion.
*   `.dashboard-card.is-expanded`: Higher `z-index` (50) and enhanced shadow depth.

## 4. Current Dashboard Structure

| Row | Cards | Behavior |
| :--- | :--- | :--- |
| **Row 1** | Time Off, My Stuff, What's Happening | Split column. Right card spans 2 left rows. |
| **Row 2** | My Direct Reports | Full width, non-expandable. |
| **Row 3** | Celebrations, Time Off Requests, Who's Out | `SmoothExpandableRow` enabled. |
| **Row 4** | Trainings, Company Links, Onboarding | `SmoothExpandableRow` enabled. |

*Note: Bottom rows (Welcome, Time Off Used, Pay Raise, Goals, Location) were removed per user request to streamline the UI.*

## 5. Development Resume Checklist
When resuming work, verify the following:
1.  **Transition Sync**: Ensure `.dashboard-card` transition in `app.css` matches the animation duration in `SmoothExpandableRow`.
2.  **Gap Consistency**: If changing the grid gap, update the `gap` prop in `SmoothExpandableRow` (default is 32).
3.  **State Scope**: `expandedCard` state is local to `Home`. If moving to global state (Redux/Zustand), ensure the `id` mapping remains unique across rows.
