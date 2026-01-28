import React, { useState, useEffect } from 'react';
import {
    User, Home, Phone, Share2, GraduationCap,
    CreditCard, Save, X, Plus, Trash2, Globe, Settings, ChevronDown
} from 'lucide-react';
import { Box, Typography, Button, TextField, MenuItem, Divider, IconButton, Stack } from '@mui/material';
import { getPersonalData, updatePersonalData } from '../../services/employeeService';

const PersonalTab = ({ employeeId, onUpdate }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        loadData();
    }, [employeeId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getPersonalData(employeeId);
            setFormData(data);
        } catch (error) {
            console.error('Error loading personal data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updatePersonalData(employeeId, formData);
            if (onUpdate) onUpdate();
            alert('Personal information updated successfully');
        } catch (error) {
            console.error('Error updating personal data:', error);
            alert('Failed to update personal information');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateList = (section, index, field, value) => {
        setFormData(prev => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    };

    const addListItem = (section, initialObj) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], initialObj]
        }));
    };

    const removeListItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    if (loading) return <Box sx={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading personal data...</Typography></Box>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: '600px' }}>
            {/* Page Title & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: '8px', display: 'flex', color: '#fff' }}>
                        <User size={20} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#334155' }}>Personal</Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="text"
                        endIcon={<ChevronDown size={18} />}
                        sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'none' }}
                    >
                        Customize Layout
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<X size={18} />}
                        onClick={loadData}
                        disabled={saving}
                        sx={{ borderRadius: 'var(--radius-standard)', textTransform: 'none', fontWeight: 700 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Save size={18} />}
                        onClick={handleSave}
                        disabled={saving}
                        sx={{ borderRadius: 'var(--radius-standard)', textTransform: 'none', fontWeight: 800, px: 3 }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Stack>
            </div>

            {/* Stacked Sections */}
            <Stack spacing={4}>
                <FormSection title="Basic Information" icon={<User size={20} color="#22c55e" />}>
                    <BasicInfoSection data={formData.basic} updateField={(f, v) => updateField('basic', f, v)} />
                </FormSection>

                <FormSection title="Address" icon={<Home size={20} color="#22c55e" />}>
                    <AddressSection data={formData.address} updateField={(f, v) => updateField('address', f, v)} />
                </FormSection>

                <FormSection title="Contact" icon={<Phone size={20} color="#22c55e" />}>
                    <ContactSection data={formData.contact} updateField={(f, v) => updateField('contact', f, v)} />
                </FormSection>

                <FormSection title="Social Links" icon={<Share2 size={20} color="#22c55e" />}>
                    <SocialSection data={formData.social} updateField={(f, v) => updateField('social', f, v)} />
                </FormSection>

                <FormSection title="Education" icon={<GraduationCap size={20} color="#22c55e" />}>
                    <EducationSection
                        list={formData.educations}
                        updateItem={(i, f, v) => updateList('educations', i, f, v)}
                        addItem={() => addListItem('educations', { institution: '', degree: '', major: '', gpa: '', start_date: '', end_date: '' })}
                        removeItem={(i) => removeListItem('educations', i)}
                    />
                </FormSection>

                <FormSection title="Visa Information" icon={<Globe size={20} color="#22c55e" />}>
                    <VisaSection
                        list={formData.visas}
                        updateItem={(i, f, v) => updateList('visas', i, f, v)}
                        addItem={() => addListItem('visas', { visa_type: '', issuing_country: '', issued_date: '', expiration_date: '', status: '', notes: '' })}
                        removeItem={(i) => removeListItem('visas', i)}
                    />
                </FormSection>
            </Stack>
        </Box>
    );
};

// --- Form Wrapper ---
const FormSection = ({ title, icon, children }) => (
    <Box className="glass-panel" sx={{ p: 4, bgcolor: '#fff', borderRadius: 'var(--radius-standard)' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
            {icon}
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>
                {title}
            </Typography>
        </Stack>
        {children}
    </Box>
);

// --- Sub-sections ---

const BasicInfoSection = ({ data, updateField }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            <TextField variant="outlined" label="Employee #" value={data.id || ''} disabled fullWidth />
            <TextField select label="Status" value={data.status || 'Active'} onChange={e => updateField('status', e.target.value)} fullWidth>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Terminated">Terminated</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
            </TextField>
            <Box sx={{ gridColumn: 'span 2' }} />

            <TextField label="First Name" value={data.first_name || ''} onChange={e => updateField('first_name', e.target.value)} fullWidth required />
            <TextField label="Middle Name" value={data.middle_name || ''} onChange={e => updateField('middle_name', e.target.value)} fullWidth />
            <TextField label="Last Name" value={data.last_name || ''} onChange={e => updateField('last_name', e.target.value)} fullWidth required />
            <TextField label="Preferred Name" value={data.preferred_name || ''} onChange={e => updateField('preferred_name', e.target.value)} fullWidth />

            <TextField label="Birth Date" type="date" value={data.birth_date || ''} onChange={e => updateField('birth_date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField select label="Gender" value={data.gender || ''} onChange={e => updateField('gender', e.target.value)} fullWidth>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField select label="Marital Status" value={data.marital_status || ''} onChange={e => updateField('marital_status', e.target.value)} fullWidth>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
            </TextField>
            <Box />

            <TextField label="SSN" value={data.ssn || ''} onChange={e => updateField('ssn', e.target.value)} fullWidth />
            <TextField label="Tax File Number" value={data.tax_file_number || ''} onChange={e => updateField('tax_file_number', e.target.value)} fullWidth />
            <TextField label="NIN" value={data.nin || ''} onChange={e => updateField('nin', e.target.value)} fullWidth />
            <Box />

            <TextField select label="Shirt Size" value={data.shirt_size || ''} onChange={e => updateField('shirt_size', e.target.value)} fullWidth>
                <MenuItem value="XS">XS</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
                <MenuItem value="2XL">2XL</MenuItem>
            </TextField>
            <Box sx={{ gridColumn: 'span 3' }} />

            <Box sx={{ gridColumn: 'span 2' }}>
                <TextField label="Allergies" value={data.allergies || ''} onChange={e => updateField('allergies', e.target.value)} fullWidth multiline rows={2} />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
                <TextField label="Dietary Restrictions" value={data.dietary_restrictions || ''} onChange={e => updateField('dietary_restrictions', e.target.value)} fullWidth multiline rows={2} />
            </Box>
        </Box>
    );
};

const AddressSection = ({ data, updateField }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 2' }}>
                <TextField label="Street 1" value={data.address_street_1 || ''} onChange={e => updateField('address_street_1', e.target.value)} fullWidth />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }} />

            <Box sx={{ gridColumn: 'span 2' }}>
                <TextField label="Street 2" value={data.address_street_2 || ''} onChange={e => updateField('address_street_2', e.target.value)} fullWidth />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }} />

            <TextField label="City" value={data.address_city || ''} onChange={e => updateField('address_city', e.target.value)} fullWidth />
            <TextField label="State" value={data.address_province || ''} onChange={e => updateField('address_province', e.target.value)} fullWidth />
            <TextField label="Zip" value={data.address_postal_code || ''} onChange={e => updateField('address_postal_code', e.target.value)} fullWidth />
            <Box />

            <TextField label="Country" value={data.address_country || ''} onChange={e => updateField('address_country', e.target.value)} fullWidth />
        </Box>
    );
};

const ContactSection = ({ data, updateField }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            <TextField label="Work Phone" value={data.phone_work || ''} onChange={e => updateField('phone_work', e.target.value)} fullWidth />
            <TextField label="Ext" value={data.phone_work_ext || ''} onChange={e => updateField('phone_work_ext', e.target.value)} fullWidth />
            <Box sx={{ gridColumn: 'span 2' }} />

            <TextField label="Mobile Phone" value={data.phone_mobile || ''} onChange={e => updateField('phone_mobile', e.target.value)} fullWidth />
            <Box sx={{ gridColumn: 'span 3' }} />

            <TextField label="Home Phone" value={data.home_phone || ''} onChange={e => updateField('home_phone', e.target.value)} fullWidth />
            <Box sx={{ gridColumn: 'span 3' }} />

            <Box sx={{ gridColumn: 'span 2' }}>
                <TextField label="Work Email" value={data.email || ''} fullWidth disabled />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }} />

            <Box sx={{ gridColumn: 'span 2' }}>
                <TextField label="Home Email" value={data.home_email || ''} onChange={e => updateField('home_email', e.target.value)} fullWidth />
            </Box>
        </Box>
    );
};

const SocialSection = ({ data, updateField }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            <TextField label="LinkedIn" value={data.linkedin_url || ''} onChange={e => updateField('linkedin_url', e.target.value)} fullWidth />
            <TextField label="Twitter Username" value={data.twitter_url || ''} onChange={e => updateField('twitter_url', e.target.value)} fullWidth />
            <TextField label="Facebook" value={data.facebook_url || ''} onChange={e => updateField('facebook_url', e.target.value)} fullWidth />
            <TextField label="Pinterest" value={data.pinterest_url || ''} onChange={e => updateField('pinterest_url', e.target.value)} fullWidth />
            <TextField label="Instagram" value={data.instagram_url || ''} onChange={e => updateField('instagram_url', e.target.value)} fullWidth />
        </Box>
    );
};

const EducationSection = ({ list, updateItem, addItem, removeItem }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {list.map((item, index) => (
                <Box key={index} sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={() => removeItem(index)}
                        sx={{ position: 'absolute', top: -10, right: -10, color: 'text.disabled' }}
                        size="small"
                    >
                        <Trash2 size={18} />
                    </IconButton>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                        <Box sx={{ gridColumn: 'span 2' }}>
                            <TextField label="College/Institution" value={item.institution || ''} onChange={e => updateItem(index, 'institution', e.target.value)} fullWidth required />
                        </Box>
                        <Box sx={{ gridColumn: 'span 2' }} />

                        <TextField select label="Degree" value={item.degree || ''} onChange={e => updateItem(index, 'degree', e.target.value)} fullWidth>
                            <MenuItem value="Bachelor's">Bachelor's</MenuItem>
                            <MenuItem value="Master's">Master's</MenuItem>
                            <MenuItem value="Doctorate">Doctorate</MenuItem>
                        </TextField>
                        <TextField label="Major/Specialization" value={item.major || ''} onChange={e => updateItem(index, 'major', e.target.value)} fullWidth />
                        <TextField label="GPA" value={item.gpa || ''} onChange={e => updateItem(index, 'gpa', e.target.value)} fullWidth />
                        <Box />

                        <TextField label="Start Date" type="date" value={item.start_date || ''} onChange={e => updateItem(index, 'start_date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                        <TextField label="End Date" type="date" value={item.end_date || ''} onChange={e => updateItem(index, 'end_date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                    </Box>
                </Box>
            ))}
            <Button
                variant="text"
                startIcon={<Plus size={18} />}
                onClick={addItem}
                sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'none', justifyContent: 'flex-start', p: 0 }}
            >
                Add Education
            </Button>
        </Box>
    );
};

const VisaSection = ({ list, updateItem, addItem, removeItem }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', fontWeight: 600 }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Visa</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Issuing Country</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Issued</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Expiration</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No visa information entries have been added.</td>
                            </tr>
                        ) : (
                            list.map((item, index) => (
                                <tr key={index} style={{ borderTop: '1px solid #f1f5f9' }}>
                                    {/* Simplified for now to match table header style */}
                                    <td colSpan={7} style={{ padding: '12px' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <TextField size="small" type="date" value={item.issued_date || ''} onChange={e => updateItem(index, 'issued_date', e.target.value)} />
                                            <TextField size="small" value={item.visa_type || ''} onChange={e => updateItem(index, 'visa_type', e.target.value)} placeholder="Type" />
                                            <IconButton onClick={() => removeItem(index)} color="error" size="small"><Trash2 size={14} /></IconButton>
                                        </Stack>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Button
                variant="outlined"
                startIcon={<Plus size={18} />}
                onClick={addItem}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, alignSelf: 'flex-end', fontSize: '0.8rem' }}
            >
                Add Entry
            </Button>
        </Box>
    );
};

export default PersonalTab;
