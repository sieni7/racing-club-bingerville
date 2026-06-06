import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Racing Club Bingerville</Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/joueurs" className="hover:text-blue-200">Joueurs</Link>
          <Link to="/matchs" className="hover:text-blue-200">Matchs</Link>
          <Link to="/statistiques" className="hover:text-blue-200">Statistiques</Link>
          <Link to="/actualites" className="hover:text-blue-200">Actualités</Link>
        </nav>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user.email}</span>
            <Button variant="secondary" onClick={handleLogout}>Déconnexion</Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login"><Button variant="secondary">Connexion</Button></Link>
            <Link to="/register"><Button variant="primary">Inscription</Button></Link>
          </div>
        )}
      </div>
    </header>
  );
};
