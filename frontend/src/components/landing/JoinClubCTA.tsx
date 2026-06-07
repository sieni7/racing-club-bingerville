import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const JoinClubCTA = () => {
  return (
    <section className="py-24 bg-primary text-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.3000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <path d="M25 0l25 14.4v28.8L25 57.6 0 43.4V14.4z" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Prêt à porter nos couleurs ?</h2>
        <p className="text-xl md:text-2xl font-medium mb-10 opacity-90 max-w-2xl mx-auto">
          Inscrivez-vous dès maintenant pour la saison à venir et rejoignez l'élite du football amateur.
        </p>
        <Link 
          to="/register" 
          className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          S'inscrire maintenant
          <ArrowRight size={24} />
        </Link>
      </div>
    </section>
  );
};

