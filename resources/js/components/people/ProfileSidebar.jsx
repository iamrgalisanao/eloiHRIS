import React from 'react';
import {
    Phone, Mail, Linkedin, Twitter, Facebook, Instagram,
    Hash, MapPin, Briefcase, Users, Clock, Calendar,
    ChevronDown, ExternalLink, Globe, User, Award, Layers
} from 'lucide-react';
import { Box, Typography, Avatar, Divider, Stack } from '@mui/material';

const ProfileSidebar = ({ employee }) => {
    const tenure = employee?.hire_date ? calculateTenure(employee.hire_date) : '';


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            {/* Vitals Section */}
            <Section title="Vitals">
                <VitalItem icon={<Phone size={16} />} text={`${employee?.phone_work || 'Add Work Phone'} ${employee?.phone_work_ext ? 'x' + employee.phone_work_ext : ''}`} />
                <VitalItem icon={<Phone size={16} />} text={employee?.phone_mobile || 'Add Mobile Phone'} />
                <VitalItem icon={<Mail size={16} />} text={employee?.email || 'Add Email'} />
                <Stack direction="row" spacing={1.5} sx={{ my: 1, color: 'text.secondary' }}>
                    {employee?.social_links?.linkedin && <Linkedin size={18} style={{ cursor: 'pointer' }} />}
                    {employee?.social_links?.twitter && <Twitter size={18} style={{ cursor: 'pointer' }} />}
                    {employee?.social_links?.facebook && <Facebook size={18} style={{ cursor: 'pointer' }} />}
                    {employee?.social_links?.pinterest && <Globe size={18} style={{ cursor: 'pointer' }} />}
                    {employee?.social_links?.instagram && <Instagram size={18} style={{ cursor: 'pointer' }} />}
                </Stack>
                <VitalItem icon={<Clock size={16} />} text={`${employee?.local_time || '4:23 AM'} local time`} />
                <VitalItem icon={<MapPin size={16} />} text={employee?.location || 'Add Location'} />
                <VitalItem icon={<Briefcase size={16} />} text={`${employee?.job_title || 'Job Title'} ${employee?.employment_status || 'Full-Time'}`} />
                <VitalItem icon={<Users size={16} />} text={employee?.department || 'Add Department'} />
                <VitalItem icon={<Layers size={16} />} text={employee?.division || 'Add Division'} />
                <VitalItem icon={<Hash size={16} />} text={employee?.employee_number || 'N/A'} />
            </Section>

            {/* Hire Date Section */}
            <Section title="Hire Date">
                <VitalItem icon={<Calendar size={16} />} text={employee?.hire_date || 'Add Hire Date'} />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block' }}>
                    {tenure}
                </Typography>
            </Section>

            {/* Total Rewards */}
            <Section title="Total Rewards">
                <VitalItem icon={<Award size={16} />} text="View Total Rewards" color="primary.main" isLink />
            </Section>

            {/* Manager Section */}
            <Section title="Manager">
                {employee?.manager ? (
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Avatar src={employee?.manager?.photo_url} sx={{ width: 48, height: 48 }}>
                            {employee?.manager?.name?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                {employee?.manager?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {employee?.manager?.job_title}
                            </Typography>
                        </Box>
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">No manager assigned</Typography>
                )}
            </Section>

            {/* Direct Reports Section */}
            <Section title="Direct Reports">
                {employee?.direct_reports?.length > 0 ? (
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        {employee?.direct_reports?.slice(0, 5).map(report => (
                            <VitalItem key={report.id} icon={<User size={16} color="#64748b" />} text={report.name} />
                        ))}
                        {employee?.direct_reports?.length > 5 && (
                            <VitalItem icon={<User size={16} color="#64748b" />} text={`${employee?.direct_reports?.length - 5} More...`} />
                        )}
                        <VitalItem icon={<ExternalLink size={16} />} text="View in org chart" color="primary.main" isLink />
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">No direct reports</Typography>
                )}
            </Section>
        </Box>
    );
};

const Section = ({ title, children }) => (
    <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5, fontSize: '0.85rem' }}>
            {title}
        </Typography>
        {children}
        <Divider sx={{ mt: 2.5, borderColor: '#f1f5f9' }} />
    </Box>
);

const VitalItem = ({ icon, text, color = 'text.main', isLink = false }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 0.5, cursor: isLink ? 'pointer' : 'default' }}>
        <Box sx={{ color: '#94a3b8', display: 'flex' }}>{icon}</Box>
        <Typography variant="body2" sx={{
            fontWeight: 500,
            color: color === 'text.main' ? '#475569' : color,
            '&:hover': isLink ? { textDecoration: 'underline' } : {}
        }}>
            {text}
        </Typography>
    </Stack>
);

const calculateTenure = (hireDate) => {
    const start = new Date(hireDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return `${years}y - ${months}m - ${days}d`;
};

export default ProfileSidebar;
