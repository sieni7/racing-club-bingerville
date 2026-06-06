import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
export const PrivateRoute = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return _jsx("div", { className: "flex justify-center items-center h-screen", children: "Chargement..." });
    }
    return user ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/login", replace: true });
};
