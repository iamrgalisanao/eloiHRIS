import React, { useState } from 'react';

const TimeOffRequestModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        leave_type: 'Vacation',
        start_date: '',
        end_date: '',
        note: ''
    });
    const [dayBreakdown, setDayBreakdown] = useState([]); // Array of { date, hours }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            const breakdown = [];

            let current = new Date(start);
            while (current <= end) {
                // Skip weekends for default (Optional, but usually better for HRIS)
                const day = current.getDay();
                const isWeekend = (day === 6 || day === 0);

                breakdown.push({
                    dateString: current.toDateString(),
                    dateISO: current.toISOString().split('T')[0],
                    hours: isWeekend ? 0 : 8
                });
                current.setDate(current.getDate() + 1);
            }
            setDayBreakdown(breakdown);
        }
    }, [formData.start_date, formData.end_date]);

    if (!isOpen) return null;

    const totalHours = dayBreakdown.reduce((sum, day) => sum + parseFloat(day.hours || 0), 0);

    const handleHourChange = (index, value) => {
        const newBreakdown = [...dayBreakdown];
        newBreakdown[index].hours = value;
        setDayBreakdown(newBreakdown);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (totalHours === 0) {
            setError("Total hours must be greater than 0");
            return;
        }
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
                total_hours: totalHours,
                breakdown: dayBreakdown // Sending breakdown metadata too
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
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div className="modal-content glass-panel" style={{
                background: '#fff', padding: '40px', borderRadius: '24px', width: '450px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}>
                <h2 className="font-heading" style={{ marginBottom: '24px' }}>Request Time Off</h2>

                {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Leave Type</label>
                        <select
                            className="glass-input"
                            style={{ width: '100%' }}
                            value={formData.leave_type}
                            onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                        >
                            <option>Vacation</option>
                            <option>Sick Leave</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Start Date</label>
                            <input
                                type="date"
                                className="glass-input"
                                style={{ width: '100%' }}
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>End Date</label>
                            <input
                                type="date"
                                className="glass-input"
                                style={{ width: '100%' }}
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>Amount</label>
                        <div style={{ border: '1px solid var(--border-light)', borderRadius: '16px', overflow: 'hidden' }}>
                            {dayBreakdown.map((day, index) => (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', borderBottom: index < dayBreakdown.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    background: day.hours === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
                                }}>
                                    <span style={{ fontSize: '0.9rem', color: day.hours === 0 ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                        {day.dateString.split(' ').slice(0, 3).join(', ')}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="number"
                                            className="glass-input"
                                            style={{ width: '60px', padding: '6px 10px', textAlign: 'center' }}
                                            value={day.hours}
                                            onChange={(e) => handleHourChange(index, e.target.value)}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hours</span>
                                    </div>
                                </div>
                            ))}
                            <div style={{ padding: '16px', background: 'rgba(92, 184, 92, 0.05)', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total:</span>
                                <span>{totalHours.toFixed(2)} hours</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Note</label>
                        <textarea
                            className="glass-input"
                            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '12px 24px', borderRadius: '12px', border: '1px solid #ddd',
                            background: '#fff', cursor: 'pointer', fontWeight: '600'
                        }}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimeOffRequestModal;
