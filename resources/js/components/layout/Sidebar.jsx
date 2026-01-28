import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    IconButton,
    Avatar,
    Divider
} from '@mui/material';
import {
    Home,
    Person,
    People,
    Work,
    BarChart,
    Folder,
    Settings,
    Menu as MenuIcon
} from '@mui/icons-material';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const menuItems = [
        {
            icon: <Home />,
            label: 'Home',
            path: '/home'
        },
        {
            icon: <Person />,
            label: 'My Info',
            path: '/employee/me'
        },
        {
            icon: <People />,
            label: 'People',
            path: '/people'
        },
        {
            icon: <Work />,
            label: 'Hiring',
            path: '/hiring'
        },
        {
            icon: <BarChart />,
            label: 'Reports',
            path: '/reports'
        },
        {
            icon: <Folder />,
            label: 'Files',
            path: '/files'
        },
        {
            icon: <Settings />,
            label: 'Settings',
            path: '/settings'
        },
    ];

    const drawerWidth = isCollapsed ? 80 : 240;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                transition: 'width 0.3s',
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px solid #e2e8f0',
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                    bgcolor: '#fff'
                },
            }}
        >
            {/* Logo */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: 2 }}>
                <Box
                    component="img"
                    src="https://images7.bamboohr.com/745001/logos/cropped.jpg?v=26"
                    alt="Logo"
                    sx={{
                        height: isCollapsed ? 30 : 36,
                        width: 'auto',
                        objectFit: 'contain'
                    }}
                />
            </Box>

            <List sx={{ flex: 1, px: 2, py: 2 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            sx={{
                                borderRadius: 'var(--radius-standard)',
                                minHeight: 48,
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                px: 2.5,
                                color: 'text.secondary',
                                transition: 'all 0.2s',
                                '&.active': {
                                    bgcolor: 'var(--primary)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    '& .MuiListItemIcon-root': {
                                        color: '#fff',
                                    }
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(40, 116, 17, 0.06)',
                                    color: 'var(--primary)',
                                    '& .MuiListItemIcon-root': {
                                        color: 'var(--primary)',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isCollapsed ? 0 : 2,
                                    justifyContent: 'center',
                                    color: 'inherit',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            {!isCollapsed && (
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: 'inherit',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Bottom Section */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', mt: 'auto', mb: 2 }}>
                <IconButton
                    onClick={onToggle}
                    size="small"
                    sx={{
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                >
                    <MenuIcon fontSize="small" />
                </IconButton>
                <Avatar sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    '&:hover': { boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.1)' }
                }}>
                    <Person />
                </Avatar>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
