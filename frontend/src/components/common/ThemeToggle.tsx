import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun size={20} className="text-yellow-500" />;
    if (theme === 'dark') return <Moon size={20} className="text-blue-400" />;
    return <Monitor size={20} className="text-gray-400" />;
  };

  const getLabel = () => {
    if (theme === 'light') return 'Thème clair';
    if (theme === 'dark') return 'Thème sombre';
    return 'Thème système';
  };

  return (
    <>
      <motion.button
        onClick={cycleTheme}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md shadow-glass group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Changer le thème"
        data-tooltip-id="theme-tooltip"
        data-tooltip-content={getLabel()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute"
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
        
        {/* Badge visuel indicateur */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background-card bg-primary-light hidden group-hover:block transition-all" />
      </motion.button>
      <Tooltip id="theme-tooltip" place="bottom" className="z-50 !bg-gray-800 !text-white !rounded-lg" />
    </>
  );
};

