import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = true, ...props }: CardProps) => {
  return (
    <motion.div
      {...(hover ? { whileHover: { y: -5, transition: { duration: 0.2 } } } : {})}
      className={`
        bg-background-card/80 backdrop-blur-md border border-white/10 rounded-xl
        ${hover ? 'hover:shadow-glow' : 'shadow-glass'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
