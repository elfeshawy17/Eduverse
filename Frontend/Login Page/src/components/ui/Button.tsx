import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'btn transition-all relative font-medium text-sm py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/30',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary/30',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300/30',
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${widthClasses}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
        ${className}
      `}
    >
      <span className="relative flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <span>{children}</span>
        )}
      </span>
    </button>
  );
};