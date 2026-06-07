import { useEffect, useState } from 'react';
import { statistiquesService, StatJoueur } from '../../features/statistiques/statistiquesService';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopScorersSection = () => {
  const [buteurs, setButeurs] = useState<StatJoueur[]>([]);

  useEffect(() => {
    const fetchButeurs = async () => {
      const data = await statistiquesService.getTopButeurs();
      setButeurs(data.slice(0, 5));
    };
    fetchButeurs();
  }, []);

  if (buteurs.length === 0) return null;

  return (
    <section className="py-24 bg-background dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm flex items-center justify-center gap-2">
            <Trophy size={16} /> Élite
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">Meilleurs Buteurs</h2>
        </motion.div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-[2rem] p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />
          
          <div className="space-y-4">
            {buteurs.map((buteur, index) => (
              <motion.div 
                key={buteur.joueur_id} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="group flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-750/30 hover:bg-white dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md cursor-default"
              >
                <div className="flex items-center gap-5 md:gap-6">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-xl shadow-inner transition-colors duration-300 ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-yellow-500/30' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-400/30' :
                    index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-orange-500/30' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  }`}>
                    {index === 0 ? <Medal size={28} /> : index + 1}
                  </div>
                  <div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white block group-hover:text-primary transition-colors">{buteur.prenom} {buteur.nom}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Attaquant</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-primary/30 transition-colors">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">{buteur.buts}</span>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Buts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
