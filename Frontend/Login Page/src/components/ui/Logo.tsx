import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  vertical?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', vertical = false }) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  const iconSizes = {
    small: 20,
    medium: 28,
    large: 40,
  };

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-2`}>
      <div className="text-primary">
        <BookOpen size={iconSizes[size]} strokeWidth={2} />
      </div>
      <div className={`font-bold ${sizeClasses[size]} text-primary`}>
        Eduverse
      </div>
    </div>
  );
};