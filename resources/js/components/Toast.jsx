import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, isVisible, onClose, duration = 4000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    const toastContent = (
        <div style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            animation: 'slideDown 0.3s ease-out'
        }}>
            <div style={{
                background: '#2d4a22',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '400px',
                maxWidth: '600px'
            }}>
                <CheckCircle size={20} style={{ flexShrink: 0 }} />
                <span style={{
                    flex: 1,
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    lineHeight: '1.4'
                }}>
                    {message}
                </span>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.8
                    }}
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );

    return createPortal(toastContent, document.body);
};

export default Toast;
