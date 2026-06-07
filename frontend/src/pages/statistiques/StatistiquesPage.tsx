import { useEffect, useState } from 'react';
import { StatJoueur, statistiquesService } from '../../features/statistiques/statistiquesService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Trophy, Activity, Target, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatistiquesPage() {
  const [buteurs, setButeurs] = useState<StatJoueur[]>([]);
  const [passeurs, setPasseurs] = useState<StatJoueur[]>([]);
  const [discipline, setDiscipline] = useState<StatJoueur[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statistiquesService.getTopButeurs(),
      statistiquesService.getTopPasseurs(),
      statistiquesService.getTopDiscipline()
    ]).then(([b, p, d]) => {
      setButeurs(b);
      setPasseurs(p);
      setDiscipline(d);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  if (isLoading) return <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  const buteursData = buteurs.slice(0, 5).map(b => ({
    name: b.nom,
    Buts: b.buts,
    Passes: b.passes_decisives,
  }));

  const topPlayer = buteurs[0];
  const radarData = topPlayer ? [
    { subject: 'Buteur', A: topPlayer.buts * 10, fullMark: 100 },
    { subject: 'Passeur', A: topPlayer.passes_decisives * 15, fullMark: 100 },
    { subject: 'Matchs', A: topPlayer.matchs_joues * 5, fullMark: 100 },
    { subject: 'Discipline', A: 100 - (topPlayer.cartons_jaunes * 10 + topPlayer.cartons_rouges * 20), fullMark: 100 },
    { subject: 'Efficacité', A: (topPlayer.buts + topPlayer.passes_decisives) * 8, fullMark: 100 },
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Performance & Data</h1>
        <p className="text-content-muted mt-1">Analyse détaillée de l'équipe et des joueurs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Radar Chart (Hero Stats) */}
        <Card className="p-6 lg:col-span-1 bg-gradient-to-b from-background-card to-background border-primary/20">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Profil MVP: {topPlayer ? `${topPlayer.prenom} ${topPlayer.nom}` : 'N/A'}
          </h2>
          <div className="h-64 w-full">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Performance" dataKey="A" stroke="#0B5FFF" fill="#0B5FFF" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-content-muted">Données insuffisantes</div>
            )}
          </div>
        </Card>

        {/* Buteurs vs Passes BarChart */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-success" />
            Impact Offensif (Top 5)
          </h2>
          <div className="h-64 w-full">
            {buteursData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buteursData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748B" tick={{ fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#1A1F2E', borderColor: '#ffffff10', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Buts" fill="#0B5FFF" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Passes" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-content-muted">Aucune donnée</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-0 overflow-hidden border border-white/5">
          <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-secondary" /> Top Buteurs
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {buteurs.slice(0,5).map((b, index) => (
              <div key={b.joueur_id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-content-muted font-bold">{index + 1}</span>
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{b.prenom} {b.nom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary-light">{b.buts}</span>
                  <span className="text-xs text-content-muted">buts</span>
                </div>
              </div>
            ))}
            {buteurs.length === 0 && <p className="text-content-muted text-sm text-center">Aucun buteur</p>}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden border border-white/5">
          <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-secondary" /> Top Passeurs
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {passeurs.slice(0,5).map((p, index) => (
              <div key={p.joueur_id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-content-muted font-bold">{index + 1}</span>
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-accent-success transition-colors">{p.prenom} {p.nom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent-success">{p.passes_decisives}</span>
                  <span className="text-xs text-content-muted">passes</span>
                </div>
              </div>
            ))}
            {passeurs.length === 0 && <p className="text-content-muted text-sm text-center">Aucun passeur</p>}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden border border-white/5">
          <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent-danger" /> Discipline
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {discipline.slice(0,5).map(d => (
              <div key={d.joueur_id} className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{d.prenom} {d.nom}</span>
                <div className="flex items-center gap-3">
                  {d.cartons_jaunes > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-4 bg-accent-warning rounded-sm" />
                      <span className="font-bold text-gray-900 dark:text-white">{d.cartons_jaunes}</span>
                    </div>
                  )}
                  {d.cartons_rouges > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-4 bg-accent-danger rounded-sm" />
                      <span className="font-bold text-gray-900 dark:text-white">{d.cartons_rouges}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {discipline.length === 0 && <p className="text-content-muted text-sm text-center">Aucun avertissement</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
