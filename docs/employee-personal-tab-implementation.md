# Implementation Plan: Employee Personal Tab

This plan outlines the implementation of the "Personal" tab within the Employee Profile, featuring a sidebar-driven navigation for different sub-sections (Basic Info, Address, Contact, Social Links, Education, and Visa Information).

## 1. Database Phase

### 1.1 New Migration: Enhanced Personal Fields
We need to add missing fields to the `users` (or `employees` / `job_info`) table and create new tables for one-to-many relationships.

**Tables/Columns to Add:**
- **users table additions:**
  - `tax_file_number` (string)
  - `nin` (string)
  - `shirt_size` (string)
  - `allergies` (text)
  - `dietary_restrictions` (text)
- **New table: `employee_educations`**
  - `id`, `user_id`, `institution`, `degree`, `major`, `gpa`, `start_date`, `end_date`, timestamps
- **New table: `employee_visas`**
  - `id`, `user_id`, `visa_type`, `issuing_country`, `issued_date`, `expiration_date`, `status`, `notes`, timestamps

## 2. API Phase

### 2.1 Update `EmployeeController`
- **GET `/api/employees/{id}/personal`**: Returns all personal data, including education and visa records.
- **PUT `/api/employees/{id}/personal`**: Updates personal data.
  - Handle updating basic fields.
  - Handle syncing education and visa tables.

## 3. Frontend Phase

### 3.1 New Component `PersonalTab.jsx`
- **Layout**: 
  - Left sidebar (`260px`) using `.nav-highlight-item` for category selection.
  - Right content area for form fields.
- **Categories**:
  - Basic Information
  - Address
  - Contact
  - Social Links
  - Education (Dynamic list with "Add" button)
  - Visa Information (Table-style list)

### 3.2 Integration in `App.jsx`
- Update `renderTabContent` in `EmployeeProfile` to render `PersonalTab`.

## 4. Tasks Summary

- [ ] Create migration for enhanced personal fields and education/visa tables.
- [ ] Update `User` and `Employee` models to handle new fields and relationships.
- [ ] Implement API endpoints for fetching and saving personal tab data.
- [ ] Create `PersonalTab.jsx` with sidebar navigation.
- [ ] Implement individual form sections for all categories.
- [ ] Implement dynamic row management for Education and Visa sections.
- [ ] Add "Save Changes" and "Cancel" global actions.
- [ ] QA & Polish highlighting and transitions.
