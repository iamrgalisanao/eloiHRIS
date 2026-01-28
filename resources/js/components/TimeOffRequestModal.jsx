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
    Alert,
    InputAdornment
} from '@mui/material';
import { Close, CalendarToday, AccessTime } from '@mui/icons-material';

const TimeOffRequestModal = ({ isOpen, onClose, onRefresh, employee }) => {
    const [formData, setFormData] = useState({
        leave_type: 'Vacation',
        start_date: '',
        end_date: '',
        amount: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        fetch('/api/time-off/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            body: JSON.stringify({
                ...formData,
                total_hours: formData.amount,
            })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to submit request');
                return data;
            })
            .then(() => {
                onRefresh();
                onClose();
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

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
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>Record Time Off</Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4 }}>
                    {/* User Profile Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Avatar
                            sx={{ width: 64, height: 64, bgcolor: 'secondary.light', fontSize: '1.5rem', fontWeight: 700 }}
                        >
                            {employee?.name?.split(' ').map(n => n[0]).join('') || '??'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {employee?.name || 'mel galisanao'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {employee?.job_title || 'Sr. HR Administrator'}
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                    )}

                    <Stack spacing={3}>
                        {/* Date Selection */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <TextField
                                label="From"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                            <TextField
                                label="To"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
                        </Box>

                        {/* Category Selection */}
                        <TextField
                            select
                            label="Time Off Category"
                            fullWidth
                            value={formData.leave_type}
                            onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                            required
                        >
                            <MenuItem value="Vacation">Vacation</MenuItem>
                            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                            <MenuItem value="Bereavement">Bereavement</MenuItem>
                            <MenuItem value="FMLA">FMLA</MenuItem>
                        </TextField>

                        {/* Amount Input */}
                        <TextField
                            label="Amount"
                            type="number"
                            placeholder="0"
                            fullWidth
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            InputProps={{
                                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                            }}
                            sx={{ maxWidth: 200 }}
                        />

                        {/* Note area */}
                        <TextField
                            label="Note"
                            multiline
                            rows={4}
                            fullWidth
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 4, py: 3, bgcolor: '#f8fafc', gap: 2 }}>
                    <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={loading}
                        sx={{
                            borderRadius: 'var(--radius-standard)',
                            px: 5,
                            py: 1,
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(11, 79, 209, 0.2)'
                        }}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TimeOffRequestModal;
