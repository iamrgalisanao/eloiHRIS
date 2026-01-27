import React, { useState } from 'react';
import { X, User, Info } from 'lucide-react';

const AccrualStartDateModal = ({ isOpen, onClose, userName, jobTitle }) => {
    const [startDate, setStartDate] = useState('2022-10-29');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000
        }}>
            <div className="modal-content" style={{
                background: '#fff', borderRadius: '24px', width: '750px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden', animation: 'modalSlideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 32px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 className="font-heading" style={{ color: '#2d4a22', margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>Accrual Level Start Date</h2>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b'
                    }}>
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div style={{ padding: '32px' }}>
                    {/* User Profile Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '12px', background: '#94a3b8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                        }}>
                            <User size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.2' }}>
                                {userName || 'mel galisanao'}
                            </div>
                            <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
                                {jobTitle || 'Sr. HR Administrator'}
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '32px' }}></div>

                    {/* Note Box */}
                    <div style={{
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '32px'
                    }}>
                        <div style={{ color: '#0369a1', marginTop: '2px' }}>
                            <Info size={24} />
                        </div>
                        <div style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.6' }}>
                            <span style={{ fontWeight: '700' }}>Note:</span> If your policy allows for employees to earn at different rates based on their length of service, you can manipulate the rate this employee is eligible for by adjusting the Accrual Start Date below.
                        </div>
                    </div>

                    {/* Form Controls */}
                    <div style={{ width: '250px' }}>
                        <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>Accrual Level Start Date*</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                    outline: 'none', fontSize: '1rem', color: '#1e293b'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '24px 32px', background: '#f8fafc', display: 'flex',
                    justifyContent: 'flex-end', alignItems: 'center', gap: '24px',
                    borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
                }}>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: 'none', color: '#2563eb',
                        fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                    <button onClick={onClose} style={{
                        padding: '12px 48px', borderRadius: '30px', border: 'none',
                        background: '#2d4a22', color: '#fff', fontWeight: '700', fontSize: '1.1rem',
                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(45, 74, 34, 0.2)'
                    }}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccrualStartDateModal;
