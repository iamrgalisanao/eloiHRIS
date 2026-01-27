# Employee Fields Settings — Delivery Tasks

Status: In Progress
Last Updated: 2026-01-27

## Phase 1 — Database & Models

- [ ] Migration `create_employee_field_values_table`
  - [ ] Columns: `id`, `organization_id`, `category`, `label`, `label_slug`, `sort_order`, timestamps
  - [ ] Indexes: unique(`organization_id`,`category`,`label_slug`), index(`organization_id`,`category`,`sort_order`)
- [ ] Model `App/Models/EmployeeFieldValue.php`
  - [ ] Use `BelongsToOrganization`
  - [ ] `$fillable = ['organization_id','category','label','label_slug','sort_order']`
  - [ ] Helper to compute `label_slug` (lowercase/trim/collapse-space)
- [ ] Optional seed: insert distinct values from `job_info` for mapped categories

## Phase 2 — API Layer

- [ ] Controller `App/Http/Controllers/Api/EmployeeFieldController.php`
  - [ ] `index`: list values with `people_count` (scoped by org)
  - [ ] `store`: validate, compute `label_slug`, enforce uniqueness
  - [ ] `update`: rename with optional cascade; merge if target exists
  - [ ] `destroy`: delete or require `transfer_to` then cascade
  - [ ] Wrap rename/delete in DB transactions
- [ ] Routes `routes/api.php`
  - [ ] Prefix `employee-fields`; middleware `auth:sanctum`, `can:manage-settings`, `throttle:60,1`
- [ ] Validation & Errors
  - [ ] Allowed categories validation
  - [ ] `duplicate_label`, `transfer_required`, `invalid_category` error shapes

## Phase 3 — Frontend

- [ ] Route `/settings/employee-fields/:category?` (default `department`)
- [ ] Components
  - [ ] `resources/js/components/settings/SettingsLayout.jsx`
  - [ ] `resources/js/components/settings/EmployeeFields.jsx`
  - [ ] `resources/js/components/settings/FieldValueRow.jsx`
  - [ ] `resources/js/components/modals/ConfirmDeleteWithTransfer.jsx`
- [ ] API Service `resources/js/services/employeeFieldService.js`
  - [ ] `getValues`, `createValue`, `renameValue`, `deleteValue`
- [ ] UX
  - [ ] Loading/empty/error states; toasts; confirm cascade when needed
  - [ ] People count links to filtered People Directory

## Phase 4 — Integration & Polish

- [ ] Wire frontend to live API; preserve list state after mutations
- [ ] QA flows: add/rename/delete/transfer/merge; counts; directory navigation
- [ ] Security review: scopes, gates, rate limiting
- [ ] Rollout: migrate, deploy API, enable route, monitor

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
