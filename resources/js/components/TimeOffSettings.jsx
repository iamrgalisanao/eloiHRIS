import React, { useState } from 'react';
import { Settings, Palmtree, ShieldPlus, Briefcase, CalendarClock, Users, PlusCircle, Plus, EyeOff } from 'lucide-react';
import NewPolicyModal from './NewPolicyModal';
import NewManualPolicy from './NewManualPolicy';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import Toast from './Toast';

const TimeOffSettings = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isNewPolicyModalOpen, setIsNewPolicyModalOpen] = useState(false);
    const [isManualView, setIsManualView] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [disabledCategories, setDisabledCategories] = useState([]);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletedCategories, setDeletedCategories] = useState([]);

    // Close dropdown on click outside
    React.useEffect(() => {
        const h = () => setOpenDropdownIndex(null);
        window.addEventListener('click', h);
        return () => window.removeEventListener('click', h);
    }, []);

    if (isManualView) {
        return (
            <NewManualPolicy
                onCancel={() => setIsManualView(false)}
                onSave={() => setIsManualView(false)}
            />
        );
    }

    const navigation = [
        { id: 'Overview', label: 'Overview', type: 'tab' },
        { id: 'Bereavement', label: 'Bereavement', type: 'category', icon: Briefcase, policies: ['Bereavement Manual Policy (0)', 'Bereavement Flexible Policy (89)'] },
        { id: 'CompInLieu', label: 'Comp/In Lieu Time', type: 'category', icon: Briefcase, policies: ['Comp/In Lieu Time Manual Policy (0)', 'Comp/In Lieu Time Flexible Policy (89)'] },
        { id: 'COVID19', label: 'COVID-19 Related Absence', type: 'category', icon: CalendarClock, policies: ['COVID-19 Related Absence Manual Policy (0)', 'COVID-19 Related Absence Flexible Policy (89)'] },
        { id: 'FMLA', label: 'FMLA', type: 'category', icon: Users, policies: ['FMLA Manual Policy (0)', 'FMLA Flexible Policy (89)'] },
        { id: 'Sick', label: 'Sick', type: 'category', icon: ShieldPlus, policies: ['Sick Manual Policy (0)', 'Sick Flexible Policy (63)', 'Sick Full-Time (26)'] },
        { id: 'Vacation', label: 'Vacation', type: 'category', icon: Palmtree, policies: ['Vacation Manual Policy (0)', 'Vacation Flexible Policy (63)', 'Vacation Full-Time (26)'] },
    ];

    const overviewCards = [
        { title: 'Vacation', stats: '3 policies · 89 people', icon: Palmtree },
        { title: 'Sick', stats: '3 policies · 89 people', icon: ShieldPlus },
        { title: 'Bereavement', stats: '2 policies · 89 people', icon: Briefcase },
        { title: 'COVID-19 Related Absence', stats: '2 policies · 89 people', icon: CalendarClock },
        { title: 'Comp/In Lieu Time', stats: '2 policies · 89 people', icon: Briefcase },
        { title: 'FMLA', stats: '2 policies · 89 people', icon: Users },
    ];

    const handleDeleteCategory = (category) => {
        setDeletedCategories([...deletedCategories, category.title]);
        setToastMessage(`${category.title} was deleted successfully.`);
        setIsToastVisible(true);
    };

    // Filter out deleted categories
    const visibleCards = overviewCards.filter(card => !deletedCategories.includes(card.title));

    return (
        <div style={{ padding: '0px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d4a22', marginBottom: '24px' }}>Time Off</h1>
            <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 -32px 32px -32px' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'stretch', flex: 1 }}>
                {/* Left Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {navigation.map((item) => (
                        <div key={item.id}>
                            {item.type === 'tab' ? (
                                <div
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                                        background: activeTab === item.id ? '#f3f4f6' : 'transparent',
                                        fontWeight: activeTab === item.id ? '600' : '400',
                                        fontSize: '0.95rem', color: '#111827'
                                    }}
                                >
                                    {item.label}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', color: '#111827', padding: '0 16px' }}>
                                        <item.icon size={18} strokeWidth={2.5} />
                                        {item.label}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '40px' }}>
                                        {item.policies.map((policy, idx) => (
                                            <div key={idx} style={{
                                                padding: '6px 0', fontSize: '0.85rem', color: '#6b7280',
                                                cursor: 'pointer', hover: { color: '#111827' }
                                            }}>
                                                {policy}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Content Area */}
                <div>
                    {activeTab === 'Overview' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d4a22', margin: 0 }}>Overview</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '24px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                                    <Settings size={16} color="#6b7280" />
                                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>▼</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsNewPolicyModalOpen(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', border: '1px solid #10b981',
                                    background: '#fff', color: '#10b981', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '32px'
                                }}
                            >
                                <Plus size={18} /> New Policy
                            </button>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                {visibleCards.map((card, i) => (
                                    <div key={i} className="glass-panel" style={{
                                        padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6',
                                        background: '#fff', position: 'relative',
                                        zIndex: openDropdownIndex === i ? 20 : 1
                                    }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: disabledCategories.includes(card.title) ? '#64748b' : '#10b981', marginBottom: '16px' }}>
                                            {disabledCategories.includes(card.title) ? (
                                                <EyeOff size={32} strokeWidth={1.5} />
                                            ) : (
                                                <card.icon size={32} strokeWidth={1.5} />
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                                            {card.title}
                                            {disabledCategories.includes(card.title) && (
                                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '400', marginLeft: '8px' }}>
                                                    · Disabled
                                                </span>
                                            )}
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>{card.stats}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                                            <button
                                                onClick={() => {
                                                    if (disabledCategories.includes(card.title)) {
                                                        setDisabledCategories(disabledCategories.filter(c => c !== card.title));
                                                        setToastMessage(`${card.title} is now enabled.`);
                                                        setIsToastVisible(true);
                                                    }
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #10b981',
                                                    background: '#fff',
                                                    color: '#10b981',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {disabledCategories.includes(card.title) ? 'Enable Category' : 'Add Policy'}
                                            </button>
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownIndex(openDropdownIndex === i ? null : i);
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px',
                                                    borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer',
                                                    borderColor: openDropdownIndex === i ? '#10b981' : '#e5e7eb'
                                                }}
                                            >
                                                <Settings size={14} color={openDropdownIndex === i ? "#10b981" : "#64748b"} />
                                                <span style={{ fontSize: '0.6rem', color: openDropdownIndex === i ? "#10b981" : '#6b7280' }}>▼</span>
                                            </div>

                                            {openDropdownIndex === i && (
                                                <div className="glass-panel" style={{
                                                    position: 'absolute', top: '100%', left: '0', marginTop: '8px',
                                                    width: '180px', background: '#fff', borderRadius: '12px',
                                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100,
                                                    border: '1px solid #f1f5f9', padding: '4px',
                                                    animation: 'fadeIn 0.2s ease-out'
                                                }}>
                                                    {[
                                                        {
                                                            label: 'Edit Category',
                                                            action: () => {
                                                                setSelectedCategory(card);
                                                                setIsEditCategoryModalOpen(true);
                                                            }
                                                        },
                                                        {
                                                            label: 'Disable Category',
                                                            action: () => {
                                                                setDisabledCategories([...disabledCategories, card.title]);
                                                                setToastMessage(`${card.title} is now disabled. Employees will no longer be able to see any policies in this category.`);
                                                                setIsToastVisible(true);
                                                            }
                                                        },
                                                        {
                                                            label: 'Delete Category',
                                                            action: () => {
                                                                setSelectedCategory(card);
                                                                setIsDeleteModalOpen(true);
                                                            }
                                                        }
                                                    ].map((opt, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                opt.action();
                                                                setOpenDropdownIndex(null);
                                                            }}
                                                            style={{
                                                                padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem',
                                                                color: '#334155', cursor: 'pointer',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            className="dropdown-item-hover"
                                                        >
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {/* New Category Card */}
                                <div className="glass-panel" style={{
                                    padding: '24px', borderRadius: '16px', border: '2px dashed #e2e8f0',
                                    background: 'transparent', display: 'flex', flexDirection: 'column',
                                    alignItems: 'flex-start', justifyContent: 'center', gap: '16px', cursor: 'pointer'
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                        <PlusCircle size={24} />
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>New Category</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab !== 'Overview' && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                            Content for {activeTab} is under construction.
                        </div>
                    )}
                </div>
            </div>

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
        </div>
    );
};

export default TimeOffSettings;
