import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const HeaderPublic = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';
  
  const isAppMode = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/parametres') || location.pathname.includes('/nouveau') || location.pathname.includes('/editer');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Racing Club Bingerville
          </Link>

          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/matchs" className="hover:text-primary transition">Matchs</Link>
            <Link to="/statistiques" className="hover:text-primary transition">Statistiques</Link>
            <Link to="/actualites" className="hover:text-primary transition">Actualités</Link>
            
            {user ? (
              <>
                <ThemeToggle />
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white leading-none">{profile?.first_name || user.email?.split('@')[0]}</span>
                    <span className="text-xs text-primary">{isAdmin ? 'Administrateur' : 'Membre'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-full border border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => navigate('/')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isAppMode ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      Site Public
                    </button>
                    <button 
                      onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isAppMode ? 'bg-primary text-white shadow-glow shadow-primary/30' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}
                    >
                      <LayoutDashboard size={14} /> Mon Espace
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login"><Button variant="secondary">Connexion</Button></Link>
                <Link to="/register"><Button variant="primary">Inscription</Button></Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
