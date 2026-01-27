import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plane, Clock, Hourglass, HelpCircle } from 'lucide-react';

const NewPolicyModal = ({ isOpen, onClose, onOpenManual }) => {
    const [selectedType, setSelectedType] = useState('accrues');

    if (!isOpen) return null;

    const handleOpenManual = () => {
        onClose();
        onOpenManual();
    };

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
                width: '540px',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.3s ease-out',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderBottom: '1px solid #f1f5f9'
                }}>
                    <h2 style={{
                        color: '#2d4a22', margin: 0, fontSize: '1.25rem',
                        fontWeight: '700', fontFamily: 'Outfit, sans-serif'
                    }}>
                        New Time Off Policy
                    </h2>
                    <button onClick={onClose} style={{
                        width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b'
                    }}>
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 32px', textAlign: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', color: '#2d4a22'
                    }}>
                        <Plane size={24} style={{ transform: 'rotate(-45deg)' }} />
                    </div>

                    <h3 style={{
                        fontSize: '1.35rem', fontWeight: '700', color: '#1e293b',
                        marginBottom: '6px', fontFamily: 'Outfit, sans-serif'
                    }}>
                        Let's get this show on the road
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
                        First off, what kind of policy will this be?
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {/* Traditional Accrual */}
                        <div
                            onClick={() => setSelectedType('accrues')}
                            style={{
                                padding: '16px', borderRadius: '16px', border: '2px solid',
                                borderColor: selectedType === 'accrues' ? '#2d4a22' : '#f1f5f9',
                                background: selectedType === 'accrues' ? 'rgba(45, 74, 34, 0.02)' : '#fff',
                                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease',
                                display: 'flex', gap: '16px', alignItems: 'flex-start'
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: selectedType === 'accrues' ? '#2d4a22' : '#f1f5f9',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: selectedType === 'accrues' ? '#fff' : '#64748b',
                                flexShrink: 0
                            }}>
                                <Clock size={16} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                                    It accrues time (traditional)
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                                    Time taken is deducted from a balance that accrues on a schedule.
                                </p>
                            </div>
                        </div>

                        {/* Flexible / Unlimited */}
                        <div
                            onClick={() => setSelectedType('flexible')}
                            style={{
                                padding: '16px', borderRadius: '16px', border: '2px solid',
                                borderColor: selectedType === 'flexible' ? '#2d4a22' : '#f1f5f9',
                                background: selectedType === 'flexible' ? 'rgba(45, 74, 34, 0.02)' : '#fff',
                                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease',
                                display: 'flex', gap: '16px', alignItems: 'flex-start'
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: selectedType === 'flexible' ? '#2d4a22' : '#f1f5f9',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: selectedType === 'flexible' ? '#fff' : '#64748b',
                                flexShrink: 0
                            }}>
                                <Hourglass size={16} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                                    It's flexible (unlimited)
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                                    There is no balance to deduct from, but requests are tracked.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#2d4a22', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                        <span onClick={handleOpenManual}>create a Manually Managed Policy</span>
                        <HelpCircle size={14} />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 32px', background: '#f8fafc', display: 'flex',
                    justifyContent: 'flex-end', alignItems: 'center', gap: '16px'
                }}>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: '#449d44',
                        fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                    <button style={{
                        background: '#2d4a22', color: '#fff', border: 'none',
                        padding: '10px 24px', borderRadius: '30px', fontWeight: '700',
                        fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45, 74, 34, 0.2)'
                    }}>
                        Create Policy
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default NewPolicyModal;
