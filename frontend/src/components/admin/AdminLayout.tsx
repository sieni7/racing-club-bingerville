import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Newspaper, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLayout = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, exact: true },
    { name: 'Sections Accueil', path: '/admin/homepage', icon: <Layout size={18} /> },
    { name: 'Actualités', path: '/admin/actualites', icon: <Newspaper size={18} /> },
    { name: 'Joueurs', path: '/admin/joueurs', icon: <Users size={18} /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Centre d'Administration</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez le contenu, les utilisateurs et la configuration de la plateforme.</p>
      </div>

      {/* Admin Horizontal Navigation */}
      <nav className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide border-b border-gray-200 dark:border-gray-800">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-bold whitespace-nowrap transition-colors relative ${
                isActive 
                  ? 'text-primary dark:text-primary-light bg-primary/5' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon}
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="adminNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};
