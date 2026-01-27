# Standard Fields Implementation Plan

**Feature:** Employee Fields - Standard Fields Section  
**Date:** 2026-01-27  
**Status:** Planning (aligned with current backend/UI)

## Overview

Based on the provided screenshots, implement the **Standard Fields** section within the Employee Fields settings page. This section manages predefined employee field categories with their allowed values.

## UI Analysis from Screenshots

### Layout Structure
- **Left Sidebar**: Settings navigation with "Employee Fields" highlighted
- **Left Panel**: List of field categories (Department, Division, Employment Status, Job Title, Location, Teams)
- **Right Panel**: Selected category details with:
  - Category title (e.g., "Compensation Change Reason")
  - "New Item" input field with green "Add" button
  - List of existing values
  - Category name with "↑" indicator

### Standard Fields Categories (from screenshots)
1. **Compensation Change Reason**
   - Values: Annual Pay Increase, NA, Pay Increase, Promotion, Relocated, Title Change
   
2. **Degree**
   - Values: Associate's, Bachelor's, Doctorate, Master's
   
3. **Emergency Contact Relationship**
   - Values: Brother, Daughter, Father, Friend, Husband, Mother, Sister, Son, Wife
   
4. **Termination Reason**
   - Values: Attendance, End of Season, Life Happens, Not a Fit, Other, Other employment, Performance, Relocation
   
5. **Pay Schedule**
   - Different UI: Table format with columns (Name, Frequency, Period Ends, People)
   - Values: "Every other week", "Twice a month"
   - Has "+ New Pay Schedule" button instead of inline add

### UI Patterns Observed
- Green theme for active/selected items
- Clean, minimal design with good spacing
- Inline add functionality for most categories
- Table view for complex categories (Pay Schedule)
- Consistent typography and layout

---

## Implementation Plan

### Phase 1: Database & Backend (3-4 hours)

#### 1.1 Database Schema

**Note:** We already have `employee_field_values` table from the previous plan. We'll use it for Standard Fields as well.

**Categories to support:**
```php
const STANDARD_FIELD_CATEGORIES = [
    'compensation_change_reason',
    'degree',
    'emergency_contact_relationship',
    'termination_reason',
    'pay_schedule',
];
```

#### 1.2 Seed Standard Fields

**File:** `database/seeders/StandardFieldsSeeder.php`

Populate the database with the values shown in screenshots:

```php
class StandardFieldsSeeder extends Seeder
{
    public function run()
    {
        $org = Organization::query()->orderBy('id')->first();
        if (!$org) {
            $org = Organization::create(['name' => 'Demo Org', 'slug' => 'demo']);
        }
        $orgId = (int) $org->id;

        $fields = [
            'compensation_change_reason' => [
                'Annual Pay Increase', 'NA', 'Pay Increase',
                'Promotion', 'Relocated', 'Title Change'
            ],
            'degree' => [
                'Associate\'s', 'Bachelor\'s', 'Doctorate', 'Master\'s'
            ],
            'emergency_contact_relationship' => [
                'Brother', 'Daughter', 'Father', 'Friend',
                'Husband', 'Mother', 'Sister', 'Son', 'Wife'
            ],
            'termination_reason' => [
                'Attendance', 'End of Season', 'Life Happens',
                'Not a Fit', 'Other', 'Other employment',
                'Performance', 'Relocation'
            ],
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
    }
}
```

#### 1.3 Update EmployeeFieldController

**File:** `app/Http/Controllers/Api/EmployeeFieldController.php`

Already exists from previous plan. Ensure it supports the new standard field categories:

```php
const ALLOWED_CATEGORIES = [
    // Standard Fields
    'compensation_change_reason',
    'degree',
    'emergency_contact_relationship',
    'termination_reason',
    'pay_schedule',
    // Employee taxonomy fields
    'department',
    'division',
    'job_title',
    'location',
    'employment_status',
    'team',
];
```

Behavior Notes:
- Standard fields (`compensation_change_reason`, `degree`, `emergency_contact_relationship`, `termination_reason`, `pay_schedule`) return `people_count: 0`; cascade/transfer are no-ops.
- Security: protect routes with `auth:sanctum` and `can:manage-settings`; in local dev we relax this and use a permissive gate.
- Tenancy: scope by `organization_id` from the authenticated user; in local, fall back to the first `organizations.id`.
- Validation/uniqueness: normalize `label` to `label_slug` (lowercase/trim/collapse spaces); enforce unique `(organization_id, category, label_slug)`; errors: `duplicate_label`, `invalid_category`, `transfer_required`.

---

### Phase 2: Frontend Components (5-6 hours)

#### 2.1 Create EmployeeFields Component

**File:** `resources/js/components/settings/EmployeeFields.jsx`

**Structure:**
```jsx
const EmployeeFields = () => {
    const [selectedCategory, setSelectedCategory] = useState('department');
    const [values, setValues] = useState([]);
    const [newValue, setNewValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Categories grouped by section
    const categories = {
        employee: [
            { id: 'department', label: 'Department' },
            { id: 'division', label: 'Division' },
            { id: 'employment_status', label: 'Employment Status' },
            { id: 'job_title', label: 'Job Title' },
            { id: 'location', label: 'Location' },
            { id: 'team', label: 'Teams' },
        ],
        standardFields: [
            { id: 'compensation_change_reason', label: 'Compensation Change Reason' },
            { id: 'degree', label: 'Degree' },
            { id: 'emergency_contact_relationship', label: 'Emergency Contact Relationship' },
            { id: 'termination_reason', label: 'Termination Reason' },
            { id: 'pay_schedule', label: 'Pay Schedule' },
        ],
        customFields: [
            // Will be populated from API
        ]
    };
    
    return (
        <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
            {/* Left Panel - Category List */}
            <CategoryList 
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />
            
            {/* Right Panel - Values List */}
            <ValuesPanel
                category={selectedCategory}
                values={values}
                onAdd={handleAddValue}
                onDelete={handleDeleteValue}
            />
        </div>
    );
};
```

#### 2.2 Create CategoryList Component

**File:** `resources/js/components/settings/CategoryList.jsx`

```jsx
const CategoryList = ({ categories, selected, onSelect }) => {
    return (
        <div className="glass-panel" style={{ 
            width: '250px', 
            padding: '16px',
            height: 'fit-content'
        }}>
            {/* Employee Taxonomy */}
            {categories.employee.map(cat => (
                <CategoryItem 
                    key={cat.id}
                    {...cat}
                    selected={selected === cat.id}
                    onClick={() => onSelect(cat.id)}
                />
            ))}
            
            {/* Standard Fields Section */}
            <div style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
            }}>
                Standard Fields
            </div>
            
            {categories.standardFields.map(cat => (
                <CategoryItem 
                    key={cat.id}
                    {...cat}
                    selected={selected === cat.id}
                    onClick={() => onSelect(cat.id)}
                />
            ))}
            
            {/* Custom Fields Section */}
            <div style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
            }}>
                Custom Fields
            </div>
            
            {categories.customFields.map(cat => (
                <CategoryItem 
                    key={cat.id}
                    {...cat}
                    selected={selected === cat.id}
                    onClick={() => onSelect(cat.id)}
                />
            ))}
        </div>
    );
};
```

#### 2.3 Create ValuesPanel Component

**File:** `resources/js/components/settings/ValuesPanel.jsx`

```jsx
const ValuesPanel = ({ category, values, onAdd, onDelete }) => {
    const [newValue, setNewValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleAdd = async () => {
        if (!newValue.trim()) return;
        setLoading(true);
        await onAdd(newValue);
        setNewValue('');
        setLoading(false);
    };
    
    return (
        <div className="glass-panel" style={{ 
            flex: 1, 
            padding: '32px',
            height: 'fit-content'
        }}>
            {/* Header */}
            <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#2d4a22',
                marginBottom: '24px'
            }}>
                {formatCategoryName(category)}
            </h2>
            
            {/* Add New Value */}
            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '24px' 
            }}>
                <input
                    type="text"
                    placeholder="New Item"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                    }}
                />
                <button
                    onClick={handleAdd}
                    disabled={!newValue.trim() || loading}
                    style={{
                        padding: '10px 24px',
                        background: '#2d4a22',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Add
                </button>
            </div>
            
            {/* Category Name with Arrow */}
            <div style={{
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#2d4a22'
            }}>
                {formatCategoryName(category)} ↑
            </div>
            
            {/* Values List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {values.map(value => (
                    <ValueItem
                        key={value.id}
                        value={value}
                        onDelete={() => onDelete(value.id)}
                    />
                ))}
            </div>
        </div>
    );
};
```

#### 2.4 Create ValueItem Component

**File:** `resources/js/components/settings/ValueItem.jsx`

```jsx
const ValueItem = ({ value, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '12px 16px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
            }}
        >
            <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                {value.label}
            </span>
            
            {isHovered && (
                <button
                    onClick={onDelete}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    Delete
                </button>
            )}
        </div>
    );
};
```

---

### Phase 3: Integration (2-3 hours)

#### 3.1 Create API Service

**File:** `resources/js/services/employeeFieldService.js` (already implemented)

Use existing functions and flat response:

```javascript
import { listEmployeeFields, createEmployeeField, renameEmployeeField, deleteEmployeeField } from '../../services/employeeFieldService';

async function loadValues(category) {
  const items = await listEmployeeFields(category); // [{ id, label, people_count }]
  setValues(items);
}
```

#### 3.2 Wire Up EmployeeFields Component

Connect the component to the API service:

```jsx
useEffect(() => {
    loadValues();
}, [selectedCategory]);

const loadValues = async () => {
    setLoading(true);
    try {
        const data = await employeeFieldService.getValues(selectedCategory);
        setValues(data.values || []);
    } catch (error) {
        console.error('Failed to load values', error);
    } finally {
        setLoading(false);
    }
};

const handleAddValue = async (label) => {
    try {
        await employeeFieldService.createValue(selectedCategory, label);
        await loadValues();
        showToast(`Added "${label}" successfully`);
    } catch (error) {
        showToast('Failed to add value', 'error');
    }
};

const handleDeleteValue = async (id) => {
    try {
        await employeeFieldService.deleteValue(selectedCategory, id);
        await loadValues();
        showToast('Deleted successfully');
    } catch (error) {
        showToast('Failed to delete value', 'error');
    }
};
```

#### 3.3 Update App.jsx

Add the EmployeeFields component to the Settings page:

```jsx
{activeSubTab === 'Employee Fields' && <EmployeeFields />}
```

---

## Technical Considerations

### ✅ Advantages
1. **Reuses existing backend**: `EmployeeFieldController` and `employee_field_values` table
2. **Consistent patterns**: Similar to TimeOffSettings implementation
3. **Flexible**: Easy to add new standard field categories
4. **Clean separation**: Standard Fields vs Custom Fields vs Employee taxonomy

### ⚠️ Considerations
1. **Pay Schedule is different**: Has table view with additional columns (Frequency, Period Ends, People)
   - **MVP**: Treat as a simple list now; introduce a dedicated `PaySchedulePanel` later.
2. **Standard Fields vs Employee Fields**: Need clear distinction in UI
   - **Solution**: Use section headers in left panel
3. **No people count**: Unlike employee taxonomy fields, standard fields don't show usage counts
   - **Solution**: Keep it simple for MVP; add counts later if needed

---

## Estimated Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Database & Backend | 3-4 hours | Seeder, Controller updates |
| Phase 2: Frontend Components | 5-6 hours | EmployeeFields, CategoryList, ValuesPanel, ValueItem |
| Phase 3: Integration | 2-3 hours | API service, wiring, testing |
| **Total** | **10-13 hours** | **Fully functional Standard Fields** |

---

## Next Steps

1. ✅ Review this implementation plan
2. Add Standard Fields tasks to `docs/task.md`
3. Implement and run `StandardFieldsSeeder`
4. Add standard categories to `EmployeeFieldController::ALLOWED_CATEGORIES`
5. Extend existing `EmployeeFields.jsx` to list new categories (use `team`, not `teams`)
6. Test CRUD and confirm counts show 0 for standard fields
7. Defer `PaySchedulePanel` (placeholder list)

---

## Screenshots Reference

The implementation is based on the following UI patterns from the provided screenshots:

1. **Compensation Change Reason** - Standard inline add/list pattern
2. **Degree** - Standard inline add/list pattern
3. **Emergency Contact Relationship** - Standard inline add/list pattern
4. **Termination Reason** - Standard inline add/list pattern
5. **Pay Schedule** - Table view with additional columns (special case)
