import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    Alert,
    InputAdornment,
    Snackbar
} from '@mui/material';
import {
    Person,
    Home,
    Payments,
    ContactPhone,
    Badge,
    Work,
    VpnKey,
    Business,
    Smartphone
} from '@mui/icons-material';

// --- Form Section Base ---
const FormSection = memo(({ title, icon: Icon, children }) => (
    <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{
                bgcolor: '#f1f8f1',
                p: 0.8,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3c763d'
            }}>
                <Icon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '14px', color: '#3c763d', fontFamily: "'Outfit', sans-serif" }}>{title}</Typography>
        </Box>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0f0f0', borderRadius: 3, bgcolor: '#fff' }}>
            {children}
        </Paper>
    </Box>
));

const Label = ({ children, required }) => (
    <Typography variant="caption" sx={{ color: '#333', fontWeight: 600, display: 'block', mb: 0.5, fontFamily: "'Outfit', sans-serif", fontSize: '14px' }}>
        {children}{required ? '*' : ''}
    </Typography>
);

const StyledTextField = memo((props) => (
    <TextField
        fullWidth
        size="small"
        {...props}
        sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
            ...props.sx
        }}
    />
));

const StyledSelect = memo(({ children, ...props }) => (
    <FormControl fullWidth size="small">
        <Select
            displayEmpty
            {...props}
            sx={{ borderRadius: 2 }}
        >
            {children}
        </Select>
    </FormControl>
));

export default function AddEmployeePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({ fields: {}, managers: [] });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        employee_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        preferred_name: '',
        birth_date: '',
        gender: '',
        marital_status: '',
        ssn: '',

        address_street_1: '',
        address_street_2: '',
        address_city: '',
        address_province: '',
        address_postal_code: '',
        address_country: 'Philippines',

        comp_effective_date: new Date().toISOString().split('T')[0],
        overtime_status: '',
        comp_change_reason: '',
        comp_comment: '',
        pay_schedule: '',
        pay_type: 'Salary',
        pay_rate: '',
        pay_currency: 'PHP',

        phone_work: '',
        phone_work_ext: '',
        phone_mobile: '',
        home_phone: '',
        email: '',
        home_email: '',

        employment_status: '',
        hire_date: new Date().toISOString().split('T')[0],
        ethnicity: '',
        status: 'active',

        job_title: '',
        reports_to_id: '',
        department: '',
        division: '',
        location: '',

        allow_access: true
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch('/api/employees/creation-options');
                const data = await res.json();
                setOptions(data);

                setFormData(prev => ({
                    ...prev,
                    comp_change_reason: data.fields.comp_change_reason?.includes('New Hire') ? 'New Hire' : (data.fields.comp_change_reason?.[0] || ''),
                    overtime_status: data.fields.overtime_status?.[0] || '',
                    pay_schedule: data.fields.pay_schedule?.[0] || '',
                    employment_status: data.fields.employment_status?.[0] || '',
                    job_title: data.fields.job_title?.[0] || '',
                    department: data.fields.department?.[0] || '',
                    division: data.fields.division?.[0] || '',
                    location: data.fields.location?.[0] || '',
                }));
            } catch (err) {
                console.error('Failed to fetch options:', err);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleBack = () => navigate('/people');

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        const required = ['first_name', 'last_name', 'email', 'hire_date', 'department', 'job_title'];
        const missing = required.filter(field => !formData[field]);

        if (missing.length > 0) {
            setError(`Please fill in all required fields: ${missing.join(', ').replace(/_/g, ' ')}`);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to save employee');

            setSuccess(true);
            setTimeout(() => {
                const newId = result.employee?.id;
                navigate(newId ? `/employee/${newId}` : '/people');
            }, 1000);
        } catch (err) {
            setError(err.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4, bgcolor: '#fbfcfb', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#3c763d', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>New Employee</Typography>
                <Typography
                    variant="caption"
                    sx={{ color: '#0066cc', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, fontFamily: "'Outfit', sans-serif" }}
                >
                    Customize Add Employee Form
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

            <Paper elevation={0} sx={{
                p: 3, mb: 4, borderRadius: 3,
                bgcolor: '#fff', border: '1px solid #f0f0f0',
                display: 'flex', flexDirection: 'column', gap: 1
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3c763d', fontFamily: "'Outfit', sans-serif" }}>
                    Make everyone's life a little bit easier and send a New Hire Packet.
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                    Your new employees will be able to enter their own personal information, sign paperwork, see their team, and more.
                </Typography>
                <FormControlLabel
                    control={<Checkbox size="small" sx={{ color: '#ccc', p: 0.5, '&.Mui-checked': { color: '#3c763d' } }} />}
                    label={<Typography variant="caption" sx={{ color: '#666', ml: 0.5, fontFamily: "'Outfit', sans-serif" }}>Send this new employee a new hire packet</Typography>}
                    sx={{ ml: 0 }}
                />
            </Paper>

            <PersonalSection
                employee_number={formData.employee_number}
                first_name={formData.first_name}
                middle_name={formData.middle_name}
                last_name={formData.last_name}
                preferred_name={formData.preferred_name}
                birth_date={formData.birth_date}
                gender={formData.gender}
                marital_status={formData.marital_status}
                ssn={formData.ssn}
                onChange={handleChange}
            />
            <AddressSection
                address_street_1={formData.address_street_1}
                address_street_2={formData.address_street_2}
                address_city={formData.address_city}
                address_province={formData.address_province}
                address_postal_code={formData.address_postal_code}
                address_country={formData.address_country}
                onChange={handleChange}
            />
            <CompensationSection
                comp_effective_date={formData.comp_effective_date}
                overtime_status={formData.overtime_status}
                comp_change_reason={formData.comp_change_reason}
                comp_comment={formData.comp_comment}
                pay_schedule={formData.pay_schedule}
                pay_type={formData.pay_type}
                pay_rate={formData.pay_rate}
                pay_currency={formData.pay_currency}
                options={options}
                onChange={handleChange}
            />
            <ContactSection
                phone_work={formData.phone_work}
                phone_work_ext={formData.phone_work_ext}
                phone_mobile={formData.phone_mobile}
                home_phone={formData.home_phone}
                email={formData.email}
                home_email={formData.home_email}
                onChange={handleChange}
            />
            <JobSection
                hire_date={formData.hire_date}
                ethnicity={formData.ethnicity}
                onChange={handleChange}
            />
            <EmploymentStatusSection
                employment_status={formData.employment_status}
                options={options}
                onChange={handleChange}
            />
            <JobInfoSection
                job_title={formData.job_title}
                reports_to_id={formData.reports_to_id}
                department={formData.department}
                division={formData.division}
                location={formData.location}
                options={options}
                onChange={handleChange}
            />
            <AccessSection
                allow_access={formData.allow_access}
                onChange={handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pb: 8, mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                        bgcolor: '#3c763d', '&:hover': { bgcolor: '#2d5a2d' },
                        borderRadius: 2, textTransform: 'none', px: 4, py: 1, fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif"
                    }}
                >
                    {loading ? 'Saving...' : 'Save Employee'}
                </Button>
                <Button
                    variant="text"
                    onClick={handleBack}
                    disabled={loading}
                    sx={{ color: '#666', textTransform: 'none', fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}
                >
                    Cancel
                </Button>
            </Box>

            <Snackbar open={success} message="Employee created successfully!" autoHideDuration={2000} />
        </Box>
    );
}

const PersonalSection = memo(({ employee_number, first_name, middle_name, last_name, preferred_name, birth_date, gender, marital_status, ssn, onChange }) => (
    <FormSection title="Personal" icon={Person}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 2 }}>
                <Label>Employee #</Label>
                <StyledTextField name="employee_number" value={employee_number} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2 }}>
                <Label required>First Name</Label>
                <StyledTextField required name="first_name" value={first_name} onChange={onChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
                <Label>Middle Name</Label>
                <StyledTextField name="middle_name" value={middle_name} onChange={onChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
                <Label required>Last Name</Label>
                <StyledTextField required name="last_name" value={last_name} onChange={onChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Preferred Name</Label>
                <StyledTextField name="preferred_name" value={preferred_name} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Birth Date</Label>
                <StyledTextField type="date" name="birth_date" value={birth_date} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Gender</Label>
                <StyledSelect name="gender" value={gender || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </StyledSelect>
            </Grid>
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Marital Status</Label>
                <StyledSelect name="marital_status" value={marital_status || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2 }}>
                <Label>SSN</Label>
                <StyledTextField name="ssn" value={ssn} onChange={onChange} />
            </Grid>
        </Grid>
    </FormSection>
));

const AddressSection = memo(({ address_street_1, address_street_2, address_city, address_province, address_postal_code, address_country, onChange }) => (
    <FormSection title="Address" icon={Home}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label>Street 1</Label>
                <StyledTextField name="address_street_1" value={address_street_1} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label>Street 2</Label>
                <StyledTextField name="address_street_2" value={address_street_2} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>City</Label>
                <StyledTextField name="address_city" value={address_city} onChange={onChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Province</Label>
                <StyledTextField name="address_province" value={address_province} onChange={onChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Postal Code</Label>
                <StyledTextField name="address_postal_code" value={address_postal_code} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 4 }}>
                <Label>Country</Label>
                <StyledSelect name="address_country" value={address_country || 'Philippines'} onChange={onChange}>
                    <MenuItem value="Philippines">Philippines</MenuItem>
                    <MenuItem value="United States">United States</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                </StyledSelect>
            </Grid>
        </Grid>
    </FormSection>
));

const CompensationSection = memo(({ comp_effective_date, overtime_status, comp_change_reason, comp_comment, pay_schedule, pay_type, pay_rate, pay_currency, options, onChange }) => (
    <FormSection title="Compensation" icon={Payments}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3.5 }}>
                <Label required>Effective Date</Label>
                <StyledTextField type="date" name="comp_effective_date" value={comp_effective_date} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 3.5 }}>
                <Label>Overtime Status</Label>
                <StyledSelect name="overtime_status" value={overtime_status || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.overtime_status?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 3.5 }}>
                <Label>Change Reason</Label>
                <StyledSelect name="comp_change_reason" value={comp_change_reason || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.comp_change_reason?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 6.5 }}>
                <Label>Comment</Label>
                <StyledTextField multiline rows={3} name="comp_comment" value={comp_comment} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 3.5 }}>
                <Label>Pay Schedule</Label>
                <StyledSelect name="pay_schedule" value={pay_schedule || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.pay_schedule?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 3.5 }}>
                <Label>Pay Type</Label>
                <StyledSelect name="pay_type" value={pay_type || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Hourly">Hourly</MenuItem>
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 8 }}>
                <Label>Pay Rate</Label>
                <Stack direction="row" spacing={0} alignItems="center">
                    <TextField
                        size="small"
                        type="number"
                        name="pay_rate"
                        placeholder="Php"
                        value={pay_rate}
                        onChange={onChange}
                        sx={{
                            width: 250,
                            '& .MuiOutlinedInput-root': {
                                p: 0,
                                borderRadius: 2,
                                '& input': { p: '8.5px 14px' }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <Box sx={{
                                    height: '37px', bgcolor: '#f5f5f5', px: 1.5,
                                    display: 'flex', alignItems: 'center', borderRight: '1px solid #ddd',
                                    borderTopLeftRadius: 8, borderBottomLeftRadius: 8
                                }}>
                                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Php</Typography>
                                </Box>
                            ),
                            endAdornment: (
                                <Box sx={{
                                    height: '37px', bgcolor: '#f5f5f5', px: 1.5,
                                    display: 'flex', alignItems: 'center', borderLeft: '1px solid #ddd',
                                    borderTopRightRadius: 8, borderBottomRightRadius: 8
                                }}>
                                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>PHP</Typography>
                                </Box>
                            )
                        }}
                    />
                    <Typography variant="caption" sx={{ color: '#666', mx: 1.5, fontWeight: 600 }}>per</Typography>
                    <FormControl size="small" sx={{ width: 140 }}>
                        <Select value="Year" displayEmpty sx={{ borderRadius: 2 }}>
                            <MenuItem value="">-Select-</MenuItem>
                            <MenuItem value="Year">Year</MenuItem>
                            <MenuItem value="Month">Month</MenuItem>
                            <MenuItem value="Hour">Hour</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Grid>
        </Grid>
    </FormSection>
));

const ContactSection = memo(({ phone_work, phone_work_ext, phone_mobile, home_phone, email, home_email, onChange }) => (
    <FormSection title="Contact" icon={ContactPhone}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Work Phone</Label>
                <StyledTextField name="phone_work" value={phone_work} onChange={onChange} InputProps={{ startAdornment: <InputAdornment position="start"><Business sx={{ fontSize: 16, color: '#999' }} /></InputAdornment> }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 1.2 }}>
                <Label>Ext</Label>
                <StyledTextField name="phone_work_ext" value={phone_work_ext} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Mobile Phone</Label>
                <StyledTextField name="phone_mobile" value={phone_mobile} onChange={onChange} InputProps={{ startAdornment: <InputAdornment position="start"><Smartphone sx={{ fontSize: 16, color: '#999' }} /></InputAdornment> }} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 2.5 }}>
                <Label>Home Phone</Label>
                <StyledTextField name="home_phone" value={home_phone} onChange={onChange} InputProps={{ startAdornment: <InputAdornment position="start"><Home sx={{ fontSize: 16, color: '#999' }} /></InputAdornment> }} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 4.5 }}>
                <Label required>Work Email</Label>
                <StyledTextField required name="email" value={email} onChange={onChange} InputProps={{ startAdornment: <InputAdornment position="start"><Business sx={{ fontSize: 16, color: '#999' }} /></InputAdornment> }} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 4.5 }}>
                <Label>Home Email</Label>
                <StyledTextField name="home_email" value={home_email} onChange={onChange} InputProps={{ startAdornment: <InputAdornment position="start"><Home sx={{ fontSize: 16, color: '#999' }} /></InputAdornment> }} />
            </Grid>
        </Grid>
    </FormSection>
));

const JobSection = memo(({ hire_date, ethnicity, onChange }) => (
    <FormSection title="Job" icon={Work}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
                <Label>Hire Date</Label>
                <StyledTextField required type="date" name="hire_date" value={hire_date} onChange={onChange} />
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 3.5 }}>
                <Label>Ethnicity</Label>
                <StyledSelect name="ethnicity" value={ethnicity || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    <MenuItem value="Asian">Asian</MenuItem>
                    <MenuItem value="White">White</MenuItem>
                    <MenuItem value="Black">Black</MenuItem>
                    <MenuItem value="Hispanic">Hispanic</MenuItem>
                </StyledSelect>
            </Grid>
        </Grid>
    </FormSection>
));

const EmploymentStatusSection = memo(({ employment_status, options, onChange }) => (
    <FormSection title="Employment Status" icon={Work}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Label>Employment Status</Label>
                <StyledSelect name="employment_status" value={employment_status || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.employment_status?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
        </Grid>
    </FormSection>
));

const JobInfoSection = memo(({ job_title, reports_to_id, department, division, location, options, onChange }) => (
    <FormSection title="Job Information" icon={Badge}>
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label>Job Title</Label>
                <StyledSelect name="job_title" value={job_title || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.job_title?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label>Reports To</Label>
                <StyledSelect name="reports_to_id" value={reports_to_id || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.managers.map(mgr => <MenuItem key={mgr.id} value={mgr.id}>{mgr.name}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label required>Department</Label>
                <StyledSelect required name="department" value={department || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.department?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label required>Division</Label>
                <StyledSelect name="division" value={division || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.division?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
            <Grid size={12} />
            <Grid size={{ xs: 12, sm: 5 }}>
                <Label>Location</Label>
                <StyledSelect name="location" value={location || ''} onChange={onChange}>
                    <MenuItem value="">-Select-</MenuItem>
                    {options.fields.location?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </StyledSelect>
            </Grid>
        </Grid>
    </FormSection>
));

const AccessSection = memo(({ allow_access, onChange }) => (
    <FormSection title="Self-service access" icon={VpnKey}>
        <Stack direction="row" spacing={4}>
            <Box
                onClick={() => onChange({ target: { name: 'allow_access', value: true } })}
                sx={{
                    flex: 1, p: 3, cursor: 'pointer', border: '1px solid',
                    borderColor: allow_access ? '#3c763d' : '#f0f0f0',
                    bgcolor: allow_access ? '#f3f9f3' : '#fff',
                    borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2.5,
                    transition: 'all 0.2s',
                    '&:hover': { border: '1px solid #3c763d' }
                }}
            >
                <Box sx={{ p: 1.5, bgcolor: allow_access ? '#3c763d' : '#f5f5f5', borderRadius: 2, color: allow_access ? 'white' : '#999' }}>
                    <Person sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: allow_access ? '#3c763d' : '#333', fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif" }}>Allow Access to BambooHR</Typography>
                    <Typography variant="caption" sx={{ color: '#666', lineHeight: 1.4, display: 'block', fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}>They will be able to login to BambooHR using the access level you choose.</Typography>
                </Box>
            </Box>
            <Box
                onClick={() => onChange({ target: { name: 'allow_access', value: false } })}
                sx={{
                    flex: 1, p: 3, cursor: 'pointer', border: '1px solid',
                    borderColor: !allow_access ? '#3c763d' : '#f0f0f0',
                    bgcolor: !allow_access ? '#f3f9f3' : '#fff',
                    borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2.5,
                    transition: 'all 0.2s',
                    '&:hover': { border: '1px solid #3c763d' }
                }}
            >
                <Box sx={{ p: 1.5, bgcolor: !allow_access ? '#3c763d' : '#f5f5f5', borderRadius: 2, color: !allow_access ? 'white' : '#999' }}>
                    <VpnKey sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: !allow_access ? '#3c763d' : '#333', fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif" }}>No Access</Typography>
                    <Typography variant="caption" sx={{ color: '#666', lineHeight: 1.4, display: 'block', fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}>They won't have access and will not be able to login to BambooHR.</Typography>
                </Box>
            </Box>
        </Stack>
    </FormSection>
));
