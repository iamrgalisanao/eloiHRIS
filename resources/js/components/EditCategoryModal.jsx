import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

const EditCategoryModal = ({ isOpen, onClose, category }) => {
    const [categoryName, setCategoryName] = useState(category?.name || 'Vacation');
    const [isPublicVisible, setIsPublicVisible] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('🏝️');
    const [selectedColor, setSelectedColor] = useState('#2d4a22');
    const [policyType, setPolicyType] = useState('paid');
    const [trackingUnit, setTrackingUnit] = useState('hours');
    const [isTrackingDropdownOpen, setIsTrackingDropdownOpen] = useState(false);
    const [workHoursPerDay, setWorkHoursPerDay] = useState('8');

    if (!isOpen) return null;

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#fff',
                width: '580px',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.3s ease-out',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        color: '#2d4a22',
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        fontFamily: 'Outfit, sans-serif'
                    }}>
                        Edit {categoryName}
                    </h2>
                    <button onClick={onClose} style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748b'
                    }}>
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: '24px 32px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {/* Category Name */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            Category Name*
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease'
                            }}
                            className="form-input-focus"
                        />
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#64748b',
                            marginTop: '8px'
                        }}>
                            People will see this name when requesting time off for the policies in this Category.
                        </p>
                    </div>

                    {/* Public Visibility Checkbox */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={isPublicVisible}
                                onChange={(e) => setIsPublicVisible(e.target.checked)}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{
                                fontSize: '0.95rem',
                                color: '#1e293b'
                            }}>
                                Make this Category name publicly visible on the calendar
                            </span>
                        </label>
                    </div>

                    {/* Icon and Color */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '24px'
                    }}>
                        {/* Icon Selector */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>
                                Icon
                            </label>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: '#fff'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>{selectedIcon}</span>
                                <ChevronDown size={18} color="#64748b" />
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>
                                Calendar Color
                            </label>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: '#fff'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    background: selectedColor
                                }}></div>
                                <ChevronDown size={18} color="#64748b" />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        borderTop: '1px solid #f1f5f9',
                        margin: '24px 0'
                    }}></div>

                    {/* Policies Type */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '12px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            Policies in this Category are...
                        </label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setPolicyType('paid')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: policyType === 'paid' ? '#2d4a22' : '#f1f5f9',
                                    color: policyType === 'paid' ? '#fff' : '#64748b',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Paid
                            </button>
                            <button
                                onClick={() => setPolicyType('unpaid')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: policyType === 'unpaid' ? '#2d4a22' : '#f1f5f9',
                                    color: policyType === 'unpaid' ? '#fff' : '#64748b',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Unpaid
                            </button>
                        </div>
                    </div>

                    {/* Tracking Unit */}
                    <div style={{ position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            Track time in...
                        </label>
                        <div
                            onClick={() => setIsTrackingDropdownOpen(!isTrackingDropdownOpen)}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: '#fff'
                            }}
                        >
                            <span style={{
                                fontSize: '0.95rem',
                                color: '#1e293b',
                                textTransform: 'capitalize'
                            }}>
                                {trackingUnit}
                            </span>
                            <ChevronDown size={18} color="#64748b" />
                        </div>

                        {isTrackingDropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    marginTop: '4px',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    zIndex: 10,
                                    overflow: 'hidden',
                                    animation: 'fadeIn 0.2s ease-out'
                                }}
                            >
                                {['hours', 'days'].map((unit) => (
                                    <div
                                        key={unit}
                                        onClick={() => {
                                            setTrackingUnit(unit);
                                            setIsTrackingDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            color: trackingUnit === unit ? '#2d4a22' : '#1e293b',
                                            background: trackingUnit === unit ? '#f8fafc' : '#fff',
                                            fontWeight: trackingUnit === unit ? '600' : '400',
                                            textTransform: 'capitalize',
                                            transition: 'all 0.2s ease'
                                        }}
                                        className="dropdown-item-hover"
                                    >
                                        {unit}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Work Hours Per Day - Only shown when Days is selected */}
                    {trackingUnit === 'days' && (
                        <div style={{ marginTop: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>
                                How many work hours in a day?*
                            </label>
                            <input
                                type="number"
                                value={workHoursPerDay}
                                onChange={(e) => setWorkHoursPerDay(e.target.value)}
                                min="1"
                                max="24"
                                style={{
                                    width: '120px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease'
                                }}
                                className="form-input-focus"
                            />
                            <p style={{
                                fontSize: '0.85rem',
                                color: '#64748b',
                                marginTop: '8px'
                            }}>
                                Note: This will change all "{categoryName}" policies, requests, and historical data to be represented in days.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 32px',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '16px',
                    borderTop: '1px solid #f1f5f9'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            padding: '8px 16px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            background: '#2d4a22',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '30px',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(45, 74, 34, 0.2)'
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default EditCategoryModal;
