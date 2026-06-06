import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { matchsService, Match } from '../features/matchs/matchsService';
import { actualitesService, Actualite } from '../features/actualites/actualitesService';
import { statistiquesService, StatJoueur } from '../features/statistiques/statistiquesService';
import { joueursService } from '../features/joueurs/joueursService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Trophy, Users, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [prochainMatch, setProchainMatch] = useState<Match | null>(null);
  const [dernierMatch, setDernierMatch] = useState<Match | null>(null);
  const [topButeurs, setTopButeurs] = useState<StatJoueur[]>([]);
  const [dernieresActus, setDernieresActus] = useState<Actualite[]>([]);
  const [joueursActifsCount, setJoueursActifsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchs, buteurs, actus, joueurs] = await Promise.all([
          matchsService.getAll(),
          statistiquesService.getTopButeurs(),
          actualitesService.getLatest(3),
          joueursService.getAll()
        ]);

        const aVenir = matchs.filter(m => m.statut === 'A_VENIR').sort((a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
        const termines = matchs.filter(m => m.statut === 'TERMINE').sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime());

        if (aVenir.length > 0) setProchainMatch(aVenir[0]);
        if (termines.length > 0) setDernierMatch(termines[0]);
        
        setTopButeurs(buteurs.slice(0, 3));
        setDernieresActus(actus);
        setJoueursActifsCount(joueurs.filter(j => j.statut === 'ACTIF').length);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="text-center py-10">Chargement du tableau de bord...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {user?.prenom} 👋</h1>
        <p className="text-gray-600 mt-2">Voici le résumé des activités du Racing Club de Bingerville.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI: Joueurs Actifs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Joueurs Actifs</p>
            <p className="text-2xl font-bold text-gray-900">{joueursActifsCount}</p>
          </div>
        </div>

        {/* Prochain Match */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-blue-500" />
            <h2 className="font-bold text-gray-900">Prochain Match</h2>
          </div>
          {prochainMatch ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{prochainMatch.lieu === 'DOMICILE' ? 'Racing CB' : prochainMatch.adversaire}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">VS</span>
                <span className="font-semibold text-lg">{prochainMatch.lieu === 'DOMICILE' ? prochainMatch.adversaire : 'Racing CB'}</span>
              </div>
              <div className="mt-4 text-sm text-gray-500 flex justify-between">
                <span>{format(new Date(prochainMatch.date_heure), 'dd MMMM yyyy HH:mm', { locale: fr })}</span>
                <span>{prochainMatch.competition}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucun match planifié</p>
          )}
        </div>

        {/* Dernier Résultat */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-yellow-500" />
            <h2 className="font-bold text-gray-900">Dernier Résultat</h2>
          </div>
          {dernierMatch ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">vs {dernierMatch.adversaire}</p>
              <div className="text-3xl font-black text-gray-800">
                {dernierMatch.score_equipe} - {dernierMatch.score_adversaire}
              </div>
              <p className="text-xs text-gray-500 mt-2">{format(new Date(dernierMatch.date_heure), 'dd/MM/yyyy')}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucun résultat</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dernières Actualités */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" />
              <h2 className="font-bold text-gray-900 text-lg">Dernières Actualités</h2>
            </div>
            <Link to="/actualites" className="text-sm text-blue-600 hover:underline">Tout voir</Link>
          </div>
          <div className="space-y-4">
            {dernieresActus.length > 0 ? dernieresActus.map(actu => (
              <div key={actu.id} className="border-b pb-4 last:border-0 last:pb-0">
                <Link to={`/actualites/${actu.slug}`} className="hover:text-blue-600 font-semibold block mb-1">
                  {actu.titre}
                </Link>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span>{format(new Date(actu.published_at!), 'dd MMM yyyy', { locale: fr })}</span>
                  {actu.statut === 'BROUILLON' && <span className="text-orange-500 bg-orange-100 px-2 rounded-full">Brouillon</span>}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">Aucune actualité publiée</p>
            )}
          </div>
        </div>

        {/* Top Buteurs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Top Buteurs</h2>
            <Link to="/statistiques" className="text-sm text-blue-600 hover:underline">Détails</Link>
          </div>
          <div className="space-y-4">
            {topButeurs.length > 0 ? topButeurs.map((buteur, index) => (
              <div key={buteur.joueur_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>
                    {index + 1}
                  </span>
                  <span className="font-medium">{buteur.prenom} {buteur.nom}</span>
                </div>
                <span className="font-bold text-blue-600">{buteur.buts} ⚽</span>
              </div>
            )) : (
              <p className="text-gray-500 italic">Aucun buteur</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
