import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const NextMatchCard = () => {
  const [nextMatch, setNextMatch] = useState<any>(null);

  useEffect(() => {
    const fetchNextMatch = async () => {
      const { data } = await supabase
        .from('matchs')
        .select('*')
        .eq('statut', 'A_VENIR')
        .order('date_heure', { ascending: true })
        .limit(1);
      
      if (data && data.length > 0) {
        setNextMatch(data[0]);
      }
    };
    
    fetchNextMatch();
  }, []);

  if (!nextMatch) return null;

  return (
    <section className="py-20 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Le choc à venir</span>
          <h2 className="text-4xl font-black mt-2 text-gray-900 dark:text-white">Prochain Match</h2>
        </div>
        
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-gray-800 dark:to-secondary/20 rounded-3xl p-8 md:p-12 shadow-glass border border-white/20 dark:border-white/5 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="text-center flex-1">
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-soft mb-4 overflow-hidden border-4 border-gray-50">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white">RCB</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Racing Club Bingerville</h3>
            </div>
            
            <div className="text-center flex-col items-center justify-center hidden md:flex">
              <span className="bg-primary text-gray-900 dark:text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-2">{nextMatch.competition}</span>
              <span className="text-4xl font-black text-gray-400 opacity-50">VS</span>
            </div>

            <div className="text-center md:hidden w-full">
              <span className="text-3xl font-black text-gray-400 opacity-50">VS</span>
            </div>
            
            <div className="text-center flex-1">
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-soft mb-4 border-4 border-gray-50">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white">ADV</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{nextMatch.adversaire}</h3>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-content-muted bg-white/50 dark:bg-black/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary"><Calendar size={20} /></div>
              <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{format(new Date(nextMatch.date_heure), 'EEEE d MMMM yyyy', { locale: fr })}</span>
            </div>
            {format(new Date(nextMatch.date_heure), 'HH:mm') !== '00:00' && (
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded-lg text-secondary"><Clock size={20} /></div>
                <span className="font-medium text-gray-900 dark:text-gray-200">{format(new Date(nextMatch.date_heure), 'HH:mm')}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg text-gray-600 dark:text-gray-300"><MapPin size={20} /></div>
              <span className="font-medium text-gray-900 dark:text-gray-200">{nextMatch.lieu === 'DOMICILE' ? 'Stade Municipal, Bingerville' : 'À l\'extérieur'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
