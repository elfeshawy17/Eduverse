import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoDismiss = false,
  dismissTime = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, dismissTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, isVisible, onClose]);

  if (!isVisible) return null;

  const alertClasses = {
    success: 'bg-secondary/10 text-secondary border-secondary/20',
    error: 'bg-error/10 text-error border-error/20',
    info: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };

  const alertIcons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
  };

  return (
    <div 
      className={`flex items-start p-4 mb-4 rounded-md border animate-slide-in-right ${alertClasses[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{alertIcons[type]}</div>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="ml-3 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};