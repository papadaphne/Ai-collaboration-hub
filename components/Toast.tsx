import React from 'react';
import { useToast } from '../hooks/useToast';
import { SuccessIcon, ErrorIcon, CloseIcon } from './icons';

const toastConfig = {
  success: {
    icon: SuccessIcon,
    bgClass: 'bg-green-500/20 border-green-500/50',
    iconClass: 'text-green-400',
  },
  error: {
    icon: ErrorIcon,
    bgClass: 'bg-red-500/20 border-red-500/50',
    iconClass: 'text-red-400',
  },
};

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div className={`w-full max-w-sm rounded-lg shadow-lg p-4 border flex items-start gap-3 transition-all duration-300 animate-fade-in-right ${config.bgClass}`}>
      <div className={`flex-shrink-0 w-6 h-6 ${config.iconClass}`}>
        <Icon />
      </div>
      <div className="flex-1 text-sm text-brand-text-primary pr-4">
        {message}
      </div>
      <button onClick={onDismiss} className="text-brand-text-secondary hover:text-white transition-colors">
        <CloseIcon className="w-5 h-5" />
      </button>
      <style>{`
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
