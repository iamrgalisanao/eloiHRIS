import React, { useState } from 'react';

const TimeOffCalculatorModal = ({ isOpen, onClose, userName, jobTitle }) => {
    const [category, setCategory] = useState('Vacation');
    const [asOfDate, setAsOfDate] = useState('2026-01-26');
    const [isExpanded, setIsExpanded] = useState(true);

    if (!isOpen) return null;

    const accrualData = [
        { date: '01/21/2026', action: 'Accrual for 01/07/2026 to 01/20/2026', hours: '6.00', balance: '29.65' },
        { date: '01/17/2026', action: 'Balance adjusted', hours: '50.00', balance: '23.65' },
        { date: '01/14/2026', action: 'Time off used for 01/14/2026 to 01/15/2026', hours: '-24.00', balance: '-26.35' },
        { date: '01/13/2026', action: 'Time off used for 01/13/2026 to 01/17/2026', hours: '-32.00', balance: '-2.35' },
        { date: '01/07/2026', action: 'Accrual for 12/22/2025 to 01/06/2026', hours: '6.00', balance: '29.65' },
    ];

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
            <div className="modal-content" style={{
                background: '#fff', borderRadius: '16px', width: '700px', maxWidth: '95%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 className="font-heading" style={{ margin: 0, color: '#2d4a22', fontSize: '1.5rem', fontWeight: '700' }}>Calculate Time Off</h2>
                    <button onClick={onClose} style={{
                        border: '1px solid #e2e8f0', background: '#fff', borderRadius: '50%', width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b'
                    }}>✕</button>
                </div>

                <div style={{ padding: '32px' }}>
                    {/* User Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '12px', background: '#94a3b8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem'
                        }}>👤</div>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{userName}</div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{jobTitle}</div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '32px' }}></div>

                    {/* Form Controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Time Off Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                    outline: 'none', appearance: 'none', background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 16px center/16px'
                                }}
                            >
                                <option>Vacation</option>
                                <option>Sick</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>As of Date*</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="date"
                                    value={asOfDate}
                                    onChange={(e) => setAsOfDate(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Balance Banner */}
                    <div style={{
                        padding: '24px 32px', borderRadius: '12px', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', marginBottom: '32px'
                    }}>
                        <span className="font-heading" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d4a22' }}>
                            29.65 hours
                        </span>
                    </div>

                    {/* Accrual Details Accordion */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #2d4a22',
                            color: '#2d4a22', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600',
                            fontSize: '0.85rem', marginBottom: '16px'
                        }}
                    >
                        <span style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>▼</span>
                        Accrual Details
                    </button>

                    {isExpanded && (
                        <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead style={{ background: '#f8fafc', color: '#64748b' }}>
                                    <tr>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date ↓</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>Action</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Hours</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accrualData.map((row, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '14px 16px', color: '#1e293b' }}>{row.date}</td>
                                            <td style={{ padding: '14px 16px', color: '#475569' }}>{row.action}</td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right', color: '#1e293b' }}>{row.hours}</td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right', color: '#1e293b', fontWeight: '600' }}>{row.balance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '24px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{
                        background: '#2d4a22', color: '#fff', border: 'none', padding: '10px 32px',
                        borderRadius: '24px', fontWeight: '700', cursor: 'pointer'
                    }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeOffCalculatorModal;
