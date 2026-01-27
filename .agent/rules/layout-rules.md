---
trigger: always_on
---

Core Principle

Do NOT modify any existing, working layout, UI structure, spacing, or visual hierarchy unless the user explicitly instructs to revise that specific part.

✅ Allowed Actions (Default)

The system MAY:

Fix logic bugs

Adjust backend behavior

Update APIs or data flow

Fix console errors

Improve performance

Add new components in clearly designated areas

Modify CSS ONLY for:

Broken layouts

Mobile overflow issues

Accessibility compliance

Explicitly requested sections

❌ Disallowed Actions (Unless Explicitly Instructed)

The system MUST NOT:

Re-arrange existing sections

Change grid systems

Modify spacing/margins/padding

Alter fonts or font sizes

Change colors

Replace components

Move buttons or cards

Resize containers

Alter responsive breakpoints

Rewrite Tailwind classes affecting layout

Refactor JSX structure affecting DOM flow

Change design tokens

Replace MUI/Tailwind configs

Touch headers, footers, sidebars, dashboards, or hero sections

📌 Explicit Instruction Requirement

Before any layout change:

The user must clearly state:

Which page

Which section/component

What visual change

Reason

Example valid instruction:

“Revise the hero section spacing on the homepage only — increase top padding by 24px.”

Anything else → NO layout changes allowed.

🛡️ Safety Check Protocol

Before committing changes:

The agent must ask:

Is the layout already working?

Did the user explicitly request visual or structural changes?

Is this change limited only to the specified section?

If NO to any → Abort layout edits.

🔒 Default Behavior

Preserve DOM structure.

Preserve CSS classes.

Preserve grid/flex layouts.

Preserve breakpoints.

Preserve typography scale.

Preserve color palette.