import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const HeaderPublic = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

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
                  <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                    <Button variant="primary" className="flex items-center gap-2 shadow-glow">
                      <LayoutDashboard size={16} /> Mon Espace
                    </Button>
                  </Link>
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
