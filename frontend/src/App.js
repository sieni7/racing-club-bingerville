import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import ActualitesList from './pages/actualites/ActualitesList';
import ActualiteForm from './pages/actualites/ActualiteForm';
import ActualiteDetail from './pages/actualites/ActualiteDetail';
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Header, {}), _jsx("main", { className: "flex-grow", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { element: _jsx(PrivateRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/joueurs", element: _jsx(JoueursList, {}) }), _jsx(Route, { path: "/joueurs/nouveau", element: _jsx(JoueurForm, {}) }), _jsx(Route, { path: "/joueurs/:id", element: _jsx(JoueurDetail, {}) }), _jsx(Route, { path: "/joueurs/:id/editer", element: _jsx(JoueurForm, {}) }), _jsx(Route, { path: "/matchs", element: _jsx(MatchsList, {}) }), _jsx(Route, { path: "/matchs/calendrier", element: _jsx(MatchsCalendar, {}) }), _jsx(Route, { path: "/matchs/nouveau", element: _jsx(MatchForm, {}) }), _jsx(Route, { path: "/matchs/:id/editer", element: _jsx(MatchForm, {}) }), _jsx(Route, { path: "/matchs/:id/feuille", element: _jsx(MatchFeuille, {}) }), _jsx(Route, { path: "/statistiques", element: _jsx(StatistiquesPage, {}) }), _jsx(Route, { path: "/actualites", element: _jsx(ActualitesList, {}) }), _jsx(Route, { path: "/actualites/nouvelle", element: _jsx(ActualiteForm, {}) }), _jsx(Route, { path: "/actualites/:slug", element: _jsx(ActualiteDetail, {}) }), _jsx(Route, { path: "/actualites/:id/editer", element: _jsx(ActualiteForm, {}) })] }), _jsx(Route, { path: "/", element: _jsx(Dashboard, {}) })] }) }), _jsx(Footer, {})] }) }) }));
}
export default App;
