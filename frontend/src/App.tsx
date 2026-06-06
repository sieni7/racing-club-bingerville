import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JoueursList from './pages/joueurs/JoueursList';
import JoueurForm from './pages/joueurs/JoueurForm';
import JoueurDetail from './pages/joueurs/JoueurDetail';
import MatchsList from './pages/matchs/MatchsList';
import MatchsCalendar from './pages/matchs/MatchsCalendar';
import MatchForm from './pages/matchs/MatchForm';
import MatchFeuille from './pages/matchs/MatchFeuille';
import StatistiquesPage from './pages/statistiques/StatistiquesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Joueurs */}
                <Route path="/joueurs" element={<JoueursList />} />
                <Route path="/joueurs/nouveau" element={<JoueurForm />} />
                <Route path="/joueurs/:id" element={<JoueurDetail />} />
                <Route path="/joueurs/:id/editer" element={<JoueurForm />} />
                
                {/* Matchs */}
                <Route path="/matchs" element={<MatchsList />} />
                <Route path="/matchs/calendrier" element={<MatchsCalendar />} />
                <Route path="/matchs/nouveau" element={<MatchForm />} />
                <Route path="/matchs/:id/editer" element={<MatchForm />} />
                <Route path="/matchs/:id/feuille" element={<MatchFeuille />} />
                
                {/* Statistiques */}
                <Route path="/statistiques" element={<StatistiquesPage />} />
                
                <Route path="/actualites" element={<div>Actualités - à venir</div>} />
              </Route>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
