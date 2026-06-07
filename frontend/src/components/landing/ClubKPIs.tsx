import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface KPIData {
  joueurs: number;
  matchs: number;
  buts: number;
  trophees: number;
}

export const ClubKPIs = () => {
  const [kpis, setKpis] = useState<KPIData>({ joueurs: 0, matchs: 0, buts: 0, trophees: 4 });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    const fetchKPIs = async () => {
      // Compter les joueurs
      const { count: joueurs } = await supabase.from('joueurs').select('*', { count: 'exact', head: true });
      
      // Compter les matchs terminés
      const { count: matchs } = await supabase.from('matchs').select('*', { count: 'exact', head: true })
        .eq('statut', 'TERMINE');
      
      // Compter les buts
      const { count: buts } = await supabase.from('evenements_match').select('*', { count: 'exact', head: true })
        .eq('type_evenement', 'BUT');
      
      setKpis({
        joueurs: joueurs || 0,
        matchs: matchs || 0,
        buts: buts || 0,
        trophees: 4 // À connecter à une table palmarès plus tard
      });
    };
    
    fetchKPIs();
  }, []);

  const kpisList = [
    { label: 'Joueurs', value: kpis.joueurs, icon: '👥', suffix: '' },
    { label: 'Matchs Joués', value: kpis.matchs, icon: '⚽', suffix: '' },
    { label: 'Buts Marqués', value: kpis.buts, icon: '🎯', suffix: '' },
    { label: 'Trophées', value: kpis.trophees, icon: '🏆', suffix: '' },
  ];

  return (
    <section ref={ref} className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {kpisList.map((kpi) => (
            <div key={kpi.label} className="text-center">
              <div className="text-4xl mb-4">{kpi.icon}</div>
              <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                {inView ? <CountUp end={kpi.value} duration={2.5} separator=" " /> : 0}{kpi.suffix}
              </div>
              <div className="text-sm uppercase tracking-wider font-semibold text-content-muted mt-2">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
