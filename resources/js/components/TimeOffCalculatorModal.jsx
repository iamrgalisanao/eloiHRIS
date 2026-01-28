import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    TextField,
    MenuItem,
    Button,
    Avatar,
    Stack,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { Close, ChevronRight, ExpandMore, CalendarToday } from '@mui/icons-material';

const TimeOffCalculatorModal = ({ isOpen, onClose, userName, jobTitle }) => {
    const [category, setCategory] = useState('Vacation');
    const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Simulation settings
    const currentBalance = 29.65;
    const accrualRate = 6.00; // 6 hours bi-weekly
    const lastAccrualDate = new Date('2026-01-07');

    // Calculation Logic
    const targetDate = new Date(asOfDate);
    const today = new Date();
    const isFuture = targetDate > today;

    const accrualDetails = [];
    let projectedBalance = currentBalance;

    if (isFuture) {
        let iterDate = new Date(lastAccrualDate);
        iterDate.setDate(iterDate.getDate() + 14);

        while (iterDate <= targetDate) {
            projectedBalance += accrualRate;
            accrualDetails.push({
                date: iterDate.toLocaleDateString(),
                action: `Scheduled Accrual`,
                hours: `+${accrualRate.toFixed(2)}`,
                balance: projectedBalance.toFixed(2)
            });
            iterDate.setDate(iterDate.getDate() + 14);
        }
    }

    const displayDetails = [...accrualDetails].reverse();

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 'var(--radius-standard)' }
            }}
        >
            <DialogTitle sx={{
                px: 4,
                py: 3,
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>Calculate Time Off</Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                {/* User Profile Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Avatar
                        sx={{ width: 64, height: 64, bgcolor: 'secondary.light', fontSize: '1.5rem', fontWeight: 700 }}
                    >
                        {userName?.split(' ').map(n => n[0]).join('') || '??'}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {userName || 'mel galisanao'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {jobTitle || 'Sr. HR Administrator'}
                        </Typography>
                    </Box>
                </Box>

                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <TextField
                            select
                            label="Time Off Category"
                            fullWidth
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="Vacation">Vacation</MenuItem>
                            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        </TextField>
                        <TextField
                            label="As of Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={asOfDate}
                            onChange={(e) => setAsOfDate(e.target.value)}
                        />
                    </Box>

                    {/* Result Banner */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            borderRadius: 'var(--radius-standard)',
                            bgcolor: 'var(--bg-alt)',
                            textAlign: 'center',
                            border: '1px solid var(--border-light)'
                        }}
                    >
                        <Typography variant="h1" color="primary" sx={{ fontWeight: 800, fontSize: '3.5rem', lineHeight: 1 }}>
                            {projectedBalance.toFixed(2)}
                            <Typography component="span" variant="h3" sx={{ ml: 1, fontWeight: 700, opacity: 0.8 }}>
                                hours
                            </Typography>
                        </Typography>
                    </Paper>

                    {/* Detail Toggle */}
                    <Box>
                        <Button
                            color="inherit"
                            onClick={() => setIsExpanded(!isExpanded)}
                            startIcon={isExpanded ? <ExpandMore /> : <ChevronRight />}
                            sx={{
                                fontWeight: 700,
                                color: 'text.secondary',
                                px: 0,
                                '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
                            }}
                        >
                            Accrual Details
                        </Button>

                        <Collapse in={isExpanded}>
                            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, borderRadius: 3, maxHeight: 300 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }} align="right">Hours</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }} align="right">Balance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayDetails.length > 0 ? displayDetails.map((row, i) => (
                                            <TableRow key={i} hover>
                                                <TableCell sx={{ fontWeight: 600 }}>{row.date}</TableCell>
                                                <TableCell color="text.secondary">{row.action}</TableCell>
                                                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 700 }}>{row.hours}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>{row.balance}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                                                    No projected changes before this date.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 4, py: 3, bgcolor: '#f8fafc' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="secondary"
                    sx={{
                        borderRadius: 'var(--radius-standard)',
                        px: 6,
                        py: 1,
                        fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(11, 79, 209, 0.2)'
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TimeOffCalculatorModal;
