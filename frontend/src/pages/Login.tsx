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

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError('root', { message: error.message || 'Erreur de connexion' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Mot de passe" type="password" {...register('password')} error={errors.password?.message} />
          {errors.root && <p className="text-red-600 text-sm mb-4">{errors.root.message}</p>}
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Se connecter
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Pas encore de compte ? <Link to="/register" className="text-blue-600 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
