import { useEffect, useState } from 'react';
import { statistiquesService, StatJoueur } from '../../features/statistiques/statistiquesService';
import { Trophy } from 'lucide-react';

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
    <section className="py-20 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Élite</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Meilleurs Buteurs</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="space-y-4">
            {buteurs.map((buteur, index) => (
              <div key={buteur.joueur_id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-400' :
                    index === 1 ? 'bg-gray-200 text-gray-600 border-2 border-gray-300' :
                    index === 2 ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' :
                    'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{buteur.prenom} {buteur.nom}</span>
                    <p className="text-xs text-gray-500">Attaquant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-primary">{buteur.buts}</span>
                  <Trophy size={16} className="text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
