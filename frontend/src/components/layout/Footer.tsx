import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Info Club */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                <span className="text-gray-900 font-bold text-sm">RCB</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Racing Club<br/><span className="text-primary text-sm uppercase">Bingerville</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Le Racing Club de Bingerville, l'excellence par la passion. Formateur de talents depuis 1998.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-gray-900 transition-colors font-bold text-xs">
                FB
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-gray-900 transition-colors font-bold text-xs">
                IG
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-gray-900 transition-colors font-bold text-xs">
                X
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Navigation
            </h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"><ChevronRight size={14} /> Accueil</Link></li>
              <li><Link to="/actualites" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"><ChevronRight size={14} /> Actualités</Link></li>
              <li><Link to="/matchs" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"><ChevronRight size={14} /> Calendrier</Link></li>
              <li><Link to="/statistiques" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"><ChevronRight size={14} /> Statistiques</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"><ChevronRight size={14} /> Espace Membre</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Stade Municipal de Bingerville,<br/>Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+225 01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                <span>contact@rcbingerville.ci</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Restez informé de nos derniers résultats et actualités.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-light text-gray-900 font-bold py-3 rounded-lg transition-colors text-sm"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Racing Club de Bingerville. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-primary transition-colors">Mentions légales</Link>
            <Link to="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
