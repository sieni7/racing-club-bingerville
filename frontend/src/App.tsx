import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const JoueursList = lazy(() => import('./pages/joueurs/JoueursList'));
const JoueurForm = lazy(() => import('./pages/joueurs/JoueurForm'));
const JoueurDetail = lazy(() => import('./pages/joueurs/JoueurDetail'));

const MatchsList = lazy(() => import('./pages/matchs/MatchsList'));
const MatchsCalendar = lazy(() => import('./pages/matchs/MatchsCalendar'));
const MatchForm = lazy(() => import('./pages/matchs/MatchForm'));
const MatchFeuille = lazy(() => import('./pages/matchs/MatchFeuille'));

const StatistiquesPage = lazy(() => import('./pages/statistiques/StatistiquesPage'));

const ActualitesList = lazy(() => import('./pages/actualites/ActualitesList'));
const ActualiteForm = lazy(() => import('./pages/actualites/ActualiteForm'));
const ActualiteDetail = lazy(() => import('./pages/actualites/ActualiteDetail'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Chargement...</div>}>
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
                  
                  {/* Actualités */}
                  <Route path="/actualites" element={<ActualitesList />} />
                  <Route path="/actualites/nouvelle" element={<ActualiteForm />} />
                  <Route path="/actualites/:slug" element={<ActualiteDetail />} />
                  <Route path="/actualites/:id/editer" element={<ActualiteForm />} />
                  
                </Route>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
