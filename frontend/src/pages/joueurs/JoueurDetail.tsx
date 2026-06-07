import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Joueur, joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../../components/ui/Button';
import { Edit, ArrowLeft } from 'lucide-react';

export default function JoueurDetail() {
  const { id } = useParams<{ id: string }>();
  const [joueur, setJoueur] = useState<Joueur | null>(null);

  useEffect(() => {
    if (id) {
      joueursService.getById(id).then(setJoueur);
    }
  }, [id]);

  if (!joueur) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/joueurs" className="text-blue-600 flex items-center mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-1" /> Retour à la liste
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-50 flex flex-col items-center p-8 border-r">
          {joueur.photo_url ? (
            <img src={joueur.photo_url} alt="" className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white" />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center shadow-lg border-4 border-white">
              <span className="text-4xl text-gray-400">{joueur.prenom[0]}{joueur.nom[0]}</span>
            </div>
          )}
          <h2 className="text-2xl font-bold mt-4">{joueur.prenom} {joueur.nom}</h2>
          <p className="text-gray-500">{joueur.poste}</p>
          <div className="mt-2 text-3xl font-black text-blue-900">N° {joueur.numero}</div>
        </div>
        
        <div className="md:w-2/3 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Informations personnelles</h3>
            <Link to={`/joueurs/${joueur.id}/editer`}>
              <Button variant="secondary" className="flex items-center gap-2"><Edit size={16} /> Éditer</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="font-medium">{joueur.date_naissance || 'Non renseignée'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationalité</p>
              <p className="font-medium">{joueur.nationalite || 'Non renseignée'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taille</p>
              <p className="font-medium">{joueur.taille ? `${joueur.taille} cm` : 'Non renseignée'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Poids</p>
              <p className="font-medium">{joueur.poids ? `${joueur.poids} kg` : 'Non renseignée'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${joueur.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {joueur.statut}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

