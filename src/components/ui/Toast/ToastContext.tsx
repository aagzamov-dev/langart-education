'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, x: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`toast toast-${toast.type}`}
                        >
                            <div className="toast-icon">
                                {toast.type === 'success' && <FaCheckCircle />}
                                {toast.type === 'error' && <FaExclamationCircle />}
                                {toast.type === 'info' && <FaInfoCircle />}
                            </div>
                            <div className="toast-message">{toast.message}</div>
                            <button className="toast-close" onClick={() => removeToast(toast.id)}>
                                <FaTimes />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <style jsx global>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }

        .toast {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          max-width: 400px;
          pointer-events: auto;
          overflow: hidden;
          position: relative;
        }

        .toast::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
        }

        .toast-success::before {
          background-color: #1ec28e;
        }

        .toast-error::before {
          background-color: #ff4d4f;
        }

        .toast-info::before {
          background-color: #15c1fa;
        }

        .toast-icon {
          font-size: 20px;
          display: flex;
          align-items: center;
        }

        .toast-success .toast-icon {
          color: #1ec28e;
        }

        .toast-error .toast-icon {
          color: #ff4d4f;
        }

        .toast-info .toast-icon {
          color: #15c1fa;
        }

        .toast-message {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .toast-close {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .toast-close:hover {
          color: #333;
        }
      `}</style>
        </ToastContext.Provider>
    );
};
