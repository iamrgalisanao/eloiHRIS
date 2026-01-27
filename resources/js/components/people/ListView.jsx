import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Link,
    Typography,
    Button,
    Chip
} from '@mui/material';
import { Menu, MoreVert } from '@mui/icons-material';
import FilterPanel from './FilterPanel';

export default function ListView({ data, filters, onFilterChange, loading }) {
    const [sortField, setSortField] = useState('employee_number');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterPanelVisible, setFilterPanelVisible] = useState(true);

    if (!data) return null;

    const handleSort = (field) => {
        if (sortField === field) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
            onFilterChange({ ...filters, sort: field, order: newOrder });
        } else {
            setSortField(field);
            setSortOrder('asc');
            onFilterChange({ ...filters, sort: field, order: 'asc' });
        }
    };

    const getSortIndicator = (field) => {
        if (sortField !== field) return '';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    const employees = data.data || [];
    const meta = data.meta || {};

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Filter Controls Row */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2,
                borderBottom: '1px solid var(--border-light)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        size="small"
                        onClick={() => setFilterPanelVisible(!filterPanelVisible)}
                        sx={{
                            bgcolor: filterPanelVisible ? 'var(--primary)' : 'transparent',
                            color: filterPanelVisible ? '#fff' : 'var(--text-muted)',
                            border: '1px solid var(--border-light)',
                            '&:hover': {
                                bgcolor: filterPanelVisible ? 'var(--primary)' : 'rgba(0,0,0,0.02)'
                            }
                        }}
                    >
                        <Menu fontSize="small" />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            VIEWING:
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <Select
                                value={filters.filter || 'all'}
                                onChange={(e) => onFilterChange({ ...filters, filter: e.target.value })}
                                sx={{
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-light)' }
                                }}
                            >
                                <MenuItem value="all">All Employees</MenuItem>
                                <MenuItem value="active">Active Employees</MenuItem>
                                <MenuItem value="terminated">Former Employees</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                        Showing {employees.length} of {meta.total || employees.length}
                    </Typography>
                </Box>
            </Box>

            {/* Table Container */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: filterPanelVisible ? '250px 1fr' : '1fr',
                gap: 3,
                p: 3,
                flex: 1,
                overflow: 'hidden',
                transition: 'grid-template-columns 0.3s ease'
            }}>
                {filterPanelVisible && (
                    <Box>
                        <FilterPanel filters={filters} onChange={onFilterChange} />
                    </Box>
                )}

                <Box sx={{
                    opacity: loading ? 0.6 : 1,
                    filter: loading ? 'blur(2px)' : 'none',
                    pointerEvents: loading ? 'none' : 'auto',
                    transition: 'opacity 0.3s, filter 0.3s',
                    position: 'relative'
                }}>
                    {loading && (
                        <Typography
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: 'var(--primary)',
                                filter: 'blur(0)',
                                zIndex: 1
                            }}
                        >
                            Loading...
                        </Typography>
                    )}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Photo</TableCell>
                                    <TableCell
                                        onClick={() => handleSort('employee_number')}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9' } }}
                                    >
                                        Employee #{getSortIndicator('employee_number')}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => handleSort('last_name')}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9' } }}
                                    >
                                        Last Name, First Name{getSortIndicator('last_name')}
                                    </TableCell>
                                    <TableCell>Job Title</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Employment Status</TableCell>
                                    <TableCell
                                        onClick={() => handleSort('hire_date')}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9' } }}
                                    >
                                        Hire Date{getSortIndicator('hire_date')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map(employee => (
                                        <TableRow key={employee.id} hover>
                                            <TableCell>
                                                <Avatar
                                                    src={employee.photo_url || '/default-avatar.png'}
                                                    alt={employee.full_name}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </TableCell>
                                            <TableCell>{employee.employee_number}</TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/employees/${employee.id}`}
                                                    sx={{
                                                        color: 'var(--primary)',
                                                        fontWeight: 600,
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {employee.last_name ? `${employee.last_name}, ${employee.first_name}` : employee.full_name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{employee.job_title}</TableCell>
                                            <TableCell>{employee.location || '-'}</TableCell>
                                            <TableCell>{employee.employment_status || '-'}</TableCell>
                                            <TableCell>{employee.hire_date || '-'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid #e2e8f0'
                        }}>
                            <Button
                                disabled={meta.current_page === 1}
                                onClick={() => onFilterChange({ ...filters, page: meta.current_page - 1 })}
                                variant="outlined"
                                size="small"
                            >
                                Previous
                            </Button>
                            <Typography variant="body2">
                                Page {meta.current_page} of {meta.last_page}
                            </Typography>
                            <Button
                                disabled={meta.current_page === meta.last_page}
                                onClick={() => onFilterChange({ ...filters, page: meta.current_page + 1 })}
                                variant="outlined"
                                size="small"
                            >
                                Next
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
