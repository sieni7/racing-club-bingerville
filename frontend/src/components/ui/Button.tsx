import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'type'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = '',
  isLoading = false,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-gray-900 dark:text-white hover:bg-primary-dark focus:ring-primary shadow-glow',
    secondary: 'bg-background-card border border-white/10 text-gray-900 dark:text-white hover:bg-white/10 focus:ring-white/50',
    danger: 'bg-accent-danger text-gray-900 dark:text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-accent-success text-gray-900 dark:text-white hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      whileHover={!(disabled || isLoading) ? { scale: 1.05 } : {}}
      whileTap={!(disabled || isLoading) ? { scale: 0.95 } : {}}
      className={`
        px-6 py-2 rounded-lg font-geist font-semibold flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement...
        </>
      ) : children}
    </motion.button>
  );
};

