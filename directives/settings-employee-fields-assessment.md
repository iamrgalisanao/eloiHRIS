# Settings: Employee Fields — Implementation Assessment

**Status:** ✅ **READY TO IMPLEMENT**  
**Last Updated:** 2026-01-27

## Executive Summary

The Employee Fields Settings feature can be implemented now. All prerequisites are in place:
- ✅ `job_info` table exists with required columns (department, division, location, job_title)
- ✅ Organization multi-tenancy infrastructure exists
- ✅ Similar patterns already implemented (CustomField/CustomFieldValue)
- ✅ Frontend component patterns established (modals, settings pages, CRUD operations)

## What This Feature Does

Provides a centralized management interface for employee taxonomy values:
- **Manage** Department, Division, Job Title, Location, Employment Status, and Team values
- **View** people counts for each value
- **Rename** values with cascade updates to all employees
- **Delete** values with safe transfer to another value
- **Navigate** from counts to filtered People Directory

## Current State Analysis

### ✅ Database Ready
- `job_info` table exists with columns:
  - `department` (string, nullable)
  - `division` (string, nullable)
  - `location` (string, nullable)
  - `job_title` (string, required)
- Organization multi-tenancy via `organization_id` FK

### ✅ Backend Patterns Exist
- `BelongsToOrganization` trait available
- API controller patterns established
- Validation and error handling patterns in place

### ✅ Frontend Patterns Exist
- Settings page layouts (TimeOffSettings as reference)
- Modal components (EditCategoryModal, DeleteCategoryModal)
- Toast notifications
- CRUD operations with optimistic UI updates

## Implementation Plan

### Phase 1: Database & Models (2-3 hours)

#### 1.1 Create Migration
**File:** `database/migrations/YYYY_MM_DD_create_employee_field_values_table.php`

```php
Schema::create('employee_field_values', function (Blueprint $table) {
    $table->id();
    $table->foreignId('organization_id')->constrained()->onDelete('cascade');
    $table->string('category'); // department, division, job_title, location, employment_status, team
    $table->string('label');
    $table->smallInteger('sort_order')->default(0);
    $table->timestamps();
    
    $table->unique(['organization_id', 'category', 'label']);
    $table->index(['organization_id', 'category', 'sort_order']);
});
```

#### 1.2 Create Model
**File:** `app/Models/EmployeeFieldValue.php`

- Use `BelongsToOrganization` trait
- Define fillable fields
- Add scopes for filtering by category
- Add helper method to get people count

#### 1.3 Seed Existing Data (Optional)
Extract distinct values from `job_info` table and populate `employee_field_values`

---

### Phase 2: API Layer (3-4 hours)

#### 2.1 Create Controller
**File:** `app/Http/Controllers/Api/EmployeeFieldController.php`

**Endpoints:**
- `GET /api/employee-fields?category=department` - List values with counts
- `POST /api/employee-fields/{category}` - Create new value
- `PUT /api/employee-fields/{category}/{id}` - Rename value (with cascade option)
- `DELETE /api/employee-fields/{category}/{id}` - Delete value (with transfer option)

**Key Logic:**
- **People Count:** Join with `job_info` and count employees per value
- **Cascade Rename:** Update all `job_info` records where column = old value
- **Safe Delete:** Require `transfer_to` parameter if value is in use

#### 2.2 Add Routes
**File:** `routes/api.php`

```php
Route::prefix('employee-fields')->group(function () {
    Route::get('/', [EmployeeFieldController::class, 'index']);
    Route::post('/{category}', [EmployeeFieldController::class, 'store']);
    Route::put('/{category}/{id}', [EmployeeFieldController::class, 'update']);
    Route::delete('/{category}/{id}', [EmployeeFieldController::class, 'destroy']);
});
```

#### 2.3 Validation
- Category must be in allowed list
- Label required, max 120 chars, unique per org+category (case-insensitive)
- Cascade rename requires confirmation
- Delete with usage requires transfer_to parameter

---

### Phase 3: Frontend (4-5 hours)

#### 3.1 Create Settings Layout
**File:** `resources/js/components/settings/SettingsLayout.jsx`

Two-column layout:
- Left sidebar with settings categories
- Right content area with glass panel

#### 3.2 Create Employee Fields Page
**File:** `resources/js/components/settings/EmployeeFields.jsx`

Features:
- Category selector (Department, Division, Job Title, Location, Employment Status, Teams)
- Add new value input + button
- Table showing values with:
  - Name column
  - People count (clickable link to filtered People Directory)
  - Actions (rename, delete)
- Inline editing for rename
- Delete confirmation modal with transfer option

#### 3.3 Create API Service
**File:** `resources/js/services/employeeFieldService.js`

Methods:
- `getValues(category)` - Fetch values with counts
- `createValue(category, label)` - Add new value
- `renameValue(category, id, label, cascade)` - Rename with optional cascade
- `deleteValue(category, id, transferToId)` - Delete with optional transfer

#### 3.4 Add Route
**File:** `resources/js/components/App.jsx`

```jsx
<Route path="/settings/employee-fields/:category?" element={<EmployeeFields />} />
```

---

### Phase 4: Integration & Polish (2-3 hours)

- Wire frontend to API endpoints
- Add loading states and error handling
- Implement toast notifications for success/error
- Add confirmation dialogs for destructive actions
- Link people counts to People Directory with filters
- Test all CRUD operations
- Handle edge cases (empty states, validation errors)

---

## Technical Considerations

### ✅ Advantages
1. **Non-Breaking:** Uses existing `job_info` string columns
2. **Incremental:** Can be built and tested independently
3. **Familiar Patterns:** Similar to TimeOffSettings implementation
4. **Immediate Value:** Provides data governance and consistency

### ⚠️ Considerations
1. **String-Based Matching:** Cascade/transfer relies on exact string matches
2. **Case Sensitivity:** Need to handle case-insensitive uniqueness in application layer
3. **No Auth Yet:** API endpoints should be restricted to admins (add later)
4. **Unmapped Categories:** Employment Status and Team have no `job_info` columns yet (counts will be 0)

### 🔮 Future Enhancements
- Normalize `job_info` to use foreign keys instead of strings
- Bulk import/export
- Drag-and-drop reordering
- Show unmanaged values with "Convert to managed" option
- Add Sanctum authentication and admin gates

---

## Estimated Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Database & Models | 2-3 hours | Migration, Model, Seeder |
| Phase 2: API Layer | 3-4 hours | Controller, Routes, Validation |
| Phase 3: Frontend | 4-5 hours | Components, Service, Routes |
| Phase 4: Integration | 2-3 hours | Testing, Polish, Edge Cases |
| **Total** | **11-15 hours** | **Fully functional feature** |

---

## Recommendation

✅ **PROCEED WITH IMPLEMENTATION**

This feature is well-scoped, builds on existing patterns, and provides immediate value for data governance. The implementation is straightforward with minimal risk.

**Suggested Approach:**
1. Start with Phase 1 (Database) - can be tested independently
2. Build Phase 2 (API) - can be tested with Postman/curl
3. Create Phase 3 (Frontend) - can use mock data initially
4. Complete Phase 4 (Integration) - wire everything together

**Next Steps:**
1. Create task breakdown in `task.md`
2. Begin with database migration
3. Implement incrementally with testing at each phase
