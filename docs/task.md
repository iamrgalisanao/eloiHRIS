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
- [x] **Standard Fields Seeder**: Created and run `StandardFieldsSeeder` to populate:
  - [x] `compensation_change_reason` (6 values)
  - [x] `degree` (4 values)
  - [x] `emergency_contact_relationship` (9 values)
  - [x] `termination_reason` (8 values)
- [ ] **Custom Fields Seeder**: Create and run `CustomFieldsSeeder` to populate:
  - [ ] `approval` (2 values: No, Yes)
  - [ ] `asset_category` (9 values: Building Key, Cell Phone, Cellular Phone, Computer, Corporate Card, Desk Phone, Hardware, Monitor, Software)
  - [ ] `bonus_reason` (1 value: Performance)
  - [ ] `category` (4 values: Gas, Lunch, Per Diem, Travel)
  - [ ] `finance_approval` (3 values: Declined, Pending, Yes)
  - [ ] Leave empty: `receipt_attached`, `secondary_language`, `shirt_size`, `visa` (user-defined)

## Phase 2 — API Layer

- [x] Controller `App/Http/Controllers/Api/EmployeeFieldController.php`
  - [x] `index`: list values with `people_count` (scoped by org)
  - [x] `store`: validate, compute `label_slug`, enforce uniqueness
  - [x] `update`: rename with optional cascade; merge if target exists
  - [x] `destroy`: delete or require `transfer_to` then cascade
  - [x] **Standard Categories Added**: `ALLOWED_CATEGORIES` includes:
    - [x] `compensation_change_reason`, `degree`, `emergency_contact_relationship`, `termination_reason`, `pay_schedule`
  - [ ] **Add Custom Categories**: Update `ALLOWED_CATEGORIES` to include:
    - [ ] `approval`, `asset_category`, `bonus_reason`, `category`, `finance_approval`
    - [ ] `receipt_attached`, `secondary_language`, `shirt_size`, `visa`
  - [x] Wrap rename/delete in DB transactions
- [x] Routes `routes/api.php`
  - [x] Prefix `employee-fields`; middleware protected (relaxed locally)
- [x] Validation & Errors
  - [x] Allowed categories validation
  - [x] `duplicate_label`, `transfer_required`, `invalid_category` error shapes

## Phase 3 — Frontend

- [ ] Route `/settings/employee-fields/:category?` (default `department`)
- [x] **Standard Fields UI Complete**:
  - [x] Added `standardFields` category group with 5 categories
  - [x] Added section headers ("Standard Fields", "Custom Fields")
  - [x] Fixed `team` (not `teams`) for Teams category
  - [x] Category list shows employee taxonomy and standard fields
- [ ] **Add Custom Fields to UI**:
  - [ ] Add 9 custom field categories to `CATEGORIES` array in `EmployeeFields.jsx`
  - [ ] Update category list rendering to show custom fields (slice 11+)
  - [ ] Test category switching for all custom fields
- [x] Components
  - [x] `resources/js/components/settings/EmployeeFields.jsx` (extended with Standard Fields)
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
- [ ] **Custom Fields QA**:
  - [ ] Test API endpoints for all 9 custom categories
  - [ ] Test CRUD operations (add, rename, delete) for custom fields
  - [ ] Verify `people_count: 0` for all custom fields
  - [ ] Verify no cascade/transfer for custom fields

## Tests (Feature)

- [ ] Org isolation across tenants
- [ ] Case-insensitive uniqueness via `label_slug`
- [ ] Create success and duplicate rejection
- [ ] Rename cascade limited to org
- [ ] Merge on rename into existing value
- [ ] Delete zero-usage; transfer required when in use; transfer success
- [ ] Unsupported categories: counts 0; cascade/transfer no-ops
- [x] **Standard Fields**: Verified `people_count: 0` for all standard categories
- [ ] **Custom Fields**: Verify `people_count: 0` for all custom categories
- [ ] AuthZ blocks unauthenticated/unauthorized

## Definition of Done

- [ ] All tests green; manual QA scenarios pass
- [ ] Docs updated if route or behavior differs
- [ ] Observability: log errors for cascade/transfer operations
- [ ] **Standard Fields Complete**: All 5 standard field categories working
- [ ] **Custom Fields Complete**: All 9 custom field categories working

## Summary of Categories

### Employee Taxonomy (6) ✅
- Department, Division, Job Title, Location, Employment Status, Team

### Standard Fields (5) ✅
- Compensation Change Reason, Degree, Emergency Contact Relationship, Termination Reason, Pay Schedule

### Custom Fields (9) 🔄 In Progress
- Approval, Asset Category, Bonus: Reason, Category, Finance Approval
- Receipt Attached, Secondary Language, Shirt size, Visa
