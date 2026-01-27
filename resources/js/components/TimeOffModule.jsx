import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    Avatar,
    Stack,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    Menu
} from '@mui/material';
import {
    CalendarToday,
    Settings,
    BeachAccess,
    ShieldOutlined,
    WorkOutlined,
    History,
    Edit,
    CheckCircle,
    Add,
    CalculateOutlined,
    SettingsOutlined,
    KeyboardArrowDown,
    Schedule
} from '@mui/icons-material';

const SettingsDropdown = ({ anchorEl, open, onClose, onOpenAccrualModal }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: 3, minWidth: 240, p: 0.5 } }}
        >
            <MenuItem onClick={() => { onOpenAccrualModal(); onClose(); }}>
                Accrual Level Start Date: 10/29/2022
            </MenuItem>
            <MenuItem onClick={onClose}>Add Time Off Policy</MenuItem>
            <MenuItem onClick={onClose}>Pause Accruals</MenuItem>
        </Menu>
    );
};

const TimeOffModule = ({ getBalance, setIsCalculatorOpen, setIsModalOpen, onAdjust, onOpenAccrualModal }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setActiveMenuId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveMenuId(null);
    };

    const balanceItems = [
        { label: 'Vacation Available', type: 'Vacation', icon: <BeachAccess />, sub: '(8 hours scheduled)', policy: 'Vacation Full-Time' },
        { label: 'Sick Available', type: 'Sick', icon: <ShieldOutlined />, sub: 'Sick Full-Time' },
        { label: 'Bereavement Used (YTD)', type: 'Bereavement', icon: <WorkOutlined />, unit: 'Days', sub: 'Bereavement Flexible Policy' },
    ];

    const upcomingLeaves = [
        { date: 'Feb 14', label: '8 hours of Vacation', icon: <BeachAccess /> },
        { date: 'Feb 15', label: '8 hours of Sick', icon: <ShieldOutlined /> },
        { date: 'Feb 15 - 16', label: '16 hours of Sick', icon: <ShieldOutlined /> },
        { date: 'Apr 4 - 5', label: '8 hours of Vacation', icon: <BeachAccess /> },
    ];

    return (
        <Box sx={{ p: 0 }}>
            {/* Module Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
                    <CalendarToday />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Time Off</Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<SettingsOutlined />}
                    endIcon={<KeyboardArrowDown sx={{ fontSize: '0.8rem' }} />}
                    onClick={(e) => handleMenuOpen(e, 'header')}
                    sx={{ borderRadius: '24px', fontWeight: 700, color: 'primary.main', borderColor: 'primary.main' }}
                >
                    Settings
                </Button>
            </Box>

            {/* Top Cards Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {balanceItems.map((item, i) => (
                    <Grid size={{ xs: 12, md: 4 }} key={i}>
                        <Card sx={{
                            borderRadius: 5,
                            border: '1px solid #f1f5f9',
                            boxShadow: 'none',
                            bgcolor: '#fff',
                            p: 2
                        }}>
                            <CardContent>
                                <Avatar sx={{ bgcolor: '#f8fafc', color: 'primary.main', mb: 2, borderRadius: 3, width: 44, height: 44 }}>
                                    {item.icon}
                                </Avatar>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                                    {getBalance(item.type)} {item.unit || 'Hours'}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.sub}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <IconButton size="small" variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                        <Add fontSize="small" color="primary" />
                                    </IconButton>
                                    <IconButton size="small" variant="outlined" onClick={() => setIsCalculatorOpen(true)} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                        <CalculateOutlined fontSize="small" color="primary" />
                                    </IconButton>
                                    <IconButton size="small" variant="outlined" onClick={() => onAdjust(item.type)} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                        <Edit fontSize="small" color="primary" />
                                    </IconButton>
                                    <Box sx={{ ml: 'auto' }}>
                                        <IconButton size="small" variant="outlined" onClick={(e) => handleMenuOpen(e, i)} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                            <Settings fontSize="small" color="action" />
                                            <KeyboardArrowDown sx={{ fontSize: '0.5rem', ml: 0.5 }} />
                                        </IconButton>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Upcoming Section */}
            <Paper sx={{ p: 4, borderRadius: 6, mb: 5, border: '1px solid #f1f5f9', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, color: 'primary.main' }}>
                    <Schedule fontSize="small" />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Upcoming Time Off</Typography>
                </Box>
                <Stack divider={<Divider />}>
                    {upcomingLeaves.map((leave, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 2 }}>
                            <Avatar sx={{ bgcolor: '#f8fafc', color: 'primary.main', borderRadius: 3, width: 48, height: 48 }}>
                                {leave.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>{leave.date}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircle sx={{ fontSize: '0.9rem', color: 'success.main' }} />
                                    <Typography variant="body2" color="text.secondary">{leave.label}</Typography>
                                </Box>
                            </Box>
                            <Button variant="outlined" size="small" sx={{ borderRadius: 3, px: 3, fontWeight: 700, color: 'text.primary', borderColor: '#e2e8f0' }}>
                                Edit
                            </Button>
                        </Box>
                    ))}
                </Stack>
            </Paper>

            {/* History Section */}
            <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid #f1f5f9', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, color: 'primary.main' }}>
                    <History fontSize="small" />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>History</Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select value="Vacation">
                            <MenuItem value="Vacation">Vacation</MenuItem>
                            <MenuItem value="Sick">Sick</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select value="All">
                            <MenuItem value="All">All</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ ml: 'auto' }}>
                        <Button
                            variant="outlined"
                            size="small"
                            endIcon={<KeyboardArrowDown fontSize="small" />}
                            sx={{ borderRadius: 3, fontWeight: 600, color: 'text.primary', borderColor: '#e2e8f0', px: 2 }}
                        >
                            Balance History
                        </Button>
                    </Box>
                </Stack>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #f1f5f9' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontWeight: 700 }}>Date ↑</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontWeight: 700 }}>Description</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px', color: '#64748b', fontWeight: 700 }}>Used Hours (-)</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px', color: '#64748b', fontWeight: 700 }}>Earned Hours (+)</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px', color: '#64748b', fontWeight: 700 }}>Balance</th>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <TableCell sx={{ px: 3, py: 3, fontWeight: 600 }}>10/29/2022</TableCell>
                                <TableCell sx={{ px: 3, py: 3 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Moved to a new policy</Typography>
                                    <Typography variant="caption" color="text.secondary">Vacation Accrual Policy was set to Vacation Full-Time</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ px: 3, py: 3 }}>-</TableCell>
                                <TableCell align="right" sx={{ px: 3, py: 3 }}>-</TableCell>
                                <TableCell align="right" sx={{ px: 3, py: 3, fontWeight: 700 }}>0.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <SettingsDropdown
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onOpenAccrualModal={onOpenAccrualModal}
            />
        </Box>
    );
};

export default TimeOffModule;
