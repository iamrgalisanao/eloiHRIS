import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Checkbox,
    FormControlLabel,
    Collapse,
    Paper,
    Chip
} from '@mui/material';
import { Close, ExpandMore, ChevronRight } from '@mui/icons-material';
import { getFilterOptions } from '../../services/employeeService';

export default function FilterPanel({ filters, onChange }) {
    const [filterOptions, setFilterOptions] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({
        departments: true,
        divisions: false,
        locations: false,
        employment_statuses: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFilterOptions();
    }, []);

    const loadFilterOptions = async () => {
        try {
            const options = await getFilterOptions();
            setFilterOptions(options);
        } catch (error) {
            console.error('Failed to load filter options:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const applyFilter = (category, value) => {
        const currentString = filters[category] || '';
        const currentValues = currentString ? currentString.split(',') : [];
        let newValues;

        if (currentValues.includes(value)) {
            newValues = currentValues.filter(v => v !== value);
        } else {
            newValues = [...currentValues, value];
        }

        onChange({
            ...filters,
            [category]: newValues.length > 0 ? newValues.join(',') : undefined
        });
    };

    const clearCategoryFilters = (category) => {
        onChange({
            ...filters,
            [category]: undefined
        });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        ['department', 'division', 'location', 'employment_status'].forEach(key => {
            if (filters[key]) {
                count += filters[key].split(',').length;
            }
        });
        return count;
    };

    const getCategoryFilterCount = (category) => {
        if (!filters[category]) return 0;
        return filters[category].split(',').length;
    };

    const clearAllFilters = () => {
        onChange({});
    };

    if (loading) {
        return (
            <Paper sx={{ p: 2 }}>
                <Typography color="text.secondary" align="center">
                    Loading filters...
                </Typography>
            </Paper>
        );
    }

    const activeCount = getActiveFilterCount();

    const FilterGroup = ({ title, category, items, groupKey }) => {
        const categoryCount = getCategoryFilterCount(category);
        const isExpanded = expandedGroups[groupKey];

        return (
            <Box sx={{ mb: 1.5 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    borderRadius: 'var(--radius-standard)',
                    '&:hover': { bgcolor: 'rgba(40, 116, 17, 0.05)' }
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            flex: 1
                        }}
                        onClick={() => toggleGroup(groupKey)}
                    >
                        {isExpanded ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
                        <Typography variant="body2" fontWeight={600}>
                            {title} ({items?.length || 0})
                        </Typography>
                    </Box>
                    {categoryCount > 0 && (
                        <IconButton
                            size="small"
                            onClick={() => clearCategoryFilters(category)}
                            sx={{
                                '&:hover': {
                                    bgcolor: '#fee2e2',
                                    color: '#dc2626'
                                }
                            }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Collapse in={isExpanded}>
                    <Box sx={{ pl: 4, pr: 1 }}>
                        {items && items.map(item => {
                            const isChecked = filters[category]?.split(',').includes(item.value) || false;
                            return (
                                <FormControlLabel
                                    key={item.value}
                                    control={
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={() => applyFilter(category, item.value)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {item.value} ({item.count})
                                        </Typography>
                                    }
                                    sx={{
                                        width: '100%',
                                        m: 0,
                                        py: 0.5,
                                        borderRadius: 'var(--radius-standard)',
                                        '&:hover': { bgcolor: 'rgba(40, 116, 17, 0.05)' }
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Collapse>
            </Box>
        );
    };

    return (
        <Paper sx={{ p: 2, position: 'sticky', top: 24 }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-standard)',
                mb: 2
            }}>
                <Typography variant="body2" fontWeight={600}>
                    {activeCount} Active Filters
                </Typography>
                {activeCount > 0 && (
                    <IconButton
                        size="small"
                        onClick={clearAllFilters}
                        sx={{
                            color: '#fff',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Box>

            {/* Filter Groups */}
            {filterOptions.departments && filterOptions.departments.length > 0 && (
                <FilterGroup
                    title="Departments"
                    category="department"
                    items={filterOptions.departments}
                    groupKey="departments"
                />
            )}

            {filterOptions.divisions && filterOptions.divisions.length > 0 && (
                <FilterGroup
                    title="Divisions"
                    category="division"
                    items={filterOptions.divisions}
                    groupKey="divisions"
                />
            )}

            {filterOptions.locations && filterOptions.locations.length > 0 && (
                <FilterGroup
                    title="Locations"
                    category="location"
                    items={filterOptions.locations}
                    groupKey="locations"
                />
            )}

            {filterOptions.employment_statuses && filterOptions.employment_statuses.length > 0 && (
                <FilterGroup
                    title="Employment Status"
                    category="employment_status"
                    items={filterOptions.employment_statuses}
                    groupKey="employment_statuses"
                />
            )}

            {Object.keys(filterOptions).every(key => !filterOptions[key] || filterOptions[key].length === 0) && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    No filter options available
                </Typography>
            )}
        </Paper>
    );
}
