import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Tabs, Tab } from '@mui/material';
import { Add, ViewList, GridView, AccountTree } from '@mui/icons-material';
import ListView from './ListView';
import DirectoryView from './DirectoryView';
import OrgChartView from './OrgChartView';
import { listEmployees, getDirectory, getOrgChart } from '../../services/employeeService';

export default function PeoplePage() {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // list, directory, orgchart
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load data when view changes (initial load)
    useEffect(() => {
        loadData();
    }, [view]);

    // Reload data when filters change (for list view only)
    useEffect(() => {
        if (view === 'list' && Object.keys(filters).length > 0) {
            loadData();
        }
    }, [filters]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            let result;
            if (view === 'directory') {
                result = await getDirectory();
            } else if (view === 'orgchart') {
                result = await getOrgChart();
            } else {
                result = await listEmployees(filters);
            }
            setData(result);
        } catch (err) {
            console.error('Failed to load data:', err);
            setError(err.message || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleTabChange = (event, newValue) => {
        setView(newValue);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Row */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2,
                bgcolor: '#f8f9fa',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => navigate('/people/add')}
                    sx={{
                        color: 'var(--primary)',
                        borderColor: 'var(--primary)',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: 'var(--primary)',
                            color: '#fff',
                            borderColor: 'var(--primary)'
                        }
                    }}
                >
                    New Employee
                </Button>

                <Tabs
                    value={view}
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            bgcolor: 'var(--primary)',
                            height: 3
                        }
                    }}
                >
                    <Tab
                        icon={<ViewList />}
                        iconPosition="start"
                        label="List"
                        value="list"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            '&.Mui-selected': {
                                color: 'var(--primary)'
                            }
                        }}
                    />
                    <Tab
                        icon={<GridView />}
                        iconPosition="start"
                        label="Directory"
                        value="directory"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            '&.Mui-selected': {
                                color: 'var(--primary)'
                            }
                        }}
                    />
                    <Tab
                        icon={<AccountTree />}
                        iconPosition="start"
                        label="Org Chart"
                        value="orgchart"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            '&.Mui-selected': {
                                color: 'var(--primary)'
                            }
                        }}
                    />
                </Tabs>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {error && (
                    <Box sx={{ p: 5, textAlign: 'center', color: 'error.main' }}>
                        {error}
                    </Box>
                )}

                {!error && (
                    <>
                        {view === 'list' && (
                            <ListView
                                data={data}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                loading={loading}
                            />
                        )}

                        {view === 'directory' && (
                            <>
                                {loading && (
                                    <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
                                        Loading...
                                    </Box>
                                )}
                                {!loading && <DirectoryView data={data} />}
                            </>
                        )}

                        {view === 'orgchart' && (
                            <>
                                {loading && (
                                    <Box sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
                                        Loading...
                                    </Box>
                                )}
                                {!loading && <OrgChartView data={data} />}
                            </>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
