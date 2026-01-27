import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Tabs, Tab, Typography, Stack } from '@mui/material';
import { Add, ViewList, GridView, AccountTree } from '@mui/icons-material';
import ListView from './ListView';
import DirectoryView from './DirectoryView';
import OrgChartView from './OrgChartView';
import { listEmployees, getDirectory, getOrgChart } from '../../services/employeeService';

// Consistent Wrapper (matching App.jsx)
const PageWrapper = ({ children, padding = 4 }) => (
    <Box sx={{ p: padding, height: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ maxWidth: 1600, mx: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {children}
        </Box>
    </Box>
);

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
        <PageWrapper>
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography
                        variant="h4"
                        className="font-heading"
                        sx={{
                            fontWeight: 700,
                            color: 'var(--primary)',
                            mb: 1
                        }}
                    >
                        People Directory
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        Manage your team, view organization structure, and browse the directory.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/people/add')}
                    className="btn-primary"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '20px',
                        px: 3,
                        py: 1.2,
                        boxShadow: '0 4px 12px rgba(92, 184, 92, 0.2)'
                    }}
                >
                    New Employee
                </Button>
            </Box>

            {/* View Selection Tabs */}
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={view}
                    onChange={handleTabChange}
                    sx={{
                        minHeight: 40,
                        '& .MuiTabs-indicator': {
                            bgcolor: 'var(--primary)',
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    <Tab
                        icon={<ViewList sx={{ fontSize: 20 }} />}
                        iconPosition="start"
                        label="List"
                        value="list"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            minHeight: 40,
                            fontSize: '0.9rem',
                            '&.Mui-selected': { color: 'var(--primary)' }
                        }}
                    />
                    <Tab
                        icon={<GridView sx={{ fontSize: 20 }} />}
                        iconPosition="start"
                        label="Directory"
                        value="directory"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            minHeight: 40,
                            fontSize: '0.9rem',
                            '&.Mui-selected': { color: 'var(--primary)' }
                        }}
                    />
                    <Tab
                        icon={<AccountTree sx={{ fontSize: 20 }} />}
                        iconPosition="start"
                        label="Org Chart"
                        value="orgchart"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            minHeight: 40,
                            fontSize: '0.9rem',
                            '&.Mui-selected': { color: 'var(--primary)' }
                        }}
                    />
                </Tabs>
            </Box>

            {/* Content Area - wrapped in glass panel consistent with dashboard */}
            <Box sx={{
                flex: 1,
                bgcolor: '#fff',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
                {error && (
                    <Box sx={{ p: 5, textAlign: 'center', color: 'error.main' }}>
                        <Typography variant="h6">{error}</Typography>
                        <Button onClick={loadData} sx={{ mt: 2 }}>Retry</Button>
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
                            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                                {loading ? (
                                    <Typography sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>Loading...</Typography>
                                ) : (
                                    <DirectoryView data={data} />
                                )}
                            </Box>
                        )}

                        {view === 'orgchart' && (
                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                {loading ? (
                                    <Typography sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>Loading...</Typography>
                                ) : (
                                    <OrgChartView data={data} />
                                )}
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </PageWrapper>
    );
}

