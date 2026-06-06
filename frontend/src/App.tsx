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
                <Route path="/joueurs" element={<JoueursList />} />
                <Route path="/joueurs/nouveau" element={<JoueurForm />} />
                <Route path="/joueurs/:id" element={<JoueurDetail />} />
                <Route path="/joueurs/:id/editer" element={<JoueurForm />} />
                <Route path="/matchs" element={<div>Matchs - à venir</div>} />
                <Route path="/statistiques" element={<div>Statistiques - à venir</div>} />
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
