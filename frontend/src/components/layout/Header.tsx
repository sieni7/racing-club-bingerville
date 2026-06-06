import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DarkModeToggle } from '../common/DarkModeToggle';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Racing Club Bingerville</Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/joueurs" className="hover:text-blue-200">Joueurs</Link>
              <Link to="/matchs" className="hover:text-blue-200">Matchs</Link>
              <Link to="/statistiques" className="hover:text-blue-200">Statistiques</Link>
              <Link to="/actualites" className="hover:text-blue-200">Actualités</Link>
            </nav>
            <DarkModeToggle />
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

          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-3 pb-4">
            <Link to="/dashboard" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/joueurs" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Joueurs</Link>
            <Link to="/matchs" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Matchs</Link>
            <Link to="/statistiques" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Statistiques</Link>
            <Link to="/actualites" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Actualités</Link>
            {user ? (
              <div className="flex flex-col space-y-3 pt-3 border-t border-blue-800">
                <span className="text-sm">{user.email}</span>
                <Button variant="secondary" onClick={handleLogout} className="w-full">Déconnexion</Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-3 border-t border-blue-800">
                <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="secondary" className="w-full">Connexion</Button></Link>
                <Link to="/register" onClick={() => setIsOpen(false)}><Button variant="primary" className="w-full">Inscription</Button></Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
