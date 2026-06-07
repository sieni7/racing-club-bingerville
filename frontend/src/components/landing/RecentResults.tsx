import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const RecentResults = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase
        .from('matchs')
        .select('*')
        .eq('statut', 'TERMINE')
        .order('date_heure', { ascending: false })
        .limit(3);
      
      if (data) setResults(data);
    };
    
    fetchResults();
  }, []);

  if (results.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold tracking-wider uppercase text-sm">Performances</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Derniers Résultats</h2>
        </div>
        
        <div className="space-y-4">
          {results.map((match) => (
            <div key={match.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-soft border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{match.competition}</span>
                <p className="text-gray-900 dark:text-gray-300 font-medium text-sm mt-1">{format(new Date(match.date_heure), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
              
              <div className="flex items-center gap-6 flex-2 justify-center">
                <span className={`text-xl font-bold ${match.lieu === 'DOMICILE' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  {match.lieu === 'DOMICILE' ? 'RCB' : match.adversaire}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-2xl font-black text-gray-900 dark:text-white">
                    {match.lieu === 'DOMICILE' ? match.score_equipe : match.score_adversaire}
                  </span>
                  <span className="text-gray-400 font-bold">-</span>
                  <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-2xl font-black text-gray-900 dark:text-white">
                    {match.lieu === 'DOMICILE' ? match.score_adversaire : match.score_equipe}
                  </span>
                </div>
                
                <span className={`text-xl font-bold ${match.lieu === 'EXTERIEUR' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  {match.lieu === 'EXTERIEUR' ? 'RCB' : match.adversaire}
                </span>
              </div>
              
              <div className="flex-1 text-center md:text-right mt-4 md:mt-0">
                <Badge variant={(match.score_equipe || 0) > (match.score_adversaire || 0) ? 'success' : (match.score_equipe || 0) < (match.score_adversaire || 0) ? 'danger' : 'warning'}>
                  {(match.score_equipe || 0) > (match.score_adversaire || 0) ? 'VICTOIRE' : (match.score_equipe || 0) < (match.score_adversaire || 0) ? 'DÉFAITE' : 'NUL'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
