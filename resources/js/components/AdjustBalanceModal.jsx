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
import { Close, PersonOutline } from '@mui/icons-material';

const AdjustBalanceModal = ({ isOpen, onClose, category, employee, onRefresh }) => {
    const [formData, setFormData] = useState({
        adjustment_type: 'Manual Adjustment',
        amount: '',
        note: '',
        effective_date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulation of logic
        setTimeout(() => {
            setLoading(false);
            onRefresh();
            onClose();
        }, 800);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="xs"
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
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                    Adjust {category} Balance
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 4 }}>
                    {/* Employee Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Avatar
                            sx={{ width: 44, height: 44, bgcolor: '#f1f5f9', color: '#64748b' }}
                        >
                            <PersonOutline />
                        </Avatar>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                {employee?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {category} Balance
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                    )}

                    <Stack spacing={3}>
                        <Box>
                            <TextField
                                label="Adjustment Amount"
                                type="number"
                                placeholder="e.g. 5.5 or -8"
                                fullWidth
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                                }}
                                helperText="Use positive numbers to add, negative to subtract."
                            />
                        </Box>

                        <TextField
                            select
                            label="Adjustment Type"
                            fullWidth
                            value={formData.adjustment_type}
                            onChange={(e) => setFormData({ ...formData, adjustment_type: e.target.value })}
                        >
                            <MenuItem value="Manual Adjustment">Manual Adjustment</MenuItem>
                            <MenuItem value="Carryover Balance">Carryover Balance</MenuItem>
                            <MenuItem value="Policy Change">Policy Change</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>

                        <TextField
                            label="Note"
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Why is this adjustment being made?"
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
                            px: 4,
                            py: 1,
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(11, 79, 209, 0.2)'
                        }}
                    >
                        {loading ? 'Adjusting...' : 'Adjust Balance'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AdjustBalanceModal;
