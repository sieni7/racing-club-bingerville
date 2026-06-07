import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Newspaper, Users, Home, LogOut, CalendarDays, Settings, ShieldAlert, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const memberNavItems = [
  { to: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { to: '/matchs', label: 'Matchs', icon: CalendarDays },
  { to: '/joueurs', label: 'Effectif', icon: Users },
  { to: '/statistiques', label: 'Statistiques', icon: FileText },
  { to: '/parametres', label: 'Paramètres', icon: Settings },
];

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard Admin', icon: ShieldAlert },
  { to: '/admin/homepage', label: 'Page d\'accueil', icon: Home },
  { to: '/admin/actualites', label: 'Actualités', icon: Newspaper },
  { to: '/admin/joueurs', label: 'Gestion Joueurs', icon: Users },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-primary text-white font-medium'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
  }`;

export const MemberLayout = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-sm border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-primary-dark transition-colors">
              R
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Racing Club</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Espace Membre</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Menu Membre */}
          <div>
            <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Menu Principal
            </p>
            <nav className="space-y-1">
              {memberNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClass}>
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Menu Administration */}
          {isAdmin && (
            <div>
              <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Administration
              </p>
              <nav className="space-y-1">
                {adminNavItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navClass}>
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
            Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded-lg"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto h-screen bg-gray-50 dark:bg-gray-950">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

