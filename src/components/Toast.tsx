import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

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
  duration = 5000,
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
    success: <CheckCircle2 className="text-success" size={24} />,
    error: <XCircle className="text-error" size={24} />,
    warning: <AlertCircle className="text-primary" size={24} />,
  };

  const bgColors = {
    success: 'bg-white',
    error: 'bg-white',
    warning: 'bg-white',
  };

  const borderColors = {
    success: 'border-border border-l-success border-l-4',
    error: 'border-border border-l-error border-l-4',
    warning: 'border-border border-l-primary border-l-4',
  };

  return (
    <div
      className={`flex items-start justify-between w-full max-w-sm p-4 mb-4 rounded border-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 ${bgColors[type]} ${borderColors[type]}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="text-sm font-semibold text-black">{message}</div>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-muted hover:text-black rounded-lg focus:ring-2 focus:ring-black p-1.5 hover:bg-off-white inline-flex h-8 w-8 transition-colors"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X size={20} />
      </button>
    </div>
  );
};
