import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    TextField,
    InputAdornment,
    Badge,
    Avatar,
    Button,
    Typography
} from '@mui/material';
import {
    AutoAwesome,
    Inbox,
    HelpOutline,
    Settings,
    Search,
    Chat,
    KeyboardArrowDown
} from '@mui/icons-material';

const Header = () => {
    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={0}
            sx={{
                bgcolor: '#fff',
                borderBottom: '1px solid #e2e8f0'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
                {/* Left Side - Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        component="img"
                        src="https://images7.bamboohr.com/745001/logos/cropped.jpg?v=26"
                        alt="Eloisoft Logo"
                        sx={{
                            height: 42,
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </Box>

                {/* Right Side - Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Search */}
                    <TextField
                        size="small"
                        placeholder="Search..."
                        sx={{
                            width: 300,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#f8fafc'
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Inbox */}
                    <IconButton>
                        <Badge badgeContent={19} color="error">
                            <Inbox />
                        </Badge>
                    </IconButton>

                    {/* Help */}
                    <IconButton>
                        <HelpOutline />
                    </IconButton>

                    {/* Settings */}
                    <IconButton component={Link} to="/settings">
                        <Settings />
                    </IconButton>

                    {/* Ask Button */}
                    <Button
                        variant="contained"
                        startIcon={<Chat />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 'var(--radius-standard)',
                            bgcolor: 'var(--secondary)',
                            '&:hover': { bgcolor: 'var(--secondary-hover)' },
                            px: 2,
                            fontWeight: 700
                        }}
                    >
                        Ask
                    </Button>

                    {/* User Profile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                            MK
                        </Avatar>
                        <KeyboardArrowDown fontSize="small" />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
