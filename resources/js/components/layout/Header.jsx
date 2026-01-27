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
                    <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        <AutoAwesome fontSize="small" />
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        COMPANY LOGO HERE
                    </Typography>
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
                        variant="outlined"
                        startIcon={<Chat />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 2
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
