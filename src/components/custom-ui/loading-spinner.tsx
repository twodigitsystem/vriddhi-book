// src/components/custom-ui/loading-spinner.tsx
import { FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'sm',
  color = 'white',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div
      className={`${sizeClasses[size]} border-${color} border-t-transparent rounded-full animate-spin`}
    ></div>
  </div>
  );
};

export default LoadingSpinner;
