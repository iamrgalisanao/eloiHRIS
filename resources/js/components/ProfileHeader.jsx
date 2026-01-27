import React from 'react';
import {
    Box,
    Avatar,
    Typography,
    Button,
    Tabs,
    Tab,
    Stack,
    Menu,
    MenuItem
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

const ProfileHeader = ({ employee, activeTab, setActiveTab, customTabs = [] }) => {
    const initials = employee?.name ? employee.name.split(' ').map(n => n[0]).join('') : '??';

    const coreTabs = ['Personal', 'Job', 'Time Off'];
    const dynamicTabLabels = customTabs.map(t => t.label);
    const otherTabs = ['Documents', 'Benefits', 'Performance', 'Notes'];
    const profileTabs = [...coreTabs, ...dynamicTabLabels, ...otherTabs];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(profileTabs[newValue]);
    };

    const tabIndex = profileTabs.indexOf(activeTab);

    return (
        <Box sx={{ bgcolor: '#fff', pt: 4, borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ px: 4, pb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {initials}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" sx={{ mb: 0.5, fontWeight: 700 }}>
                        {employee?.name || 'Loading...'}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {employee?.job_title}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%' }} />
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {employee?.department}
                        </Typography>
                    </Stack>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        endIcon={<KeyboardArrowDown />}
                        onClick={handleClick}
                        sx={{ px: 3 }}
                    >
                        Actions
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Reset Password</MenuItem>
                        <MenuItem onClick={handleClose}>Terminate</MenuItem>
                    </Menu>
                </Box>
            </Box>

            <Box sx={{ px: 2 }}>
                <Tabs
                    value={tabIndex !== -1 ? tabIndex : 0}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    {profileTabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                minHeight: 48,
                                '&.Mui-selected': {
                                    color: 'primary.main'
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>
        </Box>
    );
};

export default ProfileHeader;
