import React, { useState } from 'react';
import { ChevronLeft, Briefcase, CalendarClock, Users, ShieldPlus, Palmtree, PlusCircle, Info } from 'lucide-react';

const NewManualPolicy = ({ onCancel, onSave }) => {
    const [policyName, setPolicyName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: 'bereavement', label: 'Bereavement', icon: Briefcase, count: 2 },
        { id: 'comp', label: 'Comp/In Lieu Time', icon: Briefcase, count: 2 },
        { id: 'covid', label: 'COVID-19 Related...', icon: CalendarClock, count: 2 },
        { id: 'fmla', label: 'FMLA', icon: Users, count: 2 },
        { id: 'sick', label: 'Sick', icon: ShieldPlus, count: 3 },
        { id: 'vacation', label: 'Vacation', icon: Palmtree, count: 3 },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Header / Breadcrumb */}
            <div
                onClick={onCancel}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#64748b', fontSize: '0.9rem', cursor: 'pointer',
                    marginBottom: '16px'
                }}
            >
                <ChevronLeft size={16} />
                <span>Time Off</span>
            </div>

            <h1 style={{
                fontSize: '2rem', fontWeight: '700', color: '#2d4a22',
                marginBottom: '40px', fontFamily: 'Outfit, sans-serif'
            }}>
                New Manual Policy
            </h1>

            {/* Content Container */}
            <div className="glass-panel" style={{
                padding: '40px', background: '#fff', borderRadius: '24px',
                border: '1px solid #f1f5f9', marginBottom: '32px'
            }}>
                {/* Info Box */}
                <div style={{
                    padding: '20px 24px', background: '#f8fafc', borderRadius: '12px',
                    color: '#475569', fontSize: '0.95rem', lineHeight: '1.6',
                    marginBottom: '40px'
                }}>
                    Manual policies work best if you prefer to keep the time off balances for employees on this policy up to date by adjusting them manually. Keep in mind, this means employees won't accrue any time automatically.
                </div>

                {/* Form Group: Policy Name */}
                <div style={{ marginBottom: '40px', maxWidth: '400px' }}>
                    <label style={{
                        display: 'block', marginBottom: '12px', fontSize: '0.9rem',
                        fontWeight: '700', color: '#1e293b'
                    }}>
                        <span style={{ color: '#ef4444', marginRight: '4px' }}>●</span>
                        Policy Name*
                    </label>
                    <input
                        type="text"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                        placeholder="e.g. Salary Employees"
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                            border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem',
                            transition: 'all 0.2s ease', background: '#fff'
                        }}
                        className="form-input-focus"
                    />
                </div>

                {/* Category Selection */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>What category does this belong to?*</span>
                        <Info size={14} color="#94a3b8" />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    padding: '20px', borderRadius: '16px', border: '1.5px solid',
                                    borderColor: selectedCategory === cat.id ? '#2d4a22' : '#f1f5f9',
                                    background: selectedCategory === cat.id ? 'rgba(45, 74, 34, 0.02)' : '#fff',
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    display: 'flex', gap: '16px', alignItems: 'center'
                                }}
                            >
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: '#f8fafc', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#64748b'
                                }}>
                                    <cat.icon size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{cat.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{cat.count} Policies</div>
                                </div>
                            </div>
                        ))}

                        {/* New Category Option */}
                        <div style={{
                            padding: '20px', borderRadius: '16px', border: '1.5px solid #f1f5f9',
                            background: '#fff', cursor: 'pointer', display: 'flex', gap: '12px',
                            alignItems: 'center', color: '#2563eb'
                        }}>
                            <PlusCircle size={20} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>New Category</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button
                    onClick={() => onSave({ name: policyName, category: selectedCategory })}
                    style={{
                        background: '#2d4a22', color: '#fff', border: 'none',
                        padding: '12px 32px', borderRadius: '30px', fontWeight: '700',
                        fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45, 74, 34, 0.2)'
                    }}
                >
                    Save Policy
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        background: 'none', border: 'none', color: '#2563eb',
                        fontWeight: '700', fontSize: '1rem', cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewManualPolicy;
