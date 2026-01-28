# HRIS Project: Master Feature SOPs

This document serves as the entry point and master index for the 3-layer architecture instantiation in the HRIS project, as defined in [.agent/rules/AGENTS.md](file:///e:/2026/HRIS/.agent/rules/AGENTS.md).

## 🏢 Architecture Overview

The project is organized into three distinct layers:

1.  **Layer 1: Directives (Intent)** - Found in `directives/`. Defines *what* to build.
2.  **Layer 2: Orchestration (Decision)** - The AI Agent (Antigravity). Decides *how* to route work.
3.  **Layer 3: Execution (Action)** - Found in `execution/`, `app/`, `resources/js/`, etc. Performs the *deterministic* work.

## 📄 Active Directives Index

Below are the currently active SOPs and implementation plans:

### Core Architecture & Guidelines
- [Dashboard Layout Architecture](file:///e:/2026/HRIS/directives/dashboard-layout-architecture.md)
- [MUI Migration Progress](file:///e:/2026/HRIS/directives/mui-migration-progress.md)
- [Eloisoft Brand Guidelines](file:///e:/2026/HRIS/directives/brand-guidelines-eloisoft.md)

### People & Employee Management
- [People Module Implementation](file:///e:/2026/HRIS/directives/people-module-implementation.md)
- [New Employee Implementation](file:///e:/2026/HRIS/directives/new-employee-implementation.md)
- [Employee Personal Tab Implementation](file:///e:/2026/HRIS/directives/employee-personal-tab-implementation.md)

### Settings & Configuration
- [Standard Fields Implementation](file:///e:/2026/HRIS/directives/settings-standard-fields-implementation.md)
- [Custom Fields Implementation](file:///e:/2026/HRIS/directives/settings-custom-fields-implementation.md)
- [Employee Fields Assessment](file:///e:/2026/HRIS/directives/settings-employee-fields-assessment.md)

## 🛠️ Execution Resources

- **Scaffolding Scripts**: Located in `execution/scaffolding_scripts/`
- **Data Fix Scripts**: Located in `execution/data_fix_scripts/`

## 🧪 Intermediate Storage

- **Debug Outputs**: `.tmp/debug_outputs/`
- **Temp Payloads**: `.tmp/temp_payloads/`

---
> [!NOTE]
> All new features must start with a directive in the `directives/` folder before execution begins.
