import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-success" size={20} />,
    error: <XCircle className="text-error" size={20} />,
    warning: <AlertCircle className="text-primary" size={20} />,
  };

  const borderColors = {
    success: 'border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    error: 'border-error/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    warning: 'border-primary/30 shadow-[0_0_15px_rgba(255,106,0,0.1)]',
  };

  return (
    <div
      className={clsx(
        "flex items-start justify-between w-full max-w-sm p-4 mb-3 rounded-lg border bg-bg-panel transition-all duration-300 ease-in-out transform translate-y-0 opacity-100",
        borderColors[type]
      )}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="text-sm font-semibold text-text-primary">{message}</div>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-text-muted hover:text-white rounded-lg p-1.5 hover:bg-bg-input inline-flex h-8 w-8 transition-colors"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X size={18} />
      </button>
    </div>
  );
};
