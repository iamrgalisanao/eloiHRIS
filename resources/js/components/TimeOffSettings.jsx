import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Stack,
    Menu,
    MenuItem,
    Paper,
    Avatar
} from '@mui/material';
import {
    Settings,
    BeachAccess,
    ShieldOutlined,
    WorkOutlined,
    PeopleOutlined,
    AddCircleOutlined,
    Add,
    VisibilityOffOutlined,
    MoreVert,
    CalendarToday
} from '@mui/icons-material';
import NewPolicyModal from './NewPolicyModal';
import NewManualPolicy from './NewManualPolicy';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import Toast from './Toast';

const TimeOffSettings = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isNewPolicyModalOpen, setIsNewPolicyModalOpen] = useState(false);
    const [isManualView, setIsManualView] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [disabledCategories, setDisabledCategories] = useState([]);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletedCategories, setDeletedCategories] = useState([]);

    if (isManualView) {
        return (
            <NewManualPolicy
                onCancel={() => setIsManualView(false)}
                onSave={() => setIsManualView(false)}
            />
        );
    }

    const navigation = [
        { id: 'Overview', label: 'Overview', type: 'tab', icon: <Settings /> },
        { id: 'Bereavement', label: 'Bereavement', type: 'category', icon: <WorkOutlined />, policies: ['Bereavement Manual Policy (0)', 'Bereavement Flexible Policy (89)'] },
        { id: 'CompInLieu', label: 'Comp/In Lieu Time', type: 'category', icon: <WorkOutlined />, policies: ['Comp/In Lieu Time Manual Policy (0)', 'Comp/In Lieu Time Flexible Policy (89)'] },
        { id: 'COVID19', label: 'COVID-19 Related Absence', type: 'category', icon: <CalendarToday />, policies: ['COVID-19 Related Absence Manual Policy (0)', 'COVID-19 Related Absence Flexible Policy (89)'] },
        { id: 'FMLA', label: 'FMLA', type: 'category', icon: <PeopleOutlined />, policies: ['FMLA Manual Policy (0)', 'FMLA Flexible Policy (89)'] },
        { id: 'Sick', label: 'Sick', type: 'category', icon: <ShieldOutlined />, policies: ['Sick Manual Policy (0)', 'Sick Flexible Policy (63)', 'Sick Full-Time (26)'] },
        { id: 'Vacation', label: 'Vacation', type: 'category', icon: <BeachAccess />, policies: ['Vacation Manual Policy (0)', 'Vacation Flexible Policy (63)', 'Vacation Full-Time (26)'] },
    ];

    const overviewCards = [
        { title: 'Vacation', stats: '3 policies · 89 people', icon: <BeachAccess sx={{ fontSize: 32 }} /> },
        { title: 'Sick', stats: '3 policies · 89 people', icon: <ShieldOutlined sx={{ fontSize: 32 }} /> },
        { title: 'Bereavement', stats: '2 policies · 89 people', icon: <WorkOutlined sx={{ fontSize: 32 }} /> },
        { title: 'COVID-19 Related Absence', stats: '2 policies · 89 people', icon: <CalendarToday sx={{ fontSize: 32 }} /> },
        { title: 'Comp/In Lieu Time', stats: '2 policies · 89 people', icon: <WorkOutlined sx={{ fontSize: 32 }} /> },
        { title: 'FMLA', stats: '2 policies · 89 people', icon: <PeopleOutlined sx={{ fontSize: 32 }} /> },
    ];

    const handleMenuOpen = (event, index, category) => {
        setAnchorEl(event.currentTarget);
        setActiveMenuIndex(index);
        setSelectedCategory(category);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveMenuIndex(null);
    };

    const handleDeleteCategory = (category) => {
        setDeletedCategories([...deletedCategories, category.title]);
        setToastMessage(`${category.title} was deleted successfully.`);
        setIsToastVisible(true);
        handleMenuClose();
    };

    const visibleCards = overviewCards.filter(card => !deletedCategories.includes(card.title));

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                Time Off
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={6}>
                {/* Left Navigation */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <List sx={{ p: 0 }}>
                        {navigation.map((item) => (
                            <Box key={item.id} sx={{ mb: 3 }}>
                                {item.type === 'tab' ? (
                                    <ListItemButton
                                        selected={activeTab === item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            '&.Mui-selected': {
                                                bgcolor: 'action.selected',
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight: activeTab === item.id ? 700 : 500,
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </ListItemButton>
                                ) : (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, mb: 1.5 }}>
                                            <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                                                {item.icon}
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ ml: 6 }}>
                                            {item.policies.map((policy, idx) => (
                                                <Typography
                                                    key={idx}
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        py: 0.5,
                                                        cursor: 'pointer',
                                                        '&:hover': { color: 'primary.main' }
                                                    }}
                                                >
                                                    {policy}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </List>
                </Grid>

                {/* Right Content */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {activeTab === 'Overview' ? (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    Overview
                                </Typography>
                                <IconButton size="small" variant="outlined" sx={{ border: '1px solid #e2e8f0' }}>
                                    <Settings fontSize="small" color="action" />
                                </IconButton>
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => setIsNewPolicyModalOpen(true)}
                                sx={{
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 3,
                                    mb: 4,
                                    color: 'primary.main',
                                    borderColor: 'primary.main',
                                    '&:hover': { borderColor: 'primary.dark', bgcolor: 'primary.light', color: 'white' }
                                }}
                            >
                                New Policy
                            </Button>

                            <Grid container spacing={3}>
                                {visibleCards.map((card, i) => (
                                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                                        <Card sx={{
                                            borderRadius: 4,
                                            border: '1px solid #f1f5f9',
                                            boxShadow: 'none',
                                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                                            transition: 'box-shadow 0.2s',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <CardContent sx={{ p: 3, flex: 1 }}>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        bgcolor: '#f8fafc',
                                                        color: disabledCategories.includes(card.title) ? 'text.disabled' : 'primary.main',
                                                        mb: 2,
                                                        borderRadius: 3
                                                    }}
                                                >
                                                    {disabledCategories.includes(card.title) ? <VisibilityOffOutlined /> : card.icon}
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                    {card.title}
                                                    {disabledCategories.includes(card.title) && (
                                                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
                                                            · Disabled
                                                        </Typography>
                                                    )}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                    {card.stats}
                                                </Typography>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            if (disabledCategories.includes(card.title)) {
                                                                setDisabledCategories(disabledCategories.filter(c => c !== card.title));
                                                                setToastMessage(`${card.title} is now enabled.`);
                                                                setIsToastVisible(true);
                                                            }
                                                        }}
                                                        sx={{
                                                            borderRadius: 2,
                                                            fontWeight: 600,
                                                            color: 'primary.main',
                                                            borderColor: 'primary.main',
                                                            px: 2
                                                        }}
                                                    >
                                                        {disabledCategories.includes(card.title) ? 'Enable Category' : 'Add Policy'}
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={(e) => handleMenuOpen(e, i, card)}
                                                        sx={{
                                                            minWidth: 0,
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 2,
                                                            color: activeMenuIndex === i ? 'primary.main' : 'text.secondary',
                                                            borderColor: activeMenuIndex === i ? 'primary.main' : '#e2e8f0'
                                                        }}
                                                    >
                                                        <Settings fontSize="inherit" />
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* New Category Card */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Box sx={{
                                        height: '100%',
                                        p: 3,
                                        borderRadius: 4,
                                        border: '2px dashed #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        gap: 2,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#f8fafc', borderColor: 'primary.main' }
                                    }}>
                                        <Avatar sx={{ bgcolor: '#f8fafc', color: 'primary.main' }}>
                                            <AddCircleOutlined />
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            New Category
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                            <Typography variant="body1">
                                Content for {activeTab} is under construction.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Sub-menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 180, p: 0.5 } }}
            >
                <MenuItem onClick={() => { setIsEditCategoryModalOpen(true); handleMenuClose(); }}>
                    Edit Category
                </MenuItem>
                <MenuItem onClick={() => {
                    setDisabledCategories([...disabledCategories, selectedCategory?.title]);
                    setToastMessage(`${selectedCategory?.title} is now disabled.`);
                    setIsToastVisible(true);
                    handleMenuClose();
                }}>
                    Disable Category
                </MenuItem>
                <MenuItem sx={{ color: 'error.main' }} onClick={() => { setIsDeleteModalOpen(true); handleMenuClose(); }}>
                    Delete Category
                </MenuItem>
            </Menu>

            {/* Modals */}
            <NewPolicyModal
                isOpen={isNewPolicyModalOpen}
                onClose={() => setIsNewPolicyModalOpen(false)}
                onOpenManual={() => setIsManualView(true)}
            />

            <EditCategoryModal
                isOpen={isEditCategoryModalOpen}
                onClose={() => setIsEditCategoryModalOpen(false)}
                category={selectedCategory}
            />

            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                category={selectedCategory}
                onDelete={handleDeleteCategory}
            />

            <Toast
                message={toastMessage}
                isVisible={isToastVisible}
                onClose={() => setIsToastVisible(false)}
            />
        </Box>
    );
};

export default TimeOffSettings;
