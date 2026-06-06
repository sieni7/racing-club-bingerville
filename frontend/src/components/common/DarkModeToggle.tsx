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
    <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors">
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
