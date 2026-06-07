import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Newspaper, Users, Home, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/homepage',  label: "Page d'accueil", icon: Home },
  { to: '/admin/actualites', label: 'Actualités', icon: Newspaper },
  { to: '/admin/joueurs',   label: 'Joueurs', icon: Users },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-primary text-white font-medium'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
  }`;

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-md flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-lg font-bold text-primary">Racing Club</h1>
          <p className="text-xs text-gray-400 mt-0.5">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
