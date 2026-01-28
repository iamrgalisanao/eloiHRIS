# Custom Fields Implementation Plan

**Feature:** Employee Fields - Custom Fields Section  
**Date:** 2026-01-27  
**Status:** Planning

## Overview

Based on the provided screenshots, implement the **Custom Fields** section within the Employee Fields settings page. This section manages custom employee field categories that are organization-specific and not part of the standard employee taxonomy or standard fields.

## UI Analysis from Screenshots

### Custom Fields Categories Identified

From the screenshots, the following Custom Fields categories are visible:

1. **Approval**
   - Values: No, Yes
   - Simple yes/no approval field

2. **Asset Category**
   - Values: Building Key, Cell Phone, Cellular Phone, Computer, Corporate Card, Desk Phone, Hardware, Monitor, Software
   - Asset types assigned to employees

3. **Bonus: Reason**
   - Values: Performance
   - Reasons for bonus awards

4. **Category**
   - Values: Gas, Lunch, Per Diem, Travel
   - Expense or reimbursement categories

5. **Finance Approval**
   - Values: Declined, Pending, Yes
   - Finance approval status

6. **Receipt Attached**
   - Boolean/status field for expense tracking

7. **Secondary Language**
   - Employee language skills

8. **Shirt size**
   - Employee apparel size

9. **Visa**
   - Visa/work authorization status

### UI Patterns Observed

- **Same layout** as Standard Fields (left sidebar, right content area)
- **Green highlighting** for selected category in "Custom Fields" section
- **Inline add** functionality with "New Item" input and green "Add" button
- **Simple list view** with values displayed vertically
- **Category name with ↑** indicator at the top of the value list
- **Consistent styling** with Standard Fields

---

## Current State Analysis

### What Already Exists ✅

1. **Database Schema**
   - `employee_field_values` table supports custom categories
   - `category` column can store any string value
   - `label_slug` ensures case-insensitive uniqueness

2. **Backend API**
   - `EmployeeFieldController` has flexible category support
   - Categories not in `ALLOWED_CATEGORIES` will be rejected
   - Need to add custom field categories to allowed list

3. **Frontend Component**
   - `EmployeeFields.jsx` has "Custom Fields" section header
   - Currently empty (placeholder)
   - Need to populate with custom categories

---

## Implementation Plan

### Phase 1: Backend Updates (1-2 hours)

#### 1.1 Update EmployeeFieldController

**File:** `app/Http/Controllers/Api/EmployeeFieldController.php`

Add custom field categories to `ALLOWED_CATEGORIES`:

```php
private const ALLOWED_CATEGORIES = [
    // Standard fields
    'compensation_change_reason', 'degree', 'emergency_contact_relationship', 
    'termination_reason', 'pay_schedule',
    
    // Employee taxonomy fields
    'department', 'division', 'job_title', 'location', 'employment_status', 'team',
    
    // Custom fields
    'approval', 'asset_category', 'bonus_reason', 'category', 
    'finance_approval', 'receipt_attached', 'secondary_language', 
    'shirt_size', 'visa',
];
```

Update `CATEGORY_COLUMN_MAP` to include custom fields (all with `null` - no cascade):

```php
private const CATEGORY_COLUMN_MAP = [
    // Employee taxonomy mapped to job_info columns
    'department' => 'department',
    'division' => 'division',
    'job_title' => 'job_title',
    'location' => 'location',
    
    // Unmapped categories (no counts/cascade)
    'employment_status' => null,
    'team' => null,
    
    // Standard fields (no counts/cascade)
    'compensation_change_reason' => null,
    'degree' => null,
    'emergency_contact_relationship' => null,
    'termination_reason' => null,
    'pay_schedule' => null,
    
    // Custom fields (no counts/cascade)
    'approval' => null,
    'asset_category' => null,
    'bonus_reason' => null,
    'category' => null,
    'finance_approval' => null,
    'receipt_attached' => null,
    'secondary_language' => null,
    'shirt_size' => null,
    'visa' => null,
];
```

#### 1.2 Create CustomFieldsSeeder

**File:** `database/seeders/CustomFieldsSeeder.php`

Populate the database with custom field values from screenshots:

```php
<?php

namespace Database\Seeders;

use App\Models\EmployeeFieldValue;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class CustomFieldsSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::query()->orderBy('id')->first();
        if (!$org) {
            $org = Organization::create([
                'name' => 'Demo Organization',
                'slug' => 'demo'
            ]);
        }
        $orgId = (int) $org->id;

        $fields = [
            'approval' => ['No', 'Yes'],
            'asset_category' => [
                'Building Key', 'Cell Phone', 'Cellular Phone', 'Computer',
                'Corporate Card', 'Desk Phone', 'Hardware', 'Monitor', 'Software'
            ],
            'bonus_reason' => ['Performance'],
            'category' => ['Gas', 'Lunch', 'Per Diem', 'Travel'],
            'finance_approval' => ['Declined', 'Pending', 'Yes'],
            // Note: Receipt Attached, Secondary Language, Shirt size, Visa 
            // may have no predefined values (user-defined)
        ];

        foreach ($fields as $category => $values) {
            foreach ($values as $index => $value) {
                EmployeeFieldValue::firstOrCreate(
                    [
                        'organization_id' => $orgId,
                        'category' => $category,
                        'label_slug' => EmployeeFieldValue::makeLabelSlug($value),
                    ],
                    [
                        'label' => $value,
                        'sort_order' => $index,
                    ]
                );
            }
        }

        $this->command->info('✓ Seeded custom employee field values');
    }
}
```

---

### Phase 2: Frontend Updates (2-3 hours)

#### 2.1 Update EmployeeFields.jsx

**File:** `resources/js/components/settings/EmployeeFields.jsx`

Add custom field categories to the `CATEGORIES` array:

```javascript
const CATEGORIES = [
  // Employee taxonomy
  { key: 'department', label: 'Department' },
  { key: 'division', label: 'Division' },
  { key: 'job_title', label: 'Job Title' },
  { key: 'location', label: 'Location' },
  { key: 'employment_status', label: 'Employment Status' },
  { key: 'team', label: 'Teams' },
  
  // Standard fields
  { key: 'compensation_change_reason', label: 'Compensation Change Reason' },
  { key: 'degree', label: 'Degree' },
  { key: 'emergency_contact_relationship', label: 'Emergency Contact Relationship' },
  { key: 'termination_reason', label: 'Termination Reason' },
  { key: 'pay_schedule', label: 'Pay Schedule' },
  
  // Custom fields
  { key: 'approval', label: 'Approval' },
  { key: 'asset_category', label: 'Asset Category' },
  { key: 'bonus_reason', label: 'Bonus: Reason' },
  { key: 'category', label: 'Category' },
  { key: 'finance_approval', label: 'Finance Approval' },
  { key: 'receipt_attached', label: 'Receipt Attached' },
  { key: 'secondary_language', label: 'Secondary Language' },
  { key: 'shirt_size', label: 'Shirt size' },
  { key: 'visa', label: 'Visa' },
];
```

Update the category list rendering to show custom fields:

```javascript
{/* Custom Fields Section */}
<div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
  Custom Fields
</div>
{CATEGORIES.slice(11).map(c => (
  <div key={c.key} onClick={() => setCategory(c.key)}
       style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
         background: category === c.key ? 'var(--primary)' : 'transparent', 
         color: category === c.key ? '#fff' : 'var(--text-main)', fontWeight: 600 }}>
    {c.label}
  </div>
))}
```

---

### Phase 3: Integration & Testing (1-2 hours)

#### 3.1 Run Seeder

```bash
php artisan db:seed --class=CustomFieldsSeeder
```

#### 3.2 Test API Endpoints

Test each custom field category:

```bash
# Test Approval
curl http://localhost:8000/api/employee-fields?category=approval

# Test Asset Category
curl http://localhost:8000/api/employee-fields?category=asset_category

# Test Bonus Reason
curl http://localhost:8000/api/employee-fields?category=bonus_reason

# Test Category
curl http://localhost:8000/api/employee-fields?category=category

# Test Finance Approval
curl http://localhost:8000/api/employee-fields?category=finance_approval
```

Expected response format:
```json
[
  {"id": 1, "label": "Value 1", "people_count": 0},
  {"id": 2, "label": "Value 2", "people_count": 0}
]
```

#### 3.3 Frontend Testing

1. Navigate to Settings → Employee Fields
2. Verify "Custom Fields" section appears with all 9 categories
3. Click each category and verify:
   - Values load correctly
   - "Add" functionality works
   - "Rename" functionality works
   - "Delete" functionality works
   - No people count links (custom fields don't cascade)

---

## Technical Considerations

### ✅ Advantages

1. **Reuses existing infrastructure**: Same table, controller, and frontend component
2. **Consistent UX**: Same patterns as Standard Fields and Employee Taxonomy
3. **Flexible**: Easy to add more custom fields in the future
4. **No cascade complexity**: Custom fields don't link to `job_info` table

### ⚠️ Considerations

1. **No people count tracking**: Custom fields return `people_count: 0`
   - **Reason**: No database column mapping (not in `job_info` table)
   - **Future**: Could add custom field values to employee profiles via separate table

2. **Category naming**: Some categories have special characters
   - `bonus_reason` (underscore in key, colon in label: "Bonus: Reason")
   - **Solution**: Use underscores in keys, display labels can have special chars

3. **Empty categories**: Some categories may have no predefined values
   - `receipt_attached`, `secondary_language`, `shirt_size`, `visa`
   - **Solution**: Users can add values as needed

4. **Boolean-like fields**: `approval`, `receipt_attached`
   - Could be modeled as true/false, but using string values for flexibility
   - **Current**: "Yes"/"No" string values

---

## Estimated Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Backend | 1-2 hours | Controller updates, CustomFieldsSeeder |
| Phase 2: Frontend | 2-3 hours | EmployeeFields.jsx updates |
| Phase 3: Testing | 1-2 hours | Seeder run, API tests, UI tests |
| **Total** | **4-7 hours** | **Fully functional Custom Fields** |

---

## Implementation Steps

### Step 1: Update Backend (30 min)
- [ ] Add 9 custom categories to `EmployeeFieldController::ALLOWED_CATEGORIES`
- [ ] Add 9 custom categories to `CATEGORY_COLUMN_MAP` with `null` values

### Step 2: Create Seeder (30 min)
- [ ] Create `CustomFieldsSeeder.php`
- [ ] Add predefined values for 5 categories
- [ ] Run seeder: `php artisan db:seed --class=CustomFieldsSeeder`

### Step 3: Update Frontend (1-2 hours)
- [ ] Add 9 custom categories to `CATEGORIES` array in `EmployeeFields.jsx`
- [ ] Update category list rendering to show custom fields (slice 11+)
- [ ] Test category switching

### Step 4: QA Testing (1-2 hours)
- [ ] Test API endpoints for all 9 custom categories
- [ ] Test CRUD operations (add, rename, delete)
- [ ] Verify `people_count: 0` for all custom fields
- [ ] Verify no errors or console warnings

---

## Category Mapping Reference

| Screenshot Category | Key (snake_case) | Label (Display) | Predefined Values |
|---------------------|------------------|-----------------|-------------------|
| Approval | `approval` | Approval | No, Yes |
| Asset Category | `asset_category` | Asset Category | 9 values |
| Bonus: Reason | `bonus_reason` | Bonus: Reason | Performance |
| Category | `category` | Category | Gas, Lunch, Per Diem, Travel |
| Finance Approval | `finance_approval` | Finance Approval | Declined, Pending, Yes |
| Receipt Attached | `receipt_attached` | Receipt Attached | (empty - user-defined) |
| Secondary Language | `secondary_language` | Secondary Language | (empty - user-defined) |
| Shirt size | `shirt_size` | Shirt size | (empty - user-defined) |
| Visa | `visa` | Visa | (empty - user-defined) |

---

## Next Steps

1. ✅ Review this implementation plan
2. Update `EmployeeFieldController::ALLOWED_CATEGORIES`
3. Create and run `CustomFieldsSeeder`
4. Update `EmployeeFields.jsx` with custom categories
5. Test all CRUD operations
6. Update `docs/task.md` with Custom Fields tasks

---

## Screenshots Reference

The implementation is based on the following UI patterns from the provided screenshots:

1. **Approval** - Simple yes/no values
2. **Asset Category** - Multiple asset types
3. **Bonus: Reason** - Single value (Performance)
4. **Category** - Expense categories
5. **Finance Approval** - Approval workflow statuses

All custom fields follow the same inline add/list pattern as Standard Fields.
