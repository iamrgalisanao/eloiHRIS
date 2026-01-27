import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
    Typography,
    Divider,
    IconButton,
    Link,
    Stack
} from '@mui/material';
import {
    LinkedIn,
    Twitter,
    Facebook,
    MailOutline,
    PhoneOutlined,
    PhoneAndroidOutlined,
    PersonOutline,
    GroupsOutlined,
    AccountTree as TreeStructure
} from '@mui/icons-material';

export default function DirectoryView({ data }) {
    if (!data) return null;

    const letters = Object.keys(data).sort();
    const totalCount = letters.reduce((sum, letter) => sum + (data[letter]?.length || 0), 0);

    return (
        <Box sx={{ p: 0 }}>
            {/* Redundant header removed as it is now in PeoplePage */}

            {letters.length === 0 ? (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography color="text.secondary">No employees found</Typography>
                </Box>
            ) : (
                letters.map(letter => {
                    const employees = data[letter];
                    if (!employees || !Array.isArray(employees) || employees.length === 0) {
                        return null;
                    }

                    return (
                        <Box key={letter} sx={{ mb: 6 }}>
                            <Typography
                                variant="h4"
                                color="primary"
                                sx={{
                                    pb: 1.5,
                                    mb: 3,
                                    borderBottom: '2px solid #e2e8f0',
                                    fontWeight: 700
                                }}
                            >
                                {letter}
                            </Typography>

                            <Grid container spacing={3}>
                                {employees.map(employee => (
                                    <Grid size={12} key={employee.id}>
                                        <Card sx={{
                                            bgcolor: '#f8fafc',
                                            borderRadius: 3,
                                            boxShadow: 'none',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                                            },
                                            transition: 'box-shadow 0.2s'
                                        }}>
                                            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                                <Grid container spacing={3} alignItems="flex-start">
                                                    {/* Left: Photo */}
                                                    <Grid>
                                                        <Avatar
                                                            src={employee.photo_url || '/default-avatar.png'}
                                                            alt={employee.full_name}
                                                            sx={{
                                                                width: 100,
                                                                height: 100,
                                                                border: '3px solid #fff',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        />
                                                    </Grid>

                                                    {/* Center: Info */}
                                                    <Grid size="grow">
                                                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                            {employee.full_name}
                                                        </Typography>
                                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                                            {employee.job_title}
                                                            {employee.department && ` in ${employee.department}`}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                            {employee.location}
                                                            {employee.local_time && ` | ${employee.local_time} local time`}
                                                        </Typography>
                                                        {employee.region && (
                                                            <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                                                                {employee.region}
                                                            </Typography>
                                                        )}

                                                        {/* Social Links */}
                                                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                            {employee.social_links?.linkedin && (
                                                                <IconButton size="small" component="a" href={employee.social_links.linkedin} target="_blank" color="inherit">
                                                                    <LinkedIn fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            {employee.social_links?.twitter && (
                                                                <IconButton size="small" component="a" href={employee.social_links.twitter} target="_blank" color="inherit">
                                                                    <Twitter fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            {employee.social_links?.facebook && (
                                                                <IconButton size="small" component="a" href={employee.social_links.facebook} target="_blank" color="inherit">
                                                                    <Facebook fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Stack>
                                                    </Grid>

                                                    {/* Right: Contact & Reporting */}
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Stack spacing={1}>
                                                            {employee.email && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <MailOutline fontSize="small" color="action" />
                                                                    <Link href={`mailto:${employee.email}`} underline="hover" variant="body2">
                                                                        {employee.email}
                                                                    </Link>
                                                                </Box>
                                                            )}
                                                            {employee.phone_work && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PhoneOutlined fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {employee.phone_work}
                                                                        {employee.phone_work_ext && ` Ext. ${employee.phone_work_ext}`}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {employee.phone_mobile && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PhoneAndroidOutlined fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">{employee.phone_mobile}</Typography>
                                                                </Box>
                                                            )}
                                                        </Stack>

                                                        <Divider sx={{ my: 2 }} />

                                                        <Stack spacing={1}>
                                                            {employee.manager && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PersonOutline fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Reports to {employee.manager.name}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {employee.direct_reports_count > 0 && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <GroupsOutlined fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {employee.direct_reports_count} direct reports
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            <Link
                                                                href={`#orgchart/${employee.id}`}
                                                                variant="body2"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                    fontWeight: 600,
                                                                    mt: 1
                                                                }}
                                                            >
                                                                View in org chart
                                                            </Link>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    );
                })
            )}
        </Box>
    );
}
