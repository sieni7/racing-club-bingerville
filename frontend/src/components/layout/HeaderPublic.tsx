import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
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
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-primary transition font-semibold text-primary">
                    Administration
                  </Link>
                )}
                <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
                <ThemeToggle />
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="secondary" onClick={handleLogout}>Déconnexion</Button>
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
