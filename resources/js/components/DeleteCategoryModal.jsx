import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2 } from 'lucide-react';

const DeleteCategoryModal = ({ isOpen, onClose, category, onDelete }) => {
    const [confirmText, setConfirmText] = useState('');

    if (!isOpen) return null;

    const isDeleteEnabled = confirmText.toLowerCase() === 'delete';

    const handleDelete = () => {
        if (isDeleteEnabled) {
            onDelete(category);
            setConfirmText('');
            onClose();
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onClose();
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
                        Delete Time Off Category
                    </h2>
                    <button onClick={handleClose} style={{
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
                    padding: '40px 32px',
                    textAlign: 'center'
                }}>
                    {/* Icon */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#dc2626'
                    }}>
                        <Trash2 size={40} strokeWidth={1.5} />
                    </div>

                    {/* Message */}
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '32px',
                        lineHeight: '1.5'
                    }}>
                        Are you sure you want to delete the '{category?.title}' time off category?
                    </h3>

                    {/* Confirmation Box */}
                    <div style={{
                        background: '#f8fafc',
                        padding: '24px',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <p style={{
                            fontSize: '0.95rem',
                            color: '#64748b',
                            marginBottom: '16px'
                        }}>
                            Type <span style={{ color: '#dc2626', fontWeight: '700' }}>"Delete"</span> to continue
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder=""
                            style={{
                                width: '200px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '0.95rem',
                                textAlign: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            className="form-input-focus"
                        />
                    </div>
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
                        onClick={handleClose}
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
                        onClick={handleDelete}
                        disabled={!isDeleteEnabled}
                        style={{
                            background: isDeleteEnabled ? '#dc2626' : '#e5e7eb',
                            color: isDeleteEnabled ? '#fff' : '#9ca3af',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '30px',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: isDeleteEnabled ? 'pointer' : 'not-allowed',
                            boxShadow: isDeleteEnabled ? '0 4px 12px rgba(220, 38, 38, 0.2)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Delete Time Off Category
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default DeleteCategoryModal;
