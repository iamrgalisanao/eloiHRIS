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
    Button,
    Avatar,
    Stack,
    Alert
} from '@mui/material';
import { Close, InfoOutlined } from '@mui/icons-material';

const AccrualStartDateModal = ({ isOpen, onClose, userName, jobTitle }) => {
    const [startDate, setStartDate] = useState('2022-10-29');

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4 }
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
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    Accrual Level Start Date
                </Typography>
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

                <Alert
                    icon={<InfoOutlined fontSize="inherit" />}
                    severity="info"
                    sx={{ mb: 4, borderRadius: 3, '& .MuiAlert-message': { fontSize: '1rem' } }}
                >
                    <Typography variant="body1" component="span" sx={{ fontWeight: 700 }}>Note: </Typography>
                    If your policy allows for employees to earn at different rates based on their length of service, you can manipulate the rate this employee is eligible for by adjusting the Accrual Start Date below.
                </Alert>

                <Box sx={{ width: '250px' }}>
                    <TextField
                        label="Accrual Level Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 4, py: 3, bgcolor: '#f8fafc', gap: 2 }}>
                <Button onClick={onClose} sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1rem' }}>
                    Cancel
                </Button>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        borderRadius: '30px',
                        px: 6,
                        py: 1,
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccrualStartDateModal;
