# Settings: Employee Fields — Implementation Plan

Status: Draft
Owner: <your-name>
Last Updated: 2026-01-27

## Context
Build Settings → Employee Fields screen to manage taxonomy values (Department, Division, Job Title, Location, etc.). Show people counts per value; support add, rename (with cascade), and delete (with transfer). Keep current `job_info` string columns; no breaking schema.

## Tenancy Model
- This system operates in both single-tenant and multi-tenant modes.
- Tenant = Organization. For Settings endpoints, tenant is derived from the authenticated user: `auth()->user()->organization_id`. We do not accept subdomain/header overrides for these endpoints.
- All reads/writes are scoped to the authenticated user’s organization.

## Goals
- CRUD values per organization + category
- Display `people_count` and link to People Directory filtered view
- Safe operations: rename with cascade; delete with transfer or merge
- Maintain existing schema; set foundation for later normalization

Non-Goals (now): auth/roles beyond an admin gate, FK normalization, bulk import/export.

## Milestones
- Phase 1: Backend (DB, model, controller, routes, tests)
- Phase 2: Frontend (UI scaffolding, components, mock fallback)
- Phase 3: Integration (wire APIs, filters, polish)

---

## Phase 1 — Backend

### Schema
Table: `employee_field_values`
- `id` bigint pk
- `organization_id` fk -> `organizations`
- `category` string (allowed: `department`, `division`, `job_title`, `location`, `employment_status`, `team`)
- `label` string (displayed as-is)
- `label_slug` string (lowercased/trimmed for case-insensitive uniqueness)
- `sort_order` smallint default 0
- timestamps
- unique `(organization_id, category, label_slug)`
- index `(organization_id, category, sort_order)`

Migration name: `create_employee_field_values_table`

### Model
`App\Models\EmployeeFieldValue`
- Uses `BelongsToOrganization`
- `$fillable = ['organization_id','category','label','label_slug','sort_order']`

### Category → Column Map
- `department` → `job_info.department`
- `division` → `job_info.division`
- `job_title` → `job_info.job_title`
- `location` → `job_info.location`
- `employment_status`, `team` → (no mapped column yet; counts = 0; cascade/transfer no-ops)

### Controller
`App\Http\Controllers\Api\EmployeeFieldController`

Scoping:
- Resolve `orgId = auth()->user()->organization_id` for every action.
- All queries filter by `organization_id = $orgId`. All creates set `organization_id = $orgId`.

Routes:
- GET `/api/employee-fields?category=department`
- POST `/api/employee-fields/{category}` body `{ label }`
- PUT `/api/employee-fields/{category}/{id}` body `{ label, cascade?: bool }`
- DELETE `/api/employee-fields/{category}/{id}` query `transfer_to?: id`

Behavior:
- Index: return managed values with `people_count` from `job_info` grouped on the mapped column; scoped by org.
- Create: validate label (trim, normalize to `label_slug`), enforce uniqueness per org/category (case-insensitive), return created row with `people_count: 0`.
- Update (rename): validate new label/slug.
  - If `cascade` true and mapped column exists: update `job_info` where `col = oldLabel AND org_id = $orgId` within a transaction.
  - If new `label_slug` matches an existing value in the same category/org, perform a merge: cascade `job_info` to the target label, then delete the source value.
- Delete:
  - If mapped column usage count > 0:
    - If `transfer_to` missing → 422 `transfer_required` with candidate list.
    - If `transfer_to` equals same id → 422.
    - If valid `transfer_to`: cascade rows to target label and delete source.
  - If usage count = 0: delete directly.
- Transactions & Locking: wrap rename/delete in DB transactions; lock source row (FOR UPDATE on MySQL; transaction suffices on SQLite).

### Error Shapes
- Duplicate label:
  ```json
  { "code":"duplicate_label", "message":"Label already exists.", "field":"label" }
  ```
- Transfer required:
  ```json
  {
    "code":"transfer_required",
    "message":"Value is in use; specify transfer_to.",
    "values":[ { "id": 13, "label":"Sales", "people_count": 21 } ]
  }
  ```
- Invalid category:
  ```json
  { "code":"invalid_category", "message":"Unsupported category." }
  ```

### Validation
- `category` in allowed list
- `label` required, trimmed, max 120; `label_slug` = lowercase(trim(collapse-space(label)))
- Uniqueness on `(organization_id, category, label_slug)`
- `transfer_to` must be a different id in the same org/category

### Seed (optional)
- Per org, for each mapped category, insert distinct non-null labels from `job_info` that are not yet present (computing `label_slug`).

### Tests (Feature)
Single + Multi-tenant:
- Isolation: two users in different orgs see only their org’s values and counts.
- Uniqueness: case-insensitive uniqueness enforced per org/category via `label_slug`.
- Create: success + duplicate rejection.
- Update: rename with cascade updates only current org’s `job_info`.
- Merge: renaming into an existing label merges correctly.
- Delete: zero-usage delete OK; usage requires transfer; transfer succeeds.
- Unsupported categories: CRUD ok; counts = 0; cascade/transfer are no-ops (documented).
- AuthZ: unauthenticated blocked; non-admin blocked when gate enabled.

### Security
- Protect routes with `auth:sanctum` and a gate/policy `can:manage-settings`.
- Add rate limiting to mutation endpoints (e.g., `throttle:60,1`).

---

## Phase 2 — Frontend

### Route
`/settings/employee-fields/:category?` (default `department`)

### Components (new)
- `resources/js/components/settings/SettingsLayout.jsx`
  - Two-column settings shell with left settings rail and right glass panel
- `resources/js/components/settings/EmployeeFields.jsx`
  - Left in-page list of categories (Department, Division, Employment Status, Job Title, Location, Teams)
  - Right panel:
    - Header with current category
    - "New Item" input + Add button
    - Table (Name, People); row actions: edit inline, delete
    - People count link → People Directory with query param
- `resources/js/components/settings/FieldValueRow.jsx`
  - Inline editing, emits `onRename`, `onDelete`
- `resources/js/components/modals/ConfirmDeleteWithTransfer.jsx`
  - If `people_count > 0`, select `transfer_to` value

### API Client
`resources/js/lib/api/employeeFields.js`
- `list(category)`
- `create(category, label)`
- `rename(category, id, label, cascade)`
- `remove(category, id, transferToId)`

### UX Details
- Disabled states during requests; success/error toasts
- Confirm rename when cascading (if `people_count > 0`)
- Loading/empty/error states
- A11y: labels, focus rings, ESC to close modals, Enter to submit
- Auth: ensure requests include credentials (Sanctum), relying on user’s org for scoping

---

## Phase 3 — Integration

- Wire UI to live API for mapped categories; keep mock fallback for unsupported categories
- Count links navigate to People Directory; Directory reads query params (`department`, `division`, `job_title`, `location`) and filters client-side initially
- Optionally extend `/api/employees` to accept server-side filters later
- Refresh after mutations; preserve sort/scroll position
- Optional: debounce search, route keep-alive

---

## Risks & Tradeoffs
- String-based cascades rely on exact matches and collation (acceptable for MVP)
- Case-insensitive uniqueness handled via `label_slug`; keep DB collation differences harmless
- API requires auth; ensure local dev has a seeded user

---

## Rollout
1) `php artisan migrate` (+ optional seed)
2) Deploy API (auth-protected)
3) Release UI route
4) QA flows: add/rename/delete/transfer/merge; counts; People Directory filters
5) Monitor logs; rollback by hiding route and reverting migration if needed

---

## Future Work
- Show unmanaged values (from `job_info` but not managed) with "Convert to managed"
- Drag-and-drop ordering; update `sort_order`
- Bulk import/export
- Role-based auth and admin UI for assignments
- Normalize `job_info` to FKs

## Changelog
- 2026-01-27: Initial plan drafted; updated for auth-derived tenancy, `label_slug`, error shapes
