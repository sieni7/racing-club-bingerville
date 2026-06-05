import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header, Footer } from './components/Layout';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Joueurs from './pages/Joueurs';
import JoueurDetail from './pages/JoueurDetail';
import Calendrier from './pages/Calendrier';
import MatchDetail from './pages/MatchDetail';
import Statistiques from './pages/Statistiques';
import Actualites from './pages/Actualites';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={
                <div>
                  <h1 className="text-3xl font-bold text-blue-600 mb-4">Bienvenue au Racing Club Bingerville</h1>
                  <p>Le frontend est configuré avec succès !</p>
                </div>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/joueurs" element={<ProtectedRoute><Joueurs /></ProtectedRoute>} />
              <Route path="/joueurs/:id" element={<JoueurDetail />} />
              <Route path="/calendrier" element={<ProtectedRoute><Calendrier /></ProtectedRoute>} />
              <Route path="/matchs/:id" element={<ProtectedRoute><MatchDetail /></ProtectedRoute>} />
              <Route path="/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />
              <Route path="/actualites" element={<ProtectedRoute><Actualites /></ProtectedRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
