import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../features/api/authApi';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">Racing Club Bingerville</Link>
      </div>
      <nav>
        <ul className="flex space-x-4 items-center">
          <li><Link to="/" className="hover:text-blue-200">Accueil</Link></li>
          <li><Link to="/joueurs" className="hover:text-blue-200">Effectif</Link></li>
          <li><Link to="/calendrier" className="hover:text-blue-200">Matchs</Link></li>
          <li><Link to="/statistiques" className="hover:text-blue-200">Statistiques</Link></li>
          <li><Link to="/actualites" className="hover:text-blue-200">Actualités</Link></li>
          
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard" className="hover:text-blue-200 ml-4">Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-blue-200">Profil</Link></li>
              <li>
                <button onClick={handleLogout} className="hover:text-blue-200 font-bold bg-red-600 px-3 py-1 rounded ml-2">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-blue-200 ml-4 font-bold">Se connecter</Link></li>
              <li><Link to="/register" className="hover:text-blue-200 font-bold bg-blue-700 px-3 py-1 rounded">S'inscrire</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
