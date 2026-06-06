import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});
export default function Register() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const onSubmit = async (data) => {
        try {
            await signUp(data.email, data.password, {});
            navigate('/dashboard');
        }
        catch (error) {
            setError('root', { message: error.message || 'Erreur d\'inscription' });
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "max-w-md w-full p-8 bg-white rounded-lg shadow-md", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Inscription" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(Input, { label: "Email", type: "email", ...register('email'), error: errors.email?.message }), _jsx(Input, { label: "Mot de passe", type: "password", ...register('password'), error: errors.password?.message }), _jsx(Input, { label: "Confirmer le mot de passe", type: "password", ...register('confirmPassword'), error: errors.confirmPassword?.message }), errors.root && _jsx("p", { className: "text-red-600 text-sm mb-4", children: errors.root.message }), _jsx(Button, { type: "submit", isLoading: isSubmitting, className: "w-full", children: "S'inscrire" })] }), _jsxs("p", { className: "text-center text-sm text-gray-600 mt-4", children: ["D\u00E9j\u00E0 un compte ? ", _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: "Se connecter" })] })] }) }));
}
