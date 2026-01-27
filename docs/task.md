# Employee Fields Settings — Delivery Tasks

Status: In Progress
Last Updated: 2026-01-27

## Phase 1 — Database & Models

- [x] Migration `create_employee_field_values_table`
  - [x] Columns: `id`, `organization_id`, `category`, `label`, `label_slug`, `sort_order`, timestamps
  - [x] Indexes: unique(`organization_id`,`category`,`label_slug`), index(`organization_id`,`category`,`sort_order`)
- [x] Model `App/Models/EmployeeFieldValue.php`
  - [x] Use `BelongsToOrganization`
  - [x] `$fillable = ['organization_id','category','label','label_slug','sort_order']`
  - [x] Helper to compute `label_slug` (lowercase/trim/collapse-space)
- [x] Optional improvement: Composite indexes on `job_info` for counts/cascade (org+department/division/job_title/location)
- [ ] Optional seed: insert distinct values from `job_info` for mapped categories
 - [x] Standard fields seeder: seed predefined values (compensation_change_reason, degree, emergency_contact_relationship, termination_reason)

## Phase 2 — API Layer

- [x] Controller `App/Http/Controllers/Api/EmployeeFieldController.php`
  - [x] `index`: list values with `people_count` (scoped by org)
  - [x] `store`: validate, compute `label_slug`, enforce uniqueness
  - [x] `update`: rename with optional cascade; merge if target exists
  - [x] `destroy`: delete or require `transfer_to` then cascade
  - [x] Standard categories added (compensation_change_reason, degree, emergency_contact_relationship, termination_reason, pay_schedule)
  - [x] Wrap rename/delete in DB transactions
- [x] Routes `routes/api.php`
  - [x] Prefix `employee-fields`; middleware protected (relaxed locally)
- [x] Validation & Errors
  - [x] Allowed categories validation
  - [x] `duplicate_label`, `transfer_required`, `invalid_category` error shapes

## Phase 3 — Frontend

- [ ] Route `/settings/employee-fields/:category?` (default `department`)
- [x] Components
  - [x] `resources/js/components/settings/EmployeeFields.jsx` (extended to include Standard Fields categories)
- [x] API Service `resources/js/services/employeeFieldService.js`
  - [x] `listEmployeeFields`, `createEmployeeField`, `renameEmployeeField`, `deleteEmployeeField`
- [x] UX
  - [x] Loading/empty/error states; basic confirmations
  - [x] People count links to filtered People Directory (only for mapped categories)

## Phase 4 — Integration & Polish

- [x] Wire frontend to live API; preserve list state after mutations
- [x] QA flows: add/rename/delete/transfer/merge; counts; directory navigation
- [x] Security review: scopes, gates, rate limiting (local relaxed)
- [x] Rollout: migrate, seed, enable route

## Tests (Feature)

- [ ] Org isolation across tenants
- [ ] Case-insensitive uniqueness via `label_slug`
- [ ] Create success and duplicate rejection
- [ ] Rename cascade limited to org
- [ ] Merge on rename into existing value
- [ ] Delete zero-usage; transfer required when in use; transfer success
- [ ] Unsupported categories: counts 0; cascade/transfer no-ops
- [ ] AuthZ blocks unauthenticated/unauthorized

## Definition of Done

- [ ] All tests green; manual QA scenarios pass
- [ ] Docs updated if route or behavior differs
- [ ] Observability: log errors for cascade/transfer operations
