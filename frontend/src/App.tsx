import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandCenter } from './components/layout/CommandCenter';
import { OnboardingModal } from './components/common/OnboardingModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { CookieConsent } from './components/common/CookieConsent';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';

import { MemberLayout } from './components/layout/MemberLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHomepage } from './pages/admin/AdminHomepage';
import { AdminActualites } from './pages/admin/AdminActualites';
import { AdminJoueurs } from './pages/admin/AdminJoueurs';

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

const GuidePage = lazy(() => import('./pages/GuidePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <CommandCenter />
    <OnboardingModal />
    <WhatsAppButton />
    <CookieConsent />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
            <Routes>
              {/* Routes PUBLIQUES (accessibles sans connexion) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/matchs" element={<MatchsList />} />
                <Route path="/matchs/calendrier" element={<MatchsCalendar />} />
                <Route path="/statistiques" element={<StatistiquesPage />} />
                <Route path="/actualites" element={<ActualitesList />} />
                <Route path="/actualites/:slug" element={<ActualiteDetail />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Routes PRIVÉES (authentification requise) via MemberLayout */}
              <Route element={<MemberLayout />}>
                <Route element={<PrivateRoute />}>
                  {/* Membre */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/joueurs" element={<JoueursList />} />
                  <Route path="/joueurs/nouveau" element={<JoueurForm />} />
                  <Route path="/joueurs/:id" element={<JoueurDetail />} />
                  <Route path="/joueurs/:id/editer" element={<JoueurForm />} />
                  
                  <Route path="/matchs/nouveau" element={<MatchForm />} />
                  <Route path="/matchs/:id/editer" element={<MatchForm />} />
                  <Route path="/matchs/:id/feuille" element={<MatchFeuille />} />
                  
                  <Route path="/actualites/nouvelle" element={<ActualiteForm />} />
                  <Route path="/actualites/:id/editer" element={<ActualiteForm />} />
                  
                  <Route path="/parametres" element={<SettingsPage />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route element={<PrivateRoute requiredRole={['ADMIN', 'SUPER_ADMIN']} />}>
                  <Route path="/admin">
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="homepage" element={<AdminHomepage />} />
                    <Route path="actualites" element={<AdminActualites />} />
                    <Route path="joueurs" element={<AdminJoueurs />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

