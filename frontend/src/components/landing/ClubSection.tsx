import { motion } from 'framer-motion';

export const ClubSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Histoire</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Texte histoire */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Le Racing Club</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Fondé en 1998, le Racing Club de Bingerville est un club de football amateur 
              qui forme les jeunes talents de la région depuis plus de 25 ans.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Notre mission : promouvoir les valeurs du sport, du respect et du travail 
              tout en offrant un cadre d'excellence pour l'épanouissement des jeunes joueurs.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              De nombreux professionnels sont passés par notre centre de formation et 
              portent aujourd'hui haut les couleurs du Racing sur les terrains d'Abidjan et d'ailleurs.
            </p>
          </div>

          {/* Image d'illustration */}
          <div className="rounded-2xl overflow-hidden shadow-soft">
            <img 
              src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop" 
              alt="Histoire du Racing Club" 
              className="w-full h-64 md:h-80 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
