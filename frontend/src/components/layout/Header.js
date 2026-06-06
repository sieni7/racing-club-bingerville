import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
export const Header = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };
    return (_jsx("header", { className: "bg-blue-900 text-white shadow-lg", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx(Link, { to: "/", className: "text-2xl font-bold", children: "Racing Club Bingerville" }), _jsxs("nav", { className: "hidden md:flex space-x-6", children: [_jsx(Link, { to: "/dashboard", className: "hover:text-blue-200", children: "Dashboard" }), _jsx(Link, { to: "/joueurs", className: "hover:text-blue-200", children: "Joueurs" }), _jsx(Link, { to: "/matchs", className: "hover:text-blue-200", children: "Matchs" }), _jsx(Link, { to: "/statistiques", className: "hover:text-blue-200", children: "Statistiques" }), _jsx(Link, { to: "/actualites", className: "hover:text-blue-200", children: "Actualit\u00E9s" })] }), user ? (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "text-sm", children: user.email }), _jsx(Button, { variant: "secondary", onClick: handleLogout, children: "D\u00E9connexion" })] })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsx(Link, { to: "/login", children: _jsx(Button, { variant: "secondary", children: "Connexion" }) }), _jsx(Link, { to: "/register", children: _jsx(Button, { variant: "primary", children: "Inscription" }) })] }))] }) }));
};
