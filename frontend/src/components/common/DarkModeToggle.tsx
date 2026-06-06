import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button 
      onClick={() => setDark(!dark)} 
      className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-glow" 
      title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
