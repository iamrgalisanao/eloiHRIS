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
    MenuItem,
    IconButton
} from '@mui/material';
import {
    KeyboardArrowDown,
    MoreHoriz,
    ChevronRight,
    ExpandMore as ChevronDown
} from '@mui/icons-material';
import { User } from 'lucide-react';

const ProfileHeader = ({ employee, activeTab, setActiveTab, customTabs = [] }) => {
    const initials = employee?.name ? employee.name.split(' ').map(n => n[0]).join('') : '??';

    const coreTabs = ['Personal', 'Job', 'Time Off'];
    const dynamicTabLabels = customTabs.map(t => t.label);
    const otherTabs = ['Documents', 'Benefits', 'Performance', 'Training', 'Assets', 'Notes', 'Emergency'];
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
        <Box sx={{
            bgcolor: 'primary.main',
            borderRadius: 0,
            m: 0,
            position: 'relative',
            overflow: 'visible'
        }}>
            {/* Avatar - Popping out on the left */}
            <Box sx={{
                position: 'absolute',
                left: 32,
                top: 0,
                width: 120,
                height: 120,
                borderRadius: 'var(--radius-standard)',
                overflow: 'hidden',
                border: '4px solid #fff',
                bgcolor: 'primary.main',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(20px)',
                zIndex: 10
            }}>
                {employee?.photo_url ? (
                    <img
                        src={employee.photo_url}
                        alt={employee?.full_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <User size={48} />
                    </Box>
                )}
            </Box>

            {/* Top Row: Name, Title, and Actions */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 4,
                pt: 4,
                pb: 1.5,
                pl: '180px' // Space for avatar
            }}>
                {/* Left: Name and Title */}
                <Box>
                    <Typography variant="h4" sx={{
                        fontWeight: 800,
                        color: '#fff',
                        fontSize: '1.75rem',
                        mb: 0.5,
                        fontFamily: '"Inter", sans-serif'
                    }}>
                        {employee?.full_name || employee?.name || 'Loading...'}
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255,255,255,0.95)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}>
                        <Box component="span" sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#fff',
                            display: 'inline-block'
                        }} />
                        {employee?.job_title}
                    </Typography>
                </Box>

                {/* Right: Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDown />}
                        sx={{
                            bgcolor: '#fff',
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 1,
                            borderRadius: 'var(--radius-standard)',
                            boxShadow: 'none',
                            fontSize: '0.875rem'
                        }}
                    >
                        Request a Change
                    </Button>
                    <IconButton
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                            width: 36,
                            height: 36
                        }}
                    >
                        <MoreHoriz sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>

                {/* Pagination (Top Right) */}
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.8rem'
                }}>
                    <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                        1 of 89
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Next <ChevronRight sx={{ fontSize: 18, ml: 0.5 }} />
                    </Typography>
                </Box>
            </Box>

            {/* Bottom Row: Tabs */}
            <Box sx={{ px: 4, ml: '180px', mt: '5px', mb: 2 }}>
                <Tabs
                    value={tabIndex !== -1 ? tabIndex : 0}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 48,
                        height: 48,
                        '& .MuiTabs-indicator': { display: 'none' },
                        '& .MuiTabs-flexContainer': { gap: 0.5, height: '100%' }
                    }}
                >
                    {profileTabs.map((tab, index) => {
                        const isSelected = tabIndex === index;
                        return (
                            <Tab
                                key={index}
                                label={tab}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 2.5,
                                    py: 1,
                                    minHeight: 40,
                                    fontSize: '0.875rem',
                                    borderRadius: 'var(--radius-standard) var(--radius-standard) 0 0',
                                    bgcolor: isSelected ? '#fff' : 'transparent',
                                    color: isSelected ? 'primary.main' : 'rgba(255,255,255,0.95)',
                                    minWidth: 'auto',
                                    '&:hover': {
                                        bgcolor: isSelected ? '#fff' : 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            />
                        );
                    })}
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                More <ChevronDown sx={{ fontSize: 16 }} />
                            </Box>
                        }
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2.5,
                            py: 1,
                            minHeight: 40,
                            color: 'rgba(255,255,255,0.95)',
                            fontSize: '0.875rem',
                            minWidth: 'auto'
                        }}
                    />
                </Tabs>
            </Box>

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
    );
};

export default ProfileHeader;
