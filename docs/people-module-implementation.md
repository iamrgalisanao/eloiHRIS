# Employee/People Module Implementation Plan

**Feature:** Employee Directory with List, Directory, and Org Chart Views  
**Date:** 2026-01-27  
**Status:** Planning

## Overview

Based on the provided screenshots, implement a comprehensive **People/Employee** module with three distinct views:
1. **List View** - Tabular display with filtering
2. **Directory View** - Card-based employee directory
3. **Org Chart View** - Hierarchical organization chart

## UI Analysis from Screenshots

### Screenshot 1: List View (Primary)

**Layout:**
- **Header**: "People" title with "New Employee" button
- **View Tabs**: List (active), Directory, Org Chart
- **Quick Access**: "Quick access to the directory" link (top right)
- **Filters Panel** (Left Sidebar):
  - "89 People" count with edit/close icons
  - Expandable filter groups:
    - 6 Employment Statuses
    - Departments
    - Divisions
    - Locations
    - Pay Range
    - Pay Type
    - Tenure
    - Age
    - Gender
    - Ethnicity
    - More
- **Table Controls**:
  - Dropdown: "All Employees" filter
  - Search: Employee count (89)
  - Status filter: "Showing: Active"
  - More options menu (...)

**Table Columns:**
1. Employee Photo (circular avatar)
2. Employee # (numeric ID)
3. Last Name, First Name (blue link)
4. Job Title
5. Location
6. Employment Status
7. Hire Date

**Features Observed:**
- Sortable columns
- Clickable employee names (blue links)
- Profile photos with fallback avatars
- Clean, minimal table design
- Pagination implied (showing subset of 89)

### Screenshot 2: List View with Filters Active

**Additional Details:**
- Green highlight on active filter ("89 People")
- Filter groups are collapsible/expandable
- "6 Employment Statuses" shown as example
- Consistent table layout

### Screenshot 3: Directory View

**Layout:**
- **Header**: "Directory (87)" count
- **View Tabs**: List, Directory (active), Org Chart
- **Alphabetical Navigation**: Letter "A" shown as section header
- **Card Layout**: Employee cards in vertical list

**Employee Card Structure:**
Each card contains:
- **Left**: Large circular profile photo
- **Center**:
  - Name (green, bold): "Charlotte Abbott"
  - Job Title: "Sr. HR Administrator in Human Resources"
  - Location: "Salt Lake City, Utah | 9:02 PM local time"
  - Region: "North America"
  - Social Icons: LinkedIn, Twitter, Facebook, Pinterest, Instagram
- **Right**:
  - Email: cabbott@efficientoffice.com
  - Phone: 801-724-8600 Ext. 1272
  - Mobile: 801-724-8600
  - Reports to: "Reports to Jennifer Caldwell"
  - Direct reports: "5 direct reports"
  - "View in org chart" link (blue)

**Features:**
- Alphabetical grouping (A, B, C, etc.)
- Rich contact information
- Social media integration
- Reporting structure visibility
- Local time display
- Quick org chart access

---

## Database Schema

### Existing Tables (Assumed)

**employees** table:
```sql
- id (primary key)
- organization_id (foreign key)
- employee_number (unique)
- first_name
- last_name
- email
- photo_url
- job_title
- department_id (foreign key)
- division_id (foreign key)
- location_id (foreign key)
- employment_status
- hire_date
- manager_id (foreign key, self-referential)
- phone_work
- phone_work_ext
- phone_mobile
- timezone
- region
- linkedin_url
- twitter_url
- facebook_url
- pinterest_url
- instagram_url
- created_at
- updated_at
```

**job_info** table (already exists):
```sql
- id
- employee_id
- organization_id
- department
- division
- job_title
- location
- employment_status
- hire_date
- manager_id
- created_at
- updated_at
```

### New Tables Needed

**employee_social_links** (optional, if not in employees table):
```sql
- id
- employee_id
- platform (enum: linkedin, twitter, facebook, pinterest, instagram)
- url
- created_at
- updated_at
```

**employee_filters** (for saved filter sets):
```sql
- id
- user_id
- name
- filters (JSON)
- is_default
- created_at
- updated_at
```

---

## Backend Implementation

### Phase 1: API Endpoints (4-6 hours)

#### 1.1 Employee List Endpoint

**Route:** `GET /api/employees`

**Query Parameters:**
- `filter` - Employment status filter (all, active, inactive, etc.)
- `department` - Department filter
- `division` - Division filter
- `location` - Location filter
- `search` - Search term (name, email, job title)
- `sort` - Sort field (name, hire_date, employee_number)
- `order` - Sort order (asc, desc)
- `page` - Page number
- `per_page` - Items per page (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "employee_number": 1,
      "first_name": "Charlotte",
      "last_name": "Abbott",
      "full_name": "Abbott, Charlotte",
      "email": "cabbott@efficientoffice.com",
      "photo_url": "/storage/photos/1.jpg",
      "job_title": "Sr. HR Administrator",
      "department": "Human Resources",
      "division": null,
      "location": "Salt Lake City, Utah",
      "employment_status": "Full-Time",
      "hire_date": "2024-11-28",
      "manager": {
        "id": 5,
        "name": "Jennifer Caldwell"
      }
    }
  ],
  "meta": {
    "total": 89,
    "per_page": 50,
    "current_page": 1,
    "last_page": 2
  }
}
```

#### 1.2 Employee Directory Endpoint

**Route:** `GET /api/employees/directory`

**Query Parameters:**
- `letter` - Filter by first letter of last name
- `search` - Search term

**Response:**
```json
{
  "A": [
    {
      "id": 1,
      "employee_number": 1,
      "first_name": "Charlotte",
      "last_name": "Abbott",
      "full_name": "Charlotte Abbott",
      "email": "cabbott@efficientoffice.com",
      "photo_url": "/storage/photos/1.jpg",
      "job_title": "Sr. HR Administrator",
      "department": "Human Resources",
      "location": "Salt Lake City, Utah",
      "timezone": "America/Denver",
      "local_time": "9:02 PM",
      "region": "North America",
      "phone_work": "801-724-8600",
      "phone_work_ext": "1272",
      "phone_mobile": "801-724-8600",
      "manager": {
        "id": 5,
        "name": "Jennifer Caldwell"
      },
      "direct_reports_count": 5,
      "social_links": {
        "linkedin": "https://linkedin.com/in/...",
        "twitter": "https://twitter.com/...",
        "facebook": "https://facebook.com/...",
        "pinterest": "https://pinterest.com/...",
        "instagram": "https://instagram.com/..."
      }
    }
  ],
  "B": [...]
}
```

#### 1.3 Org Chart Endpoint

**Route:** `GET /api/employees/org-chart`

**Query Parameters:**
- `root_id` - Start from specific employee (default: CEO/top level)
- `depth` - How many levels to fetch (default: all)

**Response:**
```json
{
  "id": 1,
  "name": "Charlotte Abbott",
  "job_title": "Sr. HR Administrator",
  "photo_url": "/storage/photos/1.jpg",
  "email": "cabbott@efficientoffice.com",
  "direct_reports_count": 5,
  "children": [
    {
      "id": 2,
      "name": "Ashley Adams",
      "job_title": "HR Administrator",
      "photo_url": "/storage/photos/2.jpg",
      "email": "aadams@efficientoffice.com",
      "direct_reports_count": 2,
      "children": [...]
    }
  ]
}
```

#### 1.4 Filter Options Endpoint

**Route:** `GET /api/employees/filter-options`

**Response:**
```json
{
  "employment_statuses": [
    {"value": "Full-Time", "count": 75},
    {"value": "Part-Time", "count": 10},
    {"value": "Contractor", "count": 4}
  ],
  "departments": [
    {"value": "Human Resources", "count": 15},
    {"value": "Engineering", "count": 30},
    {"value": "Sales", "count": 20}
  ],
  "divisions": [...],
  "locations": [...],
  "pay_ranges": [...],
  "pay_types": [...],
  "tenure_ranges": [
    {"label": "0-1 years", "min": 0, "max": 1, "count": 20},
    {"label": "1-3 years", "min": 1, "max": 3, "count": 30}
  ],
  "age_ranges": [...],
  "genders": [...],
  "ethnicities": [...]
}
```

#### 1.5 Employee Controller

**File:** `app/Http/Controllers/Api/EmployeeController.php`

```php
class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['manager', 'department', 'location'])
            ->where('organization_id', $this->resolveOrgId($request));
        
        // Apply filters
        if ($request->has('filter')) {
            $query->where('employment_status', $request->filter);
        }
        
        if ($request->has('department')) {
            $query->where('department_id', $request->department);
        }
        
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('job_title', 'like', "%{$request->search}%");
            });
        }
        
        // Sort
        $sortField = $request->get('sort', 'last_name');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortField, $sortOrder);
        
        // Paginate
        $perPage = $request->get('per_page', 50);
        return $query->paginate($perPage);
    }
    
    public function directory(Request $request)
    {
        $employees = Employee::with(['manager'])
            ->where('organization_id', $this->resolveOrgId($request))
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();
        
        // Group by first letter of last name
        $grouped = $employees->groupBy(function($employee) {
            return strtoupper(substr($employee->last_name, 0, 1));
        });
        
        return response()->json($grouped);
    }
    
    public function orgChart(Request $request)
    {
        $rootId = $request->get('root_id');
        
        if (!$rootId) {
            // Find top-level employee (no manager)
            $root = Employee::where('organization_id', $this->resolveOrgId($request))
                ->whereNull('manager_id')
                ->first();
        } else {
            $root = Employee::findOrFail($rootId);
        }
        
        return response()->json($this->buildOrgTree($root));
    }
    
    private function buildOrgTree($employee, $depth = 0, $maxDepth = 10)
    {
        if ($depth >= $maxDepth) {
            return null;
        }
        
        $node = [
            'id' => $employee->id,
            'name' => $employee->full_name,
            'job_title' => $employee->job_title,
            'photo_url' => $employee->photo_url,
            'email' => $employee->email,
            'direct_reports_count' => $employee->directReports()->count(),
            'children' => []
        ];
        
        foreach ($employee->directReports as $report) {
            $child = $this->buildOrgTree($report, $depth + 1, $maxDepth);
            if ($child) {
                $node['children'][] = $child;
            }
        }
        
        return $node;
    }
}
```

---

## Frontend Implementation

### Phase 2: React Components (10-15 hours)

#### 2.1 Component Structure

```
components/
├── people/
│   ├── PeoplePage.jsx (main container)
│   ├── ListView.jsx
│   ├── DirectoryView.jsx
│   ├── OrgChartView.jsx
│   ├── FilterPanel.jsx
│   ├── EmployeeCard.jsx
│   ├── EmployeeRow.jsx
│   ├── OrgChartNode.jsx
│   └── NewEmployeeModal.jsx
```

#### 2.2 PeoplePage Component

**File:** `resources/js/components/people/PeoplePage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import ListView from './ListView';
import DirectoryView from './DirectoryView';
import OrgChartView from './OrgChartView';
import FilterPanel from './FilterPanel';

export default function PeoplePage() {
  const [view, setView] = useState('list'); // list, directory, orgchart
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, [view, filters]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const endpoint = view === 'directory' 
        ? '/api/employees/directory' 
        : view === 'orgchart'
        ? '/api/employees/org-chart'
        : '/api/employees';
      
      const params = new URLSearchParams(filters);
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="people-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">People</h1>
        <button 
          onClick={() => setShowNewEmployeeModal(true)}
          className="btn-primary"
        >
          <span className="icon">+</span> New Employee
        </button>
      </div>

      {/* Quick Access Link */}
      <div className="quick-access">
        <a href="#directory" className="link-primary">
          📖 Quick access to the directory
        </a>
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={view === 'list' ? 'active' : ''}
          onClick={() => setView('list')}
        >
          📋 List
        </button>
        <button 
          className={view === 'directory' ? 'active' : ''}
          onClick={() => setView('directory')}
        >
          📖 Directory
        </button>
        <button 
          className={view === 'orgchart' ? 'active' : ''}
          onClick={() => setView('orgchart')}
        >
          🌳 Org Chart
        </button>
      </div>

      {/* Main Content */}
      <div className="people-content">
        {view === 'list' && (
          <>
            <FilterPanel filters={filters} onChange={setFilters} />
            <ListView employees={employees} loading={loading} />
          </>
        )}
        
        {view === 'directory' && (
          <DirectoryView employees={employees} loading={loading} />
        )}
        
        {view === 'orgchart' && (
          <OrgChartView data={employees} loading={loading} />
        )}
      </div>

      {/* New Employee Modal */}
      {showNewEmployeeModal && (
        <NewEmployeeModal 
          onClose={() => setShowNewEmployeeModal(false)}
          onSave={loadEmployees}
        />
      )}
    </div>
  );
}
```

#### 2.3 ListView Component

**File:** `resources/js/components/people/ListView.jsx`

```jsx
export default function ListView({ employees, loading }) {
  const [sortField, setSortField] = useState('last_name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="list-view">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th onClick={() => handleSort('employee_number')}>
              Employee # {sortField === 'employee_number' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('last_name')}>
              Last Name, First Name {sortField === 'last_name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Job Title</th>
            <th>Location</th>
            <th>Employment Status</th>
            <th onClick={() => handleSort('hire_date')}>
              Hire Date {sortField === 'hire_date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.data?.map(employee => (
            <tr key={employee.id}>
              <td>
                <img 
                  src={employee.photo_url || '/default-avatar.png'} 
                  alt={employee.full_name}
                  className="employee-avatar"
                />
              </td>
              <td>{employee.employee_number}</td>
              <td>
                <a href={`/employees/${employee.id}`} className="link-primary">
                  {employee.last_name}, {employee.first_name}
                </a>
              </td>
              <td>{employee.job_title}</td>
              <td>{employee.location}</td>
              <td>{employee.employment_status}</td>
              <td>{employee.hire_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### 2.4 DirectoryView Component

**File:** `resources/js/components/people/DirectoryView.jsx`

```jsx
export default function DirectoryView({ employees, loading }) {
  if (loading) return <div>Loading...</div>;

  const letters = Object.keys(employees).sort();

  return (
    <div className="directory-view">
      <div className="directory-header">
        <h2>Directory ({Object.values(employees).flat().length})</h2>
      </div>

      {letters.map(letter => (
        <div key={letter} className="directory-section">
          <div className="section-letter">{letter}</div>
          
          {employees[letter].map(employee => (
            <div key={employee.id} className="employee-card">
              {/* Left: Photo */}
              <div className="card-photo">
                <img 
                  src={employee.photo_url || '/default-avatar.png'} 
                  alt={employee.full_name}
                />
              </div>

              {/* Center: Info */}
              <div className="card-info">
                <h3 className="employee-name">{employee.full_name}</h3>
                <p className="employee-title">
                  {employee.job_title} in {employee.department}
                </p>
                <p className="employee-location">
                  {employee.location} | {employee.local_time} local time
                </p>
                <p className="employee-region">{employee.region}</p>
                
                {/* Social Links */}
                <div className="social-links">
                  {employee.social_links?.linkedin && (
                    <a href={employee.social_links.linkedin} target="_blank">
                      <i className="icon-linkedin"></i>
                    </a>
                  )}
                  {employee.social_links?.twitter && (
                    <a href={employee.social_links.twitter} target="_blank">
                      <i className="icon-twitter"></i>
                    </a>
                  )}
                  {/* More social icons... */}
                </div>
              </div>

              {/* Right: Contact & Reporting */}
              <div className="card-contact">
                <p>
                  <i className="icon-email"></i> {employee.email}
                </p>
                <p>
                  <i className="icon-phone"></i> {employee.phone_work} 
                  {employee.phone_work_ext && ` Ext. ${employee.phone_work_ext}`}
                </p>
                {employee.phone_mobile && (
                  <p>
                    <i className="icon-mobile"></i> {employee.phone_mobile}
                  </p>
                )}
                
                <div className="reporting-info">
                  <p>
                    <i className="icon-user"></i> Reports to {employee.manager?.name}
                  </p>
                  <p>
                    <i className="icon-users"></i> {employee.direct_reports_count} direct reports
                  </p>
                  <a href={`#orgchart/${employee.id}`} className="link-primary">
                    View in org chart
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

#### 2.5 OrgChartView Component

**File:** `resources/js/components/people/OrgChartView.jsx`

```jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function OrgChartView({ data, loading }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || loading) return;
    renderOrgChart();
  }, [data, loading]);

  const renderOrgChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 1200;
    const height = 800;
    const nodeWidth = 200;
    const nodeHeight = 80;

    // Create tree layout
    const treeLayout = d3.tree()
      .size([width - 100, height - 100])
      .nodeSize([nodeWidth + 50, nodeHeight + 80]);

    // Convert data to hierarchy
    const root = d3.hierarchy(data);
    treeLayout(root);

    const g = svg.append('g')
      .attr('transform', 'translate(50, 50)');

    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'org-link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'org-node')
      .attr('transform', d => `translate(${d.x - nodeWidth/2}, ${d.y - nodeHeight/2})`);

    // Node background
    nodes.append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8)
      .attr('fill', '#fff')
      .attr('stroke', '#2d4a22')
      .attr('stroke-width', 2);

    // Employee photo
    nodes.append('image')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 60)
      .attr('height', 60)
      .attr('href', d => d.data.photo_url || '/default-avatar.png')
      .attr('clip-path', 'circle(30px at 30px 30px)');

    // Employee name
    nodes.append('text')
      .attr('x', 80)
      .attr('y', 25)
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(d => d.data.name);

    // Job title
    nodes.append('text')
      .attr('x', 80)
      .attr('y', 45)
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(d => d.data.job_title);

    // Direct reports count
    nodes.append('text')
      .attr('x', 80)
      .attr('y', 65)
      .attr('font-size', '11px')
      .attr('fill', '#999')
      .text(d => d.data.direct_reports_count > 0 
        ? `${d.data.direct_reports_count} direct reports` 
        : '');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
  };

  if (loading) return <div>Loading org chart...</div>;

  return (
    <div className="org-chart-view">
      <svg ref={svgRef} width="100%" height="800px"></svg>
    </div>
  );
}
```

#### 2.6 FilterPanel Component

**File:** `resources/js/components/people/FilterPanel.jsx`

```jsx
export default function FilterPanel({ filters, onChange }) {
  const [filterOptions, setFilterOptions] = useState({});
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    const response = await fetch('/api/employees/filter-options');
    const data = await response.json();
    setFilterOptions(data);
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const applyFilter = (category, value) => {
    const newFilters = { ...activeFilters };
    if (!newFilters[category]) {
      newFilters[category] = [];
    }
    
    if (newFilters[category].includes(value)) {
      newFilters[category] = newFilters[category].filter(v => v !== value);
    } else {
      newFilters[category].push(value);
    }
    
    setActiveFilters(newFilters);
    onChange(newFilters);
  };

  const activeCount = Object.values(activeFilters).flat().length;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <span className="filter-count">{activeCount} People</span>
        <button className="btn-icon">✏️</button>
        <button className="btn-icon">✕</button>
      </div>

      {/* Employment Statuses */}
      <div className="filter-group">
        <div 
          className="filter-group-header"
          onClick={() => toggleGroup('employment_statuses')}
        >
          <span>▶</span>
          <span>6 Employment Statuses</span>
        </div>
        {expandedGroups.employment_statuses && (
          <div className="filter-options">
            {filterOptions.employment_statuses?.map(status => (
              <label key={status.value}>
                <input 
                  type="checkbox"
                  checked={activeFilters.employment_status?.includes(status.value)}
                  onChange={() => applyFilter('employment_status', status.value)}
                />
                {status.value} ({status.count})
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Departments */}
      <div className="filter-group">
        <div 
          className="filter-group-header"
          onClick={() => toggleGroup('departments')}
        >
          <span>▶</span>
          <span>Departments</span>
        </div>
        {expandedGroups.departments && (
          <div className="filter-options">
            {filterOptions.departments?.map(dept => (
              <label key={dept.value}>
                <input 
                  type="checkbox"
                  checked={activeFilters.department?.includes(dept.value)}
                  onChange={() => applyFilter('department', dept.value)}
                />
                {dept.value} ({dept.count})
              </label>
            ))}
          </div>
        )}
      </div>

      {/* More filter groups... */}
    </div>
  );
}
```

---

## Styling

### Phase 3: CSS (3-4 hours)

**File:** `resources/css/people.css`

```css
/* People Page Layout */
.people-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.quick-access {
  margin-bottom: 16px;
}

/* View Tabs */
.view-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.view-tabs button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}

.view-tabs button.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.view-tabs button:hover {
  color: var(--primary);
}

/* List View */
.people-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
}

.employees-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.employees-table thead {
  background: #f8fafc;
}

.employees-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.employees-table th:hover {
  background: #f1f5f9;
}

.employees-table td {
  padding: 12px;
  border-top: 1px solid #f1f5f9;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* Filter Panel */
.filter-panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--primary);
  color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-count {
  flex: 1;
  font-weight: 600;
}

.filter-group {
  margin-bottom: 12px;
}

.filter-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  font-weight: 600;
  border-radius: 4px;
}

.filter-group-header:hover {
  background: #f8fafc;
}

.filter-options {
  padding: 8px 8px 8px 24px;
}

.filter-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  cursor: pointer;
}

/* Directory View */
.directory-view {
  grid-column: 1 / -1;
}

.directory-header {
  margin-bottom: 24px;
}

.directory-section {
  margin-bottom: 32px;
}

.section-letter {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  padding: 12px 0;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 16px;
}

.employee-card {
  display: grid;
  grid-template-columns: 120px 1fr 300px;
  gap: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-photo img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.employee-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 8px 0;
}

.employee-title {
  color: #64748b;
  margin: 4px 0;
}

.employee-location {
  color: #64748b;
  margin: 4px 0;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.social-links a {
  color: #64748b;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--primary);
}

.card-contact p {
  margin: 8px 0;
  color: #64748b;
  font-size: 0.9rem;
}

.reporting-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

/* Org Chart View */
.org-chart-view {
  grid-column: 1 / -1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  overflow: auto;
}

.org-node {
  cursor: pointer;
}

.org-node:hover rect {
  stroke: var(--primary);
  stroke-width: 3;
}
```

---

## Implementation Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Backend API | 4-6 hours | Employee endpoints, org chart logic |
| Phase 2: Frontend Components | 10-15 hours | List, Directory, Org Chart views |
| Phase 3: Styling | 3-4 hours | CSS for all views |
| Phase 4: Testing & Polish | 4-6 hours | QA, bug fixes, performance |
| **Total** | **21-31 hours** | **Complete People module** |

---

## Key Features Summary

### List View ✅
- Filterable employee table
- Sortable columns
- Profile photos
- Clickable employee names
- Employment status filter
- Pagination

### Directory View ✅
- Alphabetical grouping
- Rich employee cards
- Contact information
- Social media links
- Reporting structure
- Local time display
- Org chart quick access

### Org Chart View ✅
- Hierarchical tree visualization
- D3.js-based rendering
- Zoom and pan controls
- Employee photos in nodes
- Direct reports count
- Interactive nodes

### Filter Panel ✅
- Multiple filter categories
- Collapsible filter groups
- Active filter count
- Checkbox-based selection
- Real-time filtering

---

## Next Steps

1. Review this implementation plan
2. Create database migrations for employee enhancements
3. Implement backend API endpoints
4. Build React components
5. Add D3.js for org chart visualization
6. Test all three views
7. Optimize performance for large datasets

---

## Technical Notes

### Org Chart Implementation
- Use **D3.js** for tree layout and rendering
- Support zoom/pan for large organizations
- Lazy load deep hierarchies (load on expand)
- Cache org chart data for performance

### Performance Considerations
- Paginate list view (50-100 employees per page)
- Use virtual scrolling for large directories
- Lazy load employee photos
- Cache filter options
- Index database columns (last_name, employee_number, manager_id)

### Accessibility
- Keyboard navigation for all views
- ARIA labels for interactive elements
- Screen reader support
- High contrast mode support
