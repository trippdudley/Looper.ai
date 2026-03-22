import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}

export default function Card({ children, className = '', onClick, glass }: CardProps) {
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:-translate-y-[1px] active:scale-[0.99] transition-all duration-150 ease-in-out'
    : '';

  const baseClasses = glass
    ? 'glass-card p-5'
    : 'bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-5';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
