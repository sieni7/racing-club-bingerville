import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = true }: CardProps) => {
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl shadow-soft
      ${hover ? 'transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-1' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
