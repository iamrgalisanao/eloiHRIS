import React, { useState } from 'react';
import { X, User } from 'lucide-react';

const AdjustBalanceModal = ({ isOpen, onClose, category, employee, onRefresh }) => {
    const [formData, setFormData] = useState({
        adjustment_type: 'Manual Adjustment',
        amount: '',
        note: '',
        effective_date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // This would be a real API call in production
        // For now, we simulate the logic
        setTimeout(() => {
            setLoading(false);
            onRefresh();
            onClose();
        }, 800);
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000
        }}>
            <div className="modal-content" style={{
                background: '#fff', borderRadius: '24px', width: '500px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden', animation: 'modalSlideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 32px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 className="font-heading" style={{ color: '#2d4a22', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                        Adjust {category} Balance
                    </h2>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b'
                    }}>
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '32px' }}>
                        {/* Employee Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{employee?.name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{category} Balance</div>
                            </div>
                        </div>

                        {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Adjustment Amount*</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="number"
                                    placeholder="e.g. 5.5 or -8"
                                    step="0.01"
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                        fontSize: '1rem', outline: 'none', color: '#1e293b'
                                    }}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                                <span style={{ color: '#64748b', fontWeight: '500' }}>hours</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Use positive numbers to add, negative to subtract.</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Adjustment Type</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                        fontSize: '1rem', outline: 'none', color: '#1e293b', appearance: 'none',
                                        background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E") no-repeat right 16px center/16px'
                                    }}
                                    value={formData.adjustment_type}
                                    onChange={(e) => setFormData({ ...formData, adjustment_type: e.target.value })}
                                >
                                    <option>Manual Adjustment</option>
                                    <option>Carryover Balance</option>
                                    <option>Policy Change</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Note</label>
                            <textarea
                                style={{
                                    width: '100%', minHeight: '80px', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1',
                                    fontSize: '1rem', outline: 'none', color: '#1e293b', resize: 'vertical'
                                }}
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Why is this adjustment being made?"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '20px 32px', background: '#f8fafc', display: 'flex',
                        justifyContent: 'flex-end', gap: '12px'
                    }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '10px 24px', borderRadius: '30px', border: '1px solid #cbd5e1',
                            background: '#fff', color: '#64748b', fontWeight: '700', cursor: 'pointer'
                        }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{
                            padding: '10px 32px', borderRadius: '30px', border: 'none',
                            background: '#2d4a22', color: '#fff', fontWeight: '700', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(45, 74, 34, 0.2)'
                        }}>
                            {loading ? 'Adjusting...' : 'Adjust Balance'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdjustBalanceModal;
