import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg">Bienvenue, <span className="font-semibold">{user?.email}</span> !</p>
        <p className="mt-4 text-gray-600">
          Ceci est votre espace personnel. Utilisez le menu de navigation pour gérer le club.
        </p>
      </div>
    </div>
  );
}
