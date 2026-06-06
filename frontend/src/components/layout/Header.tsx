import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, Users, Calendar, BarChart3, Newspaper, LogOut, HelpCircle } from 'lucide-react';
import { DarkModeToggle } from '../common/DarkModeToggle';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Joueurs', path: '/joueurs', icon: <Users size={18} /> },
    { name: 'Matchs', path: '/matchs', icon: <Calendar size={18} /> },
    { name: 'Statistiques', path: '/statistiques', icon: <BarChart3 size={18} /> },
    { name: 'Actualités', path: '/actualites', icon: <Newspaper size={18} /> },
    { name: 'Guide', path: '/guide', icon: <HelpCircle size={18} /> },
  ];

  return (
    <header className="bg-background-card/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">RC</div>
            <span className="hidden sm:block">Racing CB</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith(link.path) ? 'bg-white/10 text-white' : 'text-content-muted hover:bg-white/5 hover:text-white'}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <DarkModeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-medium text-content-muted bg-white/5 px-2 py-1 rounded">{user.email}</span>
                  <button onClick={handleLogout} className="text-content-muted hover:text-accent-danger transition-colors" title="Déconnexion">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link to="/login"><Button variant="secondary" className="px-4 py-2 text-sm">Connexion</Button></Link>
                  <Link to="/register"><Button className="px-4 py-2 text-sm">Inscription</Button></Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-content-muted hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-2 pb-4 pt-2 border-t border-white/5">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith(link.path) ? 'bg-primary/20 text-primary-light border border-primary/30' : 'text-content-muted hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-white/5">
                <span className="text-xs text-content-muted px-4">{user.email}</span>
                <Button variant="secondary" onClick={handleLogout} className="w-full justify-center flex items-center gap-2"><LogOut size={16} /> Déconnexion</Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-white/5">
                <Link to="/login" onClick={() => setIsOpen(false)}><Button variant="secondary" className="w-full justify-center">Connexion</Button></Link>
                <Link to="/register" onClick={() => setIsOpen(false)}><Button className="w-full justify-center">Inscription</Button></Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
