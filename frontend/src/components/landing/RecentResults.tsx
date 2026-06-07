import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

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
    <section className="py-24 bg-gray-50/50 dark:bg-gray-800/20 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold tracking-wider uppercase text-sm">Performances</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">Derniers Résultats</h2>
        </motion.div>
        
        <div className="space-y-6">
          {results.map((match, idx) => (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01, translateY: -2 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300"
            >
              <div className="w-full md:w-auto md:flex-1 text-center md:text-left mb-2 md:mb-0">
                <Badge variant="secondary" className="mb-2 whitespace-nowrap">{match.competition}</Badge>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm capitalize">
                  {format(new Date(match.date_heure), 'EEEE dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              
              <div className="w-full flex items-center justify-between md:justify-center gap-2 md:gap-8 my-4 md:my-0 flex-1">
                <div className={`flex-1 text-right md:text-right ${match.lieu === 'DOMICILE' ? 'font-bold text-gray-900 dark:text-white text-lg md:text-2xl' : 'font-medium text-gray-500 dark:text-gray-400 text-sm md:text-xl'}`}>
                  {match.lieu === 'DOMICILE' ? 'Racing Club' : match.adversaire}
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-inner">
                  <span className={`text-2xl md:text-3xl font-black ${match.lieu === 'DOMICILE' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                    {match.lieu === 'DOMICILE' ? match.score_equipe : match.score_adversaire}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600 font-bold px-1">-</span>
                  <span className={`text-2xl md:text-3xl font-black ${match.lieu !== 'DOMICILE' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                    {match.lieu === 'DOMICILE' ? match.score_adversaire : match.score_equipe}
                  </span>
                </div>
                
                <div className={`flex-1 text-left md:text-left ${match.lieu !== 'DOMICILE' ? 'font-bold text-gray-900 dark:text-white text-lg md:text-2xl' : 'font-medium text-gray-500 dark:text-gray-400 text-sm md:text-xl'}`}>
                  {match.lieu === 'DOMICILE' ? match.adversaire : 'Racing Club'}
                </div>
              </div>
              
              <div className="w-full md:w-auto md:flex-1 text-center md:text-right mt-2 md:mt-0 flex justify-center md:justify-end">
                <Badge variant={(match.score_equipe || 0) > (match.score_adversaire || 0) ? 'success' : (match.score_equipe || 0) < (match.score_adversaire || 0) ? 'danger' : 'warning'} className="px-4 py-1.5 text-sm whitespace-nowrap shadow-sm">
                  {(match.score_equipe || 0) > (match.score_adversaire || 0) ? 'VICTOIRE' : (match.score_equipe || 0) < (match.score_adversaire || 0) ? 'DÉFAITE' : 'MATCH NUL'}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

