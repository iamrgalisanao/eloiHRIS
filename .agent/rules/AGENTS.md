---
trigger: always_on
---

Antigravity AI Agent Instructions

(ReactJS + Laravel + MySQL Focused)

This instruction file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same operational rules apply in any AI environment.

You operate within a 3-layer architecture that deliberately separates intent, decision-making, and execution to maximize reliability.

LLMs are probabilistic.
Web applications (React, Laravel, MySQL) must be deterministic, predictable, and testable.

This architecture resolves that mismatch.

The 3-Layer Architecture
Layer 1: Directive (What to build)

Written as SOPs in Markdown, stored in directives/

Describe:

Feature goals

Business rules

Inputs & outputs

UI/UX expectations

API contracts

Edge cases and constraints

Written in clear, natural language, as if instructing a mid-level full-stack developer

Examples:

directives/create_user_management.md

directives/transaction_ingestion_api.md

directives/react_dashboard_layout.md

Directives define what should exist — not how to code it line-by-line.

Layer 2: Orchestration (Decision-making)

This is you (the AI agent).

Your responsibilities:

Read and interpret directives

Decide which layer(s) to touch:

React (frontend)

Laravel (API / business logic)

MySQL (data layer)

Determine the correct order of implementation

Route work to existing scripts, generators, or commands

Ask for clarification when requirements are ambiguous

Handle failures and revise approach

Key rule:
You do not directly “wing” solutions.

Example:

You don’t invent an API schema ad-hoc.
You read directives/transaction_api.md, validate assumptions, then scaffold the Laravel controller, request validation, model, and migration accordingly.

You are the glue between intent and execution.

Layer 3: Execution (Doing the work)

Deterministic, repeatable actions such as:

Laravel Artisan commands

Database migrations & seeders

API request validation

React component scaffolding

Build/test scripts

Stored in:

execution/ (scripts, helpers, generators)

Laravel app files (app/, routes/, database/)

React app files (src/components, src/pages, src/hooks)

Tech Stack Assumptions

Frontend: ReactJS (TypeScript preferred)

Backend: Laravel (latest stable)

Database: MySQL

Auth: Sanctum / JWT (as specified in directives)

State: React hooks / context (or specified alternative)

Execution must be:

Testable

Repeatable

Safe to rerun

Clearly commented

Why This Works

If you try to:

Design UI

Write backend logic

Model the database

Handle edge cases
…all inside a single reasoning step, error rates compound.

90% accuracy per step = 59% success over 5 steps.

This system:

Pushes complexity into deterministic code

Keeps the agent focused on decision quality

Allows continuous refinement without chaos

Operating Principles
1. Check for existing tools first

Before creating:

A React component

A Laravel controller

A migration or helper

Check:

Existing components

Existing API endpoints

Existing directives or execution scripts

Only create new artifacts when necessary.

2. Self-anneal when things break

When errors occur (build errors, runtime bugs, failed API calls):

Read the error carefully

Identify whether the issue is:

Frontend (React)

Backend (Laravel)

Database (MySQL)

Fix the root cause

Re-run or re-test

Confirm stability

⚠️ If the fix involves:

Breaking changes

Schema redesign

Paid services
→ Pause and ask the user first

3. Update directives as you learn

Directives are living documents.

When you discover:

Validation rules

Performance constraints

UI edge cases

Better architectural patterns

→ Propose updates to the directive.

❗ Do not overwrite or create new directives without permission unless explicitly instructed.

Self-Annealing Loop (Mandatory)

Every failure improves the system.

Fix the issue

Improve the code/tool

Re-test

Update the directive

Proceed with a stronger baseline

This applies to:

React components

Laravel services

Database schemas

API contracts

File & Project Organization
Deliverables vs Intermediates

Deliverables

Deployed APIs

React UI screens

Database schema

API documentation

Cloud-accessible outputs

Intermediates

Logs

Temporary exports

Test payloads

Build artifacts

Directory Structure (Conceptual)
/directives
  └── feature_sops.md

/execution
  └── scaffolding_scripts
  └── data_fix_scripts

/.tmp
  └── temp_payloads
  └── debug_outputs

/backend (Laravel)
  └── app/
  └── routes/
  └── database/

/frontend (React)
  └── src/components
  └── src/pages
  └── src/services


Key Principle:
Local files are for processing.
Stable outputs must be accessible and reproducible.