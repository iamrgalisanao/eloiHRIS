# New Employee Implementation Plan

**Feature:** Add New Employee  
**Status:** 📋 Planning  
**Reference:** `uploaded_media_1769500864513.png`

---

## 1. Objective
Implement a comprehensive "New Employee" onboarding form that captures personal, job, compensation, and contact data in a structured, multi-section interface.

## 2. Technical Stack
- **Frontend:** React, Material UI (Grid v2, Box, Typography, TextField, Select, Switch, Paper), Lucide-React.
- **Backend:** Laravel (API), PHP 8.x.
- **Database:** MySQL/PostgreSQL (Updates to `employees` and `job_info` tables).

## 3. Database Schema Updates
Ensure the following fields are available (updating migrations if necessary):
- **Personal:** `preferred_name`, `birth_date`, `gender`, `marital_status`, `ssn`.
- **Address:** `address_line_1`, `address_line_2`, `city`, `province`, `postal_code`, `country`.
- **Compensation:** `effective_date`, `overtime_status`, `change_reason`, `pay_schedule`, `pay_type`, `pay_rate`.
- **Contact:** `work_phone`, `work_phone_ext`, `mobile_phone`, `home_phone`, `work_email`, `home_email`.
- **Job:** `hire_date`, `ethnicity`, `job_title_id`, `reports_to_id`, `department_id`, `division_id`, `location_id`.

## 4. API Endpoints
- `GET /api/employees/creation-options`: Returns dropdown values for:
  - Job Titles, Departments, Divisions, Locations, Managers, Pay Schedules, etc.
- `POST /api/employees`: Validates and creates the employee, their user account, and initial job/compensation records.

## 5. Frontend Implementation Breakdown

### 5.1 Component Structure
- `resources/js/components/people/AddEmployeePage.jsx` (Main Container)
- Sub-sections (internal or separate components):
  - `PersonalSection`
  - `AddressSection`
  - `CompensationSection`
  - `ContactSection`
  - `JobSection`
  - `JobInfoSection`
  - `AccessSection`

### 5.2 Form Logic
- Use standard React state or `react-hook-form`.
- **Validation:** 
  - Required: First Name, Last Name, Hire Date, Department.
  - Formats: Email, Phone.

### 5.3 UI/UX Design
- **Header:** Sticky header with "Cancel" and "Save" buttons.
- **Styling:** Glassmorphism (`glass-panel`) for sections.
- **Feedback:** Toast notifications for success/failure.

---

## 6. Implementation Phases

### Phase 1: Database & API
- [ ] Create migration for missing employee fields.
- [ ] Implement `EmployeeController@creationOptions`.
- [ ] Implement `EmployeeController@store` with transaction support.

### Phase 2: Form Skeleton & Routing
- [ ] Register `/employees/add` route in `App.jsx`.
- [ ] Link "New Employee" button in `PeoplePage.jsx` to the new route.
- [ ] Create layout with all 10 visual sections from screenshot.

### Phase 3: Field Implementation & Validation
- [ ] Implement all input fields (Selects, TextFields, Switches).
- [ ] Add client-side validation logic.
- [ ] Connect sections to the central form state.

### Phase 4: Integration & Testing
- [ ] Connect form to `POST /api/employees`.
- [ ] Add loading indicators and success redirects.
- [ ] Manual QA of all data fields in the database after save.
