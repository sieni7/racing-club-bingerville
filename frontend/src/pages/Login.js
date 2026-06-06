import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});
export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        try {
            await signIn(data.email, data.password);
            navigate('/dashboard');
        }
        catch (error) {
            setError('root', { message: error.message || 'Erreur de connexion' });
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "max-w-md w-full p-8 bg-white rounded-lg shadow-md", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Connexion" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(Input, { label: "Email", type: "email", ...register('email'), error: errors.email?.message }), _jsx(Input, { label: "Mot de passe", type: "password", ...register('password'), error: errors.password?.message }), errors.root && _jsx("p", { className: "text-red-600 text-sm mb-4", children: errors.root.message }), _jsx(Button, { type: "submit", isLoading: isSubmitting, className: "w-full", children: "Se connecter" })] }), _jsxs("p", { className: "text-center text-sm text-gray-600 mt-4", children: ["Pas encore de compte ? ", _jsx(Link, { to: "/register", className: "text-blue-600 hover:underline", children: "S'inscrire" })] })] }) }));
}
