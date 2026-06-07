import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, Newspaper, Layout, LogOut, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Sections Accueil', path: '/admin/homepage', icon: <Layout size={20} /> },
    { name: 'Actualités', path: '/admin/actualites', icon: <Newspaper size={20} /> },
    { name: 'Joueurs', path: '/admin/joueurs', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-900 dark:text-white">Admin RCB</span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:text-primary-light' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between md:justify-end">
          <Link to="/" className="md:hidden flex items-center gap-2 text-gray-600 hover:text-primary">
            <ArrowLeft size={20} />
            Retour au site
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft size={16} />
              Retour au site
            </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
