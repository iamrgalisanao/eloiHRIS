import React, { useState } from 'react';

const TimeOffCalculatorModal = ({ isOpen, onClose, userName, jobTitle }) => {
    const [category, setCategory] = useState('Vacation');
    const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isOpen) return null;

    // Simulation settings
    const currentBalance = 29.65;
    const accrualRate = 6.00; // 6 hours bi-weekly
    const lastAccrualDate = new Date('2026-01-07');

    // Calculation Logic
    const targetDate = new Date(asOfDate);
    const today = new Date();
    const isFuture = targetDate > today;

    const accrualDetails = [];
    let projectedBalance = currentBalance;

    if (isFuture) {
        let iterDate = new Date(lastAccrualDate);
        iterDate.setDate(iterDate.getDate() + 14);

        while (iterDate <= targetDate) {
            projectedBalance += accrualRate;
            accrualDetails.push({
                date: iterDate.toLocaleDateString(),
                action: `Scheduled Accrual`,
                hours: `+${accrualRate.toFixed(2)}`,
                balance: projectedBalance.toFixed(2)
            });
            iterDate.setDate(iterDate.getDate() + 14);
        }
    }

    const displayDetails = [...accrualDetails].reverse();

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
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
                    <h2 className="font-heading" style={{ color: '#2d4a22', margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>Calculate Time Off</h2>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div style={{ padding: '32px' }}>
                    {/* User Profile Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '12px', background: '#94a3b8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
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

                    {/* Simulation Controls */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Time Off Category</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                        outline: 'none', appearance: 'none', background: '#fff', fontSize: '1rem', color: '#1e293b',
                                        background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right 16px center/16px'
                                    }}
                                >
                                    <option>Vacation</option>
                                    <option>Sick Leave</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>As of Date*</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="date"
                                    value={asOfDate}
                                    onChange={(e) => setAsOfDate(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                        outline: 'none', fontSize: '1rem', color: '#1e293b'
                                    }}
                                />
                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Banner */}
                    <div style={{
                        padding: '40px 32px', borderRadius: '16px', border: '1px solid #e2e8f0',
                        background: '#fff', marginBottom: '32px'
                    }}>
                        <div className="font-heading" style={{ fontSize: '3.6rem', fontWeight: '800', color: '#2d4a22', letterSpacing: '-2px', lineHeight: '1' }}>
                            {projectedBalance.toFixed(2)} <span style={{ fontSize: '2.5rem' }}>hours</span>
                        </div>
                    </div>

                    {/* Detail Table */}
                    <div
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b',
                            cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginBottom: '20px',
                            userSelect: 'none'
                        }}
                    >
                        <div style={{
                            width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'
                        }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        Accrual Details
                    </div>

                    {isExpanded && (
                        <div style={{
                            maxHeight: '260px', overflowY: 'auto', border: '1px solid #f1f5f9',
                            borderRadius: '12px', background: '#fff'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead style={{ background: '#f8fafc', color: '#64748b', position: 'sticky', top: 0, zIndex: 10 }}>
                                    <tr>
                                        <th style={{ padding: '12px 20px', fontWeight: '700' }}>Date</th>
                                        <th style={{ padding: '12px 20px', fontWeight: '700' }}>Description</th>
                                        <th style={{ padding: '12px 20px', fontWeight: '700', textAlign: 'right' }}>Hours</th>
                                        <th style={{ padding: '12px 20px', fontWeight: '700', textAlign: 'right' }}>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayDetails.length > 0 ? displayDetails.map((row, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px 20px', color: '#1e293b', fontWeight: '600' }}>{row.date}</td>
                                            <td style={{ padding: '16px 20px', color: '#64748b' }}>{row.action}</td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right', color: '#059669', fontWeight: '700' }}>{row.hours}</td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right', color: '#1e293b', fontWeight: '700' }}>{row.balance}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                                No projected changes before this date.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '24px 32px', background: '#f8fafc', display: 'flex',
                    justifyContent: 'flex-end', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
                }}>
                    <button onClick={onClose} style={{
                        padding: '12px 48px', borderRadius: '30px', border: 'none',
                        background: '#2d4a22', color: '#fff', fontWeight: '700', fontSize: '1rem',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeOffCalculatorModal;
