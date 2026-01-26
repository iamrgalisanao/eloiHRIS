import React, { useState } from 'react';

const IconCalendar = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const TimeOffRequestModal = ({ isOpen, onClose, onRefresh, employee }) => {
    const [formData, setFormData] = useState({
        leave_type: 'Vacation',
        start_date: '',
        end_date: '',
        amount: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        fetch('/api/time-off/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            body: JSON.stringify({
                ...formData,
                total_hours: formData.amount,
            })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to submit request');
                return data;
            })
            .then(() => {
                onRefresh();
                onClose();
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

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
                    <h2 className="font-heading" style={{ color: '#2d4a22', margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>Record Time Off</h2>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b', transition: 'all 0.2s'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
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
                                    {employee?.name || 'mel galisanao'}
                                </div>
                                <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
                                    {employee?.job_title || 'Sr. HR Administrator'}
                                </div>
                            </div>
                        </div>

                        {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #fee2e2' }}>{error}</div>}

                        {/* Date Selection */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>From*</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="date"
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                            fontSize: '1rem', outline: 'none', color: '#1e293b'
                                        }}
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        required
                                    />
                                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                        <IconCalendar size={18} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ color: '#cbd5e1', fontSize: '1.5rem', marginBottom: '10px' }}>–</div>

                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>To*</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="date"
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                            fontSize: '1rem', outline: 'none', color: '#1e293b'
                                        }}
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        required
                                    />
                                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                        <IconCalendar size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Time Off Category*</label>
                            <select
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                    fontSize: '1rem', outline: 'none', color: '#1e293b', appearance: 'none',
                                    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right 16px center/16px'
                                }}
                                value={formData.leave_type}
                                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                            >
                                <option>Vacation</option>
                                <option>Sick Leave</option>
                                <option>Bereavement</option>
                                <option>FMLA</option>
                            </select>
                        </div>

                        {/* Amount Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Amount*</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="number"
                                    placeholder="0"
                                    style={{
                                        width: '120px', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                        fontSize: '1rem', outline: 'none', color: '#1e293b', background: '#f8fafc'
                                    }}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                                <span style={{ fontSize: '1rem', color: '#64748b' }}>hours</span>
                            </div>
                        </div>

                        {/* Note area */}
                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Note</label>
                            <textarea
                                style={{
                                    width: '100%', minHeight: '120px', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                    fontSize: '1rem', outline: 'none', color: '#1e293b', resize: 'vertical'
                                }}
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '24px 32px', background: '#f8fafc', display: 'flex',
                        justifyContent: 'flex-end', alignItems: 'center', gap: '16px',
                        borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px'
                    }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '10px 20px', border: 'none', background: 'transparent',
                            color: '#2563eb', fontWeight: '700', fontSize: '1rem', cursor: 'pointer'
                        }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{
                            padding: '12px 40px', borderRadius: '30px', border: 'none',
                            background: '#2d4a22', color: '#fff', fontWeight: '700', fontSize: '1rem',
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(45, 74, 34, 0.2)'
                        }}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimeOffRequestModal;
