import { motion } from 'framer-motion';

const valeurs = [
  { title: 'Discipline', description: 'Respect des règles et de l\'institution', icon: '📋' },
  { title: 'Respect', description: 'Des adversaires, arbitres et partenaires', icon: '🤝' },
  { title: 'Travail', description: 'L\'excellence par l\'effort quotidien', icon: '💪' },
  { title: 'Excellence', description: 'La performance au service du collectif', icon: '⭐' },
];

export const ClubSection = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Histoire */}
          <div>
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Notre Histoire</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-6">Le Racing Club</h2>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Fondé en 1998, le Racing Club de Bingerville est un club de football amateur
              qui forme les jeunes talents de la région depuis plus de 25 ans.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Notre mission : promouvoir les valeurs du sport, du respect et du travail
              tout en offrant un cadre d'excellence pour l'épanouissement des jeunes joueurs.
              De nombreux professionnels sont passés par notre centre de formation.
            </p>
            
            {/* Palmarès */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Palmarès
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><span className="text-xl">🥇</span> <strong>Champion Régional</strong> (2024)</li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><span className="text-xl">🏆</span> <strong>Coupe Locale</strong> (2023)</li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><span className="text-xl">🥈</span> <strong>Vice-Champion Régional</strong> (2022)</li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><span className="text-xl">🥉</span> <strong>3ème place Coupe Régionale</strong> (2021)</li>
              </ul>
            </div>
          </div>
          
          {/* Valeurs */}
          <div>
            <span className="text-secondary font-semibold tracking-wider uppercase text-sm">Notre ADN</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-8">Nos Valeurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {valeurs.map((valeur, idx) => (
                <motion.div
                  key={valeur.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform origin-left">{valeur.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{valeur.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{valeur.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
