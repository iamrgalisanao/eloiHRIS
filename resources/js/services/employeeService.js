/**
 * Employee API Service
 */

const BASE_URL = '/api/employees';

/**
 * List employees with filtering, sorting, and pagination
 */
export async function listEmployees(filters = {}) {
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            params.append(key, filters[key]);
        }
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    return response.json();
}

/**
 * Get directory view (alphabetically grouped)
 */
export async function getDirectory() {
    const response = await fetch(`${BASE_URL}/directory`);
    if (!response.ok) {
        throw new Error('Failed to fetch directory');
    }
    return response.json();
}

/**
 * Get org chart data
 */
export async function getOrgChart(rootId = null) {
    const url = rootId ? `${BASE_URL}/org-chart?root_id=${rootId}` : `${BASE_URL}/org-chart`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch org chart');
    }
    return response.json();
}

/**
 * Get filter options with counts
 */
export async function getFilterOptions() {
    const response = await fetch(`${BASE_URL}/filter-options`);
    if (!response.ok) {
        throw new Error('Failed to fetch filter options');
    }
    return response.json();
}

/**
 * Get single employee details
 */
export async function getEmployee(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch employee');
    }
    return response.json();
}

/**
 * Create new employee
 */
export async function createEmployee(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

/**
 * Update employee
 */
export async function updateEmployee(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

/**
 * Delete employee
 */
export async function deleteEmployee(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete employee');
    }

    return response.status === 204 ? null : response.json();
}
